#!/usr/bin/env node
/**
 * Probe third-party http(s) links in Relay catalog markdown.
 *
 * Relay catalogs only (paradigm-threat-files, paradigm-threat-timeline, later
 * other Relay markdown repos). Not for paradigm-threat-site or non-Relay trees.
 *
 * Writes hooks/dead-urls.json per --root (confirmed dead). Probe state is
 * gitignored and shared under the files repo.
 *
 * Default: --write (JSON only; no git commit/push).
 *
 * crontab example:
 *   0 6 * * * /home/ari/dev/pt/paradigm-threat-files/scripts/check-dead-urls.daily.sh
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  applyProbeResult,
  extractHttpHrefs,
  isSkipHref,
  normalizeHttpHref,
  probeHref,
  SEEDED_DEAD,
  sortDeadMap,
  todayEastern,
  USER_AGENT,
} from './lib/dead-urls.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const filesRepoDefault = resolve(scriptDir, '..')

function log (...args) {
  process.stderr.write(args.map(String).join(' ') + '\n')
}
  const roots = []
  let write = true
  let concurrency = 8
  let timeoutMs = 12000
  let statePath = join(filesRepoDefault, 'hooks', 'dead-urls-state.json')
  let skipArchive = true
  let max = 0
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--root') {
      roots.push(resolve(argv[++i] || ''))
    } else if (a === '--no-write' || a === '--dry-run') {
      write = false
    } else if (a === '--write') {
      write = true
    } else if (a === '--concurrency') {
      concurrency = Math.max(1, parseInt(argv[++i], 10) || 8)
    } else if (a === '--timeout') {
      timeoutMs = Math.max(1000, parseInt(argv[++i], 10) || 12000)
    } else if (a === '--state') {
      statePath = resolve(argv[++i] || statePath)
    } else if (a === '--include-archive') {
      skipArchive = false
    } else if (a === '--max') {
      max = Math.max(0, parseInt(argv[++i], 10) || 0)
    } else if (a === '-h' || a === '--help') {
        log(`Usage: check-dead-urls.mjs [--root DIR]... [--write|--no-write]
  --root DIR         Relay catalog git root (repeatable). Default: this files repo.
  --write            Update JSON (default).
  --no-write         Probe and print; do not write files.
  --state FILE       Shared probe cache (default: files/hooks/dead-urls-state.json).
  --concurrency N    Parallel probes (default 8).
  --timeout MS       Per-request timeout (default 12000).
  --max N            Probe at most N unique URLs (debug).
  --include-archive  Also probe web.archive.org links.
`)
      process.exit(0)
    }
  }
  if (roots.length === 0) roots.push(filesRepoDefault)
  return { roots, write, concurrency, timeoutMs, statePath, skipArchive, max }
}

function readJsonObject (path) {
  if (!existsSync(path)) return {}
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'))
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  } catch {
    console.warn(`warn: could not parse ${path}; starting empty`)
  }
  return {}
}

function gitMarkdownFiles (root) {
  const out = execFileSync('git', ['ls-files', '*.md'], {
    cwd: root,
    encoding: 'utf8',
  })
  return out.split('\n').map((s) => s.trim()).filter(Boolean)
}

function collectFromRoot (root, skipArchive) {
  const files = gitMarkdownFiles(root)
  /** @type {Map<string, Set<string>>} key -> observed raw hrefs (unused; keyed by normalize) */
  const keys = new Set()
  for (const rel of files) {
    const abs = join(root, rel)
    if (!existsSync(abs)) continue
    let text = ''
    try {
      text = readFileSync(abs, 'utf8')
    } catch {
      continue
    }
    for (const href of extractHttpHrefs(text)) {
      if (isSkipHref(href, { skipArchive })) continue
      keys.add(normalizeHttpHref(href))
    }
  }
  return keys
}

function rootLabel (root) {
  return basename(root)
}

async function mapPool (items, limit, fn) {
  const ret = new Array(items.length)
  let i = 0
  async function worker () {
    while (i < items.length) {
      const idx = i++
      ret[idx] = await fn(items[idx], idx)
    }
  }
  const n = Math.min(limit, items.length)
  const workers = []
  for (let w = 0; w < n; w++) workers.push(worker())
  await Promise.all(workers)
  return ret
}

async function main () {
  const opts = parseArgs(process.argv.slice(2))
  const date = todayEastern()
  const perRootKeys = new Map()
  const union = new Map() // key -> roots[]

  for (const root of opts.roots) {
    const keys = collectFromRoot(root, opts.skipArchive)
    const label = rootLabel(root)
    perRootKeys.set(root, keys)
    for (const k of keys) {
      if (!union.has(k)) union.set(k, [])
      union.get(k).push(root)
    }
    log(`${label}: ${keys.size} third-party http(s) hrefs`)
  }

  for (const seed of SEEDED_DEAD) {
    if (!union.has(seed.key)) {
      union.set(seed.key, [...opts.roots])
      for (const root of opts.roots) {
        const set = perRootKeys.get(root)
        if (set) set.add(seed.key)
      }
    }
  }

  let keys = [...union.keys()].sort()
  if (opts.max > 0) keys = keys.slice(0, opts.max)
  log(`unique to probe: ${keys.length} (concurrency ${opts.concurrency})`)

  const state = readJsonObject(opts.statePath)
  const deadByRoot = new Map()
  for (const root of opts.roots) {
    deadByRoot.set(root, readJsonObject(join(root, 'hooks', 'dead-urls.json')))
  }

  const hostTail = new Map()
  const enqueueHost = (href, fn) => {
    let host = ''
    try {
      host = new URL(href).hostname.toLowerCase()
    } catch {
      host = href
    }
    const prev = hostTail.get(host) || Promise.resolve()
    const run = prev.then(
      () => new Promise((r) => setTimeout(r, 120)),
    ).then(fn)
    hostTail.set(host, run.catch(() => {}))
    return run
  }

  let gone = 0
  let live = 0
  let unsure = 0
  let promoted = 0
  let resurrected = 0
  let pending = 0
  let done = 0

  await mapPool(keys, opts.concurrency, async (key) => {
    const result = await enqueueHost(key, () =>
      probeHref(key, { timeoutMs: opts.timeoutMs, userAgent: USER_AGENT }),
    )
    if (result.class === 'gone') gone += 1
    else if (result.class === 'live') live += 1
    else unsure += 1
    const rootsForUrl = union.get(key) || opts.roots
    const delta = applyProbeResult({
      key,
      result,
      date,
      state,
      deadByRoot,
      rootsForUrl,
    })
    if (delta.promoted) promoted += 1
    if (delta.resurrected) resurrected += 1
    if (delta.pending) pending += 1
    done += 1
    if (done % 100 === 0 || done === keys.length) {
      log(`… ${done}/${keys.length} gone=${gone} live=${live} unsure=${unsure}`)
    }
    if (opts.write && done % 200 === 0) {
      mkdirSync(dirname(opts.statePath), { recursive: true })
      writeFileSync(opts.statePath, JSON.stringify(state, null, 2) + '\n')
    }
  })

  log('\nSummary')
  log(`  probed ${keys.length}  gone ${gone}  live ${live}  unsure ${unsure}`)
  log(`  promoted ${promoted}  resurrected ${resurrected}  still-pending ${pending}`)
  for (const root of opts.roots) {
    const dead = deadByRoot.get(root)
    const n = dead ? Object.keys(dead).length : 0
    log(`  ${rootLabel(root)} dead list: ${n}`)
  }

  if (!opts.write) {
    log('\n(--no-write; files unchanged)')
    return
  }

  mkdirSync(dirname(opts.statePath), { recursive: true })
  writeFileSync(opts.statePath, JSON.stringify(state, null, 2) + '\n')
  log(`wrote ${opts.statePath}`)

  for (const root of opts.roots) {
    const dest = join(root, 'hooks', 'dead-urls.json')
    mkdirSync(dirname(dest), { recursive: true })
    const dead = sortDeadMap(deadByRoot.get(root) || {})
    writeFileSync(dest, JSON.stringify(dead, null, 2) + '\n')
    log(`wrote ${dest}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * CleverScript tip hygiene: missing object keys throw (`Property 'x' not found`).
 * Catches the LiveChat `origin` class of bug before park-local / fleet.
 *
 * Rules:
 * 1. No member access of origin / chatOrigin on props (use propStr / propOr).
 * 2. hooks/client/native/*.js stubs (not *.host.js) must not use bare props./p. members.
 * 3. No bare === undefined / !== undefined in CleverScript tip sources (host JS exempt).
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const CLIENT = join(ROOT, 'hooks', 'client')

const ORIGIN_RE = /\b(?:props|p)\.(origin|chatOrigin)\b/
const UNDEF_RE = /(?:===|!==)\s*undefined\b/
const BARE_PROP_RE = /\b(?:props|p)\.([a-zA-Z_][a-zA-Z0-9_]*)\b/

/** Host / DOM glue — not CleverScript tip (may use modern JS + undefined). */
function isHostOrDomGlue(rel) {
  if (rel.endsWith('.host.js')) return true
  if (rel.includes('/native/park-host-common.js')) return true
  if (rel.endsWith('/navMenu.js')) return true
  if (rel.endsWith('/searchFormNav.js')) return true
  if (rel.endsWith('/flashbackNowShowing.js')) return true
  return false
}

function isNativeStub(rel) {
  if (isHostOrDomGlue(rel)) return false
  return (
    rel.includes('/native/') &&
    (rel.endsWith('.js') || rel.endsWith('.jsx')) &&
    !rel.endsWith('.host.js')
  )
}

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = join(dir, ent.name)
    if (ent.isDirectory()) {
      await walk(full, out)
    } else if (/\.(js|jsx)$/.test(ent.name)) {
      out.push(full)
    }
  }
  return out
}

function stripComments(src) {
  // Rough strip — enough to ignore // and /* */ noise for lint lines.
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/.*$/gm, '')
}

function checkFile(rel, src) {
  const issues = []
  const body = stripComments(src)
  const lines = body.split('\n')
  const host = isHostOrDomGlue(rel)
  const stub = isNativeStub(rel)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const n = i + 1
    if (!line.trim()) continue

    if (ORIGIN_RE.test(line)) {
      issues.push({
        line: n,
        msg: `bare ${line.match(ORIGIN_RE)[0]} — use propStr(props, 'origin'|'chatOrigin', '')`,
      })
    }

    if (!host && UNDEF_RE.test(line)) {
      issues.push({
        line: n,
        msg: 'bare undefined compare — CleverScript tip: use null checks or typeof x === \'undefined\'',
      })
    }

    if (stub && BARE_PROP_RE.test(line)) {
      // Allow propStr/propOr calls that pass the props object as first arg only via
      // member-free forms; any props.x / p.x in stubs is banned.
      issues.push({
        line: n,
        msg: `native stub bare prop member — use propStr/propOr (found ${line.match(BARE_PROP_RE)[0]})`,
      })
    }
  }
  return issues
}

const files = await walk(CLIENT)
let failed = 0
for (const full of files.sort()) {
  const rel = relative(ROOT, full).replace(/\\/g, '/')
  const src = await readFile(full, 'utf8')
  const issues = checkFile(rel, src)
  for (const iss of issues) {
    console.error(`${rel}:${iss.line}: ${iss.msg}`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\ncheck-unsafe-cs-props: ${failed} issue(s)`)
  process.exit(1)
}
console.log(`OK: unsafe CleverScript prop checks passed (${files.length} files)`)

/**
 * Dead-URL extract / normalize / classify / promote.
 * Node rules must match `@relay/path` `normalizeHttpHref` / `lookupHttpHref`.
 */

export const USER_AGENT =
  'paradigm-threat-files dead-url-checker/1.0 (+https://paradigmthreat.net/)'

export const PROMOTE_AFTER = 2

const MD_LINK_RE = /\[[^\]]*\]\((<)?(https?:\/\/[^)\s>]+)(>)?\)/gi
const AUTO_LINK_RE = /<(https?:\/\/[^>\s]+)>/gi
const HREF_RE = /\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/gi

/** Documented-dead hosts (skip two-run wait). */
export const SEEDED_DEAD = [
  {
    key: 'https://github.com/clevertree',
    reason: 'nxdomain',
    match: (u) => hostOf(u) === 'github.com' && pathStarts(u, '/clevertree'),
  },
  {
    key: 'https://clevertree.github.io',
    reason: 'nxdomain',
    match: (u) => hostOf(u) === 'clevertree.github.io',
  },
]

export function todayEastern (now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/**
 * Canonical http(s) href. Non-http(s) returned trimmed unchanged.
 * Lowercase scheme+host, drop fragment, drop :80/:443, drop trailing slash
 * except origin-only `https://host/`. Keep query. No http↔https, no www strip.
 */
export function normalizeHttpHref (href) {
  if (typeof href !== 'string') return ''
  const trimmed = href.trim()
  if (trimmed.length === 0) return ''
  const lower = trimmed.toLowerCase()
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) return trimmed
  try {
    const u = new URL(trimmed)
    const scheme = u.protocol.toLowerCase()
    const host = u.hostname.toLowerCase()
    let port = u.port
    if ((scheme === 'http:' && port === '80') || (scheme === 'https:' && port === '443')) {
      port = ''
    }
    let path = u.pathname || '/'
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
    const origin = port ? `${scheme}//${host}:${port}` : `${scheme}//${host}`
    if (path === '/' && u.search === '') return `${origin}/`
    return `${origin}${path}${u.search}`
  } catch {
    return trimmed
  }
}

export function hostOf (href) {
  try {
    return new URL(normalizeHttpHref(href) || href).hostname.toLowerCase()
  } catch {
    return ''
  }
}

function pathStarts (href, prefix) {
  try {
    const p = new URL(normalizeHttpHref(href) || href).pathname
    return p === prefix || p.startsWith(prefix + '/')
  } catch {
    return false
  }
}

export function isSkipHref (href, { skipArchive = true } = {}) {
  const n = normalizeHttpHref(href)
  if (!n.startsWith('http://') && !n.startsWith('https://')) return true
  const host = hostOf(n)
  if (!host) return true
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true
  if (host === 'paradigmthreat.net' || host.endsWith('.paradigmthreat.net')) return true
  if (skipArchive && (host === 'web.archive.org' || host === 'archive.org')) return true
  return false
}

export function documentedDeadReason (href) {
  const n = normalizeHttpHref(href)
  for (const seed of SEEDED_DEAD) {
    if (seed.match(n) || n === seed.key) return seed.reason
  }
  return null
}

export function extractHttpHrefs (markdown) {
  if (typeof markdown !== 'string' || markdown.length === 0) return []
  const found = []
  const seen = new Set()
  const push = (raw) => {
    if (typeof raw !== 'string') return
    let href = raw.trim()
    if (href.startsWith('<') && href.endsWith('>')) href = href.slice(1, -1)
    if (!href.startsWith('http://') && !href.startsWith('https://')) return
    if (seen.has(href)) return
    seen.add(href)
    found.push(href)
  }
  let m
  MD_LINK_RE.lastIndex = 0
  while ((m = MD_LINK_RE.exec(markdown)) !== null) push(m[2])
  AUTO_LINK_RE.lastIndex = 0
  while ((m = AUTO_LINK_RE.exec(markdown)) !== null) push(m[1])
  HREF_RE.lastIndex = 0
  while ((m = HREF_RE.exec(markdown)) !== null) push(m[1])
  return found
}

/**
 * @typedef {'gone' | 'unsure' | 'live'} UrlClass
 * @typedef {{ class: UrlClass, reason: string, status: number | null }} ClassifyResult
 */

export function classifyProbeError (err) {
  const code = err && (err.code || err.cause?.code || err.cause?.errno)
  const name = err && err.name
  const msg = String(err && err.message ? err.message : err || '')
  if (code === 'ENOTFOUND' || code === 'EAI_NODATA' || /ENOTFOUND|getaddrinfo/i.test(msg)) {
    return { class: 'gone', reason: 'nxdomain', status: null }
  }
  if (name === 'AbortError' || code === 'ETIMEDOUT' || code === 'ABORT_ERR') {
    return { class: 'unsure', reason: 'timeout', status: null }
  }
  if (code === 'ECONNRESET' || code === 'ECONNREFUSED' || code === 'EPIPE' || code === 'EAI_AGAIN') {
    return { class: 'unsure', reason: 'connect', status: null }
  }
  if (/certificate|SSL|TLS|CERT_/i.test(msg)) {
    return { class: 'unsure', reason: 'tls', status: null }
  }
  return { class: 'unsure', reason: 'error', status: null }
}

export function classifyHttpStatus (status) {
  const s = Number(status)
  if (s === 404) return { class: 'gone', reason: 'http_404', status: 404 }
  if (s === 410) return { class: 'gone', reason: 'http_410', status: 410 }
  if (s >= 200 && s < 400) return { class: 'live', reason: 'http_' + s, status: s }
  if (s === 401 || s === 403 || s === 451 || s === 429) {
    return { class: 'unsure', reason: 'http_' + s, status: s }
  }
  if (s >= 500 && s < 600) return { class: 'unsure', reason: 'http_' + s, status: s }
  if (s === 405 || s === 501) return { class: 'unsure', reason: 'http_' + s, status: s }
  return { class: 'unsure', reason: 'http_' + s, status: s }
}

export async function probeHref (
  href,
  {
    fetchFn = fetch,
    timeoutMs = 12000,
    userAgent = USER_AGENT,
  } = {},
) {
  const documented = documentedDeadReason(href)
  if (documented) {
    return { class: 'gone', reason: documented, status: null }
  }

  const tryOnce = async (method) => {
    const ac = new AbortController()
    const t = setTimeout(() => ac.abort(), timeoutMs)
    try {
      const res = await fetchFn(href, {
        method,
        redirect: 'follow',
        signal: ac.signal,
        headers: {
          'user-agent': userAgent,
          accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
        },
      })
      return classifyHttpStatus(res.status)
    } finally {
      clearTimeout(t)
    }
  }

  try {
    const head = await tryOnce('HEAD')
    if (head.class === 'gone' || head.class === 'live') return head
    try {
      return await tryOnce('GET')
    } catch (e2) {
      return classifyProbeError(e2)
    }
  } catch (e) {
    const first = classifyProbeError(e)
    if (first.class === 'gone') return first
    try {
      return await tryOnce('GET')
    } catch (e2) {
      return classifyProbeError(e2)
    }
  }
}

/**
 * Apply one probe result to state + per-root dead maps.
 * @returns {{ promoted: boolean, resurrected: boolean, pending: boolean }}
 */
export function applyProbeResult ({
  key,
  result,
  date,
  state,
  deadByRoot,
  rootsForUrl,
  promoteAfter = PROMOTE_AFTER,
}) {
  const prev = state[key] && typeof state[key] === 'object' ? state[key] : {}
  let consecutiveGone = Number(prev.consecutiveGone) || 0
  if (result.class === 'gone') consecutiveGone += 1
  else consecutiveGone = 0

  state[key] = {
    lastClass: result.class,
    reason: result.reason,
    status: result.status,
    consecutiveGone,
    lastChecked: date,
  }

  const out = { promoted: false, resurrected: false, pending: false }
  const seed = documentedDeadReason(key)

  if (result.class === 'live') {
    for (const root of rootsForUrl) {
      const dead = deadByRoot.get(root)
      if (dead && Object.prototype.hasOwnProperty.call(dead, key)) {
        delete dead[key]
        out.resurrected = true
      }
    }
    return out
  }

  const shouldPromote =
    Boolean(seed) || (result.class === 'gone' && consecutiveGone >= promoteAfter)

  if (shouldPromote) {
    for (const root of rootsForUrl) {
      const dead = deadByRoot.get(root)
      if (!dead) continue
      const prevDead = dead[key] && typeof dead[key] === 'object' ? dead[key] : {}
      dead[key] = {
        status: result.status,
        reason: result.reason,
        firstConfirmed: prevDead.firstConfirmed || date,
        lastChecked: date,
      }
    }
    out.promoted = true
    return out
  }

  if (result.class === 'gone' || result.class === 'unsure') out.pending = true
  return out
}

export function sortDeadMap (dead) {
  const keys = Object.keys(dead).sort()
  const out = {}
  for (const k of keys) out[k] = dead[k]
  return out
}

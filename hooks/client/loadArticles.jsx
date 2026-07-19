import manifest from '@hooks'
import { parseNavIndexTxt } from '@relay/catalog'
import { take } from '@relay/util'
import { cachedGet } from '@relay/ui'

function clientBase() {
  try {
    if (typeof manifest.relayClientBaseUrl === 'string') {
      let b = manifest.relayClientBaseUrl
      while (b.length > 0 && b.charAt(b.length - 1) === '/') {
        b = b.slice(0, b.length - 1)
      }
      return b
    }
  } catch (e) {}
  return ''
}

/** Match SSR HTML href rewriting (`asset_base_url` + relative path). */
export function siteHref(path) {
  let p = ''
  if (typeof path === 'string') p = path
  if (p.length === 0) p = '/'
  if (p.charAt(0) === '#' || p.indexOf('mailto:') === 0 || p.indexOf('tel:') === 0) {
    return p
  }
  if (p.indexOf('://') >= 0) return p
  while (p.length > 0 && p.charAt(0) === '/') {
    p = p.slice(1)
  }
  const base = clientBase()
  if (base.length === 0) return '/' + p
  if (p.length === 0) return base + '/'
  return base + '/' + p
}

export function rowPath(row) {
  if (!row) return ''
  try {
    if (row.path && typeof row.path === 'string') return row.path
  } catch (e) {}
  return ''
}

export function rowTitle(row) {
  if (!row) return 'Untitled'
  try {
    if (row._title && typeof row._title === 'string') return row._title
  } catch (e) {}
  try {
    if (row.title && typeof row.title === 'string') return row.title
  } catch (e) {}
  const p = rowPath(row)
  if (p.length > 0) return p
  return 'Untitled'
}

export function rowUpdated(row) {
  if (!row) return ''
  try {
    if (row._updated && typeof row._updated === 'string') return row._updated
  } catch (e) {}
  return ''
}

/**
 * Article index for Index / Home / ChangeLog / DirNav.
 * Host `cachedGet` + `parseNavIndexTxt` share a request-local tip cache on SSR.
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit
  const base = clientBase()
  const navUrl = base.length > 0 ? base + '/nav-index.txt' : '/nav-index.txt'
  const text = cachedGet(navUrl)
  let rows = parseNavIndexTxt(text)
  if (rows && rows.length > 0) return take(rows, lim)
  // Fallback: JSON index when TSV missing (rare).
  const jsonUrl = base.length > 0 ? base + '/nav-index.json' : '/nav-index.json'
  const raw = cachedGet(jsonUrl)
  if (!raw || raw.length === 0) return []
  try {
    const data = JSON.parse(raw)
    if (!data || !data.articles) return []
    let out = []
    for (let i = 0; i < data.articles.length; i++) {
      const a = data.articles[i]
      let path = ''
      try {
        if (a.path) path = a.path
      } catch (e) {}
      if (path.length < 4) continue
      if (path.slice(path.length - 3).toLowerCase() !== '.md') continue
      let title = path
      try {
        if (a.title) title = a.title
      } catch (e2) {}
      out = out.concat([{ path: path, title: title, content_kind: 'article' }])
    }
    return take(out, lim)
  } catch (e3) {
    return []
  }
}

export function featuredArticlePath(rows) {
  for (let i = 0; i < rows.length; i++) {
    const p = rowPath(rows[i])
    if (p.indexOf('blog/') === 0) return p
  }
  for (let j = 0; j < rows.length; j++) {
    const p2 = rowPath(rows[j])
    if (p2 !== 'README.md' && p2.length > 0) return p2
  }
  return ''
}

/** Paths eligible for I'm Feeling Lucky (files park — markdown articles only). */
export function isFeelingLuckyCandidate(path) {
  if (!path || typeof path !== 'string') return false
  if (path.length < 4) return false
  const lower = path.toLowerCase()
  if (lower.slice(lower.length - 3) !== '.md') return false
  if (lower.indexOf('.auto.md') >= 0) return false
  if (path === 'README.md' || path === 'page.md') return false
  return true
}

/**
 * Pick a rotating article path from nav-index.
 * Avoids Date/Math.random and bitwise ops (unsupported in CleverScript / WASM).
 */
export function pickFeelingLuckyPath() {
  const rows = loadArticleRows(200)
  let candidates = []
  for (let i = 0; i < rows.length; i++) {
    const p = rowPath(rows[i])
    if (isFeelingLuckyCandidate(p)) {
      candidates = candidates.concat([p])
    }
  }
  if (candidates.length === 0) return ''
  let idx = 0
  try {
    const g = globalThis
    let sum = 0
    if (g && g.location && typeof g.location.pathname === 'string') {
      sum = g.location.pathname.length
    }
    if (g && g.performance && typeof g.performance.now === 'function') {
      const n = g.performance.now()
      if (typeof n === 'number') sum = sum + n
    }
    idx = sum % candidates.length
  } catch (e) {
    idx = 0
  }
  if (idx < 0) idx = 0
  if (idx >= candidates.length) idx = 0
  return candidates[idx]
}

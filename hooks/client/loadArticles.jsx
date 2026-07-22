import manifest from '@hooks'
import { loadNavIndex, pickFeelingLuckyPath as hostPickLucky } from '@relay/catalog'
import { siteHref as hostSiteHref } from '@relay/path'

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
  return hostSiteHref(clientBase(), path)
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
 * Host `loadNavIndex` uses request-local tip cache (same as cachedGet + parseNavIndexTxt).
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit
  try {
    const rows = loadNavIndex(lim)
    if (rows && rows.length > 0) return rows
  } catch (e) {}
  return []
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

/**
 * Pick a rotating article path from nav-index (host pick + tip seed).
 */
export function pickFeelingLuckyPath() {
  const rows = loadArticleRows(200)
  let seed = 0
  try {
    const g = globalThis
    if (g && g.location && typeof g.location.pathname === 'string') {
      seed = g.location.pathname.length
    }
    if (g && g.performance && typeof g.performance.now === 'function') {
      const n = g.performance.now()
      if (typeof n === 'number') seed = seed + n
    }
  } catch (e) {
    seed = 0
  }
  return hostPickLucky(rows, seed)
}

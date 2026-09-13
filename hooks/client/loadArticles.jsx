import manifest from '@hooks'
import { pickFeelingLuckyPath as hostPickLucky } from '@relay/catalog'
import { siteHref as hostSiteHref } from '@relay/path'
import { take } from '@relay/util'
import { parseJson, queryIndexBody } from 'hooks/client/jsonUtil.jsx'

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

export function rowKind(row) {
  if (!row) return ''
  try {
    if (row.content_kind && typeof row.content_kind === 'string') return row.content_kind
  } catch (e) {}
  return ''
}

export function rowPublished(row) {
  if (!row) return ''
  try {
    if (row._originalPublishedAt && typeof row._originalPublishedAt === 'string') {
      return row._originalPublishedAt
    }
  } catch (e) {}
  return ''
}

export function rowImageSrc(row) {
  if (!row) return ''
  try {
    if (row.image_src && typeof row.image_src === 'string') return row.image_src
  } catch (e) {}
  return ''
}

/**
 * Park ChangeLog `<img src>` — same-Host relative + optional `?w=160` (Vercel parity).
 * Keeps `/site/*` chrome assets untouched; skips width for SVG.
 */
export function changelogThumbSrc(src) {
  if (!src || typeof src !== 'string') return ''
  let s = src.trim()
  if (s.length === 0) return ''
  if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0) return s
  if (s.charAt(0) !== '/') s = '/' + s
  const q = s.indexOf('?')
  let pathOnly = s
  if (q >= 0) pathOnly = s.slice(0, q)
  if (pathOnly.indexOf('/site/') === 0) return pathOnly
  if (q >= 0) return s
  let ext = ''
  let i = pathOnly.length - 1
  while (i >= 0) {
    const c = pathOnly.charAt(i)
    if (c === '.') {
      ext = pathOnly.slice(i + 1)
      break
    }
    if (c === '/') break
    i = i - 1
  }
  if (ext === 'svg' || ext === 'SVG') return pathOnly
  return pathOnly + '?w=160'
}

const KIND_ARTICLE_INV_BLOG = ['article', 'investigation', 'blog']
const DIR_QUERY = { content_kind: { $ne: 'exclude' } }

let dirRowsWarm = null
let articlesRowsWarm = null
let investigationsRowsWarm = null
let blogRowsWarm = null
let recentRowsWarm = null
let luckyRowsWarm = null
let homeRowsWarm = null

function fetchIndexQuery(query, order, limit) {
  let resp = null
  try {
    // Quoted header keys — CleverScript can drop bare `Accept` identifiers.
    resp = fetch('/', {
      method: 'QUERY',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: queryIndexBody(query, limit, order),
    })
  } catch (e) {
    return []
  }
  if (!resp || resp.ok !== true) return []
  let text = resp.text ? resp.text : ''
  if (text.length === 0) return []
  // Park QUERY defaults to CSV when Accept is missing; refuse non-JSON bodies.
  const trimmed = text.charAt(0) === '\uFEFF' ? text.slice(1) : text
  if (trimmed.charAt(0) !== '{' && trimmed.charAt(0) !== '[') {
    return []
  }
  const data = parseJson(text)
  if (!data || !data.results) return []
  let rows = []
  for (let i = 0; i < data.results.length; i++) {
    const row = data.results[i]
    let path = ''
    try {
      if (row.path && typeof row.path === 'string') path = row.path
    } catch (e) {}
    if (path.length === 0) continue
    rows = rows.concat([row])
  }
  return rows
}

function takeRows(rows, limit) {
  if (!rows) return []
  if (typeof limit !== 'number' || limit <= 0) return rows
  return take(rows, limit)
}

/**
 * Path-ordered catalog rows (`content_kind ≠ exclude`). Shared by DirNav, neighbors, AutoIndex.
 * Warm only successful non-empty results so a failed first tick can retry.
 */
export function loadDirCatalogRows() {
  if (dirRowsWarm !== null && dirRowsWarm.length > 0) return dirRowsWarm
  const rows = fetchIndexQuery(DIR_QUERY, 'path', 10000)
  if (rows.length > 0) {
    dirRowsWarm = rows
  }
  return rows
}

/**
 * Recency QUERY for Index / Home lists. Server order is `-_updated`.
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit
  if (homeRowsWarm === null) {
    homeRowsWarm = fetchIndexQuery(
      { content_kind: KIND_ARTICLE_INV_BLOG },
      '-_updated',
      80,
    )
  }
  return takeRows(homeRowsWarm, lim)
}

/** ChangeLog tab QUERY: kind filter + `-_updated` + limit 8. */
export function loadCatalogKind(kind) {
  if (kind === 'article') {
    if (articlesRowsWarm === null) {
      articlesRowsWarm = fetchIndexQuery({ content_kind: 'article' }, '-_updated', 8)
    }
    return articlesRowsWarm
  }
  if (kind === 'investigation') {
    if (investigationsRowsWarm === null) {
      investigationsRowsWarm = fetchIndexQuery(
        { content_kind: 'investigation' },
        '-_updated',
        8,
      )
    }
    return investigationsRowsWarm
  }
  if (kind === 'blog') {
    if (blogRowsWarm === null) {
      blogRowsWarm = fetchIndexQuery({ content_kind: 'blog' }, '-_updated', 8)
    }
    return blogRowsWarm
  }
  if (kind === 'recent') {
    if (recentRowsWarm === null) {
      recentRowsWarm = fetchIndexQuery(
        { content_kind: KIND_ARTICLE_INV_BLOG },
        '-_updated',
        8,
      )
    }
    return recentRowsWarm
  }
  return []
}

/** Feeling Lucky: `order=random` candidate set (one QUERY per session). */
export function loadLuckyRows() {
  if (luckyRowsWarm !== null) return luckyRowsWarm
  luckyRowsWarm = fetchIndexQuery(
    { content_kind: KIND_ARTICLE_INV_BLOG },
    'random',
    40,
  )
  return luckyRowsWarm
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
 * Pick a rotating article path from the warmed random QUERY set.
 */
export function pickFeelingLuckyPath() {
  const rows = loadLuckyRows()
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

import manifest from '@hooks'
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

function contentKind(row) {
  try {
    if (row.content_kind && typeof row.content_kind === 'string') return row.content_kind
  } catch (e) {}
  return ''
}

/** Keep browsable markdown articles; drop excludes / manifests. */
export function isArticleRow(row) {
  const path = rowPath(row)
  if (path.length === 0) return false
  if (path === 'assets.manifest.json') return false
  if (path.indexOf('.github/') === 0) return false
  const kind = contentKind(row)
  if (kind === 'exclude') return false
  const lower = path.toLowerCase()
  if (lower.length < 3) return false
  if (lower.slice(lower.length - 3) !== '.md') return false
  return true
}

function rowsFromPayload(data) {
  let out = []
  if (!data) return out
  let list = null
  try {
    if (data.articles && data.articles.length >= 0) list = data.articles
  } catch (e) {}
  try {
    if (!list && data.results && data.results.length >= 0) list = data.results
  } catch (e2) {}
  if (!list) return out
  for (let i = 0; i < list.length; i++) {
    if (isArticleRow(list[i])) out = out.concat([list[i]])
  }
  return out
}

function tryFetchJson(url, options) {
  try {
    const resp = fetch(url, options)
    if (!resp || resp.ok !== true) return null
    const text = resp.text ? resp.text : ''
    if (text.length === 0) return null
    return parseJson(text)
  } catch (e) {
    return null
  }
}

/**
 * Article index for Index / Home.
 *
 * Prefer committed nav-index.json (GET) so SSR and browser hydrate match.
 * Browser sync XHR historically dropped QUERY bodies / methods, which emptied
 * the client tree after a good SSR paint (hydrate mismatch).
 *
 * QUERY remains a fallback for environments where nav-index is missing.
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit
  const base = clientBase()
  const navUrl = base.length > 0 ? base + '/nav-index.json' : '/nav-index.json'
  const nav = tryFetchJson(navUrl, { method: 'GET' })
  const fromNav = rowsFromPayload(nav)
  if (fromNav.length > 0) {
    if (fromNav.length > lim) {
      let clipped = []
      for (let i = 0; i < lim; i++) {
        clipped = clipped.concat([fromNav[i]])
      }
      return clipped
    }
    return fromNav
  }

  const queryUrl = base.length > 0 ? base + '/' : '/'
  const queried = tryFetchJson(queryUrl, {
    method: 'QUERY',
    body: queryIndexBody('', lim, ''),
  })
  return rowsFromPayload(queried)
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

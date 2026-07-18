import manifest from '@hooks'
import { parseJson, queryIndexBody } from 'hooks/client/jsonUtil.jsx'

function str(v) {
  if (v === null) return ''
  if (typeof v === 'boolean') {
    if (v) return 'true'
    return 'false'
  }
  if (typeof v === 'number') return '' + v
  if (typeof v === 'string') return v
  return ''
}

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
  const out = []
  if (!data) return out
  let list = null
  try {
    if (data.results && data.results.length >= 0) list = data.results
  } catch (e) {}
  try {
    if (!list && data.articles && data.articles.length >= 0) list = data.articles
  } catch (e2) {}
  if (!list) return out
  for (let i = 0; i < list.length; i++) {
    if (isArticleRow(list[i])) out = out.concat([list[i]])
  }
  return out
}

/**
 * Same-repo article index. Prefers QUERY JSON (SSR host supports QUERY);
 * falls back to committed nav-index.json via GET.
 * Uses absolute URLs (relayClientBaseUrl) — same as ArticleView — so SSR
 * RepoFetchHost resolves paths reliably.
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit
  const base = clientBase()

  // Relative root works for SSR QUERY; absolute also maps via asset_base_url.
  const queryUrl = base.length > 0 ? base + '/' : '/'
  const resp = fetch(queryUrl, {
    method: 'QUERY',
    body: queryIndexBody('', lim, ''),
  })
  if (resp && resp.ok === true) {
    const text = resp.text ? resp.text : ''
    if (text.length > 0) {
      const data = parseJson(text)
      const out = rowsFromPayload(data)
      if (out.length > 0) return out
    }
  }

  const navUrl = base.length > 0 ? base + '/nav-index.json' : '/nav-index.json'
  const fallback = fetch(navUrl, { method: 'GET' })
  if (fallback && fallback.ok === true) {
    const text = fallback.text ? fallback.text : ''
    if (text.length > 0) {
      const data = parseJson(text)
      const out = rowsFromPayload(data)
      if (out.length > 0) return out
    }
  }
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

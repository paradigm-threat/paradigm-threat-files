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

/**
 * Same-repo article index. Prefers QUERY JSON (SSR host supports QUERY);
 * falls back to committed nav-index.json via GET.
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit

  const resp = fetch('/', {
    method: 'QUERY',
    headers: {
      Accept: 'application/json',
    },
    body: queryIndexBody('', lim, ''),
  })
  if (resp && resp.ok === true) {
    const text = resp.text ? resp.text : ''
    if (text.length > 0) {
      const data = parseJson(text)
      if (data && data.results && data.results.length >= 0) {
        const out = []
        for (let i = 0; i < data.results.length; i++) {
          if (isArticleRow(data.results[i])) out.push(data.results[i])
        }
        if (out.length > 0) return out
      }
    }
  }

  const fallback = fetch('/nav-index.json', { method: 'GET' })
  if (fallback && fallback.ok === true) {
    const text = fallback.text ? fallback.text : ''
    const data = parseJson(text)
    if (data && data.articles && data.articles.length > 0) {
      return data.articles
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

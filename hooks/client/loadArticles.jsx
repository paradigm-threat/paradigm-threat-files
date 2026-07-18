import manifest from '@hooks'

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

function tryGetText(url) {
  try {
    const resp = fetch(url, { method: 'GET' })
    if (!resp || resp.ok !== true) return ''
    return resp.text ? resp.text : ''
  } catch (e) {
    return ''
  }
}

/** Parse `path\\ttitle` lines — no JSON.parse (missing in some CS module envs). */
function rowsFromNavText(text) {
  let out = []
  if (!text || text.length === 0) return out
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (!line || line.length === 0) continue
    const tab = line.indexOf('\t')
    let path = line
    let title = line
    if (tab >= 0) {
      path = line.slice(0, tab)
      title = line.slice(tab + 1)
    }
    if (path.length < 4) continue
    if (path.slice(path.length - 3).toLowerCase() !== '.md') continue
    out = out.concat([{ path: path, title: title, content_kind: 'article' }])
  }
  return out
}

/**
 * Article index for Index / Home.
 * Prefer nav-index.txt (TSV) so SSR + browser hydrate match without JSON.parse
 * or QUERY (browser sync XHR historically dropped QUERY bodies).
 */
export function loadArticleRows(limit) {
  let lim = 48
  if (typeof limit === 'number' && limit > 0) lim = limit
  const base = clientBase()
  const navUrl = base.length > 0 ? base + '/nav-index.txt' : '/nav-index.txt'
  let rows = rowsFromNavText(tryGetText(navUrl))
  if (rows.length === 0) {
    // Legacy JSON fallback when txt missing (requires JSON in module env).
    const jsonUrl = base.length > 0 ? base + '/nav-index.json' : '/nav-index.json'
    const raw = tryGetText(jsonUrl)
    if (raw.length > 0) {
      try {
        const data = JSON.parse(raw)
        if (data && data.articles) {
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
          rows = out
        }
      } catch (e3) {}
    }
  }
  if (rows.length > lim) {
    let clipped = []
    for (let i = 0; i < lim; i++) {
      clipped = clipped.concat([rows[i]])
    }
    return clipped
  }
  return rows
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

// WASM has no Date.now — bump a counter for rotating picks.
let luckySeq = 0

/**
 * Pick a rotating article path from nav-index.
 * Avoids Date/Math.random (unavailable or panicky under CleverScript WASM).
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
  luckySeq = luckySeq + 1
  let idx = luckySeq % candidates.length
  if (idx < 0) idx = 0
  if (idx >= candidates.length) idx = 0
  return candidates[idx]
}

/**
 * Share article TOC with the mobile nav drawer (old site: DynamicIndex mode=menu).
 * ArticleView publishes; Nav/DynamicIndex reads — no Dom scrape.
 */
let pageToc = { path: '', items: null }

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

function normPath(p) {
  let t = str(p).trim()
  if (t.length === 0) return ''
  if (t.charAt(0) === '/') t = t.slice(1)
  return t
}

export function setPageToc(path, items) {
  const p = normPath(path)
  let list = []
  if (items && typeof items.length === 'number') {
    list = items
  }
  pageToc = { path: p, items: list }
}

export function getPageToc(path) {
  const p = normPath(path)
  if (p.length === 0) return []
  if (pageToc.path !== p) return []
  if (!pageToc.items) return []
  return pageToc.items
}

export function clearPageToc() {
  pageToc = { path: '', items: null }
}

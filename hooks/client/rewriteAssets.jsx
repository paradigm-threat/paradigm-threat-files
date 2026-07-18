/**
 * Asset URL helpers for article markdown.
 * Strip tip float-title JSON after image URLs. Avoid CleverScript string
 * literals that are only a double-quote (form `'"'`).
 */

function stripMdLinkTitles(md) {
  if (!md || typeof md !== 'string') return ''
  let out = ''
  let pos = 0
  // space + single-quote + brace — written inside double quotes only
  const titleMark = " '{"
  while (pos < md.length) {
    const open = md.indexOf('](', pos)
    if (open < 0) {
      out = out + md.slice(pos)
      break
    }
    out = out + md.slice(pos, open + 2)
    const close = md.indexOf(')', open + 2)
    if (close < 0) {
      out = out + md.slice(open + 2)
      break
    }
    let inner = md.slice(open + 2, close)
    const cut = inner.indexOf(titleMark)
    if (cut >= 0) {
      inner = inner.slice(0, cut)
    }
    out = out + inner + ')'
    pos = close + 1
  }
  return out
}

export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = stripMdLinkTitles(md)
  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return s
}

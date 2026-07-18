/**
 * Asset URL helpers for article markdown.
 *
 * Prefer same-origin raster URLs (IPFS stubs + gateway cache). When Kubo is
 * down, operators seed /tmp/ipfs-cache from GitLab Pages
 * (scripts/seed-ipfs-cache-from-pages.sh).
 *
 * CleverScript: never write a string literal whose only character is `"`
 * (form `'"'`): it has corrupted SSR output in this tip.
 */

function replaceAllLiteral(text, needle, replacement) {
  if (!text || !needle || needle.length === 0) return text
  let out = ''
  let pos = 0
  const fl = needle.length
  while (pos < text.length) {
    const idx = text.indexOf(needle, pos)
    if (idx < 0) {
      out = out + text.slice(pos)
      break
    }
    out = out + text.slice(pos, idx)
    out = out + replacement
    pos = idx + fl
  }
  return out
}

function isQuoteChar(ch) {
  if (!ch || ch.length !== 1) return false
  // Extract quote chars from longer safe literals (not a lone '"').
  if (ch === "x'y".charAt(1)) return true
  if (ch === 'x"y'.charAt(1)) return true
  return false
}

/** Drop markdown link/image titles: ](url '…') / ](url "…") → ](url). */
function stripMdLinkTitles(md) {
  if (!md || typeof md !== 'string') return ''
  let out = ''
  let pos = 0
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
    let cut = -1
    for (let i = 0; i + 1 < inner.length; i++) {
      if (inner.charAt(i) !== ' ') continue
      if (isQuoteChar(inner.charAt(i + 1))) {
        cut = i
        break
      }
    }
    if (cut >= 0) inner = inner.slice(0, cut)
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

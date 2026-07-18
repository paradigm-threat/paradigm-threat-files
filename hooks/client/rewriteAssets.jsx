/**
 * Asset URL helpers for article markdown.
 *
 * Prefer same-origin raster URLs (IPFS stubs + gateway cache). When Kubo is
 * down, operators seed /tmp/ipfs-cache from GitLab Pages
 * (scripts/seed-ipfs-cache-from-pages.sh).
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

/** Soften ASCII double quotes inside ![alt] so md2ast keeps the image. */
function softenImageAltQuotes(md) {
  if (!md || typeof md !== 'string') return ''
  let out = ''
  let pos = 0
  while (pos < md.length) {
    const start = md.indexOf('![', pos)
    if (start < 0) {
      out = out + md.slice(pos)
      break
    }
    out = out + md.slice(pos, start)
    const mid = md.indexOf('](', start)
    if (mid < 0) {
      out = out + md.slice(start)
      break
    }
    let alt = md.slice(start + 2, mid)
    alt = replaceAllLiteral(alt, '"', "'")
    out = out + '![' + alt + ']('
    pos = mid + 2
  }
  return out
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
    const sp1 = inner.indexOf(" '")
    const sp2 = inner.indexOf(' "')
    if (sp1 >= 0) cut = sp1
    if (sp2 >= 0) {
      if (cut < 0 || sp2 < cut) cut = sp2
    }
    if (cut >= 0) inner = inner.slice(0, cut)
    out = out + inner + ')'
    pos = close + 1
  }
  return out
}

export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = softenImageAltQuotes(md)
  s = stripMdLinkTitles(s)

  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return s
}

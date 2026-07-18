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

export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = softenImageAltQuotes(md)

  // Drop float-title JSON (Next leftover).
  s = replaceAllLiteral(
    s,
    " '{" + '"className":"' + 'sm:float-right sm:ml-8 sm:mb-4 mb-8 clear-both"' + "}'",
    ''
  )

  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return s
}

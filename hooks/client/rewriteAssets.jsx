/**
 * Asset URL helpers for article markdown.
 *
 * Prefer same-origin raster URLs (IPFS stubs + gateway cache). When Kubo is
 * down, operators seed /tmp/ipfs-cache from GitLab Pages (see scripts/).
 * Absolute GitLab rewrites are avoided: md2ast drops images whose alts contain
 * ASCII double-quotes once the URL is https://…
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

/**
 * Keep relative tip paths. Optionally strip width hints so a cold IPFS miss
 * does not hit optimize-on-status-JSON (500). Cached rasters still resize via
 * gateway when ?w= remains.
 */
export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = md

  // Drop float-title JSON (Next leftover); harmless for relative URLs.
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

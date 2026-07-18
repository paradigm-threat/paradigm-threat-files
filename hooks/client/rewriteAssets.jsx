/**
 * Asset URL helpers for article markdown.
 * Pass-through for now — title stripping moved carefully after CleverScript
 * quote-literal corruption was observed in SSR.
 */

export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return md
}

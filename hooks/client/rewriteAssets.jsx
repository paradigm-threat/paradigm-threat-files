/**
 * Asset URL helpers for article markdown.
 * Relative rasters / embeds → same-origin tip paths (`/dir/file.jpg`).
 * Fat tip serves binaries via Relay GET; do not rewrite to GitLab Pages.
 *
 * Mirror sentinel `'/'`: `@relay/path.rewriteMarkdownAssetUrls` skips only on
 * empty mirror; `resolveAssetUrl` with `'/'` trims to empty and returns `/{rel}`.
 */
import { rewriteMarkdownAssetUrls as hostRewrite } from '@relay/path'

/** Same-origin tip assets (not a remote host). */
export const PT_PAGES_MIRROR = '/'

export function rewriteMarkdownAssetUrls(md, articleRel, mirrorBase) {
  let body = ''
  if (typeof md === 'string') body = md
  if (body.length === 0) return ''
  let art = ''
  if (typeof articleRel === 'string') art = articleRel
  let mirror = PT_PAGES_MIRROR
  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) mirror = mirrorBase
  return hostRewrite(body, art, mirror)
}

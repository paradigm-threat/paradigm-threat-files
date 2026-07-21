/**
 * Asset URL helpers for article markdown.
 * Relative rasters / embeds → GitLab Pages mirror (thin tip has no binaries).
 */
import { rewriteMarkdownAssetUrls as hostRewrite } from '@relay/path'

/** GitLab Pages binary mirror for thin park rasters / PDF embeds. */
export const PT_PAGES_MIRROR = 'https://paradigm-threat-files-69f9dc.gitlab.io'

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

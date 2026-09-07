/**
 * Home-page investigation fragment loader.
 * ArticleView appends this markdown into the home body at phase >= 3 (SSR stays slim).
 */
import React from 'react'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'

const MD_CACHE_BUST = 'ptmd7'
const HOME_SECTION_SRC = 'page-sections/investigations.md'

/** One parse per tip session per src. */
let deferredWarm = null

export function homeInvestigationsSrc() {
  return HOME_SECTION_SRC
}

export function loadDeferredMarkdown(src) {
  if (deferredWarm === null) deferredWarm = {}
  if (typeof deferredWarm[src] === 'string') return deferredWarm[src]
  try {
    const text = cachedGet('/' + src + '?v=' + MD_CACHE_BUST)
    if (typeof text === 'string' && text.length > 0) {
      const body = rewriteMarkdownAssetUrls(text, src)
      deferredWarm[src] = body
      return body
    }
  } catch (e) {}
  deferredWarm[src] = ''
  return ''
}

/** Optional MD tag stub — home uses ArticleView body append instead. */
export default function DeferredMarkdown() {
  return <span className="pt-md-stub" aria-hidden="true" data-pt-deferred-stub="1" />
}

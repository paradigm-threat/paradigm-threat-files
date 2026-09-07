/**
 * Deferred markdown fragment — SSR/pending shell only.
 *
 * Live content is built in ArticleView as a sibling MarkdownRenderer split at
 * phase ≥3. Nested MD / cachedGet inside the page MD override aborts the vnode
 * so soft-hydrate never swaps the SSR island.
 */
import React from 'react'
import { isClientLive, isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'

const MD_CACHE_BUST = 'ptmd8'

let deferredWarm = null

function clientBase() {
  try {
    if (typeof window === 'undefined') return ''
    const b = window.relayClientBaseUrl
    if (typeof b === 'string') return b
  } catch (e) {}
  return ''
}

function loadFragment(src) {
  if (deferredWarm === null) deferredWarm = {}
  if (typeof deferredWarm[src] === 'string') return deferredWarm[src]
  const rel = '/' + src + '?v=' + MD_CACHE_BUST
  try {
    const text = cachedGet(rel)
    if (typeof text === 'string' && text.length > 0) {
      const body = rewriteMarkdownAssetUrls(text, src)
      deferredWarm[src] = body
      return body
    }
  } catch (e) {}
  // Same CSR fallback as ArticleView.loadArticleMarkdown — cachedGet often
  // returns '' on first tick while the tip GET is in flight / not yet mapped.
  if (isClientLive() === true) {
    try {
      const baseStr = clientBase()
      const url = (baseStr.length > 0 ? baseStr : '') + rel
      const resp = fetch(url, { method: 'GET' })
      if (resp && resp.ok === true) {
        const text = resp.text ? resp.text : ''
        if (typeof text === 'string' && text.length > 0) {
          const body = rewriteMarkdownAssetUrls(text, src)
          deferredWarm[src] = body
          return body
        }
      }
    } catch (eFetch) {}
  }
  return ''
}

/** Warm tip cache outside MarkdownRenderer overrides (safe for cachedGet). */
export function prefetchDeferredMarkdown(src) {
  let s = src
  if (!s || typeof s !== 'string' || s.length === 0) {
    s = 'page-sections/investigations.md'
  }
  return loadFragment(s)
}

export function homeInvestigationsSrc() {
  return 'page-sections/investigations.md'
}

export function loadDeferredMarkdown(src) {
  return loadFragment(src)
}

/** SSR / pre-phase-3 shell. Phase ≥3 live island comes from ArticleView. */
export default function DeferredMarkdown(props) {
  if (isClientLivePhase(3) === true) {
    return (
      <section
        className="pt-deferred-md"
        aria-label="Deferred section"
        data-pt-deferred-pending="1"
        style={{ minHeight: '12rem' }}
      >
        <p className="pt-muted">Loading section…</p>
      </section>
    )
  }
  if (isCsrHost()) {
    return null
  }
  return (
    <section
      className="pt-deferred-md"
      aria-label="Deferred section"
      data-pt-deferred-ssr="1"
      style={{ minHeight: '12rem' }}
    >
      <p className="pt-muted">Loading section…</p>
    </section>
  )
}

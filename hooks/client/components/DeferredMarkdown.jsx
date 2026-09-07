/**
 * Deferred markdown fragment — SSR/pending shell only.
 *
 * Live content is built in ArticleView BEFORE the page MarkdownRenderer walk:
 * nested <MarkdownRenderer> (or cachedGet) inside this override aborts the
 * vnode, so soft-hydrate never swaps the SSR island.
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'

const MD_CACHE_BUST = 'ptmd8'

let deferredWarm = null

function loadFragment(src) {
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
  // Do NOT cache empty — tip fetch may still be in flight on first tick.
  return ''
}

/** Seed warm cache from a string already loaded by the caller (e.g. sync fetch). */
export function seedDeferredMarkdown(src, text) {
  let s = src
  if (!s || typeof s !== 'string' || s.length === 0) {
    s = 'page-sections/investigations.md'
  }
  if (typeof text !== 'string' || text.length === 0) return ''
  if (deferredWarm === null) deferredWarm = {}
  const body = rewriteMarkdownAssetUrls(text, s)
  deferredWarm[s] = body
  return body
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

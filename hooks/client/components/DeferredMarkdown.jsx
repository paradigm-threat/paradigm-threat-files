/**
 * Deferred markdown fragment — loads after client phase 3 (ChangeLog timing).
 * Keeps SSR home slim; fragment fetched via cachedGet like article tips.
 *
 * IMPORTANT: do not call cachedGet inside this override during MarkdownRenderer
 * walk — tip_cached_get/host borrow aborts the override (no section in vnode,
 * soft-hydrate swap skipped). Prefetch from ArticleView, then read warm cache here.
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { MarkdownRenderer } from '@clevertree/markdown'
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

/** Read warm cache only — never network — safe inside MD overrides. */
function readWarm(src) {
  if (deferredWarm === null) return ''
  if (typeof deferredWarm[src] === 'string') return deferredWarm[src]
  return ''
}

export default function DeferredMarkdown(props) {
  let src = ''
  try {
    if (props && typeof props.src === 'string') src = props.src
  } catch (e) {}
  if (src.length === 0) src = 'page-sections/investigations.md'

  if (isClientLivePhase(3) !== true) {
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

  const body = readWarm(src)
  if (body.length === 0) {
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

  return (
    <section className="pt-deferred-md" data-pt-deferred="1" aria-label="Deferred section">
      <MarkdownRenderer content={body} />
    </section>
  )
}

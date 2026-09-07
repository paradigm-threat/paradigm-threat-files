/**
 * Deferred markdown fragment — loads after client phase 3 (ChangeLog timing).
 * Keeps SSR home slim; fragment fetched via cachedGet like article tips.
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

export function homeInvestigationsSrc() {
  return 'page-sections/investigations.md'
}

export function loadDeferredMarkdown(src) {
  return loadFragment(src)
}

export default function DeferredMarkdown(props) {
  let src = ''
  try {
    if (props && typeof props.src === 'string') src = props.src
  } catch (e) {}
  if (src.length === 0) src = 'page-sections/investigations.md'

  const phase3 = isClientLivePhase(3) === true
  let bodyLen = -1

  if (phase3 !== true) {
    try {
      const g = globalThis
      g.__ptDmDebug = { src: src, phase3: false, bodyLen: -1 }
    } catch (e) {}
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

  const body = loadFragment(src)
  bodyLen = body.length
  try {
    const g = globalThis
    g.__ptDmDebug = { src: src, phase3: true, bodyLen: bodyLen }
  } catch (e) {}
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

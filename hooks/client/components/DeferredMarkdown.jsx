/**
 * Deferred markdown fragment — loads after client phase 3 (ChangeLog timing).
 * Keeps SSR home slim; fragment fetched via cachedGet like article tips.
 */
import React from 'react'
import { isClientLivePhase, getClientLivePhase } from '@clevertree/style-internal'
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

  let phaseNow = -1
  try {
    phaseNow = getClientLivePhase()
  } catch (e) {
    phaseNow = -2
  }
  const phase3 = isClientLivePhase(3) === true
  const dbg = 'p' + phaseNow + (phase3 ? 'y' : 'n')

  if (phase3 !== true) {
    if (isCsrHost()) {
      return null
    }
    return (
      <section
        className="pt-deferred-md"
        aria-label="Deferred section"
        data-pt-deferred-ssr="1"
        data-pt-dm-dbg={dbg}
        style={{ minHeight: '12rem' }}
      >
        <p className="pt-muted">Loading section…</p>
      </section>
    )
  }

  const body = loadFragment(src)
  if (body.length === 0) {
    return (
      <section
        className="pt-deferred-md"
        aria-label="Deferred section"
        data-pt-deferred-pending="1"
        data-pt-dm-dbg={dbg + 'e'}
        style={{ minHeight: '12rem' }}
      >
        <p className="pt-muted">Loading section…</p>
      </section>
    )
  }

  return (
    <section
      className="pt-deferred-md"
      data-pt-deferred="1"
      data-pt-dm-dbg={dbg + 'L'}
      aria-label="Deferred section"
    >
      <MarkdownRenderer content={body} />
    </section>
  )
}

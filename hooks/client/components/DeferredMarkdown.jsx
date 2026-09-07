/**
 * Deferred markdown fragment — SSR/pending shell only.
 *
 * Live content is built in ArticleView BEFORE the page MarkdownRenderer walk:
 * nested <MarkdownRenderer> (or cachedGet) inside this override aborts the
 * vnode, so soft-hydrate never swaps the SSR island.
 *
 * min-height: reserve ~measured paint height so the scrollbar does not jump
 * when the island fills (investigations.md ≈ 73KB → ≈19800px).
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'

const MD_CACHE_BUST = 'ptmd10'

/** Measured home fragment paint height (lab); keep in sync when lists grow a lot. */
const HOME_INVESTIGATIONS_MIN_PX = 20500

/** bytes / px from lab (73199 / 19806 ≈ 3.7) for list-heavy markdown. */
const BYTES_PER_PX = 3.7

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

/**
 * Reserve space for the deferred island (px). Prefer explicit attr, then
 * content-length estimate, then known home default. Never shrink below the
 * best available estimate (avoids scrollbar jump on SSR→filled swap).
 */
export function estimateDeferredMinHeightPx(src, contentLen, attrPx) {
  let best = 0
  if (typeof attrPx === 'number' && attrPx > 0) best = attrPx
  if (typeof contentLen === 'number' && contentLen > 0) {
    let h = Math.round(contentLen / BYTES_PER_PX)
    if (h < 480) h = 480
    if (h > best) best = h
  }
  if (best > 0) return best
  let s = src
  if (!s || typeof s !== 'string') s = ''
  if (s === 'page-sections/investigations.md' || s.indexOf('investigations.md') >= 0) {
    return HOME_INVESTIGATIONS_MIN_PX
  }
  return 480
}

export function deferredMinHeightStyle(px) {
  let n = 480
  if (typeof px === 'number' && px > 0) n = px
  return { minHeight: n + 'px' }
}

export function parseDeferredMinHeightAttr(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return 0
  let t = raw.trim()
  if (t.length === 0) return 0
  if (t.length > 2 && t.indexOf('px') === t.length - 2) {
    const n = parseInt(t.slice(0, t.length - 2), 10)
    if (n > 0) return n
    return 0
  }
  const n2 = parseInt(t, 10)
  if (n2 > 0) return n2
  return 0
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

/**
 * Single network path for the home deferred island.
 * Prefer warm cache, then one sync tip GET when tipBase is set (avoids empty
 * cachedGet + second fetch). Fall back to cachedGet when tipBase is empty.
 */
export function loadDeferredFragment(src, tipBase) {
  let s = src
  if (!s || typeof s !== 'string' || s.length === 0) {
    s = 'page-sections/investigations.md'
  }
  if (deferredWarm !== null && typeof deferredWarm[s] === 'string' && deferredWarm[s].length > 0) {
    return deferredWarm[s]
  }
  if (typeof tipBase === 'string' && tipBase.length > 0) {
    try {
      const resp = fetch(tipBase + '/' + s + '?v=' + MD_CACHE_BUST, {
        method: 'GET',
      })
      if (resp && resp.ok === true) {
        const text = resp.text ? resp.text : ''
        if (typeof text === 'string' && text.length > 0) {
          return seedDeferredMarkdown(s, text)
        }
      }
    } catch (e) {}
    return ''
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
  let src = 'page-sections/investigations.md'
  let attrPx = 0
  try {
    if (props && typeof props.src === 'string' && props.src.length > 0) src = props.src
  } catch (e) {}
  try {
    if (props && typeof props.minHeight === 'string') {
      attrPx = parseDeferredMinHeightAttr(props.minHeight)
    }
  } catch (e2) {}
  try {
    if (props && typeof props.minHeight === 'number' && props.minHeight > 0) {
      attrPx = props.minHeight
    }
  } catch (e3) {}
  const minPx = estimateDeferredMinHeightPx(src, 0, attrPx)
  const st = deferredMinHeightStyle(minPx)

  if (isClientLivePhase(3) === true) {
    return (
      <section
        className="pt-deferred-md"
        aria-label="Deferred section"
        aria-busy="true"
        data-pt-deferred-pending="1"
        style={st}
      />
    )
  }
  if (isCsrHost()) {
    return null
  }
  return (
    <section
      className="pt-deferred-md"
      aria-label="Deferred section"
      aria-busy="true"
      data-pt-deferred-ssr="1"
      style={st}
    />
  )
}

/**
 * Deferred markdown fragment — SSR/pending shell only.
 *
 * Live content is built in ArticleView BEFORE the page MarkdownRenderer walk:
 * nested <MarkdownRenderer> (or cachedGet) inside this override aborts the
 * vnode, so soft-hydrate never swaps the SSR island.
 *
 * min-height: reserve ~measured paint height so the scrollbar does not jump
 * when the island fills (investigations.md ≈ 73KB → ≈19800px).
 *
 * Long single-file articles (no tip DeferredMarkdown): ArticleView may SSR a
 * short lead + island with {@link ARTICLE_TAIL_SRC} seeded from the tip tail
 * (never blank the whole body). Prefetch real tip srcs at phase ≥2.
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'

const MD_CACHE_BUST = 'ptmd11'

/** Measured home fragment paint height (lab); keep in sync when lists grow a lot. */
const HOME_INVESTIGATIONS_MIN_PX = 20500

/** bytes / px from lab (73199 / 19806 ≈ 3.7) for list-heavy markdown. */
const BYTES_PER_PX = 3.7

/**
 * Virtual fragment for huge single-file tips (seeded in-process; not a tip blob).
 * loadDeferredFragment must not HTTP-GET this path.
 */
export const ARTICLE_TAIL_SRC = 'page-sections/__article_tail__.md'

/** Soft cap for first hydrate pass of a DeferredMarkdown tip fragment. */
export const DEFERRED_HYDRATE_CHUNK_CHARS = 8000

/**
 * Soft cap for SSR lead when auto-splitting a huge tip without DeferredMarkdown.
 * CleverScript MD walks are superlinear (~3KB≈1s, ~4KB≈3s on fleet); keep lead
 * near home `page.md` so Accept:text/html finishes under RELAY_SSR_TIMEOUT_SECS.
 */
export const HUGE_ARTICLE_LEAD_CHARS = 3000

let deferredWarm = null

export function isVirtualDeferredSrc(src) {
  if (!src || typeof src !== 'string') return false
  return src === ARTICLE_TAIL_SRC || src.indexOf('__article_tail__') >= 0
}

function loadFragment(src) {
  if (deferredWarm === null) deferredWarm = {}
  if (typeof deferredWarm[src] === 'string' && deferredWarm[src].length > 0) {
    return deferredWarm[src]
  }
  if (isVirtualDeferredSrc(src)) {
    // Tail is seed-only — never tip-GET a missing virtual path.
    return ''
  }
  try {
    const text = cachedGet('/' + src + '?v=' + MD_CACHE_BUST)
    if (typeof text === 'string' && text.length > 0) {
      let body = text
      try {
        body = rewriteMarkdownAssetUrls(text, src)
      } catch (eRw) {
        body = text
      }
      if (typeof body !== 'string' || body.length === 0) body = text
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

/**
 * First `<DeferredMarkdown …>` in tip markdown (self-closing or `>` end).
 * @returns {{ at: number, end: number, endLen: number, src: string, attrMinPx: number } | null}
 */
export function parseFirstDeferredMarkdownTag(body) {
  if (typeof body !== 'string' || body.length === 0) return null
  const marker = '<DeferredMarkdown'
  const at = body.indexOf(marker)
  if (at < 0) return null
  const selfClose = body.indexOf('/>', at)
  const tagEnd = body.indexOf('>', at)
  let end = -1
  let endLen = 1
  if (selfClose >= 0 && (tagEnd < 0 || selfClose <= tagEnd)) {
    end = selfClose
    endLen = 2
  } else if (tagEnd >= 0) {
    end = tagEnd
    endLen = 1
  }
  if (end < 0) return null
  let src = 'page-sections/investigations.md'
  let attrMinPx = 0
  const slice = body.slice(at, end + endLen)
  const srcKey = 'src="'
  const s0 = slice.indexOf(srcKey)
  if (s0 >= 0) {
    const s1 = s0 + srcKey.length
    const s2 = slice.indexOf('"', s1)
    if (s2 > s1) src = slice.slice(s1, s2)
  }
  const mhKey = 'minHeight="'
  const m0 = slice.indexOf(mhKey)
  if (m0 >= 0) {
    const m1 = m0 + mhKey.length
    const m2 = slice.indexOf('"', m1)
    if (m2 > m1) {
      attrMinPx = parseDeferredMinHeightAttr(slice.slice(m1, m2))
    }
  }
  // Explicit keys — CleverScript can mishandle object-literal shorthand.
  return {
    at: at,
    end: end,
    endLen: endLen,
    src: src,
    attrMinPx: attrMinPx,
  }
}

/**
 * Cut huge markdown at a paragraph / heading boundary at or before maxChars.
 * Always returns an index in [1, text.length] (never empty lead if text non-empty).
 */
export function cutMarkdownLead(text, maxChars) {
  if (typeof text !== 'string' || text.length === 0) return 0
  let max = typeof maxChars === 'number' && maxChars > 0 ? maxChars : HUGE_ARTICLE_LEAD_CHARS
  if (text.length <= max) return text.length
  const window = text.slice(0, max)
  let cut = window.lastIndexOf('\n## ')
  if (cut < max * 0.4) cut = window.lastIndexOf('\n# ')
  if (cut < max * 0.4) cut = window.lastIndexOf('\n\n')
  if (cut < max * 0.25) cut = window.lastIndexOf('\n')
  // Prefer near the char cap over a tiny lead (early heading + wall of text).
  if (cut < max * 0.25) cut = max
  if (cut < 1) cut = max
  return cut
}

/**
 * If tip is huge and has no DeferredMarkdown, rewrite to lead + virtual tail island.
 * Seeds {@link ARTICLE_TAIL_SRC} when tail is non-empty. Idempotent if already split.
 *
 * Returns the markdown string to render (unchanged if no split). CleverScript:
 * do not return `{ didSplit, markdown }` — property reads on hook objects often
 * fail silently and the full tip walked forever past RELAY_SSR_TIMEOUT_SECS.
 *
 * @returns {string}
 */
export function maybeSplitHugeArticleMarkdown(markdown, pathPart, maxLeadChars) {
  let md = typeof markdown === 'string' ? markdown : ''
  if (md.length === 0) {
    return md
  }
  if (parseFirstDeferredMarkdownTag(md) !== null) {
    return md
  }
  const leadMax =
    typeof maxLeadChars === 'number' && maxLeadChars > 0
      ? maxLeadChars
      : HUGE_ARTICLE_LEAD_CHARS
  // Auto-split when over the SSR lead budget so Accept:text/html stays within
  // RELAY_SSR_TIMEOUT_SECS (full CleverScript MD walks on 15–40KB tips hang).
  if (md.length <= leadMax) {
    return md
  }
  const cut = cutMarkdownLead(md, leadMax)
  if (cut <= 0 || cut >= md.length) {
    return md
  }
  const lead = md.slice(0, cut)
  // Caller already rewrote asset URLs on `md`; do not rewrite the tail again.
  const tail = md.slice(cut)
  seedDeferredMarkdown(ARTICLE_TAIL_SRC, tail)
  const minPx = estimateDeferredMinHeightPx(ARTICLE_TAIL_SRC, tail.length, 0)
  return (
    lead +
    '\n\n<DeferredMarkdown src="' +
    ARTICLE_TAIL_SRC +
    '" minHeight="' +
    minPx +
    'px" />\n'
  )
}

/** Seed warm cache from a string already loaded by the caller (e.g. sync fetch). */
export function seedDeferredMarkdown(src, text) {
  let s = src
  if (!s || typeof s !== 'string' || s.length === 0) {
    s = 'page-sections/investigations.md'
  }
  if (typeof text !== 'string' || text.length === 0) return ''
  if (deferredWarm === null) deferredWarm = {}
  const body = isVirtualDeferredSrc(s)
    ? text
    : rewriteMarkdownAssetUrls(text, s)
  deferredWarm[s] = body
  return body
}

/** Warm tip cache outside MarkdownRenderer overrides (safe for cachedGet). */
export function prefetchDeferredMarkdown(src) {
  let s = src
  if (!s || typeof s !== 'string' || s.length === 0) {
    s = 'page-sections/investigations.md'
  }
  if (isVirtualDeferredSrc(s)) {
    return deferredWarm !== null && typeof deferredWarm[s] === 'string'
      ? deferredWarm[s]
      : ''
  }
  return loadFragment(s)
}

/**
 * Single network path for the home deferred island.
 * Prefer warm cache, then same-Host cachedGet (same path as page.md), then
 * absolute tipBase GET. Never return empty after a tipBase miss without
 * trying cachedGet.
 */
export function loadDeferredFragment(src, tipBase) {
  let s = src
  if (!s || typeof s !== 'string' || s.length === 0) {
    s = 'page-sections/investigations.md'
  }
  if (deferredWarm !== null && typeof deferredWarm[s] === 'string' && deferredWarm[s].length > 0) {
    return deferredWarm[s]
  }
  if (isVirtualDeferredSrc(s)) {
    return ''
  }
  // Prefer relative tip GET — matches ArticleView page.md load (works on park).
  const viaCache = loadFragment(s)
  if (typeof viaCache === 'string' && viaCache.length > 0) {
    return viaCache
  }
  if (typeof tipBase === 'string' && tipBase.length > 0) {
    try {
      const resp = fetch(tipBase + '/' + s + '?v=' + MD_CACHE_BUST, {
        method: 'GET',
      })
      if (resp && resp.ok === true) {
        let text = ''
        try {
          if (typeof resp.text === 'string') text = resp.text
          else if (typeof resp.text === 'function') text = resp.text()
        } catch (eTxt) {
          text = ''
        }
        if (typeof text === 'string' && text.length > 0) {
          return seedDeferredMarkdown(s, text)
        }
      }
    } catch (e) {}
  }
  return ''
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

  // Stable outer identity across phases (host swaps by aria-label / class).
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

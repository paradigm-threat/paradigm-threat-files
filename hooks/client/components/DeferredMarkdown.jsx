/**
 * Lazy markdown fragment for home page heavy lists.
 * Loads after client phase >= 3 on idle (no IntersectionObserver / window —
 * CleverScript SSR rejects those patterns).
 */
import React, { useState, useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'

const MD_CACHE_BUST = 'ptmd6'

function EmptyMdStub() {
  return <span className="pt-md-stub" aria-hidden="true" />
}

function renderPopImage(p) {
  let src = ''
  let alt = ''
  let className = ''
  let highResSrc = ''
  let children = null
  try {
    if (p && typeof p.src === 'string') src = p.src
  } catch (e) {}
  try {
    if (p && typeof p.alt === 'string') alt = p.alt
  } catch (e) {}
  try {
    if (p && typeof p.className === 'string') className = p.className
  } catch (e) {}
  try {
    if (p && typeof p.highResSrc === 'string') highResSrc = p.highResSrc
  } catch (e) {}
  try {
    if (p && p.children !== null) children = p.children
  } catch (e) {}
  return (
    <PopImage
      src={src}
      alt={alt}
      className={className}
      highResSrc={highResSrc}
    >
      {children}
    </PopImage>
  )
}

function ssrPlaceholder() {
  return (
    <section
      className="pt-deferred-md"
      data-pt-deferred-ssr="1"
      style={{ minHeight: '24rem' }}
      aria-busy="true"
    >
      <p className="pt-muted">Loading section…</p>
    </section>
  )
}

/**
 * @param {{ src: string }} props — path relative to repo root
 */
export default function DeferredMarkdown(props) {
  let src = ''
  try {
    if (props && typeof props.src === 'string') src = props.src
  } catch (e) {}

  const contentState = useState('')
  const content = contentState[0]
  const setContent = contentState[1]
  const errState = useState('')
  const errMsg = errState[0]
  const setErrMsg = errState[1]
  const startedState = useState(false)
  const started = startedState[0]
  const setStarted = startedState[1]

  const live = isClientLivePhase(3) === true

  useEffect(() => {
    if (live !== true) return
    if (src.length === 0) return
    if (started === true) return

    let cancelled = false
    let timer = 0

    const run = () => {
      if (cancelled) return
      setStarted(true)
      try {
        const text = cachedGet('/' + src + '?v=' + MD_CACHE_BUST)
        if (cancelled) return
        if (typeof text === 'string' && text.length > 0) {
          setContent(rewriteMarkdownAssetUrls(text, src))
          setErrMsg('')
        } else {
          setErrMsg('Could not load section.')
        }
      } catch (e) {
        if (!cancelled) setErrMsg('Could not load section.')
      }
    }

    // Defer past ChangeLog phase-3 burst; two rAFs + short timeout.
    try {
      let g = null
      try {
        if (typeof globalThis !== 'undefined') g = globalThis
      } catch (e0) {}
      if (g && g.requestAnimationFrame) {
        g.requestAnimationFrame(() => {
          g.requestAnimationFrame(() => {
            try {
              if (g.setTimeout) timer = g.setTimeout(run, 50)
              else run()
            } catch (e1) {
              run()
            }
          })
        })
      } else if (g && g.setTimeout) {
        timer = g.setTimeout(run, 100)
      } else {
        run()
      }
    } catch (e2) {
      run()
    }

    return () => {
      cancelled = true
      try {
        let g2 = null
        if (typeof globalThis !== 'undefined') g2 = globalThis
        if (timer && g2 && g2.clearTimeout) g2.clearTimeout(timer)
      } catch (e3) {}
    }
  }, [live, src, started])

  if (live !== true) {
    return ssrPlaceholder()
  }

  if (errMsg.length > 0) {
    return (
      <section className="pt-deferred-md" data-pt-deferred-err="1">
        <p className="pt-muted">{errMsg}</p>
      </section>
    )
  }

  if (content.length === 0) {
    return ssrPlaceholder()
  }

  return (
    <section className="pt-deferred-md" data-pt-deferred="1">
      <MarkdownRenderer
        content={content}
        overrides={{
          img: renderPopImage,
          PopImage: renderPopImage,
          ChatRoom: EmptyMdStub,
        }}
      />
    </section>
  )
}

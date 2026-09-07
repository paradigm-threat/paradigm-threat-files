/**
 * Lazy markdown fragment — IntersectionObserver + idle/rAF gate (CleverScript-safe).
 * Used on the home page so investigation lists do not block first paint.
 */
import React, { useState, useEffect, useRef } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'

const MD_CACHE_BUST = 'ptmd6'

/** Stub for markdown tags not needed inside deferred fragments. */
function EmptyMdStub() {
  return <span className="pt-md-stub" aria-hidden="true" />
}

/** Module-level override — stable identity across re-renders. */
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
  const rootRef = useRef(null)
  const startedRef = useRef(false)

  const live = isClientLivePhase(3) === true

  useEffect(() => {
    if (live !== true) return
    if (src.length === 0) return

    function doLoad() {
      if (startedRef.current === true) return
      startedRef.current = true
      try {
        const text = cachedGet('/' + src + '?v=' + MD_CACHE_BUST)
        if (typeof text === 'string' && text.length > 0) {
          setContent(rewriteMarkdownAssetUrls(text, src))
          setErrMsg('')
        } else {
          setErrMsg('Could not load section.')
        }
      } catch (e) {
        setErrMsg('Could not load section.')
      }
    }

    function alreadyNearViewport(el) {
      try {
        if (!el || !el.getBoundingClientRect) return false
        const rect = el.getBoundingClientRect()
        let vh = 800
        try {
          if (typeof window !== 'undefined' && window.innerHeight) {
            vh = window.innerHeight
          }
        } catch (e2) {}
        // Match rootMargin '200px' — near or in viewport.
        if (rect.top < vh + 200 && rect.bottom > -200) return true
      } catch (e3) {}
      return false
    }

    const el = rootRef.current
    let obs = null
    let idleId = 0
    let rafId = 0

    if (typeof IntersectionObserver === 'undefined') {
      doLoad()
      return
    }

    obs = new IntersectionObserver(
      function (entries) {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i]
          if (entry && entry.isIntersecting === true) {
            doLoad()
            if (obs) obs.disconnect()
            break
          }
        }
      },
      { rootMargin: '200px' },
    )
    if (el) obs.observe(el)

    function tryIdleOrNear() {
      if (startedRef.current === true) return
      if (alreadyNearViewport(el)) {
        doLoad()
        if (obs) obs.disconnect()
      }
    }

    rafId = requestAnimationFrame(function () {
      tryIdleOrNear()
      try {
        if (typeof requestIdleCallback === 'function') {
          idleId = requestIdleCallback(function () {
            tryIdleOrNear()
          }, { timeout: 1500 })
        } else {
          setTimeout(tryIdleOrNear, 200)
        }
      } catch (e4) {
        setTimeout(tryIdleOrNear, 200)
      }
    })

    return function () {
      if (obs) obs.disconnect()
      try {
        if (rafId) cancelAnimationFrame(rafId)
      } catch (e5) {}
      try {
        if (idleId && typeof cancelIdleCallback === 'function') {
          cancelIdleCallback(idleId)
        }
      } catch (e6) {}
    }
  }, [live, src])

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
    return (
      <section
        ref={rootRef}
        className="pt-deferred-md"
        data-pt-deferred-ssr="1"
        style={{ minHeight: '24rem' }}
        aria-busy="true"
      >
        <p className="pt-muted">Loading section…</p>
      </section>
    )
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

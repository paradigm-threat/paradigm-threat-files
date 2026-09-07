/**
 * Lazy markdown fragment for home page heavy lists.
 * Phase >= 3: sync tip cachedGet (ChangeLog-style). SSR/phases < 3: placeholder.
 * Avoids useEffect races that CleverScript re-renders cancel.
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import { cachedGet } from '@relay/ui'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'

const MD_CACHE_BUST = 'ptmd6'

/** One parse per tip session per src (shared across re-renders). */
let deferredWarm = null

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

function loadDeferredMarkdown(src) {
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

/**
 * @param {{ src: string }} props — path relative to repo root
 */
export default function DeferredMarkdown(props) {
  let src = ''
  try {
    if (props && typeof props.src === 'string') src = props.src
  } catch (e) {}

  if (isClientLivePhase(3) !== true) {
    return ssrPlaceholder()
  }

  if (src.length === 0) {
    return (
      <section className="pt-deferred-md" data-pt-deferred-err="1">
        <p className="pt-muted">Missing section src.</p>
      </section>
    )
  }

  const content = loadDeferredMarkdown(src)
  if (content.length === 0) {
    return (
      <section className="pt-deferred-md" data-pt-deferred-err="1">
        <p className="pt-muted">Could not load section.</p>
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

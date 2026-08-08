import React, { useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { prop } from '@relay/util'
import { portraitSiblingSrc as pathPortraitSiblingSrc } from '@relay/path'
import { gallery } from 'hooks/client/galleryStore.jsx'
import { IconMaximize } from 'hooks/client/components/Icons.jsx'

/** Narrow viewports prefer optional `foo-portrait.ext` sibling (navbar art-direction pattern). */
const PORTRAIT_MEDIA = '(max-width: 768px)'

function str(v) {
  if (typeof v === 'string') return v
  return ''
}

function inventPortraitSibling(src) {
  try {
    const out = pathPortraitSiblingSrc(src)
    if (typeof out === 'string' && out.length > 0) return out
  } catch (e) {}
  return ''
}

function repoRelFromMediaSrc(src) {
  if (typeof src !== 'string' || src.length === 0) return ''
  let path = src
  try {
    if (src.indexOf('http://') === 0 || src.indexOf('https://') === 0) {
      path = new URL(src).pathname
    } else {
      const qi = src.indexOf('?')
      if (qi >= 0) path = src.slice(0, qi)
    }
  } catch (e) {
    const qi = src.indexOf('?')
    if (qi >= 0) path = src.slice(0, qi)
  }
  while (path.length > 0 && path.charAt(0) === '/') {
    path = path.slice(1)
  }
  return path
}

/**
 * Tip portrait index from SSR bootstrap (`globalThis.__RELAY_PORTRAIT_SIBLINGS__`).
 * Without the index, never invent a `<source>` — missing siblings blank mobile images.
 */
function portraitSiblingIfPresent(src) {
  const cand = inventPortraitSibling(src)
  if (cand.length === 0) return ''
  let map = null
  try {
    if (typeof globalThis !== 'undefined') {
      map = globalThis.__RELAY_PORTRAIT_SIBLINGS__
    }
  } catch (e) {}
  if (!map || typeof map !== 'object') return ''
  const rel = repoRelFromMediaSrc(cand)
  if (rel.length === 0) return ''
  try {
    if (map[rel] === true) return cand
  } catch (e2) {}
  return ''
}

/** Inline / MDX image — click opens fullscreen gallery (live PopImage parity). */
export default function PopImage(props) {
  const src = str(prop(props, 'src', ''))
  const alt = str(prop(props, 'alt', ''))
  const className = str(prop(props, 'className', ''))
  const highResSrc = str(prop(props, 'highResSrc', ''))
  let children = null
  try {
    if (props && props.children !== null) {
      children = props.children
    }
  } catch (e) {}
  const live = isClientLive() === true
  const id = gallery.safeImgDomId(src)
  const portraitSrc = portraitSiblingIfPresent(src)

  useEffect(() => {
    if (!live || src.length === 0) return
    gallery.registerGalleryImage({
      src: src,
      alt: alt,
      highResSrc: highResSrc,
      children: children,
    })
    return () => {
      gallery.unregisterGalleryImage(src)
    }
  }, [live, src])

  useEffect(() => {
    if (!live || src.length === 0) return
    gallery.syncGalleryImageMeta({
      src: src,
      alt: alt,
      highResSrc: highResSrc,
      children: children,
    })
  }, [live, src, alt, highResSrc])

  useEffect(() => {
    if (!live || src.length === 0) return
    const target = gallery.readHashImgSrc()
    if (target.length > 0 && target === src) {
      gallery.openGalleryAt(src)
      try {
        if (document && document.getElementById) {
          const el = document.getElementById(id)
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'auto', block: 'center' })
          }
        }
      } catch (e) {}
    }
  }, [live, src])

  let wrapClass = 'pt-popimage'
  if (className.length > 0) wrapClass = wrapClass + ' ' + className

  const imgEl = (
    <img src={src} alt={alt} className="pt-popimage-img" loading="lazy" />
  )

  return (
    <div
      id={id}
      className={wrapClass}
      role="button"
      tabIndex={0}
      data-pt-popimage="true"
      onClick={() => {
        if (!live || src.length === 0) return
        gallery.openGalleryAt(src)
      }}
      onKeyDown={(e) => {
        if (!live) return
        let key = ''
        try {
          if (e && typeof e.key === 'string') key = e.key
        } catch (err) {}
        if (key === 'Enter' || key === ' ') {
          try {
            if (e && e.preventDefault) e.preventDefault()
          } catch (err2) {}
          gallery.openGalleryAt(src)
        }
      }}
    >
      <div className="pt-popimage-inner">
        {portraitSrc.length > 0 ? (
          <picture>
            <source media={PORTRAIT_MEDIA} srcSet={portraitSrc} />
            {imgEl}
          </picture>
        ) : (
          imgEl
        )}
        <div className="pt-popimage-hover" aria-hidden="true">
          <span className="pt-popimage-max">
            <IconMaximize />
          </span>
        </div>
      </div>
      {children ? <div className="pt-popimage-caption">{children}</div> : null}
    </div>
  )
}

import React, { useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { prop } from '@relay/util'
import { portraitSiblingIfPresent as pathPortraitIfPresent } from '@relay/path'
import { gallery } from 'hooks/client/galleryStore.jsx'
import { IconMaximize } from 'hooks/client/components/Icons.jsx'

/** Narrow viewports prefer optional `foo-portrait.ext` sibling (navbar art-direction pattern). */
const PORTRAIT_MEDIA = '(max-width: 768px)'

function str(v) {
  if (typeof v === 'string') return v
  return ''
}

/**
 * Tip portrait index from SSR bootstrap.
 * Prefer CS `globalThis` (seeded by gateway SSR / WASM boot). Fall back to the
 * `#relay-portrait-siblings` JSON script — browser `globalThis` is not the CS sandbox.
 * Host invents only when the map says the sibling exists — never probe with Image().
 */
function readPortraitSiblingMap() {
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis.__RELAY_PORTRAIT_SIBLINGS__
      if (g && typeof g === 'object') return g
    }
  } catch (e) {}
  try {
    if (typeof document === 'undefined' || !document.getElementById) return null
    const el = document.getElementById('relay-portrait-siblings')
    if (!el) return null
    let raw = ''
    try {
      if (typeof el.textContent === 'string') raw = el.textContent
    } catch (e2) {}
    if (raw.length === 0) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    try {
      if (typeof globalThis !== 'undefined') {
        globalThis.__RELAY_PORTRAIT_SIBLINGS__ = parsed
      }
    } catch (e3) {}
    return parsed
  } catch (e4) {}
  return null
}

function portraitSiblingIfPresent(src) {
  const map = readPortraitSiblingMap()
  if (!map) return ''
  try {
    const out = pathPortraitIfPresent(src, map)
    if (typeof out === 'string' && out.length > 0) return out
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

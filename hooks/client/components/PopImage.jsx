import React, { useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { prop } from '@relay/util'
import { gallery } from 'hooks/client/galleryStore.jsx'
import { IconMaximize } from 'hooks/client/components/Icons.jsx'

function str(v) {
  if (typeof v === 'string') return v
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
        <img src={src} alt={alt} className="pt-popimage-img" loading="lazy" />
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

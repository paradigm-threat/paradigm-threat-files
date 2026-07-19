import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import {
  gallerySubscribe,
  galleryRev,
  galleryImages,
  galleryIndex,
  galleryIsOpen,
  closeGallery,
  galleryGoNext,
  galleryGoPrev,
  setGalleryHash,
  galleryDisplaySrc,
} from 'hooks/client/galleryStore.jsx'
import {
  IconClose,
  IconChevronLeft,
  IconChevronRight,
} from 'hooks/client/components/Icons.jsx'

function captionFor(img) {
  if (!img) return ''
  try {
    if (img.children !== null && img.children !== undefined) {
      if (typeof img.children === 'string') return img.children
    }
  } catch (e) {}
  if (typeof img.alt === 'string' && img.alt.length > 0) return img.alt
  const src = typeof img.src === 'string' ? img.src : ''
  if (src.length === 0) return ''
  const parts = src.split('/')
  let base = parts.length > 0 ? parts[parts.length - 1] : ''
  const dot = base.lastIndexOf('.')
  if (dot > 0) base = base.slice(0, dot)
  return base.split('_').join(' ')
}

/** Fullscreen gallery overlay — mounted once under SiteChrome. */
export default function ImageGalleryOverlay() {
  const live = isClientLive() === true
  const tick = useState(0)
  const setTick = tick[1]

  useEffect(() => {
    if (!live) return
    return gallerySubscribe((rev) => {
      setTick(typeof rev === 'number' ? rev : galleryRev())
    })
  }, [live])

  const open = live && galleryIsOpen()
  const images = galleryImages()
  const index = galleryIndex()
  const current =
    open && index >= 0 && index < images.length ? images[index] : null

  useEffect(() => {
    if (!live || !open || !current) return
    setGalleryHash(current.src)
  }, [live, open, index])

  useEffect(() => {
    if (!live || !open) return
    const onKey = (e) => {
      let key = ''
      try {
        if (e && typeof e.key === 'string') key = e.key
      } catch (err) {}
      if (key === 'Escape') closeGallery()
      if (key === 'ArrowRight') galleryGoNext()
      if (key === 'ArrowLeft') galleryGoPrev()
    }
    try {
      const g = globalThis
      if (g && g.addEventListener) {
        g.addEventListener('keydown', onKey)
        return () => {
          try {
            if (g.removeEventListener) g.removeEventListener('keydown', onKey)
          } catch (e2) {}
        }
      }
      if (g && g.document && g.document.addEventListener) {
        g.document.addEventListener('keydown', onKey)
        return () => {
          try {
            g.document.removeEventListener('keydown', onKey)
          } catch (e3) {}
        }
      }
    } catch (e) {}
  }, [live, open, index])

  useEffect(() => {
    if (!live || !open) return
    let prev = ''
    try {
      const doc = globalThis.document
      if (doc && doc.body && doc.body.style) {
        prev = doc.body.style.overflow
        doc.body.style.overflow = 'hidden'
        return () => {
          try {
            doc.body.style.overflow = prev
          } catch (e) {}
        }
      }
    } catch (e) {}
  }, [live, open])

  if (!open || !current) return null

  const src = galleryDisplaySrc(current)
  const caption = captionFor(current)
  const hasCaption = caption.length > 0
  const countLabel =
    '' + (index + 1) + ' / ' + images.length + ' — ' + current.src
  const multi = images.length > 1

  return (
    <div
      className="pt-gallery"
      data-pt-gallery="true"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      onClick={() => {
        closeGallery()
      }}
    >
      <div
        className="pt-gallery-header"
        onClick={(e) => {
          try {
            if (e && e.stopPropagation) e.stopPropagation()
          } catch (err) {}
        }}
      >
        <div className="pt-gallery-count">{countLabel}</div>
        <button
          type="button"
          className="pt-gallery-close"
          aria-label="Close image gallery"
          onClick={() => {
            closeGallery()
          }}
        >
          <IconClose />
        </button>
      </div>
      <div
        className="pt-gallery-stage"
        onClick={(e) => {
          try {
            if (e && e.stopPropagation) e.stopPropagation()
          } catch (err) {}
        }}
      >
        {multi ? (
          <button
            type="button"
            className="pt-gallery-nav pt-gallery-prev"
            aria-label="Previous image"
            onClick={() => {
              galleryGoPrev()
            }}
          >
            <IconChevronLeft />
          </button>
        ) : null}
        <img src={src} alt={current.alt} className="pt-gallery-img" />
        {multi ? (
          <button
            type="button"
            className="pt-gallery-nav pt-gallery-next"
            aria-label="Next image"
            onClick={() => {
              galleryGoNext()
            }}
          >
            <IconChevronRight />
          </button>
        ) : null}
      </div>
      {hasCaption ? (
        <div
          className="pt-gallery-caption"
          onClick={(e) => {
            try {
              if (e && e.stopPropagation) e.stopPropagation()
            } catch (err) {}
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  )
}

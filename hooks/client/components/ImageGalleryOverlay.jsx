import React, { useState, useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { basename } from '@relay/path'
import { gallery } from 'hooks/client/galleryStore.jsx'
import {
  IconClose,
  IconChevronLeft,
  IconChevronRight,
} from 'hooks/client/components/Icons.jsx'

function captionFor(img) {
  if (!img) return ''
  try {
    if (img.children !== null) {
      if (typeof img.children === 'string') return img.children
    }
  } catch (e) {}
  if (typeof img.alt === 'string' && img.alt.length > 0) return img.alt
  const src = typeof img.src === 'string' ? img.src : ''
  if (src.length === 0) return ''
  let base = ''
  try {
    base = basename(src)
  } catch (e2) {
    const parts = src.split('/')
    base = parts.length > 0 ? parts[parts.length - 1] : ''
  }
  if (typeof base !== 'string') base = ''
  const dot = base.lastIndexOf('.')
  if (dot > 0) base = base.slice(0, dot)
  return base.split('_').join(' ')
}

/** Fullscreen gallery overlay — mounted once under SiteChrome. */
export default function ImageGalleryOverlay() {
  const live = isClientLivePhase(4) === true
  const tick = useState(0)
  const setTick = tick[1]
  const rev = tick[0]

  useEffect(() => {
    if (!live) return
    return gallery.gallerySubscribe((r) => {
      setTick(typeof r === 'number' ? r : gallery.galleryRev())
    })
  }, [live])

  let open = false
  let images = []
  let index = 0 - 1
  let current = null
  if (live) {
    try {
      open = gallery.galleryIsOpen()
      images = gallery.galleryImages()
      index = gallery.galleryIndex()
      if (open && index >= 0 && index < images.length) {
        current = images[index]
      }
    } catch (e) {
      open = false
      current = null
    }
  }

  useEffect(() => {
    if (!live || !open || !current) return
    gallery.setGalleryHash(current.src)
  }, [live, open, index, rev])

  useEffect(() => {
    if (!live || !open) return
    const onKey = (e) => {
      let key = ''
      try {
        if (e && typeof e.key === 'string') key = e.key
      } catch (err) {}
      if (key === 'Escape') gallery.closeGallery()
      if (key === 'ArrowRight') gallery.galleryGoNext()
      if (key === 'ArrowLeft') gallery.galleryGoPrev()
    }
    try {
      if (document && document.addEventListener) {
        document.addEventListener('keydown', onKey)
        return () => {
          try {
            document.removeEventListener('keydown', onKey)
          } catch (e2) {}
        }
      }
    } catch (e) {}
  }, [live, open, index, rev])

  useEffect(() => {
    if (!live || !open) return
    let prev = ''
    try {
      if (document && document.body && document.body.style) {
        prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
          try {
            document.body.style.overflow = prev
          } catch (e) {}
        }
      }
    } catch (e) {}
  }, [live, open, rev])

  if (!live || !open || !current) {
    return (
      <div
        className="pt-gallery pt-gallery-header pt-gallery-count pt-gallery-close pt-gallery-stage pt-gallery-img pt-gallery-nav pt-gallery-prev pt-gallery-next pt-gallery-caption"
        hidden={true}
        aria-hidden="true"
        data-pt-gallery-css="true"
      />
    )
  }

  const src = gallery.galleryDisplaySrc(current)
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
    >
      <div className="pt-gallery-header">
        <div className="pt-gallery-count">{countLabel}</div>
        <button
          type="button"
          className="pt-gallery-close"
          aria-label="Close gallery"
          onClick={() => {
            gallery.closeGallery()
          }}
        >
          <IconClose />
        </button>
      </div>
      <div className="pt-gallery-stage">
        {multi ? (
          <button
            type="button"
            className="pt-gallery-nav pt-gallery-prev"
            aria-label="Previous image"
            onClick={() => {
              gallery.galleryGoPrev()
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
              gallery.galleryGoNext()
            }}
          >
            <IconChevronRight />
          </button>
        ) : null}
      </div>
      {hasCaption ? (
        <div className="pt-gallery-caption">{caption}</div>
      ) : null}
    </div>
  )
}

/**
 * Mounts @relay/gallery ImageGalleryRoot (Custom Element host) once under SiteChrome.
 * Replaces the former CleverScript useState overlay.
 *
 * Do not put `pt-gallery` (fullscreen fixed overlay) on the host — themed-styler
 * CSS would paint a black sheet over the page before/while the CE builds its
 * inner overlay (which already carries `.relay-gallery.pt-gallery` + `hidden`).
 */
import React from 'react'
import { ImageGalleryRoot } from '@relay/gallery'

export default function ImageGalleryOverlay() {
  return <ImageGalleryRoot />
}

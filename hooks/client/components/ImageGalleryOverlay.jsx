/**
 * Mounts @relay/gallery ImageGalleryRoot (Custom Element host) once under SiteChrome.
 * Replaces the former CleverScript useState overlay.
 */
import React from 'react'
import { ImageGalleryRoot } from '@relay/gallery'

export default function ImageGalleryOverlay() {
  return <ImageGalleryRoot className="pt-gallery" />
}

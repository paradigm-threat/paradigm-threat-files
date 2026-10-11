/**
 * Tip PopImage — wraps @relay/gallery PopImage with PT theme class names.
 * Fullscreen chrome is the `relay-pop-image` / `relay-image-gallery` Custom Elements (no CS setState overlay).
 */
import React from 'react'
import { PopImage as RelayPopImage } from '@relay/gallery'
import { prop } from '@relay/util'

function str(v) {
  if (typeof v === 'string') return v
  return ''
}

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

  // Host CE already applies `.relay-pop-image` / `.pt-popimage`; pass tip extras only.
  let wrapClass = className
  if (
    (wrapClass.indexOf('float-right') >= 0 || wrapClass.indexOf('float-left') >= 0) &&
    wrapClass.indexOf('max-w-') < 0
  ) {
    wrapClass = wrapClass + ' max-w-sm'
  }

  return (
    <RelayPopImage
      src={src}
      alt={alt}
      className={wrapClass}
      highResSrc={highResSrc}
      aspectRatio="3 / 2"
    >
      {children}
    </RelayPopImage>
  )
}

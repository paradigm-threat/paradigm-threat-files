import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'

function scrollY() {
  try {
    if (document && document.documentElement) {
      const y = document.documentElement.scrollTop
      if (typeof y === 'number' && y > 0) return y
    }
  } catch (e) {}
  try {
    if (document && document.body) {
      const y2 = document.body.scrollTop
      if (typeof y2 === 'number') return y2
    }
  } catch (e2) {}
  return 0
}

function scrollToTop() {
  try {
    if (document && document.documentElement) {
      document.documentElement.scrollTop = 0
    }
  } catch (e) {}
  try {
    if (document && document.body) {
      document.body.scrollTop = 0
    }
  } catch (e2) {}
  try {
    const view = document.defaultView
    if (view && view.scrollTo) {
      view.scrollTo(0, 0)
    }
  } catch (e3) {}
}

/** Fixed back-to-top — shows after scroll (live FloatingDiv button). */
export default function BackToTop() {
  const live = isClientLive() === true
  const state = useState(false)
  const visible = state[0]
  const setVisible = state[1]

  useEffect(() => {
    if (!live) return
    const onScroll = () => {
      setVisible(scrollY() > 280)
    }
    onScroll()
    try {
      if (document && document.addEventListener) {
        document.addEventListener('scroll', onScroll)
        return () => {
          try {
            document.removeEventListener('scroll', onScroll)
          } catch (e) {}
        }
      }
    } catch (e2) {}
  }, [live])

  if (!live) {
    return (
      <div
        className="pt-back-top pt-back-top-visible"
        hidden={true}
        aria-hidden="true"
        data-pt-back-top-css="true"
      />
    )
  }

  let cls = 'pt-back-top'
  if (visible) cls = cls + ' pt-back-top-visible'

  return (
    <button
      type="button"
      className={cls}
      data-pt-back-top="true"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => {
        scrollToTop()
      }}
    >
      Back to top
    </button>
  )
}

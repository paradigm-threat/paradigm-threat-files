import React, { useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'

/**
 * Cycle article font via html[data-font] only — no useState / set_render_requested.
 * Button face + article body fonts come from navChromeCss (data-font selectors).
 * Use bare `document` (CleverScript builtin); globalThis.document is often unset in tip handlers.
 * Tip Dom has setAttribute/getAttribute only — never removeAttribute (throws; empty catch stuck on mono).
 */

function applyFont(key) {
  try {
    if (!document || !document.documentElement) return
    // Always set — do not removeAttribute (not on CleverScript DomNode).
    if (key === 'franklin' || key === 'mono' || key === 'garamond') {
      document.documentElement.setAttribute('data-font', key)
    }
  } catch (e) {}
}

function readHtmlFont() {
  try {
    if (!document || !document.documentElement) return 'garamond'
    let v = ''
    try {
      v = document.documentElement.getAttribute('data-font')
    } catch (e0) {}
    if (v === 'franklin' || v === 'mono' || v === 'garamond') return v
  } catch (e) {}
  return 'garamond'
}

function readSavedFont() {
  try {
    if (typeof localStorage === 'undefined') return 'garamond'
    if (!localStorage.getItem) return 'garamond'
    const s = localStorage.getItem('content-font')
    if (s === 'franklin' || s === 'mono' || s === 'garamond') return s
  } catch (e) {}
  return 'garamond'
}

function saveFont(key) {
  try {
    if (typeof localStorage === 'undefined') return
    if (!localStorage.setItem) return
    localStorage.setItem('content-font', key)
  } catch (e) {}
}

function nextFont(key) {
  if (key === 'garamond') return 'franklin'
  if (key === 'franklin') return 'mono'
  return 'garamond'
}

/** Cycle article fonts — Ag badge. */
export default function FontToggle() {
  const live = isClientLive() === true

  useEffect(() => {
    if (!live) return
    applyFont(readSavedFont())
  }, [live])

  return (
    <button
      type="button"
      className="pt-icon-btn pt-font-toggle"
      title={
        live
          ? 'Cycle article font (Garamond / Franklin / Mono)'
          : 'Font toggle after page loads'
      }
      disabled={!live}
      onClick={() => {
        if (!live) return
        const next = nextFont(readHtmlFont())
        applyFont(next)
        saveFont(next)
      }}
    >
      Ag
    </button>
  )
}

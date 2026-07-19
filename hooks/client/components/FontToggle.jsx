import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'

function applyFont(key) {
  try {
    const doc = globalThis.document
    if (!doc || !doc.documentElement) return
    if (key === 'garamond') {
      doc.documentElement.removeAttribute('data-font')
    } else {
      doc.documentElement.setAttribute('data-font', key)
    }
  } catch (e) {}
}

function readSavedFont() {
  try {
    if (typeof localStorage === 'undefined' || !localStorage.getItem) return 'garamond'
    const s = localStorage.getItem('content-font')
    if (s === 'franklin' || s === 'mono' || s === 'garamond') return s
  } catch (e) {}
  return 'garamond'
}

function fontFamilyFor(key) {
  if (key === 'franklin') return "'Libre Franklin', system-ui, sans-serif"
  if (key === 'mono') return "'JetBrains Mono', 'Courier New', monospace"
  return "'EB Garamond', Georgia, serif"
}

function fontTitleFor(key) {
  if (key === 'franklin') return 'Libre Franklin (sans-serif)'
  if (key === 'mono') return 'JetBrains Mono (monospace)'
  return 'EB Garamond (serif)'
}

function nextFont(key) {
  if (key === 'garamond') return 'franklin'
  if (key === 'franklin') return 'mono'
  return 'garamond'
}

/** Cycle article fonts — matches live FontToggle (Ag badge). */
export default function FontToggle() {
  const live = isClientLive() === true
  const state = useState('garamond')
  const font = state[0]
  const setFont = state[1]

  useEffect(() => {
    if (!live) return
    const saved = readSavedFont()
    setFont(saved)
    applyFont(saved)
  }, [live])

  const family = fontFamilyFor(font)
  const title = fontTitleFor(font)

  return (
    <button
      type="button"
      className="pt-icon-btn pt-font-toggle"
      title={live ? 'Font: ' + title + ' — click to cycle' : 'Font toggle after page loads'}
      disabled={!live}
      style={{ fontFamily: family }}
      onClick={() => {
        if (!live) return
        const next = nextFont(font)
        setFont(next)
        try {
          if (typeof localStorage !== 'undefined' && localStorage.setItem) {
            localStorage.setItem('content-font', next)
          }
        } catch (e) {}
        applyFont(next)
      }}
    >
      Ag
    </button>
  )
}

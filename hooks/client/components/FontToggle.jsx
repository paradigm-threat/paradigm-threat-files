import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'

const FONTS = [
  { key: 'garamond', label: 'Ag', title: 'EB Garamond (serif)', family: "'EB Garamond', Georgia, serif" },
  { key: 'franklin', label: 'Ag', title: 'Libre Franklin (sans-serif)', family: "'Libre Franklin', system-ui, sans-serif" },
  { key: 'mono', label: 'Ag', title: 'JetBrains Mono (monospace)', family: "'JetBrains Mono', 'Courier New', monospace" },
]

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

function fontMeta(key) {
  for (let i = 0; i < FONTS.length; i++) {
    if (FONTS[i].key === key) return FONTS[i]
  }
  return FONTS[0]
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

  const current = fontMeta(font)

  return (
    <button
      type="button"
      className="pt-icon-btn pt-font-toggle"
      title={live ? 'Font: ' + current.title + ' — click to cycle' : 'Font toggle after page loads'}
      disabled={!live}
      style={{ fontFamily: current.family }}
      onClick={() => {
        if (!live) return
        let idx = 0
        for (let i = 0; i < FONTS.length; i++) {
          if (FONTS[i].key === font) idx = i
        }
        const next = FONTS[(idx + 1) % FONTS.length]
        setFont(next.key)
        try {
          if (typeof localStorage !== 'undefined' && localStorage.setItem) {
            localStorage.setItem('content-font', next.key)
          }
        } catch (e) {}
        applyFont(next.key)
      }}
    >
      {current.label}
    </button>
  )
}

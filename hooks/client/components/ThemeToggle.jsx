import React, { useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { IconMoon, IconSun } from 'hooks/client/components/Icons.jsx'

/**
 * Flip html.light / html.dark only — no useState / set_render_requested.
 * Dual theme CSS (html.dark / html.light) + both icons live in the sheet;
 * show/hide via navChromeCss. Do not call setCurrentTheme or set data-theme.
 */

function applyThemeClass(name) {
  try {
    if (!document || !document.documentElement) return
    if (name === 'light' || name === 'dark') {
      document.documentElement.setAttribute('class', name)
    }
  } catch (e) {}
}

function readHtmlTheme() {
  try {
    if (!document || !document.documentElement) return ''
    let c = ''
    try {
      c = document.documentElement.getAttribute('class')
    } catch (e0) {}
    if (typeof c !== 'string') {
      try {
        if (typeof document.documentElement.className === 'string') {
          c = document.documentElement.className
        }
      } catch (e1) {}
    }
    if (typeof c !== 'string') return ''
    if (c.indexOf('dark') >= 0) return 'dark'
    if (c.indexOf('light') >= 0) return 'light'
  } catch (e) {}
  return ''
}

function readSavedTheme() {
  try {
    if (typeof localStorage === 'undefined') return ''
    if (!localStorage.getItem) return ''
    const s = localStorage.getItem('pt-theme')
    if (s === 'dark' || s === 'light') return s
  } catch (e) {}
  return ''
}

function saveTheme(name) {
  try {
    if (typeof localStorage === 'undefined') return
    if (!localStorage.setItem) return
    localStorage.setItem('pt-theme', name)
  } catch (e) {}
}

function resolveInitialTheme() {
  const saved = readSavedTheme()
  if (saved === 'dark' || saved === 'light') return saved
  const onHtml = readHtmlTheme()
  if (onHtml === 'dark' || onHtml === 'light') return onHtml
  return 'light'
}

export default function ThemeToggle() {
  const live = isClientLive() === true

  useEffect(() => {
    if (!live) return
    applyThemeClass(resolveInitialTheme())
  }, [live])

  return (
    <button
      type="button"
      id="pt-theme-toggle"
      className="pt-icon-btn"
      title={live ? 'Toggle light / dark theme' : 'Theme toggle available after page loads'}
      disabled={!live}
      onClick={() => {
        if (!live) return
        const cur = readHtmlTheme()
        const next = cur === 'dark' ? 'light' : 'dark'
        applyThemeClass(next)
        saveTheme(next)
      }}
    >
      <span className="pt-theme-icon-moon" aria-hidden="true">
        <IconMoon />
      </span>
      <span className="pt-theme-icon-sun" aria-hidden="true">
        <IconSun />
      </span>
    </button>
  )
}

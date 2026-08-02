import React, { useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { IconMoon, IconSun } from 'hooks/client/components/Icons.jsx'

/**
 * Flip html.light / html.dark only — no useState / set_render_requested.
 * Dual theme CSS (html.dark / html.light) + both icons live in the sheet;
 * show/hide via navChromeCss. Do not call setCurrentTheme or set data-theme.
 *
 * Host note: relay-runtime-web.js applyInjectedCss → syncHtmlThemeClass mirrors
 * WASM get_current_theme_name() (theme.yaml current_theme, usually light) onto
 * <html class> on every doRender, wiping tip class flips after catalog hydrate.
 * Persist the choice on html[data-pt-theme] (survives mount innerHTML wipes) and
 * re-assert class from that on an interval. Tip localStorage is in-memory TLS only.
 */

function applyThemeClass(name) {
  try {
    if (!document || !document.documentElement) return
    if (name === 'light' || name === 'dark') {
      document.documentElement.setAttribute('class', name)
    } else if (name === '') {
      document.documentElement.setAttribute('class', '')
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

function readDataTheme() {
  try {
    if (!document || !document.documentElement) return ''
    const d = document.documentElement.getAttribute('data-pt-theme')
    if (d === 'dark' || d === 'light') return d
  } catch (e) {}
  return ''
}

function writeDataTheme(name) {
  try {
    if (!document || !document.documentElement) return
    if (name === 'dark' || name === 'light') {
      document.documentElement.setAttribute('data-pt-theme', name)
    }
  } catch (e) {}
}

function readSavedTheme() {
  const fromDom = readDataTheme()
  if (fromDom === 'dark' || fromDom === 'light') return fromDom
  try {
    const s = localStorage.getItem('pt-theme')
    if (s === 'dark' || s === 'light') {
      writeDataTheme(s)
      return s
    }
  } catch (e) {}
  return ''
}

function saveTheme(name) {
  writeDataTheme(name)
  try {
    localStorage.setItem('pt-theme', name)
  } catch (e) {}
}

function assertThemeClass() {
  const want = readSavedTheme()
  const cur = readHtmlTheme()
  if (want === 'dark' || want === 'light') {
    if (cur !== want) {
      applyThemeClass(want)
    }
    return
  }
  // No preference: undo host syncHtmlThemeClass light force so prefers-color-scheme wins.
  if (cur === 'light' || cur === 'dark') {
    applyThemeClass('')
  }
}

export default function ThemeToggle() {
  const live = isClientLive() === true

  useEffect(() => {
    if (!live) return
    assertThemeClass()
    const id = setInterval(() => {
      assertThemeClass()
    }, 200)
    return () => {
      try {
        clearInterval(id)
      } catch (e) {}
    }
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

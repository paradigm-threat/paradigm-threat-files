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
 * <html class> on every doRender. That overwrites tip class flips after catalog
 * hydrate remounts. Re-assert from tip preference on an interval.
 *
 * CleverScript `localStorage` is in-memory (TLS), not browser localStorage.
 * Also keep a module bag — nested `function` bodies can lose bare module lets.
 */

const themeSession = { name: '' }

function applyThemeClass(name) {
  try {
    if (!document || !document.documentElement) return
    if (name === 'light' || name === 'dark') {
      document.documentElement.setAttribute('class', name)
    } else if (name === '') {
      // Empty class → dual CSS honors prefers-color-scheme (undo host light force).
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

function readSavedTheme() {
  try {
    if (themeSession.name === 'dark' || themeSession.name === 'light') {
      return themeSession.name
    }
  } catch (e0) {}
  try {
    const s = localStorage.getItem('pt-theme')
    if (s === 'dark' || s === 'light') {
      themeSession.name = s
      return s
    }
  } catch (e) {}
  return ''
}

function saveTheme(name) {
  try {
    themeSession.name = name
  } catch (e0) {}
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
  // No tip preference yet: undo syncHtmlThemeClass forcing WASM current_theme=light
  // so the dual sheet can follow prefers-color-scheme until the user toggles.
  if (cur === 'light' || cur === 'dark') {
    applyThemeClass('')
  }
}

export default function ThemeToggle() {
  const live = isClientLive() === true

  useEffect(() => {
    if (!live) return
    assertThemeClass()
    // Beat host syncHtmlThemeClass after each doRender (catalog hydrate, etc.).
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

import React, { useState, useEffect } from 'react'
import { getCurrentTheme, isClientLive } from '@clevertree/style-internal'
import { IconMoon, IconSun } from 'hooks/client/components/Icons.jsx'

/**
 * Dual light/dark rules already ship in #relay-ssr-theme. Flip html.light /
 * html.dark only — never call setCurrentTheme (full CSS rebuild stalls Dom).
 * Never put data-theme on this button (embed delegation → setCurrentTheme).
 */

function readSystemDark() {
  try {
    const g = globalThis
    if (!g || !g.matchMedia) return false
    return g.matchMedia('(prefers-color-scheme: dark)').matches === true
  } catch (e) {
    return false
  }
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

function applyThemeClass(name) {
  try {
    if (!document || !document.documentElement) return
    document.documentElement.classList.remove('light', 'dark')
    if (name === 'light' || name === 'dark') {
      document.documentElement.classList.add(name)
    }
  } catch (e) {}
}

function readHtmlTheme() {
  try {
    if (!document || !document.documentElement) return ''
    const c = document.documentElement.className
    if (typeof c !== 'string') return ''
    if (c.indexOf('dark') >= 0) return 'dark'
    if (c.indexOf('light') >= 0) return 'light'
  } catch (e) {}
  return ''
}

function resolveTheme(allowSystem) {
  const saved = readSavedTheme()
  if (saved === 'dark' || saved === 'light') return saved
  const onHtml = readHtmlTheme()
  if (onHtml === 'dark' || onHtml === 'light') return onHtml
  const stored = getCurrentTheme()
  if (stored === 'dark' || stored === 'light') return stored
  if (!allowSystem) return 'light'
  return readSystemDark() ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const live = isClientLive() === true
  const state = useState('light')
  const theme = state[0]
  const setTheme = state[1]
  const readyState = useState(false)
  const ready = readyState[0]
  const setReady = readyState[1]

  useEffect(() => {
    if (!live) return
    if (ready) return
    const resolved = resolveTheme(true)
    setTheme(resolved)
    applyThemeClass(resolved)
    setReady(true)
  }, [live, ready])

  return (
    <button
      type="button"
      id="pt-theme-toggle"
      className="pt-icon-btn"
      title={live ? 'Toggle theme (' + theme + ')' : 'Theme toggle available after page loads'}
      disabled={!live}
      onClick={() => {
        if (!live) return
        const next = theme === 'dark' ? 'light' : 'dark'
        applyThemeClass(next)
        saveTheme(next)
        setTheme(next)
      }}
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  )
}

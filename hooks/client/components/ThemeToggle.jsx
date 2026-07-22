import React, { useState, useEffect } from 'react'
import { getCurrentTheme, isClientLive } from '@clevertree/style-internal'
import { IconMoon, IconSun } from 'hooks/client/components/Icons.jsx'

/**
 * Dual light/dark rules already ship in #relay-ssr-theme. Toggling html.light /
 * html.dark is enough. Do NOT call setCurrentTheme here — it re-renders the full
 * tip stylesheet (~60KB) and stalls the Dom host so the button feels dead.
 * Also omit data-theme attrs: embed click delegation would invoke setCurrentTheme.
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

function resolveTheme(allowSystem) {
  const saved = readSavedTheme()
  if (saved === 'dark' || saved === 'light') return saved
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

  useEffect(() => {
    if (!live) return
    const resolved = resolveTheme(true)
    setTheme(resolved)
    applyThemeClass(resolved)
  }, [live])

  return (
    <button
      type="button"
      id="pt-theme-toggle"
      className="pt-icon-btn"
      title={live ? 'Toggle theme' : 'Theme toggle available after page loads'}
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

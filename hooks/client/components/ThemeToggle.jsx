import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'

/**
 * Flip html.light / html.dark only. Dual theme CSS is already in #relay-ssr-theme.
 * Do not call setCurrentTheme or set data-theme (both stall / re-inject CSS).
 */

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
  const state = useState('light')
  const theme = state[0]
  const setTheme = state[1]

  useEffect(() => {
    if (!live) return
    const resolved = resolveInitialTheme()
    setTheme(resolved)
    applyThemeClass(resolved)
  }, [live])

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
      {theme === 'dark' ? 'Sun' : 'Moon'}
    </button>
  )
}

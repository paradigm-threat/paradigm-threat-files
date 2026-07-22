import React, { useState, useEffect } from 'react'
import { setCurrentTheme, getCurrentTheme, isClientLive } from '@clevertree/style-internal'
import { IconMoon, IconSun } from 'hooks/client/components/Icons.jsx'

function readSystemDark() {
  try {
    const g = globalThis
    if (!g || !g.matchMedia) return false
    return g.matchMedia('(prefers-color-scheme: dark)').matches === true
  } catch (e) {
    return false
  }
}

function resolveTheme(allowSystem) {
  const stored = getCurrentTheme()
  if (stored === 'dark' || stored === 'light') return stored
  // SSR + first hydrate pass must match: never read matchMedia until live.
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
    // Keep html class / injected CSS aligned with resolved preference.
    try {
      setCurrentTheme(resolved)
    } catch (e) {}
  }, [live])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      id="pt-theme-toggle"
      className="pt-icon-btn"
      title={live ? 'Toggle theme' : 'Theme toggle available after page loads'}
      disabled={!live}
      dataTheme={next}
      onClick={() => {
        if (!live) return
        setCurrentTheme(next)
        setTheme(next)
      }}
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  )
}

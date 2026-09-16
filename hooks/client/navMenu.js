/**
 * Soft-hydrate: useState remounts are unreliable for the hamburger.
 * Toggle data-pt-nav-open on .pt-site-nav (CSS shows the always-mounted panel).
 * Nav.jsx onClick is primary (ThemeToggle pattern); this binder is a backup.
 * Use bare `document` (CleverScript tip Dom) — not globalThis / window.
 */
let navMenuBound = false

function isBrowserDom() {
  try {
    if (typeof document === 'undefined') return false
    if (!document || !document.body) return false
    if (typeof document.addEventListener !== 'function') return false
  } catch (e) {
    return false
  }
  return true
}

function headerEl() {
  try {
    if (!isBrowserDom()) return null
    return document.querySelector('.pt-site-nav')
  } catch (e) {
    return null
  }
}

function menuBtn() {
  try {
    if (!isBrowserDom()) return null
    return document.querySelector('.pt-nav-menu-btn')
  } catch (e) {
    return null
  }
}

function isOpen(header) {
  try {
    return header && header.getAttribute('data-pt-nav-open') === '1'
  } catch (e) {
    return false
  }
}

export function setNavMenuOpen(open) {
  const header = headerEl()
  try {
    if (!header) return
    header.setAttribute('data-pt-nav-open', open ? '1' : '0')
  } catch (e) {}
  try {
    const btn = menuBtn()
    if (!btn) return
    btn.setAttribute('aria-expanded', open ? 'true' : 'false')
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  } catch (e2) {}
}

export function toggleNavMenu() {
  const header = headerEl()
  if (!header) return
  setNavMenuOpen(isOpen(header) !== true)
}

export function ensureNavMenu() {
  if (navMenuBound === true) return
  if (isBrowserDom() !== true) return
  try {
    const onClick = (e) => {
      try {
        let t = null
        if (e && e.target) t = e.target
        if (!t) return
        let btn = null
        try {
          if (typeof t.closest === 'function') btn = t.closest('.pt-nav-menu-btn')
        } catch (eClosest) {}
        if (!btn) return
        try {
          if (btn.disabled === true) return
        } catch (eDis) {}
        toggleNavMenu()
      } catch (eClick) {}
    }
    document.addEventListener('click', onClick)
    navMenuBound = true
  } catch (eBind) {}
}

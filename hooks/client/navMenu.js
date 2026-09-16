/**
 * Soft-hydrate wires onClick, but useState remounts are unreliable for the
 * hamburger. Toggle data-pt-nav-open on .pt-site-nav instead (CSS shows panel).
 */
let navMenuBound = false

function str(v) {
  if (v === null) return ''
  if (typeof v === 'boolean') {
    if (v) return 'true'
    return 'false'
  }
  if (typeof v === 'number') return '' + v
  if (typeof v === 'string') return v
  return ''
}

function headerEl() {
  try {
    if (!document || !document.querySelector) return null
    return document.querySelector('.pt-site-nav')
  } catch (e) {
    return null
  }
}

function menuBtn() {
  try {
    if (!document || !document.querySelector) return null
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

function setOpen(header, open) {
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

export function ensureNavMenu() {
  if (navMenuBound === true) return
  try {
    const g = globalThis
    if (!g || !g.document || typeof g.document.addEventListener !== 'function') return
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
        const header = headerEl()
        if (!header) return
        setOpen(header, isOpen(header) !== true)
      } catch (eClick) {}
    }
    g.document.addEventListener('click', onClick)
    navMenuBound = true
  } catch (eBind) {}
}

/** Optional: close drawer after in-drawer nav (same-tab) clicks. */
export function ensureNavMenuAutoClose() {
  try {
    const g = globalThis
    if (!g || !g.document || typeof g.document.addEventListener !== 'function') return
    g.document.addEventListener('click', (e) => {
      try {
        let t = null
        if (e && e.target) t = e.target
        if (!t || typeof t.closest !== 'function') return
        const link = t.closest('.pt-nav-mobile a')
        if (!link) return
        const header = headerEl()
        if (header) setOpen(header, false)
      } catch (e2) {}
    })
  } catch (e3) {}
}

export function navMenuSeedAttr() {
  return str('0')
}

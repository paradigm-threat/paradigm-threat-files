/**
 * Soft-hydrate leaves CleverScript onClick unwired on SSR search chrome.
 * Bind native form submit → /search/{topic} so the first paint SSR-fills results.
 * Also seed #pt-search-input once per session (CleverScript emits defaultValue as a
 * non-HTML attr; value= is correct, but soft-hydrate must not clobber typing).
 * Use bare `document` / tip Dom — not globalThis / window.
 */
import { siteHref } from 'hooks/client/loadArticles.jsx'

let searchFormNavBound = false
let searchInputSeeded = false

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

function topicPathSegment(q) {
  const raw = str(q).trim()
  let out = ''
  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charAt(i)
    const code = raw.charCodeAt(i)
    if (ch === ' ' || ch === '\t') {
      if (out.length > 0 && out.charAt(out.length - 1) !== '_') {
        out = out + '_'
      }
      continue
    }
    if (
      (code >= 48 && code <= 57) ||
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      ch === '_' ||
      ch === '-'
    ) {
      out = out + ch
    }
  }
  return out
}

/** Skip SSR hosts — never mark bound against a non-browser document. */
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

function seedFromLocation() {
  try {
    if (typeof location === 'undefined' || !location) return ''
    const path = typeof location.pathname === 'string' ? location.pathname : ''
    const marker = '/search/'
    const idx = path.indexOf(marker)
    if (idx >= 0) {
      let rest = path.slice(idx + marker.length)
      const slash = rest.indexOf('/')
      if (slash >= 0) rest = rest.slice(0, slash)
      rest = rest.split('_').join(' ')
      if (rest.length > 0) return str(rest).trim()
    }
    const s = typeof location.search === 'string' ? location.search : ''
    if (s.indexOf('q=') < 0) return ''
    let raw = s
    if (raw.charAt(0) === '?') raw = raw.slice(1)
    const parts = raw.split('&')
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (p.indexOf('q=') === 0) {
        let v = p.slice(2)
        v = v.split('+').join(' ')
        return str(v).trim()
      }
    }
  } catch (e) {}
  return ''
}

/** Fill the search box once; never overwrite if the user already typed. */
export function ensureSearchInputSeed() {
  if (searchInputSeeded === true) return
  if (isBrowserDom() !== true) return
  try {
    const inp = document.querySelector('#pt-search-input')
    if (!inp) return
    let cur = ''
    try {
      if (typeof inp.value === 'string') cur = str(inp.value).trim()
    } catch (eVal) {}
    if (cur.length > 0) {
      searchInputSeeded = true
      return
    }
    let seed = ''
    try {
      const form = document.querySelector('#pt-search-form')
      if (form) {
        const attr = form.getAttribute('data-pt-search-seed')
        if (typeof attr === 'string') seed = str(attr).trim()
      }
    } catch (eAttr) {}
    if (seed.length === 0) seed = seedFromLocation()
    if (seed.length === 0) {
      searchInputSeeded = true
      return
    }
    try {
      inp.value = seed
    } catch (eSet) {}
    searchInputSeeded = true
  } catch (e) {}
}

export function ensureSearchFormNav() {
  if (searchFormNavBound === true) {
    ensureSearchInputSeed()
    return
  }
  if (isBrowserDom() !== true) return
  try {
    const onSubmit = (e) => {
      try {
        let form = null
        if (e && e.target) form = e.target
        try {
          let tag = ''
          try {
            if (form && form.tagName) tag = '' + form.tagName
          } catch (eTag) {}
          if (form && tag !== 'FORM' && tag !== 'form') {
            if (typeof form.closest === 'function') form = form.closest('form')
          }
        } catch (eClosest) {}
        if (!form) return
        let id = ''
        try {
          id = form.id
        } catch (eId) {}
        if (id !== 'pt-search-form') return
        let q = ''
        try {
          const inp = form.querySelector('#pt-search-input')
          if (inp && typeof inp.value === 'string') q = str(inp.value).trim()
        } catch (eInp) {}
        const seg = topicPathSegment(q)
        if (seg.length === 0) return
        try {
          if (e && typeof e.preventDefault === 'function') e.preventDefault()
        } catch (ePrev) {}
        const dest = siteHref('/search/' + seg)
        try {
          if (typeof location !== 'undefined' && location) {
            if (typeof location.assign === 'function') {
              location.assign(dest)
            } else {
              location.href = dest
            }
          }
        } catch (eLoc) {}
      } catch (eSub) {}
    }
    document.addEventListener('submit', onSubmit)
    searchFormNavBound = true
    ensureSearchInputSeed()
  } catch (eBind) {}
}

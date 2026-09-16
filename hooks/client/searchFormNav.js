/**
 * Soft-hydrate leaves CleverScript onClick unwired on SSR search chrome.
 * Bind native form submit → /search/{topic} so the first paint SSR-fills results.
 */
import { siteHref } from 'hooks/client/loadArticles.jsx'

let searchFormNavBound = false

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

export function ensureSearchFormNav() {
  if (searchFormNavBound === true) return
  try {
    const g = globalThis
    if (!g || !g.document || typeof g.document.addEventListener !== 'function') return
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
          if (g.location && typeof g.location.assign === 'function') {
            g.location.assign(dest)
          } else if (g.location) {
            g.location.href = dest
          }
        } catch (eLoc) {}
      } catch (eSub) {}
    }
    g.document.addEventListener('submit', onSubmit)
    searchFormNavBound = true
  } catch (eBind) {}
}

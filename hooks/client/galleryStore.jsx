/**
 * Gallery store — CleverScript-safe via a real DOM bus element.
 * Module const/let and document custom props are unreliable; attributes stick.
 */

function bus() {
  try {
    if (!document || !document.getElementById) return null
    let el = document.getElementById('pt-gallery-bus')
    if (el) return el
    if (!document.documentElement || !document.createElement) return null
    el = document.createElement('div')
    el.id = 'pt-gallery-bus'
    el.setAttribute('hidden', 'true')
    el.setAttribute('aria-hidden', 'true')
    el.setAttribute('data-images', '[]')
    el.setAttribute('data-override', '')
    el.setAttribute('data-index', '-1')
    el.setAttribute('data-open', '0')
    el.setAttribute('data-rev', '0')
    document.documentElement.appendChild(el)
    return el
  } catch (e) {
    return null
  }
}

function strSrc(v) {
  if (typeof v === 'string') return v
  return ''
}

function parseList(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return []
  try {
    const v = JSON.parse(raw)
    if (v && typeof v.length === 'number') return v
  } catch (e) {}
  return []
}

function readImages() {
  const el = bus()
  if (!el) return []
  const override = el.getAttribute('data-override')
  if (typeof override === 'string' && override.length > 2) {
    return parseList(override)
  }
  return parseList(el.getAttribute('data-images'))
}

function writeImages(list) {
  const el = bus()
  if (!el) return
  try {
    el.setAttribute('data-images', JSON.stringify(list))
  } catch (e) {}
}

function bump() {
  const el = bus()
  if (!el) return
  let rev = 0
  try {
    const raw = el.getAttribute('data-rev')
    rev = typeof raw === 'string' ? parseInt(raw, 10) : 0
    if (!(rev >= 0)) rev = 0
  } catch (e) {
    rev = 0
  }
  el.setAttribute('data-rev', '' + (rev + 1))
}

function isAlnumChar(c) {
  if (c >= '0' && c <= '9') return true
  if (c >= 'A' && c <= 'Z') return true
  if (c >= 'a' && c <= 'z') return true
  return false
}

function imgEntry(img) {
  const src = strSrc(img && img.src)
  if (src.length === 0) return null
  const alt = img && typeof img.alt === 'string' ? img.alt : ''
  const highResSrc =
    img && typeof img.highResSrc === 'string' ? img.highResSrc : ''
  // children (JSX) are not JSON-serializable — captions fall back to alt/filename
  return { src: src, alt: alt, highResSrc: highResSrc }
}

export function galleryRev() {
  const el = bus()
  if (!el) return 0
  try {
    const raw = el.getAttribute('data-rev')
    const n = typeof raw === 'string' ? parseInt(raw, 10) : 0
    if (n >= 0) return n
  } catch (e) {}
  return 0
}

export function gallerySubscribe(fn) {
  let last = galleryRev()
  let active = true
  function tick() {
    if (!active) return
    const rev = galleryRev()
    if (rev !== last) {
      last = rev
      try {
        fn(rev)
      } catch (e) {}
    }
    try {
      if (document && document.defaultView && document.defaultView.setTimeout) {
        document.defaultView.setTimeout(tick, 80)
        return
      }
    } catch (e2) {}
    try {
      setTimeout(tick, 80)
    } catch (e3) {}
  }
  tick()
  return () => {
    active = false
  }
}

export function galleryImages() {
  return readImages()
}

export function galleryIndex() {
  const el = bus()
  if (!el) return -1
  try {
    const raw = el.getAttribute('data-index')
    const n = typeof raw === 'string' ? parseInt(raw, 10) : -1
    if (n === n) return n
  } catch (e) {}
  return -1
}

export function galleryIsOpen() {
  const el = bus()
  if (!el) return false
  return el.getAttribute('data-open') === '1'
}

export function registerGalleryImage(img) {
  const entry = imgEntry(img)
  if (!entry) return
  const list = readImages()
  for (let i = 0; i < list.length; i++) {
    if (strSrc(list[i].src) === entry.src) return
  }
  writeImages(list.concat([entry]))
  bump()
}

export function syncGalleryImageMeta(img) {
  const entry = imgEntry(img)
  if (!entry) return
  const list = readImages()
  let next = []
  let found = false
  for (let i = 0; i < list.length; i++) {
    if (strSrc(list[i].src) === entry.src) {
      found = true
      next = next.concat([entry])
    } else {
      next = next.concat([list[i]])
    }
  }
  if (!found) return
  writeImages(next)
}

export function unregisterGalleryImage(srcRaw) {
  const src = strSrc(srcRaw)
  if (src.length === 0) return
  const list = readImages()
  let next = []
  let found = false
  for (let i = 0; i < list.length; i++) {
    if (strSrc(list[i].src) === src) {
      found = true
    } else {
      next = next.concat([list[i]])
    }
  }
  if (!found) return
  writeImages(next)
  bump()
}

export function openGalleryAt(srcRaw) {
  const src = strSrc(srcRaw)
  const list = readImages()
  let idx = -1
  for (let i = 0; i < list.length; i++) {
    if (strSrc(list[i].src) === src) {
      idx = i
      break
    }
  }
  if (idx < 0) {
    // Not registered yet — still open as single-item override
    const el = bus()
    if (!el) return
    try {
      el.setAttribute(
        'data-override',
        JSON.stringify([{ src: src, alt: '', highResSrc: '' }]),
      )
      el.setAttribute('data-index', '0')
      el.setAttribute('data-open', '1')
      bump()
    } catch (e) {}
    return
  }
  const el = bus()
  if (!el) return
  el.setAttribute('data-override', '')
  el.setAttribute('data-index', '' + idx)
  el.setAttribute('data-open', '1')
  bump()
}

export function openGallery(items, startIndex) {
  let list = []
  if (items && typeof items.length === 'number') {
    for (let i = 0; i < items.length; i++) {
      const entry = imgEntry(items[i])
      if (entry) list = list.concat([entry])
    }
  }
  if (list.length === 0) return
  let idx = typeof startIndex === 'number' ? startIndex : 0
  if (idx < 0) idx = 0
  if (idx >= list.length) idx = list.length - 1
  const el = bus()
  if (!el) return
  try {
    el.setAttribute('data-override', JSON.stringify(list))
  } catch (e) {
    return
  }
  el.setAttribute('data-index', '' + idx)
  el.setAttribute('data-open', '1')
  bump()
}

export function closeGallery() {
  const el = bus()
  if (!el) return
  if (el.getAttribute('data-open') !== '1' && !el.getAttribute('data-override')) {
    return
  }
  el.setAttribute('data-open', '0')
  el.setAttribute('data-override', '')
  try {
    const loc = document.location
    if (loc && typeof loc.hash === 'string' && loc.hash.indexOf('#img=') === 0) {
      loc.hash = ''
    }
  } catch (e) {}
  bump()
}

export function galleryGoNext() {
  const list = readImages()
  if (list.length <= 1) return
  const el = bus()
  if (!el) return
  let idx = galleryIndex()
  idx = (idx + 1) % list.length
  el.setAttribute('data-index', '' + idx)
  bump()
}

export function galleryGoPrev() {
  const list = readImages()
  if (list.length <= 1) return
  const el = bus()
  if (!el) return
  let idx = galleryIndex()
  idx = (idx - 1 + list.length) % list.length
  el.setAttribute('data-index', '' + idx)
  bump()
}

export function setGalleryHash(srcRaw) {
  const src = strSrc(srcRaw)
  if (src.length === 0) return
  try {
    const loc = document.location
    if (!loc) return
    const hash = '#img=' + src
    if (loc.hash === hash) return
    loc.hash = 'img=' + src
  } catch (e) {}
}

export function readHashImgSrc() {
  try {
    const loc = document.location
    if (!loc || typeof loc.hash !== 'string') return ''
    const hash = loc.hash
    if (hash.indexOf('#img=') !== 0) return ''
    return hash.slice(5)
  } catch (e) {
    return ''
  }
}

export function galleryDisplaySrc(img) {
  if (!img) return ''
  const hi = typeof img.highResSrc === 'string' ? img.highResSrc : ''
  const src = strSrc(img.src)
  if (hi.length > 0) return hi
  return src
}

export function safeImgDomId(srcRaw) {
  const src = strSrc(srcRaw)
  if (src.length === 0) return 'img-unknown'
  let out = 'img-'
  for (let i = 0; i < src.length; i++) {
    const c = src.charAt(i)
    if (isAlnumChar(c)) out = out + c
    else out = out + '-'
  }
  return out
}

/**
 * Module gallery state on globalThis (no React Context / no module const).
 * CleverScript: nested scopes cannot see module-level const/lets reliably.
 */

function root() {
  const g = globalThis
  if (!g.__ptGallery) {
    g.__ptGallery = {
      images: [],
      override: null,
      index: -1,
      open: false,
      rev: 0,
      listeners: [],
    }
  }
  return g.__ptGallery
}

function emit() {
  const s = root()
  s.rev = s.rev + 1
  const list = s.listeners
  for (let i = 0; i < list.length; i++) {
    try {
      list[i](s.rev)
    } catch (e) {}
  }
}

export function galleryRev() {
  return root().rev
}

export function gallerySubscribe(fn) {
  const s = root()
  s.listeners = s.listeners.concat([fn])
  return function unsubscribe() {
    const cur = root()
    let next = []
    for (let i = 0; i < cur.listeners.length; i++) {
      if (cur.listeners[i] !== fn) next = next.concat([cur.listeners[i]])
    }
    cur.listeners = next
  }
}

export function galleryImages() {
  const s = root()
  if (s.override) return s.override
  return s.images
}

export function galleryIndex() {
  return root().index
}

export function galleryIsOpen() {
  return root().open === true
}

function strSrc(v) {
  if (typeof v === 'string') return v
  return ''
}

export function registerGalleryImage(img) {
  const src = strSrc(img && img.src)
  if (src.length === 0) return
  const s = root()
  for (let i = 0; i < s.images.length; i++) {
    if (strSrc(s.images[i].src) === src) return
  }
  const alt = img && typeof img.alt === 'string' ? img.alt : ''
  const highResSrc =
    img && typeof img.highResSrc === 'string' ? img.highResSrc : ''
  let children = null
  try {
    if (img && img.children !== null && img.children !== undefined) {
      children = img.children
    }
  } catch (e) {}
  s.images = s.images.concat([
    { src: src, alt: alt, highResSrc: highResSrc, children: children },
  ])
  emit()
}

export function syncGalleryImageMeta(img) {
  const src = strSrc(img && img.src)
  if (src.length === 0) return
  const s = root()
  for (let i = 0; i < s.images.length; i++) {
    if (strSrc(s.images[i].src) === src) {
      const prev = s.images[i]
      const alt =
        img && typeof img.alt === 'string' ? img.alt : prev.alt
      const highResSrc =
        img && typeof img.highResSrc === 'string'
          ? img.highResSrc
          : prev.highResSrc
      let children = prev.children
      try {
        if (img && img.children !== null && img.children !== undefined) {
          children = img.children
        }
      } catch (e) {}
      let next = []
      for (let j = 0; j < s.images.length; j++) {
        if (j === i) {
          next = next.concat([
            {
              src: src,
              alt: alt,
              highResSrc: highResSrc,
              children: children,
            },
          ])
        } else {
          next = next.concat([s.images[j]])
        }
      }
      s.images = next
      return
    }
  }
}

export function unregisterGalleryImage(srcRaw) {
  const src = strSrc(srcRaw)
  if (src.length === 0) return
  const s = root()
  let next = []
  let found = false
  for (let i = 0; i < s.images.length; i++) {
    if (strSrc(s.images[i].src) === src) {
      found = true
    } else {
      next = next.concat([s.images[i]])
    }
  }
  if (!found) return
  s.images = next
  emit()
}

export function openGalleryAt(srcRaw) {
  const src = strSrc(srcRaw)
  const list = galleryImages()
  let idx = -1
  for (let i = 0; i < list.length; i++) {
    if (strSrc(list[i].src) === src) {
      idx = i
      break
    }
  }
  if (idx < 0) return
  const s = root()
  s.index = idx
  s.open = true
  emit()
}

export function openGallery(items, startIndex) {
  let list = []
  if (items && typeof items.length === 'number') {
    for (let i = 0; i < items.length; i++) {
      const src = strSrc(items[i] && items[i].src)
      if (src.length === 0) continue
      const alt =
        items[i] && typeof items[i].alt === 'string' ? items[i].alt : ''
      const highResSrc =
        items[i] && typeof items[i].highResSrc === 'string'
          ? items[i].highResSrc
          : ''
      let children = null
      try {
        if (
          items[i] &&
          items[i].children !== null &&
          items[i].children !== undefined
        ) {
          children = items[i].children
        }
      } catch (e) {}
      list = list.concat([
        { src: src, alt: alt, highResSrc: highResSrc, children: children },
      ])
    }
  }
  if (list.length === 0) return
  let idx = typeof startIndex === 'number' ? startIndex : 0
  if (idx < 0) idx = 0
  if (idx >= list.length) idx = list.length - 1
  const s = root()
  s.override = list
  s.index = idx
  s.open = true
  emit()
}

export function closeGallery() {
  const s = root()
  if (s.open !== true && !s.override) return
  s.open = false
  s.override = null
  try {
    const g = globalThis
    if (g && g.location && typeof g.location.hash === 'string') {
      if (g.location.hash.indexOf('#img=') === 0 && g.history && g.history.replaceState) {
        const path =
          typeof g.location.pathname === 'string' ? g.location.pathname : ''
        const search =
          typeof g.location.search === 'string' ? g.location.search : ''
        g.history.replaceState(null, '', path + search)
      }
    }
  } catch (e) {}
  emit()
}

export function galleryGoNext() {
  const list = galleryImages()
  if (list.length <= 1) return
  const s = root()
  s.index = (s.index + 1) % list.length
  emit()
}

export function galleryGoPrev() {
  const list = galleryImages()
  if (list.length <= 1) return
  const s = root()
  s.index = (s.index - 1 + list.length) % list.length
  emit()
}

export function setGalleryHash(srcRaw) {
  const src = strSrc(srcRaw)
  if (src.length === 0) return
  try {
    const g = globalThis
    if (!g || !g.history || !g.history.replaceState) return
    let enc = src
    try {
      if (typeof encodeURIComponent === 'function') enc = encodeURIComponent(src)
    } catch (e) {}
    const hash = '#img=' + enc
    if (g.location && g.location.hash === hash) return
    g.history.replaceState(null, '', hash)
  } catch (e) {}
}

export function readHashImgSrc() {
  try {
    const g = globalThis
    if (!g || !g.location || typeof g.location.hash !== 'string') return ''
    const hash = g.location.hash
    if (hash.indexOf('#img=') !== 0) return ''
    const raw = hash.slice(5)
    try {
      if (typeof decodeURIComponent === 'function') return decodeURIComponent(raw)
    } catch (e) {}
    return raw
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
    const code = src.charCodeAt(i)
    const isNum = code >= 48 && code <= 57
    const isUpper = code >= 65 && code <= 90
    const isLower = code >= 97 && code <= 122
    if (isNum || isUpper || isLower) out = out + c
    else out = out + '-'
  }
  return out
}

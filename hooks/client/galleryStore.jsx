/**
 * Gallery state singleton.
 * CleverScript: module-level `const` object bindings read as Undefined inside
 * nested `function` bodies — use lazy `let` init instead. Avoid encodeURIComponent /
 * charCodeAt / window.
 */

let store = null

function root() {
  if (store) {
    return store
  }
  store = {
    images: [],
    override: null,
    index: -1,
    open: false,
    rev: 0,
    listeners: [],
  }
  return store
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
  return () => {
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
    if (img && img.children !== null) {
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
        if (img && img.children !== null) {
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
        if (items[i] && items[i].children !== null) {
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
    const loc = document.location
    if (loc && typeof loc.hash === 'string' && loc.hash.indexOf('#img=') === 0) {
      loc.hash = ''
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

function isAlnumChar(c) {
  if (c >= '0' && c <= '9') return true
  if (c >= 'A' && c <= 'Z') return true
  if (c >= 'a' && c <= 'z') return true
  return false
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

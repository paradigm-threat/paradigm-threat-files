/**
 * Gallery store — closed-over mutable state via `export const gallery = create…()`.
 * Path/hash/id helpers live in `@relay/path` (web + mobile WASM).
 */
import {
  safeImgDomId as pathSafeImgDomId,
  readHashImgSrc as pathReadHashImgSrc,
  galleryImgHash as pathGalleryImgHash,
  galleryDisplaySrc as pathGalleryDisplaySrc,
} from '@relay/path'

function strSrc(v) {
  if (typeof v === 'string') return v
  return ''
}

function createGalleryApi() {
  let s = {
    images: [],
    override: null,
    index: 0 - 1,
    open: false,
    rev: 0,
    listeners: [],
  }

  function emit() {
    s.rev = s.rev + 1
    const list = s.listeners
    for (let i = 0; i < list.length; i++) {
      try {
        list[i](s.rev)
      } catch (e) {}
    }
  }

  function images() {
    if (s.override) return s.override
    return s.images
  }

  function galleryRev() {
    return s.rev
  }

  function gallerySubscribe(fn) {
    s.listeners = s.listeners.concat([fn])
    return () => {
      let next = []
      for (let i = 0; i < s.listeners.length; i++) {
        if (s.listeners[i] !== fn) {
          next = next.concat([s.listeners[i]])
        }
      }
      s.listeners = next
    }
  }

  function galleryImages() {
    return images()
  }

  function galleryIndex() {
    return s.index
  }

  function galleryIsOpen() {
    return s.open === true
  }

  function registerGalleryImage(img) {
    const src = strSrc(img && img.src)
    if (src.length === 0) return
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

  function syncGalleryImageMeta(img) {
    const src = strSrc(img && img.src)
    if (src.length === 0) return
    for (let i = 0; i < s.images.length; i++) {
      if (strSrc(s.images[i].src) === src) {
        const prev = s.images[i]
        const alt = img && typeof img.alt === 'string' ? img.alt : prev.alt
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

  function unregisterGalleryImage(srcRaw) {
    const src = strSrc(srcRaw)
    if (src.length === 0) return
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

  function openGalleryAt(srcRaw) {
    const src = strSrc(srcRaw)
    const list = images()
    let idx = 0 - 1
    for (let i = 0; i < list.length; i++) {
      if (strSrc(list[i].src) === src) {
        idx = i
        break
      }
    }
    if (idx < 0) {
      const one = { src: src, alt: '', highResSrc: '', children: null }
      s.override = [one]
      s.index = 0
      s.open = true
      emit()
      return
    }
    s.override = null
    s.index = idx
    s.open = true
    emit()
  }

  function openGallery(items, startIndex) {
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
    s.override = list
    s.index = idx
    s.open = true
    emit()
  }

  function closeGallery() {
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

  function galleryGoNext() {
    const list = images()
    if (list.length <= 1) return
    s.index = (s.index + 1) % list.length
    emit()
  }

  function galleryGoPrev() {
    const list = images()
    if (list.length <= 1) return
    s.index = (s.index - 1 + list.length) % list.length
    emit()
  }

  function setGalleryHash(srcRaw) {
    const src = strSrc(srcRaw)
    if (src.length === 0) return
    try {
      const loc = document.location
      if (!loc) return
      let hashBody = ''
      try {
        hashBody = pathGalleryImgHash(src)
      } catch (e0) {
        hashBody = 'img=' + src
      }
      if (hashBody.length === 0) return
      const hash = '#' + hashBody
      if (loc.hash === hash) return
      loc.hash = hashBody
    } catch (e) {}
  }

  function readHashImgSrc() {
    try {
      const loc = document.location
      if (!loc || typeof loc.hash !== 'string') return ''
      try {
        const out = pathReadHashImgSrc(loc.hash)
        if (typeof out === 'string') return out
      } catch (e0) {}
      return ''
    } catch (e) {
      return ''
    }
  }

  function galleryDisplaySrc(img) {
    if (!img) return ''
    const hi = typeof img.highResSrc === 'string' ? img.highResSrc : ''
    const src = strSrc(img.src)
    try {
      const out = pathGalleryDisplaySrc(src, hi)
      if (typeof out === 'string') return out
    } catch (e) {}
    if (hi.length > 0) return hi
    return src
  }

  function safeImgDomId(srcRaw) {
    try {
      const out = pathSafeImgDomId(strSrc(srcRaw))
      if (typeof out === 'string' && out.length > 0) return out
    } catch (e) {}
    return 'img-unknown'
  }

  return {
    galleryRev: galleryRev,
    gallerySubscribe: gallerySubscribe,
    galleryImages: galleryImages,
    galleryIndex: galleryIndex,
    galleryIsOpen: galleryIsOpen,
    registerGalleryImage: registerGalleryImage,
    syncGalleryImageMeta: syncGalleryImageMeta,
    unregisterGalleryImage: unregisterGalleryImage,
    openGalleryAt: openGalleryAt,
    openGallery: openGallery,
    closeGallery: closeGallery,
    galleryGoNext: galleryGoNext,
    galleryGoPrev: galleryGoPrev,
    setGalleryHash: setGalleryHash,
    readHashImgSrc: readHashImgSrc,
    galleryDisplaySrc: galleryDisplaySrc,
    safeImgDomId: safeImgDomId,
  }
}

export const gallery = createGalleryApi()

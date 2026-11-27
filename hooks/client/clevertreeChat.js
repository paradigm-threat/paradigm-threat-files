/**
 * Load single Clevertree room + PT overlay SoT from clevertree.chat CDN.
 * Shared by ArticleTtsDock + ChatRoomLive (no duplicate UI).
 */
const BASE = 'https://clevertree.chat'
const SCRIPTS = [
  BASE + '/fronts/room/context-tags.js',
  BASE + '/fronts/room/channel-route.js',
  BASE + '/fronts/room/clevertree-room.js',
  BASE + '/fronts/room/chat-launcher.js',
  BASE + '/fronts/room/clevertree-ces.js',
  BASE + '/fronts/site-chrome/pt-bottom-overlay.js',
]
const STYLES = [
  BASE + '/fronts/room/tokens.css',
  BASE + '/fronts/room/clevertree-room.css',
  BASE + '/fronts/site-chrome/pt-bottom-overlay.css',
]

let loadPromise = null
let topicsCache = null

function loadCss(href) {
  try {
    if (document.querySelector('link[data-ct-asset="' + href + '"]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-ct-asset', href)
    document.head.appendChild(link)
  } catch (e) {}
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    try {
      const existing = document.querySelector('script[data-ct-asset="' + src + '"]')
      if (existing) {
        if (existing.getAttribute('data-loaded') === '1') {
          resolve()
          return
        }
        existing.addEventListener('load', function () {
          resolve()
        })
        existing.addEventListener('error', function () {
          reject(new Error(src))
        })
        return
      }
      const s = document.createElement('script')
      s.src = src
      s.async = false
      s.setAttribute('data-ct-asset', src)
      s.onload = function () {
        s.setAttribute('data-loaded', '1')
        resolve()
      }
      s.onerror = function () {
        reject(new Error(src))
      }
      document.head.appendChild(s)
    } catch (e) {
      reject(e)
    }
  })
}

export function ensureClevertreeAssets() {
  if (typeof document === 'undefined') return Promise.resolve()
  if (loadPromise) return loadPromise
  for (let i = 0; i < STYLES.length; i++) loadCss(STYLES[i])
  loadPromise = Promise.resolve()
  for (let j = 0; j < SCRIPTS.length; j++) {
    ;(function (src) {
      loadPromise = loadPromise.then(function () {
        return loadScript(src)
      })
    })(SCRIPTS[j])
  }
  return loadPromise
}

function slugify(raw) {
  let s = String(raw || '')
    .trim()
    .toLowerCase()
  if (s.charAt(0) === '#') s = s.slice(1)
  s = s.split('/').join('-')
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i)
    if (
      (ch >= 'a' && ch <= 'z') ||
      (ch >= '0' && ch <= '9') ||
      ch === '_' ||
      ch === '-'
    ) {
      out += ch
    } else {
      out += '-'
    }
  }
  while (out.indexOf('--') >= 0) out = out.split('--').join('-')
  while (out.charAt(0) === '-') out = out.slice(1)
  while (out.length && out.charAt(out.length - 1) === '-') out = out.slice(0, -1)
  if (out.length > 48) out = out.slice(0, 48)
  if (!out || out === 'general' || out === 'pt' || out === 'pt-general') return 'general'
  if (out.indexOf('pt-') === 0) {
    const rest = out.slice(3)
    return rest || 'general'
  }
  return out
}

export function topicIdFromSlug(slug, topics) {
  const key = slugify(slug)
  const list = topics && topics.topics ? topics.topics : []
  for (let i = 0; i < list.length; i++) {
    if (list[i] && list[i].slug === key) return list[i].id
  }
  return 0
}

export function loadTopics() {
  if (topicsCache) return Promise.resolve(topicsCache)
  return fetch('/chat/topics.json', { credentials: 'omit' })
    .then(function (r) {
      if (!r || !r.ok) throw new Error('topics')
      return r.json()
    })
    .then(function (j) {
      topicsCache = j
      return j
    })
    .catch(function () {
      topicsCache = {
        schema: 'clevertree.chat-topics.v1',
        irc_channel: '#pt',
        topics: [{ id: 0, slug: 'general', title: 'General', href: '/' }],
      }
      return topicsCache
    })
}

export function openPtChat(opts) {
  opts = opts || {}
  return ensureClevertreeAssets()
    .then(function () {
      return loadTopics()
    })
    .then(function (index) {
      const topicId =
        opts.topicId != null ? opts.topicId : topicIdFromSlug(opts.topicSlug, index)
      const L = typeof window !== 'undefined' ? window.ClevertreeChatLauncher : null
      if (!L || !L.open) throw new Error('ClevertreeChatLauncher missing')
      L.open({
        channel: '#pt',
        title: opts.title || 'Paradigm Threat',
        topicId: topicId,
        topics: index.topics || [],
        siteOrigin: location.origin,
        apiBase: 'https://api.clevertree.chat',
        dock: 'fullscreen',
        noFab: true,
      })
    })
}

export function togglePtChat(opts) {
  return ensureClevertreeAssets().then(function () {
    const L = window.ClevertreeChatLauncher
    if (!L) return
    if (L.isOpen && L.isOpen()) {
      L.close()
      return
    }
    return openPtChat(opts)
  })
}

export function closePtChat() {
  return ensureClevertreeAssets().then(function () {
    if (window.ClevertreeChatLauncher) window.ClevertreeChatLauncher.close()
  })
}

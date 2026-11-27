/**
 * Markdown <ChatRoom channel="…" /> → open shared Clevertree dock (#pt + [[t:N]]).
 * CleverScript-safe: loads CDN scripts at click time (no plain-.js import).
 */
import React from 'react'
import { propStr } from 'hooks/client/propOr.jsx'

const CT_BASE = 'https://clevertree.chat'
const TOPICS_URL = CT_BASE + '/fronts/site-chrome/pt-topics.json'

const CT_SCRIPTS = [
  CT_BASE + '/fronts/room/context-tags.js',
  CT_BASE + '/fronts/room/channel-route.js',
  CT_BASE + '/fronts/room/clevertree-room.js',
  CT_BASE + '/fronts/room/chat-launcher.js',
  CT_BASE + '/fronts/room/clevertree-ces.js',
]

function str(v) {
  if (v === null) return ''
  if (typeof v === 'undefined') return ''
  if (typeof v === 'string') return v
  return '' + v
}

function topicSlugFromChannel(channelProp) {
  let raw = str(channelProp).trim().toLowerCase()
  if (raw.charAt(0) === '#') raw = raw.slice(1)
  raw = raw.split('/').join('-')
  if (!raw || raw === 'general' || raw === 'pt' || raw === 'pt-general') return 'general'
  if (raw.indexOf('pt-') === 0) raw = raw.slice(3)
  return raw || 'general'
}

/** @deprecated name kept for imports; now returns topic slug not pt-* IRC key */
export function meshChannelFromChatRoom(channelProp) {
  return topicSlugFromChannel(channelProp)
}

function loadScriptSeq(i, done, fail) {
  if (i >= CT_SCRIPTS.length) {
    done()
    return
  }
  const src = CT_SCRIPTS[i]
  try {
    const existing = document.querySelector('script[data-ct-asset="' + src + '"]')
    if (existing && existing.getAttribute('data-loaded') === '1') {
      loadScriptSeq(i + 1, done, fail)
      return
    }
    const s = existing || document.createElement('script')
    if (!existing) {
      s.src = src
      s.async = false
      s.setAttribute('data-ct-asset', src)
      document.head.appendChild(s)
    }
    s.onload = () => {
      s.setAttribute('data-loaded', '1')
      loadScriptSeq(i + 1, done, fail)
    }
    s.onerror = () => {
      fail()
    }
  } catch (e) {
    fail()
  }
}

function topicIdFromSlug(slug, topics) {
  const key = topicSlugFromChannel(slug)
  const list = topics && topics.topics ? topics.topics : []
  let i = 0
  while (i < list.length) {
    if (list[i] && list[i].slug === key) return list[i].id
    i = i + 1
  }
  return 0
}

function openDock(topicId, topicSlug, title) {
  try {
    const L = window.ClevertreeChatLauncher
    if (!L || !L.open) return
    L.open({
      channel: '#pt',
      title: title || 'Paradigm Threat',
      topicId: topicId,
      topicSlug: topicSlug,
      siteOrigin: location.origin,
      apiBase: 'https://api.clevertree.chat',
      dock: 'fullscreen',
      noFab: true,
    })
  } catch (e) {}
}

export default function ChatRoomLive(props) {
  const p = props || {}
  const topicSlug = topicSlugFromChannel(propStr(p, 'channel', ''))
  const title = propStr(p, 'title', '')
  const label = title || 'Open chat · ' + topicSlug

  function onOpen() {
    loadScriptSeq(
      0,
      () => {
        try {
          fetch(TOPICS_URL, { credentials: 'omit' })
            .then((r) => {
              if (!r || !r.ok) {
                openDock(0, topicSlug, label)
                return null
              }
              return r.json()
            })
            .then((index) => {
              if (!index) return
              const topicId = topicIdFromSlug(topicSlug, index)
              openDock(topicId, topicSlug, label)
            })
            .catch(() => {
              openDock(0, topicSlug, label)
            })
        } catch (e) {
          openDock(0, topicSlug, label)
        }
      },
      () => {
        openDock(0, topicSlug, label)
      },
    )
  }

  return (
    <p className="pt-chatroom-open" data-pt-chatroom="1" data-topic={topicSlug}>
      <button
        type="button"
        className="pt-chat-open-btn"
        data-clevertree-chat-open="1"
        data-channel="#pt"
        data-topic-slug={topicSlug}
        onClick={onOpen}
      >
        {label}
      </button>
      <span className="pt-chat-open-meta">{' · #pt · topic ' + topicSlug}</span>
    </p>
  )
}

/**
 * Markdown <ChatRoom channel="…" /> → open shared Clevertree dock (#pt + [[t:N]]).
 * No in-article LiveChat embed.
 */
import React from 'react'
import { propStr } from 'hooks/client/propOr.jsx'
import { openPtChat, topicIdFromSlug, loadTopics } from 'hooks/client/clevertreeChat.js'

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

export default function ChatRoomLive(props) {
  const p = props || {}
  const topicSlug = topicSlugFromChannel(propStr(p, 'channel', ''))
  const title = propStr(p, 'title', '')
  const label = title || 'Open chat · ' + topicSlug

  function onOpen() {
    loadTopics()
      .then(function (index) {
        const topicId = topicIdFromSlug(topicSlug, index)
        return openPtChat({ topicId: topicId, topicSlug: topicSlug, title: label })
      })
      .catch(function () {
        return openPtChat({ topicSlug: topicSlug, title: label })
      })
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

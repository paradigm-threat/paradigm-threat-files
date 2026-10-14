/**
 * Markdown <ChatRoom channel="…" /> → mesh LiveChat on #pt-<topic>.
 * Matches JSONL import keys from ops/chat/scripts/import-pt-chat-public.mjs.
 *
 * CleverScript: avoid regex character-class negation ([^...]).
 */
import React from 'react'
import LiveChat from 'hooks/client/native/LiveChat.js'

function str(v) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  return '' + v
}

function isSlugChar(ch) {
  if (!ch || ch.length === 0) return false
  const c = ch.charAt(0)
  if (c >= 'a' && c <= 'z') return true
  if (c >= '0' && c <= '9') return true
  if (c === '_' || c === '-') return true
  return false
}

function slugifyTopic(raw) {
  let s = str(raw).trim().toLowerCase()
  if (s.charAt(0) === '#') s = s.slice(1)
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i)
    if (ch === '/') {
      out += '-'
    } else if (isSlugChar(ch)) {
      out += ch
    } else {
      out += '-'
    }
  }
  // collapse dashes
  let collapsed = ''
  let prevDash = false
  for (let i = 0; i < out.length; i++) {
    const ch = out.charAt(i)
    if (ch === '-') {
      if (!prevDash) collapsed += ch
      prevDash = true
    } else {
      collapsed += ch
      prevDash = false
    }
  }
  while (collapsed.charAt(0) === '-') {
    collapsed = collapsed.slice(1)
  }
  while (collapsed.length > 0 && collapsed.charAt(collapsed.length - 1) === '-') {
    collapsed = collapsed.slice(0, collapsed.length - 1)
  }
  if (collapsed.length > 48) collapsed = collapsed.slice(0, 48)
  return collapsed
}

/** Legacy ChatRoom channel → mesh key without leading #. */
export function meshChannelFromChatRoom(channelProp) {
  let raw = str(channelProp).trim().toLowerCase()
  if (raw.charAt(0) === '#') raw = raw.slice(1)
  if (!raw || raw === 'general') return 'pt-general'
  if (raw.indexOf('pt-') === 0) {
    const rest = slugifyTopic(raw.slice(3))
    return rest ? 'pt-' + rest : 'pt-general'
  }
  const s = slugifyTopic(raw)
  if (!s) return 'pt-general'
  return 'pt-' + s
}

export default function ChatRoomLive(props) {
  const p = props || {}
  const channel = meshChannelFromChatRoom(p.channel)
  return (
    <div className="pt-chatroom-live">
      <LiveChat prefix="pt" channel={channel} path="/" mode="embed" />
    </div>
  )
}

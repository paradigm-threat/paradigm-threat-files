/**
 * Markdown <ChatRoom channel="…" /> → mesh LiveChat on #pt-<topic>.
 * Matches JSONL import keys from ops/chat/scripts/import-pt-chat-public.mjs.
 */
import React from 'react'
import LiveChat from 'hooks/client/native/LiveChat.js'

function str(v) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  return '' + v
}

/** Legacy ChatRoom channel → mesh key without leading #. */
export function meshChannelFromChatRoom(channelProp) {
  let raw = str(channelProp).trim().toLowerCase()
  if (raw.charAt(0) === '#') raw = raw.slice(1)
  if (!raw || raw === 'general') return 'pt-general'
  if (raw.indexOf('pt-') === 0) return raw.replace(/[^a-z0-9_\-]/g, '-').slice(0, 48)
  let s = raw
    .split('/')
    .join('-')
    .replace(/[^a-z0-9_\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  if (!s) s = 'general'
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

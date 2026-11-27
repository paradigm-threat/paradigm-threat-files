/**
 * Legacy mesh LiveChat stub — retired.
 * Markdown chat uses ChatRoomLive (Clevertree #pt). This host only exists so
 * old data-relay-park-native=fb-live-chat mounts do not resurrect mesh UI.
 */
import React from 'react'
import ChatRoomLive from 'hooks/client/components/ChatRoomLive.jsx'
import { propStr } from 'hooks/client/propOr.jsx'

export default function LiveChat(props) {
  const p = props || {}
  const channel = propStr(p, 'channel', 'general')
  const title = propStr(p, 'title', 'Open chat')
  return <ChatRoomLive channel={channel} title={title} />
}

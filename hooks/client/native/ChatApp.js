/**
 * Legacy ChatApp stub — retired.
 * /chat is a pointer page; article overlay + ChatRoomLive open Clevertree #pt.
 */
import React from 'react'
import ChatRoomLive from 'hooks/client/components/ChatRoomLive.jsx'
import { propStr } from 'hooks/client/propOr.jsx'

export default function ChatApp(props) {
  const p = props || {}
  const channel = propStr(p, 'channel', 'general')
  return (
    <main className="pt-main pt-chat-page">
      <article className="pt-article">
        <h1>Chat is fullscreen now</h1>
        <p className="pt-muted">
          {
            'Everyone joins Clevertree Chat IRC #pt. Use the button below or the Chat control in the article overlay.'
          }
        </p>
        <ChatRoomLive channel={channel} title="Open Paradigm Threat chat" />
      </article>
    </main>
  )
}

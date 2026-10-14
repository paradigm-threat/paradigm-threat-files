/**
 * Full-page mesh chat lobby (#pt) for /chat.
 */
import React from 'react'
import ChatApp from 'hooks/client/native/ChatApp.js'
import { siteHref } from 'hooks/client/loadArticles.jsx'

function chatChannelFromLocation(fallback) {
  try {
    const g = globalThis
    if (!g || !g.location) return fallback
    const u = new URL(g.location.href)
    let c = u.searchParams.get('c') || u.searchParams.get('channel') || ''
    if (!c && u.hash) c = u.hash.replace(/^#/, '')
    c = String(c || '')
      .trim()
      .replace(/^#/, '')
    if (c) return c
  } catch (e) {}
  return fallback
}

export default function ChatPage() {
  const channel = chatChannelFromLocation('pt')
  return (
    <main className="pt-main pt-chat-page">
      <article className="pt-article">
        <p className="pt-back">
          <a href={siteHref('/')}>← Home</a>
        </p>
        <h1>Chat</h1>
        <p className="pt-muted">
          Live lobby and topic channels (imported history + mesh IRC). Pick a nick and join
          #pt or a #pt-* room.
        </p>
        <ChatApp channel={channel} />
      </article>
    </main>
  )
}

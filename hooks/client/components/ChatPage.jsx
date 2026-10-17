/**
 * Full-page mesh chat lobby (#pt-general) for /chat.
 * CleverScript-safe (no regex character-class negation).
 */
import React from 'react'
import ChatApp from 'hooks/client/native/ChatApp.js'
import { siteHref } from 'hooks/client/loadArticles.jsx'

const DEFAULT_LOBBY = 'pt-general'

function chatChannelFromLocation(fallback) {
  try {
    const g = globalThis
    if (!g || !g.location) return fallback
    const href = '' + g.location.href
    let c = ''
    const qAt = href.indexOf('?')
    if (qAt >= 0) {
      let q = href.slice(qAt + 1)
      const hashAt = q.indexOf('#')
      if (hashAt >= 0) q = q.slice(0, hashAt)
      const parts = q.split('&')
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        if (p.indexOf('c=') === 0) {
          c = p.slice(2)
          break
        }
        if (p.indexOf('channel=') === 0) {
          c = p.slice(8)
          break
        }
      }
    }
    if (!c && g.location.hash) {
      c = ('' + g.location.hash).replace('#', '')
    }
    c = ('' + c).trim()
    if (c.charAt(0) === '#') c = c.slice(1)
    if (c) return c
  } catch (e) {}
  return fallback
}

export default function ChatPage() {
  const channel = chatChannelFromLocation(DEFAULT_LOBBY)
  return (
    <main className="pt-main pt-chat-page">
      <article className="pt-article">
        <p className="pt-back">
          <a href={siteHref('/')}>← Home</a>
        </p>
        <h1>Chat</h1>
        <p className="pt-muted">
          {
            'Live lobby and topic channels (imported history + mesh IRC). Default room is #pt-general; pick any #pt-* topic.'
          }
        </p>
        <ChatApp channel={channel} />
      </article>
    </main>
  )
}

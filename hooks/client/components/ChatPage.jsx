/**
 * Full-page mesh chat lobby (#pt-general) for /chat.
 * CleverScript-safe (no regex character-class negation).
 * IRC mesh stays primary; Cleverchat durable board is linked per topic.
 */
import React from 'react'
import ChatApp from 'hooks/client/native/ChatApp.js'
import { siteHref } from 'hooks/client/loadArticles.jsx'

const DEFAULT_LOBBY = 'pt-general'
const CLEVERCHAT_HOST = 'https://api.clevertree.chat'

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

/** Map mesh channel pt-<topic> / pt → Cleverchat topic slug. */
function cleverTopicFromChannel(channel) {
  let c = ('' + (channel || '')).trim().toLowerCase()
  if (c.charAt(0) === '#') c = c.slice(1)
  if (c === 'pt' || c === 'pt-general' || c === 'general') return 'general'
  if (c.indexOf('pt-') === 0) {
    const rest = c.slice(3)
    if (rest) return rest
  }
  return 'general'
}

export default function ChatPage() {
  const channel = chatChannelFromLocation(DEFAULT_LOBBY)
  const cleverTopic = cleverTopicFromChannel(channel)
  const boardHref = CLEVERCHAT_HOST + '/chat/' + cleverTopic
  return (
    <main className="pt-main pt-chat-page">
      <article className="pt-article">
        <p className="pt-back">
          <a href={siteHref('/')}>← Home</a>
        </p>
        <h1>Chat</h1>
        <p className="pt-muted">
          {
            'Live lobby and topic channels (imported history + mesh IRC). Default room is #pt-general; pick any #pt-* topic. Organized debate board (Cleverchat) mirrors the same channel via the IRC bridge.'
          }
        </p>
        <p className="pt-muted">
          <a href={boardHref} target="_blank" rel="noopener noreferrer">
            {'Open organized debate board (' + cleverTopic + ')'}
          </a>
          {' · '}
          <a href={CLEVERCHAT_HOST + '/chat/flock-cameras'} target="_blank" rel="noopener noreferrer">
            flock demo
          </a>
          {' · '}
          <a href={CLEVERCHAT_HOST + '/chat/5g'} target="_blank" rel="noopener noreferrer">
            5g review
          </a>
        </p>
        <iframe
          className="pt-cleverchat-frame"
          title={'Cleverchat board ' + cleverTopic}
          src={boardHref}
          style={{
            width: '100%',
            minHeight: '28rem',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
            background: '#f7f3ea',
          }}
        />
        <ChatApp channel={channel} />
      </article>
    </main>
  )
}

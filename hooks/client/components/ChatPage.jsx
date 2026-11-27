/**
 * /chat placeholder — fullscreen overlay owns chat now.
 */
import React from 'react'
import { siteHref } from 'hooks/client/loadArticles.jsx'

export default function ChatPage() {
  return (
    <main className="pt-main pt-chat-page">
      <article className="pt-article">
        <p className="pt-back">
          <a href={siteHref('/')}>← Home</a>
        </p>
        <h1>Chat is fullscreen now</h1>
        <p className="pt-muted">
          {
            'Use the Chat button in the bottom overlay on any article (Top → Chat → Play → Settings). Everyone joins one IRC room #pt. Topics use trailing [[t:N]] from chat/topics.json — never the page path. With the Clevertree Chat extension installed, the same button opens the side panel.'
          }
        </p>
      </article>
    </main>
  )
}

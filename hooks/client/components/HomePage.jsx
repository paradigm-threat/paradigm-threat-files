import React from 'react'
import manifest from '@hooks'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import DirNav from 'hooks/client/components/DirNav.jsx'
import {
  featuredArticlePath,
  loadArticleRows,
  rowPath,
  rowTitle,
} from 'hooks/client/loadArticles.jsx'

/**
 * Home — README in this corpus is empty (keywords only).
 * Show article index + link into real markdown bodies.
 */
export default function HomePage() {
  const base = (() => {
    try {
      if (typeof manifest.relayClientBaseUrl === 'string') return manifest.relayClientBaseUrl
    } catch (e) {}
    return ''
  })()
  const qProbe = fetch(base.length > 0 ? base + '/' : '/', {
    method: 'QUERY',
    body: '{"collection":"index","query":"","limit":5}',
  })
  let qStatus = -1
  let qLen = 0
  let qHead = ''
  if (qProbe) {
    if (qProbe.status) qStatus = qProbe.status
    const qt = qProbe.text ? qProbe.text : ''
    qLen = qt.length
    qHead = qt.slice(0, 80)
  }
  const nProbe = fetch(base.length > 0 ? base + '/nav-index.json' : '/nav-index.json', {
    method: 'GET',
  })
  let nStatus = -1
  let nLen = 0
  if (nProbe) {
    if (nProbe.status) nStatus = nProbe.status
    const nt = nProbe.text ? nProbe.text : ''
    nLen = nt.length
  }
  let parsedN = 0
  try {
    if (nProbe && nProbe.ok === true && nProbe.text) {
      const d = JSON.parse(nProbe.text)
      if (d && d.articles) parsedN = d.articles.length
    }
  } catch (e2) {
    parsedN = -1
  }

  const rows = loadArticleRows(80)
  const featured = featuredArticlePath(rows)
  const items = []
  const n = rows.length < 30 ? rows.length : 30
  for (let i = 0; i < n; i++) {
    const row = rows[i]
    const path = rowPath(row)
    if (path.length === 0) continue
    items.push(
      <li key={'h-' + i} className="pt-result-item">
        <a href={'/' + path} className="pt-result-link">
          <span className="pt-result-title">{rowTitle(row)}</span>
          <span className="pt-muted pt-result-path">{path}</span>
        </a>
      </li>,
    )
  }

  return (
    <SiteChrome currentPath="/">
      <main className="pt-page" id="pt-home">
        <div className="pt-columns">
          <DirNav />
          <div className="pt-column-main">
            <div className="pt-container">
              <header className="pt-header">
                <h1 className="pt-title">Paradigm Threat</h1>
                <p className="pt-muted pt-lead">
                  Thin files corpus on Relay — browse markdown articles below.
                </p>
                <p className="pt-muted" id="pt-debug-fetch">
                  {'dbg q=' +
                    qStatus +
                    ' qlen=' +
                    qLen +
                    ' n=' +
                    nStatus +
                    ' nlen=' +
                    nLen +
                    ' parsed=' +
                    parsedN +
                    ' rows=' +
                    rows.length +
                    ' base=' +
                    base +
                    ' head=' +
                    qHead}
                </p>
                {featured.length > 0 ? (
                  <p>
                    <a className="pt-btn pt-btn-primary" href={'/' + featured}>
                      Open latest blog article
                    </a>
                  </p>
                ) : null}
              </header>
              <section className="pt-section">
                <h2 className="pt-section-title">Articles</h2>
                {items.length === 0 ? (
                  <p className="pt-muted">Index empty — try Search after hydrate, or open a known path.</p>
                ) : (
                  <ul className="pt-result-list">{items}</ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </SiteChrome>
  )
}

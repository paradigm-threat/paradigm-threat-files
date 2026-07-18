import React from 'react'
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

import React from 'react'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import DirNav from 'hooks/client/components/DirNav.jsx'
import FeelingLucky from 'hooks/client/components/FeelingLucky.jsx'
import {
  featuredArticlePath,
  loadArticleRows,
  rowPath,
  rowTitle,
  siteHref,
} from 'hooks/client/loadArticles.jsx'

/**
 * Article index (Files /articles) — list corpus markdown with CTAs.
 */
export default function HomePage() {
  const rows = loadArticleRows(80)
  const featured = featuredArticlePath(rows)
  let items = []
  const n = rows.length < 30 ? rows.length : 30
  for (let i = 0; i < n; i++) {
    const row = rows[i]
    const path = rowPath(row)
    if (path.length === 0) continue
    items = items.concat([
      <li key={'h-' + i} className="pt-result-item">
        <a href={siteHref('/' + path)} className="pt-result-link">
          <span className="pt-result-title">{rowTitle(row)}</span>
          <span className="pt-muted pt-result-path">{path}</span>
        </a>
      </li>,
    ])
  }

  return (
    <SiteChrome currentPath="/articles">
      <main className="pt-page" id="pt-home">
        <div className="pt-columns">
          <DirNav />
          <div className="pt-column-main">
            <div className="pt-container">
              <header className="pt-header">
                <h1 className="pt-title">Articles</h1>
                <p className="pt-muted pt-lead">
                  Browse markdown in this thin files corpus.
                </p>
                <p className="pt-home-cta-row">
                  {featured.length > 0 ? (
                    <a className="pt-btn pt-btn-primary" href={siteHref('/' + featured)}>
                      Open latest blog article
                    </a>
                  ) : null}
                  <FeelingLucky />
                </p>
              </header>
              <section className="pt-section">
                <h2 className="pt-section-title">Index</h2>
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

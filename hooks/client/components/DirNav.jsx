import React from 'react'
import { loadArticleRows, rowPath, rowTitle } from 'hooks/client/loadArticles.jsx'

/** Left directory from same-repo QUERY (SSR) or nav-index.json fallback. */
export default function DirNav() {
  const rows = loadArticleRows(60)
  let items = []
  const n = rows.length < 40 ? rows.length : 40
  for (let i = 0; i < n; i++) {
    const row = rows[i]
    const path = rowPath(row)
    if (path.length === 0) continue
    const href = '/' + path
    items = items.concat([
      <li key={'d-' + i} className="pt-dir-item">
        <a href={href} className="pt-dir-link">
          {rowTitle(row)}
        </a>
      </li>,
    ])
  }

  return (
    <aside className="pt-dir-nav" aria-label="Directory">
      <h2 className="pt-dir-title">Index</h2>
      {items.length === 0 ? (
        <p className="pt-muted">No indexed articles yet.</p>
      ) : (
        <ul className="pt-dir-list">{items}</ul>
      )}
    </aside>
  )
}

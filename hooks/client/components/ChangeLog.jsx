/**
 * Thin ChangeLog for MarkdownRenderer overrides.
 * Lists recent blog posts from nav-index (date-coded paths sort newest-first).
 */
import React from 'react'
import { loadArticleRows, rowPath, rowTitle, siteHref } from 'hooks/client/loadArticles.jsx'

export default function ChangeLog(props) {
  let limit = 12
  try {
    if (props && typeof props.limit === 'number' && props.limit > 0) limit = props.limit
  } catch (e) {}

  const rows = loadArticleRows(400)
  let blog = []
  for (let i = 0; i < rows.length; i++) {
    const p = rowPath(rows[i])
    if (p.indexOf('blog/') === 0) blog = blog.concat([rows[i]])
  }

  for (let a = 0; a < blog.length; a++) {
    for (let b = a + 1; b < blog.length; b++) {
      const pa = rowPath(blog[a])
      const pb = rowPath(blog[b])
      if (pb > pa) {
        const tmp = blog[a]
        blog[a] = blog[b]
        blog[b] = tmp
      }
    }
  }

  const lim = blog.length < limit ? blog.length : limit
  let items = []
  for (let j = 0; j < lim; j++) {
    const p = rowPath(blog[j])
    const title = rowTitle(blog[j])
    const href = siteHref('/' + p)
    items = items.concat([
      <li key={'cl-' + j} className="pt-changelog-item">
        <a href={href}>{title}</a>
      </li>,
    ])
  }

  return (
    <section className="pt-changelog" aria-label="Change log">
      <h2 className="pt-changelog-title">Recent updates</h2>
      {items.length === 0 ? (
        <p className="pt-muted">No blog posts indexed yet.</p>
      ) : (
        <ul className="pt-changelog-list">{items}</ul>
      )}
    </section>
  )
}

/**
 * Thin AutoIndex for MarkdownRenderer overrides.
 * Lists nav-index rows under an optional path= directory.
 */
import React from 'react'
import { loadArticleRows, rowPath, rowTitle, siteHref } from 'hooks/client/loadArticles.jsx'

function str(v) {
  if (v === null) return ''
  if (typeof v === 'string') return v
  return ''
}

function parentDir(rel) {
  let t = str(rel)
  while (t.length > 0 && t.charAt(0) === '/') {
    t = t.slice(1)
  }
  const slash = t.lastIndexOf('/')
  if (slash < 0) return ''
  return t.slice(0, slash)
}

export default function AutoIndex(props) {
  let pathProp = ''
  let sortName = 'name-asc'
  let currentRel = ''
  try {
    if (props && typeof props.path === 'string') pathProp = props.path
  } catch (e) {}
  try {
    if (props && typeof props.sort === 'string') sortName = props.sort
  } catch (e) {}
  try {
    if (props && typeof props.currentPath === 'string') currentRel = props.currentPath
  } catch (e) {}

  let dir = pathProp
  if (dir.length === 0) dir = parentDir(currentRel)
  while (dir.length > 0 && dir.charAt(0) === '/') {
    dir = dir.slice(1)
  }

  const rows = loadArticleRows(200)
  let picked = []
  for (let i = 0; i < rows.length; i++) {
    const p = rowPath(rows[i])
    if (p.length === 0) continue
    if (p === 'page.md' || p === 'README.md') continue
    if (dir.length === 0) {
      picked = picked.concat([rows[i]])
    } else if (p.indexOf(dir + '/') === 0) {
      picked = picked.concat([rows[i]])
    }
  }

  for (let a = 0; a < picked.length; a++) {
    for (let b = a + 1; b < picked.length; b++) {
      const pa = rowPath(picked[a])
      const pb = rowPath(picked[b])
      let swap = false
      if (sortName === 'name-desc') {
        if (pb < pa) swap = true
      } else {
        if (pa > pb) swap = true
      }
      if (swap) {
        const tmp = picked[a]
        picked[a] = picked[b]
        picked[b] = tmp
      }
    }
  }

  const lim = picked.length < 48 ? picked.length : 48
  let items = []
  for (let j = 0; j < lim; j++) {
    const p = rowPath(picked[j])
    const title = rowTitle(picked[j])
    const href = siteHref('/' + p)
    items = items.concat([
      <li key={'ai-' + j} className="pt-autoindex-item">
        <a href={href}>{title}</a>
      </li>,
    ])
  }

  return (
    <nav className="pt-autoindex" aria-label="Auto index">
      <h3 className="pt-autoindex-title">Index</h3>
      {items.length === 0 ? (
        <p className="pt-muted">No indexed articles in this folder.</p>
      ) : (
        <ul className="pt-autoindex-list">{items}</ul>
      )}
    </nav>
  )
}

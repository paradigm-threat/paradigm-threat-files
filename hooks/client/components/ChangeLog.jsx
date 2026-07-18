/**
 * Thin ChangeLog matching production tabs (Articles / Investigations / Blog / Recent).
 * Build buckets once into useState (via useEffect); tab clicks only change activeTab.
 * CleverScript: no module-level const arrays; avoid onClick closures over loop vars.
 */
import React, { useState, useEffect } from 'react'
import { loadArticleRows, rowPath, rowTitle, siteHref } from 'hooks/client/loadArticles.jsx'

function basename(path) {
  const parts = path.split('/')
  return parts[parts.length - 1] || ''
}

function classifyPath(path) {
  if (!path || path.length < 4) return 'exclude'
  if (path.slice(path.length - 3).toLowerCase() !== '.md') return 'exclude'
  const base = basename(path)
  if (base === 'page.md' || base.toLowerCase() === 'readme.md') return 'exclude'
  if (path.indexOf('docs/') === 0) return 'exclude'
  if (path.indexOf('blog/') === 0) return 'blog'
  if (path.indexOf('/investigations/') >= 0) return 'investigation'
  if (base.toLowerCase().indexOf('investigation') >= 0) return 'investigation'
  return 'article'
}

/** Take up to `limit` newest paths without a full O(n²) sort of the whole list. */
function takeNewestByPath(rows, limit) {
  let best = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const p = rowPath(row)
    if (best.length < limit) {
      let next = []
      let inserted = false
      for (let j = 0; j < best.length; j++) {
        if (!inserted && p > rowPath(best[j])) {
          next = next.concat([row])
          inserted = true
        }
        next = next.concat([best[j]])
      }
      if (!inserted) next = next.concat([row])
      best = next
    } else if (p > rowPath(best[best.length - 1])) {
      let next = []
      let inserted = false
      for (let j = 0; j < best.length; j++) {
        if (!inserted && p > rowPath(best[j])) {
          next = next.concat([row])
          inserted = true
        }
        if (next.length < limit) {
          next = next.concat([best[j]])
        }
      }
      if (!inserted && next.length < limit) next = next.concat([row])
      best = next
    }
  }
  return best
}

function buildBuckets(rows, limit) {
  let articles = []
  let investigations = []
  let blog = []
  for (let i = 0; i < rows.length; i++) {
    const p = rowPath(rows[i])
    const kind = classifyPath(p)
    if (kind === 'blog') blog = blog.concat([rows[i]])
    else if (kind === 'investigation') investigations = investigations.concat([rows[i]])
    else if (kind === 'article') articles = articles.concat([rows[i]])
  }
  const keep = limit + 8
  articles = takeNewestByPath(articles, keep)
  investigations = takeNewestByPath(investigations, keep)
  blog = takeNewestByPath(blog, keep)
  const recent = takeNewestByPath(articles.concat(investigations).concat(blog), keep)
  return {
    articles: articles,
    investigations: investigations,
    blog: blog,
    recent: recent,
  }
}

function emptyBuckets() {
  return {
    articles: [],
    investigations: [],
    blog: [],
    recent: [],
  }
}

function tabClass(activeTab, id) {
  if (activeTab === id) return 'pt-changelog-tab pt-changelog-tab-active'
  return 'pt-changelog-tab'
}

function tabSelected(activeTab, id) {
  if (activeTab === id) return 'true'
  return 'false'
}

export default function ChangeLog(props) {
  let limit = 16
  try {
    if (props && typeof props.limit === 'number' && props.limit > 0) limit = props.limit
  } catch (e) {}

  const [activeTab, setActiveTab] = useState('articles')
  // null = not stored yet (CleverScript useState only seeds while value is Null)
  const [buckets, setBuckets] = useState(null)

  useEffect(() => {
    if (buckets !== null) return
    setBuckets(buildBuckets(loadArticleRows(400), limit))
  }, [])

  // SSR / first paint: compute once for display. After useEffect, buckets is state — tab clicks skip rebuild.
  let view = buckets
  if (view === null) {
    view = buildBuckets(loadArticleRows(400), limit)
  }

  let panel = []
  if (activeTab === 'articles') panel = view.articles
  else if (activeTab === 'investigations') panel = view.investigations
  else if (activeTab === 'blog') panel = view.blog
  else panel = view.recent

  const lim = panel.length < limit ? panel.length : limit
  let items = []
  for (let j = 0; j < lim; j++) {
    const p = rowPath(panel[j])
    const title = rowTitle(panel[j])
    const href = siteHref('/' + p)
    items = items.concat([
      <li key={'cl-' + activeTab + '-' + j} className="pt-changelog-item">
        <a href={href}>{title}</a>
      </li>,
    ])
  }

  return (
    <section className="pt-changelog" aria-label="Change log">
      <div className="pt-changelog-toolbar" role="tablist" aria-label="Content kind">
        <button
          type="button"
          className={tabClass(activeTab, 'articles')}
          aria-selected={tabSelected(activeTab, 'articles')}
          onClick={() => {
            setActiveTab('articles')
          }}
        >
          Articles
        </button>
        <button
          type="button"
          className={tabClass(activeTab, 'investigations')}
          aria-selected={tabSelected(activeTab, 'investigations')}
          onClick={() => {
            setActiveTab('investigations')
          }}
        >
          Investigations
        </button>
        <button
          type="button"
          className={tabClass(activeTab, 'blog')}
          aria-selected={tabSelected(activeTab, 'blog')}
          onClick={() => {
            setActiveTab('blog')
          }}
        >
          Blog
        </button>
        <button
          type="button"
          className={tabClass(activeTab, 'recent')}
          aria-selected={tabSelected(activeTab, 'recent')}
          onClick={() => {
            setActiveTab('recent')
          }}
        >
          Recent
        </button>
      </div>
      {items.length === 0 ? (
        <p className="pt-muted pt-changelog-status">No indexed items in this tab.</p>
      ) : (
        <ul className="pt-changelog-list" role="tabpanel">
          {items}
        </ul>
      )}
    </section>
  )
}

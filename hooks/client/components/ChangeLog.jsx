/**
 * Thin ChangeLog matching production tabs (Articles / Investigations / Blog / Recent).
 * Sync nav-index load (CleverScript-friendly); tab switch is client state only.
 */
import React, { useState } from 'react'
import { loadArticleRows, rowPath, rowTitle, siteHref } from 'hooks/client/loadArticles.jsx'

const TABS = [
  { id: 'articles', label: 'Articles' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'blog', label: 'Blog' },
  { id: 'recent', label: 'Recent' },
]

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

function sortByPathDesc(rows) {
  let out = []
  for (let i = 0; i < rows.length; i++) {
    out = out.concat([rows[i]])
  }
  for (let a = 0; a < out.length; a++) {
    for (let b = a + 1; b < out.length; b++) {
      const pa = rowPath(out[a])
      const pb = rowPath(out[b])
      if (pb > pa) {
        const tmp = out[a]
        out[a] = out[b]
        out[b] = tmp
      }
    }
  }
  return out
}

function buildBuckets(rows) {
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
  articles = sortByPathDesc(articles)
  investigations = sortByPathDesc(investigations)
  blog = sortByPathDesc(blog)
  const recent = sortByPathDesc(articles.concat(investigations).concat(blog))
  return {
    articles: articles,
    investigations: investigations,
    blog: blog,
    recent: recent,
  }
}

export default function ChangeLog(props) {
  let limit = 16
  try {
    if (props && typeof props.limit === 'number' && props.limit > 0) limit = props.limit
  } catch (e) {}

  const [activeTab, setActiveTab] = useState('articles')
  const buckets = buildBuckets(loadArticleRows(400))

  let panel = []
  if (activeTab === 'articles') panel = buckets.articles
  else if (activeTab === 'investigations') panel = buckets.investigations
  else if (activeTab === 'blog') panel = buckets.blog
  else panel = buckets.recent

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

  let tabBtns = []
  for (let t = 0; t < TABS.length; t++) {
    const tab = TABS[t]
    const isActive = activeTab === tab.id
    const cls = isActive ? 'pt-changelog-tab pt-changelog-tab-active' : 'pt-changelog-tab'
    const selected = isActive ? 'true' : 'false'
    const tabId = tab.id
    const label = tab.label
    tabBtns = tabBtns.concat([
      <button
        key={'tab-' + tabId}
        type="button"
        className={cls}
        aria-selected={selected}
        onClick={() => {
          setActiveTab(tabId)
        }}
      >
        {label}
      </button>,
    ])
  }

  return (
    <section className="pt-changelog" aria-label="Change log">
      <div className="pt-changelog-toolbar" role="tablist" aria-label="Content kind">
        {tabBtns}
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

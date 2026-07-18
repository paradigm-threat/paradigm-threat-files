/**
 * Thin ChangeLog matching production tabs (Articles / Investigations / Blog / Recent).
 * Buckets are built once (nav-index load + classify/sort); tab clicks only swap the panel.
 * CleverScript: no module-level const arrays; avoid onClick closures over loop vars.
 */
import React, { useState } from 'react'
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

/** Stable descending path sort without Array.sort (CleverScript-safe). */
function sortByPathDesc(rows) {
  let out = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const p = rowPath(row)
    let inserted = false
    let next = []
    for (let j = 0; j < out.length; j++) {
      if (!inserted && p > rowPath(out[j])) {
        next = next.concat([row])
        inserted = true
      }
      next = next.concat([out[j]])
    }
    if (!inserted) next = next.concat([row])
    out = next
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
  // Recent: merge already-sorted lists (newest path first) without re-sorting the concat.
  let recent = []
  let ia = 0
  let ii = 0
  let ib = 0
  while (ia < articles.length || ii < investigations.length || ib < blog.length) {
    let best = null
    let which = ''
    if (ia < articles.length) {
      best = articles[ia]
      which = 'a'
    }
    if (ii < investigations.length) {
      const p = rowPath(investigations[ii])
      if (!best || p > rowPath(best)) {
        best = investigations[ii]
        which = 'i'
      }
    }
    if (ib < blog.length) {
      const p2 = rowPath(blog[ib])
      if (!best || p2 > rowPath(best)) {
        best = blog[ib]
        which = 'b'
      }
    }
    recent = recent.concat([best])
    if (which === 'a') ia = ia + 1
    else if (which === 'i') ii = ii + 1
    else ib = ib + 1
  }
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
  // Persist buckets across re-renders: tab clicks must not reload/sort nav-index again.
  const [bucketState] = useState({ ready: false, buckets: emptyBuckets() })
  if (bucketState.ready !== true) {
    bucketState.buckets = buildBuckets(loadArticleRows(400))
    bucketState.ready = true
  }
  const buckets = bucketState.buckets

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

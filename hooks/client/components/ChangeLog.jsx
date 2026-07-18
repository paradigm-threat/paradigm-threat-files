/**
 * Thin ChangeLog matching production tabs (Articles / Investigations / Blog / Recent).
 * Tab switches update the DOM only — CleverScript setState re-renders the whole article (~1s).
 */
import React from 'react'
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

function listItems(rows, limit, tabId) {
  const lim = rows.length < limit ? rows.length : limit
  let items = []
  for (let j = 0; j < lim; j++) {
    const p = rowPath(rows[j])
    const title = rowTitle(rows[j])
    const href = siteHref('/' + p)
    items = items.concat([
      <li key={'cl-' + tabId + '-' + j} className="pt-changelog-item">
        <a href={href}>{title}</a>
      </li>,
    ])
  }
  return items
}

function panelBody(rows, limit, tabId) {
  const items = listItems(rows, limit, tabId)
  if (items.length === 0) {
    return <p className="pt-muted pt-changelog-status">No indexed items in this tab.</p>
  }
  return (
    <ul className="pt-changelog-list" role="tabpanel">
      {items}
    </ul>
  )
}

/** Swap visible panel without React setState (avoids full markdown re-render). */
function activateTab(tabId) {
  try {
    const root = document.querySelector('.pt-changelog')
    if (!root) return
    const tabs = root.querySelectorAll('[data-changelog-tab]')
    for (let i = 0; i < tabs.length; i++) {
      const btn = tabs[i]
      let id = ''
      try {
        id = btn.getAttribute('data-changelog-tab') || ''
      } catch (e) {}
      const on = id === tabId
      btn.className = on ? 'pt-changelog-tab pt-changelog-tab-active' : 'pt-changelog-tab'
      try {
        btn.setAttribute('aria-selected', on ? 'true' : 'false')
      } catch (e2) {}
    }
    const panels = root.querySelectorAll('[data-changelog-panel]')
    for (let j = 0; j < panels.length; j++) {
      const panel = panels[j]
      let pid = ''
      try {
        pid = panel.getAttribute('data-changelog-panel') || ''
      } catch (e3) {}
      const show = pid === tabId
      try {
        if (show) panel.removeAttribute('hidden')
        else panel.setAttribute('hidden', 'hidden')
      } catch (e4) {
        try {
          panel.hidden = !show
        } catch (e5) {}
      }
    }
  } catch (e6) {}
}

export default function ChangeLog(props) {
  let limit = 16
  try {
    if (props && typeof props.limit === 'number' && props.limit > 0) limit = props.limit
  } catch (e) {}

  const buckets = buildBuckets(loadArticleRows(400), limit)

  return (
    <section className="pt-changelog" aria-label="Change log">
      <div className="pt-changelog-toolbar" role="tablist" aria-label="Content kind">
        <button
          type="button"
          className="pt-changelog-tab pt-changelog-tab-active"
          data-changelog-tab="articles"
          aria-selected="true"
          onClick={() => {
            activateTab('articles')
          }}
        >
          Articles
        </button>
        <button
          type="button"
          className="pt-changelog-tab"
          data-changelog-tab="investigations"
          aria-selected="false"
          onClick={() => {
            activateTab('investigations')
          }}
        >
          Investigations
        </button>
        <button
          type="button"
          className="pt-changelog-tab"
          data-changelog-tab="blog"
          aria-selected="false"
          onClick={() => {
            activateTab('blog')
          }}
        >
          Blog
        </button>
        <button
          type="button"
          className="pt-changelog-tab"
          data-changelog-tab="recent"
          aria-selected="false"
          onClick={() => {
            activateTab('recent')
          }}
        >
          Recent
        </button>
      </div>
      <div data-changelog-panel="articles">{panelBody(buckets.articles, limit, 'articles')}</div>
      <div data-changelog-panel="investigations" hidden>
        {panelBody(buckets.investigations, limit, 'investigations')}
      </div>
      <div data-changelog-panel="blog" hidden>
        {panelBody(buckets.blog, limit, 'blog')}
      </div>
      <div data-changelog-panel="recent" hidden>
        {panelBody(buckets.recent, limit, 'recent')}
      </div>
    </section>
  )
}

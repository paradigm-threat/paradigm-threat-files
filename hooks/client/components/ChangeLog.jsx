/**
 * Thin ChangeLog matching live paradigmthreat.net tabs + card/feed styles.
 * Uses @relay/date|path|util|catalog — CSS radio tabs (no setState).
 */
import React from 'react'
import { basename } from '@relay/path'
import { formatTiny, formatLong, formatFeed, sameDay } from '@relay/date'
import { take, sortBy } from '@relay/util'
import { contentKind, publishedFromBlogPath } from '@relay/catalog'
import { loadArticleRows, rowPath, rowTitle, rowUpdated, siteHref } from 'hooks/client/loadArticles.jsx'

function buildBuckets(limit) {
  const rows = loadArticleRows(200)
  let articles = []
  let investigations = []
  let blog = []
  for (let i = 0; i < rows.length; i++) {
    const path = rowPath(rows[i])
    const kind = contentKind(path)
    if (kind === 'exclude') continue
    const fromNav = rowUpdated(rows[i])
    const published = kind === 'blog' ? publishedFromBlogPath(path) : ''
    const updatedAt = fromNav.length > 0 ? fromNav : published
    const item = {
      path: path,
      title: rowTitle(rows[i]),
      kind: kind,
      href: siteHref('/' + path),
      updatedAt: updatedAt,
      originalPublishedAt: published,
      sortKey: updatedAt.length > 0 ? updatedAt : path,
    }
    if (kind === 'blog') blog = blog.concat([item])
    else if (kind === 'investigation') investigations = investigations.concat([item])
    else articles = articles.concat([item])
  }
  articles = take(sortBy(articles, 'sortKey', true), limit)
  investigations = take(sortBy(investigations, 'sortKey', true), limit)
  blog = take(sortBy(blog, 'sortKey', true), limit)
  const recent = take(
    sortBy(articles.concat(investigations).concat(blog), 'sortKey', true),
    limit,
  )
  return {
    articles: articles,
    investigations: investigations,
    blog: blog,
    recent: recent,
  }
}

const LOGO_URL = 'https://paradigmthreat.net/site/favicon.svg'

function contentCard(item, tabId, idx) {
  const title = item.title
  const updatedLine = item.updatedAt.length > 0
    ? 'Last updated: ' + formatTiny(item.updatedAt)
    : ''
  const publishedLine = item.originalPublishedAt.length > 0
    ? 'Originally published: ' + formatTiny(item.originalPublishedAt)
    : ''
  const showBoth =
    publishedLine.length > 0 &&
    updatedLine.length > 0 &&
    !sameDay(item.originalPublishedAt, item.updatedAt)
  const singleLine = showBoth
    ? ''
    : publishedLine.length > 0
      ? publishedLine
      : updatedLine
  const byline =
    item.kind === 'blog' && item.originalPublishedAt.length > 0
      ? formatLong(item.originalPublishedAt) + ' — Paradigm Threat'
      : ''

  let dates = null
  if (showBoth) {
    dates = (
      <div className="pt-cl-card-dates">
        <time className="pt-cl-card-date">{publishedLine}</time>
        <time className="pt-cl-card-date">{updatedLine}</time>
      </div>
    )
  } else if (singleLine.length > 0) {
    dates = <time className="pt-cl-card-date">{singleLine}</time>
  }

  return (
    <li key={'cl-card-' + tabId + '-' + idx} className="pt-cl-card-item">
      <a href={item.href} className="pt-cl-card">
        <div className="pt-cl-card-media" aria-hidden="true">
          <img src={LOGO_URL} alt="" className="pt-cl-card-thumb-logo" />
        </div>
        <div className="pt-cl-card-body">
          <h3 className="pt-cl-card-title">{title}</h3>
          {dates}
          {byline.length > 0 ? <p className="pt-cl-card-byline">{byline}</p> : null}
        </div>
      </a>
    </li>
  )
}

function recentEntry(item, idx) {
  const stamp =
    item.updatedAt.length > 0 ? formatFeed(item.updatedAt) : ''
  const line =
    (stamp.length > 0 ? stamp + ' - ' : '') +
    item.title +
    ' (paradigm-threat-files)'
  const file = basename(item.path)
  return (
    <li key={'cl-recent-' + idx} className="pt-cl-entry">
      <div className="pt-cl-entry-thumb" aria-hidden="true">
        <img src={LOGO_URL} alt="" className="pt-cl-entry-logo" />
      </div>
      <div className="pt-cl-entry-body">
        <div className="pt-cl-entry-title">{line}</div>
        <div className="pt-cl-entry-file">
          <a href={item.href} title={item.path}>
            {file}
          </a>
        </div>
      </div>
    </li>
  )
}

function panelCards(items, tabId) {
  if (items.length === 0) {
    return <p className="pt-muted pt-changelog-status">No indexed items in this tab.</p>
  }
  let cards = []
  for (let i = 0; i < items.length; i++) {
    cards = cards.concat([contentCard(items[i], tabId, i)])
  }
  return (
    <ul className="pt-changelog-list pt-cl-cards" role="tabpanel">
      {cards}
    </ul>
  )
}

function panelRecent(items) {
  if (items.length === 0) {
    return <p className="pt-muted pt-changelog-status">No indexed items in this tab.</p>
  }
  let entries = []
  for (let i = 0; i < items.length; i++) {
    entries = entries.concat([recentEntry(items[i], i)])
  }
  return (
    <ul className="pt-changelog-list pt-cl-feed" role="tabpanel">
      {entries}
    </ul>
  )
}

function tabCss() {
  return (
    '.pt-changelog-tab{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;}' +
    '.pt-changelog-panel{display:none;flex-direction:column;min-height:0;flex:1;overflow:hidden;}' +
    '.pt-changelog:has(#pt-cl-articles:checked) .pt-changelog-panel-articles{display:flex;}' +
    '.pt-changelog:has(#pt-cl-investigations:checked) .pt-changelog-panel-investigations{display:flex;}' +
    '.pt-changelog:has(#pt-cl-blog:checked) .pt-changelog-panel-blog{display:flex;}' +
    '.pt-changelog:has(#pt-cl-recent:checked) .pt-changelog-panel-recent{display:flex;}' +
    '.pt-changelog:has(#pt-cl-articles:checked) .pt-changelog-tab-articles,' +
    '.pt-changelog:has(#pt-cl-investigations:checked) .pt-changelog-tab-investigations,' +
    '.pt-changelog:has(#pt-cl-blog:checked) .pt-changelog-tab-blog,' +
    '.pt-changelog:has(#pt-cl-recent:checked) .pt-changelog-tab-recent{' +
    'color:#e2e8f0;border-color:#818cf8;background-color:#1e293b;}' +
    '.pt-cl-cards{display:flex;flex-direction:column;gap:0.75rem;}' +
    '.pt-cl-card-item{margin:0;list-style:none;}' +
    '.pt-cl-card{display:flex;gap:0.75rem;align-items:flex-start;padding:0.65rem 0.75rem;' +
    'border-radius:0.5rem;border:1px solid rgba(203,213,225,0.7);background:rgba(255,255,255,0.6);' +
    'text-decoration:none;color:inherit;transition:border-color 0.15s ease,box-shadow 0.15s ease;}' +
    '.pt-cl-card:hover{border-color:#8b5cf6;box-shadow:0 2px 8px rgba(15,23,42,0.06);}' +
    '.pt-cl-card-media{flex-shrink:0;}' +
    '.pt-cl-card-thumb-logo{width:4.5rem;height:4.5rem;border-radius:0.25rem;border:1px solid #cbd5e1;' +
    'object-fit:contain;padding:0.2rem;background:#f8fafc;}' +
    '.pt-cl-card-body{min-width:0;flex:1;}' +
    '.pt-cl-card-title{margin:0 0 0.2rem;font-size:1rem;font-weight:700;line-height:1.3;color:#f8fafc;}' +
    '.pt-cl-card-dates{display:flex;flex-direction:column;gap:0.1rem;margin-bottom:0.35rem;}' +
    '.pt-cl-card-date{display:block;font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;}' +
    '.pt-cl-card-dates .pt-cl-card-date{margin-bottom:0;}' +
    '.pt-cl-card-byline{margin:0;font-size:0.875rem;line-height:1.45;color:#cbd5e1;}' +
    '.pt-cl-feed{display:flex;flex-direction:column;gap:0.65rem;}' +
    '.pt-cl-entry{display:flex;gap:0.75rem;align-items:flex-start;margin:0;list-style:none;}' +
    '.pt-cl-entry-thumb{flex-shrink:0;width:3.5rem;height:3.5rem;border-radius:0.25rem;' +
    'border:1px solid #cbd5e1;background:#f8fafc;display:flex;align-items:center;justify-content:center;}' +
    '.pt-cl-entry-logo{width:2.75rem;height:2.75rem;object-fit:contain;}' +
    '.pt-cl-entry-body{min-width:0;flex:1;font-size:0.875rem;color:#e2e8f0;}' +
    '.pt-cl-entry-title{margin:0 0 0.15rem;line-height:1.35;}' +
    '.pt-cl-entry-file{font-size:0.8125rem;opacity:0.85;}' +
    '.pt-cl-entry-file a{color:#93c5fd;}'
  )
}

export default function ChangeLog(props) {
  let limit = 16
  try {
    if (props && typeof props.limit === 'number' && props.limit > 0) limit = props.limit
  } catch (e) {}

  const buckets = buildBuckets(limit)

  return (
    <section className="pt-changelog" aria-label="Change log">
      <style>{tabCss()}</style>
      <div className="pt-changelog-toolbar" role="tablist" aria-label="Content kind">
        <label className="pt-changelog-tab pt-changelog-tab-articles">
          <input
            type="radio"
            name="pt-changelog-tab"
            id="pt-cl-articles"
            className="pt-changelog-radio"
            checked={true}
          />
          Articles
        </label>
        <label className="pt-changelog-tab pt-changelog-tab-investigations">
          <input
            type="radio"
            name="pt-changelog-tab"
            id="pt-cl-investigations"
            className="pt-changelog-radio"
          />
          Investigations
        </label>
        <label className="pt-changelog-tab pt-changelog-tab-blog">
          <input type="radio" name="pt-changelog-tab" id="pt-cl-blog" className="pt-changelog-radio" />
          Blog
        </label>
        <label className="pt-changelog-tab pt-changelog-tab-recent">
          <input
            type="radio"
            name="pt-changelog-tab"
            id="pt-cl-recent"
            className="pt-changelog-radio"
          />
          Recent
        </label>
      </div>
      <div className="pt-changelog-panel pt-changelog-panel-articles">
        {panelCards(buckets.articles, 'articles')}
      </div>
      <div className="pt-changelog-panel pt-changelog-panel-investigations">
        {panelCards(buckets.investigations, 'investigations')}
      </div>
      <div className="pt-changelog-panel pt-changelog-panel-blog">
        {panelCards(buckets.blog, 'blog')}
      </div>
      <div className="pt-changelog-panel pt-changelog-panel-recent">
        {panelRecent(buckets.recent)}
      </div>
    </section>
  )
}

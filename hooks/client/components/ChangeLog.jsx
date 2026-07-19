/**
 * Thin ChangeLog matching live paradigmthreat.net tabs + card/feed styles.
 * CSS radio tabs (no setState — CleverScript setState re-renders the article).
 * Dates from nav-index `_updated` column (+ blog path publish date).
 */
import React from 'react'
import { loadArticleRows, rowPath, rowTitle, rowUpdated, siteHref } from 'hooks/client/loadArticles.jsx'

function basename(path) {
  const parts = path.split('/')
  return parts[parts.length - 1] || ''
}

function monthShort(mm) {
  if (mm === '01') return 'Jan'
  if (mm === '02') return 'Feb'
  if (mm === '03') return 'Mar'
  if (mm === '04') return 'Apr'
  if (mm === '05') return 'May'
  if (mm === '06') return 'Jun'
  if (mm === '07') return 'Jul'
  if (mm === '08') return 'Aug'
  if (mm === '09') return 'Sep'
  if (mm === '10') return 'Oct'
  if (mm === '11') return 'Nov'
  if (mm === '12') return 'Dec'
  return mm
}

function monthLong(mm) {
  if (mm === '01') return 'January'
  if (mm === '02') return 'February'
  if (mm === '03') return 'March'
  if (mm === '04') return 'April'
  if (mm === '05') return 'May'
  if (mm === '06') return 'June'
  if (mm === '07') return 'July'
  if (mm === '08') return 'August'
  if (mm === '09') return 'September'
  if (mm === '10') return 'October'
  if (mm === '11') return 'November'
  if (mm === '12') return 'December'
  return mm
}

/** CleverScript: digit string to number without unary minus / parseInt. */
function hourToInt(hh) {
  if (!hh || hh.length !== 2) return 0
  const a = hh.charCodeAt(0)
  const b = hh.charCodeAt(1)
  if (a < 48 || a > 57) return 0
  if (b < 48 || b > 57) return 0
  return (a - 48) * 10 + (b - 48)
}

function yearAtLeast1990(y) {
  if (!y || y.length !== 4) return false
  if (y < '1990') return false
  return true
}

/** "Jul 18, 2026" from ISO or YYYY-MM-DD (no Date — CleverScript). */
function formatDateTiny(iso) {
  if (!iso || typeof iso !== 'string' || iso.length < 10) return ''
  const y = iso.slice(0, 4)
  const m = iso.slice(5, 7)
  let d = iso.slice(8, 10)
  if (y.length !== 4 || iso.charAt(4) !== '-') return ''
  if (d.charAt(0) === '0') d = d.slice(1)
  return monthShort(m) + ' ' + d + ', ' + y
}

/** "November 30, 2021" */
function formatDateLong(iso) {
  if (!iso || typeof iso !== 'string' || iso.length < 10) return ''
  const y = iso.slice(0, 4)
  const m = iso.slice(5, 7)
  let d = iso.slice(8, 10)
  if (y.length !== 4 || iso.charAt(4) !== '-') return ''
  if (d.charAt(0) === '0') d = d.slice(1)
  return monthLong(m) + ' ' + d + ', ' + y
}

/** "7/18/26, 7:31 PM" from ISO local stamp (no Date). */
function formatFeedStamp(iso) {
  if (!iso || typeof iso !== 'string' || iso.length < 16) return formatDateTiny(iso)
  const y = iso.slice(2, 4)
  let mo = iso.slice(5, 7)
  let d = iso.slice(8, 10)
  if (mo.charAt(0) === '0') mo = mo.slice(1)
  if (d.charAt(0) === '0') d = d.slice(1)
  let h = hourToInt(iso.slice(11, 13))
  const mi = iso.slice(14, 16)
  if (mi.length !== 2) return formatDateTiny(iso)
  let ampm = 'AM'
  if (h >= 12) ampm = 'PM'
  if (h === 0) h = 12
  else if (h > 12) h = h - 12
  return mo + '/' + d + '/' + y + ', ' + h + ':' + mi + ' ' + ampm
}

function sameDay(a, b) {
  if (!a || !b || a.length < 10 || b.length < 10) return false
  return a.slice(0, 10) === b.slice(0, 10)
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

function dateFromBasename(path) {
  const base = basename(path)
  if (base.length < 10) return ''
  if (base.charAt(4) !== '-' || base.charAt(7) !== '-') return ''
  const y = base.slice(0, 4)
  const m = base.slice(5, 7)
  const d = base.slice(8, 10)
  if (!yearAtLeast1990(y)) return ''
  return y + '-' + m + '-' + d + 'T12:00:00Z'
}

function publishedFromBlogPath(path) {
  if (!path || path.indexOf('blog/') !== 0) return ''
  return dateFromBasename(path)
}

function sortByUpdatedDesc(items) {
  let out = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    let next = []
    let inserted = false
    for (let j = 0; j < out.length; j++) {
      if (!inserted && item.sortKey > out[j].sortKey) {
        next = next.concat([item])
        inserted = true
      }
      next = next.concat([out[j]])
    }
    if (!inserted) next = next.concat([item])
    out = next
  }
  return out
}

function takeLimit(items, limit) {
  if (items.length <= limit) return items
  let out = []
  for (let i = 0; i < limit; i++) {
    out = out.concat([items[i]])
  }
  return out
}

function buildBuckets(limit) {
  // Prefer nav-index.txt (not same-host QUERY) so SSR site-shell cannot deadlock GET.
  const rows = loadArticleRows(400)
  let articles = []
  let investigations = []
  let blog = []
  for (let i = 0; i < rows.length; i++) {
    const path = rowPath(rows[i])
    const kind = classifyPath(path)
    if (kind !== 'exclude') {
      const fromPath = dateFromBasename(path)
      const fromNav = rowUpdated(rows[i])
      const published = kind === 'blog' ? publishedFromBlogPath(path) : ''
      const updatedAt = fromNav.length > 0 ? fromNav : fromPath
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
  }
  articles = takeLimit(sortByUpdatedDesc(articles), limit)
  investigations = takeLimit(sortByUpdatedDesc(investigations), limit)
  blog = takeLimit(sortByUpdatedDesc(blog), limit)
  const recent = takeLimit(
    sortByUpdatedDesc(articles.concat(investigations).concat(blog)),
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
    ? 'Last updated: ' + formatDateTiny(item.updatedAt)
    : ''
  const publishedLine = item.originalPublishedAt.length > 0
    ? 'Originally published: ' + formatDateTiny(item.originalPublishedAt)
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
      ? formatDateLong(item.originalPublishedAt) + ' — Paradigm Threat'
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
    item.updatedAt.length > 0 ? formatFeedStamp(item.updatedAt) : ''
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

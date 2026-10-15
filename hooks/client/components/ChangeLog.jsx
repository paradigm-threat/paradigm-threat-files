/**
 * Thin ChangeLog matching live paradigmthreat.net tabs + card/feed styles.
 * Card chrome lives in theme.yaml; only :has() radio wiring stays inline.
 * Rows and thumbs come from hydrate QUERY (`image_src` stamped at ingest).
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { parseJson } from 'hooks/client/jsonUtil.jsx'
import { basename } from '@relay/path'
import { formatTiny, formatLong, formatFeed, sameDay } from '@relay/date'
import { take } from '@relay/util'
import {
  loadCatalogKind,
  rowPath,
  rowTitle,
  rowUpdated,
  rowKind,
  rowPublished,
  rowImageSrc,
  siteHref,
  changelogThumbSrc,
} from 'hooks/client/loadArticles.jsx'

function itemFromRow(row) {
  const path = rowPath(row)
  const kind = rowKind(row)
  const published = rowPublished(row)
  const updatedAt = rowUpdated(row)
  return {
    path: path,
    title: rowTitle(row),
    kind: kind,
    href: siteHref('/' + path),
    updatedAt: updatedAt,
    originalPublishedAt: published,
    imageSrc: rowImageSrc(row),
  }
}

function itemsFromRows(rows, limit) {
  let items = []
  for (let i = 0; i < rows.length; i++) {
    items = items.concat([itemFromRow(rows[i])])
  }
  return take(items, limit)
}

function buildBuckets(limit) {
  return {
    articles: itemsFromRows(loadCatalogKind('article'), limit),
    investigations: itemsFromRows(loadCatalogKind('investigation'), limit),
    blog: itemsFromRows(loadCatalogKind('blog'), limit),
    recent: itemsFromRows(loadCatalogKind('recent'), limit),
  }
}

/** Same-Host chrome — apex paradigmthreat.net/site/*.svg currently returns Next SPA HTML. */
const LOGO_URL = '/site/favicon.svg'

function cardThumb(item) {
  const raw = item.imageSrc && typeof item.imageSrc === 'string' ? item.imageSrc : ''
  if (raw.length > 0) {
    const src = changelogThumbSrc(raw)
    if (src.length > 0) {
      return <img src={src} alt="" className="pt-cl-card-thumb" loading="lazy" />
    }
  }
  return <img src={LOGO_URL} alt="" className="pt-cl-card-thumb-logo" />
}

function entryThumb(item) {
  const raw = item.imageSrc && typeof item.imageSrc === 'string' ? item.imageSrc : ''
  if (raw.length > 0) {
    const src = changelogThumbSrc(raw)
    if (src.length > 0) {
      return <img src={src} alt="" className="pt-cl-entry-img" loading="lazy" />
    }
  }
  return <img src={LOGO_URL} alt="" className="pt-cl-entry-logo" />
}

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
          {cardThumb(item)}
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
        {entryThumb(item)}
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

/** Radio show/hide only — colors/layout come from theme.yaml. */
function tabCss() {
  return (
    '.pt-changelog-panel{display:none;flex-direction:column;min-height:0;flex:1;overflow:hidden;}' +
    '.pt-changelog:has(#pt-cl-articles:checked) .pt-changelog-panel-articles{display:flex;}' +
    '.pt-changelog:has(#pt-cl-investigations:checked) .pt-changelog-panel-investigations{display:flex;}' +
    '.pt-changelog:has(#pt-cl-blog:checked) .pt-changelog-panel-blog{display:flex;}' +
    '.pt-changelog:has(#pt-cl-recent:checked) .pt-changelog-panel-recent{display:flex;}' +
    '.pt-changelog:has(#pt-cl-articles:checked) .pt-changelog-tab-articles,' +
    '.pt-changelog:has(#pt-cl-investigations:checked) .pt-changelog-tab-investigations,' +
    '.pt-changelog:has(#pt-cl-blog:checked) .pt-changelog-tab-blog,' +
    '.pt-changelog:has(#pt-cl-recent:checked) .pt-changelog-tab-recent{' +
    'color:inherit;border-color:currentColor;font-weight:700;}'
  )
}

export default function ChangeLog(props) {
  let limit = 5
  try {
    if (props && typeof props.limit === 'number' && props.limit > 0) limit = props.limit
  } catch (e) {}

  // Phase 3+ (feeds). Host advances after catalog idle tick.
  if (isClientLivePhase(3) !== true) {
    if (isCsrHost()) {
      return null
    }
    return (
      <section
        className="pt-changelog"
        aria-label="Change log"
        data-pt-changelog-ssr="1"
      >
        <p className="pt-muted">Change log loads after page open…</p>
      </section>
    )
  }

  // Soft-kept Flashback shell is present by phase 3; fill Now showing inline.
  // CleverScript fetch is sync (returns response with .text), not Promise/.then.
  try {
    const fb = document.querySelector('[data-pt-flashback-ssr]')
    if (fb !== null && fb !== undefined && fb.getAttribute('data-pt-flashback-filled') !== '1') {
      const resp = fetch('https://flashbackrepository.org/index.json', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      })
      if (resp && resp.ok === true) {
        const text = resp.text ? resp.text : ''
        const json = parseJson(text)
        if (json !== null && json !== undefined) {
          const slugs = json.nowShowing
          const projects = json.projects
          const slugList = slugs && slugs.length >= 0 ? slugs : []
          const projectList = projects && projects.length >= 0 ? projects : []
          const bySlug = {}
          for (let i = 0; i < projectList.length; i++) {
            const p = projectList[i]
            if (p && typeof p.slug === 'string') {
              bySlug[p.slug] = p
            }
          }
          while (fb.firstChild) {
            fb.removeChild(fb.firstChild)
          }
          const head = document.createElement('div')
          head.className = 'pt-flashback-now-head'
          const h3 = document.createElement('h3')
          h3.className = 'pt-flashback-now-title'
          h3.textContent = 'Now showing'
          head.appendChild(h3)
          const more = document.createElement('a')
          more.className = 'pt-flashback-now-more'
          more.href = 'https://flashbackrepository.org/'
          more.target = '_blank'
          more.rel = 'noopener noreferrer'
          more.textContent = 'Flashback Repository'
          head.appendChild(more)
          fb.appendChild(head)
          const ul = document.createElement('ul')
          ul.className = 'pt-flashback-now-list'
          for (let j = 0; j < slugList.length; j++) {
            const slug = slugList[j]
            if (typeof slug === 'string' && slug.length > 0) {
              const p = bySlug[slug]
              let title = slug
              if (p && typeof p.title === 'string' && p.title.length > 0) {
                title = p.title
              }
              const li = document.createElement('li')
              li.className = 'pt-flashback-now-item'
              const a = document.createElement('a')
              a.href = 'https://flashbackrepository.org/' + slug
              a.target = '_blank'
              a.rel = 'noopener noreferrer'
              a.textContent = title
              li.appendChild(a)
              ul.appendChild(li)
            }
          }
          fb.appendChild(ul)
          fb.removeAttribute('data-pt-flashback-ssr')
          fb.setAttribute('data-pt-flashback-filled', '1')
        }
      }
    }
  } catch (eFb) {}

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

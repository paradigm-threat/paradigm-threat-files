/**
 * Flashback Repository Now showing.
 * SSR: placeholder (`data-pt-flashback-ssr`). Phase ≥3: live list from index.json.
 * Current embed.js may not swap this island — ChangeLog also fills the soft-kept stub.
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { parseJson } from 'hooks/client/jsonUtil.jsx'

const INDEX_URL = 'https://flashbackrepository.org/index.json'
const ORIGIN = 'https://flashbackrepository.org'

function loadIndexJson() {
  try {
    // No Accept header — sync XHR + custom headers can trip CORS preflight.
    const resp = fetch(INDEX_URL, {
      method: 'GET',
    })
    if (resp && resp.ok === true) {
      const text = resp.text ? resp.text : ''
      return parseJson(text)
    }
  } catch (eFetch) {}
  return null
}

function itemsFromIndex(json) {
  let items = []
  if (json === null) {
    return items
  }
  const slugs = json.nowShowing
  const projects = json.projects
  const slugList = slugs && slugs.length > 0 ? slugs : []
  const projectList = projects && projects.length > 0 ? projects : []
  const bySlug = {}
  for (let i = 0; i < projectList.length; i++) {
    const p = projectList[i]
    if (p && typeof p.slug === 'string') {
      bySlug[p.slug] = p
    }
  }
  for (let j = 0; j < slugList.length; j++) {
    const slug = slugList[j]
    if (typeof slug === 'string' && slug.length > 0) {
      const p = bySlug[slug]
      let title = slug
      if (p && typeof p.title === 'string' && p.title.length > 0) {
        title = p.title
      }
      items = items.concat([
        {
          slug: slug,
          title: title,
          href: ORIGIN + '/' + slug,
        },
      ])
    }
  }
  return items
}

function shell(children) {
  return (
    <section className="pt-flashback-now" aria-label="Flashback now showing">
      <div className="pt-flashback-now-head">
        <h3 className="pt-flashback-now-title">Now showing</h3>
        <a
          className="pt-flashback-now-more"
          href={ORIGIN + '/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Flashback Repository
        </a>
      </div>
      {children}
    </section>
  )
}

export default function FlashbackNowShowing() {
  if (isClientLivePhase(3) === true) {
    const items = itemsFromIndex(loadIndexJson())
    if (items.length === 0) {
      return shell(
        <p className="pt-muted pt-flashback-now-status">
          Could not load the live list.{' '}
          <a href={ORIGIN + '/'} target="_blank" rel="noopener noreferrer">
            Open Flashback Repository
          </a>
          .
        </p>,
      )
    }
    let rows = []
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      rows = rows.concat([
        <li key={it.slug} className="pt-flashback-now-item">
          <a href={it.href} target="_blank" rel="noopener noreferrer">
            {it.title}
          </a>
        </li>,
      ])
    }
    return shell(
      <ul className="pt-flashback-now-list" aria-label="Now showing titles">
        {rows}
      </ul>,
    )
  }
  if (isCsrHost()) {
    return null
  }
  return (
    <section
      className="pt-flashback-now"
      aria-label="Flashback now showing"
      data-pt-flashback-ssr="1"
    >
      <p className="pt-muted">Now showing loads after page open…</p>
    </section>
  )
}

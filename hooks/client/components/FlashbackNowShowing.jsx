/**
 * Live “Now showing” list from Flashback Repository.
 * Fetches https://flashbackrepository.org/index.json (CORS *) and joins
 * nowShowing slugs to project titles.
 *
 * Soft-hydrate: SSR placeholder keeps data-pt-flashback-ssr; phase ≥3 live
 * vnode omits it so replaceSsrPlaceholdersFromVnode can swap (same as ChangeLog).
 */
import React, { useEffect, useState } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'

const INDEX_URL = 'https://flashbackrepository.org/index.json'
const ORIGIN = 'https://flashbackrepository.org'

function titleFromSlug(slug) {
  const s = typeof slug === 'string' ? slug : ''
  if (s.length === 0) return 'Untitled'
  const parts = s.split('-')
  let out = []
  for (let i = 0; i < parts.length; i++) {
    const w = parts[i]
    if (w.length === 0) continue
    out = out.concat([w.charAt(0).toUpperCase() + w.slice(1)])
  }
  return out.join(' ')
}

function flashbackCss() {
  return (
    '.pt-flashback-now{margin:1.25rem 0 1.75rem;padding:1rem 1.1rem;border-radius:0.5rem;' +
    'border:1px solid #e2e8f0;background:#ffffff;box-sizing:border-box;}' +
    '.pt-flashback-now-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;' +
    'gap:0.5rem 1rem;margin:0 0 0.75rem;}' +
    '.pt-flashback-now-title{margin:0;font-size:1.05rem;font-weight:700;}' +
    '.pt-flashback-now-more{font-size:0.875rem;font-weight:600;}' +
    '.pt-flashback-now-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.35rem;}' +
    '.pt-flashback-now-item{margin:0;font-size:0.95rem;line-height:1.4;}' +
    '.pt-flashback-now-item a{text-decoration:underline;text-underline-offset:2px;}' +
    '.pt-flashback-now-status{margin:0;font-size:0.875rem;}' +
    '@media (prefers-color-scheme: dark){' +
    '.pt-flashback-now{border-color:#1e293b;background:#020817;}' +
    '}' +
    'html.dark .pt-flashback-now{border-color:#1e293b;background:#020817;}' +
    'html.light .pt-flashback-now{border-color:#e2e8f0;background:#ffffff;}'
  )
}

export default function FlashbackNowShowing() {
  const pack = useState({ status: 'loading', items: [] })
  const data = pack[0]
  const setData = pack[1]
  const phase3 = isClientLivePhase(3) === true

  useEffect(() => {
    if (phase3 !== true) return
    let cancelled = false
    fetch(INDEX_URL, { cache: 'default' })
      .then((res) => {
        if (!res || res.ok !== true) return null
        return res.json()
      })
      .then((json) => {
        if (cancelled === true) return
        if (json === null || json === undefined) {
          setData({ status: 'error', items: [] })
          return
        }
        const slugs = json && Array.isArray(json.nowShowing) ? json.nowShowing : []
        const projects = json && Array.isArray(json.projects) ? json.projects : []
        const bySlug = {}
        for (let i = 0; i < projects.length; i++) {
          const p = projects[i]
          if (p && typeof p.slug === 'string') bySlug[p.slug] = p
        }
        let items = []
        for (let i = 0; i < slugs.length; i++) {
          const slug = slugs[i]
          if (typeof slug !== 'string' || slug.length === 0) continue
          const p = bySlug[slug]
          let title = titleFromSlug(slug)
          if (p && typeof p.title === 'string' && p.title.length > 0) title = p.title
          items = items.concat([
            {
              slug: slug,
              title: title,
              href: ORIGIN + '/' + slug,
            },
          ])
        }
        setData({ status: 'ok', items: items })
      })
      .catch(() => {
        if (cancelled === true) return
        setData({ status: 'error', items: [] })
      })
    return () => {
      cancelled = true
    }
  }, [phase3])

  // Phase 3+ (feeds). Host advances after catalog idle tick.
  if (phase3 !== true) {
    if (isCsrHost()) {
      return null
    }
    return (
      <section
        className="pt-flashback-now"
        aria-label="Flashback Repository now showing"
        data-pt-flashback-ssr="1"
      >
        <p className="pt-muted pt-flashback-now-status">Loading Now showing…</p>
      </section>
    )
  }

  let body = null
  if (data.status === 'loading') {
    body = (
      <p className="pt-muted pt-flashback-now-status">
        Loading Now showing…
      </p>
    )
  } else if (data.status === 'error') {
    body = (
      <p className="pt-muted pt-flashback-now-status">
        Could not load the live list.{' '}
        <a href={ORIGIN + '/'} target="_blank" rel="noopener noreferrer">
          Open Flashback Repository
        </a>
        .
      </p>
    )
  } else if (!data.items || data.items.length === 0) {
    body = (
      <p className="pt-muted pt-flashback-now-status">
        Nothing listed as Now showing right now — browse the{' '}
        <a href={ORIGIN + '/'} target="_blank" rel="noopener noreferrer">
          full library
        </a>
        .
      </p>
    )
  } else {
    let rows = []
    for (let i = 0; i < data.items.length; i++) {
      const it = data.items[i]
      rows = rows.concat([
        <li key={it.slug} className="pt-flashback-now-item">
          <a href={it.href} target="_blank" rel="noopener noreferrer">
            {it.title}
          </a>
        </li>,
      ])
    }
    body = (
      <ul className="pt-flashback-now-list" aria-label="Now showing titles">
        {rows}
      </ul>
    )
  }

  return (
    <section
      className="pt-flashback-now"
      aria-label="Flashback Repository now showing"
    >
      <style>{flashbackCss()}</style>
      <div className="pt-flashback-now-head">
        <h3 className="pt-flashback-now-title">Now showing</h3>
        <a
          className="pt-flashback-now-more"
          href={ORIGIN + '/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Flashback Repository →
        </a>
      </div>
      {body}
    </section>
  )
}

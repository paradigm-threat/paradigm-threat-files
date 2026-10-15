/**
 * Flashback “Now showing” — SSR shell + client fill of soft-kept DOM.
 *
 * Soft-hydrate keeps the SSR `[data-pt-flashback-ssr]` node visible and does not
 * swap this island (unlike ChangeLog). On phase ≥3 we fetch index.json and write
 * into that node via document.querySelector.
 */
import React, { useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'

const INDEX_URL = 'https://flashbackrepository.org/index.json'
const ORIGIN = 'https://flashbackrepository.org'
const STYLE_ID = 'pt-flashback-now-host-css'

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

function ensureCss(doc) {
  if (doc === null || doc === undefined) return
  if (doc.getElementById(STYLE_ID)) return
  const st = doc.createElement('style')
  st.id = STYLE_ID
  st.textContent =
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
  const head = doc.head || doc.documentElement
  if (head !== null && head !== undefined) head.appendChild(st)
}

function esc(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function paintShell(el, items, failed) {
  if (el === null || el === undefined) return
  const doc = el.ownerDocument || document
  ensureCss(doc)
  let body = ''
  if (failed === true) {
    body =
      '<p class="pt-muted pt-flashback-now-status">Could not load the live list. ' +
      '<a href="' +
      esc(ORIGIN + '/') +
      '" target="_blank" rel="noopener noreferrer">Open Flashback Repository</a>.</p>'
  } else if (items === null || items === undefined || items.length === 0) {
    body =
      '<p class="pt-muted pt-flashback-now-status">Nothing listed as Now showing right now — browse the ' +
      '<a href="' +
      esc(ORIGIN + '/') +
      '" target="_blank" rel="noopener noreferrer">full library</a>.</p>'
  } else {
    let rows = ''
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      rows =
        rows +
        '<li class="pt-flashback-now-item"><a href="' +
        esc(it.href) +
        '" target="_blank" rel="noopener noreferrer">' +
        esc(it.title) +
        '</a></li>'
    }
    body =
      '<ul class="pt-flashback-now-list" aria-label="Now showing titles">' +
      rows +
      '</ul>'
  }
  el.innerHTML =
    '<div class="pt-flashback-now-head">' +
    '<h3 class="pt-flashback-now-title">Now showing</h3>' +
    '<a class="pt-flashback-now-more" href="' +
    esc(ORIGIN + '/') +
    '" target="_blank" rel="noopener noreferrer">Flashback Repository -&gt;</a>' +
    '</div>' +
    body
  el.removeAttribute('data-pt-flashback-ssr')
  el.setAttribute('data-pt-flashback-filled', '1')
}

function fillSoftKeptShell() {
  let el = null
  try {
    el = document.querySelector(
      '[data-pt-flashback-ssr]:not([data-pt-flashback-filled="1"])',
    )
  } catch (e) {
    return
  }
  if (el === null || el === undefined) return
  fetch(INDEX_URL, { cache: 'default' })
    .then((res) => {
      if (!res || res.ok !== true) return null
      return res.json()
    })
    .then((json) => {
      if (json === null || json === undefined) {
        paintShell(el, [], true)
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
          { slug: slug, title: title, href: ORIGIN + '/' + slug },
        ])
      }
      paintShell(el, items, false)
    })
    .catch(() => {
      paintShell(el, [], true)
    })
}

export default function FlashbackNowShowing() {
  const phase3 = isClientLivePhase(3) === true

  useEffect(() => {
    if (phase3 !== true) return
    fillSoftKeptShell()
  }, [phase3])

  if (phase3 === true) {
    return null
  }
  if (isCsrHost()) {
    return null
  }
  return (
    <section
      className="pt-flashback-now"
      aria-label="Flashback Repository now showing"
      data-pt-flashback-ssr="1"
    >
      <div className="pt-flashback-now-head">
        <h3 className="pt-flashback-now-title">Now showing</h3>
        <a
          className="pt-flashback-now-more"
          href={ORIGIN + '/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {'Flashback Repository ->'}
        </a>
      </div>
      <p className="pt-muted pt-flashback-now-status">Loading Now showing...</p>
    </section>
  )
}

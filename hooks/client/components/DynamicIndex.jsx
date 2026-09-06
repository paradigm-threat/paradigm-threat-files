/**
 * Right-column TOC — content-derived items (no Dom heading scrape).
 * Links are #id anchors; active follows URL hash when available.
 */
import React, { useState, useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { propStr, propOr } from 'hooks/client/propOr.jsx'

function str(v) {
  if (v === null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return '' + v
  return ''
}

function truncateTitle(title) {
  const t = str(title).trim()
  if (t.length <= 72) return t
  return t.slice(0, 69) + '...'
}

function locationHashId() {
  try {
    const loc = document.location
    if (!loc) return ''
    let h = ''
    if (typeof loc.hash === 'string') h = loc.hash
    if (h.length === 0) return ''
    if (h.charAt(0) === '#') h = h.slice(1)
    return h
  } catch (e) {
    return ''
  }
}

function levelClass(level) {
  if (level === 2) return 'pt-toc-l2'
  if (level === 3) return 'pt-toc-l3'
  if (level === 4) return 'pt-toc-l4'
  if (level === 5) return 'pt-toc-l5'
  if (level === 6) return 'pt-toc-l6'
  return 'pt-toc-l1'
}

function renderTocLinks(items, activeId) {
  let links = []
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const hid = it.id
    let linkCls = 'pt-toc-link ' + levelClass(it.level)
    if (hid === activeId) {
      linkCls = linkCls + ' pt-toc-link-active'
    }
    links = links.concat([
      <li key={hid} className="pt-toc-item">
        <a className={linkCls} href={'#' + hid}>
          {truncateTitle(it.title)}
        </a>
      </li>,
    ])
  }
  return links
}

function normalizeItems(raw) {
  let out = []
  if (!raw) return out
  let list = raw
  try {
    if (typeof raw.length !== 'number') return out
  } catch (e) {
    return out
  }
  for (let i = 0; i < list.length; i++) {
    const it = list[i]
    if (!it) continue
    let id = ''
    let title = ''
    let level = 1
    try {
      if (typeof it.id === 'string') id = it.id
    } catch (e2) {}
    try {
      if (typeof it.title === 'string') title = it.title
    } catch (e3) {}
    try {
      if (typeof it.level === 'number') level = it.level
    } catch (e4) {}
    if (id.length === 0) continue
    out = out.concat([{ id: id, title: title, level: level }])
  }
  return out
}

/** Sticky on-this-page index (mobile full-width + lg sidebar). */
export default function DynamicIndex(props) {
  const pathKey = propStr(props, 'pathKey', '')
  const items = normalizeItems(propOr(props, 'items', []))
  const live = isClientLivePhase(3) === true
  const activeState = useState('')
  const activeId = activeState[0]
  const setActiveId = activeState[1]

  useEffect(() => {
    if (!live) return
    const sync = () => {
      setActiveId(locationHashId())
    }
    sync()
    let attached = false
    try {
      if (globalThis && typeof globalThis.addEventListener === 'function') {
        globalThis.addEventListener('hashchange', sync)
        attached = true
      }
    } catch (e) {}
    return () => {
      if (!attached) return
      try {
        globalThis.removeEventListener('hashchange', sync)
      } catch (e2) {}
    }
  }, [live, pathKey])

  // SSR: still render TOC when P0 extract produced items (article-first).
  if (!live && items.length === 0) {
    return (
      <aside
        className="pt-toc lg:pt-toc-lg"
        aria-label="Table of contents"
        data-pt-toc-ssr="1"
      >
        <div className="pt-toc-head">
          <h2 className="pt-toc-title">{'Table of Contents'}</h2>
        </div>
        <p className="pt-muted">Contents load after page open…</p>
        <span
          aria-hidden="true"
          hidden={true}
          className="pt-toc-list pt-toc-item pt-toc-link pt-toc-link-active pt-toc-l1 pt-toc-l2 pt-toc-l3 pt-toc-l4 pt-toc-l5 pt-toc-l6 pt-toc-empty"
          data-pt-toc-css="true"
        />
      </aside>
    )
  }

  if (items.length === 0) {
    return (
      <aside
        className="pt-toc pt-toc-empty lg:pt-toc-lg"
        aria-label="Table of contents"
        data-pt-toc-empty="1"
      />
    )
  }

  const links = renderTocLinks(items, live ? activeId : '')

  if (!live) {
    return (
      <aside
        className="pt-toc lg:pt-toc-lg"
        aria-label="Table of contents"
        data-pt-toc="1"
      >
        <div className="pt-toc-head">
          <h2 className="pt-toc-title">{'Table of Contents'}</h2>
        </div>
        <ul className="pt-toc-list">{links}</ul>
      </aside>
    )
  }

  return (
    <aside className="pt-toc lg:pt-toc-lg" aria-label="Table of contents">
      <div className="pt-toc-head">
        <h2 className="pt-toc-title">{'Table of Contents'}</h2>
      </div>
      <ul className="pt-toc-list">{links}</ul>
    </aside>
  )
}

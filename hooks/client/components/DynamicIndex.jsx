/**
 * Right-column TOC — content-derived nested headings (no Dom scrape, no setState).
 * Active hash is data-pt-toc-active; hashchange only flips attributes.
 * mode=menu: mobile drawer “On this page” (old Next.js Navbar parity).
 */
import React, { useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { nestTocItems } from '@relay/catalog'
import { propStr, propOr } from 'hooks/client/propOr.jsx'
import { getPageToc } from 'hooks/client/tocStore.js'

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

function syncTocActive() {
  const id = locationHashId()
  let links = []
  try {
    links = document.querySelectorAll('[data-pt-toc-id]')
  } catch (e) {
    return
  }
  if (!links) return
  let n = 0
  try {
    n = links.length
  } catch (e2) {
    return
  }
  for (let i = 0; i < n; i++) {
    const el = links[i]
    let hid = ''
    try {
      hid = el.getAttribute('data-pt-toc-id')
    } catch (e3) {}
    const on = hid === id ? '1' : '0'
    try {
      el.setAttribute('data-pt-toc-active', on)
    } catch (e4) {}
  }
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

function tocChildList(node) {
  let kids = []
  try {
    if (node && node.children) kids = node.children
  } catch (e) {}
  return kids
}

function TocEntry(props) {
  const node = props.node
  const activeId = props.activeId
  let id = ''
  let title = ''
  let level = 1
  try {
    if (node && typeof node.id === 'string') id = node.id
  } catch (e) {}
  try {
    if (node && typeof node.title === 'string') title = node.title
  } catch (e2) {}
  try {
    if (node && typeof node.level === 'number') level = node.level
  } catch (e3) {}
  if (id.length === 0) return null

  const kids = tocChildList(node)
  const isH1 = level === 1
  let linkCls = 'pt-toc-link'
  if (isH1) {
    linkCls = linkCls + ' pt-toc-h1'
  } else {
    linkCls = linkCls + ' pt-toc-sub'
  }
  const activeVal = id === activeId ? '1' : '0'

  let childEls = []
  for (let i = 0; i < kids.length; i++) {
    childEls = childEls.concat([
      <TocEntry key={kids[i].id} node={kids[i]} activeId={activeId} />,
    ])
  }

  return (
    <li className="pt-toc-item">
      <a
        className={linkCls}
        href={'#' + id}
        data-pt-toc-id={id}
        data-pt-toc-active={activeVal}
      >
        {truncateTitle(title)}
      </a>
      {kids.length > 0 ? <ul className="pt-toc-nested">{childEls}</ul> : null}
    </li>
  )
}

function tocCssMarker() {
  return (
    <span
      aria-hidden="true"
      hidden={true}
      className="pt-toc-list pt-toc-item pt-toc-link pt-toc-link-active pt-toc-h1 pt-toc-sub pt-toc-nested pt-toc-l1 pt-toc-l2 pt-toc-l3 pt-toc-l4 pt-toc-l5 pt-toc-l6 pt-toc-empty"
      data-pt-toc-css="true"
    />
  )
}

/** Sticky on-this-page index (sidebar) or mobile-menu strip (mode=menu). */
export default function DynamicIndex(props) {
  const pathKey = propStr(props, 'pathKey', '')
  const mode = propStr(props, 'mode', 'sidebar')
  const isMenu = mode === 'menu'
  let items = normalizeItems(propOr(props, 'items', []))
  if (items.length === 0 && isMenu === true) {
    items = normalizeItems(getPageToc(pathKey))
  }
  let nested = []
  try {
    nested = nestTocItems(items)
  } catch (eNest) {}
  const live = isClientLivePhase(3) === true
  const activeId = live ? locationHashId() : ''

  useEffect(() => {
    if (!live) return
    syncTocActive()
    let attached = false
    try {
      if (globalThis && typeof globalThis.addEventListener === 'function') {
        globalThis.addEventListener('hashchange', syncTocActive)
        attached = true
      }
    } catch (e) {}
    return () => {
      if (!attached) return
      try {
        globalThis.removeEventListener('hashchange', syncTocActive)
      } catch (e2) {}
    }
  }, [live, pathKey])

  const title = isMenu === true ? 'On this page' : 'Table of Contents'
  const aria = isMenu === true ? 'On this page' : 'Table of contents'
  let wrapClass = 'pt-toc lg:pt-toc-lg'
  if (isMenu === true) {
    wrapClass = 'pt-toc pt-toc-menu'
  }

  if (!live && items.length === 0) {
    if (isMenu === true) {
      return null
    }
    return (
      <aside className={wrapClass} aria-label={aria} data-pt-toc-ssr="1">
        <div className="pt-toc-head">
          <h2 className="pt-toc-title">{title}</h2>
        </div>
        <p className="pt-muted">Contents load after page open…</p>
        {tocCssMarker()}
      </aside>
    )
  }

  if (items.length === 0) {
    if (isMenu === true) {
      return null
    }
    return (
      <aside
        className="pt-toc pt-toc-empty lg:pt-toc-lg"
        aria-label={aria}
        data-pt-toc-empty="1"
      />
    )
  }

  let entries = []
  for (let i = 0; i < nested.length; i++) {
    entries = entries.concat([
      <TocEntry key={nested[i].id} node={nested[i]} activeId={activeId} />,
    ])
  }

  return (
    <aside className={wrapClass} aria-label={aria} data-pt-toc="1">
      <div className="pt-toc-head">
        <h2 className="pt-toc-title">{title}</h2>
      </div>
      <ul className="pt-toc-list">{entries}</ul>
    </aside>
  )
}

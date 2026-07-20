/**
 * Right-column TOC — scrape headings from .pt-article-body (poll; no MutationObserver).
 */
import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'

function str(v) {
  if (v === null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return '' + v
  return ''
}

function trimEndUnderscore(s) {
  let t = s
  while (t.length > 0 && t.charAt(t.length - 1) === '_') {
    t = t.slice(0, t.length - 1)
  }
  return t
}

function slugify(title) {
  const s = str(title).toLowerCase()
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      if (out.length > 0 && out.charAt(out.length - 1) !== '_') {
        out = out + '_'
      }
    } else if (
      (c >= 'a' && c <= 'z') ||
      (c >= '0' && c <= '9') ||
      c === '-' ||
      c === '_'
    ) {
      out = out + c
    }
  }
  out = trimEndUnderscore(out)
  if (out.length === 0) return 'section'
  return out
}

function headingLevel(el) {
  let tag = ''
  try {
    if (el && typeof el.tagName === 'string') tag = el.tagName
  } catch (e) {}
  if (tag.length < 2) return 0
  const ch = tag.charAt(1)
  if (ch === '1') return 1
  if (ch === '2') return 2
  if (ch === '3') return 3
  if (ch === '4') return 4
  if (ch === '5') return 5
  if (ch === '6') return 6
  return 0
}

function headingExcluded(el) {
  try {
    const ignore = el.getAttribute('data-toc-ignore')
    if (ignore !== null) return true
  } catch (e) {}
  try {
    const cls = el.getAttribute('class')
    if (typeof cls === 'string' && cls.indexOf('no-index') >= 0) return true
  } catch (e2) {}
  return false
}

function idInUsed(id, used) {
  for (let i = 0; i < used.length; i++) {
    if (used[i] === id) return true
  }
  return false
}

function uniqueId(base, used) {
  let id = base
  let n = 1
  while (idInUsed(id, used)) {
    id = base + '_' + n
    n = n + 1
  }
  return id
}

function fingerprint(items) {
  let s = ''
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    s = s + it.id + '\t' + it.title + '\t' + it.level + '\n'
  }
  return s
}

function scanHeadings() {
  let nodes = []
  try {
    const list = document.querySelectorAll(
      '.pt-article-body h1, .pt-article-body h2, .pt-article-body h3, .pt-article-body h4, .pt-article-body h5, .pt-article-body h6'
    )
    if (list && typeof list.length === 'number') nodes = list
  } catch (e) {
    return []
  }

  let used = []
  let out = []
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i]
    if (!el) continue
    if (headingExcluded(el)) continue
    const level = headingLevel(el)
    if (level < 1) continue
    let title = ''
    try {
      if (typeof el.textContent === 'string') title = el.textContent
    } catch (e2) {}
    title = str(title).trim()
    if (title.length === 0) continue

    let id = ''
    try {
      if (typeof el.id === 'string') id = el.id
    } catch (e3) {}
    if (id.length === 0) {
      try {
        const existing = el.getAttribute('id')
        if (typeof existing === 'string') id = existing
      } catch (e4) {}
    }
    if (id.length === 0) id = slugify(title)
    id = uniqueId(id, used)
    used = used.concat([id])
    try {
      el.setAttribute('id', id)
    } catch (e5) {}

    out = out.concat([{ id: id, title: title, level: level }])
  }
  return out
}

function scrollToId(id) {
  try {
    const el = document.getElementById(id)
    if (el && el.scrollIntoView) {
      el.scrollIntoView()
    }
  } catch (e) {}
}

/** Sticky on-this-page index (lg sidebar). */
export default function DynamicIndex() {
  const live = isClientLive() === true
  const state = useState([])
  const items = state[0]
  const setItems = state[1]

  useEffect(() => {
    if (!live) return
    let lastFp = ''
    const tick = () => {
      try {
        const next = scanHeadings()
        const fp = fingerprint(next)
        if (fp !== lastFp) {
          lastFp = fp
          setItems(next)
        }
      } catch (e) {}
    }
    tick()
    const timerId = setInterval(tick, 600)
    return () => {
      try {
        clearInterval(timerId)
      } catch (e2) {}
    }
  }, [live])

  if (!live) {
    return (
      <aside
        className="pt-toc lg:pt-toc-lg"
        aria-label="On this page"
        data-pt-toc-ssr="1"
      >
        <div className="pt-toc-head">
          <h2 className="pt-toc-title">On this page</h2>
        </div>
        <p className="pt-muted">Contents load after page open…</p>
        <span
          aria-hidden="true"
          hidden={true}
          className="pt-toc-list pt-toc-item pt-toc-link pt-toc-l1 pt-toc-l2 pt-toc-l3 pt-toc-l4 pt-toc-l5 pt-toc-l6"
          data-pt-toc-css="true"
        />
      </aside>
    )
  }

  if (items.length === 0) {
    return (
      <aside
        className="pt-toc lg:pt-toc-lg"
        aria-label="On this page"
        data-pt-toc-empty="1"
        hidden={true}
      />
    )
  }

  let links = []
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    let lvlCls = 'pt-toc-l1'
    if (it.level === 2) lvlCls = 'pt-toc-l2'
    if (it.level === 3) lvlCls = 'pt-toc-l3'
    if (it.level === 4) lvlCls = 'pt-toc-l4'
    if (it.level === 5) lvlCls = 'pt-toc-l5'
    if (it.level === 6) lvlCls = 'pt-toc-l6'
    const hid = it.id
    links = links.concat([
      <li key={hid} className="pt-toc-item">
        <button
          type="button"
          className={'pt-toc-link ' + lvlCls}
          onClick={() => {
            scrollToId(hid)
          }}
        >
          {it.title}
        </button>
      </li>,
    ])
  }

  return (
    <aside className="pt-toc lg:pt-toc-lg" aria-label="On this page">
      <div className="pt-toc-head">
        <h2 className="pt-toc-title">On this page</h2>
      </div>
      <ul className="pt-toc-list">{links}</ul>
    </aside>
  )
}

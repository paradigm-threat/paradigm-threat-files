/**
 * Right-column TOC — scrape headings from .pt-article-body (poll; no MutationObserver).
 * Scroll-spy active link via getBoundingClientRect (Dom host).
 * Hash deep-link + data-toc-ignore subtree skip.
 */
import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { slugify, uniqueId } from '@relay/util'
import { propStr } from 'hooks/client/propOr.jsx'

function str(v) {
  if (v === null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return '' + v
  return ''
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

/** Mark headings under [data-toc-ignore] (no DomNode#closest — use subtree query). */
function markIgnoredHeadings() {
  let nodes = []
  try {
    const list = document.querySelectorAll(
      '.pt-article-body [data-toc-ignore] h1, .pt-article-body [data-toc-ignore] h2, .pt-article-body [data-toc-ignore] h3, .pt-article-body [data-toc-ignore] h4, .pt-article-body [data-toc-ignore] h5, .pt-article-body [data-toc-ignore] h6'
    )
    if (list && typeof list.length === 'number') nodes = list
  } catch (e) {
    return
  }
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i]
    if (!el) continue
    try {
      el.setAttribute('data-pt-toc-skip', '1')
    } catch (e2) {}
  }
}

function headingExcluded(el) {
  try {
    const skip = el.getAttribute('data-pt-toc-skip')
    if (skip !== null) return true
  } catch (e0) {}
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

function fingerprint(items) {
  let s = ''
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    s = s + it.id + '\t' + it.title + '\t' + it.level + '\n'
  }
  return s
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

function scanHeadings() {
  markIgnoredHeadings()
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
  const maxItems = 80
  for (let i = 0; i < nodes.length; i++) {
    if (out.length >= maxItems) break
    const el = nodes[i]
    if (!el) continue
    if (headingExcluded(el)) continue
    const level = headingLevel(el)
    if (level < 1) continue
    // Skip lone page H1 (article title) — TOC starts at sections.
    if (level === 1 && out.length === 0 && i === 0) {
      let onlyH1 = true
      for (let j = 1; j < nodes.length; j++) {
        if (headingLevel(nodes[j]) >= 1) {
          onlyH1 = false
          break
        }
      }
      if (!onlyH1) continue
    }
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

function activeHeadingId(items) {
  if (!items || items.length === 0) return ''
  let best = items[0].id
  for (let i = 0; i < items.length; i++) {
    const id = items[i].id
    try {
      const el = document.getElementById(id)
      if (!el || !el.getBoundingClientRect) continue
      const r = el.getBoundingClientRect()
      if (r && typeof r.top === 'number' && r.top <= 120) {
        best = id
      }
    } catch (e) {}
  }
  return best
}

function renderTocLinks(items, activeId, setActiveId) {
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
    let linkCls = 'pt-toc-link ' + lvlCls
    if (hid === activeId) linkCls = linkCls + ' pt-toc-link-active'
    links = links.concat([
      <li key={hid} className="pt-toc-item">
        <button
          type="button"
          className={linkCls}
          onClick={() => {
            setActiveId(hid)
            scrollToId(hid)
          }}
        >
          {truncateTitle(it.title)}
        </button>
      </li>,
    ])
  }
  return links
}

/** Sticky on-this-page index (mobile full-width + lg sidebar). */
export default function DynamicIndex(props) {
  const pathKey = propStr(props, 'pathKey', '')
  const live = isClientLive() === true
  const state = useState([])
  const items = state[0]
  const setItems = state[1]
  const activeState = useState('')
  const activeId = activeState[0]
  const setActiveId = activeState[1]

  useEffect(() => {
    if (!live) return
    let lastFp = ''
    let lastActive = ''
    let didHashJump = false
    let stableTicks = 0
    setItems([])
    setActiveId('')
    const tick = () => {
      try {
        const next = scanHeadings()
        const fp = fingerprint(next)
        if (fp !== lastFp) {
          lastFp = fp
          stableTicks = 0
          setItems(next)
        } else {
          stableTicks = stableTicks + 1
        }
        if (!didHashJump && next.length > 0) {
          const want = locationHashId()
          if (want.length === 0) {
            didHashJump = true
          } else {
            let found = false
            for (let i = 0; i < next.length; i++) {
              if (next[i].id === want) {
                found = true
                break
              }
            }
            if (found) {
              didHashJump = true
              setActiveId(want)
              lastActive = want
              scrollToId(want)
            } else if (stableTicks >= 2) {
              didHashJump = true
            }
          }
        }
        const aid = activeHeadingId(next)
        if (aid !== lastActive) {
          lastActive = aid
          setActiveId(aid)
        }
      } catch (e) {}
    }
    tick()
    const timerId = setInterval(tick, 400)
    return () => {
      try {
        clearInterval(timerId)
      } catch (e2) {}
    }
  }, [live, pathKey])

  if (!live) {
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

  // Keep the instance mounted while empty so the poll effect can fill headings.
  // Returning null unmounts CleverScript hooks and freezes TOC at empty forever.
  if (items.length === 0) {
    return (
      <aside
        className="pt-toc pt-toc-empty lg:pt-toc-lg"
        aria-label="Table of contents"
        data-pt-toc-empty="1"
      />
    )
  }

  const links = renderTocLinks(items, activeId, setActiveId)

  return (
    <aside className="pt-toc lg:pt-toc-lg" aria-label="Table of contents">
      <div className="pt-toc-head">
        <h2 className="pt-toc-title">{'Table of Contents'}</h2>
      </div>
      <ul className="pt-toc-list">{links}</ul>
    </aside>
  )
}

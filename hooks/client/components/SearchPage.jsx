import React, { useState } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { IconSearch } from 'hooks/client/components/Icons.jsx'
import { parseJson, queryIndexBody } from 'hooks/client/jsonUtil.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'
import { ensureSearchFormNav, ensureSearchInputSeed } from 'hooks/client/searchFormNav.js'

/** Module-warm: one QUERY per query string per hydrate session. */
let clientSearchWarm = { q: '', error: '', rows: null }
/** First seed for the search input this session — do not remount over typing. */
let searchFieldSeedOnce = null

function str(v) {
  if (v === null) return ''
  if (typeof v === 'boolean') {
    if (v) return 'true'
    return 'false'
  }
  if (typeof v === 'number') return '' + v
  if (typeof v === 'string') return v
  return ''
}

function rowTitle(row) {
  if (!row) return 'Untitled'
  try {
    if (row._title && typeof row._title === 'string') return row._title
  } catch (e) {}
  try {
    if (row.title && typeof row.title === 'string') return row.title
  } catch (e) {}
  try {
    if (row.path && typeof row.path === 'string') return row.path
  } catch (e) {}
  return 'Untitled'
}

function rowPath(row) {
  if (!row) return ''
  try {
    if (row.path && typeof row.path === 'string') return row.path
  } catch (e) {}
  return ''
}

function filterSearchRows(data) {
  let rows = []
  if (!data || !data.results) return rows
  for (let i = 0; i < data.results.length; i++) {
    const row = data.results[i]
    let path = ''
    try {
      if (row.path && typeof row.path === 'string') path = row.path
    } catch (e) {}
    if (path.length === 0) continue
    if (path === 'assets.manifest.json') continue
    let kind = ''
    try {
      if (row.content_kind && typeof row.content_kind === 'string') kind = row.content_kind
    } catch (e2) {}
    if (kind === 'exclude') continue
    rows = rows.concat([row])
  }
  return rows
}

/**
 * Bounded string QUERY (limit 24). SSR → RepoFetchHost.ssr_query; client → HTTP QUERY.
 */
function runSearch(query) {
  let resp = null
  try {
    resp = fetch('/', {
      method: 'QUERY',
      headers: {
        Accept: 'application/json',
      },
      body: queryIndexBody(query, 24, ''),
    })
  } catch (e) {
    return { error: 'Search failed (QUERY unavailable in this browser host)', rows: [] }
  }
  if (!resp || resp.ok !== true) {
    let st = 0
    if (resp && resp.status) st = resp.status
    return { error: 'Search failed (HTTP ' + st + ')', rows: [] }
  }
  let text = resp.text ? resp.text : ''
  if (text.length === 0) return { error: 'Empty search response', rows: [] }
  const data = parseJson(text)
  if (data && data.results && data.results.length >= 0) {
    return { error: '', rows: filterSearchRows(data) }
  }
  return { error: 'Could not parse search response', rows: [] }
}

function ensureClientSearch(query) {
  const q = str(query).trim()
  if (q.length === 0) {
    return { error: 'Enter a search query', rows: [] }
  }
  if (clientSearchWarm.q === q && clientSearchWarm.rows !== null) {
    return { error: clientSearchWarm.error, rows: clientSearchWarm.rows }
  }
  const out = runSearch(q)
  clientSearchWarm = { q: q, error: out.error, rows: out.rows }
  return out
}

function ResultItem(props) {
  const row = props.row
  const path = rowPath(row)
  const href = path.length > 0 ? siteHref('/' + path) : siteHref('/README.md')
  return (
    <li className="pt-result-item">
      <a href={href} className="pt-result-link">
        <span className="pt-result-title">{rowTitle(row)}</span>
        {path.length > 0 ? <span className="pt-muted pt-result-path">{path}</span> : null}
      </a>
    </li>
  )
}

function readSeededQuery(props) {
  try {
    if (props && typeof props.initialQuery === 'string') {
      const t = str(props.initialQuery).trim()
      if (t.length > 0) return t
    }
  } catch (e) {}
  return ''
}

function hasSsrSearchResults() {
  try {
    const g = globalThis
    if (!g || !g.document) return false
    const el = g.document.querySelector('[data-pt-search-ssr]')
    if (!el) return false
    const item = el.querySelector('.pt-result-item')
    if (item) return true
  } catch (e) {}
  return false
}

/**
 * Soft-hydrate skips onClick; bind native submit via searchFormNav.js.
 * Seed also reads location.search so /search?q= works after a form GET.
 */
function readLocationQuery() {
  try {
    const g = globalThis
    if (!g || !g.location || typeof g.location.search !== 'string') return ''
    const s = g.location.search
    if (s.indexOf('q=') < 0) return ''
    let raw = s
    if (raw.charAt(0) === '?') raw = raw.slice(1)
    const parts = raw.split('&')
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (p.indexOf('q=') === 0) {
        let v = p.slice(2)
        v = v.split('+').join(' ')
        return str(v).trim()
      }
    }
  } catch (e) {}
  return ''
}

export default function SearchPage(props) {
  ensureSearchFormNav()
  ensureSearchInputSeed()

  let currentPath = '/search'
  try {
    if (props.currentPath) currentPath = str(props.currentPath)
  } catch (e) {
    currentPath = '/search'
  }
  let seeded = readSeededQuery(props)
  if (seeded.length === 0) {
    seeded = readLocationQuery()
  }
  // Capture the first non-empty seed once per session; blank /search stays blank.
  if (searchFieldSeedOnce === null) {
    searchFieldSeedOnce = seeded
  }
  const fieldValue = searchFieldSeedOnce === null ? '' : searchFieldSeedOnce
  const live = isClientLive() === true
  const softKeep = live === true && hasSsrSearchResults() === true

  // Results state kept for live auto-fill display path.
  const resultState = useState({ error: '', rows: [] })
  const result = resultState[0]
  const submitted = useState(seeded)
  const submittedQuery = submitted[0]

  // SSR with seed → in-process QUERY.
  let ssrError = ''
  let ssrRows = []
  let ssrSubmitted = ''
  if (live !== true && seeded.length > 0) {
    const out = runSearch(seeded)
    ssrError = out.error
    ssrRows = out.rows
    ssrSubmitted = seeded
  }

  // Live + seeded (e.g. /search?q=cia or CSR) and no SSR island → one QUERY.
  let liveAutoError = ''
  let liveAutoRows = []
  let liveAutoSubmitted = ''
  if (live === true && softKeep !== true && seeded.length > 0) {
    const out = ensureClientSearch(seeded)
    liveAutoError = out.error
    liveAutoRows = out.rows
    liveAutoSubmitted = seeded
  }

  let displayError = result.error
  let displayRows = result.rows
  let displaySubmitted = submittedQuery
  if (live !== true && ssrSubmitted.length > 0) {
    displayError = ssrError
    displayRows = ssrRows
    displaySubmitted = ssrSubmitted
  } else if (
    live === true &&
    softKeep !== true &&
    liveAutoSubmitted.length > 0 &&
    (result.rows.length === 0 && result.error.length === 0)
  ) {
    displayError = liveAutoError
    displayRows = liveAutoRows
    displaySubmitted = liveAutoSubmitted
  }

  let items = []
  if (softKeep !== true) {
    for (let i = 0; i < displayRows.length; i++) {
      items = items.concat([<ResultItem key={'r-' + i} row={displayRows[i]} />])
    }
  }

  return (
    <SiteChrome currentPath={currentPath}>
      <main className="pt-page" id="pt-search">
        <div className="pt-container">
          <header className="pt-header">
            <h1 className="pt-title">Search</h1>
            <p className="pt-muted">Same-repo QUERY over the thin files index.</p>
          </header>
          <form
            id="pt-search-form"
            className="pt-search-bar"
            method="get"
            action={siteHref('/search')}
            role="search"
            data-pt-search-seed={fieldValue}
          >
            <IconSearch />
            {live === true ? (
              <input
                id="pt-search-input"
                className="pt-search-input"
                type="search"
                name="q"
                placeholder="Keywords…"
              />
            ) : (
              <input
                id="pt-search-input"
                className="pt-search-input"
                type="search"
                name="q"
                value={fieldValue}
                placeholder="Keywords…"
              />
            )}
            <button type="submit" className="pt-btn">
              Search
            </button>
          </form>
          {displaySubmitted.length > 0 ? (
            <p className="pt-muted">
              {'Results for "' + displaySubmitted + '"'}
              {displayError.length > 0 ? ' — ' + displayError : ''}
            </p>
          ) : null}
          {softKeep === true ? (
            <div data-pt-search-keep="1" aria-hidden="true" />
          ) : items.length > 0 ? (
            live !== true ? (
              <ul className="pt-result-list" data-pt-search-ssr="1">
                {items}
              </ul>
            ) : (
              <ul className="pt-result-list">{items}</ul>
            )
          ) : null}
        </div>
      </main>
    </SiteChrome>
  )
}

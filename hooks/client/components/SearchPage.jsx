import React, { useState } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { IconSearch } from 'hooks/client/components/Icons.jsx'
import { parseJson, queryIndexBody } from 'hooks/client/jsonUtil.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'

/** Module-warm: one QUERY per query string per hydrate session (client CSR / live). */
let clientSearchWarm = { q: '', error: '', rows: null }

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
 * Bounded string QUERY (limit 24). On gateway SSR this hits RepoFetchHost.ssr_query
 * (in-process FTS). On the live client it is same-origin HTTP QUERY.
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

/** Prefer live input DOM value — CleverScript controlled inputs often lag setState. */
function readInputQuery(fallback) {
  try {
    const g = globalThis
    if (g && g.document) {
      const el = g.document.querySelector('#pt-search-input')
      if (el && typeof el.value === 'string') {
        const v = str(el.value).trim()
        if (v.length > 0) return v
      }
    }
  } catch (e) {}
  return str(fallback).trim()
}

export default function SearchPage(props) {
  let currentPath = '/search'
  try {
    if (props.currentPath) currentPath = str(props.currentPath)
  } catch (e) {
    currentPath = '/search'
  }
  const seeded = readSeededQuery(props)
  const live = isClientLive() === true
  const softKeep = live === true && hasSsrSearchResults() === true

  const qState = useState(seeded)
  const query = qState[0]
  const setQuery = qState[1]
  const submitted = useState(seeded)
  const submittedQuery = submitted[0]
  const setSubmittedQuery = submitted[1]
  const resultState = useState({ error: '', rows: [] })
  const result = resultState[0]
  const setResult = resultState[1]

  // SSR (or first paint before live): topic/q seed → bounded in-process QUERY.
  let ssrError = ''
  let ssrRows = []
  let ssrSubmitted = ''
  if (live !== true && seeded.length > 0) {
    const out = runSearch(seeded)
    ssrError = out.error
    ssrRows = out.rows
    ssrSubmitted = seeded
  }

  // Live without soft-keep (CSR nav / no SSR island): one module-warm QUERY.
  let liveAutoError = ''
  let liveAutoRows = []
  let liveAutoSubmitted = ''
  if (live === true && softKeep !== true && seeded.length > 0) {
    const out = ensureClientSearch(seeded)
    liveAutoError = out.error
    liveAutoRows = out.rows
    liveAutoSubmitted = seeded
  }

  function doSearch() {
    if (live !== true) {
      return
    }
    const q = readInputQuery(query)
    setQuery(q)
    setSubmittedQuery(q)
    if (q.length === 0) {
      setResult({ error: 'Enter a search query', rows: [] })
      return
    }
    clientSearchWarm = { q: '', error: '', rows: null }
    setResult(ensureClientSearch(q))
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
    result.rows.length === 0 &&
    result.error.length === 0
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
          <div className="pt-search-bar">
            <IconSearch />
            <input
              id="pt-search-input"
              className="pt-search-input"
              type="search"
              value={query}
              placeholder="Keywords…"
              onChange={(e) => {
                try {
                  if (e && e.target) setQuery(str(e.target.value))
                } catch (err) {}
              }}
            />
            <button
              type="button"
              className="pt-btn"
              onClick={() => {
                doSearch()
              }}
            >
              Search
            </button>
          </div>
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

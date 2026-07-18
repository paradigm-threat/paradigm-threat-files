import React, { useState } from 'react'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import { IconSearch } from 'hooks/client/components/Icons.jsx'
import { parseJson, queryIndexBody } from 'hooks/client/jsonUtil.jsx'

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

function runSearch(query) {
  const resp = fetch('/', {
    method: 'QUERY',
    body: queryIndexBody(query, 24, ''),
  })
  if (!resp || resp.ok !== true) {
    let st = 0
    if (resp && resp.status) st = resp.status
    return { error: 'Search failed (HTTP ' + st + ')', rows: [] }
  }
  let text = resp.text ? resp.text : ''
  if (text.length === 0) return { error: 'Empty search response', rows: [] }
  const data = parseJson(text)
  if (data && data.results && data.results.length >= 0) {
    return { error: '', rows: data.results }
  }
  return { error: 'Could not parse search response', rows: [] }
}

function ResultItem(props) {
  const row = props.row
  const path = rowPath(row)
  const href = path.length > 0 ? '/' + path : '/README.md'
  return (
    <li className="pt-result-item">
      <a href={href} className="pt-result-link">
        <span className="pt-result-title">{rowTitle(row)}</span>
        {path.length > 0 ? <span className="pt-muted pt-result-path">{path}</span> : null}
      </a>
    </li>
  )
}

export default function SearchPage(props) {
  let currentPath = '/search'
  try {
    if (props.currentPath) currentPath = props.currentPath
  } catch (e) {
    currentPath = '/search'
  }
  const qState = useState('')
  const query = qState[0]
  const setQuery = qState[1]
  const submitted = useState('')
  const submittedQuery = submitted[0]
  const setSubmittedQuery = submitted[1]
  const resultState = useState({ error: '', rows: [] })
  const result = resultState[0]
  const setResult = resultState[1]

  function doSearch() {
    const q = str(query).trim()
    setSubmittedQuery(q)
    if (q.length === 0) {
      setResult({ error: 'Enter a search query', rows: [] })
      return
    }
    setResult(runSearch(q))
  }

  const items = []
  for (let i = 0; i < result.rows.length; i++) {
    items.push(<ResultItem key={'r-' + i} row={result.rows[i]} />)
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
          {submittedQuery.length > 0 ? (
            <p className="pt-muted">
              Results for “{submittedQuery}”
              {result.error.length > 0 ? ' — ' + result.error : ''}
            </p>
          ) : null}
          {items.length > 0 ? <ul className="pt-result-list">{items}</ul> : null}
        </div>
      </main>
    </SiteChrome>
  )
}

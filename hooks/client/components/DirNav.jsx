import React from 'react'
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

function rowPath(row) {
  if (!row) return ''
  try {
    if (row.path && typeof row.path === 'string') return row.path
  } catch (e) {}
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
  const p = rowPath(row)
  if (p.length > 0) return p
  return 'Untitled'
}

function loadDirRows() {
  const resp = fetch('/', {
    method: 'QUERY',
    body: queryIndexBody('', 48, ''),
  })
  if (!resp || resp.ok !== true) return []
  const text = resp.text ? resp.text : ''
  if (text.length === 0) return []
  const data = parseJson(text)
  if (data && data.results) return data.results
  return []
}

/** Left directory from same-repo QUERY — hard AutoIndex components disabled. */
export default function DirNav() {
  const rows = loadDirRows()
  const items = []
  const n = rows.length < 40 ? rows.length : 40
  for (let i = 0; i < n; i++) {
    const row = rows[i]
    const path = rowPath(row)
    if (path.length === 0) continue
    const href = '/' + path
    items.push(
      <li key={'d-' + i} className="pt-dir-item">
        <a href={href} className="pt-dir-link">
          {rowTitle(row)}
        </a>
      </li>,
    )
  }

  return (
    <aside className="pt-dir-nav" aria-label="Directory">
      <h2 className="pt-dir-title">Index</h2>
      {items.length === 0 ? (
        <p className="pt-muted">No indexed paths yet.</p>
      ) : (
        <ul className="pt-dir-list">{items}</ul>
      )}
    </aside>
  )
}

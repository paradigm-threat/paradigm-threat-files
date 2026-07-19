import React, { useState } from 'react'
import {
  loadArticleRows,
  rowPath,
  rowTitle,
  siteHref,
} from 'hooks/client/loadArticles.jsx'

function folderLabel(name) {
  return name.replace(/_/g, ' ')
}

function insertPath(tree, parts, row) {
  if (parts.length === 0) return
  if (parts.length === 1) {
    let files = tree._files
    if (!files) files = []
    files = files.concat([row])
    tree._files = files
    return
  }
  const head = parts[0]
  let kids = tree._kids
  if (!kids) kids = {}
  let child = kids[head]
  if (!child) {
    child = { _files: [], _kids: {} }
    kids[head] = child
  }
  tree._kids = kids
  let rest = []
  for (let i = 1; i < parts.length; i++) {
    rest = rest.concat([parts[i]])
  }
  insertPath(child, rest, row)
}

function buildTree(rows) {
  const root = { _files: [], _kids: {} }
  for (let i = 0; i < rows.length; i++) {
    const path = rowPath(rows[i])
    if (path.length === 0) continue
    const parts = path.split('/')
    insertPath(root, parts, rows[i])
  }
  return root
}

function sortedKeys(map) {
  let keys = []
  try {
    const names = Object.keys(map)
    for (let i = 0; i < names.length; i++) {
      keys = keys.concat([names[i]])
    }
  } catch (e) {}
  let out = []
  for (let j = 0; j < keys.length; j++) {
    let next = []
    let inserted = false
    for (let k = 0; k < out.length; k++) {
      if (!inserted && keys[j] < out[k]) {
        next = next.concat([keys[j]])
        inserted = true
      }
      next = next.concat([out[k]])
    }
    if (!inserted) next = next.concat([keys[j]])
    out = next
  }
  return out
}

function renderTree(node, expanded, depth, keyPrefix) {
  let items = []
  const files = node._files ? node._files : []
  for (let i = 0; i < files.length; i++) {
    const row = files[i]
    const path = rowPath(row)
    if (path.length === 0) continue
    items = items.concat([
      <li key={keyPrefix + '-f-' + i} className="pt-dir-item">
        <a href={siteHref('/' + path)} className="pt-dir-link">
          {rowTitle(row)}
        </a>
      </li>,
    ])
  }

  const kids = node._kids ? node._kids : {}
  const names = sortedKeys(kids)
  for (let j = 0; j < names.length; j++) {
    const name = names[j]
    const child = kids[name]
    const childItems = renderTree(child, expanded, depth + 1, keyPrefix + '-d-' + name)
    if (childItems.length === 0) continue
    items = items.concat([
      <li key={keyPrefix + '-dir-' + name} className="pt-dir-folder">
        <details open={expanded}>
          <summary className="pt-dir-folder-label">{folderLabel(name)}</summary>
          <ul className="pt-dir-list pt-dir-nested">{childItems}</ul>
        </details>
      </li>,
    ])
  }
  return items
}

/** Left directory — nested nav-index tree (SSR + hydrate must match). */
export default function DirNav() {
  const expandedState = useState(true)
  const expanded = expandedState[0]
  const setExpanded = expandedState[1]
  const rows = loadArticleRows(200)
  const tree = buildTree(rows)
  const items = renderTree(tree, expanded, 0, 'dir')

  return (
    <aside className="pt-dir-nav" aria-label="Directory">
      <div className="pt-dir-head">
        <h2 className="pt-dir-title">Directory</h2>
        <div className="pt-dir-tools">
          <button type="button" className="pt-dir-tool" onClick={() => { setExpanded(true) }}>
            Expand
          </button>
          <button type="button" className="pt-dir-tool" onClick={() => { setExpanded(false) }}>
            Collapse
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="pt-muted">No indexed articles yet.</p>
      ) : (
        <ul className="pt-dir-list">{items}</ul>
      )}
    </aside>
  )
}

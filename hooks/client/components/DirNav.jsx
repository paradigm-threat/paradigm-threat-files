import React from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { buildDirTree } from '@relay/catalog'
import { take } from '@relay/util'
import { loadArticleRows, rowPath, rowTitle, siteHref } from 'hooks/client/loadArticles.jsx'
import FeelingLucky from 'hooks/client/components/FeelingLucky.jsx'

function fileItems(files, keyPrefix, maxFiles) {
  let items = []
  const n = files.length < maxFiles ? files.length : maxFiles
  for (let i = 0; i < n; i++) {
    const row = files[i]
    const path = rowPath(row)
    if (path.length === 0) continue
    items = items.concat([
      <li key={keyPrefix + 'f' + i} className="pt-dir-item">
        <a href={siteHref('/' + path)} className="pt-dir-link">
          {rowTitle(row)}
        </a>
      </li>,
    ])
  }
  if (files.length > maxFiles) {
    items = items.concat([
      <li key={keyPrefix + 'more'} className="pt-dir-item pt-muted">
        +{files.length - maxFiles} more
      </li>,
    ])
  }
  return items
}

function FolderBranch(props) {
  const node = props.node
  const depth = props.depth
  const keyPrefix = props.keyPrefix
  const maxTop = props.maxTop
  const maxFiles = props.maxFiles
  const maxDepth = props.maxDepth
  let name = ''
  let files = []
  let folders = []
  try {
    if (node && typeof node.name === 'string') name = node.name
  } catch (e) {}
  try {
    if (node && node.files) files = node.files
  } catch (e2) {}
  try {
    if (node && node.folders) folders = node.folders
  } catch (e3) {}

  const fileEls = fileItems(files, keyPrefix, maxFiles)
  let folderEls = []
  if (depth < maxDepth) {
    const nf = folders.length < maxTop ? folders.length : maxTop
    for (let i = 0; i < nf; i++) {
      folderEls = folderEls.concat([
        <FolderBranch
          key={keyPrefix + 'd' + i}
          node={folders[i]}
          depth={depth + 1}
          keyPrefix={keyPrefix + 'd' + i + '-'}
          maxTop={maxTop}
          maxFiles={maxFiles}
          maxDepth={maxDepth}
        />,
      ])
    }
  }

  if (depth === 0) {
    return (
      <ul className="pt-dir-list">
        {folderEls}
        {fileEls}
      </ul>
    )
  }

  return (
    <li className="pt-dir-folder">
      <div className="pt-dir-folder-label">{name}</div>
      <ul className="pt-dir-nested pt-dir-list">
        {folderEls}
        {fileEls}
      </ul>
    </li>
  )
}

/** Left directory — nested via @relay/catalog.buildDirTree (SSR-safe arrays). */
export default function DirNav() {
  if (isClientLive() !== true) {
    return (
      <aside
        className="pt-dir-nav lg:pt-dir-nav-lg"
        aria-label="Directory"
        data-pt-dirnav-ssr="1"
      >
        <div className="pt-dir-head">
          <h2 className="pt-dir-title">Directory</h2>
        </div>
        <p className="pt-muted">Directory loads after page open…</p>
      </aside>
    )
  }

  const rows = take(loadArticleRows(100), 100)
  const tree = buildDirTree(rows)
  let hasFolders = false
  let hasFiles = false
  try {
    if (tree && tree.folders && tree.folders.length > 0) hasFolders = true
  } catch (e) {}
  try {
    if (tree && tree.files && tree.files.length > 0) hasFiles = true
  } catch (e2) {}

  return (
    <aside className="pt-dir-nav lg:pt-dir-nav-lg" aria-label="Directory">
      <div className="pt-dir-head">
        <h2 className="pt-dir-title">Directory</h2>
        <div className="pt-dir-tools">
          <FeelingLucky />
        </div>
      </div>
      {!hasFolders && !hasFiles ? (
        <p className="pt-muted">No indexed articles yet.</p>
      ) : (
        <FolderBranch
          node={tree}
          depth={0}
          keyPrefix="r-"
          maxTop={14}
          maxFiles={5}
          maxDepth={2}
        />
      )}
    </aside>
  )
}

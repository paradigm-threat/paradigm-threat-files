import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { loadDirTree, dirExpandPaths } from '@relay/catalog'
import { includes } from '@relay/util'
import { propStr } from 'hooks/client/propOr.jsx'
import { rowPath, rowTitle, siteHref } from 'hooks/client/loadArticles.jsx'
import FeelingLucky from 'hooks/client/components/FeelingLucky.jsx'
import {
  IconChevronDownSm,
  IconChevronRightSm,
  IconFileSm,
} from 'hooks/client/components/Icons.jsx'

function stripRel(raw) {
  let s = typeof raw === 'string' ? raw : ''
  while (s.length > 0 && s.charAt(0) === '/') {
    s = s.slice(1)
  }
  return s
}

function folderTitle(name) {
  if (typeof name !== 'string') return ''
  return name.replaceAll('_', ' ')
}

function pathIsActive(folderPath, currentRel) {
  if (folderPath.length === 0) return false
  if (currentRel === folderPath) return true
  if (currentRel.startsWith(folderPath + '/')) return true
  return false
}

function findDirNode(path) {
  let nodes = []
  try {
    nodes = document.querySelectorAll('[data-pt-dir-node]')
  } catch (e) {
    return null
  }
  if (!nodes) return null
  let n = 0
  try {
    n = nodes.length
  } catch (e2) {
    return null
  }
  for (let i = 0; i < n; i++) {
    const el = nodes[i]
    let p = ''
    try {
      p = el.getAttribute('data-pt-path')
    } catch (e3) {}
    if (p === path) return el
  }
  return null
}

function setDirOpen(el, openVal) {
  try {
    el.setAttribute('data-pt-open', openVal)
    el.setAttribute('aria-expanded', openVal)
  } catch (e) {}
}

function toggleDirOpen(path) {
  const el = findDirNode(path)
  if (!el) return
  let cur = '0'
  try {
    cur = el.getAttribute('data-pt-open')
  } catch (e) {}
  const next = cur === '1' ? '0' : '1'
  setDirOpen(el, next)
}

function collapseAllDirs() {
  let nodes = []
  try {
    nodes = document.querySelectorAll('[data-pt-dir-node]')
  } catch (e) {
    return
  }
  if (!nodes) return
  let n = 0
  try {
    n = nodes.length
  } catch (e2) {
    return
  }
  for (let i = 0; i < n; i++) {
    const el = nodes[i]
    setDirOpen(el, '0')
    try {
      el.setAttribute('data-pt-showall', '0')
    } catch (e3) {}
  }
}

function expandDirsToCurrent() {
  let nodes = []
  try {
    nodes = document.querySelectorAll('[data-pt-dir-node]')
  } catch (e) {
    return
  }
  if (!nodes) return
  let n = 0
  try {
    n = nodes.length
  } catch (e2) {
    return
  }
  for (let i = 0; i < n; i++) {
    const el = nodes[i]
    let want = '0'
    try {
      const ex = el.getAttribute('data-pt-expand')
      if (ex === '1') want = '1'
    } catch (e3) {}
    setDirOpen(el, want)
    try {
      el.setAttribute('data-pt-showall', '0')
    } catch (e4) {}
  }
}

function toggleDirShowAll(path) {
  const el = findDirNode(path)
  if (!el) return
  let cur = '0'
  try {
    cur = el.getAttribute('data-pt-showall')
  } catch (e) {}
  const next = cur === '1' ? '0' : '1'
  try {
    el.setAttribute('data-pt-showall', next)
  } catch (e2) {}
}

function DirFileRow(props) {
  const row = props.row
  const depth = props.depth
  const extra = props.extra === true
  const currentRel = props.currentRel
  const path = rowPath(row)
  if (path.length === 0) return null
  const active = currentRel === path
  let cls = 'pt-dir-file'
  if (extra) {
    cls = cls + ' pt-dir-file-extra'
  }
  if (active) {
    cls = cls + ' pt-dir-file-active'
  }
  const pad = depth * 16 + 'px'
  return (
    <div className={cls} style={{ paddingLeft: pad }}>
      <span className="pt-dir-file-icon" aria-hidden="true">
        <IconFileSm />
      </span>
      <a href={siteHref('/' + path)} className="pt-dir-file-link" title={path}>
        {rowTitle(row)}
      </a>
    </div>
  )
}

function FolderBranch(props) {
  const node = props.node
  const depth = props.depth
  const keyPrefix = props.keyPrefix
  const expandPaths = props.expandPaths
  const currentRel = props.currentRel
  let name = ''
  let path = ''
  let count = 0
  let files = []
  let folders = []
  try {
    if (node && typeof node.name === 'string') name = node.name
  } catch (e) {}
  try {
    if (node && typeof node.path === 'string') path = node.path
  } catch (e2) {}
  try {
    if (node && typeof node.count === 'number') count = node.count
  } catch (e3) {}
  try {
    if (node && node.files) files = node.files
  } catch (e4) {}
  try {
    if (node && node.folders) folders = node.folders
  } catch (e5) {}

  const hasChildren = folders.length > 0 || files.length > 0
  const isExpand = includes(expandPaths, path) === true
  const openVal = isExpand ? '1' : '0'
  const active = pathIsActive(path, currentRel)
  let rowCls = 'pt-dir-row'
  if (active) {
    rowCls = rowCls + ' pt-dir-row-active'
  }
  const pad = depth * 16 + 'px'
  const fileCap = files.length < 12 ? files.length : 12
  const hiddenCount = files.length - fileCap

  let folderEls = []
  for (let i = 0; i < folders.length; i++) {
    folderEls = folderEls.concat([
      <FolderBranch
        key={keyPrefix + 'd' + i}
        node={folders[i]}
        depth={depth + 1}
        keyPrefix={keyPrefix + 'd' + i + '-'}
        expandPaths={expandPaths}
        currentRel={currentRel}
      />,
    ])
  }

  let fileEls = []
  for (let i = 0; i < files.length; i++) {
    fileEls = fileEls.concat([
      <DirFileRow
        key={keyPrefix + 'f' + i}
        row={files[i]}
        depth={depth + 1}
        extra={i >= 12}
        currentRel={currentRel}
      />,
    ])
  }

  let moreEls = []
  if (hiddenCount > 0) {
    moreEls = moreEls.concat([
      <button
        key={keyPrefix + 'all'}
        type="button"
        className="pt-dir-showall"
        style={{ paddingLeft: (depth + 1) * 16 + 22 + 'px' }}
        onClick={() => {
          toggleDirShowAll(path)
        }}
      >
        {'Show all ' + files.length + ' files…'}
      </button>,
      <button
        key={keyPrefix + 'fewer'}
        type="button"
        className="pt-dir-showfewer"
        style={{ paddingLeft: (depth + 1) * 16 + 22 + 'px' }}
        onClick={() => {
          toggleDirShowAll(path)
        }}
      >
        Show fewer files
      </button>,
    ])
  }

  return (
    <div
      className="pt-dir-node"
      data-pt-dir-node="1"
      data-pt-path={path}
      data-pt-open={openVal}
      data-pt-expand={openVal}
      data-pt-showall="0"
      aria-expanded={openVal}
    >
      <div className={rowCls} style={{ paddingLeft: pad }}>
        {hasChildren ? (
          <button
            type="button"
            className="pt-dir-chevron"
            aria-label={isExpand ? 'Collapse folder' : 'Expand folder'}
            onClick={() => {
              toggleDirOpen(path)
            }}
          >
            <span className="pt-dir-chevron-open" aria-hidden="true">
              <IconChevronDownSm />
            </span>
            <span className="pt-dir-chevron-closed" aria-hidden="true">
              <IconChevronRightSm />
            </span>
          </button>
        ) : (
          <span className="pt-dir-chevron-spacer" aria-hidden="true" />
        )}
        <a href={siteHref('/' + path + '/page.md')} className="pt-dir-folder-link">
          <span className="pt-dir-folder-name">{folderTitle(name)}</span>
          {count > 0 ? <span className="pt-dir-count">{'(' + count + ')'}</span> : null}
        </a>
      </div>
      {hasChildren ? (
        <div className="pt-dir-kids">
          {folderEls}
          {fileEls}
          {moreEls}
        </div>
      ) : null}
    </div>
  )
}

function dirCssMarker() {
  return (
    <span
      aria-hidden="true"
      hidden={true}
      className="pt-dir-nav lg:pt-dir-nav-lg pt-dir-head pt-dir-title pt-dir-actions pt-dir-action pt-dir-sep pt-dir-tree pt-dir-node pt-dir-row pt-dir-row-active pt-dir-chevron pt-dir-chevron-open pt-dir-chevron-closed pt-dir-chevron-spacer pt-dir-folder-link pt-dir-folder-name pt-dir-count pt-dir-kids pt-dir-file pt-dir-file-extra pt-dir-file-active pt-dir-file-icon pt-dir-file-link pt-dir-showall pt-dir-showfewer pt-dir-foot pt-feeling-lucky-dir pt-dir-list pt-dir-item pt-dir-link pt-dir-tools pt-dir-tool pt-dir-folder pt-dir-folder-label pt-dir-nested"
      data-pt-dir-css="true"
    />
  )
}

/** Left directory — full tree via `@relay/catalog.loadDirTree`; open state is data-pt-open (no setState). */
export default function DirNav(props) {
  const currentRel = stripRel(propStr(props, 'currentPath', ''))

  if (isClientLivePhase(2) !== true) {
    if (isCsrHost()) {
      return null
    }
    return (
      <aside
        className="pt-dir-nav lg:pt-dir-nav-lg"
        aria-label="Site directory"
        data-pt-dirnav-ssr="1"
      >
        <div className="pt-dir-head">
          <h2 className="pt-dir-title">Directory</h2>
        </div>
        <p className="pt-muted">Directory loads after page open…</p>
        {dirCssMarker()}
      </aside>
    )
  }

  let tree = null
  let expandPaths = []
  try {
    tree = loadDirTree()
  } catch (eLoad) {}
  try {
    expandPaths = dirExpandPaths(currentRel)
  } catch (eExp) {}
  let folders = []
  let files = []
  try {
    if (tree && tree.folders) folders = tree.folders
  } catch (e) {}
  try {
    if (tree && tree.files) files = tree.files
  } catch (e2) {}

  let folderEls = []
  for (let i = 0; i < folders.length; i++) {
    folderEls = folderEls.concat([
      <FolderBranch
        key={'r-d' + i}
        node={folders[i]}
        depth={0}
        keyPrefix={'r-d' + i + '-'}
        expandPaths={expandPaths}
        currentRel={currentRel}
      />,
    ])
  }
  let fileEls = []
  for (let j = 0; j < files.length; j++) {
    fileEls = fileEls.concat([
      <DirFileRow
        key={'r-f' + j}
        row={files[j]}
        depth={0}
        extra={false}
        currentRel={currentRel}
      />,
    ])
  }

  const empty = folders.length === 0 && files.length === 0

  return (
    <aside className="pt-dir-nav lg:pt-dir-nav-lg" aria-label="Site directory">
      <div className="pt-dir-head">
        <h2 className="pt-dir-title">Directory</h2>
      </div>
      <div className="pt-dir-actions">
        <button type="button" className="pt-dir-action" onClick={collapseAllDirs}>
          Collapse all
        </button>
        <span className="pt-dir-sep">{'|'}</span>
        <button type="button" className="pt-dir-action" onClick={expandDirsToCurrent}>
          Expand to current
        </button>
      </div>
      {empty ? (
        <p className="pt-muted">No indexed articles yet.</p>
      ) : (
        <div className="pt-dir-tree">
          {folderEls}
          {fileEls}
        </div>
      )}
      <div className="pt-dir-foot">
        <FeelingLucky dir={true} />
      </div>
      {dirCssMarker()}
    </aside>
  )
}

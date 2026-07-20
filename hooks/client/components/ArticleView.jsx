import React, { useState } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import Layout from 'hooks/client/components/Layout.jsx'
import DirNav from 'hooks/client/components/DirNav.jsx'
import DynamicIndex from 'hooks/client/components/DynamicIndex.jsx'
import {
  loadArticleRows,
  rowPath,
  siteHref,
} from 'hooks/client/loadArticles.jsx'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import AutoIndex from 'hooks/client/components/AutoIndex.jsx'
import ChangeLog from 'hooks/client/components/ChangeLog.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'
import manifest from '@hooks'

/** Stub for markdown tags not yet implemented (module-level for CleverScript scope). */
function EmptyMdStub() {
  return <span className="pt-md-stub" aria-hidden="true" />
}

/** Module-level so override identity stays stable across parent re-renders (avoids remounting ChangeLog). */
function renderChangeLog(p) {
  let lim = 8
  try {
    if (p && typeof p.limit === 'number' && p.limit > 0) lim = p.limit
  } catch (e) {}
  return <ChangeLog limit={lim} />
}

function renderPopImage(p) {
  let src = ''
  let alt = ''
  let className = ''
  let highResSrc = ''
  let children = null
  try {
    if (p && typeof p.src === 'string') src = p.src
  } catch (e) {}
  try {
    if (p && typeof p.alt === 'string') alt = p.alt
  } catch (e) {}
  try {
    if (p && typeof p.className === 'string') className = p.className
  } catch (e) {}
  try {
    if (p && typeof p.highResSrc === 'string') highResSrc = p.highResSrc
  } catch (e) {}
  try {
    if (p && p.children !== null) children = p.children
  } catch (e) {}
  return (
    <PopImage
      src={src}
      alt={alt}
      className={className}
      highResSrc={highResSrc}
    >
      {children}
    </PopImage>
  )
}

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

function normalizeRelPath(s) {
  let t = str(s).trim()
  while (t.length > 0 && t.charAt(0) === '/') {
    t = t.slice(1)
  }
  if (t.length === 0) return 'README.md'
  return t
}

function resolveMdHref(href, currentPath, slash, baseUrl) {
  const h = str(href)
  if (h.length === 0) return currentPath
  if (h.indexOf('mailto:') === 0 || h.indexOf('tel:') === 0) return currentPath
  if (h.charAt(0) === '#') return currentPath
  if (h.indexOf('://') >= 0) {
    if (baseUrl && h.indexOf(str(baseUrl)) === 0) {
      const baseLen = str(baseUrl).length
      let rest = h.slice(baseLen)
      while (rest.length > 0 && rest.charAt(0) === '/') {
        rest = rest.slice(1)
      }
      return normalizeRelPath(rest)
    }
    return normalizeRelPath(h)
  }
  if (h.charAt(0) === '/') return normalizeRelPath(h)
  let rel = h
  if (rel.indexOf('./') === 0) rel = rel.slice(2)
  let dir = str(currentPath)
  const lio = dir.lastIndexOf(slash)
  if (lio >= 0) dir = dir.slice(0, lio)
  else dir = ''
  const parts = rel.split(slash)
  let segs = []
  if (dir.length > 0) {
    const dparts = dir.split(slash)
    for (let i = 0; i < dparts.length; i++) {
      if (dparts[i].length > 0) segs = segs.concat([dparts[i]])
    }
  }
  for (let j = 0; j < parts.length; j++) {
    const p = parts[j]
    if (p.length === 0 || p === '.') {
      /* skip */
    } else if (p === '..') {
      if (segs.length > 0) {
        let next = []
        for (let s = 0; s < segs.length - 1; s++) {
          next = next.concat([segs[s]])
        }
        segs = next
      }
    } else {
      segs = segs.concat([p])
    }
  }
  let out = ''
  for (let k = 0; k < segs.length; k++) {
    if (k > 0) out = out + slash
    out = out + segs[k]
  }
  return normalizeRelPath(out)
}

function parentDir(relPath, slash) {
  const p = str(relPath)
  const i = p.lastIndexOf(slash)
  if (i <= 0) return 'README.md'
  const up = p.slice(0, i)
  if (up.length === 0) return 'README.md'
  return normalizeRelPath(up)
}

function clientBase() {
  try {
    if (typeof manifest.relayClientBaseUrl === 'string') return manifest.relayClientBaseUrl
  } catch (e) {}
  return ''
}

function pathSlash() {
  try {
    if (manifest.relayPathSlash) return manifest.relayPathSlash
  } catch (e) {}
  return '/'
}

/**
 * On-tree article — MarkdownRenderer with overrides for AutoIndex / ChangeLog / ChatRoom.
 */
export default function ArticleView(props) {
  let filePathProp = 'README.md'
  try {
    if (props.filePath) filePathProp = props.filePath
  } catch (e) {
    filePathProp = 'README.md'
  }
  const initial = normalizeRelPath(filePathProp)
  const pathState = useState(initial)
  const routePath = pathState[0]
  const setRoutePath = pathState[1]
  let currentPath = '/' + initial
  try {
    if (props.currentPath) currentPath = props.currentPath
  } catch (e) {
    currentPath = '/' + initial
  }
  const slash = pathSlash()

  function navigateFile(to) {
    setRoutePath(normalizeRelPath(to))
  }

  function onMdLinkClick(href) {
    const h = str(href)
    if (h.charAt(0) === '/' && h.indexOf('://') < 0) {
      navigateFile(h)
      return
    }
    navigateFile(resolveMdHref(href, routePath, slash, clientBase()))
  }

  let pathPart = normalizeRelPath(routePath)
  const live = isClientLive() === true
  let markdownContent = ''
  let errMsg = ''
  // SSR: chrome only — skip blob fetch + MarkdownRenderer (dominant home TTFB).
  if (live) {
    let baseStr = clientBase()
    while (baseStr.length > 0 && baseStr.charAt(baseStr.length - 1) === '/') {
      baseStr = baseStr.slice(0, baseStr.length - 1)
    }
    if (baseStr.length === 0) {
      errMsg = 'Missing relayClientBaseUrl — open via Relay host preset.'
    } else {
      const url = baseStr + slash + pathPart
      const resp = fetch(url, { method: 'GET' })
      if (resp && resp.ok === true) {
        markdownContent = resp.text ? resp.text : ''
      } else {
        let st = 0
        if (resp && resp.status) st = resp.status
        errMsg = 'Could not load file (HTTP ' + st + ')'
      }
    }
  }

  const rawBody = errMsg ? '# Error\n\n' + errMsg : markdownContent
  const body = errMsg ? rawBody : rewriteMarkdownAssetUrls(rawBody)

  const neighbors = live ? neighborPaths(pathPart) : { prev: '', next: '' }
  const prevHref = neighbors.prev.length > 0 ? siteHref('/' + neighbors.prev) : ''
  const nextHref = neighbors.next.length > 0 ? siteHref('/' + neighbors.next) : ''
  const hideToolbar =
    currentPath === '/' ||
    currentPath === '/index.md' ||
    currentPath === '/page.md' ||
    pathPart === 'page.md'

  function renderAutoIndex(p) {
    let pathAttr = ''
    let sortAttr = 'name-asc'
    try {
      if (p && typeof p.path === 'string') pathAttr = p.path
    } catch (e) {}
    try {
      if (p && typeof p.sort === 'string') sortAttr = p.sort
    } catch (e) {}
    return <AutoIndex path={pathAttr} sort={sortAttr} currentPath={pathPart} />
  }

  return (
    <SiteChrome currentPath={currentPath}>
      <main className="pt-page pt-article-page">
        <div className="pt-columns lg:pt-columns-lg">
          <DirNav />
          <div className="pt-column-main">
            <Layout
              filePath={pathPart}
              hideToolbar={hideToolbar}
              onUp={() => {
                navigateFile(parentDir(routePath, slash))
              }}
              onHome={() => {
                navigateFile('page.md')
              }}
            >
              {!live ? (
                <div className="pt-md" data-pt-article-ssr="1">
                  <p className="pt-muted">Article loads after page open…</p>
                  {/* Keep hydrate-only theme classes in the SSR used-class set. */}
                  <span
                    aria-hidden="true"
                    hidden={true}
                    className="pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item"
                    data-pt-md-css="true"
                  />
                </div>
              ) : (
                <MarkdownRenderer
                  content={body}
                  navigate={(to) => {
                    navigateFile(to)
                  }}
                  anchorOnClick={(href) => {
                    onMdLinkClick(href)
                  }}
                  overrides={{
                    AutoIndex: renderAutoIndex,
                    ChangeLog: renderChangeLog,
                    ChatRoom: EmptyMdStub,
                    PopImage: renderPopImage,
                    img: renderPopImage,
                  }}
                />
              )}
              {live && (prevHref.length > 0 || nextHref.length > 0) ? (
                <nav className="pt-article-neighbors" aria-label="Adjacent articles">
                  {prevHref.length > 0 ? (
                    <a className="pt-btn" href={prevHref}>
                      Previous
                    </a>
                  ) : (
                    <span className="pt-muted">Previous</span>
                  )}
                  {nextHref.length > 0 ? (
                    <a className="pt-btn" href={nextHref}>
                      Next
                    </a>
                  ) : (
                    <span className="pt-muted">Next</span>
                  )}
                </nav>
              ) : null}
            </Layout>
          </div>
          <DynamicIndex />
        </div>
      </main>
    </SiteChrome>
  )
}

function neighborPaths(currentRel) {
  const cur = normalizeRelPath(currentRel)
  const rows = loadArticleRows(200)
  let idx = -1
  for (let i = 0; i < rows.length; i++) {
    if (rowPath(rows[i]) === cur) {
      idx = i
      break
    }
  }
  let prev = ''
  let next = ''
  if (idx > 0) prev = rowPath(rows[idx - 1])
  if (idx >= 0 && idx + 1 < rows.length) next = rowPath(rows[idx + 1])
  return { prev: prev, next: next }
}

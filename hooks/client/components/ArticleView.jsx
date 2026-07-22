import React, { useState } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import { neighborPaths as hostNeighborPaths } from '@relay/catalog'
import { normalizeRel, resolveRel, parentDir } from '@relay/path'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import Layout from 'hooks/client/components/Layout.jsx'
import DirNav from 'hooks/client/components/DirNav.jsx'
import DynamicIndex from 'hooks/client/components/DynamicIndex.jsx'
import {
  loadArticleRows,
  siteHref,
} from 'hooks/client/loadArticles.jsx'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import AutoIndex from 'hooks/client/components/AutoIndex.jsx'
import ChangeLog from 'hooks/client/components/ChangeLog.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'
import EmbedFile from 'hooks/client/components/EmbedFile.jsx'
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

function clientBase() {
  try {
    if (typeof manifest.relayClientBaseUrl === 'string') {
      let b = manifest.relayClientBaseUrl
      while (b.length > 0 && b.charAt(b.length - 1) === '/') {
        b = b.slice(0, b.length - 1)
      }
      return b
    }
  } catch (e) {}
  return ''
}

/**
 * On-tree article — MarkdownRenderer with overrides for AutoIndex / ChangeLog / EmbedFile.
 */
export default function ArticleView(props) {
  let filePathProp = 'README.md'
  try {
    if (props.filePath) filePathProp = props.filePath
  } catch (e) {
    filePathProp = 'README.md'
  }
  const initial = normalizeRel(filePathProp)
  const pathState = useState(initial)
  const routePath = pathState[0]
  const setRoutePath = pathState[1]
  let currentPath = '/' + initial
  try {
    if (props.currentPath) currentPath = props.currentPath
  } catch (e) {
    currentPath = '/' + initial
  }

  function navigateFile(to) {
    setRoutePath(normalizeRel(to))
  }

  function onMdLinkClick(href) {
    let h = ''
    if (typeof href === 'string') h = href
    if (h.charAt(0) === '/' && h.indexOf('://') < 0) {
      navigateFile(h)
      return
    }
    navigateFile(resolveRel(href, routePath, clientBase()))
  }

  let pathPart = normalizeRel(routePath)
  const live = isClientLive() === true
  let markdownContent = ''
  let errMsg = ''
  // SSR: chrome only — skip blob fetch + MarkdownRenderer (dominant home TTFB).
  if (live) {
    const baseStr = clientBase()
    if (baseStr.length === 0) {
      errMsg = 'Missing relayClientBaseUrl — open via Relay host preset.'
    } else {
      const url = baseStr + '/' + pathPart
      // CDN may cache tip blobs (max-age=3600). Stale page.md with Unicode
      // em-dashes panicked fleet WASM mid-hydrate - always revalidate on CSR.
      const resp = fetch(url, { method: 'GET', cache: 'no-store' })
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
  const body = errMsg ? rawBody : rewriteMarkdownAssetUrls(rawBody, pathPart)

  const neighbors = live
    ? hostNeighborPaths(pathPart, loadArticleRows(200))
    : { prev: '', next: '' }
  let prevPath = ''
  let nextPath = ''
  try {
    if (neighbors && typeof neighbors.prev === 'string') prevPath = neighbors.prev
  } catch (e) {}
  try {
    if (neighbors && typeof neighbors.next === 'string') nextPath = neighbors.next
  } catch (e2) {}
  const prevHref = prevPath.length > 0 ? siteHref('/' + prevPath) : ''
  const nextHref = nextPath.length > 0 ? siteHref('/' + nextPath) : ''
  const hideToolbar =
    pathPart === 'page.md' ||
    pathPart === 'README.md' ||
    pathPart === 'index.md' ||
    currentPath === '/' ||
    currentPath === '/index.md' ||
    currentPath === '/page.md'
  // Prefer file path so SPA/in-app navigations still show TOC on articles.
  const showToc =
    pathPart !== 'page.md' &&
    pathPart !== 'README.md' &&
    pathPart !== 'index.md' &&
    pathPart.length > 0

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

  function renderEmbedFile(p) {
    let src = ''
    let className = ''
    let children = null
    try {
      if (p && typeof p.src === 'string') src = p.src
    } catch (e) {}
    try {
      if (p && typeof p.className === 'string') className = p.className
    } catch (e2) {}
    try {
      if (p && p.children !== null) children = p.children
    } catch (e3) {}
    return (
      <EmbedFile src={src} className={className} articleRel={pathPart}>
        {children}
      </EmbedFile>
    )
  }

  return (
    <SiteChrome currentPath={currentPath}>
      <main className="pt-page pt-article-page">
        <div className="pt-columns lg:pt-columns-lg">
          <DirNav />
          <div className="pt-column-main lg:pt-column-main-lg">
            <Layout
              filePath={pathPart}
              hideToolbar={hideToolbar}
              onUp={() => {
                navigateFile(parentDir(routePath))
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
                    className="pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty"
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
                    EmbedFile: renderEmbedFile,
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
          {showToc ? <DynamicIndex pathKey={pathPart} /> : null}
        </div>
      </main>
    </SiteChrome>
  )
}

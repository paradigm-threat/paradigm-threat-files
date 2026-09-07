import React, { useState } from 'react'
import { isClientLive, isClientLivePhase } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import { neighborPaths as hostNeighborPaths } from '@relay/catalog'
import { normalizeRel, resolveRel, parentDir } from '@relay/path'
import { cachedGet } from '@relay/ui'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import Layout from 'hooks/client/components/Layout.jsx'
import DirNav from 'hooks/client/components/DirNav.jsx'
import DynamicIndex from 'hooks/client/components/DynamicIndex.jsx'
import {
  loadArticleRows,
  siteHref,
} from 'hooks/client/loadArticles.jsx'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import { extractMarkdownHeadings } from 'hooks/client/extractMarkdownHeadings.js'
import { makeHeadingOverrides } from 'hooks/client/headingOverrides.jsx'
import AutoIndex from 'hooks/client/components/AutoIndex.jsx'
import ChangeLog from 'hooks/client/components/ChangeLog.jsx'
import DeferredMarkdown from 'hooks/client/components/DeferredMarkdown.jsx'
import { prefetchDeferredMarkdown } from 'hooks/client/components/DeferredMarkdown.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'
import EmbedFile from 'hooks/client/components/EmbedFile.jsx'
import manifest from '@hooks'

/** Skip SSR MarkdownRenderer for absurdly large tips (hydrate fills). */
const MAX_SSR_MD_CHARS = 400000

/** Tip CDN bust — bump when ASCII-safe content must pierce max-age=3600. */
const MD_CACHE_BUST = 'ptmd8'

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

function deferredSrcFromProps(p) {
  let src = ''
  try {
    if (p && typeof p.src === 'string') src = p.src
  } catch (e) {}
  if (src.length === 0) src = 'page-sections/investigations.md'
  return src
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
 * Tip-safe article load (P0). SSR: RepoFetchHost in-process git. CSR: tip GET + CDN bust.
 * Prefer cachedGet over same-Host fetch during SSR (deadlock).
 */
function loadArticleMarkdown(pathPart) {
  const rel = '/' + pathPart + '?v=' + MD_CACHE_BUST
  try {
    const text = cachedGet(rel)
    if (typeof text === 'string' && text.length > 0) {
      return { markdownContent: text, errMsg: '' }
    }
  } catch (e) {}
  // CSR fallback when cachedGet empty (older hosts): absolute tip URL.
  const live = isClientLive() === true
  if (live) {
    const baseStr = clientBase()
    if (baseStr.length === 0) {
      return {
        markdownContent: '',
        errMsg: 'Missing relayClientBaseUrl — open via Relay host preset.',
      }
    }
    const url = baseStr + '/' + pathPart + '?v=' + MD_CACHE_BUST
    const resp = fetch(url, { method: 'GET' })
    if (resp && resp.ok === true) {
      return {
        markdownContent: resp.text ? resp.text : '',
        errMsg: '',
      }
    }
    let st = 0
    if (resp && resp.status) st = resp.status
    return {
      markdownContent: '',
      errMsg: 'Could not load file (HTTP ' + st + ')',
    }
  }
  return { markdownContent: '', errMsg: 'Could not load file' }
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
    // Runtime preventDefault on relayControlled anchors — absolute / special schemes
    // must still navigate (do not soft-route them into the article SPA).
    if (
      h.indexOf('http://') === 0 ||
      h.indexOf('https://') === 0 ||
      h.indexOf('//') === 0 ||
      h.indexOf('mailto:') === 0 ||
      h.indexOf('tel:') === 0
    ) {
      try {
        navigate(h)
      } catch (e) {
        try {
          const g = globalThis
          if (g && g.location) {
            g.location.href = h
          }
        } catch (e2) {}
      }
      return
    }
    if (h.charAt(0) === '#') {
      try {
        const g = globalThis
        if (g && g.location) {
          g.location.hash = h
        }
      } catch (e3) {}
      return
    }
    if (h.charAt(0) === '/' && h.indexOf('://') < 0) {
      navigateFile(h)
      return
    }
    navigateFile(resolveRel(href, routePath, clientBase()))
  }

  let pathPart = normalizeRel(routePath)
  const live = isClientLive() === true
  const csr = isCsrHost()
  if (!live && csr) {
    return null
  }
  const loaded = loadArticleMarkdown(pathPart)
  let markdownContent = loaded.markdownContent
  let errMsg = loaded.errMsg
  let deferHugeSsr = false
  if (!live && !csr && !errMsg && markdownContent.length > MAX_SSR_MD_CHARS) {
    deferHugeSsr = true
    markdownContent = ''
  }

  const rawBody = errMsg ? '# Error\n\n' + errMsg : markdownContent
  let body = errMsg ? rawBody : rewriteMarkdownAssetUrls(rawBody, pathPart)
  const headingExtract = extractMarkdownHeadings(body)
  let tocItems = []
  let idQueue = []
  try {
    if (headingExtract && headingExtract.tocItems) {
      tocItems = headingExtract.tocItems
    }
  } catch (eToc) {}
  try {
    if (headingExtract && headingExtract.idQueue) {
      idQueue = headingExtract.idQueue
    }
  } catch (eQ) {}
  const headingOverrides = makeHeadingOverrides(idQueue)

  // P2 catalog — neighbors only when live.
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
  // Home (page.md) and articles share content-derived TOC; skip bare index stubs.
  const showToc =
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

  const showArticleBody = !deferHugeSsr && (errMsg.length > 0 || body.length > 0)

  // Prefetch + eager-render DeferredMarkdown OUTSIDE the page MarkdownRenderer
  // walk. Nested <MarkdownRenderer> (or cachedGet) inside the override aborts
  // the vnode → soft-hydrate never swaps section.pt-deferred-md.
  let deferredIsland = null
  if (showArticleBody && isClientLivePhase(3) === true) {
    try {
      const marker = '<DeferredMarkdown'
      const at = body.indexOf(marker)
      if (at >= 0) {
        let src = 'page-sections/investigations.md'
        const slice = body.slice(at, at + 120)
        const srcKey = 'src="'
        const s0 = slice.indexOf(srcKey)
        if (s0 >= 0) {
          const s1 = s0 + srcKey.length
          const s2 = slice.indexOf('"', s1)
          if (s2 > s1) src = slice.slice(s1, s2)
        }
        let frag = ''
        try {
          cachedGet('/' + src + '?v=' + MD_CACHE_BUST)
        } catch (eGet) {}
        try {
          frag = prefetchDeferredMarkdown(src)
        } catch (ePrefetch) {
          frag = ''
        }
        if (typeof frag === 'string' && frag.length > 0) {
          let inner = null
          try {
            if (typeof MarkdownRenderer === 'function') {
              inner = MarkdownRenderer({
                content: frag,
                navigate: (to) => {
                  navigateFile(to)
                },
                anchorOnClick: (href) => {
                  onMdLinkClick(href)
                },
              })
            }
          } catch (eInner) {
            inner = null
          }
          if (inner != null) {
            deferredIsland = (
              <section
                className="pt-deferred-md"
                data-pt-deferred="1"
                aria-label="Deferred section"
              >
                {inner}
              </section>
            )
          }
        }
        if (deferredIsland == null) {
          deferredIsland = (
            <section
              className="pt-deferred-md"
              aria-label="Deferred section"
              data-pt-deferred-pending="1"
              style={{ minHeight: '12rem' }}
            >
              <p className="pt-muted">Loading section…</p>
            </section>
          )
        }
      }
    } catch (eBuild) {}
  }

  const renderDeferredMarkdown = (p) => {
    if (deferredIsland != null) return deferredIsland
    return <DeferredMarkdown src={deferredSrcFromProps(p)} />
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
              {showArticleBody ? (
                <div className="pt-md" data-pt-article="1">
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
                      DeferredMarkdown: renderDeferredMarkdown,
                      ChatRoom: EmptyMdStub,
                      EmbedFile: renderEmbedFile,
                      PopImage: renderPopImage,
                      img: renderPopImage,
                      h1: headingOverrides.h1,
                      h2: headingOverrides.h2,
                      h3: headingOverrides.h3,
                      h4: headingOverrides.h4,
                      h5: headingOverrides.h5,
                      h6: headingOverrides.h6,
                    }}
                  />
                  {/* Keep hydrate-only theme classes in the SSR used-class set. */}
                  <span
                    aria-hidden="true"
                    hidden={true}
                    className="pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-cl-cards pt-cl-card-item pt-cl-card pt-cl-card-media pt-cl-card-thumb pt-cl-card-thumb-logo pt-cl-card-body pt-cl-card-title pt-cl-card-dates pt-cl-card-date pt-cl-card-byline pt-cl-feed pt-cl-entry pt-cl-entry-thumb pt-cl-entry-img pt-cl-entry-logo pt-cl-entry-body pt-cl-entry-title pt-cl-entry-file pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty float-left float-right float-none clear-left clear-right clear-both clear-none max-w-sm max-w-md max-w-lg sm:float-left sm:float-right sm:max-w-sm sm:m-1 sm:mr-4 sm:mr-6 sm:ml-8 sm:mb-4"
                    data-pt-md-css="true"
                  />
                </div>
              ) : (
                <div className="pt-md" data-pt-article-ssr="1">
                  <p className="pt-muted">Article loads after page open…</p>
                  <span
                    aria-hidden="true"
                    hidden={true}
                    className="pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-cl-cards pt-cl-card-item pt-cl-card pt-cl-card-media pt-cl-card-thumb pt-cl-card-thumb-logo pt-cl-card-body pt-cl-card-title pt-cl-card-dates pt-cl-card-date pt-cl-card-byline pt-cl-feed pt-cl-entry pt-cl-entry-thumb pt-cl-entry-img pt-cl-entry-logo pt-cl-entry-body pt-cl-entry-title pt-cl-entry-file pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty float-left float-right float-none clear-left clear-right clear-both clear-none max-w-sm max-w-md max-w-lg sm:float-left sm:float-right sm:max-w-sm sm:m-1 sm:mr-4 sm:mr-6 sm:ml-8 sm:mb-4"
                    data-pt-md-css="true"
                  />
                </div>
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
          {showToc ? (
            <DynamicIndex pathKey={pathPart} items={tocItems} />
          ) : null}
        </div>
      </main>
    </SiteChrome>
  )
}

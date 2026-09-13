import React, { useState } from 'react'
import { isClientLive, isClientLivePhase } from '@clevertree/style-internal'
import { MarkdownRenderer } from '@clevertree/markdown'
import { neighborPaths as hostNeighborPaths } from '@relay/catalog'
import { normalizeRel, resolveRel, parentDir, lookupHttpHref } from '@relay/path'
import { cachedGet } from '@relay/ui'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import { parseJson } from 'hooks/client/jsonUtil.jsx'
import SiteChrome from 'hooks/client/components/SiteChrome.jsx'
import Layout from 'hooks/client/components/Layout.jsx'
import DirNav from 'hooks/client/components/DirNav.jsx'
import DynamicIndex from 'hooks/client/components/DynamicIndex.jsx'
import {
  loadDirCatalogRows,
  rowPath,
  rowImageSrc,
  siteHref,
} from 'hooks/client/loadArticles.jsx'
import { rewriteMarkdownAssetUrls } from 'hooks/client/rewriteAssets.jsx'
import { rewriteLegacyAppHref } from 'hooks/client/legacyAppHref.js'
import { extractMarkdownHeadings } from 'hooks/client/extractMarkdownHeadings.js'
import { makeHeadingOverrides } from 'hooks/client/headingOverrides.jsx'
import { share } from 'hooks/client/shareStore.jsx'
import AutoIndex from 'hooks/client/components/AutoIndex.jsx'
import ChangeLog from 'hooks/client/components/ChangeLog.jsx'
import DeferredMarkdown, {
  loadDeferredFragment,
  estimateDeferredMinHeightPx,
  deferredMinHeightStyle,
  maybeSplitHugeArticleMarkdown,
  prefetchDeferredMarkdown,
  cutMarkdownLead,
  isVirtualDeferredSrc,
  DEFERRED_HYDRATE_CHUNK_CHARS,
  DEFERRED_HYDRATE_PHASE4_CHARS,
} from 'hooks/client/components/DeferredMarkdown.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'
import EmbedFile from 'hooks/client/components/EmbedFile.jsx'
import manifest from '@hooks'

/** Tip CDN bust — bump when ASCII-safe content must pierce max-age=3600. */
const MD_CACHE_BUST = 'ptmd13'

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

function deferredMinHeightFromProps(p) {
  try {
    if (p && typeof p.minHeight === 'string' && p.minHeight.length > 0) {
      return p.minHeight
    }
  } catch (e) {}
  try {
    if (p && typeof p.minHeight === 'number' && p.minHeight > 0) {
      return p.minHeight
    }
  } catch (e2) {}
  return undefined
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
 * CleverScript-safe find for `<DeferredMarkdown`.
 * Returns start index, or `s.length` when missing (never `return -1` — CS bans unary minus).
 */
function indexOfDeferredMarkdownTag(s) {
  if (!s || typeof s !== 'string') {
    return 0
  }
  const nlen = 17
  const lim = s.length
  if (lim < nlen) {
    return lim
  }
  const last = lim - nlen
  // Match "<DeferredMarkdown" char-by-char (indexOf multi-char is unreliable).
  for (let i = 0; i <= last; i++) {
    if (s.charAt(i) !== '<') continue
    if (s.charAt(i + 1) !== 'D') continue
    if (s.charAt(i + 2) !== 'e') continue
    if (s.charAt(i + 3) !== 'f') continue
    if (s.charAt(i + 4) !== 'e') continue
    if (s.charAt(i + 5) !== 'r') continue
    if (s.charAt(i + 6) !== 'r') continue
    if (s.charAt(i + 7) !== 'e') continue
    if (s.charAt(i + 8) !== 'd') continue
    if (s.charAt(i + 9) !== 'M') continue
    if (s.charAt(i + 10) !== 'a') continue
    if (s.charAt(i + 11) !== 'r') continue
    if (s.charAt(i + 12) !== 'k') continue
    if (s.charAt(i + 13) !== 'd') continue
    if (s.charAt(i + 14) !== 'o') continue
    if (s.charAt(i + 15) !== 'w') continue
    if (s.charAt(i + 16) !== 'n') continue
    return i
  }
  return lim
}

/**
 * Tip-safe article load (P0). SSR: RepoFetchHost in-process git. CSR: tip GET + CDN bust.
 * Prefer cachedGet over same-Host fetch during SSR (deadlock).
 * Pretty paths without `.md` retry with `.md` appended.
 */
function loadArticleMarkdown(pathPart) {
  const slash = pathPart.lastIndexOf('/')
  const base = slash >= 0 ? pathPart.slice(slash + 1) : pathPart
  const withMd =
    base.length > 0 && base.indexOf('.') < 0 ? pathPart + '.md' : pathPart
  // CleverScript: no Array.push — fixed candidate list.
  const cand0 = pathPart
  const cand1 = withMd
  const nCand = cand0 === cand1 ? 1 : 2
  const live = isClientLive() === true

  // Live hydrate: fetch tip as markdown. Always send Accept: text/markdown —
  // browsers default Accept: text/html and the gateway then SSR-renders the
  // .md path as a full HTML document (breaks DeferredMarkdown discovery).
  if (live) {
    for (let j = 0; j < nCand; j++) {
      const cand = j === 0 ? cand0 : cand1
      const paths = ['/' + cand + '?v=' + MD_CACHE_BUST]
      for (let pi = 0; pi < 2; pi++) {
        try {
          const opts =
            pi === 0
              ? {
                  method: 'GET',
                  headers: {
                    accept: 'text/markdown',
                  },
                }
              : {
                  method: 'GET',
                  headers: {
                    accept: 'text/plain',
                  },
                }
          const resp = fetch(paths[0], opts)
          if (resp && resp.ok === true) {
            const text = resp.text ? resp.text : ''
            if (
              typeof text === 'string' &&
              text.length > 20 &&
              text.charAt(0) !== '<'
            ) {
              return { markdownContent: text, errMsg: '', resolvedPath: cand }
            }
          }
        } catch (eLive) {}
      }
    }
  }

  for (let i = 0; i < nCand; i++) {
    const cand = i === 0 ? cand0 : cand1
    const rel = '/' + cand + '?v=' + MD_CACHE_BUST
    try {
      const text = cachedGet(rel)
      if (
        typeof text === 'string' &&
        text.length > 0 &&
        text.charAt(0) !== '<'
      ) {
        return { markdownContent: text, errMsg: '', resolvedPath: cand }
      }
    } catch (e) {}
  }

  // CSR fallback when cachedGet empty (older hosts): absolute tip URL.
  if (live) {
    const baseStr = clientBase()
    if (baseStr.length === 0) {
      return {
        markdownContent: '',
        errMsg: 'Missing relayClientBaseUrl — open via Relay host preset.',
        resolvedPath: pathPart,
      }
    }
    for (let j = 0; j < nCand; j++) {
      const cand = j === 0 ? cand0 : cand1
      const url = baseStr + '/' + cand + '?v=' + MD_CACHE_BUST
      const resp = fetch(url, {
        method: 'GET',
        headers: {
          accept: 'text/markdown',
        },
      })
      if (resp && resp.ok === true) {
        const text = resp.text ? resp.text : ''
        if (typeof text === 'string' && text.charAt(0) !== '<') {
          return {
            markdownContent: text,
            errMsg: '',
            resolvedPath: cand,
          }
        }
      }
      if (j === nCand - 1) {
        let st = 0
        if (resp && resp.status) st = resp.status
        return {
          markdownContent: '',
          errMsg: 'Could not load file (HTTP ' + st + ')',
          resolvedPath: pathPart,
        }
      }
    }
  }
  return { markdownContent: '', errMsg: 'Could not load file', resolvedPath: pathPart }
}

/**
 * Confirmed-dead map from this tip. Module warm: one cachedGet per session.
 * Call once per render *before* MarkdownRenderer (nested cachedGet in an
 * override can abort the vnode). Missing/empty JSON → {}.
 */
let deadUrlsWarm = null

function loadDeadUrls() {
  if (deadUrlsWarm !== null) return deadUrlsWarm
  try {
    const text = cachedGet('/hooks/dead-urls.json')
    const obj = parseJson(text)
    if (obj && typeof obj === 'object') {
      deadUrlsWarm = obj
      return deadUrlsWarm
    }
  } catch (e) {}
  deadUrlsWarm = {}
  return deadUrlsWarm
}

/**
 * MarkdownRenderer `a` override. Do not name this callable `a` — JSX would
 * recurse. Lookup is sync against an already-loaded map (no fetch here).
 */
function makeRenderMdAnchor(deadUrls) {
  const lookup = lookupHttpHref
  const renderMdAnchor = (p) => {
    let href = ''
    let children = null
    let className = ''
    let title = ''
    let onClick = null
    let controlled = false
    try {
      if (p && typeof p.href === 'string') href = rewriteLegacyAppHref(p.href)
    } catch (e) {}
    try {
      if (p && p.children !== null) children = p.children
    } catch (e2) {}
    try {
      if (p && typeof p.className === 'string') className = p.className
    } catch (e3) {}
    try {
      if (p && typeof p.title === 'string') title = p.title
    } catch (e4) {}
    try {
      if (p && p.onClick) onClick = p.onClick
    } catch (e5) {}
    try {
      if (p && p.relayControlled === true) controlled = true
    } catch (e6) {}

    let dead = null
    try {
      dead = lookup(deadUrls, href)
    } catch (e7) {
      dead = null
    }

    let reason = ''
    if (dead) {
      try {
        if (dead && typeof dead.reason === 'string') reason = dead.reason
      } catch (e8) {}
      if (reason.length === 0) reason = 'dead'
    }

    let cls = className
    if (dead) {
      if (cls.length > 0) {
        cls = cls + ' pt-dead-link'
      } else {
        cls = 'pt-dead-link'
      }
    }

    let marker = null
    if (dead) {
      marker = ' (dead)'
    }

    let useTitle = title
    if (dead) {
      useTitle = reason
    }

    if (onClick) {
      if (controlled) {
        return (
          <a href={href} className={cls} title={useTitle} onClick={onClick} relayControlled={true}>
            {children}
            {marker}
          </a>
        )
      }
      return (
        <a href={href} className={cls} title={useTitle} onClick={onClick}>
          {children}
          {marker}
        </a>
      )
    }
    if (controlled) {
      return (
        <a href={href} className={cls} title={useTitle} relayControlled={true}>
          {children}
          {marker}
        </a>
      )
    }
    return (
      <a href={href} className={cls} title={useTitle}>
        {children}
        {marker}
      </a>
    )
  }
  return renderMdAnchor
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
    if (typeof href === 'string') h = rewriteLegacyAppHref(href)
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

  const hideToolbarEarly =
    pathPart === 'page.md' ||
    pathPart === 'README.md' ||
    pathPart === 'index.md' ||
    currentPath === '/' ||
    currentPath === '/index.md' ||
    currentPath === '/page.md'
  const showTocEarly =
    pathPart !== 'README.md' && pathPart !== 'index.md' && pathPart.length > 0

  // Phases 1–2: do NOT load/walk tip markdown. Soft-hydrate keeps SSR article + TOC
  // in the DOM; only DirNav/Deferred islands are swapped. Rebuilding MarkdownRenderer
  // vnodes here freezes the main thread for minutes on large tips.
  //
  // Full-SSR articles (no deferred island): stay on this shell for all live phases.
  // Home / tips with `<DeferredMarkdown>` keep `[data-pt-deferred-ssr]` (or page.md)
  // and enter the fill path at phase ≥3 only.
  let hasDeferredSsr = false
  if (live === true) {
    try {
      const el = document.querySelector('[data-pt-deferred-ssr]')
      if (el) hasDeferredSsr = true
    } catch (eDom) {}
  }
  const homeDeferred = pathPart === 'page.md' || pathPart === 'index.md'
  const needsDeferredFill = hasDeferredSsr === true || homeDeferred === true
  if (live === true && isClientLivePhase(3) !== true) {
    return (
      <SiteChrome currentPath={currentPath}>
        <div className="pt-page pt-article-page">
          <div className="pt-columns lg:pt-columns-lg">
            <main className="pt-column-main lg:pt-column-main-lg">
              <Layout
                filePath={pathPart}
                hideToolbar={hideToolbarEarly}
                onUp={() => {
                  navigateFile(parentDir(routePath))
                }}
                onHome={() => {
                  navigateFile('page.md')
                }}
              >
                <div
                  className="pt-md"
                  data-pt-article="1"
                  data-pt-article-phase="early"
                  aria-hidden="true"
                />
              </Layout>
            </main>
            <DirNav currentPath={currentPath} />
            {showTocEarly ? (
              <DynamicIndex pathKey={pathPart} items={[]} />
            ) : null}
          </div>
        </div>
      </SiteChrome>
    )
  }
  if (live === true && needsDeferredFill !== true) {
    return (
      <SiteChrome currentPath={currentPath}>
        <div className="pt-page pt-article-page">
          <div className="pt-columns lg:pt-columns-lg">
            <main className="pt-column-main lg:pt-column-main-lg">
              <Layout
                filePath={pathPart}
                hideToolbar={hideToolbarEarly}
                onUp={() => {
                  navigateFile(parentDir(routePath))
                }}
                onHome={() => {
                  navigateFile('page.md')
                }}
              >
                <div
                  className="pt-md"
                  data-pt-article="1"
                  data-pt-article-phase="ssr-keep"
                  aria-hidden="true"
                />
              </Layout>
            </main>
            <DirNav currentPath={currentPath} />
            {showTocEarly ? (
              <DynamicIndex pathKey={pathPart} items={[]} />
            ) : null}
          </div>
        </div>
      </SiteChrome>
    )
  }

  // SSR: never load dead-urls or wire CS anchor overrides (hydrate applies them).
  // Phase ≥3 live: full article walk + deferred island fill.
  const deadUrls = live ? loadDeadUrls() : {}
  const renderMdAnchor = makeRenderMdAnchor(deadUrls)
  const loaded = loadArticleMarkdown(pathPart)
  let markdownContent = loaded.markdownContent
  let errMsg = loaded.errMsg

  // Warm home investigations as early as possible on the fill path (network + cache).
  let homeInvWarm = ''
  if (live === true && (pathPart === 'page.md' || pathPart === 'index.md')) {
    try {
      const respWarm = fetch('/page-sections/investigations.md?v=' + MD_CACHE_BUST, {
        method: 'GET',
        headers: {
          accept: 'text/markdown',
        },
      })
      if (respWarm && respWarm.ok === true) {
        const tw = respWarm.text ? respWarm.text : ''
        if (typeof tw === 'string' && tw.length > 20 && tw.charAt(0) !== '<') {
          homeInvWarm = tw
        }
      }
    } catch (eWarm) {}
  }

  const rawBody = errMsg ? '# Error\n\n' + errMsg : markdownContent
  let body = errMsg ? rawBody : rewriteMarkdownAssetUrls(rawBody, pathPart)
  const shareMd = errMsg ? '' : body
  // TOC: SSR already shipped the real index. On live, soft-hydrate does not
  // replace TOC — skip host extract + DynamicIndex rebuild (saves phase-3 time).
  let tocItems = []
  let idQueue = []
  if (live !== true) {
    const headingExtract = extractMarkdownHeadings(body)
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
  } else if (isClientLivePhase(4) === true) {
    const headingExtract = extractMarkdownHeadings(body)
    try {
      if (headingExtract && headingExtract.idQueue) {
        idQueue = headingExtract.idQueue
      }
    } catch (eQ2) {}
  }
  const headingOverrides =
    live && isClientLivePhase(4) === true ? makeHeadingOverrides(idQueue) : null

  // Huge single-file tips (no tip DeferredMarkdown): SSR lead + virtual tail
  // island instead of blanking the whole body (avoids soft-hydrate wipe).
  // maybeSplit returns a string (CleverScript-safe — not { didSplit, markdown }).
  if (!errMsg && typeof body === 'string' && body.length > 0) {
    try {
      const splitMd = maybeSplitHugeArticleMarkdown(body, pathPart)
      if (typeof splitMd === 'string' && splitMd.length > 0) {
        body = splitMd
      }
    } catch (eHuge) {}
  }
  // Virtual article tails are disabled (full tip SSR). Tip DeferredMarkdown
  // frags warm via prefetchDeferredMarkdown below / phase-3 loadDeferredFragment.


  // Warm DeferredMarkdown tip src at phase ≥2 (before phase-3 island fill).
  if (live && isClientLivePhase(2) === true && !errMsg) {
    try {
      const at = indexOfDeferredMarkdownTag(body)
      if (at + 17 <= body.length) {
        let src = 'page-sections/investigations.md'
        let k = at
        const bodyLast = body.length
        while (k + 5 < bodyLast && k < at + 200) {
          if (
            body.charAt(k) === 's' &&
            body.charAt(k + 1) === 'r' &&
            body.charAt(k + 2) === 'c' &&
            body.charAt(k + 3) === '=' &&
            body.charAt(k + 4) === '"'
          ) {
            const s1 = k + 5
            let s2 = s1
            while (s2 < bodyLast && body.charAt(s2) !== '"') {
              s2 = s2 + 1
            }
            if (s2 > s1) {
              src = body.slice(s1, s2)
            }
            break
          }
          k = k + 1
        }
        prefetchDeferredMarkdown(src)
      }
    } catch (ePref) {}
  }

  // P2 catalog — DirNav owns the heavy QUERY. Neighbors/share wait until phase ≥4
  // so phase-3 deferred fill is not competing with another catalog walk.
  const phase4Catalog = isClientLivePhase(4) === true
  const neighbors =
    phase4Catalog === true
      ? hostNeighborPaths(pathPart, loadDirCatalogRows())
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
  if (phase4Catalog === true && hideToolbar !== true && shareMd.length > 0) {
    let catalogImg = ''
    const rows = loadDirCatalogRows()
    for (let i = 0; i < rows.length; i++) {
      if (rowPath(rows[i]) === pathPart) {
        catalogImg = rowImageSrc(rows[i])
        break
      }
    }
    try {
      share.setShareArticle({
        filePath: pathPart,
        markdown: shareMd,
        imageSrc: catalogImg,
      })
    } catch (eShare) {}
  }
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

  const showArticleBody = errMsg.length > 0 || body.length > 0

  // At phase ≥3, lift deferred content out of the page MD walk.
  // Find `<DeferredMarkdown` via char-scan (CleverScript indexOf is unreliable).
  let mdBefore = body
  let mdAfter = ''
  let deferredIsland = null
  let useDeferredSplit = false
  if (showArticleBody && live === true && isClientLivePhase(3) === true && errMsg.length === 0) {
    let src = 'page-sections/investigations.md'
    let frag = ''
    let attrMinPx = 0
    const at = indexOfDeferredMarkdownTag(body)
    if (at + 17 <= body.length) {
      let end = 0
      let endLen = 1
      let endFound = false
      let j = at
      const bodyLast = body.length
      while (j + 1 < bodyLast) {
        if (body.charAt(j) === '/' && body.charAt(j + 1) === '>') {
          end = j
          endLen = 2
          endFound = true
          break
        }
        if (body.charAt(j) === '>') {
          end = j
          endLen = 1
          endFound = true
          break
        }
        j = j + 1
      }
      if (endFound === true) {
        useDeferredSplit = true
        mdBefore = body.slice(0, at)
        mdAfter = body.slice(end + endLen)
        const slice = body.slice(at, end + endLen)
        // src="..."
        let k = 0
        const sliceLast = slice.length
        while (k + 5 < sliceLast) {
          if (
            slice.charAt(k) === 's' &&
            slice.charAt(k + 1) === 'r' &&
            slice.charAt(k + 2) === 'c' &&
            slice.charAt(k + 3) === '=' &&
            slice.charAt(k + 4) === '"'
          ) {
            const s1 = k + 5
            let s2 = s1
            while (s2 < sliceLast && slice.charAt(s2) !== '"') {
              s2 = s2 + 1
            }
            if (s2 > s1) {
              src = slice.slice(s1, s2)
            }
            break
          }
          k = k + 1
        }
        try {
          frag = loadDeferredFragment(src, clientBase())
        } catch (eFrag) {
          frag = ''
        }
        if (!(typeof frag === 'string' && frag.length > 0)) {
          try {
            frag = prefetchDeferredMarkdown(src)
          } catch (ePref2) {
            frag = ''
          }
        }
      }
    }
    // Home page.md always has investigations deferred — if the tag scan missed
    // (CleverScript string quirks), still fill the SSR island.
    if (
      useDeferredSplit !== true &&
      (pathPart === 'page.md' || pathPart === 'index.md')
    ) {
      useDeferredSplit = true
      src = 'page-sections/investigations.md'
      attrMinPx = 20500
    }
    // Prefer warmed investigations bytes when the tip-GET helper returned empty.
    if (
      (!(typeof frag === 'string') || frag.length === 0) &&
      typeof homeInvWarm === 'string' &&
      homeInvWarm.length > 0
    ) {
      frag = homeInvWarm
      try {
        frag = rewriteMarkdownAssetUrls(homeInvWarm, 'page-sections/investigations.md')
      } catch (eRwInv) {
        frag = homeInvWarm
      }
    }
    if (
      (!(typeof frag === 'string') || frag.length === 0) &&
      useDeferredSplit === true
    ) {
      try {
        frag = loadDeferredFragment(src, clientBase())
      } catch (eHome2) {
        frag = ''
      }
    }
    // Tip DeferredMarkdown only — do NOT invent a virtual tail on the client.
    // Huge single-file tips are SSR'd in full; soft-hydrate keeps that HTML.
    if (useDeferredSplit === true && isVirtualDeferredSrc(src) === true) {
      useDeferredSplit = false
      deferredIsland = null
      frag = ''
    }
    if (useDeferredSplit === true && typeof frag === 'string' && frag.length > 0) {
      const fragLen = frag.length
      const minPx = estimateDeferredMinHeightPx(src, fragLen, attrMinPx)
      const minStyle = deferredMinHeightStyle(minPx)
      const phase4 = isClientLivePhase(4) === true
      // CleverScript MD walks are superlinear — never hand the full tail to
      // MarkdownRenderer with CS anchor/heading/image overrides (multi-minute freeze).
      let headBudget = DEFERRED_HYDRATE_CHUNK_CHARS
      if (phase4 === true) {
        headBudget = DEFERRED_HYDRATE_PHASE4_CHARS
      }
      if (!(typeof headBudget === 'number' && headBudget > 0)) {
        headBudget = 2800
      }
      let renderFrag = frag
      let restFrag = ''
      let pendingTail = false
      if (fragLen > headBudget) {
        let cut2 = headBudget
        try {
          cut2 = cutMarkdownLead(frag, headBudget)
        } catch (eCut) {
          cut2 = headBudget
        }
        if (cut2 < 1) {
          cut2 = headBudget
        }
        if (cut2 > 0 && cut2 < fragLen) {
          renderFrag = frag.slice(0, cut2)
          restFrag = frag.slice(cut2)
          pendingTail = true
        }
      }
      const lightOverrides = {
        AutoIndex: EmptyMdStub,
        ChangeLog: EmptyMdStub,
        ChatRoom: EmptyMdStub,
        EmbedFile: EmptyMdStub,
      }
      const deferOverrides =
        phase4 === true
          ? {
              AutoIndex: renderAutoIndex,
              ChangeLog: renderChangeLog,
              ChatRoom: EmptyMdStub,
              EmbedFile: renderEmbedFile,
              PopImage: renderPopImage,
              img: renderPopImage,
              a: renderMdAnchor,
              h1: headingOverrides.h1,
              h2: headingOverrides.h2,
              h3: headingOverrides.h3,
              h4: headingOverrides.h4,
              h5: headingOverrides.h5,
              h6: headingOverrides.h6,
            }
          : lightOverrides
      // Remainder: at most one more small light chunk at phase ≥4 — never the
      // full restFrag (investigations.md ~70KB freezes CleverScript for minutes).
      let restIsland = null
      if (pendingTail === true && restFrag.length > 0 && phase4 === true) {
        let restBudget = DEFERRED_HYDRATE_PHASE4_CHARS
        if (!(typeof restBudget === 'number' && restBudget > 0)) {
          restBudget = 1600
        }
        let restHead = restFrag
        let restPending = false
        if (restFrag.length > restBudget) {
          let cut3 = restBudget
          try {
            cut3 = cutMarkdownLead(restFrag, restBudget)
          } catch (eCut3) {
            cut3 = restBudget
          }
          if (cut3 < 1) cut3 = restBudget
          if (cut3 > 0 && cut3 < restFrag.length) {
            restHead = restFrag.slice(0, cut3)
            restPending = true
          }
        }
        restIsland = (
          <div data-pt-deferred-rest="1">
            <MarkdownRenderer
              content={restHead}
              navigate={(to) => {
                navigateFile(to)
              }}
              anchorOnClick={(href) => {
                onMdLinkClick(href)
              }}
              overrides={lightOverrides}
            />
            {restPending === true ? (
              <section
                className="pt-deferred-md"
                aria-label="Deferred section"
                aria-busy="true"
                data-pt-deferred-pending="1"
              />
            ) : null}
          </div>
        )
        pendingTail = restPending
      } else if (pendingTail === true) {
        restIsland = (
          <section
            className="pt-deferred-md"
            aria-label="Deferred section"
            aria-busy="true"
            data-pt-deferred-pending="1"
          />
        )
      }
      deferredIsland = (
        <section
          className="pt-deferred-md"
          data-pt-deferred="1"
          aria-label="Deferred section"
          style={pendingTail === true ? minStyle : {}}
        >
          <MarkdownRenderer
            content={renderFrag}
            navigate={(to) => {
              navigateFile(to)
            }}
            anchorOnClick={(href) => {
              onMdLinkClick(href)
            }}
            overrides={deferOverrides}
          />
          {restIsland}
        </section>
      )
    } else if (useDeferredSplit === true) {
      // Keep SSR deferred shell — do not soft-hydrate-swap to a tiny pending stub
      // when the tip fragment has not loaded yet (retry next idle phase).
      deferredIsland = null
    }
  }

  const renderDeferredMarkdown = (p) => {
    return (
      <DeferredMarkdown
        src={deferredSrcFromProps(p)}
        minHeight={deferredMinHeightFromProps(p)}
      />
    )
  }

  // SSR + early hydrate: custom tags only. Native a/h*/img stay on the Rust
  // md2ast→VDOM path (CS invoke per node is what freezes mobile on big tips).
  // Full CS overrides (dead-link anchors, heading ids, PopImage) at phase ≥4.
  const phase4 = isClientLivePhase(4) === true
  let articleOverrides = {
    AutoIndex: EmptyMdStub,
    ChangeLog: EmptyMdStub,
    DeferredMarkdown: useDeferredSplit ? EmptyMdStub : renderDeferredMarkdown,
    ChatRoom: EmptyMdStub,
    EmbedFile: EmptyMdStub,
  }
  if (live && phase4 !== true) {
    articleOverrides = {
      AutoIndex: isClientLivePhase(3) === true ? renderAutoIndex : EmptyMdStub,
      ChangeLog: isClientLivePhase(3) === true ? renderChangeLog : EmptyMdStub,
      DeferredMarkdown: useDeferredSplit ? EmptyMdStub : renderDeferredMarkdown,
      ChatRoom: EmptyMdStub,
      EmbedFile: isClientLivePhase(3) === true ? renderEmbedFile : EmptyMdStub,
    }
  }
  if (live && phase4 === true) {
    articleOverrides = {
      AutoIndex: renderAutoIndex,
      ChangeLog: renderChangeLog,
      DeferredMarkdown: useDeferredSplit ? EmptyMdStub : renderDeferredMarkdown,
      ChatRoom: EmptyMdStub,
      EmbedFile: renderEmbedFile,
      PopImage: renderPopImage,
      img: renderPopImage,
      a: renderMdAnchor,
      h1: headingOverrides.h1,
      h2: headingOverrides.h2,
      h3: headingOverrides.h3,
      h4: headingOverrides.h4,
      h5: headingOverrides.h5,
      h6: headingOverrides.h6,
    }
  }

  return (
    <SiteChrome currentPath={currentPath}>
      <div className="pt-page pt-article-page">
        <div className="pt-columns lg:pt-columns-lg">
          <main className="pt-column-main lg:pt-column-main-lg">
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
                live ? (
                  <div className="pt-md" data-pt-article="1">
                    {/* Soft-hydrate keeps the SSR lead in the DOM; only the
                        deferred island is swapped from this vnode. */}
                    {deferredIsland}
                    <span
                      aria-hidden="true"
                      hidden={true}
                      className="pt-dead-link pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-cl-cards pt-cl-card-item pt-cl-card pt-cl-card-media pt-cl-card-thumb pt-cl-card-thumb-logo pt-cl-card-body pt-cl-card-title pt-cl-card-dates pt-cl-card-date pt-cl-card-byline pt-cl-feed pt-cl-entry pt-cl-entry-thumb pt-cl-entry-img pt-cl-entry-logo pt-cl-entry-body pt-cl-entry-title pt-cl-entry-file pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty float-left float-right float-none clear-left clear-right clear-both clear-none max-w-sm max-w-md max-w-lg sm:float-left sm:float-right sm:max-w-sm sm:m-1 sm:mr-4 sm:mr-6 sm:ml-8 sm:mb-4"
                      data-pt-md-css="true"
                    />
                  </div>
                ) : (
                <div className="pt-md" data-pt-article="1">
                  {useDeferredSplit ? (
                    <div className="pt-deferred-split">
                      <MarkdownRenderer
                        content={mdBefore}
                        navigate={(to) => {
                          navigateFile(to)
                        }}
                        anchorOnClick={(href) => {
                          onMdLinkClick(href)
                        }}
                        overrides={articleOverrides}
                      />
                      {deferredIsland}
                      {mdAfter.length > 0 ? (
                        <MarkdownRenderer
                          content={mdAfter}
                          navigate={(to) => {
                            navigateFile(to)
                          }}
                          anchorOnClick={(href) => {
                            onMdLinkClick(href)
                          }}
                          overrides={articleOverrides}
                        />
                      ) : null}
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
                      overrides={articleOverrides}
                    />
                  )}
                  {/* Keep hydrate-only theme classes in the SSR used-class set. */}
                  <span
                    aria-hidden="true"
                    hidden={true}
                    className="pt-dead-link pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-cl-cards pt-cl-card-item pt-cl-card pt-cl-card-media pt-cl-card-thumb pt-cl-card-thumb-logo pt-cl-card-body pt-cl-card-title pt-cl-card-dates pt-cl-card-date pt-cl-card-byline pt-cl-feed pt-cl-entry pt-cl-entry-thumb pt-cl-entry-img pt-cl-entry-logo pt-cl-entry-body pt-cl-entry-title pt-cl-entry-file pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty float-left float-right float-none clear-left clear-right clear-both clear-none max-w-sm max-w-md max-w-lg sm:float-left sm:float-right sm:max-w-sm sm:m-1 sm:mr-4 sm:mr-6 sm:ml-8 sm:mb-4"
                    data-pt-md-css="true"
                  />
                </div>
                )
              ) : (
                <div className="pt-md" data-pt-article-ssr="1">
                  <p className="pt-muted">Article loads after page open…</p>
                  <span
                    aria-hidden="true"
                    hidden={true}
                    className="pt-dead-link pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-cl-cards pt-cl-card-item pt-cl-card pt-cl-card-media pt-cl-card-thumb pt-cl-card-thumb-logo pt-cl-card-body pt-cl-card-title pt-cl-card-dates pt-cl-card-date pt-cl-card-byline pt-cl-feed pt-cl-entry pt-cl-entry-thumb pt-cl-entry-img pt-cl-entry-logo pt-cl-entry-body pt-cl-entry-title pt-cl-entry-file pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty float-left float-right float-none clear-left clear-right clear-both clear-none max-w-sm max-w-md max-w-lg sm:float-left sm:float-right sm:max-w-sm sm:m-1 sm:mr-4 sm:mr-6 sm:ml-8 sm:mb-4"
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
          </main>
          <DirNav currentPath={currentPath} />
          {showToc ? (
            <DynamicIndex pathKey={pathPart} items={tocItems} />
          ) : null}
        </div>
      </div>
    </SiteChrome>
  )
}

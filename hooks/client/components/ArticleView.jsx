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
import { setPageToc, clearPageToc } from 'hooks/client/tocStore.js'
import AutoIndex from 'hooks/client/components/AutoIndex.jsx'
import DirectoryIndex, {
  autoIndexDirFromPath,
  resolveDirectoryIndexDir,
  shouldTryDirectoryIndex,
} from 'hooks/client/components/DirectoryIndex.jsx'
import ChangeLog from 'hooks/client/components/ChangeLog.jsx'
import FlashbackNowShowing from 'hooks/client/components/FlashbackNowShowing.jsx'
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
import ChatRoomLive from 'hooks/client/components/ChatRoomLive.jsx'
import { propStr } from 'hooks/client/propOr.jsx'
import manifest from '@hooks'

/** Tip CDN bust — bump when ASCII-safe content must pierce max-age=3600. */
const MD_CACHE_BUST = 'ptmd15'

/** Stub for markdown tags not yet implemented (module-level for CleverScript scope). */
function EmptyMdStub() {
  return <span className="pt-md-stub" aria-hidden="true" />
}

function renderChatRoom(p) {
  return (
    <ChatRoomLive
      channel={propStr(p, 'channel', '')}
      title={propStr(p, 'title', '')}
      mode={propStr(p, 'mode', 'embed')}
    />
  )
}

/** Module-level so override identity stays stable across parent re-renders (avoids remounting ChangeLog). */
function renderChangeLog(p) {
  let lim = 8
  try {
    if (p && typeof p.limit === 'number' && p.limit > 0) lim = p.limit
  } catch (e) {}
  return <ChangeLog limit={lim} />
}

function renderFlashbackNowShowing() {
  return <FlashbackNowShowing />
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
 * Candidates match old CatchAll: as-is; `foo.md` also tries `foo/page.md`; extensionless → both.
 */
function looksLikeGatewayMissingJson(text) {
  if (typeof text !== 'string' || text.length < 8) return false
  if (text.charAt(0) !== '{') return false
  // Park/API soft-404 JSON must not count as markdown (would skip DirectoryIndex).
  if (text.indexOf('"ok":false') >= 0) return true
  if (text.indexOf('"status":"not_found"') >= 0) return true
  return false
}

function isUsableMarkdownText(text) {
  if (typeof text !== 'string' || text.length === 0) return false
  if (text.charAt(0) === '<') return false
  if (looksLikeGatewayMissingJson(text)) return false
  return true
}

function loadArticleMarkdown(pathPart) {
  const slash = pathPart.lastIndexOf('/')
  const base = slash >= 0 ? pathPart.slice(slash + 1) : pathPart
  const hasExt = base.length > 0 && base.indexOf('.') >= 0
  // CleverScript: no Array.push — fixed candidate list (max 2).
  let cand0 = pathPart
  let cand1 = ''
  let nCand = 1
  if (
    hasExt &&
    base.length > 3 &&
    base.slice(base.length - 3) === '.md' &&
    base !== 'page.md' &&
    base !== 'README.md' &&
    base !== 'index.md'
  ) {
    const stem = pathPart.slice(0, pathPart.length - 3)
    cand0 = pathPart
    cand1 = stem + '/page.md'
    nCand = 2
  } else if (!hasExt) {
    cand0 = pathPart + '.md'
    cand1 = pathPart + '/page.md'
    nCand = 2
  }
  const live = isClientLive() === true

  // Live hydrate: fetch tip as markdown. Always send Accept: text/markdown —
  // browsers default Accept: text/html and the gateway then SSR-renders the
  // .md path as a full HTML document (breaks DeferredMarkdown discovery).
  let liveMissStatus = 0
  let liveTried = false
  if (live) {
    for (let j = 0; j < nCand; j++) {
      const cand = j === 0 ? cand0 : cand1
      if (cand.length === 0) continue
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
          liveTried = true
          if (resp && resp.ok === true) {
            const text = resp.text ? resp.text : ''
            if (isUsableMarkdownText(text) && text.length > 20) {
              return { markdownContent: text, errMsg: '', resolvedPath: cand }
            }
          } else if (resp && resp.status) {
            liveMissStatus = resp.status
          }
        } catch (eLive) {}
      }
    }
  }

  for (let i = 0; i < nCand; i++) {
    const cand = i === 0 ? cand0 : cand1
    if (cand.length === 0) continue
    const rel = '/' + cand + '?v=' + MD_CACHE_BUST
    try {
      const text = cachedGet(rel)
      if (isUsableMarkdownText(text)) {
        return { markdownContent: text, errMsg: '', resolvedPath: cand }
      }
    } catch (e) {}
  }

  // After live GETs all missed, do not pretend cached error JSON is tip markdown.
  if (live === true && liveTried === true && liveMissStatus > 0) {
    return {
      markdownContent: '',
      errMsg: 'Could not load file (HTTP ' + liveMissStatus + ')',
      resolvedPath: pathPart,
    }
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
      if (cand.length === 0) continue
      const url = baseStr + '/' + cand + '?v=' + MD_CACHE_BUST
      const resp = fetch(url, {
        method: 'GET',
        headers: {
          accept: 'text/markdown',
        },
      })
      if (resp && resp.ok === true) {
        const text = resp.text ? resp.text : ''
        if (isUsableMarkdownText(text)) {
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
  // in the DOM; only DirNav / empty deferred shells are swapped.
  //
  // Full-SSR articles and SSR-filled deferred (no `[data-pt-deferred-ssr]`): stay on
  // this shell for all live phases — never re-GET/walk the tip.
  // ChangeLog / FlashbackNowShowing live inside soft-kept markdown HTML; lift live
  // components into the vnode so replaceSsrPlaceholdersFromVnode can swap islands.
  let hasDeferredSsr = false
  // DirectoryIndex SSR is a placeholder (not full tip HTML) — must fill at phase ≥3.
  let hasDirIndexSsr = false
  let hasChangelogSsr = false
  let hasFlashbackSsr = false
  if (live === true) {
    try {
      const el = document.querySelector('[data-pt-deferred-ssr]')
      if (el) hasDeferredSsr = true
    } catch (eDom) {}
    try {
      const di = document.querySelector(
        '[data-pt-dir-index-page],[data-pt-autoindex-ssr]',
      )
      if (di) hasDirIndexSsr = true
    } catch (eDi) {}
    try {
      const cl = document.querySelector('[data-pt-changelog-ssr]')
      if (cl) hasChangelogSsr = true
    } catch (eCl) {}
    try {
      const fb = document.querySelector('[data-pt-flashback-ssr]')
      if (fb) hasFlashbackSsr = true
    } catch (eFb) {}
  }
  const needsDeferredFill = hasDeferredSsr === true
  // Also SPA: warm tree kids under hub path → skip ssr-keep so miss can become DirectoryIndex.
  let needsDirIndexFill = hasDirIndexSsr === true
  if (
    live === true &&
    needsDirIndexFill !== true &&
    isClientLivePhase(2) === true
  ) {
    try {
      if (resolveDirectoryIndexDir(pathPart).length > 0) {
        needsDirIndexFill = true
      }
    } catch (eRes) {}
  }
  // Soft-hydrate: keep SSR article / DirectoryIndex placeholder until phase 3.
  // DirNav warms catalog at phase 2; missing page.md fills DirectoryIndex at phase 3.
  // Dir-index routes must keep a matching DirectoryIndex vnode (not an empty
  // aria-hidden shell) so replaceSsrPlaceholdersFromVnode can swap the island.
  if (live === true && isClientLivePhase(3) !== true) {
    let earlyDirPath = ''
    if (hasDirIndexSsr === true || shouldTryDirectoryIndex(pathPart) === true) {
      earlyDirPath = autoIndexDirFromPath(pathPart)
    }
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
                {earlyDirPath.length > 0 ? (
                  <div
                    className="pt-md"
                    data-pt-article="1"
                    data-pt-dir-index-page="1"
                    data-pt-article-phase="early"
                  >
                    <DirectoryIndex path={earlyDirPath} />
                    <span
                      aria-hidden="true"
                      hidden={true}
                      className="pt-dir-index pt-dir-index-title pt-dir-index-heading pt-dir-index-list pt-dir-index-item pt-dir-index-cat pt-dir-index-doc pt-dir-index-section pt-dir-index-body pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item"
                      data-pt-md-css="true"
                    />
                  </div>
                ) : (
                  <div
                    className="pt-md"
                    data-pt-article="1"
                    data-pt-article-phase="early"
                    aria-hidden="true"
                  />
                )}
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
  // Full tip SSR (no deferred islands, no DirectoryIndex placeholder): keep shell.
  // Still emit ChangeLog / Flashback when SSR placeholders remain so phase ≥3 can swap.
  if (
    live === true &&
    needsDeferredFill !== true &&
    needsDirIndexFill !== true
  ) {
    const changelogKeep =
      hasChangelogSsr === true ? <ChangeLog limit={8} /> : null
    const flashbackKeep =
      hasFlashbackSsr === true ? <FlashbackNowShowing /> : null
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
                {flashbackKeep}
                {changelogKeep}
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
  // Missing page.md (or foo.md) with catalog children → directory index (not Error).
  let dirIndexPath = ''
  if (errMsg && errMsg.length > 0) {
    try {
      dirIndexPath = resolveDirectoryIndexDir(pathPart)
    } catch (eDir) {
      dirIndexPath = ''
    }
    if (dirIndexPath.length > 0) {
      errMsg = ''
      markdownContent = ''
    }
  }

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
  let body = rawBody
  if (!errMsg && dirIndexPath.length === 0) {
    body = rewriteMarkdownAssetUrls(rawBody, pathPart)
  }
  const shareMd = errMsg || dirIndexPath.length > 0 ? '' : body
  // TOC: SSR ships the real index. Live still extracts for the mobile-menu
  // store (Nav DynamicIndex mode=menu); soft-hydrate keeps the column TOC DOM.
  let tocItems = []
  let idQueue = []
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
  if (
    dirIndexPath.length === 0 &&
    pathPart !== 'README.md' &&
    pathPart !== 'index.md' &&
    pathPart.length > 0 &&
    tocItems.length > 0
  ) {
    setPageToc(currentPath, tocItems)
  } else {
    clearPageToc()
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
  const layoutFilePath =
    dirIndexPath.length > 0 ? dirIndexPath + '/page.md' : pathPart
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
  // Home (page.md) and articles share content-derived TOC; skip bare index stubs + dir hubs.
  const showToc =
    dirIndexPath.length === 0 &&
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

  const showArticleBody =
    errMsg.length > 0 || body.length > 0 || dirIndexPath.length > 0

  // Lift DeferredMarkdown out of the page MD walk.
  // SSR: render the tip fragment in full (host MarkdownRenderer) so soft-hydrate
  // keeps real content — client never re-walks investigations.md.
  // Live phase ≥3: only fill empty `[data-pt-deferred-ssr]` shells (chunked).
  let mdBefore = body
  let mdAfter = ''
  let deferredIsland = null
  let useDeferredSplit = false
  const doDeferredLift =
    showArticleBody &&
    errMsg.length === 0 &&
    dirIndexPath.length === 0 &&
    (live !== true || isClientLivePhase(3) === true)
  if (doDeferredLift === true) {
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
      attrMinPx = 1600
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
    // SSR fallback: direct tip blob read (avoid DeferredMarkdown empty shell).
    if (
      live !== true &&
      useDeferredSplit === true &&
      (!(typeof frag === 'string') || frag.length === 0)
    ) {
      try {
        const rawInv = cachedGet('/' + src)
        if (
          typeof rawInv === 'string' &&
          rawInv.length > 20 &&
          rawInv.charAt(0) !== '<'
        ) {
          frag = rawInv
          try {
            frag = rewriteMarkdownAssetUrls(rawInv, src)
          } catch (eRwSsr) {
            frag = rawInv
          }
        }
      } catch (eSsrGet) {}
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
      const lightOverrides = {
        AutoIndex: renderAutoIndex,
        ChangeLog: renderChangeLog,
        FlashbackNowShowing: renderFlashbackNowShowing,
        ChatRoom: renderChatRoom,
        EmbedFile: renderEmbedFile,
      }
      // SSR: full fragment via host MD (no CS a/h/img overrides). Soft-hydrate keeps it.
      if (live !== true) {
        deferredIsland = (
          <section
            className="pt-deferred-md"
            data-pt-deferred="1"
            aria-label="Deferred section"
            style={minStyle}
          >
            <MarkdownRenderer
              content={frag}
              navigate={(to) => {
                navigateFile(to)
              }}
              anchorOnClick={(href) => {
                onMdLinkClick(href)
              }}
              overrides={{
                AutoIndex: renderAutoIndex,
                ChangeLog: renderChangeLog,
                FlashbackNowShowing: renderFlashbackNowShowing,
                ChatRoom: renderChatRoom,
                EmbedFile: renderEmbedFile,
              }}
            />
          </section>
        )
      } else {
        const phase4 = isClientLivePhase(4) === true
        // CleverScript MD walks are superlinear — never hand the full tail with
        // CS overrides to MarkdownRenderer (multi-minute freeze).
        let headBudget = DEFERRED_HYDRATE_CHUNK_CHARS
        if (phase4 === true) {
          headBudget = DEFERRED_HYDRATE_PHASE4_CHARS
        }
        if (!(typeof headBudget === 'number' && headBudget > 0)) {
          headBudget = 1600
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
        const deferOverrides =
          phase4 === true
            ? {
                AutoIndex: renderAutoIndex,
                ChangeLog: renderChangeLog,
                FlashbackNowShowing: renderFlashbackNowShowing,
                ChatRoom: renderChatRoom,
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
      }
    } else if (useDeferredSplit === true && live !== true) {
      deferredIsland = (
        <DeferredMarkdown src={src} minHeight={attrMinPx > 0 ? attrMinPx : 1600} />
      )
    } else if (useDeferredSplit === true) {
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

  // Custom markdown components self-gate with data-pt-*-ssr placeholders until
  // their hydrate phase. Never EmptyMdStub for ChangeLog/AutoIndex — soft-hydrate
  // cannot replace a stub (no island attr), so the home ChangeLog would stay missing.
  const phase4 = isClientLivePhase(4) === true
  let articleOverrides = {
    AutoIndex: renderAutoIndex,
    ChangeLog: renderChangeLog,
    FlashbackNowShowing: renderFlashbackNowShowing,
    DeferredMarkdown: useDeferredSplit ? EmptyMdStub : renderDeferredMarkdown,
    ChatRoom: renderChatRoom,
    EmbedFile: renderEmbedFile,
  }
  if (live && phase4 === true) {
    articleOverrides = {
      AutoIndex: renderAutoIndex,
      ChangeLog: renderChangeLog,
      FlashbackNowShowing: renderFlashbackNowShowing,
      DeferredMarkdown: useDeferredSplit ? EmptyMdStub : renderDeferredMarkdown,
      ChatRoom: renderChatRoom,
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
              filePath={layoutFilePath}
              hideToolbar={hideToolbar}
              onUp={() => {
                navigateFile(parentDir(routePath))
              }}
              onHome={() => {
                navigateFile('page.md')
              }}
            >
              {dirIndexPath.length > 0 ? (
                <div
                  className="pt-md"
                  data-pt-article="1"
                  data-pt-dir-index-page="1"
                >
                  <DirectoryIndex path={dirIndexPath} />
                  <span
                    aria-hidden="true"
                    hidden={true}
                    className="pt-dir-index pt-dir-index-title pt-dir-index-heading pt-dir-index-list pt-dir-index-item pt-dir-index-cat pt-dir-index-doc pt-dir-index-section pt-dir-index-body pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item"
                    data-pt-md-css="true"
                  />
                </div>
              ) : showArticleBody ? (
                live ? (
                  <div className="pt-md" data-pt-article="1">
                    {/* Soft-hydrate keeps the SSR lead in the DOM; only deferred /
                        ChangeLog / Flashback islands are swapped from this vnode. */}
                    {hasFlashbackSsr === true ? <FlashbackNowShowing /> : null}
                    {hasChangelogSsr === true ? (
                      <ChangeLog limit={8} />
                    ) : null}
                    {deferredIsland}
                    <span
                      aria-hidden="true"
                      hidden={true}
                      className="pt-dead-link pt-flashback-now pt-flashback-now-head pt-flashback-now-title pt-flashback-now-more pt-flashback-now-list pt-flashback-now-item pt-flashback-now-status pt-changelog pt-changelog-radio pt-changelog-toolbar pt-changelog-tab pt-changelog-status pt-changelog-list pt-changelog-item pt-cl-cards pt-cl-card-item pt-cl-card pt-cl-card-media pt-cl-card-thumb pt-cl-card-thumb-logo pt-cl-card-body pt-cl-card-title pt-cl-card-dates pt-cl-card-date pt-cl-card-byline pt-cl-feed pt-cl-entry pt-cl-entry-thumb pt-cl-entry-img pt-cl-entry-logo pt-cl-entry-body pt-cl-entry-title pt-cl-entry-file pt-card pt-autoindex pt-autoindex-title pt-autoindex-list pt-autoindex-item pt-embed pt-embed-frame pt-embed-caption pt-embed-link pt-embed-empty float-left float-right float-none clear-left clear-right clear-both clear-none max-w-sm max-w-md max-w-lg sm:float-left sm:float-right sm:max-w-sm sm:m-1 sm:mr-4 sm:mr-6 sm:ml-8 sm:mb-4"
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

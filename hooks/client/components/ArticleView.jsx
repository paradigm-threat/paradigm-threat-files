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
  parseDeferredMinHeightAttr,
  maybeSplitHugeArticleMarkdown,
  prefetchDeferredMarkdown,
  reseedArticleTailFromMarkdown,
  cutMarkdownLead,
  isVirtualDeferredSrc,
  DEFERRED_HYDRATE_CHUNK_CHARS,
} from 'hooks/client/components/DeferredMarkdown.jsx'
import PopImage from 'hooks/client/components/PopImage.jsx'
import EmbedFile from 'hooks/client/components/EmbedFile.jsx'
import manifest from '@hooks'

/** Tip CDN bust — bump when ASCII-safe content must pierce max-age=3600. */
const MD_CACHE_BUST = 'ptmd12'

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

  for (let i = 0; i < nCand; i++) {
    const cand = i === 0 ? cand0 : cand1
    const rel = '/' + cand + '?v=' + MD_CACHE_BUST
    try {
      const text = cachedGet(rel)
      if (typeof text === 'string' && text.length > 0) {
        return { markdownContent: text, errMsg: '', resolvedPath: cand }
      }
    } catch (e) {}
  }

  // CSR fallback when cachedGet empty (older hosts): absolute tip URL.
  const live = isClientLive() === true
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
      const resp = fetch(url, { method: 'GET' })
      if (resp && resp.ok === true) {
        return {
          markdownContent: resp.text ? resp.text : '',
          errMsg: '',
          resolvedPath: cand,
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
  // SSR: never load dead-urls or wire CS anchor overrides (hydrate applies them).
  const deadUrls = live ? loadDeadUrls() : {}
  const renderMdAnchor = makeRenderMdAnchor(deadUrls)
  const loaded = loadArticleMarkdown(pathPart)
  let markdownContent = loaded.markdownContent
  let errMsg = loaded.errMsg

  const rawBody = errMsg ? '# Error\n\n' + errMsg : markdownContent
  let body = errMsg ? rawBody : rewriteMarkdownAssetUrls(rawBody, pathPart)
  const shareMd = errMsg ? '' : body
  // TOC from full tip before any deferred split (tail headings stay in index).
  // Host extract is Rust-cheap — keep it on SSR so the TOC side column is real HTML
  // (not “Contents load after page open…”). CS heading *overrides* stay live-only.
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
  const headingOverrides = live ? makeHeadingOverrides(idQueue) : null

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
  // Browser hydrate: SSR seedDeferredMarkdown is process-local. Always re-seed
  // the virtual article tail from the full tip before phase-3 island fill.
  if (live && !errMsg && typeof markdownContent === 'string' && markdownContent.length > 0) {
    try {
      reseedArticleTailFromMarkdown(rewriteMarkdownAssetUrls(markdownContent, pathPart))
    } catch (eReseed0) {}
  }

  // Warm DeferredMarkdown tip src at phase ≥2 (before phase-3 island fill).
  if (live && isClientLivePhase(2) === true && !errMsg) {
    try {
      const marker = '<DeferredMarkdown'
      const at = body.indexOf(marker)
      if (at >= 0) {
        let src = 'page-sections/investigations.md'
        const srcKey = 'src="'
        const s0 = body.indexOf(srcKey, at)
        if (s0 >= 0 && s0 < at + 200) {
          const s1 = s0 + srcKey.length
          const s2 = body.indexOf('"', s1)
          if (s2 > s1) src = body.slice(s1, s2)
        }
        prefetchDeferredMarkdown(src)
      }
    } catch (ePref) {}
  }

  // P2 catalog — neighbors only when live.
  const neighbors = live
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
  if (live && hideToolbar !== true && shareMd.length > 0) {
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

  // At phase ≥3, lift DeferredMarkdown out of the page MD walk: nested
  // MarkdownRenderer (or cachedGet) inside the override aborts the vnode so
  // soft-hydrate never swaps the SSR island. Split the tip and render the
  // fragment as a sibling MarkdownRenderer instead.
  let mdBefore = body
  let mdAfter = ''
  let deferredIsland = null
  let useDeferredSplit = false
  if (showArticleBody && isClientLivePhase(3) === true) {
    // Inline tag scan (CleverScript-safe). Do not wrap island JSX in a catch
    // that clears useDeferredSplit — that left an empty pending forever.
    const marker = '<DeferredMarkdown'
    const at = body.indexOf(marker)
    if (at >= 0) {
      const selfClose = body.indexOf('/>', at)
      const tagEnd = body.indexOf('>', at)
      let end = -1
      let endLen = 1
      if (selfClose >= 0 && (tagEnd < 0 || selfClose <= tagEnd)) {
        end = selfClose
        endLen = 2
      } else if (tagEnd >= 0) {
        end = tagEnd
        endLen = 1
      }
      if (end >= 0) {
        useDeferredSplit = true
        mdBefore = body.slice(0, at)
        mdAfter = body.slice(end + endLen)
        let src = 'page-sections/investigations.md'
        let attrMinPx = 0
        const slice = body.slice(at, end + endLen)
        const srcKey = 'src="'
        const s0 = slice.indexOf(srcKey)
        if (s0 >= 0) {
          const s1 = s0 + srcKey.length
          const s2 = slice.indexOf('"', s1)
          if (s2 > s1) src = slice.slice(s1, s2)
        }
        const mhKey = 'minHeight="'
        const m0 = slice.indexOf(mhKey)
        if (m0 >= 0) {
          const m1 = m0 + mhKey.length
          const m2 = slice.indexOf('"', m1)
          if (m2 > m1) {
            try {
              attrMinPx = parseDeferredMinHeightAttr(slice.slice(m1, m2))
            } catch (eMh) {
              attrMinPx = 0
            }
          }
        }
        let frag = ''
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
        // Virtual article tail: SSR seed is process-local — re-derive from tip.
        if (
          !(typeof frag === 'string' && frag.length > 0) &&
          isVirtualDeferredSrc(src) === true
        ) {
          try {
            const fullRaw = errMsg ? '' : markdownContent
            const full =
              typeof fullRaw === 'string' && fullRaw.length > 0
                ? rewriteMarkdownAssetUrls(fullRaw, pathPart)
                : ''
            frag = reseedArticleTailFromMarkdown(full)
          } catch (eReseed) {
            frag = ''
          }
        }
        // Last resort for real tip srcs only (never GET __article_tail__).
        if (
          !(typeof frag === 'string' && frag.length > 0) &&
          isVirtualDeferredSrc(src) !== true
        ) {
          try {
            const rawAgain = cachedGet('/' + src + '?v=' + MD_CACHE_BUST)
            if (typeof rawAgain === 'string' && rawAgain.length > 0) {
              frag = rawAgain
            }
          } catch (eLast) {}
        }
        const fragLen =
          typeof frag === 'string' && frag.length > 0 ? frag.length : 0
        const minPx = estimateDeferredMinHeightPx(src, fragLen, attrMinPx)
        const minStyle = deferredMinHeightStyle(minPx)
        if (fragLen > 0) {
          // Phase 3: first chunk only (idle ladder paints shell before the rest).
          // Phase ≥4: full fragment. Avoid one 74KB CS-override walk freezing mobile.
          const phase4 = isClientLivePhase(4) === true
          let renderFrag = frag
          let pendingTail = false
          if (phase4 !== true && fragLen > DEFERRED_HYDRATE_CHUNK_CHARS) {
            try {
              const cut = cutMarkdownLead(frag, DEFERRED_HYDRATE_CHUNK_CHARS)
              if (cut > 0 && cut < fragLen) {
                renderFrag = frag.slice(0, cut)
                pendingTail = true
              }
            } catch (eCut) {
              renderFrag = frag
              pendingTail = false
            }
          }
          // First chunk: native a/h/img (Rust path). Full CS overrides at phase ≥4.
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
              : {
                  AutoIndex: EmptyMdStub,
                  ChangeLog: EmptyMdStub,
                  ChatRoom: EmptyMdStub,
                  EmbedFile: EmptyMdStub,
                }
          deferredIsland = (
            <section
              className="pt-deferred-md"
              data-pt-deferred="1"
              aria-label="Deferred section"
              style={minStyle}
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
              {pendingTail === true ? (
                <section
                  className="pt-deferred-md"
                  aria-label="Deferred section"
                  aria-busy="true"
                  data-pt-deferred-pending="1"
                />
              ) : null}
            </section>
          )
        } else {
          // Missing fragment: keep a small reserve — do not honor the full-tail
          // minHeight (can be 8k+ px) or the page looks like a broken empty column.
          deferredIsland = (
            <section
              className="pt-deferred-md"
              aria-label="Deferred section"
              aria-busy="true"
              data-pt-deferred-pending="1"
              style={deferredMinHeightStyle(120)}
            />
          )
        }
      }
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

/**
 * Thin files — in-repo CleverScript site shell.
 * Same-origin only (no other content repos). Hard md components disabled.
 */
import React from 'react'
import StyleContext from '@clevertree/style'
import manifest from '@hooks'
import BootShell from 'hooks/client/components/BootShell.jsx'
import { isCsrHost } from 'hooks/client/hostMode.jsx'
import ArticleView from 'hooks/client/components/ArticleView.jsx'
import HomePage from 'hooks/client/components/HomePage.jsx'
import SearchPage from 'hooks/client/components/SearchPage.jsx'
import { ensureSearchFormNav } from 'hooks/client/searchFormNav.js'
import { ensureNavMenu } from 'hooks/client/navMenu.js'

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

function normalizeRoute(raw) {
  let t = str(raw).trim()
  if (t.length === 0) return '/'
  if (t.charAt(0) !== '/') t = '/' + t
  if (t === '/index.md') return '/'
  return t
}

function initialRoute() {
  try {
    if (manifest.relayInitialPath && typeof manifest.relayInitialPath === 'string') {
      return normalizeRoute(manifest.relayInitialPath)
    }
  } catch (e) {
    return '/'
  }
  return '/'
}

function articleFilePath(route) {
  let t = normalizeRoute(route)
  if (t.charAt(0) === '/') t = t.slice(1)
  if (t.length === 0) return 'page.md'
  // Pretty public paths (`science/computing/foo`) → tip blob (`….md`).
  const slash = t.lastIndexOf('/')
  const base = slash >= 0 ? t.slice(slash + 1) : t
  if (base.length > 0 && base.indexOf('.') < 0) {
    return t + '.md'
  }
  return t
}

/** `/search/{topic}` → topic; bare `/search` may use `?q=`. */
function searchInitialQuery(route) {
  const r = normalizeRoute(route)
  if (typeof r === 'string' && r.indexOf('/search/') === 0) {
    let rest = r.slice('/search/'.length)
    const slash = rest.indexOf('/')
    if (slash >= 0) {
      rest = rest.slice(0, slash)
    }
    const qmark = rest.indexOf('?')
    if (qmark >= 0) {
      rest = rest.slice(0, qmark)
    }
    // Path segment uses `_` for spaces (searchFormNav topicPathSegment). Decode
    // before QUERY — otherwise "bibi death" becomes a zero-hit "bibi_death" literal.
    rest = rest.split('_').join(' ')
    return str(rest).trim()
  }
  try {
    const g = globalThis
    if (g && g.location && typeof g.location.search === 'string') {
      const s = g.location.search
      if (s.indexOf('q=') >= 0) {
        let raw = s
        if (raw.charAt(0) === '?') {
          raw = raw.slice(1)
        }
        const parts = raw.split('&')
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i]
          if (p.indexOf('q=') === 0) {
            let v = p.slice(2)
            // CleverScript has no decodeURIComponent; + → space is enough for seeded q=.
            v = v.split('+').join(' ')
            return str(v).trim()
          }
        }
      }
    }
  } catch (eLoc) {}
  return ''
}

export default function ParadigmFilesRelayRoot() {
  // Soft-hydrate may skip remount; bind native nav + search once from root.
  ensureSearchFormNav()
  ensureNavMenu()
  const route = initialRoute()
  let page = null
  if (route === '/search' || (typeof route === 'string' && route.indexOf('/search/') === 0)) {
    page = (
      <SearchPage currentPath={route} initialQuery={searchInitialQuery(route)} />
    )
  } else if (route === '/' || route === '/index.md' || route === '/page.md') {
    page = <ArticleView currentPath="/" filePath="page.md" />
  } else if (route === '/articles') {
    page = <HomePage />
  } else if (route === '/README.md') {
    page = <ArticleView currentPath="/README.md" filePath="README.md" />
  } else {
    page = <ArticleView currentPath={route} filePath={articleFilePath(route)} />
  }

  return (
    <BootShell>
      <StyleContext src="hooks/client/theme.yaml" fullScreen={isCsrHost() !== true}>
        {page}
      </StyleContext>
    </BootShell>
  )
}

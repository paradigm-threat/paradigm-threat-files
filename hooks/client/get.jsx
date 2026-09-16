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

const ARCHIVE = 'https://old.paradigmthreat.net'
const OLD_SEARCH = ARCHIVE + '/search'

/** Temporary: park /search → archive (no hooks — CleverScript SSR rejects useEffect here). */
function RedirectToOldSearch(props) {
  let dest = OLD_SEARCH
  try {
    if (props && typeof props.href === 'string' && props.href.length > 0) {
      dest = props.href
    }
  } catch (e) {}
  return (
    <main className="pt-page" style={{ padding: '2rem 1rem' }}>
      <meta httpEquiv="refresh" content={'0;url=' + dest} />
      <p className="pt-muted">
        Redirecting to archive search…{' '}
        <a href={dest}>old.paradigmthreat.net/search</a>
      </p>
    </main>
  )
}

function archiveSearchHref(route) {
  let dest = OLD_SEARCH
  if (typeof route === 'string' && route.indexOf('/search/') === 0) {
    dest = ARCHIVE + route
  }
  try {
    const g = globalThis
    if (g && g.location && typeof g.location.search === 'string' && g.location.search.length > 0) {
      if (dest.indexOf('?') < 0) dest = dest + g.location.search
    }
  } catch (e) {}
  return dest
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

export default function ParadigmFilesRelayRoot() {
  const route = initialRoute()
  let page = null
  if (route === '/search' || (typeof route === 'string' && route.indexOf('/search/') === 0)) {
    page = <RedirectToOldSearch href={archiveSearchHref(route)} />
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

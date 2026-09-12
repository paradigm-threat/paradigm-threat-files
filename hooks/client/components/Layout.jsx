/**
 * Repo shell: path label + Up / Home + scrollable content.
 * Prefer href navigation from parent; optional onUp/onHome for same-page state.
 */
import { isClientLivePhase } from '@clevertree/style-internal'
import { dirname } from '@relay/path'
import { propOr, propStr } from 'hooks/client/propOr.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'
import { share } from 'hooks/client/shareStore.jsx'
import { IconShare } from 'hooks/client/components/Icons.jsx'

function parentHref(filePath) {
  let rel = typeof filePath === 'string' ? filePath : ''
  while (rel.length > 0 && rel.charAt(0) === '/') {
    rel = rel.slice(1)
  }
  if (rel.length === 0 || rel === 'page.md' || rel === 'README.md') {
    return siteHref('/')
  }
  const dir = dirname(rel)
  if (!dir || dir === '.' || dir === '/') {
    return siteHref('/')
  }
  return siteHref('/' + dir + '/page.md')
}

export default function Layout(props) {
  const path = propStr(props, 'filePath', 'README.md')
  const hideToolbar = propOr(props, 'hideToolbar', false)
  const onUp = propOr(props, 'onUp', null)
  const onHome = propOr(props, 'onHome', null)
  const children = props.children
  const upHref = parentHref(path)
  const shareLive = isClientLivePhase(4) === true

  if (hideToolbar === true) {
    return (
      <div className="pt-layout pt-layout-home" id="layout">
        <div className="pt-article-body">{children}</div>
      </div>
    )
  }

  return (
    <div className="pt-layout" id="layout">
      <div className="pt-article-toolbar">
        <span className="pt-muted">File:</span>
        <span className="pt-article-path">{path}</span>
        {onUp ? (
          <button type="button" className="pt-btn" onClick={onUp}>
            Up
          </button>
        ) : (
          <a className="pt-btn" href={upHref}>
            Up
          </a>
        )}
        {onHome ? (
          <button type="button" className="pt-btn" onClick={onHome}>
            Home
          </button>
        ) : (
          <a className="pt-btn" href={siteHref('/')}>
            Home
          </a>
        )}
        {shareLive ? (
          <button
            type="button"
            className="pt-btn"
            onClick={() => {
              share.openShare()
            }}
          >
            <IconShare />
            Share
          </button>
        ) : (
          <button type="button" className="pt-btn pt-client-only" disabled={true}>
            <IconShare />
            Share
          </button>
        )}
      </div>
      <div className="pt-article-body">{children}</div>
    </div>
  )
}

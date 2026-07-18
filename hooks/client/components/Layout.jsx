/**
 * Repo shell: path label + Up / Home + scrollable content.
 * Prefer href navigation from parent; optional onUp/onHome for same-page state.
 */
import { propOr, propStr } from 'hooks/client/propOr.jsx'

export default function Layout(props) {
  const path = propStr(props, 'filePath', 'README.md')
  const onUp = propOr(props, 'onUp', null)
  const onHome = propOr(props, 'onHome', null)
  const children = props.children

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
          <a className="pt-btn" href="/">
            Up
          </a>
        )}
        {onHome ? (
          <button type="button" className="pt-btn" onClick={onHome}>
            Home
          </button>
        ) : (
          <a className="pt-btn" href="/README.md">
            Home
          </a>
        )}
      </div>
      <div className="pt-article-body">{children}</div>
    </div>
  )
}

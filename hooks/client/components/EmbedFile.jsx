import React from 'react'
import { resolveAssetUrl } from '@relay/path'
import { propStr } from 'hooks/client/propOr.jsx'
import { PT_PAGES_MIRROR } from 'hooks/client/rewriteAssets.jsx'

/**
 * PDF / binary embed — old-site EmbedFile parity.
 * Resolve relative `src` against the article path (same-origin tip).
 */
export default function EmbedFile(props) {
  const srcIn = propStr(props, 'src', '')
  const className = propStr(props, 'className', '')
  const articleRel = propStr(props, 'articleRel', '')
  let mirror = propStr(props, 'mirrorBase', '')
  if (mirror.length === 0) mirror = PT_PAGES_MIRROR
  let children = null
  try {
    if (props && props.children !== null) children = props.children
  } catch (e) {}

  const href = resolveAssetUrl(srcIn, articleRel, mirror)
  let wrapClass = 'pt-embed'
  if (className.length > 0) wrapClass = wrapClass + ' ' + className

  if (href.length === 0) {
    return (
      <div className="pt-embed pt-embed-empty" data-pt-embed="1">
        <p className="pt-muted">Missing embed source.</p>
      </div>
    )
  }

  return (
    <div className={wrapClass} data-pt-embed="1">
      <embed className="pt-embed-frame" src={href} />
      {children !== null ? <div className="pt-embed-caption">{children}</div> : null}
      <a
        className="pt-embed-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

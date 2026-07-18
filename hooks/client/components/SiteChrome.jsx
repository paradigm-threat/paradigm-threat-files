import React from 'react'
import Nav from 'hooks/client/components/Nav.jsx'
import { propStr } from 'hooks/client/propOr.jsx'

export default function SiteChrome(props) {
  const currentPath = propStr(props, 'currentPath', '/')
  const children = props.children
  return (
    <div className="pt-shell">
      <Nav currentPath={currentPath} />
      {children}
      <footer className="pt-footer">
        <p className="pt-muted">
          Thin files corpus on Relay (IPFS stubs in-git; images via{' '}
          <a
            href="https://paradigm-threat-files-69f9dc.gitlab.io/"
            rel="noopener noreferrer"
          >
            GitLab Pages
          </a>
          ). Timeline UI:{' '}
          <a href="https://paradigm-threat-timeline.dfw1.relaygateway.net/" rel="noopener noreferrer">
            paradigm-threat-timeline
          </a>
          . Production:{' '}
          <a href="https://paradigmthreat.net" target="_blank" rel="noopener noreferrer">
            paradigmthreat.net
          </a>
          .
        </p>
      </footer>
    </div>
  )
}

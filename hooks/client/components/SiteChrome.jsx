import React from 'react'
import Nav from 'hooks/client/components/Nav.jsx'
import { propStr } from 'hooks/client/propOr.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'

function FooterLink(props) {
  const href = props.href
  const label = props.label
  const external = props.external === true
  if (external) {
    return (
      <a
        href={href}
        className="pt-footer-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    )
  }
  return (
    <a href={href} className="pt-footer-link">
      {label}
    </a>
  )
}

export default function SiteChrome(props) {
  const currentPath = propStr(props, 'currentPath', '/')
  const children = props.children
  return (
    <div className="pt-shell">
      <Nav currentPath={currentPath} />
      {children}
      <footer className="pt-footer">
        <nav className="pt-footer-nav" aria-label="Site">
          <FooterLink href={siteHref('/search')} label="Search" />
          <FooterLink href={siteHref('/')} label="Home" />
          <FooterLink
            href="https://paradigm-threat-timeline.dfw1.relaygateway.net/"
            label="Timeline"
            external={true}
          />
          <FooterLink href="https://paradigmthreat.net/chat" label="Chat" external={true} />
          <FooterLink
            href="https://paradigmthreat2.substack.com/"
            label="Substack"
            external={true}
          />
          <FooterLink
            href="https://www.bitchute.com/channel/paradigmthreat"
            label="Videos"
            external={true}
          />
          <FooterLink
            href="https://www.patreon.com/c/ahsctimeline"
            label="Donate"
            external={true}
          />
        </nav>
        <p className="pt-muted pt-footer-note">
          Thin files corpus on Relay — markdown in-git; rasters via{' '}
          <a
            href="https://paradigm-threat-files-69f9dc.gitlab.io/"
            rel="noopener noreferrer"
          >
            GitLab Pages
          </a>
          . Production site:{' '}
          <a href="https://paradigmthreat.net" target="_blank" rel="noopener noreferrer">
            paradigmthreat.net
          </a>
          .
        </p>
        <p className="pt-footer-relay">
          <a href="https://relaygateway.net" target="_blank" rel="noopener noreferrer">
            Powered by the Relay Network
          </a>
        </p>
      </footer>
    </div>
  )
}

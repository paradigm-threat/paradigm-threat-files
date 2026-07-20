import React from 'react'
import Nav from 'hooks/client/components/Nav.jsx'
import ImageGalleryOverlay from 'hooks/client/components/ImageGalleryOverlay.jsx'
import ArticleTtsDock from 'hooks/client/components/ArticleTtsDock.jsx'
import { propStr } from 'hooks/client/propOr.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'
import { Link } from '@relay/ui'
import { prop } from '@relay/util'

function FooterLink(props) {
  const href = prop(props, 'href', '#')
  const label = prop(props, 'label', '')
  const external = prop(props, 'external', false) === true
  return (
    <Link href={href} className="pt-footer-link" external={external}>
      {label}
    </Link>
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
          <FooterLink
            href="https://paradigmthreat.net/submit"
            label="Submit"
            external={true}
          />
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
        <p className="pt-footer-actions">
          <a
            href="https://www.patreon.com/c/ahsctimeline"
            target="_blank"
            rel="noopener noreferrer"
            className="pt-footer-accent"
          >
            Support on Patreon
          </a>
          {' · '}
          <a
            href="https://paradigmthreat2.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="pt-footer-accent"
          >
            Substack
          </a>
        </p>
        <p className="pt-footer-relay">
          <a href="https://relaygateway.net" target="_blank" rel="noopener noreferrer">
            Powered by the Relay Network
          </a>
        </p>
      </footer>
      <ImageGalleryOverlay />
      <ArticleTtsDock />
    </div>
  )
}

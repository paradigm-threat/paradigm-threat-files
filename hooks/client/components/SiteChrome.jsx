import React from 'react'
import Nav from 'hooks/client/components/Nav.jsx'
import ImageGalleryOverlay from 'hooks/client/components/ImageGalleryOverlay.jsx'
import ShareOverlay from 'hooks/client/components/ShareOverlay.jsx'
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
          <FooterLink
            href="https://old.paradigmthreat.net/search"
            label="Search"
            external={true}
          />
          <FooterLink
            href="https://old.paradigmthreat.net/submit"
            label="Submit"
            external={true}
          />
          <FooterLink href={siteHref('/')} label="Home" />
          <FooterLink
            href="https://timeline.paradigmthreat.net/"
            label="Timeline"
            external={true}
          />
          <FooterLink href="https://chat.paradigmthreat.net/" label="Chat" external={true} />
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
          Files corpus on Relay — markdown and rasters served from the tip.
          Legacy Next.js archive:{' '}
          <a href="https://old.paradigmthreat.net/" target="_blank" rel="noopener noreferrer">
            old.paradigmthreat.net
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
      <ShareOverlay />
      <ArticleTtsDock />
      {/* TOC classes must ship on every shell — home soft-nav to articles needs lg:pt-toc-lg. */}
      <span
        aria-hidden="true"
        hidden={true}
        className="pt-toc lg:pt-toc-lg pt-toc-empty pt-toc-head pt-toc-title pt-toc-list pt-toc-item pt-toc-link pt-toc-link-active pt-toc-h1 pt-toc-sub pt-toc-nested pt-toc-l1 pt-toc-l2 pt-toc-l3 pt-toc-l4 pt-toc-l5 pt-toc-l6 pt-column-main lg:pt-column-main-lg pt-dir-nav lg:pt-dir-nav-lg pt-dir-head pt-dir-title pt-dir-actions pt-dir-action pt-dir-sep pt-dir-tree pt-dir-node pt-dir-row pt-dir-row-active pt-dir-chevron pt-dir-chevron-open pt-dir-chevron-open-on pt-dir-chevron-closed pt-dir-chevron-closed-off pt-dir-chevron-spacer pt-dir-folder-link pt-dir-folder-name pt-dir-count pt-dir-kids pt-dir-kids-open pt-dir-file pt-dir-file-extra pt-dir-file-active pt-dir-file-icon pt-dir-file-link pt-dir-showall pt-dir-showfewer pt-dir-foot pt-feeling-lucky-dir"
        data-pt-toc-css="true"
        data-pt-dir-css="true"
      />
    </div>
  )
}

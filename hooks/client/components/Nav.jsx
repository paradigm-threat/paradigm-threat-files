import React, { useState } from 'react'
import ThemeToggle from 'hooks/client/components/ThemeToggle.jsx'
import FeelingLucky from 'hooks/client/components/FeelingLucky.jsx'
import {
  IconBook,
  IconClock,
  IconClose,
  IconHeart,
  IconHome,
  IconMenu,
  IconMessage,
  IconRss,
  IconSearch,
  IconVideo,
} from 'hooks/client/components/Icons.jsx'
import { propOr, propStr } from 'hooks/client/propOr.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'

const WORDMARK_URL = 'https://paradigmthreat.net/site/header.png'
const MARK_URL = 'https://paradigmthreat.net/site/favicon.svg'

function NavLink(props) {
  const href = propStr(props, 'href', '#')
  const label = propStr(props, 'label', '')
  const icon = propOr(props, 'icon', null)
  const active = propOr(props, 'active', false)
  const external = propOr(props, 'external', false)
  const className = active ? 'pt-nav-link pt-nav-link-active' : 'pt-nav-link'
  if (external === true) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {icon}
        <span>{label}</span>
      </a>
    )
  }
  return (
    <a href={href} className={className}>
      {icon}
      <span>{label}</span>
    </a>
  )
}

function renderNavLinks(links, prefix) {
  let out = []
  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    let active = false
    try {
      if (link.active === true) active = true
    } catch (e) {}
    let external = false
    try {
      if (link.external === true) external = true
    } catch (e) {}
    out = out.concat([
      <NavLink
        key={prefix + i}
        href={link.href}
        label={link.label}
        icon={link.icon}
        active={active}
        external={external}
      />,
    ])
  }
  return out
}

export default function Nav(props) {
  const currentPath = propStr(props, 'currentPath', '/')
  const menu = useState(false)
  const isOpen = menu[0]
  const setOpen = menu[1]

  function isActive(href) {
    if (href === '/') {
      return (
        currentPath === '/' ||
        currentPath === '/index.md' ||
        currentPath === '/page.md'
      )
    }
    if (href === '/search') return currentPath === '/search'
    if (href === '/articles') {
      return currentPath === '/articles' || currentPath === '/README.md'
    }
    return currentPath === href
  }

  // Match live footer/nav order; Donate stays in actions (Patreon).
  const navLinks = [
    { href: siteHref('/search'), label: 'Search', icon: <IconSearch />, active: isActive('/search') },
    {
      href: 'https://paradigmthreat.net/submit',
      label: 'Submit',
      icon: <IconBook />,
      external: true,
    },
    { href: siteHref('/'), label: 'Home', icon: <IconHome />, active: isActive('/') },
    {
      href: 'https://paradigm-threat-timeline.dfw1.relaygateway.net/',
      label: 'Timeline',
      icon: <IconClock />,
      external: true,
    },
    {
      href: 'https://paradigmthreat.net/chat',
      label: 'Chat',
      icon: <IconMessage />,
      external: true,
    },
    {
      href: 'https://paradigmthreat2.substack.com/',
      label: 'Substack',
      icon: <IconRss />,
      external: true,
    },
    {
      href: 'https://www.bitchute.com/channel/paradigmthreat',
      label: 'Videos',
      icon: <IconVideo />,
      external: true,
    },
    {
      href: 'https://www.patreon.com/c/ahsctimeline',
      label: 'Donate',
      icon: <IconHeart />,
      external: true,
    },
  ]

  return (
    <header className="pt-site-nav" data-site-navbar="true">
      <div className="pt-nav-inner">
        <div className="pt-nav-brand-row">
          <a href={siteHref('/')} className="pt-brand pt-brand-link">
            <picture>
              <source media="(max-width: 350px)" srcSet={MARK_URL} />
              <img
                src={WORDMARK_URL}
                alt="Paradigm Threat"
                className="pt-brand-img"
              />
            </picture>
            <span className="pt-brand-fallback">Paradigm Threat</span>
          </a>
          <nav className="pt-nav-desktop lg:pt-nav-desktop-lg">
            {renderNavLinks(navLinks, 'nav-d-')}
          </nav>
        </div>
        <div className="pt-nav-actions">
          <div className="pt-nav-actions-desktop lg:pt-nav-actions-desktop-lg">
            <FeelingLucky />
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="pt-icon-btn pt-nav-menu-btn lg:pt-nav-menu-btn-lg"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setOpen(!isOpen)
            }}
          >
            {isOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      {isOpen ? (
        <div className="pt-nav-mobile lg:pt-nav-mobile-lg">
          <div className="pt-nav-mobile-tools">
            <span className="pt-nav-mobile-label">Display</span>
            <ThemeToggle />
          </div>
          <div className="pt-nav-mobile-tools">
            <FeelingLucky />
          </div>
          <nav className="pt-nav-mobile-links">
            {renderNavLinks(navLinks, 'nav-m-')}
          </nav>
        </div>
      ) : null}
    </header>
  )
}

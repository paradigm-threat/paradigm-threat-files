import React, { useState } from 'react'
import ThemeToggle from 'hooks/client/components/ThemeToggle.jsx'
import FontToggle from 'hooks/client/components/FontToggle.jsx'
import FeelingLucky from 'hooks/client/components/FeelingLucky.jsx'
import {
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
const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Libre+Franklin:ital,wght@0,400;0,600;1,400&display=swap'

/** Glass + article font stacks (themed-styler cannot express backdrop-filter / data-font).
 * Prefer <link rel="stylesheet"> in Nav over @import inside <style> (blocks paint). */
function navChromeCss() {
  return (
    '.pt-site-nav{-webkit-backdrop-filter:saturate(180%) blur(12px);backdrop-filter:saturate(180%) blur(12px);}' +
    '.pt-article-body{font-family:"EB Garamond",Georgia,serif;font-size:1.125rem;line-height:1.65;}' +
    'html[data-font="franklin"] .pt-article-body{font-family:"Libre Franklin",system-ui,sans-serif;font-size:1.05rem;}' +
    'html[data-font="mono"] .pt-article-body{font-family:"JetBrains Mono","Courier New",monospace;font-size:0.95rem;}'
  )
}

function NavLink(props) {
  const href = propStr(props, 'href', '#')
  const label = propStr(props, 'label', '')
  const icon = propOr(props, 'icon', null)
  const active = propOr(props, 'active', false)
  const external = propOr(props, 'external', false)
  const mobile = propOr(props, 'mobile', false)
  let className = active ? 'pt-nav-link pt-nav-link-active' : 'pt-nav-link'
  if (mobile === true) {
    className = className + ' pt-nav-link-mobile'
  }
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

function renderNavLinks(links, prefix, mobile) {
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
        mobile={mobile}
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
    return currentPath === href
  }

  // Live site navbar order (Submit lives in footer only).
  const navLinks = [
    { href: siteHref('/search'), label: 'Search', icon: <IconSearch />, active: isActive('/search') },
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
      <link rel="stylesheet" href={FONT_STYLESHEET} />
      <style>{navChromeCss()}</style>
      <div className="pt-nav-bar">
        <div className="pt-nav-inner md:pt-nav-inner-md">
          <div className="pt-nav-brand-row">
            <a href={siteHref('/')} className="pt-brand pt-brand-link">
              <picture>
                <source media="(max-width: 350px)" srcSet={MARK_URL} />
                <img
                  src={WORDMARK_URL}
                  alt="Paradigm Threat"
                  className="pt-brand-img md:pt-brand-img-md"
                />
              </picture>
              <span className="pt-brand-fallback">Paradigm Threat</span>
            </a>
            <nav className="pt-nav-desktop lg:pt-nav-desktop-lg" aria-label="Primary">
              {renderNavLinks(navLinks, 'nav-d-', false)}
            </nav>
          </div>
          <div className="pt-nav-actions">
            <div className="pt-nav-actions-desktop lg:pt-nav-actions-desktop-lg">
              <FontToggle />
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="pt-icon-btn pt-nav-menu-btn lg:pt-nav-menu-btn-lg"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen ? 'true' : 'false'}
              onClick={() => {
                setOpen(!isOpen)
              }}
            >
              {isOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>
      {isOpen ? (
        <div className="pt-nav-mobile lg:pt-nav-mobile-lg" role="dialog" aria-label="Mobile menu">
          <div className="pt-nav-mobile-inner">
            <div className="pt-nav-mobile-tools">
              <span className="pt-nav-mobile-label">Display</span>
              <div className="pt-nav-mobile-tool-row">
                <FontToggle />
                <ThemeToggle />
              </div>
            </div>
            <nav className="pt-nav-mobile-links" aria-label="Mobile primary">
              {renderNavLinks(navLinks, 'nav-m-', true)}
            </nav>
            <div className="pt-nav-mobile-dir">
              <div className="pt-nav-mobile-label">Directory</div>
              <FeelingLucky />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

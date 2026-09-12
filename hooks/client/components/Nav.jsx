import React, { useState, useEffect } from 'react'
import { isClientLive } from '@clevertree/style-internal'
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

const WORDMARK_URL = '/site/header.png'
const MARK_URL = '/site/favicon.svg'
const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Libre+Franklin:ital,wght@0,400;0,600;1,400&display=swap'

/** Glass + article font stacks + chrome toggles that must not use CleverScript setState.
 * (themed-styler cannot express backdrop-filter / data-font / dual-sheet icon swap.)
 * Tip light/dark rules must mirror css_for_web_system: base → prefers-color-scheme →
 * html.dark → html.light. Prefer <link rel="stylesheet"> in Nav over @import inside
 * <style> (blocks paint). Inactive-until-hydrated: host sets html[data-pt-hydrated];
 * .pt-client-only greys out (theme/font/hamburger). Primary <a> links must stay
 * clickable in SSR — below lg the desktop nav is display:none and the menu button
 * is disabled, so force-show the link row until hydrated. :disabled / aria-disabled
 * cover pre-host tips. */
function navChromeCss() {
  return (
    '.pt-site-nav{position:fixed!important;top:0;left:0;right:0;z-index:100;' +
    '-webkit-backdrop-filter:saturate(180%) blur(12px);backdrop-filter:saturate(180%) blur(12px);}' +
    '.pt-shell{padding-top:7.5rem;box-sizing:border-box;}' +
    '.pt-article-body{font-family:"EB Garamond",Georgia,serif;font-size:1.125rem;line-height:1.65;}' +
    'html[data-font="franklin"] .pt-article-body{font-family:"Libre Franklin",system-ui,sans-serif;font-size:1.05rem;}' +
    'html[data-font="mono"] .pt-article-body{font-family:"JetBrains Mono","Courier New",monospace;font-size:0.95rem;}' +
    '.pt-font-toggle{font-family:"EB Garamond",Georgia,serif;}' +
    'html[data-font="franklin"] .pt-font-toggle{font-family:"Libre Franklin",system-ui,sans-serif;}' +
    'html[data-font="mono"] .pt-font-toggle{font-family:"JetBrains Mono","Courier New",monospace;}' +
    // Dual-sheet triad (match css_for_web_system): base light → prefers-color-scheme
    // dark → html.dark force → html.light force. Do not rely on html.dark alone.
    '.pt-theme-icon-sun{display:none;}' +
    '.pt-theme-icon-moon{display:inline-flex;}' +
    '@media (prefers-color-scheme: dark){' +
    '.pt-theme-icon-sun{display:inline-flex;}' +
    '.pt-theme-icon-moon{display:none;}' +
    '}' +
    'html.dark .pt-theme-icon-sun{display:inline-flex;}' +
    'html.dark .pt-theme-icon-moon{display:none;}' +
    'html.light .pt-theme-icon-sun{display:none;}' +
    'html.light .pt-theme-icon-moon{display:inline-flex;}' +
    'html[data-pt-hydrated="0"] .pt-client-only,' +
    '.pt-client-only:disabled,' +
    '.pt-client-only[aria-disabled="true"]{' +
    'opacity:0.45;filter:grayscale(0.35);pointer-events:none;cursor:wait;' +
    '}' +
    // Pre-hydrate: hamburger is JS-only + disabled; unhide the real <a> row on all widths.
    'html[data-pt-hydrated="0"] .pt-nav-desktop{' +
    'display:flex!important;flex-wrap:wrap;align-items:center;gap:0.15rem;' +
    '}' +
    'html[data-pt-hydrated="0"] .pt-nav-menu-btn{display:none!important;}' +
    'html[data-pt-hydrated="0"] .pt-nav-brand-row{flex-wrap:wrap;}' +
    'html[data-pt-hydrated="0"] .pt-nav-link{padding:0.35rem 0.55rem;font-size:0.8125rem;}' +
    'html[data-pt-hydrated="0"] [data-pt-dirnav-ssr],' +
    'html[data-pt-hydrated="0"] [data-pt-changelog-ssr],' +
    'html[data-pt-hydrated="0"] [data-pt-autoindex-ssr]{' +
    'opacity:0.55;filter:grayscale(0.2);' +
    '}' +
    // Theme class collectors reuse layout classes; force them out of hit-testing.
    '[data-pt-gallery-css],[data-pt-toc-css],[data-pt-md-css],[data-pt-tts-css],[data-pt-back-top-css]{' +
    'display:none!important;pointer-events:none!important;position:static!important;' +
    'width:0!important;height:0!important;overflow:hidden!important;margin:0!important;' +
    'padding:0!important;border:0!important;' +
    '}' +
    // Legacy archive banner (mirrors Vercel migration strip) — same dual-sheet triad.
    '.pt-legacy-banner{display:block;width:100%;box-sizing:border-box;' +
    'border-top:1px solid rgba(180,83,9,0.25);background:#fef3c7;color:#78350f;' +
    'padding:0.5rem 1rem;text-align:center;font-size:0.875rem;font-weight:500;' +
    'text-decoration:none;transition:background-color 0.15s ease;}' +
    '.pt-legacy-banner:hover{background:#fde68a;}' +
    '@media (prefers-color-scheme: dark){' +
    '.pt-legacy-banner{border-top-color:rgba(251,191,36,0.2);' +
    'background:rgba(69,26,3,0.8);color:#fffbeb;}' +
    '.pt-legacy-banner:hover{background:rgba(120,53,15,0.9);}' +
    '}' +
    'html.dark .pt-legacy-banner{border-top-color:rgba(251,191,36,0.2);' +
    'background:rgba(69,26,3,0.8);color:#fffbeb;}' +
    'html.dark .pt-legacy-banner:hover{background:rgba(120,53,15,0.9);}' +
    'html.light .pt-legacy-banner{border-top-color:rgba(180,83,9,0.25);' +
    'background:#fef3c7;color:#78350f;}' +
    'html.light .pt-legacy-banner:hover{background:#fde68a;}' +
    '.pt-legacy-banner-inner{display:inline-flex;flex-wrap:wrap;align-items:center;' +
    'justify-content:center;gap:0.35rem 0.4rem;}' +
    '.pt-legacy-banner-link{text-decoration:underline;text-underline-offset:2px;}'
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
  const live = isClientLive() === true
  const menu = useState(false)
  const isOpen = menu[0]
  const setOpen = menu[1]

  // Tip fallback: host/runtime sets data-pt-hydrated; assert "1" once live (no setState).
  useEffect(() => {
    try {
      if (!document || !document.documentElement) return
      document.documentElement.setAttribute('data-pt-hydrated', live ? '1' : '0')
    } catch (e) {}
  }, [live])

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
      href: 'https://timeline.paradigmthreat.net/',
      label: 'Timeline',
      icon: <IconClock />,
      external: true,
    },
    {
      href: 'https://chat.paradigmthreat.net/',
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
                  width={1146}
                  height={163}
                  style={{ width: '200px', maxWidth: '100%', height: 'auto', aspectRatio: '1146 / 163' }}
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
              className="pt-icon-btn pt-nav-menu-btn pt-client-only lg:pt-nav-menu-btn-lg"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen ? 'true' : 'false'}
              disabled={!live}
              onClick={() => {
                if (!live) return
                setOpen(!isOpen)
              }}
            >
              {isOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>
      <a
        href="https://old.paradigmthreat.net/"
        className="pt-legacy-banner"
        data-relay-legacy-banner="1"
      >
        <span className="pt-legacy-banner-inner">
          <span>Legacy Next.js site (timeline, chat, submit) — archive at</span>
          <span className="pt-legacy-banner-link" aria-hidden="true">
            old.paradigmthreat.net →
          </span>
        </span>
      </a>
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

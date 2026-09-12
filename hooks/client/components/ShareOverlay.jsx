import React, { useState, useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { RadioTabs } from '@relay/ui'
import { share } from 'hooks/client/shareStore.jsx'
import { siteHref } from 'hooks/client/loadArticles.jsx'
import { encodeShareQuery } from 'hooks/client/shareCompose.js'
import { IconClose } from 'hooks/client/components/Icons.jsx'

function str(v) {
  if (typeof v === 'string') {
    return v
  }
  return ''
}

function tabCss() {
  return (
    '.pt-share .pt-relay-tabs{display:flex;flex-direction:column;min-height:0;flex:1;}' +
    '.pt-share .pt-relay-tabs-toolbar{display:flex;flex-wrap:wrap;gap:0.35rem;flex-shrink:0;padding:0 1rem 0.5rem;}' +
    '.pt-share .pt-relay-tabs-tab{padding:0.4rem 0.75rem;font-size:0.8125rem;font-weight:600;' +
    'border-width:1px;border-style:solid;border-color:inherit;border-radius:9999px;cursor:pointer;user-select:none;}' +
    '.pt-share .pt-relay-tabs-panel{min-height:0;overflow:auto;padding:0 1rem 1rem;}' +
    '.pt-share .pt-relay-tabs:has(#pt-share-main-copy:checked) .pt-relay-tabs-tab-copy,' +
    '.pt-share .pt-relay-tabs:has(#pt-share-main-links:checked) .pt-relay-tabs-tab-links,' +
    '.pt-share .pt-relay-tabs:has(#pt-share-main-files:checked) .pt-relay-tabs-tab-files,' +
    '.pt-share .pt-relay-tabs:has(#pt-share-fmt-ig:checked) .pt-relay-tabs-tab-ig,' +
    '.pt-share .pt-relay-tabs:has(#pt-share-fmt-x:checked) .pt-relay-tabs-tab-x,' +
    '.pt-share .pt-relay-tabs:has(#pt-share-fmt-fb:checked) .pt-relay-tabs-tab-fb,' +
    '.pt-share .pt-relay-tabs:has(#pt-share-fmt-link:checked) .pt-relay-tabs-tab-link{' +
    'font-weight:700;border-color:currentColor;}' +
    '.pt-share-copy-btn[data-pt-copied="1"] .pt-share-copy-idle{display:none;}' +
    '.pt-share-copy-btn .pt-share-copy-done{display:none;}' +
    '.pt-share-copy-btn[data-pt-copied="1"] .pt-share-copy-done{display:inline;}'
  )
}

function copyToClipboard(text) {
  const value = str(text)
  if (value.length === 0) {
    return
  }
  try {
    const n = globalThis.navigator
    if (n && n.clipboard && typeof n.clipboard.writeText === 'function') {
      n.clipboard.writeText(value)
      return
    }
  } catch (e) {}
  try {
    const ta = document.createElement('textarea')
    ta.value = value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  } catch (e2) {}
}

function markCopied(sel) {
  try {
    const btn = document.querySelector(sel)
    if (btn) {
      btn.setAttribute('data-pt-copied', '1')
    }
    const g = globalThis
    if (g && typeof g.setTimeout === 'function') {
      g.setTimeout(() => {
        try {
          const b = document.querySelector(sel)
          if (b) {
            b.setAttribute('data-pt-copied', '0')
          }
        } catch (e) {}
      }, 1600)
    }
  } catch (e2) {}
}

function activeCopyText() {
  let id = 'ig'
  try {
    const radios = document.querySelectorAll('input[name="pt-share-fmt"]')
    const n = radios.length
    for (let i = 0; i < n; i++) {
      const r = radios[i]
      if (r && r.checked === true) {
        const rid = r.getAttribute('id')
        const prefix = 'pt-share-fmt-'
        if (typeof rid === 'string' && rid.indexOf(prefix) === 0) {
          id = rid.slice(prefix.length)
        }
      }
    }
  } catch (e) {}
  try {
    const box = document.querySelector('[data-pt-share-box="' + id + '"]')
    if (box && typeof box.value === 'string') {
      return box.value
    }
  } catch (e2) {}
  return ''
}

function downloadMarkdown(filename, text) {
  const name = str(filename)
  const body = str(text)
  if (body.length === 0) {
    return
  }
  try {
    const href = 'data:text/markdown;charset=utf-8,' + encodeShareQuery(body)
    const a = document.createElement('a')
    a.setAttribute('href', href)
    a.setAttribute('download', name.length > 0 ? name : 'article.md')
    a.click()
  } catch (e) {}
}

function nativeShare(title, text, url) {
  try {
    const n = globalThis.navigator
    if (!n || typeof n.share !== 'function') {
      return false
    }
    n.share({ title: title, text: text, url: url })
    return true
  } catch (e) {
    return false
  }
}

function CopyBox(props) {
  const id = propStrSafe(props, 'id', 'ig')
  const text = propStrSafe(props, 'text', '')
  const hint = propStrSafe(props, 'hint', '')
  return (
    <div className="pt-share-copy-wrap">
      <textarea className="pt-share-text" data-pt-share-box={id} rows="8">{text}</textarea>
      {hint.length > 0 ? <p className="pt-muted pt-share-hint">{hint}</p> : null}
    </div>
  )
}

function propStrSafe(props, key, fallback) {
  try {
    const v = props[key]
    if (typeof v === 'string') {
      return v
    }
  } catch (e) {}
  return fallback
}

function ShareLink(props) {
  const href = propStrSafe(props, 'href', '#')
  const label = propStrSafe(props, 'label', '')
  return (
    <a
      className="pt-share-chip"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  )
}

/** Article share dialog — CSS radios for tabs (no setState per tab). */
export default function ShareOverlay() {
  const live = isClientLivePhase(4) === true
  const tick = useState(0)
  const setTick = tick[1]
  const rev = tick[0]

  useEffect(() => {
    if (!live) {
      return
    }
    return share.shareSubscribe((r) => {
      setTick(typeof r === 'number' ? r : share.shareRev())
    })
  }, [live])

  let open = false
  let payload = null
  if (live) {
    try {
      open = share.shareIsOpen()
      payload = share.sharePayload()
    } catch (e) {
      open = false
      payload = null
    }
  }

  useEffect(() => {
    if (!live || !open) {
      return
    }
    const onKey = (e) => {
      let key = ''
      try {
        if (e && typeof e.key === 'string') {
          key = e.key
        }
      } catch (err) {}
      if (key === 'Escape') {
        share.closeShare()
      }
    }
    try {
      if (document && document.addEventListener) {
        document.addEventListener('keydown', onKey)
        return () => {
          try {
            document.removeEventListener('keydown', onKey)
          } catch (e2) {}
        }
      }
    } catch (e) {}
  }, [live, open, rev])

  useEffect(() => {
    if (!live || !open) {
      return
    }
    let prev = ''
    try {
      if (document && document.body && document.body.style) {
        prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
          try {
            document.body.style.overflow = prev
          } catch (e) {}
        }
      }
    } catch (e2) {}
  }, [live, open, rev])

  const marker = (
    <div
      className="pt-share pt-share-backdrop pt-share-panel pt-share-head pt-share-title pt-share-body pt-share-text pt-share-hint pt-share-copy-wrap pt-share-actions pt-share-copy-btn pt-share-copy-idle pt-share-copy-done pt-share-grid pt-share-chip pt-share-file pt-share-file-label pt-share-preview pt-share-pane pt-share-close pt-relay-tabs pt-relay-tabs-toolbar pt-relay-tabs-tab pt-relay-tabs-panel pt-relay-tabs-radio"
      hidden={true}
      aria-hidden="true"
      data-pt-share-css="true"
    />
  )

  if (!live || !open || !payload) {
    return marker
  }

  const copies = payload.copies
  const links = payload.links
  const ig = str(copies && copies.instagram)
  const xText = str(copies && copies.x)
  const fb = str(copies && copies.facebook)
  const linkText = str(copies && copies.link)
  const url = str(payload.url)
  const title = str(payload.title)
  const mdRel = str(payload.mdRel)
  const mdName = str(payload.mdName)
  const mdSource = str(payload.mdSource)
  const imageSrc = str(payload.imageSrc)

  let canNative = false
  try {
    const n = globalThis.navigator
    if (n && typeof n.share === 'function') {
      canNative = true
    }
  } catch (e) {}

  const copyPanel = (
    <div className="pt-share-pane">
      <RadioTabs
        name="pt-share-fmt"
        tabs={[
          { id: 'ig', label: 'Instagram' },
          { id: 'x', label: 'X' },
          { id: 'fb', label: 'Facebook' },
          { id: 'link', label: 'Link' },
        ]}
        panels={[
          <CopyBox id="ig" text={ig} hint={ig.length + ' / 2200'} />,
          <CopyBox id="x" text={xText} hint={xText.length + ' chars'} />,
          <CopyBox id="fb" text={fb} hint={fb.length + ' / 8192'} />,
          <CopyBox id="link" text={linkText} hint="Title + URL" />,
        ]}
      />
      <div className="pt-share-actions">
        <button
          type="button"
          className="pt-btn pt-btn-primary pt-share-copy-btn"
          data-pt-share-copy-btn="1"
          data-pt-copied="0"
          onClick={() => {
            copyToClipboard(activeCopyText())
            markCopied('[data-pt-share-copy-btn]')
          }}
        >
          <span className="pt-share-copy-idle">Copy to clipboard</span>
          <span className="pt-share-copy-done">Copied</span>
        </button>
      </div>
    </div>
  )

  const linksPanel = (
    <div className="pt-share-pane">
      <p className="pt-muted pt-share-hint">{url}</p>
      <div className="pt-share-actions">
        {canNative ? (
          <button
            type="button"
            className="pt-btn pt-btn-primary"
            onClick={() => {
              nativeShare(title, ig, url)
            }}
          >
            System share
          </button>
        ) : null}
        <button
          type="button"
          className="pt-btn pt-share-copy-btn"
          data-pt-share-link-btn="1"
          data-pt-copied="0"
          onClick={() => {
            copyToClipboard(url)
            markCopied('[data-pt-share-link-btn]')
          }}
        >
          <span className="pt-share-copy-idle">Copy link</span>
          <span className="pt-share-copy-done">Copied</span>
        </button>
      </div>
      <div className="pt-share-grid">
        <ShareLink href={links.x} label="Open X" />
        <ShareLink href={links.facebook} label="Facebook" />
        <ShareLink href={links.linkedin} label="LinkedIn" />
        <ShareLink href={links.reddit} label="Reddit" />
        <ShareLink href={links.bluesky} label="Bluesky" />
        <ShareLink href={links.threads} label="Threads" />
        <ShareLink href={links.instagram} label="Instagram" />
        <ShareLink href={links.substack} label="Substack Notes" />
      </div>
      <p className="pt-muted pt-share-hint">
        Copy a caption in the Copy tab, then paste into the app. Instagram and Substack do not
        accept prefilled web captions.
      </p>
    </div>
  )

  let filesImage = null
  if (imageSrc.length > 0) {
    filesImage = (
      <div className="pt-share-file">
        <p className="pt-share-file-label">Article image</p>
        <img src={imageSrc} alt="" className="pt-share-preview" />
        <a
          className="pt-btn"
          href={imageSrc}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open image
        </a>
      </div>
    )
  }

  const filesPanel = (
    <div className="pt-share-pane">
      <div className="pt-share-file">
        <p className="pt-share-file-label">Markdown source</p>
        <p className="pt-muted pt-share-hint">{mdRel}</p>
        <button
          type="button"
          className="pt-btn pt-btn-primary"
          onClick={() => {
            downloadMarkdown(mdName, mdSource)
          }}
        >
          Download markdown
        </button>
        <a
          className="pt-btn"
          href={siteHref('/' + mdRel)}
          download={mdName}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open markdown
        </a>
      </div>
      {filesImage}
    </div>
  )

  return (
    <div className="pt-share" data-pt-share="1">
      <style>{tabCss()}</style>
      <button
        type="button"
        className="pt-share-backdrop"
        aria-label="Close share"
        onClick={() => {
          share.closeShare()
        }}
      />
      <div
        className="pt-share-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pt-share-title"
      >
        <div className="pt-share-head">
          <h2 id="pt-share-title" className="pt-share-title">
            Share
          </h2>
          <button
            type="button"
            className="pt-share-close"
            aria-label="Close share"
            onClick={() => {
              share.closeShare()
            }}
          >
            <IconClose />
          </button>
        </div>
        <div className="pt-share-body">
          <RadioTabs
            name="pt-share-main"
            tabs={[
              { id: 'copy', label: 'Copy' },
              { id: 'links', label: 'Links' },
              { id: 'files', label: 'Files' },
            ]}
            panels={[copyPanel, linksPanel, filesPanel]}
          />
        </div>
      </div>
    </div>
  )
}

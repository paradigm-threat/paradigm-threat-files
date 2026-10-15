/**
 * Fill soft-kept [data-pt-flashback-ssr] from Flashback index.json.
 * DOM-only (createElement) — CleverScript cannot parse HTML strings with nested quotes.
 */

const INDEX_URL = 'https://flashbackrepository.org/index.json'
const ORIGIN = 'https://flashbackrepository.org'
const STYLE_ID = 'pt-flashback-now-host-css'

let fillStarted = false

function titleFromSlug(slug) {
  const s = typeof slug === 'string' ? slug : ''
  if (s.length === 0) return 'Untitled'
  const parts = s.split('-')
  let out = []
  for (let i = 0; i < parts.length; i++) {
    const w = parts[i]
    if (w.length === 0) continue
    out = out.concat([w.charAt(0).toUpperCase() + w.slice(1)])
  }
  return out.join(' ')
}

function ensureCss() {
  try {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent =
      '.pt-flashback-now{margin:1.25rem 0 1.75rem;padding:1rem 1.1rem;border-radius:0.5rem;' +
      'border:1px solid #e2e8f0;background:#ffffff;box-sizing:border-box;}' +
      '.pt-flashback-now-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;' +
      'gap:0.5rem 1rem;margin:0 0 0.75rem;}' +
      '.pt-flashback-now-title{margin:0;font-size:1.05rem;font-weight:700;}' +
      '.pt-flashback-now-more{font-size:0.875rem;font-weight:600;}' +
      '.pt-flashback-now-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.35rem;}' +
      '.pt-flashback-now-item{margin:0;font-size:0.95rem;line-height:1.4;}' +
      '.pt-flashback-now-item a{text-decoration:underline;text-underline-offset:2px;}' +
      '.pt-flashback-now-status{margin:0;font-size:0.875rem;}' +
      '@media (prefers-color-scheme: dark){.pt-flashback-now{border-color:#1e293b;background:#020817;}}' +
      'html.dark .pt-flashback-now{border-color:#1e293b;background:#020817;}' +
      'html.light .pt-flashback-now{border-color:#e2e8f0;background:#ffffff;}'
    const head = document.head || document.documentElement
    if (head !== null && head !== undefined) head.appendChild(st)
  } catch (e) {}
}

function makeLink(href, text, className) {
  const a = document.createElement('a')
  if (className !== null && className !== undefined && className.length > 0) {
    a.className = className
  }
  a.href = href
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  a.textContent = text
  return a
}

function paint(el, items, failed) {
  if (el === null || el === undefined) return
  ensureCss()
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
  const head = document.createElement('div')
  head.className = 'pt-flashback-now-head'
  const h3 = document.createElement('h3')
  h3.className = 'pt-flashback-now-title'
  h3.textContent = 'Now showing'
  head.appendChild(h3)
  head.appendChild(makeLink(ORIGIN + '/', 'Flashback Repository', 'pt-flashback-now-more'))
  el.appendChild(head)

  if (failed === true) {
    const p = document.createElement('p')
    p.className = 'pt-muted pt-flashback-now-status'
    p.appendChild(document.createTextNode('Could not load the live list. '))
    p.appendChild(makeLink(ORIGIN + '/', 'Open Flashback Repository', ''))
    p.appendChild(document.createTextNode('.'))
    el.appendChild(p)
  } else if (items === null || items === undefined || items.length === 0) {
    const p = document.createElement('p')
    p.className = 'pt-muted pt-flashback-now-status'
    p.appendChild(document.createTextNode('Nothing listed as Now showing right now. Browse the '))
    p.appendChild(makeLink(ORIGIN + '/', 'full library', ''))
    p.appendChild(document.createTextNode('.'))
    el.appendChild(p)
  } else {
    const ul = document.createElement('ul')
    ul.className = 'pt-flashback-now-list'
    ul.setAttribute('aria-label', 'Now showing titles')
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      const li = document.createElement('li')
      li.className = 'pt-flashback-now-item'
      li.appendChild(makeLink(it.href, it.title, ''))
      ul.appendChild(li)
    }
    el.appendChild(ul)
  }
  el.removeAttribute('data-pt-flashback-ssr')
  el.setAttribute('data-pt-flashback-filled', '1')
}

export function ensureFlashbackNowShowing() {
  try {
    if (typeof document === 'undefined') return
    if (typeof fetch !== 'function') return
    const found = document.querySelectorAll('[data-pt-flashback-ssr]')
    if (found === null || found === undefined || found.length === 0) return
    let nodes = []
    for (let n = 0; n < found.length; n++) {
      const node = found[n]
      if (node.getAttribute('data-pt-flashback-filled') === '1') continue
      nodes = nodes.concat([node])
    }
    if (nodes.length === 0) return
    if (fillStarted === true) return
    fillStarted = true
    fetch(INDEX_URL, { cache: 'default' })
      .then((res) => {
        if (!res || res.ok !== true) return null
        return res.json()
      })
      .then((json) => {
        fillStarted = false
        if (json === null || json === undefined) {
          for (let i = 0; i < nodes.length; i++) {
            paint(nodes[i], [], true)
          }
          return
        }
        const slugs = json && Array.isArray(json.nowShowing) ? json.nowShowing : []
        const projects = json && Array.isArray(json.projects) ? json.projects : []
        const bySlug = {}
        for (let i = 0; i < projects.length; i++) {
          const p = projects[i]
          if (p && typeof p.slug === 'string') bySlug[p.slug] = p
        }
        let items = []
        for (let i = 0; i < slugs.length; i++) {
          const slug = slugs[i]
          if (typeof slug !== 'string' || slug.length === 0) continue
          const p = bySlug[slug]
          let title = titleFromSlug(slug)
          if (p && typeof p.title === 'string' && p.title.length > 0) title = p.title
          items = items.concat([
            { slug: slug, title: title, href: ORIGIN + '/' + slug },
          ])
        }
        for (let i = 0; i < nodes.length; i++) {
          paint(nodes[i], items, false)
        }
      })
      .catch(() => {
        fillStarted = false
        for (let i = 0; i < nodes.length; i++) {
          paint(nodes[i], [], true)
        }
      })
  } catch (e) {
    fillStarted = false
  }
}

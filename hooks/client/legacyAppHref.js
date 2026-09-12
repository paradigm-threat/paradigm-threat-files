/**
 * Apex park does not host Next-only app shells. Rewrite those hrefs so
 * markdown and in-park clicks land on the archive or the live Relay apps.
 *
 * old.paradigmthreat.net: /submit /mcp /api/mcp /reply /search/{topic} /chat/{channel}
 * timeline.paradigmthreat.net: /timeline…
 * chat.paradigmthreat.net: /chat (join)
 * Bare /search stays on park.
 */
const ARCHIVE = 'https://old.paradigmthreat.net'
const TIMELINE = 'https://timeline.paradigmthreat.net'
const CHAT = 'https://chat.paradigmthreat.net'
const APEX = 'https://paradigmthreat.net'
const APEX_WWW = 'https://www.paradigmthreat.net'

function stripApex(href) {
  if (href === APEX || href === APEX + '/') return '/'
  if (href.indexOf(APEX + '/') === 0) return href.slice(APEX.length)
  if (href === APEX_WWW || href === APEX_WWW + '/') return '/'
  if (href.indexOf(APEX_WWW + '/') === 0) return href.slice(APEX_WWW.length)
  return href
}

function pathBase(path) {
  let end = path.length
  const q = path.indexOf('?')
  const hash = path.indexOf('#')
  if (q >= 0 && q < end) end = q
  if (hash >= 0 && hash < end) end = hash
  return path.slice(0, end)
}

export function rewriteLegacyAppHref(href) {
  if (typeof href !== 'string' || href.length === 0) return href
  if (href.indexOf(ARCHIVE) === 0) return href
  if (href.indexOf(TIMELINE) === 0) return href
  if (href.indexOf(CHAT) === 0) return href

  const isApex =
    href === APEX ||
    href === APEX + '/' ||
    href.indexOf(APEX + '/') === 0 ||
    href === APEX_WWW ||
    href === APEX_WWW + '/' ||
    href.indexOf(APEX_WWW + '/') === 0
  const isRoot = href.charAt(0) === '/' && href.indexOf('//') !== 0
  if (!isApex && !isRoot) return href

  const path = isApex ? stripApex(href) : href
  const base = pathBase(path)
  const rest = path.slice(base.length)

  if (base === '/submit' || base.indexOf('/submit/') === 0) return ARCHIVE + path
  if (base === '/mcp' || base.indexOf('/mcp/') === 0) return ARCHIVE + path
  if (base === '/api/mcp' || base.indexOf('/api/mcp/') === 0) return ARCHIVE + path
  if (base === '/reply' || base.indexOf('/reply/') === 0) return ARCHIVE + path
  if (base.indexOf('/search/') === 0) return ARCHIVE + path
  if (base === '/chat') {
    if (rest.length === 0) return CHAT + '/'
    return CHAT + '/' + rest
  }
  if (base.indexOf('/chat/') === 0) return ARCHIVE + path
  if (base === '/timeline' || base.indexOf('/timeline/') === 0) return TIMELINE + path
  return href
}

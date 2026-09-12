/**
 * Park share copy — CS-safe (no regex). Mirrors Next compose order without AI rewrite.
 * Title → snippet → article → URL → hashtags. Format limits: Instagram 2200, Facebook 8192, X short.
 */

const IG_MAX = 2200
const FB_MAX = 8192
const IG_TAG_MAX = 5
const APEX = 'https://paradigmthreat.net'

function str(v) {
  if (typeof v === 'string') {
    return v
  }
  return ''
}

function trimStr(v) {
  return str(v).trim()
}

function endsWithFold(s, suffix) {
  const lower = s.toLowerCase()
  const suf = suffix.toLowerCase()
  if (lower.length < suf.length) {
    return false
  }
  return lower.slice(lower.length - suf.length) === suf
}

function startsWithStr(s, prefix) {
  if (s.indexOf(prefix) === 0) {
    return true
  }
  return false
}

export function prettyArticlePath(filePath) {
  let p = trimStr(filePath)
  if (p.length === 0) {
    return '/'
  }
  if (p.charAt(0) !== '/') {
    p = '/' + p
  }
  if (p.length > 1 && p.charAt(p.length - 1) === '/') {
    p = p.slice(0, p.length - 1)
  }
  if (endsWithFold(p, '.mdx')) {
    p = p.slice(0, p.length - 4)
  } else if (endsWithFold(p, '.md')) {
    p = p.slice(0, p.length - 3)
  }
  if (p === '/page' || p === '/index' || p.length === 0) {
    return '/'
  }
  return p
}

export function mdRelPath(filePath) {
  let p = trimStr(filePath)
  while (p.length > 0 && p.charAt(0) === '/') {
    p = p.slice(1)
  }
  if (p.length === 0 || p === 'page.md' || p === 'index.md') {
    return 'page.md'
  }
  if (endsWithFold(p, '.md') || endsWithFold(p, '.mdx')) {
    return p
  }
  return p + '.md'
}

export function mdDownloadFilename(rel) {
  const path = mdRelPath(rel)
  let last = 0
  for (let i = 0; i < path.length; i++) {
    if (path.charAt(i) === '/') {
      last = i + 1
    }
  }
  const base = path.slice(last)
  if (base.length === 0) {
    return 'article.md'
  }
  return base
}

export function pageOrigin() {
  try {
    const g = globalThis
    if (g && g.location && typeof g.location.origin === 'string') {
      const o = g.location.origin
      if (o.length > 0 && o.indexOf('http') === 0) {
        return o
      }
    }
  } catch (e) {}
  return APEX
}

export function canonicalArticleUrl(filePath, origin) {
  const pretty = prettyArticlePath(filePath)
  let base = trimStr(origin)
  if (base.length === 0) {
    base = pageOrigin()
  }
  if (base.charAt(base.length - 1) === '/') {
    base = base.slice(0, base.length - 1)
  }
  if (pretty === '/') {
    return base + '/'
  }
  return base + pretty
}

function isTagChar(c) {
  if (c >= 'a' && c <= 'z') {
    return true
  }
  if (c >= 'A' && c <= 'Z') {
    return true
  }
  if (c >= '0' && c <= '9') {
    return true
  }
  if (c === '_') {
    return true
  }
  return false
}

function collectHashtags(line) {
  let out = []
  let i = 0
  const s = str(line)
  while (i < s.length) {
    if (s.charAt(i) === '#') {
      let j = i + 1
      while (j < s.length) {
        if (!isTagChar(s.charAt(j))) {
          break
        }
        j = j + 1
      }
      if (j > i + 1) {
        out = out.concat([s.slice(i, j)])
      }
      i = j
    } else {
      i = i + 1
    }
  }
  return out
}

function uniqueTags(list) {
  let seen = ''
  let out = []
  for (let i = 0; i < list.length; i++) {
    const t = list[i]
    const key = t.toLowerCase() + ' '
    if (seen.indexOf(key) >= 0) {
      continue
    }
    seen = seen + key
    out = out.concat([t])
  }
  return out
}

function limitTags(line, max) {
  const tags = collectHashtags(line)
  const uniq = uniqueTags(tags)
  if (uniq.length === 0) {
    return ''
  }
  if (max <= 0 || uniq.length <= max) {
    return uniq.join(' ')
  }
  let kept = []
  for (let i = 0; i < max; i++) {
    kept = kept.concat([uniq[i]])
  }
  return kept.join(' ')
}

function dropLastTag(line) {
  const tags = collectHashtags(line)
  if (tags.length <= 1) {
    return ''
  }
  let kept = []
  for (let i = 0; i < tags.length - 1; i++) {
    kept = kept.concat([tags[i]])
  }
  return kept.join(' ')
}

function stripYamlFrontmatter(md) {
  const s = str(md)
  if (!startsWithStr(s, '---')) {
    return s
  }
  const nl = s.indexOf('\n')
  if (nl < 0) {
    return s
  }
  const rest = s.slice(nl + 1)
  const end = rest.indexOf('\n---')
  if (end < 0) {
    return s
  }
  let after = rest.slice(end + 4)
  if (startsWithStr(after, '\n')) {
    after = after.slice(1)
  }
  return after
}

function stripLeadingH1(md) {
  const s = str(md)
  if (!startsWithStr(s, '# ')) {
    return s
  }
  const nl = s.indexOf('\n')
  if (nl < 0) {
    return ''
  }
  let rest = s.slice(nl + 1)
  while (startsWithStr(rest, '\n')) {
    rest = rest.slice(1)
  }
  return rest
}

function stripInlineMd(text) {
  let s = str(text)
  s = s.replaceAll('**', '')
  s = s.replaceAll('`', '')
  let out = ''
  let i = 0
  while (i < s.length) {
    const c = s.charAt(i)
    if (c === '[') {
      const close = s.indexOf('](', i)
      if (close > i) {
        const end = s.indexOf(')', close + 2)
        if (end > close) {
          out = out + s.slice(i + 1, close)
          i = end + 1
          continue
        }
      }
    }
    out = out + c
    i = i + 1
  }
  return out.replaceAll('  ', ' ').trim()
}

function isWs(c) {
  if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
    return true
  }
  return false
}

function collapseWs(text) {
  const s = str(text)
  let out = ''
  let prevWs = false
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (isWs(c)) {
      if (!prevWs) {
        out = out + ' '
      }
      prevWs = true
    } else {
      out = out + c
      prevWs = false
    }
  }
  return out.trim()
}

function stripQuotePrefix(line) {
  let t = line.trim()
  if (startsWithStr(t, '>')) {
    t = t.slice(1)
    if (startsWithStr(t, ' ')) {
      t = t.slice(1)
    }
  }
  return t
}

function extractTldr(md) {
  const lines = str(md).split('\n')
  let start = 0 - 1
  for (let i = 0; i < lines.length; i++) {
    const inner = stripQuotePrefix(lines[i])
    const plain = inner.replaceAll('**', '')
    if (startsWithStr(plain, 'TL;DR:') || startsWithStr(plain, 'TL;DR')) {
      start = i
      break
    }
  }
  if (start < 0) {
    return ''
  }
  let block = ''
  for (let i = start; i < lines.length; i++) {
    const raw = lines[i].trim()
    if (!startsWithStr(raw, '>')) {
      if (block.length > 0) {
        break
      }
      continue
    }
    let inner = stripQuotePrefix(raw).replaceAll('**', '')
    if (i === start) {
      if (startsWithStr(inner, 'TL;DR:')) {
        inner = inner.slice(6).trim()
      } else if (startsWithStr(inner, 'TL;DR')) {
        inner = inner.slice(5).trim()
        if (startsWithStr(inner, ':')) {
          inner = inner.slice(1).trim()
        }
      }
    }
    if (block.length > 0) {
      block = block + ' '
    }
    block = block + inner
  }
  return collapseWs(stripInlineMd(block))
}

function extractFirstParagraph(md) {
  const body = stripLeadingH1(stripYamlFrontmatter(md))
  const lines = body.split('\n')
  let buf = ''
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t.length === 0) {
      if (buf.length > 0) {
        break
      }
      continue
    }
    if (startsWithStr(t, '---')) {
      continue
    }
    if (startsWithStr(t, '![')) {
      continue
    }
    if (startsWithStr(t, '#')) {
      continue
    }
    const inner = stripQuotePrefix(t).replaceAll('**', '')
    if (inner.indexOf('TL;DR') >= 0) {
      continue
    }
    if (buf.length > 0) {
      buf = buf + ' '
    }
    buf = buf + t
  }
  return collapseWs(stripInlineMd(buf))
}

function extractKeywords(md) {
  const lines = str(md).split('\n')
  let fromLine = ''
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].replaceAll('**', '').trim()
    const key = 'Keywords:'
    if (startsWithStr(line, key)) {
      fromLine = line.slice(key.length)
      break
    }
  }
  let fromSection = ''
  for (let i = lines.length - 1; i >= 0; i--) {
    const header = lines[i].replaceAll('**', '').trim()
    let h = header
    while (startsWithStr(h, '#')) {
      h = h.slice(1)
    }
    h = h.trim()
    if (h === 'Keywords') {
      for (let j = i + 1; j < lines.length; j++) {
        const t = lines[j].trim()
        if (t.length === 0) {
          continue
        }
        if (startsWithStr(t, '#')) {
          break
        }
        if (t === '---') {
          break
        }
        fromSection = fromSection + ' ' + t
      }
      break
    }
  }
  const tags = uniqueTags(collectHashtags(fromLine + ' ' + fromSection))
  return tags.join(' ')
}

function extractSubstackUrl(md) {
  const s = str(md)
  const lower = s.toLowerCase()
  const needle = 'substack.com/p/'
  const at = lower.indexOf(needle)
  if (at < 0) {
    return ''
  }
  let start = at
  while (start > 0) {
    const c = s.charAt(start - 1)
    if (c === ' ' || c === '\n' || c === '\t' || c === '(' || c === '[' || c === '>') {
      break
    }
    start = start - 1
  }
  let end = at + needle.length
  while (end < s.length) {
    const c = s.charAt(end)
    if (isTagChar(c) || c === '-' || c === '_') {
      end = end + 1
      continue
    }
    break
  }
  const url = s.slice(start, end)
  if (url.indexOf('http') === 0) {
    return url
  }
  return ''
}

function removeKeywordsFooter(md) {
  const lines = str(md).split('\n')
  let end = lines.length
  while (end > 0) {
    const t = lines[end - 1].replaceAll('**', '').trim()
    if (t.length === 0 || t === '---' || startsWithStr(t, 'Keywords:')) {
      end = end - 1
      continue
    }
    break
  }
  let out = ''
  for (let i = 0; i < end; i++) {
    if (i > 0) {
      out = out + '\n'
    }
    out = out + lines[i]
  }
  return out.trim()
}

function markdownToPlainSource(md) {
  let s = removeKeywordsFooter(stripLeadingH1(stripYamlFrontmatter(md)))
  const lines = s.split('\n')
  let out = []
  let skipTldr = false
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const t = raw.trim()
    if (startsWithStr(t, '>')) {
      const inner = stripQuotePrefix(t).replaceAll('**', '')
      if (inner.indexOf('TL;DR') >= 0) {
        skipTldr = true
      }
      if (skipTldr) {
        continue
      }
    } else {
      skipTldr = false
    }
    if (startsWithStr(t, '#')) {
      continue
    }
    if (startsWithStr(t, '![')) {
      continue
    }
    if (startsWithStr(t, '```')) {
      continue
    }
    out = out.concat([raw])
  }
  let joined = out.join('\n')
  joined = stripInlineMd(joined)
  return joined.replaceAll('\n\n\n', '\n\n').trim()
}

export function extractFirstImageUrl(md) {
  const s = str(md)
  const bang = s.indexOf('![')
  if (bang < 0) {
    return ''
  }
  const mid = s.indexOf('](', bang)
  if (mid < 0) {
    return ''
  }
  const end = s.indexOf(')', mid + 2)
  if (end < 0) {
    return ''
  }
  let src = s.slice(mid + 2, end).trim()
  const sp = src.indexOf(' ')
  if (sp > 0) {
    src = src.slice(0, sp)
  }
  if (startsWithStr(src, '<') && endsWithFold(src, '>')) {
    src = src.slice(1, src.length - 1)
  }
  const q = src.indexOf('?')
  if (q > 0) {
    src = src.slice(0, q)
  }
  return src
}

export function appendShareWidth(src) {
  let s = trimStr(src)
  if (s.length === 0) {
    return ''
  }
  if (s.indexOf('?') >= 0) {
    return s
  }
  let ext = ''
  let i = s.length - 1
  while (i >= 0) {
    const c = s.charAt(i)
    if (c === '.') {
      ext = s.slice(i + 1).toLowerCase()
      break
    }
    if (c === '/') {
      break
    }
    i = i - 1
  }
  if (ext === 'svg' || ext === 'gif' || ext.length === 0) {
    return s
  }
  return s + '?w=800'
}

function stripSnippetPrefix(snippet, article) {
  const s = collapseWs(snippet)
  const a = trimStr(article)
  if (s.length === 0 || a.length === 0) {
    return a
  }
  const na = collapseWs(a)
  if (startsWithStr(na, s)) {
    return na.slice(s.length).trim()
  }
  return a
}

function joinShareParts(title, snippet, article, url, tags) {
  let parts = []
  const ti = trimStr(title)
  if (ti.length > 0) {
    parts = parts.concat([ti])
  }
  const sn = trimStr(snippet)
  if (sn.length > 0) {
    parts = parts.concat(['', sn])
  }
  const art = stripSnippetPrefix(sn, article)
  if (art.length > 0) {
    parts = parts.concat(['', art])
  }
  const u = trimStr(url)
  if (u.length > 0) {
    parts = parts.concat(['', u])
  }
  const tg = trimStr(tags)
  if (tg.length > 0) {
    parts = parts.concat(['', tg])
  }
  return parts.join('\n').trim()
}

function fitToLimit(title, snippet, article, url, tags, max) {
  let ti = trimStr(title)
  let sn = trimStr(snippet)
  let art = trimStr(article)
  let tg = trimStr(tags)
  const u = trimStr(url)
  let guard = 0
  let text = joinShareParts(ti, sn, art, u, tg)
  while (text.length > max && guard < 200) {
    guard = guard + 1
    if (art.length > 80) {
      art = art.slice(0, art.length - 80).trim() + '…'
    } else if (art.length > 0) {
      art = ''
    } else if (sn.length > 20) {
      sn = sn.slice(0, Math.floor(sn.length * 0.65)).trim() + '…'
    } else if (sn.length > 0) {
      sn = ''
    } else if (tg.length > 0) {
      tg = dropLastTag(tg)
    } else if (ti.length > 12) {
      ti = ti.slice(0, ti.length - 8).trim() + '…'
    } else {
      break
    }
    text = joinShareParts(ti, sn, art, u, tg)
  }
  return text
}

export function extractShareMetadata(rawMarkdown) {
  const md = str(rawMarkdown)
  const tldr = extractTldr(md)
  const first = extractFirstParagraph(md)
  let snippet = tldr
  if (snippet.length === 0) {
    snippet = first
  }
  const tags = extractKeywords(md)
  const body = collapseWs(markdownToPlainSource(md))
  const paras = markdownToPlainSource(md)
  const substack = extractSubstackUrl(md)
  return {
    snippetPlain: snippet,
    hashtagsLine: tags,
    articleBodyPlain: body,
    articleBodyParagraphsPlain: paras,
    substackUrl: substack,
  }
}

export function composeShareCopies(input) {
  const title = trimStr(input && input.title)
  const url = trimStr(input && input.canonicalUrl)
  const snippet = trimStr(input && input.snippetPlain)
  const body = trimStr(input && input.articleBodyPlain)
  const paras = trimStr(input && input.articleBodyParagraphsPlain)
  const tags = trimStr(input && input.hashtagsLine)
  const igTags = limitTags(tags, IG_TAG_MAX)
  const ig = fitToLimit(title, snippet, body, url, igTags, IG_MAX)
  const fbBody = paras.length > 0 ? paras : body
  const fb = fitToLimit(title, snippet, fbBody, url, tags, FB_MAX)
  const x = joinShareParts(title, '', '', url, tags)
  const link = joinShareParts(title, '', '', url, '')
  return {
    instagram: ig,
    x: x,
    facebook: fb,
    link: link,
  }
}

/** Percent-encode query values without charCodeAt / encodeURIComponent. */
export function encodeShareQuery(raw) {
  const s = str(raw)
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (c === ' ') {
      out = out + '%20'
    } else if (c === '\n') {
      out = out + '%0A'
    } else if (c === '\r') {
      out = out + '%0D'
    } else if (c === '%') {
      out = out + '%25'
    } else if (c === '#') {
      out = out + '%23'
    } else if (c === '&') {
      out = out + '%26'
    } else if (c === '+') {
      out = out + '%2B'
    } else if (c === '=') {
      out = out + '%3D'
    } else if (c === '?') {
      out = out + '%3F'
    } else if (c === '"') {
      out = out + '%22'
    } else if (c === "'") {
      out = out + '%27'
    } else if (c === ':') {
      out = out + '%3A'
    } else if (c === '/') {
      out = out + '%2F'
    } else if (c === ',') {
      out = out + '%2C'
    } else {
      out = out + c
    }
  }
  return out
}

export function shareOutboundLinks(url, title, xText) {
  const u = encodeShareQuery(url)
  const t = encodeShareQuery(title)
  const x = encodeShareQuery(xText)
  return {
    x: 'https://twitter.com/intent/tweet?text=' + x,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
    reddit: 'https://www.reddit.com/submit?url=' + u + '&title=' + t,
    bluesky: 'https://bsky.app/intent/compose?text=' + x,
    threads: 'https://www.threads.net/intent/post?text=' + x,
    instagram: 'https://www.instagram.com/',
    substack: 'https://substack.com/notes',
  }
}

export function headingTitle(idQueue) {
  if (!idQueue || typeof idQueue.length !== 'number') {
    return ''
  }
  if (idQueue.length === 0) {
    return ''
  }
  try {
    const t = idQueue[0].title
    if (typeof t === 'string' && t.length > 0) {
      return t
    }
  } catch (e) {}
  return ''
}

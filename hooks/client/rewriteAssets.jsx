/**
 * Thin tip: rasters are IPFS stubs; `?w=` optimize 500s when Kubo is down.
 * Emit HTML <img> with GitLab Pages src via template replace (no host+path +).
 */

function replaceAllLiteral(text, needle, replacement) {
  if (!text || !needle || needle.length === 0) return text
  let out = ''
  let pos = 0
  const fl = needle.length
  while (pos < text.length) {
    const idx = text.indexOf(needle, pos)
    if (idx < 0) {
      out = out + text.slice(pos)
      break
    }
    out = out + text.slice(pos, idx)
    out = out + replacement
    pos = idx + fl
  }
  return out
}

function isRasterPath(path) {
  if (!path || typeof path !== 'string') return false
  let p = path
  const q = p.indexOf('?')
  if (q >= 0) p = p.slice(0, q)
  const lower = p.toLowerCase()
  const dot = lower.lastIndexOf('.')
  if (dot < 0) return false
  const ext = lower.slice(dot)
  if (ext === '.jpg' || ext === '.jpeg') return true
  if (ext === '.png' || ext === '.gif' || ext === '.webp') return true
  return false
}

function stripQuery(path) {
  const q = path.indexOf('?')
  if (q >= 0) return path.slice(0, q)
  return path
}

function escapeAttr(s) {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (c === '&') out = out + '&amp;'
    else if (c === '"') out = out + '&quot;'
    else if (c === '<') out = out + '&lt;'
    else if (c === '>') out = out + '&gt;'
    else if (c === '\n' || c === '\r') out = out + ' '
    else out = out + c
  }
  return out
}

function classFromTitle(title) {
  if (!title || typeof title !== 'string') return ''
  const key = '"className"'
  const at = title.indexOf(key)
  if (at < 0) return ''
  let i = at + key.length
  while (i < title.length && (title.charAt(i) === ' ' || title.charAt(i) === ':' || title.charAt(i) === '"')) {
    i = i + 1
  }
  let cls = ''
  while (i < title.length) {
    const c = title.charAt(i)
    if (c === '"') break
    cls = cls + c
    i = i + 1
  }
  return cls.trim()
}

function findMdImageClose(md, startAt) {
  return md.indexOf('](/', startAt)
}

function imgTagFor(rel, alt, title) {
  let tag =
    '<img src="https://paradigm-threat-files-69f9dc.gitlab.io/__REL__" alt="__ALT__"'
  const cls = classFromTitle(title)
  if (cls.length > 0) {
    tag = tag + ' class="__CLS__"'
  }
  tag = tag + ' />'
  tag = replaceAllLiteral(tag, '__REL__', rel)
  tag = replaceAllLiteral(tag, '__ALT__', escapeAttr(alt))
  if (cls.length > 0) {
    tag = replaceAllLiteral(tag, '__CLS__', escapeAttr(cls))
  }
  return tag
}

/**
 * Convert corpus markdown images to HTML img pointing at GitLab Pages.
 */
export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let out = ''
  let pos = 0
  while (pos < md.length) {
    const bang = md.indexOf('![', pos)
    if (bang < 0) {
      out = out + md.slice(pos)
      break
    }
    out = out + md.slice(pos, bang)
    const altOpen = bang + 2
    const altClose = findMdImageClose(md, altOpen)
    if (altClose < 0 || altClose < altOpen) {
      out = out + '!['
      pos = altOpen
      continue
    }
    const alt = md.slice(altOpen, altClose)
    let j = altClose + 2
    let url = ''
    while (j < md.length) {
      const c = md.charAt(j)
      if (c === ')' || c === ' ' || c === '\n' || c === '\t') break
      url = url + c
      j++
    }
    let title = ''
    if (j < md.length && md.charAt(j) === ' ') {
      j = j + 1
      while (j < md.length && md.charAt(j) !== ')') {
        title = title + md.charAt(j)
        j++
      }
    }
    if (j < md.length && md.charAt(j) === ')') j = j + 1

    let rel = url
    while (rel.length > 0 && rel.charAt(0) === '/') {
      rel = rel.slice(1)
    }
    rel = stripQuery(rel)
    if (rel.length > 0 && isRasterPath(rel)) {
      out = out + imgTagFor(rel, alt, title)
      pos = j
    } else {
      out = out + md.slice(bang, j)
      pos = j
    }
  }
  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return out
}

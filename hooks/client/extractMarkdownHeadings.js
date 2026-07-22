/**
 * TOC heading extract — prefer Rust @relay/catalog when fleet WASM is new enough;
 * fall back to local ATX walk so older hosts keep working.
 */
import { extractMarkdownHeadings as hostExtract } from '@relay/catalog'
import { slugify, uniqueId } from '@relay/util'

const MAX_TOC = 80

function str(v) {
  if (v === null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return '' + v
  return ''
}

function trimEndSpaces(s) {
  let end = s.length
  while (end > 0) {
    const c = s.charAt(end - 1)
    if (c !== ' ' && c !== '\t') {
      break
    }
    end = end - 1
  }
  return s.slice(0, end)
}

function trimStartSpaces(s) {
  let i = 0
  while (i < s.length) {
    const c = s.charAt(i)
    if (c !== ' ' && c !== '\t') {
      break
    }
    i = i + 1
  }
  return s.slice(i)
}

function skipIndent(line) {
  let i = 0
  while (i < line.length && i < 3 && line.charAt(i) === ' ') {
    i = i + 1
  }
  return i
}

function fenceMarkerAt(line, start) {
  if (start >= line.length) {
    return { ch: '', count: 0 }
  }
  const ch = line.charAt(start)
  if (ch !== '`' && ch !== '~') {
    return { ch: '', count: 0 }
  }
  let count = 0
  let i = start
  while (i < line.length && line.charAt(i) === ch) {
    count = count + 1
    i = i + 1
  }
  if (count < 3) {
    return { ch: '', count: 0 }
  }
  return { ch: ch, count: count }
}

function isFenceOpen(line) {
  const start = skipIndent(line)
  const m = fenceMarkerAt(line, start)
  return m.count >= 3
}

function closesFence(line, openCh, openCount) {
  const start = skipIndent(line)
  const m = fenceMarkerAt(line, start)
  if (m.ch !== openCh) {
    return false
  }
  if (m.count < openCount) {
    return false
  }
  let i = start + m.count
  while (i < line.length) {
    const c = line.charAt(i)
    if (c !== ' ' && c !== '\t') {
      return false
    }
    i = i + 1
  }
  return true
}

function stripTrailingAtxCloser(title) {
  let t = trimEndSpaces(title)
  let end = t.length
  while (end > 0 && t.charAt(end - 1) === '#') {
    end = end - 1
  }
  if (end < t.length) {
    if (end === 0) {
      return ''
    }
    const prev = t.charAt(end - 1)
    if (prev === ' ' || prev === '\t') {
      t = trimEndSpaces(t.slice(0, end))
    }
  }
  return t
}

function parseAtxHeading(line) {
  const start = skipIndent(line)
  let i = start
  let level = 0
  while (i < line.length && level < 6 && line.charAt(i) === '#') {
    level = level + 1
    i = i + 1
  }
  if (level < 1) {
    return null
  }
  if (i >= line.length) {
    return null
  }
  const after = line.charAt(i)
  if (after !== ' ' && after !== '\t') {
    return null
  }
  while (i < line.length) {
    const c = line.charAt(i)
    if (c !== ' ' && c !== '\t') {
      break
    }
    i = i + 1
  }
  let title = stripTrailingAtxCloser(line.slice(i))
  title = trimStartSpaces(trimEndSpaces(title))
  if (title.length === 0) {
    return null
  }
  return { level: level, title: title }
}

function lineHasTocIgnore(line) {
  if (line.indexOf('data-toc-ignore') >= 0) {
    return true
  }
  if (line.indexOf('no-index') >= 0) {
    return true
  }
  return false
}

function lineLooksLikeHtmlClose(line) {
  const t = trimStartSpaces(line)
  if (t.length < 2) {
    return false
  }
  if (t.charAt(0) !== '<') {
    return false
  }
  if (t.charAt(1) !== '/') {
    return false
  }
  return true
}

function lineLooksLikeHtmlOpenWithIgnore(line) {
  const t = trimStartSpaces(line)
  if (t.length < 2) {
    return false
  }
  if (t.charAt(0) !== '<') {
    return false
  }
  if (t.charAt(1) === '/') {
    return false
  }
  return lineHasTocIgnore(line)
}

function extractMarkdownHeadingsLocal(md) {
  const empty = { tocItems: [], idQueue: [] }
  const text = str(md)
  if (text.length === 0) {
    return empty
  }

  let used = []
  let all = []
  let inFence = false
  let fenceCh = ''
  let fenceCount = 0
  let ignoreDepth = 0

  let lineStart = 0
  let i = 0
  while (i <= text.length) {
    const atEnd = i === text.length
    const isNl = !atEnd && text.charAt(i) === '\n'
    if (!atEnd && !isNl) {
      i = i + 1
      continue
    }

    let lineEnd = i
    if (lineEnd > lineStart && text.charAt(lineEnd - 1) === '\r') {
      lineEnd = lineEnd - 1
    }
    const line = text.slice(lineStart, lineEnd)

    if (inFence) {
      if (closesFence(line, fenceCh, fenceCount)) {
        inFence = false
        fenceCh = ''
        fenceCount = 0
      }
    } else if (isFenceOpen(line)) {
      const start = skipIndent(line)
      const m = fenceMarkerAt(line, start)
      inFence = true
      fenceCh = m.ch
      fenceCount = m.count
    } else {
      let skipTocRegion = false
      if (ignoreDepth > 0) {
        skipTocRegion = true
        if (lineLooksLikeHtmlClose(line)) {
          ignoreDepth = ignoreDepth - 1
          if (ignoreDepth < 0) {
            ignoreDepth = 0
          }
        }
      } else if (lineLooksLikeHtmlOpenWithIgnore(line)) {
        ignoreDepth = ignoreDepth + 1
        skipTocRegion = true
      }

      const heading = parseAtxHeading(line)
      if (heading !== null) {
        let id = slugify(heading.title)
        id = uniqueId(id, used)
        used = used.concat([id])
        let skipToc = false
        if (skipTocRegion) {
          skipToc = true
        } else if (lineHasTocIgnore(line)) {
          skipToc = true
        }
        all = all.concat([
          {
            id: id,
            title: heading.title,
            level: heading.level,
            skipToc: skipToc,
          },
        ])
      }
    }

    lineStart = i + 1
    i = i + 1
  }

  let tocItems = []
  let startIdx = 0
  if (all.length > 1 && all[0].level === 1) {
    startIdx = 1
  }
  let n = 0
  let j = startIdx
  while (j < all.length && n < MAX_TOC) {
    const entry = all[j]
    j = j + 1
    if (entry.skipToc === true) {
      continue
    }
    tocItems = tocItems.concat([
      {
        id: entry.id,
        title: entry.title,
        level: entry.level,
      },
    ])
    n = n + 1
  }

  let idQueue = []
  for (let k = 0; k < all.length; k++) {
    const e = all[k]
    idQueue = idQueue.concat([
      {
        id: e.id,
        title: e.title,
        level: e.level,
      },
    ])
  }

  return { tocItems: tocItems, idQueue: idQueue }
}

export function extractMarkdownHeadings(md) {
  try {
    if (typeof hostExtract === 'function') {
      const host = hostExtract(md)
      if (host && host.tocItems && host.idQueue) {
        return host
      }
    }
  } catch (e) {}
  return extractMarkdownHeadingsLocal(md)
}

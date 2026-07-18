/**
 * Expand disabled MDX tags into plain markdown before MarkdownRenderer.
 * WASM @clevertree/markdown has no overrides yet (see COMPONENTS_DISABLED.md).
 */

import { loadArticleRows, rowPath, rowTitle } from 'hooks/client/loadArticles.jsx'

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

function attrValue(tag, name) {
  const key = name + '="'
  const i = tag.indexOf(key)
  if (i < 0) return ''
  const start = i + key.length
  const end = tag.indexOf('"', start)
  if (end < 0) return ''
  return tag.slice(start, end)
}

function parentDir(rel) {
  let t = ''
  if (typeof rel === 'string') t = rel
  while (t.length > 0 && t.charAt(0) === '/') {
    t = t.slice(1)
  }
  const slash = t.lastIndexOf('/')
  if (slash < 0) return ''
  return t.slice(0, slash)
}

function buildAutoIndexList(pathProp, sortName, currentRel) {
  let dir = ''
  if (typeof pathProp === 'string') dir = pathProp
  if (dir.length === 0) dir = parentDir(currentRel)
  while (dir.length > 0 && dir.charAt(0) === '/') {
    dir = dir.slice(1)
  }

  const rows = loadArticleRows(200)
  let picked = []
  for (let i = 0; i < rows.length; i++) {
    const p = rowPath(rows[i])
    if (p.length === 0) continue
    if (p === 'page.md' || p === 'README.md') continue
    if (dir.length === 0) {
      picked = picked.concat([rows[i]])
    } else if (p.indexOf(dir + '/') === 0) {
      picked = picked.concat([rows[i]])
    }
  }

  for (let a = 0; a < picked.length; a++) {
    for (let b = a + 1; b < picked.length; b++) {
      const pa = rowPath(picked[a])
      const pb = rowPath(picked[b])
      let swap = false
      if (sortName === 'name-desc') {
        if (pb < pa) swap = true
      } else {
        if (pa > pb) swap = true
      }
      if (swap) {
        const tmp = picked[a]
        picked[a] = picked[b]
        picked[b] = tmp
      }
    }
  }

  const lim = picked.length < 48 ? picked.length : 48
  if (lim === 0) {
    return '\n\n*No indexed articles in this folder.*\n\n'
  }
  let md = '\n\n### Index\n\n'
  for (let j = 0; j < lim; j++) {
    const p = rowPath(picked[j])
    const title = rowTitle(picked[j])
    md = md + '* [' + title + '](/' + p + ')\n'
  }
  return md + '\n'
}

function expandAutoIndexTags(md, currentRel) {
  if (!md || typeof md !== 'string') return ''
  let out = ''
  let pos = 0
  while (pos < md.length) {
    const start = md.indexOf('<AutoIndex', pos)
    if (start < 0) {
      out = out + md.slice(pos)
      break
    }
    out = out + md.slice(pos, start)
    const sc = md.indexOf('/>', start)
    if (sc < 0) {
      out = out + md.slice(start)
      break
    }
    const tag = md.slice(start, sc + 2)
    const pathProp = attrValue(tag, 'path')
    let sortName = attrValue(tag, 'sort')
    if (sortName.length === 0) sortName = 'name-asc'
    out = out + buildAutoIndexList(pathProp, sortName, currentRel)
    pos = sc + 2
  }
  return out
}

export function expandMdComponents(md, currentRel) {
  if (!md || typeof md !== 'string') return ''
  let s = md
  s = replaceAllLiteral(s, '<ChangeLog />', '')
  s = replaceAllLiteral(s, '<ChangeLog/>', '')
  s = replaceAllLiteral(s, '<ChatRoom />', '')
  s = replaceAllLiteral(s, '<ChatRoom/>', '')
  let rel = ''
  if (typeof currentRel === 'string') rel = currentRel
  s = expandAutoIndexTags(s, rel)
  return s
}

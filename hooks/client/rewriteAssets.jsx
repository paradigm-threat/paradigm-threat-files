/**
 * Thin tip: rasters are IPFS stubs and `?w=` optimize 500s when Kubo is down.
 * Convert markdown images to HTML <img> (absolute GitLab Pages src) so md2ast
 * does not re-resolve URLs (absolute `](https://…)` breaks when alt contains `"`).
 */

function assetMirrorBase() {
  return 'https://paradigm-threat-files-69f9dc.gitlab.io'
}

function isRasterPath(path) {
  if (!path || typeof path !== 'string') return false
  let p = path
  const q = p.indexOf('?')
  if (q >= 0) p = p.slice(0, q)
  const hash = p.indexOf('#')
  if (hash >= 0) p = p.slice(0, hash)
  const lower = p.toLowerCase()
  if (lower.length < 5) return false
  const dot = lower.lastIndexOf('.')
  if (dot < 0) return false
  const ext = lower.slice(dot)
  if (ext === '.jpg' || ext === '.jpeg') return true
  if (ext === '.png' || ext === '.gif' || ext === '.webp') return true
  if (ext === '.svg' || ext === '.avif') return true
  return false
}

function stripQuery(path) {
  let p = path
  const q = p.indexOf('?')
  if (q >= 0) p = p.slice(0, q)
  return p
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
  let t = title.trim()
  if (t.length < 2) return ''
  if (t.charAt(0) === "'" || t.charAt(0) === '"') {
    t = t.slice(1)
  }
  if (t.length > 0) {
    const last = t.charAt(t.length - 1)
    if (last === "'" || last === '"') t = t.slice(0, t.length - 1)
  }
  t = t.trim()
  if (t.indexOf('className') < 0) return ''
  const key = '"className"'
  const at = t.indexOf(key)
  if (at < 0) return ''
  let i = at + key.length
  while (i < t.length && (t.charAt(i) === ' ' || t.charAt(i) === ':' || t.charAt(i) === '"')) {
    i = i + 1
  }
  let cls = ''
  while (i < t.length) {
    const c = t.charAt(i)
    if (c === '"') break
    cls = cls + c
    i = i + 1
  }
  return cls.trim()
}

function relFromUrl(url) {
  let path = url
  if (path.indexOf('://') >= 0) {
    const markers = [
      'paradigmthreat.net/',
      'paradigm-threat-files.dfw1.relaygateway.net/',
      'relay.paradigmthreat.net/',
      'paradigm-threat-files-69f9dc.gitlab.io/',
    ]
    let cut = -1
    for (let m = 0; m < markers.length; m++) {
      const at = path.indexOf(markers[m])
      if (at >= 0) {
        cut = at + markers[m].length
        break
      }
    }
    if (cut < 0) return ''
    path = path.slice(cut)
  }
  while (path.length > 0 && path.charAt(0) === '/') {
    path = path.slice(1)
  }
  return stripQuery(path)
}

/**
 * Turn `![alt](raster-url …)` into `<img src="mirror/…" alt="…" class="…">`.
 */
export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let mirror = assetMirrorBase()
  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) mirror = mirrorBase
  while (mirror.length > 0 && mirror.charAt(mirror.length - 1) === '/') {
    mirror = mirror.slice(0, mirror.length - 1)
  }

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
    const altClose = md.indexOf('](', altOpen)
    if (altClose < 0) {
      out = out + md.slice(bang)
      break
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

    const rel = relFromUrl(url)
    if (rel.length > 0 && isRasterPath(rel)) {
      const src = mirror + '/' + rel
      const cls = classFromTitle(title)
      let tag = '<img src="' + src + '" alt="' + escapeAttr(alt) + '"'
      if (cls.length > 0) tag = tag + ' class="' + escapeAttr(cls) + '"'
      tag = tag + ' />'
      out = out + tag
      pos = j
    } else {
      out = out + md.slice(bang, j)
      pos = j
    }
  }
  return out
}

/**
 * Thin tip stores rasters as IPFS stubs. Local Kubo is often down, so article
 * images 500 on `?w=` optimize. Rewrite markdown image URLs to the GitLab Pages
 * binary mirror (same corpus paths) and strip Relay `?w=` width queries.
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

/**
 * Rewrite `](/path.jpg?w=360…)` (and same-site absolute rasters)
 * to the GitLab Pages mirror without width query.
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
    const idx = md.indexOf('](', pos)
    if (idx < 0) {
      out = out + md.slice(pos)
      break
    }
    out = out + md.slice(pos, idx + 2)
    let j = idx + 2
    let url = ''
    while (j < md.length) {
      const c = md.charAt(j)
      if (c === ')' || c === ' ' || c === '\n' || c === '\t' || c === "'") break
      url = url + c
      j++
    }

    let rewritten = url
    let path = url
    if (path.indexOf('://') >= 0) {
      const markers = [
        'paradigmthreat.net/',
        'paradigm-threat-files.dfw1.relaygateway.net/',
        'relay.paradigmthreat.net/',
      ]
      let cut = -1
      for (let m = 0; m < markers.length; m++) {
        const at = path.indexOf(markers[m])
        if (at >= 0) {
          cut = at + markers[m].length
          break
        }
      }
      if (cut >= 0) path = path.slice(cut)
      else path = ''
    } else {
      while (path.length > 0 && path.charAt(0) === '/') {
        path = path.slice(1)
      }
    }

    if (path.length > 0 && isRasterPath(path)) {
      rewritten = mirror + '/' + stripQuery(path)
    }

    out = out + rewritten
    pos = j
  }
  return out
}

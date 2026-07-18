/**
 * Thin tip rasters are IPFS stubs; park Kubo is often down.
 * Retarget markdown *image* URLs only to GitLab Pages (not .md links).
 *
 * CleverScript: only export function / export default; no export const.
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

function endsWithLiteral(s, suffix) {
  if (!s || !suffix) return false
  if (suffix.length > s.length) return false
  return s.slice(s.length - suffix.length) === suffix
}

function pathLooksLikeRaster(pathPart) {
  const p = pathPart || ''
  if (endsWithLiteral(p, '.jpg')) return true
  if (endsWithLiteral(p, '.jpeg')) return true
  if (endsWithLiteral(p, '.png')) return true
  if (endsWithLiteral(p, '.gif')) return true
  if (endsWithLiteral(p, '.webp')) return true
  if (endsWithLiteral(p, '.JPG')) return true
  if (endsWithLiteral(p, '.PNG')) return true
  return false
}

/** md2ast drops/mangles ![alt](https://…) when alt contains double quotes. */
function softenImageAltQuotes(md) {
  if (!md || typeof md !== 'string') return ''
  let out = ''
  let pos = 0
  while (pos < md.length) {
    const start = md.indexOf('![', pos)
    if (start < 0) {
      out = out + md.slice(pos)
      break
    }
    out = out + md.slice(pos, start)
    const mid = md.indexOf('](', start)
    if (mid < 0) {
      out = out + md.slice(start)
      break
    }
    let alt = md.slice(start + 2, mid)
    alt = replaceAllLiteral(alt, '"', "'")
    out = out + '![' + alt + ']('
    pos = mid + 2
  }
  return out
}

/**
 * Rewrite ](/top/…raster) → GitLab Pages; leave ](/top/….md) alone.
 */
function rewriteRasterRoot(s, top) {
  const rootPrefix = '](/' + top + '/'
  const toHost = '](https://paradigm-threat-files-69f9dc.gitlab.io/' + top + '/'
  let out = ''
  let pos = 0
  while (pos < s.length) {
    const idx = s.indexOf(rootPrefix, pos)
    if (idx < 0) {
      out = out + s.slice(pos)
      break
    }
    out = out + s.slice(pos, idx)
    const close = s.indexOf(')', idx)
    if (close < 0) {
      out = out + s.slice(idx)
      break
    }
    const after = s.slice(idx + rootPrefix.length, close)
    let pathOnly = after
    const sp = after.indexOf(' ')
    if (sp >= 0) pathOnly = after.slice(0, sp)
    if (pathLooksLikeRaster(pathOnly)) {
      out = out + toHost + after + ')'
    } else {
      out = out + s.slice(idx, close + 1)
    }
    pos = close + 1
  }
  return out
}

export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = softenImageAltQuotes(md)

  // Exact tip title: space + '{"className":"sm:float-right …"}'
  s = replaceAllLiteral(
    s,
    " '{" + '"className":"' + 'sm:float-right sm:ml-8 sm:mb-4 mb-8 clear-both"' + "}'",
    ''
  )

  s = replaceAllLiteral(s, '.jpg?w=360', '.jpg')
  s = replaceAllLiteral(s, '.jpeg?w=360', '.jpeg')
  s = replaceAllLiteral(s, '.png?w=360', '.png')
  s = replaceAllLiteral(s, '.gif?w=360', '.gif')
  s = replaceAllLiteral(s, '.webp?w=360', '.webp')
  s = replaceAllLiteral(s, '.jpg?w=800', '.jpg')
  s = replaceAllLiteral(s, '.png?w=800', '.png')
  s = replaceAllLiteral(s, '.jpg?w=1200', '.jpg')
  s = replaceAllLiteral(s, '.png?w=1200', '.png')
  s = replaceAllLiteral(s, '.jpg?w=160', '.jpg')
  s = replaceAllLiteral(s, '.png?w=160', '.png')
  s = replaceAllLiteral(s, '.jpg?w=400', '.jpg')
  s = replaceAllLiteral(s, '.png?w=400', '.png')
  s = replaceAllLiteral(s, '.jpg?w=640', '.jpg')
  s = replaceAllLiteral(s, '.png?w=640', '.png')

  s = rewriteRasterRoot(s, 'influence')
  s = rewriteRasterRoot(s, 'history')
  s = rewriteRasterRoot(s, 'cosmos')
  s = rewriteRasterRoot(s, 'governance')
  s = rewriteRasterRoot(s, 'science')
  s = rewriteRasterRoot(s, 'events')
  s = rewriteRasterRoot(s, 'blog')
  s = rewriteRasterRoot(s, 'book')

  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return s
}

/**
 * Thin tip rasters are IPFS stubs; park Kubo is often down.
 * Retarget markdown image URLs to GitLab Pages (binary mirror).
 *
 * CleverScript: only export function / export default; no export const.
 * Prefer literal replaceAll — avoid host+path concat (path corruption risk).
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

export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = softenImageAltQuotes(md)

  // Exact tip title: space + '{"className":"sm:float-right …"}'
  // Build with split strings so the file source stays CleverScript-safe.
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

  s = replaceAllLiteral(
    s,
    '](/influence/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/influence/'
  )
  s = replaceAllLiteral(
    s,
    '](/history/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/history/'
  )
  s = replaceAllLiteral(
    s,
    '](/cosmos/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/cosmos/'
  )
  s = replaceAllLiteral(
    s,
    '](/governance/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/governance/'
  )
  s = replaceAllLiteral(
    s,
    '](/science/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/science/'
  )
  s = replaceAllLiteral(
    s,
    '](/events/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/events/'
  )
  s = replaceAllLiteral(
    s,
    '](/blog/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/blog/'
  )
  s = replaceAllLiteral(
    s,
    '](/book/',
    '](https://paradigm-threat-files-69f9dc.gitlab.io/book/'
  )

  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* call-site compat */
  }
  return s
}

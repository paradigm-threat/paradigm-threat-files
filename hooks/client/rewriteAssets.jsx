/**
 * Thin tip: rasters are IPFS stubs; `?w=` optimize 500s when Kubo is down.
 * Rewrite markdown image/link targets to the GitLab Pages binary mirror via
 * literal replaceAll only (CleverScript string concat was corrupting paths).
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

/**
 * Point corpus rasters at GitLab Pages and strip Relay width queries.
 */
export function rewriteMarkdownAssetUrls(md, mirrorBase) {
  if (!md || typeof md !== 'string') return ''
  let s = md

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
    /* call-site compat; destinations are literals for CleverScript safety */
  }
  return s
}

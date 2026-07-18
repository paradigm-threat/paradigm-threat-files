/**
 * Thin tip: rasters are IPFS stubs; `?w=` optimize 500s when Kubo is down.
 * Rewrite markdown image/link targets to the GitLab Pages binary mirror via
 * literal replaceAll only (CleverScript string concat was corrupting paths).
 */

function replaceAllLiteral(text, from, to) {
  if (!text || !from || from.length === 0) return text
  let out = ''
  let pos = 0
  const fl = from.length
  while (pos < text.length) {
    const idx = text.indexOf(from, pos)
    if (idx < 0) {
      out = out + text.slice(pos)
      break
    }
    out = out + text.slice(pos, idx)
    out = out + to
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

  // Common Relay optimize widths used in this corpus.
  const widths = ['360', '800', '1200', '160', '400', '640', '1024']
  const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']
  for (let ei = 0; ei < exts.length; ei++) {
    for (let wi = 0; wi < widths.length; wi++) {
      const from = '.' + exts[ei] + '?w=' + widths[wi]
      const to = '.' + exts[ei]
      s = replaceAllLiteral(s, from, to)
    }
  }

  // Full destination strings as literals — do not concatenate host + path in CS.
  const pairs = [
    ['](/influence/', '](https://paradigm-threat-files-69f9dc.gitlab.io/influence/'],
    ['](/history/', '](https://paradigm-threat-files-69f9dc.gitlab.io/history/'],
    ['](/cosmos/', '](https://paradigm-threat-files-69f9dc.gitlab.io/cosmos/'],
    ['](/governance/', '](https://paradigm-threat-files-69f9dc.gitlab.io/governance/'],
    ['](/science/', '](https://paradigm-threat-files-69f9dc.gitlab.io/science/'],
    ['](/events/', '](https://paradigm-threat-files-69f9dc.gitlab.io/events/'],
    ['](/blog/', '](https://paradigm-threat-files-69f9dc.gitlab.io/blog/'],
    ['](/book/', '](https://paradigm-threat-files-69f9dc.gitlab.io/book/'],
  ]
  for (let pi = 0; pi < pairs.length; pi++) {
    s = replaceAllLiteral(s, pairs[pi][0], pairs[pi][1])
  }

  // Optional override unused (kept for call-site compat).
  if (typeof mirrorBase === 'string' && mirrorBase.length > 0) {
    /* intentional no-op: destinations are literal for CleverScript safety */
  }
  return s
}

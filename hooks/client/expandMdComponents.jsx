/**
 * Expand disabled MDX tags into plain markdown before MarkdownRenderer.
 * WASM @clevertree/markdown has no overrides yet (see COMPONENTS_DISABLED.md).
 *
 * Debug: AutoIndex expansion temporarily disabled — ChangeLog/ChatRoom strip only —
 * after SSR text corruption (ban→ba)) was observed when expand ran.
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

export function expandMdComponents(md, currentRel) {
  if (!md || typeof md !== 'string') return ''
  let s = md
  s = replaceAllLiteral(s, '<ChangeLog />', '')
  s = replaceAllLiteral(s, '<ChangeLog/>', '')
  s = replaceAllLiteral(s, '<ChatRoom />', '')
  s = replaceAllLiteral(s, '<ChatRoom/>', '')
  // AutoIndex expansion deferred — see COMPONENTS_DISABLED / prior SSR corruption.
  if (typeof currentRel === 'string' && currentRel.length > 0) {
    /* reserved for path-scoped AutoIndex */
  }
  return s
}

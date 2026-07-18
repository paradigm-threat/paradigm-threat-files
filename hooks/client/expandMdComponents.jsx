/**
 * Expand disabled MDX tags into plain markdown before MarkdownRenderer.
 * Currently a pass-through — prior replaceAllLiteral / AutoIndex paths
 * corrupted SSR text (e.g. ban→ba)). DirNav remains the index UI.
 */

export function expandMdComponents(md, currentRel) {
  if (!md || typeof md !== 'string') return ''
  if (typeof currentRel === 'string' && currentRel.length > 0) {
    /* reserved */
  }
  return md
}

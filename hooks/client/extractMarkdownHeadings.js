/**
 * TOC heading extract — host `@relay/catalog` (Rust ATX + fence skip).
 * Empty/invalid host results return empty queues (no tip-local parser).
 */
import { extractMarkdownHeadings as hostExtract } from '@relay/catalog'

const EMPTY = { tocItems: [], idQueue: [] }

export function extractMarkdownHeadings(md) {
  try {
    if (typeof hostExtract === 'function') {
      const host = hostExtract(typeof md === 'string' ? md : '')
      if (host && host.tocItems && host.idQueue) {
        return host
      }
    }
  } catch (e) {}
  return EMPTY
}

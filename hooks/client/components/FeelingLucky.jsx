import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { pickFeelingLuckyPath, siteHref } from 'hooks/client/loadArticles.jsx'

/**
 * Random article from nav-index (files park only).
 * Prefer native navigate() host binding; fall back to <a href>.
 * Phase 2+ (catalog) — same gate as DirNav.
 */
export default function FeelingLucky() {
  const live = isClientLivePhase(2) === true
  const path = pickFeelingLuckyPath()
  const href = path.length > 0 ? siteHref('/' + path) : '#'

  return (
    <a
      className="pt-btn pt-feeling-lucky pt-client-only"
      href={live ? href : '#'}
      title={live ? 'Feeling Lucky' : 'Feeling Lucky available after page loads'}
      aria-disabled={live ? 'false' : 'true'}
      onClick={() => {
        if (!live) return
        const next = pickFeelingLuckyPath()
        if (next.length === 0) return
        const dest = siteHref('/' + next)
        try {
          navigate(dest)
        } catch (e) {
          try {
            const g = globalThis
            if (g && g.location) {
              g.location.href = dest
            }
          } catch (e2) {}
        }
      }}
    >
      Feeling Lucky
    </a>
  )
}

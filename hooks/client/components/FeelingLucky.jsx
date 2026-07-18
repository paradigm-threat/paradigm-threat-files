import React from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { pickFeelingLuckyPath, siteHref } from 'hooks/client/loadArticles.jsx'

/**
 * Random article from nav-index (files park only). Navigate via location.href.
 */
export default function FeelingLucky() {
  const live = isClientLive() === true

  return (
    <button
      type="button"
      className="pt-btn pt-feeling-lucky"
      disabled={!live}
      title={live ? "I'm Feeling Lucky" : 'Available after page loads'}
      onClick={() => {
        if (!live) return
        const path = pickFeelingLuckyPath()
        if (path.length === 0) return
        try {
          const g = globalThis
          if (g && g.location) {
            g.location.href = siteHref('/' + path)
          }
        } catch (e) {}
      }}
    >
      I'm Feeling Lucky
    </button>
  )
}

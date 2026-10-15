/**
 * SSR placeholder for Flashback Now showing.
 * Live list is filled by park-host-common.js (native) into data-pt-flashback-ssr.
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'

export default function FlashbackNowShowing() {
  if (isClientLivePhase(3) === true) {
    return null
  }
  if (isCsrHost()) {
    return null
  }
  return (
    <section
      className="pt-flashback-now"
      aria-label="Flashback now showing"
      data-pt-flashback-ssr="1"
    >
      <p className="pt-muted">Now showing loads after page open…</p>
    </section>
  )
}

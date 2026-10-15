/**
 * SSR shell for Flashback “Now showing”.
 * Live list is filled by hooks/client/native/FlashbackNowShowing.host.js
 * (soft-hydrate does not swap this island the way ChangeLog is swapped).
 */
import React from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { isCsrHost } from 'hooks/client/hostMode.jsx'

const ORIGIN = 'https://flashbackrepository.org'

export default function FlashbackNowShowing() {
  // Phase 3+ CSR: host script owns the DOM; skip duplicate vnode.
  if (isClientLivePhase(3) === true) {
    return null
  }
  if (isCsrHost()) {
    return null
  }
  return (
    <section
      className="pt-flashback-now"
      aria-label="Flashback Repository now showing"
      data-pt-flashback-ssr="1"
    >
      <div className="pt-flashback-now-head">
        <h3 className="pt-flashback-now-title">Now showing</h3>
        <a
          className="pt-flashback-now-more"
          href={ORIGIN + '/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Flashback Repository →
        </a>
      </div>
      <p className="pt-muted pt-flashback-now-status">Loading Now showing…</p>
    </section>
  )
}

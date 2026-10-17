#!/usr/bin/env node
/**
 * Park-local hydrate smoke (Layer 3) — paint contracts CleverScript vnode tests skip.
 *
 * Requires: park-local gateway up on :9080 (./scripts/park-local.sh serve).
 * Uses system Chrome via playwright-core (no browser download).
 *
 * Asserts after hydrate:
 * - no .relay-error-boundary
 * - LiveChat host present
 * - Directory file link wraps (white-space !== nowrap, overflow-wrap anywhere/break-word)
 */
import { chromium } from 'playwright-core'

const HOST = process.env.SSR_SMOKE_HOST || 'relay.paradigmthreat.net'
const PORT = process.env.SSR_SMOKE_PORT || '9080'
const ARTICLE =
  process.env.SSR_SMOKE_ARTICLE ||
  '/influence/predictive_programming/fiction_encoding/hesse/hesse-steppenwolf-jung-ware-refile-investigation.md'
// Navigate by park hostname; Chrome maps it to loopback (Host header stays correct).
const URL = `http://${HOST}:${PORT}${ARTICLE}`
const TIMEOUT_MS = Number(process.env.PARK_HYDRATE_TIMEOUT_MS || 45000)

async function main() {
  // Gateway must be up
  try {
    const cfg = await fetch(`http://127.0.0.1:${PORT}/api/config`, {
      method: 'POST',
      signal: AbortSignal.timeout(2000),
    })
    if (!cfg.ok) throw new Error(`status ${cfg.status}`)
  } catch (e) {
    console.error(
      `FAIL: gateway not up on :${PORT} — run: ~/dev/relay/relay-gateway/scripts/park-local.sh serve`,
    )
    process.exit(1)
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1`],
  })
  const page = await browser.newPage()
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS })

    // Wait for DirNav nodes + LiveChat (ignore hidden CSS-marker spans).
    await page.waitForFunction(
      () => {
        const err = document.querySelector('.relay-error-boundary')
        if (err && (err.textContent || '').indexOf('DirNav') >= 0) {
          return 'error:' + (err.textContent || '').slice(0, 200)
        }
        if (err && (err.textContent || '').indexOf('FolderBranch') >= 0) {
          return 'error:' + (err.textContent || '').slice(0, 200)
        }
        const chat = document.querySelector(
          '.pt-live-chat-slot .fb-live-chat-host, .pt-live-chat-slot .fb-live-chat, .pt-live-chat-slot [data-relay-park-native="fb-live-chat"]',
        )
        const nodes = document.querySelectorAll('[data-pt-dir-node]')
        if (chat && nodes.length > 0) return 'ok'
        return null
      },
      { timeout: TIMEOUT_MS },
    )

    const result = await page.evaluate(() => {
      const err = document.querySelector('.relay-error-boundary')
      const chat = document.querySelector(
        '.fb-live-chat-host, [data-relay-park-native="fb-live-chat"], .fb-live-chat',
      )
      const chatSlot = document.querySelector('.pt-live-chat-slot')
      const link =
        document.querySelector('.pt-dir-file-active .pt-dir-file-link') ||
        document.querySelector('.pt-dir-file-link')
      const cs = link ? getComputedStyle(link) : null
      const folderNames = [...document.querySelectorAll('[data-pt-dir-node] .pt-dir-folder-name')].map(
        (el) => (el.textContent || '').trim(),
      )
      const emptyFolders = folderNames.filter((t) => t.length === 0).length
      const chatBox = chat ? chat.getBoundingClientRect() : null
      return {
        errorBoundary: err ? (err.textContent || '').trim().slice(0, 300) : null,
        hasChat: !!chat,
        hasChatSlot: !!chatSlot,
        chatInSlot: !!(chat && chat.closest && chat.closest('.pt-live-chat-slot')),
        chatHeight: chatBox ? chatBox.height : 0,
        chatChannel: chat && chat.getAttribute('data-channel'),
        folderCount: folderNames.length,
        emptyFolders,
        sampleFolders: folderNames.filter((t) => t.length > 0).slice(0, 6),
        fileLink: link
          ? {
              text: (link.textContent || '').trim().slice(0, 120),
              whiteSpace: cs.whiteSpace,
              overflowWrap: cs.overflowWrap,
              textOverflow: cs.textOverflow,
              truncatedVisually: link.scrollWidth > link.clientWidth + 2,
            }
          : null,
        hydrated: document.documentElement.getAttribute('data-pt-hydrated'),
      }
    })

    if (result.errorBoundary) {
      console.error('FAIL: relay-error-boundary present:', result.errorBoundary)
      process.exit(1)
    }
    if (!result.hasChat) {
      console.error('FAIL: LiveChat host missing after hydrate', result)
      process.exit(1)
    }
    if (!result.hasChatSlot || !result.chatInSlot) {
      console.error('FAIL: LiveChat not inside .pt-live-chat-slot', result)
      process.exit(1)
    }
    if (result.chatHeight < 80) {
      console.error('FAIL: LiveChat panel too short (collapsed line)', result)
      process.exit(1)
    }
    if (result.folderCount > 0 && result.emptyFolders > 0) {
      console.error(
        `FAIL: ${result.emptyFolders}/${result.folderCount} Directory folder labels blank`,
        result.sampleFolders,
      )
      process.exit(1)
    }
    if (!result.fileLink) {
      console.error(
        'WARN: no .pt-dir-file-link yet (DirNav hydrate may still be loading) — chat OK',
      )
    } else {
      const fl = result.fileLink
      if (fl.whiteSpace === 'nowrap') {
        console.error('FAIL: Directory file link white-space is nowrap (truncate regression)', fl)
        process.exit(1)
      }
      const wrapOk =
        fl.overflowWrap === 'anywhere' || fl.overflowWrap === 'break-word'
      if (fl.whiteSpace !== 'normal' && !wrapOk) {
        console.error('FAIL: Directory file link not wrapping', fl)
        process.exit(1)
      }
      if (fl.truncatedVisually && fl.whiteSpace === 'nowrap') {
        console.error('FAIL: Directory file link visually truncated', fl)
        process.exit(1)
      }
      console.log('OK: Directory file link wrap', fl.whiteSpace, fl.overflowWrap)
    }

    console.log(
      `OK: park hydrate smoke — LiveChat present, no error boundary (Host=${HOST} ${URL})`,
    )
  } finally {
    await browser.close()
  }
}

main().catch((e) => {
  console.error('FAIL:', e && e.message ? e.message : e)
  process.exit(1)
})

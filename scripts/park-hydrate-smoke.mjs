#!/usr/bin/env node
/**
 * Park-local hydrate smoke (Layer 3) — paint contracts CleverScript vnode tests skip.
 *
 * Requires: park-local gateway up on :9080 (./scripts/park-local.sh serve).
 * Uses system Chrome via playwright-core (no browser download).
 *
 * Asserts after hydrate:
 * - plain article: no .relay-error-boundary, no shell chat slot, Directory wrap
 * - ChatRoom page: LiveChat host inside .pt-chatroom-live with topic channel
 */
import { chromium } from 'playwright-core'

const HOST = process.env.SSR_SMOKE_HOST || 'relay.paradigmthreat.net'
const PORT = process.env.SSR_SMOKE_PORT || '9080'
const ARTICLE =
  process.env.SSR_SMOKE_ARTICLE ||
  '/influence/predictive_programming/fiction_encoding/hesse/hesse-steppenwolf-jung-ware-refile-investigation.md'
const CHATROOM =
  process.env.SSR_SMOKE_CHATROOM || '/science/nukes/chat_nukes.md'
const TIMEOUT_MS = Number(process.env.PARK_HYDRATE_TIMEOUT_MS || 45000)

function pageUrl(path) {
  return `http://${HOST}:${PORT}${path}`
}

async function main() {
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
    // --- Plain article: Directory hydrate, no auto chat ---
    const articleUrl = pageUrl(ARTICLE)
    await page.goto(articleUrl, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS })

    await page.waitForFunction(
      () => {
        const err = document.querySelector('.relay-error-boundary')
        if (err && (err.textContent || '').indexOf('DirNav') >= 0) {
          return 'error:' + (err.textContent || '').slice(0, 200)
        }
        if (err && (err.textContent || '').indexOf('FolderBranch') >= 0) {
          return 'error:' + (err.textContent || '').slice(0, 200)
        }
        const nodes = document.querySelectorAll('[data-pt-dir-node]')
        if (nodes.length > 0) return 'ok'
        return null
      },
      { timeout: TIMEOUT_MS },
    )

    const plain = await page.evaluate(() => {
      const err = document.querySelector('.relay-error-boundary')
      const slot = document.querySelector('.pt-live-chat-slot')
      // Ignore hidden CSS-marker spans that ship used-class tokens.
      const chatroom = document.querySelector('.pt-chatroom-live:not([hidden])')
      const chat = document.querySelector(
        '[data-relay-park-native="fb-live-chat"], .fb-live-chat:not([hidden])',
      )
      const link =
        document.querySelector('.pt-dir-file-active .pt-dir-file-link') ||
        document.querySelector('.pt-dir-file-link')
      const cs = link ? getComputedStyle(link) : null
      const folderNames = [...document.querySelectorAll('[data-pt-dir-node] .pt-dir-folder-name')].map(
        (el) => (el.textContent || '').trim(),
      )
      const emptyFolders = folderNames.filter((t) => t.length === 0).length
      return {
        errorBoundary: err ? (err.textContent || '').trim().slice(0, 300) : null,
        hasSlot: !!slot,
        hasChatroom: !!chatroom,
        hasChat: !!chat,
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
      }
    })

    if (plain.errorBoundary) {
      console.error('FAIL: relay-error-boundary present:', plain.errorBoundary)
      process.exit(1)
    }
    if (plain.hasSlot) {
      console.error('FAIL: plain article still has .pt-live-chat-slot', plain)
      process.exit(1)
    }
    if (plain.hasChat || plain.hasChatroom) {
      console.error('FAIL: plain article unexpectedly embeds LiveChat/ChatRoom', plain)
      process.exit(1)
    }
    if (plain.folderCount > 0 && plain.emptyFolders > 0) {
      console.error(
        `FAIL: ${plain.emptyFolders}/${plain.folderCount} Directory folder labels blank`,
        plain.sampleFolders,
      )
      process.exit(1)
    }
    if (!plain.fileLink) {
      console.error('WARN: no .pt-dir-file-link yet (DirNav hydrate may still be loading)')
    } else {
      const fl = plain.fileLink
      if (fl.whiteSpace === 'nowrap') {
        console.error('FAIL: Directory file link white-space is nowrap (truncate regression)', fl)
        process.exit(1)
      }
      const wrapOk = fl.overflowWrap === 'anywhere' || fl.overflowWrap === 'break-word'
      if (fl.whiteSpace !== 'normal' && !wrapOk) {
        console.error('FAIL: Directory file link not wrapping', fl)
        process.exit(1)
      }
      console.log('OK: Directory file link wrap', fl.whiteSpace, fl.overflowWrap)
    }

    // --- ChatRoom page: in-article LiveChat ---
    const chatUrl = pageUrl(CHATROOM)
    await page.goto(chatUrl, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS })

    await page.waitForFunction(
      () => {
        const err = document.querySelector('.relay-error-boundary')
        if (err && (err.textContent || '').indexOf('ChatRoom') >= 0) {
          return 'error:' + (err.textContent || '').slice(0, 200)
        }
        const wrap = document.querySelector('.pt-chatroom-live')
        const chat = document.querySelector(
          '.pt-chatroom-live .fb-live-chat-host, .pt-chatroom-live [data-relay-park-native="fb-live-chat"], .pt-chatroom-live .fb-live-chat',
        )
        if (wrap && chat) return 'ok'
        return null
      },
      { timeout: TIMEOUT_MS },
    )

    const tagged = await page.evaluate(() => {
      const err = document.querySelector('.relay-error-boundary')
      const wrap = document.querySelector('.pt-chatroom-live')
      const chat = document.querySelector(
        '.pt-chatroom-live .fb-live-chat-host, .pt-chatroom-live [data-relay-park-native="fb-live-chat"], .pt-chatroom-live .fb-live-chat',
      )
      const host = document.querySelector('.pt-chatroom-live [data-relay-park-native="fb-live-chat"]')
      const chatBox = chat ? chat.getBoundingClientRect() : null
      return {
        errorBoundary: err ? (err.textContent || '').trim().slice(0, 300) : null,
        hasWrap: !!wrap,
        hasChat: !!chat,
        chatInRoom: !!(chat && chat.closest && chat.closest('.pt-chatroom-live')),
        chatHeight: chatBox ? chatBox.height : 0,
        dataChannel: host && host.getAttribute('data-channel'),
      }
    })

    if (tagged.errorBoundary) {
      console.error('FAIL: ChatRoom page error boundary:', tagged.errorBoundary)
      process.exit(1)
    }
    if (!tagged.hasWrap || !tagged.hasChat || !tagged.chatInRoom) {
      console.error('FAIL: ChatRoom LiveChat missing inside .pt-chatroom-live', tagged)
      process.exit(1)
    }
    if (tagged.dataChannel !== 'pt-nukes') {
      console.error('FAIL: expected data-channel=pt-nukes', tagged)
      process.exit(1)
    }
    if (tagged.chatHeight < 80) {
      console.error('FAIL: ChatRoom LiveChat panel too short (collapsed line)', tagged)
      process.exit(1)
    }

    console.log(
      `OK: park hydrate smoke — DirNav on plain article, ChatRoom LiveChat on ${CHATROOM} (Host=${HOST})`,
    )
  } finally {
    await browser.close()
  }
}

main().catch((e) => {
  console.error('FAIL:', e && e.message ? e.message : e)
  process.exit(1)
})

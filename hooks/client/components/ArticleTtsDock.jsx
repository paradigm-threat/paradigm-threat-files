/**
 * Bottom chrome — portable <pt-bottom-overlay> + Piper TTS wiring.
 * Order: Top → Chat → AI → Play → Settings (AI hidden on park for now).
 * CleverScript-safe: no import of plain .js helpers (those stay on window via CDN).
 */
import React, { useState, useEffect, useRef } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { AudioPlayer, synthesize } from '@relay/tts'
import { splitSentences as hostSplitSentences, takeSentenceChunk } from '@relay/util'

const DEFAULT_VOICE = 'en_US-lessac-medium'
const CT_BASE = 'https://clevertree.chat'

const PIPER_VOICES = [
  { id: 'en_US-lessac-medium', label: 'Lessac (US)' },
  { id: 'en_GB-cori-medium', label: 'Cori (GB)' },
  { id: 'en_US-amy-medium', label: 'Amy (US)' },
  { id: 'en_US-libritts-high', label: 'LibriTTS (US)' },
]

const CT_SCRIPTS = [
  CT_BASE + '/fronts/room/context-tags.js',
  CT_BASE + '/fronts/room/channel-route.js',
  CT_BASE + '/fronts/room/clevertree-room.js',
  CT_BASE + '/fronts/room/chat-launcher.js',
  CT_BASE + '/fronts/room/clevertree-ces.js',
  CT_BASE + '/fronts/site-chrome/pt-bottom-overlay.js',
]

const CT_STYLES = [
  CT_BASE + '/fronts/room/tokens.css',
  CT_BASE + '/fronts/room/clevertree-room.css',
  CT_BASE + '/fronts/site-chrome/pt-bottom-overlay.css',
]

function articlePlainText() {
  try {
    if (!document || !document.querySelector) return ''
    const el = document.querySelector('.pt-article-body')
    if (!el) return ''
    let t = ''
    if (typeof el.innerText === 'string') t = el.innerText
    else if (typeof el.textContent === 'string') t = el.textContent
    return t
  } catch (e) {
    return ''
  }
}

function splitSentences(text) {
  try {
    const out = hostSplitSentences(typeof text === 'string' ? text : '')
    if (out && typeof out.length === 'number') return out
  } catch (e) {}
  return []
}

function takeChunk(sentences, start, maxChars) {
  try {
    const chunk = takeSentenceChunk(sentences, start, maxChars)
    if (chunk && typeof chunk.text === 'string' && typeof chunk.next === 'number') {
      return chunk
    }
  } catch (e) {}
  return { text: '', next: start }
}

function scrollY() {
  try {
    if (document && document.documentElement) {
      const y = document.documentElement.scrollTop
      if (typeof y === 'number' && y > 0) return y
    }
  } catch (e) {}
  try {
    if (document && document.body) {
      const y2 = document.body.scrollTop
      if (typeof y2 === 'number') return y2
    }
  } catch (e2) {}
  return 0
}

function scrollToTop() {
  try {
    if (document && document.documentElement) document.documentElement.scrollTop = 0
  } catch (e) {}
  try {
    if (document && document.body) document.body.scrollTop = 0
  } catch (e2) {}
  try {
    const view = document.defaultView
    if (view && view.scrollTo) view.scrollTo(0, 0)
  } catch (e3) {}
}

function clamp(n, lo, hi) {
  if (n < lo) return lo
  if (n > hi) return hi
  return n
}

function setBoolAttr(el, name, on) {
  if (!el) return
  if (on) el.setAttribute(name, '')
  else el.removeAttribute(name)
}

function loadCss(href) {
  try {
    if (document.querySelector('link[data-ct-asset="' + href + '"]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-ct-asset', href)
    document.head.appendChild(link)
  } catch (e) {}
}

function loadScriptSeq(i, done, fail) {
  if (i >= CT_SCRIPTS.length) {
    done()
    return
  }
  const src = CT_SCRIPTS[i]
  try {
    const existing = document.querySelector('script[data-ct-asset="' + src + '"]')
    if (existing && existing.getAttribute('data-loaded') === '1') {
      loadScriptSeq(i + 1, done, fail)
      return
    }
    if (existing) {
      existing.addEventListener('load', () => {
        loadScriptSeq(i + 1, done, fail)
      })
      existing.addEventListener('error', () => {
        fail()
      })
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.setAttribute('data-ct-asset', src)
    s.onload = () => {
      s.setAttribute('data-loaded', '1')
      loadScriptSeq(i + 1, done, fail)
    }
    s.onerror = () => {
      fail()
    }
    document.head.appendChild(s)
  } catch (e) {
    fail()
  }
}

function ensureAssets(done, fail) {
  let i = 0
  while (i < CT_STYLES.length) {
    loadCss(CT_STYLES[i])
    i = i + 1
  }
  loadScriptSeq(0, done, fail)
}

function openOrToggleChat() {
  try {
    const g = globalThis
    const L = g && g.ClevertreeChatLauncher
    if (!L) return
    if (L.isOpen && L.isOpen()) {
      L.close()
      return
    }
    let origin = ''
    try {
      if (g && g.location) origin = '' + g.location.origin
    } catch (e) {}
    L.open({
      channel: '#pt',
      title: 'Paradigm Threat',
      topicId: 0,
      siteOrigin: origin,
      apiBase: 'https://api.clevertree.chat',
      dock: 'fullscreen',
      noFab: true,
    })
  } catch (e) {}
}

export default function ArticleTtsDock() {
  const live = isClientLivePhase(4) === true
  const hostRef = useRef(null)
  const [assetsReady, setAssetsReady] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [src, setSrc] = useState('')
  const [err, setErr] = useState('')
  const [sentenceIdx, setSentenceIdx] = useState(0)
  const [sentences, setSentences] = useState([])
  const [cmdSeq, setCmdSeq] = useState(0)
  const [busy, setBusy] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE)

  useEffect(() => {
    if (!live) return
    ensureAssets(
      () => {
        setAssetsReady(true)
      },
      () => {
        setAssetsReady(false)
      },
    )
  }, [live])

  useEffect(() => {
    if (!live) return
    const onScroll = () => {
      setScrolled(scrollY() > 280)
    }
    onScroll()
    try {
      document.addEventListener('scroll', onScroll)
      return () => {
        document.removeEventListener('scroll', onScroll)
      }
    } catch (e) {}
  }, [live])

  useEffect(() => {
    const onChange = (ev) => {
      const d = ev && ev.detail
      setChatOpen(!!(d && d.open))
    }
    try {
      document.addEventListener('clevertree-chat:openchange', onChange)
      return () => {
        document.removeEventListener('clevertree-chat:openchange', onChange)
      }
    } catch (e) {}
  }, [])

  function stopAll() {
    setPlaying(false)
    setSrc('')
    setSentenceIdx(0)
    setSentences([])
    setCmdSeq(cmdSeq + 1)
  }

  function playFrom(list, start) {
    if (!live || busy) return
    const chunk = takeChunk(list, start, 700)
    if (chunk.text.length === 0) {
      setPlaying(false)
      setSrc('')
      return
    }
    setBusy(true)
    setErr('')
    try {
      const dataUrl = synthesize({ text: chunk.text, voiceId: voiceId })
      if (typeof dataUrl !== 'string' || dataUrl.length === 0) {
        setErr('TTS returned empty audio')
        setBusy(false)
        setPlaying(false)
        return
      }
      setSentenceIdx(chunk.next)
      setSrc(dataUrl)
      setPlaying(true)
      setCmdSeq(cmdSeq + 1)
      setBusy(false)
    } catch (e) {
      let msg = 'TTS failed'
      try {
        if (e && typeof e.message === 'string') msg = e.message
      } catch (e2) {}
      setErr(msg)
      setBusy(false)
      setPlaying(false)
    }
  }

  function onPlayToggle() {
    if (!live) return
    if (playing) {
      setPlaying(false)
      setCmdSeq(cmdSeq + 1)
      return
    }
    if (src.length > 0) {
      setPlaying(true)
      setCmdSeq(cmdSeq + 1)
      return
    }
    scrollToTop()
    let list = sentences
    if (!list || list.length === 0) {
      list = splitSentences(articlePlainText())
      setSentences(list)
    }
    if (!list || list.length === 0) {
      setErr('No article text to read')
      return
    }
    playFrom(list, 0)
  }

  function onEnded() {
    if (!live) return
    playFrom(sentences, sentenceIdx)
  }

  function onSeekCommit(idx) {
    if (!sentences || sentences.length === 0) return
    const i = clamp(idx, 0, sentences.length - 1)
    setPlaying(false)
    setSrc('')
    setSentenceIdx(i)
    setCmdSeq(cmdSeq + 1)
    playFrom(sentences, i)
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host || !assetsReady) return
    let el = host.querySelector('pt-bottom-overlay')
    if (!el) {
      el = document.createElement('pt-bottom-overlay')
      el.setAttribute('show-ai', 'false')
      host.appendChild(el)
    }

    const onTop = () => {
      scrollToTop()
    }
    const onChat = () => {
      openOrToggleChat()
    }
    const onPlayEv = () => {
      onPlayToggle()
    }
    const onPauseEv = () => {
      setPlaying(false)
      setCmdSeq(cmdSeq + 1)
    }
    const onStopEv = () => {
      stopAll()
    }
    const onSeek = (ev) => {
      const idx = ev && ev.detail && ev.detail.index
      if (typeof idx === 'number') onSeekCommit(idx)
    }
    const onSettings = (ev) => {
      const open = !!(ev && ev.detail && ev.detail.open)
      setExpanded(open)
    }
    const onRetry = () => {
      onPlayToggle()
    }
    const onDismiss = () => {
      setErr('')
    }

    el.addEventListener('pt-overlay:top', onTop)
    el.addEventListener('pt-overlay:chat', onChat)
    el.addEventListener('pt-overlay:play', onPlayEv)
    el.addEventListener('pt-overlay:pause', onPauseEv)
    el.addEventListener('pt-overlay:stop', onStopEv)
    el.addEventListener('pt-overlay:seek', onSeek)
    el.addEventListener('pt-overlay:settings', onSettings)
    el.addEventListener('pt-overlay:retry', onRetry)
    el.addEventListener('pt-overlay:dismiss-error', onDismiss)
    return () => {
      el.removeEventListener('pt-overlay:top', onTop)
      el.removeEventListener('pt-overlay:chat', onChat)
      el.removeEventListener('pt-overlay:play', onPlayEv)
      el.removeEventListener('pt-overlay:pause', onPauseEv)
      el.removeEventListener('pt-overlay:stop', onStopEv)
      el.removeEventListener('pt-overlay:seek', onSeek)
      el.removeEventListener('pt-overlay:settings', onSettings)
      el.removeEventListener('pt-overlay:retry', onRetry)
      el.removeEventListener('pt-overlay:dismiss-error', onDismiss)
    }
  }, [assetsReady, playing, src, sentences, sentenceIdx, busy, voiceId, cmdSeq, live])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const el = host.querySelector('pt-bottom-overlay')
    if (!el) return
    const session = sentences && sentences.length > 0
    setBoolAttr(el, 'scrolled', scrolled)
    setBoolAttr(el, 'chat-open', chatOpen)
    setBoolAttr(el, 'playing', playing)
    setBoolAttr(el, 'session', session)
    setBoolAttr(el, 'settings-open', expanded)
    setBoolAttr(el, 'busy', busy)
    el.setAttribute('show-ai', 'false')
    if (session) {
      el.setAttribute('seek-max', '' + sentences.length)
      el.setAttribute('seek-value', '' + clamp(sentenceIdx, 0, sentences.length - 1))
    } else {
      el.setAttribute('seek-max', '0')
      el.setAttribute('seek-value', '0')
    }
    if (err) el.setAttribute('error', err)
    else el.removeAttribute('error')
  }, [scrolled, chatOpen, playing, sentences, sentenceIdx, expanded, busy, err, assetsReady])

  if (!live) {
    return (
      <div className="pt-tts-dock pt-client-only" hidden={true} aria-hidden="true" data-pt-tts-css="true">
        <span aria-hidden="true" hidden={true} />
      </div>
    )
  }

  function onFallbackChat() {
    ensureAssets(
      () => {
        openOrToggleChat()
      },
      () => {
        openOrToggleChat()
      },
    )
  }

  return (
    <div className="pt-tts-dock pt-tts-dock-visible pt-client-only" data-pt-tts-dock="true">
      <div ref={hostRef} data-pt-overlay-host="1" />
      {!assetsReady ? (
        <button
          type="button"
          className="pt-chat-open-btn pt-tts-chat-fallback"
          data-clevertree-chat-open="1"
          data-channel="#pt"
          onClick={onFallbackChat}
        >
          Chat
        </button>
      ) : null}
      {expanded ? (
        <div className="pt-tts-settings-strip pt-tts-settings-float">
          <div className="pt-tts-setting">
            <span className="pt-tts-setting-label">Voice</span>
            <select
              className="pt-tts-setting-select"
              value={voiceId}
              onChange={(e) => {
                setVoiceId(e.target.value)
              }}
              aria-label="Piper voice"
            >
              {PIPER_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      {src.length > 0 ? (
        <AudioPlayer
          src={src}
          playing={playing}
          command={playing ? 1 : 2}
          commandSeq={cmdSeq}
          onEnded={onEnded}
          playerId="pt-article-tts"
        />
      ) : null}
    </div>
  )
}

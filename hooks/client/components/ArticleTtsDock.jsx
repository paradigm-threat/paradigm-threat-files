/**
 * Bottom TTS dock — visual match for paradigm-threat-site ArticleTTSOverlay
 * (circular indigo play/pause, stop when session active, seek, settings).
 */
import React, { useState, useEffect } from 'react'
import { isClientLivePhase } from '@clevertree/style-internal'
import { AudioPlayer, synthesize } from '@relay/tts'
import { splitSentences as hostSplitSentences, takeSentenceChunk } from '@relay/util'
import {
  IconPlay,
  IconPause,
  IconStop,
  IconChevronUp,
  IconSettings,
} from 'hooks/client/components/Icons.jsx'

const DEFAULT_VOICE = 'en_US-lessac-medium'

/** Known Piper ids (gateway /voices may offer a subset). */
const PIPER_VOICES = [
  { id: 'en_US-lessac-medium', label: 'Lessac (US)' },
  { id: 'en_GB-cori-medium', label: 'Cori (GB)' },
  { id: 'en_US-amy-medium', label: 'Amy (US)' },
  { id: 'en_US-libritts-high', label: 'LibriTTS (US)' },
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
    if (document && document.documentElement) {
      document.documentElement.scrollTop = 0
    }
  } catch (e) {}
  try {
    if (document && document.body) {
      document.body.scrollTop = 0
    }
  } catch (e2) {}
  try {
    const view = document.defaultView
    if (view && view.scrollTo) {
      view.scrollTo(0, 0)
    }
  } catch (e3) {}
}

function clamp(n, lo, hi) {
  if (n < lo) return lo
  if (n > hi) return hi
  return n
}

/** Bottom playback dock — Piper via @relay/tts (client-live only). */
export default function ArticleTtsDock() {
  const live = isClientLivePhase(4) === true
  const playingState = useState(false)
  const playing = playingState[0]
  const setPlaying = playingState[1]
  const srcState = useState('')
  const src = srcState[0]
  const setSrc = srcState[1]
  const errState = useState('')
  const err = errState[0]
  const setErr = errState[1]
  const idxState = useState(0)
  const sentenceIdx = idxState[0]
  const setSentenceIdx = idxState[1]
  const sentencesState = useState([])
  const sentences = sentencesState[0]
  const setSentences = sentencesState[1]
  const cmdState = useState(0)
  const cmdSeq = cmdState[0]
  const setCmdSeq = cmdState[1]
  const busyState = useState(false)
  const busy = busyState[0]
  const setBusy = busyState[1]
  const scrollState = useState(false)
  const scrolled = scrollState[0]
  const setScrolled = scrollState[1]
  const expandedState = useState(false)
  const expanded = expandedState[0]
  const setExpanded = expandedState[1]
  const voiceState = useState(DEFAULT_VOICE)
  const voiceId = voiceState[0]
  const setVoiceId = voiceState[1]
  const seekState = useState(-1)
  const seekValue = seekState[0]
  const setSeekValue = seekState[1]

  useEffect(() => {
    if (!live) return
    const onScroll = () => {
      setScrolled(scrollY() > 280)
    }
    onScroll()
    try {
      if (document && document.addEventListener) {
        document.addEventListener('scroll', onScroll)
        return () => {
          try {
            document.removeEventListener('scroll', onScroll)
          } catch (e) {}
        }
      }
    } catch (e2) {}
  }, [live])

  function stopAll() {
    setPlaying(false)
    setSrc('')
    setSentenceIdx(0)
    setSentences([])
    setSeekValue(-1)
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
      const dataUrl = synthesize({
        text: chunk.text,
        voiceId: voiceId,
      })
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

  function onStopClick() {
    stopAll()
  }

  function onEnded() {
    if (!live) return
    playFrom(sentences, sentenceIdx)
  }

  function onSeekCommit(idx) {
    if (!sentences || sentences.length === 0) return
    const i = clamp(idx, 0, sentences.length - 1)
    setSeekValue(-1)
    setPlaying(false)
    setSrc('')
    setSentenceIdx(i)
    setCmdSeq(cmdSeq + 1)
    playFrom(sentences, i)
  }

  if (!live) {
    return (
      <div
        className="pt-tts-dock lg:pt-tts-dock-lg pt-tts-dock-visible pt-client-only"
        hidden={true}
        aria-hidden="true"
        data-pt-tts-css="true"
      >
        <span
          aria-hidden="true"
          hidden={true}
          className="pt-tts-panel pt-tts-dock-row pt-tts-play pt-tts-stop pt-tts-top pt-tts-settings pt-tts-seek-wrap pt-tts-count pt-tts-err pt-tts-settings-strip"
        />
      </div>
    )
  }

  const sessionActive = sentences && sentences.length > 0
  let displayIdx = sentenceIdx
  if (seekValue >= 0) displayIdx = seekValue
  displayIdx = clamp(displayIdx, 0, sessionActive ? sentences.length - 1 : 0)
  let countShown = displayIdx + 1
  if (countShown < 1) countShown = 1
  if (sessionActive && countShown > sentences.length) countShown = sentences.length

  return (
    <div
      className="pt-tts-dock lg:pt-tts-dock-lg pt-tts-dock-visible pt-client-only"
      data-pt-tts-dock="true"
    >
      {err.length > 0 ? <div className="pt-tts-err">{err}</div> : null}
      <div className="pt-tts-panel">
        <div className="pt-tts-dock-row">
          <button
            type="button"
            className="pt-tts-play"
            disabled={busy}
            aria-busy={busy ? 'true' : 'false'}
            onClick={onPlayToggle}
            aria-label={playing ? 'Pause' : 'Play article'}
            title={busy ? 'Synthesizing…' : playing ? 'Pause' : 'Play article (Piper)'}
          >
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          {sessionActive ? (
            <button
              type="button"
              className="pt-tts-stop"
              onClick={onStopClick}
              aria-label="Stop"
              title="Stop"
            >
              <IconStop />
            </button>
          ) : null}
          {scrolled ? (
            <button
              type="button"
              className="pt-tts-top"
              onClick={() => {
                scrollToTop()
              }}
              aria-label="Back to top"
              title="Back to top"
            >
              <IconChevronUp />
            </button>
          ) : null}
          {sessionActive ? (
            <div className="pt-tts-seek-wrap">
              <input
                type="range"
                className="pt-tts-seek"
                min={0}
                max={sentences.length - 1}
                step={1}
                value={displayIdx}
                aria-label="Seek position in article"
                onChange={(e) => {
                  let v = 0
                  try {
                    v = parseInt(e.target.value, 10)
                  } catch (err2) {
                    v = 0
                  }
                  if (typeof v !== 'number' || v !== v) v = 0
                  setSeekValue(v)
                }}
                onMouseUp={() => {
                  if (seekValue >= 0) onSeekCommit(seekValue)
                }}
                onTouchEnd={() => {
                  if (seekValue >= 0) onSeekCommit(seekValue)
                }}
              />
              <span className="pt-tts-count">
                {countShown + ' / ' + sentences.length}
              </span>
            </div>
          ) : null}
          <button
            type="button"
            className={
              expanded
                ? 'pt-tts-settings pt-tts-settings-open'
                : 'pt-tts-settings'
            }
            onClick={() => {
              setExpanded(!expanded)
            }}
            aria-label="TTS settings"
            aria-expanded={expanded ? 'true' : 'false'}
            title="TTS settings"
          >
            <IconSettings />
          </button>
        </div>
        {expanded ? (
          <div className="pt-tts-settings-strip">
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
      </div>
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

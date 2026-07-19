import React, { useState } from 'react'
import { isClientLive } from '@clevertree/style-internal'
import { AudioPlayer, synthesize } from '@relay/tts'

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
  let out = []
  let cur = ''
  const s = typeof text === 'string' ? text : ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    cur = cur + c
    if (c === '.' || c === '!' || c === '?') {
      const t = cur.trim()
      if (t.length > 0) out = out.concat([t])
      cur = ''
    }
  }
  const tail = cur.trim()
  if (tail.length > 0) out = out.concat([tail])
  return out
}

function takeChunk(sentences, start, maxChars) {
  let out = ''
  let i = start
  while (i < sentences.length) {
    const next = sentences[i]
    if (out.length > 0 && out.length + next.length + 1 > maxChars) break
    if (out.length > 0) out = out + ' '
    out = out + next
    i = i + 1
    if (out.length >= maxChars) break
  }
  return { text: out, next: i }
}

/** Bottom playback dock — Piper via @relay/tts (client-live only). */
export default function ArticleTtsDock() {
  const live = isClientLive() === true
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

  function stopAll() {
    setPlaying(false)
    setSrc('')
    setSentenceIdx(0)
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
        voiceId: 'en_US-lessac-medium',
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

  function onPlayClick() {
    if (!live) return
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

  function onPauseClick() {
    setPlaying(false)
    setCmdSeq(cmdSeq + 1)
  }

  function onStopClick() {
    stopAll()
  }

  function onEnded() {
    if (!live) return
    playFrom(sentences, sentenceIdx)
  }

  if (!live) {
    return (
      <div
        className="pt-tts-dock pt-tts-dock-visible"
        hidden={true}
        aria-hidden="true"
        data-pt-tts-css="true"
      />
    )
  }

  return (
    <div className="pt-tts-dock pt-tts-dock-visible" data-pt-tts-dock="true">
      <div className="pt-tts-dock-row">
        <button
          type="button"
          className="pt-tts-btn"
          disabled={busy}
          onClick={onPlayClick}
          title="Play article (Piper)"
        >
          Play
        </button>
        <button
          type="button"
          className="pt-tts-btn"
          onClick={onPauseClick}
          title="Pause"
        >
          Pause
        </button>
        <button
          type="button"
          className="pt-tts-btn"
          onClick={onStopClick}
          title="Stop"
        >
          Stop
        </button>
        <span className="pt-tts-status">
          {busy ? 'Synthesizing…' : playing ? 'Playing' : 'Ready'}
        </span>
      </div>
      {err.length > 0 ? <div className="pt-tts-err">{err}</div> : null}
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

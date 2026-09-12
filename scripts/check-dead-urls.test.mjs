import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  applyProbeResult,
  classifyHttpStatus,
  classifyProbeError,
  documentedDeadReason,
  extractHttpHrefs,
  isSkipHref,
  normalizeHttpHref,
} from './lib/dead-urls.mjs'

describe('normalizeHttpHref', () => {
  it('lowercases host and drops fragment', () => {
    assert.equal(
      normalizeHttpHref('https://Example.COM/Path#frag'),
      'https://example.com/Path',
    )
  })
  it('drops trailing slash on paths but keeps origin slash', () => {
    assert.equal(normalizeHttpHref('https://example.com/foo/'), 'https://example.com/foo')
    assert.equal(normalizeHttpHref('https://example.com'), 'https://example.com/')
    assert.equal(normalizeHttpHref('https://example.com/'), 'https://example.com/')
  })
  it('drops default ports and keeps query', () => {
    assert.equal(
      normalizeHttpHref('https://example.com:443/a?x=1'),
      'https://example.com/a?x=1',
    )
    assert.equal(
      normalizeHttpHref('http://example.com:80/a'),
      'http://example.com/a',
    )
  })
  it('does not rewrite http to https or strip www', () => {
    assert.equal(normalizeHttpHref('http://www.example.com/a'), 'http://www.example.com/a')
  })
  it('leaves relative and mailto unchanged', () => {
    assert.equal(normalizeHttpHref('/foo'), '/foo')
    assert.equal(normalizeHttpHref('mailto:a@b.c'), 'mailto:a@b.c')
  })
  it('returns original on parse failure', () => {
    assert.equal(normalizeHttpHref('https://'), 'https://')
  })
})

describe('extractHttpHrefs', () => {
  it('finds markdown links, autolinks, and href=', () => {
    const md = [
      '[x](https://a.example/p)',
      '<https://b.example/q>',
      '<a href="https://c.example/r">',
      '[y](https://a.example/p)',
    ].join('\n')
    assert.deepEqual(extractHttpHrefs(md), [
      'https://a.example/p',
      'https://b.example/q',
      'https://c.example/r',
    ])
  })
})

describe('isSkipHref', () => {
  it('skips first-party, localhost, archive, relative', () => {
    assert.equal(isSkipHref('https://paradigmthreat.net/x'), true)
    assert.equal(isSkipHref('https://timeline.paradigmthreat.net/x'), true)
    assert.equal(isSkipHref('http://localhost/x'), true)
    assert.equal(isSkipHref('https://web.archive.org/web/1/http://x'), true)
    assert.equal(isSkipHref('/relative'), true)
    assert.equal(isSkipHref('https://example.com/x'), false)
  })
})

describe('classify', () => {
  it('treats 404/410 as gone and timeout/403/5xx as unsure', () => {
    assert.equal(classifyHttpStatus(404).class, 'gone')
    assert.equal(classifyHttpStatus(404).reason, 'http_404')
    assert.equal(classifyHttpStatus(410).class, 'gone')
    assert.equal(classifyHttpStatus(200).class, 'live')
    assert.equal(classifyHttpStatus(301).class, 'live')
    assert.equal(classifyHttpStatus(403).class, 'unsure')
    assert.equal(classifyHttpStatus(429).class, 'unsure')
    assert.equal(classifyHttpStatus(503).class, 'unsure')
    assert.equal(classifyProbeError({ code: 'ENOTFOUND' }).class, 'gone')
    assert.equal(classifyProbeError({ name: 'AbortError' }).class, 'unsure')
    assert.equal(classifyProbeError({ code: 'ECONNRESET' }).class, 'unsure')
  })
})

describe('documentedDeadReason', () => {
  it('matches github.com/clevertree and pages host', () => {
    assert.equal(
      documentedDeadReason('https://github.com/clevertree/relay-runtime'),
      'nxdomain',
    )
    assert.equal(documentedDeadReason('https://clevertree.github.io/x'), 'nxdomain')
    assert.equal(documentedDeadReason('https://github.com/other/repo'), null)
  })
})

describe('applyProbeResult', () => {
  it('promotes after two consecutive gone results', () => {
    const state = {}
    const dead = {}
    const deadByRoot = new Map([['files', dead]])
    const r1 = applyProbeResult({
      key: 'https://gone.example/a',
      result: { class: 'gone', reason: 'http_404', status: 404 },
      date: '2026-09-11',
      state,
      deadByRoot,
      rootsForUrl: ['files'],
    })
    assert.equal(r1.promoted, false)
    assert.equal(r1.pending, true)
    assert.equal(dead['https://gone.example/a'], undefined)
    const r2 = applyProbeResult({
      key: 'https://gone.example/a',
      result: { class: 'gone', reason: 'http_404', status: 404 },
      date: '2026-09-12',
      state,
      deadByRoot,
      rootsForUrl: ['files'],
    })
    assert.equal(r2.promoted, true)
    assert.equal(dead['https://gone.example/a'].reason, 'http_404')
    assert.equal(dead['https://gone.example/a'].firstConfirmed, '2026-09-12')
  })

  it('does not promote on unsure; resets consecutive on live', () => {
    const state = {}
    const dead = {}
    const deadByRoot = new Map([['files', dead]])
    applyProbeResult({
      key: 'https://flaky.example/a',
      result: { class: 'gone', reason: 'http_404', status: 404 },
      date: '2026-09-11',
      state,
      deadByRoot,
      rootsForUrl: ['files'],
    })
    applyProbeResult({
      key: 'https://flaky.example/a',
      result: { class: 'unsure', reason: 'timeout', status: null },
      date: '2026-09-12',
      state,
      deadByRoot,
      rootsForUrl: ['files'],
    })
    assert.equal(state['https://flaky.example/a'].consecutiveGone, 0)
    assert.equal(dead['https://flaky.example/a'], undefined)
  })

  it('resurrects a live URL already on the dead list', () => {
    const key = 'https://back.example/a'
    const dead = {
      [key]: {
        status: 404,
        reason: 'http_404',
        firstConfirmed: '2026-01-01',
        lastChecked: '2026-01-01',
      },
    }
    const deadByRoot = new Map([['files', dead]])
    const r = applyProbeResult({
      key,
      result: { class: 'live', reason: 'http_200', status: 200 },
      date: '2026-09-12',
      state: {},
      deadByRoot,
      rootsForUrl: ['files'],
    })
    assert.equal(r.resurrected, true)
    assert.equal(dead[key], undefined)
  })

  it('writes only into roots that contain the URL', () => {
    const key = 'https://only-timeline.example/a'
    const filesDead = {}
    const timelineDead = {}
    const deadByRoot = new Map([
      ['files', filesDead],
      ['timeline', timelineDead],
    ])
    applyProbeResult({
      key,
      result: { class: 'gone', reason: 'nxdomain', status: null },
      date: '2026-09-11',
      state: {},
      deadByRoot,
      rootsForUrl: ['timeline'],
    })
    applyProbeResult({
      key,
      result: { class: 'gone', reason: 'nxdomain', status: null },
      date: '2026-09-12',
      state: { [key]: { consecutiveGone: 1 } },
      deadByRoot,
      rootsForUrl: ['timeline'],
    })
    assert.equal(filesDead[key], undefined)
    assert.ok(timelineDead[key])
  })

  it('promotes documented github.com/clevertree on first gone', () => {
    const key = 'https://github.com/clevertree/foo'
    const dead = {}
    const deadByRoot = new Map([['files', dead]])
    const r = applyProbeResult({
      key,
      result: { class: 'gone', reason: 'nxdomain', status: null },
      date: '2026-09-12',
      state: {},
      deadByRoot,
      rootsForUrl: ['files'],
    })
    assert.equal(r.promoted, true)
    assert.ok(dead[key])
  })
})

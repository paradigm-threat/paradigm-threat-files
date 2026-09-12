import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  archiveBannerHref,
  archivePrettyPath,
  isMdCorpusSubpath,
} from '../hooks/client/legacyAppHref.js'

describe('archiveBannerHref', () => {
  it('defaults app shells and home to the archive origin', () => {
    assert.equal(isMdCorpusSubpath('/'), false)
    assert.equal(isMdCorpusSubpath('/page.md'), false)
    assert.equal(isMdCorpusSubpath('/search'), false)
    assert.equal(isMdCorpusSubpath('/articles'), false)
    assert.equal(archiveBannerHref('/'), 'https://old.paradigmthreat.net/')
    assert.equal(archiveBannerHref('/search'), 'https://old.paradigmthreat.net/')
  })

  it('keeps nested pretty and .md article paths', () => {
    assert.equal(
      archiveBannerHref('/science/computing/crichtons-prophecy.md?x=1'),
      'https://old.paradigmthreat.net/science/computing/crichtons-prophecy',
    )
    assert.equal(
      archiveBannerHref(
        '/events/false_flag/investigations/richard-gage-ae911truth-controlled-demolition-investigation',
      ),
      'https://old.paradigmthreat.net/events/false_flag/investigations/richard-gage-ae911truth-controlled-demolition-investigation',
    )
    assert.equal(
      archivePrettyPath('/blog/2026-03-11-timeline-update.md'),
      '/blog/2026-03-11-timeline-update',
    )
  })

  it('ignores rasters', () => {
    assert.equal(isMdCorpusSubpath('/science/computing/crichtons-prophecy.png'), false)
    assert.equal(archiveBannerHref('/foo.png'), 'https://old.paradigmthreat.net/')
  })
})

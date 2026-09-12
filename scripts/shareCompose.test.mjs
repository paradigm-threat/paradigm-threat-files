import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  appendShareWidth,
  canonicalArticleUrl,
  composeShareCopies,
  encodeShareQuery,
  extractFirstImageUrl,
  extractShareMetadata,
  headingTitle,
  mdDownloadFilename,
  mdRelPath,
  prettyArticlePath,
  shareOutboundLinks,
} from '../hooks/client/shareCompose.js'

const SAMPLE = `---
title: Crichton
---

# Crichton's Prophecy

![cover](crichtons-prophecy.png)

> **TL;DR:** Disclosure (1994) stages a product captain deleted by accusation.

How Disclosure warned that taking the boss off the product would break it.

## Body

More article text with a [link](https://example.com/x) and **bold**.

**Substack:** https://paradigmthreat2.substack.com/p/crichtons-prophecy

Keywords: #crichton #disclosure #software
`

describe('shareCompose', () => {
  it('pretty-paths md files and builds canonical URLs', () => {
    assert.equal(
      prettyArticlePath('science/computing/crichtons-prophecy.md'),
      '/science/computing/crichtons-prophecy',
    )
    assert.equal(
      canonicalArticleUrl(
        'science/computing/crichtons-prophecy.md',
        'https://paradigmthreat.net',
      ),
      'https://paradigmthreat.net/science/computing/crichtons-prophecy',
    )
    assert.equal(mdRelPath('/science/computing/crichtons-prophecy'), 'science/computing/crichtons-prophecy.md')
    assert.equal(mdDownloadFilename('science/computing/crichtons-prophecy.md'), 'crichtons-prophecy.md')
  })

  it('extracts TL;DR, keywords, first image, and Substack URL', () => {
    const meta = extractShareMetadata(SAMPLE)
    assert.match(meta.snippetPlain, /Disclosure \(1994\)/)
    assert.equal(meta.hashtagsLine, '#crichton #disclosure #software')
    assert.match(meta.articleBodyPlain, /How Disclosure warned/)
    assert.ok(meta.articleBodyPlain.indexOf('TL;DR') < 0)
    assert.equal(
      meta.substackUrl,
      'https://paradigmthreat2.substack.com/p/crichtons-prophecy',
    )
    assert.equal(extractFirstImageUrl(SAMPLE), 'crichtons-prophecy.png')
    assert.equal(appendShareWidth('/science/computing/crichtons-prophecy.png'), '/science/computing/crichtons-prophecy.png?w=800')
  })

  it('composes Instagram copy with title, snippet, url, and capped tags', () => {
    const meta = extractShareMetadata(SAMPLE)
    const copies = composeShareCopies({
      title: "Crichton's Prophecy",
      canonicalUrl: 'https://paradigmthreat.net/science/computing/crichtons-prophecy',
      snippetPlain: meta.snippetPlain,
      hashtagsLine: meta.hashtagsLine,
      articleBodyPlain: meta.articleBodyPlain,
      articleBodyParagraphsPlain: meta.articleBodyParagraphsPlain,
    })
    assert.match(copies.instagram, /Crichton's Prophecy/)
    assert.match(copies.instagram, /paradigmthreat\.net\/science\/computing\/crichtons-prophecy/)
    assert.match(copies.instagram, /#crichton/)
    assert.ok(copies.instagram.length <= 2200)
    assert.equal(
      copies.link,
      "Crichton's Prophecy\n\nhttps://paradigmthreat.net/science/computing/crichtons-prophecy",
    )
    assert.ok(copies.x.indexOf(meta.snippetPlain) < 0)
  })

  it('encodes share query values without encodeURIComponent', () => {
    assert.equal(encodeShareQuery('a b\nc'), 'a%20b%0Ac')
    const links = shareOutboundLinks(
      'https://paradigmthreat.net/science/computing/crichtons-prophecy',
      "Crichton's Prophecy",
      'hello',
    )
    assert.match(links.facebook, /u=https%3A%2F%2Fparadigmthreat\.net/)
    assert.match(links.x, /text=hello/)
    assert.equal(links.instagram, 'https://www.instagram.com/')
  })

  it('reads first heading title from idQueue', () => {
    assert.equal(headingTitle([{ id: 'x', title: "Crichton's Prophecy", level: 1 }]), "Crichton's Prophecy")
    assert.equal(headingTitle([]), '')
  })
})

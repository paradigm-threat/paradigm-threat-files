/**
 * Share overlay store — closed-over mutable state via `export const share = create…()`.
 * Open/close emit a tick (gallery pattern). Payload writes do not remount.
 */
import {
  appendShareWidth,
  canonicalArticleUrl,
  composeShareCopies,
  extractFirstImageUrl,
  extractShareMetadata,
  headingTitle,
  mdDownloadFilename,
  mdRelPath,
  pageOrigin,
  prettyArticlePath,
  shareOutboundLinks,
} from 'hooks/client/shareCompose.js'

function str(v) {
  if (typeof v === 'string') {
    return v
  }
  return ''
}

function emptyPayload() {
  return {
    title: '',
    url: '',
    prettyPath: '/',
    mdRel: 'page.md',
    mdName: 'article.md',
    mdSource: '',
    imageSrc: '',
    copies: {
      instagram: '',
      x: '',
      facebook: '',
      link: '',
    },
    links: {
      x: 'https://twitter.com/intent/tweet',
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/',
      reddit: 'https://www.reddit.com/',
      bluesky: 'https://bsky.app/',
      threads: 'https://www.threads.net/',
      instagram: 'https://www.instagram.com/',
      substack: 'https://substack.com/notes',
    },
  }
}

function createShareApi() {
  let s = {
    open: false,
    rev: 0,
    payload: emptyPayload(),
    listeners: [],
  }

  function emit() {
    s.rev = s.rev + 1
    const list = s.listeners
    for (let i = 0; i < list.length; i++) {
      try {
        list[i](s.rev)
      } catch (e) {}
    }
  }

  function shareRev() {
    return s.rev
  }

  function shareSubscribe(fn) {
    s.listeners = s.listeners.concat([fn])
    return () => {
      let next = []
      for (let i = 0; i < s.listeners.length; i++) {
        if (s.listeners[i] !== fn) {
          next = next.concat([s.listeners[i]])
        }
      }
      s.listeners = next
    }
  }

  function shareIsOpen() {
    return s.open === true
  }

  function sharePayload() {
    return s.payload
  }

  function setShareArticle(opts) {
    const filePath = str(opts && opts.filePath)
    const md = str(opts && opts.markdown)
    let title = str(opts && opts.title)
    if (title.length === 0) {
      title = headingTitle(opts && opts.idQueue)
    }
    if (title.length === 0) {
      title = prettyArticlePath(filePath)
    }
    const origin = pageOrigin()
    const url = canonicalArticleUrl(filePath, origin)
    const pretty = prettyArticlePath(filePath)
    const mdRel = mdRelPath(filePath)
    const mdName = mdDownloadFilename(filePath)
    const meta = extractShareMetadata(md)
    const copies = composeShareCopies({
      title: title,
      canonicalUrl: url,
      snippetPlain: meta.snippetPlain,
      hashtagsLine: meta.hashtagsLine,
      articleBodyPlain: meta.articleBodyPlain,
      articleBodyParagraphsPlain: meta.articleBodyParagraphsPlain,
    })
    let imageSrc = extractFirstImageUrl(md)
    if (imageSrc.length === 0) {
      imageSrc = str(opts && opts.imageSrc)
    }
    imageSrc = appendShareWidth(imageSrc)
    const links = shareOutboundLinks(url, title, copies.x)
    s.payload = {
      title: title,
      url: url,
      prettyPath: pretty,
      mdRel: mdRel,
      mdName: mdName,
      mdSource: md,
      imageSrc: imageSrc,
      copies: copies,
      links: links,
    }
  }

  function openShare() {
    s.open = true
    emit()
  }

  function closeShare() {
    if (s.open !== true) {
      return
    }
    s.open = false
    emit()
  }

  return {
    shareRev: shareRev,
    shareSubscribe: shareSubscribe,
    shareIsOpen: shareIsOpen,
    sharePayload: sharePayload,
    setShareArticle: setShareArticle,
    openShare: openShare,
    closeShare: closeShare,
  }
}

export const share = createShareApi()

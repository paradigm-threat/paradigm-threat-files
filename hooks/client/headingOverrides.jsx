/**
 * MarkdownRenderer h1–h6 overrides that stamp ids from extractMarkdownHeadings idQueue.
 * Cursor is closed over locals (CleverScript: module bindings are Undefined inside nested functions).
 */
import React from 'react'

function readChildren(p) {
  let children = null
  try {
    if (p && p.children !== null) {
      children = p.children
    }
  } catch (e) {}
  return children
}

function readClassName(p) {
  let className = ''
  try {
    if (p && typeof p.className === 'string') {
      className = p.className
    }
  } catch (e) {}
  return className
}

/**
 * @param {Array<{id:string}>} idQueue ordered headings (includes first H1)
 * @returns {{ h1: Function, h2: Function, h3: Function, h4: Function, h5: Function, h6: Function }}
 */
export function makeHeadingOverrides(idQueue) {
  let queue = []
  if (idQueue && typeof idQueue.length === 'number') {
    queue = idQueue
  }
  let cursor = 0

  const nextId = () => {
    if (cursor >= queue.length) {
      return ''
    }
    const entry = queue[cursor]
    cursor = cursor + 1
    let id = ''
    try {
      if (entry && typeof entry.id === 'string') {
        id = entry.id
      }
    } catch (e) {}
    return id
  }

  const h1 = (p) => {
    const id = nextId()
    const children = readChildren(p)
    const className = readClassName(p)
    if (id.length > 0 && className.length > 0) {
      return (
        <h1 id={id} className={className}>
          {children}
        </h1>
      )
    }
    if (id.length > 0) {
      return <h1 id={id}>{children}</h1>
    }
    if (className.length > 0) {
      return <h1 className={className}>{children}</h1>
    }
    return <h1>{children}</h1>
  }

  const h2 = (p) => {
    const id = nextId()
    const children = readChildren(p)
    const className = readClassName(p)
    if (id.length > 0 && className.length > 0) {
      return (
        <h2 id={id} className={className}>
          {children}
        </h2>
      )
    }
    if (id.length > 0) {
      return <h2 id={id}>{children}</h2>
    }
    if (className.length > 0) {
      return <h2 className={className}>{children}</h2>
    }
    return <h2>{children}</h2>
  }

  const h3 = (p) => {
    const id = nextId()
    const children = readChildren(p)
    const className = readClassName(p)
    if (id.length > 0 && className.length > 0) {
      return (
        <h3 id={id} className={className}>
          {children}
        </h3>
      )
    }
    if (id.length > 0) {
      return <h3 id={id}>{children}</h3>
    }
    if (className.length > 0) {
      return <h3 className={className}>{children}</h3>
    }
    return <h3>{children}</h3>
  }

  const h4 = (p) => {
    const id = nextId()
    const children = readChildren(p)
    const className = readClassName(p)
    if (id.length > 0 && className.length > 0) {
      return (
        <h4 id={id} className={className}>
          {children}
        </h4>
      )
    }
    if (id.length > 0) {
      return <h4 id={id}>{children}</h4>
    }
    if (className.length > 0) {
      return <h4 className={className}>{children}</h4>
    }
    return <h4>{children}</h4>
  }

  const h5 = (p) => {
    const id = nextId()
    const children = readChildren(p)
    const className = readClassName(p)
    if (id.length > 0 && className.length > 0) {
      return (
        <h5 id={id} className={className}>
          {children}
        </h5>
      )
    }
    if (id.length > 0) {
      return <h5 id={id}>{children}</h5>
    }
    if (className.length > 0) {
      return <h5 className={className}>{children}</h5>
    }
    return <h5>{children}</h5>
  }

  const h6 = (p) => {
    const id = nextId()
    const children = readChildren(p)
    const className = readClassName(p)
    if (id.length > 0 && className.length > 0) {
      return (
        <h6 id={id} className={className}>
          {children}
        </h6>
      )
    }
    if (id.length > 0) {
      return <h6 id={id}>{children}</h6>
    }
    if (className.length > 0) {
      return <h6 className={className}>{children}</h6>
    }
    return <h6>{children}</h6>
  }

  return {
    h1: h1,
    h2: h2,
    h3: h3,
    h4: h4,
    h5: h5,
    h6: h6,
  }
}

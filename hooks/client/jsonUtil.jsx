function escapeJsonString(s) {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (c === '\\') out = out + '\\\\'
    else if (c === '"') out = out + '\\"'
    else if (c === '\n') out = out + '\\n'
    else if (c === '\r') out = out + '\\r'
    else if (c === '\t') out = out + '\\t'
    else out = out + c
  }
  return out
}

export function queryIndexBody(query, limit, order) {
  let body =
    '{"collection":"index","query":"' +
    escapeJsonString(query) +
    '","limit":' +
    limit
  if (order && order.length > 0) {
    body = body + ',"order":"' + escapeJsonString(order) + '"'
  }
  return body + '}'
}

/** CleverScript: prefer bare `JSON.parse` (Rust builtin). `globalThis.JSON` is mirrored too. */
export function parseJson(text) {
  try {
    if (!text || text.length === 0) return null
    return JSON.parse(text)
  } catch (e) {
    return null
  }
}

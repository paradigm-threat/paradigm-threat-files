#!/usr/bin/env node
/**
 * Validate paradigm-threat-files/site-claims.json (parse + required fields).
 * Run from paradigm-threat-files: npm run validate-site-claims
 */
const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const path = join(process.cwd(), 'site-claims.json')
const raw = JSON.parse(readFileSync(path, 'utf8'))
if (!Array.isArray(raw)) {
  console.error('site-claims.json must be a JSON array')
  process.exit(1)
}

const ALLOWED_CONFIDENCE = new Set(['project-thesis', 'documented', 'speculative', 'author-thesis'])
const ALLOWED_UNIQUENESS = new Set(['site-distinctive', 'broader-tradition', 'site-position'])
const ids = new Set()
for (let i = 0; i < raw.length; i++) {
  const c = raw[i]
  if (!c || typeof c !== 'object') {
    console.error(`[${i}] expected object`)
    process.exit(1)
  }
  const { id, title, claim, confidence, uniqueness, topics, canonicalPaths } = c
  if (!id || !title || !claim) {
    console.error(`[${i}] missing id, title, or claim`)
    process.exit(1)
  }
  if (ids.has(id)) {
    console.error(`duplicate id: ${id}`)
    process.exit(1)
  }
  ids.add(id)
  if (!Array.isArray(topics) || topics.length === 0) {
    console.error(`[${i}] (${id}) topics must be non-empty array`)
    process.exit(1)
  }
  if (!Array.isArray(canonicalPaths) || canonicalPaths.length === 0) {
    console.error(`[${i}] (${id}) canonicalPaths must be non-empty array`)
    process.exit(1)
  }
  if (!confidence || !uniqueness) {
    console.error(`[${i}] (${id}) missing confidence or uniqueness`)
    process.exit(1)
  }
  if (!ALLOWED_CONFIDENCE.has(confidence)) {
    console.error(`[${i}] (${id}) invalid confidence: ${confidence}`)
    process.exit(1)
  }
  if (!ALLOWED_UNIQUENESS.has(uniqueness)) {
    console.error(`[${i}] (${id}) invalid uniqueness: ${uniqueness}`)
    process.exit(1)
  }
}

console.log(`OK: ${raw.length} site claims`)

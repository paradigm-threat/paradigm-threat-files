#!/usr/bin/env bash
# Pre-push SSR smoke for relay.paradigmthreat.net park (local gateway).
set -euo pipefail

HOST="${SSR_SMOKE_HOST:-relay.paradigmthreat.net}"
PORT="${SSR_SMOKE_PORT:-8080}"
URL="http://127.0.0.1:${PORT}/"

body="$(curl -fsS -H "Host: ${HOST}" -H 'Accept: text/html' "$URL")"

echo "$body" | grep -q 'data-pt-article' || {
  echo "FAIL: missing data-pt-article (article-first SSR) in body" >&2
  exit 1
}

echo "$body" | grep -q 'Welcome to Paradigm Threat' || {
  echo "FAIL: missing article heading text in SSR HTML" >&2
  exit 1
}

echo "$body" | grep -q 'data-pt-toc' || {
  echo "FAIL: missing data-pt-toc (SSR TOC from same extract) in body" >&2
  exit 1
}

echo "$body" | grep -q 'pt-changelog' || {
  echo "FAIL: missing pt-changelog used-class marker in SSR body" >&2
  exit 1
}

echo "$body" | grep -qi 'Paradigm Threat' || {
  echo "FAIL: missing Paradigm Threat brand marker" >&2
  exit 1
}

# P2 catalog must not fan out on SSR (placeholder, not full directory tree).
echo "$body" | grep -q 'data-pt-dirnav-ssr' || {
  echo "FAIL: missing data-pt-dirnav-ssr (DirNav should stay hydrate-only)" >&2
  exit 1
}

echo "OK: SSR smoke passed for Host=${HOST} (${URL})"

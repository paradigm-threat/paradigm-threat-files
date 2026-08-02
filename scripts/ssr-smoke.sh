#!/usr/bin/env bash
# Pre-push SSR smoke for relay.paradigmthreat.net park (local gateway).
# Prefer: ~/dev/relay/relay-gateway/scripts/park-local.sh serve  then  smoke
# Default local port 9080 (Kubo often owns :8080). Docs: docs/RELAY_PARK_HARDENING.md
set -euo pipefail

HOST="${SSR_SMOKE_HOST:-relay.paradigmthreat.net}"
PORT="${SSR_SMOKE_PORT:-9080}"
URL="http://127.0.0.1:${PORT}/"

body="$(curl -fsS -H "Host: ${HOST}" -H 'Accept: text/html' "$URL")"

# SSR HTML is often one huge line — avoid piping through grep (line-length / binary pitfalls).
has() {
  case "$body" in
    *"$1"*) return 0 ;;
    *) return 1 ;;
  esac
}

has 'data-pt-article' || {
  echo "FAIL: missing data-pt-article (article-first SSR) in body" >&2
  exit 1
}

has 'Welcome to Paradigm Threat' || {
  echo "FAIL: missing article heading text in SSR HTML" >&2
  exit 1
}

has 'data-pt-toc' || {
  echo "FAIL: missing data-pt-toc (SSR TOC from same extract) in body" >&2
  exit 1
}

has 'pt-changelog' || {
  echo "FAIL: missing pt-changelog used-class marker in SSR body" >&2
  exit 1
}

has 'Paradigm Threat' || {
  echo "FAIL: missing Paradigm Threat brand marker" >&2
  exit 1
}

# P2 catalog must not fan out on SSR (placeholder, not full directory tree).
has 'data-pt-dirnav-ssr' || {
  echo "FAIL: missing data-pt-dirnav-ssr (DirNav should stay hydrate-only)" >&2
  exit 1
}

echo "OK: SSR smoke passed for Host=${HOST} (${URL})"

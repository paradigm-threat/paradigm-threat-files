#!/usr/bin/env bash
# Pre-push SSR smoke for relay.paradigmthreat.net park (local gateway).
set -euo pipefail

HOST="${SSR_SMOKE_HOST:-relay.paradigmthreat.net}"
PORT="${SSR_SMOKE_PORT:-8080}"
URL="http://127.0.0.1:${PORT}/"

body="$(curl -fsS -H "Host: ${HOST}" -H 'Accept: text/html' "$URL")"

echo "$body" | grep -q 'pt-changelog' || {
  echo "FAIL: missing pt-changelog in SSR body" >&2
  exit 1
}

echo "$body" | grep -qi 'Paradigm Threat' || {
  echo "FAIL: missing Paradigm Threat brand marker" >&2
  exit 1
}

echo "OK: SSR smoke passed for Host=${HOST} (${URL})"

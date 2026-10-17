#!/usr/bin/env bash
# Pre-push SSR smoke for relay.paradigmthreat.net park (local gateway).
# Prefer: ~/dev/relay/relay-gateway/scripts/park-local.sh serve  then  smoke
# Default local port 9080 (Kubo often owns :8080). Docs: docs/RELAY_PARK_HARDENING.md
set -euo pipefail

HOST="${SSR_SMOKE_HOST:-relay.paradigmthreat.net}"
PORT="${SSR_SMOKE_PORT:-9080}"
BASE="http://127.0.0.1:${PORT}"
HOME_URL="${BASE}/"
# Stable article with long Directory title (wrap regression; no ChatRoom → no LiveChat).
ARTICLE_PATH="${SSR_SMOKE_ARTICLE:-/influence/predictive_programming/fiction_encoding/hesse/hesse-steppenwolf-jung-ware-refile-investigation.md}"
ARTICLE_URL="${BASE}${ARTICLE_PATH}"
# Markdown <ChatRoom /> embed regression.
CHATROOM_PATH="${SSR_SMOKE_CHATROOM:-/science/nukes/chat_nukes.md}"
CHATROOM_URL="${BASE}${CHATROOM_PATH}"

# SSR HTML is often one huge line — avoid piping through grep (line-length / binary pitfalls).
has() {
  case "$1" in
    *"$2"*) return 0 ;;
    *) return 1 ;;
  esac
}

forbid() {
  case "$1" in
    *"$2"*) return 1 ;;
    *) return 0 ;;
  esac
}

fetch_body() {
  local url="$1"
  curl -fsS -H "Host: ${HOST}" -H 'Accept: text/html' "$url"
}

check_no_runtime_error() {
  local label="$1"
  local body="$2"

  forbid "$body" 'relay-error-boundary' || {
    echo "FAIL: ${label}: relay-error-boundary present (CleverScript runtime error)" >&2
    exit 1
  }
  forbid "$body" 'Runtime error' || {
    echo "FAIL: ${label}: Runtime error text present in SSR HTML" >&2
    exit 1
  }
  forbid "$body" "Property 'origin' not found" || {
    echo "FAIL: ${label}: LiveChat origin property throw leaked into HTML" >&2
    exit 1
  }
}

# Plain pages: no shell auto-chat slot; LiveChat host only via <ChatRoom />.
check_plain_page() {
  local label="$1"
  local url="$2"
  local body
  body="$(fetch_body "$url")" || {
    echo "FAIL: ${label}: curl failed for ${url}" >&2
    exit 1
  }
  check_no_runtime_error "$label" "$body"
  forbid "$body" 'pt-live-chat-slot' || {
    echo "FAIL: ${label}: unexpected pt-live-chat-slot (shell auto-chat should be removed)" >&2
    exit 1
  }
}

check_chatroom_page() {
  local label="$1"
  local url="$2"
  local body
  body="$(fetch_body "$url")" || {
    echo "FAIL: ${label}: curl failed for ${url}" >&2
    exit 1
  }
  check_no_runtime_error "$label" "$body"
  forbid "$body" 'pt-live-chat-slot' || {
    echo "FAIL: ${label}: unexpected pt-live-chat-slot" >&2
    exit 1
  }
  has "$body" 'pt-chatroom-live' || {
    echo "FAIL: ${label}: missing pt-chatroom-live wrapper from <ChatRoom />" >&2
    exit 1
  }
  has "$body" 'fb-live-chat-host' || has "$body" 'data-relay-park-native="fb-live-chat"' || has "$body" "data-relay-park-native='fb-live-chat'" || {
    echo "FAIL: ${label}: missing LiveChat host marker on ChatRoom page" >&2
    exit 1
  }
  has "$body" 'data-channel="pt-nukes"' || has "$body" "data-channel='pt-nukes'" || {
    echo "FAIL: ${label}: expected data-channel=pt-nukes from <ChatRoom channel=\"nukes\" />" >&2
    exit 1
  }
}

body="$(fetch_body "$HOME_URL")"

has "$body" 'data-pt-article' || {
  echo "FAIL: missing data-pt-article (article-first SSR) in body" >&2
  exit 1
}

has "$body" 'Welcome to Paradigm Threat' || {
  echo "FAIL: missing article heading text in SSR HTML" >&2
  exit 1
}

has "$body" 'data-pt-toc' || {
  echo "FAIL: missing data-pt-toc (SSR TOC from same extract) in body" >&2
  exit 1
}

has "$body" 'pt-changelog' || {
  echo "FAIL: missing pt-changelog used-class marker in SSR body" >&2
  exit 1
}

has "$body" 'pt-dead-link' || {
  echo "FAIL: missing pt-dead-link used-class marker in SSR body" >&2
  exit 1
}

has "$body" 'Paradigm Threat' || {
  echo "FAIL: missing Paradigm Threat brand marker" >&2
  exit 1
}

# P2 catalog must not fan out on SSR (placeholder, not full directory tree).
has "$body" 'data-pt-dirnav-ssr' || {
  echo "FAIL: missing data-pt-dirnav-ssr (DirNav should stay hydrate-only)" >&2
  exit 1
}

# Directory wrap / contrast tokens (theme prune + style regression).
has "$body" 'overflow-wrap' || has "$body" 'overflowWrap' || {
  echo "FAIL: missing overflow-wrap / overflowWrap (Directory label wrap) in SSR CSS/HTML" >&2
  exit 1
}
has "$body" 'pt-dir-file-link' || {
  echo "FAIL: missing pt-dir-file-link used-class marker" >&2
  exit 1
}
has "$body" 'pt-dir-count' || {
  echo "FAIL: missing pt-dir-count used-class marker" >&2
  exit 1
}
has "$body" '#e2e8f0' || has "$body" 'dirFg' || {
  echo "FAIL: missing dark Directory contrast token (#e2e8f0 or dirFg)" >&2
  exit 1
}

check_plain_page "home" "$HOME_URL"
check_plain_page "article" "$ARTICLE_URL"
check_chatroom_page "chatroom" "$CHATROOM_URL"

echo "OK: SSR smoke passed for Host=${HOST} (plain pages no slot + ChatRoom LiveChat / no error boundary)"

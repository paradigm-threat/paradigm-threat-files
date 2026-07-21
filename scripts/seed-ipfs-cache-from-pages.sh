#!/usr/bin/env bash
# Seed Relay IPFS disk cache from GitLab Pages binaries for thin tip stubs.
# Run on a master (dfw1): bash scripts/seed-ipfs-cache-from-pages.sh [path...]
set -euo pipefail

PAGES="${PAGES_MIRROR:-https://paradigm-threat-files-69f9dc.gitlab.io}"
CACHE="${RELAY_IPFS_CACHE_ROOT:-/tmp/ipfs-cache}"
HOST="${RELAY_HOST:-relay.paradigmthreat.net}"
LOCAL="${RELAY_LOCAL:-http://127.0.0.1:8080}"

seed_one() {
  local path="${1#/}"
  local stub cid
  stub=$(curl -fsS -H "Host: $HOST" "$LOCAL/$path" || true)
  cid=$(printf '%s' "$stub" | awk 'NR==2{print; exit}')
  if [[ -z "${cid:-}" || "$cid" != baf* ]]; then
    # already binary?
    if printf '%s' "$stub" | head -c 3 | grep -q $'\xff\xd8\xff'; then
      echo "ok already jpeg $path"
      return 0
    fi
    echo "skip no-cid $path" >&2
    return 0
  fi
  echo "seed $path -> $cid"
  sudo -u relay mkdir -p "$CACHE/$cid"
  sudo -u relay curl -fsSL -o "$CACHE/$cid/data" "$PAGES/$path"
  local sz
  sz=$(sudo -u relay wc -c <"$CACHE/$cid/data")
  local ct=image/jpeg
  case "$path" in
    *.png|*.PNG) ct=image/png ;;
    *.gif|*.GIF) ct=image/gif ;;
    *.webp|*.WEBP) ct=image/webp ;;
  esac
  sudo -u relay python3 -c "import json,time; open('$CACHE/$cid/meta.json','w').write(json.dumps({'content_type':'$ct','size':$sz,'fetched_at':int(time.time())}))"
  sudo -u relay touch "$CACHE/$cid/.access"
}

if [[ $# -gt 0 ]]; then
  for p in "$@"; do seed_one "$p"; done
  exit 0
fi

# Default: every IPFS stub under common media roots (cap runtime).
while IFS= read -r -d '' f; do
  rel=${f#./}
  seed_one "$rel"
done < <(find influence history cosmos science governance events blog book -type f \
  \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' -o -name '*.gif' -o -name '*.webp' \) \
  -print0 2>/dev/null | head -z -n 400)

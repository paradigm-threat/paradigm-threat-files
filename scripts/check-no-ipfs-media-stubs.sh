#!/usr/bin/env bash
# Fail if any tracked path holds a relay-ipfs-v1 stub at a media/binary path.
# Checks the index (what the next commit will contain). See docs/MEDIA_AND_IPFS.md.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

is_stub() {
  local path="$1" first
  git cat-file -e ":$path" 2>/dev/null || return 1
  first="$(git cat-file blob ":$path" | head -n 1 || true)"
  [[ "$first" == "relay-ipfs-v1" ]]
}

while IFS= read -r -d '' path; do
  [[ -z "$path" ]] && continue
  if is_stub "$path"; then
    printf '%s\n' "$path" >>"$tmp"
  fi
done < <(
  git ls-files -z -- \
    '*.png' '*.PNG' '*.jpg' '*.JPG' '*.jpeg' '*.JPEG' '*.webp' '*.gif' '*.GIF' \
    '*.svg' '*.ico' '*.bmp' '*.tif' '*.tiff' '*.pdf' '*.PDF' \
    '*.mp4' '*.m4a' '*.webm' '*.mp3' '*.wav' '*.mov'
)

while IFS= read -r -d '' path; do
  [[ -z "$path" ]] && continue
  base="$(basename "$path")"
  [[ "$base" == *.* ]] && continue
  if is_stub "$path"; then
    printf '%s\n' "$path" >>"$tmp"
  fi
done < <(git ls-files -z)

sort -u "$tmp" -o "$tmp"

if [[ -s "$tmp" ]]; then
  echo "ERROR: relay-ipfs-v1 text stubs at binary/media paths (forbidden in fat repo):" >&2
  cat "$tmp" >&2
  echo "See docs/MEDIA_AND_IPFS.md — restore real binaries; use assets.manifest.json as index only." >&2
  exit 1
fi

echo "OK: no inline IPFS stubs at media paths"

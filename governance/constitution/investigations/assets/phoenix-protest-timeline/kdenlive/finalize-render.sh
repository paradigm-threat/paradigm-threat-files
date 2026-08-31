#!/usr/bin/env bash
# Sync edited SRT from Kdenlive gaps, embed soft subs in chansley-fox10-packup.mkv.
set -euo pipefail
ASSET="$(cd "$(dirname "$0")/.." && pwd)"
K="$ASSET/kdenlive"
MKV="$ASSET/chansley-fox10-packup.mkv"
SRC="$ASSET/chansley-fox10-packup.source.mkv"
SRT="$K/VID_20200624_110648-captions-edited-timeline.srt"
TMP="$ASSET/chansley-fox10-packup.subs.mkv"

python3 "$K/sync-edited-srt-from-kdenlive.py"

while pgrep -f "melt.*kdenlive" >/dev/null 2>&1; do
  echo "Waiting for Kdenlive/melt render..."
  sleep 5
done

# Source = clean Kdenlive export (no subs). Preserve first good export.
if [[ -s "$MKV" && ! -s "$SRC" ]]; then
  cp -a "$MKV" "$SRC"
fi
INPUT="${SRC:-}"
[[ -s "$INPUT" ]] || INPUT="$MKV"
[[ -s "$INPUT" ]] || { echo "Missing render: $MKV" >&2; exit 1; }

ffmpeg -y -i "$INPUT" -i "$SRT" \
  -map 0:v -map 0:a -map 1 \
  -c:v copy -c:a copy -c:s srt \
  -disposition:s:0 default \
  -metadata:s:s:0 language=eng \
  -metadata:s:s:0 title="Edited timeline" \
  "$TMP"

mv "$TMP" "$MKV"
rm -f "$ASSET/chansley-fox10-packup.subs.mkv" 2>/dev/null || true

ffprobe -hide_banner "$MKV" 2>&1 | rg "Duration|Stream"
echo "Wrote $MKV (embedded soft subs from $SRT; clean source at $SRC)"

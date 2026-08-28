#!/usr/bin/env bash
# Sync edited SRT from Kdenlive gaps, burn subs into final pause mp4.
set -euo pipefail
ASSET="$(cd "$(dirname "$0")/.." && pwd)"
K="$ASSET/kdenlive"
MKV="$ASSET/chansley-fox10-packup.mkv"
[[ -s "$MKV" ]] || MKV="$K/chansley-fox10-packup.mkv"
SRT="$K/VID_20200624_110648-captions-edited-timeline.srt"
OUT="$ASSET/VID_20200624_110648-fox10-packup-pause.mp4"

python3 "$K/sync-edited-srt-from-kdenlive.py"

while pgrep -f "melt.*kdenlive" >/dev/null 2>&1; do
  echo "Waiting for Kdenlive/melt render..."
  sleep 5
done
sleep 2

[[ -s "$MKV" ]] || { echo "Missing render: $MKV" >&2; exit 1; }

ffmpeg -y -i "$MKV" \
  -vf "subtitles='${SRT}':force_style='FontName=DejaVu Sans,FontSize=22,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1,MarginV=40'" \
  -c:v libx264 -crf 20 -preset medium \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUT"

ffprobe -hide_banner "$OUT" 2>&1 | rg "Duration|Stream"
echo "Wrote $OUT"

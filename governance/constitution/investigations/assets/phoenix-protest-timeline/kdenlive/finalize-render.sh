#!/usr/bin/env bash
# After Kdenlive render: sync edited SRT from project, burn subs, write final mp4.
set -euo pipefail
ASSET="$(cd "$(dirname "$0")/.." && pwd)"
K="$ASSET/kdenlive"
MKV="$K/chansley-fox10-packup.mkv"
SRT="$K/VID_20200624_110648-captions-edited-timeline.srt"
OUT="$ASSET/VID_20200624_110648-fox10-packup-pause.mp4"

python3 "$K/sync-edited-srt-from-kdenlive.py"

if [[ ! -s "$MKV" ]]; then
  echo "Missing render: $MKV" >&2
  exit 1
fi

# Wait for melt if still writing.
while pgrep -f "melt.*kdenlive" >/dev/null 2>&1; do
  echo "Waiting for Kdenlive/melt render..."
  sleep 5
done
sleep 2

ffmpeg -y -i "$MKV" \
  -vf "subtitles='${SRT}':force_style='FontName=DejaVu Sans,FontSize=22,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1,MarginV=40'" \
  -c:v libx264 -crf 20 -preset medium \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUT"

ffprobe -hide_banner "$OUT" 2>&1 | rg "Duration|Stream"
echo "Wrote $OUT (subs from $SRT; original SRT unchanged at ${ASSET}/VID_20200624_110648-captions.srt)"

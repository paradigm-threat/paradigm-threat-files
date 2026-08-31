#!/usr/bin/env bash
# Instagram/Reels export: 1080x1920 H.264 + AAC, burned subs.
set -euo pipefail
ASSET="$(cd "$(dirname "$0")/.." && pwd)"
MKV="$ASSET/chansley-fox10-packup.mkv"
SRT="$ASSET/chansley-fox10-packup.en.srt"
OUT="$ASSET/chansley-fox10-packup-instagram.mp4"
STYLE="FontName=DejaVu Sans,FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1,MarginV=80,Alignment=2"

python3 "$(dirname "$0")/sync-edited-srt-from-kdenlive.py"
cp "$ASSET/kdenlive/VID_20200624_110648-captions-edited-timeline.srt" "$SRT"

ffmpeg -y -i "$MKV" \
  -vf "scale=1080:1920:flags=lanczos,subtitles='${SRT}':force_style='${STYLE}',format=yuv420p" \
  -c:v libx264 -profile:v high -level 4.2 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 48000 -ac 2 \
  -movflags +faststart \
  "$OUT"

ls -lh "$OUT"
ffprobe -hide_banner "$OUT" 2>&1 | rg "Duration|Stream"

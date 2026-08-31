#!/usr/bin/env bash
# VID_20200624_110943 renders: soft-sub MKV (lossless) + burned-in Instagram MP4.
# Source is the rotated upright working copy (transpose=2 from the read-only Takeout
# file). Never touch the Takeout original.
set -euo pipefail
ASSET="$(cd "$(dirname "$0")/.." && pwd)"
BASE="VID_20200624_110943"
SRC="$ASSET/$BASE.mp4"
SRT="$ASSET/$BASE-captions-annotated.srt"
MKV="$ASSET/$BASE-annotated.mkv"
IG="$ASSET/$BASE-instagram.mp4"

# Source is landscape 3840x2160; Instagram gets a 1080x1920 canvas with the frame
# centered and captions burned into the lower bar. libass scales these script units
# up by ~3x against the 1080x1920 canvas, so FontSize stays small like the 110648 export.
STYLE="FontName=DejaVu Sans,FontSize=11,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BorderStyle=1,Outline=2,Shadow=1,MarginV=30,MarginL=30,MarginR=30,Alignment=2"

[[ -s "$SRC" ]] || { echo "Missing source: $SRC" >&2; exit 1; }
[[ -s "$SRT" ]] || { echo "Missing subtitles: $SRT" >&2; exit 1; }

# 1. Soft subtitles — stream copy, selectable English track.
ffmpeg -y -i "$SRC" -i "$SRT" \
  -map 0:v -map 0:a -map 1 \
  -c:v copy -c:a copy -c:s srt \
  -disposition:s:0 default \
  -metadata:s:s:0 language=eng \
  -metadata:s:s:0 title="Speaker-annotated transcript" \
  "$MKV"

# 2. Burned-in subtitles for Instagram feed / reels.
ffmpeg -y -i "$SRC" \
  -vf "scale=1080:-2:flags=lanczos,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,subtitles='${SRT}':force_style='${STYLE}',format=yuv420p" \
  -c:v libx264 -profile:v high -level 4.2 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 48000 -ac 2 \
  -movflags +faststart \
  "$IG"

ls -lh "$MKV" "$IG"
ffprobe -hide_banner "$MKV" 2>&1 | rg "Duration|Stream"
ffprobe -hide_banner "$IG" 2>&1 | rg "Duration|Stream"

#!/usr/bin/env bash
# Rebuild freeze segment + final edited render. Does not touch the original mp4.
set -euo pipefail
ASSET="$(cd "$(dirname "$0")/.." && pwd)"
K="$ASSET/kdenlive"
ORIG="$ASSET/VID_20200624_110648.mp4"
SRT="$K/VID_20200624_110648-captions-edited-timeline.srt"
OUT="$ASSET/VID_20200624_110648-fox10-packup-pause.mp4"

python3 "$K/build-arrow-overlay.py"

ffmpeg -y -loop 1 -i "$K/frame-0106.jpg" -i "$K/fox10-packup-arrow-1080.png" \
  -filter_complex "[0][1]overlay=0:0,scale=1080:1920,zoompan=z='min(1.4,1+0.4*on/300)':x='0':y='min(ih-ih/zoom,max(0,ih*0.50-ih/zoom/2))':d=300:s=1080x1920:fps=30,format=yuv420p" \
  -t 10 -an -c:v libx264 -crf 18 -preset medium "$K/freeze-zoom-10s.mp4"

ffmpeg -y -i "$ORIG" -i "$K/freeze-zoom-10s.mp4" -i "$SRT" \
  -filter_complex "
[0:v]trim=duration=66,setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,setsar=1,fps=30[v1];
[0:a]atrim=duration=66,asetpts=PTS-STARTPTS[a1];
[1:v]setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v2];
anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=10,asetpts=PTS-STARTPTS[a2];
[0:v]trim=start=66,setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,setsar=1,fps=30[v3];
[0:a]atrim=start=66,asetpts=PTS-STARTPTS[a3];
[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[vout][aout];
[vout]subtitles='$SRT':force_style='FontName=DejaVu Sans,FontSize=22,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1,MarginV=40'[vsub]
" \
  -map "[vsub]" -map "[aout]" \
  -c:v libx264 -crf 20 -preset medium -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUT"

ffprobe -hide_banner "$OUT" 2>&1 | rg "Duration|Video|Audio|Stream"
echo "Wrote $OUT"

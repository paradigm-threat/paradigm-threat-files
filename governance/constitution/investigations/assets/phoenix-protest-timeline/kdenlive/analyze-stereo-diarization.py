#!/usr/bin/env python3
"""Score SRT cues by stereo channel energy — 110943 left=author, right=pro-Q."""
from __future__ import annotations

import argparse
import array
import re
import subprocess
import sys
import wave
from dataclasses import dataclass
from pathlib import Path

BASE = Path(__file__).resolve().parent
ASSET = BASE.parent
DEFAULT_VIDEO = ASSET / "VID_20200624_110943.mp4"
DEFAULT_SRT = ASSET / "VID_20200624_110943-captions-annotated.srt"
AUDIO_DIR = ASSET / "audio"
LEFT_WAV = AUDIO_DIR / "110943-left-author.wav"
RIGHT_WAV = AUDIO_DIR / "110943-right-proq.wav"


@dataclass
class Cue:
    index: int
    start: float
    end: float
    text: str


def tc(h: int, m: int, s: int, ms: int) -> float:
    return h * 3600 + m * 60 + s + ms / 1000.0


def parse_srt(path: Path) -> list[Cue]:
    cues: list[Cue] = []
    blocks = re.split(r"\n\s*\n", path.read_text(encoding="utf-8").strip())
    for block in blocks:
        lines = block.strip().splitlines()
        if len(lines) < 3:
            continue
        if not lines[0].isdigit():
            continue
        m = re.match(
            r"(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})",
            lines[1],
        )
        if not m:
            continue
        g = [int(x) for x in m.groups()]
        cues.append(
            Cue(
                int(lines[0]),
                tc(*g[0:4]),
                tc(*g[4:8]),
                "\n".join(lines[2:]),
            )
        )
    return cues


def ensure_split_wavs(video: Path) -> tuple[Path, Path]:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    for out, pan in ((LEFT_WAV, "FL"), (RIGHT_WAV, "FR")):
        if not out.exists() or out.stat().st_mtime < video.stat().st_mtime:
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-i",
                    str(video),
                    "-vn",
                    "-af",
                    f"pan=mono|c0={pan}",
                    "-ac",
                    "1",
                    str(out),
                ],
                check=True,
            )
    return LEFT_WAV, RIGHT_WAV


def rms_wav(path: Path, t0: float, t1: float) -> float:
    with wave.open(str(path), "rb") as w:
        rate = w.getframerate()
        samples = array.array("h", w.readframes(w.getnframes()))
    i0, i1 = int(t0 * rate), int(t1 * rate)
    chunk = samples[i0:i1]
    if not chunk:
        return 0.0
    return (sum(s * s for s in chunk) / len(chunk)) ** 0.5


def classify(lr: float, rr: float, ratio_hi: float = 1.3) -> str:
    if lr < 300 and rr < 300:
        return "silent"
    if lr > rr * ratio_hi:
        return "left/author"
    if rr > lr * ratio_hi:
        return "right/pro-Q"
    return "mixed"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--video", type=Path, default=DEFAULT_VIDEO)
    ap.add_argument("--srt", type=Path, default=DEFAULT_SRT)
    ap.add_argument("--extract-only", action="store_true")
    args = ap.parse_args()

    if not args.video.exists():
        print(f"Missing video: {args.video}", file=sys.stderr)
        return 1

    left, right = ensure_split_wavs(args.video)
    if args.extract_only:
        print(f"Wrote {left}\nWrote {right}")
        return 0

    if not args.srt.exists():
        print(f"Missing SRT: {args.srt}", file=sys.stderr)
        return 1

    print(f"Stereo map: LEFT={left.name} (author)  RIGHT={right.name} (pro-Q)\n")
    print(f"{'#':>3}  {'start':>7}  {'dom':<12}  {'L':>7}  {'R':>7}  label / text")
    print("-" * 90)

    for cue in parse_srt(args.srt):
        if cue.text.startswith("[Scene") or cue.text.startswith("Jun 24"):
            continue
        lr = rms_wav(left, cue.start, cue.end)
        rr = rms_wav(right, cue.start, cue.end)
        dom = classify(lr, rr)
        tag = cue.text.split("]", 1)[0] + "]" if cue.text.startswith("[") else cue.text[:40]
        flag = " *** MIXED" if dom == "mixed" and "uncertain" not in cue.text.lower() else ""
        print(
            f"{cue.index:3d}  {cue.start:7.2f}  {dom:<12}  {lr:7.0f}  {rr:7.0f}  {tag}{flag}"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

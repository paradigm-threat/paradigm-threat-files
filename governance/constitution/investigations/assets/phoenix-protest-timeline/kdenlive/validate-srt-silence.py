#!/usr/bin/env python3
"""Validate SRT timing against ffmpeg silence detection + Kdenlive gap windows."""
from __future__ import annotations

import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

BASE = Path(__file__).resolve().parent
ASSET = BASE.parent
PROJECT = BASE / "chansley-fox10-packup.kdenlive"


@dataclass
class Span:
    start: float
    end: float
    label: str = ""

    @property
    def duration(self) -> float:
        return self.end - self.start


@dataclass
class Cue:
    start: float
    end: float
    text: str


def tc(s: str) -> float:
    s = s.replace(";", ":")
    p = [float(x) for x in s.split(":")]
    if len(p) == 4:
        return p[0] * 3600 + p[1] * 60 + p[2] + p[3] / 30
    return p[0] * 3600 + p[1] * 60 + p[2]


def parse_srt(path: Path) -> list[Cue]:
    cues: list[Cue] = []
    for block in re.split(r"\n\s*\n", path.read_text(encoding="utf-8").strip()):
        lines = block.strip().splitlines()
        if len(lines) < 3:
            continue
        m = re.match(
            r"(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})",
            lines[1],
        )
        if not m:
            continue
        g = [int(x) for x in m.groups()]

        def pack(a, b, c, d):
            return a * 3600 + b * 60 + c + d / 1000.0

        cues.append(Cue(pack(*g[0:4]), pack(*g[4:8]), "\n".join(lines[2:])))
    return cues


def detect_silence(path: Path, noise_db: float = -35, min_dur: float = 0.25) -> list[Span]:
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-i",
        str(path),
        "-af",
        f"silencedetect=noise={noise_db}dB:d={min_dur}",
        "-f",
        "null",
        "-",
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    log = proc.stderr
    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", log)]
    spans: list[Span] = []
    i = j = 0
    while i < len(starts) or j < len(ends):
        if j >= len(ends) or (i < len(starts) and starts[i] < ends[j]):
            s = starts[i]
            e = ends[j] if j < len(ends) and ends[j] > s else s
            if j < len(ends) and ends[j] > s:
                spans.append(Span(s, ends[j], "silence"))
                j += 1
            i += 1
        else:
            j += 1
    # Pair any unmatched starts with file end.
    dur = ffprobe_duration(path)
    for s in starts:
        if not any(abs(sp.start - s) < 0.01 for sp in spans):
            spans.append(Span(s, dur, "silence-tail"))
    spans.sort(key=lambda x: x.start)
    return merge_spans(spans)


def ffprobe_duration(path: Path) -> float | None:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ],
        text=True,
    ).strip()
    try:
        return float(out)
    except ValueError:
        return None


def merge_spans(spans: list[Span], gap: float = 0.05) -> list[Span]:
    if not spans:
        return []
    spans = sorted(spans, key=lambda s: s.start)
    out = [spans[0]]
    for sp in spans[1:]:
        if sp.start <= out[-1].end + gap:
            out[-1].end = max(out[-1].end, sp.end)
        else:
            out.append(sp)
    return out


def parse_kdenlive_gaps(path: Path) -> list[Span]:
    root = ET.parse(path).getroot()
    audio = root.find(".//playlist[@id='playlist2']")
    video = root.find(".//playlist[@id='playlist4']")
    blanks = [tc(b.get("length", "0")) for b in audio.findall("blank")]
    entries = video.findall("entry")
    gaps: list[Span] = []
    timeline = 0.0
    blank_i = 0
    for entry in entries:
        prod = entry.get("producer", "")
        src_in = tc(entry.get("in", "0"))
        src_out = tc(entry.get("out", "0"))
        if prod.startswith("chain"):
            seg = src_out - src_in
            if seg <= 0:
                continue
            timeline += seg
        elif prod.startswith("producer"):
            dur = blanks[blank_i] if blank_i < len(blanks) else tc(entry.get("out", "0"))
            blank_i += 1
            gaps.append(Span(timeline, timeline + dur, entry.get("producer", "freeze")))
            timeline += dur
    return gaps


def overlap(a: Span, b: Span) -> float:
    return max(0.0, min(a.end, b.end) - max(a.start, b.start))


def is_scene(text: str) -> bool:
    return text.strip().startswith("[Scene")


def validate(video: Path, srt: Path, expected_gaps: list[Span] | None = None) -> int:
    print(f"\n=== {video.name} + {srt.name} ===")
    dur = ffprobe_duration(video)
    if dur is None:
        print("duration: N/A (render in progress?)")
        return 0
    print(f"duration: {dur:.3f}s")
    silence = detect_silence(video)
    cues = parse_srt(srt)
    speech = [c for c in cues if not is_scene(c.text)]
    scenes = [c for c in cues if is_scene(c.text)]

    issues = 0
    for c in speech:
        mid = (c.start + c.end) / 2
        in_silence = [s for s in silence if s.start <= mid <= s.end]
        if in_silence:
            issues += 1
            print(
                f"WARN speech mid in silence {in_silence[0].start:.2f}-{in_silence[0].end:.2f}: "
                f"{c.start:.2f}-{c.end:.2f} {c.text[:60]!r}"
            )

    if expected_gaps:
        print("expected freeze gaps:")
        for g in expected_gaps:
            print(f"  {g.start:.3f}-{g.end:.3f} ({g.duration:.3f}s) {g.label}")
            mid = (g.start + g.end) / 2
            silent_hit = any(s.start <= mid <= s.end for s in silence)
            if not silent_hit:
                issues += 1
                print(f"  WARN gap mid {mid:.2f}s not inside detected silence")
            scene_hits = [c for c in scenes if overlap(Span(c.start, c.end), g) > 0.5]
            if not scene_hits:
                print(f"  note: no scene cue covers gap")
            else:
                for c in scene_hits:
                    print(f"  scene cue {c.start:.2f}-{c.end:.2f}: {c.text[:50]}")

    long_sil = [s for s in silence if s.duration >= 1.0]
    print(f"detected silence regions (>={1.0}s): {len(long_sil)}")
    for s in long_sil[:8]:
        print(f"  {s.start:.2f}-{s.end:.2f} ({s.duration:.2f}s)")
    print(f"speech cues: {len(speech)}, scene cues: {len(scenes)}, issues: {issues}")
    return issues


def main() -> None:
    orig = ASSET / "VID_20200624_110648.mp4"
    edited = ASSET / "VID_20200624_110648-fox10-packup-pause.mp4"
    mkv = BASE / "chansley-fox10-packup.mkv"
    orig_srt = ASSET / "VID_20200624_110648-captions.srt"
    edit_srt = BASE / "VID_20200624_110648-captions-edited-timeline.srt"

    total = 0
    if orig.exists():
        total += validate(orig, orig_srt)
    target = edited if edited.exists() else mkv
    if target.exists():
        td = ffprobe_duration(target)
        if td and td > 1:
            gaps = parse_kdenlive_gaps(PROJECT) if PROJECT.exists() else None
            total += validate(target, edit_srt, gaps)
        else:
            print(f"\nSkip edited validation — render not finished ({target.name})")
    sys.exit(1 if total else 0)


if __name__ == "__main__":
    main()

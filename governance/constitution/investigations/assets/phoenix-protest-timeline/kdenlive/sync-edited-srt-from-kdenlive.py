#!/usr/bin/env python3
"""Build edited-timeline SRT from original captions + Kdenlive gap inserts."""
from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

BASE = Path(__file__).resolve().parent
ASSET = BASE.parent
PROJECT = BASE / "chansley-fox10-packup.kdenlive"
ORIG_SRT = ASSET / "VID_20200624_110648-captions.srt"
EDITED_SRT = BASE / "VID_20200624_110648-captions-edited-timeline.srt"

PACKUP_SCENE = "[Scene — FOX 10 cam turns away, left; Chansley still yelling]"
BADGE_SCENE = "[Scene — FOX 10 on Chansley beat]"


@dataclass
class Gap:
    source_at: float
    duration: float
    timeline_start: float
    scene_text: str


@dataclass
class Cue:
    index: int
    start: float
    end: float
    text: str


def timecode_to_seconds(tc: str) -> float:
    tc = tc.replace(";", ":")
    parts = [float(p) for p in tc.split(":")]
    if len(parts) == 4:
        h, m, s, f = parts
        return h * 3600 + m * 60 + s + f / 30.0
    h, m, s = parts
    return h * 3600 + m * 60 + s


def seconds_to_srt(t: float) -> str:
    t = max(0.0, t)
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = int(t % 60)
    ms = int(round((t - int(t)) * 1000))
    if ms >= 1000:
        ms = 0
        s += 1
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def parse_gaps(path: Path) -> list[Gap]:
    """Read video playlist structure + audio blank durations."""
    root = ET.parse(path).getroot()
    audio = root.find(".//playlist[@id='playlist2']")
    video = root.find(".//playlist[@id='playlist4']")
    if audio is None or video is None:
        raise SystemExit("playlist2/playlist4 not found")

    blanks = [timecode_to_seconds(b.get("length", "0")) for b in audio.findall("blank")]
    scene_texts = [BADGE_SCENE, PACKUP_SCENE]
    entries = video.findall("entry")

    gaps: list[Gap] = []
    timeline = 0.0
    blank_i = 0

    for i, entry in enumerate(entries):
        prod = entry.get("producer", "")
        src_in = timecode_to_seconds(entry.get("in", "0"))
        src_out = timecode_to_seconds(entry.get("out", "0"))

        if prod.startswith("chain"):
            seg = src_out - src_in
            if seg <= 0:
                continue
            timeline += seg
            continue

        if not prod.startswith("producer"):
            continue

        dur = blanks[blank_i] if blank_i < len(blanks) else timecode_to_seconds(entry.get("out", "0"))
        blank_i += 1

        # Source resume point = next chain segment in-time (insert happens before that point).
        source_at = src_in
        for nxt in entries[i + 1 :]:
            if nxt.get("producer", "").startswith("chain"):
                nxt_in = timecode_to_seconds(nxt.get("in", "0"))
                nxt_out = timecode_to_seconds(nxt.get("out", "0"))
                if nxt_out > nxt_in:
                    source_at = nxt_in
                    break

        gaps.append(
            Gap(
                source_at=source_at,
                duration=dur,
                timeline_start=timeline,
                scene_text=scene_texts[len(gaps)] if len(gaps) < len(scene_texts) else "[Scene — hold]",
            )
        )
        timeline += dur

    if len(gaps) != 2:
        raise SystemExit(f"expected 2 freeze gaps, found {len(gaps)}")
    return gaps


def source_to_edited(t: float, gaps: list[Gap]) -> float:
    offset = 0.0
    for gap in sorted(gaps, key=lambda g: g.source_at):
        if t < gap.source_at:
            return t + offset
        offset += gap.duration
    return t + offset


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

        cues.append(
            Cue(int(lines[0]), pack(*g[0:4]), pack(*g[4:8]), "\n".join(lines[2:]))
        )
    return cues


def split_points(gaps: list[Gap]) -> list[float]:
    return sorted({g.source_at for g in gaps if g.source_at > 0})


def map_cue(cue: Cue, gaps: list[Gap], splits: list[float]) -> list[Cue]:
    if cue.text.strip() in {PACKUP_SCENE, BADGE_SCENE}:
        return []

    points = [cue.start] + [s for s in splits if cue.start < s < cue.end] + [cue.end]
    out: list[Cue] = []
    for a, b in zip(points, points[1:]):
        if b <= a:
            continue
        out.append(Cue(cue.index, source_to_edited(a, gaps), source_to_edited(b, gaps), cue.text))
    return out


def build_edited_cues(orig: list[Cue], gaps: list[Gap]) -> list[Cue]:
    splits = split_points(gaps)
    out: list[Cue] = []
    for cue in orig:
        out.extend(map_cue(cue, gaps, splits))
    for gap in gaps:
        out.append(
            Cue(0, gap.timeline_start, gap.timeline_start + gap.duration, gap.scene_text)
        )
    out.sort(key=lambda c: (c.start, c.end))
    return [Cue(i, c.start, c.end, c.text) for i, c in enumerate(out, start=1)]


def write_srt(cues: list[Cue], path: Path) -> None:
    chunks = [
        f"{c.index}\n{seconds_to_srt(c.start)} --> {seconds_to_srt(c.end)}\n{c.text}\n"
        for c in cues
    ]
    path.write_text("\n".join(chunks) + "\n", encoding="utf-8")


def main() -> None:
    gaps = parse_gaps(PROJECT)
    if len(gaps) != 2:
        raise SystemExit(f"expected 2 gaps, found {len(gaps)}")
    edited = build_edited_cues(parse_srt(ORIG_SRT), gaps)
    write_srt(edited, EDITED_SRT)
    for i, g in enumerate(gaps, 1):
        print(
            f"gap{i}: source={g.source_at:.3f}s dur={g.duration:.3f}s "
            f"timeline={g.timeline_start:.3f}-{g.timeline_start + g.duration:.3f}s"
        )
    print(f"Wrote {len(edited)} cues -> {EDITED_SRT}")


if __name__ == "__main__":
    main()

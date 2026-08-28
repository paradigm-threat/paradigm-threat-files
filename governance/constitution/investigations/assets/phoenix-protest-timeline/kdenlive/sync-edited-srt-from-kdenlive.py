#!/usr/bin/env python3
"""Build edited-timeline SRT from original captions + Kdenlive pause/freeze timing."""
from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

BASE = Path(__file__).resolve().parent
ASSET = BASE.parent
PROJECT = BASE / "chansley-fox10-packup.kdenlive"
ORIG_SRT = ASSET / "VID_20200624_110648-captions.srt"
EDITED_SRT = BASE / "VID_20200624_110648-captions-edited-timeline.srt"

NS = {"k": "http://www.kdenlive.org/DTD/kdenlive"}

# Scene cue shown during the freeze hold (original clock).
FREEZE_SCENE_START = 66.0  # 1:06 — FOX 10 turning away
FREEZE_SCENE_TEXT = "[Scene — FOX 10 cam turns away, left; Chansley still yelling]"


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
    if len(parts) == 3:
        h, m, s = parts
        return h * 3600 + m * 60 + s
    raise ValueError(f"bad timecode: {tc}")


def seconds_to_srt(t: float) -> str:
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = int(t % 60)
    ms = int(round((t - int(t)) * 1000))
    if ms >= 1000:
        ms = 0
        s += 1
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def parse_kdenlive_timings(path: Path) -> tuple[float, float, float]:
    """Return (pause_at_source_sec, freeze_sec, timeline_part1_sec)."""
    root = ET.parse(path).getroot()
    pl = root.find(".//playlist[@id='playlist4']")
    if pl is None:
        raise SystemExit("playlist4 (video) not found in kdenlive project")

    entries = pl.findall("entry")
    if len(entries) < 3:
        raise SystemExit("expected part1 + spacer + freeze on playlist4")

    part1_end = timecode_to_seconds(entries[0].get("out", "0"))
    resume_in = timecode_to_seconds(entries[1].get("in", "0"))
    freeze_dur = timecode_to_seconds(entries[2].get("out", "0"))
    return resume_in, freeze_dur, part1_end


def parse_srt(path: Path) -> list[Cue]:
    raw = path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", raw.strip())
    cues: list[Cue] = []
    for block in blocks:
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
            Cue(
                index=int(lines[0]),
                start=pack(*g[0:4]),
                end=pack(*g[4:8]),
                text="\n".join(lines[2:]),
            )
        )
    return cues


def build_edited_cues(
    orig: list[Cue], pause_at: float, freeze_dur: float, part1_end: float
) -> list[Cue]:
    out: list[Cue] = []
    freeze_start = part1_end
    freeze_end = part1_end + freeze_dur

    for cue in orig:
        # Drop original pack-up scene cue; replaced by freeze-window cue.
        if cue.text.strip() == FREEZE_SCENE_TEXT:
            continue
        if cue.end <= pause_at:
            out.append(cue)
            continue
        if cue.start >= pause_at:
            out.append(
                Cue(
                    cue.index,
                    cue.start + freeze_dur,
                    cue.end + freeze_dur,
                    cue.text,
                )
            )
            continue
        # Spanning cue: trim to pause, remainder after freeze insert.
        if cue.start < pause_at:
            out.append(Cue(cue.index, cue.start, pause_at, cue.text))
        out.append(
            Cue(
                cue.index,
                pause_at + freeze_dur,
                cue.end + freeze_dur,
                cue.text,
            )
        )

    out.append(
        Cue(
            0,
            max(FREEZE_SCENE_START, freeze_start - 0.033),
            freeze_end,
            FREEZE_SCENE_TEXT,
        )
    )
    out.sort(key=lambda c: (c.start, c.end))

    reindexed: list[Cue] = []
    for i, cue in enumerate(out, start=1):
        reindexed.append(Cue(i, cue.start, cue.end, cue.text))
    return reindexed


def write_srt(cues: list[Cue], path: Path) -> None:
    chunks = []
    for cue in cues:
        chunks.append(
            f"{cue.index}\n"
            f"{seconds_to_srt(cue.start)} --> {seconds_to_srt(cue.end)}\n"
            f"{cue.text}\n"
        )
    path.write_text("\n".join(chunks) + "\n", encoding="utf-8")


def main() -> None:
    pause_at, freeze_dur, part1_end = parse_kdenlive_timings(PROJECT)
    orig = parse_srt(ORIG_SRT)
    edited = build_edited_cues(orig, pause_at, freeze_dur, part1_end)
    write_srt(edited, EDITED_SRT)
    print(f"pause_at={pause_at:.3f}s freeze={freeze_dur:.3f}s part1_end={part1_end:.3f}s")
    print(f"Wrote {len(edited)} cues -> {EDITED_SRT}")


if __name__ == "__main__":
    main()

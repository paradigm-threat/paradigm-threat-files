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
MIN_TAIL_FRAC = 0.25
MIN_CUE_DUR = 0.08


@dataclass
class Gap:
    source_at: float
    duration: float
    timeline_start: float
    scene_text: str

    @property
    def timeline_end(self) -> float:
        return self.timeline_start + self.duration


@dataclass
class Cue:
    index: int
    start: float
    end: float
    text: str

    @property
    def duration(self) -> float:
        return self.end - self.start


def is_scene(text: str) -> bool:
    return text.strip().startswith("[Scene")


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


def split_source_at_gaps(start: float, end: float, gaps: list[Gap]) -> list[tuple[float, float]]:
    """Split a source-time range at each gap boundary."""
    points = [start] + [g.source_at for g in gaps if start < g.source_at < end] + [end]
    points = sorted(set(points))
    return [(points[i], points[i + 1]) for i in range(len(points) - 1) if points[i + 1] > points[i]]


def segment_to_edited(
    src_a: float, src_b: float, gaps: list[Gap], gap_for_start: Gap | None, gap_for_end: Gap | None
) -> tuple[float, float]:
    ed_a = source_to_edited(src_a, gaps)
    ed_b = source_to_edited(src_b, gaps)
    if gap_for_end is not None:
        ed_b = gap_for_end.timeline_start
    if gap_for_start is not None:
        ed_a = gap_for_start.timeline_end
    return ed_a, ed_b


def map_speech_cue(cue: Cue, gaps: list[Gap]) -> list[Cue]:
    if is_scene(cue.text) or cue.text.strip() in {PACKUP_SCENE, BADGE_SCENE}:
        return []

    total = cue.duration
    if total <= 0:
        return []

    out: list[Cue] = []
    gap_by_source = {g.source_at: g for g in gaps}

    for src_a, src_b in split_source_at_gaps(cue.start, cue.end, gaps):
        seg_dur = src_b - src_a
        gap_end = gap_by_source.get(src_b)
        gap_start = gap_by_source.get(src_a)

        # After a pause: keep tail only if >25% of original cue remains.
        if gap_start is not None and seg_dur / total <= MIN_TAIL_FRAC:
            continue

        ed_a, ed_b = segment_to_edited(src_a, src_b, gaps, gap_start, gap_end)
        if ed_b - ed_a >= MIN_CUE_DUR:
            out.append(Cue(cue.index, ed_a, ed_b, cue.text))
    return out


def clip_out_of_gaps(cues: list[Cue], gaps: list[Gap]) -> list[Cue]:
    """Remove any speech overlapping freeze/pause windows."""
    cleaned: list[Cue] = []
    for cue in cues:
        if is_scene(cue.text):
            cleaned.append(cue)
            continue
        parts = [(cue.start, cue.end)]
        for gap in gaps:
            next_parts: list[tuple[float, float]] = []
            for a, b in parts:
                if b <= gap.timeline_start or a >= gap.timeline_end:
                    next_parts.append((a, b))
                    continue
                if a < gap.timeline_start:
                    next_parts.append((a, gap.timeline_start))
                if b > gap.timeline_end:
                    next_parts.append((gap.timeline_end, b))
            parts = next_parts
        for a, b in parts:
            if b - a >= MIN_CUE_DUR:
                cleaned.append(Cue(cue.index, a, b, cue.text))
    return cleaned


def resolve_overlaps(cues: list[Cue]) -> list[Cue]:
    """Trim overlapping speech; scene cues during pauses win over clipped speech."""
    scenes = [c for c in cues if is_scene(c.text)]
    speech = [c for c in cues if not is_scene(c.text)]
    speech.sort(key=lambda c: (c.start, c.end))

    merged: list[Cue] = []
    for cue in speech:
        if not merged:
            merged.append(cue)
            continue
        prev = merged[-1]
        if cue.start < prev.end:
            # Same text duplicate from split — drop the shorter overlap.
            if cue.text.strip() == prev.text.strip():
                if cue.duration > prev.duration:
                    merged[-1] = cue
                continue
            prev.end = min(prev.end, max(prev.start + MIN_CUE_DUR, cue.start))
            if prev.duration < MIN_CUE_DUR:
                merged.pop()
        if not merged or cue.start >= merged[-1].end - 1e-6:
            merged.append(cue)
        elif cue.text.strip() != merged[-1].text.strip():
            merged[-1].end = min(merged[-1].end, max(merged[-1].start + MIN_CUE_DUR, cue.start))
            if cue.start >= merged[-1].end - 1e-6:
                merged.append(cue)

    out = merged + scenes
    out.sort(key=lambda c: (c.start, c.end))
    return out


def build_edited_cues(orig: list[Cue], gaps: list[Gap]) -> list[Cue]:
    speech: list[Cue] = []
    for cue in orig:
        speech.extend(map_speech_cue(cue, gaps))

    speech = clip_out_of_gaps(speech, gaps)

    scenes = [
        Cue(0, g.timeline_start, g.timeline_end, g.scene_text)
        for g in gaps
    ]

    out = resolve_overlaps(speech + scenes)
    return [Cue(i, c.start, c.end, c.text) for i, c in enumerate(out, start=1)]


def write_srt(cues: list[Cue], path: Path) -> None:
    chunks = [
        f"{c.index}\n{seconds_to_srt(c.start)} --> {seconds_to_srt(c.end)}\n{c.text}\n"
        for c in cues
    ]
    path.write_text("\n".join(chunks) + "\n", encoding="utf-8")


def main() -> None:
    gaps = parse_gaps(PROJECT)
    edited = build_edited_cues(parse_srt(ORIG_SRT), gaps)
    write_srt(edited, EDITED_SRT)
    for i, g in enumerate(gaps, 1):
        print(
            f"gap{i}: source={g.source_at:.3f}s dur={g.duration:.3f}s "
            f"timeline={g.timeline_start:.3f}-{g.timeline_end:.3f}s"
        )
    print(f"Wrote {len(edited)} cues -> {EDITED_SRT}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Patch a working Kdenlive project with FOX 10 pause/zoom/arrow edit."""
from __future__ import annotations

import hashlib
import xml.etree.ElementTree as ET
from pathlib import Path

BASE = Path(__file__).resolve().parent
PROJECT = BASE / "chansley-fox10-packup.kdenlive"
FREEZE = BASE / "frame-0106.jpg"
ARROW = BASE / "fox10-packup-arrow.png"
SRT = BASE / "VID_20200624_110648-captions-edited-timeline.srt"

ORIG_OUT = "00:01:11.612"
PART1_OUT = "00:01:05.999"
FREEZE_OUT = "00:00:09.976"
PART2_IN = "00:01:06.000"
TOTAL_OUT = "00:01:21.588"
TOTAL_DUR = "00:01:21;18"
MAX_FRAMES = "2445"
ZOOM_RECT = (
    "00:00:00.000=0 0 2160 3840 1.000000;"
    "00:00:09.976=0 -480 3024 5376 1.000000"
)


def file_hash(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def qimage_chain(chain_id: str, kid: str, path: Path, name: str) -> ET.Element:
    chain = ET.Element("chain", id=chain_id, **{"in": "00:00:00.000", "out": FREEZE_OUT})
    for name_p, val in (
        ("length", "300"),
        ("eof", "pause"),
        ("resource", str(path.resolve())),
        ("ttl", "1"),
        ("aspect_ratio", "1"),
        ("progressive", "1"),
        ("mlt_service", "qimage"),
        ("kdenlive:clipname", name),
        ("kdenlive:folderid", "-1"),
        ("kdenlive:id", kid),
        ("kdenlive:duration", FREEZE_OUT),
        ("kdenlive:clip_type", "1"),
        ("kdenlive:file_size", str(path.stat().st_size)),
        ("kdenlive:file_hash", file_hash(path)),
        ("set.test_audio", "0"),
        ("set.test_image", "1"),
    ):
        ET.SubElement(chain, "property", name=name_p).text = val
    return chain


def image_producer(producer_id: str, kid: str, path: Path, name: str, fmt: str = "2") -> ET.Element:
    prod = ET.Element("producer", id=producer_id, **{"in": "00:00:00.000", "out": FREEZE_OUT})
    for name_p, val in (
        ("length", "300"),
        ("eof", "pause"),
        ("resource", str(path.resolve())),
        ("ttl", "1"),
        ("aspect_ratio", "1"),
        ("meta.media.progressive", "1"),
        ("seekable", "1"),
        ("format", fmt),
        ("meta.media.width", "2160"),
        ("meta.media.height", "3840"),
        ("mlt_service", "qimage"),
        ("kdenlive:clipname", name),
        ("kdenlive:duration", FREEZE_OUT),
        ("xml", "was here"),
        ("kdenlive:folderid", "-1"),
        ("kdenlive:id", kid),
        ("kdenlive:clip_type", "2"),
        ("kdenlive:file_size", str(path.stat().st_size)),
        ("kdenlive:file_hash", file_hash(path)),
    ):
        ET.SubElement(prod, "property", name=name_p).text = val
    return prod


def sub(parent: ET.Element, tag: str, **attrs) -> ET.Element:
    return ET.SubElement(parent, tag, attrs)


def prop(parent: ET.Element, name: str, value: str) -> None:
    sub(parent, "property", name=name).text = value


def zoom_filter(parent: ET.Element, fid: str) -> None:
    filt = sub(parent, "filter", id=fid)
    for name, val in (
        ("rotate_center", "1"),
        ("mlt_service", "qtblend"),
        ("kdenlive_id", "qtblend"),
        ("rect", ZOOM_RECT),
        ("compositing", "0"),
        ("distort", "0"),
        ("kdenlive:collapsed", "0"),
        ("rotation", "00:00:00.000=0;00:00:09.976=0"),
    ):
        prop(filt, name, val)


def clear_children(el: ET.Element, tags: tuple[str, ...]) -> None:
    for child in list(el):
        if child.tag in tags:
            el.remove(child)


def set_out(el: ET.Element, out: str) -> None:
    el.set("out", out)
    if el.get("in") is None and el.tag in {"tractor", "chain", "producer"}:
        el.set("in", "00:00:00.000")


def patch() -> None:
    tree = ET.parse(PROJECT)
    root = tree.getroot()

    # Insert image chains after chain2 (bin master).
    chain2 = root.find(".//chain[@id='chain2']")
    idx = list(root).index(chain2) + 1
    freeze_prod = image_producer("producer9", "5", FREEZE, "freeze @ 1:06", fmt="1")
    arrow_prod = image_producer("producer8", "6", ARROW, "FOX 10 arrow (edit me)")
    root.insert(idx, freeze_prod)
    root.insert(idx + 1, arrow_prod)

    # --- Video track (playlist2) ---
    pl_v = root.find(".//playlist[@id='playlist2']")
    clear_children(pl_v, ("entry", "blank"))
    e = sub(pl_v, "entry", producer="chain0", **{"in": "00:00:00.000", "out": PART1_OUT})
    prop(e, "kdenlive:id", "4")
    freeze_e = sub(pl_v, "entry", producer="producer9", **{"in": "00:00:00.000", "out": FREEZE_OUT})
    prop(freeze_e, "kdenlive:id", "5")
    zoom_filter(freeze_e, "filter_freeze_zoom")
    e = sub(pl_v, "entry", producer="chain0", **{"in": PART2_IN, "out": ORIG_OUT})
    prop(e, "kdenlive:id", "4")

    # --- Audio track (playlist4) ---
    pl_a = root.find(".//playlist[@id='playlist4']")
    clear_children(pl_a, ("entry", "blank"))
    e = sub(pl_a, "entry", producer="chain1", **{"in": "00:00:00.000", "out": PART1_OUT})
    prop(e, "kdenlive:id", "4")
    sub(pl_a, "blank", length=FREEZE_OUT)
    e = sub(pl_a, "entry", producer="chain1", **{"in": PART2_IN, "out": ORIG_OUT})
    prop(e, "kdenlive:id", "4")

    # --- Overlay track V2 (playlist6) ---
    pl_o = root.find(".//playlist[@id='playlist6']")
    clear_children(pl_o, ("entry", "blank"))
    sub(pl_o, "blank", length=PART1_OUT)
    arrow_e = sub(pl_o, "entry", producer="producer8", **{"in": "00:00:00.000", "out": FREEZE_OUT})
    prop(arrow_e, "kdenlive:id", "6")

    # Extend tractor / sequence durations.
    for tid in ("tractor1", "tractor2", "tractor3", "tractor4", "tractor5"):
        el = root.find(f".//tractor[@id='{tid}']")
        if el is not None:
            set_out(el, TOTAL_OUT)

    seq = root.find(".//tractor[@id='tractor4']")
    prop(seq, "kdenlive:duration", TOTAL_DUR)
    prop(seq, "kdenlive:maxduration", MAX_FRAMES)
    for name, val in (
        ("kdenlive:sequenceproperties.groups", "[]"),
        ("kdenlive:sequenceproperties.position", "0"),
    ):
        node = seq.find(f".//property[@name='{name}']")
        if node is not None:
            node.text = val

    for tid in ("transition0", "transition1", "transition2", "transition3"):
        tr = root.find(f".//transition[@id='{tid}']")
        if tr is not None:
            tr.set("out", TOTAL_OUT)

    # Project bin: add freeze + arrow clips.
    main = root.find(".//playlist[@id='main_bin']")
    prop(main, "kdenlive:docproperties.subtitlesList", SRT.name)
    prop(
        main,
        "kdenlive:documentnotes",
        "1:06 freeze + 10s zoom on FOX 10 cam op (left). Arrow on V2 — edit producer8 / fox10-packup-arrow.svg.",
    )
    # Replace sequence entry out time.
    for entry in main.findall("entry"):
        if entry.get("producer") == "tractor4":
            entry.set("out", TOTAL_OUT)
    sub(main, "entry", producer="producer9", **{"in": "00:00:00.000", "out": FREEZE_OUT})
    sub(main, "entry", producer="producer8", **{"in": "00:00:00.000", "out": FREEZE_OUT})

    # Burn subtitles on project tractor.
    proj = root.find(".//tractor[@id='tractor5']")
    track = proj.find("track")
    if track is not None:
        track.set("out", TOTAL_OUT)
    old = proj.find("filter[@id='filter_sub']")
    if old is not None:
        proj.remove(old)
    filt = sub(proj, "filter", id="filter_sub")
    for name, val in (
        ("maxfilesize", "1048576"),
        ("mlt_service", "avfilter.subtitles"),
        ("internal_added", "410"),
        ("av.filter.filename", str(SRT.resolve())),
        ("disable", "0"),
    ):
        prop(filt, name, val)

    ET.indent(tree, space=" ")
    tree.write(PROJECT, encoding="UTF-8", xml_declaration=True)
    print(f"Patched {PROJECT}")
    print(f"  Timeline: 0–{PART1_OUT} | freeze {FREEZE_OUT} | {PART2_IN}–{ORIG_OUT}")
    print(f"  Total: {TOTAL_OUT}")


if __name__ == "__main__":
    patch()

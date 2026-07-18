#!/usr/bin/env python3
"""Generate US Letter one-page MGGA handout PDF (news-style layout).

Reads make-gordonston-great-again-onepager.source.md
Embeds hero, Gwinnett corridor map, and classroom vision; lead full-width; sections wrap floats.

Requirements: pip install fpdf2 Pillow 'qrcode[pil]'
"""

from __future__ import annotations

import io
import re
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

try:
    from fpdf import FPDF
    from fpdf.enums import XPos, YPos
except ImportError:
    sys.exit("ERROR: pip install fpdf2")

try:
    from PIL import Image
except ImportError:
    sys.exit("ERROR: pip install Pillow")

try:
    import qrcode
except ImportError:
    sys.exit("ERROR: pip install 'qrcode[pil]'")

REPO = Path(__file__).resolve().parent.parent
CO_DIR = REPO / "influence" / "controlled_opposition"
SOURCE = CO_DIR / "make-gordonston-great-again-onepager.source.md"
HERO = CO_DIR / "make-gordonston-great-again.png"
CLASS_IMG = CO_DIR / "make-gordonston-great-again-class.png"
MAP_IMG = CO_DIR / "make-gordonston-shuman-church-map.png"
OUT_PDF = CO_DIR / "make-gordonston-great-again-onepager.pdf"

MARGIN = 0.38
PAGE_W = 8.5
PAGE_H = 11.0
CONTENT_W = PAGE_W - 2 * MARGIN
BOTTOM = PAGE_H - MARGIN
FOOTER_H = 1.08
FOOTER_TOP = BOTTOM - FOOTER_H
FLOAT_GAP = 0.12
DPI = 150

VOTE_KICKER_FILL = (238, 244, 252)
VOTE_SECTION_MARKERS = ("vote first", "vote:", "next step: vote", "friendly next step")


@dataclass
class FloatBox:
    x: float
    y: float
    w: float
    h: float


@dataclass
class Section:
    title: str
    body: str
    is_vote: bool = False


def ascii_safe(text: str) -> str:
    return (
        text.replace("\u2014", " - ")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("**", "")
    )


def parse_source(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    data: dict = {
        "subtitle": "",
        "tagline": "",
        "hero_caption": "",
        "lead": "",
        "sections": [],
        "paragraphs": [],
        "discovery": "",
        "email": "",
        "email_label": "",
        "article_url": "",
        "article_label": "",
    }
    section = None
    body_buf: list[str] = []
    lead_buf: list[str] = []
    current_title: str | None = None
    current_body: list[str] = []

    def flush_section() -> None:
        nonlocal current_title, current_body
        if current_title and current_body:
            blob = " ".join(current_body).strip()
            if blob:
                title_l = current_title.lower()
                is_vote = any(m in title_l for m in VOTE_SECTION_MARKERS)
                data["sections"].append(Section(current_title, blob, is_vote))
        current_title = None
        current_body = []

    for line in text.splitlines():
        if line.startswith("## "):
            if section == "body" and body_buf:
                blob = " ".join(body_buf).strip()
                if blob:
                    data["paragraphs"] = [p.strip() for p in re.split(r"\n\s*\n", blob) if p.strip()]
            if section == "lead" and lead_buf:
                data["lead"] = " ".join(lead_buf).strip()
            if section == "sections":
                flush_section()
            section = line[3:].strip().lower()
            body_buf = []
            lead_buf = []
            continue

        if section == "header" and ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()
        elif section == "footer" and ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()
        elif section == "discovery" and line.strip():
            data["discovery"] += (" " if data["discovery"] else "") + line.strip()
        elif section == "lead":
            if line.strip():
                lead_buf.append(line.strip())
        elif section == "sections":
            if line.startswith("### "):
                flush_section()
                current_title = line[4:].strip()
            elif line.strip() and current_title:
                current_body.append(line.strip())
        elif section == "body":
            if line.strip():
                body_buf.append(line.strip())
            elif body_buf:
                blob = " ".join(body_buf).strip()
                if blob:
                    data["paragraphs"].append(blob)
                body_buf = []

    if section == "lead" and lead_buf:
        data["lead"] = " ".join(lead_buf).strip()
    if section == "sections":
        flush_section()
    if section == "body" and body_buf:
        blob = " ".join(body_buf).strip()
        if blob:
            if data["paragraphs"]:
                data["paragraphs"].append(blob)
            else:
                data["paragraphs"] = [blob]

    for key in (
        "subtitle",
        "tagline",
        "hero_caption",
        "lead",
        "discovery",
        "email",
        "email_label",
        "article_url",
        "article_label",
    ):
        if isinstance(data.get(key), str):
            data[key] = ascii_safe(data[key])
    data["paragraphs"] = [ascii_safe(p) for p in data["paragraphs"]]
    for i, sec in enumerate(data["sections"]):
        data["sections"][i] = Section(
            ascii_safe(sec.title),
            ascii_safe(sec.body),
            sec.is_vote,
        )
    return data


def prepare_image(src: Path, max_w_in: float, max_h_in: float) -> tuple[Path, float, float]:
    with Image.open(src) as im:
        im = im.convert("RGB")
        w_px, h_px = im.size
        max_w_px = int(max_w_in * DPI)
        max_h_px = int(max_h_in * DPI)
        scale = min(max_w_px / w_px, max_h_px / h_px)
        new_size = (max(1, int(w_px * scale)), max(1, int(h_px * scale)))
        im = im.resize(new_size, Image.Resampling.LANCZOS)
        suffix = ".jpg" if src.suffix.lower() != ".png" else ".png"
        tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
        if suffix == ".jpg":
            im.save(tmp.name, "JPEG", quality=90, optimize=True)
        else:
            im.save(tmp.name, "PNG", optimize=True)
        return Path(tmp.name), new_size[0] / DPI, new_size[1] / DPI


def make_qr(url: str) -> Path:
    qr = qrcode.QRCode(box_size=4, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    tmp.write(buf.getvalue())
    tmp.flush()
    return Path(tmp.name)


def text_region_at_y(y: float, margin: float, full_w: float, floats: list[FloatBox]) -> tuple[float, float]:
    x0 = margin
    x1 = margin + full_w
    mid = margin + full_w / 2
    for box in floats:
        if box.y - 0.02 <= y < box.y + box.h + 0.02:
            if box.x + box.w / 2 >= mid:
                x1 = min(x1, box.x - FLOAT_GAP)
            else:
                x0 = max(x0, box.x + box.w + FLOAT_GAP)
    return x0, max(0.55, x1 - x0)


def flow_paragraph(
    pdf: FPDF,
    para: str,
    y_start: float,
    y_max: float,
    margin: float,
    full_w: float,
    floats: list[FloatBox],
    font_size: float = 9.85,
    line_h: float = 0.148,
    style: str = "",
) -> float:
    pdf.set_font("Helvetica", style, font_size)
    y = y_start
    words = para.split()
    line_words: list[str] = []
    i = 0
    while i < len(words) and y < y_max - line_h:
        word = words[i]
        trial = (" ".join(line_words + [word])).strip()
        tx, aw = text_region_at_y(y, margin, full_w, floats)
        if pdf.get_string_width(trial) <= aw:
            line_words.append(word)
            i += 1
        else:
            if line_words:
                pdf.set_xy(tx, y)
                pdf.cell(aw, line_h, " ".join(line_words), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                y = pdf.get_y()
                line_words = []
            else:
                pdf.set_xy(tx, y)
                pdf.multi_cell(aw, line_h, word)
                y = pdf.get_y()
                i += 1
    if line_words and y < y_max:
        tx, aw = text_region_at_y(y, margin, full_w, floats)
        pdf.set_xy(tx, y)
        pdf.cell(aw, line_h, " ".join(line_words), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        y = pdf.get_y()
    return y


def measure_section_height(
    pdf: FPDF,
    sec: Section,
    margin: float,
    full_w: float,
    floats: list[FloatBox],
    head_size: float,
    body_size: float,
    head_h: float,
    line_h: float,
    head_gap: float,
    para_gap: float,
    pad: float,
) -> float:
    total = head_h + head_gap + pad * 2 if sec.is_vote else head_h + head_gap
    pdf.set_font("Helvetica", "", body_size)
    y_sim = 0.0
    words = sec.body.split()
    line_words: list[str] = []
    i = 0
    while i < len(words):
        word = words[i]
        trial = (" ".join(line_words + [word])).strip()
        aw = full_w - pad * 2 if sec.is_vote else CONTENT_W
        if sec.is_vote:
            aw = min(aw, CONTENT_W - 0.1)
        else:
            aw = text_region_at_y(y_sim, margin, full_w, floats)[1]
        if pdf.get_string_width(trial) <= aw:
            line_words.append(word)
            i += 1
        else:
            if line_words:
                y_sim += line_h
                line_words = []
            else:
                y_sim += line_h
                i += 1
    if line_words:
        y_sim += line_h
    total += y_sim + para_gap
    return total


def draw_section(
    pdf: FPDF,
    sec: Section,
    y_start: float,
    y_max: float,
    margin: float,
    full_w: float,
    floats: list[FloatBox],
    head_size: float = 11.5,
    body_size: float = 10.2,
    head_h: float = 0.18,
    line_h: float = 0.148,
    head_gap: float = 0.04,
    para_gap: float = 0.07,
) -> float:
    y = y_start
    if y >= y_max - head_h:
        return y

    pad = 0.08 if sec.is_vote else 0.0
    box_x = margin
    box_w = full_w

    if sec.is_vote:
        est_h = measure_section_height(
            pdf, sec, margin, full_w, floats, head_size, body_size, head_h, line_h, head_gap, para_gap, pad
        )
        if y + est_h > y_max:
            est_h = y_max - y
        pdf.set_fill_color(*VOTE_KICKER_FILL)
        pdf.rect(box_x, y - 0.02, box_w, min(est_h, y_max - y), style="F")

    pdf.set_text_color(25, 45, 75 if sec.is_vote else 0)
    pdf.set_font("Helvetica", "B", head_size)
    tx, aw = text_region_at_y(y, margin, full_w, floats)
    if sec.is_vote:
        tx = margin + pad
        aw = box_w - 2 * pad
    pdf.set_xy(tx, y + pad)
    pdf.cell(aw, head_h, sec.title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    y = pdf.get_y() + head_gap

    pdf.set_text_color(0, 0, 0)
    vote_floats: list[FloatBox] = [] if sec.is_vote else floats
    inner_margin = margin + pad if sec.is_vote else margin
    inner_w = full_w - 2 * pad if sec.is_vote else full_w

    y = flow_paragraph(
        pdf,
        sec.body,
        y,
        y_max - pad,
        inner_margin,
        inner_w,
        vote_floats,
        font_size=body_size,
        line_h=line_h,
        style="B" if sec.is_vote else "",
    )
    y += para_gap + (pad if sec.is_vote else 0)
    return y


class OnePager(FPDF):
    def footer(self):
        pass


def render(data: dict) -> None:
    pdf = OnePager("P", "in", "Letter")
    pdf.set_auto_page_break(False)
    pdf.add_page()

    y = MARGIN
    pdf.set_xy(MARGIN, y)
    pdf.set_font("Helvetica", "B", 23)
    pdf.cell(CONTENT_W, 0.28, "Make Gordonston Great Again", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.03

    pdf.set_font("Helvetica", "I", 10.5)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.15, data.get("subtitle", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.02

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.13, data.get("tagline", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.06

    hero_max_h = 2.48
    hero_jpg, hero_w, hero_h = prepare_image(HERO, CONTENT_W, hero_max_h)
    try:
        hero_x = MARGIN + (CONTENT_W - hero_w) / 2
        pdf.image(str(hero_jpg), x=hero_x, y=y, w=hero_w, h=hero_h)
        y += hero_h + 0.04
    finally:
        hero_jpg.unlink(missing_ok=True)

    hero_caption = data.get("hero_caption", "").strip()
    if hero_caption:
        pdf.set_xy(MARGIN, y)
        pdf.set_font("Helvetica", "I", 6.6)
        pdf.set_text_color(70, 70, 70)
        pdf.multi_cell(CONTENT_W, 0.1, hero_caption, align="C")
        pdf.set_text_color(0, 0, 0)
        y = pdf.get_y() + 0.05

    discovery_reserve = 0.33
    body_bottom = FOOTER_TOP - discovery_reserve

    lead = data.get("lead", "")
    if lead:
        pdf.set_font("Helvetica", "B", 10.4)
        pdf.set_xy(MARGIN, y)
        pdf.multi_cell(CONTENT_W, 0.148, lead)
        y = pdf.get_y() + 0.05

    sections: list[Section] = data.get("sections") or []
    if not sections and data.get("paragraphs"):
        sections = [Section("The neighborhood plan", p, False) for p in data["paragraphs"]]

    body_top = y
    map_w = 2.0
    map_max_h = 1.18
    map_jpg, map_dw, map_dh = prepare_image(MAP_IMG, map_w, map_max_h)
    map_caption_h = 0.11
    map_box_h = map_dh + map_caption_h
    map_x = MARGIN

    try:
        pdf.image(str(map_jpg), x=map_x, y=body_top, w=map_dw, h=map_dh)
        pdf.set_xy(map_x, body_top + map_dh + 0.02)
        pdf.set_font("Helvetica", "I", 6.8)
        pdf.cell(map_dw, 0.1, "Shuman closed - church - Gwinnett - park", align="C")
    finally:
        map_jpg.unlink(missing_ok=True)

    class_w = 2.22
    class_max_h = min(1.88, body_bottom - body_top - 0.1)
    class_jpg, class_dw, class_dh = prepare_image(CLASS_IMG, class_w, class_max_h)
    class_x = MARGIN + CONTENT_W - class_dw

    floats: list[FloatBox] = [
        FloatBox(x=map_x, y=body_top, w=map_dw, h=map_box_h),
        FloatBox(x=class_x, y=body_top, w=class_dw, h=class_dh),
    ]

    try:
        pdf.image(str(class_jpg), x=class_x, y=body_top, w=class_dw, h=class_dh)
    finally:
        class_jpg.unlink(missing_ok=True)

    y = body_top
    body_size = 9.65
    head_size = 10.8
    for sec in sections:
        if y >= body_bottom - 0.25:
            print("WARNING: MGGA one-pager body overflow; text may clip above discovery line")
            break
        y = draw_section(
            pdf,
            sec,
            y,
            body_bottom,
            MARGIN,
            CONTENT_W,
            floats,
            head_size=head_size,
            body_size=body_size,
        )

    disc_y = max(y + 0.05, FOOTER_TOP - discovery_reserve)
    if disc_y > FOOTER_TOP - 0.18:
        disc_y = FOOTER_TOP - discovery_reserve

    pdf.set_draw_color(200, 200, 200)
    pdf.line(MARGIN, disc_y - 0.05, MARGIN + CONTENT_W, disc_y - 0.05)
    pdf.set_xy(MARGIN, disc_y)
    pdf.set_font("Helvetica", "I", 8.5)
    disc = data.get("discovery", "").replace("**", "")
    pdf.multi_cell(CONTENT_W, 0.13, disc, align="C")

    pdf.set_fill_color(245, 245, 245)
    pdf.rect(MARGIN, FOOTER_TOP, CONTENT_W, FOOTER_H, style="F")
    pdf.set_draw_color(150, 150, 150)
    pdf.line(MARGIN, FOOTER_TOP, MARGIN + CONTENT_W, FOOTER_TOP)

    qr_size = 0.9
    qr_path = make_qr(data["article_url"])
    try:
        pdf.image(
            str(qr_path),
            x=PAGE_W - MARGIN - qr_size,
            y=FOOTER_TOP + (FOOTER_H - qr_size) / 2,
            w=qr_size,
            h=qr_size,
        )
    finally:
        qr_path.unlink(missing_ok=True)

    text_w = CONTENT_W - qr_size - 0.2
    fy = FOOTER_TOP + 0.1
    pdf.set_xy(MARGIN + 0.06, fy)
    pdf.set_font("Helvetica", "B", 9.5)
    label = data.get("email_label", "Volunteer or support the plan")
    pdf.cell(text_w, 0.16, f"{label}:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "B", 11.5)
    pdf.set_x(MARGIN + 0.06)
    pdf.cell(text_w, 0.2, data.get("email", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("Helvetica", "B", 7.5)
    pdf.set_x(MARGIN + 0.06)
    pdf.cell(text_w, 0.12, data.get("article_label", "Full article") + ":", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "", 6.8)
    short = data.get("article_url", "").replace("https://", "")
    pdf.set_x(MARGIN + 0.06)
    pdf.multi_cell(text_w, 0.1, short)

    pdf.output(str(OUT_PDF))
    print(f"Wrote {OUT_PDF} ({pdf.page_no()} page(s))")


def main() -> None:
    if not SOURCE.is_file():
        sys.exit(f"Missing source: {SOURCE}")
    if not HERO.is_file():
        sys.exit(f"Missing hero image: {HERO}")
    if not CLASS_IMG.is_file():
        sys.exit(f"Missing classroom image: {CLASS_IMG}")
    if not MAP_IMG.is_file():
        sys.exit(f"Missing map image: {MAP_IMG}")
    data = parse_source(SOURCE)
    if not data.get("lead") and not data.get("sections") and not data.get("paragraphs"):
        sys.exit("Source must include ## lead + ## sections, or legacy ## body")
    render(data)


if __name__ == "__main__":
    main()

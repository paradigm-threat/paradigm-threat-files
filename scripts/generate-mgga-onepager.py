#!/usr/bin/env python3
"""Generate US Letter one-page MGGA handout PDF.

Reads copy from influence/controlled_opposition/make-gordonston-great-again-onepager.source.md
Embeds make-gordonston-great-again.png and a QR code to the full article.

Requirements: pip install fpdf2 Pillow 'qrcode[pil]'
"""

from __future__ import annotations

import io
import re
import sys
import tempfile
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
OUT_PDF = CO_DIR / "make-gordonston-great-again-onepager.pdf"

MARGIN = 0.35
PAGE_W = 8.5
PAGE_H = 11.0
CONTENT_W = PAGE_W - 2 * MARGIN
BOTTOM = PAGE_H - MARGIN
FOOTER_H = 1.12
FOOTER_TOP = BOTTOM - FOOTER_H
COL_GAP = 0.2
COL_W = (CONTENT_W - COL_GAP) / 2
DPI = 150


def ascii_safe(text: str) -> str:
    return (
        text.replace("\u2014", " - ")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )


def parse_source(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    data: dict = {
        "subtitle": "",
        "tagline": "",
        "problems": [],
        "solutions": [],
        "discovery": "",
        "email": "",
        "email_label": "",
        "article_url": "",
        "article_label": "",
    }
    section = None
    for line in text.splitlines():
        if line.startswith("## "):
            section = line[3:].strip().lower()
            continue
        if section == "header" and ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()
        elif section == "footer" and ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()
        elif section == "discovery" and line.strip():
            data["discovery"] += (" " if data["discovery"] else "") + line.strip()
        elif section in ("problems", "solutions") and line.strip().startswith("- "):
            data[section].append(line.strip()[2:].strip())
    for key in ("subtitle", "tagline", "discovery", "email", "email_label", "article_url", "article_label"):
        if isinstance(data.get(key), str):
            data[key] = ascii_safe(data[key])
    for key in ("problems", "solutions"):
        data[key] = [ascii_safe(b) for b in data[key]]
    return data


def split_bold_lead(text: str) -> tuple[str, str]:
    m = re.match(r"\*\*(.+?)\*\*\s*(.*)", text, re.DOTALL)
    if m:
        return m.group(1), m.group(2).lstrip(" —").lstrip()
    return "", text


def prepare_hero(src: Path, max_w_in: float, max_h_in: float) -> tuple[Path, float, float]:
    with Image.open(src) as im:
        im = im.convert("RGB")
        w_px, h_px = im.size
        max_w_px = int(max_w_in * DPI)
        max_h_px = int(max_h_in * DPI)
        scale = min(max_w_px / w_px, max_h_px / h_px)
        new_size = (max(1, int(w_px * scale)), max(1, int(h_px * scale)))
        im = im.resize(new_size, Image.Resampling.LANCZOS)
        tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        im.save(tmp.name, "JPEG", quality=90, optimize=True)
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


class OnePager(FPDF):
    def footer(self):
        pass


def render(data: dict) -> None:
    pdf = OnePager("P", "in", "Letter")
    pdf.set_auto_page_break(False)
    pdf.add_page()

    y = MARGIN

    pdf.set_xy(MARGIN, y)
    pdf.set_font("Helvetica", "B", 22)
    pdf.cell(CONTENT_W, 0.3, "Make Gordonston Great Again", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.05

    pdf.set_font("Helvetica", "I", 11)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.17, data.get("subtitle", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.04

    pdf.set_font("Helvetica", "", 9)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.15, data.get("tagline", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.1

    header_bottom = y
    discovery_reserve = 0.42
    col_top_min = header_bottom + 0.1
    hero_max_h = FOOTER_TOP - discovery_reserve - col_top_min - 0.15
    hero_max_h = min(hero_max_h, 2.55)
    hero_max_h = max(hero_max_h, 1.8)

    hero_jpg, hero_w, hero_h = prepare_hero(HERO, CONTENT_W, hero_max_h)
    try:
        hero_x = MARGIN + (CONTENT_W - hero_w) / 2
        pdf.image(str(hero_jpg), x=hero_x, y=y, w=hero_w, h=hero_h)
        y = y + hero_h + 0.14
    finally:
        hero_jpg.unlink(missing_ok=True)

    col_start = y
    col_avail = FOOTER_TOP - discovery_reserve - col_start - 0.12
    n_bullets = max(len(data["problems"]), len(data["solutions"]), 1)
    heading_h = 0.2
    slot = (col_avail - heading_h) / n_bullets
    line_h = min(0.155, max(0.12, slot / 2.4))
    item_gap = max(0.04, slot - line_h * 2.4)

    def section_heading(title: str, x: float, y0: float) -> float:
        pdf.set_xy(x, y0)
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(35, 55, 85)
        pdf.cell(COL_W, heading_h, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(0, 0, 0)
        return pdf.get_y() + 0.06

    def bullets(items: list[str], x: float, y0: float, width: float) -> float:
        y_cur = y0
        text_x = x + 0.18
        text_w = width - 0.2
        for item in items:
            lead, rest = split_bold_lead(item)
            body = f"{lead} - {rest}" if lead and rest else (lead or item)
            pdf.set_xy(x + 0.06, y_cur)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0.1, line_h, chr(149), new_x=XPos.RIGHT)
            pdf.set_xy(text_x, y_cur)
            pdf.set_font("Helvetica", "", 9)
            pdf.multi_cell(text_w, line_h, body)
            y_cur = pdf.get_y() + item_gap
        return y_cur

    left_x = MARGIN
    right_x = MARGIN + COL_W + COL_GAP

    y_left = section_heading("WHAT IS BROKEN", left_x, col_start)
    y_left = bullets(data["problems"], left_x, y_left, COL_W)

    y_right = section_heading("WHAT WE DO", right_x, col_start)
    y_right = bullets(data["solutions"], right_x, y_right, COL_W)

    y_body = max(y_left, y_right)
    disc_y = FOOTER_TOP - discovery_reserve
    if y_body < disc_y - 0.05:
        pdf.set_draw_color(210, 210, 210)
        pdf.line(MARGIN, disc_y - 0.06, MARGIN + CONTENT_W, disc_y - 0.06)

    pdf.set_xy(MARGIN, disc_y)
    pdf.set_font("Helvetica", "I", 8.5)
    disc = data.get("discovery", "").replace("**", "")
    pdf.multi_cell(CONTENT_W, 0.13, disc, align="C")

    pdf.set_fill_color(248, 248, 248)
    pdf.rect(MARGIN, FOOTER_TOP, CONTENT_W, FOOTER_H, style="F")
    pdf.set_draw_color(160, 160, 160)
    pdf.line(MARGIN, FOOTER_TOP, MARGIN + CONTENT_W, FOOTER_TOP)

    qr_size = 0.92
    qr_path = make_qr(data["article_url"])
    try:
        pdf.image(
            str(qr_path),
            x=PAGE_W - MARGIN - qr_size - 0.05,
            y=FOOTER_TOP + (FOOTER_H - qr_size) / 2,
            w=qr_size,
            h=qr_size,
        )
    finally:
        qr_path.unlink(missing_ok=True)

    text_w = CONTENT_W - qr_size - 0.25
    fy = FOOTER_TOP + 0.12
    pdf.set_xy(MARGIN + 0.08, fy)
    pdf.set_font("Helvetica", "B", 10)
    label = data.get("email_label", "Volunteer or support the plan")
    pdf.cell(text_w, 0.17, f"{label}:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_x(MARGIN + 0.08)
    pdf.cell(text_w, 0.22, data.get("email", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("Helvetica", "B", 8)
    pdf.set_x(MARGIN + 0.08)
    pdf.cell(text_w, 0.14, data.get("article_label", "Full article") + ":", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "", 7)
    short = data.get("article_url", "").replace("https://", "")
    pdf.set_x(MARGIN + 0.08)
    pdf.multi_cell(text_w, 0.11, short)

    pdf.output(str(OUT_PDF))
    print(f"Wrote {OUT_PDF} ({pdf.page_no()} page(s))")


def main() -> None:
    if not SOURCE.is_file():
        sys.exit(f"Missing source: {SOURCE}")
    if not HERO.is_file():
        sys.exit(f"Missing hero image: {HERO}")
    data = parse_source(SOURCE)
    if not data["problems"] or not data["solutions"]:
        sys.exit("Source must include problems and solutions bullets")
    render(data)


if __name__ == "__main__":
    main()

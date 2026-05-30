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

MARGIN = 0.4
PAGE_W = 8.5
PAGE_H = 11.0
CONTENT_W = PAGE_W - 2 * MARGIN
FOOTER_H = 1.05
FOOTER_TOP = PAGE_H - MARGIN - FOOTER_H
HERO_MAX_H = 1.45
COL_GAP = 0.18
COL_W = (CONTENT_W - COL_GAP) / 2
DPI = 150


def ascii_safe(text: str) -> str:
    """Helvetica core font is latin-1; normalize common Unicode punctuation."""
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
    """Return (jpeg path, display width in, display height in) fitting inside box."""
    with Image.open(src) as im:
        im = im.convert("RGB")
        w_px, h_px = im.size
        max_w_px = int(max_w_in * DPI)
        max_h_px = int(max_h_in * DPI)
        scale = min(max_w_px / w_px, max_h_px / h_px)
        new_size = (max(1, int(w_px * scale)), max(1, int(h_px * scale)))
        im = im.resize(new_size, Image.Resampling.LANCZOS)
        tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        im.save(tmp.name, "JPEG", quality=88, optimize=True)
        display_w = new_size[0] / DPI
        display_h = new_size[1] / DPI
        return Path(tmp.name), display_w, display_h


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
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(CONTENT_W, 0.28, "Make Gordonston Great Again", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.04

    pdf.set_font("Helvetica", "I", 10)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.16, data.get("subtitle", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.03

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.14, data.get("tagline", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.08

    hero_jpg, hero_w, hero_h = prepare_hero(HERO, CONTENT_W, HERO_MAX_H)
    try:
        hero_x = MARGIN + (CONTENT_W - hero_w) / 2
        pdf.image(str(hero_jpg), x=hero_x, y=y, w=hero_w, h=hero_h)
        y = y + hero_h + 0.12
    finally:
        hero_jpg.unlink(missing_ok=True)

    def section_heading(title: str, x: float, y0: float) -> float:
        pdf.set_xy(x, y0)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(40, 60, 90)
        pdf.cell(COL_W, 0.17, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(0, 0, 0)
        return pdf.get_y() + 0.04

    def bullets(items: list[str], x: float, y0: float, width: float) -> float:
        y_cur = y0
        bullet_x = x + 0.1
        text_x = x + 0.2
        text_w = width - 0.22
        line_h = 0.125
        for item in items:
            if y_cur > FOOTER_TOP - 0.35:
                break
            lead, rest = split_bold_lead(item)
            body = f"{lead} - {rest}" if lead and rest else (lead or item)
            pdf.set_xy(bullet_x, y_cur)
            pdf.set_font("Helvetica", "", 8)
            pdf.cell(0.08, line_h, chr(149), new_x=XPos.RIGHT)
            pdf.set_xy(text_x, y_cur)
            pdf.multi_cell(text_w, line_h, body)
            y_cur = pdf.get_y() + 0.03
        return y_cur

    left_x = MARGIN
    right_x = MARGIN + COL_W + COL_GAP
    col_start = y

    y_left = section_heading("WHAT IS BROKEN", left_x, col_start)
    y_left = bullets(data["problems"], left_x, y_left, COL_W)

    y_right = section_heading("WHAT WE DO", right_x, col_start)
    y_right = bullets(data["solutions"], right_x, y_right, COL_W)

    y = max(y_left, y_right) + 0.06

    if y < FOOTER_TOP - 0.28:
        pdf.set_draw_color(200, 200, 200)
        pdf.line(MARGIN, y, MARGIN + CONTENT_W, y)
        y += 0.06
        pdf.set_xy(MARGIN, y)
        pdf.set_font("Helvetica", "I", 7.5)
        disc = data.get("discovery", "").replace("**", "")
        pdf.multi_cell(CONTENT_W, 0.12, disc)
        y = pdf.get_y()

    # Footer band (opaque white so nothing shows through)
    pdf.set_fill_color(255, 255, 255)
    pdf.rect(MARGIN, FOOTER_TOP - 0.04, CONTENT_W, FOOTER_H + 0.08, style="F")
    pdf.set_draw_color(180, 180, 180)
    pdf.line(MARGIN, FOOTER_TOP - 0.04, MARGIN + CONTENT_W, FOOTER_TOP - 0.04)

    qr_size = 0.8
    qr_path = make_qr(data["article_url"])
    try:
        pdf.image(str(qr_path), x=PAGE_W - MARGIN - qr_size, y=FOOTER_TOP + 0.08, w=qr_size, h=qr_size)
    finally:
        qr_path.unlink(missing_ok=True)

    pdf.set_xy(MARGIN, FOOTER_TOP + 0.06)
    pdf.set_font("Helvetica", "B", 9.5)
    label = data.get("email_label", "Volunteer or support the plan")
    pdf.cell(CONTENT_W - qr_size - 0.15, 0.16, f"{label}:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_x(MARGIN)
    pdf.cell(CONTENT_W - qr_size - 0.15, 0.18, data.get("email", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("Helvetica", "B", 7.5)
    pdf.set_x(MARGIN)
    pdf.cell(CONTENT_W - qr_size - 0.15, 0.12, data.get("article_label", "Full article") + ":", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "", 6.2)
    short = data.get("article_url", "").replace("https://", "")
    pdf.set_x(MARGIN)
    pdf.multi_cell(CONTENT_W - qr_size - 0.15, 0.1, short)

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

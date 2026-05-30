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

MARGIN = 0.45
PAGE_W = 8.5
PAGE_H = 11.0
CONTENT_W = PAGE_W - 2 * MARGIN


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


def resize_hero(src: Path, max_w_in: float, max_h_in: float, dpi: int = 150) -> Path:
    with Image.open(src) as im:
        im = im.convert("RGB")
        max_w_px = int(max_w_in * dpi)
        max_h_px = int(max_h_in * dpi)
        im.thumbnail((max_w_px, max_h_px), Image.Resampling.LANCZOS)
        tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        im.save(tmp.name, "JPEG", quality=88, optimize=True)
        return Path(tmp.name)


def make_qr(url: str, size_px: int = 280) -> Path:
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
        pass  # custom footer in body


def render(data: dict) -> None:
    pdf = OnePager("P", "in", "Letter")
    pdf.set_auto_page_break(False)
    pdf.set_margins(MARGIN * 72, MARGIN * 72, MARGIN * 72)
    pdf.add_page()

    y = MARGIN

    pdf.set_xy(MARGIN, y)
    pdf.set_font("Helvetica", "B", 22)
    pdf.cell(CONTENT_W, 0.32, "Make Gordonston Great Again", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.06

    pdf.set_font("Helvetica", "I", 11)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.18, data.get("subtitle", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.04

    pdf.set_font("Helvetica", "", 9)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.16, data.get("tagline", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.12

    hero_jpg = resize_hero(HERO, CONTENT_W, 1.75)
    try:
        pdf.image(str(hero_jpg), x=MARGIN, y=y, w=CONTENT_W)
        y += 1.82
    finally:
        hero_jpg.unlink(missing_ok=True)

    def section_heading(title: str) -> None:
        nonlocal y
        pdf.set_xy(MARGIN, y)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(40, 60, 90)
        pdf.cell(CONTENT_W, 0.2, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(0, 0, 0)
        y = pdf.get_y() + 0.05

    def bullets(items: list[str], line_h: float = 0.14) -> None:
        nonlocal y
        indent = 0.14
        width = CONTENT_W - indent
        for item in items:
            lead, rest = split_bold_lead(item)
            body = f"{lead} - {rest}" if lead and rest else (lead or item)
            pdf.set_xy(MARGIN + indent, y)
            pdf.set_font("Helvetica", "", 9.5)
            pdf.cell(0.1, line_h, chr(149), new_x=XPos.RIGHT)
            pdf.set_xy(MARGIN + indent + 0.12, y)
            pdf.multi_cell(width - 0.12, line_h, body)
            y = pdf.get_y() + 0.02

    section_heading("WHAT IS BROKEN")
    bullets(data["problems"], 0.17)

    y += 0.06
    section_heading("WHAT WE DO")
    bullets(data["solutions"], 0.17)

    y += 0.08
    pdf.set_xy(MARGIN, y)
    pdf.set_font("Helvetica", "I", 8.5)
    disc = data.get("discovery", "").replace("**", "")
    pdf.multi_cell(CONTENT_W, 0.14, disc)
    y = pdf.get_y() + 0.14

    footer_y = PAGE_H - MARGIN - 0.95
    qr_path = make_qr(data["article_url"])
    try:
        qr_size = 0.85
        pdf.image(str(qr_path), x=PAGE_W - MARGIN - qr_size, y=footer_y, w=qr_size, h=qr_size)
    finally:
        qr_path.unlink(missing_ok=True)

    pdf.set_xy(MARGIN, footer_y)
    pdf.set_font("Helvetica", "B", 10)
    label = data.get("email_label", "Contact")
    pdf.cell(CONTENT_W - 1.0, 0.18, f"{label}:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_x(MARGIN)
    pdf.cell(CONTENT_W - 1.0, 0.2, data.get("email", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("Helvetica", "B", 8)
    pdf.set_x(MARGIN)
    pdf.cell(CONTENT_W - 1.0, 0.14, data.get("article_label", "Full article") + ":", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", "", 6.5)
    url = data.get("article_url", "")
    short = url.replace("https://", "")
    pdf.set_x(MARGIN)
    pdf.multi_cell(CONTENT_W - 1.05, 0.11, short)

    pdf.output(str(OUT_PDF))
    pages = pdf.pages_count if hasattr(pdf, "pages_count") else len(pdf.pages)
    print(f"Wrote {OUT_PDF} ({pages} page(s))")


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

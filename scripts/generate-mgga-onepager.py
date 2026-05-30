#!/usr/bin/env python3
"""Generate US Letter one-page MGGA handout PDF (newspaper-style text wrap).

Reads make-gordonston-great-again-onepager.source.md
Embeds hero + classroom vision images at fixed positions; body text wraps around float.

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
OUT_PDF = CO_DIR / "make-gordonston-great-again-onepager.pdf"

MARGIN = 0.38
PAGE_W = 8.5
PAGE_H = 11.0
CONTENT_W = PAGE_W - 2 * MARGIN
BOTTOM = PAGE_H - MARGIN
FOOTER_H = 1.08
FOOTER_TOP = BOTTOM - FOOTER_H
FLOAT_GAP = 0.14
DPI = 150


@dataclass
class FloatBox:
    x: float
    y: float
    w: float
    h: float


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
        "paragraphs": [],
        "discovery": "",
        "email": "",
        "email_label": "",
        "article_url": "",
        "article_label": "",
    }
    section = None
    body_buf: list[str] = []
    for line in text.splitlines():
        if line.startswith("## "):
            if section == "body" and body_buf:
                blob = " ".join(body_buf).strip()
                if blob:
                    data["paragraphs"] = [p.strip() for p in re.split(r"\n\s*\n", blob) if p.strip()]
            section = line[3:].strip().lower()
            body_buf = []
            continue
        if section == "header" and ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()
        elif section == "footer" and ":" in line:
            key, _, val = line.partition(":")
            data[key.strip()] = val.strip()
        elif section == "discovery" and line.strip():
            data["discovery"] += (" " if data["discovery"] else "") + line.strip()
        elif section == "body":
            if line.strip():
                body_buf.append(line.strip())
            elif body_buf:
                blob = " ".join(body_buf).strip()
                if blob:
                    data["paragraphs"].append(blob)
                body_buf = []
    if section == "body" and body_buf:
        blob = " ".join(body_buf).strip()
        if blob:
            if data["paragraphs"]:
                data["paragraphs"].append(blob)
            else:
                data["paragraphs"] = [blob]

    for key in ("subtitle", "tagline", "discovery", "email", "email_label", "article_url", "article_label"):
        if isinstance(data.get(key), str):
            data[key] = ascii_safe(data[key])
    data["paragraphs"] = [ascii_safe(p) for p in data["paragraphs"]]
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


def avail_width_at_y(y: float, margin: float, full_w: float, floats: list[FloatBox]) -> float:
    w = full_w
    for box in floats:
        if box.y - 0.02 <= y < box.y + box.h + 0.02:
            left_col = box.x - margin - FLOAT_GAP
            if left_col > 1.0:
                w = min(w, left_col)
    return w


def flow_paragraphs(
    pdf: FPDF,
    paragraphs: list[str],
    y_start: float,
    y_max: float,
    margin: float,
    full_w: float,
    floats: list[FloatBox],
    font_size: float = 9.2,
    line_h: float = 0.145,
    para_gap: float = 0.11,
) -> float:
    pdf.set_font("Helvetica", "", font_size)
    y = y_start
    for para in paragraphs:
        if y >= y_max - line_h:
            break
        words = para.split()
        line_words: list[str] = []
        i = 0
        while i < len(words) and y < y_max - line_h:
            word = words[i]
            trial = (" ".join(line_words + [word])).strip()
            aw = avail_width_at_y(y, margin, full_w, floats)
            if pdf.get_string_width(trial) <= aw:
                line_words.append(word)
                i += 1
            else:
                if line_words:
                    pdf.set_xy(margin, y)
                    pdf.cell(aw, line_h, " ".join(line_words), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                    y = pdf.get_y()
                    line_words = []
                else:
                    pdf.set_xy(margin, y)
                    pdf.multi_cell(aw, line_h, word)
                    y = pdf.get_y()
                    i += 1
        if line_words and y < y_max:
            aw = avail_width_at_y(y, margin, full_w, floats)
            pdf.set_xy(margin, y)
            pdf.cell(aw, line_h, " ".join(line_words), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            y = pdf.get_y()
        y += para_gap
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
    pdf.set_font("Helvetica", "B", 21)
    pdf.cell(CONTENT_W, 0.28, "Make Gordonston Great Again", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.05

    pdf.set_font("Helvetica", "I", 10.5)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.16, data.get("subtitle", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.03

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_xy(MARGIN, y)
    pdf.cell(CONTENT_W, 0.14, data.get("tagline", ""), new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    y = pdf.get_y() + 0.1

    hero_max_h = 1.95
    hero_jpg, hero_w, hero_h = prepare_image(HERO, CONTENT_W, hero_max_h)
    try:
        hero_x = MARGIN + (CONTENT_W - hero_w) / 2
        pdf.image(str(hero_jpg), x=hero_x, y=y, w=hero_w, h=hero_h)
        y += hero_h + 0.12
    finally:
        hero_jpg.unlink(missing_ok=True)

    pdf.set_xy(MARGIN, y)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(35, 55, 85)
    pdf.cell(CONTENT_W, 0.18, "The neighborhood plan", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0, 0, 0)
    y = pdf.get_y() + 0.08

    body_top = y
    discovery_reserve = 0.38
    body_bottom = FOOTER_TOP - discovery_reserve

    class_w = 2.55
    class_max_h = min(2.35, body_bottom - body_top - 0.2)
    class_jpg, class_dw, class_dh = prepare_image(CLASS_IMG, class_w, class_max_h)
    class_x = MARGIN + CONTENT_W - class_dw
    float_box = FloatBox(x=class_x, y=body_top, w=class_dw, h=class_dh)
    floats: list[FloatBox] = [float_box]

    try:
        pdf.image(str(class_jpg), x=class_x, y=body_top, w=class_dw, h=class_dh)
    finally:
        class_jpg.unlink(missing_ok=True)

    y = flow_paragraphs(
        pdf,
        data["paragraphs"],
        body_top,
        body_bottom,
        MARGIN,
        CONTENT_W,
        floats,
        font_size=9.0,
        line_h=0.142,
        para_gap=0.1,
    )

    disc_y = max(y + 0.06, FOOTER_TOP - discovery_reserve)
    if disc_y > FOOTER_TOP - 0.2:
        disc_y = FOOTER_TOP - discovery_reserve

    pdf.set_draw_color(200, 200, 200)
    pdf.line(MARGIN, disc_y - 0.05, MARGIN + CONTENT_W, disc_y - 0.05)
    pdf.set_xy(MARGIN, disc_y)
    pdf.set_font("Helvetica", "I", 8)
    disc = data.get("discovery", "").replace("**", "")
    pdf.multi_cell(CONTENT_W, 0.12, disc, align="C")

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
    data = parse_source(SOURCE)
    if not data["paragraphs"]:
        sys.exit("Source must include ## body paragraphs")
    render(data)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build FOX 10 callout overlay PNG + SVG (2160x3840 and 1080x1920)."""
from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent
W, H = 2160, 3840

# Label box lower-right; arrow tip on orange-shirt FOX 10 cam op (left, torso/camera).
START = (1180, 1180)
TIP = (290, 2050)


def draw_overlay() -> Image.Image:
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.line([START, TIP], fill=(255, 40, 40, 240), width=28)
    ang = math.atan2(TIP[1] - START[1], TIP[0] - START[0])
    ah, aw = 90, 55
    p1 = (
        TIP[0] - ah * math.cos(ang) + aw * math.sin(ang),
        TIP[1] - ah * math.sin(ang) - aw * math.cos(ang),
    )
    p2 = (
        TIP[0] - ah * math.cos(ang) - aw * math.sin(ang),
        TIP[1] - ah * math.sin(ang) + aw * math.cos(ang),
    )
    d.polygon([TIP, p1, p2], fill=(255, 40, 40, 240))

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_s = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
    except OSError:
        font = ImageFont.load_default()
        font_s = font

    tx, ty = 980, 980
    pad = 28
    lines = ["FOX 10", "packing up"]
    tw = max(d.textlength(line, font=font) for line in lines)
    th = 72 * 2 + 16
    box = [tx - pad, ty - pad, tx + tw + pad, ty + th + pad]
    d.rounded_rectangle(box, radius=24, fill=(0, 0, 0, 200), outline=(255, 40, 40, 255), width=6)
    d.text((tx, ty), lines[0], font=font, fill=(255, 220, 50, 255))
    d.text((tx, ty + 80), lines[1], font=font_s, fill=(255, 255, 255, 255))
    return ov


def write_svg() -> None:
    x1, y1 = START
    x2, y2 = TIP
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <marker id="head" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 z" fill="#ff2828"/>
    </marker>
  </defs>
  <g id="fox10-callout">
    <rect x="952" y="952" width="620" height="220" rx="24" fill="#000000cc" stroke="#ff2828" stroke-width="6"/>
    <text x="980" y="1036" font-family="DejaVu Sans, sans-serif" font-size="72" font-weight="bold" fill="#ffdc32">FOX 10</text>
    <text x="980" y="1116" font-family="DejaVu Sans, sans-serif" font-size="48" fill="#ffffff">packing up</text>
    <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#ff2828" stroke-width="28" marker-end="url(#head)"/>
  </g>
</svg>
"""
    (BASE / "fox10-packup-arrow.svg").write_text(svg, encoding="utf-8")


def main() -> None:
    ov = draw_overlay()
    ov.convert("RGBA").save(BASE / "fox10-packup-arrow.png", "PNG")
    ov.resize((1080, 1920), Image.Resampling.LANCZOS).save(
        BASE / "fox10-packup-arrow-1080.png", "PNG"
    )
    write_svg()
    print(f"arrow tip {TIP} -> {BASE / 'fox10-packup-arrow.png'}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Overlay dates/labels on generated illustrations (Pillow)."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from image_gen.guard import OverwriteBlockedError, plan_image_write, write_bytes
from image_gen.paths import FILES_REPO


def resolve_input(path: str) -> Path:
    p = Path(path)
    if p.is_absolute():
        return p.resolve()
    return (FILES_REPO / path).resolve()


def default_output_path(inp: Path, in_place: bool) -> Path:
    if in_place:
        return inp
    return inp.with_name(inp.stem + "-annotated.png")


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    ):
        if Path(name).is_file():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def draw_etched_date(draw: ImageDraw.ImageDraw, text: str, box: tuple[int, int, int, int], font) -> None:
    x1, y1, x2, y2 = box
    # shadow
    draw.text((x1 + 2, y1 + 2), text, fill=(20, 10, 5, 200), font=font)
    draw.text((x1, y1), text, fill=(255, 220, 160, 255), font=font)
    draw.rectangle([x1 - 4, y1 - 4, x2 + 8, y2 + 8], outline=(180, 140, 90, 180), width=2)


def draw_badge(draw: ImageDraw.ImageDraw, text: str, box: tuple[int, int, int, int], font) -> None:
    x1, y1, x2, y2 = box
    draw.rounded_rectangle([x1 - 8, y1 - 6, x2 + 12, y2 + 10], radius=8, fill=(0, 0, 0, 160))
    draw.text((x1, y1), text, fill=(255, 255, 255, 255), font=font)


def main() -> int:
    parser = argparse.ArgumentParser(description="Annotate illustration PNG")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", default="")
    parser.add_argument("--date", default="", help="Date string e.g. '670 BCE'")
    parser.add_argument("--labels", default="", help='JSON array of strings or {"text","x","y"} objects')
    parser.add_argument("--style", default="etched", choices=["etched", "badge"])
    parser.add_argument("--in-place", action="store_true")
    parser.add_argument("--yes-overwrite", action="store_true")
    args = parser.parse_args()

    inp = resolve_input(args.input)
    if not inp.is_file():
        print(f"Error: not found: {inp}", file=sys.stderr)
        return 1

    out = Path(args.output).resolve() if args.output else default_output_path(inp, args.in_place)

    try:
        plan = plan_image_write(out, args.yes_overwrite)
    except OverwriteBlockedError as e:
        print(str(e), file=sys.stderr)
        return 2

    img = Image.open(inp).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    w, h = img.size
    font_size = max(24, h // 40)
    font = load_font(font_size)

    if args.date:
        bbox = draw.textbbox((0, 0), args.date, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        box = (w - tw - int(w * 0.04), h - th - int(h * 0.05), w - int(w * 0.04), h - int(h * 0.05))
        if args.style == "badge":
            draw_badge(draw, args.date, box, font)
        else:
            draw_etched_date(draw, args.date, box, font)

    if args.labels:
        try:
            labels = json.loads(args.labels)
        except json.JSONDecodeError as e:
            print(f"Invalid --labels JSON: {e}", file=sys.stderr)
            return 1
        if isinstance(labels, list):
            y = int(h * 0.08)
            for item in labels:
                if isinstance(item, str):
                    text = item
                    x = int(w * 0.04)
                else:
                    text = str(item.get("text", ""))
                    x = int(item.get("x", w * 0.04))
                    y = int(item.get("y", y))
                draw.text((x, y), text, fill=(255, 255, 255, 230), font=font)
                y += font_size + 8

    composed = Image.alpha_composite(img, overlay)
    from io import BytesIO

    buf = BytesIO()
    composed.convert("RGB").save(buf, format="PNG")
    write_bytes(plan, buf.getvalue())
    print(f"Wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

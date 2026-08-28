#!/usr/bin/env python3
"""Assign repo images to blog windows (no overlap) and optionally patch blog markdown.

Each raster file is owned by exactly one blog entry: the first dated post whose
filename date is on or after the image's first git add date.

Usage:
  python3 scripts/blog-image-windows.py list [--blog YYYY-MM-DD-slug.md]
  python3 scripts/blog-image-windows.py apply [--blog FILE] [--dry-run]
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] if "__file__" in globals() else Path.cwd()
BLOG_DIR = ROOT / "blog"
BASE = "https://paradigmthreat.net/"
IMG_RE = re.compile(r"!\[[^\]]*\]\((https://paradigmthreat\.net/)?([^)]+)\)")
GALLERY_START = re.compile(r"^## Image gallery\b", re.M)
MAX_OVERFLOW = 40
MAX_INLINE_SUGGEST = 0  # apply only adds overflow gallery; inline is editorial


def blog_files() -> list[Path]:
    return sorted(BLOG_DIR.glob("2026-*.md"))


def blog_date(path: Path) -> str:
    return path.name[:10]


def first_add_dates() -> dict[str, str]:
    cmd = [
        "git",
        "log",
        "--diff-filter=A",
        "--name-only",
        "--pretty=format:%aI",
        "--",
        "*.png",
        "*.jpg",
        "*.jpeg",
        "*.webp",
        "*.gif",
    ]
    out = subprocess.check_output(cmd, cwd=ROOT, text=True, errors="replace")
    first: dict[str, str] = {}
    cur: str | None = None
    for line in out.splitlines():
        line = line.strip()
        if re.match(r"\d{4}-\d{2}-\d{2}", line):
            cur = line[:10]
        elif cur and re.search(r"\.(png|jpe?g|webp|gif)$", line, re.I):
            first.setdefault(line, cur)
    return first


def assign_images(first: dict[str, str]) -> dict[str, list[str]]:
    blogs = blog_files()
    dates = [blog_date(p) for p in blogs]
    out: dict[str, list[str]] = {p.name: [] for p in blogs}
    for img, d in sorted(first.items(), key=lambda x: (x[1], x[0])):
        owner: str | None = None
        for i, (path, bd) in enumerate(zip(blogs, dates)):
            prev = dates[i - 1] if i else "0000-01-01"
            if d > prev and d <= bd:
                owner = path.name
                break
        if owner:
            out[owner].append(img)
    return out


def alt_text(img: str) -> str:
    """Best-effort alt from first markdown reference in repo."""
    name = Path(img).name
    try:
        hits = subprocess.check_output(
            ["rg", "-l", re.escape(name), str(ROOT), "--glob", "*.md"],
            text=True,
            errors="replace",
        ).strip().splitlines()
    except subprocess.CalledProcessError:
        hits = []
    for hit in hits:
        if "/blog/" in hit.replace("\\", "/"):
            continue
        try:
            text = Path(hit).read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for m in re.finditer(r"!\[([^\]]*)\][^(]*\([^)]*" + re.escape(name), text):
            alt = m.group(1).strip()
            if alt:
                return alt
    stem = Path(img).stem.replace("-", " ").replace("_", " ")
    return stem


def img_md(img: str) -> str:
    return f"![{alt_text(img)}]({BASE}{img})"


def paths_in_blog(text: str) -> set[str]:
    found: set[str] = set()
    for m in IMG_RE.finditer(text):
        path = m.group(2).lstrip("/")
        found.add(path)
    return found


def strip_gallery(text: str) -> str:
    m = GALLERY_START.search(text)
    if not m:
        return text
    start = m.start()
    rest = text[start:]
    # end at next H2 after gallery, or Topics line, or Last updated
    end_m = re.search(
        r"\n## (?!Image gallery)|\n\*Topics:\*|\n\*\*Last updated:",
        rest,
    )
    end = start + (end_m.start() if end_m else len(rest))
    return text[:start].rstrip() + "\n\n" + text[end:].lstrip("\n")


def insert_before_closing(text: str, block: str) -> str:
    markers = [
        "\n## Publication notes",
        "\n## Reading order",
        "\n---\n\n*Topics:",
        "\n*Topics:",
        "\n**Last updated:",
    ]
    for marker in markers:
        idx = text.find(marker)
        if idx != -1:
            return text[:idx].rstrip() + "\n\n" + block.rstrip() + "\n\n" + text[idx:].lstrip("\n")
    return text.rstrip() + "\n\n" + block.rstrip() + "\n"


def build_gallery(blog_name: str, owned: list[str], inline: set[str]) -> str:
    overflow = [i for i in owned if i not in inline]
    if not overflow:
        return ""
    bd = blog_name[:10]
    prev_i = [p.name for p in blog_files()].index(blog_name)
    prev = blog_files()[prev_i - 1].name[:10] if prev_i else "repo start"
    lines = [
        f"## Image gallery — assets committed in this window ({prev} → {bd})",
        "",
        f"Raster files **first added** after **{prev}** through **{bd}** (exclusive windows — each image appears in **one** blog entry only). "
        "Heroes placed inline above; remainder below.",
        "",
    ]
    total = len(overflow)
    show = overflow[:MAX_OVERFLOW]
    for img in show:
        lines.append(img_md(img))
        lines.append("")
    if total > MAX_OVERFLOW:
        lines.append(
            f"*…and **{total - MAX_OVERFLOW}** more assets in this window (`python3 scripts/blog-image-windows.py list --blog {blog_name}`).*"
        )
        lines.append("")
    return "\n".join(lines)


def remove_foreign_images(text: str, allowed: set[str]) -> str:
    def repl(m: re.Match[str]) -> str:
        prefix = m.group(1) or ""
        path = m.group(2).lstrip("/")
        if path in allowed:
            return m.group(0)
        return ""
    cleaned = IMG_RE.sub(repl, text)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned


def apply_blog(path: Path, owned: list[str], dry_run: bool) -> None:
    allowed = set(owned)
    text = path.read_text(encoding="utf-8")
    inline = paths_in_blog(text) & allowed
    text = remove_foreign_images(text, allowed)
    text = strip_gallery(text)
    gallery = build_gallery(path.name, owned, paths_in_blog(text))
    if gallery:
        text = insert_before_closing(text, gallery)
    if dry_run:
        print(f"[dry-run] {path.name}: inline={len(inline)} overflow={len(owned)-len(inline)}")
        return
    path.write_text(text, encoding="utf-8")
    print(f"updated {path.name}: inline={len(paths_in_blog(text) & allowed)} gallery={max(0,len(owned)-len(paths_in_blog(text) & allowed))}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["list", "apply"])
    ap.add_argument("--blog", help="Single blog filename under blog/")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    first = first_add_dates()
    assigned = assign_images(first)

    if args.cmd == "list":
        targets = [BLOG_DIR / args.blog] if args.blog else blog_files()
        for path in targets:
            imgs = assigned.get(path.name, [])
            print(f"{path.name}\t{len(imgs)}")
            for img in imgs:
                print(f"  {first[img]}\t{img}")
        return 0

    targets = [BLOG_DIR / args.blog] if args.blog else blog_files()
    for path in targets:
        apply_blog(path, assigned.get(path.name, []), args.dry_run)
    return 0


if __name__ == "__main__":
    sys.exit(main())

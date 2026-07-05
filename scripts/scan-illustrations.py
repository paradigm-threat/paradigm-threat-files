#!/usr/bin/env python3
"""Scan corpora for missing heroes and pending image-gen markers (no API calls)."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from image_gen.paths import FILES_REPO, TIMELINE_REPO, default_output_path, is_timeline_markdown
from image_gen.prompts import cli_command_for, parse_markdown_meta

ARTIST_TODO_RE = __import__("re").compile(r"\|\s*\*\*TODO\*\*\s*\|", re.IGNORECASE)


def iter_markdown_files(corpus: str) -> list[Path]:
    out: list[Path] = []
    if corpus in ("files", "both"):
        for p in FILES_REPO.rglob("*.md"):
            if "node_modules" in p.parts or "/docs/debate-notes/" in str(p):
                continue
            out.append(p)
    if corpus in ("timeline", "both"):
        content = TIMELINE_REPO / "content"
        if content.is_dir():
            out.extend(content.rglob("*.md"))
    return sorted(out)


def rel_for_cli(md_path: Path) -> str:
    try:
        return str(md_path.relative_to(FILES_REPO))
    except ValueError:
        return f"../paradigm-threat-timeline/{md_path.relative_to(TIMELINE_REPO)}"


def scan_file(md_path: Path) -> list[str]:
    lines: list[str] = []
    try:
        content = md_path.read_text(encoding="utf-8")
    except OSError:
        return lines
    meta = parse_markdown_meta(content)
    rel = rel_for_cli(md_path)
    aspect = "timeline" if is_timeline_markdown(md_path) else "hero"

    for slot in meta.pending_slots:
        out = default_output_path(md_path, slot)
        lines.append(f"PENDING {rel} slot={slot} output={out.name}")
        lines.append(f"  {cli_command_for(rel, slot=slot, aspect=aspect)}")

    if not meta.has_hero_image and meta.title and "page.md" not in md_path.name:
        out = default_output_path(md_path, "hero")
        if not out.is_file():
            lines.append(f"MISSING_HERO {rel}")
            lines.append(f"  {cli_command_for(rel, slot='hero', aspect=aspect)}")

    for block in meta.blocks:
        if block.kind.startswith("pending"):
            continue
        out = default_output_path(md_path, block.kind if block.kind != "hero" else "hero")
        if not out.is_file():
            model = block.model or "final"
            asp = block.aspect or aspect
            lines.append(f"IMAGE_GEN_BLOCK {rel} kind={block.kind}")
            lines.append(
                f"  {cli_command_for(rel, slot=block.kind if block.kind in ('hero', 'section') else 'hero', model=model, aspect=asp)}"
            )

    return lines


def scan_illustrations_todo() -> list[str]:
    doc = TIMELINE_REPO / "docs" / "ILLUSTRATIONS.md"
    if not doc.is_file():
        return []
    text = doc.read_text(encoding="utf-8")
    lines: list[str] = []
    for line in text.splitlines():
        if "**TODO**" in line and "Artist/CGI" in line:
            lines.append(f"TIMELINE_TODO {line.strip()[:120]}")
    return lines


def main() -> int:
    parser = argparse.ArgumentParser(description="Suggest illustration generation commands")
    parser.add_argument("--corpus", default="both", choices=["files", "timeline", "both"])
    args = parser.parse_args()

    any_found = False
    for md in iter_markdown_files(args.corpus):
        hits = scan_file(md)
        if hits:
            any_found = True
            print("\n".join(hits))

    if args.corpus in ("timeline", "both"):
        todos = scan_illustrations_todo()
        if todos:
            any_found = True
            print("\n".join(todos[:20]))
            if len(todos) > 20:
                print(f"  … and {len(todos) - 20} more TODO rows in ILLUSTRATIONS.md")

    if not any_found:
        print("No pending illustration work found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

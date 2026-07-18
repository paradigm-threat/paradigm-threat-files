"""Resolve output paths for files articles and timeline chapters."""
from __future__ import annotations

import re
from pathlib import Path

FILES_REPO = Path(__file__).resolve().parents[2]
TIMELINE_REPO = FILES_REPO.parent / "paradigm-threat-timeline"

HERO_IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]+\)")


def resolve_article_path(article: str) -> Path:
    p = Path(article)
    if p.is_absolute():
        return p.resolve()
    if p.parts and p.parts[0] == "..":
        return (FILES_REPO / p).resolve()
    # timeline relative from files/scripts
    if str(article).startswith("../paradigm-threat-timeline/"):
        return (FILES_REPO.parent / article.replace("../", "", 1)).resolve()
    return (FILES_REPO / article).resolve()


def is_timeline_markdown(md_path: Path) -> bool:
    try:
        md_path.resolve().relative_to(TIMELINE_REPO.resolve())
        return True
    except ValueError:
        return False


def slug_from_markdown(md_path: Path) -> str:
    return md_path.stem


def default_output_path(
    md_path: Path,
    slot: str,
    *,
    output: Path | None = None,
) -> Path:
    if output is not None:
        return output.resolve()
    base = slug_from_markdown(md_path)
    if slot != "hero":
        base = f"{base}-{slot}"
    if is_timeline_markdown(md_path):
        # content/.../file.md -> media/parallel path or beside chapter
        rel = md_path.resolve().relative_to(TIMELINE_REPO.resolve())
        if rel.parts[0] == "content":
            media_rel = Path("media") / Path(*rel.parts[1:]).with_suffix(".png")
            return (TIMELINE_REPO / media_rel).resolve()
    return md_path.with_name(f"{base}.png")


def aspect_dimensions(aspect: str) -> tuple[int, int]:
    if aspect == "timeline":
        return 2560, 1440
    if aspect == "hero":
        return 1920, 1080
    if aspect == "square":
        return 1024, 1024
    raise ValueError(f"unknown aspect: {aspect}")

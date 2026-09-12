#!/usr/bin/env python3
"""Build sitemap.xml and robots.txt from the markdown tree.

Run from repo root before fleet push when article paths change.
Catalog recency/thumbs are QUERY (`path_tree` + `search.yaml`); this script
only writes crawler artifacts.
"""
from __future__ import annotations

import argparse
import html
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote

SKIP_NAMES = {"page.md", "readme.md", "agents.md"}
SKIP_PREFIXES = ("docs/", "hooks/", "page-sections/")
DEFAULT_BASE = "https://relay.paradigmthreat.net"
SKIP_DIR_PARTS = {".git", ".venv", "node_modules", "thin-migrate"}


def git_updated_iso(repo: Path, rel: str) -> str:
    try:
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%cI", "--", rel],
            cwd=repo,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
        return out
    except subprocess.CalledProcessError:
        return ""


def collect_rows(repo: Path) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for path in sorted(repo.rglob("*.md")):
        rel = path.relative_to(repo).as_posix()
        base = path.name.lower()
        if base in SKIP_NAMES or base.endswith(".auto.md"):
            continue
        if rel.startswith(SKIP_PREFIXES):
            continue
        if any(p in SKIP_DIR_PARTS for p in path.parts):
            continue
        updated = git_updated_iso(repo, rel)
        rows.append((rel, updated))
    rows.sort(key=lambda r: (r[1], r[0]), reverse=True)
    return rows


def loc_url(base: str, rel: str) -> str:
    """Public path: keep .md for park tip URLs (same as DirNav / article routes)."""
    b = base.rstrip("/")
    parts = [quote(p, safe="") for p in rel.split("/") if p]
    return b + "/" + "/".join(parts)


def write_sitemap(out: Path, base: str, rows: list[tuple[str, str]]) -> None:
    urls: list[tuple[str, str]] = []
    urls.append((base.rstrip("/") + "/", ""))
    for path, updated in rows:
        urls.append((loc_url(base, path), updated[:10] if updated else ""))
    seen: set[str] = set()
    ordered: list[tuple[str, str]] = []
    for loc, lastmod in urls:
        if loc in seen:
            continue
        seen.add(loc)
        ordered.append((loc, lastmod))

    chunks = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, lastmod in ordered:
        chunks.append("  <url>")
        chunks.append(f"    <loc>{html.escape(loc, quote=True)}</loc>")
        if lastmod:
            chunks.append(f"    <lastmod>{html.escape(lastmod)}</lastmod>")
        chunks.append("  </url>")
    chunks.append("</urlset>")
    chunks.append("")
    out.write_text("\n".join(chunks), encoding="utf-8")
    print(f"wrote {len(ordered)} urls to {out}")


def write_robots(out: Path, base: str) -> None:
    sitemap = base.rstrip("/") + "/sitemap.xml"
    body = (
        "User-agent: *\n"
        "Allow: /\n"
        f"Sitemap: {sitemap}\n"
    )
    out.write_text(body, encoding="utf-8")
    print(f"wrote {out}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Checkout root (default: parent of scripts/)",
    )
    parser.add_argument(
        "--base-url",
        default=DEFAULT_BASE,
        help=f"Public origin for sitemap/robots (default: {DEFAULT_BASE})",
    )
    args = parser.parse_args()
    repo = args.repo.resolve()
    base = args.base_url.rstrip("/")

    rows = collect_rows(repo)
    write_sitemap(repo / "sitemap.xml", base, rows)
    write_robots(repo / "robots.txt", base)
    return 0


if __name__ == "__main__":
    sys.exit(main())

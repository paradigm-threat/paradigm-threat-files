#!/usr/bin/env python3
"""Build nav-index.txt, sitemap.xml, and robots.txt from the tip tree.

Run from repo root before fleet push when markdown titles or commit dates change.
Optional third nav-index column feeds ChangeLog Last updated without QUERY during SSR.
"""
from __future__ import annotations

import argparse
import html
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote

SKIP_NAMES = {"page.md", "readme.md"}
DEFAULT_BASE = "https://relay.paradigmthreat.net"


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


def title_from_file(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return path.stem
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return path.stem.replace("-", " ").replace("_", " ")


def collect_rows(repo: Path) -> list[tuple[str, str, str]]:
    rows: list[tuple[str, str, str]] = []
    for path in sorted(repo.rglob("*.md")):
        rel = path.relative_to(repo).as_posix()
        base = path.name.lower()
        if base in SKIP_NAMES or base.endswith(".auto.md"):
            continue
        if rel.startswith("docs/"):
            continue
        title = title_from_file(path)
        updated = git_updated_iso(repo, rel)
        rows.append((rel, title, updated))
    rows.sort(key=lambda r: (r[2], r[0]), reverse=True)
    return rows


def write_nav_index(out: Path, rows: list[tuple[str, str, str]]) -> None:
    lines = []
    for path, title, updated in rows:
        title = title.replace("\t", " ").replace("\n", " ")
        if updated:
            lines.append(f"{path}\t{title}\t{updated}")
        else:
            lines.append(f"{path}\t{title}")
    out.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    print(f"wrote {len(lines)} rows to {out}")


def loc_url(base: str, rel: str) -> str:
    """Public path: keep .md for park tip URLs (same as DirNav / article routes)."""
    b = base.rstrip("/")
    # quote path segments but keep slashes
    parts = [quote(p, safe="") for p in rel.split("/") if p]
    return b + "/" + "/".join(parts)


def write_sitemap(out: Path, base: str, rows: list[tuple[str, str, str]]) -> None:
    urls: list[tuple[str, str]] = []
    # Home hub
    urls.append((base.rstrip("/") + "/", ""))
    for path, _title, updated in rows:
        urls.append((loc_url(base, path), updated[:10] if updated else ""))
    # Dedupe while preserving order
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
        "--out",
        type=Path,
        default=None,
        help="nav-index output path (default: <repo>/nav-index.txt)",
    )
    parser.add_argument(
        "--base-url",
        default=DEFAULT_BASE,
        help=f"Public origin for sitemap/robots (default: {DEFAULT_BASE})",
    )
    parser.add_argument(
        "--skip-sitemap",
        action="store_true",
        help="Only write nav-index.txt",
    )
    args = parser.parse_args()
    repo = args.repo.resolve()
    out = args.out or (repo / "nav-index.txt")
    base = args.base_url.rstrip("/")

    rows = collect_rows(repo)
    write_nav_index(out, rows)
    if not args.skip_sitemap:
        write_sitemap(repo / "sitemap.xml", base, rows)
        write_robots(repo / "robots.txt", base)
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Build nav-index.txt as path\\ttitle\\tupdatedIso from git history.

Run from repo root before fleet push when markdown titles or commit dates change.
Optional third column feeds ChangeLog Last updated without QUERY during SSR.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

SKIP_NAMES = {"page.md", "readme.md"}


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
        help="Output path (default: <repo>/nav-index.txt)",
    )
    args = parser.parse_args()
    repo = args.repo.resolve()
    out = args.out or (repo / "nav-index.txt")

    rows = collect_rows(repo)
    lines = []
    for path, title, updated in rows:
        title = title.replace("\t", " ").replace("\n", " ")
        if updated:
            lines.append(f"{path}\t{title}\t{updated}")
        else:
            lines.append(f"{path}\t{title}")

    out.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    print(f"wrote {len(lines)} rows to {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

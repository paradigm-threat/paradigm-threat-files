#!/usr/bin/env python3
"""One-off + reusable: normalize Keywords / ## Keywords hashtags to Option B.

- PascalCase tokens, no hyphens or underscores inside the tag.
- Merges kebab/underscore runs into one camel token.
- Replaces ## Keywords sections with a single Keywords: line (indexer only reads Keywords:).

Run from repo root:  python3 scripts/migrate_keywords_option_b.py --apply
Dry run (default):    python3 scripts/migrate_keywords_option_b.py
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# Short tokens we want ALL CAPS in the index.
ACRONYMS = frozenset(
    {
        "uap",
        "ufo",
        "cia",
        "dia",
        "rv",
        "nasa",
        "foia",
        "ussr",
        "usa",
        "uk",
        "eu",
        "un",
        "api",
        "json",
        "html",
        "pdf",
        "ocr",
        "aawsap",
        "mfee",
        "ihra",
        "jda",
        "nwo",
        "wef",
        "qr",
        "id",
        "gps",
        "lgbtq",
        "mi6",
        "wmd",
        "gcr",
        "nesara",
        "psrl",
        "hitl",
        "hmd",
        "mkultra",
        "crest",
        "air",
        "rdp",
        "mon",
        "sub",
        "mans",
        "ii",
        "iii",
        "iv",
        "dc",
    }
)

_KEYWORDS_LINE = re.compile(r"^Keywords:\s*(.+)$", re.MULTILINE | re.IGNORECASE)
_HASH_TOKEN = re.compile(r"#([^\s#]+)")
_SECTION_KEYWORDS = re.compile(
    r"\n## Keywords\s*\n+((?:#[^\n]+(?:\n|$))+)",
    re.MULTILINE,
)


def _segment_piece(part: str) -> str:
    if not part:
        return ""
    if part.isdigit():
        return part
    pl = part.lower()
    if pl in ACRONYMS:
        return pl.upper()
    mo = re.fullmatch(r"(\d+)(st|nd|rd|th)", part, re.IGNORECASE)
    if mo:
        return mo.group(1) + mo.group(2).lower()
    if len(part) <= 5 and part.isalpha() and part.isupper():
        return part.upper()
    return part[0].upper() + (part[1:].lower() if len(part) > 1 else "")


def _from_kebab_or_underscore(raw: str) -> str:
    t = raw.replace("_", "-")
    out: list[str] = []
    for chunk in t.split("-"):
        if not chunk:
            continue
        pieces = re.findall(r"\d+|[a-zA-Z]+", chunk)
        if not pieces:
            out.append(chunk)
            continue
        out.append("".join(_segment_piece(p) for p in pieces))
    return "".join(out)


def normalize_tag_body(raw: str) -> str:
    """Map one hashtag body (no #) to canonical form."""
    if not raw:
        return raw
    if "-" in raw or "_" in raw:
        return _from_kebab_or_underscore(raw)
    if raw.isupper() and raw.isalnum():
        return raw
    pl = raw.lower()
    if pl in ACRONYMS:
        return pl.upper()
    if any(c.isupper() for c in raw[1:]):
        return raw
    return raw[0].upper() + (raw[1:].lower() if len(raw) > 1 else "")


def _rewrite_keywords_line(line: str) -> str:
    if not re.match(r"^Keywords:\s*", line, re.IGNORECASE):
        return line
    m = re.match(r"^(Keywords:\s*)(.*)$", line, re.IGNORECASE)
    if not m:
        return line
    prefix, rest = m.group(1), m.group(2)
    bodies = _HASH_TOKEN.findall(rest)
    if not bodies:
        return line
    new_tags = ["#" + normalize_tag_body(b) for b in bodies]
    newline = "\n" if line.endswith("\n") else ""
    return prefix + " ".join(new_tags) + newline


def _migrate_section_keywords(content: str) -> tuple[str, bool]:
    changed = False

    def repl(m: re.Match[str]) -> str:
        nonlocal changed
        block = m.group(1)
        bodies = _HASH_TOKEN.findall(block)
        if not bodies:
            return m.group(0)
        changed = True
        tags = " ".join("#" + normalize_tag_body(b) for b in bodies)
        return "\nKeywords: " + tags + "\n"

    new_content = _SECTION_KEYWORDS.sub(repl, content)
    return new_content, changed


def migrate_markdown(text: str) -> tuple[str, bool]:
    changed = False
    text, sec_changed = _migrate_section_keywords(text)
    changed = changed or sec_changed

    lines = text.splitlines(keepends=True)
    out_lines: list[str] = []
    for line in lines:
        if re.match(r"^Keywords:\s*", line, re.IGNORECASE):
            new_line = _rewrite_keywords_line(line)
            if new_line != line:
                changed = True
            out_lines.append(new_line)
        else:
            out_lines.append(line)
    return "".join(out_lines), changed


def iter_md_files(root: Path) -> list[Path]:
    skip = {".git", "node_modules", ".venv"}
    paths: list[Path] = []
    for p in root.rglob("*.md"):
        if any(part in skip for part in p.parts):
            continue
        paths.append(p)
    return sorted(paths)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="write files; default is dry-run")
    args = ap.parse_args()
    root = REPO_ROOT
    n_changed = 0
    for path in iter_md_files(root):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as e:
            print(f"skip read {path}: {e}", file=sys.stderr)
            continue
        new_text, changed = migrate_markdown(text)
        if not changed:
            continue
        n_changed += 1
        rel = path.relative_to(root)
        print(rel)
        if args.apply:
            path.write_text(new_text, encoding="utf-8", newline="\n")
    print(f"{'Wrote' if args.apply else 'Would change'} {n_changed} files", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

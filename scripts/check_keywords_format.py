#!/usr/bin/env python3
"""Fail if markdown violates Option B keyword rules (see docs/PARADIGM_INVESTIGATION_INSTRUCTIONS.md).

- No `## Keywords` (indexer only reads `Keywords:` at line start after optional BOM).
- Any `Keywords:` line: each #token must not contain '-' or '_'.

Exit 1 on violations; prints paths and reasons.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
_SKIP = {".git", "node_modules", ".venv"}

_KEYWORDS_LINE = re.compile(r"^Keywords:\s*(.+)$", re.MULTILINE | re.IGNORECASE)
_HASH = re.compile(r"#([^\s#]+)")
_FORBIDDEN_SECTION = re.compile(r"^## Keywords\s*$", re.MULTILINE)


def check_file(path: Path) -> list[str]:
    errs: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as e:
        return [f"read error: {e}"]
    if _FORBIDDEN_SECTION.search(text):
        errs.append("uses forbidden heading `## Keywords` (use a single `Keywords:` line)")
    for m in _KEYWORDS_LINE.finditer(text):
        rest = m.group(1)
        for body in _HASH.findall(rest):
            if "-" in body:
                errs.append(f"tag #{body!r} contains '-' (use PascalCase, e.g. #RemoteViewing)")
            if "_" in body:
                errs.append(f"tag #{body!r} contains '_' (use PascalCase)")
    return errs


def main() -> int:
    bad = 0
    for p in sorted(REPO_ROOT.rglob("*.md")):
        if any(x in p.parts for x in _SKIP):
            continue
        reasons = check_file(p)
        if not reasons:
            continue
        bad += 1
        rel = p.relative_to(REPO_ROOT)
        print(f"{rel}:")
        for r in reasons:
            print(f"  - {r}")
    if bad:
        print(f"\n{bad} file(s) with keyword format issues", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

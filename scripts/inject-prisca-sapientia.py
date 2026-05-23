#!/usr/bin/env python3
"""Inject prisca sapientia epistemic foundation into investigation Limits / article Framing blocks."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

INVESTIGATION_PARA = (
    "**Prisca sapientia (epistemic foundation):** This investigation assumes "
    "[**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md)—the historical and philosophical "
    "belief that the ancients possessed a vast, profound understanding of the universe, "
    "nature, and theology that was subsequently lost or degraded. Modern consensus science "
    "and institutions are not treated as default truth; evidence tiers below adjudicate "
    "specific claims.\n\n"
)

ARTICLE_PARA = (
    "**Prisca sapientia (epistemic foundation):** This article assumes "
    "[**prisca sapientia**](https://paradigmthreat.net/docs/PRISCA_SAPIENTIA.md)—the "
    "belief that the ancients possessed a vast, profound understanding of the universe, "
    "nature, and theology that was subsequently lost or degraded. Modern consensus is not "
    "default truth; linked dossiers tier specific claims.\n\n"
)

MARKER = "Prisca sapientia (epistemic foundation)"

EXTRA_INVESTIGATION_NAMES = {
    "reverse-crusades-comparison.md",
    "vril-society.md",
    "wuxing-five-planets-dark-ages.md",
}

LIMITS_HEADINGS = [
    "## Limits and disclaimers",
    "## Limits and Disclaimer",
    "## Limits",
]

FRAMING_HEADINGS = [
    "## Framing and limits",
    "## Scope and limits",
    "## Framing & limits",
]


def is_investigation(path: Path) -> bool:
    name = path.name
    if "investigation" in name.lower():
        return True
    return name in EXTRA_INVESTIGATION_NAMES


def inject_after_heading(text: str, heading: str, paragraph: str) -> str | None:
    if MARKER in text:
        return None
    idx = text.find(heading)
    if idx < 0:
        return None
    insert_at = idx + len(heading)
    # skip blank lines after heading
    while insert_at < len(text) and text[insert_at] in "\r\n":
        insert_at += 1
    return text[:insert_at] + "\n\n" + paragraph + text[insert_at:]


def inject_before_keywords(text: str, paragraph: str) -> str | None:
    if MARKER in text:
        return None
    m = re.search(r"^Keywords:\s", text, re.MULTILINE | re.IGNORECASE)
    if not m:
        return None
    return text[: m.start()] + "\n" + paragraph + text[m.start() :]


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text:
        return False

    new_text: str | None = None
    if is_investigation(path):
        for h in LIMITS_HEADINGS:
            new_text = inject_after_heading(text, h, INVESTIGATION_PARA)
            if new_text:
                break
        if not new_text:
            new_text = inject_before_keywords(text, INVESTIGATION_PARA)
    else:
        for h in FRAMING_HEADINGS:
            new_text = inject_after_heading(text, h, ARTICLE_PARA)
            if new_text:
                break

    if not new_text and is_investigation(path):
        if MARKER not in text:
            block = (
                "\n\n---\n\n## Limits and disclaimers\n\n"
                + INVESTIGATION_PARA.rstrip()
                + "\n"
            )
            new_text = text.rstrip() + block

    if not new_text:
        return False
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> None:
    updated: list[str] = []
    skipped = 0
    for path in sorted(ROOT.rglob("*.md")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] == "docs" and rel.name != "PRISCA_SAPIENTIA.md":
            if "instructions" in rel.parts:
                continue
        if rel.parts[0] == "blog":
            continue
        if path.name == "PRISCA_SAPIENTIA.md":
            continue
        if not is_investigation(path):
            # articles: only parent-folder essays with Framing, or chronology/when-* style
            if "investigations" in rel.parts:
                continue
            if not any(h in path.read_text(encoding="utf-8") for h in FRAMING_HEADINGS):
                continue
        if process_file(path):
            updated.append(str(rel))
        else:
            skipped += 1
    print(f"Updated {len(updated)} files")
    for u in updated[:20]:
        print(f"  + {u}")
    if len(updated) > 20:
        print(f"  ... and {len(updated) - 20} more")
    print(f"Skipped (already had marker or no anchor): {skipped}")


if __name__ == "__main__":
    main()

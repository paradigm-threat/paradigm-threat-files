#!/usr/bin/env python3
"""Replace `> **TL;DR:** TODO` in markdown: remove if <12 paragraph-blocks, else fill from body/frontmatter."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_FILES = frozenset({ROOT / ".github/copilot-instructions.md"})


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :].lstrip("\n")
    return text


def frontmatter_block(text: str) -> str | None:
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    return text[3:end]


def frontmatter_description(text: str) -> str | None:
    block = frontmatter_block(text)
    if not block:
        return None
    # Single-line description: "key: value"
    m = re.search(r"^description:\s*(.+?)\s*$", block, re.M)
    if not m:
        return None
    val = m.group(1).strip()
    if val in ("", '""', "''"):
        return None
    if val.startswith((">", "|", '"')):
        return None  # multiline / folded YAML — skip
    val = val.strip('"').strip("'")
    if len(val) < 25:
        return None
    return val


def count_paragraphs_without_tldr(text: str) -> int:
    t = strip_frontmatter(text)
    t = re.sub(r"^> \*\*TL;DR:\*\*.*\n(?:\n)?", "", t, flags=re.M)
    blocks = re.split(r"\n\s*\n+", t.strip())
    n = 0
    for b in blocks:
        lines = [ln.strip() for ln in b.splitlines() if ln.strip()]
        if not lines:
            continue
        if all(ln.startswith("#") for ln in lines):
            continue
        if all(
            ln.startswith(("```", "<", "![", "|")) for ln in lines
        ):
            continue
        if len(lines) == 1 and lines[0].startswith(("<", "![", "---", "```")):
            continue
        n += 1
    return n


def has_tldr_todo(text: str) -> bool:
    return bool(re.search(r"^> \*\*TL;DR:\*\* TODO\s*$", text, re.M))


def _uppercase_ratio(s: str) -> float:
    letters = [c for c in s if c.isalpha()]
    if not letters:
        return 0.0
    return sum(1 for c in letters if c.isupper()) / len(letters)


def _is_junk_prose(plain: str) -> bool:
    if not plain:
        return True
    if "=====" in plain or "OEBPS/" in plain or "OEBPS" in plain:
        return True
    if _uppercase_ratio(plain) > 0.35 and len(plain) > 80:
        return True
    return False


def md_to_plain(s: str) -> str:
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def clamp_summary(s: str, max_len: int = 420) -> str:
    s = s.strip()
    if not s:
        return s
    if len(s) <= max_len:
        return s
    cut = s[:max_len]
    for sep in (". ", "? ", "! "):
        idx = cut.rfind(sep)
        if idx > max_len // 3:
            return cut[: idx + 1].strip()
    sp = cut.rfind(" ")
    return (cut[:sp] + "…") if sp > 40 else cut + "…"


def body_without_tldr(text: str) -> str:
    t = strip_frontmatter(text)
    return re.sub(r"^> \*\*TL;DR:\*\*.*\n(?:\n)?", "", t, flags=re.M)


def extract_summary(text: str) -> str:
    desc = frontmatter_description(text)
    if desc:
        return clamp_summary(md_to_plain(desc))

    body = body_without_tldr(text)
    # Prefer ## Synopsis / Summary / Abstract section
    m = re.search(
        r"^##\s*(Synopsis|Summary|Abstract|Overview|TL;DR|Introduction)\s*\n+\s*(.+?)(?=^\s*##\s|\Z)",
        body,
        re.S | re.M | re.I,
    )
    if m:
        chunk = m.group(2).strip()
        # first prose paragraph (skip tables / lists)
        for para in re.split(r"\n\s*\n+", chunk):
            lines = [ln.strip() for ln in para.splitlines() if ln.strip()]
            if not lines:
                continue
            if lines[0].startswith(("|", "-", "*", "1.", "```", "<")):
                continue
            plain = md_to_plain(para)
            if len(plain) > 40 and not _is_junk_prose(plain):
                return clamp_summary(plain)

    # First # title for context
    title_m = re.search(r"^#\s+(.+)$", body, re.M)
    title = md_to_plain(title_m.group(1)) if title_m else ""

    blocks = re.split(r"\n\s*\n+", body.strip())
    prose_bits: list[str] = []
    for b in blocks:
        lines = [ln.strip() for ln in b.splitlines() if ln.strip()]
        if not lines:
            continue
        if lines[0].startswith("#"):
            continue
        if any(
            lines[0].startswith(p)
            for p in ("|", "-", "*", "1.", "2.", "3.", "```", "<", "![", "---")
        ):
            continue
        if all(ln.startswith(">") for ln in lines):
            continue
        plain = md_to_plain(b)
        if len(plain) > 35 and not _is_junk_prose(plain):
            prose_bits.append(plain)
        if sum(len(x) for x in prose_bits) > 200:
            break

    joined = " ".join(prose_bits)
    if title and joined:
        out = f"{title}: {joined}"
    elif joined:
        out = joined
    elif title:
        out = title
    else:
        out = "Open research note; see headings and sources in file."

    return clamp_summary(out)


def remove_tldr_line(text: str) -> str:
    return re.sub(r"^> \*\*TL;DR:\*\* TODO\s*\n", "", text, flags=re.M)


def fill_tldr_line(text: str, summary: str) -> str:
    summary = summary.replace("\n", " ").strip()
    if not summary:
        summary = "See article body."
    return re.sub(
        r"^> \*\*TL;DR:\*\* TODO\s*$",
        f"> **TL;DR:** {summary}",
        text,
        count=1,
        flags=re.M,
    )


def main() -> None:
    removed = filled = skipped = 0
    for path in sorted(ROOT.rglob("*.md")):
        if path in SKIP_FILES or "node_modules" in path.parts:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            skipped += 1
            continue
        if not has_tldr_todo(text):
            continue
        n = count_paragraphs_without_tldr(text)
        if n < 12:
            new_text = remove_tldr_line(text)
            if new_text == text:
                skipped += 1
                continue
            path.write_text(new_text, encoding="utf-8")
            removed += 1
        else:
            summary = extract_summary(text)
            new_text = fill_tldr_line(text, summary)
            path.write_text(new_text, encoding="utf-8")
            filled += 1

    print(f"TL;DR TODO removed (<12 blocks): {removed}")
    print(f"TL;DR TODO filled: {filled}")
    print(f"Skipped (no change): {skipped}")


if __name__ == "__main__":
    main()

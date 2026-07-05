"""Build prompts from markdown + timeline sky rules."""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from .paths import FILES_REPO, TIMELINE_REPO, is_timeline_markdown

IMAGE_GEN_BLOCK_RE = re.compile(
    r"<!--\s*image-gen:(?P<kind>[\w-]+)\s*(?P<body>.*?)-->",
    re.DOTALL | re.IGNORECASE,
)
PENDING_RE = re.compile(r"<!--\s*image-gen:pending\s+(?P<slot>\w+)\s*-->", re.IGNORECASE)
TITLE_RE = re.compile(r"^#\s+(.+)$", re.MULTILINE)
HERO_IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]+\)")
DATE_IN_NAME_RE = re.compile(r"(\d{3,4})\s*(BCE|CE|bce|ce)", re.IGNORECASE)

FILES_HERO_STYLE = (
    "Documentary concept art for a paradigm-threat.net investigation article. "
    "Epic historical illustration, dramatic lighting, photorealistic or painterly. "
    "No modern UI, watermarks, or text overlays unless specified."
)

TIMELINE_STYLE = (
    "Epic historical concept art — documentary catastrophist timeline illustration. "
    "Cinematic wide landscape 16:9. Dramatic lighting. No modern elements."
)

SKY_GOLDEN_AGE = (
    "Sky: Northern Hemisphere Configuration — Saturn as sunlike central body WITHOUT ring system, "
    "plasma halo or spoked wheel; Venus as single luminous plasmoid star below Saturn; "
    "Mars as solid sphere in polar stack. Deep violet-blue sky, amber horizon. No multiple random stars."
)

SKY_DARK_AGES = (
    "Sky: Dark Ages — Venus and Mars tethered as comet-dragon; chaotic dusty red atmosphere; "
    "no Saturnian polar wheel."
)

SKY_COMMON_ERA = (
    "Sky: Common Era — familiar night sky with stars, Moon, or Sun as appropriate to the scene."
)


@dataclass
class ImageGenBlock:
    kind: str
    prompt: str = ""
    aspect: str = ""
    model: str = ""
    date: str = ""
    mood: str = ""


@dataclass
class ArticleMeta:
    title: str
    subtitle: str
    blocks: list[ImageGenBlock]
    pending_slots: list[str]
    has_hero_image: bool


def parse_image_gen_body(body: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for line in body.strip().splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, _, val = line.partition(":")
        out[key.strip().lower()] = val.strip()
    return out


def parse_markdown_meta(content: str) -> ArticleMeta:
    blocks: list[ImageGenBlock] = []
    for m in IMAGE_GEN_BLOCK_RE.finditer(content):
        fields = parse_image_gen_body(m.group("body"))
        blocks.append(
            ImageGenBlock(
                kind=m.group("kind").lower(),
                prompt=fields.get("prompt", ""),
                aspect=fields.get("aspect", ""),
                model=fields.get("model", ""),
                date=fields.get("date", ""),
                mood=fields.get("mood", ""),
            )
        )
    pending = [m.group("slot").lower() for m in PENDING_RE.finditer(content)]

    title_m = TITLE_RE.search(content)
    title = title_m.group(1).strip() if title_m else ""

    subtitle = ""
    has_hero = False
    if title_m:
        after = content[title_m.end() :].lstrip("\n")
        for line in after.splitlines():
            s = line.strip()
            if not s:
                continue
            if s.startswith("#") or s.startswith(">") or s.startswith("<!--"):
                break
            if s.startswith("!["):
                has_hero = True
                break
            subtitle = s
            break
        if not has_hero:
            has_hero = bool(HERO_IMAGE_RE.search(content[:2000]))

    return ArticleMeta(
        title=title,
        subtitle=subtitle,
        blocks=blocks,
        pending_slots=pending,
        has_hero_image=has_hero,
    )


def infer_date_from_path(md_path: Path) -> str | None:
    m = DATE_IN_NAME_RE.search(md_path.stem.replace("-", " "))
    if not m:
        return None
    year, era = m.group(1), m.group(2).upper()
    return f"{year} {era}"


def sky_rules_for_date(date_str: str | None) -> str:
    if not date_str:
        return SKY_COMMON_ERA
    m = re.search(r"(\d{3,4})\s*(BCE|CE)", date_str, re.IGNORECASE)
    if not m:
        return SKY_COMMON_ERA
    year = int(m.group(1))
    era = m.group(2).upper()
    if era == "BCE":
        return SKY_GOLDEN_AGE if year > 670 else SKY_DARK_AGES
    if era == "CE" and year < 1053:
        return SKY_DARK_AGES
    return SKY_COMMON_ERA


def block_for_slot(blocks: list[ImageGenBlock], slot: str) -> ImageGenBlock | None:
    for b in blocks:
        if b.kind == slot or b.kind.startswith(slot):
            return b
    return None


def build_prompt(
    md_path: Path,
    content: str,
    *,
    slot: str = "hero",
    extra_prompt: str = "",
    aspect: str | None = None,
) -> tuple[str, str]:
    """Return (full_prompt, aspect_name)."""
    meta = parse_markdown_meta(content)
    block = block_for_slot(meta.blocks, slot)
    timeline = is_timeline_markdown(md_path)

    aspect_name = aspect or (block.aspect if block and block.aspect else "")
    if not aspect_name:
        aspect_name = "timeline" if timeline else "hero"

    parts: list[str] = []
    if timeline:
        parts.append(TIMELINE_STYLE)
        date_str = (block.date if block and block.date else None) or infer_date_from_path(md_path)
        parts.append(sky_rules_for_date(date_str))
        if date_str:
            parts.append(
                f"Event date {date_str} — add etched date via annotate-illustration.py after generation, "
                "not as UI text in the diffusion output."
            )
    else:
        parts.append(FILES_HERO_STYLE)

    if meta.title:
        parts.append(f"Title: {meta.title}")
    if meta.subtitle:
        parts.append(f"Subtitle: {meta.subtitle}")
    if block and block.mood:
        parts.append(f"Mood: {block.mood}")
    if block and block.prompt:
        parts.append(block.prompt)
    if extra_prompt:
        parts.append(extra_prompt)

    parts.append("No watermark, no logo, no caption bar.")
    return "\n".join(parts), aspect_name


def load_timeline_prompt_doc() -> str:
    doc = TIMELINE_REPO / "docs" / "IMAGE_GENERATION_PROMPT.md"
    if doc.is_file():
        return doc.read_text(encoding="utf-8")[:4000]
    return ""


def cli_command_for(
    article_rel: str,
    *,
    slot: str = "hero",
    model: str = "final",
    aspect: str = "hero",
    dry_run: bool = True,
) -> str:
    scripts = FILES_REPO / "scripts"
    flags = f"--article {article_rel} --slot {slot} --model {model} --aspect {aspect}"
    if dry_run:
        flags += " --dry-run"
    return f"python3 {scripts / 'generate-illustration.py'} {flags}"

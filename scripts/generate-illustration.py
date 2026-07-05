#!/usr/bin/env python3
"""Generate article/timeline illustrations via Hugging Face Inference Providers."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from image_gen.guard import OverwriteBlockedError, plan_image_write, write_bytes
from image_gen.hf_client import generate_image_bytes, resolve_model_id
from image_gen.manifest import (
    ImageGenManifest,
    should_skip_regeneration,
    write_manifest,
)
from image_gen.paths import (
    aspect_dimensions,
    default_output_path,
    resolve_article_path,
)
from image_gen.prompts import build_prompt


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate illustration PNG via HF FLUX")
    parser.add_argument("--article", required=True, help="Repo-relative or absolute .md path")
    parser.add_argument("--slot", default="hero", choices=["hero", "section"])
    parser.add_argument("--model", default="final", choices=["draft", "final"])
    parser.add_argument("--model-id", default="", help="Override HF model id")
    parser.add_argument("--aspect", default="", choices=["", "hero", "timeline", "square"])
    parser.add_argument("--output", default="", help="Output PNG path (default: beside article)")
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--provider", default="auto")
    parser.add_argument("--prompt", default="", help="Extra prompt fragment")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--yes-overwrite", action="store_true")
    parser.add_argument("--force", action="store_true", help="Regenerate even if manifest hash matches")
    args = parser.parse_args()

    md_path = resolve_article_path(args.article)
    if not md_path.is_file():
        print(f"Error: markdown not found: {md_path}", file=sys.stderr)
        return 1

    content = md_path.read_text(encoding="utf-8")
    prompt, aspect_name = build_prompt(
        md_path,
        content,
        slot=args.slot,
        extra_prompt=args.prompt,
        aspect=args.aspect or None,
    )
    model_id = resolve_model_id(args.model, args.model_id or None)
    width, height = aspect_dimensions(aspect_name)
    out_path = default_output_path(
        md_path,
        args.slot,
        output=Path(args.output) if args.output else None,
    )

    if should_skip_regeneration(out_path, prompt, args.force):
        print(f"Skip: unchanged prompt hash and {out_path} exists (use --force)")
        return 0

    print(f"Article: {md_path}")
    print(f"Output:  {out_path}")
    print(f"Model:   {model_id}")
    print(f"Size:    {width}x{height}")
    print(f"Prompt:\n{prompt}\n")

    if args.dry_run:
        print("(dry-run — no API call)")
        return 0

    try:
        plan = plan_image_write(out_path, args.yes_overwrite)
    except OverwriteBlockedError as e:
        print(str(e), file=sys.stderr)
        return 2

    print("Calling Hugging Face Inference Providers…")
    data = generate_image_bytes(
        prompt,
        model_id=model_id,
        width=width,
        height=height,
        seed=args.seed,
        provider=args.provider,
    )
    write_bytes(plan, data)
    manifest = ImageGenManifest.build(
        prompt=prompt,
        model_id=model_id,
        seed=args.seed,
        source_md=str(md_path),
        slot=args.slot,
        aspect=aspect_name,
        width=width,
        height=height,
    )
    mp = write_manifest(out_path, manifest)
    print(f"Wrote {out_path} ({len(data)} bytes)")
    print(f"Manifest: {mp}")
    if plan.backup_path:
        print(f"Backup: {plan.backup_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

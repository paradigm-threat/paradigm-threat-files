#!/usr/bin/env python3
"""Regression tests for image_gen guard and prompts."""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from image_gen.guard import OverwriteBlockedError, plan_image_write, write_bytes
from image_gen.manifest import ImageGenManifest, should_skip_regeneration, write_manifest
from image_gen.prompts import build_prompt, parse_markdown_meta, sky_rules_for_date


class GuardTests(unittest.TestCase):
    def test_refuse_overwrite_by_default(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "a.png"
            p.write_bytes(b"x")
            with self.assertRaises(OverwriteBlockedError):
                plan_image_write(p, yes_overwrite=False)

    def test_backup_on_overwrite(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "a.png"
            p.write_bytes(b"old")
            plan = plan_image_write(p, yes_overwrite=True)
            write_bytes(plan, b"new")
            self.assertEqual(p.read_bytes(), b"new")
            self.assertTrue(plan.backup_path and plan.backup_path.read_bytes() == b"old")


class ManifestTests(unittest.TestCase):
    def test_skip_unchanged_hash(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "a.png"
            p.write_bytes(b"img")
            m = ImageGenManifest.build(
                prompt="test prompt",
                model_id="flux",
                seed=1,
                source_md="/x.md",
                slot="hero",
                aspect="hero",
                width=100,
                height=100,
            )
            write_manifest(p, m)
            self.assertTrue(should_skip_regeneration(p, "test prompt", force=False))
            self.assertFalse(should_skip_regeneration(p, "other prompt", force=False))


class PromptTests(unittest.TestCase):
    def test_parse_subtitle_and_block(self) -> None:
        md = """# Title Here
Subtitle line here

<!-- image-gen:hero
prompt: ring portal underground
aspect: hero
model: final
-->

## Body
"""
        meta = parse_markdown_meta(md)
        self.assertEqual(meta.title, "Title Here")
        self.assertEqual(meta.subtitle, "Subtitle line here")
        self.assertEqual(len(meta.blocks), 1)
        self.assertEqual(meta.blocks[0].prompt, "ring portal underground")

    def test_sky_rules_bce(self) -> None:
        self.assertIn("Saturn", sky_rules_for_date("800 BCE"))
        self.assertIn("comet-dragon", sky_rules_for_date("500 BCE"))

    def test_build_prompt_files(self) -> None:
        md_path = Path("/tmp/article.md")
        content = "# Mars dagger\nSteel under the regolith\n"
        prompt, aspect = build_prompt(md_path, content)
        self.assertIn("Mars dagger", prompt)
        self.assertEqual(aspect, "hero")


if __name__ == "__main__":
    unittest.main()

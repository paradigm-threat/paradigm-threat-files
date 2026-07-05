"""Sidecar JSON for generated images."""
from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


@dataclass
class ImageGenManifest:
    prompt: str
    model_id: str
    seed: int | None
    source_md: str
    slot: str
    aspect: str
    width: int
    height: int
    created_at: str
    prompt_hash: str

    @staticmethod
    def prompt_hash_for(prompt: str) -> str:
        return hashlib.sha256(prompt.strip().encode("utf-8")).hexdigest()[:16]

    @classmethod
    def build(
        cls,
        *,
        prompt: str,
        model_id: str,
        seed: int | None,
        source_md: str,
        slot: str,
        aspect: str,
        width: int,
        height: int,
    ) -> ImageGenManifest:
        return cls(
            prompt=prompt,
            model_id=model_id,
            seed=seed,
            source_md=source_md,
            slot=slot,
            aspect=aspect,
            width=width,
            height=height,
            created_at=datetime.now(timezone.utc).isoformat(),
            prompt_hash=cls.prompt_hash_for(prompt),
        )


def manifest_path_for_image(image_path: Path) -> Path:
    return image_path.with_name(image_path.name + ".image-gen.json")


def read_manifest(image_path: Path) -> ImageGenManifest | None:
    mp = manifest_path_for_image(image_path)
    if not mp.is_file():
        return None
    try:
        data = json.loads(mp.read_text(encoding="utf-8"))
        return ImageGenManifest(**data)
    except (json.JSONDecodeError, TypeError):
        return None


def write_manifest(image_path: Path, manifest: ImageGenManifest) -> Path:
    mp = manifest_path_for_image(image_path)
    mp.write_text(json.dumps(asdict(manifest), indent=2) + "\n", encoding="utf-8")
    return mp


def should_skip_regeneration(image_path: Path, prompt: str, force: bool) -> bool:
    if force:
        return False
    existing = read_manifest(image_path)
    if not existing or not image_path.is_file():
        return False
    return existing.prompt_hash == ImageGenManifest.prompt_hash_for(prompt)

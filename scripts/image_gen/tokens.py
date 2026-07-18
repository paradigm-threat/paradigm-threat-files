"""Load Hugging Face token (same precedence as debate-notes pyannote script)."""
from __future__ import annotations

import os
from pathlib import Path

FILES_REPO = Path(__file__).resolve().parents[2]
DEBATE_DIR = FILES_REPO / "docs" / "debate-notes"

TOKEN_CANDIDATES = [
    FILES_REPO / ".hf_token",
    DEBATE_DIR / ".hf_token",
    DEBATE_DIR / ".hr_token",
]


def load_hf_token() -> str:
    for key in ("HF_TOKEN", "HUGGING_FACE_HUB_TOKEN"):
        val = os.environ.get(key, "").strip()
        if val:
            return val
    for path in TOKEN_CANDIDATES:
        if path.is_file():
            return path.read_text(encoding="utf-8").strip()
    raise SystemExit(
        "No HF token: set HF_TOKEN or create one of:\n"
        + "\n".join(f"  - {p}" for p in TOKEN_CANDIDATES)
    )

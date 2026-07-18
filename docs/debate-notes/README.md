# Debate notes (local only)

Prepared debate prep lives here. Files in this folder are **gitignored** except this README.

**HF token (local only):** `docs/debate-notes/.hr_token` or `.hf_token` — one line, not committed.

**Before pyannote:** accept model terms (logged in as same HF user):

- https://huggingface.co/pyannote/speaker-diarization-3.1
- https://huggingface.co/pyannote/speaker-diarization-community-1

Then: `python3 docs/debate-notes/pyannote_relabel.py` (uses token file; ~10–20 min CPU).

Tracked investigations and citations remain in `events/false_flag/investigations/`.

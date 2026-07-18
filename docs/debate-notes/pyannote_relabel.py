#!/usr/bin/env python3
"""Full-debate speaker labels via pyannote diarization + Whisper segment overlap."""
import argparse
import json
import os
from collections import Counter, defaultdict
from pathlib import Path

import torch
import whisperx

DEBATE_DIR = Path(__file__).resolve().parent
IN_JSON = DEBATE_DIR / "norman-911revision-live-debate-transcript.json"
DIAR_JSON = DEBATE_DIR / "norman-911revision-diarization.json"
AUDIO = Path("/tmp/debate.wav")
TOKEN_FILE = DEBATE_DIR / ".hr_token"
if not TOKEN_FILE.exists():
    TOKEN_FILE = DEBATE_DIR / ".hf_token"

# (start_sec, end_sec, expected_speaker) for mapping SPEAKER_XX -> Ari/Norman
MAP_ANCHORS = [
    (3, 35, "Ari"),
    (35, 68, "Ari"),
    (68, 100, "Norman"),
    (100, 250, "Ari"),
    (250, 420, "Norman"),
    (420, 600, "Ari"),
    (600, 1380, "Ari"),
    (1380, 1605, "Ari"),
    (1605, 1860, "Norman"),
    (1860, 2100, "Ari"),
    (2100, 2460, "Norman"),
    (2460, 2885, "Ari"),
    (2885, 3132, "Norman"),
]

USER_OVERRIDES = [
    (596, "Norman"),
    (599, "Ari"),
    (157, "Ari"),
    (235, "Ari"),
    (1818, "Ari"),
]


def load_token() -> str:
    tok = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")
    if tok:
        return tok.strip()
    if TOKEN_FILE.exists():
        return TOKEN_FILE.read_text().strip()
    raise SystemExit(f"No HF token: set HF_TOKEN or create {TOKEN_FILE}")


def fmt_time(s):
    m, sec = divmod(int(s), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"


def overlap(a0, a1, b0, b1):
    return max(0.0, min(a1, b1) - max(a0, b0))


def map_speakers(diar_df):
    """Map pyannote SPEAKER_xx to Ari/Norman via anchor overlap votes."""
    raw = {}
    for _, row in diar_df.iterrows():
        raw.setdefault(row["speaker"], []).append((row["start"], row["end"]))

    votes = defaultdict(lambda: Counter())
    for spk, intervals in raw.items():
        for a0, a1, name in MAP_ANCHORS:
            tot = sum(overlap(a0, a1, s, e) for s, e in intervals)
            if tot > 0.5:
                votes[spk][name] += tot

    mapping = {}
    used = set()
    for spk, ctr in sorted(votes.items(), key=lambda x: -sum(x[1].values())):
        if not ctr:
            continue
        best = ctr.most_common(1)[0][0]
        if best in used:
            # second label for this cluster
            for cand, _ in ctr.most_common():
                if cand not in used:
                    best = cand
                    break
        mapping[spk] = best
        used.add(best)

    # fallback: two speakers only
    spks = list(raw.keys())
    if len(spks) == 2:
        for s in spks:
            if s not in mapping:
                mapping[s] = "Norman" if "Norman" not in mapping.values() else "Ari"
    print("Pyannote cluster map:", mapping)
    print("Anchor votes:", {k: dict(v) for k, v in votes.items()})
    return mapping


def speaker_at(t0, t1, diar_rows, mapping):
    scores = Counter()
    for row in diar_rows:
        sp = mapping.get(row["speaker"])
        if not sp:
            continue
        scores[sp] += overlap(t0, t1, row["start"], row["end"])
    if not scores:
        return None, 0.0
    top, val = scores.most_common(1)[0]
    total = sum(scores.values()) or 1.0
    return top, val / total


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--from-diarization",
        action="store_true",
        help="Skip diarization; load norman-911revision-diarization.json",
    )
    args = parser.parse_args()

    if args.from_diarization:
        if not DIAR_JSON.exists():
            raise SystemExit(f"Missing {DIAR_JSON}; run full diarization first")
        diar_saved = json.loads(DIAR_JSON.read_text())
        diar_rows = [
            {"start": r["start"], "end": r["end"], "speaker": r["raw"]}
            for r in diar_saved
        ]
        import pandas as pd

        diar_df = pd.DataFrame(diar_rows)
        print(f"Loaded {len(diar_rows)} intervals from {DIAR_JSON.name}")
    else:
        token = load_token()
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Device: {device}")

        audio = whisperx.load_audio(str(AUDIO))
        print(f"Audio samples: {len(audio)}")

        from whisperx.diarize import DiarizationPipeline

        model_name = os.environ.get("PYANNOTE_MODEL", "pyannote/speaker-diarization-3.1")
        diarize = DiarizationPipeline(model_name=model_name, token=token, device=device)
        print("Running diarization (may take several minutes on CPU)...")
        diar_df = diarize(audio, min_speakers=2, max_speakers=2)
        diar_rows = diar_df.to_dict("records")
        print(f"Diarization intervals: {len(diar_rows)}")

    mapping = map_speakers(diar_df)

    data = json.loads(IN_JSON.read_text())
    segs = data["segments"]

    for s in segs:
        t0, t1 = s["start"], s["end"]
        for t, sp in USER_OVERRIDES:
            if abs(s["start"] - t) < 3:
                s["speaker"] = sp
                s["confidence"] = 0.98
                s["label_reason"] = "user_confirmed"
                break
        else:
            sp, frac = speaker_at(t0, t1, diar_rows, mapping)
            if sp:
                s["speaker"] = sp
                s["confidence"] = round(min(0.97, 0.55 + frac * 0.45), 2)
                s["label_reason"] = "pyannote"
            else:
                s["speaker"] = s.get("speaker", "Ari")
                s["confidence"] = 0.5
                s["label_reason"] = "pyannote_fallback"

    # smooth micro-flips < 2s between same speaker
    labels = [s["speaker"] for s in segs]
    for _ in range(2):
        for i in range(1, len(segs) - 1):
            if labels[i - 1] == labels[i + 1] != labels[i]:
                if segs[i]["end"] - segs[i]["start"] < 2.5:
                    labels[i] = labels[i - 1]
    for i, s in enumerate(segs):
        s["speaker"] = labels[i]

    print("Counts:", Counter(labels))

    data["speaker_method"] = "pyannote_diarization + anchor_map + user_overrides"
    data["pyannote_speaker_map"] = mapping
    IN_JSON.write_text(json.dumps(data, indent=2))

    txt = IN_JSON.with_suffix(".txt")
    txt.write_text(
        "\n".join(
            f"[{fmt_time(s['start'])}] {s['speaker']} ({s['confidence']}): {s['text']}"
            for s in segs
        )
    )

    # dump diarization for debugging boundaries
    diar_path = DEBATE_DIR / "norman-911revision-diarization.json"
    diar_path.write_text(
        json.dumps(
            [
                {
                    "start": r["start"],
                    "end": r["end"],
                    "speaker": mapping.get(r["speaker"], r["speaker"]),
                    "raw": r["speaker"],
                }
                for r in diar_rows
            ],
            indent=2,
        )
    )
    print(f"Wrote {txt.name}, {diar_path.name}")

    # spot-check opening
    print("\nOpening segments:")
    for s in segs:
        if s["start"] < 80:
            print(f"  [{fmt_time(s['start'])}] {s['speaker']}: {s['text'][:70]}")


if __name__ == "__main__":
    main()

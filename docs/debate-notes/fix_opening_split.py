#!/usr/bin/env python3
"""Fix opening ~47–70s: split politics / Norman reply / Ari Really? / Norman Gage."""
import json
from pathlib import Path

JSON = Path(__file__).resolve().parent / "norman-911revision-live-debate-transcript.json"


def fmt_time(s):
    m, sec = divmod(int(s), 60)
    return f"{m:02d}:{sec:02d}"


def main():
    data = json.loads(JSON.read_text())
    segs = data["segments"]

    # idempotent: strip prior placeholder inserts
    segs = [s for s in segs if "reply not captured" not in s.get("text", "")]

    i_pol = next(i for i, s in enumerate(segs) if s["start"] < 50 and "brought you" in s["text"])
    i_really = next(
        i for i, s in enumerate(segs) if "don't consider that to be political" in s["text"]
    )

    pol = segs[i_pol]
    really = segs[i_really]

    # Refined boundaries from re-transcribe + accent probe (absolute seconds)
    t_pol_end = 56.0
    t_norman_start = 56.0
    t_norman_end = 61.2
    t_really_start = 61.2
    t_really_end = really["end"]  # keep end aligned with hate-Gage handoff

    pol["end"] = t_pol_end
    pol["speaker"] = "Ari"
    pol["confidence"] = 0.95
    pol["label_reason"] = "opening_split"

    norman_reply = {
        "start": t_norman_start,
        "end": t_norman_end,
        "speaker": "Norman",
        "text": "(reply not captured — short Norman interjection before Ari follow-up)",
        "confidence": 0.7,
        "label_reason": "opening_split_voice_gap",
    }

    really["start"] = t_really_start
    really["end"] = t_really_end
    really["speaker"] = "Ari"
    really["confidence"] = 0.95
    really["label_reason"] = "user_confirmed + opening_split"

    # remove duplicate if really and gage were same index (they shouldn't be)
    new_segs = []
    for i, s in enumerate(segs):
        if i == i_really:
            continue
        new_segs.append(s)
        if i == i_pol:
            new_segs.append(norman_reply)
            new_segs.append(really)

    new_segs.sort(key=lambda s: s["start"])
    data["segments"] = new_segs
    data["opening_split_note"] = (
        "56.0–61.2s: Norman spoke; Whisper merged into adjacent Ari lines. "
        "Placeholder until pyannote re-transcribe."
    )

    JSON.write_text(json.dumps(data, indent=2))

    txt = JSON.with_suffix(".txt")
    txt.write_text(
        "\n".join(
            f"[{fmt_time(s['start'])}] {s['speaker']} ({s.get('confidence', '?')}): {s['text']}"
            for s in new_segs
        )
    )

    print("Opening after fix:")
    for s in new_segs:
        if s["start"] < 80:
            print(f"  [{fmt_time(s['start'])}] {s['speaker']}: {s['text'][:72]}")


if __name__ == "__main__":
    main()

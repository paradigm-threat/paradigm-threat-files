#!/usr/bin/env python3
"""Build high-confidence segment list for curated debate transcript.

Inclusion (near-100% speaker accuracy):
  - camp_strong / user_confirmed / camp+voice
  - voice_accent with margin >= 0.14
  - verified monologue blocks (long floor holds)
  - continuation only when chained from high-conf parent

Exclusion:
  - voice_weak, confidence < 0.72
  - voice vs camp disagreement (see *-voice-camp-review.txt)
  - uncaptured opening gap (56s)
"""
import json
import re
from collections import defaultdict
from pathlib import Path

DEBATE_DIR = Path(__file__).resolve().parent
IN_JSON = DEBATE_DIR / "norman-911revision-live-debate-transcript.json"
REVIEW = DEBATE_DIR / "norman-911revision-live-debate-transcript-voice-camp-review.txt"
OUT_JSON = DEBATE_DIR / "norman-911revision-live-debate-transcript-highconf.json"

MONO = [
    (600, 1380, "Ari"),
    (1380, 1605, "Ari"),
    (1605, 1860, "Norman"),
    (1860, 2100, "Ari"),
    (2100, 2460, "Norman"),
    (2460, 2885, "Ari"),
    (2885, 3132, "Norman"),
]

TOPICS = [
    ("opening", "Opening & credentials", 0, 180),
    ("trump", "Trump / political framing", 180, 420),
    ("pp", "Predictive programming", 420, 720),
    ("iran", "Iran / CIA–NSA / Israel tangent", 720, 1020),
    ("dew", "DEW indulgence & cold/hot DEW", 1020, 1380),
    ("legal", "Qui tam & 2007 legal", 1380, 1860),
    ("gage", "Gage / money / grift / no-planes", 1860, 2460),
    ("cd_b7", "CD vs DEW parsimony & Building 7", 2460, 2885),
    ("close", "Wind-down & CO framing", 2885, 3132),
]


def fmt_time(s):
    m, sec = divmod(int(s), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"


def load_disputed():
    if not REVIEW.exists():
        return []
    out = []
    for line in REVIEW.read_text().splitlines():
        m = re.match(r"\[(\d+):(\d+)\].*voice=(\w+).*camp=(\w+)", line)
        if m and m.group(3) != m.group(4):
            out.append(int(m.group(1)) * 60 + int(m.group(2)))
    return out


def disputed_at(t, disputed):
    return any(abs(t - d) < 6 for d in disputed)


def classify(s, prev_hc, disputed):
    text = s.get("text", "")
    if "reply not captured" in text:
        return "omit", "uncaptured audio"
    reason = s.get("label_reason", "")
    conf = s.get("confidence", 0)
    vm = s.get("voice_margin", 0)
    t = s["start"]

    if reason in ("user_confirmed", "user_confirmed + opening_split", "camp_strong"):
        return "high", reason
    if reason == "opening_split" and s["speaker"] == "Ari":
        return "high", reason
    if reason == "camp+voice" and conf >= 0.88:
        return "high", reason
    if disputed_at(t, disputed):
        return "disputed", "voice/camp disagreement"
    if reason == "voice_weak" or conf < 0.72:
        return "omit", "low confidence"
    if reason == "continuation":
        return ("high", "continuation") if prev_hc else ("omit", "continuation")
    mid = (s["start"] + s["end"]) / 2
    for a, b, sp in MONO:
        if a <= mid <= b and s["speaker"] == sp and reason == "monologue":
            return "high", "verified monologue"
    if reason in ("voice_accent", "voice") and vm >= 0.14 and conf >= 0.84:
        return "high", f"voice Δ{vm:.2f}"
    if reason in ("voice_accent", "voice") and vm >= 0.10 and conf >= 0.86:
        return "medium", f"voice Δ{vm:.2f}"
    if reason == "camp" and conf >= 0.82:
        return "medium", "camp"
    return "omit", reason


def main():
    data = json.loads(IN_JSON.read_text())
    segs = data["segments"]
    disputed = load_disputed()
    prev = False
    tagged = []
    by_topic = defaultdict(list)

    for s in segs:
        tier, why = classify(s, prev, disputed)
        prev = tier == "high"
        row = {**s, "confidence_tier": tier, "tier_reason": why}
        tagged.append(row)
        for key, _, a, b in TOPICS:
            if a <= s["start"] < b:
                by_topic[key].append(row)
                break

    out = {
        "source": str(IN_JSON.name),
        "criteria": "high tier only for curated quotes; disputed listed separately",
        "segment_count": len(tagged),
        "high_count": sum(1 for r in tagged if r["confidence_tier"] == "high"),
        "disputed_count": sum(1 for r in tagged if r["confidence_tier"] == "disputed"),
        "topics": {
            k: {
                "name": next(n for key, n, _, _ in TOPICS if key == k),
                "high": [r for r in rows if r["confidence_tier"] == "high"],
                "disputed": [r for r in rows if r["confidence_tier"] == "disputed"],
            }
            for k, rows in by_topic.items()
        },
        "segments": tagged,
    }
    OUT_JSON.write_text(json.dumps(out, indent=2))
    print(f"Wrote {OUT_JSON.name}: {out['high_count']} high / {out['disputed_count']} disputed")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""v3: accent-aware voice (Resemblyzer) + camp fingerprints + tight monologue anchors."""
import json
import re
import wave
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
from resemblyzer import VoiceEncoder

IN_JSON = Path(
    "/home/ari/dev/pt/paradigm-threat-files/docs/debate-notes/"
    "norman-911revision-live-debate-transcript.json"
)
AUDIO = Path("/tmp/debate.wav")

# Verified long-floor blocks only (not cross-talk)
MONOLOGUE_ANCHORS = [
    (600, 1380, "Ari"),       # Iran / DEW indulge / evac
    (1380, 1605, "Ari"),      # qui tam + Georgia critique
    (1605, 1860, "Norman"),   # money / grift
    (1860, 2100, "Ari"),      # filibuster
    (2100, 2460, "Norman"),   # Gage / narrow no-planes
    (2460, 2885, "Ari"),      # CD parsimony + B7
    (2885, 3132, "Norman"),   # wind-down
]

# Clean time windows on raw audio for accent centroids (SA vs American)
# User-confirmed on MKV (2026-06-28)
USER_ANCHORS = [
    (596, "Norman"),  # taunting me / haven't heard my answer (same block as 9:38)
    (599, "Ari"),     # waste my time on me
    (157, "Ari"),    # fraudster, right?
    (235, "Ari"),    # Excellent. Excellent. Good.
    (1818, "Ari"),   # nicotine / smoking
]
USER_ANCHOR_WINDOW = 3.0  # seconds — tight so adjacent lines don't inherit
REF_ARI_T = [(5, 12), (428, 436), (698, 706), (2695, 2705)]
REF_NORMAN_T = [(70, 76), (285, 292), (1618, 1626), (2938, 2948)]

CAMP_RULES = [
    (r"only here to debunk", "Norman", 10),
    (r"you hate gage", "Norman", 10),
    (r"didn'?t see (?:that|it) on your website", "Norman", 10),
    (r"send me your article", "Norman", 10),
    (r"you couldn'?t find it anywhere on your website", "Norman", 10),
    (r"couldn'?t find it\. nothing.*predicted programming", "Norman", 10),
    (r"you'?re missing that", "Norman", 8),
    (r"question to you is.*you do believe", "Norman", 9),
    (r"you do subscribe to it", "Norman", 8),
    (r"you got to explain why", "Norman", 9),
    (r"you don'?t know why", "Norman", 7),
    (r"you'?re not even interested in why", "Norman", 9),
    (r"anything non-manic", "Norman", 10),
    (r"you keep debunking me", "Norman", 10),
    (r"so that'?s the first thing i said.*hot deu|i said a hot deu", "Norman", 9),
    (r"you weren'?t actually ready", "Norman", 10),
    (r"american id|passport|green card", "Norman", 10),
    (r"can i talk about gage", "Norman", 9),
    (r"you take money", "Norman", 9),
    (r"thermite cult", "Norman", 9),
    (r"go read a book", "Norman", 8),
    (r"let'?s say (?:a )?dew destroyed building 7", "Norman", 9),
    (r"you seem just a little manic", "Norman", 9),
    (r"grand what\?.*horrible depression", "Norman", 9),
    (r"i just want to guess or know on that", "Norman", 10),
    (r"main question to you is why", "Norman", 9),
    (r"attack on gage", "Norman", 9),
    (r"you basically have nothing more", "Norman", 9),
    (r"or any kind of tangents you want", "Norman", 8),
    (r"if you can'?t explain basic concepts", "Norman", 8),
    (r"like if it was a hot deu", "Norman", 8),
    (r"without tangenting", "Norman", 7),
    (r"isn'?t that a little early", "Norman", 9),
    (r"haven'?t even answered the question", "Norman", 9),
    (r"why would you keep taunting me", "Norman", 9),
    (r"waste my time on me", "Norman", 8),
    (r"appearing this for the event|apparing this for the event", "Norman", 8),
    (r"what role does trump play", "Norman", 8),
    (r"in fact, you'?re saying a bunch of nothing", "Norman", 9),
    (r"if you have no questions for me", "Ari", 10),
    (r"all righty.*you can see me", "Ari", 10),
    (r"not at all means you have no questions", "Ari", 10),
    (r"were you born in south africa", "Ari", 10),
    (r"1997 doj handbook|doj handbook", "Ari", 10),
    (r"crosshair.*twin towers", "Ari", 9),
    (r"don(?:'t| not) react", "Ari", 9),
    (r"predictive programming says", "Ari", 9),
    (r"back to the future", "Ari", 7),
    (r"i(?:'m| am) (?:a )?dual israeli", "Ari", 10),
    (r"holocaust really did happen", "Ari", 9),
    (r"mandela|apartheid", "Ari", 7),
    (r"dismissed with prejudice", "Ari", 10),
    (r"poison.?pill", "Ari", 9),
    (r"burned out the path", "Ari", 8),
    (r"misleading your readers", "Ari", 8),
    (r"no more questions", "Ari", 10),
    (r"don'?t have any more questions", "Ari", 10),
    (r"cannot be controlled demolition", "Ari", 10),
    (r"outcome.?rais", "Ari", 9),
    (r"controlled demonstration", "Ari", 9),
    (r"\bdynamite\b", "Ari", 8),
    (r"exotic approach", "Ari", 8),
    (r"destroyed the cia|nsa versus cia|nsa destroyed", "Ari", 9),
    (r"cia headquarters", "Ari", 8),
    (r"indulge in your theory", "Ari", 8),
    (r"most impressive articles", "Ari", 8),
    (r"i(?:'m| am) an american", "Ari", 9),
    (r"trump supporter or a trump hater", "Ari", 10),
    (r"your position over there in south africa", "Ari", 9),
    (r"next question on predictive programming", "Ari", 10),
    (r"do you believe that predictive programming", "Ari", 9),
    (r"that doesn'?t make any sense.*lose so many people", "Ari", 8),
    (r"so i'?m still trying to ask the question", "Ari", 8),
    (r"he is basically a fraudster, right", "Ari", 8),
    (r"is that right\?$", "Ari", 5),  # weak — Ari confirmation questions
]


def camp_label(text: str) -> tuple[str | None, float]:
    t = text.lower()
    scores = {"Ari": 0.0, "Norman": 0.0}
    for pat, sp, w in CAMP_RULES:
        if re.search(pat, t, re.I):
            scores[sp] += w
    if re.search(r"your website|your article|on your site", t) and re.search(
        r"missing|couldn'?t find|wondering", t, re.I
    ):
        scores["Norman"] += 6
    if re.search(r"came over to your country|over there in south africa", t) and re.search(
        r"mandela|apartheid|not living in america", t, re.I
    ):
        scores["Ari"] += 5
    top = max(scores, key=scores.get)
    if scores[top] < 5:
        return None, 0.0
    other = "Norman" if top == "Ari" else "Ari"
    margin = scores[top] - scores[other]
    return top, scores[top] if margin >= 3 else scores[top] * 0.5


def load_audio(wav_path):
    with wave.open(str(wav_path), "rb") as wf:
        sr = wf.getframerate()
        nch = wf.getnchannels()
        raw = wf.readframes(wf.getnframes())
    audio = np.frombuffer(raw, dtype=np.int16)
    if nch == 2:
        audio = audio.reshape(-1, 2).mean(axis=1).astype(np.int16)
    return audio, sr


def embed_range(audio, sr, encoder, t0, t1):
    pad = 0.3
    i0 = max(0, int((t0 - pad) * sr))
    i1 = min(len(audio), int((t1 + pad) * sr))
    if i1 - i0 < int(0.45 * sr):
        return None
    chunk = audio[i0:i1].astype(np.float32) / 32768.0
    if len(chunk) < sr:
        chunk = np.pad(chunk, (0, sr - len(chunk)))
    return encoder.embed_utterance(chunk)


def build_centroids(audio, sr, encoder):
    def mean_centroid(ranges):
        vecs = [embed_range(audio, sr, encoder, a, b) for a, b in ranges]
        vecs = [v for v in vecs if v is not None]
        if not vecs:
            return None
        c = np.mean(vecs, axis=0)
        return c / (np.linalg.norm(c) + 1e-9)

    return mean_centroid(REF_ARI_T), mean_centroid(REF_NORMAN_T)


def embed_segments(segs, audio, sr, encoder):
    embeds = []
    for s in segs:
        embeds.append(embed_range(audio, sr, encoder, s["start"], s["end"]))
    return embeds


def monologue_prior(mid: float) -> str | None:
    for a0, a1, sp in MONOLOGUE_ANCHORS:
        if a0 <= mid <= a1:
            return sp
    return None


def fmt_time(s):
    m, sec = divmod(int(s), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"


def cosine(a, b):
    return float(np.dot(a, b))


def decide(camp_sp, camp_w, voice_sp, voice_margin):
  """Voice-primary when accent separation is clear; camp when ideological."""
  if camp_sp and camp_w >= 9:
      return camp_sp, "camp_strong", 0.93, True
  if voice_sp and voice_margin >= 0.10:
      if camp_sp and camp_sp != voice_sp and camp_w >= 9:
          return camp_sp, "camp_over_voice", 0.88, True
      return voice_sp, "voice_accent", 0.86, True
  if camp_sp and camp_w >= 7:
      if voice_sp and voice_sp == camp_sp:
          return camp_sp, "camp+voice", 0.9, True
      if voice_sp and voice_sp != camp_sp and voice_margin >= 0.08:
          return voice_sp, "voice_over_camp", 0.82, True
      return camp_sp, "camp", 0.84, True
  if voice_sp and voice_margin >= 0.07:
      return voice_sp, "voice", 0.78, False
  if camp_sp and camp_w >= 5:
      return camp_sp, "camp_weak", 0.72, False
  return None, None, 0.0, False


def main():
    data = json.loads(IN_JSON.read_text())
    segs = data["segments"]
    n = len(segs)

    print("Loading audio + embedding (accent-aware)...")
    audio, sr = load_audio(AUDIO)
    encoder = VoiceEncoder()
    ari_c, norm_c = build_centroids(audio, sr, encoder)
    if ari_c is None or norm_c is None:
        raise SystemExit("Failed to build accent centroids")

    embeds = embed_segments(segs, audio, sr, encoder)

    labels, conf, reasons, locked = [], [], [], []
    voice_review = []

    for i, s in enumerate(segs):
        mid = (s["start"] + s["end"]) / 2
        user_sp = next(
            (sp for t, sp in USER_ANCHORS if abs(s["start"] - t) < USER_ANCHOR_WINDOW),
            None,
        )
        if user_sp:
            labels.append(user_sp)
            conf.append(0.98)
            reasons.append("user_confirmed")
            locked.append(True)
            continue

        camp_sp, camp_w = camp_label(s["text"])
        voice_sp, voice_margin, sa, sn = None, 0.0, 0.0, 0.0
        if embeds[i] is not None:
            sa, sn = cosine(embeds[i], ari_c), cosine(embeds[i], norm_c)
            voice_margin = abs(sa - sn)
            voice_sp = "Ari" if sa > sn else "Norman"

        sp, reason, c, lock = decide(camp_sp, camp_w, voice_sp, voice_margin)
        if sp is None:
            mono = monologue_prior((s["start"] + s["end"]) / 2)
            if mono:
                sp, reason, c, lock = mono, "monologue", 0.68, False
            elif voice_sp:
                sp, reason, c, lock = voice_sp, "voice_weak", 0.58, False
            else:
                sp = labels[-1] if labels else "Ari"
                reason, c, lock = "carry", 0.45, False

        if voice_sp and camp_sp and voice_sp != camp_sp and voice_margin >= 0.06:
            voice_review.append(
                f"[{fmt_time(s['start'])}] final={sp} voice={voice_sp}(Δ{voice_margin:.2f}) "
                f"camp={camp_sp}({camp_w:.0f}) | {s['text'][:90]}"
            )

        labels.append(sp)
        conf.append(round(c, 2))
        reasons.append(reason)
        locked.append(lock)

    # Continuation: mid-sentence fragments inherit previous locked speaker (overrides voice)
    CONT_RE = re.compile(
        r"^(or |like if |because we'?re|without tangent|in fact,|and it'?s|that |he at least|was used to|and you wouldn)",
        re.I,
    )
    for i in range(1, n):
        t = segs[i]["text"].lstrip()
        if locked[i - 1] and (t[:1].islower() or CONT_RE.match(t)):
            labels[i] = labels[i - 1]
            conf[i] = min(conf[i - 1], 0.85)
            reasons[i] = "continuation"
            locked[i] = True

    for _ in range(2):
        for i in range(1, n - 1):
            if locked[i]:
                continue
            if segs[i]["end"] - segs[i]["start"] < 2.5:
                if labels[i - 1] == labels[i + 1] != labels[i]:
                    labels[i] = labels[i - 1]

    for i, s in enumerate(segs):
        s["speaker"] = labels[i]
        s["confidence"] = conf[i]
        s["label_reason"] = reasons[i]
        if embeds[i] is not None:
            sa, sn = cosine(embeds[i], ari_c), cosine(embeds[i], norm_c)
            s["voice_sim"] = {"Ari": round(sa, 3), "Norman": round(sn, 3)}
            s["voice_margin"] = round(abs(sa - sn), 3)

    print("Counts:", Counter(labels))

    data["speaker_method"] = "v3_accent_voice_primary + camp_fingerprints + tight_monologue_anchors"
    data["accent_centroids"] = {"ref_norman_sec": REF_NORMAN_T, "ref_ari_sec": REF_ARI_T}
    IN_JSON.write_text(json.dumps(data, indent=2))

    base = Path(str(IN_JSON).replace(".json", ""))
    base.with_suffix(".txt").write_text(
        "\n".join(
            f"[{fmt_time(s['start'])}] {s['speaker']} ({s['confidence']}): {s['text']}"
            for s in segs
        )
    )
    Path(str(base) + "-speaker-uncertain.txt").write_text(
        "\n".join(
            f"[{fmt_time(s['start'])}] {s['speaker']} ({s['confidence']}, {s.get('label_reason','')}): {s['text']}"
            for s in segs
            if s["confidence"] < 0.78
        )
    )
    Path(str(base) + "-voice-camp-review.txt").write_text(
        "# Lines where accent-voice and camp fingerprint disagreed — confirm on MKV\n"
        + "\n".join(voice_review[:200])
    )

    checks = [
        (36, "Ari", "were you born"), (70, "Norman", "hate gage"), (110, "Ari", "trump"),
        (270, "Norman", "your website"), (311, "Norman", "send me"), (430, "Ari", "doj"),
        (505, "Ari", "don't react"), (580, "Norman", "taunting"), (1234, "Norman", "non-manic"),
        (1479, "Ari", "dismissed"), (2701, "Ari", "more questions"), (2942, "Norman", "debunk"),
    ]
    print("\nValidation:")
    fails = 0
    for t, exp, snip in checks:
        for s in segs:
            if abs(s["start"] - t) < 20 and snip.lower() in s["text"].lower():
                ok = s["speaker"] == exp
                if not ok:
                    fails += 1
                print(f"  [{fmt_time(s['start'])}] {exp}: {'OK' if ok else 'FAIL->'+s['speaker']} | {s['text'][:65]}")
                break
        else:
            fails += 1
            print(f"  NO MATCH {fmt_time(t)} '{snip}'")

    mism = sum(
        1
        for s in segs
        if (s["speaker"] == "Ari" and re.search(r"only here to debunk|send me your article|anything non-manic", s["text"], re.I))
        or (s["speaker"] == "Norman" and re.search(r"doj handbook|don.?t react|no more questions|were you born", s["text"], re.I))
    )
    print(f"Camp mismatches: {mism}, voice/camp review lines: {len(voice_review)}, fails: {fails}")


if __name__ == "__main__":
    main()

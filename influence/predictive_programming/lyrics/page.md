# Lyric Forensics

> **TL;DR:** Hub for **audio-verified lyric recovery**. Working premise: rights holders and lyric aggregators often publish **sanitized sheets** that steer listeners away from controversial, historical, or operational readings. We re-transcribe performances with speech models, publish **corrected lyrics**, log **sheet vs audio disagreements**, and argue **why the “error” was useful** to IP control. First case: Masters & Nickson — *Out There* — **fifth year** (golden-age retrieval) vs marketed **5th Dimension**.

**Status:** Open program. Method is forensic (audio → model → disagreement table → author read). Not every mismatch is sabotage; every mismatch is **data**.

---

## Thesis (author)

IP holders of nearly every controversial song ever made had the option to post **sanitized versions** of lyrics online. Those sheets become the public “truth” while the performance keeps saying something else. Listeners who trust Genius, Musixmatch, artist sites, or liner-note copy get steered into a **safe narrative**. Listeners who trust their ears — or now **LLM / ASR transcription** — can recover the **payload**.

This hub collects those recoveries:

1. **Corrected lyrics** (what the vocal actually carries)
2. **Disagreement table** (sheet / site / aggregator vs audio)
3. **Motive read** (what the sanitized frame hides or renames)
4. **Evidence tier** (L1 audio score vs L3 interpretation)

**Working slogan for case one:** **5th Dimension = fake. Golden age = real.**

---

## Method

| Step | Action |
|------|--------|
| 1 | Obtain a **legal local copy** of the track (purchase, owned rip, label download). |
| 2 | Prefer **vocal stem** (Demucs / similar) when the mix buries consonants. |
| 3 | Run **Hugging Face ASR** (default: `openai/whisper-large-v3`) with word-level confidence; re-run with **forced prompts** for each disputed word. |
| 4 | Publish the **winning line**, confidence scores, and losing forced-prompt scores. |
| 5 | Separate **Documented** (audio + published sheets) from **Author** (motive / cosmology). |

Cross-lanes already in the corpus: RATM *Wake Up* credits ([Not Like This](/influence/controlled_opposition/not-like-this.md)); Elton *Rocket Man* fuse-line mishearing ([celebrity modern slavery](/influence/suppression/modern-celebrity-slavery.md)).

---

## Cases

| Song | Artist | Sheet claim | Audio recovery | Dossier |
|------|--------|-------------|----------------|---------|
| *Out There (5th Dimension)* | Masters & Nickson feat. Justine Suissa | “fifth **here**” / dimension brand | “fifth **year**” | [investigation](investigations/masters-nickson-out-there-fifth-year-investigation.md) |
| *Wake Up* | Rage Against the Machine | “**schemes on the dream**” ([ratm.com](https://www.ratm.com/track/wake-up/)) — **wrong** | **Corrected:** “**rip skins off of trees**” (ASR weakens dream / leans tree; semantic lock: trees have skins, not schemes) | [investigation](investigations/rage-against-the-machine-wake-up-lyric-forensics-investigation.md) · [Not Like This](/influence/controlled_opposition/not-like-this.md#wake-up--what-the-credits-accused) |
| *The Bends* (queued) | Radiohead | CIA / tanks / Marines / “blow me sky high” | Cross-read idiom for vicious capacity; full ASR TBD | Cited in *Wake Up* dossier |

---

## Related hubs

- [Predictive programming](/influence/predictive_programming/page.md)
- [Controlled opposition](/influence/controlled_opposition/page.md)
- [Celebrity modern slavery / lyric soft sheets](/influence/suppression/modern-celebrity-slavery.md)
- [Saturnian cosmology published timelines](/cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation.md)

Keywords: #LyricForensics #SanitizedLyrics #PredictiveProgramming #ASR #Whisper #GoldenAge #ParadigmThreat

*Last updated: 2026-10-16* (Wake Up case added)

---

## Folder contents

The site does not auto-list siblings when this page is shown; this block lists everything in this directory.

<AutoIndex sort="name-asc" />

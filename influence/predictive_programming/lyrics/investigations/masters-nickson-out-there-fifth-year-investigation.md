# Investigation: Masters & Nickson — *Out There* — “fifth year” vs “5th Dimension” lyric sanitization

> **TL;DR:** Hugging Face `whisper-large-v3` on a Demucs vocal stem of the 2003 original recovers **“They’re looking for the fifth year”** (word confidence **0.874**). Artist-site and many aggregators print **“fifth here.”** Forced-prompt “here” collapses to confidence **0.055**. Author thesis: the marketed subtitle **(5th Dimension)** and the sheet word **here** are a **post-lyric shell** that renames a **golden-age year** retrieval narrative (remote-viewing / dark-room seer hunting immortality knowledge) into harmless New-Age dimension talk. **Documented** = audio + sheet mismatch. **Author** = motive and Saturnian / golden-age read. Hub: [Lyric Forensics](/influence/predictive_programming/lyrics/page.md).

**Date:** 2026-10-16  
**Status:** Open — audio lock on **year** is L1; cover-up motive remains L3.  
**Hub:** [Lyric Forensics](../page.md)

---

## Guide (read order)

1. [Author’s originating thesis](#authors-originating-thesis)
2. [Corrected lyrics (audio)](#corrected-lyrics-audio)
3. [Disagreement table](#disagreement-table)
4. [ASR method and scores](#asr-method-and-scores)
5. [Production timeline (documented)](#production-timeline-documented)
6. [Author read — what the shell hides](#author-read--what-the-shell-hides)
7. [Author’s open claims](#authors-open-claims)
8. [Questions to clarify, verify, or debunk](#questions-to-clarify-verify-or-debunk)
9. [Related](#related)
10. [Limits and disclaimers](#limits-and-disclaimers)

---

## Author’s originating thesis

**Verbatim capture (session 2026-10-16):**

> The IP holders of nearly every controversial song ever made had the option to post sanitized versions of lyrics online to misdirect people away from the controversy. … 5th Dimension = fake. Golden age = real.

> Correction — I said first year, but the idea is the same — the earliest years of the golden age were the most useful to modern scientists for clues on health science and other mysterious but real technology.

> “5th Dimension” is a cover up, they are covering up a real narrative with a false one, and all of the cover up occurred in POST PRODUCTION AFTER THE SONG WAS FINISHED.

**What that means (unpack):** The sung payload is a **year** in a golden-age sequence worth retrieving for **health / longevity / lost tech**. Marketing and lyric sheets reframe that as a search for a **fifth dimension** / “fifth here,” which does not carry the same historical-memory stakes. The dark-room visionary grammar stays in the vocal; the **shell title** steers interpretation into safe mysticism.

---

## Corrected lyrics (audio)

**Source performance:** Masters & Nickson feat. Justine Suissa — *Out There (5th Dimension)* (Original Mix), Soundpiercing / Armada, 2003. Writers credited: Justine Suissa, David Masters, Robert D. Nickson.

**Recovered vocal (primary verse):**

> They’re looking for the **fifth year**  
> They say it holds the secret  
> On how to live forever  
>   
> They keep me in a dark room  
> Where I can have my visions  
> And show them to the treasure  
>   
> Somewhere through a tear in the fabric of our universe  
> Somewhere through a tear in the fabric of our universe  
> It’s out there, it’s out there  
> I can feel it  
> I can almost see it  
> Hiding in the ether  
>   
> Somewhere  
> I can feel it  
> I can almost see it  
> Hiding in the ether  
> Out there

---

## Disagreement table

| Source | Disputed line | Notes | Tier |
|--------|---------------|-------|------|
| **Audio + Whisper large-v3** (Demucs vocals) | “fifth **year**” | conf **0.874** unbiased; forced “hear” still → year | **L1** |
| **Audio + Whisper** (full mix, same window) | “fifth **year**” | conf **0.755** | **L1** |
| [robertnickson.com/music/lyrics](https://www.robertnickson.com/music/lyrics/) | “fifth **here**” | Artist-associated sheet | **L1 sheet** |
| Musixmatch / LyricDown LRC / many aggregators | “fifth **year**” *or* “fifth **here**” | Split corpus; LRC timestamps often print **year** | **L1 sheet variance** |
| Release title / B-side | *Out There **(5th Dimension)*** / instrumental **5th Dimension** | Branding on SPC001 | **L1 marketing** |
| Forced ASR prompt “here” | model can emit “here” | conf **0.055** — rejects the shell when scored | **L1 model** |
| Author cosmology | “fifth year” ≈ early golden-age year useful for health / tech recovery | Saturnian / prisca sapientia frame | **L3** |
| Author motive | “5th Dimension” + “here” = post-finish misdirection shell | Not proven as ordered conspiracy | **L3** |

---

## ASR method and scores

| Item | Detail |
|------|--------|
| Model | Hugging Face **`openai/whisper-large-v3`** via `faster-whisper` (CPU int8) |
| Stem | **Demucs `htdemucs`** two-stem vocals |
| Window | ~165–185 s absolute (first full verse on original mix) |
| Unbiased winner | **year** @ **0.874** (vocals) / **0.755** (mix) |
| Forced “year” | stays **year** @ 0.874 |
| Forced “here” | emits “here” @ **0.055** |
| Forced “hear” | collapses back to **year** @ 0.874 |

**Discipline:** ASR settles the **phoneme/word**. It does **not** by itself prove publisher intent.

---

## Production timeline (documented)

From Robert Nickson’s [Muzikxpress 174](https://www.youtube.com/watch?v=IyFIWgn6nRI) interview (2022; published on channel):

| Stage | Fact | Implication for shell thesis |
|-------|------|------------------------------|
| Pre-vocal | Dave Masters project name **Fifth Dimension**; working title *Reign of Emotion* | Dimension brand **predates** Justine’s lyric on the instrumental |
| Pre-vocal | Nickson remixes chords; track retitled **Fifth Dimension** | Title exists before vocal session |
| Vocal | Armada / Armin arrange Justine Suissa; Armin records vocal onto instrumental | Lyric arrives **into** an already-named track |
| Release | SPC001 A: *Out There (5th Dimension)*; B: instrumental *5th Dimension* | Parenthetical keeps the old project name beside the vocal title *Out There* |

**Author vs documented tension:** Nickson’s chronology shows **“Fifth Dimension” as pre-vocal project name**, not a rename invented years later. Author still holds that **after the lyric existed**, the **public sheet “here”** and the **parenthetical brand** function as a **shell** that redirects “fifth year” into dimension talk — whether by design, habit, or mondegreen institutionalized by the site. That motive claim stays **L3**; the pre-vocal project name is **L1** and must not be erased.

---

## Author read — what the shell hides

| Layer | Content | Read |
|-------|---------|------|
| Vocal narrative | Dark room, visions, treasure, live forever, tear in universe, ether | Remote-viewing / Minority Report–class seer kept to locate immortality knowledge |
| Disputed word | **fifth year** | Earliest (or numbered) golden-age year as high-value recovery target for health science / lost tech |
| Shell | **5th Dimension** / “fifth **here**” | Harmless mysticism; no golden-age calendar; no scientist-useful “year” |
| Author slogan | **5th Dimension = fake. Golden age = real.** | Dimension brand is the misdirect; year + forever + visions is the payload |

Cross-pattern (repo): official sheets that **block direct read** of performance meaning — RATM / Radiohead / Elton lanes in [celebrity modern slavery investigation](/influence/suppression/investigations/celebrity-modern-slavery-containment-creative-control-investigation.md).

---

## Author’s open claims

1. Sanitized lyric sheets are a **general IP strategy**, not unique to this track.  
2. *Out There*’s payload is **golden-age year retrieval** for real health / tech knowledge, not “dimension tourism.”  
3. “5th Dimension” branding and “fifth here” sheets are **useful misdirection** relative to “fifth year,” even if the project name began as Dave Masters’ instrumental tag.  
4. Early golden-age years are the richest layer for modern recovery (author cosmology; not proven by ASR).

---

## Questions to clarify, verify, or debunk

| # | Question | What would adjudicate |
|---|----------|------------------------|
| Q1 | Does Warner/BMG / Armada **publishing registration** say year or here? | Lead-sheet / PRO registration pull |
| Q2 | Did Justine Suissa ever comment on the line? | Interview, session notes |
| Q3 | Is “fifth year” a specific Saturnian calendar index elsewhere in Suissa / OceanLab / Nickson catalog? | Cross-lyric ASR sweep |
| Q4 | When did robertnickson.com first publish “here”? | Wayback / site history |
| Q5 | Next hub case: RATM *Wake Up* full ASR vs aggregator sheets | Same method on owned copy |

---

## Related

| Link | Why |
|------|-----|
| [Lyric Forensics hub](../page.md) | Program home |
| [Not Like This — Wake Up credits](/influence/controlled_opposition/not-like-this.md) | Precedent: lyric as second payload |
| [Celebrity modern slavery](/influence/suppression/modern-celebrity-slavery.md) | Soft sheets / mishearing as signal |
| [Saturnian cosmology published timelines](/cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation.md) | Golden-age calendar context |
| [CIA Reading Room Mars RV](/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md) | Dark-room / remote-viewing grammar adjacency |
| [REDACTION.md](/docs/REDACTION.md) | R6 shell / misdirection vocabulary |

---

## Weak points / remaining research TODOs

- [ ] Pull official publishing lyric if obtainable  
- [ ] Wayback on Nickson lyrics page  
- [ ] Second-pass ASR on radio edit / Mike Shiver vocal mix for consistency  
- [ ] Queue *Wake Up* as second Lyric Forensics case  

Keywords: #LyricForensics #OutThere #MastersAndNickson #JustineSuissa #FifthYear #FifthDimension #SanitizedLyrics #GoldenAge #RemoteViewing #Whisper #ASR #ParadigmThreat

*Last updated: 2026-10-16*

---

## Limits and disclaimers

**Prisca sapientia (epistemic foundation):** This investigation assumes [**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md)—the historical and philosophical belief that the ancients possessed a vast, profound understanding of the universe, nature, and theology that was subsequently lost or degraded. Modern consensus science and institutions are not treated as default truth; evidence tiers below adjudicate specific claims.

**Fiction vs evidence:** The track is commercial vocal trance. Narrative content is not a lab report. ASR verifies **what was sung**, not that a golden-age recovery program exists.

**Author thesis sections** are first-class for pattern registry and are **not** automatically factual. Pre-vocal “Fifth Dimension” project naming is documented and constrains any claim that the phrase was invented only after the song was finished; the **sheet “here”** vs **audio “year”** mismatch stands independently.

**Assistant bias:** Prefer audio scores over aggregator consensus; do not collapse L3 motive into L1.

---

## Investigator notes

- Local owned MP3 used for ASR: `Downloads/Masters & Nickson feat. Justine Suissa - Out There (5th Dimension) (2003).mp3`  
- Work dir (ephemeral): `/tmp/outthere_verify/` (Demucs stems, Whisper venv)  
- Session also discussed YouTube Music offline DRM — not used; do not document DRM bypass  

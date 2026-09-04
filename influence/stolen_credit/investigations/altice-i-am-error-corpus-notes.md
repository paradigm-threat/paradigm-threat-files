# Nathan Altice — *I Am Error* (MIT Press, 2015) — factual reference sheet

**Local files:** `/home/ari/dev/wget/altice/`

| File | Notes |
|------|--------|
| `I_Am_Error_2015_MIT.pdf` | Platform Studies; ISBN 978-0-262-02877-6; ~426 pages |
| `I_Am_Error_2015_MIT.txt` | `pdftotext -layout` extract (search index) |

**Use rule:** Record **ascertainable claims stated in the book** (hardware, credits Altice assigns, dates, org). Ignore Altice’s interpretive framing except where it quotes a named source/interview.

**Scope of book:** Famicom/NES **platform** (CPU/PPU/APU, carts, FDS, mappers, emulation). Not SNES-era R&D1 sound staff, not Sony/Philips CD rupture narrative.

---

## Null / sparse results (search)

| Query | Hits in extract |
|-------|-----------------|
| Hamano / Minako / 濱野 | **0** |
| Sakamoto | **0** |
| Kenji Yamamoto | **0** |
| Totaka | **0** |
| Super Metroid | **0** |
| David Wise / Rare DKC music | **0** useful hits |
| Philips CD-i | **1** (listed as market failure among non-canonical platforms) |
| Sony–Nintendo Super Disc / Play Station deal | **0** |
| CD-ROM / CD-I Nintendo games | **0** |

**Composer named for Metroid sound:** **Hirokazu Tanaka** only (FDS wave-channel SFX). No Hamano.

---

## Contents

0. I AM ERROR — p.1  
1. Family Computer — p.11  
2. Ports — p.53  
3. Entertainment System — p.81  
4. Platforming — p.117  
5. Quick Disk — p.163  
6. Expansions — p.197  
7. **2A03** — p.249 *(APU / sound)*  
8. Tool-Assisted — p.289  
Afterword: Famicom Remix — p.325  
Appendices A–B, Notes, Sources, Index

---

## Factual references (by topic)

### Org / R&D (stated)

- **Gunpei Yokoi** = head of **R&D1**; led Game & Watch concept/hardware.
- **R&D1** member **Takao Sawano** proposed transplanting Game & Watch d-pad to Famicom prototype.
- **Donkey Kong** arcade conversion: Yamauchi assigned **R&D1** Yokoi + junior designer **Miyamoto** (March 1981 plan).
- **R.O.B.**: Yokoi / **R&D1**.
- **R&D3** (**Genyo Takeda**) assigned to develop Nintendo **mapper / MMC** technology **while** Yokoi’s R&D1 worked on **Famicom Disk System** and first-party disk titles.
- Altice states **Yamauchi** supported two divisions on competing formats because **internal competition** would keep teams focused (Altice’s report of Yamauchi’s stance).
- **1987** U.S. patent for R&D3 **multi-memory controller (MMC)**.
- Appendix / glossary: **Intelligent Systems** on titles such as Wild Gunman, Duck Hunt, **Metroid** = members from **Nintendo R&D1** and partner **Iwasaki Electronics**.
- Bibliographic credit: *Metroid* FDS — **Nintendo R&D1 / Intelligent Systems**, Nintendo, **6 Aug 1986**.

### Yokoi design phrase (stated via 1997 JP interviews)

- Yokoi’s philosophy rendered by Altice as **“lateral thinking for withered technology”** (JP interviews 1997); applied to outdated / inexpensive / off-the-shelf tech.
- Game & Watch origin anecdote: train commuter with pocket calculator → pocket videogame idea.

### Sound hardware — ch.7 *2A03* (core craft facts)

| Fact | Detail as stated |
|------|------------------|
| Package | Ricoh **RP2A03**: 6502-derived **CPU + APU** on one die (pAPU) |
| CPU delta vs stock 6502 | Removed **BCD**; added onboard **APU** |
| Channel count | **Five** APU channels |
| Waveform voices | **Two** nearly identical **pulse** channels (lead melodic role typical); **one triangle** (bass / wider pitch range; **no** 4-bit volume envelope like pulse/noise) |
| Noise | **Noise** channel |
| Samples | **DMC** = 1-bit **delta modulation** channel for digitized samples |
| Composition model | Audio data programmed like code (hex); not a keyboard instrument |
| Clock | Crystal → CPU clock; **NTSC** vs **PAL** clock difference alters music/SFX speed if uncompensated (early PAL ports including *Donkey Kong* cited) |
| Music ↔ SFX | Shared channels → music dropouts when SFX fire; composers design around exclusions |
| Example | **Koji Kondo** *SMB* World 1–1: pulses + triangle in rhythmic unison so masking hurts melody less; pulse 1 used for many Mario SFX |

### Disk System audio (stated)

- FDS adds **wave channel** (extra voice); Japan-only expansions / mapper audio often never in overseas carts.
- **Hirokazu Tanaka** used FDS wave channel for **Metroid** weapons/creatures SFX; **Kondo** used wave as soundtrack texture embellishment (Altice’s assignment).
- Wave channel “lived and died with the Disk System.”
- Disk originals of Zelda / Zelda II / Kid Icarus / Ice Hockey / **Metroid** described as having **richer soundtracks** and stronger save systems than later cart ports (Altice).

### Metroid platform facts (stated)

- FDS *Metroid*: four-direction scrolling via **mirroring toggles** at bubble doors (same technique *Kid Icarus*).
- Cart ports of Metroid / Kid Icarus: **password** instead of battery saves; lengthy passwords; unused save-related memory region noted in Metroid source discussion (Dirty McDingus cited).
- Localization: “barrier suit” → **Varia** mistranslation became canon.
- Palette / sprite color limits discussed with Samus as example (orange/red/green sprite tiles).
- NES silver-box marketing for Metroid / Kid Icarus.
- **No** Super Metroid; **no** Metroid Fusion; **no** Hamano/Yamamoto track credits.

### Named first-party music figure (Mario/Zelda line)

- **Koji Kondo**: *Super Mario Bros.* soundtrack; *Devil World* alum; core team with Miyamoto / Tezuka / Nakago; same team on *Zelda* (FDS) concurrent with SMB.
- Kondo quoted (EGM 2005, as printed): programmed computer; computer generated sounds; “not playing, but somehow, music was coming out.”

### Sony / Philips (sparse — not rupture source)

- **Sony Walkman** as cassette aesthetic influence on early Famicom cart design / marketing.
- Later generations: Sony/Sega/NEC move to optical media; Nintendo stayed on carts longer; GameCube proprietary optical discs noted.
- **Philips CD-i** named once as a market failure outside canonical generations.
- No Super Disc licensing terms; no 1991 CES Nintendo–Sony/Philips narrative.

### Lockout / licensing (platform facts)

- NES **CIC lockout** discussed in Entertainment System / ports material (search: lockout ×21+).
- Mapper taxonomy (MMC1/3/5, VRC, Namco, etc.) is a major factual core of ch.6 — use for **constraint economy (T7)**, not credit politics.

---

## Map to investigation T-codes (facts only)

| Code | What Altice states that supports it |
|------|-------------------------------------|
| **T1 / T2** | Yokoi “lateral thinking for withered technology” + Game & Watch calculator anecdote |
| **T3** | R&D1 vs R&D3 competing formats (FDS vs MMC); Yamauchi internal competition stance |
| **T4** | Composing = programming the APU; audio as hex/code; CPU-tied APU |
| **T5 / Metroid sound** | Tanaka Metroid FDS wave SFX; disk audio richness claim |
| **T7** | Shared-channel music/SFX dropouts; Kondo SMB dropout-aware writing; mapper/FDS audio extensions |
| **T8** | Pulse1 carrying many SMB SFX while music designed to survive masking |

**Does not support:** Hamano authorship, Returns/Tropical Freeze, Wise stakeholder questions, Sony Super Disc IP fight.

---

## What this source is for

| Useful for | Not useful for |
|------------|----------------|
| Famicom/NES **sound chip facts** (ch.7) | Minako Hamano |
| Yokoi T1 phrase in English academic cite | SNES / GBA Metroid sound credits |
| R&D1 + Intelligent Systems on FDS Metroid | 1991 Sony/Philips deal terms |
| Tanaka named on Metroid FDS SFX | David Wise / Rare |
| Mapper / FDS constraint mechanics | Corporate conquest narrative (use Sheff for that layer’s reported deal terms) |
| Partner-fab reality (Ricoh 2A03) vs “Nintendo built chips” | Internal credit/IP dispute oral history |

**Vs Sheff:** Sheff = executives/licensing/Super Disc term. Altice = how Famicom sound was engineered + who poured silicon (Ricoh). Together they still leave Hamano invisible — expected under **IP Great Depression** scarcity ([parent §8c](minako-hamano-investigation.md)).

**Independence whitewash:** Altice’s Ricoh/second-source account supports author claim that “Nintendo made their hardware / fiercely unbound” is false; CD Super Disc deal (Sheff) is the bondage proof at contract layer.

---

## Next

- [x] Park PDF + txt under `~/dev/wget/altice/`
- [x] Facts-only scan (Hamano null; Tanaka Metroid; APU inventory; T1/T3/T4/T7)
- [ ] Optional: deeper MMC5/VRC6/VRC7 audio expansion fact table from ch.7 if needed for curriculum

*Updated 2026-09-03 — facts-only investigation pass; Depression / independence pointers.*

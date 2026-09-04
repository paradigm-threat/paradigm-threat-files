# Nintendo R&D traditions — reverse-engineering codebook

> **Goal:** Reconstruct heyday R&D **traditions** from public interviews, books, and platform studies for educational programs / new-dev cycles. **Not** a leaked process manual. Internal staffing, drivers, and credit logs remain confidential IP.

**Parent dossier:** [minako-hamano-investigation.md](minako-hamano-investigation.md) §8b–§8c  
**Status:** Open — 2026-09-03  
**Confidentiality verdict:** No public “guarantee same outputs” curriculum exists. Traditions below are **reverse-engineered acceptance criteria**, not Kyoto clones.

**IP Great Depression (author frame):** Nintendo’s scarcity strategy — NDAs, sealed tools, outward leak suits, no R&D tell-alls, almost no contactable sound staff — means English books and interviews are a **drought**, not a library. Reverse-engineering traditions from contaminated public sources is the available method; see parent §8c.

---

## Traditions codebook (T1–T12)

| # | Tradition | Operational rule | Primary links |
|---|-----------|------------------|---------------|
| T1 | **Withered technology / lateral thinking** | Mature, cheap, understood tools; novelty in *use*, not specs | [Yokoi×Morikawa 1997](https://shmuplations.com/yokoi/), [Yokoi×Eno 1996](https://shmuplations.com/yokoixeno/), [Game & Watch inventing](https://shmuplations.com/gameandwatch/); Altice *I Am Error* cites same 1997 phrase |
| T2 | **Imagination completes the picture** | Player fills color/detail (blackboard snowman / mono Game Boy) | Same Yokoi 1997; [Blake Crosley summary](https://blakecrosley.com/blog/design-philosophy-gunpei-yokoi) |
| T3 | **Rival small R&D pods** | Competing R&D1/2/3… under Yamauchi, not one mega-studio | Sheff *Game Over*; Altice (R&D1 FDS vs R&D3 MMC) |
| T4 | **Programmer-musician** | Write sequencers/drivers; direct chip access; music+SFX one surface | [Tanaka — Gamedeveloper](https://www.gamedeveloper.com/audio/shooting-from-the-hip-an-interview-with-hip-tanaka), [RBMA lecture](https://www.redbullmusicacademy.com/lectures/hip-tanaka/); Altice ch.7 APU |
| T5 | **Music as living creature** | Blur music/SFX; Metroid immersion; holes/silence over cheery wallpaper | Tanaka Gamedeveloper; [Frieze Nintendo music](https://www.frieze.com/article/nintendo-music-super-mario-bros-metroid-game-soundtrack) |
| T6 | **Director–sound timing** | Pauses, cues, SFX timing as design (Sakamoto↔Yamamoto) | [SNES Classic Super Metroid](https://www.nintendo.com/en-za/News/2017/September/Nintendo-Classic-Mini-SNES-developer-interview-Volume-3-Super-Metroid-1285309.html) |
| T7 | **Constraint economy** | Drop notes for SFX; reuse phrases; custom waveforms; memory-first | [Kondo/Totaka 2001 — shmuplations](https://shmuplations.com/nintendogamemusic/); Altice APU shared-channel dropouts |
| T8 | **SFX directed, melody freer** | Miyamoto heavy on SFX; music often freer (bring records) | Same Kondo/Totaka interview |
| T9 | **“If you can draw, you can make games”** | Generalists; salvage under deadline by creative reuse | [NES Classic Metroid — Sakamoto](https://www.nintendo.com/en-gb/News/2016/December/Nintendo-Classic-Mini-NES-special-interview-Volume-5-Metroid-1164065.html) |
| T10 | **Chabudai gaeshi** | Late hard pivot when fun fails; quality over ship date | [ignorethecode](https://ignorethecode.net/blog/2012/04/28/chabudai_gaeshi/); Iwata Asks lore |
| T11 | **Product employee first** | Engineer making commercial product; voice whole-game opinions | Tanaka interviews (Nintendo Everything / Gaming Reinvented) |
| T12 | **Hamano-line R&D1 continuity** | Atmosphere matching Super Metroid; music supports drama (Fusion) | [Fusion N.O.M. — Kyoto Report](http://kyoto-report.wikidot.com/metroid-fusion-nom-english); Metroid Database Super Metroid staff interview |

**Review checklist for a new pipeline:** For each milestone ask — Did we invent a *lateral* use of mature tech (T1)? Does audio blur into world creature (T5)? Would this survive a tea-table flip (T10)? Is sound staff engineering the medium (T4)?

---

## Books — drought verdict + legal access

**Finding (2026-09-03):** English books do **not** document Nintendo **internal** credit disputes, sound-staff IP lawfare, or Hamano. Sheff/Altice = conquest + silicon. Popular histories (Kent/Ryan/Kohler class) = same press-release layer. **No book found** that opens the IP Great Depression from inside.

**Do not use pirate libraries for copyrighted books.** Prefer purchase, library, or Internet Archive **controlled digital lending**. Local research copies the author already holds: `/home/ari/dev/wget/sheff/`, `/home/ari/dev/wget/altice/`.

| Book | Traditions | Hamano / internal IP | Access / notes |
|------|------------|----------------------|----------------|
| Sheff — *Game Over* (1993) | T3 | **0** Hamano; Super Disc licenser term | [IA borrow](https://archive.org/details/gameoverhowninte00shef); [facts-only notes](sheff-game-over-corpus-notes.md) |
| Sheff/Eddy — *Press Start to Continue* (1999) | T3 | Same genre | [IA borrow](https://archive.org/details/0966961706) |
| Altice — *I Am Error* (MIT, 2015) | T1, T3, T4, T7 | **0** Hamano; Tanaka FDS Metroid SFX | Local `~/dev/wget/altice/`; [facts-only notes](altice-i-am-error-corpus-notes.md) |
| Yokoi/Makino — *横井軍平ゲーム館* | T1, T2 | Philosophy, not credit politics | Buy JP; EN via shmuplations |
| Gorges — *History of Nintendo* | Chronology | Not internal disputes | Commercial / libraries |
| Uemura Famicom histories | R&D2 hardware | Partner-fab reality vs “Nintendo built chips” myth | JP used / libraries |

**Hardware independence whitewash (book-adjacent fact):** “Nintendo made their hardware / was fiercely unbound by other companies’ hardware decisions” is false. Ricoh 2A03, Sony SPC700, later IBM/AMD/Nvidia — partner dies. **CD-ROM debacle** (Sony sole Super Disc licenser) proves contractual bondage. Tollbooth independence ≠ silicon independence.

**Free English primary texts (not books):** shmuplations Yokoi/Kondo/Totaka; Iwata Asks; RBMA Tanaka; Nintendo Classic Mini Metroid interviews — local mirrors under `~/dev/wget/yokoi/`, `~/dev/wget/tanaka/`, `~/dev/wget/nintendo-rd-interviews/`.

---

## Priority reading order

1. Yokoi 1997 + Game & Watch inventing → T1, T2  
2. Tanaka Gamedeveloper + RBMA → T4, T5, T11  
3. Kondo/Totaka shmuplations → T7, T8  
4. Sakamoto+Yamamoto Super Metroid → T6  
5. Sakamoto Metroid NES Classic → T9  
6. Hamano Fusion N.O.M. → T12  
7. Sheff *Game Over* (facts-only) → T3 + Super Disc term  
8. Altice *I Am Error* (local) → T1, T3, T4, T7  

---

## Contactability (survey finding)

| Person | Channel | Status |
|--------|---------|--------|
| **Hirokazu Tanaka** | [chiptanaka.com](https://www.chiptanaka.com/) · `chiptanaka.official@gmail.com` | **Only** public personal bridge found (left Nintendo) |
| Hamano, Yamamoto, Sakamoto, Kondo, Totaka | — | Still Nintendo — **no** public personal email or site |
| Uemura | [Ritsumeikan RCGS](https://www.rcgs.jp/) | Deceased 2021 |
| Yokoi | Interviews / *Game House* | Deceased 1997 |

**Scarcity note:** Absence of contacts is part of the Depression climate, not a temporary research gap.

---

## Next threads

- [ ] Printable curriculum one-pager from T1–T12  
- [ ] Case-map each T to Super Metroid / Returns / Link’s Awakening examples  
- [ ] Tanaka outreach draft (craft traditions only — not credit accusations)  
- [ ] Purchase JP *Game House* if English interviews insufficient  
- [x] Book drought + contact survey + Depression pointer documented  

Keywords: #NintendoRD #Traditions #Yokoi #Tanaka #Hamano #ReverseEngineering #IPGreatDepression

*Last updated: 2026-09-03*

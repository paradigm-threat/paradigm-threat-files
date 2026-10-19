# Rare & Nintendo R&D — Credit Theft Investigation

> **TL;DR:** Rare & Nintendo R&D — Credit Theft Investigation
**Status:** Investigating. Thesis: Nintendo R&D created or heavily contributed to games published under Rare's name; Rare took credit; some games have no credits at all.

---

## Background

- **Nintendo R&D1:** Created original Donkey Kong (1981); Shigeru Miyamoto, etc.
- **Rare:** UK studio; second-party developer for Nintendo.
- Nintendo commissioned Rare to reboot Donkey Kong → Donkey Kong Country (1994).
- Rare developed many NES/SNES titles; Nintendo published several.

---

## Documented: Games Without or With Hidden Credits

### Scale — Rare NES (VGMPF)

| Stat | Detail |
|------|--------|
| Rare NES catalog | **40+** games |
| Shipped **with** credits | **Only 6:** *Cobra Triangle, Double Dare, Pin·Bot, Solar Jetman, Ironsword: Wizards & Warriors II, WWF WrestleMania* |
| Shipped **without** credits | **~34+ of 40+** |
| Stated motive | Anti-poaching — hide staff so rivals can’t hire them |
| Broader (NES/GB/SNES) | VGMPF: they **rarely** put staff credits; later sometimes initials-only |

**Source:** [VGMPF — Rare](https://www.vgmpf.com/Wiki/index.php?title=Rare)

**Author / investigation meaning:** Huge piece of evidence that Rare was **not crediting the proper people on-cart** and could later **tell whatever authorship story** interviews and fan canon needed. Reconstructed “Wise composed Battletoads / DKC…” narratives are **not checked against printed in-game receipts** for most of the NES era — the whitewash had a blank page to write on. Same scarcity class as Nintendo Sound Team / Hamano support billing. Parent: [minako-hamano-investigation.md](investigations/minako-hamano-investigation.md) §5.4 claim 22.

**Public proof (2026-10-19):** the IBM/MIDI setup was a **failed investment**, and only **6 of 40+** carts print any staff credit. Those two facts close the claim that Britain composed and compiled the music. The anti-poaching policy accounts for missing names. It leaves the failed tool spend sitting on a blank receipt. A Kyoto source file is still unrecovered. **Working conclusion:** the blanks cover a UK staff that lacked the technical skill to finish, and Nintendo R&D wrote the drivers, extra tracks, SFX, and the compile. The IBM/MIDI setup did not produce the cart. Industry substitutes (Stamper lockdown, hidden hex names, “ROM fingerprints prove a closed UK toolchain”) still protect that independence story without the lost source. Full: [dave-wise.md](dave-wise.md) § WORKING THEORY — IBM/MIDI was a failed investment.

### Battletoads (NES, 1991)
- **All credits listed as uncredited** in game.
- Staff (from external sources): Tim Stamper, Chris Stamper, Joel Hochberg, Gregg Mayles, Guy Miller, Kevin Bayliss, **David Wise (music)**.
- None visible in-game.

### Battletoads in Battlemaniacs (SNES, 1993)
- **Hidden credits** in ROM at 0x7FE0: "RARE93 BREN GUNN!"

### PIN·BOT (NES, 1990)
- Rare-developed; credits **embedded in ROM**, not displayed as end credits. *(Note: Pin·Bot is one of the six VGMPF lists as having credits in some form — verify display vs ROM.)*

### Other Rare Titles
- Pattern: credits omitted, hidden, or incomplete — **majority NES default**, not edge case.
- **Action:** Keep catalog audit aligned with VGMPF 6-of-40+ baseline.

---

## Scale: Games Without Credits (Industry-Wide)

- **VGMPF:** [Category: Games Without Credits](https://www.vgmpf.com/Wiki/index.php?title=Category:Games_Without_Credits) — **335 games** in database.
- Publishers that prohibited credits: Parker Brothers, Sega, LJN, Toho, RazorSoft, Bally Midway.
- Reasons: ROM space, anonymity, staff poaching prevention, rushed development, early-era norms.

---

## Investigation Angles

### 1. Nintendo R&D Contribution to Rare Games
- **Thesis:** Nintendo R&D may have built engines, tools, or content for Rare titles.
- Rare had Silicon Graphics workstations; Nintendo provided Donkey Kong IP and possibly technical support.
- **Action:** Research development history; Nintendo staff secondments; shared tech.

### 2. Rare's Credit Policy
- Consistent omission/hiding of credits across Battletoads, PIN·BOT, etc.
- **Action:** Compare to other UK developers; Nintendo's own credit practices.

### 3. Donkey Kong Country
- 12 developers over 18 months; Dave Wise, Robin Beanland, Eveline Fischer for music.
- **Action:** Who at Nintendo (if anyone) contributed? Japanese manuals vs. Western releases?

### 4. Count of Rare Games Missing Credits

- **Answered (VGMPF):** NES — **only 6 of 40+ credited** → **~34+ blank**. See scale table above.
- Remaining: GB/SNES exact counts; which “Wise” music attributions rest only on later reconstruction.
- **Action:** Build list from VGMPF, TCRF, MobyGames; quantify.

---

## Supporting Evidence (Deep Dive)

### Nintendo Oversight of DKC
- **Miyamoto:** "Backed the decision and contributed design ideas" for Donkey Kong Country.
- **Howard Lincoln, Genyo Takeda:** Impressed by Rare's demo; commissioned the reboot.
- **Yukio Kaneoka on DKC copyright:** Japanese Nintendo sound designer (original Donkey Kong composer, Famicom APU designer) appears on "Aquatic Ambience" copyright alongside Wise, Beanland, Fischer. Suggests Nintendo sound department involvement in DKC soundtrack.

### Wise's Own Account
- Video Game Music Shrine: Wise "was sure that a composer at Nintendo would be the one in charge of the music" — he expected Nintendo to handle it. He provided a temp track; Rare liked it and hired him.
- **Interpretation:** Development assumed Nintendo would score the game; credit structure may reflect contract rather than creative primacy.

### Japan–UK Industry Structure
- UK industry: "Bottom-up," "bedroom coders," self-taught.
- Japan: Corporate sponsorship, arcades, toys, electronics; different skill pathways.
- Nintendo partnered with Western studios (Rare, Retro, Next Level) for global reach — "complex questions about maintaining franchise authenticity."

---

## Open Questions

- How many Rare-developed games lack in-game credits?
- Did Nintendo require Rare to omit credits for contractual reasons?
- Full list of Nintendo R&D staff who worked on Rare projects?

---

## Sources

- [VGMPF: Yukio Kaneoka](https://www.vgmpf.com/Wiki/index.php/Yukio_Kaneoka)
- [Video Game Music Shrine: Wise expected Nintendo to compose](https://videogamemusicshrine.com/inside-the-score-donkey-kong-country-aquatic-ambience/)
- [Nintendo Life: Making of Donkey Kong Country](https://www.nintendolife.com/news/2014/02/month_of_kong_the_making_of_donkey_kong_country)
- [VGMPF: Category: Games Without Credits](https://www.vgmpf.com/Wiki/index.php?title=Category:Games_Without_Credits)
- [VGMPF: List of Games Without Credits](https://www.vgmpf.com/Wiki/index.php?title=List_of_Games_Without_Credits)
- [TCRF: Battletoads in Battlemaniacs (SNES)](https://tcrf.net/Battletoads_in_Battlemaniacs_(SNES))
- [MobyGames: Battletoads credits](https://www.mobygames.com/game/6134/battletoads/credits/nes/)
- [TCRF: PIN·BOT (NES)](https://tcrf.net/Pinbot_(NES))
- [Wikipedia: Rare (company)](https://en.wikipedia.org/wiki/Rare_(company))
- [Wikipedia: Donkey Kong Country](https://en.wikipedia.org/wiki/Donkey_Kong_Country)

---

Keywords: #Rare #Nintendo #Rd #Credit #Theft


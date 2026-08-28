# Timeline Update: Stolen Credit Suite, Yakuza Investigation, Site SSR, and TTS Improvements

*March 11, 2026 — Paradigm Threat*

---

One day since the last update: paradigm-threat-timeline v1.2.43 → **v1.2.51**; paradigm-threat-files expanded with nine stolen-credit investigations and the Yakuza remote-control thesis; paradigm-threat-site gained server-side rendering for articles and article TTS parity with the timeline overlay. The stolen-credit corpus is now the largest single investigation area on the site.

---

## Stolen Credit Suite (paradigm-threat-files)

Nine investigations added or expanded in [Stolen Credit](https://paradigmthreat.net/influence/stolen_credit):

### Video Game Composers (7 files)

| Investigation | Summary |
|---------------|---------|
| [Dave Wise / Rare](https://paradigmthreat.net/influence/stolen_credit/dave-wise) | DKC3 GBA amateur dive; sampling/QA thesis vs. composition; Eveline Fischer major contributor; Yukio Kaneoka (Nintendo) on Aquatic Ambience copyright; Tropical Freeze/Returns Hamano pattern; Prime 4 credit anomaly |
| [Minako Hamano](https://paradigmthreat.net/influence/stolen_credit/minako-hamano) | Super Metroid (Ridley, Maridia, Mother Brain); "often credited only to Yamamoto"; Returns/Tropical Freeze excellence; Prime 4 Beyond soundtrack disaster |
| [Rare & Nintendo R&D](https://paradigmthreat.net/influence/stolen_credit/rare-nintendo-rd) | Games without credits — Battletoads, PIN·BOT; 335 games in VGMPF; Nintendo R&D contribution thesis |
| [Capcom / Mega Man](https://paradigmthreat.net/influence/stolen_credit/capcom) | Platform betrayal, composer churn, leftover theory; MM9 from original projects |
| [Yasunori Mitsuda](https://paradigmthreat.net/influence/stolen_credit/yasunori-mitsuda) | Chrono Trigger third hands; Chrono Cross RD Edition corruption; franchise corruption thesis |
| [Koji Kondo](https://paradigmthreat.net/influence/stolen_credit/koji-kondo) | Nintendo institutional support; Kaneoka; unrecognized Zelda composers |
| [Robin Beanland](https://paradigmthreat.net/influence/stolen_credit/robin-beanland) | DKC Aquatic Ambience four-way copyright; role vs. Wise/Fischer |

### Nintendo–Sony Breakup (1 expansion)

- **Super Mario RPG section** added to [Nintendo–Sony Breakup](https://paradigmthreat.net/influence/stolen_credit/nintendo-sony-breakup): Suspicious timing (1995–96); Square courting Sony while Nintendo believed the collaboration signified commitment; the game as "reassurance signal" or sincere last gesture before the divorce; connection to stolen-credit thesis.

### Classical Composers (2 files)

| Investigation | Summary |
|---------------|---------|
| [Fanny Mendelssohn](https://paradigmthreat.net/influence/stolen_credit/fanny-mendelssohn) | 6 songs under Felix's name; Easter Sonata misattributed 40 years |
| [Ferde Grofé](https://paradigmthreat.net/influence/stolen_credit/ferde-grofe) | Rhapsody in Blue orchestration; blurry composition line |

### Methodology

- [VGM Preservation / Credits](https://paradigmthreat.net/influence/stolen_credit/vgm-preservation-credits) — 335 games without credits; publisher policies; ROM/hex methodology

---

## Yakuza Remote-Control Investigation

New governance investigation: [Yakuza Remote Control: British Influence, Media Capture, and Technology Containment in Japan](https://paradigmthreat.net/governance/war/investigations/yakuza-remote-control-investigation).

**Thesis:** The Yakuza may function as a remote-controlled instrument of Western (chiefly British) interests in Japan — enforcing compliance, media capture, and technology containment.

**Sections:**
- Yakuza influence on Japanese media (Kobe Geinosha 1957; post-WWII entrenchment; Adelstein; talent agencies)
- Nintendo–Sony CD-ROM and technology containment — parallel to Taiwan chip situation; technology channeled through Western-approved partners
- Assassination of Shinzo Abe (July 2022) — alternative reading; "nobody said anything"
- Consolidation of power after natural disasters
- Ideological separation of youth and elderly; mockery of tradition

**Linked:** [nintendo-sony-breakup](https://paradigmthreat.net/influence/stolen_credit/nintendo-sony-breakup) for technology containment thesis.

---

## paradigm-threat-site: SSR and TTS

### Server-Side Rendering (Crawlers)

Articles are now server-rendered for SEO and crawling:
- `fetchArticle` + `compileMDX` (next-mdx-remote/rsc) — full article HTML in first response
- Removed `isHydrated` gates in root/main layouts so crawlers receive content instead of a loading shell
- `generateMetadata` for per-article title and description
- Directory listings remain client-side (require fileList)

### Article TTS Parity

Article TTS now matches timeline overlay capabilities:
- **Retry** (3 attempts) with Retry button
- **Seekable progress bar** — scrub to any position
- **DOM-only scroll sync** — preserve styles; no layout shift
- **Double-click to jump** — jump to sentence from article text
- Same options as timeline overlay (voice, rate, provider, Piper, speaker map, etc.)

### Other Site Changes

- Article nav; race condition fix; autolink preprocessing; metadata filter; extensionless URLs
- PWA: `_version` in index.json for cache busting

---

## paradigm-threat-timeline

- **Event title/header validation** — Fix validation; register appendix extended articles
- **Introduction** — "Intellectual challenge" framing
- **Overview image** — Updated; package version bump v1.2.43 → v1.2.51

---Topics: #conspiracy · #cosmos · #geoengineering · #influence · #mars · #predictive_programming · #religions** — Fix links; remove dead wget references
- **PWA cache busting** — `_version` in index.json

---

## Stats

| Metric | Previous (Mar 10) | Current (Mar 11) |
|--------|-------------------|-------------------|
| Timeline version | 1.2.43 | 1.2.51 |
| Stolen-credit investigations | ~10 | 20 |
| New governance investigation | — | Yakuza remote control |
| Site rendering | Client-only | SSR for articles |
| Article TTS | Basic | Full parity with timeline overlay |

> **Stolen credit is now the largest single investigation topic.** The corpus spans video game composers (Rare/Nintendo, Square, Capcom), classical music (Mendelssohn, Grofé, Mozart, Gershwin, Beethoven), and methodology (VGM preservation, 335 games without credits). The Yakuza investigation bridges governance, technology containment, and the Nintendo–Sony thesis.

---

## Image gallery — assets committed in this window (2026-03-10 → 2026-03-11)

Raster files **first added** after **2026-03-10** through **2026-03-11** (exclusive windows — each image appears in **one** blog entry only). Heroes placed inline above; remainder below.

![15 minute cities](https://paradigmthreat.net/influence/conspiracy/15-minute-cities.png)

![designated reservations](https://paradigmthreat.net/influence/conspiracy/designated-reservations.png)

![Predictive Programming](https://paradigmthreat.net/influence/predictive_programming/predictive_programming.png)

![public schools](https://paradigmthreat.net/influence/public-schools.jpg)

![AI takeover in fiction](https://paradigmthreat.net/science/ai/ai-takeover.png)

![Shrinking technology concept](https://paradigmthreat.net/science/microchips/shrinking-tech.png)

*Topics:* [#governance](https://paradigmthreat.net/search/governance) · [#influence](https://paradigmthreat.net/search/influence) · [#stolen_credit](https://paradigmthreat.net/search/stolen_credit) · [#war](https://paradigmthreat.net/search/war)

---

Keywords: #2026 #Update #Stolen #Credit #Suite #Yakuza #Site #Ssr #Tts #Improvements


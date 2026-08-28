# Late August 2026: Pure Relay migration, QAnon dossier, Flat Earth trance, and the Takeout trash revelation

*August 28, 2026 — Paradigm Threat*

**Summary.** Since the [August 9 roundup](https://paradigmthreat.net/blog/2026-08-09-august-depression-only-way-none-survived-strong-bad-portrait), the biggest personal find landed in a **Google Takeout `Trash/` folder** on a post-fire HD backup: **55 videos** — including rolls of me **confronting Jacob Chansley** (the QAnon Shaman) at the **June 24, 2020 Scottsdale “Unmask Us”** rally — gone from live Google Photos during a **~three-month Google access gap** after the house fire. Repo work closed the loop: [The Flat Earth trance](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance.md) essay, dedicated [QAnon controlled opposition investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/qanon-controlled-opposition-investigation.md), and [Phoenix protest timeline](https://paradigmthreat.net/governance/constitution/investigations/phoenix-protest-timeline-investigation.md) trash-pattern analysis. **Infrastructure:** migration toward **pure Relay** — **iad1/sjc1/hkg1** fleet cutover, retired **dfw1/lon1**, **publish_origin** write fence, **SearchStore**, per-article SSR head from tip markdown; **paradigm-threat-site** now **307s SEO crawlers to Relay SSR** when `SSR_MIRROR_REDIRECT=1` instead of serving article HTML from Vercel. **No new Substack flagships** since Aug 9; [Designed from birth](https://paradigmthreat.net/influence/suppression/designed-from-birth.md) and Flat Earth trance are **repo-first** for now.

The through-line is **custody of evidence** — protest video that disappeared from the cloud while I could not log in, recovered only because Takeout exports trash state; CO dossiers that name the **poison-pill grammar** beside real grievances; and a publishing stack that no longer treats Vercel as the article HTML source of truth for bots. Relay serves SSR from git tip; the Next app keeps chrome, timeline, chat, and PWA — but crawlers and canonical article head tags live on the mesh.

---

## The Takeout trash revelation — 55 videos and the QAnon Shaman roll

This is the find that rewired August.

After the house fire I lost normal Google access for roughly **three months**. When I came back, large parts of my **Google Photos library were simply gone** — especially **protest rolls** and **predictive-programming movie cuts** I would never have deleted on purpose. Live Photos still had **no June 24, 2020 video** at all. Stills from that morning survived (`IMG_20200624_101244.jpg`, Scottsdale Civic Center geotag). The video did not.

In **August 2026** I searched a **Google Takeout backup** on an HD drive from **after the fire**. The missing rolls were not erased from history — they sat in Takeout **`Trash/`**, JSON sidecars marked **`trashed: true`**. Full inventory: **56 items in Trash — 55 videos, 1 photo** — capture dates spanning **2020–2024**. **June 2020 is the largest cluster** (**13 videos**), spread across days, not one bulk delete on a single morning.

Among the three recovered **`VID_20200624_*`** files, **`VID_20200624_110648.mp4`** is the pivot roll: **~20 seconds** where I walked up to **Jacob Chansley** — Jake Angeli, later the **QAnon Shaman** — shirtless in horns, **“Q SENT ME”** on a spear sign, **yelling on an empty grass patch** the crowd had not filled while **TV cameras pivoted together** onto him as Daniel McCarthy finished speaking at the **Scottsdale anti-mask rally**. I went **too close**, **in the way of the lenses**, to **break the staged TV package**. Frame grabs from that roll now ship in the [Phoenix protest timeline gallery](https://paradigmthreat.net/governance/constitution/investigations/phoenix-protest-timeline-investigation.md#3c-jun-24-photo-evidence--frame-grabs).

![Scottsdale Unmask Us protest — unidentified man at microphone beside bronze pioneer-and-wheel statue; crowd on civic lawn](https://paradigmthreat.net/governance/constitution/investigations/assets/phoenix-protest-timeline/2020-06-24-scottsdale-unmask-us-speaker-at-mic.png)

![Scottsdale Unmask Us — Jacob Chansley beside large DEMAND DANIEL McCARTHY U.S. SENATE sign; QAnon shirt; McCarthy campaign trailer; cameras on tripods](https://paradigmthreat.net/governance/constitution/investigations/assets/phoenix-protest-timeline/2020-06-24-scottsdale-unmask-us-chansley-mccarthy-sign.png)

![Scottsdale Unmask Us — Flat Earth PVC cube display; Daniel McCarthy campaign sign; anti-mask signs](https://paradigmthreat.net/governance/constitution/investigations/assets/phoenix-protest-timeline/2020-06-24-scottsdale-unmask-us-flat-earth-pvc-cube.png)

![Scottsdale Unmask Us protest — QAnon sign with large Q, QAnon, and www.QMap.pub; anti-mask signs at Scottsdale City Hall plaza](https://paradigmthreat.net/governance/constitution/investigations/assets/phoenix-protest-timeline/2020-06-24-scottsdale-unmask-us-qanon-sign.png)

![Author intervention — confronting Jacob Chansley, Q sent me, June 24 2020 Scottsdale](https://paradigmthreat.net/governance/constitution/investigations/assets/phoenix-protest-timeline/2020-06-24-scottsdale-unmask-us-author-intervention-chansley-q-sent-me.png)

![VLC screenshot of VID_20200624_110648.mp4 — Jacob Chansley pivot roll; camera operator on tripod; intervention beat confirmed](https://paradigmthreat.net/governance/constitution/investigations/assets/phoenix-protest-timeline/2020-06-24-scottsdale-unmask-us-chansley-pivot-vid-110648-screenshot.png)

**What the metadata can and cannot prove.** Takeout sidecars carry **no trash timestamp** — only a snapshot of trash-at-export. Stills from the same morning stayed in **`Photos from 2020/`** without a trashed flag; only the **large `.mp4`s** landed in Trash. A separate **Katie mirror Takeout** (Nov 2025) has **no Trash album** but the same three **`VID_20200624_*`** files in the main library — consistent with **account-side trash**, not a proven cloud back-end scrub. **Author read (hypothesis tier):** selective loss of **conspiracy-related protest and research video** during the post-fire Google gap reads stronger than random storage cleanup; I **do not recall** manually trashing the Chansley rolls. Both layers can coexist: **months offline** plus **`trashed: true`** in export.

The [Flat Earth trance essay](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance.md) and [Phoenix protest timeline § trash pattern](https://paradigmthreat.net/governance/constitution/investigations/phoenix-protest-timeline-investigation.md#trash-pattern--why-videos-missing-from-live-library-2026-08-22-analysis) hold the full table, tier labels, and open verification hooks (frame-review of `102221` and `110943` for McCarthy speech and pro-Q fights).

---

## Substack published since August 9

**No new posts** on [Paradigm Threat Substack](https://paradigmthreat2.substack.com/) since **2026-08-09 — The Great Depression Was Planned**. August repo flagships below are **site/repo first** until newsletter mirrors ship.

---

## paradigm-threat-files — CO dossiers, Flat Earth trance, identity suppression, science lanes

### Controlled opposition and protest witness

- **[The Flat Earth trance](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance.md)** — reader essay on why serious people cannot look away from a movement built to waste their time; **Chansley / McCarthy / camera pivot** witness at Scottsdale; **faith-only debate grammar** parallel to Norman / DEW-church hosts; Saturnian cosmology as the exit Flat Earth blocks. Expanded [Q&A debunks hub](https://paradigmthreat.net/cosmos/flat_earth/flat-earth-qa-debunks.md) (Entry 3 zonal winds: belts real, textbook Coriolis-as-cause rejected, EM framing).
- **[QAnon controlled opposition investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/qanon-controlled-opposition-investigation.md)** — dedicated dossier (not folded into Flat Earth essay): Pre-Q military “Q” hypothesis vs documented Oct 2017 origin; **Anonymous** founding + merger grammar; protest poison-pill pointers to Phoenix witness; faith-only debate index to ic911a / Norman.
- **[Phoenix protest timeline investigation](https://paradigmthreat.net/governance/constitution/investigations/phoenix-protest-timeline-investigation.md)** — venue split locked: **ASU pre-march** vs **Jun 24 Scottsdale** vs **Nov 7 Capitol**; Takeout recovery table; **55-video Trash inventory**; six frame grabs from **`110648`**.

![The Flat Earth trance — mainstream debunk wars beside a movement built to waste serious people's time](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance.png)

![Flat Earth Q&A and debunks hub — social thread captures, mainstream debunk vs dogmatic replies](https://paradigmthreat.net/cosmos/flat_earth/flat-earth-qa-debunks.png)

![Gareth Boland vs flat-Earth comment threads — density, gravity, and my-truth meme wars](https://paradigmthreat.net/cosmos/flat_earth/gareth-boland-fe-debate-collage.png)

![Spinning globe / 1000 mph social thread — Gareth Boland debunk vs flat-Earth spin memes](https://paradigmthreat.net/cosmos/flat_earth/gareth-boland-spinning-globe-debate.png)

### Identity suppression and AU-048 / AU-049

- **[Designed from birth](https://paradigmthreat.net/influence/suppression/designed-from-birth.md)** — celebrity slavery / gender-swap installment thesis; Golda Meir proof-of-concept lane; Grok refusal archived. Companion cluster: **[AU-048 identity investigations index](https://paradigmthreat.net/influence/conspiracy/celebrities/INDEX-identity-investigations.md)** + [facial/skull estimation methodology](https://paradigmthreat.net/influence/conspiracy/celebrities/facial-skull-sex-estimation-methodology-investigation.md) — Gandhi brahmacharya cover, Loren still, Karate Kid Japan read **retracted**.
- **[AU-049 British royalty controlled scheme](https://paradigmthreat.net/governance/war/investigations/british-royalty-controlled-scheme-investigation.md)** — Rex Bellator reduction-as-scheme; **Liz Truss 49-day** desk reference for observable deep-state control; Charles III coronation read; Bond/woke scapegoat lane.

![Designed from birth — split-face asset file, Kiev to Hong Kong, fame as the lock](https://paradigmthreat.net/influence/suppression/designed-from-birth.png)

![Cursor Grok 4.6 High Fast refusal — celebrity identity investigation, 13 August 2026](https://paradigmthreat.net/influence/censorship/cursor-grok-celebrity-identity-hoax-refusal-2026-08-13.png)

![English Male and Female Skull Differences — A–G from AU-048 methodology](https://paradigmthreat.net/influence/conspiracy/celebrities/english-male-female-skull-differences-A-G.png)

![EGI — Elite Gender Inversion graphic from AU-048 methodology investigation](https://paradigmthreat.net/influence/conspiracy/celebrities/egi-elite-gender-inversion-freemartin-meme.png)

### Science and chronology

- **[Three-Cell Motion EM/æther investigation](https://paradigmthreat.net/science/geoengineering/investigations/three-cell-motion-em-aether-investigation.md)** — Hadley/Ferrel/Polar belts documented; author third path vs Flat Earth vs EM-free monopoly; trade-winds §3.5; circulation diagram art.
- **Stonehenge concrete-footings collage** — article + investigation cross-link pass.

![Three-cell motion — textbook Hadley / Ferrel / Polar circulation vs EM / æther framing](https://paradigmthreat.net/science/geoengineering/investigations/three-cell-motion-em-aether-investigation.png)

![Earth's three-cell atmospheric circulation — Hadley / Ferrel / Polar cells, trade winds, westerlies, polar easterlies](https://paradigmthreat.net/science/geoengineering/investigations/three-cell-motion-diagram.png)

![Stonehenge concrete footings — viral STONEHENGE HOAX collage; rectangular footing under sarsen](https://paradigmthreat.net/history/chronology/investigations/stonehenge-portal-birkeland-current-investigation-concrete-footings.jpg)

### Remote strategy and hooks

- **Git remotes:** retired **lon1** → **iad1** in docs and `.relay` config (`GIT_REMOTE_STRATEGY`).
- **BootShell / CSR host mode** — operator SPA overlay stays client-side; P0 HTML from SSR hooks is not covered at first paint ([`9129f9e7`](https://gitlab.com/clevertree/paradigm-threat-files/-/commit/9129f9e7), [`a112f7ed`](https://gitlab.com/clevertree/paradigm-threat-files/-/commit/a112f7ed)).
- **SEO:** public canonical + site description locked for SSR head parity.

---

## paradigm-threat-site — Vercel shell, Relay SSR for crawlers

The site is **not** leaving Vercel for app chrome — timeline, chat, search shell, PWA, and raster edge routing stay on the Next deployment. What changed is **where article HTML for SEO comes from**.

With **`SSR_MIRROR_REDIRECT=1`**, Edge middleware **307-redirects known crawlers** (Googlebot, Facebook, Twitter, etc.) on eligible article paths to **Relay SSR** on the files mirror — per-path mapping via `sitePathToMirrorHtmlRel` so `/cosmos/flat_earth/the-flat-earth-trance` serves tip **`the-flat-earth-trance.md`** HTML with correct Open Graph head. **HEAD** requests follow the same rule as **GET**. Humans still get the SPA; bots get Relay-rendered markdown without waiting on a Vercel-side Relay fetch at request time.

**Performance and reliability** in the same window: **paired same-node relays** (`iad1` / `sjc1` / `hkg1`) so files and timeline QUERY lists cannot zip mismatched nodes; homepage paints without blocking on catalog wait; **CLS/LCP** cuts; PopImage mirror timeout + Retry; PWA hardened against surprise reload and sticky-stale articles; **dfw1/lon1 mirrors retired**; Node **24** CI; Speed Insights restored on Next 2.x.

**Read:** Vercel remains the **edge front door**; Relay is the **authoritative SSR origin** for indexed article HTML — migration to **pure Relay** for content head tags and bot-readable body, not a full app replatform.

---

## relay-gateway — fleet cutover, SearchStore, publish fence, client shell

**Fleet:** **iad1** primary publisher; **sjc1/hkg1** replicas; **dfw1** scrubbed from ops docs and defaults. **`publish_origin`** write fence on `pre-receive` and HTTP PUT/DELETE — client pushes to non-publisher nodes rejected when catalog sets origin.

**Search and QUERY:** **SearchStore** (SQLite tip index) on commit; **gzip/brotli** on QUERY and static responses; MCP search slimmed; **`indexFresh: false`** when store lags tip — QUERY never JIT-rebuilds.

**SEO SSR:** per-article **`<head>` from tip markdown** without SQLite dependency — title, description, OG tags straight from git tip ([`5022317`](https://gitlab.com/clevertree/relay-gateway/-/commit/5022317)).

**Ops:** unified **relay-ops** CLI + fleet sync UI; git-proxy **first-push provision**; catalog descriptions on status endpoints; Caddy zstd/gzip for mirror responses; parked **www** and HTTP→HTTPS redirects.

**Client web shell:** **BootShell overlay CSR-only** — hydrate keeps P0 HTML; iframe isolation docs for operator SPA repo tabs; **IPFS WASM** pointers expanded on pinned GET.

**Publish-once model** documented in relay-gateway **`RELAY_PUBLISH_ONCE.md`** — one expensive policy cycle on publisher, replicas fast-forward with O(1) tip verify, background index warm. Remote cutover: [GIT_REMOTE_STRATEGY](https://paradigmthreat.net/docs/GIT_REMOTE_STRATEGY).

---

## paradigm-threat-timeline

- Agent instructions consolidated; **server-side mesh publish gate** documented for timeline operators — aligns with gateway **`publish_origin`** fence and files-repo remote strategy.

---

## Reading order

1. **Takeout / protest witness:** [Flat Earth trance — Chansley section](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance.md) → [Phoenix timeline §3 trash pattern](https://paradigmthreat.net/governance/constitution/investigations/phoenix-protest-timeline-investigation.md#trash-pattern--why-videos-missing-from-live-library-2026-08-22-analysis) → [QAnon CO investigation §6](https://paradigmthreat.net/influence/controlled_opposition/investigations/qanon-controlled-opposition-investigation.md#6-protest-poison-pill-pattern--author-eyewitness).
2. **Flat Earth vs serious cosmology:** [Flat Earth trance](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance.md) → [Flat Earth investigation](https://paradigmthreat.net/cosmos/flat_earth/flat-earth-investigation.md) → [Q&A debunks Entry 3](https://paradigmthreat.net/cosmos/flat_earth/flat-earth-qa-debunks.md#entry-3-zonal-winds--alternating-eastwest-weather-belts) → [Three-Cell Motion dossier](https://paradigmthreat.net/science/geoengineering/investigations/three-cell-motion-em-aether-investigation.md).
3. **Identity / royalty lanes:** [Designed from birth](https://paradigmthreat.net/influence/suppression/designed-from-birth.md) → [AU-048 identity index](https://paradigmthreat.net/influence/conspiracy/celebrities/INDEX-identity-investigations.md) → [AU-049 British royalty / Truss 49-day](https://paradigmthreat.net/governance/war/investigations/british-royalty-controlled-scheme-investigation.md).
4. **Infra / pure Relay:** site `SSR_MIRROR_REDIRECT` middleware → gateway publish-once + SearchStore docs → [GIT_REMOTE_STRATEGY](https://paradigmthreat.net/docs/GIT_REMOTE_STRATEGY) → paired **iad1/sjc1/hkg1** env on site README.

---

## Image gallery — assets committed in this window (2026-08-09 → 2026-08-28)

Raster files **first added** after **2026-08-09** through **2026-08-28** (exclusive windows — each image appears in **one** blog entry only). Heroes placed inline above; remainder below.

![lotr mouth of sauron at hormuz august 2026 portrait](https://paradigmthreat.net/governance/war/lotr-mouth-of-sauron-at-hormuz-august-2026-portrait.png)

![strong bad email cadence collapse hero](https://paradigmthreat.net/influence/controlled_opposition/strong-bad-email-cadence-collapse-hero.png)

![strong bad email cadence collapse](https://paradigmthreat.net/influence/controlled_opposition/strong-bad-email-cadence-collapse.png)

![Cursor model picker — Grok 4.6 High Fast selected, MAX Mode off (2026-08-13)](https://paradigmthreat.net/influence/censorship/cursor-grok-4.6-high-fast-model-picker-2026-08-13.png)

![Bitemporal / bizygomatic / bigonial means with ±SD — male vs female line faces](https://paradigmthreat.net/influence/conspiracy/celebrities/craniometric-ft-zy-go-sex-means.png)

![Facebook Anakrino 2022 — inverted facial triangle and eye-area vs cranial midline](https://paradigmthreat.net/influence/conspiracy/celebrities/facebook-anakrino-triangle-eye-midline-2022.png)

![Collage: Princess Qajar; Helen of Greece; Queen Louise of Sweden; Patricia Nixon & Happy Rockefeller; Lou Hoover & Girl Scout officers](https://paradigmthreat.net/influence/conspiracy/celebrities/power-women-qajar-helen-louise-nixon-hoover-collage.png)

![Differences of Skulls, Faces & Neck — purple-pill.net males (red) vs females (blue)](https://paradigmthreat.net/influence/conspiracy/celebrities/purple-pill-skulls-faces-neck-males-females.png)

![Sophia Loren — man-skull meme from the facial and skull methodology investigation](https://paradigmthreat.net/influence/conspiracy/celebrities/sophia-loren-man-skull-meme.png)

![Spanish FEMENINO / MASCULINO cranial sex chart — glabela, órbitas, palatinos, mandíbula, mastoides](https://paradigmthreat.net/influence/conspiracy/celebrities/spanish-cranial-sex-chart-femenino-masculino.png)

![Ivan Whillock — Head Proportions Made Simple; male and female profiles on the same 3×4 grid](https://paradigmthreat.net/influence/conspiracy/celebrities/whillock-head-proportions-male-female-same-grid.png)

![the flat earth trance portrait](https://paradigmthreat.net/cosmos/flat_earth/the-flat-earth-trance-portrait.png)

![Weekly World News, November 6, 1990 — JFK photographed at secret hideout](https://paradigmthreat.net/events/jfk/investigations/weekly-world-news-1990-11-06-jfk-secret-hideout.jpg)

## Publication notes

- **No Substack mirrors** for Flat Earth trance or Designed from birth yet; prior Aug 9 flagships remain the latest newsletter record.
- **Takeout Trash find** is author-context + documented JSON sidecars — trash timestamps not in export; deletion actor during Google gap **not proven**.
- **Pure Relay migration** = bot/article SSR on mesh + publish_origin fence + SearchStore on commit; Vercel keeps Next shell, PWA, and edge raster routing.
- **55 videos** in Trash is the headline count; **`VID_20200624_110648.mp4`** is the confirmed QAnon Shaman confrontation roll.
- Frame-review of remaining Jun 24 rolls and fire-date pinning remain open verification hooks.

---

*Topics:* [#controlled_opposition](https://paradigmthreat.net/search/controlled_opposition) · [#censorship](https://paradigmthreat.net/search/censorship) · [#governance](https://paradigmthreat.net/search/governance) · [#cosmos](https://paradigmthreat.net/search/cosmos) · [#science](https://paradigmthreat.net/search/science) · [#influence](https://paradigmthreat.net/search/influence) · [#relay](https://paradigmthreat.net/search/relay) · [#history](https://paradigmthreat.net/search/history)

**Last updated:** 2026-08-28T09:20:00-04:00

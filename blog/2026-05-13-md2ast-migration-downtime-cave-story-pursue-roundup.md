# Mid-May 2026: md2ast migration, brief downtime, Cave Story & PURSUE lanes, cosmology and geoengineering drops

*May 13, 2026 — Paradigm Threat*

**Summary.** Since the [May 5 roundup](https://paradigmthreat.net/blog/2026-05-05-may-roundup-circle-of-life-cancer-success-site-updates), the project shipped a large controlled-opposition and disclosure cluster (Cave Story, PURSUE / UAP Release 01, captured-courts framing), new cosmology and geoengineering investigations, and a major **site rendering migration** from the old relay-markdown stack to **`@clevertree/md2ast`** (Rust → WASM). Readers may have noticed **intermittent downtime** on paradigmthreat.net for roughly a week around this window — Vercel and related cloud quotas were hit during heavy rebuild and deploy cycles while the WASM bundle, image pipeline, and article fetch paths were being debugged. Service is back; this post is the longer catch-up the May 5 entry did not have room for.

---

## What broke, what shipped, and why it mattered

The site migration was not a cosmetic dependency bump. Article bodies now compile through **md2ast**: markdown is parsed in WebAssembly on the client (with SSR SEO fallbacks unchanged in spirit), PopImage figures render through the same component registry, and the published npm package carries an optimized **`md2ast_bg.wasm`** (~260 KB after wasm-opt). That replaced the older relay-markdown wiring and let the React renderer live vendored in the site repo while the WASM crate publishes independently.

The painful part was operational. Image URLs that used absolute `https://paradigmthreat.net/...` paths were being rewritten into **broken mirror URLs** until `listOptimizedAssetUrls` learned to preserve https origins; multiline markdown images were collapsing into invalid JSX; WASM init needed an explicit `.wasm` URL under Next.js dynamic import. Each fix required another production deploy. Combined with **cloud hosting limits** (build minutes, bandwidth, and edge churn on Vercel during repeated full builds), paradigmthreat.net was **down or flaky for short stretches** — not a content outage in the files repo, but a reader-visible gap while the new stack settled. A Playwright regression test now loads the [Cave Story essay](https://paradigmthreat.net/influence/controlled_opposition/you-do-not-have-to-stop-loving-cave-story) and asserts PopImage figures decode real rasters.

On the **Relay** side, `paradigm-threat-files` gained a chained **server GET hook** (`markdownHtmlFromGetContext` before raster optimization) and registered `server.hooks.get` in `.relay.yaml`, so raw markdown URLs can still resolve to HTML at the gateway when needed. Hub `page.md` files shed legacy YAML frontmatter in favor of body-only metadata and H1-driven index titles.

---

## paradigm-threat-files — new and expanded reader work

The files repo carried most of the intellectual weight this cycle: two long disclosure essays, a full Cave Story controlled-opposition lane, cosmology formalism, geoengineering moratorium framing, and several investigation companions that grew in place.

### Controlled opposition & disclosure

- [You do not have to stop loving *Cave Story*](https://paradigmthreat.net/influence/controlled_opposition/you-do-not-have-to-stop-loving-cave-story) — longform reader essay on loving the game while splitting credit packaging from the pixels; industrial detour (SNES fork, N64 gravity), 2020 GitHub DMCA chill, silver-platter pattern, media-consolidation coda; companion dossier holds tables and falsifiers.
- [*Cave Story* × Studio Pixel × Nicalis — controlled opposition investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-studio-pixel-nicalis-controlled-opposition-investigation) — timelines, §1.2 one-year-plan / three-week-build model, §1.9 SNES-CD / R&D1 read, §1.10 open status at audit bar, DMCA §6–§7, gated-sword figure set.
- [PURSUE Release 01 — What Am I Asking U FO?](https://paradigmthreat.net/influence/controlled_opposition/pursue-release-01-what-am-i-asking-u-fo) — witness-led follow-up to [What are you waiting for?](https://paradigmthreat.net/influence/controlled_opposition/what-are-you-waiting-for); east Mesa 2014 triangle testimony, audit-not-disclosure thesis, Mars ↔ Federal Reserve analogy.
- [PURSUE 01 (May 2026) UAP investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/pursue-2026-may-uap-release-investigation) — full corpus build for war.gov/ufo Release 01, novelty audit, BAASS PR-campaign footnote, witness file §9.2.
- [Captured courts, wrong villain](https://paradigmthreat.net/influence/controlled_opposition/captured-courts-wrong-villain) — Brantley wildfire thread → brsinv.com routing; court-capture substance vs Zionist scapegoat exit.
- [CB St. Julian / brsinv captured-courts investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/brsinv-st-julian-captured-courts-zionist-framing-investigation) — companion dossier for the framing analysis above.

**Expanded in place (same URLs, heavier dossiers):**

- [Was Chrono Trigger’s plot based on a 1984 CIA Mars remote viewing session?](https://paradigmthreat.net/influence/controlled_opposition/cia-1984-mars-chrono-trigger) — OC ReMix 2026 Chrono/CIA thread test, staff reply, §6.1.1 Liontamer judge-era firsthand.
- [OC ReMix polarization / privatization investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/ocremix-polarization-privatization-controlled-opposition-investigation) — post-Exodus repair, educational-ideas beat, MAGFest memory, whole-thread removal of Mars × Chrono discussion.
- [Success — by any means necessary](https://paradigmthreat.net/influence/controlled_opposition/success-by-any-means-necessary) and [What are you waiting for?](https://paradigmthreat.net/influence/controlled_opposition/what-are-you-waiting-for) — cross-linked into PURSUE and OC ReMix governance threads.

### Cosmology

- [The Incorrectly Scaled Universe](https://paradigmthreat.net/cosmos/cosmology/the-incorrectly-scaled-universe) — curved-light æther read on why cosmic distance may be overestimated; Maxwell substrate framing.
- [Incorrectly Scaled Universe investigation](https://paradigmthreat.net/cosmos/cosmology/investigations/incorrectly-scaled-universe-curved-light-aether-investigation) — formalism scaffold and dossier companion.

### Geoengineering & local politics

- [Rural burn zones need a density moratorium, not a DEW investigation](https://paradigmthreat.net/science/geoengineering/rural-burn-zones-density-moratorium-not-dew-investigation) — author weather-mod stance; argues moratorium over laser-hunt controlled opposition on Brantley-style threads.
- [Atkinson Georgia radiation-weapon fire investigation](https://paradigmthreat.net/science/geoengineering/investigations/atkinson-georgia-radiation-weapon-investigation) — comment-section field analysis; moved under `investigations/`.
- [Brantley burn-zone density moratorium template](https://paradigmthreat.net/science/geoengineering/investigations/brantley-burn-zone-density-moratorium-template) — actionable local template.
- [Rural burn zones moratorium handout (HTML)](https://paradigmthreat.net/science/geoengineering/rural-burn-zones-density-moratorium-handout.html) — printable handout for county-facing advocacy.

### Governance / war (investigation passes)

- [Cruz / Kevin Malone deep-state hypothesis investigation](https://paradigmthreat.net/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation) — Valentine’s Day giant-bear cryptic row, Dwight’s Speech revolution section, Drug Testing symptom list, Michael’s Birthday skin-cancer beat.

### Housekeeping readers may notice

- Article workflow docs now require **subtitles under H1**, **absolute `https://paradigmthreat.net` URLs** in article bodies (like blog posts), and self-reference as “this article” rather than “this file.”
- **Substack mirror links** were added to twelve published articles; site nav and announcement banner point at [Paradigm Threat on Substack](https://paradigmthreat2.substack.com/).
- Remote-viewing and other investigation **header images** were backfilled where missing.

---

## paradigm-threat-site — rendering, images, and reader chrome

The site repo tracked the md2ast cutover end to end: migrate article rendering to WASM, vendor `md2ast-react`, sync `public/wasm/md2ast/` on install/build, bump to `@clevertree/md2ast@^1.0.1`, fix WASM init URL, fix multiline `![...](...)` → PopImage transform, fix absolute-https mirror URL mangling, and add **`e2e/article-images.spec.ts`** so Cave Story figures cannot regress to pulse placeholders. Share links gained Substack mirror rendering and Instagram hashtag caps; a **relay migration announcement banner** (linked to Substack) went up during the transition so returning readers had a visible explanation while deploys were noisy.

---

## paradigm-threat-timeline

Light touch: agent instructions now distinguish **event YAML** from **article hub frontmatter**, and the default Relay client hook (`hooks/client/get.jsx`) landed here in sync with the files repo hook work.

---

## Reading order if you are catching up

1. [Cave Story essay](https://paradigmthreat.net/influence/controlled_opposition/you-do-not-have-to-stop-loving-cave-story) → [dossier](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-studio-pixel-nicalis-controlled-opposition-investigation) if you want tables and falsifiers.
2. [What are you waiting for?](https://paradigmthreat.net/influence/controlled_opposition/what-are-you-waiting-for) → [PURSUE Release 01 article](https://paradigmthreat.net/influence/controlled_opposition/pursue-release-01-what-am-i-asking-u-fo) → [PURSUE investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/pursue-2026-may-uap-release-investigation).
3. [Rural burn zones moratorium](https://paradigmthreat.net/science/geoengineering/rural-burn-zones-density-moratorium-not-dew-investigation) → [Captured courts, wrong villain](https://paradigmthreat.net/influence/controlled_opposition/captured-courts-wrong-villain) for the Brantley-thread → brsinv routing story.
4. [The Incorrectly Scaled Universe](https://paradigmthreat.net/cosmos/cosmology/the-incorrectly-scaled-universe) for the cosmology lane.

---

*Topics:* [#controlled_opposition](https://paradigmthreat.net/search/controlled_opposition) · [#cosmology](https://paradigmthreat.net/search/cosmology) · [#geoengineering](https://paradigmthreat.net/search/geoengineering) · [#governance](https://paradigmthreat.net/search/governance) · [#disclosure](https://paradigmthreat.net/search/disclosure) · [#site](https://paradigmthreat.net/search/site) · [#blog](https://paradigmthreat.net/search/blog)

# Mid-May 2026: md2ast migration, brief downtime, Cave Story & PURSUE lanes, cosmology and geoengineering drops, Big Mysteries consensus theater

*May 14, 2026 — Paradigm Threat*

**Summary.** Since the [May 5 roundup](https://paradigmthreat.net/blog/2026-05-05-may-roundup-circle-of-life-cancer-success-site-updates), the project shipped a large controlled-opposition and disclosure cluster (Cave Story, PURSUE / UAP Release 01, captured-courts framing), new cosmology and geoengineering investigations, and a major **site rendering migration** from the old relay-markdown stack to **`@clevertree/md2ast`** (Rust → WASM). Readers may have noticed **intermittent downtime** on paradigmthreat.net for roughly a week around this window — Vercel and related cloud quotas were hit during heavy rebuild and deploy cycles while the WASM bundle, image pipeline, and article fetch paths were being debugged. Service is back; this post is the full catch-up the May 5 entry did not have room for.

**May 14 addendum.** The morning after the first draft of this roundup, the cosmology lane gained a second major drop: [Consensus theater and the stalled physics pipeline](https://paradigmthreat2.substack.com/p/consensus-theater-and-the-stalled) — a reader essay on the APS **Big Mysteries Survey** (N = 1,675) and how press headlines sell “scrutiny” while the headcount records schism — plus a full companion investigation and hero art. The essay received a same-day expansion pass (Protestant-denomination parallel, headline-vs-vote table, correlation bundles). Blog drafting instructions in `docs/BLOG.md` were also updated to target longer, more contextual roundups like this one going forward.

---

## What broke, what shipped, and why it mattered

The site migration was not a cosmetic dependency bump. Article bodies now compile through **md2ast**: markdown is parsed in WebAssembly on the client (with SSR SEO fallbacks unchanged in spirit), PopImage figures render through the same component registry, and the published npm package carries an optimized **`md2ast_bg.wasm`** (~260 KB after wasm-opt). That replaced the older relay-markdown wiring and let the React renderer live vendored in the site repo while the WASM crate publishes independently. The architectural point is separation of concerns — the parser ships as a versioned npm artifact; the site can pin, vendor, and regression-test without waiting on monorepo coupling.

The painful part was operational, not theoretical. Image URLs that used absolute `https://paradigmthreat.net/...` paths were being rewritten into **broken mirror URLs** until `listOptimizedAssetUrls` learned to preserve https origins; multiline markdown images were collapsing into invalid JSX; WASM init needed an explicit `.wasm` URL under Next.js dynamic import. Each fix required another production deploy. Combined with **cloud hosting limits** (build minutes, bandwidth, and edge churn on Vercel during repeated full builds), paradigmthreat.net was **down or flaky for short stretches** — not a content outage in the files repo, but a reader-visible gap while the new stack settled. If you bookmarked an article mid-week and got a blank or broken figure grid, that was this window, not missing source files.

A Playwright regression test now loads the [Cave Story essay](https://paradigmthreat2.substack.com/p/you-do-not-have-to-stop-loving-cave) and asserts PopImage figures decode real rasters rather than pulse placeholders — so the image pipeline cannot silently regress on the next dependency bump. Share links gained Substack mirror rendering and Instagram hashtag caps; a **relay migration announcement banner** (linked to Substack) went up during the transition so returning readers had a visible explanation while deploys were noisy.

On the **Relay** side, `paradigm-threat-files` gained a chained **server GET hook** (`markdownHtmlFromGetContext` before raster optimization) and registered `server.hooks.get` in `.relay.yaml`, so raw markdown URLs can still resolve to HTML at the gateway when needed. Hub `page.md` files shed legacy YAML frontmatter in favor of body-only metadata and H1-driven index titles — less parser ambiguity between “hub index” and “article with YAML dates.”

---

## paradigm-threat-files — new and expanded reader work

The files repo carried most of the intellectual weight this cycle: two long disclosure essays, a full Cave Story controlled-opposition lane, cosmology formalism (scaling critique plus May 14 consensus-theater drop), geoengineering moratorium framing, captured-courts routing analysis, and several investigation companions that grew in place. The through-line is **audit over mood** — whether the subject is UAP releases, indie credit packaging, wildfire comment threads, or physicist attitude surveys.

### Controlled opposition & disclosure

- [You do not have to stop loving *Cave Story*](https://paradigmthreat2.substack.com/p/you-do-not-have-to-stop-loving-cave) — Longform reader essay for friends who do not live in forum archaeology: keep loving the game while splitting **credit packaging** from the pixels. Moves from what the public record supports through Nintendo’s hardware arc (SNES fork, N64 gravity), the 2020 GitHub DMCA chill, the “silver platter” pattern, and late-capital media choke points. Open-source-as-sword-in-the-stone metaphor figures; companion dossier holds timelines and falsifiers.
- [*Cave Story* × Studio Pixel × Nicalis — controlled opposition investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-studio-pixel-nicalis-controlled-opposition-investigation) — Full dossier: interview mirrors, §1.2 **one-year plan / three-week build-on-engine** model, §1.9 SNES-CD / R&D1 read, §1.10 **open status at audit bar** (no disproof; full-release clearance), DMCA §6–§7, gated-sword figure set. Read after the essay when you want tables and investigator falsifiers.
- [PURSUE Release 01 — What Am I Asking U FO?](https://paradigmthreat2.substack.com/p/pursue-release-01-what-am-i-asking) — Witness-led follow-up to [What are you waiting for?](https://paradigmthreat2.substack.com/p/what-are-you-waiting-for): from “why is the public still waiting?” to “what exactly needs auditing now?” Centers east Mesa **22 April 2014** black-triangle testimony with independent same-night MUFON corroboration; treats war.gov/ufo Release 01 as **lots of files, very little new evidence**; Mars ↔ Federal Reserve analogy for audit-not-disclosure framing.
- [PURSUE 01 (May 2026) UAP investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/pursue-2026-may-uap-release-investigation) — Corpus build for DOW **PURSUE** Release 01: CSV manifest, theme scans, novelty audit, BAASS PR-campaign footnote, witness file **§9.2** with duration/light-count revisions and audit TODOs.
- [Captured courts, wrong villain](https://paradigmthreat.net/influence/controlled_opposition/captured-courts-wrong-villain) — Brantley wildfire thread routes readers toward **brsinv.com** and a “Zionist” scapegoat exit; article argues the substantive story is **court capture and routing**, not the ethnic costume on the landing page.
- [CB St. Julian / brsinv captured-courts investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/brsinv-st-julian-captured-courts-zionist-framing-investigation) — Companion dossier: domain traces, comment-thread field notes, framing analysis for the article above.

**Expanded in place (same URLs, heavier dossiers):**

- [Was Chrono Trigger’s plot based on a 1984 CIA Mars remote viewing session?](https://paradigmthreat2.substack.com/p/was-chrono-triggers-plot-based-on) — OC ReMix 2026 Chrono/CIA thread as a live polarization test; staff reply; **§6.1.1** Liontamer judge-era firsthand; remains the Mars/predictive-programming bridge article.
- [OC ReMix polarization / privatization investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/ocremix-polarization-privatization-controlled-opposition-investigation) — Post-Exodus repair beats, educational-ideas thread, MAGFest memory lane, whole-thread removal of Mars × Chrono discussion as a governance signal.
- [Success — by any means necessary](https://paradigmthreat2.substack.com/p/success-by-any-means-necessary) and [What are you waiting for?](https://paradigmthreat2.substack.com/p/what-are-you-waiting-for) — Cross-linked into PURSUE and OC ReMix governance threads; disclosure series bookends.

### Cosmology

- [The Incorrectly Scaled Universe](https://paradigmthreat2.substack.com/p/the-incorrectly-scaled-universe) — Curved-light **æther** read on why cosmic distance may be overestimated: Maxwell substrate framing, path curvature as rule not exception, hall-of-mirrors deep-sky hazard, galaxy / young-solar-system identification risk. Pairs with the formalism dossier below.
- [Incorrectly Scaled Universe investigation](https://paradigmthreat.net/cosmos/cosmology/investigations/incorrectly-scaled-universe-curved-light-aether-investigation) — Citations, audit trail, open questions, and math scaffold for the scaling thesis.

**May 14 — Big Mysteries / consensus theater:**

- [Consensus theater and the stalled physics pipeline](https://paradigmthreat2.substack.com/p/consensus-theater-and-the-stalled) — Reader essay on the APS **Big Mysteries Survey** ([arXiv:2605.11058](https://arxiv.org/html/2605.11058), N = 1,675): Protestant-denomination parallel for physics subfields, **terminology parade** in popular press, headline-vs-headcount table (ΛCDM, inflation, dark sectors, string theory, Hubble tension), correlation **bundles** (modified gravity, quantum gravity, string/Hawking, multiverse/Many-Worlds), Big Bang menu fence without steady-state exit, black-hole vote splits vs documentary faith, stalled public ROI. Expanded same day with denser press anatomy and creation-fork section.
- [Big Mysteries consensus-theater investigation](https://paradigmthreat.net/cosmos/cosmology/investigations/big-mysteries-survey-consensus-theater-investigation) — Full Q1–Q10 grid, menu-design analysis, press quotes, Maxwell/Einstein evidence tiers, warfare/paradigm-jump cross-refs, Space Force posture notes, Protestant isomorph **§10.1**, audit hooks **§7** and open TODOs **§14**. Cross-links from [Incorrectly Scaled Universe](https://paradigmthreat2.substack.com/p/the-incorrectly-scaled-universe), [Quantum leap of faith](https://paradigmthreat2.substack.com/p/quantum-leap-of-faith), and cosmology hub.

### Geoengineering & local politics

- [Rural burn zones need a density moratorium, not a DEW investigation](https://paradigmthreat2.substack.com/p/rural-burn-zones-need-a-density-moratorium) — Author weather-mod stance stated plainly; argues **county-facing moratorium** beats laser-hunt controlled opposition on Brantley-style wildfire threads. Local politics over spectacle investigation.
- [Atkinson Georgia radiation-weapon fire investigation](https://paradigmthreat.net/science/geoengineering/investigations/atkinson-georgia-radiation-weapon-investigation) — Comment-section field analysis for a Georgia fire thread; relocated under `investigations/` for hub consistency.
- [Brantley burn-zone density moratorium template](https://paradigmthreat.net/science/geoengineering/investigations/brantley-burn-zone-density-moratorium-template) — Actionable local template readers can adapt for county meetings.
- [Rural burn zones moratorium handout (HTML)](https://paradigmthreat.net/science/geoengineering/rural-burn-zones-density-moratorium-handout.html) — Printable one-pager for advocacy; pairs with the moratorium article and Brantley template.

### Governance / war (investigation passes)

- [Cruz / Kevin Malone deep-state hypothesis investigation](https://paradigmthreat.net/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation) — *The Office* deep-read expansion: Valentine’s Day giant-bear cryptic row, Dwight’s Speech revolution section, Drug Testing symptom list, Michael’s Birthday skin-cancer beat — same window as the Modern Warfare militainment cluster, now with richer Halpert/Malone cross-cites.

### Housekeeping readers may notice

- Article workflow docs now require **subtitles under H1**, **absolute `https://paradigmthreat.net` URLs** in article bodies (like blog posts), and self-reference as “this article” rather than “this file.”
- **Substack mirror links** were added to twelve published articles; site nav and announcement banner point at [Paradigm Threat on Substack](https://paradigmthreat2.substack.com/).
- Remote-viewing and other investigation **header images** were backfilled where missing.
- `docs/BLOG.md` now targets **~2×** typical roundup length with expanded repo summaries and per-link coverage (this post follows that bar).

---

## paradigm-threat-site — rendering, images, and reader chrome

The site repo tracked the md2ast cutover end to end across eight commits in this window. Sequence in plain terms: migrate article rendering off relay-markdown onto **md2ast WASM**; vendor **md2ast-react** in-repo; sync `public/wasm/md2ast/` on install/build; publish-bump to `@clevertree/md2ast@^1.0.1` with wasm-opt’d bundle (~263 KB); fix WASM `init()` URL for Next dynamic import; fix multiline `` transforms so PopImage validation does not choke on line breaks; fix absolute-https asset URLs so the optimizer does not rewrite paradigmthreat.net into broken mirror hosts; add **`e2e/article-images.spec.ts`** (Cave Story regression).

Reader-visible outcomes: article pages should again show **real figure rasters** on long essays with many PopImage blocks; share cards respect Substack mirror URLs where configured; the migration banner explained noisy deploys to subscribers who hit the site mid-cutover. Remaining risk is ordinary — the next major Next or WASM bump will need the same e2e gate.

---

## paradigm-threat-timeline

Light touch relative to files, but not zero. Agent instructions now distinguish **event YAML** (timeline `content/` dates and ids) from **article hub frontmatter** (files-repo `page.md` indices) so assistants stop mixing schemas. The default Relay **client GET hook** (`hooks/client/get.jsx`) landed here in sync with the files-repo server hook.

The [2019 CE — *Ares Le Mandat* Mars–Earth influence corpus](https://timeline.paradigmthreat.net/timeline/evt-2019-ce-ares-le-mandat-mars-earth-influence-corpus) event gained a corrected cross-link: Israel–Gaza / Zenodo tomb mirrors now point at **§4–7** of the combined [Ares Le Mandat investigation](https://paradigmthreat.net/cosmos/mars/investigations/ares-le-mandat-mars-direct-earth-influence-investigation) rather than a split child file — keeping the Mars360 influence graph navigable from the book timeline.

---

## Image gallery — assets committed in this window (2026-05-05 → 2026-05-14)

Raster files **first added** after **2026-05-05** through **2026-05-14** (exclusive windows — each image appears in **one** blog entry only). Heroes placed inline above; remainder below.

![Quantum computer / infinitely indexed storage — analog memory and embedded signal thesis (investigation header)](https://paradigmthreat.net/science/computing/investigations/quantum-computer-infinitely-indexed-storage-thesis-investigation.png)

![Joseph Smith mystery solved — crystal-memory interpretation](https://paradigmthreat.net/science/computing/quantum-leap-of-faith-smith-mystery-solved.png)

![Quantum Leap (of faith) — article header](https://paradigmthreat.net/science/computing/quantum-leap-of-faith.png)

![incorrectly scaled universe curved light aether investigation](https://paradigmthreat.net/cosmos/cosmology/investigations/incorrectly-scaled-universe-curved-light-aether-investigation.png)

![The Incorrectly Scaled Universe — curved-light aether cosmology](https://paradigmthreat.net/cosmos/cosmology/the-incorrectly-scaled-universe.png)

![Remote Viewing as Aether Physics — investigation header](https://paradigmthreat.net/science/telepathy/remote_viewing/aether-consciousness.png)

![33 Thomas Street / AT&T Long Lines Building / Titanpointe — the canonical example of a windowless downtown tower whose cover story turned out to be only part of the story](https://paradigmthreat.net/influence/controlled_opposition/pursue-release-01-windowless-towers.jpg)

![anthropic usage policy](https://paradigmthreat.net/influence/censorship/anthropic-usage-policy.png)

![*Cave Story* × Studio Pixel × Nicalis — controlled opposition investigation header figure](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-studio-pixel-nicalis-controlled-opposition-investigation.png)

![Witness reconstruction graphic — east Mesa, Arizona (Phoenix metro area), Tuesday April 22, 2014, ~1:24 AM: stadium-sized fully opaque black triangle, ~7 lights, ~1,000 ft altitude, drifting on a constant heading along a residential street for at least ~1 minute of clear overhead motion (up to ~3 minutes total counting the slow recession into the city light pollution before final disappearance), watched by the author and two roommates, before receding into the standard city light pollution toward east Mesa and disappearing there. Pull-quote: "I refuse to believe that my roommates and I simultaneously mistook a meteor shower for a stadium-sized black triangle drifting at a thousand feet on a constant heading for at least a minute, with another minute or so to recede and finally disappear." Author-made reconstruction graphic, **not** a photograph of the 2014 event.](https://paradigmthreat.net/influence/controlled_opposition/pursue-release-01-what-am-i-asking-u-fo.png)

![what are you waiting for witness 2014](https://paradigmthreat.net/influence/controlled_opposition/what-are-you-waiting-for-witness-2014.png)

![Open source as sword in the stone — gated exhibit, portrait crop (metaphor figure)](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-open-source-sword-gated-after-hours-portrait.png)

![Open source as sword in the stone — gated exhibit, after hours (investigator metaphor figure)](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-open-source-sword-gated-after-hours.png)

![Open source as sword in the stone — gated exhibit, alternate framing (metaphor figure)](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-open-source-sword-gated-after-hours2.png)

![Open source as sword in the stone — gated exhibit, after hours (metaphor figure)](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-open-source-sword-gated-after-hours3.png)

![Atkinson, Georgia / Brantley Highway 82 fire — radiation-weapon investigation: signature anomalies of vaporized structures adjacent to intact pine canopy](https://paradigmthreat.net/science/geoengineering/atkinson-georgia-radiation-weapon-investigation.png)

![Rural burn zones need a density moratorium — article graphic](https://paradigmthreat.net/science/geoengineering/rural-burn-zones-density-moratorium-not-dew-investigation.png)

![Consensus theater and the stalled physics pipeline — Big Mysteries Survey, popular science, and audit](https://paradigmthreat.net/cosmos/cosmology/consensus-theater-and-the-stalled-physics-pipeline.png)

## Reading order if you are catching up

1. [Cave Story essay](https://paradigmthreat2.substack.com/p/you-do-not-have-to-stop-loving-cave) → [dossier](https://paradigmthreat.net/influence/controlled_opposition/investigations/cave-story-studio-pixel-nicalis-controlled-opposition-investigation) if you want tables and falsifiers.
2. [What are you waiting for?](https://paradigmthreat2.substack.com/p/what-are-you-waiting-for) → [PURSUE Release 01 article](https://paradigmthreat2.substack.com/p/pursue-release-01-what-am-i-asking) → [PURSUE investigation](https://paradigmthreat.net/influence/controlled_opposition/investigations/pursue-2026-may-uap-release-investigation).
3. [Rural burn zones moratorium](https://paradigmthreat2.substack.com/p/rural-burn-zones-need-a-density-moratorium) → [Captured courts, wrong villain](https://paradigmthreat.net/influence/controlled_opposition/captured-courts-wrong-villain) for the Brantley-thread → brsinv routing story.
4. [The Incorrectly Scaled Universe](https://paradigmthreat2.substack.com/p/the-incorrectly-scaled-universe) → [Consensus theater](https://paradigmthreat2.substack.com/p/consensus-theater-and-the-stalled) → [Big Mysteries investigation](https://paradigmthreat.net/cosmos/cosmology/investigations/big-mysteries-survey-consensus-theater-investigation) for the full cosmology lane this fortnight.

---

*Topics:* [#controlled_opposition](https://paradigmthreat.net/search/controlled_opposition) · [#cosmology](https://paradigmthreat.net/search/cosmology) · [#geoengineering](https://paradigmthreat.net/search/geoengineering) · [#governance](https://paradigmthreat.net/search/governance) · [#disclosure](https://paradigmthreat.net/search/disclosure) · [#science](https://paradigmthreat.net/search/science) · [#site](https://paradigmthreat.net/search/site) · [#blog](https://paradigmthreat.net/search/blog)

---

Keywords: #2026 #md2ast #migration #downtime #cave #story #pursue #consensus #theater #roundup #midmay #brief #lanes #cosmology #geoengineering #drops #big #mysteries


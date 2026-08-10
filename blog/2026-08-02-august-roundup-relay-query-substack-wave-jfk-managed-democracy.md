# Early August 2026: Relay QUERY cutover, ten Substack flagships, JFK essay, and managed democracy

*August 2, 2026 — Paradigm Threat*

**Summary.** Since the [July 9 roundup](https://paradigmthreat.net/blog/2026-07-09-july-portal-id4-research-mcp-server), the project shipped the heaviest **content + infrastructure** window of the summer: **ten Substack flagships** (July 11–August 1), a **115-commit** files pass, and a **Relay-first** discovery stack that retires committed `index.json` / `events.json` catalogs in favor of **SQLite QUERY**, **path_tree**, and **content_events** on the gateway. Reader essays now span slavery (*you are a slave, Neo*), managed democracy (Graham / HoC / redemption), Bilbo Mound and Georgia as second promised land, the long-promised **JFK Was Never Assassinated** essay, Jedi/goats remote-viewing satire, mudflood gatekeepers, *Arrival* (1996) Installment IV, **God Is a Woman!**, and Netanyahu’s **death-rumor** antibody audit. **paradigmthreat-site** rewired search, ChangeLog, nav, chat, and homepage “recent” through Relay QUERY. **relay-gateway** shipped the QUERY plugin, per-repo MCP, parked-domain SSR, commit-pinned web assets, non-blocking post-receive, and fleet catalog rescue — the same spine that serves paradigmthreat.net.

The through-line is **who owns the index**. On the narrative side: who owns the mound label, the death package, the Force, the climate cover story, the Creator’s gender, the rumor that a wartime face is dead. On the ops side: who owns the file catalog — a frozen JSON blob on Vercel, or live QUERY against git tip on Relay mirrors. Articles state thesis in prose; dossiers hold tiers; Relay now answers “what files exist?” the same way HTTP answers “what does this path say?”

---

## What broke, what shipped, and why Relay QUERY mattered

Through mid-July the site still leaned on **generated catalog JSON** (`index.json`, timeline `events.json`, changelog blobs) for search, nav, and ChangeLog. That model fought every Relay truth: tip moves, thin vs fat media trees, CDN stale GETs, and UTF-8 hydrate panics when home markdown carried the wrong dashes. The cutover is blunt:

1. **Gateway** indexes repos with **SQLite search** + **`path_tree`** / **`content_events`** collections (`search.yaml`, post-receive indexing).
2. **HTTP QUERY** returns ordered, filtered file and event rows — same path the new **per-repo Streamable HTTP MCP** uses (`POST /api/mcp/:repo`).
3. **Site** stopped treating catalog JSON as source of truth: search, nav, timeline, homepage recent content, and chat hydration call **QUERY** against Relay mirrors (prefer **lon1**, fail over past empty catalogs).
4. **Files** dropped committed `index.json` generation as the catalog spine; media rules ban **inline IPFS stubs** for fat binaries; Git remotes healed to a **single `main`** on GitLab + dfw1/hkg1/lon1 ([GIT_REMOTE_STRATEGY](https://paradigmthreat.net/docs/GIT_REMOTE_STRATEGY)).

Reader-visible effects: ChangeLog tabs that do not hang on a wedged mirror; article markdown fetch with query-bust past CDN; chat posts loaded from QUERY rows instead of per-file GETs; SSR article-first shell on Relay park; hung-push runbook when a Spot node’s post-receive stalls (push one remote with timeout; prefer hkg1/lon1; non-blocking post-receive validated on lon1/hkg1).

This is the same thesis as [The Internet That Should Have Been](https://paradigmthreat2.substack.com/p/the-internet-that-should-have-been) and July’s [Research MCP](https://paradigmthreat.net/mcp): **procedures and catalogs as inspectable contracts**, not frozen snapshots. Research MCP on paradigmthreat.net remains the curated research adjudication API; Relay MCP is the **repo-native** twin for any catalog-backed mirror.

---

## What the new lanes argue (in plain terms)

**Slavery as pattern, not metaphor.** *you are a slave, Neo* reads Morpheus’s line as literal institutional grammar — payroll ID, war debt, BlackRock as Cube-of-Saturn finance mark — with 1492 Atlantic flight and the Requirement as overwrite of a Native-welcome Christianity, not as schoolbook “discovery.”

**Managed democracy vs redemption counter-plan.** *House of Cards* taught kompromat as ordinary politics; RINO brakes (Graham first — *probably isn’t even dead*) and DINO brakes steer both parties inside the same war architecture. The **counter-plan** is exposure and institutional failure without mass arrests or revenge prosecutions — room for reconsideration.

**Mounds and Georgia.** Bilbo Mound (Savannah) is the worked example of **catastrophe graves** renamed as slow ceremonial earthworks after Smithsonian / National Parks substitute narrative. Georgia’s royal-dedication story is a later label over **George / Mars** sky naming and a **second promised land** Atlantic refuge read (AU-033).

**JFK essay.** The investigation’s staged-death thesis becomes a reader flagship: fake assassination under family agreement after Pavlick-class real threat; RFK same method; sealed packages and gunman forever-wars as method, not accident.

**Jedi / goats.** Ronson + Clooney farce as look-away filter over real GRILL FLAME / STAR GATE / Jedi Warrior stack; *Star Wars* IV–V as physics map; sequels as Force-ruin containment; French-hoax origin fable as insult misdirection.

**Mudflood gatekeepers.** Controlled opposition is not a Tartaria niche — poison pills (Flat Earth, landscape dragons, Younger Dryas closed calendar) plus fame without a document trail; Spurr / Meltrix lanes as fieldwork; species-level anti-agnosticism.

***Arrival* (1996) Installment IV.** NSA-aligned geoengineering disclosure (AGW as cover; Wolf 336 for Mars; Posada San Marsol wink) vs *Signs* (2002) post-reset insult and Villeneuve title diffusion.

**God Is a Woman.** Golden Age mother Creator → Dark Age male punisher redaction; *Third Story* narration; AU-040 creator-gender dossier.

**Death rumor.** Netanyahu as volunteer political load for Iran endgame; March 2026 death headlines as **controlled-visibility / proof-of-life** audit; Benzion Netanyahu spine; antibody agreement and dissent mapped.

---

## Substack published since July 9

**2026-07-11 — You are a slave, Neo.** Substack: [You are a slave, Neo](https://paradigmthreat2.substack.com/p/you-are-a-slave-neo). Repo draft: [you are a slave, Neo](https://paradigmthreat.net/governance/slavery/you-are-a-slave-neo). Matrix bondage line as institutional pattern; BlackRock / Cube of Saturn; 1492–1513 overwrite of original Christianity.

![you are a slave, Neo](https://paradigmthreat.net/governance/slavery/you-are-a-slave-neo.png)

**2026-07-12 — Managed democracy, puppets, and redemption.** Substack: [Managed democracy](https://paradigmthreat2.substack.com/p/managed-democracy-puppets-and-redemption). Repo draft: [Managed democracy, puppets, and redemption](https://paradigmthreat.net/governance/war/managed-democracy-puppets-and-redemption). Two-plan frame; Graham / RINO brake; Obama–Malcolm curation; redemption without revenge. Companions: [House of Cards kompromat](https://paradigmthreat.net/governance/war/investigations/house-of-cards-kompromat-blackmail-instances-investigation), [RINO effect](https://paradigmthreat.net/governance/war/investigations/rino-effect-graham-mcconnell-trump-controlled-opposition-investigation).

![Managed democracy, puppets, and redemption](https://paradigmthreat.net/governance/war/managed-democracy-puppets-and-redemption.png)

**2026-07-13 — Bilbo Mound and America’s buried past.** Substack: [Bilbo Mound](https://paradigmthreat2.substack.com/p/bilbo-mound-and-americas-buried-past). Repo draft: [Bilbo Mound and America's buried past](https://paradigmthreat.net/history/mudflood/bilbo-mound-and-americas-buried-past). Savannah 9CH4 as dug-over hinge; MFEE catastrophe graves vs ceremonial mound story. Investigation: [American burial mounds](https://paradigmthreat.net/history/mudflood/investigations/american-burial-mounds-mfee-smithsonian-national-parks-investigation).

![American burial mounds — Bilbo Mound and MFEE substitute narrative](https://paradigmthreat.net/history/mudflood/investigations/american-burial-mounds-mfee-smithsonian-national-parks-investigation-bilbo-mound.png)

**2026-07-14 — Georgia was the Second Promised Land.** Substack: [Georgia](https://paradigmthreat2.substack.com/p/georgia-was-the-second-promised-land). Repo draft: [Georgia was the Second Promised Land](https://paradigmthreat.net/history/chronology/georgia-was-the-second-promised-land). King George II dedication as later label; George/Mars naming; Atlantic refuge pluralism. Companion: [Georgia mirror naming AU-033](https://paradigmthreat.net/history/chronology/investigations/georgia-mirror-naming-rus-horde-mars-investigation).

![Georgia was the Second Promised Land](https://paradigmthreat.net/history/chronology/georgia-was-the-second-promised-land.png)

**2026-07-17 — JFK Was Never Assassinated.** Substack: [JFK Was Never Assassinated](https://paradigmthreat2.substack.com/p/jfk-was-never-assassinated). Repo draft: [JFK Was Never Assassinated](https://paradigmthreat.net/events/jfk/jfk-was-never-assassinated). Reader flagship for the staged-death dossier — Pavlick real threat → family compliance → Dealey spectacle; RFK parallel. Depth: [JFK/RFK hoax investigation](https://paradigmthreat.net/events/jfk/investigations/jfk-rfk-staged-assassination-hoax-investigation).

![JFK Was Never Assassinated](https://paradigmthreat.net/events/jfk/jfk-was-never-assassinated.png)

**2026-07-18 — The Jedi Who Stare at Goats.** Substack: [The Jedi Who Stare at Goats](https://paradigmthreat2.substack.com/p/the-jedi-who-stare-at-goats). Repo draft: [The Jedi Who Stare at Goats](https://paradigmthreat.net/influence/hollywood/the-jedi-who-stare-at-goats). Joke title as filter; STAR GATE / Jedi Warrior stack; Force-ruin containment in sequels. Investigation: [goats / RV satire](https://paradigmthreat.net/influence/hollywood/investigations/men-who-stare-at-goats-rv-satire-predictive-programming-investigation).

![The Jedi Who Stare at Goats](https://paradigmthreat.net/influence/hollywood/the-jedi-who-stare-at-goats.png)

**2026-07-22 — Mudflood gatekeepers.** Substack: [Mudflood gatekeepers](https://paradigmthreat2.substack.com/p/mudflood-gatekeepers). Repo draft: [Mudflood gatekeepers](https://paradigmthreat.net/influence/controlled_opposition/mudflood-gatekeepers). Poison-pill camps; Spurr document stall; StolenHistory ban; CO as species hygiene. Meltrix / Druzhinin poison-pill dossier in mudflood investigations.

![Mudflood gatekeepers](https://paradigmthreat.net/influence/controlled_opposition/mudflood-gatekeepers.png)

**2026-07-25 — The Arrival Treated Us Like Adults.** Substack: [The Arrival](https://paradigmthreat2.substack.com/p/the-arrival-treated-us-like-adults). Repo draft: [The Arrival Treated Us Like Adults](https://paradigmthreat.net/influence/hollywood/the-arrival-treated-us-like-adults). **Installment IV** — *Arrival* (1996) geoengineering message vs *Signs* reset; Villeneuve title diffusion. Dossier: [Arrival 1996 investigation](https://paradigmthreat.net/influence/hollywood/investigations/the-arrival-1996-geoengineering-agw-cover-investigation).

![The Arrival Treated Us Like Adults](https://paradigmthreat.net/influence/hollywood/the-arrival-treated-us-like-adults.png)

**2026-07-26 — God Is a Woman!** Substack: [God Is a Woman!](https://paradigmthreat2.substack.com/p/god-is-a-woman). Repo draft: [God Is a Woman!](https://paradigmthreat.net/influence/religion/god-is-a-woman). Golden Age female Creator → male punisher redaction; *Third Story* excerpt. Companion: [AU-040 creator-gender](https://paradigmthreat.net/influence/religion/investigations/god-is-a-woman-creator-gender-redaction-investigation).

![God Is a Woman!](https://paradigmthreat.net/influence/religion/god-is-a-woman.png)

**2026-08-01 — The Death Rumor That Protected Him.** Substack: [The Death Rumor That Protected Him](https://paradigmthreat2.substack.com/p/the-death-rumor-that-protected-him). Repo draft: [The Death Rumor That Protected Him](https://paradigmthreat.net/events/false_flag/the-death-rumor-that-protected-him). Netanyahu as wartime face / antibody carrier; death headlines as visibility control; Benzion spine; Iran pipeline cross-read to [Mission Accomplished (Again)](https://paradigmthreat2.substack.com/p/mission-accomplished-again-what-the).

![The Death Rumor That Protected Him](https://paradigmthreat.net/events/false_flag/the-death-rumor-that-protected-him.png)

---

## paradigm-threat-files — essays, dossiers, and Relay hygiene

### Governance — slavery, democracy, election timing, usury media

- [you are a slave, Neo](https://paradigmthreat2.substack.com/p/you-are-a-slave-neo) — bondage pattern essay; slavery paper-trail claims extended in companion lanes.
- [Managed democracy, puppets, and redemption](https://paradigmthreat2.substack.com/p/managed-democracy-puppets-and-redemption) — two-plan manifesto; nationalist intelligence close; Jan 6 / Christian revolution comparison in plain historical frame.
- [House of Cards kompromat investigation](https://paradigmthreat.net/governance/war/investigations/house-of-cards-kompromat-blackmail-instances-investigation) — twenty extortion beats catalog.
- [RINO effect — Graham / McConnell / Trump CO](https://paradigmthreat.net/governance/war/investigations/rino-effect-graham-mcconnell-trump-controlled-opposition-investigation) — managed-game historical backward pass.
- [Obama–Malcolm X paternity / birth-record curation](https://paradigmthreat.net/governance/war/investigations/obama-malcolm-x-paternity-birth-record-curation-investigation) — hypocrisy rule-out; curation over sperm-harvest.
- [NSA-aligned presidencies — Nixon, Reagan, Trump](https://paradigmthreat.net/governance/war/investigations/nsa-aligned-presidencies-nixon-reagan-trump-investigation) — presidency camp map.
- [2020 selective election-fraud / midterm-audit timing](https://paradigmthreat.net/governance/constitution/investigations/2020-election-fraud-selective-battleground-audit-timing-investigation) — timing dossier.
- [THIS IS AMERICA percentage-ad bait-switch](https://paradigmthreat.net/governance/usury/communism/investigations/this-is-america-percentage-ads-democratic-bait-switch-investigation) — gun/climate poll asides trimmed; climate crux locked to geoengineering ban/policy hook.

### History / mudflood / chronology

- [Bilbo Mound and America's buried past](https://paradigmthreat2.substack.com/p/bilbo-mound-and-americas-buried-past) + [American burial mounds investigation](https://paradigmthreat.net/history/mudflood/investigations/american-burial-mounds-mfee-smithsonian-national-parks-investigation) — MFEE fossilization, Smithsonian erasure, Reddit perm-ban log in same window.
- [Georgia was the Second Promised Land](https://paradigmthreat2.substack.com/p/georgia-was-the-second-promised-land) + [Georgia mirror naming AU-033](https://paradigmthreat.net/history/chronology/investigations/georgia-mirror-naming-rus-horde-mars-investigation) — George→Mars pronunciation drift; King George claim.
- [Amaruka / Meru royalty and Wall Street Ottoman wall (AU-038)](https://paradigmthreat.net/history/chronology/investigations/amaruka-khan-meru-wall-street-ottoman-wall-investigation) — chronology royalty / finance wall lane.
- [Mudflood gatekeepers](https://paradigmthreat2.substack.com/p/mudflood-gatekeepers) (title trimmed from poison-pills slug) + Meltrix/Druzhinin poison-pill investigation + Spurr CO follow-up archive + Mudfossil University / Spurr investigation updates.

### Events — JFK flagship and Netanyahu death rumor

- [JFK Was Never Assassinated](https://paradigmthreat2.substack.com/p/jfk-was-never-assassinated) — plain-speak essay; audited imagery; *Friday* reframed as conviction trap / poisoned hinge; F/X and Dark Knight blood-staging PP expanded; Pavlick meme contextualized.
- [JFK/RFK hoax investigation](https://paradigmthreat.net/events/jfk/investigations/jfk-rfk-staged-assassination-hoax-investigation) — disclosure envelope, Cesar clear, Girl Hair encodes; factual safeguards; agent.md hub dropped from essay voice.
- [The Death Rumor That Protected Him](https://paradigmthreat2.substack.com/p/the-death-rumor-that-protected-him) — controlled-visibility audit; Benzion spine expansion; antibody agreement/dissent map.
- [Related false flags after 9/11](https://paradigmthreat.net/events/false_flag/investigations/related-false-flags-911-oct7-france-vegas-children-of-men-investigation) — Oct 7 / France / Vegas / *Children of Men* cluster; Gage perp-walk CO note.

### Hollywood / PP / religion / cosmos / nukes

- [The Jedi Who Stare at Goats](https://paradigmthreat2.substack.com/p/the-jedi-who-stare-at-goats) + goats/RV investigation — Congo NSA camp and French-hoax containment deepened.
- [The Arrival Treated Us Like Adults](https://paradigmthreat2.substack.com/p/the-arrival-treated-us-like-adults) — Installment IV; Thread R in Hollywood dossier; Villeneuve as diffusion.
- [Half-Life 2 NSA Combine warning](https://paradigmthreat.net/influence/predictive_programming/investigations/half-life-2-nsa-combine-warning-containment-investigation) + [Children of Men NSA warning](https://paradigmthreat.net/influence/predictive_programming/investigations/children-of-men-nsa-warning-predictive-programming-investigation).
- [God Is a Woman!](https://paradigmthreat2.substack.com/p/god-is-a-woman) + AU-040 creator-gender dossier.
- [Saturnian published timelines](https://paradigmthreat.net/cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation) — Cook / Tiki-Toki compare.
- **Nukes half-hoax** — retire nuclear full-hoax claims; flash myth vs real DU ([science/nukes](https://paradigmthreat.net/science/nukes)).
- [Time-travel literature Wells deposit](https://paradigmthreat.net/influence/predictive_programming/investigations/time-travel-literature-wells-deposit-investigation) — Philadelphia misread companion (landed in this window).
- Burn After Reading added to NSA catalog; SIGINT notes extended.

### Relay / git / media housekeeping (files repo)

- [GIT_REMOTE_STRATEGY](https://paradigmthreat.net/docs/GIT_REMOTE_STRATEGY) — single `main` GitLab + Relay; hung-push runbook; lon1/hkg1 non-blocking post-receive validated.
- **Catalog:** enable Relay QUERY/sqlite; prefer `@relay/search/sqlite`; remove committed `index.json`; path_tree indexing.
- **Media:** restore binaries from pre-thin GitLab archive; ban inline IPFS stubs ([MEDIA_AND_IPFS](https://paradigmthreat.net/docs/MEDIA_AND_IPFS)).
- **SSR tip hygiene:** article-first shell, sitemap, P0–P3; ASCII-safe `page.md` to clear Relay hydrate UTF-8 panic; theme/font toggle fixes; content-derived TOC.
- Site-chat lead → investigation → protricity [CHAT_REQUEST_RESPONSE](https://paradigmthreat.net/docs/CHAT_REQUEST_RESPONSE) playbook; cosmic life cycle claim registration.

---

## paradigm-threat-timeline

Timeline followed the same QUERY cutover as files:

- **QUERY / sqlite indexing** enabled with **MCP timeline tools**; prefer `@relay/search/sqlite` in QUERY hook.
- **`search.yaml`** for events/index FTS.
- **Catalogs built from `content_events` and `path_tree`** — committed catalog JSON removed; content-only validation.
- Obsolete `events.json` migrators removed; changelog.json generator dropped from timeline repo.
- Slave-trades notes updated; catalog docs fixed for Relay QUERY.

---

## paradigm-threat-site — discovery moves to Relay QUERY

After July’s Research MCP ship, the site’s next leap was **not another AI feature** — it was making every discovery surface speak QUERY.

**Discovery stack**

- Search, nav, and timeline catalogs via **Relay QUERY** (probe mirrors with QUERY, not catalog JSON GETs).
- Homepage **recent content** from QUERY instead of `changelog.json`.
- ChangeLog: reuse catalog cache, stream card blurbs, instant tab switches, surface QUERY timeouts / mirror errors, avoid hang on wedged files mirror.
- Chat: **Relay git-backed chat** replaces Vercel Postgres; hydrate posts from QUERY rows; stage UI; query by channel.
- Crawl e2e pointed at QUERY; article paint decoupled from catalog QUERY for speed.
- Prefer **lon1** mirrors; fail over past empty catalogs; show **Last updated** with local hour.
- Files visible in navigation; markdown corpus validation.

**Retained / earlier in window:** Research MCP `/api/mcp`, investigation submissions, Site AI claims routing — already covered in the [July 9 blog](https://paradigmthreat.net/blog/2026-07-09-july-portal-id4-research-mcp-server); still live under the new QUERY corpus.

---

## relay-gateway — QUERY, MCP, park SSR, and fleet harden

**relay-gateway** (37 commits since mid-July) is why the site cutover was possible.

**QUERY and MCP**

- SQLite QUERY plugin; HTTP QUERY routing; `@relay/search/*` imports.
- `path_tree` and `content_events` catalog sources; scoped roots; order options (`path` / `-path` / `random`); ordered filtered collection queries.
- `search.yaml`, QUERY health envelope, post-receive indexing; skip re-ingest on fresh QUERY.
- Chat search plugin with incremental `chat_comments` ingest.
- **Per-repo Streamable HTTP MCP** (`docs/RELAY_MCP.md`) — tools call the same QUERY path as HTTP.
- Pre-receive `.relay.yaml` reads fixed under git quarantine.

**Park / SSR / assets**

- App-shell SSR routing without `?embed=1`; parked domains + fleet DNS reconcile; park TLS (HTTP-01) + Caddy PEMs.
- Park QUERY routing and thin-park support; surface parked SSR failures; honor catalog site name.
- Commit-pinned **relay-web-assets**; tip-local imports on CleverScript host; SSR phase timings; commit-keyed HTML cache with `s-maxage`.
- SEO: description + canonical in embed HTML.

**Ops / media / CI**

- Non-blocking post-receive; bound mesh/index/autoPush (fixes hung Relay pushes that stalled lon1 earlier in summer).
- Transactional bare-repo reclone + trust-root rescue; full-history catalog clone default (shallow opt-in).
- IPFS: forbid inline stubs for fat paradigm-threat-files; centralDir migrate hardening.
- Spot fleet deploy tooling; on-demand CI to cut shared-runner minutes.
- Docs: park hardening, catalog rescue, fleet console, mesh ops — operator spine for paradigmthreat.net mirrors.

---

## Reading order

1. **Relay / how the site works now:** [GIT_REMOTE_STRATEGY](https://paradigmthreat.net/docs/GIT_REMOTE_STRATEGY) → [Research MCP /mcp](https://paradigmthreat.net/mcp) → try search and ChangeLog on [paradigmthreat.net](https://paradigmthreat.net) (QUERY-backed).
2. **Democracy / slavery:** [you are a slave, Neo](https://paradigmthreat2.substack.com/p/you-are-a-slave-neo) → [Managed democracy](https://paradigmthreat2.substack.com/p/managed-democracy-puppets-and-redemption) → [HoC kompromat](https://paradigmthreat.net/governance/war/investigations/house-of-cards-kompromat-blackmail-instances-investigation) → [RINO effect](https://paradigmthreat.net/governance/war/investigations/rino-effect-graham-mcconnell-trump-controlled-opposition-investigation).
3. **Mounds / Georgia:** [Bilbo Mound](https://paradigmthreat2.substack.com/p/bilbo-mound-and-americas-buried-past) → [burial mounds investigation](https://paradigmthreat.net/history/mudflood/investigations/american-burial-mounds-mfee-smithsonian-national-parks-investigation) → [Georgia second promised land](https://paradigmthreat2.substack.com/p/georgia-was-the-second-promised-land) → [Mudflood gatekeepers](https://paradigmthreat2.substack.com/p/mudflood-gatekeepers).
4. **JFK package:** [JFK Was Never Assassinated](https://paradigmthreat2.substack.com/p/jfk-was-never-assassinated) → [hoax investigation](https://paradigmthreat.net/events/jfk/investigations/jfk-rfk-staged-assassination-hoax-investigation).
5. **Hollywood PP chain:** [Not Like This](https://paradigmthreat2.substack.com/p/not-like-this) → [Everything Burns](https://paradigmthreat2.substack.com/p/everything-burns) → [ID4](https://paradigmthreat2.substack.com/p/everything-in-independence-day-is) → [Arrival IV](https://paradigmthreat2.substack.com/p/the-arrival-treated-us-like-adults) → [Jedi goats](https://paradigmthreat2.substack.com/p/the-jedi-who-stare-at-goats).
6. **Iran / visibility:** [Mission Accomplished (Again)](https://paradigmthreat2.substack.com/p/mission-accomplished-again-what-the) → [Death Rumor](https://paradigmthreat2.substack.com/p/the-death-rumor-that-protected-him).
7. **Creator / cosmology:** [God Is a Woman!](https://paradigmthreat2.substack.com/p/god-is-a-woman) → [Circle of Life](https://paradigmthreat2.substack.com/p/the-circle-of-life-and-how-it-began) → [Saturnian timelines](https://paradigmthreat.net/cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation).

---

## Publication notes

- **Ten** Substack flagships since July 9 — all mirrored on-site with hero art (or Bilbo investigation lead PNG).
- Catalog spine is **Relay QUERY**, not committed `index.json` — regenerate habits in old docs retired.
- Media fat-tree: binaries restored; IPFS stubs forbidden for paradigm-threat-files.
- Relay push hygiene: single-main strategy; hung-push runbook; non-blocking post-receive on lon1/hkg1.
- Nuclear lane: full-hoax retired for **half-hoax** (flash myth vs real DU).
- Hollywood PP series now runs **I–IV** (Matrix → Pacific → ID4 → Arrival).
- Operator docs live in **relay-gateway** (`RELAY_MCP.md`, fleet console, catalog rescue) and files `docs/GIT_REMOTE_STRATEGY.md`.

---

*Topics:* [#governance](https://paradigmthreat.net/search/governance) · [#slavery](https://paradigmthreat.net/search/slavery) · [#war](https://paradigmthreat.net/search/war) · [#history](https://paradigmthreat.net/search/history) · [#mudflood](https://paradigmthreat.net/search/mudflood) · [#events](https://paradigmthreat.net/search/events) · [#false_flag](https://paradigmthreat.net/search/false_flag) · [#hollywood](https://paradigmthreat.net/search/hollywood) · [#predictive_programming](https://paradigmthreat.net/search/predictive_programming) · [#controlled_opposition](https://paradigmthreat.net/search/controlled_opposition) · [#religion](https://paradigmthreat.net/search/religion) · [#science](https://paradigmthreat.net/search/science) · [#computing](https://paradigmthreat.net/search/computing) · [#constitution](https://paradigmthreat.net/search/constitution)

**Last updated:** 2026-08-02T11:00:00-04:00

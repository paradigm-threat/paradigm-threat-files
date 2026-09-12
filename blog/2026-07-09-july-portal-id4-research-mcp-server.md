# Mid-July 2026: portal series, ID4 unity lane, Research MCP for any AI host, and Dead Planet timeline

*July 9, 2026 — Paradigm Threat*

**Summary.** Since the [July 3 roundup](https://paradigmthreat.net/blog/2026-07-03-july-roundup-alef-tona-ecw-mars-jfk-constitution-cern-censorship), three **Substack** flagships completed a **portal trilogy** in prose — [Out of This Door Might Come Something](https://paradigmthreat2.substack.com/p/out-of-this-door-might-come-something) (CERN buried ring, Mars-only gate, Dead Planet Protocol), [The Philadelphia Experiment Was Not Time Travel](https://paradigmthreat2.substack.com/p/the-philadelphia-experiment-was-not) (harbor pair, Flame/Freeze injury grammar, Wells misread as chronology fiction), and [Everything in Independence Day Is True](https://paradigmthreat2.substack.com/p/everything-in-independence-day-is) (Installment III — NSA unity lane, Area 51 reveal, locust harvest, Whitmore as real declaration). **Hollywood** dossier gained **Thread N (*T2*)**, **Thread O (*ID4*)**, **Thread P (*Stargate* contrast)**, and **Thread G** hot-war containment. **JFK hoax investigation** expanded with **§2.5–§2.7** assassination-pattern synthesis. **Ancient stargates** assets relocated to chronology hub. The infrastructure headline: **Research MCP** shipped at **`https://old.paradigmthreat.net/api/mcp`** — a public, read-mostly **Model Context Protocol** server so **any MCP-capable host** (Cursor, Claude Desktop, ChatGPT Apps, and other MCP clients) can search ~2,300 investigations, read markdown via Relay, match curated thesis cards, compute **blip-adjusted chronology**, and return **honest `not_in_corpus` gaps** instead of inventing positions. Setup docs live at [/mcp](https://old.paradigmthreat.net/mcp); front page discovery hub updated with host-restriction notes.

The through-line is **propagation without the garden** — the same problem [Alef and the clogged internet](https://paradigmthreat2.substack.com/p/alef-and-the-clogged-internet) named for human readers, now addressed for **agents**: machine-readable corpus access that does not require an open browser tab, a podcast booking, or an indexed walled-garden slot. Portal essays argue **where the doors actually are** (buried rings, harbor pairs, Area 51 hangars); MCP is the **inspectable hood** for the research stack itself.

---

## Research MCP — query Paradigm Threat from ChatGPT, Cursor, or any MCP host

This is the largest **reader-facing infrastructure** drop since **Site AI** in June — and it directly answers the [Internet That Should Have Been](https://paradigmthreat2.substack.com/p/the-internet-that-should-have-been) complaint at the **agent layer**: procedures and corpus access declared for tools, not only for the vendor's in-tab assistant.

### What shipped

**Research MCP** is a **server-side** MCP endpoint on paradigmthreat-site:

| Item | Value |
|------|--------|
| **MCP URL** | `https://old.paradigmthreat.net/api/mcp` |
| **Setup page** | [paradigmthreat.net/mcp](https://old.paradigmthreat.net/mcp) |
| **Health check** | `GET https://old.paradigmthreat.net/api/mcp?health=1` |
| **Transport** | Streamable HTTP (JSON-RPC), **stateless** (serverless-safe on Vercel) |
| **Enable flag** | `MCP_SERVER_ENABLED=1` on production deployment |

It reuses the same **Relay mirrors**, **search index**, **`site-claims.json` thesis cards**, and **timeline date math** as the live site and browser **WebMCP** tools — but runs **without an open paradigmthreat.net tab**. WebMCP remains **client-side** (Chrome agent, `/reply` assistant, in-page Site AI). Research MCP is for **hosts that speak MCP over HTTP**: IDE agents, desktop clients, ChatGPT custom apps.

**Design posture:** corpus-grounded **research adjudication**, not an oracle. Tools return what the repo indexes and cite; **`research_status`** reports coverage envelopes including **`not_in_corpus`** when a topic is not yet in the index. The host model may still supplement from training data — but MCP output separates **citable tool results** from gaps. Aligns with investigation sweep rules: propose searches and open questions; never auto-edit dossiers.

### Tools (v0.1)

| Tool | Alias | What it does |
|------|-------|----------------|
| `search_site` | `search` | Keyword **AND** search over merged files + timeline index (~2,300 paths) |
| `read_article` | `fetch` | Paginated markdown fetch via Relay mirrors |
| `get_site_claims` | — | Curated thesis cards (`confidence`, `uniqueness`, `doNotSay`) |
| `research_status` | — | Coverage envelope — **`not_in_corpus`**, gaps, suggested next steps |
| `get_chronology_framework` | — | NC / Blip / phantom-interval glossary |
| `get_event_dates` | — | Resolve timeline event → structured dates |
| `compute_years_ago` | — | Calendar vs **blip-adjusted** elapsed time (670 BCE → 1053 CE overlap) |
| `submit_investigation_idea` | — | Propose a new investigation topic → Postgres → public list on [/submit](https://old.paradigmthreat.net/submit) |

**Citation discipline (documented on [/mcp](https://old.paradigmthreat.net/mcp)):** prefer **primary and public URLs** returned by investigations; cite `paradigmthreat.net` only when the claim is **original to the repo** (`site-distinctive`, author thesis). The model may read synthesis markdown for reasoning; answers should list **citable URLs separately**.

### How to connect — Cursor or Claude Desktop

Add an HTTP MCP server pointing at the production endpoint:

```json
{
  "mcpServers": {
    "paradigm-threat": {
      "url": "https://old.paradigmthreat.net/api/mcp"
    }
  }
}
```

In **Cursor**: Settings → MCP → add server with the URL above (or paste the JSON into your MCP config). Then ask research questions in chat — the agent should call `search_site` / `read_article` / `get_site_claims` before asserting Paradigm Threat positions.

Validate locally after `MCP_SERVER_ENABLED=1 pnpm run dev`:

```bash
node scripts/validate-mcp.mjs http://localhost:3000
```

Production validation:

```bash
node scripts/validate-mcp.mjs https://paradigmthreat.net
```

(Site repo: `paradigm-threat-site/scripts/validate-mcp.mjs`.)

### How to connect — ChatGPT (and other consumer MCP hosts)

**ChatGPT Apps** (Settings → Apps → Create app):

1. **Server URL:** `https://old.paradigmthreat.net/api/mcp`
2. **Authentication:** **No Auth** (public read-mostly endpoint)
3. **Add the app as a source** in a chat before asking research questions
4. Prefer prompts that **invoke tools explicitly**: *"Use paradigm-threat search for Philadelphia Experiment"* or *"Call research_status on CERN Mars gateway"*

OpenAI's MCP Apps standard (`search` + `fetch` aliases) maps to our `search_site` and `read_article` — same corpus as the site.

**Any other MCP-supported client** that accepts a remote HTTP MCP URL can register the same endpoint. The protocol is not Cursor-specific; it is the [Model Context Protocol](https://modelcontextprotocol.io) Streamable HTTP transport.

### Host restrictions — read this before blaming the server

The endpoint is **public**, but **the host may refuse to call tools** before a request reaches paradigmthreat.net. Documented on [/mcp](https://old.paradigmthreat.net/mcp) and the [front page](https://paradigmthreat.net):

- **Free / consumer tiers** (ChatGPT, Gemini, etc.) often block tool calls on **real people**, **alleged crimes or deaths**, or **defamation-shaped** prompts.
- **Symptom:** connector installed, tools **listed**, but **never invoked** — usually **host safety policy**, not MCP outage.
- **Mitigation:** neutral corpus prompts — search by title/codename, list paths only, call `research_status` without asking the model to assert claims; use **Cursor** or another dev-oriented client for sensitive dossiers (9/11, JFK hoax, Epstein cluster).

This is the same **clogging** grammar as [Alef](https://paradigmthreat2.substack.com/p/alef-and-the-clogged-internet) at a different layer: the **agent host** gates which procedures may run. Research MCP makes the **corpus procedure** available; it cannot override OpenAI's pre-call classifier.

### WebMCP vs Research MCP — which to use

| Channel | Requires open tab? | Best for |
|---------|-------------------|----------|
| **WebMCP** (browser) | Yes — paradigmthreat.net page open | Gemini-in-Chrome, `/reply` paste assistant, in-page Site AI chat |
| **Research MCP** (`/api/mcp`) | No | Cursor, Claude Desktop, ChatGPT Apps, automation, headless research |

Both share handlers and corpus; choose by **where the user works**. Full WebMCP tool list: site repo `docs/WEBMCP_INTEGRATION.md`. Full MCP plan and phased roadmap: `docs/MCP_SERVER_PLAN.md`. Deploy runbook: `docs/MCP_VERCEL_DEPLOY.md`.

### Example agent workflows

1. **"What does Paradigm Threat say about the Philadelphia Experiment?"** → `search_site` → `read_article` on Part A/B → `get_site_claims` for portal thesis → cite primaries from investigation § Primary Sources.
2. **"When did the Council of Nicaea happen in NC vs mainstream?"** → `get_event_dates` → `compute_years_ago` with blip flag → `get_chronology_framework` for caveats.
3. **"Is there a dossier on Kevin Malone penny sovereignty?"** → `research_status` — if `not_in_corpus`, `search_site` partial hits → `submit_investigation_idea` if gap confirmed.
4. **"Summarize Independence Day predictive programming read"** → `search_site` ID4 → `read_article` → cross-link `hollywood-two-camp-war-investigation` Thread O.

---

## What the new lanes argue (in plain terms)

**CERN portal (Part A)** — Bertolucci's 2009 *"out of this door might come something"* is **primary source**, not viral meme. The LHC is a **27 km buried harness**; the **quantum tunnel** sits at the **centroid**, classified, under French farmland — symmetric **Mars-only** endpoint under **Dead Planet Protocol** (Mariner 2 seals lifeless Mars while gates maintain Earth–Mars transport). **WWW** at CERN rhymes **Vav / 666** commerce grammar. Ancient stargate catalog relocated to [chronology hub](https://paradigmthreat.net/history/chronology/ancient-stargates/page).

**Philadelphia (Part B)** — 28 October 1943: destroyer **appears in Norfolk water**, not sails in — **space routing** between harbors, not chronology hop. Allende **Flame / Freeze / Getting Stuck** injury grammar; Jessup–Varo–ONR artifact chain; Wells *Time Machine* **prefigured the misread** that would file harbor teleport under time travel. Lineage: **Stonehenge → ship coil → LHC/FCC**.

**Independence Day (Installment III)** — **Everything in *ID4* is true** on the read that matters: Area 51 hangar reveal, Nimziki secrecy nearly kills millions, locust strip-mining, **same-species** harvest force in biosuits, world militaries unify, Whitmore speech as **real declaration** vs July 4 holiday farce. **Stargate (1994)** same team, **opposite camp** — ancient-alien misdirection (Thread P). **Tier-A** host-body split: Wells never opened the suit; ID4 hangar does.

---

## Substack published since July 3

**2026-07-04 — Out of This Door Might Come Something.** Substack: [Out of This Door](https://paradigmthreat2.substack.com/p/out-of-this-door-might-come-something). Repo draft: [Out of This Door Might Come Something](https://paradigmthreat.net/science/cern_portal/out-of-this-door-might-come-something). **Portal series Part A** — Bertolucci door quote, buried LHC ring, Mars endpoint, Dead Planet Protocol, ancient stargates, WWW/Vav chain. Companion: [CERN–Mars gateway investigation](https://paradigmthreat.net/science/cern_portal/investigations/cern-mars-quantum-gateway-investigation).

**2026-07-06 — The Philadelphia Experiment Was Not Time Travel.** Substack: [Philadelphia Experiment](https://paradigmthreat2.substack.com/p/the-philadelphia-experiment-was-not). Repo draft: [The Philadelphia Experiment Was Not Time Travel](https://paradigmthreat.net/events/philadelphia/the-philadelphia-experiment-was-not-time-travel). **Part B** — Norfolk witness pair, Allende letters, Varo edition, ordered reproduction timeline art, Earth-field thesis. Follows Part A; full audit: [Philadelphia portal precursor investigation](https://paradigmthreat.net/events/philadelphia/investigations/philadelphia-experiment-portal-precursor-investigation).

![The Philadelphia Experiment Was Not Time Travel — portal series Part B](https://paradigmthreat.net/events/philadelphia/the-philadelphia-experiment-was-not-time-travel.png)

**2026-07-08 — Everything in Independence Day Is True.** Substack: [Everything in Independence Day Is True](https://paradigmthreat2.substack.com/p/everything-in-independence-day-is). Repo draft: [Everything in Independence Day Is True](https://paradigmthreat.net/influence/hollywood/everything-in-independence-day-is-true). **Installment III** — NSA unity lane; Area 51; locust harvest; biosuit occupant; Whitmore/Rushmore; WTC shadow PP receipt. Renamed from earlier *Declare Independence* slug. Dossier: [Hollywood two-camp war](https://paradigmthreat.net/influence/hollywood/investigations/hollywood-two-camp-war-investigation) Threads N, O, P, G.

---

## paradigm-threat-files — portal series, Hollywood, JFK, housekeeping

### CERN / Philadelphia portal arc

- [Out of This Door Might Come Something](https://paradigmthreat2.substack.com/p/out-of-this-door-might-come-something) — Part A flagship (~130 lines); CERN layout diagram, Lowell canals, CIA RV art, Doom PP, Gotthard ceremony cross-read.
- [The Philadelphia Experiment Was Not Time Travel](https://paradigmthreat2.substack.com/p/the-philadelphia-experiment-was-not) — Part B flagship; earth-portal-projects timeline figure, Stonehenge Golden Age port, mystery airships 1896–97 rhyme.
- [Philadelphia portal precursor investigation](https://paradigmthreat.net/events/philadelphia/investigations/philadelphia-experiment-portal-precursor-investigation) — dossier companion; PP catalog §8.
- [Ancient stargates hub](https://paradigmthreat.net/history/chronology/ancient-stargates/page) — 27-image catalog; assets relocated from stray paths; [early 20th-century stargate discoveries investigation](https://paradigmthreat.net/history/chronology/ancient-stargates/investigations/early-20th-century-stargate-discoveries-image-catalog-investigation).

![Earth-first portal projects — Stonehenge to Philadelphia to CERN timeline](https://paradigmthreat.net/events/philadelphia/earth-portal-projects-timeline.png)

### Hollywood — two-camp war expansion

- [Everything in Independence Day Is True](https://paradigmthreat2.substack.com/p/everything-in-independence-day-is) — reader Installment III; plain session tone codified in [ARTICLES.md](https://paradigmthreat.net/docs/instructions/ARTICLES) as default serious voice.
- [Hollywood two-camp war investigation](https://paradigmthreat.net/influence/hollywood/investigations/hollywood-two-camp-war-investigation) — renamed dossier; **per-film camp rule** (camp is not "China content"); **Thread N *T2*** cyber-antibody; **Thread O *ID4*** unity NSA flagship; **Thread P *Stargate*** CIA/globalist contrast; **Thread G** hot-war franchise containment / forced-labor conveyor.
- Series order: [Not Like This](https://paradigmthreat2.substack.com/p/not-like-this) (Matrix I) → [Everything Burns](https://paradigmthreat2.substack.com/p/everything-burns) (Pacific II) → **ID4** (unity III).

![Declare Independence — Whitmore hangar speech as real declaration](https://paradigmthreat.net/influence/hollywood/declare-independence.png)

### Events — JFK hoax pass

- [JFK & RFK staged assassination hoax investigation](https://paradigmthreat.net/events/jfk/investigations/jfk-rfk-staged-assassination-hoax-investigation) — **§2.5–§2.7** added: assassination-pattern synthesis, author endgame, extended PP / containment cross-reads (790+ lines total).

### Index and search hygiene

- **`index.json`** — Substack **original publish dates** on flagged articles; **search body snippets removed** from index (snippets still generated at search time on site); cache version bumps for ECW/TONA consumers.

### Discovery hub

- [Front page](https://paradigmthreat.net) — **Research MCP** callout with link to [/mcp](https://old.paradigmthreat.net/mcp); **host restriction** note (free-tier tool blocks).

---

## paradigm-threat-timeline

- [**Dead Planet Protocol**](https://timeline.paradigmthreat.net/timeline/evt-mars-surface-dismantling-dead-planet-protocol) — new timeline event; Mars surface dismantling window, Mariner seal, cross-link Mars/CERN arc from Part A portal essay.

---

## paradigm-threat-site — Research MCP deployment and UX

The site repo shipped **Research MCP** as the headline infra pass, plus search and share polish.

### Research MCP (deployed)

- **`POST /api/mcp`** — Streamable HTTP MCP server (`lib/mcp/createServer.ts`, `serverHandlers.ts`, `relayFetch.ts`, `researchEnvelope.ts`).
- **`GET /api/mcp?health=1`** — health JSON for monitors.
- **`/mcp` page** — public setup: endpoint URL, tool list, Cursor JSON snippet, ChatGPT Apps steps, host-restriction warning.
- **`MCP_SERVER_ENABLED=1`** — production env gate (see `docs/MCP_VERCEL_DEPLOY.md`).
- **`submit_investigation_idea` MCP tool** — wires agent proposals to same Postgres pipeline as `/submit` form.
- **`npm run validate:mcp`** — smoke test against local or production URL.

### Search, changelog, share (same window)

- **Keyword-only search** refinement; **changelog publish dates** on hub tabs.
- **Editable share copy** in Copy & Share modal; **AI share caption rewrite** with progress bar (prior commit window, still live).
- **Relay markdown download** link in share modal.
- **Substack URLs preferred** in outbound shares.
- Local **`.env` defaults** — server relay SSR fetch disabled for dev ergonomics.

**User-visible story:** a researcher can stay in **ChatGPT or Cursor**, attach the Paradigm Threat MCP, and pull **the same investigations** the site publishes — with explicit **not in corpus** when the index has no coverage. That is the machine-readable layer [The Internet That Should Have Been](https://paradigmthreat2.substack.com/p/the-internet-that-should-have-been) asked for — shipped for **agents**, not only for Chrome's vendor AI.

---

## Reading order

1. **Research MCP:** [/mcp setup](https://old.paradigmthreat.net/mcp) → connect in Cursor or ChatGPT → try `search_site` + `research_status` on a topic you care about → `read_article` on hit → check primary citations in dossier.
2. **Portal trilogy:** [Out of This Door](https://paradigmthreat2.substack.com/p/out-of-this-door-might-come-something) → [Philadelphia Part B](https://paradigmthreat2.substack.com/p/the-philadelphia-experiment-was-not) → [earth-portal timeline art](https://paradigmthreat.net/events/philadelphia/earth-portal-projects-timeline.png) → [CERN–Mars investigation](https://paradigmthreat.net/science/cern_portal/investigations/cern-mars-quantum-gateway-investigation) → [Dead Planet timeline event](https://timeline.paradigmthreat.net/timeline/evt-mars-surface-dismantling-dead-planet-protocol).
3. **Hollywood PP series:** [Not Like This](https://paradigmthreat2.substack.com/p/not-like-this) → [Everything Burns](https://paradigmthreat2.substack.com/p/everything-burns) → [Everything in Independence Day Is True](https://paradigmthreat2.substack.com/p/everything-in-independence-day-is) → [two-camp investigation Thread O/P](https://paradigmthreat.net/influence/hollywood/investigations/hollywood-two-camp-war-investigation).
4. **Wells misread:** [Philadelphia Part B § Wells](https://paradigmthreat2.substack.com/p/the-philadelphia-experiment-was-not) → [time-travel literature deposit investigation](https://paradigmthreat.net/influence/predictive_programming/investigations/time-travel-literature-wells-deposit-investigation).
5. **JFK hoax:** [JFK/RFK investigation §2.1–§2.7](https://paradigmthreat.net/events/jfk/investigations/jfk-rfk-staged-assassination-hoax-investigation) → [JFK Was Never Assassinated](https://paradigmthreat2.substack.com/p/jfk-was-never-assassinated).

---

## Image gallery — assets committed in this window (2026-07-03 → 2026-07-09)

Raster files **first added** after **2026-07-03** through **2026-07-09** (exclusive windows — each image appears in **one** blog entry only). Heroes placed inline above; remainder below.

![Ancient stargates — suppressed gateways infographic (`ancient-stargates.png`)](https://paradigmthreat.net/science/cern_portal/ancient-stargates.png)

![CERN LHC — documented layout + portal architecture read (Earth)](https://paradigmthreat.net/science/cern_portal/cern-layout.png)

![stargate cave aztec sun stone disc](https://paradigmthreat.net/science/cern_portal/stargate-cave-aztec-sun-stone-disc.jpeg)

![stargate mechanical dual ring prototype](https://paradigmthreat.net/science/cern_portal/stargate-mechanical-dual-ring-prototype.jpeg)

![stargate modern circuit ring display](https://paradigmthreat.net/science/cern_portal/stargate-modern-circuit-ring-display.jpeg)

![stargate ornate carved arch cave](https://paradigmthreat.net/science/cern_portal/stargate-ornate-carved-arch-cave.jpeg)

![stargate rock wall carved disk door](https://paradigmthreat.net/science/cern_portal/stargate-rock-wall-carved-disk-door.jpeg)

![stargate underwater scuba ring](https://paradigmthreat.net/science/cern_portal/stargate-underwater-scuba-ring.jpeg)

![stargate vintage arctic ring tripod](https://paradigmthreat.net/science/cern_portal/stargate-vintage-arctic-ring-tripod.jpeg)

![stargate vintage arctic snow soldier](https://paradigmthreat.net/science/cern_portal/stargate-vintage-arctic-snow-soldier.jpeg)

![stargate vintage arctic winter expedition](https://paradigmthreat.net/science/cern_portal/stargate-vintage-arctic-winter-expedition.jpeg)

![stargate vintage barren ornate ring two men](https://paradigmthreat.net/science/cern_portal/stargate-vintage-barren-ornate-ring-two-men.jpeg)

![stargate vintage canyon cloaked gathering](https://paradigmthreat.net/science/cern_portal/stargate-vintage-canyon-cloaked-gathering.jpeg)

![stargate vintage cave excavation fedora](https://paradigmthreat.net/science/cern_portal/stargate-vintage-cave-excavation-fedora.jpeg)

![stargate vintage cave ring square glyphs](https://paradigmthreat.net/science/cern_portal/stargate-vintage-cave-ring-square-glyphs.jpeg)

![stargate vintage cave ring two men suits](https://paradigmthreat.net/science/cern_portal/stargate-vintage-cave-ring-two-men-suits.jpeg)

![stargate vintage cave spoke wheel turbans](https://paradigmthreat.net/science/cern_portal/stargate-vintage-cave-spoke-wheel-turbans.jpeg)

![stargate vintage cliff stone wheel](https://paradigmthreat.net/science/cern_portal/stargate-vintage-cliff-stone-wheel.jpeg)

![stargate vintage desert mountain ring](https://paradigmthreat.net/science/cern_portal/stargate-vintage-desert-mountain-ring.jpeg)

![stargate vintage himalaya dharma wheel](https://paradigmthreat.net/science/cern_portal/stargate-vintage-himalaya-dharma-wheel.jpeg)

![stargate vintage jungle dharma wheel](https://paradigmthreat.net/science/cern_portal/stargate-vintage-jungle-dharma-wheel.jpeg)

![stargate vintage jungle pith helmet ring](https://paradigmthreat.net/science/cern_portal/stargate-vintage-jungle-pith-helmet-ring.jpeg)

![stargate vintage mountain carved disc five men](https://paradigmthreat.net/science/cern_portal/stargate-vintage-mountain-carved-disc-five-men.jpeg)

![stargate vintage mountain stone circle](https://paradigmthreat.net/science/cern_portal/stargate-vintage-mountain-stone-circle.jpeg)

![stargate vintage pith helmet rock arch](https://paradigmthreat.net/science/cern_portal/stargate-vintage-pith-helmet-rock-arch.jpeg)

![stargate vintage rockface military expedition](https://paradigmthreat.net/science/cern_portal/stargate-vintage-rockface-military-expedition.jpeg)

![stargate vintage stone arch misty portal](https://paradigmthreat.net/science/cern_portal/stargate-vintage-stone-arch-misty-portal.jpeg)

![stargate vintage stone disk three observers](https://paradigmthreat.net/science/cern_portal/stargate-vintage-stone-disk-three-observers.jpeg)

![stargate vintage ww2 excavation aztec ring](https://paradigmthreat.net/science/cern_portal/stargate-vintage-ww2-excavation-aztec-ring.jpeg)

![Ancient stargates — suppressed gateways infographic (`ancient-stargates.png`)](https://paradigmthreat.net/history/chronology/ancient-stargates/ancient-stargates.png)

![The real declaration of independence — Whitmore on Rushmore, *we will not go quietly into the night*](https://paradigmthreat.net/influence/hollywood/the-real-declaration.png)

## Publication notes

- Three Substack flagships since July 3; portal Part A published July 4, Philadelphia Part B July 6, ID4 July 8 — all mirrored on-site with hero art.
- **Research MCP** live on production when `MCP_SERVER_ENABLED=1`; announce on [front page](https://paradigmthreat.net) and [/mcp](https://old.paradigmthreat.net/mcp).
- **ID4** slug finalized as `everything-in-independence-day-is-true` (renamed from `declare-independence`).
- **Ancient stargates** corpus consolidated under `history/chronology/ancient-stargates/`.
- Site repo MCP implementation: `app/api/mcp/route.ts`, `lib/mcp/*`, `docs/MCP_VERCEL_DEPLOY.md`.
- `index.json` / changelog regenerate on commit via pre-commit hook.

---

*Topics:* [#science](https://paradigmthreat.net/search/science) · [#computing](https://paradigmthreat.net/search/computing) · [#cern_portal](https://paradigmthreat.net/search/cern_portal) · [#events](https://paradigmthreat.net/search/events) · [#hollywood](https://paradigmthreat.net/search/hollywood) · [#predictive_programming](https://paradigmthreat.net/search/predictive_programming) · [#cosmos](https://paradigmthreat.net/search/cosmos) · [#mars](https://paradigmthreat.net/search/mars) · [#history](https://paradigmthreat.net/search/history) · [#false_flag](https://paradigmthreat.net/search/false_flag)

**Last updated:** 2026-07-09T11:30:00-04:00

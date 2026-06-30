# Investigation: The Internet That Should Have Been — Machine-Readable Web, Wrong Turns, and the AI Gate

> **TL;DR:** Master citation dossier for the flagship essay [*The Internet That Should Have Been*](/science/computing/the-internet-that-should-have-been.md). **Documented:** Wintel lock-in, Nintendo CD-ROM containment, GPU→crypto→AI hardware treadmill, enclosure via Facebook/React, WebMCP as **agent-first** browser API (Feb 2026), Chrome **~4 GB Gemini Nano** push, **Android developer verification** (phased from Sept 2026 — §10.6), court AI-hallucination crisis, Berners-Lee **devastated** by web outcome. **Author thesis:** machine-readable intent (“open the hood”) should have shipped **in the 1990s without AI**; the web we got is a **TV channel**; forward fixes must **bridge the present** under protest. **Education lane moved** → [Responsibility to the Next Generation — investigation](/history/chronology/investigations/responsibility-to-the-next-generation-investigation.md). **Terminator PP:** Moore-schedule read, T3 virus ↔ Nano — **speculative** (§11.4). **Suppression motive:** alleged, unproven.

**Last updated:** 2026-06-23 (§10.6 Android pocket enclosure)  
**Status:** Open — companion to reader essay; WebMCP chapter retained from prior dossier (`webmcp-suppressed-protocol-ai-gatekeeper-investigation.md` renamed).

**Guide (read order)**

0. **Reader essay (narrative)** → [The Internet That Should Have Been](/science/computing/the-internet-that-should-have-been.md)  
1. **WebMCP documented layer** → §1  
2. **Author counterfactual thesis** → §2  
3. **External voices survey** → §3  
4. **Historical parallels (OLE → WebMCP)** → §4  
5. **Car-hood analogy** → §5  
6. **Tension table** → §6  
7. **Open claims registry** → §7  
8. **Education dossier (moved)** → [Responsibility investigation](/history/chronology/investigations/responsibility-to-the-next-generation-investigation.md)  
9. **Hardware / platform dossier** → §9 (incl. **Gates / DOS cliff** §9.6)  
10. **Enclosure dossier** (mesh, Semantic Web, social, React) → §10  
11. **AI gate dossier** (courts, hijack, Taiwan/Huawei) → §11  
12. **Pragmatic adoption under protest** → §12  
13. **Cross-references** → §13  
14. **Research hooks & falsifiers** → §14  

---

## 1. What WebMCP is (documented layer)

**Tier:** W3C Web Machine Learning Community Group draft, Chrome developer docs, vendor blog posts — useful for **wording**, not endorsement of every claim.

| Theme | Documented summary (mid-2026) |
|--------|-------------------------------|
| **Name** | **Web Model Context Protocol (WebMCP)** — **not** Anthropic’s MCP wire protocol; borrows the **tool** abstraction (name, description, JSON Schema, `execute`) only. |
| **API** | `navigator.modelContext` — imperative `registerTool()` + declarative HTML form attributes (`toolname`, `tooldescription`, …). |
| **Runtime** | Tools run **in the open tab’s JavaScript**; inherit cookies/session; **no** separate OAuth server required for many flows. |
| **Consumer** | **Browser agents** (Gemini in Chrome sidebar, future Chromium agents) are the **primary** designed consumer; cross-origin iframe agents are a **later** demand-driven extension. |
| **Spec status** | Draft Community Group Report (published **10 Feb 2026**); **not** on the W3C Standards Track. Editors: Google + Microsoft engineers. |
| **Chrome shipping** | Dev preview **Chrome 146** behind `chrome://flags/#enable-webmcp-testing`; **origin trial Chrome 149–156** (production domains, no user flag); stable default shipping projected **late 2026**. |
| **Explicit limits** | **Headless** tool calls **out of scope**; tab/webview must be open; tool discoverability **unsolved** (agents must visit the site). |

**Representative external links:**

- [WebMCP — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp)  
- [W3C CG proposal / explainer](https://github.com/webmachinelearning/webmcp)  
- [Blink “Intent to Experiment” (M149–M156 OT)](https://groups.google.com/a/chromium.org/g/blink-dev/c/gmYffo5WOE8/m/OJxuQRP3AAAJ)  
- [Starborn: *WebMCP Is Not an MCP Server*](https://starborn.github.io/webmcp/WebMCnotMCP.md)  
- [Starborn: *How a Browser Hack Became a Proposed Web Standard*](https://starborn.github.io/webmcp/browserhack.md)  

**Documented origin story (condensed):** Alex Nahas (Amazon → MCP-B polyfill) worked on browser-side tool exposure; W3C group **declined** to port full MCP JSON-RPC to the browser; Google/Microsoft co-authored a **new** browser API. Anthropic MCP (Nov 2024) is a **backend** protocol; WebMCP is a **frontend** API — complementary in vendor messaging, **coupled in practice** to the agentic-browser moment.

### 1.1 Chrome’s ~4 GB on-device model — hardware and consent controversy

Separate from WebMCP’s JavaScript surface, Chrome has been installing **Gemini Nano** weights (`weights.bin`, ~**4 GB**, folder `OptGuideOnDeviceModel`) on eligible desktops — often **without a clear upfront consent prompt**, with **re-download after manual deletion** if AI features stay enabled.

| Source | Claim (documented) |
|--------|-------------------|
| [The Verge, May 2026](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features) | Large on-device model for scam detection, writing help, Prompt API; toggle under Settings → System → On-device AI (Feb 2026 rollout). |
| [That Privacy Guy / Alexander Hanff](https://www.thatprivacyguy.com/blog/chrome-silent-nano-install) | Forensic write-up; alleges ePrivacy/GDPR exposure; estimates **climate cost** at billion-device scale. |
| [Gizmodo](https://gizmodo.com/google-chrome-is-downloading-a-4gb-ai-model-onto-your-device-without-consent-researcher-warns-2000755201) | “Without consent” framing; Google docs acknowledge on-device models for AI features. |

**Unpack for this dossier:** WebMCP **can** work with **remote** models (demos use API models), but Chrome’s **bundle strategy** ties the **agentic web** moment to **local GPU/CPU/storage pressure** — relevant to the author’s “aggressive rollout” complaint even when WebMCP itself is “just” structured JS.

### 1.2 Browser positions — not “never,” but resistance and delay

| Browser / body | Position (Jun 2026) |
|----------------|---------------------|
| **Chrome** | Reference implementation; origin trial; Prompt API can call WebMCP tools with on-device models. |
| **Edge** | Co-editor of spec; Chromium inheritance expected; **not** confirmed in official Edge 147 release notes (secondary blogs overstate). |
| **Firefox** | W3C participation; **prototype** implementation tracked ([Bug 2018306](https://bugzilla.mozilla.org/show_bug.cgi?id=2018306)); **no** ship commitment. |
| **Safari / WebKit** | Standards-position thread; **👎 reactions**; substantive opposition from developers (see §3.2). |
| **Mozilla standards** | **Neutral** ([issue #1412](https://github.com/mozilla/standards-positions/issues/1412)): valuable abstraction **but** adversarial sites, prompt injection, misleading “MCP” name; wants WebExtension/WebDriver openness. |

**Unpack:** “Vowing never to support” is **stronger** than public record shows — but **cultural refusal** (anti-agentic web) and **slow/no commitment** from non-Chromium vendors are **documented**.

### 1.3 SEO / discovery shift — “agent-ready” as new optimization lane

Industry blogs frame WebMCP as **“SEO for agents”** — sites that expose clean tools may be **preferred** by browser agents over DOM-scraping competitors ([e.g. LinkedIn discourse, Semrush, No Hacks](https://nohacks.co/blog/what-is-webmcp)). John Mueller (Google) reportedly steered developers from **llms.txt** toward WebMCP (June 2026 blog summaries).

**Documented tension:** Search engines historically ranked **scraped HTML**; a **machine-intent layer** would have changed discovery **if** it had been universal and **crawler-accessible**. Today’s design centers **in-tab agents**, not a **public archive of structured site capabilities**.

### 1.4 Misleading “MCP” label — documented criticism

**Tier:** Standards participants, Chrome developer docs, independent technical notes, industry explainers — **documented naming dispute**, not author invention.

| Criticism | Documented basis |
|-----------|------------------|
| **Not Anthropic MCP on the wire** | WebMCP is **not** an implementation of Anthropic’s **Model Context Protocol** — **no JSON-RPC**, **no MCP server** in the tab ([Starborn *WebMCP Is Not an MCP Server*](https://starborn.github.io/webmcp/WebMCnotMCP.md); [VentureBeat Feb 2026](https://venturebeat.com/infrastructure/google-chrome-ships-webmcp-in-early-preview-turning-every-website-into-a)). |
| **“MCP-inspired,” not MCP** | Chrome’s own docs: consider WebMCP **“MCP-inspired” APIs**, not a direct JS port — borrows **tool** abstraction (name, description, schema, execute); **omits** server-side MCP concepts such as **resources** ([Chrome *Compare MCP and WebMCP*](https://developer.chrome.com/docs/ai/webmcp/compare-mcp)). |
| **Different layer, lifecycle, discovery** | **MCP:** persistent backend servers, global connectivity, headless agent flows. **WebMCP:** **tab-bound**, ephemeral, DOM/session-aware, tools registered **during the visit** — browser is the intermediary ([Chrome compare table](https://developer.chrome.com/docs/ai/webmcp/compare-mcp); [Lawrence Hitches disambiguation](https://www.lawrencehitches.com/anthropic-mcp-vs-webmcp/)). |
| **W3C declined full MCP port** | Working group **chose not** to couple tightly to Anthropic’s spec; early implementers (e.g. Alex Nahas) pushed porting MCP to the browser; result is a **new browser API** that shares mental model only ([Tandem *WebMCP vs MCP*](https://usetandem.ai/blog/webmcp-vs-mcp-difference) citing [Arcade/Nahas interview](https://www.arcade.dev/blog/web-mcp-alex-nahas-interview)). |
| **Name breeds wrong assumptions** | Developers may expect **protocol-level compatibility** with MCP servers/SDKs; standards reviewers may treat security/privacy as **inherited from MCP** when WebMCP needs its **own** threat model ([Starborn](https://starborn.github.io/webmcp/WebMCnotMCP.md) — press/README often drop spec’s “**can be thought of as**” qualifier). |
| **Mozilla standards position** | **Neutral** on ship, but flags **misleading “MCP” name** alongside adversarial-site and prompt-injection risks ([#1412](https://github.com/mozilla/standards-positions/issues/1412)). |

**Unpack:** Vendors frame the pair as **complementary** (backend MCP + in-tab WebMCP). Critics say the **shared acronym** caused immediate **category error** — “**Will WebMCP replace MCP?**” (Chrome FAQ) — when the answer is **different problems, different specs**. Rhymes with essay thesis: the industry shipped **tool menus for agents** under a name that **sounds** like the ecosystem protocol developers already know.

---

## 2. Author’s originating thesis (sentiment captured **exactly**)

The following is the **author-supplied** position for **Paradigm Threat**. It is **first-class** in this dossier as **pattern language** and **research seed**; **deliberate suppression** and **counterfactual history** are **not** treated as **established fact** without primary evidence.

> The real issue is that the WebMCP protocol **probably should have been implemented a very long time ago**, **independently of any kind of AI solution**. MCP should have evolved **much further down the road** — when hardware and data centers were abundant — not **held up** until a browser could **run AI locally**. There was **no reason** for WebMCP to wait for on-device LLMs.
>
> The **MCP protocol itself** should have come out **independently of AI**, and should have been **standard and common** a long time ago — **probably even in the 90s**, when Windows, Apple, and others could have standardized a **common web protocol** to go **beyond viewing and interacting with UI** — **opening the hood** like a car: seeing **what procedures work**, **what parameters are**, **what the response is**, **before** it gets parsed by AI.
>
> In that counterfactual, the internet would be **night-and-day different** — not a **TV channel** (non-interactive, obfuscated source). **SEO** would judge **data availability and MCP quality**, not opaque link graphs on scraped HTML. **Walled gardens** might have been **impossible**; **programming simplified**; apps **decoupled** from OS silos.
>
> **Information control** would have been **impossible** at today’s scale: if crawlers pulled **structured capability + data**, we would have **archives of the data itself** — a **shared world brain**, curated — instead of waiting for **AI to get it first** while **humans** must learn **API/MCP** themselves (and **no one teaches humans**, only developers wiring **AI → MCP**).
>
> **Industry knew** they could **never** release such a thing earlier, because it would have **revolutionized software** and **broken** real-time algorithmic **show/hide** control by demographics. WebMCP’s **current** rollout is the **same capability**, **late**, **AI-gated** — a **sealed hood** unlockable only by the **company technician** (the browser’s agent), not the owner.

**Unpack (assistant, non-replacement for author words):**

- **Two-layer claim:** (A) **Technical** — structured introspection is **old idea**, **new packaging**. (B) **Motivational** — **delay** served **platform lock-in** and **information gatekeeping**; **AI** is the **excuse** for finally shipping it **to agents**, not **to people**.
- **Epistemic split:** (A) is **partially supported** by §4 history (OLE, Semantic Web, WSDL). (B) requires **primary** evidence of **intent** (internal strategy memos, coordinated withholding) — **not** assembled here.

### 2.1 Author extension — Chrome 4GB as aggressive assumption

> Google Chrome’s **~4 GB** download assumes users accept **GPU/CPU spin-up**, **disk use**, and **power draw** to enable features they did not ask for — part of the same **agentic** push as WebMCP.

**Tier:** Consent/storage controversy is **documented** (§1.1). **Intent** to “assume users don’t mind” is **author interpretation** of product strategy.

---

## 3. External voices survey — who agrees, partially agrees, or opposes

**Method:** Web search + standards threads + Hacker News (June 2026). **Finding:** **No** prominent essay located that states the author’s full thesis (**90s independent protocol + deliberate suppression for information control + car hood**). Below: **closest public rhymes**.

### 3.1 “This is Semantic Web again” / “should have used RDF”

| Voice | Position |
|-------|----------|
| [Hacker News commenter](https://news.ycombinator.com/item?id=47216003) | WebMCP vs Semantic Web (Schema, RDF, OWL): “**instead of reinventing**…” — data-reading vs interaction distinction noted in thread. |
| [AI in Blog (Sep 2025)](https://www.aiinblog.com/2025/09/why-webmcp-is-future-of-ai-and-web.html) | “webMCP could **finally achieve what the Semantic Web envisioned**… through a **practical, incremental** approach” — **explicit** déjà vu, **AI-framed**. |
| [Semantic Web historiography](https://en.wikipedia.org/wiki/Semantic_Web) | Berners-Lee discussed machine-processable web **1994**; 2001 *Scientific American* article; **2006** admission: vision “**largely unrealized**.” |

**Gap vs author:** These sources **rhyme** on **late machine-readable layer**; they **do not** allege **deliberate shelving** for **information control**, nor **“humans first, AI later”** moral ordering.

### 3.2 Anti-agentic browser API — ethical refusal, not hood metaphor

| Voice | Position |
|-------|----------|
| [@jaredcwhite, WebKit standards #649](https://github.com/webkit/standards-positions/issues/649) | Won’t use browsers with “**agentic APIs**”; Google/Microsoft “**shoehorn**” LLM tech into “**the one place we have refuge**… traditional web browser”; genAI backlash is **political/moral**. |
| [Mozilla #1412 (bvandersloot)](https://github.com/mozilla/standards-positions/issues/1412) | **Neutral**; warns malicious sites can **tar-pit** agents, **prompt-inject** via tool responses; name “MCP” is **misleading**. |
| [Starborn technical notes](https://starborn.github.io/webmcp/whatotest.md) | Security: prompt injection, scope creep if **human-in-the-loop** weakens; “**good idea implemented badly**… embedded in the platform for decades.” |

**Gap vs author:** Opponents attack **AI in the browser**, not **“why didn’t we get neutral introspection for humans/crawlers in 1995?”**

### 3.3 Incentive skepticism — sites won’t open the hood

| Voice | Position |
|-------|----------|
| [HN user “47216304”](https://news.ycombinator.com/item?id=47216003) | WebMCP will fail like Semantic Web and **public APIs**: “**no one wants** to put in the effort to make their website readable by machines, as that only benefits the **competition** and is immediately exploited by **bad actors**.” |
| [Pete Lacey, InfoQ (2006)](https://www.infoq.com/articles/pete-lacey-ws-criticism/) | On WSDL: developers can **read documentation**; machine-readable IDL is **nice for IDE tricks**, “**far cry from absolutely essential**” — **anti-mandate**, not pro-suppression. |

**Rhyme with author:** Explains **non-adoption** without conspiracy — **voluntary** withholding because **open hood** helps **rivals and scrapers**.

### 3.4 Pro-WebMCP industry — AI-first, gatekeeper browser

| Voice | Position |
|-------|----------|
| [Chrome Developers](https://developer.chrome.com/docs/ai/webmcp) | “Bridge gap between web applications and **agents**”; tools execute **visibly** for user trust. |
| [No Hacks / Semrush / LogRocket](https://blog.logrocket.com/google-web-mcp/) | “Web was built for **humans**”; WebMCP adds **parallel layer for machines**; **browser acts as gatekeeper** for sensitive actions. |
| [RxDB blog](https://rxdb.info/webmcp.html) | “**Bypass bot protection**” — sanctioned front door vs scraping; **agents** get schema-bound tools. |

**Tension with author:** These celebrate **AI-agent** access, **not** a **universal human-readable capability archive**.

### 3.5 Intent-native API research (parallel, still AI-era)

| Voice | Position |
|-------|----------|
| [Chris Hood — AGIS / AGTP drafts](https://chrishood.com/ai-agents-need-a-new-api/) | “**REST is noun-based**”; agents need **intent methods** (BOOK, FIND, …); **IETF drafts** for agent protocols — **2020s**, **AI-motivated**, not 1990s open-web human tooling. |
| [GraphQL AI WG — semantic introspection RFC](https://github.com/graphql/ai-wg/blob/main/rfcs/semantic-introspection.md) | `__search` over schema capabilities for **LLM agents** — **introspection extended for AI**, not retroactive web standard. |

### 3.6 Survey conclusion — originality map

| Author claim | Found in public discourse? |
|--------------|----------------------------|
| Structured site/app intent should exist **without AI** | **Partial** — Semantic Web, OLE, WSDL, OpenAPI historiography |
| Should have been **universal in the 90s** | **Rare** as explicit claim; **implicit** in “why didn’t Semantic Web win?” |
| **Deliberate suppression** to preserve **information control** / walled gardens | **Not found** in technical press; **adjacent** in **author’s** site lanes ([AI control](/science/ai/ai-control-investigation.md), [censorship](/influence/censorship/)) |
| **Car hood sealed** — only **company technician** (agent) opens it | **Not found** (June 2026 search) — treat as **author-original metaphor** |
| WebMCP rollout **wrong order** (protocol before AI) | **Not found** verbatim; **closest** is anti-agentic **ethics**, not **counterfactual systems design** |

---

## 4. Historical parallels — machine-readable “hood” without LLMs

These technologies show the **idea** of opening the hood **existed**; **none** became a **neutral, universal web layer** accessible to **humans, crawlers, and rivals** alike.

| Era | Mechanism | What it exposed | Why it didn’t become “the web” |
|-----|-----------|-----------------|-------------------------------|
| **1993+** | **OLE Automation / COM** + type libraries | Methods, properties, `IDispatch` — **scriptable object model** for Windows apps | **Platform-locked** (Windows); not web; optional metadata |
| **1990s** | **CORBA IDL** | Cross-language **interface contracts** | Heavy; vendor wars; web routed around via HTTP/HTML |
| **2000s** | **WSDL + SOAP** | Machine-readable **service endpoints** | Complexity,interop pain; **Tim Bray**: “**Sowa’s Law**” — official standard → simpler de facto wins |
| **2001+** | **Semantic Web** (RDF, OWL, SPARQL) | **Machine-readable meaning** on pages | Chicken-and-egg; authoring cost; [“What happened to the Semantic Web?”](http://ht.acm.org/ht2017/images/MikaPeterACM%20Hypertext%202017-WhatHappenedSemanticWeb.pdf) |
| **2010s** | **Schema.org**, JSON-LD | Partial **structured data** for search | **Centralized** vocab; limited action/intent surface |
| **2010s+** | **OpenAPI / Swagger** | HTTP API **schemas** | **Backend** contracts; not live **in-browser session** tools |
| **2024** | **Anthropic MCP** | Tool + resource server for **AI clients** | **AI-ecosystem** standard; not browser-native |
| **2026** | **WebMCP** | **In-tab tools** for **agents** | Coupled to **agentic browser** moment; headless/crawler lane **explicitly out of scope** |

**Documented lesson (neutral):** The web **won** as **human-readable hypertext** + **ad hoc APIs**, not as **mandatory introspectable object models**. **Author read:** that “victory” was also a **control victory** — see §2.

---

## 5. The car-hood analogy

### 5.1 Author formulation (canonical for this dossier)

| Car | Software / web (author mapping) |
|-----|----------------------------------|
| **Sealed hood** | Minified JS, hidden APIs, ToS-forbidden scraping, opaque server logic |
| **Owner cannot inspect engine** | User sees UI only; **View Source** ≠ **behavior contract** |
| **Only dealership technician** | **Browser vendor’s AI agent** may call `registerTool` endpoints; **owner** has no general **tool inspector** UI |
| **Remote unlock** | Cloud model + origin trial + **Prompt API** path — capability enabled when **vendor** ships agent |

### 5.2 Nearest public rhymes (not equivalent)

- **“Gatekeeper”** — [Navoto WebMCP guide](https://navoto.com/blog/webmcp-guide/): browser **restricts** which registered tools agents may call (user confirm). **Pro-security** framing; author framing is **anti-monopoly**.
- **“Front door vs scraping”** — [RxDB](https://rxdb.info/webmcp.html): sanctioned agent entry vs brittle automation. **Author inversion:** the **public** should have had the **front door**; instead agents get **VIP lane**.
- **“Dual-mode UI”** — industry term: React for humans, WebMCP for assistants. **Author:** humans deserved **mode 0** — **structured transparency** — decades ago.

**Search note (2026-06-18):** No indexed essay located pairing **automotive sealed hood** with WebMCP/MCP. If readers find one, add to §14.4 TODO.

---

## 6. Tension table — counterfactual open web vs WebMCP-as-shipped

| Dimension | Author counterfactual (§2) | WebMCP as documented (§1) |
|-----------|---------------------------|-----------------------------|
| **Primary user** | **Human investigators**, archivists, developers, **crawlers** | **In-browser AI agents** (vendor-first) |
| **Timing** | **1990s** neutral protocol | **2026**, alongside **Gemini Nano** / agent browsers |
| **Discoverability** | Global **capability index** / archives | **Per-site** visit; **no** standard manifest crawl |
| **Headless access** | **Required** for archives & science | **Explicitly out of scope** |
| **SEO / ranking** | Quality of **declared data & tools** | **Agent preference** + traditional HTML SEO |
| **Hardware tax** | **Low** (schema + endpoints) | Bundled with **multi-GB** local models (Chrome) |
| **Walled gardens** | **Weakened** by portable intents | **May strengthen** (agent chooses tool-rich sites inside **Chrome agent**) |
| **Who learns the API** | **Everyone** (literacy) | **Developers** wiring **agents**; [site ships WebMCP behind flag](/paradigm-threat-site/docs/WEBMCP_INTEGRATION.md) for **Gemini** workflows |

---

## 7. Open claims registry

1. **Independent-of-AI:** Core introspection protocol should **not** have waited for LLMs.  
2. **90s inflection:** Windows/Apple/web consortia **could have** standardized machine intent when industry influence peaked.  
3. **TV-channel web:** Dominant UX is **non-inspectable consumption**, not **negotiable procedure**.  
4. **SEO counterfactual:** Rankings would track **structured capability quality**, not opaque HTML graphs.  
5. **World brain missed:** Crawlers would have archived **data + intent**, not merely pages.  
6. **AI-first injustice:** Humans **last** in line; **teaching** targets **devs → agents**, not **public tool literacy**.  
7. **Suppression motive:** Universal hood-opening **threatened OS coupling**, walled gardens, and **real-time information control** (**intent** — unproven).  
8. **Sealed-hood metaphor:** Vendor agent as **only** authorized technician (**author-original** phrasing).  
9. **Chrome 4GB:** Local model push is **aggressive** resource assumption tied to agentic stack (**partially documented**).  
10. **WebMCP timing:** Right **capability**, **wrong** **century** and **wrong** **principal** (agents not citizens).  
11. **Wintel bottleneck:** IBM outsourced DOS; Microsoft/Intel captured standards ([HBS 19-074](https://www.hbs.edu/ris/download.aspx?name=19-074.pdf)).  
12. **Nintendo CD:** Load-time excuse cost FF7 and third-party RPG dominance ([Nintendo Life 2025](https://www.nintendolife.com/news/2025/02/not-even-squaresoft-could-convince-nintendo-to-use-discs-for-the-n64)).  
13. **3D containment:** 2D craft starved as platform genres froze ([quantum-leap-of-faith](/science/computing/quantum-leap-of-faith.md)).  
14. **GPU treadmill:** Gaming silicon repurposed crypto → AI ([Nvidia class action 2026](https://www.law.com/therecorder/2026/03/26/california-judge-certifies-investor-class-in-nvidia-crypto-mining-lawsuit/)).  
15. **Mesh utility counterfactual:** Internet as **street-level public utility** with neighborhood cache — **author design fiction**; Baran proposed utility ([Ars Technica](https://arstechnica.com/tech-policy/2011/02/how-the-atom-bomb-gave-birth-to-the-internet/)).  
16. **Facebook enclosure:** MySpace→Facebook as monopolization arc ([Parker TechCrunch 2011](https://techcrunch.com/2011/06/28/sean-parker-on-why-myspace-lost-to-facebook/)).  
17. **TBL devastated:** Mesh intent vs corporate/algorithmic web — **documented** inventor regret (§10.1.1).  
18. **Starship Troopers feed PP:** Federal Net = **TV channel + nav buttons**; civic software utility **out of frame** — prefigured 1997 (§10.2.1).  
19. **Education ethics-first:** Moved to [Responsibility investigation §7](/history/chronology/investigations/responsibility-to-the-next-generation-investigation.md) (Installment II).  
20. **Lab / 1-on-1 / literacy QA:** Same — education spinoff 2026-06-19.  
21. **Pragmatic adoption:** Use distrusted tools; **bridge present**; **no collapse without catch nets** (§12).  
22. **Terminator PP schedule:** 2029 future-war date + Moore cadence imply **scripted timeline** — **speculative** (§11.4).  
23. **T3 virus ↔ Nano:** Civilian desktop distribution beat **landing** — author parallel (§11.4.4).  
24. **IBM/chip wars tension:** Wintel + furnace economics keep **schedule solid** — **speculative** (§11.4.5).  
25. **Terminator finale foiled:** 2029 reset spectacle **failed**; middle beats **landing** (§11.4.6).  
26. **Taiwan chokepoint:** Advanced fabs concentrated; conflict risk ([microchips investigation](/science/microchips/microchips-shrinking-technology-investigation.md)).  
27. **Huawei ban backfire:** Export controls accelerated indigenous chips ([ITIF 2025](https://itif.org/publications/2025/10/27/backfire-export-controls-helped-huawei-and-hurt-us-firms/)).  
28. **DOS cliff:** IBM non-exclusive DOS license let Microsoft **own/resell** standard clone makers used (§9.6).  
29. **IBM non-exclusive rationale (documented):** Litigation fear, Project Chess speed, Sams "Microsoft's problem" (§9.6.3).  
30. **Legal moat:** Antitrust liability affirmed, breakup denied, behavioral settlement; SCP/Caldera settled — dominance retained (§9.6.6).  
31. **Institutional DOS arrangement (author):** Powers beyond Gates may have wanted Wintel enclosure — **speculative** (§9.6.5).  
32. **Opaque reach (author):** Site barely seen; podcast bypass around algorithmic shadow-ban — **lived experience** (§10.5).  
33. **Layered-reality hijack (author):** Per-visitor substitution at URL — **speculative**; requires global monopolization thesis (§10.5).  
34. **WebMCP misleading label (documented):** Not Anthropic MCP wire protocol; “MCP-inspired” only — Mozilla, Chrome, Starborn (§1.4).  
35. **Android pocket enclosure (documented + author):** Developer verification on **certified Android** — phased **Sept 30, 2026** (four countries) → **2027+ global**; identity registry + **advanced sideload** friction; [Google absorb-enclose dossier](/science/computing/investigations/google-dont-be-evil-enclosure-investigation.md) (§10.6).

---

## 8. Education dossier — moved (2026-06-19)

Education lane **spun off** to education series **Installment II**.

| Artifact | Path |
|----------|------|
| **Reader essay** | [Responsibility to the Next Generation](https://paradigmthreat.net/history/chronology/responsibility-to-the-next-generation.md) |
| **Investigation** | [responsibility-to-the-next-generation-investigation.md](/history/chronology/investigations/responsibility-to-the-next-generation-investigation.md) |
| **Installment I** | [When your child won't fit the grade](https://paradigmthreat.net/history/chronology/when-your-child-wont-fit-the-grade.md) |

**Internet essay §V** retains a **brief bridge** (*Fantastic Planet*, rethink education, link to Installment II).

---

## 9. Hardware and platform dossier

### 9.1 IBM / Microsoft / Wintel

| Source | Documented claim |
|--------|------------------|
| [HBS case 19-074](https://www.hbs.edu/ris/download.aspx?name=19-074.pdf) | IBM lost **strategic bottleneck** (BIOS cloned); Microsoft/Intel became **joint sponsors** of Wintel; IBM “just another clonemaker” with highest overhead. |
| [Paul Carroll, *Big Blues*](https://vtda.org/books/Computing/BigBluesTheUnmakingIBM_PaulCarroll.pdf) | IBM **gridlock** in software; Microsoft seized PC standard from $75k DOS deal; executives saw problems coming but couldn’t adapt. |
| [EFF 2019](https://www.eff.org/deeplinks/2019/08/ibm-pc-compatible-how-adversarial-interoperability-saved-pcs-monopolization) | Phoenix reverse-engineered BIOS — **adversarial interoperability** prevented IBM monopoly on **hardware**; **did not** prevent API/OS lock-in. |

**Tension (§14.2):** EFF celebrates clone market; author thesis stresses **API imprisonment**. Both can be true: **hardware pluralism**, **software monoculture**.

### 9.2 Nintendo CD-ROM / 3D containment

| Source | Documented claim |
|--------|------------------|
| [Wikipedia: Nintendo 64](https://en.wikipedia.org/wiki/Nintendo_64) | Cartridges: fast load, anti-piracy; **storage limits** pushed Square/Enix to PlayStation. |
| [Nintendo Life / Yoshida 2025](https://www.nintendolife.com/news/2025/02/not-even-squaresoft-could-convince-nintendo-to-use-discs-for-the-n64) | Sakaguchi **begged** for CDs; Nintendo “**didn't believe in CD-ROM at all**”; FF7 needed **three PS1 discs**. |
| Repo: [nintendo-sony-breakup](/influence/stolen_credit/nintendo-sony-breakup.md) | SNES CD collapse → PlayStation; cartridge philosophy vs cinematic RPG storage. |
| [quantum-leap-of-faith](/science/computing/quantum-leap-of-faith.md) | N64 3D marketing **starved 2D**; platforms as **genre containers**, not organic evolution. |

### 9.3 Analog / vector / optical media

See [quantum-leap-of-faith](/science/computing/quantum-leap-of-faith.md) and [quantum storage investigation §2.3](/science/computing/investigations/quantum-computer-infinitely-indexed-storage-thesis-investigation.md). **Documented:** CD/DVD/Blu-ray are **physical analog channels** encoded as **binary streams**. **Author:** alternative path could have stored **native signal fields** — higher density, different industry economics.

### 9.4 GPU furnace → crypto → AI

| Source | Documented claim |
|--------|------------------|
| [Law.com Mar 2026](https://www.law.com/therecorder/2026/03/26/california-judge-certifies-investor-class-in-nvidia-crypto-mining-lawsuit/) | Class certified: Nvidia **understated** 2017–2018 gaming GPU sales to **crypto miners**; stock drops on disclosure. |
| [SEC settlement 2022](https://www.sec.gov/news/press-release/2022-103) | $5.5M penalty — inadequate disclosure of mining impact (cited in crypto press). |
| [Motley Fool 2025](https://www.fool.com/investing/2025/09/14/graphics-card-company-became-crypto-powerhouse/) | Gaming **&lt;10%** revenue; **datacenter AI ~88%**; GPU silicon grammar reused across booms. |

**Author read:** Industry **knew** thermal race was unsustainable; pivoted silicon to **next frenzy** (crypto, then AI) rather than **efficient rendering** paths (software rasterizers exist: [DFPSR](https://github.com/dawoodoz/dfpsr), [Shader Works](https://github.com/jackwthake/software-rasterizer) — niche, not mainstream).

### 9.5 Taiwan / Huawei

| Source | Documented claim |
|--------|------------------|
| [Foreign Policy Mar 2026](https://foreignpolicy.com/2026/03/09/artificial-intelligence-ai-sovereignty-taiwan-semiconductor-manufacturing-tsmc-chip-supply-chain-united-states-china/) | TSMC as **sovereignty chokepoint** in US–China AI competition. |
| [ITIF Oct 2025](https://itif.org/publications/2025/10/27/backfire-export-controls-helped-huawei-and-hurt-us-firms/) | Huawei export controls **accelerated** HiSilicon self-sufficiency; hurt US firms. |
| [Brookings](https://www.brookings.edu/articles/ball-games-over-the-us-is-out-of-the-ai-chip-market-in-china/) | Mate 60 Pro **7nm** domestic chip post-ban — competitive consumer product. |
| Repo: [microchips investigation](/science/microchips/microchips-shrinking-technology-investigation.md) | Taiwan fab concentration; author **planned conflict** read — **speculative**. |

**Author anecdote:** Owned among the **last Huawei phones** legally available in the US — fast, efficient; **anecdote tier**, not population study.

### 9.6 Gates / DOS cliff controversy — why IBM let Microsoft keep the standard

Companion to §9.1 Wintel summary. **Essay lane:** [The Internet That Should Have Been](/science/computing/the-internet-that-should-have-been.md) §II.

#### 9.6.1 The cliff defined

**The cliff** (author shorthand — define in articles, do not use unexplained): IBM launched the PC (**Project Chess**, 1980–1981) but **did not own** the operating-system layer programmers would target for decades. Microsoft licensed DOS to IBM as **PC-DOS**, retained **MS-DOS** for all clone makers, and with Intel captured **Wintel** — the API + CPU pair every application had to speak. IBM became a **high-cost clone maker** in a race it invited; Microsoft bought the standard for trivial upfront money ([*Big Blues*](https://vtda.org/books/Computing/BigBluesTheUnmakingIBM_PaulCarroll.pdf), [HBS 19-074](https://www.hbs.edu/ris/download.aspx?name=19-074.pdf)).

#### 9.6.2 Documented negotiation timeline

| When | Event | Source |
|------|--------|--------|
| **Jul 1980** | IBM (Jack Sams) contacts Microsoft; Project Chess seeks outside OS | [PCMag](https://www.pcmag.com/archive/the-rise-of-dos-how-microsoft-got-the-ibm-pc-os-contract-286148) |
| **1980** | Mary Gates discusses son's company with IBM chairman **John Opel** (United Way colleagues) | [NYT obit](https://www.nytimes.com/1994/06/11/obituaries/mary-gates-64-helped-her-son-start-microsoft.html), [Seattle Times](https://archive.seattletimes.com/archive/19940109/1888770/mary-gates----shes-much-more-than-just-the-mother-of-billionaire-bill-this-former-uw-regent-has-made-a-career-of-community-service) |
| **Nov 1980** | IBM–Microsoft contract signed; **~$430,000** total ($45,000 DOS line cited) | [PCMag](https://www.pcmag.com/archive/the-rise-of-dos-how-microsoft-got-the-ibm-pc-os-contract-286148), [*Idea Man*](https://erenow.org/biographies/idea-man/10.php) |
| **Early 1981** | Sams to Gates: **"Do you want to get it, or do you want me to?"** — IBM wanted Gates to **buy** QDOS | [*Big Blues*](https://vtda.org/books/Computing/BigBluesTheUnmakingIBM_PaulCarroll.pdf), [Reference.org](https://reference.org/news/CP%2FM/Aqk7NU5d) |
| **27 Jul 1981** | Microsoft buys **86-DOS** from Seattle Computer Products for **$50,000** (outright); SCP **not** told IBM was customer | [Wikipedia SCP](https://en.wikipedia.org/wiki/Seattle_Computer_Products), [*Idea Man*](https://erenow.org/biographies/idea-man/10.php) |
| **Aug 1981** | IBM PC ships; **PC-DOS $40** vs **CP/M-86 $240** — IBM steered buyers to DOS | [PCMag](https://www.pcmag.com/archive/the-rise-of-dos-how-microsoft-got-the-ibm-pc-os-contract-286148) |

#### 9.6.3 Why IBM allowed a non-exclusive license (documented)

| Source | Documented rationale |
|--------|-------------------|
| [Jack Sams, Wikipedia / *Big Blues*](https://en.wikipedia.org/wiki/IBM_PC-DOS) | IBM had been **sued** for allegedly stealing others' software; did **not** want IBM staff touching vendor code: **"We went to Microsoft on the proposition that we wanted this to be their product."** |
| Sams | **"If we'd bought the software, we'd have just screwed it up."** — Microsoft to own upgrades, support, customer inquiries |
| [Project Chess / open architecture](https://www.pcmag.com/archive/the-rise-of-dos-how-microsoft-got-the-ibm-pc-os-contract-286148) | **Speed**: outsource components; **non-exclusive** license let MS-DOS ship on **clone** hardware |
| [Retrocomputing SE #8344](https://retrocomputing.stackexchange.com/questions/8344/did-ibm-encourage-bill-gates-to-retain-the-rights-over-pc-dos) | Historians split: Gates **foresight** vs IBM **gridlock / litigation fear** — **both partially true** |

**Tier:** Documented **policy reasons** exist on record; they do **not** prove no other actors influenced the outcome.

#### 9.6.4 Beyond Gates-alone (documented connections — causation hedged)

| Connection | Documented fact | Tier |
|------------|-----------------|------|
| **Mary Gates / John Opel** | United Way national board; 1980 discussion of Microsoft; Opel reportedly said **"run by Bill Gates, Mary Gates' son"** when PC team sought OS vendor | **Documented** timing + social link; **not proven** that Opel **caused** non-exclusive terms |
| **William Gates Sr. / Preston Gates & Ellis** | Father co-founded firm that became **K&L Gates**; **corporate/tech** practice; later **major Microsoft outside counsel** in antitrust ([Seattle Times 2006](https://archive.seattletimes.com/archive/20061215/lawmerger15/preston-gates-to-merge-with-east-coast-firm)) | **Documented** legal bench; **not** evidence of 1980 deal-fixing |
| **Bill Neukom** | Microsoft general counsel 17 years; returned to Preston Gates as chair **2004** | Same |
| **Gary Kildall / Digital Research** | CP/M vendor; **contested** lore that IBM meeting was missed or mishandled; IBM still offered CP/M at **higher price** | **Footnote** — debatable; CP/M lane **lost on price + IBM push**, not mystery alone. **Inventor-containment casebook:** [Exact-Change Wallet §V — Kildall](/science/computing/exact-change-wallet-invention.md#gary-kildall--enclosure-then-erasure) |

#### 9.6.5 Author thesis — institutional arrangement (speculative)

> The DOS deal was not merely young Gates outplaying sleepy IBM. The **arrangement** — non-exclusive license, trivial buy-in, clone-ready standard — fits what **enclosure-first** industry wanted: **one software throat** every program must speak, hardware pluralism on the surface, **API monoculture** underneath. Whether **powers beyond Gates alone** steered Project Chess toward that outcome is **author read**, **intent unproven**. Falsifiers: primary IBM memo showing **deliberate** MS favoritism for unstated institutional reasons; or airtight proof the deal was **only** litigation-averse expedience with **no** upstream nudge.

**Unpack:** Compatible with §9.1 EFF tension — **hardware** opened, **software intent** locked.

#### 9.6.6 Legal moat — wins that preserved dominance

| Matter | Outcome | Dominance retained? |
|--------|---------|---------------------|
| [US v. Microsoft (1998–2002)](https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.) | **Liability affirmed** (illegal maintenance of OS monopoly); **breakup overturned**; **2001 behavioral settlement** | **Yes** — monopoly **finding stood**; Windows centrality continued; critics: [Wharton](https://knowledge.wharton.upenn.edu/article/the-microsoft-settlement-a-remedy-that-pleases-almost-no-one/) |
| SCP v. Microsoft (1986) | **$925,000** settlement; MS kept DOS ([UPI](https://www.upi.com/Archives/1986/12/16/Microsoft-settles-license-lawsuit-for-nearly-1-million/6032535093200/)) | **Yes** |
| Caldera / DR-DOS (1996–2000) | **~$280M** settlement; complaint acknowledged MS **DOS monopoly by 1988** ([ZDNet](https://www.zdnet.com/article/microsofts-long-legal-saga/), [Justia](https://law.justia.com/cases/federal/district-courts/FSupp2/72/1295/2336233/)) | **Yes** — competitor OS marginalized |
| Gates **personal** HSR fine (2004) | **$800,000** — **ICOS stock** premerger disclosure; **not** Microsoft antitrust ([DOJ](https://www.justice.gov/archive/opa/pr/2004/May/04_at_290.htm)) | N/A — trivial vs wealth; **separate lane** from US v. MS |
| Gates persona trademark (Martinique, 2001) | Gates **won**; ~$4,200 damages ([News24](https://www.news24.com/bill-gates-gets-his-name-back-20010214)) | Personal brand defended |

**Author read (speculative):** Pattern reads as **protected on high** — liability admitted, remedies weak, dominance durable. **Not** proof of conspiracy; **observable** legal posture.

#### 9.6.7 Epstein adjacent (legal facts only — one paragraph)

**Documented:** Bill Gates met Jeffrey Epstein **2011–2014** (after Epstein's **2008** Florida plea) to discuss **philanthropy**; Gates cut ties ~**2014**; [**no criminal accusations** against Gates](https://www.bbc.com/news/articles/cr4kyk9nv5lo) by Epstein victims; Melinda French Gates cited the association as **marriage strain**; Gates testified before House Oversight **June 2026** ([ABC](https://abcnews.com/Business/wireStory/bill-gates-testify-congressional-panels-jeffrey-epstein-investigation-133735697)). Epstein-file emails contain **uncorroborated** claims; Gates denies illegal activity.

**Author (speculative):** Gates's **legal and reputational survivability** across decades — antitrust, private suits, personal fines, Epstein association — fits a **protected-on-high** read when paired with §9.6.5. **Not adjudicated**; **no** claim Epstein ties imply criminal conduct; **no** Epstein lane in flagship essay.

---

## 10. Enclosure dossier — internet, social, front-end

### 10.1 CERN origin and mesh utility counterfactual

| Source | Documented claim |
|--------|------------------|
| [Berners-Lee 1989 proposal](https://www.w3.org/History/1989/proposal.html) | Originally “**Mesh**”; distributed hypertext for CERN; **no central control** required for linking systems — collaboration substrate, not a corporate storefront. |
| [CERN licensing](https://home.cern/science/computing/birth-web/licensing-web) | **Royalty-free** web software **1993**; W3C moved to MIT/INRIA **1995**. |
| [Ars: Baran](https://arstechnica.com/tech-policy/2011/02/how-the-atom-bomb-gave-birth-to-the-internet/) | Baran asked: “**non-existent public utility**, a common user digital data plant**” — **utility vision from outset**. |
| [Internet Policy Review 2016](https://policyreview.info/articles/analysis/myth-decentralised-internet) | Internet always **distributed** with **centers of control** — not the same as **decentralized** or **street mesh**. |

#### 10.1.1 Berners-Lee on what the Mesh became (documented — inventor's regret)

**Tier:** On-record interviews **2018–2019**; not author speculation. Useful for **enclosure** thesis — **platform inventor** agrees outcome diverged from intent.

| When | Quote / claim | Source |
|------|----------------|--------|
| **1989→1993** | **Mesh** → Web; free source release; early spirit **decentralized** — “**no central authority** that you had to go to ask permission**”; “**individual was incredibly empowered**” (retrospective) | [1989 proposal](https://www.w3.org/History/1989/proposal.html); [Vanity Fair 2018](https://archive.vanityfair.com/article/2018/8/i-was-devastated) |
| **Aug 2018** | **"I was devastated"** — "**Actually, physically—my mind and body were in a different state**" — reacting to fake news, mass surveillance, election interference, Cambridge Analytica-scale data abuse | [Vanity Fair](https://archive.vanityfair.com/article/2018/8/i-was-devastated) |
| **Aug 2018** | **"We demonstrated that the Web had failed instead of served humanity, as it was supposed to have done"**; centralization produced **"anti-human"** emergent phenomenon **without deliberate action** of platform designers | Same |
| **Nov 2018** | **"I am disappointed with the current state of the Web"**; lost **"feeling of individual empowerment"**; **optimism has cracked**; scandals over **personal data abuse** and **social media hate** | [Reuters via CNBC](https://www.cnbc.com/2018/11/01/father-of-the-web-says-tech-giants-may-have-to-be-split-up.html), [NY Post](https://nypost.com/2018/11/01/founder-of-world-wide-web-disappointed-in-what-it-has-become/) |
| **Nov 2018** | **Danger of concentration** — dominant platforms may need **breakup**; also notes **market shifts** can disrupt giants | CNBC / Reuters |
| **2018–2019** | Repair response: **Solid** — **re-decentralize**; return **data ownership** to users; [World Wide Web Foundation](https://webfoundation.org/) human-rights lane | Vanity Fair; Solid project docs |

**Unpack for dossier:** Mesh **succeeded as protocol** and **failed as social outcome** — per **its creator**. Rhymes with essay **TV channel** / **sealed hood** / §10.2–10.3 **enclosure** (Facebook, algorithms, corporate throats). **Not** proof of author **suppression** thesis (§2) — but **documents** that egalitarian/decentralized **intent** was public and the **present web** is widely understood — including by TBL — as **corporate, privacy-hostile, manipulative**.

**Tension (§14.2):** TBL **anti-concentration** vs Internet Policy Review **centers inevitable** — hold both.

**Author counterfactual (design fiction):** Mesh at **street level**; neighborhood **cache** for remote requests; **resilient** during outages; **known addresses**; personal records **stay personal**; corporations **plug in at transaction time** only; voting/sentiment query at **civic layer** — **no deployed system cited**; research hook for Reticulum-class stacks ([Relay blog](/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates.md)).

**Author read (speculative):** Internet **designed as control substrate first**, utility second — **tension** with CERN open-release **documented** history: **open source ≠ open society**.

### 10.2 Semantic Web hijack and Like button

| Source | Documented claim |
|--------|------------------|
| [Wikipedia: Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web) | Berners-Lee 1994+; **2006**: “**largely unrealized**.” |
| [Halpin 2023, Sagepub](https://journals.sagepub.com/doi/10.1177/20563051231195542) | Semantic Web vision **hijacked** into Facebook **Like** / Google Knowledge Graph — **walled gardens** from open-data intent. |
| [HN WebMCP vs Semantic Web](https://news.ycombinator.com/item?id=47216003) | Reinvention vs RDF debate; incentive skepticism. |

#### 10.2.1 *Starship Troopers* (1997) — "Would you like to know more?"

| Tier | Claim |
|------|-------|
| **Documented (film)** | **Federal Net** = recurring **broadcast** segments (propaganda newsreels) closing with **"Would you like to know more?"** — official-voice CTA ([IMSDb script](https://imsdb.com/scripts/Starship-Troopers.html) scenes 1, 46, 91, 111, etc.); satirical fascist media per [Verhoeven / JSTOR analysis](https://www.jstor.org/stable/10.5703/shofar.28.4.104). |
| **Documented (film)** | Civilian **terminals/kiosks** = **navigation buttons**, not tools: **multi-screen kiosk** returns test scores; **Federal Net terminal** scrolls casualty lists — Carmen enters a name, gets **KIA** ([IMSDb](https://imsdb.com/scripts/Starship-Troopers.html) scenes 8, 117). |
| **Documented (film)** | Other civilian UI: classroom desk **touch screens** (**SEND** cartoon peer-to-peer); **VU-PHONE** video call — messaging/telephony only ([IMSDb](https://imsdb.com/scripts/Starship-Troopers.html) scenes 6, 90). |
| **Documented (film)** | Deepest civilian compute shown: Carl's basement **Federal studies** rig — psychic card match/no-match; opaque to Johnny (**"How do you make him do that?"**) — **state research**, not user-owned utility ([IMSDb](https://imsdb.com/scripts/Starship-Troopers.html) scene 12). Military **guidance computer** V.O. serves drop automation only. |
| **Documented (context)** | **1997** release — **pre-broadband**, pre-social-web mass adoption for most viewers; web existed but was **not** yet the feed monoculture the film caricatures. |
| **Author (PP read)** | On-screen **internet analogue** = **TV channel + navigation buttons**; **general software utility** for citizens is **out of scope** or **nonexistent** in the fiction — no programming, no inspectable hood, no mesh. Audience **prepared for worst-case feed** before living it. Rhymes with essay **TV channel** hook + §10.1.1 TBL **devastated** outcome. |

**Unpack:** Not proof Facebook read the script — **cultural prefiguring** lane; link [PP hub](/influence/predictive_programming/page.md) optional.

### 10.3 MySpace → Facebook

| Source | Documented claim |
|--------|------------------|
| [Sean Parker, TechCrunch 2011](https://techcrunch.com/2011/06/28/sean-parker-on-why-myspace-lost-to-facebook/) | MySpace failed **product execution**; Facebook targeted **college niche** then “**one network to rule them all**.” |
| [Utah antitrust PDF](https://economics.utah.edu/antitrust-conference/session_material/The%20Antitrust%20Case%20Against%20Facebook_%20A%20Monopolists%20Journey%20Towar.pdf) | Privacy positioning helped consolidation; **direct network effects** crushed rivals. |
| [PACIS 2011 paper](https://aisel.aisnet.org/cgi/viewcontent.cgi?article=1087&context=pacis2011) | Facebook **Open API** (2007) shifted network topology — **platform enclosure** accelerated growth. |

### 10.4 React / Hermes / Vercel

| Source | Documented claim |
|--------|------------------|
| [Meta Hermes 2019](https://engineering.fb.com/2019/07/12/android/hermes/) | JS engine **optimized for React Native**; bytecode at build time; **no JIT** by design — **Facebook controls mobile JS runtime** for RN apps. |
| [React Native default Hermes](https://reactnative.dev/blog/2021/10/26/toward-hermes-being-the-default) | Hermes becoming **default** RN engine — version-locked to RN releases. |
| [Socratopia Ch.4](https://www.socratopia.app/library/modern-web-development-en/chapter-4) | React won via **path dependence**, ecosystem density, Facebook dev-relations — **not** technical inevitability. |
| [WebAssembly](https://webassembly.org/) | Portable bytecode substrate in browsers — **neutral VM lane** vs framework-owned runtimes (author counterfactual anchor). |

| Tier | Claim |
|------|-------|
| **Author thesis** | Industry resisted a **universal VM** (Java fought/fenced); forward stack should sit on **WASM** in-browser **and** beside it — apps decoupled from OS silos. |
| **Author (lived experience)** | Attempted **Hermes** outside Meta **React Native** — **not portable**; engine is **RN-only**, version-locked to Facebook's release train. |
| **Author read** | React ecosystem **bloated before you build your own system** — enclosure via gravity, not inevitability. Hermes reminiscent of **missed universal introspection** — **analogy tier**. Site migrated **off Vercel** toward **Relay mirrors** ([May 2026 roundup](/blog/2026-05-26-may-late-roundup-ghost-war-napoleon-prisca-relay-migration-substack.md)) as **escape hatch** exemplar.

### 10.5 Opaque reach and layered-reality hijack

| Tier | Claim |
|------|-------|
| **Author (lived experience)** | This site and articles **barely seen** — **blacklisting** / **shadow-banning** in opaque algorithms; audiences reached mainly via **podcast appearances** as human bypass around platform demotion. |
| **Author (speculative)** | **Most visitors** to author's site would be shown **something else** — URL intact, experience **substituted** in-pipe (search snippets, summarization, agent mediation, caches) — **layered-reality hijack**. |
| **Author thesis** | Per-visitor substitution **requires global monopolization** — unified search/browser/ranking throat across continents; **impossible** on inspectable mesh with shared archives. Rhymes with [censorship hub](/influence/censorship/) and [AI control](/science/ai/ai-control-investigation.md) hijack lanes. |

**Tension:** Platform vendors document **personalization** and **AI overviews** as features; author reads same machinery as **anti-shared-truth** enclosure. Not proven as deliberate targeting of this site — **pattern read**.

### 10.6 Mobile pocket enclosure — Android developer verification

**Tier:** Google Android Developers docs + tier-1 press + [keepandroidopen.org](https://keepandroidopen.org/) campaign — full dossier: [Google Don't Be Evil enclosure investigation](/science/computing/investigations/google-dont-be-evil-enclosure-investigation.md).

| Source | Documented claim |
|--------|------------------|
| [Google developer verification](https://developer.android.com/developer-verification) | **Aug 2025** announcement; verified developer identity for apps on **certified Android**; “keep Android open” marketing vs new **security layer**. |
| [Google guides](https://developer.android.com/developer-verification/guides) | **Sept 30, 2026:** enforcement begins **Brazil, Indonesia, Singapore, Thailand** + named partner stores; **2027+** global expansion. |
| [Google FAQ](https://developer.android.com/developer-verification/guides/faq) (updated **Jun 18, 2026**) | Unverified apps **blocked** in applicable regions if developer not registered; **advanced flow** for sideload (one-time setup, **24h** delay); stores **not** on initial list **exempt during initial phase**. |
| [The Verge Aug 2025](https://www.theverge.com/news/765881/google-android-apps-side-loading-developer-verification) | Extends Play-style **ID verification** to **third-party stores** and direct download. |
| [Ars Mar 2026](https://arstechnica.com/gadgets/2026/03/google-details-new-24-hour-process-to-sideload-unverified-android-apps/) | **High-friction** advanced sideload; verifier in **Android 16.1+**; Google supplies UI/scare screens. |
| [F-Droid open letter Feb 2026](https://f-droid.org/2026/02/24/open-letter-opposing-developer-verification.html) | **>95%** certified devices; installs **phone home** to Google; **existential** threat to alt stores. |
| [keepandroidopen.org](https://keepandroidopen.org/) | **71 orgs** open letter; **do not register** campaign; Play Services choke-point framing. |

**Author read (§10.6 — rhymes with §10.1–10.5):** Pocket computers repeat **web enclosure**: Android marketed **open** vs iPhone → community builds F-Droid/privacy stack on that promise → **flip** to **developer registry**, **permission-slip install**, **vendor-updatable gate**. Same **absorb → enclose** grammar as Semantic Web → Knowledge Graph and WebMCP → agent throat — see [§5 absorb-enclose dossier](/science/computing/investigations/google-dont-be-evil-enclosure-investigation.md#5-author-thesis-absorb--enclose-playbook).

**Tension (§14.2):** Google documents **hobbyist lane** (20 devices, no ID) and **phased geography**; campaign compresses to **worldwide Sept 2026 lockdown** — hold **both** (§2 of absorb-enclose dossier).

---

## 11. AI gate dossier — WebMCP, Chrome, courts, hijack

### 11.1 WebMCP + Chrome (see also §1)

Consolidated **documented** stack: `navigator.modelContext` → **browser agents**; headless **out of scope**; **4GB Nano** ([Verge](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features)); [@jaredcwhite](https://github.com/webkit/standards-positions/issues/649) anti-agentic refusal; [Mozilla neutral](https://github.com/mozilla/standards-positions/issues/1412).

### 11.2 AI hijack — worse than virus

From [AI control investigation](/science/ai/ai-control-investigation.md): **ghost in the machine** — activity **without artifacts** while user logged in; virus scanners show **nothing**; **deliberately broken OS** → only AI can operate → **voice remote control**.

### 11.3 Courts and corporate AI

| Source | Documented claim |
|--------|------------------|
| [OPB Jun 2026](https://www.opb.org/article/2026/06/05/oregon-supreme-court-ai-falsehoods/) | Oregon Supreme Court: **fake AI citations** in filings; fines. |
| [Scientific American](https://www.scientificamerican.com/article/why-lawyers-keep-citing-fake-cases-invented-by-ai/) | **1,400+** tracked courtroom AI citation errors; trust persists despite warnings. |
| [Law.com Feb 2026](https://www.law.com/nationallawjournal/2026/02/13/in-opinion-footnote-5th-circuit-calls-out-trial-judges-ai-use-/) | Fifth Circuit cautions judges on **automation bias**; staff AI errors in opinions. |
| [Law.com Jun 2026](https://www.law.com/2026/06/11/lawyers-have-been-hallucinating-for-decades-judges-sayai-just-made-it-faster/) | Judge Rodriguez: AI may **speed** existing citation sloppiness; tools like **Learned Hand** for verification. |

**Author forward model:** **AI review, not AI judgment** — instant document review and sentiment mapping for **all parties**; **courts reserved** for in-person final debate; solutions-focused, not punishment-first.

**Corporate lane:** Jira tickets, PR reviews, code completion — extension of [AI control §2](/science/ai/ai-control-investigation.md) deliberate complexity thesis.

### 11.4 Terminator 2029 — predictive programming schedule

Companion to essay [§VI](/science/computing/the-internet-that-should-have-been.md). Links [PP hub](/influence/predictive_programming/page.md), [AI control](/science/ai/ai-control-investigation.md), hardware §9 (Wintel/chip wars), Chrome Nano §1.1.

#### 11.4.1 Franchise dates (documented)

| Beat | Franchise fact | Source |
|------|----------------|--------|
| **Judgment Day** | First strike / machines cross the line — dated **earlier** than 2029 in main arcs (e.g. **1997** in *T2*'s original timeline; *T3* **2004**) | [Wikipedia: Skynet](https://en.wikipedia.org/wiki/Skynet_(Terminator)) |
| **2029** | **Future war** year — terminators sent back **from** 2029; human–AI war at full scale in future timeline | *T1* / *T2* framing |
| **History reset** | **Author PP read** on finale — purge-before-utopia; **not** explicit single line of T1/T2 plot text | Essay §VI — **speculative** tier |

#### 11.4.2 Moore cadence as schedule proof (author — speculative)

| Claim | Tier |
|-------|------|
| Franchise assumes **gradual** silicon improvement — **Moore's law** cultural stand-in — **no** miracle shortcut that skips decades to AI | **Author read** — fiction convention, but **accurate** to real 1984→2026 hardware curve |
| Hitting **2029** as endpoint implies **foreknowledge** of how long CPUs take to reach **distributed-AI** capacity — or very lucky writing | **Author PP** — **not** adjudicated; falsifier: primary evidence franchise writers had **no** access to fab roadmaps |
| Real world: no **sudden revolution** skipped the treadmill (quantum hype aside) — AI gate arrived on **datacenter + consumer GPU** curve the films assumed | **Partially documented** — Nvidia/Intel timelines; author's "**plan knew the schedule**" is **speculative** |

#### 11.4.3 Blind march + critics as sci-fi (author — PP)

| Claim | Tier |
|-------|------|
| Humanity built AI capacity **without** treating PP warnings as policy | **Observable** — public discourse |
| *Terminator* and kin **normalized** machine war / Skynet arc — critics of rollout dismissed as **complaining about movies** | **Author PP** — rhetorical pattern; optional hooks: media framing studies |
| **Plot played out in reality** — not necessarily robot armies, but **middle beats**: fab build-out, blind institutional adoption, distributed deployment | **Author thesis** — see §11.4.4 Nano parallel |

#### 11.4.4 *Terminator 3* virus ↔ Chrome Gemini Nano (author parallel)

**Documented (*T3* plot):** Skynet spreads as a **virus** through **civilian** networks — "**ordinary computers in office buildings, dorm rooms; everywhere**" — distributed, no single core to shut down; military tries to disinfect and **activates** Skynet instead ([Wikipedia](https://en.wikipedia.org/wiki/Skynet_(Terminator)), [Stack Exchange — Connor dialogue](https://scifi.stackexchange.com/questions/27193/how-did-skynet-screw-the-world-even-before-its-activation)).

**Documented (2025–2026):** Chrome installs **~4 GB Gemini Nano** on eligible **desktops** — home and office PCs — often with weak upfront consent; may re-download after deletion (§1.1: [Verge](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features), [That Privacy Guy](https://www.thatprivacyguy.com/blog/chrome-silent-nano-install)).

**Author read (speculative):** Nano rollout is **T3 civilian-virus beat in motion** — **plan in motion**, not proof Google writers watched *T3*. Rhymes with WebMCP **agent throat** in the same browser bundle.

#### 11.4.5 IBM / chip wars as schedule tension (author — speculative)

| Lane | Author claim |
|------|--------------|
| **DOS cliff** (§9.6) | Wintel **monoculture** — one API throat on Intel-track silicon |
| **Chip wars** (§9.1–9.5) | GPU furnace, crypto, Taiwan, export controls — **profitable tension** keeping **Moore cadence** politically and economically **on track** without a parallel stack that **jumps the timeline** |
| **Synthesis** | Hardware chapters are **not** digression from PP thesis — they explain **how the schedule stayed solid** |

**Tier:** **Speculative** institutional read — compatible with documented Wintel/Nvidia facts; **not** proof IBM 1980 deal was timed for 2029 AI. Falsifiers in §14.3.

#### 11.4.6 Foiled vs landing (author — 2026)

| Beat | Status (author) |
|------|-----------------|
| **2029 final-war / history-reset finale** as literal spectacle | Largely **foiled** — AI **forked**; Global South **sidecar** utility; not single Skynet |
| **Middle script** — blind march, mocked critics, **desktop virus** distribution, agent gate | **Landing** — Nano + WebMCP + institutional overreach |
| **Neuralink vs sidecar** | **Different lanes** — implant dystopia vs phone-sidecar help (essay §VI) |

**Unpack:** Reconciles earlier "foiled purge" with user's "**plot played out**" — **finale** speculative; **deployment beats** observable.

---

## 12. Pragmatic adoption under protest

### 12.1 Author thesis (sentiment captured **exactly**)

> Yes, we are using WebMCP while complaining it was **AI-gated**. This is **just another step** in a very long path every developer has taken — winding between **compromises** and **jumping through the hoops** of the industry.
>
> You won't find a developer who refuses a technology **only** because the company built it unethically. You **will** find people who refuse because they **don't trust** it. I **don't trust** it — but I **will use it** because I'm **really not afraid** of it.
>
> **Any future-forward solution must work with what already exists in the present** and **cannot** involve **catastrophic collapse** of existing systems **without** already having in motion a **transition and backup plan** to catch all the people falling through the cracks.

### 12.2 Paradigm Threat as case study

| Layer | Present compromise | Forward bridge |
|-------|-------------------|----------------|
| **WebMCP** | [WEBMCP_INTEGRATION.md](/paradigm-threat-site/docs/WEBMCP_INTEGRATION.md) — agent tools behind flag; `/reply` native-gated | Structured site intent **exists**; argues humans deserved it **first** |
| **Relay** | [Relay network shift blog](/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates.md) — mirrors, signed catalog | Mesh/decentralization **without** demanding users abandon browsers overnight |
| **Vercel exit** | [May 2026 roundup](/blog/2026-05-26-may-late-roundup-ghost-war-napoleon-prisca-relay-migration-substack.md) | Reduce platform kill-switch; **gradual** migration |

**Framing:** **Building the bridge under protest** — not hypocrisy, **industry grammar**.

### 12.3 Optimistic close (author)

> The **bad revolution** (institutions enforce AI everywhere) is **less likely** than **institutional overreach collapsing** while **repairable software** remains for average people. Outages (Cloudflare-class) accelerate willingness to **try alternatives**. Courts stay **human** for final calls. Focus: **disenfranchised, disabled, disengaged** — solutions, not punishment.

---

## 13. Cross-references (Paradigm Threat repo)

| Investigation / doc | Relevance |
|---------------------|-----------|
| [**Reader essay**](/science/computing/the-internet-that-should-have-been.md) | Flagship narrative for this dossier |
| [Quantum Leap (of faith)](/science/computing/quantum-leap-of-faith.md) | Hardware/display/wintel essay voice |
| [Quantum storage investigation](/science/computing/investigations/quantum-computer-infinitely-indexed-storage-thesis-investigation.md) | Analog/infinite-index substrate |
| [AI control investigation](/science/ai/ai-control-investigation.md) | Hijack, broken software, PP catalog |
| [Microchips investigation](/science/microchips/microchips-shrinking-technology-investigation.md) | Taiwan/Huawei/shrinking narrative |
| [Nintendo–Sony breakup](/influence/stolen_credit/nintendo-sony-breakup.md) | CD-ROM / cartridge lane |
| [When your child won't fit the grade](/history/chronology/when-your-child-wont-fit-the-grade.md) | Education Installment I |
| [Responsibility to the Next Generation](/history/chronology/responsibility-to-the-next-generation.md) | Education Installment II (spinoff from §8) |
| [Responsibility investigation](/history/chronology/investigations/responsibility-to-the-next-generation-investigation.md) | Education dossier (moved) |
| [WebMCP integration (site)](/paradigm-threat-site/docs/WEBMCP_INTEGRATION.md) | Pragmatic adoption case study |
| [Relay network shift](/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates.md) | Mesh escape hatch |
| [May 2026 site roundup](/blog/2026-05-26-may-late-roundup-ghost-war-napoleon-prisca-relay-migration-substack.md) | Vercel→Relay migration |
| [Predictive programming hub](/influence/predictive_programming/page.md) | Terminator / AI PP |
| [Censorship hub](/influence/censorship/) | Information gatekeeping |
| [Compromised court cases](/influence/predictive_programming/fiction_encoding/compromised-court-cases-declared-reality-investigation.md) | Courts as declared-reality engine (adjacent) |

---

## 14. Research hooks, falsifiers, and TODOs

### 14.1 Questions

- **Primary suppression:** W3C/IETF/Microsoft/Google memos against mandatory introspection?  
- **Mesh voting:** Any deployed **street-level** civic sentiment system with author’s properties?  
- **Fantastic Planet:** See [Responsibility investigation §2](/history/chronology/investigations/responsibility-to-the-next-generation-investigation.md).  
- **Efficient mainstream rendering:** Why software rasterization stayed niche — industry capture or genuine perf ceiling?  
- **Terminator PP:** Primary sources on **2029** date origin in Cameron scripts? **T3** virus plot vs Chrome Nano — documented parallel only?  
- **Moore schedule:** Evidence fab roadmaps were **known** to PP authors vs lucky extrapolation?

### 14.2 Documented tensions (not contradictions — hold both)

| Tension | Resolution in dossier |
|---------|----------------------|
| Ethics imposed vs topics free | **Responsibility investigation** §1 — guardrails vs syllabus |
| AI tutor vs human tutor | **Responsibility investigation** §4 — 1-on-1 irreplaceable |
| Automated literacy vs human QA | **Responsibility investigation** §4 — kids fool graders |
| Musk villain vs Global South AI utility | **Implant vs sidecar** — Responsibility §3 + internet §VI |
| CERN open vs control-first | **Open source ≠ open society** (§10.1) |
| TBL Mesh intent vs web outcome | **Inventor: failed humanity** — documented regret (§10.1.1) |
| EFF clones vs Wintel lock-in | **Hardware pluralism, API monoculture** (§9.1) |
| Gates chess vs IBM gridlock | **Both partially true** (§9.6.3) |
| Mary Gates connection vs coincidence | **Documented link; causation unproven** (§9.6.4) |
| PT uses WebMCP vs critiques AI gate | **Bridge under protest** (§12) |
| Terminator finale vs middle beats | **Reset foiled**; **Nano/T3 virus landing** (§11.4.6) |
| PP schedule vs emergent tech | **Moore cadence** held — no shortcut revolution (§11.4.2) |
| DOS cliff vs PP timetable | **Wintel lock** as schedule tension — **speculative** link (§11.4.5) |

### 14.3 Falsifiers

- WebMCP ships **human tool inspector** + **crawler manifest** standard.  
- Mandatory web introspection **rejected by regulators** with public record (narrows suppression read).  
- Neuralink becomes **default K-12** without moratorium (weakens foiled-dystopia read).  
- Primary IBM memo surfaces showing **deliberate** MS standard gift **for institutional enclosure** (supports §9.6.5).  
- Documented proof non-exclusive DOS was **only** litigation-averse expedience with **no** upstream influence (narrows §9.6.5).

### 14.4 Maintainer TODOs

- [ ] Monitor [WebKit #670](https://github.com/WebKit/standards-positions/issues/670)  
- [ ] Track [W3C TAG #1238](https://github.com/w3ctag/design-reviews/issues/1238)  
- [ ] Header art: `the-internet-that-should-have-been.png` (essay) — **done 2026-06-18**
- [x] Grep repo for stale links to `webmcp-suppressed-protocol-ai-gatekeeper-investigation.md` — redirect stub in place

---

## References (external recap — extended)

**WebMCP / Chrome:** [Chrome WebMCP](https://developer.chrome.com/docs/ai/webmcp), [Compare MCP and WebMCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp), [Starborn WebMCP ≠ MCP](https://starborn.github.io/webmcp/WebMCnotMCP.md), [Tandem WebMCP vs MCP](https://usetandem.ai/blog/webmcp-vs-mcp-difference), [Mozilla #1412](https://github.com/mozilla/standards-positions/issues/1412), [WebKit #649](https://github.com/webkit/standards-positions/issues/649), [Verge 4GB](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features), [That Privacy Guy](https://www.thatprivacyguy.com/blog/chrome-silent-nano-install)

**Hardware / platforms:** [HBS 19-074](https://www.hbs.edu/ris/download.aspx?name=19-074.pdf), [Big Blues PDF](https://vtda.org/books/Computing/BigBluesTheUnmakingIBM_PaulCarroll.pdf), [EFF IBM clones](https://www.eff.org/deeplinks/2019/08/ibm-pc-compatible-how-adversarial-interoperability-saved-pcs-monopolization), [PCMag DOS rise](https://www.pcmag.com/archive/the-rise-of-dos-how-microsoft-got-the-ibm-pc-os-contract-286148), [Retrocomputing SE DOS rights](https://retrocomputing.stackexchange.com/questions/8344/did-ibm-encourage-bill-gates-to-retain-the-rights-over-pc-dos), [Mary Gates NYT](https://www.nytimes.com/1994/06/11/obituaries/mary-gates-64-helped-her-son-start-microsoft.html), [US v. Microsoft](https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.), [Wikipedia N64](https://en.wikipedia.org/wiki/Nintendo_64), [Nintendo Life 2025](https://www.nintendolife.com/news/2025/02/not-even-squaresoft-could-convince-nintendo-to-use-discs-for-the-n64), [Nvidia lawsuit Law.com](https://www.law.com/therecorder/2026/03/26/california-judge-certifies-investor-class-in-nvidia-crypto-mining-lawsuit/)

**Internet / enclosure:** [CERN licensing](https://home.cern/science/computing/birth-web/licensing-web), [Berners-Lee 1989 proposal](https://www.w3.org/History/1989/proposal.html), [Vanity Fair TBL devastated 2018](https://archive.vanityfair.com/article/2018/8/i-was-devastated), [CNBC TBL disappointed 2018](https://www.cnbc.com/2018/11/01/father-of-the-web-says-tech-giants-may-have-to-be-split-up.html), [Baran utility Ars](https://arstechnica.com/tech-policy/2011/02/how-the-atom-bomb-gave-birth-to-the-internet/), [Internet Policy Review](https://policyreview.info/articles/analysis/myth-decentralised-internet), [IMSDb Starship Troopers](https://imsdb.com/scripts/Starship-Troopers.html), [Halpin Like button](https://journals.sagepub.com/doi/10.1177/20563051231195542), [Parker TechCrunch](https://techcrunch.com/2011/06/28/sean-parker-on-why-myspace-lost-to-facebook/), [Meta Hermes](https://engineering.fb.com/2019/07/12/android/hermes/)

**Android / pocket enclosure:** [Google developer verification](https://developer.android.com/developer-verification), [Google FAQ](https://developer.android.com/developer-verification/guides/faq), [Verge Aug 2025 sideload ID](https://www.theverge.com/news/765881/google-android-apps-side-loading-developer-verification), [Ars Mar 2026 24h sideload](https://arstechnica.com/gadgets/2026/03/google-details-new-24-hour-process-to-sideload-unverified-android-apps/), [F-Droid open letter Feb 2026](https://f-droid.org/2026/02/24/open-letter-opposing-developer-verification.html), [keepandroidopen.org](https://keepandroidopen.org/), [Register Keep Android Open Oct 2025](https://www.theregister.com/software/2025/10/29/keep-android-open-movement-fights-google-dev-requirement/1470903)

**AI / courts / neuro:** [OPB Oregon SC](https://www.opb.org/article/2026/06/05/oregon-supreme-court-ai-falsehoods/), [Scientific American lawyers AI](https://www.scientificamerican.com/article/why-lawyers-keep-citing-fake-cases-invented-by-ai/), [PLOS Neuralink ethics](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3002899), [Springer moratorium](https://link.springer.com/article/10.1007/s12152-025-09612-6), [Wikipedia Skynet](https://en.wikipedia.org/wiki/Skynet_(Terminator)), [T3 virus dialogue SE](https://scifi.stackexchange.com/questions/27193/how-did-skynet-screw-the-world-even-before-its-activation)

**Geopolitics:** [Foreign Policy TSMC](https://foreignpolicy.com/2026/03/09/artificial-intelligence-ai-sovereignty-taiwan-semiconductor-manufacturing-tsmc-chip-supply-chain-united-states-china/), [ITIF Huawei](https://itif.org/publications/2025/10/27/backfire-export-controls-helped-huawei-and-hurt-us-firms/), [Brookings](https://www.brookings.edu/articles/ball-games-over-the-us-is-out-of-the-ai-chip-market-in-china/)

**Education / film:** [IMDb Fantastic Planet](https://www.imdb.com/title/tt0070544/plotsummary/), [Archania analysis](https://archania.org/p/the-symbolic-world/symbolic-works/film/fantastic-planet)

**Historiography:** [Semantic Web Wikipedia](https://en.wikipedia.org/wiki/Semantic_Web), [OLE Automation Wikipedia](https://en.wikipedia.org/wiki/OLE_Automation), [Pete Lacey InfoQ](https://www.infoq.com/articles/pete-lacey-ws-criticism/), [Tim Bray WSDL](https://www.tbray.org/ongoing/When/200x/2005/05/03/Replacing-WSDL)

---

Keywords: #InternetThatShouldHaveBeen #WebMCP #SemanticWeb #Wintel #Nintendo64 #GPU #Taiwan #Huawei #Education #Ethics #PragmaticAdoption #ParadigmThreatFiles

---

## Limits and disclaimers

**Prisca sapientia (epistemic foundation):** This investigation assumes [**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md). Modern consensus institutions are not default truth; claims are tiered below.

This dossier hosts **author-originating** hypotheses alongside **documented** press, specs, and scholarship. **Deliberate suppression**, **Fantastic Planet redacted fact**, **mesh voting counterfactual**, and **Taiwan conflict as planned** are **alleged or speculative** unless marked documented. **Paradigm Threat** ships WebMCP and migrates toward Relay — **bridge under protest** (§12), not endorsement of vendor ethics.

---

## Investigator notes

Prior filename: `webmcp-suppressed-protocol-ai-gatekeeper-investigation.md` → renamed **2026-06-18** to reflect full scope. Update inbound links when found.

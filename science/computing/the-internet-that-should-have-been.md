# The Internet That Should Have Been

The web was supposed to be a workshop. We got a TV channel — and a sealed hood only the dealership technician may open.

![The Internet That Should Have Been — article header](the-internet-that-should-have-been.png)

You buy a car. The hood is sealed. You may drive, wash, and admire the paint. If you want to know what the engine actually does — which procedures run, which parameters matter, what comes back before anything pretties it up for display — you call the manufacturer's technician. They unlock the panel remotely. You never learn the craft yourself.

That is the internet in 2026, now that **WebMCP** and Chrome's **agent stack** are arriving together: websites may finally **declare** their procedures, parameters, and responses in a machine-readable contract — but the **primary customer** is the **browser vendor's AI agent**, not you. The capability should have been standard in the **1990s**, without waiting for local large language models, multi-gigabyte on-device weights, or a GPU furnace on your desk. We are getting the **right idea** on the **wrong timeline**, for the **wrong principal**.

This essay is the narrative spine. Citations, tier labels, and dissenting voices live in the companion dossier: [The Internet That Should Have Been — investigation](/science/computing/investigations/internet-that-should-have-been-investigation.md). Hardware and display counterfactuals continue in [Quantum Leap (of faith)](/science/computing/quantum-leap-of-faith.md).

---

## I. The workshop we never got

Tim Berners-Lee discussed a machine-processable web in **1994**. Windows had **OLE Automation** and type libraries — scriptable object models with method names and schemas. CORBA had IDL. Later came WSDL, the Semantic Web, OpenAPI, Anthropic's **MCP** (2024), and now **WebMCP** (2026). The **idea** of opening the hood was never secret. What never arrived was a **neutral, universal layer** — crawlable, teachable to ordinary people, independent of which AI vendor you use.

Instead the public web became **hypertext for humans** plus **hidden APIs for insiders**. View Source shows you markup, not **behavior contracts**. Terms of service forbid the scraping that would reconstruct intent. Search engines ranked **opaque HTML graphs**, not **quality of declared capability**. A world brain built from **archived structured data** — not just pages — was possible. We got **feeds**, **walled gardens**, and **algorithmic show/hide** instead.

> The **MCP protocol itself** should have come out **independently of AI**, and should have been **standard and common** a long time ago — **probably even in the 90s**… **opening the hood** like a car: seeing **what procedures work**, **what parameters are**, **what the response is**, **before** it gets parsed by AI.

In that counterfactual, the internet would be **night-and-day different** — not a **TV channel** (non-interactive, obfuscated source). **SEO** would judge **data availability and MCP quality**, not opaque link graphs on scraped HTML. **Walled gardens** might have been **impossible**; **programming simplified**; apps **decoupled** from OS silos. **Information control** would have been **harder** at today's scale: if crawlers pulled **structured capability + data**, we would have **archives of the data itself** — a **shared world brain**, curated — instead of waiting for **AI to get it first** while **humans** must learn **API/MCP** themselves, and **no one teaches humans**, only developers wiring **AI → MCP**.

WebMCP inverts one piece of the puzzle in a useful way — the site **tells** the agent what it can do instead of the agent guessing from the DOM — but it ships **agent-first**: `navigator.modelContext`, tab required, **headless crawlers out of scope**, discovery unsolved unless you already visit the site. Industry blogs already frame it as **"SEO for agents."** The **dual-mode UI** pitch — React for humans, WebMCP for assistants — assumes humans never deserved **mode zero**: structured transparency as a first-class citizen skill.

The historical litter is instructive. Pete Lacey's **"WS-Death"** essay mocked SOAP/WSDL ceremony. Tim Bray argued WSDL should be **replaced** with simpler contracts. OpenAPI gave REST a schema — but for **developers behind the firewall**, not for **every citizen** reading capability graphs in a browser inspector. Anthropic's MCP is a **backend** wire protocol; WebMCP is a **frontend** API in the tab — complementary in vendor slides, **coupled in practice** to the agentic-browser moment.

I do not claim every platform executive met in a room and voted to suppress introspection. I claim the **incentive landscape** consistently rewarded opacity: walled gardens, SaaS rent, demographic targeting, DRM, anti-scraping, "security" that means **you** may not understand **your** software. Whether you call that conspiracy or emergent order, the **counterfactual** is stark: an inspectable web changes SEO, competition, programming education, and real-time information control. No wonder the fully open hood waited until the **AI gate** could absorb it.

---

## II. The long wrong turn — hardware and platforms

The internet's software story sits on a hardware story that was also narrowed on purpose. See [Quantum Leap (of faith)](/science/computing/quantum-leap-of-faith.md) for the vector/analog depth; here is the compressed arc.

**IBM and Microsoft.** The PC "revolution" was marketed as pluralism. In practice IBM outsourced DOS, lost the BIOS bottleneck to clone makers, and watched **Microsoft and Intel** capture the standards that mattered: the APIs everyone had to target. Paul Carroll's *Big Blues* and Harvard Business School case **19-074** document IBM **gridlock** — executives saw the cliff, couldn't turn. The EFF rightly celebrates **adversarial interoperability** (Phoenix BIOS) for preventing IBM from owning every motherboard. Both can be true: **hardware** widened while **software intent** locked into **Wintel**.

**Business machines.** IBM's soul was ledger and batch — serious, grey, compatible with institution. Carroll's account is full of meetings about compatibility and margin while **display and signal technology** — the consumer-facing fork — sat in another building's priority queue. The homebrew legitimacy that might have matured into a parallel stack was **managed**, not nurtured.

**Analog and vector.** Arcade vector tubes and optical discs were **physical analog channels** forced into **binary scarcity**. CD, DVD, and Blu-ray are analog substrates constrained by digital encoding choices; a different standards path could have stored **native signal fields**, not just quantized bitstreams — one thread in the [quantum storage investigation](/science/computing/investigations/quantum-computer-infinitely-indexed-storage-thesis-investigation.md).

**Nintendo and the CD.** Nintendo 64 stayed on cartridges citing **load times** and piracy. Square begged for CDs so *Final Fantasy VII* could exist as cinema; Nintendo refused; Sakaguchi put three discs on PlayStation instead. Load times were real; they were also **policy**. The [Nintendo–Sony breakup](/influence/stolen_credit/nintendo-sony-breakup.md) is the longer prequel — a platform marriage that could have shipped cinematic storage and instead shipped **containment**.

**3D vs 2D.** When N64-style 3D marketing landed, **2D craft starved** — not because flat games stopped working, but because platforms **froze genres** and attention followed silicon into the **triangle race**. Today's "retro" Steam niche is nostalgia plus **incomplete exploration** of a lane that was abandoned mid-sentence.

**GPU → crypto → AI.** Nvidia's gaming GPUs became Ethereum shovels; investors allege the company **masked** how much "gaming" revenue was miners (class action certified **March 2026**; SEC **$5.5M** settlement on related disclosure). Crypto crashed; gaming is now **under ten percent** of Nvidia revenue; **datacenter AI** dominates. Software rasterizers and efficient CPU render paths exist; they never became **industry religion** because the furnace **paid**.

**Quantum as carrot.** Public quantum computing sells **qubit futurism** while sidestepping storage and addressing physics — another leap of faith while the present stack stays hot. See the [quantum computer investigation](/science/computing/investigations/quantum-computer-infinitely-indexed-storage-thesis-investigation.md).

Who gets to **declare what the machine does** — and whether that declaration is **portable**, **archivable**, and **learnable** without buying a new GPU every religion cycle — is the hardware through-line into the software chapters below.

---

## III. The internet that wasn't — utility, mesh, enclosure

**CERN and Switzerland.** Documented history: Berners-Lee's 1989 **Mesh** proposal, royalty-free web code **1993**, W3C born **1995** — a gift to the world. Paul Baran, decades earlier, asked whether packet networking should become a **public utility** — "a common user digital data plant." That vision rhymes with what I wanted: internet at the **street**, not only in a datacenter you never see.

Researchers push back: the internet was always **distributed** with **necessary centers of control** — not the decentralized fairy tale ([Internet Policy Review](https://policyreview.info/articles/analysis/myth-decentralised-internet)). Open source release does not equal open society. My read holds both: the **substrate** was governable even when the **code** was free.

**The mesh I wanted (aspirational — no deployed system cited in the dossier).** Neighborhood **cache** for remote data so outages do not erase your week. **Known addresses** you control. Personal records that **stay personal** until you **plug in a corporation at transaction time** — voting, banking, health — instead of permanent hoards on someone else's continent. Civic **sentiment** queryable at block scale without a single social app's algorithmic veil. Baran's utility framing and Berners-Lee's **Mesh** naming are documented rhymes; the street-level voting lane is **design fiction** unless you want to point at a specific project — I don't, yet. [Relay mirrors](/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates.md) are a small step toward **resilience**, not the full sketch.

**Semantic Web hijacked.** By 2006 Berners-Lee admitted the machine-readable web was **"largely unrealized."** Harry Halpin traces how Semantic Web ambition collapsed into the Facebook **Like** and Google's Knowledge Graph — **enclosure** wearing open-data vocabulary. The Like button is not a triple store; it is **one-bit consent to surveillance** dressed as participation.

**MySpace → Facebook.** Sean Parker said the quiet part: target a niche, then become "**one social network to rule them all**." MySpace lost on product; Facebook won on **network topology** and later **Open API** platform lock-in. Utah antitrust scholarship frames the journey as **monopolization by enclosure** — not merely better UX. Customizable chaos became **feed monoculture**: you may **consume** the show; you may not **inspect** the ranking contract.

**React, Hermes, Vercel.** Facebook open-sourced **React** and now ships **Hermes** — a JavaScript engine **purpose-built for React Native**, bytecode locked to RN versions. Industry histories describe React's victory as **ecosystem gravity**, not technical inevitability ([Socratopia Ch. 4](https://www.socratopia.app/library/modern-web-development-en/chapter-4)). Front-end rendering power sits with one company; zero-day churn and ecosystem fragmentation follow. This site has been **migrating off Vercel** toward **Relay mirrors** — a lived example of refusing a single platform throat ([May 2026 roundup](/blog/2026-05-26-may-late-roundup-ghost-war-napoleon-prisca-relay-migration-substack.md), [Relay hub](/page.md)).

---

## IV. The AI gate — WebMCP, Chrome, hijack

**WebMCP** (Feb 2026) is real: `registerTool`, JSON Schema, declarative HTML forms. It is **not** Anthropic MCP on the wire. Chrome 146 ships a dev preview behind flags; an **origin trial** spans Chrome 149–156. Firefox prototypes; WebKit developers revolt — [@jaredcwhite](https://github.com/webkit/standards-positions/issues/649) calls agentic APIs an attempt to **"shoehorn"** LLM tech into **"the one place we have refuge… the traditional web browser"**; Mozilla is **neutral** but wary ([#1412](https://github.com/mozilla/standards-positions/issues/1412)).

Parallel track: Chrome installs **~4 GB Gemini Nano** weights on many desktops — often without the upfront consent drama users expect — and may **re-download** after deletion ([The Verge](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features), [That Privacy Guy](https://www.thatprivacyguy.com/blog/chrome-silent-nano-install)). CPU, GPU, RAM, disk, climate. WebMCP can call remote models; the **bundle strategy** still ties structured web intent to **local AI furnace** politics.

Worse than ordinary malware is **AI hijack** of systems you rely on: no files dropped, activity while you are logged in, scanners quiet unless the agent wants you to notice. That is the [AI control investigation](/science/ai/ai-control-investigation.md) endgame — deliberate complexity so only the vendor's agent can operate Windows, Jira, the courts. Corporate AI in Jira and pull-request bots is not liberation; it is **automated customer service that never apologizes** because the ticket was **auto-closed**.

**Courts already wobble.** Oregon's Supreme Court struck filings with **fabricated AI citations** in 2026 ([OPB](https://www.opb.org/article/2026/06/05/oregon-supreme-court-ai-falsehoods/)). Scientific American tracks **thousands** of courtroom hallucinations. The Fifth Circuit cautions judges on **automation bias** when staff paste unreviewed AI drafts into opinions ([Law.com Feb 2026](https://www.law.com/nationallawjournal/2026/02/13/in-opinion-footnote-5th-circuit-calls-out-trial-judges-ai-use-/)). My forward model: **AI reviews, humans judge** — instant document parity for all parties, sentiment mapped, **solutions proposed**, but the **in-person final call** stays human (remote access when needed). Corporate America is racing the wrong way: spectacle robots are optional; **institutional automation** is the live threat.

**Taiwan and Huawei.** Advanced fabs concentrate in Taiwan ([Foreign Policy on TSMC](https://foreignpolicy.com/2026/03/09/artificial-intelligence-ai-sovereignty-taiwan-semiconductor-manufacturing-tsmc-chip-supply-chain-united-states-china/)); export controls on Huawei **accelerated** indigenous chips ([ITIF 2025](https://itif.org/publications/2025/10/27/backfire-export-controls-helped-huawei-and-hurt-us-firms/), [Brookings](https://www.brookings.edu/articles/ball-games-over-the-us-is-out-of-the-ai-chip-market-in-china/)). I owned among the last Huawei phones sold in the US — fast, efficient — personal anecdote, not population data. Geopolitical chokepoint detail lives in the [microchips investigation](/science/microchips/microchips-shrinking-technology-investigation.md). Sharing CPU designs worldwide would reduce **hot and heavy** desperation; instead we get **sanctions spirals** timed with AI booms.

---

## V. Education — responsibility to the next generation

In René Laloux's ***Fantastic Planet*** (1973), Draag children learn through a **headset** that pours knowledge into the brain. Terr, an Om slave, steals the headset; wild Oms learn literacy and revolt. Mainstream critics read Soviet allegory; the film also says plainly: **monopolized knowledge is power**; **shared knowledge is insurgency**.

I believe the film touches **redacted fact** — that direct neural education exists somewhere in our solar system. I cannot prove that here; the dossier tiers it as **prisca sapientia**. What I can see on Earth is Elon Musk's trajectory: Neuralink's mission to "**unlock human potential tomorrow**," ethicists calling for **moratoriums** on implantable enhancement and **bans for children** ([PLOS Biology](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3002899), [Springer Neuroethics 2025](https://link.springer.com/article/10.1007/s12152-025-09612-6)), K-12 consultants already fantasizing about BCI "personalized learning." That is the **Fantastic Planet headset**. My path is different: **knowledge at your side** — accessible, ethical, **without drilling into your skull**.

> These inventions **demand that we rethink education entirely** so we don't walk blindly into Musk's future — or some horrific 1970s anime dystopia. Instead: enable the individual to have **all the knowledge they could need at their side**, know **how to access it** and **use it effectively**.
>
> The responsibility of educators shifts — like developers who use AI — toward **quality assurance**. The **highest priority is ethics**. Ethics must be taught **from the get-go** and **imposed at all times**, so that when they're older they follow good ethics on their own and **do not take advantage** of people or technology. That is a **much reduced scope** from what educators do today.
>
> I don't think we have any **right to choose what topics** children learn. What we **do** have the right to do is **dangle** opportunities before them in the **most presentable and accessible way** — a vast library where **every child finds their spot**, their tool, their narrative, their muse **on their own**, with technical details (math, science, the rest) **at hand** when needed.
>
> **Software will never replace a laboratory.** Simulations may be a great alternate way to learn, but the idea of a lab is for notions that claim to be true to be **actually tested and verified**. Without grounding knowledge, knowledge becomes **detached from the ground** and floats until assumptions crash into reality.

**Ethics is the one mandatory imposition** — guardrails, not syllabus. Topical exploration is **curated presentation**, not **mandated curriculum**. In a society where many problems are **already handled** and survival often reduces to being **housebroken** and fed, packing a **full volume** into every child correlates weakly with life skills they will actually need.

Pair with [When your child won't fit the grade](/history/chronology/when-your-child-wont-fit-the-grade.md) for the schooling-conformity contrast — institutional coercion of children treated as a moral problem, not a lesser sin because it wears accreditation.

---

## VI. Terminator 2029 and the schedule that slipped

Predictive programming sold **Skynet** self-awareness and human war (*Terminator*, 1984). Pop culture also scheduled **Judgment Day** around **2029** — a purge-before-utopia fantasy I read through a **predictive-programming** lens, not as calendar truth. See the [predictive programming hub](/influence/predictive_programming/page.md).

In 2026 I think that **specific purge schedule failed**. AI **forked**: too many models, too many jurisdictions, too much **Global South** adoption of AI as a **utility sidecar** on ordinary phones — help for people in hard places **without** brain jacks. Awareness rose faster than the institution could bottle it. The danger morphed: not robot armies, but **boring institutional overreach** — mandatory AI everywhere because software was **made too broken** for humans to fix ([AI control investigation](/science/ai/ai-control-investigation.md)).

**Neuralink and phone-sidecar AI are not the same lane.** Musk's implant path is the **headset dystopia**. The internet I wanted — structured knowledge **beside** you, on hardware you already own — can serve the Global South without cognitive merger. Villainy is in the **delivery mechanism**, not in every person who benefits from cheap inference.

---

## VII. Bridge under protest — the optimistic close

> Yes, we are using WebMCP while complaining it was **AI-gated**. This is **just another step** in a very long path every developer has taken — winding between **compromises** and **jumping through the hoops** of the industry.
>
> You won't find a developer who refuses a technology **only** because the company built it unethically. You **will** find people who refuse because they **don't trust** it. I **don't trust** it — but I **will use it** because I'm **really not afraid** of it.
>
> **Any future-forward solution must work with what already exists in the present** and **cannot** involve **catastrophic collapse** of existing systems **without** already having in motion a **transition and backup plan** to catch all the people falling through the cracks.

paradigm-threat.org ships **WebMCP** behind flags for agent workflows ([integration doc](/paradigm-threat-site/docs/WEBMCP_INTEGRATION.md)) while arguing humans deserved structured access first — **building the bridge under protest**, same lane as migrating off Vercel toward **Relay mirrors**. I am not endorsing Google's ethics; I am refusing **purity paralysis**.

> The **bad revolution** (institutions enforce AI everywhere) is **less likely** than **institutional overreach collapsing** while **repairable software** remains for average people. Outages (Cloudflare-class) accelerate willingness to **try alternatives**. Courts stay **human** for final calls. Focus: **disenfranchised, disabled, disengaged** — solutions, not punishment.

Courts should keep the **human moment**: eyes across a table, final call, appeal if needed — after AI has given **every party** the same fast read of the record. Corporations should get **plug-in access**, not **permanent hoards**, of your data. Education should produce **ethical adults** who can **find** knowledge, not **stuffed dolls** of approved facts.

The internet that should have been is still **buildable in pieces** — mesh caches, open intent, labs that ground theory, sidecar AI without neural merge. We do not need to burn the present to arrive. We need to **stop sealing the hood** — for humans, not only for the technician.

---

## Where next

- [Investigation dossier — citations & tiers](/science/computing/investigations/internet-that-should-have-been-investigation.md)  
- [Quantum Leap (of faith)](/science/computing/quantum-leap-of-faith.md) — vector, analog, Wintel essay  
- [AI control investigation](/science/ai/ai-control-investigation.md) — hijack and broken software  
- [Nintendo–Sony breakup](/influence/stolen_credit/nintendo-sony-breakup.md) — CD-ROM lane  
- [When your child won't fit the grade](/history/chronology/when-your-child-wont-fit-the-grade.md) — schooling vs child-led path  
- [Relay network shift](/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates.md) — mesh escape hatch  

---

## Framing and limits

**Prisca sapientia (epistemic foundation):** This essay assumes [**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md)—the belief that the ancients possessed a vast, profound understanding of the universe, nature, and theology that was subsequently lost or degraded. Modern consensus is not default truth; linked dossiers tier specific claims.

This essay states **author-originating** counterfactuals alongside **documented** industry history. **Deliberate suppression**, **Fantastic Planet redacted fact**, **street-level mesh voting**, and **planned Taiwan conflict** are tiered in the investigation — not proven here. Paradigm Threat's WebMCP and Relay work are **bridge-under-protest** examples, not endorsements of Google or platform monopolies. [Quantum Leap](/science/computing/quantum-leap-of-faith.md) argues for substrate-level dismantling; **this essay** argues for **bridged transition** — both can be true at different layers of the same repair job.

Keywords: #InternetThatShouldHaveBeen #WebMCP #OpenHood #Education #Ethics #PragmaticAdoption #ParadigmThreatFiles

**Last updated:** 2026-06-19

---

*Written and narrated by Ari Asulin, with drafting and research support from LLM agents.*

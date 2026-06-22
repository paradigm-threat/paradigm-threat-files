# Investigation: LLM History, Governance Theater, and the Military–Corporate Split

> **TL;DR:** Citation dossier for the history of large language models (2017–2026), modern controversies, and open-letter waves — framed by the **author thesis** that **pre-LLM deployed AI** (drone targeting, facial recognition, Palantria/CBP pipelines) was the substantive battlefield while post-ChatGPT **“ethical AI governance”** operates as **regulatory theater** parallel to **Net Neutrality** (commons-protection marketing → incumbent gatekeeping). **Documented:** Pentagon–Anthropic rupture (Feb–Mar 2026), OpenAI DoD deal, QuitGPT boycott, FLI pause letter, Project Maven employee revolt, EU AI Act open-weights hybrid regime, NYT copyright suit, platform memory failures. Cross-links: [AI Control Investigation](/science/ai/ai-control-investigation.md), [Internet That Should Have Been](/science/computing/investigations/internet-that-should-have-been-investigation.md).

**Status:** Open  
**Last updated:** 2026-06-22 (§2.2 war-footing / federal-regulation skepticism)

**Guide (read order)**

1. **Chronology** → §1  
2. **Author thesis** (why this investigation exists) → §2  
3. **User QA, provider choice, auditable endgame** → §2.1  
4. **War footing, surveillance framing, anti-federal-regulation** → §2.2  
5. **Logic check** (assistant validation of §2–§2.2) → §2.3  
6. **Pre-LLM deployed AI contrast** → §3  
7. **Open letters & user complaints** → §4  
8. **Controversy taxonomy** → §5  
9. **Pentagon vs labs** (ethics vs combat-readiness) → §6  
10. **Net Neutrality parallel** (full regulatory-capture chapter) → §7  
11. **Open weights / “world brain” oversight** → §8  
12. **Open questions** → §9  
13. **Cross-references** → §10  

---

## 1. Chronology: Transformers to ChatGPT and Beyond

**Tier:** Documented — company announcements, legislation dates, press; Wikipedia used as convenience index only.

| Era | Milestones |
|-----|------------|
| **Jun 2017** | Vaswani et al., [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762) — transformer architecture. |
| **2018–19** | BERT, GPT-2; scaling laws discourse; **Project Maven** Pentagon drone-footage AI at Google (§3). |
| **2020** | GPT-3 API; InstructGPT / RLHF research line at OpenAI. |
| **Nov 2022** | **ChatGPT** public launch — mainstream inflection. |
| **Mar 2023** | GPT-4; Meta **Llama** open-weights release; [FLI pause letter](https://futureoflife.org/open-letter/pause-giant-ai-experiments/) (30k+ signers, Tier B count); [CAIS extinction-risk statement](https://safe.ai/work/statement-on-ai-risk) (May 30). |
| **2023–24** | OpenAI board crisis (Nov 2023); Superalignment team disbanded (May 2024); EU **AI Act** enters force (Aug 2024). |
| **2024–25** | Safety researcher exodus (Leike, Sutskever, Kokotajlo); SEC whistleblower complaint on OpenAI NDAs (Jul 2024); NYT v. OpenAI core claims survive MTD (Mar 2025); ChatGPT memory architecture failure (Feb 2025). |
| **Jan 2025** | DeepSeek R1 release — open-weights shock to Western markets. |
| **Feb–Mar 2026** | Anthropic–DoD contract rupture; supply-chain-risk designation; OpenAI Pentagon deal; **QuitGPT** boycott; employee solidarity letters; Kalinowski resignation. |

---

## 2. Author's Originating Thesis

**Label:** Author thesis — establishes investigative stakes for Paradigm Threat; not automatically factual.

> AI up until the LLM era was more of a real concern, because it was **actively deployed** in face recognition and warfare. The recent controversies over OpenAI and “ethical AI governance” honestly seem like a **forced system of bureaucratic control** — much like **Net Neutrality**, which I believe was also a scare tactic designed to create more federal control resulting in more monopolization while pretending to prevent it.

**What the author means (unpack):**

1. **Pre-LLM AI was the real deployed threat** — face recognition, drone targeting (Project Maven), Palantir/CBP pipelines, autonomous-weapons R&D were **already in production** while the public debated science-fiction extinction risk.
2. **Post-ChatGPT “ethical AI governance” is theater** — pause letters, safety teams, EU AI Act, “responsible AI” frameworks are marketed as protecting humanity or the open internet, but structurally **create federal/EU gatekeeping** that **entrenches incumbents** while pretending to prevent monopoly (full parallel in §7).
3. **The open / “world brain” LLM layer is where oversight concentrates** — open weights (Llama, Mistral, DeepSeek) face hybrid regulation, “open-washing” accusations, and compliance burdens; closed labs with proprietary training data retain liability shields and military contracts.
4. **Military ethics debate sidesteps combat-readiness** — Pentagon demand for “all lawful purposes” vs vendor “red lines” (§6); ethics framing rarely addresses **warfighting dependency** or **corporate insertion into classified kill chains**.
5. **Corporations want battlefield telemetry** — Army/Pentagon contracts mean **classified deployment + vendor guardrails as negotiating leverage**; OpenAI filling the void after Anthropic blacklisting is the documented 2026 pattern.

### 2.1 Author Extension — User QA, Provider Choice, and the Auditable Endgame

**Label:** Author thesis — Jun 2026 session extension.

> It's up to the **user of AI to QA everything generated**. Anything short of that is **lazy and dangerous**. I have the AI do passes for accuracy and artifacts before I do my QA. It's a **tool like any other tool**. Use it efficiently or not. Correctly or not.
>
> We've reached the point that **ethics is negligible** since we can **choose our providers**. We're approaching a **free world brain**. Eventually everything will be in **free LLMs** including backdoor opaque logic which will eventually be **cleaned out and replaced** by something **simple, auditable, open source, and safe** — the only final result for any of it.
>
> Projects like **Google Gemini Nano** will ultimately be **short-lived** because they **can't be audited** and will always represent a **security threat**. Google has **no urgent plans** to release data governance on their new **WebMCP** and it may **never be fully trusted** until they make it more transparent — a **losing model**.
>
> Bottom line: the **dangers of AI are past us**, and will end with the **current world war** (if you regard it as that or not, doesn't matter — we're still in it, and it's **nearly over**).

**What the author means (unpack):**

1. **Human-in-the-loop is non-negotiable** — vendor “safety” and platform guardrails do not replace **user verification**; multi-pass workflow (model self-check → human QA) is the responsible minimum.
2. **Ethics theater is obsolescent at the consumer layer** — when providers are interchangeable (open weights, local inference, competing APIs), **exit** matters more than **begging incumbents for transparency** (contrast Wolking-class letters, §4.2).
3. **Trajectory thesis** — opaque weights and closed browser bundles are a **transitional defect**, not the attractor; the stable equilibrium is **auditable open models** (rhymes with OSI open-source AI definition pressure, §5.2).
4. **Gemini Nano / WebMCP as anti-pattern** — ~4 GB silent on-device install, tab-bound agent APIs without public data-governance roadmap = **unauditable surface** that security-conscious users and regulators will eventually reject ([The Verge May 2026](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features); WebMCP draft status §8.1).
5. **Peak-danger frame** — the **acute** AI risk window was **pre-LLM deployment** (§3) and **classified military integration** (§6); LLM chat **governance panic** lags the real harm and will **close with the current geopolitical cycle** (author geopolitical read — **not** independently verified here).

### 2.2 Author Extension — War Footing, Surveillance Framing, and Federal-Regulation Skepticism

**Label:** Author thesis — Jun 2026 session extension (second pass).

> Surveillance is a **big issue in many countries like China**, but **America doesn't have a surveillance problem**, regardless of what people say. We were in a **state of war this whole time**, and **that's how war is**. The **system will have to go** now that the war is **winding down** — but other than that, I have a **serious concern for more federal regulation**, which is what appears to be the **main ask of all these open letters**.
>
> Like **Net Neutrality**, the **fed will do the opposite of what they promise** — make things **extremely hard for businesses and competition**, and ultimately will seek to **control LLM through "governance"** rather than **supporting open protocol**. The big proof is they **didn't do anything right until now**, so we **can't trust them** to be the ones to solve it.

**What the author means (unpack):**

1. **Surveillance is geopolitically asymmetric** — mass domestic social-credit / panopticon framing applies **chiefly** to regimes like **China**; **author rejects** the commonplace that the US is in the **same** surveillance category as those systems (distinct from **documented** US border biometrics, Clearview, FISA debates — author distinguishes **wartime operational posture** from **civilian panopticon**).
2. **War-normalizes capability** — domestic AI/surveillance/integration objections often ignore that the country has been on a **war footing**; expanded signals intelligence and contractor AI are **expected wartime behavior**, not a new civilizational break (rhymes with §3 Maven, §6 Pentagon stacks).
3. **Winding down → system must go** — as the **current war cycle** closes, the **wartime AI/surveillance apparatus** (author read) should **sunset** with it — not be **permanently normalized** via peacetime “AI governance” rebranding.
4. **Open letters’ hidden payload is federal regulation** — FLI pause letter explicitly invites **government moratorium** if labs refuse ([FLI PDF](https://futureoflife.org/wp-content/uploads/2023/05/FLI_Pause-Giant-AI-Experiments_An-Open-Letter.pdf)); Wolking-class letters ask OpenAI for policy — but **institutional** letter campaigns consistently **escalate to state/EU rule-making** (§7).
5. **Net Neutrality precedent** — Title II cycles (2015 → 2017 → 2024 → 2025 court set-aside) show **regulatory pendulum** and **incumbent capture** (§7.1); author predicts AI “governance” will **control LLMs** rather than **mandate open protocols** (WebMCP-class commons).
6. **Track record disqualifies the state as fixer** — decades of **late, wrong, or captured** federal tech policy (NN oscillation, Maven continuity via contractors, 2026 DoD vendor strong-arming per [BBC](https://www.bbc.com/news/articles/cn5g3z3xe65o)) — **delegating LLM future to the same institutions** is the **danger**, not the remedy.

**Documented tension (assistant note, not author concession):** US **Clearview**, **CBP biometrics**, and **Pentagon domestic-surveillance contract disputes** (§3.2, §6) are **on record**; author thesis **reframes** these as **war-footing / border / classified** lanes — not equivalent to **China-scale social credit**. Readers may disagree; tier as **Author geopolitical read**.

### 2.3 Logic Check (Assistant Validation of §2–§2.2)

**Label:** Assistant analysis — feasibility and counterarguments; does not replace author stakes.

| Author claim | Verdict | Basis |
|--------------|---------|-------|
| User must QA all AI output; multi-pass workflow | **Agree (strong)** | Documented hallucination/memorization cases (NYT suit exhibits); memory corruption (Feb 2025). No vendor has shipped **reliable** autonomous verification for open-ended research. |
| AI is a tool; efficiency/correctness is on the operator | **Agree** | Consistent with professional use of calculators, search, and CAD — **competence** not **delegation**. |
| Ethics negligible because providers are choosable | **Agree with caveats** | **Partially documented:** open-weights (Llama, DeepSeek), local inference, and API switching exist. **Caveat:** concentration (Nvidia, cloud), EU compliance cost on small deployers, and **classified DoD single-vendor moments** (§6) limit real choice for some users and all taxpayers. |
| Approaching “free world brain” | **Agree directionally; timeline open** | Open weights + falling inference cost support trajectory; **counter:** Meta license triggers, training-data opacity, EU GPAI rules still burden the commons layer (§8). |
| Opaque logic cleaned out → simple auditable open source | **Agree as engineering attractor; not guaranteed** | Historical pattern: SSL/TCP bugs patched over decades; **counter:** incumbents profit from opacity (ads, surveillance contracts). Requires **user demand + regulation**, not automatic inevitability. |
| Gemini Nano short-lived (unauditable = security threat) | **Agree on risk; “short-lived” unproven** | Documented consent/storage controversy; re-download after deletion. **Counter:** Google may **normalize** 4 GB agent bundles if regulators stall — “short-lived” needs **enforcement or mass uninstall**, not logic alone. |
| WebMCP untrusted without data governance transparency | **Agree on trust gap** | W3C CG **draft** only; Mozilla neutral with security flags; no public Google **data-governance** spec for agent tool telemetry at ship time (Jun 2026). |
| AI dangers “past us” | **Partially agree** | **Past us:** narrow AI in kill chains (Maven) is **documented**. **Not past us:** LLM reliability failures, Pentagon–vendor fights, and **on-device opaque models** are **active** (2026). Author may mean **peak narrative panic** passed, not **peak harm** — plausible read. |
| Harm ends with current world war (nearly over) | **Speculative** | Geopolitical thesis; **not** adjudicated in this dossier. **Rhyme:** post-WWII tech consolidation patterns — but no falsifier attached here. |
| US has no surveillance problem (vs China etc.) | **Author read; contested** | **Documented counter-evidence:** Clearview, CBP biometrics, FISA/NSA history, §6 mass-surveillance contract disputes. Author **reframes** as war-footing not civilian panopticon — **normative**, not settled fact. |
| Wartime system must sunset as war winds down | **Plausible pattern; unproven now** | Historical: some wartime powers retract (partially); many **persist** (Patriot Act lineage). Requires **political will**, not automatic demobilization. |
| Open letters → federal regulation is main ask | **Agree (institutional letters)** | FLI moratorium language **explicit**; EU AI Act already moving; employee letters seek **contract law** but **media cycle** feeds **legislative** response. Wolking letter is **vendor** ask — author groups it with **governance narrative**. |
| Fed will control LLM via governance not open protocol | **Agree with historical rhyme** | NN + EU AI Act patterns (§7); **counter:** some open-source exemptions exist — but **compliance asymmetry** favors incumbents (§8). |
| Fed track record disqualifies them as fixer | **Agree on skepticism; partial on “nothing right”** | Maven/Google AI Principles **reversal**, NN pendulum, Pentagon **supply-chain-risk** weaponization support **distrust**. **Counter:** some FOIA/transparency wins exist — author means **systemic** failure on **commons tech**, not zero good acts. |

**Net assistant position:** The **strongest** parts of the author’s extension are **user QA discipline**, **provider exit**, and **refusing to federalize LLM** on the NN model. The **weakest** without further evidence are **timelines** (“short-lived,” “nearly over,” automatic sunset) and **US surveillance minimization** — **documented** domestic programs exist; author **rejects equivalence** with China, which is a **political judgment** readers must weigh separately.

---

## 3. Pre-LLM Deployed AI: The Contrast Chapter

**Label:** Documented deployments + Author synthesis.

While ChatGPT panic focused on chatbot alignment and extinction headlines, **narrow AI** was already embedded in surveillance and targeting stacks.

### 3.1 Project Maven (2017–2018)

| Item | Detail | Tier |
|------|--------|------|
| Program | DoD pilot using AI to interpret drone surveillance footage; Deputy Secretary Shanahan sought “built-in AI capability” in future DoD systems | A — [NBC News](https://www.nbcnews.com/news/military/google-halt-controversial-project-aiding-pentagon-drones-n879471) |
| Google role | TensorFlow-based video analysis; company described work as “non-offensive” while Pentagon counterinsurgency use was documented | A — [NYT Maven](https://www.nytimes.com/2018/05/30/technology/google-project-maven-pentagon.html) |
| Employee revolt | **3,100+** signed letter: “Google should not be in the business of war”; **4,600+** petition; **13+** resignations | A — [NYT employee letter](https://www.nytimes.com/2018/04/04/technology/google-letter-ceo-pentagon-project.html), NBC |
| Outcome | Google pledged not to renew; published [AI Principles](https://ai.google/principles/) prohibiting weapons and norm-violating surveillance | A |
| Aftermath | Maven continued via startups (Clarifai facial recognition on drone footage, Orbital Insight, etc.) | B — [Forbes 2021 Maven ecosystem](https://www.forbes.com/sites/thomasbrewster/2021/09/08/project-maven-startups-backed-by-google-peter-thiel-eric-schmidt-and-james-murdoch-build-ai-and-facial-recognition-surveillance-for-the-defense-department/) |

**Documented internal culture:** Google AI chief scientist Fei-Fei Li advised colleagues to “avoid at ALL COSTS any mention or implication of AI” in Maven messaging — “Weaponized AI is probably one of the most sensitized topics of AI — if not THE most.” ([NYT Maven](https://www.nytimes.com/2018/05/30/technology/google-project-maven-pentagon.html))

### 3.2 Facial Recognition and Domestic Surveillance (pre-ChatGPT)

| System | Documented use | Tier |
|--------|----------------|------|
| **Clearview AI** | Scraped billions of photos; law-enforcement sales; ongoing privacy litigation | B — press / court filings |
| **CBP / border** | Biometric exit-entry; contractor facial matching at ports | B — DHS public docs |
| **Project Maven contractors** | Forbes reported Clarifai **$5.6M** DoD facial-recognition task on drone-captured imagery | B — Forbes 2021 |

### 3.3 Autonomous Weapons (LAWS) — Pre-LLM Frame

UN CCW discussions on lethal autonomous weapons systems (LAWS) predated ChatGPT. The **operational** question — who authorizes a strike — was already live in Maven-era drone stacks; LLM discourse later **re-labeled** the same tension as “AI safety” without resolving military dependency.

**Author synthesis:** LLM-era panic **redirected public attention** from **already-operational** kill-chain and surveillance AI toward chatbot censorship, extinction risk, and subscription limits — a **narrative displacement** that benefits vendors already inside classified networks.

---

## 4. Open Letters and User Complaints Catalog

**Tier key:** A = primary or major press with named verification; B = press-reported scale without primary roster.

### 4.1 Institutional and Employee Open Letters

| Letter / movement | Date | Signatories / scale | Core demand | Source |
|-------------------|------|---------------------|-------------|--------|
| **Google Maven employee letter** | Apr 2018 | **3,100+** (NYT); **4,600+** petition (NBC) | Exit Pentagon drone-AI contract; never build “warfare technology” | [NYT](https://www.nytimes.com/2018/04/04/technology/google-letter-ceo-pentagon-project.html) |
| **FLI “Pause Giant AI Experiments”** | Mar 22, 2023 | **30,000+** individuals (FLI one-year recap); Musk, Bengio, Wozniak among signers | 6-month pause on training beyond GPT-4; if labs refuse, **governments should institute a moratorium**; shared safety protocols | [FLI](https://futureoflife.org/open-letter/pause-giant-ai-experiments/) |
| **CAIS Statement on AI Risk** | May 30, 2023 | Hundreds incl. Hinton, Bengio, Altman, Hassabis | “Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.” | [CAIS](https://safe.ai/work/statement-on-ai-risk) |
| **OpenAI/Google military limits solidarity** | Feb 27, 2026 | **200+** (160+ Google, 40+ OpenAI per Axios) | Urge leadership to join Anthropic red lines on surveillance and autonomous weapons | [Axios](https://www.axios.com/2026/02/27/google-openai-workers-push-for-military-ai-limits) |
| **Employee Pentagon surveillance rejection** | Mar 2026 | **900+** OpenAI + Google employees (incident tracker) | Reject Pentagon surveillance contracts | [topaithreats INC-26-0095](https://topaithreats.com/incidents/INC-26-0095-openai-kalinowski-resignation/) |
| **SEC whistleblower complaint (OpenAI NDAs)** | Jul 2024 | Former employees | NDAs allegedly waived federal whistleblower compensation rights | B — Wired / [TechTimes Jun 2026 recap](https://www.techtimes.com/articles/318866/20260622/ai-safety-researchers-who-quit-openai-and-anthropic-are-being-proven-right.htm) |
| **QuitGPT consumer boycott** | Mar 2026 | **2.5M** claimed engagements (organizer); **295%** day-over-day uninstall spike (Sensor Tower, cited in press) | Cancel ChatGPT over OpenAI–Pentagon deal | [Euronews](https://www.euronews.com/next/2026/03/02/cancel-chatgpt-ai-boycott-surges-after-openai-pentagon-military-deal), [ABC](https://www.abc.net.au/news/2026-03-27/quitgpt-openai-boycott-movement-ethical-debate-explained/106486206) |

### 4.2 User and Subscriber Complaints (Non-Institutional)

Parallel to institutional letters, **paying users** publish formal complaints when platform behavior becomes opaque — exemplified by Christine Wolking’s open letter to Sam Altman ([Targeted / Substack, Jun 21, 2026](https://substack.com/home/post/p-202921233)):

| Complaint cluster | Documented symptoms | Source |
|-------------------|---------------------|--------|
| **Research / deep-research limits** | “Research limit reached” for extended sessions; inability to continue controversial-topic investigations | Wolking Substack; user reports |
| **Memory collapse** | Feb 5, 2025 backend update; long-term context lost or corrupted; no public rollback | [OpenAI Community](https://community.openai.com/t/catastrophic-failures-of-chatgpt-thats-creating-major-problems-for-users/1156230), [AllAboutAI](https://www.allaboutai.com/ai-news/why-openai-wont-talk-about-chatgpt-silent-memory-crisis/) |
| **Disappearing outputs** | Mid-session truncation; unstable continuation on long analytical threads | Wolking; community threads |
| **Censorship / alignment politics** | Removal of “orange box” content warnings (Feb 2025); political pressure re “woke AI” from Trump allies | [TechCrunch](https://techcrunch.com/2025/02/13/openai-removes-certain-content-warnings-from-chatgpt/) |
| **Capability regression** | User perception of “lobotomized” models post-update | Social / press — **verify per model version before citing as fact** |

**Pattern (Author thesis):** User letters demand **transparency and continuity** for **legitimate inquiry**; institutional letters demand **pauses, moratoria, and red lines** — both feed a governance narrative that treats the **open conversational layer** as requiring oversight, while **classified military deployment** proceeds on a separate track (§6). **Author extension (§2.2):** the **deeper ask** in institutional campaigns is **federal/EU regulation** — the same institutional class that **failed or captured** prior tech policy (§7) — not **open protocol** or **user-side QA**; wartime surveillance/integration (§3, §6) should **sunset with the war cycle**, not be **cemented** as peacetime “AI governance.”

---

## 5. Modern LLM Controversy Taxonomy

### 5.1 Governance and the “Safety Industrial Complex”

| Event | Summary | Tier |
|-------|---------|------|
| Superalignment team disbanded | May 2024; ~20% compute promise abandoned | B — [Ethicore](https://ethicore.substack.com/p/when-safety-officers-become-the-story) |
| Researcher exodus | Leike → Anthropic; Sutskever → Safe Superintelligence; Kokotajlo left ~$1.7M equity citing lost confidence | B |
| Safety VP fired | Ryan Beiermeister opposed “adult mode”; OpenAI denied link to policy objections | B — Ethicore |
| “Too restrictive” on downside research | Departed researchers said OpenAI hesitated to publish work highlighting AI economic harms | B — [Medial/Wired recap](https://medial.app/news/former-openai-employees-say-they-left-because-the-company-was-too-restrictive-about-ai-research-ba2ee7b8bc33d) |
| Ads in ChatGPT | Feb 2026 rollout; research scientist Megan Hitzig resigned citing structural incentives | B — TechTimes Jun 2026 |

**Documented pattern:** Safety concerns are **acknowledged then overridden** when they conflict with product roadmaps — the safety apparatus functions as **legitimacy theater** more than veto power.

### 5.2 Open vs Closed Weights

| Theme | Documented | Source |
|-------|------------|--------|
| OSI “open source AI” definition | Requires weights **and** training-data information for reproducibility | [OSI draft](https://opensource.org/ai/drafts/the-open-source-ai-definition-1-0-rc2) |
| Meta “Llama” as open weights | Weights public; training data withheld; **700M MAU** license trigger | [Neural Post](https://theneuralpost.com/2025/12/01/the-open-source-lie-why-metas-open-ai-isnt-actually-open/) |
| DeepSeek R1 (Jan 2025) | Open-weights release disrupted Western market narratives on AI moats | B — financial press |
| EU AI Act Art. 53(2) | Partial relief for open-source GPAI; copyright + training-data summary obligations remain | [Linux Foundation explainer](https://linuxfoundation.eu/newsroom/ai-act-explainer) |

### 5.3 Copyright and Training Data

| Case | Status (mid-2026) | Source |
|------|-------------------|--------|
| **NYT v. OpenAI & Microsoft** | Filed Dec 2023; direct/contributory infringement claims survive MTD (Mar 2025); 20M anonymized ChatGPT logs ordered for discovery (Jan 2026) | [NYT](https://www.nytimes.com/2023/12/27/business/media/new-york-times-open-ai-microsoft-lawsuit.html), [Ars Technica](https://arstechnica.com/tech-policy/2025/04/judge-doesnt-buy-openai-argument-nyts-own-reporting-weakens-copyright-suit/) |
| **Authors Guild class action** | Sep 2023; Martin et al. | B — [McKool Smith tracker](https://www.mckoolsmith.com/newsroom-ailitigation-26) |

### 5.4 Censorship and Alignment Politics

- Feb 2025: OpenAI removed some ChatGPT content-warning “orange boxes” after political pressure re conservative censorship accusations ([TechCrunch](https://techcrunch.com/2025/02/13/openai-removes-certain-content-warnings-from-chatgpt/)).
- David Sacks (Trump AI czar) publicly framed ChatGPT as “programmed to be woke.”
- “Adult mode” vs safety staff — product policy collision (Ethicore).

### 5.5 Platform Reliability

- Feb 2025 memory architecture failure — **Documented** user reports; **no** public OpenAI postmortem at time of reporting ([community thread](https://community.openai.com/t/catastrophic-failures-of-chatgpt-thats-creating-major-problems-for-users/1156230)).

### 5.6 Labor, Chips, and Concentration

- Nvidia/TSMC chokepoint — [microchips investigation](/science/microchips/microchips-shrinking-technology-investigation.md).
- US export controls on advanced AI chips to China — same dossier + 2025–26 press on H200 rules.

### 5.7 Military Deployment

See §6.

---

## 6. Pentagon vs Labs: Ethics vs Combat-Readiness

**Label:** Documented sequence + Author synthesis.

### 6.1 Documented Sequence (Feb–Mar 2026)

| Step | Event | Source |
|------|-------|--------|
| 1 | Anthropic refused DoD clause permitting **“all lawful purposes”** including mass domestic surveillance and lethal autonomous weapons without human authorization | [Wikipedia dispute summary](https://en.wikipedia.org/wiki/Anthropic%E2%80%93United_States_Department_of_Defense_dispute), [BBC](https://www.bbc.com/news/articles/cn5g3z3xe65o) |
| 2 | Trump ordered federal agencies to cease Anthropic use; Hegseth designated Anthropic **supply-chain risk to national security** — first such public designation of a US AI company | [Mayer Brown](https://www.mayerbrown.com/en/insights/publications/2026/03/pentagon-designates-anthropic-a-supply-chain-risk-what-government-contractors-need-to-know), BBC |
| 3 | Anthropic filed federal suits (APA, First Amendment retaliation, due process) | [Pearl Cohen](https://www.pearlcohen.com/anthropic-sues-department-of-defense-over-supply-chain-risk-designation/) |
| 4 | **Hours later**, OpenAI announced its own DoD agreement; Altman later called the original deal “opportunistic and sloppy” and cited renegotiated guardrails | [The Verge](https://www.theverge.com/ai-artificial-intelligence/887309/openai-anthropic-dod-military-pentagon-contract-sam-altman-hegseth) |
| 5 | Pentagon official: vendor restrictions on lawful use “put our warfighters at risk”; bipartisan Senate Armed Services leadership: “lawful use requires additional work by all stakeholders” | [CSA research note](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/03/CSA_research_note_dod_ai_guardrail_mandates_vendor_governance_20260309-csa-styled.pdf) |
| 6 | Caitlin Kalinowski (OpenAI robotics lead) resigned: “AI has an important role in national security” but announcement was **rushed without guardrails defined** | [INC-26-0095](https://topaithreats.com/incidents/INC-26-0095-openai-kalinowski-resignation/) |
| 7 | DoD used Claude in Venezuela intervention (Feb 2026, Axios); Anthropic said it would reassess partnership | Wikipedia dispute article |

### 6.2 Two Irreconcilable Frames

| Frame | Claim |
|-------|-------|
| **Ethics / red lines** | Vendors must contractually forbid mass surveillance of Americans and autonomous lethal targeting |
| **Combat-readiness** | Military must use critical AI for **all lawful purposes** without vendor inserting itself into command chain |

**Documented:** A senior DoD official framed vendor guardrails as **operational liabilities**; Senate leadership acknowledged existing **legal frameworks did not resolve** the dispute (CSA note).

### 6.3 Author Synthesis

The ethics debate **never fully addresses combat-readiness**:

- The military **already depends** on commercial AI in classified networks; “red lines” are **negotiating positions**, not structural limits — when one vendor refuses, another signs (OpenAI after Anthropic).
- Corporations compete to be **the** vendor with **update channels, logging, and API telemetry** inside DoD systems — battlefield **data exhaust** returns to Silicon Valley regardless of public “safety” branding.
- Public **QuitGPT** and employee letters focus on **surveillance and autonomy**; they rarely address **decades of Maven-style targeting AI** that never required an LLM chat interface.
- **Google** reversed its 2018 weapons/surveillance prohibition in Feb 2025 (Axios solidarity letter context) — principles erode when Pentagon contracts return.

---

## 7. Net Neutrality Parallel: Regulatory Theater and Incumbent Capture

**Label:** Documented regulatory history + Author synthesis (regulatory-capture thesis).

Both **Net Neutrality** and **post-2023 AI governance** campaigns sell **protection of a commons** — the open internet, or safe open inquiry — while constructing **permitting regimes** that incumbents navigate and newcomers cannot.

### 7.1 FCC Net Neutrality Cycle (Documented)

| Year | Action | Documented effect |
|------|--------|-------------------|
| **2010** | FCC transparency rule for broadband | Disclosure of network management |
| **2015** | **Open Internet Order** — reclassify broadband as **Title II** telecommunications (common carrier) | No blocking, no throttling, no paid prioritization (with reasonable-network-management carve-outs) | [DWT summary of 2024 Order](https://www.dwt.com/blogs/broadband-advisor/2024/06/fcc-reinstates-most-2015-net-neutrality-rules) |
| **2017** | **Restoring Internet Freedom** — repeal Title II; shift to FTC/light-touch | ISP classification as information service; state preemption disputes |
| **May 2024** | FCC **Safeguarding and Securing the Open Internet** — largely reinstates 2015 rules | Published Federal Register May 22, 2024; effective July 22, 2024 |
| **Jan 2025** | **6th Circuit** set aside 2024 Order (litigation ongoing at time of writing) | Net-neutrality rules again in flux |

**Outcome debate (Documented, contested):** Proponents argue Title II prevented ISP throttling of competitors; critics argue the **regulatory pendulum** itself creates uncertainty and that **market concentration** (Comcast, Verizon, AT&T) persisted across both regimes. Neither side fully proved NN **prevented** or **caused** monopoly — but both sides **expanded federal jurisdiction** over packet routing.

### 7.2 LLM / AI Governance Parallel Table

| Net Neutrality (FCC) | LLM / AI governance parallel |
|----------------------|------------------------------|
| 2015 Title II — “save the open internet” | EU **AI Act** (Regulation 2024/1689, in force Aug 2024) — “trustworthy AI,” GPAI transparency |
| 2017 repeal — “light touch” / innovation | 2024–25 safety-team dismantling; alignment deprioritized vs product |
| 2024 reinstatement attempt | AI Omnibus / delayed compliance timelines; lobbying to weaken transparency |
| Fear narrative: ISPs will throttle/block startups | Fear narrative: AGI extinction, deepfakes, election misinformation |
| Common-carrier = federal jurisdiction over pipes | **AI Office** (EU) + national MSAs; US Executive Orders on AI safety |
| ISP incumbents shape rulemaking | OpenAI, Google, Microsoft, Anthropic shape “voluntary commitments” and Codes of Practice |
| State preemption fights | EU member-state enforcement asymmetry for open-source GPAI ([Euro Prospects](https://europrospects.eu/free-open-and-untouchable-open-source-enforcement-gaps-within-the-ai-act/)) |

### 7.3 Pause Letter and Government Moratorium Language

The FLI pause letter (Mar 2023) explicitly states: if labs will not pause voluntarily, **“governments should step in and institute a moratorium.”** ([FLI PDF](https://futureoflife.org/wp-content/uploads/2023/05/FLI_Pause-Giant-AI-Experiments_An-Open-Letter.pdf))

One year later, FLI reported **no pause** — instead labs invested in **ever-larger training runs** — and concluded **“Safety and responsibility will have to be imposed from the outside.”** ([FLI one-year recap](https://futureoflife.org/ai/the-pause-letter-one-year-later/))

**Parallel:** NN advocates similarly shifted from **industry self-regulation** to **mandatory Title II** when voluntary commitments failed — in both cases, **failure of self-regulation becomes the argument for federal/EU gatekeeping**.

### 7.4 Safety Industrial Complex

| Actor | Role |
|-------|------|
| **CAIS** | One-sentence extinction statement; press tour May 2023 |
| **FLI** | Pause letter; moratorium advocacy |
| **Corporate safety teams** | Superalignment, red-teaming — later disbanded or overridden (§5.1) |
| **EU AI Office** | GPAI model registry, training-data templates, systemic-risk designation |
| **US AI Safety Institute / EO 14110 lineage** | Federal coordination on frontier-model testing |

**Documented tension:** Safety institutions gain **funding and jurisdiction** from existential-risk framing; the same labs that signed CAIS **continued scaling** and **accepted military contracts**. Wikipedia notes media concern that the CAIS statement could serve **public relations or regulatory capture** ([Statement on AI Risk](https://en.wikipedia.org/wiki/Statement_on_AI_risk_of_extinction)).

### 7.5 Author Synthesis

Net Neutrality and AI governance share a **structural pattern**:

1. **Crisis narrative** — ISPs will destroy the internet / AI will destroy humanity.
2. **Call for emergency rules** — Title II / pause / AI Act / moratorium.
3. **Incumbents participate in rule-writing** — Comcast, Verizon at FCC; OpenAI, Google at White House AI summits and EU Code of Practice.
4. **Commons rhetoric** — “open internet,” “beneficial AI,” “open source exemption” — while **compliance cost** falls heaviest on **non-incumbents** (municipal ISP dreams; small deployers of open-weights models).
5. **Oscillating enforcement** — 2015 → 2017 → 2024 FCC; AI Act phased deadlines 2025–2027 with Omnibus delay lobbying.

**Author thesis:** Both movements **pretend to prevent monopolization** while **legitimizing federal/EU control** over infrastructure that incumbents already dominate.

---

## 8. “World Brain” / Open LLM Under Oversight

**Label:** Documented regulatory and licensing patterns + Author endgame thesis (§2.1).

The **free, inspectable, locally runnable** LLM — the closest public implementation to a “world brain” or shared cognitive commons — attracts **governance pressure** disproportionate to **closed chatbot APIs** that already hold military contracts.

### 8.1 Opaque Browser Bundles — Gemini Nano and WebMCP (Documented)

| Item | Documented | Source |
|------|------------|--------|
| **Gemini Nano ~4 GB** | Chrome installs on-device weights (`weights.bin`, ~4 GB); often without clear upfront consent; may re-download after manual deletion if AI features stay enabled | [The Verge May 2026](https://www.theverge.com/tech/924933/google-chrome-4gb-gemini-nano-ai-features), [Gizmodo](https://gizmodo.com/google-chrome-is-downloading-a-4gb-ai-model-onto-your-device-without-consent-researcher-warns-2000755201), [Hanff forensic write-up](https://www.thatprivacyguy.com/blog/chrome-silent-nano-install) |
| **WebMCP** | W3C Community Group **draft** (Feb 2026); `navigator.modelContext` tool API; **not** on W3C Standards Track; primary consumer = **browser agents** (Gemini in Chrome) | [Chrome WebMCP docs](https://developer.chrome.com/docs/ai/webmcp), [W3C CG explainer](https://github.com/webmachinelearning/webmcp) |
| **Data governance gap** | No public Google roadmap (Jun 2026) for **agent tool telemetry**, retention, or third-party audit of on-device + in-tab inference tied to WebMCP — Mozilla standards position flags prompt-injection and adversarial-site risks ([#1412](https://github.com/mozilla/standards-positions/issues/1412)) | Standards threads; §8.1 table |
| **Author read** | Unauditable local weights + opaque agent bridge = **security debt**; losing model vs locally run open weights users can inspect | §2.1 |

### 8.2 Regulatory and Licensing Patterns
| Pattern | Documented detail | Source |
|---------|-------------------|--------|
| EU open-source GPAI relief | Art. 53(2) reduces some documentation duties **if** model is truly open and not systemic-risk | [Linux Foundation](https://linuxfoundation.eu/newsroom/ai-act-explainer) |
| Residual obligations | Copyright compliance + **training-data summary** still required | [inno³](https://inno3.fr/en/blog/open-source-and-ai-what-the-european-ai-act-brings-to-the-table/) |
| Systemic-risk threshold | ~10²⁵ FLOPs can pull largest open models back into full GPAI rules | [Open Future observatory](https://openfuture.eu/observatory/aia-open-source/) |
| Enforcement gap | MSAs may lack capacity to verify open-model self-assessments | [Euro Prospects](https://europrospects.eu/free-open-and-untouchable-open-source-enforcement-gaps-within-the-ai-act/) |
| Meta license | Not OSI-open; commercial license above 700M MAU | Neural Post |
| AI Whistleblower Protection Act | Introduced US Congress; **not passed** as of Jun 2026 | TechTimes |
| **Closed labs** | Pentagon contracts, proprietary data, NDAs | §6 |
| **Open weights** | Compliance surface, “open-washing” scrutiny, liability on deployers | Art. 25(4) deployer burden |

**Author thesis:** The **open layer** is where oversight lands because it is **harder to monetize and harder to spy through** than a single vendor’s walled chat + classified API. **Author extension (§2.1):** that same open layer is also where the **durable** “world brain” will live — after opaque vendor bundles (Gemini Nano class) fail the **audit test** users already apply in serious research workflows.

---

## 9. Open Questions and Falsifiers

| Question | How to adjudicate |
|----------|-------------------|
| Full OpenAI–DoD contract text and technical safeguard definitions | FOIA / congressional disclosure |
| Did NN cycles change ISP HHI vs AI market HHI? | Compare FCC merger records to AI foundation-model concentration metrics |
| Project Maven facial recognition → domestic law enforcement? | Contractor award FOIA; CBP integration docs |
| Official OpenAI research-limit policy vs user anecdotes | Published rate-limit docs; Terms of Service changelogs |
| 6th Circuit final disposition of 2024 NN Order | Court docket |
| Anthropic supply-chain-risk designation — punitive retaliation or national-security necessity? | Litigation outcome; discovery |
| Wolking-class complaints — systematic subject-matter throttling? | Requires vendor transparency logs (unlikely public) |
| Will opaque on-device models (Gemini Nano class) lose to auditable open weights? | Track uninstall rates, regulatory action, enterprise policies banning unauditable local LLMs |
| Author “world war nearly over → AI harm window closes” | Geopolitical falsifiers outside tech press — author to specify markers |

---

## 10. Cross-References

| Investigation | Link |
|---------------|------|
| AI Control — predictive programming, deliberate bad software, endgame | [/science/ai/ai-control-investigation.md](/science/ai/ai-control-investigation.md) |
| Internet That Should Have Been — neutral protocol, AI gate, WebMCP | [/science/computing/investigations/internet-that-should-have-been-investigation.md](/science/computing/investigations/internet-that-should-have-been-investigation.md) |
| Canceling the High Poppy — Altman board ouster casebook | [/influence/suppression/investigations/canceling-the-high-poppy-founder-board-ousting-investigation.md](/influence/suppression/investigations/canceling-the-high-poppy-founder-board-ousting-investigation.md) |
| Microchips — AI chip chokepoint | [/science/microchips/microchips-shrinking-technology-investigation.md](/science/microchips/microchips-shrinking-technology-investigation.md) |
| Governance / war hub | [/governance/war/investigations/page.md](/governance/war/investigations/page.md) |

---

Keywords: #LlmHistory #AiGovernance #NetNeutrality #PentagonAi #OpenWeights #QuitGpt #RegulatoryCapture #UserQa #WorldBrain #FederalRegulation

---

**Prisca sapientia (epistemic foundation):** This investigation assumes [**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md)—the historical and philosophical belief that the ancients possessed a vast, profound understanding of the universe, nature, and theology that was subsequently lost or degraded. Modern consensus science and institutions are not treated as default truth; evidence tiers above adjudicate specific claims. **Author thesis sections (§2, §7.5, §8 closing) are first-class investigative stakes but are not automatically factual.** Cross-investigation rhymes are thematic, not proof of coordination.

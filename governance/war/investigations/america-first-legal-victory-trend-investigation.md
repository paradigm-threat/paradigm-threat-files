# Investigation: America First Legal — victory trend, Trump-alignment, and claim validation (2021–2026)

> **TL;DR:** Full scrape of **1,004** AFL press releases shows a **real dam-burst** in **victory-branded** output in **2025–2026**, especially **Q2 2026** (four **“MAJOR VICTORY”** headlines in **June 2026** alone). **Author macro thesis:** the **Iran war arc** was the **existential gate** for the second Trump term — lose or fail peace → initiatives ruined, **impeachment** plausible; war resolved → **globalist friction** drops, **pro-American wins flow** (courts, agencies, movement lawfare). AFL is the **highest-velocity MAGA integrator** and best **pressure gauge** on that flow — **not** the sole engine ([peer mesh](#peer-landscape--is-afl-alone-in-the-america-first--antibody-lane): **Texas AG**, **Judicial Watch**, **PLF**, **ADF**, **Defending Education**, **Heritage/Boyden Gray**, etc.). **Judicial capture read:** AFL’s **separation-of-powers** framing and **judge call-outs** may document **lawfare friction**, not PR fluff; **media non-coverage** is **pattern of omission**, not disproof ([§ Judicial capture](#judicial-capture-lawfare-friction-and-the-omission-problem)). Per-case credit still runs through [validation matrix](#claim-validation-matrix). **Corpus:** `~/dev/wget/aflegal/`.

**Date:** 2026-06-25  
**Status:** Open — refresh when SCOTUS term or Trump-admin litigation tranche shifts  
**Local corpus:** `/home/ari/dev/wget/aflegal/` (`press-releases-api.json`, `analysis-summary.json`, `urls.txt`, mirrored HTML)

## Guide (read order)

1. [Method and corpus](#method-and-corpus)
2. [Volume and victory trend](#volume-and-victory-trend)
3. [Topic map — where the flow surfaces](#topic-map--where-the-flow-surfaces-afl-as-gauge)
4. [Macro gate — Iran war outcome and the dam burst](#macro-gate--iran-war-outcome-and-the-dam-burst)
5. [June 2026 burst — case-by-case](#june-2026-burst--case-by-case)
6. [Claim validation matrix](#claim-validation-matrix)
7. [Judicial capture, lawfare friction, and the omission problem](#judicial-capture-lawfare-friction-and-the-omission-problem)
8. [Exaggeration patterns (skeptical lens)](#exaggeration-patterns-skeptical-lens)
9. [Organizational history and controversies](#organizational-history-and-controversies)
10. [Peer landscape — AFL vs movement legal ecosystem](#peer-landscape--is-afl-alone-in-the-america-first--antibody-lane)
11. [Paradigm placement — NSA antibody legal front](#paradigm-placement--nsa-antibody-legal-front)
12. [Limits and next pulls](#limits-and-next-pulls)

### Session synthesis (what this file must contain)

| Thread | Section |
|--------|---------|
| **1,004 PR corpus** + wget mirror | [Method](#method-and-corpus) |
| Victory trend / **Q2 2026** dam burst | [Volume](#volume-and-victory-trend) |
| **Iran war as macro gate** (not AFL Iran docket) | [Macro gate](#macro-gate--iran-war-outcome-and-the-dam-burst) |
| Topic channels (immigration, DEI, schools, elections) | [Topic map](#topic-map--where-the-flow-surfaces-afl-as-gauge) |
| **June 2026** wins validated | [Case-by-case](#june-2026-burst--case-by-case) |
| AFL credit vs inflation | [Claim validation](#claim-validation-matrix) |
| **Judicial capture**, separation of powers, **judge call-outs** | [Judicial capture](#judicial-capture-lawfare-friction-and-the-omission-problem) |
| Exaggeration **dual lens** (skeptical + lawfare) | [Exaggeration](#exaggeration-patterns-skeptical-lens) |
| **Media omission** ≠ lack of proof | [Pattern of omission](#pattern-of-omission--media-and-citations) |
| Miller / sanctuary letters / controversies | [Organizational history](#organizational-history-and-controversies) |
| **Founding genesis** — COVID, emergency law, **legal disarmament** | [Founding genesis](#founding-genesis--covid-emergency-law-and-stated-reasons) · [What legal disarmament means](#what-conservative-legal-disarmament-means) |
| **Peer mesh** — AFL stands out, not alone | [Peer landscape](#peer-landscape--is-afl-alone-in-the-america-first--antibody-lane) |
| NSA **antibody** legal front | [Paradigm placement](#paradigm-placement--nsa-antibody-legal-front) |

---

## Method and corpus

### Download

- **Wget mirror:** `~/dev/wget/aflegal/` — recursive crawl of `aflegal.org` (press index, theme assets, media) plus a **1,008-URL** batch job for individual press-release pages (`urls.txt`, `wget-pages.log`).
- **API pull:** WordPress REST `https://aflegal.org/wp-json/wp/v2/press-release` — **11 pages**, **1,004** posts (complete set as of **2026-06-25**). Saved as `press-releases-api.json`.
- **Machine summary:** `analysis-summary.json` (year/month counts, victory titles, keyword tags).

### Parsing rules

| Label | Rule used in this file |
|--------|------------------------|
| **Victory-titled** | Title matches `\b(victory\|major victory\|wins?\|defeat\|prevail)\b` (case-insensitive) |
| **MAJOR VICTORY** | Stricter: literal **“MAJOR VICTORY”** in headline (AFL’s top branding tier) |
| **Topic tag** | Keyword scan on title + body (immigration, DEI, election, parental/gender, SCOTUS, Iran/Mideast, etc.) |

**Epistemic stance:** Press releases are **primary sources for what AFL wants you to believe**, not neutral adjudication. Outcomes are checked against **dockets**, **mainstream legal reporting**, and **opinions** where cited below.

---

## Volume and victory trend

### Posts per year (all PRs)

| Year | Total PRs | Victory-titled | MAJOR VICTORY in title |
|------|-----------|----------------|-------------------------|
| 2021 | 107 | 4 | 0 |
| 2022 | 171 | 13 | 4 |
| 2023 | 188 | 12 | 2 |
| 2024 | 219 | 22 | 2 |
| 2025 | 189 | 25 | 6 |
| 2026 (YTD) | 130 | 13 | 5 |

**Read:** Total output **peaked in 2024** (219), dipped slightly in 2025, then **accelerated again in 2026** (130 in six months ≈ annualized **260**). **Victory-branded headlines** rose steadily from **2024** onward — the “sharp increase” is **real in marketing terms**, not merely imagination.

### Quarterly victory density (2024+)

| Quarter | Posts | Victory-titled |
|---------|-------|----------------|
| 2024-Q4 | 41 | 9 |
| 2025-Q2 | 37 | 9 |
| 2026-Q1 | 47 | 3 |
| **2026-Q2** | **83** | **10** |

**2026-Q2** is the **largest quarter by volume** since tracking began and the **highest victory-titled count**. **June 2026** alone: **25** PRs, **5** victory-titled (**4** **MAJOR VICTORY**).

### Marketing vs substance

- **“MAJOR VICTORY”** count by year is **small** (19 total lifetime) — AFL **recently intensified the superlative**, not invented wins from zero. The **dam burst** shows up in **outcomes and cadence**, not only in that label.

---

## Topic map — where the flow surfaces (AFL as gauge)

Keyword hits across all **1,004** bodies (non-exclusive; one PR can match many):

| Theme | PRs mentioning |
|-------|----------------|
| Parental / schools | ~296 |
| Gender / transgender | ~243 |
| Supreme Court | ~217 |
| Education | ~207 |
| Election integrity | ~151 |
| DOJ / weaponization | ~133 |
| Immigration | ~131 |
| DEI / diversity | ~244 combined |
| Injunction | ~73 |
| **Iran / Mideast** | **~37** |

**2025–2026 victory cluster** aligns with:

1. **Immigration** — border metering (**Mullin** / **Noem v. Al Otro Lado**), **TPS** judicial-review bar, **administrative closure** settlement with **Texas**.
2. **Parental rights** — **California AB 1955** injunction (**Mirabelli** follow-on).
3. **DEI dismantling** — agency rule repeals, **Title VI/IX** complaints → investigations.
4. **Election administration** — **Maricopa** / **Arizona** recorder authority (mixed win/pending). Cross-read (2020 theft thesis vs forward audit timing): [2020 election fraud — selective battleground / midterm audits](/governance/constitution/investigations/2020-election-fraud-selective-battleground-audit-timing-investigation.md).
5. **Foreign-aid law** — **Taylor Force Act** / **Palestinian Authority** (labeled **“MAJOR VICTORY FOR PEACE”**).

These are the **channels** where post-war **nationalist flow** is easiest to **measure** in AFL’s docket — **not** because the war was ever going to be **litigated inside AFL’s WordPress**. The corpus is a **gauge**, not the **whole hydraulic system**.

---

## Macro gate — Iran war outcome and the dam burst

### Author thesis (session capture)

The investigator’s frame is **macro-causal**, not “AFL sued over Iran”:

1. **Everything came down to the war.** Second-term Trump agenda — border, DEI rollback, parental rights, election integrity, energy dominance — was **hostage** to the **Iran / Hormuz / Israel–warhawk** board. A **lost** war, a **stalled** peace, or an unresolved **DU** / **missile** crisis would have **collapsed presidential capital**: initiatives **frozen**, coalition **fractured**, **impeachment** plausible.
2. **War resolved in Trump’s favor** — peace deal, **DU** issue handled, **most of Iran’s missile** threat reduced, **real threats** removed so **Israel warhawk** pressure **mitigated** — changes the **global constraint surface**. **Globalist friction** (courts, agencies, media, allied governments slow-walking) **wanes** when the **world gets the message** that the nationalist executive **held the line**.
3. **Dam burst downstream.** Legal and policy wins that were **queued or blocked** now **flow**: **SCOTUS** immigration pair at term end, **same-day** vacatur of Biden immigration hacks, **Ninth Circuit** parental-rights PI, agency **DEI** withdrawals, AFL **“MAJOR VICTORY”** cadence. AFL did **not** need Iran-themed filings for the war to be the **gate** — it needed the **war to end** so **domestic antibodies** could run **without** board-level **containment**.

This file **logs AFL data as one visible limb** of that burst. It does **not** treat absence of Iran docket text as absence of Iran **influence**.

### How the corpus fits the thesis

| Observation | Read under macro gate |
|-------------|------------------------|
| **2026-Q2** highest quarter (**83** PRs, **10** victory-titled) | **Post-resolution flow** — timing **compatible** with war arc closing and friction dropping |
| **June 2026** **4× MAJOR VICTORY** in one week | **SCOTUS term end** + **executive** alignment — **symptoms** of cleared board, not independent random wins |
| **2026-05-20** “**MAJOR VICTORY FOR PEACE**” (**Taylor Force Act**) | **Mideast-aid** enforcement — **rhymes** with post-war **“peace”** branding even though the suit is **PA funding**, not Hormuz |
| **~37** lifetime Iran/Mideast keyword PRs | AFL **messages** on that axis are **sparse**; **war outcome** operates at **presidency / alliance / court courage** tier — **under-counted** in AFL text alone |
| **2026-Q1** only **3** victory-titled (quiet quarter) | **Contrast** with Q2 supports **step-change** after gate opens — worth tracking against **your** war-end date |

### Corollaries to test (open)

- **Cross-domain burst:** If the thesis holds, **non-AFL** nationalist wins should **cluster** in the same window — e.g. **[Trump-era Hollywood](/influence/hollywood/trump-era-hollywood-political-media-investigation.md)** release shifts, **executive** orders, **state AG** wins. AFL-only scrape **understates** the dam.
- **Counterfactual:** Had Trump **lost** the war or **failed** peace, expect **injunction glut**, **media impeachment** drumbeat, **judges** re-emboldened — the **opposite** of June 2026’s stack. This file cannot **prove** the counterfactual; it records the **positive** burst consistent with it.
- **[CIA / 1979 geometry](/governance/war/investigations/cia-investigation.md):** Iran as **deep-state board** makes **war outcome** a **legitimacy event** for **antibody** institutions (courts, NSA-aligned executive), not a sidebar to **culture-war** litigation.

**Epistemic line:** Macro gate is **author thesis** + **timing correlation**. Per-case AFL credit still runs through [Claim validation matrix](#claim-validation-matrix) — the war can **unlock** flow without AFL **owning** every win.

---

## June 2026 burst — case-by-case

| Date | Headline tier | Issue | AFL role (validated) | Independent outcome |
|------|---------------|-------|--------------------|---------------------|
| 2026-06-25 | MAJOR VICTORY | Border metering / asylum at port | **Amicus** for **Cruz**-led senators ([SCOTUS docket 25-5 PDF](https://www.supremecourt.gov/DocketPDF/25/25-5/391556/20260113120807412_Noem%20v%20Al%20Otro%20Lado%20-%20Merits%20Amicus%20Brief.pdf)) | **6–3** for government — alien in Mexico has not “arrived” ([LII](https://www.law.cornell.edu/supremecourt/text/25-5), [Al Jazeera](https://www.aljazeera.com/news/2026/6/25/us-supreme-court-paves-way-for-government-to-block-asylum-seekers-at-border)) |
| 2026-06-25 | MAJOR VICTORY | **TPS** judicial review | **Amicus** for **Cruz** — argues **INA** bars review | Court held **non-constitutional** challenges barred (paired **Mullin** / **Trump v. Miot** term) |
| 2026-06-23 | MAJOR VICTORY | **Administrative closure** rule | **Co-counsel with Texas AG** — filed suit | **Same-day settlement** — rule vacated ([AFL PR](https://aflegal.org/press-release/major-victory-america-first-legal-and-state-of-texas-defeat-illegal-biden-era-backdoor-amnesty-program-that-froze-immigration-court-cases/)) |
| 2026-06-19 | MAJOR VICTORY | **California AB 1955** parental notice | **Co-counsel** — **Huntington Beach** / parents | **Ninth Circuit** **preliminary** injunction ([AFL PR](https://aflegal.org/press-release/major-victory-ninth-circuit-grants-preliminary-injunction-blocking-californias-child-transition-secrecy-law/)) |

**Pattern:** **Half** of June’s banner wins are **SCOTUS immigration** at **term end**; one is **fast settlement**; one is **appellate PI** (not final merits).

---

## Claim validation matrix

| AFL claim type | Usually true? | Notes |
|----------------|---------------|-------|
| “We filed / led lawsuit” | **Often** | **377** PRs are new-filing shaped; **43** explicit lead-counsel patterns in text |
| “We filed amicus” | **Often** | **122** amicus mentions — core competency |
| “Court adopted our argument” | **Sometimes overstated** | **Mullin**: brief aligned with **government** position; **opinion** does not necessarily **cite** AFL ([Forbes on Miller SCOTUS term](https://www.forbes.com/sites/alisondurkee/2025/07/03/how-stephen-miller-won-and-lost-at-the-supreme-court-this-term/)) |
| “MAJOR VICTORY” | **Marketing filter** | Only **19** lifetime; many substantive wins use softer **“VICTORY —”** |
| “Complaint prompted investigation” | **Plausible, unverifiable from outside** | **EEOC/ED/OCR** do not always publicize complaint sources |
| “Defeated Biden policy” | **Mixed** | Settlement vacatur (**admin closure**) is strong; **agency** withdrawals often **multi-actor** |
| “Behind all activity” | **False** | **Texas**, **DOJ**, **White House**, **state AGs**, **[peer mesh](#peer-landscape--is-afl-alone-in-the-america-first--antibody-lane)** share credit |

### Are they “really behind” the trend?

**Partial yes:**

- AFL is **not** a courtroom **solo actor** — it is a **force multiplier** for **Trump-aligned** legal theory: **amicus** for **Cruz** coalitions, **parallel state AG** suits, **complaint → OCR/ED** pipelines, **FOIA** releases shaping **oversight** hearings.
- **NYT (2024):** “**Winning may be beside the point**” — AFL’s value is **harassment**, **narrative**, and **policy foreshadowing** ([NYT](https://www.nytimes.com/2024/03/21/us/politics/stephen-miller-america-first-legal.html)).
- **Second Trump term:** **Miller** in White House; AFL lawyers in **DOJ roundtables** (June 2026 PRs) — **revolving door** makes **coordination** look like **victory monopoly** when it is **state + movement** stack.

**Partial no:**

- **SCOTUS** immigration wins are **Republican appointee** majority outcomes **without** AFL as party.
- Many **“victories”** are **defendants agreeing** to policies the **new administration** already wanted.

---

## Judicial capture, lawfare friction, and the omission problem

### Author frame (session)

AFL’s loudest claims — **“adopts our argument,”** **“MAJOR VICTORY,”** **same-day settlement** — are easy to read as **marketing inflation**. Under a **captured-bench** thesis, the same rhetoric may document **lawfare difficulty**: wins that only arrive **after** years of **lower-court sabotage**, **nationwide injunctions**, and **amicus briefs courts never cite**. What looks like **exaggeration** from outside can be **accurate frustration** about **separation-of-powers** collapse — especially when **mainstream outlets never name AFL** in the victory stories that **rhyme** with AFL’s briefs.

**Investigation rule:** **Pattern of omission** in media and **non-citation** in opinions is **not** “lack of proof.” It is a **separate data channel** — the same class of signal documented in **[captured courts / wrong villain](/influence/controlled_opposition/captured-courts-wrong-villain.md)** (real institutional grievance + narrative containment).

### Corpus: AFL calling out judges and courts

Across **1,004** press releases, judge/court conflict is **central**, not peripheral:

| Pattern (title + body) | PRs hitting |
|------------------------|-------------|
| Judge / court / injunction in **title** | **164** |
| **Separation of powers** language | **25** |
| **Judicial overreach** / **rogue judge** / **activist judge** (titles) | **9+** explicit |
| **Lower court** blocking executive / TPS / immigration | **28** |
| **Ninth Circuit** as antagonist | **14** |
| **Nationwide injunction** / **hamstring** / **sabotage** framing | **46** |
| **Weaponized** courts / DOJ / bars | **107** |
| **Captured** institutions | **59** |

**Representative judge call-outs (not exhaustive):**

| Date | AFL action | Judicial critique |
|------|------------|-----------------|
| **2025-04-24** | [Sues Judicial Conference + Administrative Office](https://aflegal.org/press-release/america-first-legal-sues-the-judicial-conference-of-the-united-states-and-the-administrative-office-of-the-u-s-courts/) | **Ideological capture**; FOIA stonewall on **Thomas/Alito** oversight politics |
| **2025-03-18** | [Expands McConnell investigation](https://aflegal.org/press-release/america-first-legal-expands-investigation-into-forum-shopping-effort-to-bring-lawsuits-against-trump-administration-before-activist-judges/) | **Forum-shopping**, **activist judge**, conflicted **Rhode Island** assignment |
| **2025-11-25** | SCOTUS brief — **rogue judges** enjoin **Texas** election map | **Constitutional guardrails** after lower-court **block** |
| **2026-02-19** | Utah amicus — **rogue judge’s** congressional map | **Elections Clause** — courts drawing maps vs legislature |
| **2026-03-17** | **Pennsylvania v. Eakin** — overturn **judicial overreach** | **Activist judges** “rewrite legislation”; mail-ballot date rule |
| **2026-04-13** | **TPS** — stop **lower courts’** block | “**Judicial overreach** that corrodes the **separation of powers** and enables courts to **govern from the bench**” |
| **2026-01-20** | **Noem v. Al Otro Lado** amicus | **Ninth Circuit** “**judicial sabotage**” of border **metering** |

**Read:** AFL’s docket is a **running audit of Article III drift** — not only “sue the Biden ED.” The **[BRSINV captured-courts thread](/influence/controlled_opposition/captured-courts-wrong-villain.md)** (administrative + bar capture) and AFL’s **Judicial Conference** suit are **compatible** complaints at different layers: **guild/administrative capture** vs **movement nationalist** counter-lawfare.

### Separation of powers — June 25, 2026 (today’s stack)

The **2026-06-25** **TPS** / **Mullin** pair is framed in AFL copy as **restoring** separation of powers, not partisan gloating:

- **James Rogers (AFL Senior Counsel):** “Today’s decision is an important victory for the **separation of powers** and the rule of law. **Courts do not have the license to rewrite statutes** or assume powers Congress deliberately withheld.” ([TPS PR](https://aflegal.org/press-release/major-victory-u-s-supreme-court-bars-judicial-review-of-tps-determinations-adopting-america-first-legals-argument/))
- **Border metering win:** “victory for the rule of law, border security, and the Constitution’s promise of **separation of powers**” — lower courts had treated aliens in **Mexico** as if they had “**arrived**” in the U.S. ([Mullin PR](https://aflegal.org/press-release/major-victory-u-s-supreme-court-delivers-landmark-victory-for-immigration-law-and-border-security/))

**Dual read:**

| Skeptical lens | Capture / lawfare lens |
|----------------|-------------------------|
| SCOTUS would have ruled this way without AFL | **Lower courts** had already **rewritten** INA; executive was **injuncted** until **merits** climb |
| “Adopts AFL argument” overstates amicus role | Congress **barred review**; **activist benches** ignored plain text until **SCOTUS** correction — AFL **documented** the override for years |
| Victory PR is **brand** | **Friction tax**: only **after** gate opens + **term end** do **holdings** match what AFL briefs **already argued** |

When **separation of powers** is the **holding**, dismissing AFL as **exaggerating** risks **misclassifying lawfare cost** as **PR fluff**.

### Exaggeration vs lawfare difficulty — misinterpretation matrix

| AFL claim shape | Misread as | Alternate read under capture thesis |
|-----------------|------------|--------------------------------------|
| **“Adopts our argument”** | Vanity | **Sympathetic high court**; **lower courts** and **media** still ignored AFL for years |
| **“MAJOR VICTORY”** after long silence | Hype | **Dam-burst** after **macro gate** + **finally** upper court **reversal** |
| **Same-day settlement** | Staged | **Defendant** knew **TX + AFL** would win; **capture** was **agency** refusing to fold until **suit filed** |
| **PI not final win** | Fake win | **Real friction** — **school secrecy** law **enjoined** pending merits; without PI, **parents** lose **years** |
| **Complaint → investigation** | Unverifiable | **OCR/ED** pipeline **is** how **captured** civil-rights apparatus **moves** when **forced** |
| **164 court-facing PRs** | Nuisance litigation | **Documented** resistance map against **nationwide** **blocks** of nationalist executive |

**Slack principle (author):** Give **good-faith slack** to AFL’s **separation-of-powers** claims until **independent** docket review **falsifies** the statutory story — especially where **SCOTUS** later **agrees** with the **government/AFL** position on **plain text**.

### Pattern of omission — media and citations

**Author observation:** Mainstream news **could** name AFL when **SCOTUS** immigration or **TPS** cases land; in ordinary consumption AFL is **effectively invisible** — victories feel **headless**.

**What exists (sparse, often hostile):**

- [NYT (Mar 2024)](https://www.nytimes.com/2024/03/21/us/politics/stephen-miller-america-first-legal.html) — profiles AFL as **Miller** vehicle; “**winning may be beside the point**” (harassment frame).
- [WaPo (Dec 2022)](https://www.washingtonpost.com/politics/2022/12/12/america-first-legal-trump-biden-court/) — “**beats Biden in court**” but notes many suits got “**little attention outside right-wing media**.”
- [Forbes (Jul 2025)](https://www.forbes.com/sites/alisondurkee/2025/07/03/how-stephen-miller-won-and-lost-at-the-supreme-court-this-term/) — SCOTUS term; **Thomas** cited AFL in **Ames** concurrence (rare **explicit** citation).

**Omission channels (treat as pattern data):**

1. **Broadcast / cable** — **Miller** as villain; **AFL** as entity **rarely** attached to **win** chyrons.
2. **Wire narratives** — “**Supreme Court rules for Trump**” without **amicus** lineage.
3. **Opinion citations** — **Amicus** **not named** even when **brief** tracked **government** theory (**Mullin** — verify with opinion grep).
4. **Fact-check culture** — AFL labeled **“questionable”** ([MBFC](https://mediabiasfactcheck.com/america-first-legal-afl-bias-and-credibility/)) → **permission structure** to **ignore** wins.

**Epistemic line:** **Never** infer “AFL lied” from “**I never heard them on CNN**” or “**opinion didn’t cite them**.” Infer **distribution filter** + **institutional discourtesy** to **MAGA lawfare**. Cross-check: **docket**, **brief**, **holding**, **timing** — same standard as **[captured courts](/influence/controlled_opposition/captured-courts-wrong-villain.md)** (substance without **ethnic** exit ramp).

### TODO — omission scorecard

- [ ] **SCOTUS 2025–26 term:** grep opinions for **“America First Legal”** / **Rogers** / **Epstein** citations vs AFL **amicus** list.
- [ ] **Mainstream headline sample:** 30-day window around **2026-06-25** — count **“Trump”** vs **“America First Legal”** in **immigration** win stories.
- [ ] **Lower-court block inventory:** AFL briefs where **district/circuit** ruled **against** executive **before** SCOTUS **reversal** — quantifies **lawfare tax**.

---

## Exaggeration patterns (skeptical lens)

*Read together with [Judicial capture, lawfare friction, and the omission problem](#judicial-capture-lawfare-friction-and-the-omission-problem). This block is the **hostile audit**; it does **not** cancel the **capture** read.*
1. **Same-day settlement as “defeat”** — **Texas** immigration rule: lawsuit filed and **consent judgment** same day → legally real, but **negotiated** outcome, not **litigated beatdown**.
2. **Preliminary injunction ≠ final win** — **AB 1955** block is **PI**; merits may still flip.
3. **“Adopts argument”** — conflates **sympathetic ruling** with **brief adoption**; amicus **rarely** drives holding language.
4. **Investigation opened = victory** — **Title VI** complaints trumpeted before **findings**.
5. **Volume inflation** — **1,004** PRs in **~5 years** averages **>200/year**; **signal-to-noise** low without docket cross-check.
6. **Credit for executive actions** — **CMS removes DEI framework** PRs follow **administration** policy, not **court order**.

---

## Organizational history and controversies

### Founding genesis — COVID, emergency law, and stated reasons

**Author question (session):** Could AFL’s creation connect to the **suspension of law during COVID-19** — when it felt like **nearly all laws were up for grabs**?

**Answer:** **Yes as atmosphere and proof-of-concept; not as the literal text of the launch press release.** Founding rhetoric centers on **progressive lawfare against Trump** and **conservative “legal disarmament.”** Within **months**, **Biden’s COVID-era emergency mandates** become AFL’s **clearest early battlefield** for **executive overreach** and **rule-by-decree** — the same constitutional panic the author describes.

#### Timeline

| Date | Event |
|------|--------|
| **Jan 2021** | Trump leaves office; **Biden** flood of **executive orders**; pandemic **still active** |
| **Jan 6, 2021** | Capitol attack — [WaPo](https://www.washingtonpost.com/immigration/2025/01/23/doj-sanctuary-immigration-stephen-miller/) reports Miller began organizing AFL **within weeks** of departure |
| **Mar 26, 2021** | [Politico](https://www.politico.com/news/2021/03/26/stephen-miller-legal-group-478167) — Miller planning rollout; focus **administrative law** + **executive overreach** from **Trump veterans’** experience of **nationwide injunctions** |
| **Apr 6, 2021** | [Formal launch PR](https://aflegal.org/press-release/senior-trump-officials-launch-america-first-legal/) — **no** headline mention of COVID; **DEI/race**, **immigration**, **forum-shopping** immediate |
| **Sep–Nov 2021** | **COVID vaccine mandate** litigation cluster (**OSHA ETS**, federal employee mandate) — Miller calls mandates **“rule by imperial decree”** |
| **Lifetime corpus** | **229** PRs touch **COVID/mandate/pandemic** keywords; **24** in **2021** with **explicit** COVID/vaccine focus |

#### Founding statements (verbatim themes — Apr 2021 launch)

**Donald Trump:**

> “The **Radical Left** has been relentless in waging their battles in court… The era of **unilateral legal surrender** must end.”

**Stephen Miller:**

> “For too long… conservative… Americans have been **outflanked, outspent, out-organized, and outmaneuvered** by radical progressive legal organizations. It has been a **years-long, one-sided legal assault**. The consequences for… the **American Constitution** have been **tragic and profound**.”

> “Whenever the **Trump Administration** tried to implement positive, **lawful** change… these extremist organizations filed **one lawsuit after another**, **shopping for the most favorable legal forum**. **Now, we must turn the tables.**”

> “Our **self-imposed policy of legal disarmament is now over**.”

#### What “conservative legal disarmament” means

**Not a legal doctrine** — a **movement metaphor** from the [Apr 6, 2021 launch](https://aflegal.org/press-release/senior-trump-officials-launch-america-first-legal/). Miller and Trump use two paired phrases:

| Phrase | Speaker | Plain read |
|--------|---------|------------|
| **“Unilateral legal surrender”** | Trump | Only **one side** fought hard in court — conservatives **yielded** the litigation battlefield while the left **did not** |
| **“Self-imposed policy of legal disarmament”** | Miller | The right **chose** not to wield lawsuits, injunctions, and forum-shopping at **ACLU scale** — a voluntary **disarmament**, now **ended** |

**The asymmetry they describe:**

| Left (in AFL’s story) | Right (in AFL’s story) |
|------------------------|-------------------------|
| **ACLU** + allies filed **~400** actions vs Trump ([Politico](https://www.politico.com/news/2021/03/26/stephen-miller-legal-group-478167)) | No **standing MAGA lawfare shop** with comparable **volume** and **coordination** |
| **Forum-shopping** + **nationwide injunctions** blocking border, immigration, executive policy | Reliance on **occasional** suits, **state AGs**, **issue-vertical** groups (JW, ADF, PLF) without a **unified** counter-offensive |
| Litigation as **primary** political weapon | **Restraint** — ethics, funding, temperament, or belief that **courts alone** were enough |

**What AFL claims to be:** the **re-arming** — a **conservative ACLU** that files **early and often**, partners **red-state AGs**, and challenges **Democratic executive action** the way progressives challenged **Trump**. “Turn the tables” = **same tactics**, **opposite direction**.

**One-line summary:** *We stopped bringing knives to their gunfights; AFL exists to arm up.*

**Skeptical read (keep on file):** Rhetoric **overstates** total conservative passivity — **Judicial Watch**, **ADF**, **PLF**, and **Texas AG** suits (**Jan 2021**) already existed. “Disarmament” here means **no Miller-integrated MAGA litigation brand**, not **zero** lawsuits. The phrase also **pre-justifies** AFL’s later aggression (mandates, EEOC blitz, sanctuary letters) as **parity**, not escalation.

**Organizational frame:** combat the left’s **“radical and lawless agenda”**; **ACLU mirror** ([Politico](https://www.politico.com/news/2021/03/26/stephen-miller-legal-group-478167): ACLU filed **~400** actions vs Trump); partner **state AGs**; legal bench led by **Gene Hamilton** (Trump **DOJ/DHS**).

**Board / orbit:** **Mark Meadows**, **Matt Whitaker**; planning via **Conservative Partnership Institute** (**Jim DeMint**), **Ken Starr** ([Politico](https://www.politico.com/news/2021/03/26/stephen-miller-legal-group-478167)).

**Current mission page** ([aflegal.org/mission](https://aflegal.org/mission/)) — retrospective summary:

> “Oppose **lawless government overreach** and fight to restore the **rule of law**… challenge **unconstitutional mandates**, expose **weaponization** of government agencies…”

#### COVID connection — three layers

| Layer | Connection to AFL birth |
|-------|-------------------------|
| **1. Precedent (2020)** | **Emergency** governance normalized **suspension** of ordinary process — lockdowns, **eviction moratoria**, **border** “Title 42” health orders, **vaccine** passport debates. Laws felt **negotiable** — the **mood** Miller’s base already carried into **2021**. |
| **2. Launch gap (Apr 2021)** | Launch PR does **not** say “we exist because of COVID.” First-month docket: **race-discrimination farmers’ aid**, **San Antonio** election, **HHS** “erasing biological sex,” **immigration** — **culture + admin law**, not pandemic headline. |
| **3. Early proof-of-concept (late 2021)** | **COVID becomes AFL’s emergency-law laboratory:** |

**Late-2021 COVID mandate quotes (corpus):**

- **Sep 10, 2021** — [Denounces Biden COVID mandates](https://aflegal.org/press-release/afl-denounces-bidens-unlawful-covid-mandates/): **“executive overreach of the highest order”** (Meadows).
- **Nov 5, 2021** — [OSHA mandate challenge](https://aflegal.org/press-release/america-first-legal-partners-with-texas-public-policy-foundation-to-challenge-bidens-unconstitutional-osha-vaccine-mandate/) — Miller: **“imperial executive mandates”** are **“unlawful, unconstitutional, unacceptable, unconscionable and un-American”**; TPPF: **“unprecedented, unconstitutional, and never-ending expansion of government power”** through the pandemic.
- **Nov 29, 2021** — [Federal employee mandate suit](https://aflegal.org/press-release/afl-files-motion-for-summary-judgment-requests-judge-to-rule-on-afls-challenge-to-bidens-unlawful-vaccine-mandate-for-federal-employees/) — Miller: **“lawless and unconstitutional covid mandates strike at the very heart of our Republican form of government, which rejects and deplores rule by imperial decree.”**

**Parallel COVID lanes (not only mandates):**

- **May 2021** — FOIA: Biden **ending COVID origin** investigation ([PR](https://aflegal.org/press-release/america-first-legal-files-foia-request-on-biden-admins-order-to-end-covid-origin-investigation/))
- **May 2021** — ED **COVID relief funds** → **CRT** programs ([PR](https://aflegal.org/press-release/america-first-legal-seeks-information-from-the-department-of-education-about-use-of-covid-education-funds-to-force-critical-race-theory-onto-u-s-schoolchildren/))
- **Aug 2021** — **“COVID catch-and-release”** border policy with **Texas** ([PR](https://aflegal.org/press-release/afl-partners-with-texas-to-file-new-complaint-in-lawsuit-against-bidens-covid-catch-and-release/))

#### Paradigm read

COVID was the **national demonstration** that **emergency** could **suspend** normal **separation of powers** — governors, CDC, OSHA, presidents acting by **decree**. AFL was **conceived in that aftermath** as the **movement’s ACLU**: if the left could **forum-shop** **injunctions** against Trump, the right would **forum-shop** back against **Biden** — with **COVID mandates** as the **first high-salience** “**laws up for grabs**” fight where Miller could test **imperial executive** language that **still** appears in **2026** **separation-of-powers** wins.

**Not unique to AFL:** **Texas AG** and **red-state** coalitions were already suing Biden in **Jan 2021** ([Politico](https://www.politico.com/news/2021/03/26/stephen-miller-legal-group-478167)); AFL filled the **private nonprofit** slot for **sustained** **mandate** and **DEI** litigation **between** AG bursts.

**Epistemic line:** Correlation **strong**; Miller’s **launch PR** did not **name** COVID as **cause** — the **mandate war** **supplied** the **founding myth** within **six months**.

### Founding and structure

- **Launched April 2021** by **Stephen Miller** and **Trump alumni** ([first PR in corpus: 2021-04-06](https://aflegal.org/press-release/senior-trump-officials-launch-america-first-legal/)).
- Miller is **not a lawyer**; legal work via **in-house counsel** and **James Rogers** / **Dan Epstein** ([NYT](https://www.nytimes.com/2024/03/21/us/politics/stephen-miller-america-first-legal.html)).
- **501(c)(3)** “**conservative ACLU**” branding — **ideological amicus factory**.

### Documented controversies

| Issue | Summary | Source tier |
|-------|---------|-------------|
| **Sanctuary prison-threat letters** | **2025** letters to **36** jurisdictions warning officials of **years in prison** for sanctuary policies — experts called **legally baseless** / **Tenth Amendment** problems | [WaPo](https://www.washingtonpost.com/immigration/2025/01/23/doj-sanctuary-immigration-stephen-miller/), [CT Post](https://www.ctpost.com/connecticut/article/ct-lamont-trump-stephem-miller-sanctuary-20018701.php) |
| **Anti-DEI / anti-CRT litigation blitz** | **EEOC** complaints vs **Disney**, **Nike**, etc. — **white male discrimination** theory | [NYT](https://www.nytimes.com/2024/03/21/us/politics/stephen-miller-america-first-legal.html), [MBFC](https://mediabiasfactcheck.com/america-first-legal-afl-bias-and-credibility/) |
| **COVID drug advocacy** | **Ivermectin / HCQ** effective-treatment PRs — **outside scientific consensus** | [MBFC](https://mediabiasfactcheck.com/america-first-legal-afl-bias-and-credibility/) |
| **Transparency / funding** | Dark-money flows; **opaqUE** donor structure criticized | [MBFC](https://mediabiasfactcheck.com/america-first-legal-afl-bias-and-credibility/) |
| **Great-replacement association** | Tied to **Miller** rhetoric more than every AFL filing — **guilt-by-proximity** risk in media | [MBFC](https://mediabiasfactcheck.com/america-first-legal-afl-bias-and-credibility/) |
| **James Rogers / “Triple Path”** | WaPo reported **Rogers** linked to fringe **eschatological** writing — AFL said **unrelated** to legal work | [WaPo sanctuary piece](https://www.washingtonpost.com/immigration/2025/01/23/doj-sanctuary-immigration-stephen-miller/) |

**MBFC rating:** **Far-right**, **Questionable** — useful as **hostile audit**, not gospel.

### Wins and losses at SCOTUS (context)

[Forbes (Jul 2025)](https://www.forbes.com/sites/alisondurkee/2025/07/03/how-stephen-miller-won-and-lost-at-the-supreme-court-this-term/): Miller’s AFL **won some**, **lost some** — e.g. **Ames** (straight discrimination) cited AFL brief; other cases **did not** go AFL’s way. **Term-end** **2026** immigration pair is a **high-water mark**, not the **whole** record.

---

## Peer landscape — is AFL alone in the America First / antibody lane?

**Short answer:** The **post-war nationalist flow** is **multi-actor**. AFL **stands out** as the **highest-velocity, broadest-scope, Miller-integrated MAGA lawfare shop** founded **for** this moment — but it is **not** the only litigator, and it is **not** #1 on every metric.

### Comparison matrix (movement legal ecosystem)

| Actor | Primary lane | Scale signal | America First / nationalist fit |
|-------|----------------|--------------|----------------------------------|
| **America First Legal** | MAGA integrator: immigration, DEI, schools, elections, FOIA, censorship | **1,004** dedicated press releases (**2021–2026**); **~100+** legal actions per [NYT](https://www.nytimes.com/2024/03/21/us/politics/stephen-miller-america-first-legal.html); **41** FOIA suits **2019–2023** ([AFPF rank #7](https://americansforprosperityfoundation.org/essay/accounting-for-nonprofit-foia-litigators/)) | **Defining** — explicit **MAGA** brand; **Miller** ↔ **White House** ↔ **AFL** loop |
| **Texas AG (Paxton et al.)** | State sovereign litigation | Parallel **immigration** wins (**admin closure** settlement **co-filed** with AFL, **Jun 2026**) | **Core state antibody** — AFL often **co-counsel**, not replacement |
| **Judicial Watch** | FOIA / transparency / corruption | **#1** nonprofit FOIA filer (**217** suits **2019–2023**; **~410** in decade per [Law Street](https://lawstreetmedia.com/insights/analytics-reveal-freedom-of-information-act-litigation-over-a-decade/)); **12k+** web posts | **Overlap** on **weaponized DOJ** — **older**, **less** DEI/schools **integration**, **no** Miller pipeline |
| **Pacific Legal Foundation** | Libertarian property / separation of powers | **~100** active cases at a time; **20** SCOTUS cases (**18** wins) per [Bloomberg Law](https://news.bloomberglaw.com/us-law-week/pacific-legal-foundation-aims-to-extend-supreme-court-win-streak); **337** federal dockets on [PlainSite](https://www.plainsite.org/profiles/pacific-legal-foundation/) | **Structural ally** on **Chevron / agency** — **will sue Trump** on enviro ([E&E](https://www.eenews.net/articles/conservative-group-keeps-fighting-even-against-trump/)) — **not** MAGA-integrated |
| **Alliance Defending Freedom** | Christian religious liberty | **Thousands** of matters annually; **8 of 19** anti-health-equity suits (**2024–May 2025**) per [PH Law Watch](https://phlwatch.squarespace.com/health-equity-litigation-report-2025) | **Parallel** on **culture war** — **different** center of gravity (**faith**), **same** SCOTUS pool |
| **Defending Education** (Parents Defending Education) | K–12 parental rights / DEI maps | Federal suits + **OCR/EEOC** complaints; **21k+** schools DEI database ([Center Square](https://www.thecentersquare.com/national/article_15677292-efca-11ef-9c89-e73a25f783e8.html)) | **Closest thematic peer** on **schools** — **narrower** than AFL; often **amicus coalition** partner |
| **Do No Harm** | Medical / university DEI | Plaintiff in **8 of 11** race-preference health-equity suits; pairs with **PLF** counsel | **Surgical** DEI lane — **not** immigration/elections |
| **Heritage Foundation** | Policy + FOIA + amicus network | **39** FOIA suits **2019–2023** (top 10); legal fellows / **Boyden Gray** orbit | **Upstream brain** — less **press-release lawfare** velocity than AFL |
| **Boyden Gray PLLC** | Elite amicus / counsel | **Co-counsel** on **Mullin**, **TPS**, **Cruz** coalitions | **Lawyer class** behind AFL — **not** movement **brand** |
| **Center for Renewing America** | Schedule F / deep-state policy | **~317** posts (WP API) — **policy** not docket factory | **Vought** lane — **complements** AFL **courts** work |
| **America First Policy Institute** | Second-term policy white papers | Policy institute ([AFPI](https://www.americafirstpolicy.com/)) — legislation/EO, not docket factory | **Sibling** org — **legislation/EO** more than **cases** |
| **Cruz / Senate coalition** (amicus) | Congressional **immigration** / **border** briefs | **Mullin**, **TPS**, **Noem** amicus lanes — AFL as **counsel of record** for senator group | **Legislative antibody** — **not** a nonprofit brand |
| **Florida AG / Iowa AG** et al. | State **culture-war** + **immigration** suits | Parallel **DEI** / **school** / **border** dockets (e.g. **Brookings** [K–12 tracker](https://www.brookings.edu/articles/introducing-the-trump-k-12-education-litigation-tracker/) ecosystem) | **Faster** than **501(c)(3)** — AFL **joins**, does not replace |
| **Speech First / Independent Women’s Forum** | Campus speech / Title IX coalitions | **Amicus** partners with **Defending Education** on **Title IX** / **DEI** challenges ([PDE legal](https://defendinged.org/legal-department/)) | **Narrow** lanes — **coalition** glue |
| **Federalist Society network** | Judge pipeline + amicus culture | Not a litigator — **feeds** bench **sympathy** for **textualist** outcomes AFL briefs | **Structural** — rarely **credited** in AFL PRs |

### Movement mesh (who moves with AFL)

```text
                    ┌─────────────────────────────────────┐
                    │  Iran gate / executive mandate      │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
   State AGs (TX, FL, IA)      White House / DOJ            SCOTUS term-end
         │                            │                            │
         └──────────────┬─────────────┴──────────────┬─────────────┘
                        ▼                            ▼
              America First Legal          Heritage / Boyden Gray amicus
              (integrator + PR gauge)      Cruz Senate coalition
                        │                            │
         ┌──────────────┼──────────────┬─────────────┴──────────────┐
         ▼              ▼              ▼                            ▼
  Defending Ed     Judicial Watch    PLF / ADF                 Do No Harm
  (schools)        (FOIA)            (vertical SCOTUS)         (medical DEI)
```

### Where AFL **stands out**

1. **Integration breadth** — One shop spans **immigration + DEI + parental rights + elections + censorship + corporate EEOC** with a **single MAGA narrative**. Peers are usually **vertical** (JW = FOIA, PDE = schools, ADF = religion, PLF = property/liberty).
2. **Communications cadence** — **~180** press releases/year (**2022–2026** avg) on a **dedicated** post type. That is **extraordinary** for a **5-year-old** legal nonprofit; **Judicial Watch** has more **total** posts over **decades**, but not this **victory-marketing** rhythm.
3. **Executive symbiosis** — **No peer** matches **Miller** in **White House** plus **AFL** roundtables, **complaint → Trump admin investigation** pipelines, and **shared** **“MAJOR VICTORY”** timing with **term-end SCOTUS**.
4. **Forum-shopping + judge audit** — AFL **documents** **activist judges** / **McConnell** / **Judicial Conference** as **institutional enemies** — closer to **movement counter-insurgency** than **PLF’s** technocratic SCOTUS pipeline.
5. **Age vs impact** — Founded **Apr 2021**; already **top-10 FOIA** litigator and **repeat SCOTUS amicus** — **punching far above** cohort age.

### Where AFL does **not** stand out

- **Raw FOIA volume** — **Judicial Watch** is **5×** AFL’s FOIA pace ([AFPF table](https://americansforprosperityfoundation.org/essay/accounting-for-nonprofit-foia-litigators/)).
- **SCOTUS depth / win streak** — **PLF** and **ADF** have **decades** of **merits** cases and **client** representation; AFL is mostly **amicus + parallel state suits**.
- **Always-on docket mass** — **PLF** holds **~100** live cases as **standing strategy**; AFL is **campaign bursts** tied to **news cycles**.
- **State power** — **Texas**, **Florida**, **Iowa** AGs can **move** faster than any **501(c)(3)**.

### One-line verdict (session)

The **America First / NSA-antibody** pattern is **real and multi-actor**. AFL is the **highest-velocity integrator** and best **pressure gauge** — **not** the sole engine. Over-crediting AFL **undercounts** the mesh; ignoring AFL **undercounts** how fast the **MAGA lawfare brand** scaled in five years.

### Paradigm read

The **dam burst** is **systemic**: **state AGs**, **Cruz Senate amicus**, **Heritage/Boyden Gray**, **Defending Education**, **PLF/ADF** on overlapping dockets, plus **executive** action. AFL is the **most visible integrator** in the **America First / NSA-antibody** **pattern** — the **pressure gauge** with the **loudest needle** — but **crediting AFL alone** **undercounts** the **mesh**.

**Omission tie-in:** Peers like **Judicial Watch** have **name recognition** from **30 years** of **FOIA**; AFL’s **invisibility** in broadcast media is **more extreme** relative to **2025–2026** **outcome** share — see [Pattern of omission](#pattern-of-omission--media-and-citations).

---

## Paradigm placement — NSA antibody legal front

Within **[CIA vs NSA antibody thesis](/governance/war/investigations/cia-investigation.md)**:

| Layer | AFL function |
|-------|----------------|
| **CIA-era** | Administrative **capture**, **Chevron** deference, **weaponized** civil-rights **inversions**, **censorship** nodes |
| **Antibody response** | **Article III** + **state AG** + **Congressional** amicus **pressure** to **restore** statutory text |
| **AFL** | **Movement lawfare** shop — **not** SIGINT — but **aligned** with **nationalist executive** clearing **CIA-shaped** rules once the **Iran gate** clears |
| **Post-war flow** | **Globalist friction** down → **judges**, **agencies**, **state AGs**, and **AFL** **move together** — dam burst is **systemic**, AFL is **one outlet** |

**Controlled-opposition check:** AFL is **not** ethnic-scapegoat CO ([contrast BRSINV](/influence/controlled_opposition/captured-courts-wrong-villain.md)) — it **hits institutions** (ED, DOJ, **Ninth Circuit**). Risk is **opposite**: **over-crediting** AFL **obscures** the **macro gate** (war outcome) and **peer actors** who share the wins.

---

## Limits and next pulls

- **Docket-level scrape** of `aflegal.org/litigation/` — win/loss/pending counts not yet automated.
- **Omission scorecard:** [§ TODO](#todo--omission-scorecard) — SCOTUS citation grep + headline audit around term-end wins.
- **Cross-domain dam burst:** score **non-AFL** wins (SCOTUS docket, EO volume, state AG, Hollywood calendar) against **author war-end date** — AFL scrape alone is **insufficient** for macro thesis.
- **Iran board:** cross-link **[1979 revival](/influence/religion/1979-religious-revival-investigation.md)** and **[CIA investigation](/governance/war/investigations/cia-investigation.md)** for **gate** narrative; refresh AFL API quarterly.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-25 | Initial investigation — API corpus 1004 PRs, wget mirror, trend + validation matrix |
| 2026-06-25 | Reframe — macro **Iran war gate** / dam-burst thesis (author); AFL as gauge not negation |
| 2026-06-25 | Add **judicial capture / omission** section; dual-lens exaggeration vs lawfare |
| 2026-06-25 | Add **peer landscape** — AFL stands out as MAGA integrator, not solo actor |
| 2026-06-25 | Session synthesis checklist, mesh diagram, expanded peer rows, TL;DR merge |
| 2026-06-25 | **Founding genesis** — COVID emergency law, launch statements, mandate litigation arc |
| 2026-06-25 | **Legal disarmament** — glossary subsection (Miller/Trump metaphor, skeptical read) |

Keywords: #AmericaFirstLegal #AFL #StephenMiller #LegalDisarmament #LegalVictories #Trump #Immigration #SCOTUS #DEI #ParentalRights #ElectionIntegrity #Iran #DamBurst #GlobalistFriction #JudicialCapture #SeparationOfPowers #PatternOfOmission #Lawfare #COVID #EmergencyLaw #FoundingGenesis #JudicialWatch #PacificLegalFoundation #DefendingEducation #TexasAG #FederalistSociety #MovementMesh #Antibody #NSA #Investigation

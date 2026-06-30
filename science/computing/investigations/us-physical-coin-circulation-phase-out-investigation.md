# Investigation: U.S. Physical Coin Circulation — Phase-Out, Supply Friction, and the Cashless Transition

> **TL;DR:** Documents the **converging trend** toward **less physical U.S. coin in active commerce**: **(1)** **intentional policy** — penny production **halted 12 Nov 2025** (Treasury/Mint; Trump/Bessent directive Feb 2025); **nickel** still minted but **loss-making**; **Common Cents Act** (H.R. 3074, House committee **35–13** Jul 2025) would **codify** the halt; **federal rounding removed** in committee version — **stalled** since Sep 2025; **state** rounding patchwork grows; **(2)** **supply-chain friction** — Fed **coin-terminal** suspensions, **Jan 2026** partial deposit **reversal**; **(3)** **consumer shift** — cash **14%** of transactions (**2024**). **Penny politics (Jun 2026):** **abolish** camp (Trump, DOGE, Treasury economics, bipartisan bill sponsors) vs **keep** camp (**Americans for Common Cents**, **Artazn/Jarden** zinc blanks, **TN/NC** mint-supply jobs, **preppers/hoarders**, charities that rely on penny drives) — **production unlikely to restart** under current executive posture; **circulating stock** still **legal tender** and **slowly drains**. **Product fork:** [exact-change wallet](/science/computing/exact-change-wallet-invention-and-aftermath.md) ships as **four SKUs** — **Card Slice** vs **Full Wallet** × **penny-era** vs **dollar-coin / post-penny** tray. **Author thesis (pattern):** same **enclosure geometry** as other computing investigations — **remove bearer instruments**, **route commerce through intermediated ledgers**. Cross-reads [constitutional coining / Fed](/governance/usury/d.md), [Bitcoin](/influence/conspiracy/topics/bitcoin).

**Status:** Open — documented policy and Fed/Treasury primary sources; **intent** and **CBDC endgame** labeled **hypothesis**.  
**Last updated:** 2026-06-29 (§8.5 ladder-promotion PP read; Kevin *Casino Night*; §8 penny politics)

**Guide (read order)**

1. **Documented timeline (penny halt → terminals → deposits resume)** → §1  
2. **Three-pillar model (policy / logistics / consumer)** → §2  
3. **Mint economics — penny, nickel, seigniorage** → §3  
4. **Federal Reserve coin distribution architecture** → §4  
5. **2020 coin disruption (precedent)** → §5  
6. **Digital payments context (FedNow, cash share)** → §6  
7. **Author pattern thesis — physical cash as suppressed bearer tech** → §7  
8. **Penny politics — abolish vs keep, likelihood of return** (incl. §8.5 pop-culture PP seed) → §8  
9. **Rounding, state law, and “rounding tax” estimates** → §9  
10. **Open questions / falsifiers** → §10  
11. **Related investigations + exact-change wallet SKUs** → §11  

---

## 1. Documented timeline — penny production cessation and circulation support

| Date | Event | Source tier |
|------|--------|-------------|
| **Feb 9, 2025** | President **Trump** announces directive to Treasury to **stop producing new pennies** (framed as waste reduction). | Press / [Wikipedia — penny debate](https://en.wikipedia.org/wiki/Penny_debate_in_the_United_States) |
| **May 22, 2025** | Treasury: Mint **stopped purchasing penny planchets**; remaining stock to exhaust. | Treasury / wiki |
| **Nov 12, 2025** | **Final circulating penny** struck (Philadelphia); **232 years** of cent production ends. Collector/commemorative pennies may continue. | [St. Louis Fed — Page One Economics, May 2026](https://www.stlouisfed.org/publications/page-one-economics/2026/may/penny-costs-more-than-penny-economics-behind-ending-the-cent); [Treasury FAQs](https://home.treasury.gov/news/featured-stories/penny-production-cessation-faqs) |
| **Mid-Nov 2025** | **Federal Reserve** stops handling pennies at **>50%** of **coin distribution locations** (terminals); **localized** supply gaps for banks/retail. | [ABA FAQ — phasing out the penny](https://www.aba.com/news-research/analysis-guides/faq-phasing-out-the-penny); wiki |
| **Jan 8, 2026** | FRFS announces **penny deposit acceptance** to **resume Jan 14** at locations previously suspended — **not** a return to minting. | [FRBServices press release](https://www.frbservices.org/news/press-releases/01082026-penny-deposits-update) |
| **Jan 2026** | Some districts still **cannot fill penny orders** (“insufficient inventory”); others resume. Ongoing **weekly** terminal inventory review. | [St. Louis Fed Open Vault, Jan 2026](https://www.stlouisfed.org/open-vault/2026/jan/making-sense-of-not-making-cents); [FRBServices penny FAQ](https://frbservices.org/resources/financial-services/cash/faq/penny-order-deposit-information) |
| **Apr 30, 2025** | **Common Cents Act** (Reps. **McClain**, **Garcia**; Sens. **Lummis**, **Gillibrand**) — formalize penny halt + **federal cash rounding** to nearest nickel; authorize **cheaper nickel composition**; **$1 coin** design provisions (Sacagawea revert on program termination per House report). | [H.R. 3074](https://www.congress.gov/bill/119th-congress/house-bill/3074); [H. Rept. 119-235](https://www.govinfo.gov/content/pkg/CRPT-119hrpt235/html/CRPT-119hrpt235.html) |
| **Sep 4, 2025** | H.R. 3074 **reported (amended)**; placed on **Union Calendar No. 192** — **not** enacted as of Jun 2026. | [Congress.gov — H.R. 3074](https://www.congress.gov/bill/119th-congress/house-bill/3074) |
| **Jul 23, 2025** | House Financial Services Committee **35–13** — but **committee substitute removed federal cash-rounding rules** (rounding left to **states** + Treasury guidance); bill **stalled** with **no floor vote** since **Sep 2025** per [CommonCentsAct.com](https://commoncentsact.com/about). | [CommonCentsAct.com — About](https://commoncentsact.com/about); [AP News — Mint penny plans](https://apnews.com/article/us-mint-treasury-department-penny-end-production-daf6367d7e8d31d6783720d5d4667115) |

**Legal tender note (documented):** Existing pennies **remain legal tender**; Treasury encourages **spending** jar hoards to ease retailer transition. **No new cents** enter the pipeline — stock **monotonically shrinks**.

---

## 2. Three-pillar model (investigation frame)

The user-supplied frame treats the trend as **overdetermined** — not one cause, but **reinforcing lanes**:

| Pillar | Mechanism | Documented? |
|--------|-----------|-------------|
| **A. Intentional government phase-out** | Executive + Treasury **Mint authority** (31 U.S.C. §§ 5111, 5112); **Congress** retains constitutional **coin money** power but **delegates** operational minting; **penny** halted; **nickel** under cost scrutiny; **dollar coin** programs historically **under-promoted** vs **$1 bill**. | **Yes** for penny halt; **partial** for broader “war on cash” |
| **B. Supply-chain / distribution disruption** | **Coin terminals** (Fed + contractors) as **bottleneck**; **2020** pandemic ** circulation break**; **2025–2026** **deposit/order** suspensions **accelerate** regional scarcity even when **aggregate** penny stock is **large** (114–250B estimates vary by source). | **Yes** |
| **C. Consumer transition to digital** | **Cards, apps, ACH, RTP, FedNow** — cash **14%** of transactions (**2024**); age skew (**18–24:** 10% cash vs **55+:** 19%). | **Yes** (Fed payment diary) |

**Investigation stance:** Pillars **A–C** are **mutually reinforcing** whether or not a single planner exists. **Friction in B** pushes marginal users off **cash**; **A** removes the **smallest denomination** and invites **nickel-as-floor** debate; **C** lowers the **political cost** of A.

---

## 3. Mint economics — seigniorage, penny, nickel

From the **U.S. Mint 2024 Annual Report** (summarized by [St. Louis Fed](https://www.stlouisfed.org/publications/page-one-economics/2026/may/penny-costs-more-than-penny-economics-behind-ending-the-cent) and [Richmond Fed EB 25-27](https://www.richmondfed.org/publications/research/economic_brief/2025/eb_25-27)):

| Denomination | Cost per unit (2024) | Net seigniorage (2024) |
|--------------|----------------------|-------------------------|
| **Penny** | **3.7¢** | **−$85.3M** |
| **Nickel** | **13.8¢** | **−$17.7M** |
| Dime | 5.8¢ | +$35.6M |
| Quarter | 14.7¢ | +$165.6M |

**Treasury projected savings** from **stopping penny production:** ~**$56M/year** material costs — **0.0015%** of a ~$6.8T federal budget (2024). **Fiscal headline** is **small**; **symbolic and structural** effects (smallest unit, rounding, habit) may exceed **line-item** savings.

**Nickel watch (documented):** Richmond Fed notes **nickel** losses can **spike** with volume (**$78M–$92.6M** losses in **2022–2023** vs **$17.7M** in **2024** on lower mintage). **Penny removal** may **increase nickel demand** for change-making — **ironic pressure** on the **next** loss-making coin.

---

## 4. Federal Reserve coin distribution — where access actually breaks

**Roles (documented):**

- **Mint (Treasury):** **Production** and **seigniorage** accounting.  
- **Federal Reserve Banks:** **Distribution** to **depository institutions** only — **not** direct to stores or consumers.  
- **Coin terminals (~165 nationwide):** Banks deposit **surplus** coin and **withdraw** needed denominations; **private contractors** operate many sites **for** the Fed.

**2025–2026 friction pattern:**

1. **Production stop** → no **fresh** penny injection.  
2. **Hoarding** (jars, sentiment, “last pennies”) → **velocity** drops.  
3. **Terminals** below **inventory thresholds** **suspend** penny **orders** and/or **deposits** → **banks** cannot **recycle** hoards into **commerce**.  
4. **Retail** sees **“exact change”** signs, **rounding**, or **penny refusal** — **local** “shortage” with **national** stock intact.

**Jan 2026 partial reversal:** FRFS **reopened deposit acceptance** at previously suspended locations — **monitoring** whether **ordering** can expand. This is **circulation support**, **not** mint restart.

---

## 5. Precedent — 2020 “coin shortage”

During **COVID-19**, the Fed and Treasury described a **circulation disruption**, not a mint failure:

- **Business closures** → coin **stuck** in registers and home jars.  
- **Mint** briefly **reduced** staffing; **production** recovered.  
- Public messaging: **“get coin moving”** campaigns; retailers **discouraged** cash or **requested** exact change.

**Rhyme for this investigation:** The **2020** episode proved **distribution velocity** can break **without** stopping the Mint. The **2025–2026** episode adds **production halt** on the **most-used** denomination (**pennies = 57%** of **2024** circulating coin output) — **stronger** structural drain.

---

## 6. Digital payments context — cash minority, instant rails

| Metric | Value | Source |
|--------|-------|--------|
| Cash share of transactions | **14%** (2024) | Fed **Diary of Consumer Payment Choice** / FRFS, cited [St. Louis Fed](https://www.stlouisfed.org/open-vault/2026/jan/making-sense-of-not-making-cents) |
| Age gradient | **10%** cash (18–24) vs **19%** (55+) | Same |
| **FedNow** (instant payments) | Launched **July 2023**; participant growth ongoing | Fed public materials |

**Documented tension:** [Richmond Fed EB 25-27](https://www.richmondfed.org/publications/research/economic_brief/2025/eb_25-27) — **electronic** payments stay **exact** to the cent; **cash** faces **rounding** as pennies exit. **Digital** avoids **rounding tax**; **cash** bears it — **incentive** aligns with **C** without proving **conspiracy**.

**CBDC tier:** This file **does not** treat **retail CBDC** as **enacted** U.S. policy (2026). **Fed** accounts / **wholesale** CBDC research are **separate** tracks; link as **hypothesis** only in §7.

---

## 7. Author pattern thesis — physical coin as “suppressed bearer technology”

**Author / project pattern (interpretive — not adjudicated here):**

> Physical coins are the **last widely circulating bearer instruments** that do not **phone home**. Reducing mint output, **clogging** Fed terminals, and **privileging** card/app rails repeats the **enclosure** arc documented in computing investigations: **absorb legitimacy** (pennies still “legal tender”), then **add friction** until **users self-select** into **surveilled** systems.

**Unpack:**

- **Bearer vs account money:** A quarter **is** the settlement; a **debit swipe** is a **permissioned** ledger entry.  
- **Denominations as infrastructure:** Removing the **1¢** unit **re-anchors** cash to **5¢** granularity — **coarser** physical money **pushes** micro-prices toward **digital exactness**.  
- **Constitutional echo:** [Article I coining power](/governance/usury/d.md) vs **Fed + Treasury delegation** — same **governance drift** thread as **1913** Fed narrative in usury material.  
- **Not proven:** That **terminal closures** were **designed** to **force** cash abandonment; **plausible** that **inventory math** + **halt** **interact** with **predictable** outcomes.

**Predictive-programming lane (optional clue tier):** Dystopian **cash ban** tropes are **genre-common**; treat as **cultural preconditioning**, not **evidence** of a dated plan.

---

## 8. Penny politics — who wants it gone, who wants it back, and whether minting returns

**Current state (Jun 2026):** The **Mint no longer strikes circulating pennies** (last general-circulation cent **12 Nov 2025**). **Existing cents remain legal tender** — only **Congress** can **demonetize** a denomination ([Wikipedia — penny debate](https://en.wikipedia.org/wiki/Penny_debate_in_the_United_States)). **Numismatic / collector** pennies still minted for **sets** sold at **premium**. **Federal Reserve** **reopened penny deposits** at many terminals (**Jan 2026**) but **cannot mint** replacements — national **stock is finite** and **regionally stranded** when terminals suspend service.

### 8.1 Camp — abolish / phase out (documented)

| Actor | Stated rationale | Source tier |
|-------|------------------|-------------|
| **President Trump** (Feb 2025) | **Waste reduction**; penny costs **>1¢** to make; DOGE / efficiency framing | Press; [Boston Globe Feb 2025](https://www.bostonglobe.com/2025/02/12/nation/trump-penny-production-treasury/) |
| **Treasury / Mint** | **−$85.3M** seigniorage on pennies (**2024**); **~$56M/yr** savings from halt | Mint report via [St. Louis Fed](https://www.stlouisfed.org/publications/page-one-economics/2026/may/penny-costs-more-than-penny-economics-behind-ending-the-cent) |
| **Bipartisan legislators** | **Common Cents Act** — halt + **uniform nickel rounding** + **nickel metallurgy** reform | [H.R. 3074](https://www.congress.gov/bill/119th-congress/house-bill/3074); committee **35–13** |
| **Economists / Fed research** | **Rounding tax** small nationally but **documented**; **digital exactness** vs **cash coarseness** | [Richmond Fed EB 25-27](https://www.richmondfed.org/publications/research/economic_brief/2025/eb_25-27) |
| **State allies (examples)** | **Gov. Jared Polis (D-CO)** — long **anti-penny** before Trump order | [Wikipedia — penny debate](https://en.wikipedia.org/wiki/Penny_debate_in_the_United_States) |
| **Public opinion (historical)** | **~62–67%** favored **keeping** the penny in **ACC-commissioned** polls (**1990**, **2012**) — **pro-abolish** sentiment **grew** with **cost** headlines but **not** a clean modern referendum | [Americans for Common Cents — Wikipedia](https://en.wikipedia.org/wiki/Americans_for_Common_Cents) |

**Structural point:** **Abolish** forces are **now institutionalized** — executive **halt** precedes (or **forces**) **Congress** to **catch up** with **rounding rules**, not the reverse.

### 8.2 Camp — keep / restore production (documented)

| Actor | Stated rationale | Source tier |
|-------|------------------|-------------|
| **Americans for Common Cents (ACC)** | **Rounding-up inflation**; **charitable** penny drives; **historical/cultural** symbol; **Abraham Lincoln** cent | [ACC — Wikipedia](https://en.wikipedia.org/wiki/Americans_for_Common_Cents); [Public Integrity](https://www.publicintegrity.org/politics/saving-the-penny-makes-cents-for-zinc-backed-front-group/) |
| **Artazn (formerly Jarden Zinc Products)** | **Sole** (historically dominant) **zinc blank** supplier to Mint — **direct revenue** from penny mintage | [Boston Globe Feb 2025](https://www.bostonglobe.com/2025/02/12/nation/trump-penny-production-treasury/); [Savannah Morning News 2007 profile](https://www.savannahnow.com/story/news/2007/08/16/jarden-zinc-products-lobbies-congress-keep-1-cent-coin-going-extinct/13791388007/) |
| **Mark Weller (ACC executive director / zinc lobbyist)** | Post-Feb 2025 **“complete surprise”**; mobilizing **TN/NC** senators (**Blackburn**, **Hagerty**, **Tillis**, **Budd**) where **blank/coin** jobs concentrate | [Boston Globe Feb 2025](https://www.bostonglobe.com/2025/02/12/nation/trump-penny-production-treasury/) |
| **Retail / cash users (fragmented)** | **Exact-change** ordinances in some **cities**; **unbanked** reliance on **cash**; **distrust** of **rounding** | [Wikipedia — penny debate](https://en.wikipedia.org/wiki/Penny_debate_in_the_United_States); FDIC unbanked data (§10 Q5) |
| **Prepper / hoarder / “last pennies” lane (observed, not a formal lobby)** | **Jar stock** as **store of small value**; **legal tender** **indefinitely**; **no account** required — **bearer** property | **Cultural / author observation**; rhymes with §7 thesis |

**Conflict-of-interest tier:** ACC is **primarily zinc-funded** ([Public Integrity](https://www.publicintegrity.org/politics/saving-the-penny-makes-cents-for-zinc-backed-front-group/)); **economic** arguments **overlap** **industrial** interest — treat **polls** and **rounding-up** claims as **advocacy**, not **neutral** science.

### 8.3 Likelihood the circulating penny “comes back”

| Scenario | Probability (investigation judgment, Jun 2026) | Why |
|----------|-----------------------------------------------|-----|
| **Circulating minting restarts** under **Trump II** | **Low** | Halt **already executed** (Nov 2025); **Treasury** messaging **celebrates** final cent; **DOGE** **optics** favor **cut**; **restarting** admits **policy reversal** |
| **Future administration resumes penny production** (legal path) | **Low–medium (long horizon)** | Halt is **Mint discretion** under **31 U.S.C. §§ 5111, 5112** — **not** demonetization; a **new** Treasury Secretary **could** order mintage **without** new law ([coinrollhunting.org analysis](https://coinrollhunting.org/lincoln-cent-end/)) — but **bipartisan H.R. 3074 / S. 1525** momentum makes **reversal** **politically costly** |
| **Congress demonetizes** the cent | **Low–medium** (long horizon) | Requires **law**; **Common Cents Act** **preserves legal tender** while **stopping production** — **politically easier** than **voiding** jar hoards |
| **Penny remains legal tender, dies by attrition** | **High (baseline)** | **114–250B** estimates in **circulation**; **velocity** ↓ with **terminal** friction; **decades** of **register** float |
| **Federal rounding rule passes** | **Medium** | **House** committee **advanced** bill; **Senate** needs **~7 Democrats** for **60** votes per press analysis — **not guaranteed** |
| **Zinc / ACC block restores mintage** | **Low–medium** | **Concentrated** job losses (**TN**, **NC**) are **real** lever, but **executive** already **consumed** political capital on **halt**; **Weller** targeting **DOGE caucus** education ([Boston Globe](https://www.bostonglobe.com/2025/02/12/nation/trump-penny-production-treasury/)) |

**Net:** **New pennies** for **commerce** are **unlikely** to return **under the current executive**; **legal tender cents already minted** **persist** for **years** in **jars, tills, and prepper stock**. **Federal rounding** remains **patchwork** (House bill **dropped** symmetric **5¢** rules; **~25 states/territories** with rounding legislation per [CommonCentsAct.com](https://commoncentsact.com/about)). **Hardware** should ship **penny-era** SKUs for **hoarders / exact-cent** lanes and **dollar-coin** SKUs as **forward default** — see §11.2–11.3.

### 8.4 Dollar coin — possible successor denomination(s)

The **$1 bill** still **dominates** despite **decades** of **$1 coin** programs (**Susan B. Anthony**, **Sacagawea / Native American**, **Presidential**, **American Innovation** — **same “golden dollar” spec** from **2000** onward: **~26.5 mm** diameter, **~2.0 mm** thick, **vs quarter ~24.26 mm**).

**Documented legislative hook:** **Common Cents Act** report language includes **$1 coin** **design reversion** to **Sacagawea** when **program coins** terminate ([H. Rept. 119-235](https://www.govinfo.gov/content/pkg/CRPT-119hrpt235/html/CRPT-119hrpt235.html)) — **not** a **mandate** to **retire the $1 bill**, but **signal** that **coin-side** **policy** is **in motion** alongside **penny** exit.

**Circulation reality (documented pattern):** **Dollar coins** **mint** but **do not displace** **$1 notes** without **bill withdrawal** ( **Ecuador / Canada** precedents cited in **prior** congressional debate). **Penny halt** **increases** **nickel** **change-making** load ([Richmond Fed EB 25-27](https://www.richmondfed.org/publications/research/economic_brief/2025/eb_25-27)) — **does not** **by itself** **force** **$1 coin** **adoption**.

**Hardware implication:** A **post-penny** wallet **replaces four penny pockets** with **one larger $1 coin pocket** ( **Sacagawea / Presidential / Innovation** **interchangeable** in tray). **Combinatorics** for **nickel-rounded** cents (**0–95¢** in **5¢** steps) **unchanged** at minimum **3Q · 1D · 2N** — the **$1 slot** is **carry / receive / pay** convenience for **whole-dollar** **coin** **users**, **not** a **smaller** minimum set (exhaustive check, Jun 2026).

### 8.5 Pop-culture seed — Kevin Malone poker denomination shift (hypothesis)

**Optional clue tier — not evidence:** Same **predictive-programming lane** as §7’s dystopian **cash-ban** tropes — **cultural preconditioning**, not proof of a dated Treasury brief.

**Source beat:** In ***The Office*** **S02E22 *Casino Night***, **Kevin Malone** runs a **deceptive** poker persona — documented in the same episode via a **World Series of Poker** brag ([Springfield S02E22](https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=the-office-us&episode=s02e22)). When others ask about his **betting system**, he **confidently** explains: **“Nickels are worth 10, dimes are worth 25, and quarters are worth 50.”** Full catalogue + **NSA-aligned PP** framing: [Cruz–Kevin investigation — Casino Night deep dive](/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation.md#casino-night-quote-nickels-worth-10-dimes-25-quarters-50-s02e22).

**Why it rhymes with §8 penny politics:**

| Layer | Read |
|-------|------|
| **Not “no pennies in poker”** | **Nickels** are already the **practical floor** in most coin poker; **pennies** only in **ultra-cheap** games — **irritating to split**, not funny to omit. Kevin’s line **must** do more: **renumber every surviving coin upward**. |
| **Straight comedy** | **Absurd private table** + **false confidence** (same lane as **WSOP** brag); **~2× labels** = **surface misdirection**. |
| **Ladder promotion + value upgrade (primary PP)** | **Penny omitted**; **nickel first**; each coin **one rung up** — **symbolic penny-into-nickel / nickel-as-floor** — plus **all labels marked higher** = **pro-national revaluation** seeded **years before** Treasury halt. **Not** literal SKU math (**3Q · 1D · 2N** in §11.1). |
| **American sovereignty (hypothesis)** | **Domestic coin ladder reasserted by fiat** while **bearer metal** persists ([§7](/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md)) — **national** denomination act vs **ledger enclosure**. **Optional clue tier** — not evidence. |

**Transcript hygiene (Jun 2026):** Published **Casino Night** scripts recover Kevin’s **WSOP** poker material **not** the **nickels-10 / dimes-25 / quarters-50** line — **confirm on episode** before treating as **verbatim** broadcast dialogue.

**Cross-reads:** [Exact-Change Wallet §II](/science/computing/exact-change-wallet-invention-and-aftermath.md) (team-jersey / penny politics); [Trump-era Hollywood PP investigation](/influence/hollywood/trump-era-hollywood-political-media-investigation.md).

---

## 9. Rounding, state law, and consumer impact

**Federal gap (documented):** **No** uniform federal **cash-rounding** rule as of penny halt; **Common Cents Act** would impose **nearest-nickel** symmetry if passed.

**State / local patchwork:** Multiple states introduced **rounding** guidance or **exact-change** rules ([Wikipedia — penny debate](https://en.wikipedia.org/wiki/Penny_debate_in_the_United_States)); **retail** policies **differ** (some **require** exact change; some **round**).

**Richmond Fed estimate:** Phase-out **rounding tax** ~**$55.5M** aggregate if broadly applied — **small** nationally but **regressive** if **cash-poor** households pay more **round-up** events ([EB 25-27](https://www.richmondfed.org/publications/research/economic_brief/2025/eb_25-27)).

---

## 10. Questions to clarify, verify, or debunk

| # | Question | Falsifier / source target |
|---|----------|---------------------------|
| 1 | Will **nickel** production be **halted** or **reduced** next? | Mint **2025–2026** reports; Treasury statements |
| 2 | Does **Fed terminal** policy **formally** tie suspensions to **penny halt**, or only **inventory**? | FRBServices **operating bulletins**; GAO if any |
| 3 | **Common Cents Act** — passage or death in committee? | Congress.gov |
| 4 | **Post-halt** coin **velocity** vs **2019** baseline — measurable drop? | Fed **Cash Product Office** data |
| 5 | **Unbanked / underbanked** share still **cash-dependent** — harm studies? | FDIC **Unbanked Survey** |
| 6 | **Retail CBDC** pilot links to **coin reduction**? | **No documented link** required to **debunk** thesis; watch **Fed** releases |
| 7 | Will **ACC / zinc** lobby **reverse** Trump **halt** or only **slow** **Common Cents Act**? | **Mint** **procurement** records; **TN/NC** delegation **votes** |
| 8 | Does **$1 coin** **circulation** **rise** measurably **post-penny** without **$1 bill** **withdrawal**? | Fed **Cash Product Office** **denomination** **flows** |

---

## 11. Related investigations and exact-change wallet product fork

| Topic | Link |
|-------|------|
| Constitutional coining / Federal Reserve | [/governance/usury/d.md](/governance/usury/d.md) |
| Google / Android enclosure | [/science/computing/investigations/google-dont-be-evil-enclosure-investigation.md](/science/computing/investigations/google-dont-be-evil-enclosure-investigation.md) |
| Internet / machine-readable enclosure | [/science/computing/investigations/internet-that-should-have-been-investigation.md](/science/computing/investigations/internet-that-should-have-been-investigation.md) |
| Bitcoin (alternative ledger narrative) | [/influence/conspiracy/topics/bitcoin](/influence/conspiracy/topics/bitcoin) |
| Banker wars / monetary history | [/governance/war](/governance/war) |
| Exact-change wallet invention (author hardware concept) | [/science/computing/exact-change-wallet-invention-and-aftermath.md](/science/computing/exact-change-wallet-invention-and-aftermath.md) |
| Kevin Malone (*Casino Night*) — coin denomination PP seed | [/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation.md#casino-night-quote-nickels-worth-10-dimes-25-quarters-50-s02e22](/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation.md#casino-night-quote-nickels-worth-10-dimes-25-quarters-50-s02e22) |
| Inventor containment casebook (§V — McAfee, Swartz, Kildall, Murdock, Tucker/DeLorean) | [/science/computing/exact-change-wallet-invention-and-aftermath.md#v-inventor-containment--how-the-third-act-gets-scripted](/science/computing/exact-change-wallet-invention-and-aftermath.md#v-inventor-containment--how-the-third-act-gets-scripted) |

### 11.1 Minimum coin inventory (exact-change wallet — recovered design)

**Context:** Companion reader essay [Exact-Change Wallet — Invention and Aftermath](/science/computing/exact-change-wallet-invention-and-aftermath.md) — wallet-sized MCU + keypad + per-slot LEDs/sensors; user enters sale total; device lights coins for **exact cents payment** with paper dollars or **break-back** after receiving change.

**Computational result (U.S. {25, 10, 5, 1}¢, exhaustive search, Jun 2026):**

| Inventory | Face value | Coin count | Makes all 1–99¢? |
|-----------|------------|------------|------------------|
| **3Q · 1D · 2N · 4P** | **99¢** | **10** | **Yes** (minimum coin count) |
| 2Q · 4D · 1N · 4P | 99¢ | 11 | Yes |
| 3Q · 2D · 1N · 4P | 104¢ | 10 | Yes (over $1 face) |

**Post-penny (5¢ granularity, 0–95¢):** **3Q · 1D · 2N** = **95¢**, **6 coins** — minimum for nickel-rounded cash.

**Tier:** **Combinatorics / author design recovery** — not Mint or Fed policy. **Penny halt** (§1) reduces real-world utility of penny-inclusive trays over time.

### 11.2 Four SKUs — form factor × coin era

| SKU | Form | Tray layout | Firmware | Target buyer |
|-----|------|-------------|----------|--------------|
| **A — Card Slice · Penny** | **~102×67×5–6 mm** insert; **dual rotary wheels** 0–99 (`$` + `¢`) on **edge rail** | **3Q · 2D · 1N · 4P** (10 coins, **104¢**) | **1¢** resolution; **live LEDs** on detent | **Legacy cash** users, **collectors**, **jurisdictions** still **demanding** **exact** **cent** change |
| **B — Card Slice · Dollar** | Same shell; **wheels** (¢ in **5¢** steps); **$1 pocket** **26.5 mm** | **3Q · 2D · 1N · 1×$1** (7 coins) | **5¢** rounding mode | **Post-penny** **default**; **$1 coin** carriers |
| **C — Full Wallet · Penny** | **~8–10 mm** closed; cards, **ID**, bills; **display stack**: halo → readout → **`$`/`−`/`+`** under display | Same as **A** | Same as **A** | **Daily driver** **or** **prepper** **bearer** kit |
| **D — Full Wallet · Dollar Plus** | Same as **C** + **0–9 keypad below buttons** on tray rim (not hinge) | Same as **B** | Same as **B** | **Forward-looking** **cash** **competence** |

**Shared industrial design:** **No Bluetooth / no app** — **MCU + dual rotary wheels (Slice) or display-stack buttons (Wallet) + LED/sensor tray + bill halo**; **CR2032** or **USB-C** trickle; **open firmware** optional. **Same spend-map firmware** on all SKUs — only the **input driver** differs. Canonical art: [`ecw-design/`](/science/computing/ecw-design/README.md). **Display** shows **handover** whenever it differs from set total (§I).

**Dollar coin variants in one pocket:** **Sacagawea**, **Presidential**, and **American Innovation** **$1** coins share **golden-dollar** **dimensions** — **one** mechanical **slot** covers **all** **current** **programs**; **Susan B. Anthony** (**same diameter**, **1979–1981** / **1999**) also **fits**; **Eisenhower** **38.1 mm** **does not**.

### 11.3 Marketing — dual camp, one device family

**Pro-phase-out / modern cash (SKUs B, D):**

- **Pitch:** “**Nickel-exact** without **mental math** — **enter total**, **pay**, **done**.”  
- **Pain solved:** **Rounding confusion** (§9), **empty penny** **tray** at checkout, **clerk** **disputes**.  
- **Tone:** **Efficiency**, **competence**, **small-business** **sympathy** (“**I’m not the problem at your register**”).

**Pro-penny / prepper / off-grid (SKUs A, C — and **honest** **overlap** on **B/D**):**

- **Pitch:** “**The last wallet that doesn’t phone home** — **no account**, **no OS**, **no hack surface**.”  
- **Pain solved:** **Distrust** of **card rails** and **CBDC** **hypothesis** (§7); **desire** to **use** **jar pennies** **competently** while **stock** **lasts**; **grid-down** **commerce** **practice**.  
- **Tone:** **Self-reliance**, **bearer money**, **transparent** **physics** ( **LED** = **this** **coin** **now** ) — **not** **crypto**, **not** **bank app**.

**Single brand line:** **Exact-Change Wallet** — **era** chosen at **purchase** (**penny** vs **dollar-coin** **insert**); **Full** vs **Slice** = **carry** **preference**. **Honest limit:** device **cannot** **restore** **Mint** **output**; it **only** **restores** **user** **skill** at the **register**.

**Tier:** **Author product / go-to-market sketch** — **not** **market** **research** or **sales** **data**.

---

Keywords: #PhysicalCoin #CashlessTransition #PennyPhaseOut #FederalReserve #SuppressedTech #ParadigmThreatFiles

---

## Limits and disclaimers

**Prisca sapientia (epistemic foundation):** This investigation assumes [**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md)—the historical and philosophical belief that the ancients possessed a vast, profound understanding of the universe, nature, and theology that was subsequently lost or degraded. Modern consensus science and institutions are not treated as default truth; evidence tiers below adjudicate specific claims.

**Evidence tiers:** **Treasury, Mint, and Federal Reserve** publications are **primary** for **policy and operations**. **ABA**, **regional Fed** explainers, and **Wikipedia** are **secondary convenience** — verify against primaries before citing as **fact**. **Author pattern thesis (§7)** is **interpretive**; it is **first-class** for **Paradigm Threat** navigation but **not** a **legal** or **historical** finding of **centralized intent**. **CBDC**, **deep-state**, and **predictive-programming** mentions are **hypothesis** unless separately sourced. **Cross-investigations** are **thematic rhymes**, not **proof** of a **single** orchestrator.

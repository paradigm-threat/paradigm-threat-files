# Fomenko New Chronology — Partial Verification, Access, and Public Reproducibility

![Fomenko New Chronology — verification, accessibility, and reproducibility (illustrative header)](fomenko-new-chronology-verification-accessibility-investigation.png)

**Status:** Open (active build-out of verification ladder and tooling goals)  
**Scope:** What can be checked *now* with public or mirrored material; what would be required for *full* replication; access barriers for Western researchers; classification; a lay-readable case for why the *statistical layer* deserves scholarly attention (without asserting that global conclusions are proven).

**Related:** [Illig–Fomenko boundary](/history/chronology/investigations/illig-fomenko-boundary.md); [Two branches: Fomenko vs author](/history/chronology/investigations/two-branches-christianity-fomenko-vs-author.md); [Rus–Horde lexicon (open)](/history/chronology/investigations/rus-horde-english-political-lexicon-speculation.md). **Local mirror index:** `~/dev/wget/investigations/chronology/index-chronologia.md` (chronologia.org snapshot); live site [chronologia.org](https://chronologia.org/en/index.html).

---

## 1. Executive summary

Fomenko–Nosovskiy “New Chronology” (NC) combines (a) **empirico-statistics on narrative texts** (volume functions, dependence scores, dynastic parallelism tables), (b) **astronomical and calendrical re-dating**, and (c) **historical reinterpretation** (e.g. Rus–Horde). **Only part (a)’s core algorithm is spelled out in a peer-reviewed mathematics-adjacent venue** with a **small, explicit corpus** (Fomenko & Rachev, 1990). The **global pairwise matrix** and **raw segmentation files** underlying the book series were **not released as an open dataset**. Therefore:

- **Partial verification** is possible today: re-implement the published method and run it on **named texts** and on **PSRL-class chronicles** you digitize yourself.
- **Complete verification** of “everything NC ever computed” would require **authoritative raw outputs** (or full reconstruction from primary editions with identical preprocessing), which are **not publicly catalogued**.

This investigation records **progress**, **gaps**, **access friction**, and a **roadmap** toward an **open, simulated “calculator”** on **`paradigm-threat-site`** (see **Section 7**) so the **mathematical layer** can be tested without endorsing every historical conclusion. **Empirical numbers run to date** are logged in **Section 8**. **Published counter-arguments and replication-adjacent work** are listed in **Section 9**.

### 1.1 Digitization, packaging, and “missing outputs” are different problems

It is **easy to conflate** three barriers; separating them explains why “nothing is online” is **only half true**.

| Barrier | What it means | Status for NC today |
|--------|----------------|---------------------|
| **A. Prose digitization** | Are the *books* or chronicles available as **searchable text** or only **scan PDFs**? | Many mirrors (including our seed PDFs) are **image scans**: `pdftotext` can yield **zero** extractable words without **OCR**. That blocks **automatic** `year → volume` tables. |
| **B. Corpus packaging** | Even when text exists (libraries, IA, PSRL projects), is it **aligned** to annalistic **years**, **same edition** Fomenko used, and **licensed** for redistribution? | Often **no single public bundle** meets all four; volunteers must **build** CSVs. |
| **C. Released numerical outputs** | Did the authors publish **raw matrices** (all chronicle pairs, scores, shifts) as they computed them? | **Not as an open dataset.** The 1990 paper gives **methods + a small Table 1–style sample**; the book line gives **narrative + selected tables**, not a turnkey dump. |

**Conclusion:** Lack of **easy digitization** explains why *we* could not immediately recompute on those PDFs. It does **not** by itself explain absence of **their** internal spreadsheets: those could have been released (even partially) regardless of whether Delamere PDFs were born-digital. **Both** A/B **and** C matter for “full validation against what they actually ran.”

### 1.2 Speculation — why a complete, validatable public dataset never appeared

Everything below is **inference and guesswork**, not attributed to any named source. It mixes **boring institutional causes** with **incentive** effects; several can be true at once.

1. **Era and genre (most boring)** — Pre-2000s computational humanities rarely shipped **code + data** with monographs. “The article is the artifact” was normal; **reproducibility packages** are a **recent norm**, not a retroactive obligation.
2. **Nobody was paid to replicate** — Mainstream history and Slavic studies had little incentive to **re-run** a controversial pipeline at scale; **dismissal** is cheaper than **multi-year OCR + alignment**. Conversely, NC sympathizers may prefer **popular synthesis** over **maintaining a data warehouse**.
3. **Technical entropy** — Internal runs may have lived on **tape/disk**, one-off Fortran or early PC jobs, **undocumented** file formats; **loss** and **bit-rot** are common for 1970s–1990s lab work everywhere, not unique to Moscow.
4. **Rights and redistributability** — Even if matrices existed, publishing **full derivative statistics** on **PSRL** and other in-copyright editions could have looked **legally risky** without publisher clearance; safer to publish **figures** inside books.
5. **Strategic ambiguity (weak speculation)** — A **partially specified** empirical halo can be **harder to falsify** than a full dump that independent teams could mine for **negative controls**. This is **not** proof that anyone thought that way; it is a **rational-choice** possibility in controversial science-adjacent work.
6. **“Nobody did the work” in one sense, yes** — The **community** never produced a **neutral, edition-keyed, year-segmented open corpus** labeled “for NC replication,” because that is **thankless infrastructure**, not a career default for either camp.

**Net:** The gap is **overdetermined**: **scan-heavy sources**, **no cultural habit of data deposit**, **possible loss of originals**, **copyright caution**, and **low prestige for adversarial replication** together explain the vacuum better than any single story.

---

## 2. Partial verification — what we have done and can do next

### 2.1 Completed (repository / local context)

| Item | Location / note |
|------|------------------|
| Method paper (PDF) | `wget/chronologia.org/en/volume_functions_of_historical_texts.pdf` — Fomenko & Rachev (1990), *Computers and the Humanities* 24: 187–206. Defines **dependent vs independent** texts, **volume functions** \(\mathrm{vol}\,X(t)\), **maxima correlation**, **amplitude correlation**, **Weibull–Gnedenko** fits to normalized accumulated sums, **linear regression** parameters. |
| Diacu survey (PDF) | `wget/chronologia.org/en/2013_florin_diacu_math_methods.pdf` — Florin Diacu, *Notices of the AMS*, April 2013 ([DOI 10.1090/noti962](https://doi.org/10.1090/noti962)). Places NC in context of historical dating and mathematical methods; useful for **skeptical calibration**. |
| Delamere / chronologia PDFs | `wget/chronologia.org/en/chronologia1/` … `chronologia8/` — narrative, dynastic tables, eclipse material; good for **case-by-case** checks, not a single machine dump. |
| Seed corpus (PDFs) | `wget/fomenko-nc-sources/README.md` — PSRL tom I (1926), Gregorovius (scan), Livy (Capes 1880 substitute), plus method paper copy. |
| User Downloads (optional) | Anna’s-style **PSRL** `.zip` (OCR `.txt` chunks); partial **Primary Chronicle** PDF from IA — see prior session notes; useful if normalized into **year-aligned segments**. |

### 2.2 Next steps (concrete, reproducible)

1. **Segmentation pipeline** — For each chronicle: rule for **year** \(t\), rule for **unit of volume** (lines / words / characters), handling of **missing years** and **composite chapters**. Document choices; sensitivity analysis (bin width, overlapping windows).
2. **Replicate Table 1 class outputs** — Recompute \((a,\lambda)\), correlation \(r\), for the **same named sources** as in (1990): Russian Primary Chronicle; Nikiforovskaya; Suprasl’skaya; Academical; Kholmogorskaya; Dvinskaya; Livy; Sergeev; Gregorovius (see paper, section “Historical Texts Investigated”). **Sergeev (1938)** still needs acquisition (Russian).
3. **Null models** — Shuffle year labels within windows; compare splash correlation to **surrogate** texts of matched length; report false-positive rate on **control pairs** (different regions/eras agreed independent by consensus).
4. **Publish outputs** — Small open repo: CSV of \(\mathrm{vol}\,X(t)\), parameters, plots; Jupyter or WASM notebook for “calculator” v0.

### 2.3 What “complete” verification would require

| Layer | Complete verification needs |
|-------|------------------------------|
| **Text statistics** | Full **list of every chronicle/document** compared; **pairwise score matrix**; **segmentation scripts** and **edition identifiers** (PSRL volume, column, manuscript family); **version-controlled** OCR or diplomatic text. |
| **Dynastic parallelism** | Formal **optimization problem** statement (objective, constraints), **full ruler lists** with sources, **all alternative alignments** rejected and why (not only the displayed parallel). |
| **Astronomy** | Per-claim: **observation equations**, catalogue star IDs, **ephemeris** (e.g. JPL DE440s + standard reduction), **sensitivity** to copyist error; independent code path from mainstream chronology tools. |
| **Synthesis** | Explicit **DAG** or table: which **numerical** results feed which **historical** identifications — so a failure in one layer does not silently invalidate unrelated layers. |

None of the above exists today as a **single downloadable bundle** from the NC authors; **complete** audit implies **rebuilding** that bundle or obtaining **unreleased** research files.

---

## 3. Difficulties Westerners may face in accessing records

These are **practical and linguistic**, not (for mainstream chronicle editions) **espionage barriers**.

1. **Language** — **PSRL** and most pre-1990 Soviet/Russian scholarship are **Russian** (and Old East Slavic in apparatus). Machine translation misses stemma and paleographic nuance.
2. **Edition fidelity** — Fomenko cites **PSRL** and specific print years; Western libraries may hold different impressions; **pagination** differs; OCR quality varies.
3. **Archive reading rooms** — **Manuscript originals** (e.g. Laurentian, Radziwiłł) require travel, registration, and sometimes **fee or letter of purpose**; digital surrogates may be **incomplete** or **paywalled** (institutional access).
4. **Copyright** — Modern translations (e.g. English Primary Chronicle, 1978) are often **restricted**; **IA** may block bulk download by IP or lending model. **Anna’s Archive**-style aggregation raises **legal risk** depending on jurisdiction.
5. **Metadata chaos** — Anna’s bundles often use **hash filenames**; reconstructing **canonical bibliographic identity** (ISBN, PSRL tom/vyp.) takes manual work (as in `~/Downloads` zip inventory).
6. **Interdisciplinary gap** — Historians rarely run **Weibull fits**; mathematicians rarely read **stemma**; few reviewers combine both at the level NC demands.

---

## 4. Classification — is any of this “classified”?

**Short answer:** Standard **chronicle research** (PSRL, published monographs, pre-1917 manuscripts in public catalogues) is **not** “classified” in the sense of **state secrets** (GRU/FSB restricted distribution). NC itself is **controversial historiography**, not a known **controlled document** regime.

**Nuances:**

- **Russian state archives** hold fonds with **access tiers** (personal data, church records, **still-sensitive** 20th-c. files). That is **archival policy**, not “Livy is secret.”
- **Military and nuclear** archives are irrelevant to **medieval chronicle statistics** unless a project explicitly pulls modern classified material (this investigation does not).
- **No evidence is cited here** that Fomenko’s **raw Fortran-era tapes** or internal matrices are **legally classified**; the more mundane problem is **non-release / loss / obsolescence**, typical of 1970s–1990s lab data worldwide.

If future evidence appears that specific fonds used in NC work are **restricted**, that finding should be logged with **archive citation** and **legal basis** (not rumor).

---

## 5. What NC says, in plain language (with citations)

**Picture thousands of history books as very long songs.** Some songs tell the **same story** but in different keys (different names, different centuries). Fomenko’s team asked: can we **detect when two “songs” are secretly the same melody** using **math on length and emphasis**, not just opinion?

1. **Volume “splashes”** — Year by year, count how much the writer wrote about that year. If two histories are really about the **same stretch of real time**, the **fat years** and **thin years** often line up—like two photographers snapping more frames when the action is hot. That idea is formalized as **volume functions** and correlation principles (Fomenko & Rachev, 1990; PDF in `wget/chronologia.org/en/volume_functions_of_historical_texts.pdf`).
2. **Dynastic déjà vu** — Lists of kings sometimes **repeat patterns** (durations, sequences of strife and reform) if one list is a **copy** or **reflection** of another shifted in time. NC builds large **parallel tables** (see Delamere volumes mirrored under `wget/chronologia.org/en/chronologia2/` etc.). **Critics** note **selection** risk: pattern richness in long lists can fit many alignments unless the search space is constrained **a priori**.
3. **Astronomy as cross-check** — Eclipses and star catalogues supply **independent clocks** if observations are trustworthy. NC claims some traditional datings fail while shifted dates fit; that branch must be checked with **standard ephemerides** (Diacu, 2013, surveys this terrain for a general mathematical audience).
4. **Precedent for “shortening antiquity”** — Newton’s *Chronology of Ancient Kingdoms Amended* is often invoked in NC-adjacent literature as historical precedent for **revising Greek chronology** by centuries; that does **not** validate NC, but it shows **serious earlier thinkers** questioned received timetables using **logical and textual** tools before modern radiometry.

**Bottom line for the lay reader:** NC is not one magic formula; it is a **stack** of **statistics**, **tables**, and **sky arguments**. The part most amenable to **public replication** is the **statistics on texts**—because it can be defined as **code + CSV**.

---

## 6. For a skeptical academic — why this is still worth looking at

This subsection argues **epistemic humility + research value**, not endorsement of NC’s historical conclusions.

1. **Peer-reviewed statistical core (narrow)** — Fomenko & Rachev (1990) is a **real journal article** with explicit definitions and numerical experiments on **named** historical texts. Regardless of global chronology, the question **“what do volume correlations imply about textual dependence?”** is **legitimate** and **falsifiable** on new corpora.
2. **Replication gap is a scientific problem** — If a broad program claims empirical backing but does not publish **raw matrices**, the correct scholarly response is not only dismissal but **structured replication attempts** and **negative results**—those advance **methodology** for digital palaeography and historiometry.
3. **Diacu’s framing** — Diacu (2013) treats NC as part of a wider story about **mathematics and chronology**; the piece is useful for **syllabus placement** and for separating **method criticism** from **narrative controversy**.
4. **Open tooling raises the debate’s quality** — An **open calculator** that implements **only** the 1990 machinery on **user-uploaded segmented CSV** would let historians **feel** the sensitivity of parameters without defending NC as a whole.

**Invitation:** Treat NC’s **published statistical layer** as a **hypothesis generator** worth **benching** against **nulls** and **alternative segmentations**—publish the bench. That is mainstream **computational humanities** hygiene.

---

## 7. Delivery plan — `paradigm-threat-site` (MDX components)

Interactive verification is slated for **[paradigm-threat-site](https://github.com/clevertree/paradigm-threat-site)** (Next.js + `next-mdx-remote`). **No React components are implemented yet**; this section records **where they will live** and **how they are tagged** in markdown so humans and future tooling share the same IDs.

### 7.1 How to tag a planned component (convention)

Use **both** of the following in any markdown that will later become site MDX:

1. **Visible callout** (readers see intent).
2. **Machine tag** — MDX **block comment** on its own line (grep-friendly; **do not** use `<!-- … -->` in site MDX — the compiler treats `<` as JSX and errors on `!`):

```mdx
<!-- pt-site:mdx name=ComponentPascalCase status=planned props=json-or-none -->
```

When implemented, each name is registered in **`paradigm-threat-site/components/ArticleContentSSR.tsx`** and **`paradigm-threat-site/components/RemoteMDX.tsx`** inside `mdxComponents()` (same pattern as `EmbedFile`, `PopImage`, …) and exported from **`paradigm-threat-site/components/index.ts`** if needed.

> **Planned MDX:** `FomenkoVolumeSeriesChart` — plot `year` vs `volume` from uploaded or preset CSV.  
<!-- pt-site:mdx name=FomenkoVolumeSeriesChart status=planned props={"preset":["psrl-tom1-sample","user-csv"]} -->
> **Planned MDX:** `FomenkoNasWeibullPanel` — NAS curve + Weibull–Gnedenko fit and reported **\(r\)** per Fomenko–Rachev (1990) regression.  
<!-- pt-site:mdx name=FomenkoNasWeibullPanel status=planned props={"method":"1990-linearization"} -->
> **Planned MDX:** `FomenkoPairShiftExplorer` — two series, user-chosen **lag** (years), maxima / amplitude correlation summary.  
<!-- pt-site:mdx name=FomenkoPairShiftExplorer status=planned -->
> **Planned MDX:** `FomenkoShuffleNullSummary` — within-window shuffle null for splash / correlation (seeded).  
<!-- pt-site:mdx name=FomenkoShuffleNullSummary status=planned -->
> **Planned MDX:** `FomenkoTable1Reference` — read-only table of published Table 1 rows + links to DOI / local PDF (no claim of recomputation until raw `vol(t)` exists).  
<!-- pt-site:mdx name=FomenkoTable1Reference status=planned -->
### 7.2 MVP stack (unchanged intent, now site-scoped)

- **Input:** CSV `year`, `volume` (or client-side tokenizer later).
- **Output:** charts, fit parameters, null run — rendered by the components above.
- **Runtime:** prefer **Pyodide** in a client island **or** server route under `paradigm-threat-site/app/api/…` for heavier fits (avoid blocking RSC).

### 7.3 Governance

- LICENSE: code MIT; **datasets** tagged by provenance and rights.
- **No** claim that the UI “proves” NC; **yes** claim it “implements or cites described statistics.”

### 7.4 Deep link `#img=/history/...` — missing image (fixed in site)

**Cause:** (1) The **fullscreen gallery** used `highResSrc` (`https://paradigmthreat.net/files/...`) before `src`, or raw root-relative `src` for ChangeLog-only items — on **localhost**, the CDN can **lag** GitLab Pages, and `/history/...png` is **not** served as a static file on the Next origin. (2) **ChangeLog strip thumbnails** used `changelogPublicImageSrc()` directly as `<img src>`, so the same root-relative paths **404** on `localhost:3000`.

**Fix:** (1) `galleryOverlayDisplaySrc()` in `components/Image/ImageGalleryContext.tsx`. (2) `changelogThumbSrc()` in `components/ChangeLog/ChangeLog.js` — repo-relative images use **`/api/image?path=...&w=160`** (thumbs) or **`w=1600`** (overlay), proxied to files mirrors.

---

## 8. Empirical validation log (numbers run in-repo / local)

This section records **what was actually computed** against **mirrored** material under `~/dev/wget/fomenko-nc-sources/`. It is **not** a replication of Fomenko’s full pipeline on PSRL (year segmentation not automated yet).

### 8.1 Published Table 1 — transcription from our PDF mirror (sanity)

Source: `wget/fomenko-nc-sources/fomenko-rachev_volume-functions-historical-texts_1990.pdf` via `pdftotext`. The **\(a\)** and **\(r\)** columns OCR cleanly; the **\(\lambda\)** (scale) column in this extraction is **garbled** (PDF line breaks / notation) — **do not** treat OCR’d lambdas below as authoritative without a second pass from the Springer PDF.

| Row id | Chronicle (paper) | Interval (paper) | **\(a\)** (transcribed) | **\(r\)** (fit quality, transcribed) |
|--------|-------------------|------------------|-------------------------|--------------------------------------|
| P1 | Russian Primary | 854–950 AD | 1.847 | 0.953 |
| P2 | Russian Primary | 913–1018 AD | 3.003 | 0.955 |
| P3 | Russian Primary | 960–1060 AD | 2.497 | 0.956 |
| P4 | Russian Primary | 998–1098 AD | 2.378 | 0.954 |

**Validation meaning:** confirms our **local mirror** carries the same **first Russian Primary rows** as the widely cited paper (spot-check against [DOI 10.1007/BF00117342](https://doi.org/10.1007/BF00117342)). It does **not** re-derive those numbers from raw chronicle data.

### 8.2 Synthetic “dependent vs independent” volume series (method sanity)

**Claim under test (structural only):** two chroniclers describing the **same** synthetic “events” should yield **high Pearson correlation** of per-year volume vectors; an **unrelated** process should not.

Procedure: `numpy` (seed **42**), \(T=200\) years, shared exponential baseline + three Gaussian “splashes”; **Y** = scaled splashes + noise; **Z** = independent exponential noise process.

| Comparison | Pearson \(r\) |
|------------|----------------|
| **X** vs **Y** (dependent construction) | **0.9906** |
| **X** vs **Z** (independent) | **−0.0833** |

Optional toy “peak spacing” (difference between successive local maxima, truncated to min length): dependent **0.4046**, X vs Z **−0.1748**.

**Validation meaning:** the **qualitative** statistic “similarity of volume sequences” **can** separate obvious dependence from independence in a controlled toy world. **Caveat:** Fomenko–Rachev’s published machinery uses **NAS + Weibull fit + specific linearization**, not raw Pearson of volumes; this demo only supports **feasibility**, not equivalence to their full test.

### 8.3 Full-document `pdftotext` word counts

| File | `pdftotext` words (approx.) | Note |
|------|-----------------------------|------|
| `fomenko-rachev_volume-functions-historical-texts_1990.pdf` | **10 531** | Text layer present — usable for search / quote checks. |
| `livy_capes_history-of-rome_1880_ia.pdf` | **0** | **Scanned / no extractable text layer** in this mirror. |
| `gregorovius_history-city-of-rome-middle-ages_vol15_1897_ia.pdf` | **0** | Same. |
| `psrl_tom1_lavrentevskaya-letopis_1926_ia.pdf` | **0** | Same (Cyrillic scan). |

**Validation meaning:** we **cannot** auto-build `year → volume` from these three PDFs without **OCR + layout parsing** (Russian harder than English). The **1990 paper PDF** is the only immediate corpus for grep-level checks.

### 8.4 TODOs (next numbers that would actually bite NC claims)

1. **OCR pipeline** for `psrl_tom1_lavrentevskaya-letopis_1926_ia.pdf` (and optional Livy/Gregorovius) → plain text → **regex / ML annalistic year heads** → CSV `year,volume`.
2. **Recompute NAS + Weibull + \(r\)** for at least **P1** window on that CSV; compare to published **\(a\), \(r\)** (allow tolerance; edition may differ from theirs).
3. **Nikiforovskaya vs Suprasl’skaya** dependent-pair figure from paper — reproduce **qualitative** maxima alignment once both texts are segmented.
4. Commit a **small Python script** under `paradigm-threat-site` or `wget/fomenko-nc-sources/` that regenerates Section 8.2–8.3 so this log stays reproducible.

---

## 9. External critiques, replication-adjacent work, and where the literature is thin

This section answers: *Has anyone published an online attempt to reproduce Fomenko’s statistics and failed, or shown his numbers don’t add up?*

### 9.1 What is **not** easy to find

A **famous English paper** of the form *“we re-segmented the same chronicles, re-ran the 1990 NAS/Weibull pipeline, and Table 1 disagrees”* is **not** prominently catalogued. That is consistent with **missing public `vol(t)` inputs** (Section 1.1): outsiders cannot **disprove a specific run** they cannot load.

### 9.2 Methodological and mathematical pushback (online, citable)

| Work | What it challenges | URL |
|------|-------------------|-----|
| **Florin Diacu** (2013), *Notices of the AMS* | Mathematics + historical dating; discusses Fomenko-style approaches and where **statistics meet historiography** without endorsing NC conclusions. | [DOI 10.1090/noti962](https://doi.org/10.1090/noti962) |
| **Charles J. Halperin** (2005), *Carl Beck Papers* | Argues NC is **bad humanities dressed as natural science** — methodology and use of evidence, not a line-by-line reprint of Table 1. | [PDF (Pitt OJS)](https://carlbeckpapers.pitt.edu/ojs/index.php/cbp/article/download/160/156); [article landing](https://carlbeckpapers.pitt.edu/ojs/index.php/cbp/article/view/160) |
| **Wikipedia** (secondary) | Aggregates mainstream dismissal and **further references**; useful as a **bibliography hub**, not a primary authority. | [New chronology (Fomenko)](https://en.wikipedia.org/wiki/New_chronology_(Fomenko)) |

### 9.3 Russian polemic and named critics (advocate-hosted index)

Fomenko & Nosovskiy list **S. P. Novikov**, **A. A. Zaliznyak**, **V. L. Yanin**, **B. A. Rybakov**, and others in their “answers to critics” material. English bibliography / extracts: [chronologia.org/en/answers_bib_rus.html](https://chronologia.org/en/answers_bib_rus.html). **Caveat:** this is **NC’s own site** — treat as **evidence of who they answer**, then chase **original Russian articles** (e.g. Novikov in *Priroda*, 1997) in libraries or scans.

### 9.4 Replication-adjacent **computational** contradiction (astronomy branch, not 1990 chronicle stats)

**Carlos Baiget Orts**, *Astronomical Refutation of the New Chronology by Fomenko and Nosovsky: The 1151-Year Planetary Cycle and Dating of the Almagest via Speed/Error Correlation*, [arXiv:2504.12962](https://arxiv.org/abs/2504.12962) (submitted 17 Apr 2025). Abstract states **reproducible, data-driven** methods, results **contradicting** key NC dating claims, and **open-source code** for independent verification. **Scope note:** this targets **astronomical / Almagest-style** arguments, **not** the Fomenko–Rachev **volume-function** paper. **Status:** **arXiv preprint** — check whether a **journal version** exists before treating as peer-reviewed in your own writing.

### 9.5 Summary sentence

**Dismissal and method criticism:** reasonably well linked online (Diacu, Halperin, Wikipedia, Russian names via chronologia). **Hard numerical replication failure** for the **1990 text statistics** on **shared raw inputs:** **scarce** in public English literature, largely because **those inputs were never released as data.**

---

## 10. References (citable)

1. A. T. Fomenko and S. T. Rachev, “Volume Functions of Historical Texts and the Amplitude Correlation Principle,” *Computers and the Humanities* 24 (1990): 187–206. DOI: [10.1007/BF00117342](https://doi.org/10.1007/BF00117342). Local mirror: `wget/chronologia.org/en/volume_functions_of_historical_texts.pdf`.
2. Florin Diacu, “Mathematical Methods in the Study of Historical Chronology,” *Notices of the American Mathematical Society*, April 2013. [https://doi.org/10.1090/noti962](https://doi.org/10.1090/noti962). Local: `wget/chronologia.org/en/2013_florin_diacu_math_methods.pdf`.
3. A. T. Fomenko (preface), “New Chronology” project overview (English), e.g. `wget/chronologia.org/en/seven/preface_fomenko.html` — **primary advocate statement**; not independent verification.
4. Isaac Newton, *The Chronology of Ancient Kingdoms Amended* (1728; many modern reprints) — **context** for chronology skepticism in canonical science history (cite edition used).
5. Charles J. Halperin, “Musings on the ‘New Chronology’,” *The Carl Beck Papers in Russian & East European Studies*, University of Pittsburgh (2005). Open access: [article download](https://carlbeckpapers.pitt.edu/ojs/index.php/cbp/article/download/160/156), [article view](https://carlbeckpapers.pitt.edu/ojs/index.php/cbp/article/view/160).
6. Carlos Baiget Orts, *Astronomical Refutation of the New Chronology by Fomenko and Nosovsky: The 1151-Year Planetary Cycle and Dating of the Almagest via Speed/Error Correlation*, arXiv:2504.12962 [astro-ph.EP] (2025). [https://arxiv.org/abs/2504.12962](https://arxiv.org/abs/2504.12962) — preprint; abstract claims open-source reproducibility for **astronomical** NC claims.
7. A. T. Fomenko & G. V. Nosovskiy, “Answers to our critics” bibliography / extracts (English), chronologia.org — [answers_bib_rus.html](https://chronologia.org/en/answers_bib_rus.html) (advocate-hosted index of Russian and other critics).
8. Wikipedia contributors, [“New chronology (Fomenko)”](https://en.wikipedia.org/wiki/New_chronology_(Fomenko)) — secondary survey (check page history before heavy citation).

---

## 11. Changelog (investigation maintenance)

| Date | Note |
|------|------|
| 2026-04-22 | Investigation opened: partial vs complete verification ladder; access; classification; lay + academic sections; calculator roadmap. Local `wget` paths and Diacu DOI cited. |
| 2026-04-22 | Site delivery plan: `{/* pt-site:mdx … */}` tags (MDX-safe; HTML `<!-- -->` breaks `next-mdx-remote`) + planned `paradigm-threat-site` components; **Section 8 empirical validation** — Table 1 spot transcription, synthetic Pearson demo, `pdftotext` word-count audit, OCR TODOs. |
| 2026-04-22 | **Section 1.1–1.2:** clarify digitization vs packaging vs unreleased outputs; speculative reasons full validatable dataset never appeared. |
| 2026-04-22 | **Section 9:** external critiques (Diacu, Halperin, Wikipedia), advocate-hosted Russian critic index (chronologia), arXiv Baiget Orts (astronomy / reproducibility); references renumbered to **Section 10**. |
| 2026-04-22 | **Section 7.4:** local 404s for `#img=` + ChangeLog thumbs — `galleryOverlayDisplaySrc` (`ImageGalleryContext.tsx`) + `changelogThumbSrc` (`ChangeLog.js`). |

---


**Prisca sapientia (epistemic foundation):** This investigation assumes [**prisca sapientia**](/docs/PRISCA_SAPIENTIA.md)—the historical and philosophical belief that the ancients possessed a vast, profound understanding of the universe, nature, and theology that was subsequently lost or degraded. Modern consensus science and institutions are not treated as default truth; evidence tiers below adjudicate specific claims.

Keywords: #Fomenko #NewChronology #Verification #Reproducibility #VolumeFunctions #Rachev #Diacu #PSRL #Accessibility #OpenScience #Critique #Investigation

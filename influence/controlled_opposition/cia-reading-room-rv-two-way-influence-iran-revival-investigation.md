# Investigation: CIA Reading Room — Remote Viewing, “Two-Way” Influence, and the Iran / Religious-Revival Hypothesis (Clue-First)

> **Investigator’s note (framing, 2026-04-26):** So far this archive line has **not** surfaced what I was hoping for: strong, checkable hooks between **RV / influence language** in the Reading Room dump and the **church‑room / crowd‑affect** picture in my head. I am still trying to **re‑locate** social‑media footage I remember—**not** obviously synthetic, **1970s–80s closed‑circuit look**, inside a **church**: people in **pews** reacting in ways that read as **responses to something invisible**, with a **strong electronic / spatial** feel (energy or stimulus **not uniform** across the room). The **rows of seats** looked like a **convenient grid** for something that seemed to **change in frequency and amplitude** and to **hit different zones at different times**. I want that material again for **provenance and context** (what it was, where it came from, whether it was art, training tape, leak, hoax, etc.). Until then: routine **LLM pushback** (“nothing to see”) plus **little of narrative use** in the **downloaded RV CIA PDFs** after OCR/index passes leaves me with a **working suspicion**—separate from any single document—that the **“~12 million documents” FOIA / disclosure stunt** (exact counts vary by site and definition) may have done **more than** confuse researchers and **re‑frame** the agency as **only** studying a **quirky spy adjunct**. That suspicion stays **hypothesis** until tied to **A‑tier** sources or recovered primary video with chain of custody.

> **Operating stance:** This file treats **influence on a remote target** (visions, voices, bodily affect, “message” phenomenology) as **hypothetically possible** for purposes of **clue-hunting** in declassified material. It does **not** claim laboratory or operational proof that RV was used that way. The bar is: **what the archive can support**, what it **cannot**, and what **redaction + format** hide.

> **Author sentiment (explicit):** The main investigative target is whether **U.S. intelligence exploration of anomalous cognition** (remote viewing and adjacent programs) could overlap—organizationally, doctrinally, or in popular interpretation—with **events framed in religious terms** (e.g. late‑1970s / 1980s **Islamic revolution in Iran**, broader **religious revival** discourse), including the **speculative** possibility of **two-way** or **affect-rich** phenomenology (not only passive “viewing”). That is a **historical and epistemic** question: we look for **convergent clues** (language, program structure, contemporaneous programs, routing of “beacon” concepts, etc.), not a single smoking-gun paragraph.

> **Parallel track (same evidence bar):** We also collect and OCR **Reading Room PDFs** surfaced by searches for **Mars, Moon, planets, space, coordinates, UFO / anomalous craft, “off-world,”** and named viewers (e.g. Pat Price, Ingo Swann) in combination with RV program names. Session language about **non‑Earth locations or craft** is **primary evidence for what was tasked or narrated**, not proof those places or objects exist as described.

**Date:** 2026-04-27 (online deep-dive + local path refresh)  
**Status:** Open — corpus + keyword index on disk; **full-corpus OCR** may still be advancing; **Mars/off-world** crawl uses Playwright `scripts/download_anomalous_search.py --profile mars_offworld`. Indexer **merges OCR sidecars** for three roots under `collections/`; **re-run** `scripts/build_corpus_keyword_index.py` after large OCR batches or new downloads.

> **LLM vocabulary (æther):** project-wide assistant rules for substrate language vs pop-physics labels are in [`docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`](/docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md) (Apr 2026 debate capture).

---

## 1. What this investigation is / is not

**In scope**

- Declassified **CIA FOIA Electronic Reading Room** materials mirrored locally under `~/dev/wget/cia/collections/` (**STARGATE** collection crawl + keyword-driven **`anomalous`** PDF set + dedicated **`mars-offworld`** search profile for Mars / Moon / space / UFO-adjacent RV hits), with **derived** indexes under `~/dev/wget/cia/derived/`.
- A **machine-readable keyword index** over extractable PDF text (see §4).
- **External** framing: how big the Reading Room is, what the **AIR / Star Gate** evaluation claimed, and why “missing downloads” still dominate the picture.

**Out of scope (here)**

- Proving causality between RV programs and **specific** religious experiences in Iran or elsewhere.
- Treating session narratives inside RV files as **verified intelligence** about the external world (they are **primary sources for what viewers wrote**, not for metaphysics).

**Evidence tiers**

- **A:** Official CIA-hosted PDFs and metadata pages (URLs stable under `cia.gov/readingroom`).
- **B:** Scholarly / agency-sponsored evaluations (e.g. AIR panel report hosted on CIA site).
- **C:** Third-party compilations (mirrors, NGOs) — useful for **catalog counts**, not for forensic authenticity without checksum against (A).

---

## 2. Local corpus (what we actually have)

Rough inventory (single machine; **2026-04** reorg under `~/dev/wget/cia/`):

| Tree | Role |
|------|------|
| `collections/stargate/` | PDFs from Reading Room **STARGATE** collection pagination (thousands of `CIA-RDP96-00788…`, `00789…`, `00791…`-style CREST releases). |
| `collections/anomalous/pdfs/` | PDFs from Reading Room **search** (RV, influence-adjacent, Iran, psychotronics, MK keywords, …). |
| `collections/anomalous/doc-pages/` | Saved HTML of document landing pages. |
| `collections/anomalous/seen-urls.txt` | Dedup ledger for the `anomalous` profile. |
| `collections/mars-offworld/pdfs/` | PDFs from **Mars / Moon / planets / coordinates / UFO-adjacent** search profile (`--profile mars_offworld`). |
| `collections/mars-offworld/doc-pages/` | Saved HTML for that profile. |
| `collections/mars-offworld/seen-urls.txt` | Dedup ledger for `mars_offworld`. |
| `derived/corpus-index/` | `keyword-hits.jsonl`, `keyword-summary.json`, `manifest.csv`, `file-manifest.jsonl.gz`, **`mars-offworld-content-index.md`** (auto brief per PDF), OCR logs/state. |
| `derived/ocr-text/stargate/` | EasyOCR sidecar `.txt` for STARGATE scans. |
| `derived/ocr-text/anomalous_pdfs/` | Sidecars for `anomalous/pdfs/`. |
| `derived/ocr-text/mars_offworld_pdfs/` | Sidecars for `mars-offworld/pdfs/`. |
| `scripts/batch_ocr_corpus.py` | Resumable OCR worker. |
| `scripts/download_anomalous_search.py`, `scripts/download_stargate.py` | Playwright downloaders. |
| `scripts/build_corpus_keyword_index.py` | Keyword indexer (pdftotext + OCR merge). |

Canonical machine index for this mirror: **`~/dev/wget/cia/INDEX.md`**.

**Cross-reads in this repo**

- [Great Awakening / RV cluster (cultural overlap, Mars/UFO framing, not proof of ops)](/influence/controlled_opposition/great-awakening-alien-savior-rv-nwo-cluster-investigation.md)
- [CIA institution file (Iran pipeline thesis lives there at different evidence tier)](/governance/war/investigations/cia-investigation.md)
- [Cosmos — Mars hub (fiction + motif index, separate from declassified session claims)](/cosmos/mars/page.md)
- [Mars / Earth “reincarnation” cluster (cultural / narrative thread; not a CIA finding)](/cosmos/mars/investigations/mars-earth-reincarnation-investigation.md)

### 2.0 Prior in-repo anchors (Mars + RV, not proof of off-world ops)

These files already tie **Stargate-era remote viewing** to **Mars** or **consciousness-at-target** framing before this Reading Room mirror work expanded term lists:

| Anchor | Why it matters here |
|--------|---------------------|
| [Mars–Earth reincarnation investigation §2](/cosmos/mars/investigations/mars-earth-reincarnation-investigation.md) | Table row **CIA Stargate — Mars Exploration** (22 May 1984); links official PDF `CIA-RDP96-00788R001900760001-9.pdf` and FOIA checklist language (“Mars,” “population,” “civilization”). |
| [Lacatski / consciousness / craft viral post investigation](/influence/controlled_opposition/lacatski-consciousness-craft-viral-post-investigation.md) | Cross-links same Mars RV PDF as **institutional Mars + consciousness** paper trail vs AAWSAP claims. |
| [Cosmos — Mars hub](/cosmos/mars/page.md) | Motif layer (incl. CIA RV imagery caption); **not** treated as declassified session proof. |
| [Remote viewing as aether physics (stub)](/science/telepathy/remote_viewing/aether-consciousness.md) | Timeline / framing hooks to Stargate-era RV. |

**Direct fetch (no search pagination):** `download_anomalous_search.py --seed-urls FILE` accepts one `https://www.cia.gov/readingroom/document/…` or direct `…/readingroom/docs/….pdf` per line. Maintain a small hand-curated list under `collections/mars-offworld/` if search is blocked; the canonical **Mars Exploration** release is already retrievable by ID (see §11.2).

### 2.1 Mars / off-world downloader + OCR + index (commands)

Playwright script (same module as the “anomalous” keyword crawl; **profile** selects term list and output tree):

**WAF / redirect caveat (2026):** Some networks and **headless** Chromium sessions hit `net::ERR_TOO_MANY_REDIRECTS` on `cia.gov/readingroom` (search, document pages, and even direct `/docs/*.pdf` links). The STARGATE downloader in this repo already notes that **headed** automation tends to fare better than headless. Datacenter / VPN / bot-scored IPs may still be blocked entirely—in that case use a normal desktop browser to copy **document** URLs, list them in a text file, and run **`--seed-urls`** (one `https://www.cia.gov/readingroom/document/…` per line).

```bash
cd ~/dev/wget/cia && . .venv/bin/activate
# Respect site load: tune CIA_READINGROOM_MAX_PAGES_PER_TERM / CIA_READINGROOM_MAX_DOCS_PER_TERM if needed
# Default is **headed** (unset CIA_PLAYWRIGHT_HEADLESS). Do **not** set CIA_PLAYWRIGHT_HEADLESS=1 for search
# pagination from this helper — Chromium headless typically hits net::ERR_TOO_MANY_REDIRECTS on /search/.
# Headed nohup needs a display. From SSH or Cursor automation, set e.g. `DISPLAY=:0` (or `xvfb-run -a`)
# if the machine has no real X session — otherwise Playwright can fall back to headless and hit redirect loops on `/search/`.
DISPLAY=:0 nohup python3 scripts/download_anomalous_search.py --profile mars_offworld >> derived/corpus-index/mars-offworld-crawl.log 2>&1 &
```

**After a large `mars_offworld` batch:** keyword search hits text-native PDFs immediately; **scanned** memos need **`scripts/batch_ocr_corpus.py --root mars`** (long run — log to `derived/corpus-index/mars-ocr-run.log`), then **`scripts/build_corpus_keyword_index.py`** again. Search terms are broad (e.g. “Martian,” “NASA”); expect **noise** in the tree — prioritize files whose **OCR or `pdftotext` hits** include `Mars_Martian`, `STAR_GATE`, `UFO_UAP`, coordinates, or session headers.

Hand-curated **document** pages and/or **direct PDF** URLs (no search pagination; PDF lines supported as of the wget helper update):

```bash
python3 scripts/download_anomalous_search.py --profile mars_offworld --seed-urls ./my-seed-urls.txt
```

After a batch of new PDFs lands in `collections/mars-offworld/pdfs/`:

```bash
cd ~/dev/wget/cia && . .venv/bin/activate
python3 scripts/batch_ocr_corpus.py --root mars --max-pages 55
python3 scripts/build_corpus_keyword_index.py
```

The indexer includes extra keyword buckets (`Mars_Martian`, `moon_lunar`, `UFO_UAP`, `spacecraft_orbit`, `offworld_ET`, `Cydonia_Face`, `Jupiter_Venus_Saturn`, `NASA_space_facility`) so post-OCR and text-native PDFs surface **session / memo** language about planetary or craft targets alongside the Iran / influence set.

---

## 3. What the CIA Reading Room contains that we did **not** download

The local folder is a **small slice** of what exists online.

- **CREST / 25-year bulk:** CIA’s own announcement describes on the order of **12 million pages** of declassified records posted from the CREST program (January 2017 wave), i.e. a **mass** of memos, analysis, administrative ephemera, and scanned images — far beyond any single mirror. Official story hub: [CIA: “CIA Posts More Than 12 Million Pages of CREST Records Online”](https://www.cia.gov/stories/story/cia-posts-more-than-12-million-pages-of-crest-records-online/).
- **STARGATE as a labeled collection:** Third-party guides often cite **~12,000+ discrete “documents”** in the STARGATE bucket (counts vary by how “document” is defined vs. page splits). Treat published counts as **approximate** until reconciled against CIA pagination. Example secondary catalog: [The Black Vault — Stargate collection note](https://www.theblackvault.com/documentarchive/the-stargate-collection); [IRVA Stargate guide](https://www.irva.org/stargate-guide).
- **Search surfaces are wider than one collection:** A Reading Room text search for **“remote viewing”** returns on the order of **tens of thousands of hits** (the search UI reports total items; the exact number moves with indexing). That includes **non‑STARGATE** folders, **case logs**, **studies**, **congressional**, **administrative** PDFs, etc.—so “RV language” ≠ “RV program file.”

**Redaction reality**

- Many released PDFs are **image scans**; others retain **paragraph-level redactions**. Full-text search will systematically **under-count** unless OCR + careful alignment with page images is done.

---

## 4. OCR + merged keyword index (current methodology)

### 4.1 Why OCR was mandatory

`pdftotext` on typical STARGATE CREST PDFs returns **almost nothing** (scanned pages, no text layer). A smoke test on a known RV memo (`CIA-RDP96-00789R001300180002-7.pdf`) produced on the order of **tens of characters** from `pdftotext`, while **EasyOCR** on the first rendered page immediately recovered header text (“Approved For Release …”). Without OCR, **keyword statistics lie about the RV slice** and over-represent text-native FOIA logs in `anomalous/pdfs/`.

### 4.2 OCR implementation (this workspace)

- **Stack:** `PyMuPDF` (`fitz`) render → `Pillow` / `numpy` → **EasyOCR** (`en`, CPU). Installed in `~/dev/wget/cia/.venv` (no `sudo` / no system `tesseract` required).
- **Script:** `~/dev/wget/cia/scripts/batch_ocr_corpus.py`
  - Resumable: writes `~/dev/wget/cia/derived/ocr-text/{stargate|anomalous_pdfs|mars_offworld_pdfs}/<stem>.txt` and **skips** if sidecar exists and is newer than the PDF.
  - Default **55 pages** per PDF (enough for most RV session packs; caps runaway on multi-hundred-page admin PDFs).
  - Progress: `~/dev/wget/cia/derived/corpus-index/ocr-batch-state.jsonl`; errors: `~/dev/wget/cia/derived/corpus-index/ocr-errors.log`.
- **Full STARGATE + anomalous run (started 2026-04-26):** `nohup python scripts/batch_ocr_corpus.py --root all --max-pages 55 > derived/corpus-index/ocr-run.log 2>&1 &`  
  `--root all` includes **`mars`** when `collections/mars-offworld/pdfs/` is populated. Expect **many CPU-hours** for full STARGATE + anomalous stacks.

### 4.3 Merged index rebuild

`~/dev/wget/cia/scripts/build_corpus_keyword_index.py` now concatenates:

1. `pdftotext` output (when any), **plus**
2. `===== OCR_SIDECAR =====` + sidecar text if `ocr-text/…/<stem>.txt` exists.

`manifest.csv` adds **`ocr_chars`** (sidecar length). After OCR advances, **re-run the indexer** to refresh `keyword-hits.jsonl` / `keyword-summary.json`.

```bash
cd ~/dev/wget/cia && . .venv/bin/activate
python3 scripts/build_corpus_keyword_index.py
```

### 4.4 Pre-OCR baseline (historical snapshot — superseded for STARGATE)

The first indexer pass ( **`pdftotext` only** ) on **11,430** PDFs found only **~50** files with `text_chars > 500` and only **40** files with any keyword hit — almost all hits came from **`collections/anomalous/pdfs/`**, **zero** from `collections/stargate/` in `keyword-hits.jsonl` (paths before corpus reorg may read `anomalous/` / `stargate/` in older committed CSVs). That snapshot is retained in git only if committed; on disk it is **overwritten** when you re-run the indexer after OCR.

Illustrative baseline tallies (do **not** treat as post-OCR truth):

| Keyword bucket | Occurrences (pre-OCR) | Notes |
|----------------|------------:|-------|
| ESP / telepathy / psychokinesis | tens | Often definitional / catalog boilerplate in text-native PDFs. |
| Iran / Khomeini / hostage | small | Mostly **FOIA case log** routing lines, not RV↔Iran fusion. |
| beacon | 2 | Regex later tightened to exclude “Beacon Hill”; re-index after OCR. |
| interactive_rv, remote_influence, affect_target, feedback | 0 | Expected false negative on **scanned** RV PDFs pre-OCR. |

**Practical command to explore hits (post-reindex)**

```bash
rg '"keyword": "Iran"' ~/dev/wget/cia/derived/corpus-index/keyword-hits.jsonl | head
```

---

## 5. External verification anchors (what serious sources agree on)

- **AIR evaluation (1995):** CIA hosts the draft/final evaluation materials in the Reading Room; one entry point is the draft report PDF: [AN EVALUATION OF THE REMOTE VIEWING PROGRAM… (CIA-hosted PDF)](https://www.cia.gov/readingroom/docs/cia-rdp96-00791r000200180005-5.pdf). The widely repeated summary is: **some laboratory analyses were argued to show anomalous effects**, while **operational utility for intelligence** remained disputed / not established in the way imagery or SIGINT are. Use the **primary PDF** for exact wording—secondary articles often compress nuance.
- **Program history:** STARGATE / SUN STREAK / GRILL FLAME / CENTER LANE are **documented program names** in declassified administrative chains; that establishes **institutional reality** of the research line, not any given paranormal claim.

---

## 6. Hypothesis map: “two-way / affect / religious overlap” without over-claiming

### 6.1 Plausible **non-mystical** overlaps (strongest, documented-class)

- **Psychological operations** and **revolutionary politics** in the same era are massively documented independent of RV. Any overlap with “visions / signs” in public religion is often better explained by **politics + charisma + violence + media** than by RV.
- **Intelligence interest in “anomalies”** sometimes reflects **foreign assessments** (“what does adversary X believe / fear?”), not endorsement.

### 6.2 Plausible **in-program language** overlaps (medium, needs OCR + close read)

- RV training materials sometimes define **targets**, **sessions**, **stages**, and occasionally **beacon** concepts (official glossary items appear in Reading Room docs). That language can **sound** like spiritual epistemology when skimmed; **close reading** must separate **metaphor / protocol** from **physics claim**.

### 6.3 Weak / speculative overlaps (explicitly “clue tier”)

- **Cross-correlation** between peak RV program activity (late Cold War) and **Iran revolution / hostage crisis** timing is **chronologically possible** to *ask about*; establishing **operational co-tasking** requires **document-internal co-reference** (same memo routing, same project code, dated tasking), not keyword proximity across unrelated FOIA logs.

---

## 7. What we learned from the **downloads** specifically (honest summary)

1. **We have a large STARGATE-shaped PDF pile locally** (thousands of files; filename series consistent with CREST RV releases). That is a **real archive slice**, not the whole Reading Room.
2. **Automated keyword search on RV scans failed until OCR:** `pdftotext`-only indexing produced **zero** STARGATE rows in `keyword-hits.jsonl` because the memos are image scans. **EasyOCR + PyMuPDF** recovers machine-readable text from those scans; a **full-corpus OCR batch** is running (§4.2).
3. **Iran / Khomeini / revolution strings** in the *pre-OCR* hit file appeared mostly as **FOIA request catalog lines** in text-native PDFs. **Post-OCR**, expect additional STARGATE hits where session language mentions geography or politics—each hit must still be **read in context** (training target vs operational claim vs boilerplate).
4. **“Beacon”** matching: indexer regex now excludes **`Beacon Hill`** false positives; post-OCR passes should be reviewed for genuine glossary “beacon” usage.

---

## 8. Open questions (investigation backlog)

1. **OCR completion + re-index:** let `scripts/batch_ocr_corpus.py` finish (or split across machines), then **re-run** `scripts/build_corpus_keyword_index.py` and diff `derived/corpus-index/keyword-summary.json` against the §4.4 baseline.
2. **Co-occurrence mining:** after OCR, extract windows around `Iran`, `hostage`, `Khomeini`, `INSCOM`, `DIA`, `SUN STREAK`, `GRILL FLAME` within N tokens of `remote viewing` / `session`.
3. **Mars / off-world / craft:** after `mars_offworld` crawl + OCR, mine hits for `Mars_Martian`, `Cydonia_Face`, `UFO_UAP`, `spacecraft_orbit` and **read** each hit in context (training coordinate vs operational claim vs third-party rumor).
4. **AIR vs session claims:** compare AIR report language to **specific session transcript** language about **targets** (does the program ever *task* “effect,” or only “describe”?).
5. **Counter-deception:** when a memo uses religious vocabulary, is it **analysis of third-party belief** rather than operational intent?

---

## 9. Online citation deep dive — technology, disclosure gaps, “continuation,” Mars press (2026-04-27)

**Evidence tier reminder:** links below mix **A** (CIA-hosted Reading Room PDFs / `cia.gov` stories), **B** (academic / government archives), and **C** (press, blogs, aggregators). Treat **C** as **lead-generation**, not forensic proof of what CIA “still runs.”

### 9.1 “Cover-up” / incomplete disclosure (accusations and documented FOIA friction)

| Topic | What is alleged or documented | Example sources (tier) |
|--------|------------------------------|-------------------------|
| **Records withheld / reprocessed long after “public”** | CIA FOIA can **re-release** or **reprocess** material years later; watchdogs treat extreme delay as **accountability failure** even when pages eventually surface. | [The Black Vault — CIA reprocesses detention program record under FOIA (2025 release story)](https://www.theblackvault.com/documentarchive/cia-reprocesses-detention-program-record-under-foia-more-than-a-decade-after-public-disclosure/) (**C**, cites gov filings). |
| **Reclassification / “pulled from shelves”** | National Archives audit coverage: agencies (incl. CIA) **removed** large numbers of historically available records for **secret** re-review; fraction deemed **inappropriate** to reclassify. | [Washington Post — *Some Archives Files Wrongly Kept Secret* (2006)](https://www.washingtonpost.com/wp-dyn/content/article/2006/04/26/AR2006042602387.html) (**B**/press on audit). |
| **Litigation over “public history” withheld** | Courts allowing long-term **withholding** of draft histories despite partial prior release — used in debates about **how much** “open” history is stable. | [National Security Archive GWU — *CIA Successfully Conceals Bay of Pigs History* (news summary, 2014)](https://nsarchive.gwu.edu/news/20140521) (**B**). |
| **Contemporary whistleblower / press claims (Havana Syndrome)** | Allegations that CIA **misled** Congress / suppressed witness accounts on **anomalous health incidents**; often tied to **directed-energy** hypotheses in **press investigations** — **not** adjudicated here as fact. | [Salon — whistleblower documents / “active suppression” framing (2024)](https://www.salon.com/2024/09/16/active-suppression-of-witnesses-cia-lied-about-havana-syndrome-whistleblower-documents-reveal) (**C**); [The Insider — long-form investigation (EN)](https://theins.org/en/inv/290088) (**C**). |

**Investigator’s synthesis:** these lines **do not prove** that **RV programs secretly continue**; they **do** establish—without relying on any paranormal claim—that **FOIA transparency is uneven**, **delay is normal**, and **classification politics** can **lag** or **contradict** public “everything is out” narratives. That is the **epistemic** reason a local mirror can **miss** documents that **later** appear on `cia.gov` or in **press reinterpretations**.

### 9.2 “Handed off / continued elsewhere after shutdown” — what documents support vs what people infer

**Documented (A-tier):** Congress **forced** a **STAR GATE** wind-down path that **routed DIA-held program material through CIA** for **review / declassification** language (transfer memos exist in the Reading Room). Examples:

- [Reading Room — *TRANSFER OF STAR GATE PROGRAM FROM DIA TO CIA, STATUS AND TERMS OF REFERENCE (DRAFT)* (PDF)](https://www.cia.gov/readingroom/docs/CIA-RDP96-00791R000100040007-7.pdf)  
- [Alternate draft PDF (same subject line)](https://www.cia.gov/readingroom/docs/CIA-RDP96-00791R000100040014-9.pdf)  
- [FY 1995 congressional budget / STAR GATE routing (document landing page)](https://www.cia.gov/readingroom/document/cia-rdp96-00791r000300010003-2)

These files support **institutional fact**: **records and program responsibility moved** between components under **congressional mandate**—not a secret proof that **psychics still staff a grid**. For **popular** “they never stopped” claims, treat as **C-tier** unless tied to **primary tasking** with chain of custody.

### 9.3 “Heart attack gun” photograph — what was shown, and how it differs from “EM body weapon”

**What the 1975 disclosure actually emphasized:** the Church Committee era publicized a **CIA device** described as a **pistol-shaped delivery system** for a **tiny toxin dart** (often summarized in secondary sources as **shellfish toxin / “frozen dart”** that **melts** in tissue), intended to **mimic natural death** (e.g. heart attack) **via poison**, **not** via a **non-contact electromagnetic cardiac stop**.

- **Artifact / photograph (museum context):** [U.S. Capitol Visitor Center — photograph of Senators Church & Tower with “CIA poison dart gun,” Henry Griffin, 17 Sep 1975](https://www.visitthecapitol.gov/artifact/senator-frank-church-and-senator-john-tower-cia-poison-dart-gun-photograph-henry-griffin) (**B** institutional catalog page — good for **image provenance**).  
- **Video clip (testimony context):** [C-SPAN — user clip: Colby / Church committee / shellfish toxin dart gun](https://www.c-span.org/clip/senate-committee/user-clip-cia-director-william-colby-the-church-committee-and-the-shellfish-toxin-dartgun/4703553) (**B** archival video).

**Separate EM / irradiation lane (documented CIA interest, different mechanism):** the **Moscow embassy microwave “signals”** episode and U.S. follow-on programs (**PANDORA**, **BIZARRE**) concern **RF exposure**, health anxiety, and **behavioral / medical** study tracks — not the **dart gun** story. Secondary compilation with **primary document pointers**: [National Security Archive briefing book — *Moscow Signals* / PANDORA / BIZARRE](https://nsarchive.gwu.edu/briefing-book/intelligence-russia-programs/2022-09-13/moscow-signals-declassified-microwave) (**B**). CIA Reading Room also hosts press-of-record reprints such as the **New Yorker** “Microwaves” series parts: [CIA-hosted PDF *A REPORTER AT LARGE — MICROWAVES-I*](https://www.cia.gov/readingroom/docs/CIA-RDP88B01125R000300120112-7.pdf), [part II PDF](https://www.cia.gov/readingroom/docs/CIA-RDP88B01125R000300120113-6.pdf) (**A**).

**Investigator’s note:** conflating **toxin dart** and **microwave exposure** produces **false precision**; keep them **adjacent** only when the thesis is **“multiple non-kinetic / hard-to-detect effect programs existed in overlapping Cold War security culture.”**

### 9.4 “Internet articles about Mars RV” vs what landed in **our** mirror

The **canonical** Mars RV release everyone cites is still the **same CIA-hosted PDF**:

- **Official PDF (A):** [CIA Reading Room — *MARS EXPLORATION, MAY 22, 1984* (`CIA-RDP96-00788R001900760001-9.pdf`)](https://www.cia.gov/readingroom/docs/CIA-RDP96-00788R001900760001-9.pdf)  
- **Official document landing (A):** [CIA Reading Room document page (same ID)](https://www.cia.gov/readingroom/document/cia-rdp96-00788r001900760001-9)

**Third-party interpretations / mirrors (C — useful for search, checksum against A):** e.g. [Giza Death Star — essay framing “CIA remote viewed Mars in 1984”](https://gizadeathstar.com/2019/11/the-cia-remote-viewed-mars-in-1984/) (blog); [The Black Vault mirror PDF](https://documents2.theblackvault.com/documents/cia/CIA-RDP96-00788R001900760001-9.pdf); independent HTML renditions such as [THOLONIA material page](https://tholonia.github.io/material/material_MARS_EXPLORATION_MAY_22_1984.html).

**Why you may “see articles but not the file” locally:** the Playwright **`mars_offworld` profile** pulls **search-hit surfaces** (broad terms → **many unrelated PDFs**). A **specific** famous PDF is easiest to guarantee via **`--seed-urls`** with the **direct `/readingroom/docs/…` URL** or the **document/** URL above. On this machine, the same release should appear as:

`~/dev/wget/cia/collections/mars-offworld/pdfs/CIA-RDP96-00788R001900760001-9.pdf`

…when fetched; if missing, seed-fetch it and re-run OCR + indexer.

**Local browse aid:** `~/dev/wget/cia/derived/corpus-index/mars-offworld-content-index.md` (thousands of one-line blurbs) helps locate **other** Mars-adjacent titles (e.g. **Viking lander** sessions, **Jupiter** probe write-ups) even when filenames are opaque (`1968-08-08.pdf`, etc.).

### 9.5 MKULTRA / mind-influence technology (Reading Room anchors)

For **“CIA technology + experiments”** outside RV, the Reading Room hosts **MKULTRA** landing pages and PDF bundles; start at the CIA’s own index page for the topic, e.g. [Reading Room document landing — *PROJECT MK-ULTRA* (`06760269`)](https://www.cia.gov/readingroom/document/06760269) (**A**). Use these as **A-tier** anchors when contrasting **documented drug/electroshock/hypnosis** programs with **speculative** “voice in head” overlap hypotheses.

---

## 10. References (starting set)

- CIA Reading Room STARGATE collection entry: `https://www.cia.gov/readingroom/collection/stargate`
- CIA-hosted AIR evaluation PDF: `https://www.cia.gov/readingroom/docs/cia-rdp96-00791r000200180005-5.pdf`
- CIA news story on CREST online release scale: `https://www.cia.gov/stories/story/cia-posts-more-than-12-million-pages-of-crest-records-online/`
- Repo neighbor investigations: [Great Awakening / RV cluster](/influence/controlled_opposition/great-awakening-alien-savior-rv-nwo-cluster-investigation.md), [CIA institutional file](/governance/war/investigations/cia-investigation.md)

---

## 11. Maintenance

- Re-run crawlers sparingly (site protections); keep **`collections/anomalous/seen-urls.txt`** and **`collections/mars-offworld/seen-urls.txt`** (separate dedup per profile).
- Re-run `scripts/build_corpus_keyword_index.py` after large OCR batches or new downloads.
- Monitor OCR: `tail -f ~/dev/wget/cia/derived/corpus-index/ocr-run.log` and `wc -l ~/dev/wget/cia/derived/ocr-text/stargate/*.txt`; Mars tree: `wc -l ~/dev/wget/cia/derived/ocr-text/mars_offworld_pdfs/*.txt` once populated.

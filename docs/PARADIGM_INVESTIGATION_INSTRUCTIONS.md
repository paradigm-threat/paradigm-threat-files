# Paradigm investigation files — author / assistant instructions

**Purpose:** Capture how *paradigm-threat-files* investigations are written and maintained so sessions stay consistent.

---

## Structure (typical)

1. **Title** — topic + scope in one line.
2. **Optional header image** — path under repo; keep alt text short.
3. **TL;DR** — one blockquote: thesis, strongest cites, cross-links to other investigations. Avoid duplicating the whole Limits list here.
4. **Status** — Open / closed; one sentence.
5. **Guide (read order)** — optional numbered list: “if you want X → section Y”. Use for long files so everyday readers can skip to militainment, money, clues, etc.
6. **Body** — numbered sections with stable anchors. Prefer **one** interpretive synthesis per theme (avoid repeating the same Russia/Iran contrast in §2 and again in §6). **Do not** scatter **limits / disclaimer** boilerplate through the body; one sentence of **in-section** nuance where analytically necessary is OK.
7. **Author’s originating thesis (when the author supplies it)** — **Required** whenever the author provides **sentiment**, **pattern language**, or **claims** that are **not** yet evidenced in third-party sources: include their **words** (blockquote **verbatim** where possible) **and** a **short** **“what they mean”** **unpack** so readers grasp **intent** and **pattern stakes**. This material **establishes** **why** the investigation exists for **Paradigm Threat**; it is **not** optional padding. **Do not** replace it with only “unsupported” or a one-line dismissal. **Separate** **visibly** from **evidence-backed** **findings** (subsections or **labels**: **Author** vs **Documented** vs **Speculative**).
8. **Author’s open claims (optional section, but required when §7 applies)** — numbered or tabulated list of claims that are **unique** to this file or **not** fully grounded elsewhere in the repo — **before** the **open questions** block. Purpose: **pattern** **registry** for **cross-investigation** **threads**, not **pretense** that every claim is **proven**.
9. **Questions to clarify, verify, or debunk** — table or list **following** **§8** (when present): **falsifiable** **hooks**, **FOIA**/**archive** **targets**, **or** **mainstream** **sources** **that** **could** **adjudicate** **author** **claims**. Distinct from **routine** **TODOs**; may **merge** **weak** **points** **here** **when** **appropriate**.
10. **Weak points / remaining research TODOs** — when **not** **folded** **into** **§9**, keep a **table** **or** **checkboxes** **for** **assistant** **follow-up** **(citations**, **missing** **books**, **etc.)**.
11. **Keywords** — one line near end of file, **exactly** `Keywords:` (case-insensitive on that label) followed by space-separated hashtags. **Option B (required):** each tag is `#` plus a **single PascalCase token** — letters and digits only, **no hyphens and no underscores** inside the tag (e.g. `#RemoteViewing`, `#ParadigmThreatFiles`, not `#remote-viewing` or `#predictive_programming`). The static index (`scripts/generate-index.py`) only reads this line; **do not** use a `## Keywords` heading (it is ignored and `npm run check-keywords` fails the repo).
12. **Date line** — last substantive update; trim verbose changelog if git history suffices.
13. **Limits and disclaimers** — **one** consolidated block at **end of file**, **after Keywords** and **before** Investigator notes (fiction vs evidence, cross-links thematic, evidence tiers, assistant bias, **and** **explicit** **note** **that** **author** **thesis** **sections** **are** **first-class** **but** **not** **automatically** **factual**). Everyday readers who skip to substance can stop before this section; it still satisfies repo-wide evidence discipline. **TL;DR** should not paste the full Limits list (thesis + strongest cites only).
14. **Investigator notes (optional)** — after Limits; **maintainers and LLMs** only: local machine paths, subtitle file locations, grep/session hints. Do **not** put these in the body or duplicate Limits here. See **Online vs local content** below.

### Online vs local content

- **Online readers** (static site, GitLab browse, strangers cloning the repo) have **no access** to the author’s OS paths (`/home/…`, `/media/…`, `C:\…`, etc.). Those paths **do not belong** in the main investigation text, Limits, Related table, or scattered footnotes.
- Keep the body to **repo-relative links** (`/docs/…`, `/governance/…`), public URLs, and citable secondary sources.
- Put machine-local paths and assistant-only reminders in **Investigator notes** at the **very end** of the `.md` file (after **Limits and disclaimers**). Casual readers typically stop after **Keywords**; **Limits** is the repo-wide evidence discipline block.
- **CIA Reading Room bulk mirror (author machine):** operational layout, Playwright/OCR/index commands, and logs live only in **`~/dev/wget/cia/cia-reading-room-local-mirror-and-ocr-operations.md`** (outside **paradigm-threat-files**); the public investigation stays **CIA.gov + citations + hypotheses**; see **Investigator notes** in [`cia-reading-room-mars-exploration-1984-rv-investigation.md`](../influence/controlled_opposition/cia-reading-room-mars-exploration-1984-rv-investigation.md) (Mars mirror + transcript regen); for **Iran / two-way / Super Cockpit** context only, [`cia-reading-room-rv-two-way-iran-revival-investigation.md`](../influence/controlled_opposition/cia-reading-room-rv-two-way-iran-revival-investigation.md).

### Reorganization (when asked to simplify)

- **Do not lose data.** Merge sections by moving paragraphs and tables into the surviving heading; never drop citations, URLs, or checklist rows without pasting them elsewhere.
- **Reduce redundancy.** One **Limits** block at **file end** (before Investigator notes); one **Related investigations** table (do not duplicate the same links in a separate “Cross-links” section). One interpretive “premise” statement — cross-reference earlier sections instead of restating.
- **Everyday readers:** Keep a short **Guide (read order)** as a numbered list (reliable on all renderers). Prefer plain sentences; **bold** for emphasis and labels, not every entity name.
- **Closing a session:** Refresh **`governance/war/investigations/page.md`** row if scope changed; add/update **`docs/INVESTIGATIONS_DEEP_DIVE.md`** row **and** §2 validation block when the file has material open TODOs; run final pass on **open questions** and **weak points / TODOs**; **commit** and **push all remotes** when the author asks for repo sync.

---

## Evidence and tone

- **Tiers:** Primary > secondary press > social. Flag FOIA-derived figures and wiki-as-convenience vs peer-reviewed claims.
- **Author sentiment vs verification:** When the author supplies **pattern thesis** or **claims without external citations**, the investigation **must** still **present** that material **prominently** (see **Structure §7–9**). Assistants **add** **context**, **feasibility**, **counterarguments**, and **sources** **without** **replacing** the author’s **voice** **with** **only** **debunking** or **omission**. The **Limits** block states evidence discipline; it does **not** delete the **author’s** **stakes**.
- **Cross-investigations:** Links are **thematic rhymes**, not proof that fictional plots equal documented history.
- **Clue threads** (e.g. fiction foreshadowing, casting irony): label as **clues**, not closed findings. When the author asks for **no disclaimer boilerplate** in a clue block, keep the clue language; the file-level Limits still govern evidence tiers for the repo.
- **Bolding:** Use sparingly — emphasis and section labels, not every proper noun.

---

## Physics / æther vocabulary (all `paradigm-threat*` repos)

- **Canon:** [`docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`](LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md) — debate summary, **Maxwell** cite path, **one-line** disclaimer template, and Copilot/Cursor **`.cursor/rules/paradigm-threat-aether-vocabulary.mdc`** mirror.
- **Running voice:** **æther** (or **aether** in slugs) for the substrate; do **not** use **quantum / ZPE / dark matter** as silent “mainstream-complete” substitutes except in **citation / definition / debate**.
- **Optional bridge:** one sentence may note mainstream **fields in vacuum + relativity + QED** as **translation**, not **replacement** of the author’s ontology.

---

## Money / engines / militainment

When discussing defense budgets vs commercial games: cite **parallel ecosystems** (America’s Army, VBS, DARWARS, DARPA programs) **separately** from publisher AAA budgets (Activision, platform deals, court filings). Do not collapse into “Pentagon funded Call of Duty” without a specific line-item source.

---

## Git

- Commit investigation changes with a clear one-line message.
- Push to **all** configured remotes (`origin`, `atlanta2`, `atlanta3`) when the author requests repo sync.

---

## Index maintenance

- **`governance/war/investigations/page.md`** (and similar `page.md` files): update the investigation row blurb when the scope or thesis changes materially.
- **`docs/INVESTIGATIONS_DEEP_DIVE.md`:** add or refresh a row when an investigation has substantial open TODOs worth tracking repo-wide.
- **Keyword line:** before regenerating `index.json` / `changelog.json`, run `npm run autogen` from repo root (it runs `check-keywords` then index + changelog). If `check-keywords` reports a file, fix the `Keywords:` line to Option B tokens.

---

**Date:** 2026-04-18 — Initial instructions from *Call of Duty: Modern Warfare* investigation session (reorg, citations, clue threads, funding sections). **Updates:** reorganization rules (no data loss, deep dive + page.md on close, push all remotes); **online vs local** — no absolute OS paths in body; optional **Investigator notes** appendix at file end for LLM/maintainer paths. **2026-04-19** — **Limits/disclaimers** placement: **consolidated at end of file** (after Keywords, before Investigator notes); body sections stay lean. **2026-04-21** — **Author’s originating thesis**, **open claims**, and **questions to clarify/debunk** added to **Structure** and **Evidence and tone**; applies **repo-wide** so investigations **preserve** **author** **pattern** **language** **alongside** **verification**. **2026-04-27** — **æther vocabulary + Maxwell debate** canon (`docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`, `.cursor/rules/paradigm-threat-aether-vocabulary.mdc` in each `paradigm-threat*` repo). **2026-04-27 (b)** — CIA Reading Room **local mirror** companion file path documented under **Online vs local content** (`~/dev/wget/cia/cia-reading-room-local-mirror-and-ocr-operations.md`). **2026-04-26** — **Keywords:** Option B enforced repo-wide (PascalCase tags, no hyphens/underscores in tag text); no `## Keywords`; `npm run check-keywords` + indexer alignment.

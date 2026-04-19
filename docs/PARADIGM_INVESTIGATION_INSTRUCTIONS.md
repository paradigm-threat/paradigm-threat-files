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
7. **Weak points / TODOs** — table + short checkbox list.
8. **Keywords** — hashtags for index/search.
9. **Date line** — last substantive update; trim verbose changelog if git history suffices.
10. **Limits and disclaimers** — **one** consolidated block at **end of file**, **after Keywords** and **before** Investigator notes (fiction vs evidence, cross-links thematic, evidence tiers, assistant bias, etc.). Everyday readers who skip to substance can stop before this section; it still satisfies repo-wide evidence discipline. **TL;DR** should not paste the full Limits list (thesis + strongest cites only).
11. **Investigator notes (optional)** — after Limits; **maintainers and LLMs** only: local machine paths, subtitle file locations, grep/session hints. Do **not** put these in the body or duplicate Limits here. See **Online vs local content** below.

### Online vs local content

- **Online readers** (static site, GitLab browse, strangers cloning the repo) have **no access** to the author’s OS paths (`/home/…`, `/media/…`, `C:\…`, etc.). Those paths **do not belong** in the main investigation text, Limits, Related table, or scattered footnotes.
- Keep the body to **repo-relative links** (`/docs/…`, `/governance/…`), public URLs, and citable secondary sources.
- Put machine-local paths and assistant-only reminders in **Investigator notes** at the **very end** of the `.md` file (after **Limits and disclaimers**). Casual readers typically stop after **Keywords**; **Limits** is the repo-wide evidence discipline block.

### Reorganization (when asked to simplify)

- **Do not lose data.** Merge sections by moving paragraphs and tables into the surviving heading; never drop citations, URLs, or checklist rows without pasting them elsewhere.
- **Reduce redundancy.** One **Limits** block at **file end** (before Investigator notes); one **Related investigations** table (do not duplicate the same links in a separate “Cross-links” section). One interpretive “premise” statement — cross-reference earlier sections instead of restating.
- **Everyday readers:** Keep a short **Guide (read order)** as a numbered list (reliable on all renderers). Prefer plain sentences; **bold** for emphasis and labels, not every entity name.
- **Closing a session:** Refresh **`governance/war/investigations/page.md`** row if scope changed; add/update **`docs/INVESTIGATIONS_DEEP_DIVE.md`** row **and** §2 validation block when the file has material open TODOs; run final pass on the investigation’s **§ weak points / TODOs**; **commit** and **push all remotes** when the author asks for repo sync.

---

## Evidence and tone

- **Tiers:** Primary > secondary press > social. Flag FOIA-derived figures and wiki-as-convenience vs peer-reviewed claims.
- **Cross-investigations:** Links are **thematic rhymes**, not proof that fictional plots equal documented history.
- **Clue threads** (e.g. fiction foreshadowing, casting irony): label as **clues**, not closed findings. When the author asks for **no disclaimer boilerplate** in a clue block, keep the clue language; the file-level Limits still govern evidence tiers for the repo.
- **Bolding:** Use sparingly — emphasis and section labels, not every proper noun.

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

---

**Date:** 2026-04-18 — Initial instructions from *Call of Duty: Modern Warfare* investigation session (reorg, citations, clue threads, funding sections). **Updates:** reorganization rules (no data loss, deep dive + page.md on close, push all remotes); **online vs local** — no absolute OS paths in body; optional **Investigator notes** appendix at file end for LLM/maintainer paths. **2026-04-19** — **Limits/disclaimers** placement: **consolidated at end of file** (after Keywords, before Investigator notes); body sections stay lean.

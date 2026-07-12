# Investigation LLM sweep — automated quality review (spec)

**Purpose:** Define how LLM agents **review** paradigm-threat-files investigations on a **schedule** or **after author updates** — to tighten quality, surface weak points, push back on author claims, and produce **plan files only**. **No autonomous edits** to investigations, articles, or site indexes.

**Audience:** Author (Ari), Cursor agents, scheduled automation, copilot sessions.

**Companion docs:** [`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](PARADIGM_INVESTIGATION_INSTRUCTIONS.md) (structure + ship discipline), [`INVESTIGATIONS_DEEP_DIVE.md`](INVESTIGATIONS_DEEP_DIVE.md) (repo-wide open TODOs), [`instructions/ARTICLES.md`](instructions/ARTICLES.md) (reader-article voice).

**Plan output folder:** [`sweep-plans/`](sweep-plans/) — one markdown plan per sweep run; see [`sweep-plans/_TEMPLATE_SWEEP_PLAN.md`](sweep-plans/_TEMPLATE_SWEEP_PLAN.md). **Generated plans are gitignored** (local review only); the template and this spec are committed.

---

## Author's originating intent (verbatim sentiment)

> The main objective is to **tighten each investigation** and **improve its quality** — by resolving ambiguities and contradictions, or **listing them specifically**. I want the LLM to **push back on my claims** and say, within the context of my investigation and repo, **why I might be on the wrong track**. I **don't ever want the LLM to make a decision on its own** — but it should **definitely be suggesting things** to me.
>
> For example, in the [LLM history governance investigation](/science/ai/llm-history-governance-theater-investigation.md) there are a lot of **weak points**. In a daily scheduled sweep — or right after I made an update — the LLM would see that investigation (or one selected at random) and notice **timeline issues** that might need **clarifying questions**. There's **high-quality information** — what I call **investigation gold** — that normally pops up in our investigations. In that case I want to know more about things like the **Maven employee revolt** and other controversies and **how they hurt or help my thesis**.
>
> The automated feature should **result in a plan** to make updates. Updates should **never be made automatically** — only written into a **plan file** I review after each run.
>
> We also want to look at **general organization** and **redundancy** — many investigations overlap and can be organized better. I'd like **article suggestions** whenever we've investigated a topic that **hasn't already been covered** in a reader article (~**3,000 words**, specific message a reader would want). Each investigation contains **biased claims by me**; it helps to know if **other people have already made these claims** (with citations), or if **no online citations** exist for a claim I'm making.
>
> The ultimate mission: make investigations **more consumable** to the **average reader** and **skeptical critics**; help me build a **solid, demonstrable, testable, counterfactual narrative** for my claims — while keeping me **within the guardrails of reality**, even as we may be **redefining some of the rules of reality**.

**What the author means (unpack):**

1. **Suggest, never ship** — the LLM is a **reviewer and planner**, not an author with commit rights.
2. **Adversarial friendship** — pushback is **required** when repo context or external evidence conflicts with author thesis; omission of pushback is a **failed sweep**.
3. **Investigation gold** — flag passages or threads that are **unusually strong** (primary sources, tight logic, falsifiable hooks) and recommend **deepening** them — not only weakness hunting.
4. **Plans, not patches** — every sweep emits a dated plan in [`sweep-plans/`](sweep-plans/); Ari approves before any investigation edit.
5. **Consumability** — average readers need clearer guides and less duplication; skeptics need **labeled** author vs documented vs speculative claims and **prior art** searches.
6. **Reality guardrails** — prisca sapientia and pattern thesis are **in-bounds**; confabulated quotes, false tier labels, and unlabeled speculation presented as fact are **out of bounds** ([`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](PARADIGM_INVESTIGATION_INSTRUCTIONS.md) verifiable externals pass).

---

## When to run

| Trigger | Selection | Notes |
|---------|-----------|-------|
| **Daily sweep** | **One** investigation per run — **random** from open `*investigation*.md` files **or** highest `Last updated` age | Prefer files with **Open** status and material §9 / weak-points tables |
| **Post-update sweep** | **The file(s)** changed in the last commit or session | Run within same day as author edit; skip random pick |
| **Author-requested** | Named path(s) | e.g. “sweep LLM history dossier” |

**Frequency cap:** At most **one plan file per investigation per calendar day** unless author requests a re-run.

**Hard rule:** Sweep **never** runs `git commit`, **never** edits investigation body text, **never** runs `npm run autogen` except to **read** lint state if checking Keywords format.

---

## What the LLM must do (review pass)

Read the target investigation **and** cross-linked dossiers cited in its Related / Cross-references sections. Search the repo for **overlap** (same event, same actor, same thesis in two files).

### 1. Ambiguities and contradictions

- Internal: two sections that **cannot both be true** without a stated bridge (dates, actors, causal claims).
- Repo-wide: this file **contradicts** another investigation — cite **both paths** and the conflicting sentences.
- Timeline: **fuzzy sequencing** (e.g. “weeks later” without anchor date when press gives one).
- **Output:** numbered list; each item = **quote or § anchor** + **why it conflicts** + **clarifying question for Ari** (not a resolved answer).

### 2. Pushback (wrong-track analysis)

For each **author thesis** or **author extension** block:

- State **strongest counterargument** a skeptical critic would use.
- Cite **documented** counter-evidence if it exists (Tier A/B press, court filings, official docs).
- Explain **within Paradigm Threat framing** why the thesis might still hold — or why it **weakens** if counter-evidence is not addressed.
- **Never** declare the author “wrong”; use: **“may be on the wrong track because…”**, **“needs a bridge because…”**, **“skeptic would say…”**.

### 3. Investigation gold

Identify **high-value threads** worth expanding:

- Strong primary citations not yet fully unpacked.
- Falsifiable hooks (FOIA targets, court dockets, datasets).
- Cross-investigation rhymes that could become a **hub row** or **single canonical section** elsewhere.

**Example (LLM history dossier):** Maven employee revolt ([NYT 2018 letter](https://www.nytimes.com/2018/04/04/technology/google-letter-ceo-pentagon-project.html)) — **gold** for testing whether “pre-LLM deployment was the real harm” thesis **helps or hurts** when Google **exited** but Maven **continued via contractors**.

### 4. Weak points and missing evidence

- Claims labeled **Documented** without Tier A/B source in line.
- Tier B counts (signatures, boycott numbers) without primary roster.
- **No online prior art** — author-unique claims with **no** external citation found after web search.
- **Prior art found** — others who made similar claims; list URLs and **overlap/divergence** with Ari’s framing.

### 5. Organization and redundancy

- Duplicate paragraphs / tables across this file and linked investigations.
- Recommend: **merge into one canonical file**, **short cross-link**, or **hub summary row** — **do not** perform merge in sweep.
- Guide (read order) missing or outdated relative to section count.
- Limits / Keywords / Investigator notes placement per [`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](PARADIGM_INVESTIGATION_INSTRUCTIONS.md).

### 6. Article suggestions

If the investigation is **mature enough** for a reader-facing essay and **no parent-folder article** exists (or existing article is stale):

- Propose **working title** + **one-sentence reader promise** (~3k words per [`ARTICLES.md`](instructions/ARTICLES.md)).
- List **3–5 sections** the article would cover (thesis-led, not dossier paste).
- Name **suggested output path** only if author naming convention is clear; otherwise “author to name path.”
- **Do not** draft the article in the sweep plan beyond this outline.

### 7. Consumability and skeptic lanes

| Reader | Sweep should check |
|--------|-------------------|
| **Average reader** | TL;DR accurate? Guide present? Jargon defined once? |
| **Skeptical critic** | Author vs Documented vs Speculative visibly separated? Limits block present? Weakest claim identified honestly? |

### 8. Testable narrative hooks

For top **3** author claims, propose:

- **Falsifier** — what observation would weaken the claim.
- **Corroborator** — archive, dataset, or primary source to pursue.
- **Counterfactual** — “If mainstream account X were true, we would expect Y; instead we see Z.”

---

## What the LLM must NOT do

- Edit any `*investigation*.md`, article, or `page.md`.
- Auto-resolve contradictions by picking a side.
- Remove or soften author thesis blocks without author approval.
- Invent citations or quote text not verified ([`ARTICLES.md` verifiable externals pass](instructions/ARTICLES.md#verifiable-externals-pass-required-before-ship)).
- Create reader articles or commit changes.
- Mark an investigation **Closed** or change **Status** fields.

---

## Plan file output (required)

**Path pattern:**

```text
docs/sweep-plans/YYYY-MM-DD-{investigation-slug}-sweep-plan.md
```

**Example:** `docs/sweep-plans/2026-06-22-llm-history-governance-theater-sweep-plan.md`

Use [`sweep-plans/_TEMPLATE_SWEEP_PLAN.md`](sweep-plans/_TEMPLATE_SWEEP_PLAN.md). Copy template per run; fill all sections; leave **Implementation status: PENDING AUTHOR REVIEW** until Ari acts.

**After author review:** Ari may mark plan `ACCEPTED / PARTIAL / REJECTED` at top; optional checkbox ticks when investigation edits land. **Do not** delete plans — they are an audit trail.

---

## Daily sweep procedure (agent checklist)

1. **Select** target investigation (random open file **or** post-update file).
2. **Read** target + linked cross-references + [`PRISCA_SAPIENTIA.md`](PRISCA_SAPIENTIA.md) epistemic frame.
3. **Grep** repo for overlapping thesis keywords (actor names, events, slogans).
4. **Web search** (when tools available) for **prior art** on top 3 author claims.
5. **Write** plan file from template — all sections populated; **no** investigation edits.
6. **Notify** author: plan path only (one line); do not summarize entire plan in chat unless asked.

---

## Post-update sweep procedure

Same as daily sweep, but:

- Target = **only** files touched in the update (or primary dossier if article + dossier pair changed).
- Add section **“Delta since last sweep”** if a prior plan exists for that slug in `sweep-plans/`.

---

## Example: first candidate dossier

**File:** [`science/ai/llm-history-governance-theater-investigation.md`](/science/ai/llm-history-governance-theater-investigation.md)

**Likely sweep findings (illustrative — not a completed run):**

| Category | Example hook |
|----------|----------------|
| Timeline | Feb–Mar 2026 Pentagon sequence vs Jan 2025 DeepSeek — verify ordering for causal claims |
| Pushback | “America doesn't have a surveillance problem” vs documented Clearview/CBP rows in same file |
| Gold | Maven revolt + Google exit vs contractor continuity — deepen for thesis test |
| Redundancy | Net Neutrality parallel in §7 vs root thesis in §2 — possible merge or cross-ref only |
| Article | No parent-folder reader essay yet — candidate ~3k manifesto on “governance theater vs user QA” |
| Prior art | FLI pause / NN regulatory-capture literature — find academic or press parallels to cite |

---

## Future automation (not implemented here)

- Cron / Cursor scheduled agent invoking this spec.
- `scripts/pick-sweep-target.py` — random open investigation weighted by staleness.
- Git post-commit hook **optional** — enqueue post-update sweep (plan-only).
- Dashboard listing open plans in [`sweep-plans/`](sweep-plans/).

This document is the **contract** for those tools when built.

---

## Index maintenance

When this workflow is first used on a file:

- Add row to [`INVESTIGATIONS_DEEP_DIVE.md`](INVESTIGATIONS_DEEP_DIVE.md) **only** if sweep plan items become repo-wide TODOs (author decision).
- Link this spec from [`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](PARADIGM_INVESTIGATION_INSTRUCTIONS.md) **Closing a session** / assistant constraints.

**Date:** 2026-06-22 — initial spec from author session (LLM history governance example).

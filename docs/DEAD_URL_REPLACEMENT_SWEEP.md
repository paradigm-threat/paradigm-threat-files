# Dead-URL replacement sweep — author-requested (spec)

**Purpose:** When the author asks, look up **confirmed-dead** third-party links and replace a markdown `href` only when a **true-match** live mirror exists (same citation / same copy). **No scheduled AI. No cron that calls a model.** The daily checker never edits markdown.

**Audience:** Author (Ari), Cursor agents, copilot sessions.

**Companions:** [`LINKING_AND_SITE_PATHS.md`](LINKING_AND_SITE_PATHS.md) (daily probe + JSON list), [`INVESTIGATION_LLM_SWEEP.md`](INVESTIGATION_LLM_SWEEP.md) (plan-files-only; **opposite** of this sweep — that spec never patches dossiers).

**Repos:** Relay markdown catalogs only — **paradigm-threat-files** and **paradigm-threat-timeline**. Do not run this on paradigm-threat-site or non-Relay trees.

---

## Trigger

The author asks, e.g. **“dead-url sweep”**, **“find mirrors for dead links”**, or names `hooks/dead-urls.json`.

Do **not** start this pass from the daily probe job. Do **not** invent a GitLab schedule that invokes an LLM.

---

## Input

1. Read `hooks/dead-urls.json` in the catalog being swept.
2. `rg` each exact key (and obvious raw spellings) across **that** repo’s tracked `*.md`. If the same href appears in the sibling Relay catalog, check both.
3. Skip first-party `paradigmthreat.net` (the checker already does).

---

## True match or skip

A replacement is allowed **only** when the live page is the **same work** the citation relied on.

**Prefer, in order:**

1. An archive snapshot of the **same original URL** (Wayback / archive.today) that still shows the cited page.
2. A publisher/canonical reprint of the **same** article (same work, byline, date, and body the surrounding prose depends on).

**Not a match — skip:**

- Similar headline or topic roundup
- Wikipedia summary
- Search snippet or SERP
- Different edition
- Paywall teaser
- “Related” piece
- Reconstructed or model-generated text
- Anything the agent cannot **open and compare**

**If unsure:** leave the markdown `href` unchanged. The park renderer `(dead)` marker (Phase 2) stays. Note the candidate in the session for Ari.

---

## When a match is confirmed

Then **edit markdown**:

- Change **only** that `href`. Keep link text unless the text was the dead URL itself.
- Do not rewrite surrounding prose.
- Apply the same replacement everywhere that href is the **same citation**.
- After replacements, **drop those keys** from that repo’s `hooks/dead-urls.json` so markers disappear (the next checker run would also resurrect them if the new URL is live).

This is the **only** intended markdown mutation in the dead-link system.

---

## What this is not

- Not the investigation LLM sweep (plans only; never patch dossiers).
- Not a license to “fix” citations with a better source on the same topic.
- Not an automated daily agent.

*Last updated: 2026-09-12*

# Agent instructions

Single entry point for assistants working in this repo. **Deep dives stay in linked docs** — do not duplicate them here.

---

## Git and go-live

**Canon:** [`docs/GIT_REMOTE_STRATEGY.md`](docs/GIT_REMOTE_STRATEGY.md)

| Step | Action |
|------|--------|
| 1 | Branch **`main`** (or catalog `publish_branch`). |
| 2 | **`git push iad1 HEAD:main`** first (publish origin). Server **`update` hook** waits for mesh peers — **push failure = publish failed** (timeout or lagging replica). |
| 3 | **`git push gitlab HEAD:main`** (forge backup) after iad1 succeeds. |
| 4 | Report outcome to the author: **success** if iad1 push exited 0; on failure read `remote: mesh sync failed:` lines. |

**Hard rules:** one tip everywhere; never force-push Relay `main` unless ordered; never land long-lived commits on only one node; real binaries at public paths ([`docs/MEDIA_AND_IPFS.md`](docs/MEDIA_AND_IPFS.md)).

**Mesh failures:** `/opt/relay/state/post_push_sync/<repo>.json` on iad1; `journalctl -g 'peer notify'`. Operator debug: `relay-gateway/scripts/relay-push-and-wait.sh` or `POST /api/sync/mesh/<repo>`.

---

## Dates

Hand-stamped dates and **`Last updated`** lines use **US Eastern** (`America/New_York`). Before stamping: `TZ=America/New_York date +%Y-%m-%d`.

---

## What to read for each task

| Task | Document |
|------|----------|
| Investigations (structure, evidence, discovery) | [`docs/INVESTIGATIONS.md`](docs/INVESTIGATIONS.md) |
| Reader-facing articles (voice, URLs, tone) | [`docs/instructions/ARTICLES.md`](docs/instructions/ARTICLES.md) |
| Hub `page.md` / AutoIndex | [`docs/instructions/PAGE_MD_AUTOINDEX.md`](docs/instructions/PAGE_MD_AUTOINDEX.md) |
| Site chat leads → reply + live link | [`docs/CHAT_REQUEST_RESPONSE.md`](docs/CHAT_REQUEST_RESPONSE.md) |
| Cosmology social Q&A routing | [`docs/LLM_COSMOLOGY_QA.md`](docs/LLM_COSMOLOGY_QA.md) |
| Satan / Saturn, God-and-Satan split, Satanism Q&A | [`influence/religion/qa/page.md`](influence/religion/qa/page.md) → dossier [`influence/religion/investigations/satan-saturn-same-creator-good-evil-split-investigation.md`](influence/religion/investigations/satan-saturn-same-creator-good-evil-split-investigation.md) |
| Æther / Maxwell vocabulary | [`docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`](docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md) |
| Git remotes (operator detail) | [`docs/GIT_REMOTE_STRATEGY.md`](docs/GIT_REMOTE_STRATEGY.md) |
| Media / IPFS | [`docs/MEDIA_AND_IPFS.md`](docs/MEDIA_AND_IPFS.md) |
| Prisca sapientia epistemic base | [`docs/PRISCA_SAPIENTIA.md`](docs/PRISCA_SAPIENTIA.md) |
| Dead-URL probe (daily JSON list) | [`docs/LINKING_AND_SITE_PATHS.md`](docs/LINKING_AND_SITE_PATHS.md) |
| Dead-URL replacement sweep (author-requested) | [`docs/DEAD_URL_REPLACEMENT_SWEEP.md`](docs/DEAD_URL_REPLACEMENT_SWEEP.md) |

**Before ship:** `npm run autogen` from repo root after substantive `.md` edits.

---

## Articles (summary)

When editing **reader-facing articles** (not investigations): **`I`** only for personal witness; **chronicle / documentary** prose (no poetry, no manifesto cadence); the reader decides — put the facts they need in order. Link **Substack** when the target essay already has a `**Substack:**` post; otherwise **`https://paradigmthreat.net/...`**. Images stay on paradigmthreat.net. Dossiers hold proof density. Full rules: [`docs/instructions/ARTICLES.md`](docs/instructions/ARTICLES.md). Cursor: **`.cursor/rules/articles.mdc`** and **`.cursor/rules/plain-spoken-prose.mdc`**.

---

## Site chat (summary)

Guest asks on park **mesh IRC** (`#pt` / `#pt-<topic>` at https://paradigmthreat.net/chat): read [`docs/CHAT_REQUEST_RESPONSE.md`](docs/CHAT_REQUEST_RESPONSE.md), investigate, reply in-channel with live link. Legacy `chat/public` is archive-only; MCP `submit_chat_comment` is retired.

---

## Topic-specific cites (on demand only)

Do **not** load unless the task touches that topic:

- **Iran 2026 / Rubio “world none of us want to leave behind”** — [`governance/war/mission-accomplished-again-iran-2026.md`](governance/war/mission-accomplished-again-iran-2026.md) (cite **Rubio**, not Vance; May 5, 2026 briefing).

*Last updated: 2026-09-12*

**Catalog index:** [`relay-master/docs/CATALOG_AGENTS.md`](../relay/relay-master/docs/CATALOG_AGENTS.md) lists all mesh catalog repos.

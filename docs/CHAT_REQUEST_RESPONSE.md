# Agent instructions — Site chat (mesh IRC)

**Purpose:** How assistants find Paradigm Threat **community chat** leads, turn them into investigations (or short answers), and close the loop with a brief in-channel reply + live `paradigmthreat.net` link.

**Related:** Investigation structure — [`INVESTIGATIONS.md`](INVESTIGATIONS.md). Cosmology *social* templates (not site chat) — [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md).

**Agent hub:** [`AGENTS.md`](../AGENTS.md) § Site chat

*Last updated: 2026-11-27*

---

## 1. What this workflow is for

| Intent | Do this |
|--------|---------|
| Guest asks **“what do you think?”** about a URL / channel / claim | Research → investigation (or FAQ reply) → **post in the same channel** with link |
| Guest says **“add a section about X”** | Investigation dossier → wire indexes → reply with link |
| Author says **reply to the chat lead** / **post update with link** | Find the message → **publish files** → reply in mesh chat as a clear nick (e.g. `protricity`) |
| Pure cosmology **Facebook/X** debunk (no site chat) | Use [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md) — **not** this doc |

**Do not** invent Discord APIs. Site chat is **mesh IRC** (Ergo + chat-edge JSONL), not Discord and not Vercel Postgres.

---

## 2. Where chat lives (current)

| Item | Value |
|------|--------|
| UI | Bottom overlay **Chat** button (Top → Chat → AI → Play → Settings) → Clevertree fullscreen dock or extension side panel; `/chat` is a placeholder only |
| IRC | **One** channel `#pt` for the whole repo |
| Topics | Human index [`chat/topics.json`](../chat/topics.json) — `0` = general; trailing `[[t:N]]` on messages |
| Cleverchat | https://api.clevertree.chat — SI panel SoT; bridge nick `clevertree-si` |
| History API | `GET https://paradigmthreat.net/chat/api/history?channel=pt&limit=50` |
| Durable store | JSONL on pub1 + Cleverchat comments git SoT |
| IRC | `pub1.relaygateway.net:6697` (TLS) — same Ergo mesh |

Markdown `<ChatRoom channel="nukes" />` is an **open-chat** control (not an in-article scrolled LiveChat). It opens `#pt` with that topic’s index attribution.

### Topic mapping

See `chat/topics.json`. Slugs like `nukes` map to numeric ids; wire tag is `[[t:N]]`. Do **not** open `#pt-nukes`.

---

## 3. Finding leads

```bash
curl -fsS 'https://paradigmthreat.net/chat/api/history?channel=pt&limit=50'
```

Or open https://paradigmthreat.net/chat

---

## 4. Response modes

| Lead type | Deliverable | Chat reply |
|-----------|-------------|------------|
| Deep claim / “add a section” | Full `*investigation.md` | Brief + link in `#pt` with `[[t:N]]` |
| Simple FAQ | Short answer | In-channel |
| Already covered | Point at existing page | Brief + link |

**Voice:** short chronicle, plain spoken. ~2–4 sentences. Keep under ~400 chars for live IRC/web send limits.

---

## 5. Posting a reply

1. Open chat via header button or https://paradigmthreat.net/chat
2. Set nick (e.g. `protricity`) and send the reply (topic tag appended by UI when known).
3. Optionally use a normal IRC client on `pub1.relaygateway.net:6697` and `JOIN #pt`.

---

## 6. Persistence & backups (ops)

| Store | Survives reboot? |
|-------|------------------|
| JSONL `/opt/relay/chat/logs` | Yes (web history / audit) |
| Ergo SQLite `ergo_history.db` | Yes (IRC CHATHISTORY) |
| Cleverchat comments SoT | Yes (SI panel + SI); bridge nick `clevertree-si` |
| Daily tar + rsync → ord1/hkg1 | Cold mirrors |
| Laptop pull | `ops/chat/scripts/pull-chat-backup-local.sh` in fan-edits |

See **fan-edits** `ops/chat/README.md`. Cleverchat host docs: `clevertree-chat/docs/irc-backbone.md`.

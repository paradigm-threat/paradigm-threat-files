# Agent instructions — Site chat (mesh IRC)

**Purpose:** How assistants find Paradigm Threat **community chat** leads, turn them into investigations (or short answers), and close the loop with a brief in-channel reply + live `paradigmthreat.net` link.

**Related:** Investigation structure — [`INVESTIGATIONS.md`](INVESTIGATIONS.md). Cosmology *social* templates (not site chat) — [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md).

**Agent hub:** [`AGENTS.md`](../AGENTS.md) § Site chat

*Last updated: 2026-10-17*

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
| UI | https://paradigmthreat.net/chat (park `ChatApp`); in-article embeds via markdown only |
| Prefix | `pt` — lobby `#pt`, topics `#pt-<topic>`, ops `#logs-pt` |
| Embeds | Opt-in markdown `<ChatRoom channel="…" />` → LiveChat on `#pt-<topic>` on park (`ChatRoomLive`) and on the Vercel archive (`old.paradigmthreat.net`, loads park hosts). No shell auto-chat / no per-page `#pt-page-*` / `#pt-doc-*` |
| History API | `GET https://paradigmthreat.net/chat/api/history?channel=pt-general&limit=50` |
| Durable store | JSONL on **iad1**: `/opt/relay/chat/logs/<channel>/<YYYY-MM-DD>.jsonl` |
| IRC | `flashbackrepository.org:6697` (TLS) — same Ergo mesh |
| Import | ~5402 posts from legacy `chat/public` → `#pt-<topic>` (see fan-edits `ops/chat/scripts/import-pt-chat-public.mjs`) |

### Topic mapping (legacy ChatRoom → mesh)

| Legacy | Mesh |
|--------|------|
| `general` | `#pt-general` |
| `nukes`, `hollow-earth`, … | `#pt-nukes`, `#pt-hollow-earth`, … |
| `governance/usury` | `#pt-governance-usury` |

```md
<ChatRoom channel="nukes" title="Nuclear Weapons Chatroom"/>
```

On the park tip this renders LiveChat on `#pt-nukes`. Pages without a `<ChatRoom />` tag have no chat embed.

### Archive only (do not write)

| Item | Value |
|------|--------|
| Git branch | `chat/public` on `paradigm-threat-site` (forensic) |
| Neon `posts` | Legacy backup; not live |
| MCP `submit_chat_comment` | **Retired** |

---

## 3. Finding leads

### 3.1 Recent mesh history

```bash
curl -fsS 'https://paradigmthreat.net/chat/api/history?channel=pt-general&limit=50'
curl -fsS 'https://paradigmthreat.net/chat/api/channels?q=pt-'
```

Or open https://paradigmthreat.net/chat?c=pt-general

### 3.2 Forensic sweep (pre-import archive)

```bash
cd paradigm-threat-site
git grep -i 'needle' chat/public -- '.relay/chat/channels/'
```

### 3.3 Check the corpus first

Before writing a new dossier: `rg` / glob under `paradigm-threat-files` for the person, URL, or topic.

---

## 4. Response modes

| Lead type | Deliverable | Chat reply |
|-----------|-------------|------------|
| Deep claim / “add a section” | Full `*investigation.md` | Brief + link in `#pt-<topic>` |
| Simple FAQ | Short answer | In-channel |
| Already covered | Point at existing page | Brief + link |

**Voice:** short chronicle, plain spoken. ~2–4 sentences. Keep under ~400 chars for live IRC/web send limits.

> Re: \<topic\> — \<what you did\>. \<finding / status\>. \<live URL\>

---

## 5. Posting a reply

1. Open https://paradigmthreat.net/chat?c=pt-\<topic\> (or article embed).
2. Set nick (e.g. `protricity`) and send the reply.
3. Optionally use a normal IRC client on `flashbackrepository.org:6697` and `JOIN #pt-<topic>`.

There is **no** MCP PUT to `chat/public` anymore.

---

## 6. Persistence & backups (ops)

| Store | Survives reboot? |
|-------|------------------|
| JSONL `/opt/relay/chat/logs` | Yes (web history) |
| Ergo SQLite `ergo_history.db` | Yes (IRC CHATHISTORY) |
| Daily tar + rsync → ord1/hkg1 | Cold mirrors |
| Laptop pull | `ops/chat/scripts/pull-chat-backup-local.sh` in fan-edits |

See **fan-edits** `ops/chat/README.md` for install/backup/restore.

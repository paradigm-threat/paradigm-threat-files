# Agent instructions — Finding and responding to site chat requests

**Purpose:** How assistants locate Paradigm Threat **Relay chat** leads (`chat/public` branch), turn them into investigations (or short answers), and **close the loop** with a brief channel reply + live `paradigmthreat.net` link.

**Related:** Investigation structure — [`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](PARADIGM_INVESTIGATION_INSTRUCTIONS.md). Cosmology *social* templates (not site chat) — [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md). Site MCP tool — `submit_chat_comment` in `paradigm-threat-site`.

**Cursor rule:** `.cursor/rules/paradigm-threat-chat-requests.mdc`

*Last updated: 2026-07-16*

---

## 1. What this workflow is for

| Intent | Do this |
|--------|---------|
| Guest asks **“what do you think?”** about a URL / channel / claim | Research → investigation (or FAQ reply) → **post in the same channel** with link |
| Guest says **“add a section about X”** | Investigation dossier → wire indexes → reply with link |
| Author says **reply to the chat lead from …** | Find the message → reply as **`protricity`** (unless told otherwise) |
| Pure cosmology **Facebook/X** debunk (no site chat) | Use [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md) — **not** this doc |

**Do not** invent Discord APIs. Site chat is **git on Relay** (`chat/public`), not Discord.

---

## 2. Where chat lives

| Item | Value |
|------|--------|
| Git branch | `chat/public` on **`paradigm-threat-site`** |
| Paths | `.relay/chat/channels/<channel>/<ISO-ts>_<id>_<ulid>.md` |
| Local inspect | `cd paradigm-threat-site && git show "chat/public:.relay/chat/channels/<channel>/<file>.md"` |
| List channel | `git ls-tree --name-only chat/public:.relay/chat/channels/<channel>/` |
| Grep | `git grep -i 'needle' chat/public -- '.relay/chat/channels/<channel>/'` |
| HTTP read | `GET` host `https://paradigm-threat-site.<region>.relaygateway.net/<path>` with header `X-Relay-Branch: chat/public` |
| Regions | Derive from `NEXT_PUBLIC_FILES_BASE_URL` by swapping `paradigm-threat-files.` → `paradigm-threat-site.` (see `lib/chat/chatRelayOrigin.ts`) |

**Author account for Ari replies:** `protricity` (`anonymous: false`). Guests often appear as `author: guest`.

Channels are flat (no nested “threads”); “reply to the thread” means **post again in the same channel** and open with `Re: …` so readers can connect it.

---

## 3. Finding leads

### 3.1 Author already named the lead

Example: “Saturnian Cosmology tiki-toki timeline — `#cosmology` Oct 2025.”

1. `git ls-tree` / `git grep` that channel + month.
2. Open the guest message + any later guest replies.
3. Confirm nothing from **`protricity`** already closed it.

### 3.2 Sweep for unanswered recommendations

Useful patterns in message bodies:

- `https://` + “what do you think” / “check out” / “you should add”
- Channel-topic citations (YouTube channels, archives, timelines)

Prioritize: **explicit asks of Ari**, **add-a-section** requests, **unique research URLs**. Skip news dumps and spam.

### 3.3 Check the corpus first

Before writing a new dossier: `rg` / glob under `paradigm-threat-files` for the person, URL, or topic. Link an existing investigation if it already covers the lead.

---

## 4. Response modes

| Lead type | Deliverable | Chat reply |
|-----------|-------------|------------|
| Deep claim / timeline / “add a section” | Full `*investigation.md` per [`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](PARADIGM_INVESTIGATION_INSTRUCTIONS.md) | Brief + link |
| Simple FAQ (“which years were added?”) | Short chat answer; optional FAQ page later | Brief answer in-channel |
| Already covered | Point at existing page | Brief + link |

**Voice in chat:** short, plain, first-person-as-Ari / site voice. No dossier TL;DR paste. Target **~2–4 sentences**, under **1024** chars (`CHAT_CONTENT_MAX`).

---

## 5. Posting a comment (Relay PUT)

Preferred when running in-repo tooling: **`putComment`** / MCP **`submit_chat_comment`** (`paradigm-threat-site` → `lib/chat/relayChatClient.ts`, `lib/mcp/serverHandlers.ts`).

**Manual PUT** (agents without MCP):

1. Build markdown with frontmatter (`schema: paradigm.chat.v1`, `channel`, `author: protricity`, `anonymous: false`, `source: mcp` or `web`, `created` ISO UTC).
2. Path: `.relay/chat/channels/<channel>/<compact-ISO>_<8-digit>_<ULID>.md` (see `lib/chat/chatPath.ts`).
3. `PUT` to `https://paradigm-threat-site.dfw1.relaygateway.net/<path>` with headers:
   - `X-Relay-Branch: chat/public`
   - `content-type: text/plain; charset=utf-8`
4. Expect `200` + JSON `{ "branch":"chat/public", "commit":"…", "path":"…" }`.
5. Verify with `GET` same URL + branch header.

**Confirm with the author before posting** unless they already ordered “post to chat” / “reply to that thread.”

---

## 6. Make the investigation link resolve

Chat links use **`https://paradigmthreat.net/...`**. The SPA shells any path; **content** comes from **`paradigm-threat-files`** on Relay.

1. Commit the investigation + index wiring (`page.md`, `docs/INVESTIGATIONS_DEEP_DIVE.md`, lane indexes).
2. Push **all** configured remotes (`dfw1`, `lon1`, `hkg1`, `gitlab`, …).
3. Verify raw files host returns markdown, not `not_found`:

```bash
curl -sS 'https://paradigm-threat-files.dfw1.relaygateway.net/<repo-relative-path>.md' | head -5
```

**Do not** post a public link to an untracked / unpushed file. If the author has not asked to commit, ask once; if they asked to post the chat update **with** a link, treat publish as in-scope for that request.

---

## 7. Investigator notes (dossier)

In the investigation’s **Investigator notes** (not the reader body), record:

- Channel, date, guest ask (and message path or id if useful)
- That a chat reply was posted (date)

Example: `Chat trigger: #cosmology guest Tiki-Toki URL (2025-10-18); reply posted 2026-07-16 as protricity.`

---

## 8. Worked examples

### Example A — Saturnian Tiki-Toki (`#cosmology`, 2025-10-18) → investigation → reply

**Guest ask** (`author: guest`, `#cosmology`):

> https://www.tiki-toki.com/timeline/entry/540208/… ← What do you guys think about this timeline?

**Later guest** (2026-03-13): positive (“Very cool…”) — still no Ari close-loop.

**Author ask (2026-07-16):** create investigation comparing published Saturnian timelines to ours; then reply on the thread with the link.

**Agent steps taken:**

1. Located message via `chat/public` + `#cosmology` / Oct 2025 / `tiki-toki` / `540208`.
2. Wrote [`cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation.md`](../cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation.md); wired indexes.
3. Posted as **`protricity`** in `#cosmology`:

> Re: the Tiki-Toki Saturnian Cosmology timeline — dug into it. It's Jno Cook's chronology in interactive form. Wrote a short compare vs ours (year gaps, how they count years / C-14, solar origin): https://paradigmthreat.net/cosmos/cosmology/investigations/saturnian-cosmology-published-timelines-investigation.md

4. Committed + pushed `paradigm-threat-files` so the URL resolves on Relay.

**Pattern:** recommendation URL → deep dossier → short `Re:` reply → publish before/with link.

### Example B — Mudfossil University (`#mudflood`, 2025-02-06) → investigation

**Guest ask:** praise + **“now you have to add a section about mudfossil university”** (+ channel URL).

**Agent steps:** dossier [`history/mudflood/investigations/mudfossil-university-roger-spurr-investigation.md`](../history/mudflood/investigations/mudfossil-university-roger-spurr-investigation.md); Investigator notes cite the chat seed. **Same close-loop:** when author asks to reply, post brief `#mudflood` note + live investigation URL as `protricity`.

---

## 9. Checklist (copy)

- [ ] Found guest message + channel + date on `chat/public`
- [ ] Checked for existing `protricity` reply and existing corpus coverage
- [ ] Deliverable ready (investigation or short answer)
- [ ] Author confirmed posting (or ordered it)
- [ ] Investigation **pushed** to files remotes (if linking)
- [ ] Verified files Relay returns content (not `not_found`)
- [ ] Posted brief `#channel` comment as **`protricity`**
- [ ] Noted chat seed + reply in Investigator notes
- [ ] Wired discovery indexes if new investigation

---

## 10. Anti-patterns

- Posting as `guest` / anonymous when closing Ari’s loop
- Dumping investigation TL;DR or Limits into chat
- Linking `paradigmthreat.net` before files push (SPA 200 + empty body)
- Treating Discord ban archives as the live chat store
- Editing `chat/public` history / other users’ messages
- Skipping confirmation when the author only asked to *draft* a reply

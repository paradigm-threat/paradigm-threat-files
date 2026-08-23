# Agent instructions — Finding and responding to site chat requests

**Purpose:** How assistants locate Paradigm Threat **Relay chat** leads (`chat/public` branch), turn them into investigations (or short answers), and **close the loop** with a brief channel reply + live `paradigmthreat.net` link.

**Related:** Investigation structure — [`INVESTIGATIONS.md`](INVESTIGATIONS.md). Cosmology *social* templates (not site chat) — [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md). Site MCP tool — `submit_chat_comment` in `paradigm-threat-site`.

**Agent hub:** [`AGENTS.md`](../AGENTS.md) § Site chat

*Last updated: 2026-07-16*

---

## 1. What this workflow is for

| Intent | Do this |
|--------|---------|
| Guest asks **“what do you think?”** about a URL / channel / claim | Research → investigation (or FAQ reply) → **post in the same channel** with link |
| Guest says **“add a section about X”** | Investigation dossier → wire indexes → reply with link |
| Author says **reply to the chat lead** / **post update with link** / **push everything live** | Find the message → **publish files** → reply as **`protricity`** (unless told otherwise) |
| Pure cosmology **Facebook/X** debunk (no site chat) | Use [`LLM_COSMOLOGY_QA.md`](LLM_COSMOLOGY_QA.md) — **not** this doc |

**Do not** invent Discord APIs. Site chat is **git on Relay** (`chat/public`), not Discord.

---

## 2. Where chat lives

| Item | Value |
|------|--------|
| Git branch | `chat/public` on **`paradigm-threat-site`** |
| Paths | `.relay/chat/channels/<channel>/<compact-ISO>_<8-digit>_<ULID>.md` |
| Local inspect | `cd paradigm-threat-site && git show "chat/public:.relay/chat/channels/<channel>/<file>.md"` |
| List channel | `git ls-tree --name-only chat/public:.relay/chat/channels/<channel>/` |
| Grep | `git grep -i 'needle' chat/public -- '.relay/chat/channels/<channel>/'` |
| Prefer remotes | `git fetch iad1 chat/public` then inspect `iad1/chat/public:…` — local `chat/public` may lag |
| HTTP read | `GET` host `https://paradigm-threat-site.<region>.relaygateway.net/<path>` with header `X-Relay-Branch: chat/public` |
| Regions | Derive from `NEXT_PUBLIC_FILES_BASE_URL` by swapping `paradigm-threat-files.` → `paradigm-threat-site.` (see `lib/chat/chatRelayOrigin.ts`) |

**Author account for Ari replies:** `protricity` (`anonymous: false`). Guests often appear as `author: guest`.

Channels are flat (no nested “threads”); “reply to the thread” means **post again in the same channel** and open with `Re: …` so readers can connect it. Guests often spray several messages the same day — reply once against the **clearest ask** (e.g. the “add a section” line), not every message.

---

## 3. Finding leads

### 3.1 Author already named the lead

Example: “Saturnian Cosmology tiki-toki timeline — `#cosmology` Oct 2025.”

1. `git ls-tree` / `git grep` that channel + month (fetch remotes first if needed).
2. Open the guest message + any later guest replies.
3. Confirm nothing from **`protricity`** already closed it.

### 3.2 Sweep for unanswered recommendations

Useful patterns in message bodies:

- `https://` + “what do you think” / “check out” / “you should add”
- Channel-topic citations (YouTube channels, archives, timelines)
- “add a section about …” / “now you have to add …”

Prioritize: **explicit asks of Ari**, **add-a-section** requests, **unique research URLs**. Skip news dumps and spam.

### 3.3 Check the corpus first

Before writing a new dossier: `rg` / glob under `paradigm-threat-files` for the person, URL, or topic. Link an existing investigation if it already covers the lead.

---

## 4. Response modes

| Lead type | Deliverable | Chat reply |
|-----------|-------------|------------|
| Deep claim / timeline / “add a section” | Full `*investigation.md` per [`INVESTIGATIONS.md`](INVESTIGATIONS.md) | Brief + link |
| Simple FAQ (“which years were added?”) | Short chat answer; optional FAQ page later | Brief answer in-channel |
| Already covered | Point at existing page | Brief + link |

**Voice in chat:** short, plain, first-person-as-Ari / site voice. No dossier TL;DR paste. Target **~2–4 sentences**, under **1024** chars (`CHAT_CONTENT_MAX`).

Typical shape:

> Re: \<topic\> — \<one beat of what you did\>. \<one beat of finding / status\>. \<live URL\>

---

## 5. Posting a comment (Relay PUT)

Preferred when running in-repo tooling: **`putComment`** / MCP **`submit_chat_comment`** (`paradigm-threat-site` → `lib/chat/relayChatClient.ts`, `lib/mcp/serverHandlers.ts`).

**Manual PUT** (agents without MCP):

1. Build markdown with frontmatter (`schema: paradigm.chat.v1`, `channel`, `author: protricity`, `anonymous: false`, `source: mcp` or `web`, `created` ISO UTC with `Z`).
2. Path: `.relay/chat/channels/<channel>/<compact-ISO>_<8-digit>_<ULID>.md`
   - Compact ISO = `new Date().toISOString().replace(/[:.]/g, '-')` → e.g. `2026-07-16T12-17-29-344Z`
   - **Do not** use offset forms that expand to `+00-00` in the filename
   - ULID-ish id: 26 uppercase hex chars (see `lib/chat/chatPath.ts` `newCommentId`)
3. `PUT` to `https://paradigm-threat-site.iad1.relaygateway.net/<path>` with headers:
   - `X-Relay-Branch: chat/public`
   - `content-type: text/plain; charset=utf-8`
4. Expect `200` + JSON `{ "branch":"chat/public", "commit":"…", "path":"…" }`.
5. Verify with `GET` same URL + branch header.

**Regions:** Prefer **one** successful PUT (**iad1**). Peer hooks usually propagate; only re-PUT other regions if verify fails and content/path stay identical.

**Confirm with the author before posting** unless they already ordered “post to chat” / “reply to that thread” / “push everything live” with a link.

---

## 6. Make the investigation link resolve

Chat links use **`https://paradigmthreat.net/...`**. The SPA shells any path; **content** comes from **`paradigm-threat-files`** on Relay.

1. Commit the investigation + index wiring (`page.md`, `docs/INVESTIGATIONS_DEEP_DIVE.md`, related-investigation cross-links, lane indexes).
2. Push per [`AGENTS.md`](../AGENTS.md): **`iad1`** first, then **`gitlab`**, then poll mesh sync (`sjc1`/`hkg1` usually catch via peer notify).
3. Verify raw files host returns markdown, not `not_found`:

```bash
curl -sS 'https://paradigm-threat-files.iad1.relaygateway.net/<repo-relative-path>.md' | head -5
```

**Do not** post a public link to an untracked / unpushed file. If the author has not asked to commit, ask once; if they asked to post the chat update **with** a link / **push everything live**, treat publish as in-scope for that request.

**Commit hygiene:** stage only the investigation + its index wiring — leave unrelated dirty trees alone.

**Local research archives** (e.g. `/home/ari/dev/wget/…`) stay **out of** `paradigm-threat-files` git; cite them in Investigator notes only.

---

## 7. Investigator notes (dossier)

In the investigation’s **Investigator notes** (not the reader body), record:

- Channel, date, guest ask (and message path or id if useful)
- That a chat reply was posted (date) as `protricity`
- Pointer to this playbook (`docs/CHAT_REQUEST_RESPONSE.md` §8)

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

---

### Example B — Mudfossil University (`#mudflood`, 2025-02-06) → investigation → reply → live

**Guest cluster** (`author: guest`, `#mudflood`, 2025-02-06) — several messages the same afternoon. Clearest ask (id `5363`):

> … now you have to add a section about mudfossil university …

(Also linked `https://www.youtube.com/@mudfossiluniversity` and credited Roger Spurr / DNA claims.)

**Author arc (2026-07-16):**

1. Create investigation into Mudfossil University / Roger Spurr (claims, citations, Yale history, validation).
2. Continue remaining research TODOs (Helix P-234 archive, BLAST recheck, claim sheet, outreach drafts, Stonehenge contrast).
3. **“add a comment to the thread… with investigation link. keep it short… push everything live.”**

**Agent steps taken:**

1. Located seed via `git grep -i mudfossil chat/public -- '.relay/chat/channels/mudflood/'`.
2. Wrote [`history/mudflood/investigations/mudfossil-university-roger-spurr-investigation.md`](../history/mudflood/investigations/mudfossil-university-roger-spurr-investigation.md); wired `page.md`, `docs/INVESTIGATIONS_DEEP_DIVE.md`, MFEE related link. Local wget archive cited in Investigator notes only (not committed).
3. Committed + pushed files remotes; verified Relay returned the updated markdown (incl. BLAST RID).
4. Posted as **`protricity`** in `#mudflood`:

> Re: Mudfossil University — dug in. Helix P-234 DNA report archived; Yale stories do not match the lab paperwork. Open investigation: https://paradigmthreat.net/history/mudflood/investigations/mudfossil-university-roger-spurr-investigation.md

5. Noted chat seed + reply date in Investigator notes.

**Pattern:** “add a section” ask → open dossier (not a soft reader article unless named) → brief `Re:` + live URL → publish is in-scope when author says push live / post with link.

---

## 9. Checklist (copy)

- [ ] Fetched / inspected guest message + channel + date on `chat/public` (prefer remote tip)
- [ ] Checked for existing `protricity` reply and existing corpus coverage
- [ ] Deliverable ready (investigation or short answer)
- [ ] Indexes wired (`page.md`, deep-dive, related links) if new investigation
- [ ] Author confirmed posting (or ordered reply / push live with link)
- [ ] Investigation **committed + pushed** to files remotes (if linking)
- [ ] Verified files Relay returns content (not `not_found`)
- [ ] Posted brief `#channel` comment as **`protricity`** (`Re: …` + URL)
- [ ] Noted chat seed + reply in Investigator notes
- [ ] Left unrelated dirty files unstaged

---

## 10. Anti-patterns

- Posting as `guest` / anonymous when closing Ari’s loop
- Dumping investigation TL;DR or Limits into chat
- Linking `paradigmthreat.net` before files push (SPA 200 + empty body)
- Treating Discord ban archives as the live chat store
- Editing `chat/public` history / other users’ messages
- Skipping confirmation when the author only asked to *draft* a reply
- Mangling comment filenames with timezone offsets (`+00-00`) instead of compact `…Z`
- Committing wget / local research dumps into `paradigm-threat-files`
- Staging unrelated modified files when publishing one investigation

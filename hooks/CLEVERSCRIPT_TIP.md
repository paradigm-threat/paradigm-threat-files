# CleverScript tip hygiene (paradigm-threat-files)

Hard rules for **SSR site-shell** hooks on this repo. Breaking them has taken the parked site offline.

## Prefer host helpers

Thin tip code via **`@relay/*`** (registered on SSR + WASM):

| Module | Use for |
|--------|---------|
| `@relay/catalog` | `parseNavIndexTxt`, `contentKind`, `buildDirTree`, `publishedFromBlogPath`, `loadNavIndex` |
| `@relay/date` | `formatTiny` / `formatLong` / `formatFeed` / `sameDay` |
| `@relay/path` | `basename`, `dirname`, `join`, `split` |
| `@relay/util` | `sortBy`, `take`, `prop`, `omitUndefined` |
| `@relay/ui` | `cachedGet`, `Link`, `RadioTabs`, `safeProps` |
| `@relay/tts` | `synthesize` (Piper WAV→data URL), `AudioPlayer` |

ES builtins now available: `parseInt`, `Number.from`, `Math.*`, `Date.from`/`parse`/`now`, `Array#sort`/`slice` (return **new** arrays), `String#replaceAll`, `undefined`→`null`. Prefer `Date.from(iso)` over reinventing month tables; still no `new Date()`.

## Language subset

- **Always brace** `for`, `while`, and `if` bodies — even one-liners.
- **No bare `undefined` identifier** — pinned fleet WASM may predate the `undefined` binding. Use `null` checks + try/catch for missing props; `typeof x === 'undefined'` (string) is OK. Never write `!== undefined` / `=== undefined`.
- **No regex literals** (`/…/`) — loop characters or host helpers instead.
- **Do not mutate `const` objects** — rebuild with `let` when adding fields.
- **No unary minus literals** in return positions (e.g. `return -1`); compare directly or use positive bounds.
- **No computed object keys** — use `@relay/catalog.buildDirTree` instead of tip-built trees.
- Prefer **try-catch** for missing props.
- **No `Array#indexOf`** — only `String#indexOf` exists. Loop to test membership.
- **CSS radio tabs** for ChangeLog (no `setState` tab state — it remounts the article). Host `RadioTabs` is available when you want generic tabs.
- Nest tab radios in `<label>` (no `htmlFor`).
- **No named function expressions** (`return function foo() {}`) — use arrows (`() => {}`).
- **No `encodeURIComponent` / `charCodeAt` / `window`** — not in the CS allowlist (`document` + `globalThis` are). Prefer simple string loops.
- **Module `const`/`let` bindings are Undefined inside nested `function` bodies** — prefer `export const api = createApi()` where methods close over locals inside `createApi()`. Named `export function` / `export const` / `export let` / `export default` are supported. Do **not** use `export default create()` (call expression as sole default without binding).
- **`JSON.parse` / `JSON.stringify`** are first-class CleverScript builtins (injected by the runtime). Prefer bare `JSON.*`; `globalThis.JSON` is mirrored.
- **Avoid unary minus after `return`** — `return -1` parses as `return` then subtract. Use `return 0 - 1` or `return (-1)`.
- **`document` / `setInterval`** are injected builtins (WASM DOM host; SSR stubs). Host methods used on tip: `querySelector` / `querySelectorAll`, DomNode `setAttribute` / `getAttribute` / `scrollIntoView` / `getBoundingClientRect`, plus `getElementById`.
- Theme CSS is **pruned to used `className`s** — keep a hidden marker vnode for classes only needed after client interaction (e.g. gallery overlay).

## SSR data

- **Never** `fetch` / QUERY the **same Host** during site-shell SSR — it deadlocks the gateway worker.
- Prefer on-tree blobs: **`nav-index.txt`**, sidecar JSON, static catalogs — load via **`cachedGet`** / **`parseNavIndexTxt`** (request-local cache).
- Regenerate nav index before push: `python3 scripts/build-nav-index.py` (writes optional `_updated` ISO column).
- **SSR must stay light:** gate heavy catalog / markdown work with `isClientLive() === true`. On SSR (`!== true`), return a chrome shell + short “loads after page open…” placeholder — do **not** call `loadArticleRows`, `MarkdownRenderer`, or full nav-index parse until the client is live.

## Pre-push smoke

From a machine with the repo synced locally and relay-gateway on `:8080`:

```bash
./scripts/ssr-smoke.sh
```

Expect **HTTP 200**, body contains `pt-changelog` (SSR shell ok) and `Paradigm Threat` (brand marker). Full ChangeLog cards / article HTML fill after hydrate.

If ChangeLog parse breaks, parked GET `/` must return **500 Site shell / SSR failed**, not **Unknown Host** (gateway A1).

## Related

- Gap log: `relay-gateway/docs/CLEVERSCRIPT_GAP_LOG.md` (G-005–G-007)
- Disabled components: `hooks/COMPONENTS_DISABLED.md`

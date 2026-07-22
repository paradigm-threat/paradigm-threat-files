# CleverScript tip hygiene (paradigm-threat-files)

Hard rules for **SSR site-shell** hooks on this repo. Breaking them has taken the parked site offline.

## Prefer host helpers

Thin tip code via **`@relay/*`** (registered on SSR + WASM):

| Module | Use for |
|--------|---------|
| `@relay/catalog` | `parseNavIndexTxt`, `loadNavIndex`, `extractMarkdownHeadings`, `contentKind`, `buildDirTree`, `publishedFromBlogPath`, `neighborPaths`, `isFeelingLuckyCandidate`, `pickFeelingLuckyPath` |
| `@relay/date` | `formatTiny` / `formatLong` / `formatFeed` / `sameDay` |
| `@relay/path` | `basename`, `dirname`, `join`, `split`, `normalizeRel`, `resolveRel`, `parentDir`, `siteHref`, `resolveEmbedSrc`, `resolveAssetUrl`, `rewriteMarkdownAssetUrls` |
| `@relay/util` | `sortBy`, `take`, `prop`, `omitUndefined`, `slugify`, `uniqueId`, `includes` |
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
- **Named `export function` / `export const` / `export let` / `export default` are supported.** Do **not** use `export { name }` re-exports or `export default create()` (call expression as sole default without binding).
- **Module `const`/`let` bindings are Undefined inside nested `function` bodies** — prefer `export const api = createApi()` where methods close over locals inside `createApi()`.
- **`JSON.parse` / `JSON.stringify`** are first-class CleverScript builtins (injected by the runtime). Prefer bare `JSON.*`; `globalThis.JSON` is mirrored.
- **Avoid unary minus after `return`** — `return -1` parses as `return` then subtract. Use `return 0 - 1` or `return (-1)`.
- **`document` / `setInterval`** are injected builtins (WASM DOM host; SSR stubs). Available when needed: `querySelector` / `querySelectorAll`, DomNode attrs / `scrollIntoView` / `getBoundingClientRect`, `getElementById`. Prefer host-agnostic paths (e.g. content-derived TOC) over Dom scraping.
- Theme CSS is **pruned to used `className`s** — keep a hidden marker vnode for classes only needed after client interaction (e.g. gallery overlay). TOC markers live in **`SiteChrome`** so home → article soft-nav still has `lg:pt-toc-lg` (otherwise TOC stays `display:none`).
- **TOC is content-derived and host/OS-agnostic** — `extractMarkdownHeadings` walks the markdown string (ATX + fence skip); `makeHeadingOverrides` stamps matching `id`s on `h1`–`h6`; `DynamicIndex` renders from `items` props with `#id` links and hash-only active state. **Do not** rebuild the TOC via `querySelector` / Dom poll / scroll-spy geometry.
- **Heading override callables must not be named `h1`…`h6`** — CleverScript JSX can resolve those lowercase tags to the local binding and recurse until “Maximum recursion depth exceeded”. Name them `renderHeading1`, etc.
- **New tip modules must be listed in `hooks.json`** — CSR hydrate only prefetches that manifest (SSR follows imports). Missing entries → `Module not found: hooks/...` hydration error with static shell left below.

## SSR priority tiers (P0–P3)

Site-shell SSR is **article-first**, not catalog-first. If it is not the article path or static chrome, it belongs on hydrate.

| Tier | Examples | SSR | Hydrate |
|------|----------|-----|---------|
| **P0 Content** | Article / `page.md` markdown, heading TOC from the same `extractMarkdownHeadings` | **Required** — tip-safe `cachedGet('/'+path)` (in-process on gateway; not same-Host HTTP) + `MarkdownRenderer` | Reuse same tree (no blank flash) |
| **P1 Shell** | Brand, hardcoded header/footer links in `Nav.jsx`, theme CSS markers | **Required**, **fetch-free** (literals only; never `nav-index` for the top nav) | Menu / theme / font handlers only |
| **P2 Catalog** | DirNav tree, ChangeLog cards, Feeling Lucky, neighbors, AutoIndex, Home index lists | **Forbidden** — placeholder only | `loadNavIndex` / `loadArticleRows` |
| **P3 Interactive** | Gallery, TTS, theme/font persistence, search QUERY | **Forbidden** | Only when `isClientLive() === true` |

**Soft rule:** tip-blob reads for P0 are allowed on SSR via `RepoFetchHost` / `cachedGet`. Same-Host **HTTP** `fetch` / QUERY still deadlocks the worker — never do that. Optional later: host lint when `loadNavIndex` runs with `!isClientLive`.

**Header nav:** keep static P1 links. Do not drive the top bar from `nav-index.txt`. Catalog churn belongs in DirNav (hydrate).

**Bots:** expect **`sitemap.xml`** + article HTML, not DirNav. Regenerate sitemap with the nav-index script before push.

**Gateway reuse (Next-like):** fleet may cache SSR HTML keyed by `(repo, tipCommit, path, web-assets oid)` with `s-maxage≈60` / SWR — see `relay-gateway/docs/RELAY_POLICY_AND_PERFORMANCE.md` (SSR HTML cache). Tip still must be correct without that cache.

## SSR data

- **Never** `fetch` / QUERY the **same Host** during site-shell SSR — it deadlocks the gateway worker.
- **P0 article:** load via **`cachedGet('/'+relPath+'?v=ptmdN')`** so SSR and CSR share one tip-safe path (query stripped for git read; busts CDN on CSR). Cap absurdly large blobs on SSR (placeholder + hydrate).
- Prefer on-tree catalogs: **`nav-index.txt`**, **`sitemap.xml`**, sidecar JSON — load via **`loadNavIndex(limit)`** only when **live** (P2). Tip `extractMarkdownHeadings` prefers host `@relay/catalog.extractMarkdownHeadings` when fleet WASM is new enough; local ATX walk is the fallback.
- Regenerate indexes before push: `python3 scripts/build-nav-index.py` (nav-index + sitemap + robots).
- **P2/P3 stay light on SSR:** gate catalog / interactive work with `isClientLive() === true`. Do **not** call `loadArticleRows`, full nav-index parse, or QUERY until the client is live.
- **Homepage `page.md` UTF-8 hazard (2026-07-22):** fleet WASM panics with `byte index … is not a char boundary` inside multi-byte chars (`—`, `“`, …) while hydrating `/`, then `[embed] boot failed RuntimeError: unreachable`. Keep **`page.md` ASCII-only** (no curly quotes, em dashes, arrows, æ). Hero image alts short/single-line. Bump `?v=ptmdN` when content must pierce CDN `max-age=3600`; do **not** use `Date.now()` in tip — breaks SSR compile. Root cause is Relay runtime byte-slice; content hygiene unblocks the parked site.

## Pre-push smoke

From a machine with the repo synced locally and relay-gateway on `:8080`:

```bash
./scripts/ssr-smoke.sh
```

Expect **HTTP 200**, body contains **article markdown HTML** (e.g. `Welcome to Paradigm Threat` / `data-pt-article`), **TOC** when headings exist, `pt-changelog` used-class marker, and brand text. DirNav / ChangeLog **cards** still fill after hydrate.

If SSR fails, parked GET `/` must return **500 Site shell / SSR failed**, not **Unknown Host** (gateway A1).

## Related

- Gap log: `relay-gateway/docs/CLEVERSCRIPT_GAP_LOG.md` (G-005–G-007)
- Policy / SSR HTML cache: `relay-gateway/docs/RELAY_POLICY_AND_PERFORMANCE.md`
- Disabled components: `hooks/COMPONENTS_DISABLED.md`

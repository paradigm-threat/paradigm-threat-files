# CleverScript tip hygiene (paradigm-threat-files)

Hard rules for **SSR site-shell** hooks on this repo. Breaking them has taken the parked site offline.

**Direction:** CleverScript is **routing and composition**. Heavy lift (parse, catalog, dates, path, search, image/IPFS, SSR document assembly) stays in **Rust** `@relay/*` / gateway natives. Do not grow tip-local libraries — extract a host helper and add a regression test. Canon: `relay-gateway/docs/CS_HOST_HELPERS.md`.

**Local hardening (before fleet push):** `relay-gateway/scripts/park-local.sh` + [`docs/RELAY_PARK_HARDENING.md`](../docs/RELAY_PARK_HARDENING.md).

**Perf strategy catalog** (SSR/hydrate lessons, tip phase gates, `RELAY_PERF_*`): [`relay-runtime/docs/PERF_FEATURE_FLAGS.md`](../../../relay/relay-runtime/docs/PERF_FEATURE_FLAGS.md). Prefer named strategies over deleting alternate paths.

## Prefer host helpers

Thin tip code via **`@relay/*`** (registered on SSR + WASM):

| Module | Use for |
|--------|---------|
| `@relay/catalog` | `parseNavIndexTxt`, `extractMarkdownHeadings`, `contentKind`, `buildDirTree`, `dirExpandPaths`, `nestTocItems`, `publishedFromBlogPath`, `neighborPaths`, `isFeelingLuckyCandidate`, `pickFeelingLuckyPath` |
| `@relay/date` | `formatTiny` / `formatLong` / `formatFeed` / `sameDay` |
| `@relay/path` | `basename`, `dirname`, `join`, `split`, `normalizeRel`, `resolveRel`, `parentDir`, `siteHref`, `resolveEmbedSrc`, `resolveAssetUrl`, `rewriteMarkdownAssetUrls`, `portraitSiblingSrc`, `repoRelFromMediaSrc`, `safeImgDomId`, `readHashImgSrc`, `galleryImgHash`, `galleryDisplaySrc`, `portraitSiblingIfPresent`, `normalizeHttpHref`, `lookupHttpHref` |
| `@relay/util` | `sortBy`, `take`, `prop`, `omitUndefined`, `slugify`, `uniqueId`, `includes`, `splitSentences`, `takeSentenceChunk` |
| `@relay/ui` | `cachedGet`, `Link`, `RadioTabs`, `safeProps` |
| `@relay/tts` | `synthesize` (Piper WAV→data URL), `AudioPlayer` |

Server GET natives (already thin in `hooks/server/get.cs`): `@relay/md`, `@relay/ssr`, `@relay/web-assets`, `@relay/image`, `@relay/ipfs`. QUERY: `@relay/search/sqlite` only — no tip FTS.

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
- **Tip Dom:** `setAttribute` / `getAttribute` only — **no `removeAttribute`**, **no `classList`**. Prefer `setAttribute('class', …)` / always set `data-*` values (e.g. font cycle must `setAttribute('data-font', 'garamond')`, not remove).
- **No named function expressions** (`return function foo() {}`) — use arrows (`() => {}`).
- **No `encodeURIComponent` / `charCodeAt` / `window`** — not in the CS allowlist (`document` + `globalThis` are). Prefer simple string loops.
- **Named `export function` / `export const` / `export let` / `export default` are supported.** Do **not** use `export { name }` re-exports or `export default create()` (call expression as sole default without binding).
- **Module `const`/`let` bindings are Undefined inside nested `function` bodies** — prefer `export const api = createApi()` where methods close over locals inside `createApi()`.
- **`JSON.parse` / `JSON.stringify`** are first-class CleverScript builtins (injected by the runtime). Prefer bare `JSON.*`; `globalThis.JSON` is mirrored.
- **Avoid unary minus after `return`** — `return -1` parses as `return` then subtract. Use `return 0 - 1` or `return (-1)`.
- **Block comments must not contain `*/` mid-text** — e.g. writing `a/h*/img` inside `/* … */` closes the comment early and yields cryptic parse errors (`Expected LParen, got Ident("minutes")`).
- **`document` / `setInterval`** are injected builtins (WASM DOM host; SSR stubs). Available when needed: `querySelector` / `querySelectorAll`, DomNode attrs / `scrollIntoView` / `getBoundingClientRect`, `getElementById`. Prefer host-agnostic paths (e.g. content-derived TOC) over Dom scraping.
- Theme CSS is **pruned to used `className`s** — keep a hidden marker vnode for classes only needed after client interaction (e.g. gallery overlay). TOC markers live in **`SiteChrome`** so home → article soft-nav still has `lg:pt-toc-lg` (otherwise TOC stays `display:none`).
- **TOC is content-derived and host/OS-agnostic** — `@relay/catalog.extractMarkdownHeadings` (tip thin wrap) walks the markdown string (ATX + fence skip); `makeHeadingOverrides` stamps matching `id`s on `h1`–`h6`; `DynamicIndex` nests via `@relay/catalog.nestTocItems` and renders `#id` links. Hash active is `data-pt-toc-active` (hashchange `setAttribute` only — no `setState`). **Do not** rebuild the TOC via `querySelector` / Dom poll / scroll-spy geometry.
- **Directory expand** uses `data-pt-open="0"|"1"` (and `data-pt-showall`) + CSS — not `<details open>` (cannot remove `open`) and not `setState`. Host: QUERY catalog rows → `@relay/catalog.buildDirTree` + `dirExpandPaths(currentRel)` for ancestor folders.
- **Heading override callables must not be named `h1`…`h6`** — CleverScript JSX can resolve those lowercase tags to the local binding and recurse until “Maximum recursion depth exceeded”. Name them `renderHeading1`, etc.
- **Anchor override callables must not be named `a`** — same JSX shadowing risk. Name them `renderMdAnchor` (or similar) and look up dead hrefs with `@relay/path.lookupHttpHref`.
- **New tip modules must be listed in `hooks.json`** — CSR hydrate only prefetches that manifest (SSR follows imports). Missing entries → `Module not found: hooks/...` hydration error with static shell left below.

## Render rarity (theme, font, chrome)

Relay CleverScript is **not** React Fiber. On web, each `setState` that calls `set_render_requested` re-runs the **whole** site-shell hook and (post-hydrate) **wipes and rebuilds** the mount (`innerHTML` replace). Optimize by making CleverScript re-renders **extremely rare** — not by memoizing subtrees that do not exist yet.

| Do | Don't |
|----|--------|
| Flip `html` class (`light`/`dark`) against dual CSS (`html.dark` / `html.light` + `prefers-color-scheme`) | `useState` only to swap sun/moon icons |
| Flip `html[data-font]` + CSS for article / Ag badge face | `setState` on every font cycle |
| CSS `:has()` / radio tabs for ChangeLog | Tab `setState` that remounts markdown |
| Host-native widgets for high-churn UI | Grow tip libraries that thrash `setState` |

**Theme / font toggles (web):** class / attribute + dual sheet only. Runtime injects `css_for_web_system` (`html.dark` / `html.light` + `prefers-color-scheme`). Tip-injected chrome (`navChromeCss` banner, theme icons, etc.) must use the **same dual-sheet triad** — not `html.dark` alone:

1. **Base** = light
2. **`@media (prefers-color-scheme: dark)`** = dark (empty `<html>` class / OS preference)
3. **`html.dark`** = dark (forced)
4. **`html.light`** = light (forced; beats the media query)

Keep both theme icons in the DOM; show/hide with that triad. Persist with `html[data-pt-theme]` + `localStorage` (`pt-theme`). Host `syncHtmlThemeClass` restores class from `data-pt-theme`, then `localStorage`, then WASM `current_theme` — **do not** rely on tip `useEffect` after soft-hydrate (effects often never remount). **Never** call `setCurrentTheme` / `data-theme` for park chrome (CSS regen + full re-render). Canon: `relay-gateway/docs/RELAY_CLEVERSCRIPT_REACT_RENDERING.md`, `relay-runtime/docs/STYLE_RESOLUTION.md`.

**Theme on Android (prep — do not implement tip DOM flips):** same `theme.yaml` `light`/`dark` tokens. Host uses JNI `nativeSetThemeAndRender(name)` to re-resolve the stored VNode **without** a CleverScript hook re-run (one native apply). Future dual style maps may remove re-resolve; until then tips must not rely on `html.dark` / `navChromeCss` cascade.

**Inactive until hydrated:** host SSR HTML emits `html[data-pt-hydrated="0"]`; web glue flips to `"1"` at **phase 1** (`set_client_live_phase(1)` / `isClientLive()`). Progressive phases **2 catalog → 3 feeds → 4 interactive** advance on host idle (see `relay-runtime/docs/HYDRATE_PHASES.md`). Tip CSS greys `.pt-client-only` while `"0"`. **Pre-hydrate also force-shows `.pt-nav-desktop` and hides the hamburger**. Gate DirNav/`FeelingLucky` with `isClientLivePhase(2)`, ChangeLog/AutoIndex with `(3)`, TTS/gallery with `(4)`.

Validate on park-local: after hydrate, theme click must **not** remount the article node — only `documentElement` class / paint.

## SSR priority tiers (P0–P3)

Site-shell SSR is **article-first**, not catalog-first. If it is not the article path or static chrome, it belongs on hydrate.

### Verdict: do **not** SSR DirNav / ChangeLog / article-list rows

**Anti-pattern** for park — even if you “cache it harder.” Evidence:

1. **Same-Host QUERY / HTTP `fetch` during site-shell SSR deadlocks** the gateway worker (or burns a cold index path). `RepoFetchHost` can read tip blobs in-process; that is **not** a license to fan out catalog work on every HTML miss.
2. **Render rarity:** post-hydrate `setState` re-runs the **whole** shell and replaces `innerHTML`. Catalog trees baked into SSR HTML still remount when any tip state thrash happens; placeholders + hydrate keep P0 article stable.
3. **Gateway `ssr_html_cache`** keys by tip OID — a correct miss path must stay **cheap** (P0+P1 only). Putting catalog QUERY / card fan-out into SSR reintroduces the old multi-second (~10s) cold path on every tip push and cache miss.
4. **Bots / SEO** already get article HTML + `sitemap.xml`. DirNav cards are not the crawler contract.

**Optimal pattern:** SSR **P0 article + P1 static chrome** (placeholders for catalog) → client hydrate when `isClientLive() === true` → QUERY the index (module-warm one HTTP per spec: ChangeLog kinds, DirNav, Feeling Lucky). Never same-Host QUERY during site-shell SSR.

| Tier | Examples | SSR | Hydrate |
|------|----------|-----|---------|
| **P0 Content** | Article / `page.md` markdown, heading TOC from the same `extractMarkdownHeadings` | **Required** — tip-safe `cachedGet('/'+path)` (in-process on gateway; not same-Host HTTP) + `MarkdownRenderer` | Reuse same tree (no blank flash) |
| **P1 Shell** | Brand, hardcoded header/footer links in `Nav.jsx`, theme CSS markers | **Required**, **fetch-free** (literals only; never QUERY for the top nav) | Menu / theme / font handlers only; `data-pt-hydrated` → `"1"` |
| **P2 Catalog** | DirNav tree, ChangeLog cards, Feeling Lucky, neighbors, AutoIndex, Home index lists | **Forbidden** — placeholder only (`data-pt-dirnav-ssr` / `data-pt-changelog-ssr`) | Hydrate QUERY via `loadDirCatalogRows` / `loadCatalogKind` / `loadArticleRows` |
| **P3 Interactive** | Gallery, TTS, theme/font persistence, search QUERY | **Forbidden** | Only when `isClientLive() === true` |

**`data-pt-hydrated`:** gateway embed sets `"0"` on `<html>`; `relay-runtime-web.js` sets `"1"` when promoting live. Tip styles `[data-pt-hydrated="0"] .pt-client-only` (plus `:disabled` / `aria-disabled` fallbacks). Do **not** invent a parallel hydrate flag.

**Soft rule:** tip-blob reads for P0 are allowed on SSR via `RepoFetchHost` / `cachedGet`. Same-Host **HTTP** `fetch` / QUERY still deadlocks the worker — never do that. Optional later: host lint when catalog QUERY runs with `!isClientLive`.

**Header nav:** keep static P1 links. Do not drive the top bar from QUERY. Catalog churn belongs in DirNav (hydrate).

**Bots:** expect **`sitemap.xml`** + article HTML, not DirNav. Regenerate sitemap with `python3 scripts/build-nav-index.py` before push.

### Cache layers (catalog stays off SSR HTML)

| Layer | Key / scope | What it caches | TTL / invalidation |
|-------|-------------|----------------|--------------------|
| Gateway **`ssr_html_cache`** | `(repo, branch, tipCommitOID, path, clientHook, webAssetsOID)` | P0+P1 HTML document only | Tip / web-assets OID change → miss; `s-maxage=60`, SWR 3600; `RELAY_DISABLE_SSR_HTML_CACHE=1` |
| Runtime **`tip_cached_get`** | URL string, per RunState / hydrate session | Raw tip blob text (article md, assets) | Cleared with run state; one GET per URL per session |
| Tip module warm | `loadArticles.jsx` QUERY caches | DirNav / ChangeLog / Lucky result arrays | Module lifetime (hydrate session); one HTTP per spec |
| Gateway **QUERY LRU** | `(repo, tipHead, collection, query, limit, order)` | Search + hydrate catalog QUERY | ~45s; tip HEAD in key; skipped for `order=random`; **never** call from site-shell SSR |
| CDN / browser | On-tree GET paths | Article md, images, `sitemap.xml` | CDN-friendly blob GET; bump `?v=` when content must pierce |

**Do / don’t (loading):**

| Do | Don’t |
|----|--------|
| SSR article + static nav chrome; catalog placeholders | SSR full DirNav / ChangeLog / AutoIndex rows |
| Hydrate: QUERY catalog once live (module-warm per spec) | Same-Host HTTP QUERY inside site-shell SSR |
| Rely on tip OID HTML cache for cheap P0+P1 hits | Stuff catalog into SSR so every tip push pays QUERY again |
| Indexed `content_kind` / `_updated` / `image_src` from QUERY | Fetch 10k rows and `sortBy` in CleverScript; dual-read txt then QUERY |
| CSS tabs / dual theme CSS (no catalog remount) | `setState` tabs or theme that wipe the article |

**Gateway reuse (Next-like):** fleet caches SSR HTML keyed by tip OID with `s-maxage≈60` / SWR — see `relay-gateway/docs/RELAY_POLICY_AND_PERFORMANCE.md`. Tip still must be correct without that cache — and that cache must **not** embed P2 catalog.

## CSR host (relay web client)

When **`manifest.relayHostMode === 'csr'`** (relay-client-web repo tab — no SSR document). **Missing `relayHostMode` defaults to `ssr`** so gateway GET SSR still emits P0 HTML.

- **No P0 SSR assumption** — article markdown loads on first **`isClientLive()`** pass via `cachedGet` / tip GET.
- Wrap root in **`BootShell`** → **`@relay/ui/RelayBootShell`**; overlay **only in CSR**. Parked hydrate must **not** cover SSR — mute `.pt-client-only` until `html[data-pt-hydrated="1"]`.
- CSR: **`StyleContext fullScreen={false}`**. Parked SSR: `fullScreen` (shell owns the viewport).
- **P2 catalog** — CSR: return **`null`** while `!isClientLive()` (overlay covers). SSR: placeholders with `data-pt-*-ssr`.
- Helpers: **`hooks/client/hostMode.jsx`** (`isCsrHost`, `relayHostMode`, `relaySsrArticlePresent`).

Parked **`ssr`** hosts: P0+P1 SSR, P2 placeholders, hydrate promotes live without a loading takeover.

## SSR data

- **Never** `fetch` / QUERY the **same Host** during site-shell SSR — it deadlocks the gateway worker.
- **P0 article:** load via **`cachedGet('/'+relPath+'?v=ptmdN')`** so SSR and CSR share one tip-safe path (query stripped for git read; busts CDN on CSR). Prefer an explicit **`<DeferredMarkdown src="…" minHeight="…px" />`** for long sections (home: `page-sections/investigations.md`). Absurdly large **single-file** tips (no tag, >~400KB): `ArticleView` SSRs a short **lead** + deferred island (`page-sections/__article_tail__.md`, seeded in-process) — **never blank** the whole body. Prefetch real tip `src` at phase **≥2**; fill the island at phase **≥3** via sibling `MarkdownRenderer` (do **not** nest `MarkdownRenderer` / `cachedGet` inside the DeferredMarkdown override).
- **Hydrate catalog = QUERY**, not on-tree GET. Tip `loadArticles.jsx` issues `fetch('/', { method: 'QUERY' })` only when live. Server `order=-_updated` / `path` / `random`; object `query` filters on `search.yaml` `filterFields`. Tip `extractMarkdownHeadings` is a thin wrap over `@relay/catalog.extractMarkdownHeadings` (empty queues if host missing).
- **ChangeLog thumbs:** `image_src` on `path_tree` markdown docs (stem/slug match at ingest). ChangeLog reads `row.image_src` — no `changelog-thumbs.json`.
- **Bots:** regenerate **`sitemap.xml`** / **`robots.txt`** with `python3 scripts/build-nav-index.py` before push. Do not ship `nav-index.txt`.
- **P2/P3 stay light on SSR:** gate catalog / interactive work with `isClientLive() === true`. Do **not** QUERY until the client is live.
- **Homepage `page.md` UTF-8 hazard (2026-07-22):** fleet WASM panics with `byte index … is not a char boundary` inside multi-byte chars (`—`, `“`, …) while hydrating `/`, then `[embed] boot failed RuntimeError: unreachable`. Keep **`page.md` ASCII-only** (no curly quotes, em dashes, arrows, æ). Hero image alts short/single-line. Bump `?v=ptmdN` when content must pierce CDN `max-age=3600`; do **not** use `Date.now()` in tip — breaks SSR compile. Root cause is Relay runtime byte-slice; content hygiene unblocks the parked site.

## Local park + pre-push smoke

Prefer the gateway park loop (mirrors **worktree**, including dirty tip, into a local bare):

```bash
# terminal A — ~/dev/relay/relay-gateway
./scripts/park-local.sh serve   # :9080 by default

# terminal B — this repo, or from gateway:
./scripts/park-local.sh smoke
# or: npm run park:smoke   /   ./scripts/ssr-smoke.sh
```

Expect **HTTP 200**, body contains **article markdown HTML** (e.g. `Welcome to Paradigm Threat` / `data-pt-article`), **TOC** when headings exist, `pt-changelog` used-class marker, and brand text. DirNav / ChangeLog **cards** still fill after hydrate.

Unit regressions (no live server): `./scripts/park-local.sh unit` from `relay-gateway/` (`@relay/*` tests + park Host/SSR cargo tests).

If SSR fails, parked GET `/` must return **500 Site shell / SSR failed**, not **Unknown Host** (gateway A1).

Do **not** treat rapid fleet deploy / `autossh` into production `:8080` as the primary tip debugger. Local park defaults to **`:9080`** so it does not collide with host Kubo.

## Related

- Local playbook: `docs/RELAY_PARK_HARDENING.md` · `relay-gateway/docs/PARADIGM_PARK_LOCAL.md`
- Host helpers: `relay-gateway/docs/CS_HOST_HELPERS.md`
- Gap log: `relay-gateway/docs/CLEVERSCRIPT_GAP_LOG.md` (G-005–G-007)
- Policy / SSR HTML cache: `relay-gateway/docs/RELAY_POLICY_AND_PERFORMANCE.md`
- QUERY + catalog warm (hydrate only): `relay-gateway/docs/QUERY_CLEVERSCRIPT.md`
- Runtime tip checklist: `relay-runtime/docs/CLEVERSCRIPT.md` §5.1
- Disabled components: `hooks/COMPONENTS_DISABLED.md`

*Last updated: 2026-09-12*

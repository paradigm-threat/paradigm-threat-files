# Linking and site paths (paradigm-threat-files)

## How the live site maps this repo

**https://paradigmthreat.net** serves **all** content from the **paradigm-threat-files** repository at the **site root**.

- Repo path = URL path (after the domain).
- Examples:
  - File `governance/war/investigations/cia-investigation.md` → `https://paradigmthreat.net/governance/war/investigations/cia-investigation.md`
  - File `history/mudflood/foo.png` → `https://paradigmthreat.net/history/mudflood/foo.png`

So **root-relative** links of the form `/governance/...`, `/history/...`, etc. are correct when writing for **paradigmthreat.net** (e.g. from timeline `content/` in paradigm-threat-timeline, or from internal docs that assume the site).

## Blog exception

Files under **`blog/`** still follow **`docs/BLOG.md`**: use **fully absolute** URLs (`https://paradigmthreat.net/...`) so posts work when viewed on GitHub, RSS, or other contexts where the site root is not implicit.

## Reader-facing articles (this repo)

For **essay-style** Markdown in *paradigm-threat-files* (parent-folder pages that point into `investigations/` dossiers): **first-person (*I*)** voice, **clinical-but-inspired** register, opening hook, lay citations, **bold** only for **emphasis** or **new terminology** (see ARTICLES), **heavy caveats in the dossier**, attribution footer, and discovery workflow — see **`docs/instructions/ARTICLES.md`**.

## Timeline cross-links

From **paradigm-threat-timeline** `content/*.md`, link to investigations with root-relative paths as above; see **paradigm-threat-timeline** `docs/CONTENT_MARKDOWN_STYLE.md` and `.cursor/rules/paradigm-threat-timeline.mdc`.

## Folder hubs (`page.md` + AutoIndex)

If you add **`page.md`** in a folder that also contains other files, the live site will **not** show the automatic file list for that URL. Append **`<AutoIndex sort="name-asc" />`** (and a short “Folder contents” section) at the bottom of `page.md` so nothing stays hidden. See **`docs/instructions/PAGE_MD_AUTOINDEX.md`**.

## Do not use the old `github.com/clevertree` URLs

The **`clevertree`** GitHub user account and its repositories are **no longer available**. Any link of the form `https://github.com/clevertree/...` (including `blob` / `tree` paths to **paradigm-threat-files**, **paradigm-threat-timeline**, Relay tooling repos, etc.) **will not resolve** for readers.

**When editing or adding links:**

- **Do not** introduce new links to `github.com/clevertree/...`.
- **Replace** reader-facing GitHub URLs with working targets where possible:
  - **This repo’s pages:** root-relative paths on the live site, e.g. `/science/nukes/investigations/example.md`, or full URLs `https://paradigmthreat.net/...` (see above and **`docs/BLOG.md`** for blog-only absolute URL rules).
  - **Timeline source or exports:** prefer paths on **https://paradigmthreat.net** (timeline app and deployed assets) or plain repo-relative paths in internal maintainer docs—not GitHub.

**Related:** Old **GitHub Pages** URLs under `https://clevertree.github.io/...` (e.g. timeline exports) depended on the same account; treat them as **dead** unless republished elsewhere. When migrating content, point to the current **paradigmthreat.net** (or other live) location instead.

*Finding stragglers:* from each repo root, `rg 'github\.com/clevertree|clevertree\.github\.io'` lists remaining occurrences to fix or replace.

## Dead third-party links (daily probe)

Relay markdown catalogs keep a **confirmed-dead** list at [`hooks/dead-urls.json`](../hooks/dead-urls.json). The daily checker does **not** edit article markdown. Park `ArticleView` marks matching `href`s with a visible `(dead)` suffix, `title` reason, and class `pt-dead-link` (SSR + hydrate). Lookup uses `@relay/path.lookupHttpHref` against a map loaded once via `cachedGet('/hooks/dead-urls.json')`.

- **Script:** [`scripts/check-dead-urls.mjs`](../scripts/check-dead-urls.mjs) (`npm run check-dead-urls`). Daily: [`scripts/check-dead-urls.daily.sh`](../scripts/check-dead-urls.daily.sh) (files + timeline). Probe state is gitignored (`hooks/dead-urls-state.json`).
- **Scope:** Relay catalogs with markdown links (this repo and paradigm-threat-timeline). The Next app marks the same lists in `MarkdownLink` / SEO HTML (TypeScript copy of `normalizeHttpHref`, no Relay WASM).
- **Promote:** NXDOMAIN / HTTP 404 / 410 on **two consecutive** runs (documented `github.com/clevertree` and `clevertree.github.io` are seeded immediately). Timeouts, 5xx, 403, 429 stay pending.
- **Write-only:** the script updates JSON; review `git diff hooks/dead-urls.json` and push when you want the list live.
- **Replacement sweep (author-requested):** [`DEAD_URL_REPLACEMENT_SWEEP.md`](DEAD_URL_REPLACEMENT_SWEEP.md) — true-match mirrors only; that is the only markdown href edit in this system.

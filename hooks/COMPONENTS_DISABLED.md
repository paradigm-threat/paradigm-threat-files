# CleverScript components — disabled / shipped

Hard custom markdown / site components are enabled incrementally on the thin park.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | **shipped** | `MarkdownRenderer overrides.AutoIndex`; styles in theme.yaml |
| DirectoryIndex | **shipped** | Missing `page.md` hub → Categories/Documents from warm `loadDirTree` |
| DirNav | **shipped** | Full tree via hydrate QUERY + `@relay/catalog.buildDirTree`; collapsed except current ancestors (`data-pt-open`); Collapse all / Expand to current; file cap 12; Feeling Lucky below tree; **outside `<main>`** so Reader View skips it |
| ChangeLog | **shipped** | Theme-aware card/feed; CSS radio tabs; default limit 8 on home |
| ThemeToggle | **shipped** | Post-`isClientLive` without SSR flicker |
| SiteChrome / Nav / footer | **shipped** | Live navbar + FontToggle; sticky Directory on lg |
| EmbedFile | **shipped** | PDF/`<embed>` via Pages mirror; `resolveAssetUrl` + articleRel |
| ChatRoom-in-md | stub | Override returns hidden stub until chat lands on tip |
| PopImage / gallery | **shipped** | `img`/`PopImage` overrides; gallery overlay; `#img=` hash; CSS used-class marker; **`-portrait` sibling** only when tip index (`__RELAY_PORTRAIT_SIBLINGS__` / Rust `@relay/image.portraitSiblingIfPresent`) says the blob exists |
| Floating dir / back-to-top | **shipped** | sticky `pt-dir-nav-lg`; back-to-top chevron in TTS dock |
| Article TTS dock | **shipped** | Vercel-parity: Play; Stop only after session (`sentences.length > 0`); seek + count; settings (`ml-auto`) Piper voice strip; no Site AI sparkle; Piper `@relay/tts` |
| VisTimeline / maps / Three | deferred | Own routes / timeline tip |
| Files `/timeline` subpath | deferred | External timeline host only |
| `expandMdComponents.jsx` | pass-through | Reserved |
| `rewriteAssets.jsx` | **shipped** | Relative assets → same-origin tip paths via `@relay/path.rewriteMarkdownAssetUrls` |
| Right TOC column | **shipped** | Content-derived: `extractMarkdownHeadings` → `DynamicIndex` props + heading `id` overrides; `#id` links; hash active; shown on home `page.md` and articles; CSS marker in `SiteChrome` for soft-nav |

Re-enable deferred rows one at a time using `hooks/CLEVERSCRIPT_TIP.md`, local `relay-gateway/scripts/park-local.sh serve` + `smoke` (or `./scripts/ssr-smoke.sh`), and `park-local.sh unit` before fleet push. See `docs/RELAY_PARK_HARDENING.md`.

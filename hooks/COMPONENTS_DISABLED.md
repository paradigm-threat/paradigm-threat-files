# CleverScript components — disabled / shipped

Hard custom markdown / site components are enabled incrementally on the thin park.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | **shipped** | `MarkdownRenderer overrides.AutoIndex`; styles in theme.yaml |
| DirNav | **shipped** | Nested tree via `@relay/catalog.buildDirTree` (capped depth/files); FeelingLucky in aside |
| ChangeLog | **shipped** | Theme-aware card/feed; CSS radio tabs; default limit 8 on home |
| ThemeToggle | **shipped** | Post-`isClientLive` without SSR flicker |
| SiteChrome / Nav / footer | **shipped** | Live navbar + FontToggle; BackToTop; sticky Directory on lg |
| EmbedFile | disabled | |
| ChatRoom-in-md | stub | Override returns hidden stub until chat lands on tip |
| PopImage / gallery | **shipped** | `img`/`PopImage` overrides; gallery overlay; `#img=` hash; CSS used-class marker |
| Floating dir / back-to-top | **shipped** | sticky `pt-dir-nav-lg`; `BackToTop` after scroll |
| Article TTS dock | **shipped** | `@relay/tts` Piper synthesize + AudioPlayer; Play/Pause/Stop |
| VisTimeline / maps / Three | deferred | Own routes / timeline tip |
| Files `/timeline` subpath | deferred | External timeline host only |
| `expandMdComponents.jsx` / `rewriteAssets.jsx` | pass-through | Re-enable rewrite when asset URL policy is stable |
| Right TOC column | **shipped** | `DynamicIndex` — polls `.pt-article-body` headings; sticky `pt-toc-lg` |

Re-enable deferred rows one at a time using `hooks/CLEVERSCRIPT_TIP.md` + `./scripts/ssr-smoke.sh`.

# CleverScript components — disabled / shipped

Hard custom markdown / site components are enabled incrementally on the thin park.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | **shipped** | `MarkdownRenderer overrides.AutoIndex`; styles in theme.yaml |
| DirNav | **shipped** | Nested tree via `@relay/catalog.buildDirTree` (capped depth/files); FeelingLucky in aside |
| ChangeLog | **shipped** | Theme-aware card/feed; CSS radio tabs; default limit 8 on home |
| ThemeToggle | **shipped** | Post-`isClientLive` without SSR flicker |
| SiteChrome / Nav / footer | **shipped** | Live navbar + FontToggle; sticky Directory on lg |
| EmbedFile | **shipped** | PDF/`<embed>` via Pages mirror; `resolveAssetUrl` + articleRel |
| ChatRoom-in-md | stub | Override returns hidden stub until chat lands on tip |
| PopImage / gallery | **shipped** | `img`/`PopImage` overrides; gallery overlay; `#img=` hash; CSS used-class marker |
| Floating dir / back-to-top | **shipped** | sticky `pt-dir-nav-lg`; back-to-top chevron in TTS dock |
| Article TTS dock | **shipped** | Old-site style: indigo play/pause circle, stop, seek count; Piper `@relay/tts` |
| VisTimeline / maps / Three | deferred | Own routes / timeline tip |
| Files `/timeline` subpath | deferred | External timeline host only |
| `expandMdComponents.jsx` | pass-through | Reserved |
| `rewriteAssets.jsx` | **shipped** | Relative assets → GitLab Pages via `@relay/path.rewriteMarkdownAssetUrls` |
| Right TOC column | **shipped** | `DynamicIndex`: scroll-spy, hash jump, `data-toc-ignore`, mobile card + sticky lg; CSS marker in `SiteChrome` for home soft-nav |

Re-enable deferred rows one at a time using `hooks/CLEVERSCRIPT_TIP.md` + `./scripts/ssr-smoke.sh`.

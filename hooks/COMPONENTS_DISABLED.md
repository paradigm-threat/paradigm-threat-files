# CleverScript components — disabled / shipped

Hard custom markdown / site components are enabled incrementally on the thin park.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | **shipped** | `MarkdownRenderer overrides.AutoIndex`; tree polish via DirNav |
| ChangeLog | **shipped** | CSS radio tabs; nav-index dates; card/feed styling vs live site |
| ThemeToggle | **shipped** | Post-`isClientLive` without SSR flicker |
| SiteChrome / Nav / footer | **shipped** | Live nav set + wordmark; Relay footer attribution |
| DirNav | **shipped** | Flat index from nav-index (nested tree deferred — CS dynamic keys) |
| EmbedFile | disabled | |
| ChatRoom-in-md | stub | Override returns hidden stub until chat lands on tip |
| PopImage / gallery | disabled | After thumbs; hash gallery like live |
| VisTimeline / maps / Three | deferred | Own routes / timeline tip |
| Files `/timeline` subpath | deferred | External timeline host only |
| `expandMdComponents.jsx` / `rewriteAssets.jsx` | pass-through | Re-enable rewrite when asset URL policy is stable |
| Right TOC column | deferred | No CS TOC hook yet |

Re-enable deferred rows one at a time using `hooks/CLEVERSCRIPT_TIP.md` + `./scripts/ssr-smoke.sh`.

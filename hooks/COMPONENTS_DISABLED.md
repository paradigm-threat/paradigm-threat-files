# CleverScript components — disabled for first wave

Hard custom markdown / site components are **not** wired yet. Plain `@clevertree/markdown` only.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | overrides | `MarkdownRenderer overrides.AutoIndex` (needs runtime with overrides support) |
| ChangeLog | stripped | Override returns empty stub |
| EmbedFile | disabled | |
| ChatRoom-in-md | stripped | Override returns empty stub |
| PopImage / gallery | disabled | Use plain `img`; RelayImage later |
| VisTimeline / maps / Three | deferred | Host-native later |
| Files `/timeline` subpath | deferred | Timeline on its own subdomain |

Re-enable one-by-one after layout/article/nav smoke is green.

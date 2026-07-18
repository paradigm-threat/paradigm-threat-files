# CleverScript components — disabled for first wave

Hard custom markdown / site components are **not** wired yet. Plain `@clevertree/markdown` only.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | overrides | `MarkdownRenderer overrides.AutoIndex` |
| ChangeLog | overrides | Thin recent-blog list (`hooks/client/components/ChangeLog.jsx`) |
| EmbedFile | disabled | |
| ChatRoom-in-md | stub | Override returns hidden stub until chat lands |
| PopImage / gallery | disabled | Use plain `img`; RelayImage later |
| VisTimeline / maps / Three | deferred | Host-native later |
| Files `/timeline` subpath | deferred | Timeline on its own subdomain |

Re-enable one-by-one after layout/article/nav smoke is green.

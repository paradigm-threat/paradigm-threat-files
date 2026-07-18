# CleverScript components — disabled for first wave

Hard custom markdown / site components are **not** wired yet. Plain `@clevertree/markdown` only.

| Component | Status | Notes |
|-----------|--------|-------|
| AutoIndex | deferred | Tag left inert; DirNav covers index. Expansion corrupted SSR text once. |
| ChangeLog | stripped | `expandMdComponents` removes the tag |
| EmbedFile | disabled | |
| ChatRoom-in-md | stripped | Self-closing tag only; attributed tags still inert |
| PopImage / gallery | disabled | Use plain `img`; RelayImage later |
| VisTimeline / maps / Three | deferred | Host-native later |
| Files `/timeline` subpath | deferred | Timeline on its own subdomain |

Re-enable one-by-one after layout/article/nav smoke is green.

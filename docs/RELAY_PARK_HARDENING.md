# Relay park hardening (paradigm-threat-files)

Local-first SSR / tip hardening for **`relay.paradigmthreat.net`**. Full playbook:

- Gateway: `relay-gateway/docs/PARADIGM_PARK_LOCAL.md` (sibling repo under `~/dev/relay/relay-gateway`)
- Host helpers (CS → Rust): `relay-gateway/docs/CS_HOST_HELPERS.md`
- Portrait / PopImage tip index: `relay-gateway/docs/PORTRAIT_SIBLING_DEPLOY.md`
- Tip rules: [`hooks/CLEVERSCRIPT_TIP.md`](../hooks/CLEVERSCRIPT_TIP.md)
- Component tests: `relay-runtime/docs/CLEVERSCRIPT_COMPONENT_TESTING.md`

## Pre-push regression gate (required)

Run **before** fleet tip push. Catches CleverScript missing-prop throws (LiveChat) and Directory wrap/contrast paint slips.

```bash
# 1) Layer-1 CleverScript + park Host (no browser)
# from ~/dev/relay/relay-gateway/
./scripts/park-local.sh unit
# includes: livechat_stubs, dirnav_expand, navlink_props_eval, paradigm_files_render, …

# 2) Live SSR + hydrate paint
./scripts/park-local.sh serve   # http://127.0.0.1:9080  (other terminal)

# from this repo (or park-local smoke, which also runs hydrate)
npm run park:smoke              # SSR markers: LiveChat host, no error boundary, wrap/contrast tokens
npm run park:hydrate-smoke      # system Chrome via playwright-core: chat mount + Directory wrap
# equivalent: ./scripts/park-local.sh smoke   # SSR + hydrate together
```

| Layer | Command | Catches |
|-------|---------|---------|
| Tip lint (pre-commit) | `npm run check-unsafe-cs-props` | Bare `props.origin` / stub member reads / `=== undefined` |
| Layer-1 CS | `park-local.sh unit` → `livechat_stubs` | LiveChat/ChatApp mount without optional props |
| Layer-2 SSR | `npm run park:smoke` | Missing chat host, error-boundary HTML, wrap/contrast CSS tokens |
| Layer-3 hydrate | `npm run park:hydrate-smoke` | Post-hydrate error banner, LiveChat DOM, Directory `white-space` / `overflow-wrap` |

Do **not** use Playwright for DirNav expand / Home clicks — those stay in `invoke_handler` cargo tests.

**Local perf / chrome toggles:** theme and font must flip via `html` class / `data-font` **without** CleverScript `setState` (full shell remount). After hydrate, click theme — article DOM must stay put. See [`hooks/CLEVERSCRIPT_TIP.md`](../hooks/CLEVERSCRIPT_TIP.md) § Render rarity.

**Catalog loading:** DirNav / ChangeLog / article lists are **hydrate-only (P2)** — do not SSR them into the HTML cache. Optimal path is placeholders on SSR + QUERY after `isClientLive()` (tip `loadArticles.jsx` module-warm). Normative verdict + cache table: [`hooks/CLEVERSCRIPT_TIP.md`](../hooks/CLEVERSCRIPT_TIP.md) § SSR priority tiers.

Content go-live after local green: push GitLab + Relay remotes per [`GIT_REMOTE_STRATEGY.md`](./GIT_REMOTE_STRATEGY.md). Do **not** use fleet deploy as the primary tip debugger.

## Tip CI

GitLab CI runs the **tip lint matrix** only (no park gateway / no cargo). Full Layer-1–3 stays on `park-local` before push. See [`.gitlab-ci.yml`](../.gitlab-ci.yml).

*Last updated: 2026-10-17*

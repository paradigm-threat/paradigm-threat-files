# CleverScript tip hygiene (paradigm-threat-files)

Hard rules for **SSR site-shell** hooks on this repo. Breaking them has taken the parked site offline.

## Language subset

- **Always brace** `for`, `while`, and `if` bodies — even one-liners.
- No `parseInt`, `Number`, `Date`, or `Math.random`.
- **No bare `undefined` in JSX** — branch into separate elements instead of `prop={cond ? x : undefined}`.
- **No unary minus literals** in return positions (e.g. `return -1`); compare directly or use positive bounds.
- Prefer **`propOr` / try-catch** for missing props.
- **CSS radio tabs** for ChangeLog (no `setState` tab state — it remounts the article).
- Nest tab radios in `<label>` (no `htmlFor`).

## SSR data

- **Never** `fetch` / QUERY the **same Host** during site-shell SSR — it deadlocks the gateway worker.
- Prefer on-tree blobs: **`nav-index.txt`**, sidecar JSON, static catalogs.
- Regenerate nav index before push: `python3 scripts/build-nav-index.py` (writes optional `_updated` ISO column).

## Pre-push smoke

From a machine with the repo synced locally and relay-gateway on `:8080`:

```bash
./scripts/ssr-smoke.sh
```

Expect **HTTP 200**, body contains `pt-changelog` and `Paradigm Threat` (brand marker).

If ChangeLog parse breaks, parked GET `/` must return **500 Site shell / SSR failed**, not **Unknown Host** (gateway A1).

## Related

- Gap log: `relay-gateway/docs/CLEVERSCRIPT_GAP_LOG.md` (G-005, G-006)
- Disabled components: `hooks/COMPONENTS_DISABLED.md`

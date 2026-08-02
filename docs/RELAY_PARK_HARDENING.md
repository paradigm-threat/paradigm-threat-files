# Relay park hardening (paradigm-threat-files)

Local-first SSR / tip hardening for **`relay.paradigmthreat.net`**. Full playbook:

- Gateway: `relay-gateway/docs/PARADIGM_PARK_LOCAL.md` (sibling repo under `~/dev/relay/relay-gateway`)
- Host helpers (CS → Rust): `relay-gateway/docs/CS_HOST_HELPERS.md`
- Tip rules: [`hooks/CLEVERSCRIPT_TIP.md`](../hooks/CLEVERSCRIPT_TIP.md)

## Quick loop

```bash
# Terminal A — from relay-gateway/
./scripts/park-local.sh serve   # http://127.0.0.1:9080 (avoids Kubo :8080)

# Terminal B — from this repo (or park-local smoke)
npm run park:smoke
# equivalent: ./scripts/ssr-smoke.sh
```

Unit regressions (no live server):

```bash
# from relay-gateway/
./scripts/park-local.sh unit
```

Content go-live after local green: push GitLab + Relay remotes per [`GIT_REMOTE_STRATEGY.md`](./GIT_REMOTE_STRATEGY.md). Do **not** use fleet deploy as the primary tip debugger.

*Last updated: 2026-08-02*

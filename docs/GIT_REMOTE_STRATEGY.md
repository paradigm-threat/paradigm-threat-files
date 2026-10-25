# Git remotes — single `main` (GitLab + Relay)

**Date:** 2026-07-21  
**Purpose:** One shared tip everywhere. GitLab is forge source of truth; Relay **`iad1` / `ord1` / `hkg1`** serve the same `main`.

---

## Roles

| Surface | Branch | Role |
|---------|--------|------|
| **GitLab** (`gitlab`) | **`main`** | Forge backup / MR / CI — **source of truth** for history. |
| **Relay** (`iad1`, `ord1`, `hkg1`) | **`main`** | Production for `paradigmthreat.net` content. Must match GitLab `main`. |
| **Local default checkout** | **`main`** | Day-to-day commits. Tracks `gitlab/main` (or any remote `main`). |

Do **not** use a long-lived `gitlab` work branch or `relay-publish` cherry-pick branch. Those were split-brain workarounds (retired 2026-07-21).

---

## Day-to-day

```bash
git checkout main
git pull --ff-only   # from gitlab/main (or your upstream)

# Catalog repos with publish_origin=iad1 (paradigm-threat-files, paradigm-threat-timeline, …):
git push iad1 HEAD:main
git push gitlab HEAD:main
# hkg1/ord1: peer notify + catalog sync — optional direct push
```

**Why iad1 before GitLab:** startup catalog sync on replicas pulls from GitLab (forge). If GitLab is pushed while iad1 still lags, hkg1/ord1 can land **ahead of the publish origin** until iad1 catches up — Observer flags that as a mesh anomaly.

For repos without a dedicated publish origin, forge-first is fine:

```bash
git push gitlab HEAD:main
git push iad1 HEAD:main && git push hkg1 HEAD:main && git push ord1 HEAD:main
```

**If a Relay push hangs** (often a dead Spot or slow `post-receive` on an old binary):

1. Push **one remote at a time** with a client timeout (e.g. `timeout 90 git push iad1 HEAD:main`).
2. Check `git ls-remote <remote> refs/heads/main` — if the tip already matches `HEAD`, kill the hung client; the pack was accepted.
3. Prefer **`ord1` / `hkg1`** if **`iad1`** is unreachable; then repair iad1.
4. Mesh ops / env timeouts: relay-gateway **`docs/RELAY_MESH_OPS.md`**.

*Validated: non-blocking post-receive deploy on iad1/ord1/hkg1.*

**Hard rules**

1. GitLab, iad1, ord1, and hkg1 **`main`** tips must stay identical (or FF-compatible from the same spine).
2. **Never** dual cherry-pick onto unrelated histories.
3. **Never** land long-lived commits on only one Relay.
4. **Never** force-push Relay `main` unless the author explicitly orders it (prefer bare reclone from GitLab if history must be replaced).

**Preflight**

```bash
# After push — confirm mesh caught up (success / partial / fail):
relay-gateway/scripts/relay-push-and-wait.sh iad1 HEAD:main

# Or poll manually:
curl -sS -X POST 'https://iad1.relaygateway.net/api/sync/mesh/paradigm-threat-files?branch=main&sha=$(git rev-parse HEAD)' | jq '.mesh_sync.status'
```

Publisher post-receive writes notify outcomes to **`/opt/relay/state/post_push_sync/<repo>.json`** on iad1 (ok/fail per peer, HTTP status, error body). Check journal for `peer notify rejected` if sync stays partial.

```bash
git fetch --all
test "$(git rev-parse HEAD)" = "$(git rev-parse gitlab/main)" || echo "BLOCK: update local main from gitlab first"
git merge-base --is-ancestor iad1/main HEAD || echo "BLOCK: rebase/FF onto production tip first"
```

---

## Catalog / shallow clones

Relay **`sync-relay-catalog.sh`** defaults to **full** bare clones (`RELAY_CATALOG_CLONE_DEPTH=0`) for thin repos. Shallow (`=1`) is opt-in for free-tier stub forges only — see relay-master README / `RELAY_TRUST_AND_BOOTSTRAP.md`.

Catalog entries for this repo point at **GitLab** with the GitLab-spine trusted root (not the old Relay orphan cut).

## Media / IPFS (do not repeat the stub graft)

This repo keeps **real binaries** at public paths. **`assets.manifest.json`** is the IPFS **index**, not permission to replace `.png`/`.jpg` with `relay-ipfs-v1` text. Canon: [`MEDIA_AND_IPFS.md`](MEDIA_AND_IPFS.md). Never FF/graft a thin Relay tip onto this fat `main`.

---

## Assistant / agent defaults

**Canon:** [`AGENTS.md`](../AGENTS.md) (git push order, server-side mesh gate on iad1, dates, doc routing). Chat live-publish: [`CHAT_REQUEST_RESPONSE.md`](CHAT_REQUEST_RESPONSE.md) §6.

---

## Heal history (2026-07-21)

Split-brain between GitLab’s long line and a broken/shallow Relay cut was repaired by:

1. Fast-forwarding GitLab `main` onto the GitLab spine tip.
2. Bare-repo swap on each Relay from GitLab (full history), keeping on-box backups.
3. Retiring `relay-publish` and the dual-branch publish ritual.

Archive tags (examples): `archive/gitlab-pre-relay-align-2026-07-21`, `archive/pre-unify-2026-07-21-gitlab-spine`.

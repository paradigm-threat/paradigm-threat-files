# Git remotes — single `main` (GitLab + Relay)

**Date:** 2026-07-21  
**Purpose:** One shared tip everywhere. GitLab is forge source of truth; Relay `dfw1` / `hkg1` / `lon1` serve the same `main`.

---

## Roles

| Surface | Branch | Role |
|---------|--------|------|
| **GitLab** (`gitlab`) | **`main`** | Forge backup / MR / CI — **source of truth** for history. |
| **Relay** (`dfw1`, `hkg1`, `lon1`) | **`main`** | Production for `paradigmthreat.net` content. Must match GitLab `main`. |
| **Local default checkout** | **`main`** | Day-to-day commits. Tracks `gitlab/main` (or any remote `main`). |

Do **not** use a long-lived `gitlab` work branch or `relay-publish` cherry-pick branch. Those were split-brain workarounds (retired 2026-07-21).

---

## Day-to-day

```bash
git checkout main
git pull --ff-only   # from gitlab/main (or your upstream)

# Commit as usual, then push forge first:
git push gitlab HEAD:main

# Go live — same tip to all Relays:
git push dfw1 HEAD:main
git push hkg1 HEAD:main
git push lon1 HEAD:main
```

Or, when going live in one step after the commit is on `main`:

```bash
git push gitlab HEAD:main
git push dfw1 HEAD:main && git push hkg1 HEAD:main && git push lon1 HEAD:main
```

**Hard rules**

1. All four remotes’ `main` tips must stay identical (or FF-compatible from the same spine).
2. **Never** dual cherry-pick onto unrelated histories.
3. **Never** land long-lived commits on only one Relay.
4. **Never** force-push Relay `main` unless the author explicitly orders it (prefer bare reclone from GitLab if history must be replaced).

**Preflight**

```bash
git fetch --all
test "$(git rev-parse HEAD)" = "$(git rev-parse gitlab/main)" || echo "BLOCK: update local main from gitlab first"
git merge-base --is-ancestor dfw1/main HEAD || echo "BLOCK: rebase/FF onto production tip first"
```

---

## Catalog / shallow clones

Relay **`sync-relay-catalog.sh`** defaults to **full** bare clones (`RELAY_CATALOG_CLONE_DEPTH=0`) for thin repos. Shallow (`=1`) is opt-in for free-tier stub forges only — see relay-master README / `RELAY_TRUST_AND_BOOTSTRAP.md`.

Catalog entries for this repo point at **GitLab** with the GitLab-spine trusted root (not the old Relay orphan cut).

---

## Assistant / agent defaults

When the author asks to **commit and push**:

1. Ensure checkout is **`main`**.
2. `git push gitlab HEAD:main`.
3. If they asked to **go live** / **push remotes** / **push everything live**: push the **same** tip to `dfw1` / `hkg1` / `lon1` **`main`**.
4. Do **not** force-push Relay `main` unless the author explicitly orders it.

Canon pointer for chat live-publish: [`docs/CHAT_REQUEST_RESPONSE.md`](CHAT_REQUEST_RESPONSE.md) §6.

---

## Heal history (2026-07-21)

Split-brain between GitLab’s long line and a broken/shallow Relay cut was repaired by:

1. Fast-forwarding GitLab `main` onto the GitLab spine tip.
2. Bare-repo swap on each Relay from GitLab (full history), keeping on-box backups.
3. Retiring `relay-publish` and the dual-branch publish ritual.

Archive tags (examples): `archive/gitlab-pre-relay-align-2026-07-21`, `archive/pre-unify-2026-07-21-gitlab-spine`.

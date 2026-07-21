# Git remotes — Relay `main` vs GitLab `gitlab` branch

**Date:** 2026-07-18  
**Purpose:** Stop treating GitLab `main` and Relay `main` as the same tip. That false identity caused repeated split-brain (Jedi ship on GitLab / hkg1 / lon1 while dfw1 moved on without it).

---

## Roles

| Surface | Branch | Role |
|---------|--------|------|
| **Relay** (`dfw1`, `hkg1`, `lon1`) | **`main`** | **Production / canonical live tree** for `paradigmthreat.net` content. Site + chat resolve from here. |
| **GitLab** (`gitlab`) | **`gitlab`** | **Backup / MR / CI mirror** of author + agent work. **Not** the live site tip. |
| **Local default checkout** | **`gitlab`** | Day-to-day commits. Tracks `gitlab/gitlab`. |

Do **not** push day-to-day work to `gitlab/main`. Leave GitLab’s `main` alone unless deliberately syncing or retiring it.

---

## Day-to-day (enough to avoid *accidental* dual-main)

```bash
# Stay on the GitLab work branch
git checkout gitlab
git pull --ff-only   # from gitlab/gitlab

# Commit as usual, then:
git push gitlab HEAD:gitlab
```

That alone **prevents** “I pushed to GitLab `main` and thought relays updated.” Relays do **not** auto-follow the `gitlab` branch.

---

## Publish to production (required when content must go live)

Relays only move when you **intentionally** update **`main`** on Relay remotes.

```bash
git fetch dfw1
git fetch hkg1
git fetch lon1
git fetch gitlab

# Integrate latest production tip into your work branch first
git checkout gitlab
git rebase dfw1/main          # or: merge dfw1/main
# fix conflicts, re-test, commit if needed

# Push production
git push dfw1 HEAD:main
git push hkg1 HEAD:main
git push lon1 HEAD:main

# Mirror the same tip to GitLab’s backup branch
git push gitlab HEAD:gitlab
```

**Hard rules**

1. **Never** `git push` the same local tip to `gitlab/main` and Relay `main` and assume they share history.
2. **Never** cherry-pick the same change onto two unrelated tips as a long-term sync strategy.
3. **Never** land feature commits only on one Relay (e.g. CleverScript on dfw1 only) without first integrating into the shared `main` line you will push to **all** relays.
4. Before multi-relay push, tips must be **fast-forward compatible** with `dfw1/main` (or you deliberately force with author approval).

**Preflight**

```bash
git fetch --all
git merge-base --is-ancestor dfw1/main HEAD || echo "BLOCK: rebase onto dfw1/main first"
```

---

## Is renaming the GitLab branch enough?

**Necessary, not sufficient.**

| Helps | Still required |
|-------|----------------|
| Stops confusing GitLab `main` with Relay `main` | Always **rebase/merge onto Relay `main` before** production push |
| Makes “push to GitLab” mean `gitlab/gitlab` | Push **all three** relays together after rebase |
| Local checkout `gitlab` matches the backup remote | No relay-only forks; no cherry-pick dual history |

Without the publish ritual, work on `gitlab` never reaches the live site — and work done only on Relay `main` never reaches GitLab.

---

## Assistant / agent defaults

When the author asks to **commit and push**:

1. Ensure checkout is **`gitlab`** (or create/update it from current work).
2. `git push gitlab HEAD:gitlab`.
3. If they asked to **go live** / **push remotes** / **push everything live**: rebase onto `dfw1/main`, then push `dfw1` / `hkg1` / `lon1` **`main`**, then refresh `gitlab/gitlab`.
4. Do **not** force-push Relay `main` unless the author explicitly orders it.

Canon pointer for chat live-publish: [`docs/CHAT_REQUEST_RESPONSE.md`](CHAT_REQUEST_RESPONSE.md) §6.

---

## One-time setup (already applied 2026-07-18)

```bash
git checkout -B gitlab HEAD
git push -u gitlab HEAD:gitlab
# local branch gitlab tracks gitlab/gitlab
```

Optional: point local `main` at Relay for comparison only:

```bash
git branch -u dfw1/main main
```

Do not use local `main` as the daily work branch unless explicitly syncing production.

---

## Ancestry heal (2026-07-21)

Relay `main` and the old GitLab tip had **unrelated roots** (Relay reborn ~2026-07-18; GitLab kept the long March–July line). Cherry-pick was required for every go-live.

**Heal (careful):**

1. Tag archive: `archive/gitlab-pre-relay-align-2026-07-21` → old `gitlab/gitlab` tip (`86b27490`). Also keep `gitlab/main` (still on the old line at Jedi ship) as a second archive ref.
2. Land this strategy doc + remotes Cursor rule + disabled `.gitlab-ci.yml` onto Relay `main` (they were GitLab-only).
3. Force-push **only** `gitlab/gitlab` to the new Relay-aligned tip. **Do not** force-push Relay `main` or `gitlab/main`.

After heal, `git merge-base HEAD dfw1/main` must succeed on the daily `gitlab` branch. Go-live returns to rebase/FF onto `dfw1/main`, then push all three Relays, then `git push gitlab HEAD:gitlab`.


# Media and IPFS — paradigm-threat-files (fat repo)

**Date:** 2026-07-22  
**Status:** Normative for this repository.

## What this repo is

**paradigm-threat-files** is a **fat** content repo: **real binaries** live at their public paths (`.png`, `.jpg`, `.pdf`, `.m4a`, …). Readers and Relay GET serve those Git blobs.

**IPFS** is an **index + cache/CDN lane**, not a replacement for files in Git:

| Artifact | Role |
|----------|------|
| **`assets.manifest.json`** | Canonical **IPFS file index** (path → CID, content-type, sha256, bytes). |
| **`.relay/assets/{path}.ipfs`** | Optional per-path pointer files (text). Used by thin/hosted layouts — **not** required when the binary is in Git. |
| **Public path `foo.png`** | Must be a **real binary** (or absent). **Never** a `relay-ipfs-v1` text stub. |

Thin / stub-at-extension history belongs only in a separate **`-thin`** forge (see `thin-migrate/`) or Relay docs for hosted free-tier stubs — **not** in this tree’s `main`.

## Forbidden (do not commit)

1. **`relay-ipfs-v1` text** at any path with a media/binary extension (`.png`, `.jpg`, `.JPG`, `.pdf`, `.m4a`, …) or extensionless binary assets.
2. **History rewrites** or “match Relay tip tree” grafts that copy a **thin** tip onto this fat spine.
3. Enabling GET **`sources: ["inline"]`** for this repo (inline = read stub *at the public path*).

## Required checks before push

```bash
# Must print nothing
git grep -l '^relay-ipfs-v1' HEAD -- \
  '*.png' '*.jpg' '*.jpeg' '*.JPG' '*.JPEG' '*.webp' '*.gif' \
  '*.pdf' '*.mp4' '*.m4a' '*.webm' '*.mp3' '*.wav' '*.svg' '*.ico' || true
```

If that lists paths, restore binaries from a fat archive (e.g. `archive/gitlab-pre-relay-align-2026-07-21`) — do **not** leave stubs.

## GET hook

`hooks/server/get.cs` prefers **Git raster/bytes**, then **`assets.manifest.json`** only (`sources: ["manifest"]`). No inline stubs.

## Related

- Relay target layout (central `.ipfs` + manifest): `relay-gateway/docs/RELAY_IPFS.md`
- Remotes: [`GIT_REMOTE_STRATEGY.md`](GIT_REMOTE_STRATEGY.md)

# Blog — paradigm-threat-files

Blog posts live in `blog/` and follow the naming convention `YYYY-MM-DD-slug.md`. They serve as changelogs and highlights for the Paradigm Threat project.

## URL and image links — always fully absolute

**All links and images in blog files must use fully absolute URLs:**

- **Links:** `https://paradigmthreat.net/path/to/article`
- **Images:** `https://paradigmthreat.net/media/...` or `https://paradigmthreat.net/path/to/image.png`

Do **not** use:
- Relative paths (`../influence/...`, `./image.png`)
- Root-relative paths (`/influence/...`) — use `https://paradigmthreat.net/influence/...` instead

This ensures links work when viewed in GitHub, RSS, or any context.

## Adding new blog entries

Create new posts in `blog/` with the naming convention `YYYY-MM-DD-slug.md`. Run `npm run generate-index` (or the pre-commit hook will run it) to include the new file in `index.json`.

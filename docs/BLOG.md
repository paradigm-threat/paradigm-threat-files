# Blog — paradigm-threat-files

Blog posts live in `blog/` and follow the naming convention `YYYY-MM-DD-slug.md`. They serve as changelogs and highlights for the Paradigm Threat project.

## URL and image links (blog only)

**The rules below apply only to files in `blog/`.** Other content (e.g. `influence/`) may use relative paths.

**In blog files, use fully absolute URLs:**

- **Links:** `https://paradigmthreat.net/path/to/article`
- **Images:** `https://paradigmthreat.net/media/...` or `https://paradigmthreat.net/path/to/image.png`

Do **not** use in blog files:
- Relative paths (`../influence/...`, `./image.png`)
- Root-relative paths (`/influence/...`) — use `https://paradigmthreat.net/influence/...` instead

This ensures links work when blog posts are viewed in GitHub, RSS, or any context.

**Site path map (files repo at URL root):** See [`docs/LINKING_AND_SITE_PATHS.md`](LINKING_AND_SITE_PATHS.md) — how `paradigmthreat.net` serves this repository and when to use root-relative vs absolute URLs outside `blog/`.

## Adding new blog entries

Create new posts in `blog/` with the naming convention `YYYY-MM-DD-slug.md`. Run `npm run generate-index` (or the pre-commit hook will run it) to include the new file in `index.json`.

**`index.json` `_updated` for blog:** For files matching `blog/YYYY-MM-DD-*.md`, `scripts/generate-index.py` sets `_updated` to that calendar date at **12:00 UTC** (not filesystem mtime), so the site blog list (`AutoIndex` with `format="blog"`) shows the correct day per post after checkouts or bulk regen. Files like `blog/page.md` still use mtime.

**Cover all changed repos and list all changes.** Before writing a blog entry:

1. **Check git for all three paradigm-threat* repos** — **paradigm-threat-timeline**, **paradigm-threat-files**, **paradigm-threat-site** — for commits and file changes since the **last blog entry** (by date: the most recent `YYYY-MM-DD-*.md` in `blog/` before this one).
2. **Start each repo section with a short summary (one paragraph)** that describes all updates in that repo in a few sentences; then list each new or updated item with a **link** — timeline events use `https://paradigmthreat.net/timeline/evt-<id>`, other content uses `https://paradigmthreat.net/<path>` (no `.md`). Group by repo: **paradigm-threat-timeline**, **paradigm-threat-files**, **paradigm-threat-site**. Omit a repo section only if it had no changes since the last post.
3. When only one repo changed, a single section is fine. When two or three changed, the entry must have a section per changed repo, each beginning with a one-paragraph summary of that repo's updates, then links to all new/updated content.

## Topic hashtags

End every blog post with relevant topic hashtags as links. Each tag links to the site search so readers can find related content.

**Format:** Add a line at the end with linked topics:
```markdown
---
*Topics:* [#conspiracy](https://paradigmthreat.net/search/conspiracy) · [#history](https://paradigmthreat.net/search/history) · [#mars](https://paradigmthreat.net/search/mars)
```

**Rules:**
- Use only **directory names** from the repo: `influence`, `history`, `science`, `cosmos`, `governance`, `events`, and subdirs like `conspiracy`, `stolen_credit`, `predictive_programming`, `religion`, `mars`, `geoengineering`, `war`, etc.
- Do **not** use `paradigm*`, `project*`, or other meta-terms
- Use path-based URLs: `https://paradigmthreat.net/search/[topic]` (e.g. `/search/conspiracy`, `/search/stolen_credit`)
- Avoid tags that don't exist as folders or file names

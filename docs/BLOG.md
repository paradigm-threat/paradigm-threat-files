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

### Git history (required before drafting)

**Always** walk **git history in all three repos** since the **previous** dated blog post. Do **not** rely on chat memory or a partial mental list of what changed — commits in **paradigm-threat-files** (investigations, perspective, censorship), **paradigm-threat-timeline** (chapter edits, cross-links), and **paradigm-threat-site** (redirects, image API, TTS) are easy to miss otherwise.

1. **Identify the cutoff** — Pick the **previous** post: the newest `blog/YYYY-MM-DD-*.md` whose embedded date is **before** the new file you are writing (ignore `blog/page.md`). Example: to add `2026-04-03-…md`, the previous post might be `2026-03-30-…md`.
2. **Map cutoff → `git log`** — Let `PREV` be the `YYYY-MM-DD` from that filename. List commits **after** that calendar day (i.e. starting the morning of the next day). Portable pattern:
   ```bash
   # PREV = date from previous blog filename, e.g. 2026-03-30 → use NEXT_DAY below
   NEXT_DAY=2026-03-31
   cd /path/to/paradigm-threat-files   && git log --oneline --since="${NEXT_DAY}"
   cd /path/to/paradigm-threat-timeline && git log --oneline --since="${NEXT_DAY}"
   cd /path/to/paradigm-threat-site     && git log --oneline --since="${NEXT_DAY}"
   ```
   Adjust paths to your checkout layout. If nothing shows, widen slightly (e.g. same `PREV` with `git log -30 --oneline` and scan) or use `git log --since="${PREV}"` and filter manually — the rule is **no skipped commits** in the window you mean to summarize.
3. **Fold every meaningful commit** into the draft (grouped by repo). If something was already blogged, you can skip it; if the prior post omitted work that landed before its filename date, either **amend** that older post or **mention the catch-up** in the new one.

**Cover all changed repos and list all changes.** After git review:

1. **Check git for all three paradigm-threat* repos** — **paradigm-threat-timeline**, **paradigm-threat-files**, **paradigm-threat-site** — for commits and file changes since the **last blog entry** (by date: the most recent `YYYY-MM-DD-*.md` in `blog/` before this one), using the procedure above.
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
- **Repo `Keywords:` lines** (investigations, notes, blog): use **PascalCase** tokens with **no hyphens and no underscores** inside the tag (e.g. `#JadeHelm`, `#StolenCredit`, `#PredictiveProgramming`). This matches the static index parser and `npm run check-keywords`. Social platforms may differ; the repo convention is stricter than Instagram’s underscore allowance.

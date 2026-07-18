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

### Images in blog posts

Blog roundups should **illustrate** major lanes—not only link to them. Embed **`https://paradigmthreat.net/...`** images the same way articles do:

- **Hero or lead art** for each major new essay or investigation when one exists (grep the article’s `#` block and first `##` sections for `![`).
- **Corpus reuse:** when a blog bullet covers a topic that already has investigation or timeline art, **link the canonical PNG** from its home directory rather than copying files into `blog/`.
- **Placement:** one image **after** the paragraph that introduces the cluster (thematic H3), or inline beside the **most important** item in that cluster—not a gallery on every bullet.
- **Alt text:** name the **lane** and what the reader should see (e.g. “Ghost War — Krasinski miscast / antibody containment,” “Napoleon corpses — two camps of medicine”).
- **Substack posts:** when listing a Substack mirror, note the on-site hero URL if the article has one—readers on paradigmthreat.net and Substack should see the same lead art.

**Search for assets:** `grep -r '!\[' influence/ science/ history/ governance/ cosmos/ --include '*.md'` on changed paths since the cutoff; timeline art often lives under `https://paradigmthreat.net/files/timeline/media/...`.

## Adding new blog entries

Create new posts in `blog/` with the naming convention `YYYY-MM-DD-slug.md`. After push, Relay `path_tree` indexes the tip (including `_updated` from the `YYYY-MM-DD` slug at 12:00 UTC for blog posts).

### Substack published articles (required before drafting)

**Always** check [Paradigm Threat on Substack](https://paradigmthreat2.substack.com/) for posts **published since the previous dated blog entry** (same cutoff as git: day after the prior `blog/YYYY-MM-DD-*.md` filename).

1. **Fetch the RSS feed** (works in CI and locally):
   ```bash
   curl -sL "https://paradigmthreat2.substack.com/feed" -o /tmp/substack-feed.xml
   ```
2. **List items after the cutoff** — parse `pubDate` on each `<item>`; include every post whose calendar date is **after** `PREV` (the previous blog filename date).
3. **In the draft**, add a **Substack published** subsection (under the opening summary or as its own H2) listing **each** post with:
   - **Title** linked to the Substack URL (`https://paradigmthreat2.substack.com/p/...`)
   - **Publication date**
   - **One to three sentences** of context: thesis, on-site mirror URL (`https://paradigmthreat.net/...`), companion investigation if any
   - **Hero image** (`https://paradigmthreat.net/...`) when the mirrored article has lead art
4. **Cross-check git** — every Substack flagship should map to a files-repo article (or note if Substack-only / external, e.g. snesology.net satire). If git landed an article **before** Substack went live, mention both dates when they differ.

Do **not** skip Substack because git already lists the markdown path—the newsletter is the reader-facing publish event many subscribers saw first.

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
2. **Start each repo section with an expanded summary (two or three paragraphs)** that explains what landed, how the pieces connect, and why a reader should care — not just a commit inventory. Then list each new or updated item with a **link** and enough prose to say what the piece *covers* (thesis, scope, companion dossier, notable sections). Timeline events use `https://paradigmthreat.net/timeline/evt-<id>`; other content uses `https://paradigmthreat.net/<path>` (no `.md`). Group by repo: **paradigm-threat-timeline**, **paradigm-threat-files**, **paradigm-threat-site**. Omit a repo section only if it had no changes since the last post.
3. When only one repo changed, a single section is fine. When two or three changed, the entry must have a section per changed repo, each beginning with the expanded summary, then links to all new/updated content.
4. See **Length and depth** below for target size, subsectioning, and per-item detail.

### Length and depth

**Target roughly twice the length of typical 2026 roundup posts** (~50–85 lines before topics). Aim for **~100–170 lines** for a normal multi-repo window; scale up when the git window is heavy (many new essays, site migrations, downtime, or cross-repo infra). Thin weeks can be shorter, but **do not** ship link-only bullet lists when a prior post in the same month already used that shape — readers expect a catch-up narrative, not a sitemap.

**Model:** [`blog/2026-05-13-md2ast-migration-downtime-cave-story-pursue-roundup.md`](../blog/2026-05-13-md2ast-migration-downtime-cave-story-pursue-roundup.md) (context section + themed subsections + reading order). Contrast with the shorter [`blog/2026-05-05-may-roundup-circle-of-life-cancer-success-site-updates.md`](../blog/2026-05-05-may-roundup-circle-of-life-cancer-success-site-updates.md) — acceptable as a bridge, but **not** the default target going forward.

**Opening (above repo sections):**

- **Summary** — two paragraphs when the window warrants it: (1) link the **previous** dated post and name the major themes; (2) reader-visible context (downtime, migration, editorial stance, catch-up for omitted work).
- Optional **thematic H2** (e.g. “What broke, what shipped, and why it mattered”) when infra, deploy pain, or a cross-cutting story is part of the update — explain mechanics and impact in prose, not only in the site repo section.

**Per-repo sections:**

- **H2 per changed repo** (`## paradigm-threat-files`, etc.).
- **Thematic H3 subsections** inside large files-repo drops (e.g. controlled opposition, cosmology, geoengineering) when three or more related items shipped — one short bridging paragraph per subsection before its link list.
- **Site / timeline sections** — spell out user-visible behavior (search, TTS, rendering, redirects, tests), not only dependency names.
- **“Expanded in place”** or **housekeeping** subsections when URLs stayed the same but dossiers or docs grew materially.

**Per-item links:**

- Prefer **one to three sentences** after each link (em-dash lead-in is fine): what argument or evidence tier the reader gets, which companion investigation to open next, notable § anchors or figures when git/commit messages surface them.
- Major new essays and investigations deserve **full sentences**; minor hub or doc tweaks can stay one line.
- Group related article + investigation pairs under the same bullet or adjacent bullets with cross-refs.

**Closing (optional but encouraged for busy windows):**

- **Reading order** — numbered paths through clusters (essay → dossier, or moratorium → captured-courts thread) when more than one narrative lane landed.
- **Substack published** — full list since prior blog (see **Substack published articles** above); do not collapse six posts into “several newsletters.”
- **Publication notes** — doc/workflow changes, Substack mirror sync, index/changelog passes, if not already covered.

**Do not pad** with generic project mission text; length should come from **coverage and context**, not repetition.

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

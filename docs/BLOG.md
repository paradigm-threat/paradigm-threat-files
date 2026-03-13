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

## Adding new blog entries

Create new posts in `blog/` with the naming convention `YYYY-MM-DD-slug.md`. Run `npm run generate-index` (or the pre-commit hook will run it) to include the new file in `index.json`.

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

# paradigm-threat-files: Copilot Instructions

## Purpose

Research dossiers, investigations, topical pages, and assets served as the **site root** at `https://paradigmthreat.net/` (same paths as this repo). Timeline narrative lives in **paradigm-threat-timeline**; link from there with **root-relative** paths (e.g. `/governance/war/investigations/foo.md`).

Assume **redaction and custodial gaps** are plausible when sources are missing; document gaps rather than assuming error alone.

## TL;DR (long markdown articles)

When a markdown file has **more than 12 paragraph-blocks**, include a TL;DR placeholder unless omitted on purpose. **Models** replace the placeholder with a one-paragraph lay summary when you run a pass.

**Generator:** From **paradigm-threat-timeline**, run  
`python3 scripts/generate_tldr.py --root /path/to/this-repo`  
The script inserts `> **TL;DR:** TODO` and skips **`blog/`** and **`docs/`** (and root `REORGANIZATION_MAP.md` / `README.md`). Use `--refresh-tldr` to reset existing TL;DR lines to `TODO`.

**Paragraph-block count:** After any YAML frontmatter, split on one or more blank lines; count non-empty blocks (skip `---`-only rule lines). Headings separated by blank lines count as blocks.

**Markup (option A):** single blockquote under the `#` title (or under a hero image if it sits directly below the title):

```markdown
> **TL;DR:** One-sentence précis drawn only from the article body (subject-first; no “this article”).
```

**Rules (when replacing TODO):**

- Compress only what the file already says; **no** new claims or sources.
- **Do not** open with “this article,” “this chapter,” “this piece,” “this file,” “below,” or “here we.” Use **subject-first** or neutral declarative openers.
- Prefer **investigation-style précis** or **plain third-person** (see paradigm-threat-timeline `docs/CONTENT_STRATEGY.md` § TL;DR for the full tone table).
- If **≤12** paragraph-blocks, omit TL;DR.

## Links in timeline-facing prose

Timeline `content/` should link here with **root-relative** paths from site root. Blog posts in `blog/` require **absolute** URLs (`https://paradigmthreat.net/...`). See `docs/BLOG.md` and `REORGANIZATION_MAP.md`.

**New blog posts:** Before drafting, **always** run `git log` in **paradigm-threat-files**, **paradigm-threat-timeline**, and **paradigm-threat-site** since the **previous** `blog/YYYY-MM-DD-*.md` (see `docs/BLOG.md` § Git history). Do not summarize from memory alone.

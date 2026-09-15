# `page.md` hides directory listings — use AutoIndex

On **paradigmthreat.net**, when a directory contains **`page.md`**, the site serves that file as the folder route and **stops** showing the automatic directory listing. Sibling `.md` files, images, and other assets are **not** visible unless you link them in the prose—readers can miss most of the folder.

## Missing `page.md` (automatic listing)

If the folder has **no** `page.md` (example: `events/false_flag/`), Relay still serves the DirNav link `…/page.md`:

1. Gateway: missing blob + parent git **Tree** → HTTP **200** site shell (`siteShellAutoIndexDir`), not soft-404.
2. Tip: `ArticleView` load miss → **`DirectoryIndex`** (Categories + Documents) from the **warm** `loadDirTree()` QUERY catalog (same rows DirNav already fetched at phase ≥2). No fat `index.json`.

SSR shows a folder-title placeholder (`data-pt-autoindex-ssr`); the list fills after catalog warm. Candidate paths match the old CatchAll: `foo.md` then `foo/page.md`.

## Rule (when `page.md` exists)

If the folder has **any files besides** `page.md` that should stay discoverable, append a **folder listing** at the **bottom** of `page.md` (after the main content):

```markdown
---

## Folder contents

The site does not auto-list siblings when this page is shown; this block lists everything in this directory.

<AutoIndex sort="name-asc" />
```

Use **`name-asc`** unless a hub already standardizes on **`name-desc`** (e.g. some investigation indexes).

### Blog

Under **`blog/`**, keep the existing pattern on `blog/page.md`: `<AutoIndex ... format="blog" />` per **`docs/BLOG.md`** (dated filenames, sort, title).

On article pages, the site shell can also show a **folder index** (same `AutoIndex` data) in the wide-layout right column when the route maps to a files directory.

## Example hub

`influence/predictive_programming/fiction_encoding/swift/page.md` — Swift / *Gulliver* overview plus **AutoIndex** so corpus indices, stance docs, and images stay linked from the hub.

## Related

- `docs/LINKING_AND_SITE_PATHS.md` — repo path = URL path
- `docs/BLOG.md` — blog listing and `_updated` behavior
- `docs/instructions/ARTICLES.md` — **reader-facing article** voice (**I** as Ari when **memory / judgment / stakes** need it; avoid **“this essay”** scaffolding; hook, lay citations, **clinical-but-inspired** stakes, **bold** = emphasis or new terms only, **Substack / email length** targets + **Gmail 102KB** cite, **disclaimers mostly in dossier**, attribution footer, article vs dossier)
- `docs/INVESTIGATIONS.md` — investigations + **New article or hub — discovery checklist** (site root `page.md` **Investigation Categories**, topic hubs, `index-investigations.md`, cross-links, `npm run autogen`)
- Layer-1 tests: `relay-runtime` `dirnav_expand` (`directory_index_*`) + [`CLEVERSCRIPT_COMPONENT_TESTING.md`](../../../relay/relay-runtime/docs/CLEVERSCRIPT_COMPONENT_TESTING.md)

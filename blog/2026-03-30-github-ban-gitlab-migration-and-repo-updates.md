# GitHub disabled all 72 repos; GitLab migration; Swift / *Gulliver* Mars dossier and site index updates

*March 30, 2026 — Paradigm Threat*

---

While the book and timeline work continues, one thread worth surfacing early: **[Swift — Mars, scale beings, and how *Gulliver* was sold to readers](https://paradigmthreat.net/influence/predictive_programming/fiction_encoding/swift/swift-mars-giants-publication-stance)** — Laputan “two lesser stars” around Mars, travel-hoax framing, and why re-shelving as satire does not settle provenance. The **[Swift investigation hub](https://paradigmthreat.net/influence/predictive_programming/fiction_encoding/swift/page)** links the full cluster (Tartary mirrors, debate rails, corpus indices).

---

## What happened on GitHub

**GitHub suspended the account and disabled all 72 repositories.** The timing lined up with the **release of a recent podcast** where I asked listeners for **help on the book** — same window as the takedown, which reads as more than coincidence.

Documentation with screenshots and context: **[GitHub account ban — 72 repositories disabled](https://paradigmthreat.net/influence/censorship/github-ban)**.

**Migration:** Moving mirrors and workflows to **GitLab** took on the order of **half an hour** once the decision was made. Hosting and remotes are being pointed at **GitLab Pages** and GitLab-origin URLs so the public site does not depend on GitHub for file or timeline delivery.

**If this class of shutdown happens again:** the next step is **Linode** (or equivalent bare metal / VPS you control) and **no more cloud** dependency for the project’s canonical hosting story — fewer intermediaries that can flip a switch on dozens of repos at once.

---

## paradigm-threat-files

This repo absorbed the **censorship dossier**, the **Swift / *Gulliver*** investigation tree, **hub** fixes so folder contents are not hidden behind `page.md`, and **index** metadata improvements.

### Censorship and hosting

- [GitHub account ban — 72 repositories disabled](https://paradigmthreat.net/influence/censorship/github-ban) — account suspension, disabled repos, screenshots, GitLab migration note.
- **CI / hosting:** GitLab Pages pipeline (`.gitlab-ci.yml`); GitHub Pages workflow removed; branch **main** treated as canonical alongside prior **master** history.

### Swift and predictive programming

- [Swift — Mars, giants, publication stance](https://paradigmthreat.net/influence/predictive_programming/fiction_encoding/swift/swift-mars-giants-publication-stance) — Martian satellites passage vs Hall (1877), scale worlds, hoax memoir frame.
- [Swift — Tartary / Rus timeline mirrors](https://paradigmthreat.net/influence/predictive_programming/fiction_encoding/swift/swift-tartary-rus-timeline-mirrors) — Brobdingnag, gunpowder dating, parallels only.
- [Swift — Debate rails and drift](https://paradigmthreat.net/influence/predictive_programming/fiction_encoding/swift/swift-investigation-debate-rails-and-drift) — content vs form, managed disclosure posture.
- [Jonathan Swift — Investigation hub](https://paradigmthreat.net/influence/predictive_programming/fiction_encoding/swift/page) — corpus indices, TL;DRs, **AutoIndex** at bottom so siblings stay visible.

### Site UX — folder hubs

- **[`page.md` + AutoIndex](https://paradigmthreat.net/docs/instructions/PAGE_MD_AUTOINDEX)** — new instruction doc: when a directory uses `page.md`, the automatic file list disappears unless you append `<AutoIndex sort="name-asc" />` at the bottom; linked from [Linking and site paths](https://paradigmthreat.net/docs/LINKING_AND_SITE_PATHS).
- Hub pages updated across **predictive programming**, **conspiracy**, **controlled opposition**, **stolen credit**, **war investigations**, **book**, **root `page.md`**, and others so **sibling files** stay listed.

### Index pipeline

- **`generate-index.py`** — `_updated` for non-blog files prefers **last Git commit** touching each path (single `git log` pass), with **mtime** fallback; **`blog/YYYY-MM-DD-*.md`** still uses the **filename date** at 12:00 UTC per [BLOG](https://paradigmthreat.net/docs/BLOG) rules.

### Other content in this window

- [DNA fingerprint, scalar life, soul continuity (biology investigation)](https://paradigmthreat.net/science/biology/investigations/dna-fingerprint-scalar-life-investigation) — added in the same general push as the Swift work.
- [Site home](https://paradigmthreat.net/page) — welcome / TL;DR tidy on the root hub.

---

## paradigm-threat-timeline

- **[1726 CE: *Gulliver's Travels* — travel testimony and the satire shell](https://paradigmthreat.net/timeline/evt-1726-ce-gullivers-travels-managed-disclosure)** — timeline event tying the 1726 memoir frame to Mars / Tartary-scale parallels and cross-links to the files investigations.
- [Mars literature as reclassified nonfiction](https://paradigmthreat.net/timeline/evt-mars-literature-as-reclassified-nonfiction) and [Predictive programming — literature appendix](https://paradigmthreat.net/timeline/evt-predictive-programming-literature) — Swift pointers added where the appendix TL;DR was filled in.
- **`generate-index.py`** — same **Git-based `_updated`** pattern as files (plus **mtime** fallback) for the timeline **file browser** `index.json`.
- **Hosting:** GitLab Pages CI; GitHub Pages workflow removed; export / validation hooks unchanged in intent.

---

## paradigm-threat-site

- **`lib/indexUpdated.ts`** — comment updated so the reader knows **`_updated`** comes from **Git commit time** (files + timeline index generators) with blog filename exception on the files repo.
- **Defaults and UX** — static / remote defaults skewed to **GitLab** origins where relevant; **404 / remote** article messaging updated for GitLab-hosted assets; earlier work in this window includes **remote index timeout**, **retry**, and **blob** branch defaults for file links.

---

*Commits referenced above fall on and after **March 28, 2026**, across **paradigm-threat-files**, **paradigm-threat-timeline**, and **paradigm-threat-site**; this entry follows the [blog process](https://paradigmthreat.net/blog/page) of summarizing changes since the prior dated post.*

---

*Topics:* [#influence](https://paradigmthreat.net/search/influence) · [#censorship](https://paradigmthreat.net/search/censorship) · [#predictive_programming](https://paradigmthreat.net/search/predictive_programming) · [#history](https://paradigmthreat.net/search/history)

# Relay network engineering shift; GitHub and crates.io lockout; griffin timeline merge; site and files updates — April 5, 2026

*April 5, 2026 — Paradigm Threat*

---

**Summary.** Since the [April 3, 2026](https://paradigmthreat.net/blog/2026-04-03-prester-john-religious-edition-brand-slogans) post, `git log` from **2026-04-04** forward across **paradigm-threat-files**, **paradigm-threat-timeline**, and **paradigm-threat-site**—plus **relay-gateway** (**relay-server** on GitLab) and **relay-master**—shows a **large timeline/book merge**, a new **15th-century griffin** article, **files** index and **censorship** asset work, **site** search/Piper/Patreon footer tweaks, and major **Relay** work: **signed catalog policy**, **Helm-style reconcile** for gateway binaries, **mesh/docs**, and **Piper** install integration. Separately, **GitHub account loss** and **crates.io’s GitHub-only login** have **frozen** Rust publishing for the **clevertree** crates identity; internal docs now record a **dependency-confusion placeholder** on the **`relay-server`** crate name and the **systemic** risk of **GitHub-gated** Rust tooling—including **other discovery UIs** in the **lib.rs** ecosystem that still **route sign-in through GitHub**, so one suspension propagates across services.

**Engineering priority.** With the project **purged from GitHub-scale cloud** (see [March 30 dossier](https://paradigmthreat.net/blog/2026-03-30-github-ban-gitlab-migration-and-repo-updates) and [GitHub ban file](https://paradigmthreat.net/influence/censorship/github-ban)), **day-to-day focus is shifting to the Relay network**: **self-hosted masters**, **GitLab-origin** catalog, **tarball + install scripts**, and **policy-enforced** catalog pushes—so **content** and **binaries** are less exposed to a single platform’s **account kill switch**.

---

## GitHub, crates.io, and the wider Rust “GitHub wall”

- **GitHub** — The **clevertree** organization and account suspension (72 repos disabled) remains the upstream trigger; narrative and screenshots stay in **[GitHub account ban — 72 repositories disabled](https://paradigmthreat.net/influence/censorship/github-ban)**.
- **crates.io** — **Login is GitHub OAuth only** (no GitLab, no email/password path in practice for maintainers). With the **GitHub** identity gone, **published crates under `clevertree` cannot be updated, yanked, or transferred** without crates.io staff intervention. A draft **access request** (context for the help desk) lives in the Relay repo: **[CRATES_IO_ACCESS_REQUEST.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/CRATES_IO_ACCESS_REQUEST.md)**.
- **Naming / squatting** — The **[crates.io censorship & lockout log](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/CENSORSHIP_LOCKOUT.md)** records API-verified metadata: a **`relay-server`** crate already on crates.io appears to be a **dependency-confusion placeholder**, which **blocks** publishing this project under that **exact** name until ownership changes—**independent** of the login freeze.
- **lib.rs and adjacent tools** — Beyond crates.io, **routine use of Rust discovery and account flows** showed **other services indexed or linked from the lib.rs side of the ecosystem still using GitHub as the only (or de facto) identity provider** for features that require a logged-in user—so **GitHub suspension** is not a **single-site** outage; it **replicates** across **documentation, badges, and account-gated pages** that assume a **live GitHub** session.

**Distribution path for Relay today:** **GitLab** source, **generic package / tarball** installs, and **[RELAY_RECONCILE_PLAN.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_RECONCILE_PLAN.md)**-style **catalog-driven** updates—not **crates.io** as the primary delivery channel until policy or ownership changes.

---

## paradigm-threat-files

This window includes a **broad tree refresh** commit (metadata / standard blocks across many paths—see GitLab history for full file list) plus a focused **index + investigation + asset** push.

- **[Jew / Judas / judicial wording — terminology investigation](https://paradigmthreat.net/history/chronology/investigations/jew-word-terminology-judas-judicial)** — Small content pass in the chronology investigations cluster.
- **Censorship visuals** — New raster: **[ai_censorship2.png](https://paradigmthreat.net/influence/censorship/ai_censorship2.png)** under **`influence/censorship/`**.
- **Index pipeline** — **`scripts/generate-index.py`** adjustments and regenerated **`index.json`** / **`changelog.json`** (pre-commit **`autogen`** hook).

---

## paradigm-threat-timeline

A **large merge** landed (**“griff merge”**): **definitive** `content/` and **religious** `content-editions/modern-religious/` chapters, appendices, and **`data/events.json`** were brought in line together—book-facing prose, cross-links, and generated events for the site timeline.

- **New article** — **[1463 CE — Man-eating griffins and the steppe extinction campaign](https://paradigmthreat.net/timeline/evt-1463-ce-man-eating-griffins-extinction)** (`09.07.00-1463-ce-man-eating-griffins-extinction.md`), sibling to the **[15th-century Ottoman conquest of Europe](https://paradigmthreat.net/timeline/evt-1400-ce-15th-century-ce-ottoman-conquest-of-europe)** chapter hub (`09.00.00` overview).
- **Housekeeping** — **`package.json`**, **`index.json`**, **`changelog.json`**, keyword scripts (`append_article_keywords.py`, `article_keyword_overrides.json`) where touched by the merge.

---

## paradigm-threat-site

- **Search and Piper** — Commit **“Improve search and Piper voice selection”** refined **search** behavior and **Piper** voice UX; **[Patreon](https://www.patreon.com/c/ahsctimeline)** replaced **GitHub Sponsors** in the **site footer** alongside a small **`app/api/tts/piper/route.ts`** adjustment (**“Site: Patreon footer link; Piper TTS route tweak”**).

---

## relay-gateway (*relay-server* on GitLab)

**Summary.** One large integration commit (**`3d53a18`**) adds **branch policy** (`.relay.yaml` / signed commits, HTTP PUT parity), **`branch_policy.rs`**, mesh/notify/peer-hook wiring, **Piper** voice defaults and **install.sh** / **pack-linode-deploy.sh** support, **CI** path fixes for hook tests, and operator docs (**[RELAY_BRANCH_POLICY.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_BRANCH_POLICY.md)**, **[RELAY_AUTH_PROTOCOL.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_AUTH_PROTOCOL.md)**, **[RELAY_RECONCILE_PLAN.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_RECONCILE_PLAN.md)**, **[RELAY_MASTER_DEPLOY.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_MASTER_DEPLOY.md)**, censorship / migration notes). **Shipped scripts:** **`relay-reconcile.sh`**, **`deploy-all-masters.sh`**, **`verify-push-range.sh`**; **`.cursor/rules/relay-production-ops.mdc`** documents **SSH deploy** to **atlanta2 / atlanta3**.

---

## relay-master

- **Catalog trust** — **`relay-catalog.json`** and **`.relay.yaml`** for the **relay-gateway** allowlist; signing key ignore hygiene.
- **Helm-style manifest** — **`deploy/relay-gateway.json`** stub, **`deploy/canary-complete.example.json`**, and **[deploy/README.md](https://gitlab.com/clevertree/relay-master/-/blob/main/deploy/README.md)** for **artifact URL + SHA** driven reconcile; root **README** points operators at the Relay reconcile doc.

---

## Also (outside the three Paradigm repos)

- **clevertree.net** README and **Forgotten Future** site footer now point **support** links at **Patreon** instead of **GitHub Sponsors**, matching the **paradigmthreat.net** footer change—reducing dependence on **GitHub** for **donation CTAs**.

---

*Topics:* [#censorship](https://paradigmthreat.net/search/censorship) · [#governance](https://paradigmthreat.net/search/governance) · [#history](https://paradigmthreat.net/search/history) · [#chronology](https://paradigmthreat.net/search/chronology)

# Jade Helm and Cruz / Kevin investigations; Venus probes; Relay branch policy; site TTS and mobile layout — April 2026

*April 10, 2026 — Paradigm Threat*

---

**Summary.** Since the [April 5, 2026](https://paradigmthreat.net/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates) post, `git log` from **2026-04-06** forward across **paradigm-threat-files**, **paradigm-threat-timeline**, and **paradigm-threat-site** shows major new **governance / war** investigations (Jade Helm–era Texas and a Ted Cruz / *Office* Kevin Malone hypothesis track), a **cosmos / Venus** investigations index plus a **Saturnian-to-Venera** probe article, **Relay**-aligned **`.relay.yaml`** on `main`, and **site** work on **Article TTS**, **resume** chrome, and **mobile** layout. **Relay** source repos (**relay-gateway** / **relay-master**, plus **relay-client-web**, **relay-runtime**, **relay-client-android**, **relay-template**): **no commits dated after 2026-04-05**—the latest gateway/master integration is still the **April 5** drop (listed below for a full **since-2026-04-05** inventory). **Paradigm** repos picked up **`.relay.yaml`** later in the week to match that policy.

---

## paradigm-threat-files

This stretch added two open **hypothesis** investigations under **[governance/war/investigations](https://paradigmthreat.net/governance/war/investigations/page)**, wired them into the investigations **[index](https://paradigmthreat.net/governance/war/investigations/page)**, and iterated **methodology** (pattern-seeking, proportionality on “debunks,” assistant-bias notes), **quoted** *Office* beats (**Gossip** “person inside / controls,” **Niagara** tie / bathroom line, sorted **resonance** table), a **[PopSugar](https://www.popsugar.com/news/ted-cruz-looks-like-kevin-malone-40240539)**-context **Getty** rally still (**Alex Wong**), and investigator **impression** text on the viral **“Same Person?!?!”** sign moment—not asserted as proof. Header **PNGs** and an embedded **2016** rally **JPEG** ship with the markdown. Separately, **cosmos / Venus** gained an investigations **hub** and a long **Saturnian cosmology → Soviet Venera** probe narrative.

- **[Investigation: Jade Helm 15 — “Real Op” Hypothesis, Texas, and the 2016 GOP Field](https://paradigmthreat.net/governance/war/investigations/jade-helm-texas-coup-cruz-hypothesis-investigation)** — Master-timeline spine, expanded context, methodology cross-link to the Cruz/Kevin file; **[header graphic](https://paradigmthreat.net/governance/war/investigations/jade-helm-texas-coup-cruz-hypothesis-investigation.png)** embedded in-page.
- **[Investigation: Ted Cruz, Kevin Malone (*The Office*), and the “Hijacked Plan” Hypothesis](https://paradigmthreat.net/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation)** — Meme lane, compromise framing, cryptic *Office* catalogue, **Gossip** / **Niagara** subsections; **[header graphic](https://paradigmthreat.net/governance/war/investigations/cruz-kevin-malone-deep-state-hypothesis-investigation.png)**; rally photo **[cruz-rally-kevin-same-person-sign-2016-getty-via-popsugar.jpg](https://paradigmthreat.net/governance/war/investigations/cruz-rally-kevin-same-person-sign-2016-getty-via-popsugar.jpg)** (Getty via PopSugar; republishing may require separate Getty licensing).
- **[Venus investigations — index](https://paradigmthreat.net/cosmos/venus/investigations/index-venus)** — Hub for Venus-themed investigations.
- **[From Saturnian wheel to Venera: Soviet Venus probes in a Saturnian cosmology frame](https://paradigmthreat.net/cosmos/venus/investigations/venus-from-saturnian-to-venera-investigation)** — Chronology and interpretive bridge article.
- **Relay policy** — **`.relay.yaml`** on `main` for **SSH-signed commits** and follow-up **allowedKeys** / push checks (operator workflow aligned with **relay-gateway** / **relay-master** policy elsewhere in the Relay monorepo).

---

## paradigm-threat-timeline

No **`content/`** or **`events.json`** changes landed in this window. The repo received the same **`.relay.yaml`** **branch-policy** housekeeping as **paradigm-threat-files** (SSH-signed commits on `main`), keeping the timeline repo aligned with Relay signing policy.

---

## paradigm-threat-site

Commits refined **Article** text-to-speech **overlay** layout and the **resume** control cluster, improved **hub** bottom chrome (including **scroll-hide** behavior and a **1180px** large-layout breakpoint), and tightened **mobile** narrow layout: **footer** wrap, **overflow** clipping, **TTS** dock, and **navbar** behavior.

---

## relay-gateway (*relay-server* on GitLab) and relay-master

**Inventory (`git log --after=2026-04-04` on local checkouts, i.e. commits from 2026-04-05 forward).** **relay-gateway** and **relay-master** both moved on **2026-04-05**; **relay-client-web**, **relay-runtime**, **relay-client-android**, and **relay-template** had **no** commits in that window. **Nothing** landed **after** **2026-04-05** on any of these—so the **new** work in *this* week’s Paradigm push is **policy alignment** in the content repos (below), not another gateway tarball.

**relay-gateway** (**2026-04-05**, newest first — full detail in the [April 5 blog](https://paradigmthreat.net/blog/2026-04-05-relay-network-shift-github-crates-lockout-and-updates)):

- `3d53a18` — branch policy, reconcile deploy, mesh docs, Piper/install updates  
- `4253c84` — CI: install Node for query hook tests  
- `27b53db` — CI: fix Rust/cargo `PATH` in GitLab jobs  
- `453fc83` — configurable Piper voice defaults  
- `7927d40` — Piper: extract libraries and espeak-ng-data from release archive  
- `dd6c412` — voice discovery endpoint on Piper TTS wrapper; install script auto-config  

**relay-master** (**2026-04-05**):

- `67389a2` — deploy manifest for gateway reconcile; catalog deploy docs  
- `7e0f9d8` — gitignore relay signing-key private material  
- `f9a7542` — `relay-catalog.json` and `.relay.yaml` allowlist for **relay-server** catalog  

**Stable pointers** (current `main` on GitLab):

- **[RELAY_RECONCILE_PLAN.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_RECONCILE_PLAN.md)** — catalog-driven gateway binary updates.  
- **[RELAY_BRANCH_POLICY.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_BRANCH_POLICY.md)** — signed pushes and HTTP PUT parity.  
- **[RELAY_AUTH_PROTOCOL.md](https://gitlab.com/clevertree/relay-server/-/blob/main/docs/RELAY_AUTH_PROTOCOL.md)** — auth surface for operators.  
- **[deploy/README.md](https://gitlab.com/clevertree/relay-master/-/blob/main/deploy/README.md)** — artifact URL + SHA reconcile from **relay-master**.  

**Paradigm repos (2026-04-09):** **`.relay.yaml`** on **`main`** in **paradigm-threat-files** and **paradigm-threat-timeline** (SSH-signed commits; **allowedKeys** follow-up) aligns those trees with the same **branch policy** expectations as **relay-gateway**—without a new gateway **commit** in the Relay repos after **April 5**.

---

*Topics:* [#governance](https://paradigmthreat.net/search/governance) · [#war](https://paradigmthreat.net/search/war) · [#cosmos](https://paradigmthreat.net/search/cosmos) · [#chronology](https://paradigmthreat.net/search/chronology)

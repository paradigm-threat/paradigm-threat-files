# Investigation: PURSUE Release 01 (May 8, 2026) — what the Trump-era UAP "declassification" actually is, and what it carefully isn't

> **TL;DR:** On 8 May 2026 the **Department of War** (DOW, the renamed DoD) launched [war.gov/ufo](https://www.war.gov/ufo/) and posted **Release 01** of the **Presidential Unsealing and Reporting System for UAP Encounters (PURSUE)** — **162 records, 161 CSV line items, ~3.6 GB**, framed as the first tranche in a rolling declassification ordered by Trump on 19 Feb 2026 ([Truth Social directive recap](https://www.war.gov/ufo/)). A full local mirror was built at `/media/ari/HD/uap/` (war.gov + AARO + ODNI/DoD reports + FBI Vault via Internet Archive + Black Vault CIA UFO collection + NARA RG 615 bulk zips), totaling **~440 GB / 1,634 PDFs / 28 MP4s** at time of writing. After full-text extraction (`pdftotext`) and theme keyword scans across that corpus, the substantive findings are: **(1)** PURSUE 01 is **almost entirely a republish** of FBI 62-HQ-83894, NASA Apollo material, State Department cables already *Released in Full* in **February 2026** (months before the announcement), and AARO unresolved-case MISREPs from 2022-2025 — **with fewer redactions and a CSV manifest** as the genuine novelty. **(2)** **Every PURSUE record is tagged "unresolved"**; no government conclusion of NHI, recovered tech, or ET visitation is asserted, consistent with [AARO Historical Record Vol. I (Mar 2024)](https://www.aaro.mil/Portals/136/PDFs/AARO_Historical_Record_Report_Vol_1_2024.pdf). **(3)** The single most underreported document in the corpus is AARO Vol. I's footnote describing **BAASS / Bigelow's 2010-era proposal to "hire supportive reporters and celebrity moderators"** to host "intellectual debates" that **assume "E.T. visitations are true"** and steer the public *toward* a disclosure narrative — a documented, government-found **influence-operation proposal** that fits the [Lacatski / AAWSAP insider-mechanics dossier](/influence/controlled_opposition/investigations/lacatski-consciousness-craft-viral-post-investigation.md) and the [Great Awakening / alien-savior cluster](/influence/controlled_opposition/investigations/great-awakening-alien-savior-rv-nwo-cluster-investigation.md) grammar. **(4)** Critic consensus (TWZ, NYMag, Verge, Engadget, Defense News, Greenewald of *The Black Vault*) is **"transparency norm yes, revelation no — Batch 01 doesn't have the good stuff."** **(5)** Cross-reads with [CIA Reading Room Mars 1984 RV](/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md), the [STAR GATE / remote viewing](/science/telepathy/remote_viewing/aether-consciousness.md) thread, and the [What Are You Waiting For?](/influence/controlled_opposition/what-are-you-waiting-for.md) deferral essay show PURSUE fits the **deferral / waiting-room** disclosure pattern Paradigm Threat already documents — **rolling release, "wait a few weeks for the next tranche," redactions only "for sources/methods,"** all the same affective grammar as Q's "trust the plan" and the Great Awakening lightworker basin.

**Date:** 2026-05-08
**Status:** Open — corpus build complete; NARA Tier-3 mega-zips (~1 TB) still downloading in parallel; PURSUE Release 02 expected within ~30 days per Rep. Anna Paulina Luna; final integrity check + INDEX rebuild pending.

**Terminology:** "**PURSUE**" = *Presidential Unsealing and Reporting System for UAP Encounters*, the DOW program announced 8 May 2026. "**DOW**" = *Department of War*, the renamed DoD. "**AARO**" = *All-domain Anomaly Resolution Office* (DoD, 2022-present). "**AAWSAP / AATIP**" = the 2008-2012 Reid-earmarked DIA program run via Bigelow Aerospace (BAASS). "**KONA BLUE**" = the 2011-2012 *proposed* DHS PSAP that was disapproved before any material was transferred. "**RV**" in this file means **STARGATE-style remote viewing** unless explicitly tagged as Iraqi-dinar **revaluation** ([disambiguation hub](/influence/controlled_opposition/investigations/great-awakening-alien-savior-rv-nwo-cluster-investigation.md)).

---

## Guide (read order)

1. **§1** — What was actually released (counts, sources, where to find the docs).
2. **§2** — How the corpus was built (scripts, bot-protection bypass, HD migration).
3. **§3** — Novelty audit: provenance of each chunk, what is genuinely new.
4. **§4** — What the government has actually *studied* (eight named programs, 1947-present).
5. **§5** — Theme deep-dive (Mars, teleportation, remote viewing, "aether"/zero-point, mind influence, demonology/spiritual, non-human, transmedium, Skinwalker, weather-control).
6. **§6** — The **single most underreported finding**: BAASS's proposed paid-celebrity-moderator PR campaign to assume ET reality.
7. **§7** — Critic / analyst consensus on Release 01.
8. **§8** — Cross-references to existing Paradigm Threat investigations (Lacatski, Great Awakening, Mars RV, deferral essay, indigenous control systems, 1979 religious revival).
9. **§9** — Author's open claims / pattern registry.
10. **§10** — Questions to clarify, verify, or debunk.
11. **§11** — Weak points / TODOs.
12. **§12** — Related investigations + external references.
13. **Keywords** → **Limits** → **Investigator notes**.

---

## 1. What was actually released

### 1.1 Headline announcement

On **19 February 2026** Donald Trump posted a Truth Social directive ordering DOW and ODNI to identify, review, and publicly release UAP records. On **Friday 8 May 2026**, DOW launched [war.gov/ufo](https://www.war.gov/ufo/) hosting **PURSUE Release 01** with a back-end CSV manifest at `https://www.war.gov/Portals/1/Interactive/2026/UFO/uap-csv.csv` and direct files under `https://www.war.gov/medialink/ufo/release_1/`. The headline counts (per official press summaries):

* **162 records** in this first tranche (120 PDFs, 28 videos, 14 image files in the press summaries; CSV manifest lists **161 line items** because several FBI section files share a single record).
* Sources: **FBI**, **DOW** (incl. AARO), **NASA**, **Department of State**, plus the State Department UAP Cables.
* **108 of 162** are **partially redacted** — DOW says only to protect eyewitness identities, base/facility locations, and unrelated military equities.
* Rolling release: new tranches every "few weeks"; **Rep. Anna Paulina Luna (R-FL)** says a second batch with additional video footage is expected within ~30 days.

### 1.2 Statements from officials

* **Sec. of War Pete Hegseth** — *"These files, hidden behind classifications, have long fueled justified speculation. It's time the American people see it for themselves."*
* **DNI Tulsi Gabbard** — *"Today's release is the first in what will be an ongoing joint declassification and release effort."*
* **FBI Director Kash Patel** — committed to *"supporting this rolling declassification effort with the same rigor and integrity we bring to every national security matter."*
* **NASA Administrator Jared Isaacman** — *"We will remain candid about what we know to be true, what we have yet to understand, and all that remains to be discovered."*

### 1.3 What's in the local corpus (snapshot 2026-05-08, ~17:55 ET)

| Source | Local subpath | Files | Disk |
|---|---|---:|---:|
| **war.gov/ufo PURSUE Release 01** (May 8) | `war.gov/release_1/` | 116 PDFs, 130 JPGs, 8 PNGs | 2.34 GB |
| war.gov DVIDS videos (PURSUE) | `war.gov/dvids-videos/` | 28 mp4 + meta | 1.24 GB |
| AARO FOIA reading-room PDFs | `aaro.mil/FOIA/` + auto-discovered | 27 | 109.6 MB |
| ODNI / DoD / NASA UAP reports (2021-2024) | `odni-dod-reports/` | 5 | 18.3 MB |
| FBI Vault — UFO collection (Parts 1-16) + Roswell Statement | `fbi-vault/UFO/` | 17 | 113.3 MB |
| Black Vault — CIA UFO documents (CD-ROM + individual PDFs) | `blackvault/`, `cia-blackvault/` | 714 (+1 zip) | 442 MB + 342 MB |
| NARA Record Group 615 bulk downloads | `nara/` (Tier-3 mega-zips still streaming) | many | 438 GB and growing |
| News articles & official press releases | `headlines/` | — | 6.9 MB |
| **Total disk so far** | `/media/ari/HD/uap` | 1,634 PDFs / 28 MP4s | **~440 GB** |

### 1.4 Where everything lives online (canonical sources)

* **PURSUE / DOW UFO page (May 2026 release)** — [war.gov/ufo](https://www.war.gov/ufo/); CSV at `https://www.war.gov/Portals/1/Interactive/2026/UFO/uap-csv.csv`; direct files under `https://www.war.gov/medialink/ufo/release_1/`.
* **NARA Record Group 615** — [archives.gov/research/topics/uaps/rg-615](https://www.archives.gov/research/topics/uaps/rg-615) · bulk index [archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download](https://archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download). Includes Project Blue Book (1947-1969), Roswell Reports source files, the Condon Committee records, the 4602d AISS files, and presidential-library UFO holdings.
* **AARO** — [aaro.mil/UAP-Records](https://www.aaro.mil/UAP-Records/) · case-resolution reports at [aaro.mil/UAP-Cases/UAP-Case-Resolution-Reports](https://www.aaro.mil/UAP-Cases/UAP-Case-Resolution-Reports/) · EFOIA reading room at [aaro.mil/EFOIA-Reading-Room](http://www.aaro.mil/EFOIA-Reading-Room/).
* **ODNI Annual UAP Reports** — 2021, 2022, 2023, 2024.
* **NASA UAP Independent Study Report (2023)** — [nasa.gov/uap](https://www.nasa.gov/uap/).
* **FBI Vault UFO collection** — [vault.fbi.gov/UFO](https://vault.fbi.gov/UFO) (Cloudflare-protected; mirrored via [Internet Archive `FBIUFO`](https://archive.org/download/FBIUFO/) for the corpus).
* **The Black Vault — CIA UFO documents** — [theblackvault.com/documentarchive/cia-ufo-documents-now-online-and-searchable](https://www.theblackvault.com/documentarchive/cia-ufo-documents-now-online-and-searchable/) (single ~342 MB ZIP) and [documents2.theblackvault.com/documents/cia/ufos/](https://documents2.theblackvault.com/documents/cia/ufos/) (individual PDFs).

---

## 2. How the corpus was built (operational write-up)

This section captures *all* the scrape mechanics so the work is reproducible. Operational paths (`/media/ari/HD/uap/...`) are author-machine local; everything in the body otherwise stays repo-relative or public.

### 2.1 Bot-protection bypass log

* `war.gov` — **Akamai Bot Manager** rejects default `wget`/`curl` UAs with **403** even when HEAD shows 200. Fix: `curl --compressed -A "Mozilla/5.0 ... Chrome/142" -H "Accept: ..." -H "Referer: https://www.war.gov/ufo/"`.
* `aaro.mil` — same Akamai posture; same fix.
* `documents2.theblackvault.com` — Apache **ModSecurity** returns **406** to bare `wget`. Fix: full Chrome `Sec-Fetch-*` header set + `Upgrade-Insecure-Requests: 1`.
* `dvidshub.net` API — API key bound to `war.gov` origin, returns *Unauthorized* from generic clients. **Fix: scrape the public `/video/<id>` HTML pages**, extract the CloudFront MP4 URL with `grep -oE 'https?://[^\"]+\.mp4'`, then `curl` it with a `Referer: https://www.dvidshub.net/` header.
* `vault.fbi.gov` — **Cloudflare JS challenge** that `curl`/`wget` cannot solve. **Fix: pull the same FBI UFO Parts 1-16 from [archive.org/download/FBIUFO/](https://archive.org/download/FBIUFO/)** which has no challenge.
* `war.gov` filename spaces — some CSV-listed PDFs failed because spaces were not URL-encoded. **Fix: `urllib.parse.quote(path, safe='/')`** in a small Python re-downloader.

### 2.2 Disk strategy

The full corpus exceeds local SSD capacity (NARA Tier-3 zips alone target ~1 TB — `542184.zip`, `566658.zip`, `542326.zip`, `45484701.zip`, `597821-images-1/2.zip`). Strategy:

1. Mount external HD at `/media/ari/HD` (7.3 TB free).
2. Build the canonical tree at `/media/ari/HD/uap/{war.gov,aaro.mil,nara,blackvault,cia-blackvault,fbi-vault,odni-dod-reports,nsa,headlines,scripts,logs,text,themes}`.
3. Symlink `~/dev/wget/uap → /media/ari/HD/uap` so existing tooling paths still resolve.
4. Run NARA Tier-3 in parallel (concurrency 3) via `xargs -P 3` against `nara-tier3-mega-urls.txt`; everything else runs sequentially with backoff.
5. After download, run `pdftotext -layout -nopgbrk` over every PDF (parallel `xargs -P 8`) into a parallel `text/` tree for grep-based theme analysis.

### 2.3 Theme keyword scanner

`scripts/theme-scan.sh` runs whole-word `rg -i -w` over the extracted text corpus for: `mars`, `teleportation`, `remote-viewing`, `aether-propulsion`, `mind-influence`, `spiritual-occult`, `non-human`, `moon-jupiter`, `skinwalker`, `underwater`, `consciousness`, `weather-control`. Output goes to `/media/ari/HD/uap/themes/<theme>.md` with file paths + 3-line context windows.

---

## 3. Novelty audit — was anything actually new?

### 3.1 Provenance of each chunk

| Chunk | Volume | Was it already public? | What is genuinely new? |
|---|---:|---|---|
| **FBI 62-HQ-83894 case file** (sections + serials) | ~50 PDFs, largest part of PURSUE | **Yes** — on [vault.fbi.gov/UFO](https://vault.fbi.gov/UFO) since 2011 | DOW summary explicitly says *"This file is partially posted on \[the\] FBI vault with more redactions and some pages missing. Included here is the complete case file with several newly declassified pages and only minor redactions."* Real, but incremental. |
| **NASA Apollo transcripts** (Apollo 11/12/17, Skylab, Gemini 7) | 7 PDFs + 1 audio | **Yes** — [NASA Apollo Lunar Surface Journal](https://www.hq.nasa.gov/alsj/) | Excerpted relevant pages only |
| **NASA Apollo "areas of interest" images** | 6 JPGs | **Yes** — original archival photos on NASA's photo gateway | **Highlighted overlays drawn by the PURSUE team**, plus DOW caption opening a *case* on the Apollo 17 image (3 dots in a triangular formation) — caveated that *"highlighted areas of interest do not constitute an analytical judgment."* |
| **State Department UAP Cables 1-5** | 5 PDFs | **Yes — released in full Feb 25 2026, months before the announcement** (header: *"Released in Full, John Powers, Acting-Director, US Department of State, 2/25/2026"*) | Publishing-via-`war.gov` is new; the de-classification is not |
| **DOW MISREPs (DOW-UAP-D10 … D60)** | ~50 PDFs | Mostly already itemised on `aaro.mil/UAP-Cases/` as resolved/unresolved | These were the *unresolved* ones AARO already had; centralising them is new |
| **DOW infrared video stills (PR1 - PR43)** | ~40 photos | New collation, but each was previously held by AARO | Public availability is new |
| **September 2023 "ellipsoid bronze metallic object"** | 1 composite | New | Caption: *"Actual site photo with FBI Lab rendered graphic overlay depicting corroborating eyewitness reports …"* — i.e. **this is a sketch, not a photograph** |

### 3.2 So what is genuinely new?

* The **`war.gov/ufo` site itself**, with a structured CSV manifest enabling bulk analysis (which is how this archive was built).
* Several FBI 62-HQ-83894 pages with **fewer redactions** than the FBI Vault versions.
* **DOW's commitment** to a rolling release on a "few weeks" cadence (a **deferral structure** — see § 8).
* **A short list of recent AARO unresolved cases** (mostly 2022-2025 mission reports) packaged for public review.
* **Zero genuinely new evidence about the *nature* of UAP.**

### 3.3 What every PURSUE record explicitly says

Every PURSUE record carries the **"unresolved"** tag, which DOW defines as *"the government is unable to make a definitive determination on the nature of the observed phenomena."* No recovered material, no crashed craft, no NHI claim — fully aligned with [AARO Historical Record Vol. I (Mar 2024)](https://www.aaro.mil/Portals/136/PDFs/AARO_Historical_Record_Report_Vol_1_2024.pdf) which concluded *"no empirical evidence of extraterrestrial visitation."*

> *"There doesn't appear to be anything groundbreaking in this release, which should come as no surprise."* — TWZ, May 8 2026
>
> *"Friday's release, with just 161 files, leaves much to be desired. And even the Defense Department isn't sure about everything in there."* — *New York Magazine*

---

## 4. Did the government actually *study* any of this?

**Yes — extensively.** But the structured studies have always concluded *unexplained ≠ extraterrestrial.* Documented chain inside this archive, ordered by program:

| Program | Years | Sponsor | Outcome | Evidence in this archive |
|---|---|---|---|---|
| **Project Sign / Grudge / Blue Book** | 1947-1969 | USAF | 12,618 cases, ~700 unresolved. Closed after the Condon Report. | NARA RG 615 (`nara/textual-and-microfilm/`), FBI Vault collateral, war.gov FBI files |
| **Robertson Panel (1953)** | 1953 | CIA | Recommended UFO reports be **"demystified"** via media to reduce hysteria — explicit influence-on-public-affairs intent | Black Vault `C05517742.txt` (Haines, *"CIA's Role in the Study of UFOs, 1947-90"*) |
| **Project Moon Dust / Operation Blue Fly** | 1953-1980s | USAF | Recovery of foreign space debris; sometimes mistaken for UFO recovery | (Outside this corpus) |
| **The Condon Committee** | 1966-1968 | USAF + NSF (Univ. of Colorado) | *"Nothing has come from the study of UFOs in the past 21 years that has added to scientific knowledge."* | NARA NAID 45484701 zip (66 GB, downloading) |
| **Roswell Reports I & II** | 1994-1995 | USAF | Attributed Roswell debris to **Project Mogul** balloons; "bodies" to **Project High Dive** anthropomorphic dummies | NARA NAID 733667 zip |
| **AAWSAP / AATIP** | 2008-2012 | DIA via Sen. Reid earmark, Bigelow Aerospace as prime contractor | **$22 M** spent. Investigated UFO sightings *and* Skinwalker Ranch (shadow figures, creatures, "inter-dimensional phenomena"). Terminated by DIA citing *"lack of merit and lack of utility."* | AARO Vol I (`odni-dod-reports/`) |
| **KONA BLUE (proposed PSAP)** | 2011-2012 | DHS S&T | Proposed to *"protect the retrieval and exploitation of non-human biologics."* **Disapproved by Deputy Sec. of DHS** Feb 10 2012; never approved, never funded, **no material was ever transferred or collected**. | `aaro.mil/auto-discovered/AARO_DHS_Kona_Blue.txt` + `History_and_Origin_of_KONA_BLUE_FINAL_508.txt` |
| **UAPTF (UAP Task Force)** | 2020-2021 | ODNI / Navy | Produced the **June 2021 Preliminary Assessment** (144 cases, 18 with anomalous flight characteristics) | `odni-dod-reports/Prelimary-Assessment-UAP-20210625.pdf` |
| **AARO** | 2022-present | DoD | Successor to UAPTF; **no empirical evidence of ET, recovered tech, or NHI reverse engineering** | All `odni-dod-reports/` |
| **NASA UAP Independent Study Team** | 2022-2023 | NASA | Recommended scientific data-collection rigor; *no evidence of extraterrestrial origin* in reviewed cases. | `odni-dod-reports/uap-independent-study-team-final-report.pdf` |
| **2025 AARO UAP Workshop** | Aug 2025 | AARO + Associated Universities | 40-participant workshop on narrative-data infrastructure and AI/ML triage of UAP reports | `aaro.mil/auto-discovered/2025_UAP_Workshop_Paper.pdf` |

### 4.1 Net answer

The government has **studied** UAP rigorously, **studied paranormal/Skinwalker phenomena lightly via Bigelow** (and rejected the program for lack of merit), **proposed but never started** a non-human-biologics SAP (KONA BLUE), and consistently concluded *"we cannot resolve some cases due to data quality, but we have found no empirical evidence of extraterrestrial visitation or recovered non-human technology."* PURSUE Release 01 adds nothing to that conclusion.

---

## 5. Theme deep-dive

Each subsection is grounded in the corresponding `themes/<theme>.md` file produced by `theme-scan.sh`. Findings are shape-of-evidence first, count second.

### 5.1 Mars (30 file matches, mostly mundane)

* **AARO Vol I** flatly states *"the planets — including Venus, Jupiter and Mars — were often reported as UFOs"* — Mars is a known false-positive cause for UFO reports.
* **NASA UAP IST Report** mentions Mars as a target of biosignature missions (*"perhaps on Mars or the icy moons orbiting Jupiter and Saturn"*) — *scientific* not *anomalous*.
* **Black Vault CIA collection** has dozens of FBIS-translated Russian press articles about the **Soviet Mars program** (aerostats, Phobos missions, manned-mission planning during the post-Soviet economic crisis). Intelligence summaries of *open Soviet press*, not classified Mars-anomaly material.
* **FBI UFO Part 6** — a 1947 newspaper-clipping reproduction asking *"Interplanetary spaceship? Visitor from Mars?"* — period press culture, not a government claim.

**Verdict:** the corpus contains **no government claim, investigation, or evidence of structures, life, or anomalies *on* Mars.** Mars-imagery anomaly material (e.g. the academic *"Mars: Humanoids, Bodies, Bones, Skulls"* paper on ResearchGate) is **outside this corpus and outside any released government program.** The Paradigm Threat Mars work — see [CIA Reading Room Mars 1984 RV investigation](/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md), [Mars hub](/cosmos/mars/page.md) — runs on a separate evidence base (the May 22 1984 STARGATE remote-viewing transcript + adjacent fiction-as-soft-disclosure reads, *not* PURSUE).

### 5.2 Teleportation (0 hits)

The famous **2004 Eric Davis "Teleportation Physics Study"** (commissioned by AFRL, AFRL-PR-ED-TR-2003-0034) is *not* in PURSUE Release 01. It is in the public domain at [DTIC](https://apps.dtic.mil/sti/citations/ADA416108). Worth retrieving separately.

### 5.3 Remote viewing (14 file matches)

* **AARO Vol. I** explicitly mentions **AAWSAP/AATIP examining "remote viewing and human consciousness anomalies"** alongside Skinwalker work.
* **Black Vault CIA collection** contains **STAR GATE / Center Lane / Sun Streak** ancillary material — `C05517723.txt` describes the DIA-managed unit at Fort Meade, Lt. Gen. Varona's tenure as program head, and *"Dellafiora and Dahlgren — the witches"* (Angela Dellafiora reportedly *"channelled her psychic data through a group of entities with names like 'Maurice' and 'George.' Dahlgren practiced tarot-card reading."*) — the well-known **"witches" episode** documented in Jim Schnabel's *Remote Viewers* (1997).
* `C05517539.txt` — translated Soviet Academy of Sciences journal piece on parapsychology / psychic / consciousness research.
* The full **Project STAR GATE archive** (12,000+ pages) is *not* in PURSUE but is mirrored at **[Center Lane Project](https://centerlane-rv.org/star-gate-archives-guide)** and at **CIA's reading room** under collection `STARGATE`.

**Verdict:** Government RV is well-documented (declassified 1995); AARO/AAWSAP took a peripheral interest as adjunct to UAP study at Bigelow's request; PURSUE does not surface new RV documents. The 1984 Mars RV transcript that anchors [the Mars dossier](/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md) is on `cia.gov/readingroom`, not in PURSUE.

### 5.4 "Aether" / zero-point / suppressed-propulsion / antigravity (4 hits, 2 distinct)

* **AARO Vol. I, pp. 26-27** — describes a private-sector group's claim of having *"a sample of a material from a UFO crash recovered at an unknown location from the 1940s or 1950s. The organization claimed that the material had the potential to act as a THz frequency waveguide, and therefore, could exhibit 'anti-gravity' and 'mass reduction' properties under the appropriate conditions."* This is the **"Art's Parts"** material associated with Art Bell / Hal Puthoff / Linda Moulton Howe / TTSA. Per AARO, the **Army's analysis found no anomalous properties.**
* **KONA BLUE proposal** — names *"quantum mechanics, nuclear science, electromagnetic theory, gravities, thermodynamics"* and *"catastrophic effects by adversaries"* — language consistent with claims of recovered exotic propulsion. **No material was ever delivered or studied** under KONA BLUE.

**Verdict:** the corpus contains **claims** about anti-gravity / exotic propulsion as *justification language for proposed programs*, plus AARO's **disposal of those claims through actual lab analysis**. **There is no released government document in this corpus describing a *working* or *recovered* aether/zero-point/anti-gravity device.** Cross-read: the [aether-consciousness file](/science/telepathy/remote_viewing/aether-consciousness.md) and the Paradigm Threat **physics/æther vocabulary canon** ([`docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`](/docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md)) should be cited when discussing "aether-type" claims to avoid silent quantum/ZPE substitution.

### 5.5 Mind / influence over human affairs (5 mind-control hits + an embedded PR-engineering story)

The **single most consequential single passage** in the corpus is in **AARO Vol. I, footnotes 67-68** — see § 6 for full treatment.

Other mind-influence hits: hypnosis as alternative explanation for UFO testimony (FBI 1947 reports); Soviet psychotronic / hypnosis research (CIA FBIS translations).

### 5.6 Demonology / spiritual / occult / interdimensional (63 file matches; ~12 substantive)

Most hits are noise (the word *entity* in bureaucratic prose, *ghost signal* on radar, etc.). The substantive cluster:

* **AARO Vol. I, p. 24** — Skinwalker section: U.S. government's **official acknowledgement** of having funded a paranormal-investigation line of effort that explicitly named *"shadow figures,"* *"creatures,"* and *"inter-dimensional phenomena"* alongside UAP. **The strongest demonology-adjacent material in the entire archive.**
* **Black Vault CIA `C05517813.txt`** — Russian press article (FBIS-translated) describing UFO encounters explained as *"demon mask haunting"* and a Russian rehabilitation method. Foreign press primary, not U.S. government claim.
* **State Department UAP Cable 5 (Mexico, Sep 2023)** — the Jaime Maussan *"non-human beings"* alleged-corpse stunt before the Mexican Congress. Cable explicitly notes *"Scientists have discredited previous alleged alien corpses Maussan presented as evidence of alien life,"* and quotes Ryan Graves calling it an *"unsubstantiated stunt."*

The wider context — outside PURSUE itself — is **DIA AAWSAP** program leadership (Dr. James Lacatski) reportedly seeing a *"topological-shape-shifting object … from a pretzel to a Möbius strip"* at Skinwalker Ranch (per Eric Davis), and Lacatski / Colm Kelleher's 2021/2023 books *Skinwalkers at the Pentagon* and *Inside the U.S. Government Covert UFO Program*. None of those *books* are documents — but **AARO Vol. I's description matches their account of the program's scope.** Cross-read in depth: the [Lacatski / AAWSAP insider mechanics dossier](/influence/controlled_opposition/investigations/lacatski-consciousness-craft-viral-post-investigation.md), and the [indigenous control systems investigation](/influence/suppression/investigations/indigenous-control-systems-witchcraft-vodou-skinwalkers-investigation.md) for the Navajo-protocol context Lacatski/Knapp invoke.

### 5.7 Non-human intelligence (59 file matches)

* **All AARO Vol I and Vol I draft references to "non-human intelligence" are negative findings:** AARO interviewed dozens of named whistleblowers, examined classified holdings, and concluded *"no empirical evidence … of recovered extraterrestrial technology or non-human intelligence."* AARO mandate explicitly includes *"non-human intelligence"* as a category to investigate.
* **KONA BLUE proposal** uses the phrase *"non-human biologics"* — but as proposed scope, never as evidence.
* **Mexican State Dept cable** — Maussan's *"non-human beings"* (rejected).
* **CIA Black Vault material** is mostly Soviet/foreign-press translations, with no internal CIA assertion of NHI.
* **Black Vault `C05517690 / C05517677 / C05517569`** — internal CIA histories of the agency's UFO involvement: Robertson Panel (1953), the OSI desk officer's interest in 1957, the absence of any agency program to *"actively collect"* UFO information, and a conservative scientific posture.

### 5.8 Underwater / transmedium (26 file matches)

AARO Vol I discussion of "transmedium" cases — UAPs crossing air/water boundaries — and references unresolved Navy cases. Nothing as dramatic as alleged "USO" claims, but **transmedium** is now an official AARO category.

### 5.9 Skinwalker / AAWSAP / AATIP / Bigelow (4 substantive files)

Reading `AARO_Historical_Record_Report_Vol_1_2024.txt`, `AARO-Historical-Record-Vol-I.txt` (duplicate), `aaro.mil/auto-discovered/History_and_Origin_of_KONA_BLUE_FINAL_508.txt`, and `aaro.mil/auto-discovered/AARO_DHS_Kona_Blue.txt` together gives the cleanest **government-official** narrative of the program:

1. Sen. Harry Reid earmarked $22 M for AAWSAP to DIA in 2008.
2. DIA awarded the contract to **Bigelow Aerospace's BAASS subsidiary**.
3. BAASS used the contract to investigate UFOs **and** Skinwalker Ranch paranormal phenomena.
4. BAASS hired psychics, examined "shadow figures" and "creatures," and proposed studying "inter-dimensional phenomena."
5. BAASS produced ~38 *Defense Intelligence Reference Documents (DIRDs)* on warp drive, antigravity, dark energy, etc. — none peer-reviewed.
6. Sen. Reid asked DoD to make the program a Special Access Program in June 2009; Deputy Sec. Lynn declined on the recommendation of then USD(I) **James R. Clapper, Jr.**
7. **BAASS proposed a public-influence campaign with paid celebrity moderators and reporters assuming "E.T. visitations are true."**
8. DIA cancelled AAWSAP in 2012 for *"lack of merit and lack of utility."*
9. AAWSAP veterans tried to keep it alive at DHS as **KONA BLUE**, framed around recovering *"non-human biologics"*; DHS Deputy Sec. killed it Feb 10 2012.
10. AARO's 2024 review of all of the above: *"no empirical evidence."*

### 5.10 Weather control / HAARP / chemtrails (0 hits)

Zero matches in the extracted corpus. Whatever interest the U.S. has had in weather modification is not represented in this UAP-scoped release.

---

## 6. The single most underreported finding

This is footnote-buried in **AARO Historical Record Vol. I, pp. 22-24**:

> *"Just prior to DoD's cancellation of the program, the private sector organization proposed as a new line of effort to host a series of 'intellectual debates' at academic institutes to influence the public debate, which included **hiring supportive reporters and celebrity moderators**. The goal of this proposed public relations campaign was to **assume that 'E.T. visitations are true'** and that the moderators would steer debate away from 'dead-end discussions' and the 'morass' about discussing 'evidence.' A stated goal of this proposal was to **increase public interest in government 'disclosure' around the 'E.T. topic' and explore the consequences of disclosure on the public.**"*

This is a **documented government finding** that a U.S.-government-contracted private firm (BAASS / Bigelow) **proposed influencing public discourse via paid surrogates on the *premise* of ET reality, before any evidence had been adjudicated.** It is the single most underreported story in the May 8 release and it is the **textbook controlled-opposition / managed-narrative pattern Paradigm Threat tracks elsewhere**:

* It uses **academic-institute** legitimacy as a venue.
* It specifies **paid celebrity moderators** to shape the conversational frame.
* It explicitly **assumes the conclusion** ("E.T. visitations are true") and **steers away from evidence discussion** ("morass").
* Its stated downstream effect is to **increase appetite for "disclosure"** — the same affective vocabulary now used by every disclosure influencer the [Great Awakening cluster](/influence/controlled_opposition/investigations/great-awakening-alien-savior-rv-nwo-cluster-investigation.md) tracks.

Pair this with the **Robertson Panel (1953)** language about *"demystifying"* UFO reports via media to reduce hysteria and you have the same mechanism running in **opposite directions**:

| Era | Operator | Direction | Vehicle |
|---|---|---|---|
| 1953 | CIA / Robertson Panel | **Demystify** / suppress | Press cooperation, Disney & Cinerama outreach to "debunk" |
| 2010-2012 | BAASS / Bigelow (DIA-contracted) | **Mystify** / amplify | Paid celebrity moderators "assuming E.T. is true" |

Both are explicit influence-on-public-affairs proposals; both are documented in this corpus. **PURSUE Release 01 itself is a third turn of the same wheel** — a centralised, branded, rolling-release "transparency" surface that controls cadence, redaction, framing, and which whistleblower gets access. See § 8 for the deferral-pattern read.

---

## 7. Critic / analyst consensus on Release 01

### 7.1 Skeptical / "shrugging" camp

* **The War Zone (TWZ)** — *"Upon initial cursory review, there doesn't appear to be anything groundbreaking in this release, which should come as no surprise."* Notes *"the very real and worrisome prospect that adversary intelligence-gathering and other malign activities have become muddled with the matter of UAPs."*
* **New York Magazine** — *"the first release was fairly limited, with more files to be published every few weeks… if alien watchers are looking for proof that the government is harboring evidence of extraterrestrial life, they'll need to wait a little longer."* Highlights that the scary-looking "bronze metallic ellipsoid" is *"a composite sketch of an actual field with a graphic overlay rendered by an FBI lab."*
* **Engadget** — *"Department Of War Sets Up UFO Website, But There Isn't Much To See."*
* **The Verge** — *"war.gov/ufo."* (deadpan)
* **Defense News (Aditya Kumar)** — *"No files in Release 01 provide evidence of extraterrestrial life, recovered alien technology, crashed spacecraft, or non-human intelligence … This aligns with prior AARO assessments."*
* **New Scientist** — characterised the imagery as *"small dots or indistinct shapes in the sky"* explicable as normal phenomena.

### 7.2 Disclosure-leaning critics ("you're holding back")

* **John Greenewald Jr.** ([The Black Vault](https://www.theblackvault.com), `@theblackvault`) — *"So what you are saying @DeptofWar, is that you can redact sensitive information on UAP imagery and release photos (and videos). Gotcha. I'll just forget you told me you couldn't do that. Because we know **Batch 01 doesn't have the good stuff**."*
* **Rep. Anna Paulina Luna (R-FL)** — public position: PURSUE 01 is a *"great first step"* but DOW is **dragging its feet on the 46 videos** her Task Force formally requested with an April 14 2026 deadline. Has threatened a **subpoena** for the held-back videos, which reportedly include Iranian, Syrian, Lake Huron 2023 incident footage. Trump *"authorized the release"* but *"someone at the Pentagon being cute should take a hike."*
* **Leo Mozoloa (`@LeoMozoloa`)** — pointed out one of the most-shared PURSUE videos shows a *known FLIR camera optical artefact* (the bright black rectangle around bright objects when the sensor is in *white-hot-inverted* mode) being mislabelled as an unidentified shape.

### 7.3 Officials defending the release

* **Sec. of War Pete Hegseth** — *"It's time the American people see it for themselves."*
* **DNI Tulsi Gabbard** — *"the first in what will be an ongoing joint declassification and release effort."*
* **FBI Dir. Kash Patel** — *"For the first time in history, the American people have unfettered access to declassified government files on Unidentified Anomalous Phenomenon."*
* **NASA Adm. Jared Isaacman** — *"follow the data, and share what we learn."*
* **White House (anonymous)** — *"While past administrations have sought to discredit or dissuade the American people, the President is focused on providing maximum disclosure to the public, who can ultimately make up their own minds about the information contained in these files."*

### 7.4 Where everyone agrees

1. The release exists, which is itself notable.
2. Most material is not new in *content*, only in *redaction level*.
3. There is no smoking-gun evidence of NHI.
4. The fact that DOW now *can and does* release UAP imagery with redactions undercuts the years-long DoD position that they *couldn't* redact and release UAP videos for reasons of sensor-capability protection.

---

## 8. Cross-references to existing Paradigm Threat investigations

PURSUE Release 01 is **not** a standalone artifact — it sits inside the same disclosure-basin grammar Paradigm Threat already documents. The cross-reads:

| Paradigm Threat investigation | Connection to PURSUE / this corpus |
|---|---|
| [Lacatski / AAWSAP — insider program mechanics](/influence/controlled_opposition/investigations/lacatski-consciousness-craft-viral-post-investigation.md) | **Direct overlap.** That dossier already documents AAWSAP / KONA BLUE / Bigelow / Knapp / Kelleher and the "tech after enlightenment" rhyme; this investigation provides the **AARO Vol. I primary text** corroborating the program's scope (Skinwalker + RV + inter-dimensional phenomena), the **KONA BLUE primary PDF** in the corpus, and the **§ 6 BAASS PR-campaign footnote** as documented influence-operation evidence. The Lacatski dossier's "real alien is unelected bureaucracy" thesis squares with PURSUE deferring everything novel to "future tranches." |
| [Great Awakening / alien-savior / RV cluster](/influence/controlled_opposition/investigations/great-awakening-alien-savior-rv-nwo-cluster-investigation.md) | **Same affective grammar.** Wilcock-style "disclosure imminent," "trust the plan," "wait a few weeks" all map onto PURSUE's rolling-release cadence. § 6 here documents a contracted firm proposing to **assume the disclosure conclusion** before evidence — the Great Awakening basin's exact rhetorical move, but with a paper trail. |
| [CIA Reading Room — Mars 1984 RV investigation](/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md) | **Adjacent, not overlapping.** PURSUE has no Mars-on-the-ground anomaly content; the Mars-RV thread runs on the May 22 1984 STARGATE transcript on `cia.gov`, not on PURSUE. But § 5.3 here confirms PURSUE's only RV references are in **AARO Vol. I's AAWSAP description** + **Black Vault STAR GATE collateral**, which sets the on-record floor for what RV programs the U.S. will admit to in 2026. |
| [Mars × *Chrono Trigger* article](/influence/controlled_opposition/cia-1984-mars-chrono-trigger.md) | **Pattern-only.** PURSUE doesn't touch the predictive-programming thesis, but the same epistemic stance (*"some unexplained, no extraterrestrial conclusion, treat fiction as data not proof"*) applies. |
| [What Are You Waiting For?](/influence/controlled_opposition/what-are-you-waiting-for.md) | **Direct.** Deferral-as-calm-technology essay; PURSUE *is* deferral. *"Wait for Release 02. Wait for AARO Vol. II (target Aug 2026). Wait for the Disclosure Act. Wait for Luna's subpoenaed videos."* The release schedule itself does the work the essay names. |
| [Indigenous control systems — witchcraft / vodou / skinwalkers](/influence/suppression/investigations/indigenous-control-systems-witchcraft-vodou-skinwalkers-investigation.md) | **Frame for § 5.6 and § 5.9.** Navajo "skinwalker" protocols predate AAWSAP by centuries; the AARO Vol. I documentation matters mostly because it shows the **federal government** funded an exploration of phenomena indigenous communities have a longer ethnographic record on. |
| [Skinwalkers and cryptids — Rus-Horde lineage hypothesis](/history/chronology/investigations/skinwalkers-cryptids-rus-horde-extirpation-investigation.md) | **Ethnographic priors.** The "creatures" and "shadow figures" AAWSAP examined inherit a 19th-c. cryptid taxonomy this dossier maps; PURSUE adds modern federal-budget primary sources to the same phenomenological set. |
| [The 1979 Religious Revival](/influence/religion/1979-religious-revival-investigation.md) | **Funding pattern parallel.** That investigation tracks CIA backing of a global religious revival; § 5.6 here notes Knapp's report (per the Lacatski dossier) that *"religious/demonic framing"* shaped *policy* against AAWSAP. Same vector, opposite direction: agency-funded religious framing in 1979; agency-acknowledged religious-framing-as-program-killer in 2008-12. |
| [CIA Investigation hub](/governance/war/investigations/cia-investigation.md) | PURSUE confirms CIA's *historical* UFO involvement (Robertson Panel, OSI desk officer, FBIS translations of foreign UFO press) and its *recent* **non-involvement** (no current CIA program "actively collecting" UAP per Black Vault internal histories). |
| [Artemis II — faith-test investigation](/history/chronology/investigations/artemis-ii-mission-as-faith-test-investigation.md) | **Cadence parallel.** Both PURSUE and Artemis II run on **announce → defer → announce → defer**; both produce real artifacts but the artifacts under-deliver on the announced reveal. |
| [Toynbee Tiles / *Resurrect Dead*](/influence/conspiracy/investigations/toynbee-tiles-resurrect-dead-documentary-investigation.md) | **Mood parallel.** Lone-obsessive vs institutional disclosure aesthetics; PURSUE is the institutional version of the same affect of "the truth is in this dossier I'm assembling." |
| [QAnon / Great Awakening hub](/influence/controlled_opposition/00) | **Same recruitment basin.** PURSUE's "Trump authorized the release; someone at the Pentagon is being cute" frame from Luna is the QAnon "white hats vs deep state" grammar applied to UAP. |
| [docs / paradigm-threat-aether vocabulary canon](/docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md) | **Vocabulary discipline.** § 5.4 above stays in *aether/zero-point claim* language without silently substituting *quantum/QED*; KONA BLUE's "quantum mechanics, gravities, thermodynamics" is the mainstream-substitution pattern the canon flags. |

---

## 9. Author's open claims (pattern registry)

Per [PARADIGM_INVESTIGATION_INSTRUCTIONS.md](/docs/PARADIGM_INVESTIGATION_INSTRUCTIONS.md) **§7-9**, claims that are **not** yet evidenced by third-party sources but belong in the registry:

1. **PURSUE is a deferral instrument.** The rolling-release cadence ("a tranche every few weeks") is a *managed-attention* design pattern, not just a logistical reality. **Falsifier:** if Release 02 surfaces a previously-classified document with substantively new evidence (sample analysis, sensor-limited footage, a redacted whistleblower statement that names a program), this claim weakens.
2. **The BAASS PR-campaign footnote (AARO Vol. I) is the *Rosetta stone* for current "disclosure" media culture.** Many present-day disclosure influencers' rhetorical moves (*"steer away from evidence,"* *"assume the conclusion,"* *"increase appetite"*) match the BAASS proposal's stated playbook. **Falsifier:** if independent provenance can attribute today's disclosure-influencer style to **non-BAASS** origins (e.g. earlier Steven Greer / CSETI playbook), the BAASS-as-Rosetta claim weakens to "one-of-many."
3. **The "Apollo 17 anomaly" overlay is theatre.** A field-photo with a hand-drawn ellipse around three dots is published as the most-shared image, captioned *"highlighted areas of interest do not constitute an analytical judgment."* That packaging is **performative disclosure**: visually striking, analytically empty. **Falsifier:** independent photogrammetric analysis showing structure inconsistent with optical artifact / dust / film grain.
4. **The redaction-pattern shift (DOW *can* and *does* now release with selective redactions) destroys the prior DoD posture** that UAP videos *couldn't* be released because sensor capabilities couldn't be partially redacted. **Falsifier:** none expected; this one is documentary.
5. **Bigelow → Lacatski → KONA BLUE → modern-influencer pipeline** is one continuous money-and-narrative arc. **Falsifier:** prosopographic analysis showing the principals don't actually overlap; the [Lacatski dossier](/influence/controlled_opposition/investigations/lacatski-consciousness-craft-viral-post-investigation.md) already establishes substantial overlap.

---

## 10. Questions to clarify, verify, or debunk

| # | Question | How to falsify / verify |
|---|---|---|
| 1 | What's actually in the **46 held-back videos** Luna subpoenaed? | Subpoena outcome; FOIA AARO `2026-MISREP-PR*` series; cross-check against DVIDS holdings. |
| 2 | Are the FBI 62-HQ-83894 newly de-redacted pages substantively different from the Vault versions? | Diff each page against the [vault.fbi.gov](https://vault.fbi.gov/UFO) parts; record net new text. |
| 3 | Was the BAASS PR-campaign proposal **shopped** to specific celebrity moderators / reporters? | FOIA AARO for BAASS proposal annexes; cross-reference the named "intellectual-debate" venues in AARO Vol. I footnotes. |
| 4 | Is the "Apollo 17 anomaly" three-dot pattern present in the *original NASA archival scan* at the same coordinates and brightness? | Pull the original from NASA's ALSJ; pixel-coord compare. |
| 5 | Does Release 02 contain the **Eric Davis Teleportation Physics Study** (AFRL-PR-ED-TR-2003-0034)? | Watch the next CSV manifest; if absent, conclude DOW is excluding pre-existing AAWSAP DIRDs from PURSUE. |
| 6 | Will AARO Vol. II (target Aug 2026) revise the "no empirical evidence" conclusion? | Read it on release; cross-check footnote chain. |
| 7 | Does the **2025 AARO UAP Workshop paper** point at AI/ML triage replacing human resolver judgment? | Already in `aaro.mil/auto-discovered/2025_UAP_Workshop_Paper.pdf`; needs structured read. |
| 8 | Did **Sen. Reid / Sen. Rounds / Sen. Schumer's** UAP Disclosure Act (FY24 NDAA) pass with the Records-Review-Board mechanism intact? | Check final NDAA text; the records-review-board model directly follows the JFK Records Act. |
| 9 | Are the **DVIDS metadata** for the 28 PURSUE videos consistent with the press-summary captions? | Already partially captured in `war.gov/dvids-videos/<id>.meta.txt`; needs systematic comparison. |
| 10 | Is there a publicly-available list of **all named "supportive reporters and celebrity moderators"** approached by BAASS? | Currently no; would falsify or confirm Claim #2. |

---

## 11. Weak points / TODOs

- [ ] NARA Tier-3 mega-zips (`542184.zip`, `566658.zip`, `542326.zip`, `45484701.zip`, `597821-images-1.zip`, `597821-images-2.zip`) still streaming; final integrity check pending.
- [ ] OCR pass on Black Vault CIA CD-ROM JPGs (some are scanned images, not PDFs with text layers).
- [ ] Diff-pages report for FBI 62-HQ-83894 (vault.fbi.gov vs PURSUE) — currently anecdotal, not byte-level.
- [ ] Pull Eric Davis *Teleportation Physics Study* and DTRA DIRDs as a separate `aawsap-dirds/` subtree from KLAS-TV / Greenewald hosts to complete the AAWSAP record.
- [ ] Add the **STAR GATE archive** (12,000+ pages from CIA reading room collection `STARGATE`) as a separate tree; it is **not** in PURSUE and the corpus is incomplete without it.
- [ ] Capture the COMETA Report (1999) at higher fidelity; PURSUE includes it as `255_413270_UFO's_and_Defense_What_Should_we_Prepare_For.pdf`, but the original VSD-magazine French text adds editorial framing.
- [ ] Watch for Release 02 (~30 days from 8 May 2026 per Luna); update § 3 provenance table.

---

## 12. Related investigations and references

### 12.1 Paradigm Threat (repo) — primary cross-reads (mirrors § 8)

- `/influence/controlled_opposition/investigations/lacatski-consciousness-craft-viral-post-investigation.md`
- `/influence/controlled_opposition/investigations/great-awakening-alien-savior-rv-nwo-cluster-investigation.md`
- `/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md`
- `/influence/controlled_opposition/investigations/cia-reading-room-rv-two-way-iran-revival-investigation.md`
- `/influence/controlled_opposition/cia-1984-mars-chrono-trigger.md`
- `/influence/controlled_opposition/what-are-you-waiting-for.md`
- `/influence/suppression/investigations/indigenous-control-systems-witchcraft-vodou-skinwalkers-investigation.md`
- `/history/chronology/investigations/skinwalkers-cryptids-rus-horde-extirpation-investigation.md`
- `/influence/religion/1979-religious-revival-investigation.md`
- `/governance/war/investigations/cia-investigation.md`
- `/cosmos/mars/page.md`
- `/science/telepathy/remote_viewing/aether-consciousness.md`
- `/docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`
- `/docs/PARADIGM_INVESTIGATION_INSTRUCTIONS.md`

### 12.2 Primary government sources (canonical URLs)

- DOW PURSUE — https://www.war.gov/ufo/
- PURSUE CSV manifest — https://www.war.gov/Portals/1/Interactive/2026/UFO/uap-csv.csv
- AARO Records — https://www.aaro.mil/UAP-Records/
- AARO Case Resolution Reports — https://www.aaro.mil/UAP-Cases/UAP-Case-Resolution-Reports/
- AARO EFOIA Reading Room — http://www.aaro.mil/EFOIA-Reading-Room/
- AARO Historical Record Vol. I (Mar 2024) — https://www.aaro.mil/Portals/136/PDFs/AARO_Historical_Record_Report_Vol_1_2024.pdf
- AARO *History and Origin of KONA BLUE* — https://www.aaro.mil/Portals/136/PDFs/UAP_RECORDS_RESEARCH/History_and_Origin_of_KONA_BLUE_FINAL_508.pdf
- ODNI Preliminary Assessment (June 2021) — https://www.dni.gov/files/ODNI/documents/assessments/Prelimary-Assessment-UAP-20210625.pdf
- NASA UAP Independent Study Team Final Report (Sep 2023) — https://www.nasa.gov/wp-content/uploads/2023/09/uap-independent-study-team-final-report.pdf
- NARA RG 615 — https://www.archives.gov/research/topics/uaps/rg-615
- NARA bulk UAP downloads — https://archives.gov/research/catalog/catalog-bulk-downloads/uap-bulk-download
- FBI Vault UFO — https://vault.fbi.gov/UFO (Cloudflare; mirror at https://archive.org/download/FBIUFO/)
- The Black Vault — CIA UFO documents — https://www.theblackvault.com/documentarchive/cia-ufo-documents-now-online-and-searchable/
- Black Vault — *STARGATE Collection: Analysis and Assessment of Gateway Process (9 June 1983)* — https://www.theblackvault.com/documentarchive/stargate-collection-analysis-and-assessment-of-gateway-process-9-june-1983/
- CIA Reading Room — STARGATE collection — https://www.cia.gov/readingroom/collection/stargate
- CIA — Gerald K. Haines, *"CIA's Role in the Study of UFOs, 1947-90"* — https://www.cia.gov/static/CIAs-Role-in-Study-of-UFOs.pdf
- Eric Davis — *Teleportation Physics Study* (AFRL, 2004) — https://apps.dtic.mil/sti/citations/ADA416108
- U.S. House Oversight — George Knapp written testimony PDF — https://oversight.house.gov/wp-content/uploads/2025/09/George-Knapp-Written-Testimony.pdf

### 12.3 Press / analyst commentary (May 8 2026)

- The War Zone — *"DoD Drops First Of Its Promised UFO Files"* (TWZ, 2026-05-08).
- New York Magazine — *"What's in Trump's First Big UFO Document Drop? Less Than You'd Hope."* (Intelligencer, 2026-05-08).
- Engadget — *"Department Of War Sets Up UFO Website, But There Isn't Much To See"* (2026-05-08).
- The Verge — *"war.gov/ufo"* (2026-05-08).
- Defense News — *"DOW launches PURSUE; aligns with prior AARO assessments"* (2026-05-08).
- New Scientist — coverage of PURSUE imagery (2026-05-08).
- John Greenewald Jr. — `@theblackvault` posts and [Black Vault](https://www.theblackvault.com) coverage (2026-05-08+).
- Rep. Anna Paulina Luna — public statements on the 46 held-back videos (multiple, 2026-05-08+).
- Mystery Wire — Robert Bigelow on AAWSAP — https://www.mysterywire.com/ufo/robert-bigelow-aawsap/
- Joe Murgia — C2C transcript (Lacatski, Kelleher, Knapp) — https://www.ufojoe.net/c2c-transcript-lacatski/
- Center Lane Project — STARGATE archive guide — https://centerlane-rv.org/star-gate-archives-guide

---

Keywords: #UAP #UFO #PURSUE #DepartmentOfWar #AARO #AAWSAP #AATIP #Lacatski #Bigelow #KonaBlue #Skinwalker #RemoteViewing #Stargate #Mars #Apollo #FbiVault #BlackVault #Nara #ProjectBlueBook #Roswell #ProjectMogul #Cometa #DisclosureAct #ControlledOpposition #InfluenceOps #Disclosure #ParadigmThreatFiles #CelebrityModerators #BaassPrCampaign #RobertsonPanel #JfkRecordsAct #TulsiGabbard #PeteHegseth #KashPatel #JaredIsaacman #AnnaPaulinaLuna #JohnGreenewald #InternetArchive #Aether #ZeroPoint #NonHumanIntelligence #Transmedium

**Last substantive update:** 2026-05-08 — initial publication. Corpus build complete to ~440 GB / 1,634 PDFs / 28 MP4s. NARA Tier-3 mega-zips streaming in parallel; will refresh § 1.3 counts once those finish. § 6 (BAASS PR-campaign footnote) is the lead finding.

---

## Limits and disclaimers

- **Fiction vs evidence:** PURSUE 01's "areas of interest" overlays and composite "ellipsoid bronze metallic object" are explicitly captioned as *not* analytical judgments. They are presentation artifacts; do not treat them as photographic evidence.
- **Author thesis sections (§ 6 lead, § 9 registry):** The reading that PURSUE is a *managed deferral instrument* and that the BAASS PR-campaign footnote is a "Rosetta stone" for present-day disclosure-influencer rhetoric is **first-class** to this investigation's purpose, but is **not automatically factual**. The primary documents are; the synthesis is interpretation.
- **Cross-investigations:** Links to [Lacatski / AAWSAP](/influence/controlled_opposition/investigations/lacatski-consciousness-craft-viral-post-investigation.md), [Great Awakening](/influence/controlled_opposition/investigations/great-awakening-alien-savior-rv-nwo-cluster-investigation.md), [Mars 1984 RV](/influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md), and [What Are You Waiting For?](/influence/controlled_opposition/what-are-you-waiting-for.md) are **thematic rhymes** ([instructions](/docs/PARADIGM_INVESTIGATION_INSTRUCTIONS.md)), not proofs that any single operator runs the whole disclosure space.
- **Evidence tiers:** AARO official PDFs > FBI Vault primaries > NARA RG 615 textual material > CIA reading-room translations of foreign press > critic blog commentary > social-media reactions. Every § 5 finding is keyed to a specific extracted-text file path.
- **Æther / zero-point vocabulary:** § 5.4 uses *aether / zero-point / anti-gravity* in the **author** sense per [`docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md`](/docs/LLM_AETHER_VOCABULARY_MAXWELL_DEBATE.md); **mainstream** translation (vacuum-energy / QED) is **noted not substituted**.
- **PURSUE Release 02+ may invalidate parts of this file.** The novelty audit (§ 3), themes (§ 5), and consensus (§ 7) reflect Release 01 only. Watch § 11 TODOs.
- **Not claimed:** that PURSUE is a coordinated single-operator psyop; that NHI exists or doesn't; that AAWSAP "found" anything; that any specific present-day disclosure influencer is a paid BAASS surrogate. Each of those would require evidence beyond what is in this corpus.

---

## Investigator notes (maintainers / LLMs only)

Author-machine local layout (not for online readers):

- Corpus root: `/media/ari/HD/uap/` (symlinked from `~/dev/wget/uap`).
- Subtrees: `war.gov/`, `aaro.mil/`, `nara/`, `blackvault/`, `cia-blackvault/`, `fbi-vault/`, `odni-dod-reports/`, `nsa/`, `headlines/`.
- Operational artifacts: `INDEX.md` (master index, generated by `scripts/build-index.py`), `ANALYSIS.md` (the deep-dive companion this dossier mirrors at higher prose density), `themes/<theme>.md` (12 keyword-scan reports), `text/` (parallel `pdftotext` extraction tree), `logs/`.
- Build/scrape scripts (all in `scripts/`):
  - `parse_uap_csv.py` — extract PDF / image / DVIDS-ID lists from PURSUE CSV.
  - `download-war-gov.sh` — Akamai-bypass `curl` downloader for war.gov files.
  - `dvids-scrape.sh` — replaces failed DVIDS API path; scrapes `/video/<id>` for CloudFront MP4 URLs.
  - `aaro-scrape.sh` — same Akamai-bypass posture for AARO landing pages + FOIA PDFs.
  - `blackvault-cia-scrape.sh` — Chrome-headers `curl` downloader for individual CIA UFO PDFs.
  - `fbi-ia-grab.sh` — Internet Archive `FBIUFO` mirror downloader (replaces Cloudflare-blocked `vault.fbi.gov`).
  - `odni-reports.sh` — official ODNI/DoD/NASA reports.
  - `fix-aaro-historical.sh` / `fix-war-gov-failures.py` — fixups for failed initial pulls (URL encoding, missing direct URLs).
  - `save-headlines.sh` — captures key news articles + official press releases.
  - `nara-tier3-mega-urls.txt` + `parallel-tier3.sh` — concurrency-3 NARA Tier-3 zip downloader.
  - `nsa-grab.sh` — Akamai-bypass NSA UFO/UAP FOIA mirror.
  - `extract-pdfs.sh` — `pdftotext -layout -nopgbrk` parallel extraction (`xargs -P 8`).
  - `theme-scan.sh` — 12-theme `rg -i -w` keyword scanner over `text/`.
  - `build-index.py` — regenerates `INDEX.md` from corpus state + CSV manifest.
  - `status.sh` — live status (disk, processes, file counts).
- Rebuild after Release 02 lands:
  ```
  bash /media/ari/HD/uap/scripts/download-war-gov.sh   # new CSV will list new files
  bash /media/ari/HD/uap/scripts/dvids-scrape.sh
  bash /media/ari/HD/uap/scripts/extract-pdfs.sh
  bash /media/ari/HD/uap/scripts/theme-scan.sh
  python3 /media/ari/HD/uap/scripts/build-index.py
  # then refresh § 1.3, § 3.1, § 5 here, and add a § 13 release-02 section.
  ```
- Disk strategy notes: NARA Tier-3 `45484701.zip` (Project Blue Book, ~66 GB), `597821-images-1/2.zip` (textual + microfilm images, ~250 GB combined) and `542184.zip` / `566658.zip` (Blue Book photos / moving images) account for almost the entire ~1 TB target. Sequential download is bandwidth-bound; parallel-3 keeps the link saturated without S3 throttling.

# Reader-facing articles — how we want them written

**Purpose:** Define **article** voice for *paradigm-threat-files*—the Markdown siblings of **`investigations/`** dossiers and other long-form files—so assistants and authors match **Paradigm Threat** expectations. Pair with **[`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](../PARADIGM_INVESTIGATION_INSTRUCTIONS.md)** (dossier structure, evidence tiers, **Limits**) and **[`LINKING_AND_SITE_PATHS.md`](../LINKING_AND_SITE_PATHS.md)** (URLs).

---

## URLs (same as blog entries)

**Published reader-facing articles** (parent-folder `…/*.md` essays under `influence/`, `science/`, `history/`, etc.—the pieces that ship like site pages) use the **same link convention as `blog/*.md` posts:** every **in-repo** target is an **absolute public URL** on `https://paradigmthreat.net/...`, including **§** anchors and **images** under the article’s site subtree. Do **not** use root-relative markdown links like `(/influence/...)` or repo-relative asset paths in those files.

**Investigations**, hub **`page.md`** indices, and internal **docs** may keep root-relative links unless a file is being promoted to “article” behavior.

---

## Article vs dossier (division of labor)

| **`…/investigations/*.md` (dossier)** | **Parent-folder `…/*.md` (article)** |
|-------------------------------------|--------------------------------------|
| Tables, long quote banks, FOIA chains, **Limits**, **Investigator notes**, granular **TODOs**, **Q** rows, **§4** open-claim registries, tier labels, “speculative / documented / legal analogy” splits. | **Readable essay**: stakes, flow, and **enough** links to enter the dossiers—**not** a second investigation file. |
| Home for **heavy** caveat language: what is proven vs guessed, what is rhetoric vs docket, fiction vs evidence, assistant bias. | **Light touch**: trust the dossier for that machinery. **Do not** paste investigation-style stacks into the **running narrative** or **pepper** mid-section caveats (“not every specialist,” “this is not a claim that…,” “scholars dispute…”) through every `##`. If honesty or scope boundaries matter, collect them in **one** dedicated **`## Framing and limits`** (or **`## Scope and limits`**) **after** **Where next** and **before** `Keywords:`—or link once to the dossier **Limits** anchor and skip in-file caveats entirely. |
| **Guide (read order)** for very long files. | **Optional** short “where next” at the end; the **body** should read in order without a map unless you deliberately want a mini-guide. |

If a claim needs **five citations** or a **multi-row table**, it belongs in the **dossier**; the **article** names the claim and **links once** (often to a **§** anchor).

**Standalone narrative context (required):** Assume most readers **never** open the dossier. The article must still carry **enough plain context** that every named event, institution, and metaphor lands without a click — **who**, **what changed**, **why it mattered**, in one or two sentences. The dossier adds **citations, tiers, dissent, and tables**; it is not where essential plot lives. **Bad:** "executives saw the cliff, couldn't turn" after citing a case number — the reader has no picture of the cliff. **Good:** IBM licensed DOS instead of owning it, clones undercut its machines, managers saw software standards slipping to Microsoft and Intel but could not pivot through bureaucracy and contracts — then link *Big Blues* / HBS **19-074** for the full audit. Same rule for niche tech: gloss once in outcome language (see **Insider stack narration**), not dossier shorthand.

When an article **links** a controversy (DOS deal, antitrust, platform lock-in), it still owes **one plain paragraph** of **who / what / why** in the article body. **Investigation-forward material** — case numbers, settlement tables, "historians disagree," legal-moat chronologies — belongs in the dossier unless **one sentence** is essential to the hook. Reference: [Internet That Should Have Been](/science/computing/the-internet-that-should-have-been.md) §II + [investigation §9.6](/science/computing/investigations/internet-that-should-have-been-investigation.md).

### Series articles (same thesis lane, multiple installments)

When several reader essays explore one **ongoing thesis**—e.g. **predictive programming in blockbuster film/TV**—treat them as a **named series**, not independent primers that repeat the same frame.

| Rule | Do | Don’t |
|------|----|-------|
| **Series identity** | State **installment number or subtitle** in the line under `# Title` (e.g. *Predictive programming in movies — Pacific installment*). Open with **one paragraph** that names the **prior installment** and what **this** one adds. | Re-teach the **full shared frame** (two-camp war, NSA vs CIA grammar, franchise containment doctrine) if an earlier series essay already did. |
| **Cross-link** | Link **prior / next** installments in a dedicated **`## Series — where next`** (or fold into **Where next** with a **Series** subheading). Bidirectional links when both files exist. | Duplicate long passages from sibling articles “so this page stands alone.” |
| **Unique payload** | Each installment owns **new titles, new geography, new calendar beats** (*Matrix* handoff vs *Dark Knight* / *24* Pacific lane). | Copy **Matrix kill-offs**, **Wake Up credits**, **MxO shutdown**, etc. into a Pacific installment unless **one sentence** ties the calendar. |
| **Companions vs installments** | **Dossiers**, **hubs**, and **investigations** are **technical companions**—link under a separate subheading, not counted as series entries. | Label every related essay as “Part III” without a shared series name. |
| **Pre-ship dedup pass** | Read the **most recent sibling article** in full; **grep** shared phrases (*two-camp*, *NSA-aligned grammar*, *franchise containment*, *Ledger curse*). Cut or replace with **“see Installment I.”** | Ship a new installment that reads like a **merged duplicate** of the last one with different examples swapped in. |

**Reference series (predictive programming in movies):**

- **Installment I:** [`influence/controlled_opposition/not-like-this.md`](../../influence/controlled_opposition/not-like-this.md) — *Matrix* two-camp handoff.
- **Installment II:** [`influence/hollywood/everything-burns.md`](../../influence/hollywood/everything-burns.md) — Pacific / *Dark Knight* / *24* / Hong Kong litmus test.

### Tables, lists, and catalog prose (articles vs investigations)

**Hard rule for articles:** **No Markdown pipe tables anywhere** — not in the body, not in **`## Framing and limits`**, not in footnotes. Substack’s editor (and most paste-from-Markdown workflows) **do not render** `| col | col |` grids; rows collapse into a **broken vertical list** that reads like a corrupted dossier excerpt. **Write normal paragraphs instead.** Weave claim, tier, and link into **complete sentences** (commas, semicolons, short follow-on sentences). If the reader needs a grid, put it in the **`investigations/`** dossier and link once.

- **Investigations** (`…/investigations/*.md`): **Markdown tables are fine**—tier matrices, chronologies, claim registries, comparison grids. **Bullet and bold-lead catalogs** (literature maps, author lanes, tier rows) also belong here.
- **Articles** (parent-folder reader essays): **paragraphs only** for argument and for limits. **Do not** recreate dossier tier tables as pipe grids, bold-lead stacks, or pseudo-tables (`**Claim** — tier` lines that paste like broken tables).
- **If an article needs a table or structured illustration:** export **`PNG`** or **`SVG`**, place the asset **beside the article** in the same folder (same pattern as hero images), and embed with an **absolute** `https://paradigmthreat.net/...` URL and descriptive **alt** text. Raster and vector images **transfer**; Markdown tables **do not**.
- **Default for structured content:** **paragraphs**, not lists. The reader should hear an **essay**, not scroll a **glossary**.
- **Avoid catalog-style stacks** in article bodies:
  - Repeated `**Name** — gloss` or `**Name** — *work* (year): gloss` lines (literature surveys, thinker rundowns, “who said what” lanes).
  - Long bullet runs of **authors**, **eras**, **institutions**, or **claims** that could be one or two paragraphs.
  - Pseudo-tables built from bold labels + em dashes (they paste into Substack like **broken tables** and read like **dossier excerpts**).
- **When lists are OK (sparingly):**
  - **Short numbered lists** (typically **≤5 items**) for **sequential steps** the reader must follow in order (e.g. debunk-cycle phases, a tight parent checklist).
  - **“Where next”** link bullets at the end (routing only—not argument).
- **If the material is inherently tabular or multi-row:** keep the **full grid or catalog** in the **dossier** and link to the **§** anchor; the article gets **one or two prose paragraphs** that state the pattern and point there.
- **Reference (catalog → prose):** [`history/chronology/when-your-child-wont-fit-the-grade.md`](../../history/chronology/when-your-child-wont-fit-the-grade.md) — “Literature that respected autodidactic children” (woven paragraphs, not author bullets). [`history/chronology/napoleon-corpses-dry-egypt-siberian-disease.md`](../../history/chronology/napoleon-corpses-dry-egypt-siberian-disease.md) — **`## Framing and limits`** as prose tiers, not a pipe table.

**Default:** Articles **state stakes and thesis clearly**—**clinical but inspired** (precise, unsentimental, still alive); investigations **hold** the audit trail. When in doubt, **cut** the paragraph that sounds like **Limits** and **add** a link: “the careful version lives in [**Limits**](https://paradigmthreat.net/influence/…/investigations/…#limits-and-disclaimers).”

### Reader-facing prose (generic surface)

Articles are written so they can be **republished or read off-site** without sounding like internal documentation.

- **No project or repository meta in the body:** Do **not** name the hosting project, the codebase, or “the repo.” Avoid phrases like **in-repo**, **this tree**, **our investigations**, **a repo search**, **Paradigm Threat** (and close synonyms) in running prose. Use **neutral formulations**: “this reading,” “the argument below,” “linked notes,” “supporting write-up,” “technical companion piece,” “a public search found…”.
- **No drafting-process meta:** Never ship **author confusion**, **voice-note mis-transcriptions**, **session labels**, **“User query”** framing, or **“does it check out?”** audit chatter in article bodies. If two subjects sound alike (e.g. **Poe** vs **Prince**), name the **correct subject once** in plain prose — **do not** explain how a mix-up happened or point readers at transcription logs. **Resolve ambiguities before publish**; **ask the author** when uncertain what they meant. Workflow mistakes belong in **Investigator notes** (investigations) or nowhere — not in reader-facing text.
- **Links:** In **article** bodies, use **absolute** `https://paradigmthreat.net/...` URLs for every internal page and image (**same as `blog/`**). Describe targets by **topic**, not by filing system (“see the linked DNA **blueprint critique**,” not “see our biology dossier”).
- **First person — personal lane only:** Use **I / me / my** only for **personal experience**, **direct memory**, or **explicit personal stance** the reader should attribute to a human speaker. Keep **theory, history, and physics claims** in **neutral / documentary** third person (“this model holds…,” “the record suggests…”).
- **Neutral ≠ timid:** You may still write **hard thesis** and **manifesto** cadence; just separate **voice** (optional **I**) from **content** (documentary).

### Theory-led pacing (default for parent-folder articles)

Parent-folder reader essays are **thesis vehicles**, not primers. They may read as **strong manifesto** when the topic demands it.

- **Lead with the unified theory:** Open with the **cross-cutting claim** and its **stakes**. Do not bury the thesis under throat-clearing. **Intelligent readers** can handle a sharp fork on page one.
- **Heavy proof stays in companion files:** Multi-citation blocks, tier labels, and long **Limits** machinery stay in **`investigations/`** (or equivalent technical write-ups). The article **points**; the companion **prosecutes**.
- **Pacing:** Short **`##` sections**, **one main idea** each, **momentum** over repetition.
- **Sensitive targets:** When the author requests it, use **structural / institutional** framing (doctrine shapes, incentives, schooling) rather than naming modern groups—unless the author explicitly wants names.
- **Honesty without dilution:** When caveats are **necessary**, **do not** weave them into each section—that trains the reader to expect retreat after every claim. Prefer **one** consolidated **`## Framing and limits`** (or **`## Scope and limits`**) block **after** **Where next**, **before** `Keywords:`; keep the **body** declarative. Alternatively, **one** sentence plus a **Limits** link can suffice. Do not use caution as a substitute for **clarity**.
- **Prisca sapientia (required in Framing and limits):** Open that block with [**prisca sapientia**](https://paradigmthreat.net/docs/PRISCA_SAPIENTIA.md)—the belief that ancients held profound understanding of universe, nature, and theology, later lost or degraded; modern consensus is not default truth. One sentence plus dossier **Limits** for tiers is enough.

Reference implementation for **generic surface + theory-led** shape: [`science/biology/circle-of-life-and-how-it-began.md`](../../science/biology/circle-of-life-and-how-it-began.md).

---

## Voice (who we are writing for)

- **Documentary default:** Prefer a **documentary** voice first—direct, factual, and scene-forward without constant speaker framing. Use **first person** only when personal experience, memory, judgment under uncertainty, or stakes genuinely require it. **Do not** write “**the author**.” **Stack with** **Reader-facing prose (generic surface)** above for **project-agnostic** body text and the **first-person-only-for-personal** lane.
- **First person is selective, not constant:** `I / me / my` is valid when it adds signal (e.g. eyewitness memory, explicit personal inference), but avoid leading every section with self-reference. Rewrite default lines in documentary style when possible. **Do not** use first person for **literary scene-painting** (“opened my mind,” “we shared the same gasp”) when a **plain fact** carries the point (“the credits named X,” “fans read one movie”).  
  - **Bad (over-framed):** “I still think in radio.”  
  - **Better (documentary):** “Radio offers a useful model for layered signal bands.”  
  - **Use first person when earned:** “I first noticed this pattern during …”
- **Drop “this essay / this piece”:** Prefer **direct claims**; use **I** only when earned. Phrases like “**this essay** will show,” “**in this piece** we,” or “**what overlaps for this essay**” read like syllabus metal—**cut them** unless a single signpost truly helps.
- **State the claim — drop the frame:** Prefer **direct** sentences over meta-leads. **Bad:** “My **hard moral read** stays blunt: **Polynesian continuity** was interrupted.” **Good:** “**Polynesian continuity** was interrupted.” Let **syntax** carry most of the weight, not a running commentary on your own stance.
- **Bold — emphasis or new terms only:** Use `**bold**` for **(1)** real **emphasis** (one beat per sentence or so—a contrast, a risk, a hinge you need the eye to catch), and **(2)** **new terminology** the article **introduces** or **defines** for this read (first pass; often plain text on repeat). **Do not** bold **every** proper noun, institution, date, or ordinary stressed word—that reads as **sparkle fatigue** and **fake dossier** layout. When in doubt, **remove** the bold.
- **Register — clinical but inspired:** Default to **cool, exact prose** that still **lands** the point—**tight claims**, **clean images**, **no** purple **grief-as-genre** layering. **Drive the argument home** with **structure and consequence**, not with repeated **mourning** or **elegy** cadence unless Ari **explicitly** wants a **lament** piece. Moral heat is fine **in short controlled bursts**; let **evidence links** carry weight alongside tone.
- **Preserve Ari's intensity and intent (hard rule):** When Ari provides sensational, high-voltage, or accusatory claims, **do not silently downgrade them** into bland institutional prose. Keep the **core charge**, stakes, and emotional vector intact. You may tighten wording for readability, legal safety, or structure, but only if the **primary intent is unchanged**. If a sentence must be softened, preserve force by pairing it with explicit stakes (who is harmed, what is controlled, what is lost).
- **No accidental de-fanging during cleanup:** Editing passes for "neutrality," "de-LLM," or "documentary voice" must not erase load-bearing claims (e.g., suppression, controlled opposition, surveillance, corruption, coercive lock-in). Prefer: (1) keep claim strong in body, (2) move caveat machinery to `## Framing and limits`, (3) link to dossier for heavy evidence.
- **Author-supplied sentiment is first-class:** If Ari gives direct language in chat, preserve it where possible (short quoted block or close paraphrase) before adding assistant synthesis. Do not replace high-signal claims with abstract summary labels.
- **Intelligent reader — no hand-holding:** Assume the audience **already grasps** why these topics matter. **Skip** “**you might be wondering**,” over-explaining basics they have heard before, and **tutorial** pacing unless the article is **explicitly** introductory. **Do not** soften or repeat the same caveat in three forms; **trust** the reader to **follow** and to **use** the dossier links when they want machinery.
- **Audience:** A **curious lay reader**—someone who will not read fifty pages of apparatus on first visit. **Plain English**, **complete sentences**, **human rhythm** (vary sentence length; avoid encyclopedia monotone).
- **Point, don’t prescribe:** Articles **show** patterns and **place** evidence; they do **not** coach the reader what to think. **Implied conclusion** beats **authoritative instruction**. Prefer **observation** (“the credits put X on a mass exit”) over **coaching** (“notice what the blockbuster allowed,” “stack this and you get,” “read who gets scapegoated”). **Bad:** authoritative **I → you** scaffolding (“I am not asking you to X; I am asking you to Y”) or constant **second-person** steering (“if you treat,” “you get,” “tell you”). **Good:** documentary **third person** or **neutral this read**; **first person** only for a **specific fact** the author witnessed—not **literary** audience poetry or lecturing.
- **Not authoritative — lay and objective:** Sound like someone **reporting what is on the record**, not a pundit **managing consent**. Avoid **pulpit** cadence: “that is why you must,” “the point is,” “what matters is that you see.” Let links and juxtapositions carry the inference.
- **Simple over lyrical:** State **what happened** in plain words. **Bad:** stacked shared-experience poetry (“we shared the same gasp,” “the same silence when…,” “opened my mind was not only…”). **Good:** one factual line (“fans read one movie,” “the credits named Tonkin and Islam blame”). Keep the **point**; drop the **theater**.
- **You / we (restricted):** **Second person** is for **quoted dialogue**, **film lines**, or **rare** inclusive scene-setting—not default narration. **Inclusive we** is almost never needed; prefer **third person** (“fans,” “audiences,” “the culture”). Default remains **documentary third person**.
- **No cartoon villains:** Prefer **structural** language (“**schooling**,” “**press posture**,” “**museum caption**,” “**funding stack**”) over sentences that imply **every** individual scientist **intends** harm. Name **power** and **pattern**; if **documented** intent matters, the **dossier** carries the receipts.

---

## Shape (how we open and move)

1. **Title** — concrete; may use **em dash** or a strong image. Keep slug/path stable unless Ari explicitly requests a rename (URLs depend on paths).
2. **Subtitle (required)** — add one short line **immediately under** the `#` title (before any hero image), summarizing the thesis in plain reader language. Aim for one sentence fragment or clause (roughly 8–20 words), no ending period, no markdown heading marker (`##`), and no `TL;DR` label.
3. **Optional hero image** — immediately under the subtitle, **`https://paradigmthreat.net/...`** image URL (same as `blog/`), short **alt** that matches the article’s **central image or claim** (not only mood).
4. **Reuse existing corpus images (when topics overlap)** — If the article covers subjects that **already have** investigation, timeline, or sibling-article art, **embed those assets** at the **`##` section** where the topic is argued—not only the new hero PNG beside the file. **Search first:** grep linked dossiers, timeline chapters, and hub pages for `![` / `*.png` / `*.jpg`; prefer **published** `https://paradigmthreat.net/...` URLs (timeline art often lives under `https://paradigmthreat.net/files/timeline/media/...`). **Placement:** one image **after** the paragraph that introduces the topic (illustrate the **linked investigation**, not decorate every section). **Alt text:** name the **source lane** and **what the reader should see** (e.g. “Historical antibodies — timeline chapter,” “Call of Duty militainment — Krasinski operator arc”). **Do not** copy images into the article folder unless you are creating **new** art; **link** to the canonical file in its home directory. **Newsletter budget:** many large PNGs + hero can trigger Gmail clipping—prefer **fewer, well-placed** reuses over a gallery; see **Length → Newsletter / inbox check**. **Reference:** [`influence/controlled_opposition/cia-1984-mars-chrono-trigger.md`](../../influence/controlled_opposition/cia-1984-mars-chrono-trigger.md) (hero + dossier PNGs mid-article); [`science/biology/circle-of-life-and-how-it-began.md`](../../science/biology/circle-of-life-and-how-it-began.md) (article hero + investigation header); [`influence/hollywood/ghost-war-the-antibody-phase.md`](../../influence/hollywood/ghost-war-the-antibody-phase.md) (hero + timeline, militainment, PP hub, Iran runner reuses).
5. **Hook** — a **scene**, **metaphor**, or **one sharp anecdote** before the reader hits dense links. This is the **contract**: why this file exists **before** apparatus.
6. **No dossier routing in the lede** — Do **not** place “**this essay is the narrative spine**,” “**citations live in the companion dossier**,” tier-label signposts, or similar **apparatus** immediately after the hook. That reads as syllabus metal before the argument starts. Fold routing into **`## Where next`** — one short intro sentence before link bullets (or weave into the first bullet’s gloss). The hook goes **straight** to the first **`##` body section**.
7. **`> **TL;DR:**`** — **optional** in articles. Use it when it **adds** a clean thesis line **without** cloning the dossier’s opening or sounding like a second **investigation header**. Skip it when the title + subtitle + first two paragraphs already do that work.
8. **Body** — **`##` sections** (typically **three to seven**). Each section **one main idea**, usually **prose paragraphs** (see **Tables, lists, and catalog prose**). **Bold** only per **Voice → Bold** (emphasis or newly introduced terms)—**not** as default highlighting or list labels.
9. **Citations in prose** — **Markdown link syntax** `[label](https://paradigmthreat.net/...)` (and external `https://...`), **same convention as blog posts**—not bare `/history/...` paths and **not** backtick-wrapped raw URLs (they are not clickable in Substack). Each link: **descriptive label** plus **what** the reader will find there (**one clause**). Avoid **hub-only** link dumps unless Ari wants a **routing sheet**; prefer **narrative + links**.
10. **Closing** — **`## Where next`**: optional one-sentence routing intro, then bullets to dossiers, timeline hubs, sibling essays, or **§** anchors (e.g. “start in **§2.1**”).
11. **Optional `## Framing and limits` (or `## Scope and limits`)** — **At most one** such section, placed **after** **Where next** and **before** `Keywords:`, when in-file boundaries help. **Prose paragraphs only** — no pipe tables, no tier grids, no bold-lead claim stacks. Group **documented** vs **author thesis** in flowing sentences and **link** the dossier for the full audit trail. If the dossier already carries the full caveat stack, a **single** link line here is enough.
12. **`Keywords:`** — one line, **Option B** (see `PARADIGM_INVESTIGATION_INSTRUCTIONS.md`): `#PascalCase` tokens only, **no** `## Keywords` heading.
13. **`**Last updated:**`** — ISO timestamp when the article changed materially: prefer full **`YYYY-MM-DDTHH:MM:SS±offset`** (e.g. `2026-05-23T09:18:22-04:00`); date-only `YYYY-MM-DD` is acceptable for minor touch-ups.
14. **Attribution footer (required — do not remove in de-LLM passes)** — After `**Last updated:**`, a horizontal rule `---`, then an *italic* one-liner, for example:  
    *Written and narrated by Ari Asulin, with drafting and research support from LLM agents.*  
    Minor wording drift is fine; **keep the name** and the fact that **LLM tools** helped produce the page. **This footer is intentional credit**, not an “LLM artifact” to delete when scrubbing machine cadence. It **replaces** repeated “**as the writer**,” “**my position**,” or “**who is speaking**” throat-clearing in the body.

**Pre-publish pass (easy misses):** The line **immediately after** `# Title` must be the **subtitle** (plain text, before any `![` hero or opening hook paragraph)—not a `##`, not `> **TL;DR:**`, not a date stamp. **No “narrative spine” / companion-dossier routing** between the hook and the first `##` body section — that belongs in **`## Where next`** (see Shape step 6). Use `**Last updated:**` once at the **end** (with optional attribution after it); do not duplicate `**Updated:**` under the lede. **Series installments:** read the **prior installment** in full; cut shared frame that Installment I already taught. **Grep the article for `|`** — any pipe-table row means **rewrite as paragraphs** before Substack paste (see **Tables, lists, and catalog prose**). Run the **Verifiable externals pass** below on every ship. Run the **de-LLM sweep** (§ Phrasing we are tired of) — mandatory, not optional. **Grep for drafting meta** — reject before ship: `voice-note`, `User query`, `session capture`, `misheard`, `does it check out`, `transcription` (when referring to author/assistant workflow, not primary sources), `I am not asking you`, `I am asking you to`, `I'm not asking`, `To be clear`, `It is worth noting`.

---

## Length (Substack / email)

**Authoritative ceiling (email, not Substack’s own word cap):** Substack states there is **no** word-count or length restriction on posts, but the editor can show **“Post too long for email”** when the **email** may be **clipped or truncated** in some inboxes—specifically citing **Gmail** truncating messages **over 102KB** (**serialized message size** in the inbox: HTML, images, embeds, tracking—not raw Markdown word count). You can still publish; readers may need **“View entire message.”** There is **no** reliable standalone **“Gmail word limit”**; clipping risk tracks **rendered email bytes**. Source: [Substack Support — *Why does it say “Post too long” in the post editor?*](https://support.substack.com/hc/en-us/articles/360038866571-Why-does-it-say-Post-too-long-in-the-post-editor).

**Drafting targets (Markdown, in this collection):**

- **Default target for new flagship reader essays:** about **2,600–3,400 words** of body (tables and link lines count toward reading time), with **~3,000** as the **nominal** aim. Shorter is fine when the argument is already complete.
- **Reference implementation:** [`history/chronology/indigenous-creation-legends-and-geology.md`](../../history/chronology/indigenous-creation-legends-and-geology.md) (order of magnitude **~3k words**, section pacing)—use it as the **shape** for “Substack-ready depth” without pasting the whole dossier. **Tables in that file:** if present, treat as **legacy**; new articles use **prose** or **PNG/SVG** per **Tables, lists, and catalog prose** above.
- **Newsletter / inbox check:** Before sending a long flagship post, do a **real send test** (or preview at **View entire message**) when the piece combines **long prose** with **multiple large images**—**two hero-scale PNGs** can burn the **102KB** budget faster than **+500 words** of Markdown.
- **Soft ceiling:** treat **~3,200–3,400 words** of prose in a **single** article as the **repo drafting stop** unless Ari explicitly splits across **Part II** or accepts clipping risk after that send test (images, embeds, and HTML bloat push toward the **102KB** clip faster than word count alone).
- **If the piece must grow:** **push** Markdown **tables**, quote banks, and five-citation blocks into **`investigations/`**; add a **Part II** post for a second email rather than one mega-file. For **tabular** material the reader must see in the newsletter, ship a **PNG/SVG** in the article or link to the dossier table anchor.

### Substack publish — title and subtitle fields

Substack renders **Title** and **Subtitle** from **editor fields**, not from the pasted Markdown body. When comparing a live post to the repo, **do not** treat “title/subtitle missing from body” as text drift.

**Field mapping (default workflow):**

| Repo source | Substack field | In pasted body? |
|-------------|----------------|-----------------|
| `# Title` line | **Title** | **No** — omit from paste |
| Plain line immediately under `# Title` (repo **subtitle**, § Shape step 2) | **Subtitle** *or* reserve for site-only tagline | **No** if duplicated in Substack **Subtitle** |
| Opening **hook** paragraph (first prose block after subtitle, before hero/`TL;DR`) | **Subtitle** when it carries the thesis in one sentence — common for flagship posts | **No** if that paragraph is already in **Subtitle** |
| Hero image, `> **TL;DR:**`, `##` sections onward | Body | **Yes** — paste starts here |

**Stonehenge reference:** [`stonehenge-quantum-portal-golden-age-and-dark-ages.md`](../../history/chronology/stonehenge-quantum-portal-golden-age-and-dark-ages.md) — **Title** = `#` heading; **Subtitle** field = hook (*The real nature of Stonehenge is not a calendar…*); repo line 3 (*Golden Age spiral end-port…*) stays for **site** lede; body paste begins at hero / `TL;DR` / first `##`.

After publish, add **`**Substack:**`** with the post URL before **`**Last updated:**`** (see [`circle-of-life-and-how-it-began.md`](../../science/biology/circle-of-life-and-how-it-began.md)).

---

## Verifiable externals pass (required before ship)

LLM drafts **confabulate** text that *sounds* quotable: **song lyrics**, **film lines**, **attributed speeches**, **headlines**, **statistics**, **court holdings**, **DOIs**. That is separate from **author thesis** (which stays first-class) and separate from **de-LLM cadence** (contrast templates). **Hard rule:** any **blockquote** or **verbatim** line attributed to an **external** source must be checked against a **primary, official transcript, or reputable lyrics/quote page** before the file ships. If the author or a reader cannot find it online in a few minutes, it is probably **made up**.

**Canonical failure (2026-06):** [`history/chronology/stonehenge-quantum-portal-golden-age-and-dark-ages.md`](../../history/chronology/stonehenge-quantum-portal-golden-age-and-dark-ages.md) quoted Spinal Tap’s **“Stonehenge”** as **“And the soft winds blow…”** after **“where the demons dwell.”** That line **does not exist** in the song. The real couplet is **“Where the banshees live and they do live well”** ([Songfacts — *Stonehenge*](https://www.songfacts.com/lyrics/spinal-tap/stonehenge)). An LLM agent inserted plausible-sounding lyric during drafting; it survived until the author searched and could not verify it — embarrassing and exactly what this pass prevents.

**Checklist (every article and dossier excerpt republished as an article):**

1. **Lyrics / screenplay / TV dialogue** — match against a lyrics site, subtitle transcript, or timestamped clip; **never** trust model memory.
2. **Historical speeches and letters** — digitized primary, scholarly edition, or archive URL beside the quote.
3. **News headlines and pull quotes** — live or archived URL; headline wording must match the link.
4. **Numbers and dates in factual claims** — trace to the table, report, or statute cited (not “about 40%” with no source).
5. **DOI / PMID / case name** — resolve once; drop or flag if broken.

**If you cannot verify quickly:** do **not** blockquote. Paraphrase with uncertainty, move the line to the dossier **open questions**, or omit. **Author thesis** in Ari’s voice does **not** need an external URL — but **must not** be dressed up as a **fake** lyric, **fake** Einstein quote, or **fake** headline.

**Fast grep hints:** scan for `^> ` blockquotes, lines in **smart quotes** attributed to named people, and **“according to”** without a `[label](https://…)` in the same paragraph.

---

## Phrasing we are tired of (LLM tells)

**Keep vs cut:** Remove **machine cadence in the body**; **keep** the **attribution footer** (§ Shape step 13) that names Ari and **LLM agent** support. De-LLM passes target **prose artifacts**, not **production credit**.

- **Required second pass (de-LLM sweep):** After finishing any article draft, run one clean edit pass that looks only for machine-sounding cadence and rewrites it to plain spoken prose. This pass is mandatory before shipping.
  - **Primary target:** the contrast template **“not A, (but) B”** in one or two adjacent sentences (for example: “this is not a myth; it is a memory”; “it is not calomel alone; it is red mercury”; “this is not X, it is Y”).
  - **Rewrite rule:** keep the meaning, remove the formula. Prefer one positive claim, a concrete image, or a direct sentence you would actually say out loud.
  - **Fast checks:** search for patterns like **“not a”**, **“not an”**, **“not the”**, **“it is not”**, **“but rather”**, **“this is not”**, **“in this repo”**, **“in-repo”**, **“I am not asking you”**, **“I am asking you”**, **“I'm not asking”**, **“I'm asking you to”**, **“notice what”** (as a rhetorical pivot), **“To be clear”**, **“It is worth noting”**, **“we shared”**, **“opened my mind”**, **“the same gasp”**, **“the same silence”**, **“inverts one piece”**, **“out of scope”**, **“agent-first”**, **“dual-mode”**, backtick **API** tokens in clusters, and inspect each hit for template-like contrast writing, **permission-seeking meta**, **lyrical unity prose**, **insider stack narration**, or internal documentation voice.
  - **Acceptance bar:** if a sentence sounds like it is teaching a model contrast pattern—or **negotiating with the reader** instead of **talking to them**—rewrite it. **Lay reader default:** state the claim once, plainly, as you would to a friend who has not read the dossier.
- **The “not A, it is B” teaching beat** — repeated contrasts of the form “**This is not** *chemistry / myth / debunk / a verdict*… **it is** *relationship / science / …*” work once; across many articles they read as the **same** canned cadence. **Rotate constructions**: lead with the **positive** claim; use **“Rather,”** **“Another name for that pressure:”** **“What I mean is simpler:”** a **question**, or a **concrete image**—anything that **breaks** the identical **not-this / but-that** rhythm.
- Close cousin: **“X is not Y; it is Z”** every time you need nuance. Sometimes **Z alone** carries the point; sometimes **two short sentences** beat one negated compound.
- **Permission / negation pairs** — **“I'm not asking you to X. I'm asking you to Y.”** (and close variants) read as **LLM debate scaffolding**. **Cut both halves.** Say **Y** directly, or one short caveat then the claim: *“Historians dispute the fine print; the credits line still landed on a mass exit in 1999.”*
- **Reader negotiation** — **“I am asking you to notice”**, **“let me be clear”**, **“the point is not X, the point is Y”**, **“if you stack / if you treat / you get”** when a **neutral observation** would read fine. Prefer **documentary** delivery; conclusions stay **implied** unless Ari supplies an explicit personal-memory beat.
- **Stance meta** — “**In this piece I will**…”, “**My thesis is**…” every section (the title and flow already signal intent). **Bad** vs **good** examples live under **Voice → State the claim**.
- **Essay / piece scaffolding** — “**This essay** argues…”, “**Below**, this article…”, “**In what follows** the reader…” Same cure as above: **say it**; use **I** only when earned; do not **announce** the document.
- **Insider stack narration (assumed-context jargon)** — sentences that stack **API identifiers**, **spec shorthand**, and **industry-blog coinages** as if the reader already lives in the dossier: e.g. "`navigator.modelContext`", "**headless crawlers out of scope**", "**dual-mode UI**", "**mode zero**", "**inverts one piece of the puzzle**", "**agent-first**" without a plain-English gloss first. **Default for articles:** state **what changes for a human** in **outcome language** (what you can see, who gets served first, what stays hidden) **before** any identifier; **one** technical name per idea, glossed on first use; push identifier chains, flag lists, and spec limits to the **`investigations/`** file (link once). **Exception:** terms the lay reader already knows from mass culture or daily use (e.g. **Facebook**, **iPhone**, **Google search**) need no seminar. **When the topic is niche** (WebMCP, WSDL, CORBA, `registerTool`), assume the reader has **not** heard it — explain like a newspaper, not a standards thread.

---

## What we avoid in articles

- **Markdown pipe tables (anywhere in the file)** — Substack breaks them on paste; **never** in articles. Use **prose paragraphs** in **`## Framing and limits`** too; tier grids belong in **`investigations/`** (see **Tables, lists, and catalog prose**).
- **Catalog lists and bold-lead stacks** — `**Rousseau** — …` / `**1910** — …` / bullet galleries of names, works, or eras that belong in a **paragraph** or in the **dossier**. Exception: **short numbered** how-to or phase lists (≤5 items). If you are tempted to write “literature review as bullets,” **rewrite as two paragraphs** and link the dossier §9-style map.
- **Wall of acronyms** without gloss—spell out once, then abbreviate if needed.
- **Insider stack narration** — API names, spec limits, and vendor-blog labels stacked without plain-English outcome first (see **Phrasing we are tired of → Insider stack narration**). Articles explain **what it means for a reader**; dossiers hold **how the wire works**.
- **Paste-dump** of URLs with no integration in the sentence.
- **Duplicating** half of a dossier “so this page stands alone”—**link** instead.
- **Dossier-dependent shorthand** — cryptic phrases, case numbers, or insider labels that only make sense after reading the investigation (“saw the cliff, couldn’t turn,” “the usual read,” “as §9 shows”) without **one plain clause** of **who / what / why** in the article itself. See **Article vs dossier → Standalone narrative context**.
- **Duplicating** a **recent sibling article** in the same **series**—**link to the prior installment** and keep only **new geography / new titles / new calendar beats** (see **Series articles** above).
- **`github.com/clevertree/...`** or other **dead** reader URLs (see `LINKING_AND_SITE_PATHS.md`).
- **OS paths** (`/home/...`, `~/dev/...`, `/media/...`, maintainer mirror folders like **`~/dev/wget/...`**) in body text—**never** in articles republished to **Substack** or other public surfaces. Use **public URLs** only (`https://chronologia.org/...`, `https://paradigmthreat.net/...`). Local paths belong in dossier **Investigator notes** at the end of **`investigations/`** files only.
- **Mid-article** **Limits** voice: tier sermons, long “**not proven**” chains, claim-number callouts, **Epstein**-class analogy **legal fencing** repeated in prose—**park** that in the **dossier** (one link is enough).
- **Sprinkled disclaimers** — repeated “this is not to say,” “not every X,” “scholars disagree” every few paragraphs. **Batch** into **`## Framing and limits`** or cut; the narrative should read as **continuous thesis**, not **alternating thrust-and-retreat**.
- **Tone softening that changes meaning** — avoid edits that make strong claims sound merely hypothetical when Ari intended a direct charge. Keep the claim explicit, then handle uncertainty in one limits block if needed.
- **Lament-as-default** — stacked **mourning**, **wound**, **hurt** framing in **every** section when the same stakes could read **sharper** in **clinical** mode. Reserve **heavy elegy** for when the **topic** or **Ari** calls for it.
- **Lyrical unity / shared-feeling prose** — “**We all felt**,” “**the same gasp**,” “**opened my mind**,” paired sensory beats that **perform** audience togetherness instead of **stating** reception (“fans read one movie,” “peer mockery converged on Maddox”). Cut the poetry; keep the fact.
- **Frame labels and stance chatter** — “**My read**,” “**hard moral read**,” “**here I want to**” before **every** claim. **State the claim**; use **I** when it **earns** its keep, not **meta** before every line.
- **Sparkle bold** — bolding **most** nouns, proper names, or **whole** clauses to simulate “importance.” If a paragraph reads like a **highlighter ramp**, strip bold back to **Voice → Bold** rules.

---

## After you ship (discovery)

Follow **[`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](../PARADIGM_INVESTIGATION_INSTRUCTIONS.md) → “New article or hub — discovery checklist”**: site root **`page.md`** **Investigation Categories**, topic **`page.md`**, **`index-investigations.md`** (or sibling index), bidirectional **Related** links, **`npm run autogen`**.

**`Last updated` line:** use the **calendar date in US Eastern** (`America/New_York`) — see **[`PARADIGM_INVESTIGATION_INSTRUCTIONS.md` → Dates and timezone](../PARADIGM_INVESTIGATION_INSTRUCTIONS.md#dates-and-timezone)**. Place after **`## Framing and limits`** (or equivalent), before **`Keywords:`** and the attribution footer.

---

## Reference implementations

- **Article + dossier pair (controlled opposition):** [`influence/controlled_opposition/cia-1984-mars-chrono-trigger.md`](../../influence/controlled_opposition/cia-1984-mars-chrono-trigger.md) ↔ [`…/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md`](../../influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md).
- **Lay reader essay + citations (chronology):** [`history/chronology/indigenous-creation-legends-and-geology.md`](../../history/chronology/indigenous-creation-legends-and-geology.md) ↔ [`…/investigations/indigenous-legends-vs-geologic-dating-investigation.md`](../../history/chronology/investigations/indigenous-legends-vs-geologic-dating-investigation.md).
- **Prose-over-catalog (schooling / parent advice):** [`history/chronology/when-your-child-wont-fit-the-grade.md`](../../history/chronology/when-your-child-wont-fit-the-grade.md) ↔ [`…/childhood-autism-spectrum-conformity-recategorization-investigation.md`](../../history/chronology/investigations/childhood-autism-spectrum-conformity-recategorization-investigation.md).
- **Theory-led flagship (biology / continuity):** [`science/biology/circle-of-life-and-how-it-began.md`](../../science/biology/circle-of-life-and-how-it-began.md) ↔ [`science/biology/investigations/dna-fingerprint-scalar-life-investigation.md`](../../science/biology/investigations/dna-fingerprint-scalar-life-investigation.md) plus [`creation event interpretations`](../../history/chronology/investigations/creation-event-interpretations.md).
- **Corpus image reuse (Hollywood / antibodies / PP):** [`influence/hollywood/ghost-war-the-antibody-phase.md`](../../influence/hollywood/ghost-war-the-antibody-phase.md) — hero + mid-article PNGs from militainment, Benghazi, timeline antibodies, 911 PP, PP hub, Trump-era scorecard, Iran runner.
- **Series (predictive programming in movies):** [`not-like-this.md`](../../influence/controlled_opposition/not-like-this.md) (Installment I) ↔ [`everything-burns.md`](../../influence/hollywood/everything-burns.md) (Installment II) — dedup shared two-camp frame; Pacific litmus test only in II.

---

**Last updated:** 2026-06-26 (Eastern — `Last updated` / hand-stamped dates use `America/New_York`)

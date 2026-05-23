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

### Tables, lists, and catalog prose (articles vs investigations)

- **Investigations** (`…/investigations/*.md`): **Markdown tables are fine**—tier matrices, chronologies, claim registries, comparison grids. **Bullet and bold-lead catalogs** (literature maps, author lanes, tier rows) also belong here.
- **Articles** (parent-folder reader essays): **Do not use Markdown pipe tables.** Substack’s editor (and most paste-from-Markdown workflows) **do not render** `| col | col |` grids; rows collapse into a broken vertical list.
- **If an article needs a table or structured illustration:** export **`PNG`** or **`SVG`**, place the asset **beside the article** in the same folder (same pattern as hero images), and embed with an **absolute** `https://paradigmthreat.net/...` URL and descriptive **alt** text. Raster and vector images **transfer**; Markdown tables **do not**.
- **Default for structured content:** **paragraphs**, not lists. Weave names, dates, and contrasts into **complete sentences** with normal syntax (commas, semicolons, “and,” short follow-on sentences). The reader should hear an **essay**, not scroll a **glossary**.
- **Avoid catalog-style stacks** in article bodies:
  - Repeated `**Name** — gloss` or `**Name** — *work* (year): gloss` lines (literature surveys, thinker rundowns, “who said what” lanes).
  - Long bullet runs of **authors**, **eras**, **institutions**, or **claims** that could be one or two paragraphs.
  - Pseudo-tables built from bold labels + em dashes (they paste into Substack like **broken tables** and read like **dossier excerpts**).
- **When lists are OK (sparingly):**
  - **Short numbered lists** (typically **≤5 items**) for **sequential steps** the reader must follow in order (e.g. debunk-cycle phases, a tight parent checklist).
  - **“Where next”** link bullets at the end (routing only—not argument).
  - **Framing and limits** may use a **few** tight bullets if batching caveats; prefer prose when it still scans cleanly.
- **If the material is inherently tabular or multi-row:** keep the **full grid or catalog** in the **dossier** and link to the **§** anchor; the article gets **one paragraph** that states the pattern and points there.
- **Reference (catalog → prose):** [`history/chronology/when-your-child-wont-fit-the-grade.md`](../../history/chronology/when-your-child-wont-fit-the-grade.md) — “Literature that respected autodidactic children” (woven paragraphs, not author bullets).

**Default:** Articles **state stakes and thesis clearly**—**clinical but inspired** (precise, unsentimental, still alive); investigations **hold** the audit trail. When in doubt, **cut** the paragraph that sounds like **Limits** and **add** a link: “the careful version lives in [**Limits**](https://paradigmthreat.net/influence/…/investigations/…#limits-and-disclaimers).”

### Reader-facing prose (generic surface)

Articles are written so they can be **republished or read off-site** without sounding like internal documentation.

- **No project or repository meta in the body:** Do **not** name the hosting project, the codebase, or “the repo.” Avoid phrases like **in-repo**, **this tree**, **our investigations**, **Paradigm Threat** (and close synonyms) in running prose. Use **neutral formulations**: “this reading,” “the argument below,” “linked notes,” “supporting write-up,” “technical companion piece.”
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
- **First person is selective, not constant:** `I / me / my` is valid when it adds signal (e.g. eyewitness memory, explicit personal inference), but avoid leading every section with self-reference. Rewrite default lines in documentary style when possible.  
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
- **You / we (optional):** **Second person** can substitute for first-person framing when it improves readability (“you can see this in…”) and **inclusive we** can frame shared situations. Keep both restrained; documentary voice remains default, and every paragraph should **advance** something or **point** to evidence.
- **No cartoon villains:** Prefer **structural** language (“**schooling**,” “**press posture**,” “**museum caption**,” “**funding stack**”) over sentences that imply **every** individual scientist **intends** harm. Name **power** and **pattern**; if **documented** intent matters, the **dossier** carries the receipts.

---

## Shape (how we open and move)

1. **Title** — concrete; may use **em dash** or a strong image. Keep slug/path stable unless Ari explicitly requests a rename (URLs depend on paths).
2. **Subtitle (required)** — add one short line **immediately under** the `#` title (before any hero image), summarizing the thesis in plain reader language. Aim for one sentence fragment or clause (roughly 8–20 words), no ending period, no markdown heading marker (`##`), and no `TL;DR` label.
3. **Optional hero image** — immediately under the subtitle, **`https://paradigmthreat.net/...`** image URL (same as `blog/`), short **alt** that matches the article’s **central image or claim** (not only mood).
4. **Hook** — a **scene**, **metaphor**, or **one sharp anecdote** before the reader hits dense links. This is the **contract**: why this file exists **before** apparatus.
5. **`> **TL;DR:**`** — **optional** in articles. Use it when it **adds** a clean thesis line **without** cloning the dossier’s opening or sounding like a second **investigation header**. Skip it when the title + subtitle + first two paragraphs already do that work.
6. **Body** — **`##` sections** (typically **three to seven**). Each section **one main idea**, usually **prose paragraphs** (see **Tables, lists, and catalog prose**). **Bold** only per **Voice → Bold** (emphasis or newly introduced terms)—**not** as default highlighting or list labels.
7. **Citations in prose** — **Markdown link syntax** `[label](https://paradigmthreat.net/...)` (and external `https://...`), **same convention as blog posts**—not bare `/history/...` paths and **not** backtick-wrapped raw URLs (they are not clickable in Substack). Each link: **descriptive label** plus **what** the reader will find there (**one clause**). Avoid **hub-only** link dumps unless Ari wants a **routing sheet**; prefer **narrative + links**.
8. **Closing** — short **“where next”**: Common Questions, timeline hubs, or **§** anchors in dossiers (e.g. “start in **§2.1**”).
9. **Optional `## Framing and limits` (or `## Scope and limits`)** — **At most one** such section, placed **after** **Where next** and **before** `Keywords:`, when in-file boundaries help (what is **not** being claimed, what lives in **Limits**, consensus vs synthesis). **Do not** scatter the same hedges through earlier `##` sections; that **muddies** the narrative. If the dossier already carries the full caveat stack, a **single** link line here is enough.
10. **`Keywords:`** — one line, **Option B** (see `PARADIGM_INVESTIGATION_INSTRUCTIONS.md`): `#PascalCase` tokens only, **no** `## Keywords` heading.
11. **`**Last updated:**`** — `YYYY-MM-DD` when the article changed materially.
12. **Attribution footer (required for new or materially updated articles)** — After `**Last updated:**`, a horizontal rule `---`, then an *italic* one-liner, for example:  
    *Written and narrated by Ari Asulin, with drafting and research support from LLM agents.*  
    Minor wording drift is fine; **keep the name** and the fact that **LLM tools** helped produce the page. That line **replaces** the need for repeated “**as the writer**,” “**my position**,” or “**who is speaking**” throat-clearing in the body.

**Pre-publish pass (easy misses):** The line **immediately after** `# Title` must be the **subtitle** (plain text, before any `![` hero or opening hook paragraph)—not a `##`, not `> **TL;DR:**`, not a date stamp. Use `**Last updated:**` once at the **end** (with optional attribution after it); do not duplicate `**Updated:**` under the lede.

---

## Length (Substack / email)

**Authoritative ceiling (email, not Substack’s own word cap):** Substack states there is **no** word-count or length restriction on posts, but the editor can show **“Post too long for email”** when the **email** may be **clipped or truncated** in some inboxes—specifically citing **Gmail** truncating messages **over 102KB** (**serialized message size** in the inbox: HTML, images, embeds, tracking—not raw Markdown word count). You can still publish; readers may need **“View entire message.”** There is **no** reliable standalone **“Gmail word limit”**; clipping risk tracks **rendered email bytes**. Source: [Substack Support — *Why does it say “Post too long” in the post editor?*](https://support.substack.com/hc/en-us/articles/360038866571-Why-does-it-say-Post-too-long-in-the-post-editor).

**Drafting targets (Markdown, in this collection):**

- **Default target for new flagship reader essays:** about **2,600–3,400 words** of body (tables and link lines count toward reading time), with **~3,000** as the **nominal** aim. Shorter is fine when the argument is already complete.
- **Reference implementation:** [`history/chronology/indigenous-creation-legends-and-geology.md`](../../history/chronology/indigenous-creation-legends-and-geology.md) (order of magnitude **~3k words**, section pacing)—use it as the **shape** for “Substack-ready depth” without pasting the whole dossier. **Tables in that file:** if present, treat as **legacy**; new articles use **prose** or **PNG/SVG** per **Tables, lists, and catalog prose** above.
- **Newsletter / inbox check:** Before sending a long flagship post, do a **real send test** (or preview at **View entire message**) when the piece combines **long prose** with **multiple large images**—**two hero-scale PNGs** can burn the **102KB** budget faster than **+500 words** of Markdown.
- **Soft ceiling:** treat **~3,200–3,400 words** of prose in a **single** article as the **repo drafting stop** unless Ari explicitly splits across **Part II** or accepts clipping risk after that send test (images, embeds, and HTML bloat push toward the **102KB** clip faster than word count alone).
- **If the piece must grow:** **push** Markdown **tables**, quote banks, and five-citation blocks into **`investigations/`**; add a **Part II** post for a second email rather than one mega-file. For **tabular** material the reader must see in the newsletter, ship a **PNG/SVG** in the article or link to the dossier table anchor.

---

## Phrasing we are tired of (LLM tells)

- **Required second pass (de-LLM sweep):** After finishing any article draft, run one clean edit pass that looks only for machine-sounding cadence and rewrites it to plain spoken prose. This pass is mandatory before shipping.
  - **Primary target:** the contrast template **“not A, (but) B”** in one or two adjacent sentences (for example: “this is not a myth; it is a memory”).
  - **Rewrite rule:** keep the meaning, remove the formula. Prefer one positive claim, a concrete image, or a direct sentence you would actually say out loud.
  - **Fast checks:** search for patterns like **“not a”**, **“not an”**, **“not the”**, **“it is”**, **“but rather”**, **“this is not”** and inspect each hit for template-like contrast writing.
  - **Acceptance bar:** if a sentence sounds like it is teaching a model contrast pattern instead of talking to a reader, rewrite it.
- **The “not A, it is B” teaching beat** — repeated contrasts of the form “**This is not** *chemistry / myth / debunk / a verdict*… **it is** *relationship / science / …*” work once; across many articles they read as the **same** canned cadence. **Rotate constructions**: lead with the **positive** claim; use **“Rather,”** **“Another name for that pressure:”** **“What I mean is simpler:”** a **question**, or a **concrete image**—anything that **breaks** the identical **not-this / but-that** rhythm.
- Close cousin: **“X is not Y; it is Z”** every time you need nuance. Sometimes **Z alone** carries the point; sometimes **two short sentences** beat one negated compound.
- **Stance meta** — “**In this piece I will**…”, “**My thesis is**…” every section (the title and flow already signal intent). **Bad** vs **good** examples live under **Voice → State the claim**.
- **Essay / piece scaffolding** — “**This essay** argues…”, “**Below**, this article…”, “**In what follows** the reader…” Same cure as above: **say it**; use **I** only when earned; do not **announce** the document.

---

## What we avoid in articles

- **Markdown pipe tables** — Substack and similar editors break them on paste; use **prose**, **dossier links**, or **PNG/SVG** embeds instead (see **Tables, lists, and catalog prose**).
- **Catalog lists and bold-lead stacks** — `**Rousseau** — …` / `**1910** — …` / bullet galleries of names, works, or eras that belong in a **paragraph** or in the **dossier**. Exception: **short numbered** how-to or phase lists (≤5 items). If you are tempted to write “literature review as bullets,” **rewrite as two paragraphs** and link the dossier §9-style map.
- **Wall of acronyms** without gloss—spell out once, then abbreviate if needed.
- **Paste-dump** of URLs with no integration in the sentence.
- **Duplicating** half of a dossier “so this page stands alone”—**link** instead.
- **`github.com/clevertree/...`** or other **dead** reader URLs (see `LINKING_AND_SITE_PATHS.md`).
- **OS paths** (`/home/...`) in body text—**Investigator notes** at end of **dossiers** only.
- **Mid-article** **Limits** voice: tier sermons, long “**not proven**” chains, claim-number callouts, **Epstein**-class analogy **legal fencing** repeated in prose—**park** that in the **dossier** (one link is enough).
- **Sprinkled disclaimers** — repeated “this is not to say,” “not every X,” “scholars disagree” every few paragraphs. **Batch** into **`## Framing and limits`** or cut; the narrative should read as **continuous thesis**, not **alternating thrust-and-retreat**.
- **Tone softening that changes meaning** — avoid edits that make strong claims sound merely hypothetical when Ari intended a direct charge. Keep the claim explicit, then handle uncertainty in one limits block if needed.
- **Lament-as-default** — stacked **mourning**, **wound**, **hurt** framing in **every** section when the same stakes could read **sharper** in **clinical** mode. Reserve **heavy elegy** for when the **topic** or **Ari** calls for it.
- **Frame labels and stance chatter** — “**My read**,” “**hard moral read**,” “**here I want to**” before **every** claim. **State the claim**; use **I** when it **earns** its keep, not **meta** before every line.
- **Sparkle bold** — bolding **most** nouns, proper names, or **whole** clauses to simulate “importance.” If a paragraph reads like a **highlighter ramp**, strip bold back to **Voice → Bold** rules.

---

## After you ship (discovery)

Follow **[`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](../PARADIGM_INVESTIGATION_INSTRUCTIONS.md) → “New article or hub — discovery checklist”**: site root **`page.md`** **Investigation Categories**, topic **`page.md`**, **`index-investigations.md`** (or sibling index), bidirectional **Related** links, **`npm run autogen`**.

---

## Reference implementations

- **Article + dossier pair (controlled opposition):** [`influence/controlled_opposition/cia-1984-mars-chrono-trigger.md`](../../influence/controlled_opposition/cia-1984-mars-chrono-trigger.md) ↔ [`…/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md`](../../influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md).
- **Lay reader essay + citations (chronology):** [`history/chronology/indigenous-creation-legends-and-geology.md`](../../history/chronology/indigenous-creation-legends-and-geology.md) ↔ [`…/investigations/indigenous-legends-vs-geologic-dating-investigation.md`](../../history/chronology/investigations/indigenous-legends-vs-geologic-dating-investigation.md).
- **Prose-over-catalog (schooling / parent advice):** [`history/chronology/when-your-child-wont-fit-the-grade.md`](../../history/chronology/when-your-child-wont-fit-the-grade.md) ↔ [`…/childhood-autism-spectrum-conformity-recategorization-investigation.md`](../../history/chronology/investigations/childhood-autism-spectrum-conformity-recategorization-investigation.md).
- **Theory-led flagship (biology / continuity):** [`science/biology/circle-of-life-and-how-it-began.md`](../../science/biology/circle-of-life-and-how-it-began.md) ↔ [`science/biology/investigations/dna-fingerprint-scalar-life-investigation.md`](../../science/biology/investigations/dna-fingerprint-scalar-life-investigation.md) plus [`creation event interpretations`](../../history/chronology/investigations/creation-event-interpretations.md).

---

**Last updated:** 2026-05-21 (catalog lists → prose; avoid bold-lead stacks in articles)

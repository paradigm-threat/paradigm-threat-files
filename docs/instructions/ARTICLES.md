# Reader-facing articles — how we want them written

**Purpose:** Define **article** voice for *paradigm-threat-files*—the Markdown siblings of **`investigations/`** dossiers and other long-form files—so assistants and authors match **Paradigm Threat** expectations. Pair with **[`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](../PARADIGM_INVESTIGATION_INSTRUCTIONS.md)** (dossier structure, evidence tiers, **Limits**) and **[`LINKING_AND_SITE_PATHS.md`](../LINKING_AND_SITE_PATHS.md)** (URLs).

---

## Article vs dossier (division of labor)

| **`…/investigations/*.md` (dossier)** | **Parent-folder `…/*.md` (article)** |
|-------------------------------------|--------------------------------------|
| Tables, long quote banks, FOIA chains, **Limits**, **Investigator notes**, granular **TODOs**, **Q** rows, **§4** open-claim registries, tier labels, “speculative / documented / legal analogy” splits. | **Readable essay**: stakes, flow, and **enough** links to enter the dossiers—**not** a second investigation file. |
| Home for **heavy** caveat language: what is proven vs guessed, what is rhetoric vs docket, fiction vs evidence, assistant bias. | **Light touch**: trust the dossier for that machinery. **Do not** paste investigation-style disclaimer stacks into the **body**. If something must be said for honesty, **one** short closing note (after the main sections, **before** `Keywords:`) is enough—otherwise readers live in the linked **Limits** block. |
| **Guide (read order)** for very long files. | **Optional** short “where next” at the end; the **body** should read in order without a map unless you deliberately want a mini-guide. |

If a claim needs **five citations** or a **multi-row table**, it belongs in the **dossier**; the **article** names the claim and **links once** (often to a **§** anchor).

**Default:** Articles **state stakes and thesis clearly**—**clinical but inspired** (precise, unsentimental, still alive); investigations **hold** the audit trail. When in doubt, **cut** the paragraph that sounds like **Limits** and **add** a link: “the careful version lives in [**Limits**](/path/to/investigation.md#limits-and-disclaimers).”

---

## Voice (who we are writing for)

- **First person:** These articles are **Ari’s** voice. Use **I / me / my** when a sentence **genuinely** needs a speaker (commitment, pivot, risk)—**sparingly**. **Do not** write “**the author**.” The **attribution footer** (*Written and narrated by Ari Asulin…*) already tells the reader **who** is speaking; **do not** re-announce that every few paragraphs with “**in my view**,” “**my read**,” “**what I want to argue**,” or similar **frame labels**.
- **State the claim — drop the frame:** Prefer **direct** sentences over meta-leads. **Bad:** “My **hard moral read** stays blunt: **Polynesian continuity** was interrupted.” **Good:** “**Polynesian continuity** was interrupted.” Let **syntax** carry most of the weight, not a running commentary on your own stance.
- **Bold — emphasis or new terms only:** Use `**bold**` for **(1)** real **emphasis** (one beat per sentence or so—a contrast, a risk, a hinge you need the eye to catch), and **(2)** **new terminology** the article **introduces** or **defines** for this read (first pass; often plain text on repeat). **Do not** bold **every** proper noun, institution, date, or ordinary stressed word—that reads as **sparkle fatigue** and **fake dossier** layout. When in doubt, **remove** the bold.
- **Register — clinical but inspired:** Default to **cool, exact prose** that still **lands** the point—**tight claims**, **clean images**, **no** purple **grief-as-genre** layering. **Drive the argument home** with **structure and consequence**, not with repeated **mourning** or **elegy** cadence unless Ari **explicitly** wants a **lament** piece. Moral heat is fine **in short controlled bursts**; let **evidence links** carry weight alongside tone.
- **Intelligent reader — no hand-holding:** Assume the audience **already grasps** why these topics matter. **Skip** “**you might be wondering**,” over-explaining basics they have heard before, and **tutorial** pacing unless the article is **explicitly** introductory. **Do not** soften or repeat the same caveat in three forms; **trust** the reader to **follow** and to **use** the dossier links when they want machinery.
- **Audience:** A **curious lay reader**—someone who will not read fifty pages of apparatus on first visit. **Plain English**, **complete sentences**, **human rhythm** (vary sentence length; avoid encyclopedia monotone).
- **You / we:** **Second person** or **inclusive we** still work for vignettes and shared situation (“imagine someone at your door…”). Do **not** overuse them as filler—every paragraph should **advance** something or **point** to evidence.
- **No cartoon villains:** Prefer **structural** language (“**schooling**,” “**press posture**,” “**museum caption**,” “**funding stack**”) over sentences that imply **every** individual scientist **intends** harm. Name **power** and **pattern**; if **documented** intent matters, the **dossier** carries the receipts.

---

## Shape (how we open and move)

1. **Title** — concrete; may use **em dash** or a strong image. Keep slug/path stable unless Ari explicitly requests a rename (URLs depend on paths).
2. **Optional hero image** — immediately under the `#` title, repo-relative path, short **alt** that matches the article’s **central image or claim** (not only mood).
3. **Hook** — a **scene**, **metaphor**, or **one sharp anecdote** before the reader hits dense links. This is the **contract**: why this file exists **before** apparatus.
4. **`> **TL;DR:**`** — **optional** in articles. Use it when it **adds** a clean thesis line **without** cloning the dossier’s opening or sounding like a second **investigation header**. Skip it when the title + first two paragraphs already do that work.
5. **Body** — **`##` sections** (typically **three to seven**). Each section **one main idea**. **Bold** only per **Voice → Bold** (emphasis or newly introduced terms)—**not** as default highlighting.
6. **Citations in prose** — **Inline links** (`/history/...`, `/influence/...`, `/timeline/...`, stable public URLs). Each link: **what** the reader will find there (**one clause**). Avoid **hub-only** link dumps unless Ari wants a **routing sheet**; prefer **narrative + links**.
7. **Closing** — short **“where next”**: Common Questions, timeline hubs, or **§** anchors in dossiers (e.g. “start in **§2.1**”).
8. **Optional honesty cap** — **At most one** short section or paragraph **after** the main essay, **before** `Keywords:`, only when something **must** be said in-file (e.g. “legal gravity and analogy boundaries live in the dossier **Limits**”). **Do not** sprinkle investigation-style caveats through every section.
9. **`Keywords:`** — one line, **Option B** (see `PARADIGM_INVESTIGATION_INSTRUCTIONS.md`): `#PascalCase` tokens only, **no** `## Keywords` heading.
10. **`**Last updated:**`** — `YYYY-MM-DD` when the article changed materially.
11. **Attribution footer (required for new or materially updated articles)** — After `**Last updated:**`, a horizontal rule `---`, then an *italic* one-liner, for example:  
    *Written and narrated by Ari Asulin, with drafting and research support from LLM agents.*  
    Minor wording drift is fine; **keep the name** and the fact that **LLM tools** helped produce the page. That line **replaces** the need for repeated “**as the writer**,” “**my position**,” or “**who is speaking**” throat-clearing in the body.

---

## Length (Substack / email)

**Authoritative ceiling (email, not Substack’s own word cap):** Substack states there is **no** word-count or length restriction on posts, but the editor can show **“Post too long for email”** when the **email** may be **clipped or truncated** in some inboxes—specifically citing **Gmail** truncating messages **over 102KB** (message size, not raw Markdown in this repo). You can still publish; readers may need **“View entire message.”** Source: [Substack Support — *Why does it say “Post too long” in the post editor?*](https://support.substack.com/hc/en-us/articles/360038866571-Why-does-it-say-Post-too-long-in-the-post-editor).

**Paradigm Threat drafting targets (Markdown in-repo):**

- **Default target for new flagship reader essays:** about **2,000–3,200 words** of body (tables and link lines count toward reading time). Shorter is fine when the argument is already complete.
- **Reference implementation:** [`history/chronology/indigenous-creation-legends-and-geology.md`](../../history/chronology/indigenous-creation-legends-and-geology.md) (order of magnitude **~3k words** with sections + one comparison table)—use it as the **shape** for “Substack-ready depth” without pasting the whole dossier.
- **Soft ceiling:** treat **~3,500 words** of prose in a **single** article as the **repo drafting stop** unless Ari explicitly splits across **Part II** or accepts email-clipping risk after a **send test** in Substack (images, embeds, and HTML bloat push toward the **102KB** clip faster than word count alone).
- **If the piece must grow:** **push** tables, quote banks, and five-citation blocks into **`investigations/`**; add a **Part II** post for a second email rather than one mega-file.

---

## Phrasing we are tired of (LLM tells)

- **The “not A, it is B” teaching beat** — repeated contrasts of the form “**This is not** *chemistry / myth / debunk / a verdict*… **it is** *relationship / science / …*” work once; across many articles they read as the **same** canned cadence. **Rotate constructions**: lead with the **positive** claim; use **“Rather,”** **“Another name for that pressure:”** **“What I mean is simpler:”** a **question**, or a **concrete image**—anything that **breaks** the identical **not-this / but-that** rhythm.
- Close cousin: **“X is not Y; it is Z”** every time you need nuance. Sometimes **Z alone** carries the point; sometimes **two short sentences** beat one negated compound.
- **Stance meta** — “**In this piece I will**…”, “**My thesis is**…” every section (the title and flow already signal intent). **Bad** vs **good** examples live under **Voice → State the claim**.

---

## What we avoid in articles

- **Wall of acronyms** without gloss—spell out once, then abbreviate if needed.
- **Paste-dump** of URLs with no integration in the sentence.
- **Duplicating** half of a dossier “so this page stands alone”—**link** instead.
- **`github.com/clevertree/...`** or other **dead** reader URLs (see `LINKING_AND_SITE_PATHS.md`).
- **OS paths** (`/home/...`) in body text—**Investigator notes** at end of **dossiers** only.
- **Mid-article** **Limits** voice: tier sermons, long “**not proven**” chains, claim-number callouts, **Epstein**-class analogy **legal fencing** repeated in prose—**park** that in the **dossier** (one link is enough).
- **Lament-as-default** — stacked **mourning**, **wound**, **hurt** framing in **every** section when the same stakes could read **sharper** in **clinical** mode. Reserve **heavy elegy** for when the **topic** or **Ari** calls for it.
- **Frame labels and stance chatter** — “**My read**,” “**hard moral read**,” “**here I want to**” before **every** claim. **State the claim**; use the footer + **sparing** **I** only where it **earns** its keep.
- **Sparkle bold** — bolding **most** nouns, proper names, or **whole** clauses to simulate “importance.” If a paragraph reads like a **highlighter ramp**, strip bold back to **Voice → Bold** rules.

---

## After you ship (discovery)

Follow **[`PARADIGM_INVESTIGATION_INSTRUCTIONS.md`](../PARADIGM_INVESTIGATION_INSTRUCTIONS.md) → “New article or hub — discovery checklist”**: site root **`page.md`** **Investigation Categories**, topic **`page.md`**, **`index-investigations.md`** (or sibling index), bidirectional **Related** links, **`npm run autogen`**.

---

## Reference implementations

- **Article + dossier pair (controlled opposition):** [`influence/controlled_opposition/cia-1984-mars-chrono-trigger.md`](../../influence/controlled_opposition/cia-1984-mars-chrono-trigger.md) ↔ [`…/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md`](../../influence/controlled_opposition/investigations/cia-reading-room-mars-exploration-1984-rv-investigation.md).
- **Lay reader essay + citations (chronology):** [`history/chronology/indigenous-creation-legends-and-geology.md`](../../history/chronology/indigenous-creation-legends-and-geology.md) ↔ [`…/investigations/indigenous-legends-vs-geologic-dating-investigation.md`](../../history/chronology/investigations/indigenous-legends-vs-geologic-dating-investigation.md).

---

**Last updated:** 2026-04-29

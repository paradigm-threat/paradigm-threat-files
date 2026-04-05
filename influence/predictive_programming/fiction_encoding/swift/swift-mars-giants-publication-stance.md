# Swift — Mars, scale beings, and how *Gulliver* was sold to readers

> **TL;DR:** Laputa names **two Martian satellites** with distances, periods, and a Kepler-style line **151 years before** Hall (1877)—**count and ordering** match reality; **numeric fit** is loose, so the residue is **why embed checkable-looking physics** inside mock astronomy. The book shipped as **Gulliver’s memoir**, not a fiction disclaimer; **satire explains tone**, not **provenance**. **Conclusion:** treat **re-shelving as “classic fiction”** as potentially **erasing** a **documentary disguise**, and keep **coincidence vs. non-public knowledge** open.

![Swift — Mars, scale beings, and how Gulliver was sold to readers](swift-mars-giants-publication-stance.png)

**Scope:** Passages and framing relevant to (1) **Mars and its moons**, (2) **tiny and giant humans** (cover-iconography scale worlds), (3) whether Swift or his publishers ever **required belief in fiction**, versus **travel-account** presentation.  
**Corpus:** OCR under `/home/ari/dev/wget/swift/_extract/`; quotations below were checked against the **1856 / shared `39015078565952`** page `00000290.txt` (book page **284** in that edition).

**Related:** [*Gulliver’s Travels* index](index-gullivers-travels.md) | [Mars investigations](/cosmos/mars/investigations/index-mars.md) | [Debate rails & drift (methodology)](swift-investigation-debate-rails-and-drift.md)

---

## 1. Mars — Laputan “two lesser stars or satellites”

### 1.1 Text (as in local OCR; hyphenation normalized for reading)

In Part III, describing Laputa’s astronomers and their superior telescopes, Gulliver reports:

> They have likewise discovered two lesser stars, or satellites, which revolve about Mars; whereof the innermost is distant from the centre of the primary planet exactly three of his diameters, and the outermost, five; the former revolves in the space of ten hours, and the latter in twenty-one and a half; so that the squares of their periodical times are very near in the same proportion with the cubes of their distance, from the centre of Mars; which evidently shews them to be governed by the same law of gravitation that influences the other heavenly bodies.

The next sentences extend the joke: ninety-three comets catalogued, etc., “If this be true (and they affirm it with great confidence) it is much to be wished, that…” — a classic Swiftian **double layer**: deadpan technical detail plus **ironic undermining** of Laputan certainty.

### 1.2 Chronology vs. telescopic discovery

- **Swift / publication:** Part III was in print by **1726** (first edition, London).  
- **Astronomical reality:** Mars’s moons were not **telescopically discovered** until **1877** (Asaph Hall: **Deimos** then **Phobos**).  
- Hence any **accurate** detail about Martian satellites in 1726 cannot rest on the public observational record; explanations reduce to **coincidence**, **Swift’s or his circle’s mathematical guesswork**, **satirical exaggeration of contemporary celestial-mechanics talk**, or—on the investigation thesis—**non-public knowledge** later buried under the “fiction” label.

### 1.3 Comparison to modern Phobos and Deimos (mainstream values)

Approximate sidereal orbital periods (Earth hours):

| Body | Modern period (order of magnitude) | Swift’s text |
|------|-----------------------------------|--------------|
| Inner moon (**Phobos**) | ~**7.7** h | **10** h |
| Outer moon (**Deimos**) | ~**30.3** h | **21.5** h |

Approximate distance from Mars’s center in units of **Mars’s diameter** (~6,780 km):

| Body | Modern (semi-major axis / diameter) | Swift’s text |
|------|-------------------------------------|--------------|
| Inner (**Phobos**) | ~**1.4** | **3** |
| Outer (**Deimos**) | ~**3.5** | **5** |

**Assessment (open):** Swift gets **the count** (two moons) and **the ordering** (inner faster than outer) in a solar-system context where **no such moons were known**. The **numeric** distances and periods are **not** a tight fit to modern measurements; the sentence about **Kepler’s third law** (“squares of periods ∝ cubes of distances”) is **too neat** for the stated numbers—suggesting **literary physics** as much as covert telemetry. For this project, the residue is: **why embed a specific, checkable-looking claim** in a chapter already mocking abstract science?

### 1.4 Other “Mars” mentions

In the local corpus, **`Mars` as a word** appears in the **Martian satellites** passage (above) and not as a sustained astronomical treatise elsewhere; broader “planetary” language appears in Laputa/Balnibarbi (comets, fixed stars, etc.). A full concordance can be regenerated with:

`rg -i 'mars|satellit|phobos|deimos' /home/ari/dev/wget/swift/_extract`

---

## 2. Giants, pygmies, and cover imagery

### 2.1 Part I — Lilliput (tiny humans)

- Gulliver is a **giant** to the Lilliputians; ropes and pins on bindings illustrate **capture and immobility** at micro-scale.  
- Investigation angle: **systematic biology** (proportions, reproduction, military ranks) presented **as ethnography**—the same narrative mode used for “real” voyage accounts. Whether read as **pure scale fantasy** or as **encoded commentary on dwarfing/infantilization of populations** is left open here.

### 2.2 Part II — Brobdingnag (giants)

- Gulliver becomes a **miniature**; the **court dwarf** contrasts size hierarchies.  
- The Brobdingnagian **king’s judgment** on European war, law, and gunpowder is central to the **satire** reading—but again delivered as **straight dialogue** inside a travel frame.  
- **Parallels only (not confirmation):** full **Brobdingnag** content inventory (isolation, cities, **vermin** speech), **everything said about gunpowder / tubes / siege balls / king’s refusal**, and **Rus Horde reflection** — [swift-tartary-rus-timeline-mirrors.md](swift-tartary-rus-timeline-mirrors.md).

### 2.3 Giants “in former ages” (historical frame)

The OCR corpus includes passages where **ancient giants** appear in argument (e.g. Glubbdubdrib / historical ghosts thread); grep keys: `giants in former`, `Brobdingnag`, `dwarf`. These support the **cover theme** (extreme stature contrast) without requiring a single literal theory of fossil giants.

### 2.4 Houyhnhnms / Yahoos (Part IV)

Not “size” satire in the same way, but **species boundary** satire: **reason ascribed to horses**, **humans as beasts**. Modern editions’ **illustrated covers** often emphasize **Lilliput + Brobdingnag** because the visual pun is immediate.

---

## 3. Was it published as “fiction”? What did Swift say?

### 3.1 Paratext and first publication

- **1726:** Appeared as **Lemuel Gulliver’s** travels; Swift’s authorship was **not** on the title page. The apparatus mimicked **travel literature and memoir**.  
- **Richard Sympson** (fictional cousin) functions as **editor** in prefatory material—**a nested hoax**, not a modern “this is a novel” disclaimer.

### 3.2 In-book stance (character, not modern author’s note)

Later editions (from **1735**) include **Gulliver’s letter to Sympson** complaining that printed versions **omitted or softened** harsh material (especially about **Yahoos**). In-fiction, Gulliver insists on the **truth** of his account and attacks polite editors—**parallel** to how suppressed memoirs are framed, whether or not Swift “believed” the islands existed.

### 3.3 Swift outside the novel — letters (secondary reporting)

Editors and biographers cite Swift’s **29 September 1725 letter to Alexander Pope**: Swift describes finishing his **Travels** in four parts for the press, jokes about needing a **brave printer**, and states his **vex the world** motive. That letter is **misanthropic program**, not a **genre label**; it does **not** say “I have written a novel” or “all events are imaginary.” **Primary verification:** use a scholarly edition of the correspondence (not web mirrors alone).

### 3.4 What Swift did **not** reliably do

- There is **no stable, simple line** like “Reader, this is entirely invented” attached to Swift’s public persona in 1726 comparable to a modern **fiction disclaimer**.  
- Reception quickly mixed **satire**, **political attack**, and **philosophical fable**; **some readers reportedly treated details more literally** than others—exactly the **sliding classification** this project tracks elsewhere (see predictive-programming / re-shelving literature).

### 3.5 Satire as partial explanation — but not a forced debunk

**Mainstream view:** Laputa mocks **Royal Society** projectors and **abstract learning**; the Martian moons are a **burlesque** of **Newtonian** celestial mechanics and discovery claims.

**Investigation posture (per site strategy):** Treat that reading as **one layer**. It explains **tone** and **targets** without **foreclosing** the question of **why specific numbers** appear, whether any **contemporary** could have **speculated** closer than chance, or whether **later cataloging** as “children’s classic / fiction” **erases** the original **documentary disguise**.

---

## 4. Open questions (for `OUTSTANDING`-style follow-up)

1. **Lineage of the numbers:** Are Swift’s distances/periods copied or adapted from a **known contemporary** (Keplerian exercise, journal, correspondent)?  
2. **Manuscript variants:** Do pre-Motte drafts or early editions **vary** the Martian satellite paragraph?  
3. **Cross-text Swift:** Do **serious astronomical** references elsewhere in Swift (letters, poems) corroborate sustained interest vs. one-off satirical set-piece?

---

## 5. Suggested next sources

- *The Correspondence of Jonathan Swift*, ed. Woolley (or equivalent), letter to **Pope**, **1725-09-29**.  
- *Journal to Stella* entries around **1724–1726** for composition mood (does **not** settle fiction vs. hoax by itself).  
- Asaph Hall papers and **late-19th-century** commentary on Swift’s “prediction” (historical reception).  
- NASA/JPL fact sheets for **Phobos** and **Deimos** orbital elements (for numeric cross-checks).

---

## 6. Methodology note

Arguments about **genre precursors** or **literary “tradition”** do **not** by themselves settle **content** questions (what is claimed, numbers, provenance). See [swift-investigation-debate-rails-and-drift.md](swift-investigation-debate-rails-and-drift.md) for the investigation’s **rails** and the **drift** pattern (including in automated debate).

---

Keywords: #swift #mars #giants #publication #stance #scale #beings #gulliver #sold #readers


# Directory Reorganization Map

This document tracks the mapping of old directory paths to the new "Spheres of Influence" hierarchical structure.

## New Hierarchy Overview

- `history/` - Chronological and geographic documentation.
- `governance/` - Systems of political and financial control.
- `influence/` - Media, propaganda, and information operations.
- `cosmos/` - Planetary and cosmological research.
- `science/` - Technological and biological research.
- `events/` - Case studies of specific historical operations.

## Detailed Path Mapping

| Old Path | New Path | Top-Level Category |
| :--- | :--- | :--- |
| `chronology/` | `history/chronology/` | History |
| `maps/` | `history/maps/` | History |
| `mudflood/` | `history/mudflood/` | History |
| `usury/` | `governance/usury/` | Governance |
| `war/` | `governance/war/` | Governance |
| `genocide/` | `governance/genocide/` | Governance |
| `censorship/` | `influence/censorship/` | Influence |
| `predictive_programming/` | `influence/predictive_programming/` | Influence |
| `conspiracy/` | `influence/conspiracy/` | Influence |
| `conspiracy/` (controlled opposition) | `influence/controlled_opposition/` | Influence |
| `conspiracy/hollywood/` | `influence/hollywood/` | Influence |
| `cosmology/` | `cosmos/cosmology/` | Cosmos |
| `mars/` | `cosmos/mars/` | Cosmos |
| `conspiracy/flat_earth/` | `cosmos/flat_earth/` | Cosmos |
| `conspiracy/5g/` | `science/5g/` | Science |
| `conspiracy/anti_gravity/` | `science/anti_gravity/` | Science |
| `conspiracy/health/` | `science/health/` | Science |
| `conspiracy/nukes/` | `science/nukes/` | Science |
| `conspiracy/telepathy/` | `science/telepathy/` | Science |
| `conspiracy/geoengineering/` | `science/geoengineering/` | Science |
| `conspiracy/911/` | `events/911/` | Events |
| `conspiracy/apollo/` | `events/apollo/` | Events |
| `conspiracy/false_flag/` | `events/false_flag/` | Events |
| `conspiracy/jfk/` | `events/jfk/` | Events |
| `conspiracy/philadelphia/` | `events/philadelphia/` | Events |

---

## Investigations Migration Plan (paradigm-threat-timeline → paradigm-threat-files)

**Update (Mar 2026):** The `paradigm-threat-timeline/investigations/` directory has been **removed**. All investigations now live in **paradigm-threat-files** (canonical) and **wget** (working copy / backup). Timeline repo no longer contains investigations.

**Source (for historical reference):** `paradigm-threat-timeline/investigations/*` was migrated. **Do NOT copy** `paradigm-threat-timeline/content/*`.

**Index rule:** If a destination folder has an `index.md` (or similar index file), that index must list/link the other files in the folder. If no index exists, files may stand alone.

### Migration Mapping

| Source (investigations/) | Destination (paradigm-threat-files/) | Index? |
| :--- | :--- | :--- |
| `chronology/*` | `history/chronology/investigations/` | Create `index.md` listing all |
| `mudflood/*` | `history/mudflood/investigations/` | Create `index.md` |
| `war/*` | `governance/war/investigations/` | Create `index.md` |
| `false-flags/*` | `events/false_flag/investigations/` | Use existing `index.md`; add refs to new files |
| `mars/*` | `cosmos/mars/investigations/` | Create `index.md` (or merge into existing mars index) |
| `fiction-encoding/*` | `influence/predictive_programming/fiction_encoding/` | Create `index.md`; author subfolders get index if multiple files |
| `de-grazia/*` | `cosmos/cosmology/de_grazia/` | Use `README.md` as index |
| `maxwell-aether/*` | `science/maxwell_aether/` | Create `index.md` |
| `nuclear-weapons/*` | `science/nukes/investigations/` | Create `index.md` |
| `weather-modification/*` | `science/geoengineering/investigations/` | Standalone or index |
| `havana-syndrome/*` | `science/havana_syndrome/` | Standalone |
| `religious-revival/*` | `influence/religion/investigations/` | Create `index.md` |
| `orphan-trains/*` | `history/orphan_trains/` | Standalone |
| `slavery/*` | `governance/slavery/` | Standalone |
| `cern-portal/*` | `science/cern_portal/` | Use existing `index.md` |
| `tennant/*` | `science/health/tennant/` | Standalone |
| `remote-viewing/*` | `science/telepathy/remote_viewing/` | Create `index.md` |
| `saturnian-cosmology/*` | `cosmos/cosmology/saturnian/` | Create `index.md` |
| `probiotics-chernobyl/*` | `science/health/probiotics_chernobyl/` | Standalone |
| `hairy-mary/*` | `influence/religion/hairy_mary/` | Create `index.md` |
| `kinkel/*` | `history/kinkel/` | Create `index.md` |
| `joan-of-arc/*` | `history/joan_of_arc/` | Standalone |
| `asimov/*` | `influence/predictive_programming/fiction_encoding/asimov/` | Use existing `index.md` |
| `other-refs/*` | `history/other_refs/` | Use `index-other-references.md` |
| `requerimiento-dating.md`, `thunderbolts-forum-archives.md`, `creation-dates-validation.md`, `death-on-mars-analysis.md` | `history/` or `cosmos/mars/` as appropriate | Standalone |

### Fiction-Encoding Subfolders (each with index if multiple files)

| Source | Destination | Index |
| :--- | :--- | :--- |
| `fiction-encoding/` (root files) | `influence/predictive_programming/fiction_encoding/` | `index.md` |
| `fiction-encoding/stoker/` | `influence/predictive_programming/fiction_encoding/stoker/` | `index-bram-stoker-investigation.md` lists `index-dracula.md` |
| `fiction-encoding/thompson/` | `influence/predictive_programming/fiction_encoding/thompson/` | `index-thompson-main.md` lists all |
| `fiction-encoding/wells/` | `influence/predictive_programming/fiction_encoding/wells/` | `index-wells.md` or `index-island-of-dr-moreau.md` |
| `fiction-encoding/shelley/` | `influence/predictive_programming/fiction_encoding/shelley/` | Single file or index |
| `fiction-encoding/tolkien/` | `influence/predictive_programming/fiction_encoding/tolkien/` | Index lists 3 files |
| `fiction-encoding/mars/*` (burroughs-barsoom) | `cosmos/mars/burroughs_barsoom/` | Existing README + indexes |

### Implementation Steps

1. **Create destination directories** that do not exist.
2. **Copy** each `paradigm-threat-timeline/investigations/<path>/*.md` to corresponding `paradigm-threat-files/<dest>/`.
3. **Fix internal links** in copied .md files (e.g. `../fiction-presented-as-fact` → same folder or new relative path).
4. **Create or update index files:**
   - Folders with 2+ files: add `index.md` (or use existing `index-*.md` / `README.md`) that links to each file.
   - Folders with 1 file: no index required.
5. **Update `index.json`** (or run `scripts/generate-index.ts`) so AssetBrowser sees new paths.
6. **Exclude:** Any `paradigm-threat-timeline/content/*` files. Only `investigations/*` are migrated.

### New Investigations (not from timeline)

| Source | Destination | Index? |
| :--- | :--- | :--- |
| `wget/stolen-credit/*` | `influence/stolen_credit/` | `index.md` |

### Notes

- Preserve subfolder structure (e.g. `fiction-encoding/stoker/` → `influence/.../stoker/`).
- `README.md` and `index-*.md` count as index files; ensure they reference sibling files.
- Some investigations may need new top-level folders (e.g. `science/maxwell_aether/`, `science/havana_syndrome/`).

---

Keywords: #reorganization-map #directory #reorganization #map


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

## Technical Implementation
- **Index:** `index.json` at the root tracks all file paths.
- **Automation:** A pre-commit hook runs `scripts/generate-index.ts` to keep the index updated.
- **UI:** The `AssetBrowser` in the main repo continues to work via recursive scanning but now uses the new logical paths.

# Bad Media URLs — paradigm-threat-files

Links that point to non-existent files. Fixed during 2026-03-11 cleanup: `events/philadelphia/page.md` (PNG_philadelphia_experiment.png → philadelphia_experiment.png).

## FIXED 2026-03-11

### cosmos/mars/page.md
- ~~`/cosmos/mars/heat_ray.jpg`~~ → `./wotw_technology_heat_ray.jpg` (heat_ray.jpg does not exist; using WoTW heat-ray image as substitute)

### history/chronology/history-qa/page.md
- ~~`../../../governance/genocide/giants_faeries/governance/genocide_giants4.jpg`~~ → `../../../governance/genocide/giants_faeries/genocide_giants4.jpg` (removed duplicate `governance/` in path)

### history/mudflood/page.md
- ~~`./../governance/genocide/giants_faeries/governance/genocide_giants9.jpg`~~ → `./../governance/genocide/giants_faeries/genocide_giants9.jpg` (removed duplicate `governance/` in path)

### events/false_flag/investigations/09-11-investigation.md
- ~~`../religious-revival/1979-religious-revival-investigation.md`~~ → `../../../influence/religion/1979-religious-revival-investigation.md` (1979 article moved out of investigations)

### events/false_flag/investigations/20th-21st-century-catalog.md
- ~~`[False Flags index](index.md)`~~ → `[False Flags](../a.md)` (index.md deleted; a.md is section intro)

### christ/cathar_suppression.jpg and christ/conjunction.jpg
- **Verified:** Both exist at `history/chronology/christ/`. No fix needed.

---

## FILES THAT DO NOT EXIST

### science/ai/ai-control-investigation.md
- **`ai-takeover.png`** — Image reference added; file must be created and placed in `science/ai/`. Add image to complete.

### events/trump/index-trump-investigation.md
- **`general-patton.md`** — Referenced at line ~51; file does not exist in `events/trump/`
- **`art-of-the-deal-analysis.md`** — Referenced (if present); file does not exist in `events/trump/`

### cosmos/mars/page.md
- **`heat_ray.jpg`** — Original target (crowd-control/ADS vehicle image). Does not exist. Substituted with `wotw_technology_heat_ray.jpg`.

---

## KNOWN / OUT OF SCOPE

### de_grazia — PDF/TXT references
Links in `cosmos/cosmology/de_grazia/` point to PDF and TXT files (e.g. chaos_and_creation.pdf, the_burning_of_troy.txt) that are not in the repo. These may be external or not committed.

### Cross-repo / external
- `cosmos/cosmology/saturnian/index-safireproject.md` — `../paradigm-threat-timeline/content/*.md` (different repo)
- Various `www.mythsarehistory.com/*` and `safireproject.com/*` — missing `https://`; treated as relative

---

## governance/war/investigations/yakuza — VERIFIED OK
- `../../influence/stolen_credit/nintendo-sony-breakup.md` — Path correct; file exists.

# Swift — Corpus & edition map

> **TL;DR:** Local Anna’s Archive **ZIPs** live under `/home/ari/dev/wget/swift`; **`_extract/`** holds **1828, 1856, 1906, 1910 *Gulliver*** plus **1823 *Select Works* vol. I**—use **1856 `39015078565952`** for a stable **Mars passage** anchor unless variants matter. **Conclusion:** OCR is for **search and quotes**, not critical-edition punctuation.

**Corpus root:** `/home/ari/dev/wget/swift`  
**See also:** `README.md` in that folder (local filesystem; not a site URL).

## What moved from Downloads

Five Anna’s Archive ZIPs were placed in `/home/ari/dev/wget/swift/` and unpacked to `_extract/`. No other Swift titles were found under `~/Downloads` at the time of the move.

## Edition → extract directory

| Edition (from filename metadata) | Primary extract path | Page `.txt` count (approx.) |
|----------------------------------|----------------------|-----------------------------|
| **1828** — Jones & Co., London | `_extract/Gulliver_s_travels_into_several_remote_nations_of_the_world/39015078565861/` | ~504 |
| **1856** — Derby & Jackson, NY | `_extract/Gulliver_s_travels_into_several_remote_nations_of_the_world/39015078565952/` or `_extract/gulliver_1856_derby_jackson/39015078565952/` | ~442 |
| **1906** — Dutton | `_extract/Gulliver_s_travels/39030038391340/` | ~310 |
| **1910** — Ward, Lock (coloured) | `_extract/Gulliver_s_travels_by_Jonathan_Swift_With_coloured/39015078566661/` | ~344 |
| **1823** — *Select Works* vol. I, McLean | `_extract/The_select_works_of_Jonathan_Swift_containing_the_whole_of/33433076096241/` | ~344 |

## Using the OCR

- Files are named like `00000290.txt` (page order). **Hyphenation at line breaks** is common; search for partial words if a grep misses.  
- The **1828** bundle is the largest and often includes **footnotes, life of Swift, and critical notes** — useful for “what contemporaries thought Gulliver was,” but it inflates word count versus plain *Gulliver* text.  
- For a **clean comparison** of the Mars passage across editions, grep `two lesser stars` or `revolve about Mars` under `_extract/`.

## Works **not** in this corpus

The *Select Works* ZIP here is **Volume I only** (see [index-swift-select-works-vol1-1823.md](index-swift-select-works-vol1-1823.md)). Other Swift titles advertised for the full set (*Gulliver* in later volumes, *Modest Proposal*, *Directions to Servants*, etc.) are **not** present in the moved files until additional volumes are obtained.

## Next steps (optional)

- Pull [Project Gutenberg #829](https://www.gutenberg.org/ebooks/829) (and related Swift IDs) into the same tree as a **single `.txt`** for line-stable citation.  
- Add vols. II–V of *Select Works* 1823 if they surface in Downloads.

---

Keywords: #swift #corpus #editions #edition #map


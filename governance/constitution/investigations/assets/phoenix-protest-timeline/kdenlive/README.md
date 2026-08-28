# Kdenlive — Chansley / FOX 10 pack-up pause

Open **`chansley-fox10-packup.kdenlive`** in Kdenlive 23.08.

## Layout

| File | Role |
|------|------|
| `../VID_20200624_110648.mp4` | **Original** Takeout roll — do not overwrite |
| `../VID_20200624_110648-captions.srt` | Captions on the **original** clock (no freeze) |
| `VID_20200624_110648-captions-edited-timeline.srt` | Captions for **pause edit** — auto-synced from project via `sync-edited-srt-from-kdenlive.py` |
| `freeze-frame.png` | Annotated still used for the **1:08** freeze hold |
| `fox10-packup-arrow.png` / `.svg` | Callout graphic — move/recolor in Kdenlive |

## Timeline (what to edit)

1. **0:00–1:08** — original clip  
2. **1:08–~1:18** — freeze of annotated still (`freeze-frame.png`)  
   - **Transform (pan_zoom)** on the freeze: slow zoom toward FOX 10 / Chansley callouts  
3. **~1:18–end** — original from 1:08 onward  

After export: run **`finalize-render.sh`** — reads pause/freeze length from this project, rebuilds `VID_20200624_110648-captions-edited-timeline.srt`, burns subs into `../VID_20200624_110648-fox10-packup-pause.mp4`. Original roll keeps `../VID_20200624_110648-captions.srt`.

## Phone rotation

The original is 3840×2160 with **-90°** display matrix (portrait). Kdenlive `auto_rotate` is on. If it opens landscape, add **Rotate / Transpose** on the original clip.

## Do not

Overwrite `VID_20200624_110648.mp4`. Export a **new** file (project already names the edited render separately).

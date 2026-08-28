# Kdenlive — Chansley / FOX 10 pack-up pause

Open **`chansley-fox10-packup.kdenlive`** in Kdenlive 23.08.

## Layout

| File | Role |
|------|------|
| `../VID_20200624_110648.mp4` | **Original** Takeout roll — do not overwrite |
| `../VID_20200624_110648-captions.srt` | Captions on the **original** clock (no freeze) |
| `VID_20200624_110648-captions-edited-timeline.srt` | Captions for **this** timeline (+10 s after 1:06) |
| `frame-0106.jpg` | Still at **1:06** (FOX 10 turning away, left) |
| `fox10-packup-arrow.png` / `.svg` | Callout graphic — move/recolor in Kdenlive |

## Timeline (what to edit)

1. **0:00–1:06** — original clip  
2. **1:06–1:16** — freeze of that frame  
   - **Transform (qtblend)** on the freeze: slow zoom toward the **left** (FOX 10)  
   - **V2 overlay:** arrow PNG with the **same** Transform keyframes so the tip stays on the camera  
3. **1:16–end** — original from 1:06 onward  

Drag the arrow PNG if the tip is off the camera. Both Transform effects should match (start `0 0 2160 3840`, end about `0 -480 3024 5376` — left-locked ~1.4× zoom).

## Phone rotation

The original is 3840×2160 with **-90°** display matrix (portrait). Kdenlive `auto_rotate` is on. If it opens landscape, add **Rotate / Transpose** on the original clip.

## Do not

Overwrite `VID_20200624_110648.mp4`. Export a **new** file (project already names the edited render separately).

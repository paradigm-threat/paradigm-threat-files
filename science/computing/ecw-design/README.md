# ECW faceplate design — canonical SVG reference

Orthographic layouts for the [Exact-Change Wallet](/science/computing/exact-change-wallet-invention-and-aftermath.md) (reader essay + [§V inventor containment](/science/computing/exact-change-wallet-invention-and-aftermath.md#v-inventor-containment--how-the-third-act-gets-scripted)). Engineering spec: [invention specification](/science/computing/exact-change-wallet-invention-spec.md). Use these SVGs as **ground truth** for ChatGPT / DALL-E renders — text-only prompts misread “slider” as **binary slide switches**.

## Files

| File | View | Shows |
|------|------|--------|
| [`card-slice-top.svg`](card-slice-top.svg) | Top | 102×67 mm slab, **3Q·2D·1N·4P** pockets, amber coin LEDs, right-edge **display + bill halo + dual rotary wheels** |
| [`card-slice-edge.svg`](card-slice-edge.svg) | Right edge profile | ~5.5 mm thickness, knurled **wheels** (not switches), control stack order |
| [`full-wallet-tray-ui.svg`](full-wallet-tray-ui.svg) | Tray leaf | **Display stack** top-right: halo → readout → **`$` `−` `+`** → optional **0–9 keypad** (Panel D) |
| [`full-wallet-hybrid.svg`](full-wallet-hybrid.svg) | Tray leaf | **Panel E** — **11 coins**: **3Q+2D+1N+4P+$1** (120 mm tray), keypad, UI rail right |

SVG layers (for editors): `coins`, `leds`, `display`, `bill_halo`, `wheels`, `buttons`.

## Control summary

### Card Slice — rotary wheels only

1. **Display** (`20.24`)
2. **Bill halo** — white/blue ring around display when ≥$1 extra paper needed
3. **Integer wheel** — **0–99**, $1 detents, label `$`
4. **Cents wheel** — **0–99**, 1¢ detents (5¢ on dollar SKU), label `¢`

**No** linear slide switches. **No** `−`/`+`/`GO` buttons.

### Full Wallet — display stack

```
┌─────────────────┐
│  ○ BILL HALO ○  │
│     20.24       │
│  [ $ ] [−] [+]  │
│  [1][2][3] ...  │  ← Dollar Plus only; below buttons, NOT on hinge
└─────────────────┘
```

Pre-exported PNGs (300 DPI) ship alongside SVGs for ChatGPT upload:

- `card-slice-top.png`
- `card-slice-edge.png`
- `full-wallet-tray-ui.png`
- `full-wallet-hybrid.png`

Re-export after editing SVG:

```bash
# Inkscape CLI
inkscape card-slice-top.svg -o card-slice-top.png -d 300
inkscape card-slice-edge.svg -o card-slice-edge.png -d 300
inkscape full-wallet-tray-ui.svg -o full-wallet-tray-ui.png -d 300
inkscape full-wallet-hybrid.svg -o full-wallet-hybrid.png -d 300

# Or librsvg
rsvg-convert -w 2400 card-slice-top.svg -o card-slice-top.png
```

Upload **PNG +** [`chatgpt-prompt.md`](chatgpt-prompt.md) to ChatGPT. Iterate **one panel** at a time before a 2×2 sheet.

## Coin tray (do not drift)

- Row 1: **3× quarter**
- Row 2: **2× dime + 1× nickel** (D·D·N) — nickel **wider** than dime
- Row 3–4: **4× penny** in **2×2** (penny SKUs) **or** **1× golden dollar** (dollar SKUs)
- **Hybrid (E, wallet only):** **4× penny** 2×2 **plus** **1× golden dollar** on row 5 — **11 coins**, **120 mm** tray; **no slim Card Slice** (67 mm target cannot fit all denominations)

Validate math: `npm run exact-change-sim` in repo root.

## ChatGPT prompt

See [`chatgpt-prompt.md`](chatgpt-prompt.md).

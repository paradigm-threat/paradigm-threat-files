# ChatGPT render prompt — ECW (Exact-Change Wallet)

**Before prompting:** export SVGs to PNG and **upload as reference images**:

- `card-slice-top.png`
- `card-slice-edge.png`
- `full-wallet-tray-ui.png`

Prompt text alone will produce **binary slide switches** instead of **rotary wheels**. The reference PNGs are mandatory.

---

## Master prompt (2×2 product sheet)

```
Photorealistic ECW (Exact-Change Wallet) product design sheet — 2×2 grid, neutral light-gray studio background. Match the UPLOADED REFERENCE LAYOUTS exactly for control placement and coin counts.

REFERENCE: I uploaded orthographic faceplates. Do NOT invent slide switches, toggle switches, or hinge-mounted keypads.

═══════════════════════════════════════════════════
COIN TRAY (ALL PANELS)
═══════════════════════════════════════════════════
Row 1: THREE quarters (Washington, ~24.3 mm)
Row 2: TWO dimes (Roosevelt, SMALLEST ~17.9 mm) + ONE nickel (Jefferson, ~21.2 mm, WIDER) — order D·D·N
  NEVER three dimes. NEVER zero nickels.
Row 3 penny SKUs (A, C): FOUR pennies in 2×2 grid (Lincoln ~19.1 mm)
Row 3 dollar SKUs (B, D): ONE golden Sacagawea $1 (~26.5 mm), centered — NO pennies

Ten amber coin LEDs — one under each slot thumb edge.
Tray ~77×90 mm (penny) or ~77×76 mm (dollar). Slice thickness 5–6 mm; Wallet 8–10 mm closed.

═══════════════════════════════════════════════════
BILL INDICATOR — PROMINENT
═══════════════════════════════════════════════════
NOT a tiny dot on the tray top.
Use a WHITE/BLUE GLOWING HALO RING around the numeric display when "BILL+" is active.
The halo is part of the display stack — impossible to miss.
When inactive: faint ring or off; when active: bright ring + display may show handover (e.g. 21.14 vs 20.24).

═══════════════════════════════════════════════════
CARD SLICE (Panels A & B) — ROTARY WHEELS ONLY
═══════════════════════════════════════════════════
Right edge rail (~18 mm wide), control stack top→bottom:
1. Display "5.99" or "20.24" with BILL HALO ring around it
2. Knurled ROTARY THUMB WHEEL ~12 mm, label "$", spins 0–99 whole dollars
3. Knurled ROTARY THUMB WHEEL ~12 mm, label "¢", spins 0–99 cents

Wheels are ROUND and SPIN — like a camera dial or DJ knob — NOT linear slide switches.
NOT toggle switches. NOT INT/¢ slide rails.
NO minus button. NO plus button. NO GO button anywhere on A or B.

Side profile inset: wheels protrude ~1 mm from edge rail; slab ~5.5 mm total.

Panel A label: "A · Slice · Penny · rotary wheels"
Panel B label: "B · Slice · Dollar · rotary wheels"

═══════════════════════════════════════════════════
FULL WALLET (Panels C & D) — DISPLAY STACK
═══════════════════════════════════════════════════
NO rotary wheels on wallet panels.
NO sliders.

UI block at TOP-RIGHT of coin-tray leaf (above coin rows):

┌─────────────────┐
│  ○ BILL HALO ○  │
│     20.24       │
│  [ $ ] [−] [+]  │  ← DIRECTLY under display
└─────────────────┘

Panel C (Penny): display stack + three buttons only. Black bifold; cards/ID/bills on left leaf.
Panel D (Dollar Plus): same stack + 3×4 numeric keypad (0–9, C) DIRECTLY BELOW the three buttons — still on tray rim, NOT on wallet center hinge, NOT on far edge.

Bill halo on display — NOT on bill pocket alone.

Panel C label: "C · Wallet · Penny · buttons under display"
Panel D label: "D · Wallet · Dollar Plus · keypad under buttons"

Legend bar: "No app · No Bluetooth · CR2032 · Amber LED = take coin · Blue/white halo = add ≥$1 paper · Slice = spin wheels · Wallet = buttons under display"

Style: Dieter Rams / Braun minimal EDC. Matte charcoal polymer + black leather. No touchscreen. No motorized dispensers.
```

---

## Single-panel prompts (iterate one at a time)

### Slice Penny only

```
Photorealistic ECW Card Slice, 3/4 product angle + side profile inset.
UPLOAD card-slice-top.png + card-slice-edge.png as reference — match layout exactly.

ROTARY knurled thumb wheels on right edge (round, spin 0–99) — NOT slide switches.
Stack: display with blue BILL HALO ring → $ wheel → ¢ wheel.
Coins: 3Q, 2D+1N (nickel wider than dimes), 2×2 pennies.
NO −/+ buttons. NO GO.
~102×67×5.5 mm charcoal slab.
```

### Full Wallet Penny only

```
Photorealistic ECW Full Wallet bifold open. UPLOAD full-wallet-tray-ui.png.

Top-right of tray leaf: display with BILL HALO ring, then $ − + buttons DIRECTLY UNDER display.
NO wheels. NO hinge buttons. NO GO.
Coins: 3Q, 2D+1N, 2×2 pennies. Amber slot LEDs.
Left leaf: cards, ID, $20 bill.
```

---

## Common failures (reject and re-prompt)

| Wrong | Correct |
|-------|---------|
| Linear INT/¢ slide switches | **Knurled rotary wheels** |
| − / + / GO on Card Slice | **Wheels only** on Slice |
| Buttons on wallet far edge or hinge | **Display stack top-right of tray** |
| Tiny $ LED on tray top | **Halo ring around display** |
| 3 dimes, 0 nickels | **2 dimes + 1 nickel** |
| Keypad on center fold (D) | **Keypad below $−+ on tray rim** |

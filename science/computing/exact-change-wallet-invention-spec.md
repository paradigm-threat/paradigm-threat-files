# Exact-Change Wallet — invention specification

Engineering definition for the **Exact-Change Wallet (ECW)** — companion to the narrative article [Exact-Change Wallet — Invention and Aftermath](https://paradigmthreat.net/science/computing/exact-change-wallet-invention-and-aftermath.md). This file is the **canonical product spec**: controls, tray geometry, **control-logic** states, spend-map tables, SKUs, and validation. Politics, prior art, and why-it-never-shipped live in the article; mm faceplate art lives in [`ecw-design/`](https://paradigmthreat.net/science/computing/ecw-design/README.md).

**Set the total. Follow the lights.**

---

## Read order

1. **§0–§2** — what the device is (one paragraph + architecture + **§2.1–§2.2 controller BOM**)
2. **§3–§4** — register behavior and controls (MVP)
3. **§5–§6** — form factors, dimensions, SKU matrix
4. **§7** — minimum coin inventory (mathematics)
5. **§8–§9** — control-logic states and spend-map algorithm
6. **§10** — scenario tests (`npm run exact-change-sim`)
7. **§11–§13** — anti-patterns, hardware rationale, open TODOs

---

## 0. Product definition

A **wallet-sized actuator**: **fixed I/O only** — one **presence sensor per slot**, one **amber LED per slot**, **bill halo** (white/blue ring) around the numeric display, coin-cell power, and **sale-total input** — **dual rotary thumb wheels 0–99** (Card Slice) or a **display stack with `$` / `−` / `+`** plus optional **0–9 keypad** (Full Wallet). User sets register total (**5.99**, **20.24**); **coin LEDs and bill halo update on every detent or button press**. No confirm step, no app, no touchscreen, no Bluetooth, **no expansion bus**, **no field updates**.

The tray holds a **fixed multiset** of U.S. coins — **ten pieces** in the usual penny-era SKU — in **molded slots with light pipes**. Whole dollars come from **paper in the bill pocket** (Full Wallet) or the user's existing wallet (Card Slice). The **cents column** comes **only from the tray**. Goal: **closed coin inventory** — never a second purse of loose change if the user follows the protocol and the cashier is accurate.

---

## 1. Problem statement

**Normal wallets fail coins:** bill compartments fit paper; coin pockets become a **single lump** that bulges, jingles, and does not scale.

**Checkout fails mental math:** bridging register total ↔ scattered metal under time pressure is a **skill**, not a reflex. Card tap exists because most people hate subtracting **$14.37** from a twenty and decomposing **37¢** while the line moves.

**ECW replaces** the coin pocket with a **dedicated tray**: each denomination gets **its own slot and LED**. User carries **only** what fits the tray — not whatever accumulated since last Tuesday.

---

## 2. Physical architecture

| Subsystem | MVP |
|-----------|-----|
| **Controller** | **Fixed-program controller IC** — closed I/O map; spend-map tables in **ROM/Flash**, not a general-purpose computer (see **§2.1**) |
| **Sensors** | One **presence** sensor per slot (optical interrupter, capacitive, or mechanical — TBD BOM) |
| **Coin LEDs** | Amber, at **thumb edge** of each pocket; lit = **take this coin** |
| **Bill halo** | White/blue **ring around display** — not a tray-edge dot |
| **Display** | ~22×8 mm 4-digit 7-seg (TM1637-class) or small segment LCD via dedicated driver |
| **Input** | Card Slice: **2× rotary encoder**; Full Wallet: **3× GPIO buttons** + optional keypad |
| **Power** | CR1220-class coin cell in ~1.5 mm edge rail (Card Slice); similar or LiPo (Full Wallet) |
| **PCB** | Flex or rigid; **edge-mounted** in Card Slice rail |

**Tray mechanical:** single flat layer; nickel thickness (**1.95 mm**) sets cavity depth; with minimal slot lips, coin layer **~2–2.3 mm**. Slot clearance **~0.4 mm** — fingernail in/out, no coin-purse slack.

### 2.1 Controller philosophy — fixed logic, not a computer product

**Design intent (author):** The ECW is **combinatorial + small-state-machine logic** — a **closed set of inputs and outputs** that could, in principle, live on a **dedicated circuit board** (discrete gates, PLD, or mask-ROM controller). There is **no** operating system, **no** networking, **no** plugins, **no** post-ship feature lane. Processing = **lookup + compare + latch**: read total and sensors → emit LED map and halo → hold until coin motion resets.

**Prototype reality:** Breadboarding the full **overpay solver** as pure discrete logic was **impractical for a demo**. A **single low-pin-count controller IC** running **frozen tables** (same behavior as the sim in `scripts/exact-change-wallet-sim.mjs`) is the **recommended bring-up path** — functionally equivalent to **burned-in logic**, not a platform.

**I/O budget (penny-era, ten slots + halo + display + Card Slice wheels):**

| Signal class | Count | Notes |
|--------------|-------|-------|
| Coin presence | 10–11 | One per slot (11 on Hybrid E) |
| Coin LED + halo | 11–12 | Constant-current **I2C LED driver** (not 12 GPIO wires) |
| Display | 1 block | **TM1637** 4-digit 7-seg (2-wire) or **HT1621B** + segment LCD |
| Rotary wheels | 2× quadrature | Card Slice — 4 GPIO |
| Buttons / keypad | 3–15 | Full Wallet — direct GPIO or expander on Dollar Plus |
| Bus | I2C | Shared: display + LED driver (+ optional port expander) |

### 2.2 Recommended controller BOM (MVP demo — smallest practical stack)

Goal: **minimum mass and board area** while meeting the **fixed I/O map** above. All parts are **catalog**; production could later move to **OTP/mask-ROM** or **CPLD** once tables are frozen.

| Role | Part (recommended) | Package / mass | Why |
|------|-------------------|----------------|-----|
| **Controller IC** | **Microchip ATtiny1616-MNR** | **20-VQFN 3×3 mm** (~0.02 g) | 16 KB Flash, 2 KB RAM; **sleep ~1 µA**; enough GPIO + I2C for muxed sensors and drivers; spend-map + overpay search fit with headroom |
| **Full Wallet / keypad SKU** | **ATtiny3216-MNR** (alternate) | 24-VQFN 4×4 mm | Extra pins for **3×4 keypad** without a second expander |
| **4-digit readout** | **TM1637** module or bare IC | ~16×8 mm board | Two-wire 7-segment; shows **20.24** / **21.14** / **NO FIT** |
| **Coin + halo LEDs** | **AW9523B** or **IS31FL3733** | QFN / WLCSP | **16-channel** constant-current **I2C** sink — covers **10–11 coin LEDs + halo ring** with one chip |
| **Sensor front-end** | **CD74HC4067** 16:1 mux + dividers | SOT / SOIC | **11 presence inputs → 1 analog pin** on controller; keeps controller pin count low |
| **Passives + CR1220** | — | Edge rail | **Target active electronics < 2 g** excluding cell |

**Not recommended for ECW:** **ATmega328-class** boards (Arduino footprint — too large, wrong product story), **ESP32** / **STM32** wireless parts (radio absent by design), **Linux SOM** — all imply **general-purpose computer** overhead this product explicitly rejects.

**Power budget (order of magnitude):** Live state with LEDs lit — **~5–15 mA** burst on TM1637 + amber LEDs; sleep in pocket with display blank — **< 10 µA** target on ATtiny1616 with I2C drivers in shutdown. **CR1220** (~45 mAh) → **months** of typical checkout use if the controller sleeps between trips.

**Demo ↔ production path:** Prototype on **ATtiny1616** with **one-time programmed** Flash; production spin replaces the same binary with **ROM mask** or **CPLD table** when the spend-map is frozen — **no user-facing “computer” upgrade path**.

---

## 3. Register operating model

### 3.1 Pay exact — full inventory

Cover **whole dollars** with paper. Cover **cents** from tray only.

Example: total **$14.37**. Dial **14.37**. Coin LEDs light for **37¢** immediately. Bill halo **off** when **$14** in ones suffices. Hand **$14** bills + lit coins. **Coin change: zero.**

### 3.2 Pay with short inventory — bill halo

When live inventory **cannot** make the sale's **cents column**, coin-only LEDs are **misleading**.

Example: total **$20.24**, sensors report **14¢** on hand (e.g. 1D+4P). Lighting only "use 14¢" suggests **$20 + 14¢** closes the sale — **false**; still owe **10¢** more metal or must **overpay in bills**.

The control logic must:

1. Read **sale total** and **live inventory** (RAM + sensors).
2. If cents column **reachable** → coin LEDs only, bill halo off, handover = **⌊total⌋ dollars + exact cents subset**.
3. If cents column **not reachable** → search **handover** (**B** paper dollars + coin subset **S**) such that **change back** refills emptied slots without overflow.
4. Typically **B > ⌊total⌋** — e.g. **$21 + 14¢** on **$20.24** tab → **90¢** change back in standard mix refills tray.
5. **Coin LEDs** → coins in **S** (often **all cents on hand**, not "enough to cover 24¢").
6. **Bill halo on** → must hand **≥ $1 more** paper than **⌊total⌋**.
7. **Display** shows **handover** (**21.14**) live whenever it differs from dialed total (**20.24**).

Without bill halo, the product reads as a **coin-only calculator** — fine at **$5.99** with full tray, **dangerous** at **$20.24** depleted when the user needs "**extra dollar bill**," not "**more dimes**."

### 3.3 LED latch behavior (MVP)

While total is **non-zero**:

- Coin LEDs and bill halo **track every input change** (wheel detent or button press).
- After user **removes** coins from lit slots → map **freezes** (Hold state).
- **Any coin inserted** → reset to **Idle**: **0.00**, all LEDs off, halo off.
- **Power-on** and **CLEAR** → Idle.

### 3.4 Break change back (v1 deferral)

After wrong payment, lane rounding, or taking coin change: **v1** user **sorts by hand** after coin-insert reset. **v2** optional **deposit-map** mode: light "put here" slots on insert until vector matches design (**3Q/1D/2N/4P** or post-penny **3Q/1D/2N**) without clearing on first coin.

### 3.5 Design invariant

If user starts at or below designed inventory, pays dollars in paper and cents from tray, and cashier is accurate → **stay inside coin budget** — no jar at home. Exceptions: empty slot, only a **$20** for **$5.99**, lane rounding ≠ typed total, clerk error, user ignores lights.

---

## 4. Controls — MVP (control logic identical; input driver differs)

| | **Card Slice (slim)** | **Full Wallet** |
|--|------------------------|-----------------|
| **Input** | **Two rotary wheels** 0–99 on right edge rail | **Display stack** top-right: halo → readout → **`$` `−` `+`** |
| **Integer / dollars** | Whole **0–99**, **$1** detents, label **`$`** | **`$`** toggles dollar mode; **`−`/`+`** in **$1** steps |
| **Cents** | **0–99**, **1¢** detents (**5¢** on dollar SKU), label **`¢`** | **`$`** again → cent mode; **`−`/`+`** in **1¢** or **5¢** steps |
| **Bill indicator** | **Halo ring** around display | Same |
| **Display** | **20.24** or handover **21.14** | Same |
| **Live update** | Every **wheel detent** | Every **button press** |
| **CLEAR** | Both wheels → **0** or long-press either wheel | Long-press **`$`** → **0.00**, LEDs off |
| **GO button** | **None** | **None** |

**Card Slice rejects:** linear slide switches, toggle sliders, **`−`/`+`/`GO`** on slim SKU, hinge-mounted keypad.

Canonical faceplates: [`ecw-design/`](https://paradigmthreat.net/science/computing/ecw-design/README.md) SVGs (mm-accurate).

**Card Slice mechanical options:** detented rotary encoder or indexed pot per wheel; ADC → spend map on every detent (~10 ms debounce).

---

## 5. Form factors and dimensions

Same **coin brain** in both SKUs: tray profile + one LED per slot + bill halo + edge **controller** + **no app**.

### 5.1 Shared tray layout

**Penny-era canonical mold (faceplate art):** **3Q · 2D · 1N · 4P** — ten coins, **104¢** face, **single flat layer**.

Three bands: **3Q | 2D · 1N | 4P** (2×2 pennies).

**Ship / math canonical multiset:** **3Q · 1D · 2N · 4P** — ten coins, **99¢** face (minimum count for 1–99¢ coverage). Alternate **1-nickel vs 2-nickel** mold is a **tooling choice**; control tables / sim accept both.

Tray active area **~79 × 67 mm** — credit-card **width**, not ISO 85 mm height. Product width tracks **billfold interior ~100–102 mm**.

### 5.2 Card Slice — slim insert

For users who **already own a wallet** and want the **coin protocol** only.

- **Form:** flat slab; coins on face; paper stays in existing wallet.
- **Target:** **~102 × 67 × 5–6 mm** closed (not 85×54×13).
- **Profile:** ~2× three credit cards stacked (~2.3 mm PVC), not 17×.
- **UI rail:** right long edge **~18 × 55 mm** — display → bill halo bezel → **$ wheel** → **¢ wheel** (~12 mm knurled each).
- **Electronics:** flex PCB + **CR1220-class** in edge rail.

### 5.3 Full Wallet — bifold

One front-pocket object at checkout.

- **Form:** slim bifold; **tray leaf** + **carry leaf** (2–4 card slots, optional ID window, bill pocket).
- **Target closed:** **~102 × 90–100 × 8–10 mm**.
- **UI block:** top-right of tray leaf — **77 mm coin tray + 20 mm UI rail**, no overlap:

```
┌─────────────────┐
│  ○ BILL HALO ○  │
│     20.24       │
│  [ $ ] [−] [+]  │
│  [1][2][3]…     │  ← Dollar Plus: keypad below buttons, on tray rim, NOT hinge
└─────────────────┘
```

- **`$`** toggles dollar vs cent field.
- **`−` / `+`** directly under display.
- **Dollar Plus:** 3×4 keypad below three buttons; still **no GO**; each press updates LEDs live.

See [`full-wallet-tray-ui.svg`](https://paradigmthreat.net/science/computing/ecw-design/full-wallet-tray-ui.svg), [`full-wallet-hybrid.svg`](https://paradigmthreat.net/science/computing/ecw-design/full-wallet-hybrid.svg).

---

## 6. Product SKU matrix

Policy fork: [U.S. coin phase-out investigation](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md) §8–§11. Design covers **both** penny-era and nickel-rounded futures.

| SKU | Tray | Coins | Face | Input | Cent steps |
|-----|------|-------|------|-------|------------|
| **A · Card Slice · Penny** | 3Q/2D/1N/4P | 10 | 104¢ | Dual wheels | 1¢ |
| **B · Card Slice · Dollar** | 3Q/2D/1N/1×$1 | 7 | — | Dual wheels | 5¢ |
| **C · Full Wallet · Penny** | 3Q/2D/1N/4P | 10 | 104¢ | `$ − +` | 1¢ |
| **D · Full Wallet · Dollar Plus** | 3Q/2D/1N/1×$1 | 7 | — | `$ − +` + keypad | 5¢ |
| **E · Full Wallet · Hybrid Plus** | 3Q/2D/1N/4P/1×$1 | 11 | 204¢ | `$ − +` + keypad | 1¢ + $1 slot |

**Panel E:** **120 mm** tray height; **wallet-only** — slim Card Slice **cannot** fit eleven coins at **67 mm** target.

Concept sheet: [exact-change-wallet-invention-concept.png](https://paradigmthreat.net/science/computing/exact-change-wallet-invention-concept.png).

**Marketing hooks:** Phase-out camp — "**nickel-exact without mental math**." Keep-penny / prepper camp — "**no app, no account, no hack surface**" — bearer cash with LED protocol.

---

## 7. Minimum coin inventory (mathematics)

Denominations **{25¢, 10¢, 5¢, 1¢}**. Exhaustive search (`npm run exact-change-sim`) confirms:

**Smallest coin count** that makes **every amount 1¢–99¢** = **ten coins**.

**Canonical ship multiset:** **3 quarters · 1 dime · 2 nickels · 4 pennies** = **99¢** face.

**Faceplate / alternate multiset:** **3Q · 2D · 1N · 4P** = **104¢** face — same ten coins; one more dime, one fewer nickel.

**Nine-coin failure:** **3Q · 1D · 1N · 4P** fails (e.g. cannot make **20¢**).

**Why bounds hold:** At most **3Q** (4×25 > 99). Optimal change-making needs at most **2D**, **2N**, **4P** across 1–99; **four pennies** is hard cap (five pennies → nickel).

**Alternate ten-coin 99¢ solution:** **2Q · 4D · 1N · 4P** (eleven coins if you add one) — author prefers **3Q/1D/2N/4P** for fewer dimes, same coverage.

**Guarantee (when protocol holds):** Pay cents column **exactly** from tray; whole dollars in paper → **no coin change back** from cashier.

**Post-penny tray:** **3Q · 1D · 2N** — six coins, **95¢** face, **5¢** granularity (amounts 0, 5, …, 95¢).

---

## 8. Control-logic state machine

Phone calculators answer **"what is 20.00 − 14.37?"** ECW control logic answers **"which coins do I move so the wallet returns to equilibrium?"**

| State | Display | LEDs | Enter | Exit |
|-------|---------|------|-------|------|
| **Idle** | `0.00` | All off | Power-on, CLEAR, **any coin insert** after Hold | Wheel detent or button press |
| **Live** | Total or handover | Track every input | First input from Idle | Total → 0, or coin removed → Hold |
| **Hold** | Handover frozen | Frozen after removal | First coin **removed** from lit slot while Live | Any coin insert → Idle |

**NO FIT:** When overpay solver finds no **(B, S)** with simulated change fitting empty slots (e.g. empty tray + only **$100** for **$3.47**), display **NO FIT**; stay latched until CLEAR or coin insert.

---

## 9. Spend-map algorithm (Live state)

On **every** input event while Live:

1. Read **current total** (cents) and **live inventory** (sensor-backed RAM).
2. Compute **cents column** = total mod 100.
3. If subset of inventory can make cents column **exactly** → mode **exact**, bill halo off, handover = total.
4. Else run **overpay solver:** search **B** ∈ {⌊total/100⌋, …, ⌊total/100⌋ + maxExtraBills} and subset **S** ⊆ inventory such that payment **B×100 + value(S)** ≥ total and **change back** in coins fits **empty slots** without exceeding tray caps.
5. Emit **coin LED map** for **S**, **bill halo** if **B > ⌊total/100⌋**, **handover** = **B×100 + value(S)** in display form.
6. On transition to **Hold** (coin removed), stop recomputing until insert → Idle.

Reference implementation: `scripts/exact-change-wallet-sim.mjs` in repo root — run `npm run exact-change-sim`.

**Deposit / break-back (v2):** On insert in deposit mode, light target slots until vector matches design multiset without Idle reset on first coin.

---

## 10. Validated scenarios (sim MVP)

Run: `npm run exact-change-sim` from `paradigm-threat-files` root. Key scenarios:

| Scenario | Tray | Inventory | Total | Expected |
|----------|------|-----------|-------|----------|
| Full tray exact | 3Q/2D/1N/4P | full | $14.37 | exact, halo off |
| **$20.24 / 14¢ on hand** | 3Q/2D/1N/4P | 1D+4P | $20.24 | overpay, **halo on**, handover **$21.14**, change **90¢** |
| Short + no extra bills | 3Q/1D/2N/4P | 1D+4P | $20.24, maxExtraBills=0 | **NO_FIT** |
| Post-penny | 3Q/1D/2N | full | $5.95 | exact at 5¢ granularity |

Sim also validates: **99/99** exact maps at full inventory (both ONE_NICKEL and TWO_NICKEL trays); minimum 10-coin search; **500-trial** random depleted inventory classification.

---

## 11. What we are not building

- Thick **clamshell** with keypad deck under tray (~13 mm).
- **Motorized dispensers** or solenoid spit (see Pocket Pal prior art — opposite mechanism).
- Hopper capacity beyond **eleven coins** (Hybrid E).
- "Credit card sized" in **both** dimensions with ten flat coins — geometry does not close.
- App, Bluetooth, cloud account, payment rail integration.
- Touchscreen UI.

Industrial design goal: **one molded tray**, **one fixed-function controller**, light pipes — **calculator discipline**, not fintech wearable.

---

## 12. Why hardware, not an app

A phone app computes change. It cannot **hold** coins, **limit** inventory, **sense** obedience, or **point** at a slot under stress. The tray **is** the protocol.

No PCI, no KYC, no "sign in with Google," no **2.9% + 30¢** on a **37¢** decision. **Local actuator** for **legal tender** already owned — last anonymous retail layer in a ledger-first decade.

---

## 13. Open engineering TODOs

| ID | Topic | Notes |
|----|-------|-------|
| **E1** | **Sensor reconciliation** | Full tray rescan on lid close vs RAM drift; "count mode" long-press — **never specced on paper**; difference between toy and trusted device on trip 20 |
| **E2** | **NO FIT UX** | Copy, audible?, when maxExtraBills exhausted |
| **E3** | **Deposit-map v2** | Break-change lighting without Idle on first insert |
| **E4** | **BOM lock** | ATtiny1616 + TM1637 + AW9523B + sensor mux; flex vs rigid PCB; battery life budget — see **§2.2** |
| **E5** | **Certification** | FCC/CE if radio absent — still need product safety story |
| **E6** | **Golden dollar pocket** | ~26.5 mm cavity; Hybrid row 5 layout |

---

## Where next

- [Exact-Change Wallet — Invention and Aftermath](https://paradigmthreat.net/science/computing/exact-change-wallet-invention-and-aftermath.md) — politics, prior art, patent bar, inventor containment, why not shipped
- [ECW faceplate SVGs](https://paradigmthreat.net/science/computing/ecw-design/README.md) — mm layouts, ChatGPT prompts, PNG exports
- [U.S. coin phase-out investigation](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md) — §10.1 minimum inventory table, SKU policy fork
- Repo: `scripts/exact-change-wallet-sim.mjs` — run `npm run exact-change-sim`

---

## Framing and limits

This file is an **engineering specification** — not a patent application, not a manufacturing BOM, not a shipped product. Tray inventories **{25, 10, 5, 1}** cents verified by computational search; re-run locally. **Post-penny** rounding differs by state and retailer — see linked investigation. **3Q/1D/2N/4P @ 99¢** multiset is **published mathematics**; author's contribution is the **operational layer** (tray boundary + LED protocol + bill halo). Sensor and reconciliation details in §13 are **design intent**, not built or tested hardware.

Keywords: #ExactChangeWallet #ECWSpec #FixedLogicController #CoinInventory #SpendMap #BillHalo #CardSlice #FullWallet #ParadigmThreatFiles

**Last updated:** 2026-06-30T23:00:00-04:00

---

*Written and narrated by Ari Asulin, with drafting and research support from LLM agents. Recovered from pre-trim article commit `6462e7c` (2026-06-29) plus current sim and faceplate canon.*

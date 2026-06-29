# The Exact-Change Wallet

A wallet-sized embedded device — two SKUs: slim coin insert or full slim wallet with card/ID slots

![The Exact-Change Wallet — article header](exact-change-wallet-invention.png)

The invention is a **wallet-sized embedded device** — a small CPU, a coin sensor per slot, **one LED per coin slot**, a **bill halo** around the display, a coin-cell or rechargeable power source, and **two rotary thumb wheels 0–99** plus a display (Card Slice) or a **display-stack with `$` / `−` / `+` buttons** (Full Wallet). You set the register total — **5.99**, **20.24** — and the **coin and bill LEDs update on every detent or press**. No confirm step, no app, no touchscreen.

Two problems ordinary wallets never solved: **coins do not fit** in a billfold in any sane way (they bulge, jingle, mix denominations, and turn into lint at the bottom of a pocket), and checkout **punishes anyone who cannot do fast mental math** under social pressure — subtract the total from your bill, decompose the cents, hunt the right pieces before the line moves. This device sidesteps both. The tray holds a **fixed, minimum** set of coins in molded slots — **ten pieces** — so change never becomes a loose pile that outgrows the wallet. The wheels (or buttons) and LEDs do the arithmetic; you do not need to compute **37¢ from $14.37** while someone sighs behind you.

The point is not a calculator novelty. The point is a **closed coin inventory**: you carry the **minimum** set of U.S. coins below one dollar that can still cover **every** cents-only amount you need when dollars are paper, and you **never** accumulate a second purse of loose change as long as you follow the lights and the cashier gives correct change.

---

## I. What the device does at the register

Picture the usual failure mode. The total is **$14.37**. You have a twenty and a fist of mystery coins — or no coins, because they never stayed in your wallet anyway. You pay the twenty, get **$5.63** back in mixed metal, and dump it in a cup at home because putting it back in your pocket feels worse than the problem you started with. Or you stand there doing **$20.00 − $14.37** in your head, miscount by a penny, and still get coin change you did not plan for. The wallet is meant to kill that loop.

**Why a normal wallet fails:** Bill compartments are sized for paper. Coin pockets — if they exist — become a **single lump** that does not scale; add more than a few pieces and the fold won't close, or everything rattles loose when you pull a bill. This design **replaces** the coin pocket with a **dedicated tray**: each denomination has a slot, a cap, and a light. You carry **only** what fits the tray — not “whatever accumulated since last Tuesday.”

**Why mental math fails at checkout:** The register total is one number; your wallet is another shape entirely (bills plus scattered metal). Bridging them under time pressure is a **skill**, not a reflex — and card tap exists precisely because most people hate doing it. Here you **match what the screen says** — **spin** the dollar and cent wheels on the Card Slice, or **tap** **`$` / `−` / `+`** under the display on the Full Wallet. The device **lights the slots immediately** — no “enter” or “go.” No subtraction in your head.

**Controls (MVP — input differs by SKU, firmware identical):**

| | **Card Slice (slim)** | **Full Wallet** |
|--|------------------------|-----------------|
| **Input** | **Two rotary wheels** 0–99 on the right edge rail | **Display stack** top-right of tray: halo → readout → **`$` `−` `+`** |
| **Integer wheel** | **Whole dollars** **0–99**, **$1** detents, label **`$`** | **`$`** toggles dollar mode; **`−`/`+`** in **$1** steps |
| **Cents wheel** | **Cents** **0–99**, **1¢** detents ( **5¢** on dollar SKU ), label **`¢`** | **`$`** again → cent mode; **`−`/`+`** in **1¢** steps |
| **Bill indicator** | **Halo ring** around display (white/blue glow) | Same **halo** around display in UI stack |
| **Display** | **`20.24`** or live **handover** **`21.14`** | Same |
| **Live LEDs** | Recompute on **every wheel detent** | Recompute on **every button press** |
| **CLEAR** | Spin both wheels to **0** or long-press either wheel | Long-press **`$`** → **`0.00`**, all LEDs off |
| **No GO** | — | — |

Canonical faceplate art: [`ecw-design/`](ecw-design/) SVGs (mm-accurate). **Not** linear slide switches.

**Operating model (pay exact — full inventory):** Cover whole dollars with **paper**. Cover the **cents portion** with coins **from the wallet only**. Set **14.37** — spin integer wheel to **14**, cent wheel to **37** (Card Slice) or tap to **`14.37`** (Full Wallet). The **coin LEDs** light for **37¢** immediately. The **bill halo** stays **off** when **$14** in ones is enough. You hand **$14** in bills plus those coins. Change: **zero**.

**Operating model (pay with short inventory — the bill LED):** Coin LEDs alone are **misleading** when the tray does not hold enough cents to cover the sale’s fractional part. Example: total **$20.24**, but sensors say you only have **14¢** on hand (a dime and four pennies, or whatever is left after earlier trips). If the device lit only “use these 14¢,” you might think **$20 + 14¢** closes the sale — it does not; you still owe **10¢** more in metal or you must **overpay in bills** and take coin change back.

The firmware solves that case explicitly:

1. Read **sale total** and **live inventory** (RAM + sensors).
2. If inventory can make the **cents column exactly**, behave as above — coin LEDs only, bill LED off, handover = **⌊total⌋ dollars + lit cents**.
3. If inventory **cannot** make the cents column, search for a **handover** — **B** whole dollars in paper plus a **coin subset S** from what you hold — such that **change back** in coins can **refill the tray** to the designed vector (**3Q/1D/2N/4P** or post-penny **3Q/1D/2N**) without overflow. Typically that means **B > ⌊total⌋** — e.g. pay **$21 + 14¢** on a **$20.24** tab so change (**90¢** in standard coin mix) lands in the slots you emptied.
4. **Coin LEDs** → coins in **S** (often **all** cents you have, not “enough to cover 24¢”).
5. **Bill halo** (MVP) → **entire ring around the display** glows **white/blue** when you must hand **≥ $1 more** paper than **⌊total⌋** — impossible to miss vs a tray-edge dot. Manual: *“Halo on = add **≥ $1** beyond the whole-dollar part; read handover on display.”*
6. **Display** shows **handover** (`21.14`) **live** whenever it differs from the dialed total (`20.24`) — no confirm button.

**LED behavior (MVP):** While the total is **non-zero**, **coin LEDs and bill halo track every input change** — wheel detent (Card Slice) or **`$`/`−`/`+`** (Full Wallet) → lights **recompute immediately**. After you **remove** coins from lit slots, the map **freezes**. **Any coin inserted** → reset: **`0.00`**, **all LEDs off**, halo off. **Idle = no LEDs.** Power-on and **CLEAR** also force idle.

Without the bill halo, the product reads like a **coin-only calculator** — fine at **$5.99** with a full tray, **dangerous** at **$20.24** after a depleted run when the mental step you need is “**extra dollar bill**,” not “**more dimes**.”

**Operating model (break change back):** You paid wrong, or the lane rounded, or you had to take coins back. **MVP:** after **any coin insertion** ends the latched spend map (above), you **sort change by hand** or start a **future** deposit-map mode — not required for v1. A **Plus** or **v2** firmware could light **“put it here”** slots on insert without clearing until the tray matches **3Q/1D/2N/4P**; v1 keeps the rule simple: **coin in → idle $0**.

**Invariant the design assumes:** If you start at or below the designed inventory, you pay with bills for dollars and use the wallet for cents, and the cashier is accurate, you should **stay inside the wallet’s coin budget** — no second bag, no jar at home, no “I’m always short a dime.” That invariant is what makes the LED map worth more than a phone calculator: the phone can tell you **37¢** but cannot **fit** the coins or **show which slot to open** without you translating numbers into metal under stress.

---

## II. Two form factors — slim insert and full wallet

Same **coin brain** in both: **3Q / 2D / 1N / 4P** tray (or post-penny / dollar variants — §Four SKUs), **one LED per slot**, **bill halo** around display, **edge-mounted MCU + coin cell**, **no app**. UI stays **deliberately non-digital** — no touchscreen, no Bluetooth. **Card Slice** = **dual rotary wheels**; **Full Wallet** = **display-stack buttons** (optional **0–9** keypad below).

### Shared tray (both SKUs)

Ten coins, **104¢** face (**3Q·2D·1N·4P**), **single flat layer**. Nickel thickness (**1.95 mm**) sets cavity depth; with minimal lips, the coin layer is about **2–2.3 mm**. Three tight bands: **3Q | 2D · 1N | 4P** (2×2 pennies) — canonical **1-nickel** mold; alternate **3Q | 1D · 2N | 4P** also valid (§III). **~0.4 mm** slot clearance — fingernail in/out, no coin purse slack. **Coin LEDs** sit at the **thumb edge** of each pocket; lit = **take** or **place here**. **Bill halo** — **white/blue LED ring** around the **display** (not a separate dot on the tray). **On** = hand **≥ $1 more** in paper than **⌊total⌋**. **Off** = whole-dollar part of total is enough with lit cents.

Measured footprint for flat layout: about **79 × 67 mm** tray active area — **fits credit-card width**, **not** credit-card height (54 mm is too short). Product width should track **billfold interior (~100–102 mm)**, not ISO 85 mm.

### A. Minimal Slim (“Card Slice”) — insert

For someone who **already owns a wallet** and only wants the **coin protocol**.

**What it is:** One **flat slab** — coins on the face, paper money stays in the **existing** wallet. Slides into a **deep card sleeve** or rides the bill compartment like a stiff card.

**Target dimensions:** **~102 × 67 × 5–6 mm** closed (not 85 × 54 × 13 — that render was too tall and far too thick). Side profile should sit near **~2× three credit cards** stacked (~2.3 mm PVC alone), not **17×**.

**UI (slim — dual rotary wheels only):** **Right long edge rail** (~18 mm × ~55 mm), beside the coin tray:

1. **Display** (~22 × 8 mm) — `20.24`
2. **Bill halo** — LED **ring/bezel** around display; glows when **BILL+** needed
3. **Integer wheel** — knurled rotary, **~12 mm** diameter, **0–99**, **$1** detents, **`$`** label
4. **Cents wheel** — same, **0–99**, **1¢** detents (**5¢** on dollar SKU), **`¢`** label

**Not:** linear slide switches, toggle sliders, **`−`/`+`/`GO`** buttons, or keypad on Card Slice.

Mechanical options: **detented rotary encoder** or **indexed pot** per wheel; **ADC → spend map** on every detent (~10 ms debounce). See [`ecw-design/card-slice-top.svg`](ecw-design/card-slice-top.svg) and [`card-slice-edge.svg`](ecw-design/card-slice-edge.svg).

**Electronics:** Flex PCB + **CR1220-class** cell in the **~1.5 mm edge rail**.

**CLEAR:** spin both wheels to **0** or long-press either wheel.

### B. Full Wallet — coin tray + cards + bills

For someone who wants **one** front-pocket object at checkout.

**What it is:** Slim **bifold or side-fold** wallet. **One leaf** is the **exact-change tray** (same 10-coin inventory + edge UI). **Other leaf** carries **daily carry**: **2–4 card slots** (credit/ID), **1 ID window** optional, **1 bill pocket** (paper dollars for the dollar column of each sale).

**Target dimensions:** Closed about **102 × 90–100 × 8–10 mm** — thicker than the Card Slice because of **PVC cards + bills**, still **slim wallet** territory (not a zip pouch). Open: tray face-up.

**UI (Full Wallet — display stack, not sliders):** Single **UI block** at **top-right of the coin-tray leaf** — above the coin rows, **not** on the wallet hinge or far edge:

```
┌─────────────────┐
│  ○ BILL HALO ○  │
│     20.24       │
│  [ $ ] [−] [+]  │
│  [1][2][3]…     │  ← Dollar Plus only: 0–9 keypad directly below buttons
└─────────────────┘
```

- **`$`** — toggles **dollar mode** vs **cent mode** (display marks active field).
- **`−` / `+`** — **directly under the display** — **$1** or **1¢** steps depending on mode.
- **Dollar Plus:** **3×4 numeric keypad** **below** the three buttons — still on tray rim, **not** center fold. Still **no GO**; each press updates LEDs live.

See [`ecw-design/full-wallet-tray-ui.svg`](ecw-design/full-wallet-tray-ui.svg). Same spend-map firmware as Card Slice; only the **input driver** differs (wheel ADC vs GPIO buttons).

**Why two form factors:** Card Slice optimizes **speed in ~6 mm** — thumb-spin wheels. Full Wallet trades thickness for **buttons/keypad** in the display stack — same coin brain, different input.

### What we are not building

Thick **clamshell** with a **keypad deck** under the tray (~13 mm). Motorized dispensers. Hopper capacity beyond **ten coins**. “Credit card sized” in **both** dimensions with ten flat coins — the math does not close.

The industrial design goal remains **one molded tray**, **one small MCU**, light pipes — **calculator discipline**, not fintech wearable.

### Product SKUs — penny era, dollar era, and hybrid

![Exact-Change Wallet — four-SKU concept sheet (A–D)](exact-change-wallet-invention-concept.png)

Policy fork (investigation **§8–§11**): circulating **penny minting** is **halted**; **legal tender** cents **linger**; **post-penny** commerce **rounds to the nickel** in many lanes. Product matrix:

**Card Slice · Penny** — **3Q / 2D / 1N / 4P** (10 coins, **104¢**); **dual rotary wheels**; **1¢** cent-wheel steps.

**Card Slice · Dollar** — **3Q / 2D / 1N / 1×$1** (7 coins); **5¢** cent-wheel steps; golden-dollar pocket **~26.5 mm**.

**Full Wallet · Penny** — same tray + **cards / ID / bills** + **display-stack `$`/`−`/`+`**.

**Full Wallet · Dollar Plus** — same dollar tray + **keypad under buttons** — **default forward** SKU.

**Full Wallet · Hybrid Plus (E)** — **3Q / 2D / 1N / 4P / 1×$1** (**11 coins**, **120 mm** tray, **204¢** face); **keypad under buttons**; pennies **and** golden dollar — **wallet-only** (slim Card Slice cannot fit all eleven coins; see [`full-wallet-hybrid.svg`](ecw-design/full-wallet-hybrid.svg)).

Faceplate reference: [`science/computing/ecw-design/`](ecw-design/README.md).

**Marketing (both camps):** **Phase-out camp** — “**nickel-exact without mental math**.” **Keep-penny / prepper camp** — “**no app, no account, no hack surface**” — bearer cash with **LED protocol**. See investigation [§11.3](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md).

---

## III. The lost spreadsheet — minimum coin inventory recovered

I had a mapping of **how many of each coin** the wallet must ship with so **any** sale amount (cents portion **1–99**) is reachable **without exceeding one dollar of metal** in the tray. The notes are gone. When I reconstructed the set later, it matched what puzzle writers had already published — see **§VII** — but the **guarantee** only becomes a product when the tray, the keypad, and the LEDs enforce it. The math alone does not stop anyone from overpaying with a twenty and taking **$4.01** back in quarters.

For standard U.S. circulating coins **{25¢, 10¢, 5¢, 1¢}**, the **smallest coin count** that can still make **every amount from 1¢ to 99¢** — verified by exhaustive search — is:

**3 quarters · 1 dime · 2 nickels · 4 pennies**

That is **ten coins**, **exactly 99¢** face value — the densest “under a dollar” purse that remains universal for the cents column when dollars are paper.

An equivalent **99¢** inventory with one extra coin exists (**2 quarters · 4 dimes · 1 nickel · 4 pennies** — eleven coins). The **3Q / 1D / 2N / 4P** layout is the one I would mold: fewer dimes, one more quarter, same coverage, **minimum piece count**.

Why these numbers? Any cents amount needs at most **three quarters** (since **4×25 > 99**). In optimal change-making across **1–99**, you never need more than **two dimes**, **two nickels**, or **four pennies** in a single payment — and **four pennies** is the hard cap because **five pennies** should always collapse to a nickel. The **3Q / 1D / 2N / 4P** tuple is the **tightest** multiset that still covers the whole range.

**The guarantee (when it holds):** Cover **whole dollars** with bills. Pay the **cents column exactly** from the tray. If you started with the designed inventory and the cashier is accurate, you **receive no coin change** — only paper back, or nothing. The exceptions are real: you only have a **$20** for a **$5.99** tab and skip the lights; a slot is empty; the lane rounds cash differently than you typed; the clerk miscounts. Then you need **break-back** mode (§I) or you accept coin change and reconcile. The invention is honest about that — it is not magic, it is a **protocol** that fails gracefully when you break the protocol.

**Post-penny note (2025–2026):** The U.S. stopped minting pennies for circulation in **November 2025**; cash totals increasingly **round to the nickel**. A **penny-less** tray targets **5¢ granularity** — amounts **0, 5, 10, …, 95¢**. The parallel minimum there is **3 quarters · 1 dime · 2 nickels** (**six coins**, **95¢** face). That is the successor tray if cents disappear from commerce — and it is exactly the horizon that makes a **penny-era wallet** feel like a device built for a currency they are retiring. The policy timeline is documented in the companion write-up on [physical coin circulation and the cashless transition](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md).

---

## IV. Firmware logic — not “change,” but equilibrium

Phone calculators solve **“what is 20.00 − 14.37?”** This firmware solves **“what coins do I physically move so my wallet returns to a stable state?”**

**States (MVP):**

| State | Display | LEDs | Enter | Exit |
|-------|---------|------|-------|------|
| **Idle** | `0.00` | **All off** | Power-on, **CLEAR**, **any coin insert** after hold | **Wheel detent** or **`$`/`−`/`+`** |
| **Live** | Running total or handover | **Track every input** — update on each **wheel detent** or **button press** | First input from idle | Total → **`0.00`**, or **coin removed** → Hold |
| **Hold** | Handover frozen | **Frozen** — stay on if coins **removed** | First coin **removed** from a lit slot while Live | **Any coin insert** → Idle |

**Spend map (runs on every Live input — no GO):**

1. Read **current total** and **live inventory** (RAM + sensors).
2. If cents column reachable → light **coin subset**, **bill halo off**, handover = total.
3. Else run **overpay solver** → light **coins in S**, **bill halo on** if **B > ⌊total⌋**, display **handover**.
4. While **Live**, repeat steps 1–3 on **every input event** (wheel detent or button edge).
5. On **Hold**, stop recomputing until **coin insert** → **Idle** (`0.00`, all LEDs off).

**Deposit / break-back (v2 — not MVP):** Optional future mode: on insert, light target slots until vector matches **3Q/1D/2N/4P** (or post-penny **3Q/1D/2N**) without clearing on first coin. v1 defers this to manual sorting after idle reset.

The hard part is not arithmetic. It is **state** and **honest handover**: after dozens of trips, drift happens — a kid steals a quarter, you drop a dime in a fountain, a cashier shorted you. The **overpay solver** must only recommend **(B, S)** when simulated **change back** fits the **empty slots**; if no solution exists (empty tray + only a **$100** for a **$3.47** tab), display **NO FIT** and stay latched until **CLEAR** or coin insert. Without reconciliation when sensors disagree with RAM (full tray rescan on lid close, or a “count mode” long-press), the LED map lies gently until you reset.

I never built the reconciliation spec on paper. I should have. It is the difference between a toy and something you trust on the **twentieth** grocery run.

---

## V. Why this is hardware, not an app

A phone app can compute change. It cannot **hold** the coins, **feel** when you obeyed, or **force** the closed inventory that makes the system honest. The invention is **embodied** — the tray **is** the protocol.

That embodiment also keeps it **outside** the payment rail. No PCI, no KYC, no “sign in with Google,” no **2.9% + 30¢** on a **37¢** decision. The wallet is a **local actuator** for **legal tender** you already own. In a decade pushing toward **ledger-first money**, that matters: the last anonymous layer of retail was **physical coins and bills**. This device was a **tool to keep that layer usable** without carrying a pound of metal.

---

## VII. History and prior art — what existed before this sketch

This section is the honest map: what I **did not** invent alone, what **half-solved** the problem, and what still looks **unproductized** as of the research pass that informed this article.

### The minimum set — public math, not a secret theorem

The heart of the guarantee — **ten coins cover every cents amount from 1¢ to 99¢; fewer than ten cannot** — is a classic puzzle. Bloggers and teachers have packaged it for cash users for almost twenty years.

[Patti Ng / Mind Your Decisions (2013)](https://mindyourdecisions.com/blog/2013/06/05/how-to-have-exact-change-every-time/) walks through the same logic: carry **4 pennies, 2 nickels, 1 dime, and 3 quarters**, pay the fractional part in exact coins, and **“never get change back”** when purchasing with cash. [Hung Truong (2007)](https://www.hung-truong.com/blog/2007/02/22/always-have-exact-change-with-only-10-coins/) describes a greedy algorithm that builds an equivalent **ten-coin** purse and frames the goal as hating spare change. [Math StackExchange (2022)](https://math.stackexchange.com/questions/4505822/what-is-another-way-to-prove-the-least-amount-of-pence-nickels-dimes-and-quarters) states the problem in nearly the same words as this article — **paying the fractional part in exact coins so you do not get coins back from the cashier** — and proves a **3Q · 2D · 1N · 4P** solution (same ten pieces; one more dime, one fewer nickel than my **3Q / 1D / 2N / 4P** mold). [Stack Overflow (2010)](https://stackoverflow.com/questions/3947867/find-the-least-number-of-coins-required-that-can-make-any-change-from-1-to-99-ce) works the bound the other direction: you need at least **four pennies**, at least **one nickel**, at least **two dimes**, and at least **three quarters**, hence **ten coins minimum**.

More recently, [Josh Mosier (2024)](https://joshmosier.com/posts/coin-holder) lists both optimal ten-coin multisets explicitly — **Set 1: 3Q / 1D / 2N / 4P at 99¢** (the tray I would ship) and **Set 2: 3Q / 2D / 1N / 4P at $1.04** — and built a **credit-card-sized physical insert** to hold them. That is the closest **physical** prior art to the minimum-set idea: passive plastic, no electronics, user still picks coins by hand.

**Takeaway:** I did not discover the theorem. I **lost my notes** and **re-derived** a set others had already named. What I still think is mine is treating that set as the **entire product boundary** — not a tip, not a blog post, not an optional insert — and wiring behavior around it.

### Mechanical wallets — organization without arithmetic

Long before microcontrollers were cheap, the market solved **sorting** and **dispensing**, not **checkout math**.

The [Coin Sorter Wallet](http://coinsorterwallet.com/) (spring-loaded steel slots for US quarters, dimes, nickels, pennies) promises to **“produce exact change quickly”** with coins **at your fingertips** — but the user still **chooses** which coins to slide out, still **computes** the cents column, and can **accumulate far more than ten coins** in the stacks. It solves dignity and speed for people who already know what to pay; it does not remove mental math or cap inventory.

[Coinboy](https://www.assistech.com/product/coinboy-pocket-coin-dispenser) and the waiter/taxi [coin pouches](https://www.countermatic.ie/waiter-textile-cash-pouches/101-coin-note-pouch-with-coin-dispenser.html) sold in Europe and the US are the professional version: tube dispensers, belt pouches, **one-hand** coin access, capacities measured in **dollars of metal**, not a closed **99¢** budget. Again: hardware for hands that already know the job.

[KIN Wallet (Kickstarter, 2016)](https://www.kickstarter.com/projects/19308538/kin-worlds-first-wallet-that-sorts-your-cash-in-a) and the earlier [Numistar / “Radical Wallets” campaign](https://www.kickstarter.com/projects/marlin/radical-wallets-that-sort-your-coins-and-notes-ins/) attack a different pain point: dump **bills and coins together**, let fabric or leather **separate** them. Clever industrial design; **no sale-total entry**, **no LED map**, **no guarantee** about how many coins you carry or whether you leave checkout without coin change.

Mechanical [pocket coin dispensers](https://www.freepatentsonline.com/5492504.html) (e.g. Wolters, 1996) stack coins in chambers you thumb out one at a time — organization, not computation.

### Electronic cousins — calculate and spit, don’t guide

Once Arduinos got cheap, makers built **coin dispensers**, not **coin guides**.

**Pocket Pal** ([University of Illinois ECE 445 design document, 2021](https://courses.grainger.illinois.edu/ece445/getfile.asp?id=18872)) is the nearest **electronic** relative: keypad, **ATMEGA328P**, IR sensors tracking counts, user enters purchase amount, firmware computes combination, **solenoids dispense** coins into a tray. Their own background section cites Coin Sorter Wallet and Numistar as partial solutions. Pocket Pal is **bigger** (~6×4×1.5 inches), uses an **LCD**, and **motors the coins out** — the opposite industrial choice from **LEDs that say “pull from this slot.”** Same checkout intent; different mechanism.

[Hacker projects](https://www.hackster.io/NerdFatherRJ/smart-coin-dispenser-d44c32) follow the same pattern: keypad, servos, dispense. Vending and arcade **change machines** ([commercial dispensers](https://microhard.it/en/products/oem-solutions/payment-systems/flexi-hopper-x5-dpotm-multi-coin)) solve the problem at **store scale**, not pocket scale.

I found **no shipped consumer product** that combines: **fixed minimum inventory**, **sale-total keypad entry**, **per-slot LEDs for pay or break-back**, **bill-indicator LED for overpay when inventory is short**, **no motorized dispense**, **wallet thickness**. Patent searches turn up **LED + coin** language mostly on **casino and vending** indicators, not grocery-checkout guides.

### What remains distinctive in this article’s invention

Stated plainly for readers who skim:

The **minimum multiset** and the **“pay cents exact → no coin change back”** rule are **documented elsewhere**. The **3Q / 1D / 2N / 4P @ 99¢** choice is a **known optimal packaging** (Mosier’s Set 1). The **article’s invention** is the **operational layer**: mold the tray to that multiset only; type **14.37**; lights tell you which metal to move; **bill LED** tells you when paper dollars must **overpay** because cents on hand are short; sensors help you **return to full** after a mistake; **never** let the coin pile exceed what a billfold can tolerate; **never** require mental subtraction at the register. Blogs teach the set to nerds who will memorize it. This device teaches it to **everyone else** through muscle memory and light.

That is why the story belongs in one file with **policy history** ([penny halt, cash decline](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md)) and **why it never shipped** (§VIII below): the math was never the blocker. **Productizing the protocol** into cheap plastic — in a culture retiring the penny — was.

---

## VIII. Why I never shipped it

I did not fail to build this because the math was impossible or because the MCU was too slow. I failed to **venture** — and the reasons stack.

**Capital and partners:** Hardware wants a mold, a certification story, a retail channel, and someone who trusts you with **$50k–$500k** before the first container ship leaves Shenzhen. Every conversation drifts toward **existing POS vendors**, **bank partnerships**, or **“we’ll white-label it if you sign here.”** Those contracts are where inventions go to become **features inside someone else’s enclosure** — or die in diligence.

**Suppression climate (my read):** We live in a **decade that punishes small physical tools** that compete with **platform money**. Not necessarily a single villain — an **incentive field**: apps with subscriptions win shelf space; bearer cash is **discouraged**; the [Fed and Treasury are actively draining penny circulation](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md); coin terminals **suspend deposits**; cash is **14%** of transactions and falling. Building a **coin purse computer** in that wind feels like **rowing toward a waterfall** while investors ask why you are not doing **BNPL** instead.

**Danger of entanglement:** Partners mean **NDAs**, **cap tables**, **IP assignment**, and **non-competes** with the same **fintech incumbents** who profit when **exact change** is impossible and **card tap** is the default. I have seen enough [enclosure playbooks](https://paradigmthreat.net/science/computing/investigations/google-dont-be-evil-enclosure-investigation.md) to know the meeting that starts as “we’ll help you manufacture” often ends as “we own the LED protocol and you may not sell to cash-only stores.”

**Obsolescence — the cruelest layer:** Even if I had shipped in **2020**, the product optimizes a **penny-capable** world. The **government is removing the penny from production**; **nickel** is loss-making; **rounding** splits **cash** from **card** pricing. I was inventing a **physical bridge** for a **currency class** the state is **deliberately shrinking**. The device is not wrong — it is **scheduled for orphanhood** by policy the same way [open web tooling](https://paradigmthreat.net/science/computing/the-internet-that-should-have-been.md) arrives **after** the AI gate closes.

So the failure is **overdetermined**: no cheap path to market, hostile partner geometry, a culture that treats **cash competence** as **friction to eliminate**, and a **macro trend** that retires the coin set the wallet was sized for. I still think the **3Q / 1D / 2N / 4P** map is beautiful — ten coins, **99¢**, every cents column solved. I just built it **late in the act** of a play that was already closing.

---

## Where next

- [ECW faceplate SVGs (canonical industrial design)](ecw-design/README.md) — mm layouts for renders and ChatGPT reference.
- [U.S. physical coin circulation — phase-out investigation](https://paradigmthreat.net/science/computing/investigations/us-physical-coin-circulation-phase-out-investigation.md) — penny halt, Fed terminals, cash share, enclosure pattern; §10.1 minimum inventory table.
- [The Internet That Should Have Been](https://paradigmthreat.net/science/computing/the-internet-that-should-have-been.md) — parallel story: right idea, wrong era, platform capture.
- [Constitutional coining / Federal Reserve (usury lane)](https://paradigmthreat.net/governance/usury/d.md) — who was supposed to coin money, and who actually does.

**Prior art (external, cited in §VII):** [Mind Your Decisions — exact change (2013)](https://mindyourdecisions.com/blog/2013/06/05/how-to-have-exact-change-every-time/) · [Hung Truong — ten coins (2007)](https://www.hung-truong.com/blog/2007/02/22/always-have-exact-change-with-only-10-coins/) · [Josh Mosier — coin holder (2024)](https://joshmosier.com/posts/coin-holder) · [Pocket Pal — UIUC ECE445 (2021 PDF)](https://courses.grainger.illinois.edu/ece445/getfile.asp?id=18872) · [Coin Sorter Wallet](http://coinsorterwallet.com/) · [KIN Wallet (2016)](https://www.kickstarter.com/projects/19308538/kin-worlds-first-wallet-that-sorts-your-cash-in-a)

---

## Framing and limits

This page is an **article**: the **invention sketch** (§I–§V), **prior art and history** (§VII), and **personal why-not-shipped** (§VIII) — not a shipped product or patent application. The **ten-coin / 1–99¢** multiset is **documented mathematics** ([Mind Your Decisions (2013)](https://mindyourdecisions.com/blog/2013/06/05/how-to-have-exact-change-every-time/), [Mosier (2024)](https://joshmosier.com/posts/coin-holder), [StackExchange (2022)](https://math.stackexchange.com/questions/4505822/what-is-another-way-to-prove-the-least-amount-of-pence-nickels-dimes-and-quarters)); this author **re-derived** it after losing design notes. The **LED tray protocol** as described remains **unverified as a commercial product** in the research pass behind §VII. Coin inventories were **verified by computational search** for U.S. denominations **{25, 10, 5, 1}** cents; re-run locally with `npm run exact-change-sim` (`scripts/exact-change-wallet-sim.mjs`). **Post-penny** rounding rules may differ by **state** and **retailer** — see the linked investigation for **documented** policy. [**Prisca sapientia**](https://paradigmthreat.net/docs/PRISCA_SAPIENTIA.md) applies: institutions degrade practical knowledge (here, **physical money literacy**) while marketing **convenience**. Suppression and partner-risk language in §VIII is **author pattern and experience**, not a legal claim against any named company.

Keywords: #ExactChangeWallet #EmbeddedHardware #PhysicalCash #CoinInventory #PriorArt #SuppressedInvention #ParadigmThreatFiles

**Last updated:** 2026-06-29T18:00:00-04:00

---

*Written and narrated by Ari Asulin, with drafting and research support from LLM agents.*

#!/usr/bin/env node
/**
 * Exact-Change Wallet — math & firmware scenario simulator
 *
 * Validates:
 *   - Minimum tray inventories cover all required cent amounts
 *   - Exact spend map (full inventory → no coin change)
 *   - Overpay + bill LED when inventory cannot make cents column
 *   - Change-back fits tray capacity after overpay
 *
 * Run: node scripts/exact-change-wallet-sim.mjs
 *      node scripts/exact-change-wallet-sim.mjs --verbose
 */

const VERBOSE = process.argv.includes('--verbose');

/** @typedef {'Q'|'D'|'N'|'P'|'$'} DenomKey */
/** @typedef {Record<DenomKey, number>} Inventory */

const VALUE = { Q: 25, D: 10, N: 5, P: 1, $: 100 };
const ORDER = /** @type {DenomKey[]} */ (['Q', 'D', 'N', 'P']);

/** Canonical tray profiles from exact-change-wallet-invention-and-aftermath.md */
export const TRAYS = {
  /** 3Q·1D·2N·4P — 99¢, 10 coins */
  TWO_NICKEL: { Q: 3, D: 1, N: 2, P: 4, $: 0 },
  /** 3Q·2D·1N·4P — 104¢, 10 coins (author's 1-nickel mold) */
  ONE_NICKEL: { Q: 3, D: 2, N: 1, P: 4, $: 0 },
  /** Post-penny: 3Q·1D·2N — 95¢, nickel-rounded cents */
  POST_PENNY: { Q: 3, D: 1, N: 2, P: 0, $: 0 },
  /** Dollar-era: 3Q·2D·1N·1$ (7 coins) */
  DOLLAR_ONE_N: { Q: 3, D: 2, N: 1, P: 0, $: 1 },
  /** Dollar-era: 3Q·1D·2N·1$ (7 coins) */
  DOLLAR_TWO_N: { Q: 3, D: 1, N: 2, P: 0, $: 1 },
  /** Hybrid wallet: 3Q·2D·1N·4P·1$ (11 coins) — pennies + golden dollar */
  HYBRID: { Q: 3, D: 2, N: 1, P: 4, $: 1 },
};

// ---------------------------------------------------------------------------
// Inventory helpers
// ---------------------------------------------------------------------------

/** @param {Inventory} inv */
function clone(inv) {
  return { Q: inv.Q ?? 0, D: inv.D ?? 0, N: inv.N ?? 0, P: inv.P ?? 0, $: inv.$ ?? 0 };
}

/** @param {Inventory} inv */
function faceCents(inv) {
  return ORDER.reduce((s, k) => s + (inv[k] ?? 0) * VALUE[k], 0) + (inv.$ ?? 0) * VALUE.$;
}

/** @param {Inventory} inv */
function coinCount(inv) {
  return ORDER.reduce((s, k) => s + (inv[k] ?? 0), 0) + (inv.$ ?? 0);
}

/** @param {Inventory} inv */
function formatInv(inv) {
  const parts = [];
  for (const k of ['Q', 'D', 'N', 'P', '$']) {
    if (inv[k]) parts.push(`${inv[k]}${k}`);
  }
  return parts.join('·') || 'empty';
}

/** @param {Inventory} a @param {Inventory} b */
function subInv(a, b) {
  const r = clone(a);
  for (const k of ['Q', 'D', 'N', 'P', '$']) {
    r[k] = (a[k] ?? 0) - (b[k] ?? 0);
    if (r[k] < 0) return null;
  }
  return r;
}

/** @param {Inventory} a @param {Inventory} b */
function addInv(a, b) {
  const r = clone(a);
  for (const k of ['Q', 'D', 'N', 'P', '$']) {
    r[k] = (a[k] ?? 0) + (b[k] ?? 0);
  }
  return r;
}

/** @param {Inventory} inv */
function invValueCents(inv) {
  return faceCents(inv);
}

// ---------------------------------------------------------------------------
// Bounded subset sum — can we make `target` cents from `inventory`?
// Returns one valid subset or null.
// ---------------------------------------------------------------------------

/**
 * @param {Inventory} inventory
 * @param {number} target — cents
 * @param {DenomKey[]} denoms
 */
function makeAmount(inventory, target, denoms = ORDER) {
  if (target === 0) return clone(empty());
  if (target < 0) return null;

  /** @param {number} idx @param {number} rem @param {Inventory} picked */
  function search(idx, rem, picked) {
    if (rem === 0) return picked;
    if (rem < 0 || idx >= denoms.length) return null;
    const k = denoms[idx];
    const max = Math.min(inventory[k] ?? 0, Math.floor(rem / VALUE[k]));
    for (let c = max; c >= 0; c--) {
      const next = clone(picked);
      next[k] = c;
      const hit = search(idx + 1, rem - c * VALUE[k], next);
      if (hit) return hit;
    }
    return null;
  }
  return search(0, target, empty());
}

function empty() {
  return { Q: 0, D: 0, N: 0, P: 0, $: 0 };
}

/**
 * Enumerate all non-empty subsets of inventory (for overpay search — tray ≤10 coins).
 * @param {Inventory} inventory
 * @returns {Inventory[]}
 */
function allSubsets(inventory) {
  const keys = /** @type {DenomKey[]} */ (
    ['Q', 'D', 'N', 'P', '$'].filter((k) => (inventory[k] ?? 0) > 0)
  );
  const counts = keys.map((k) => inventory[k] ?? 0);
  const out = [];

  function rec(i, picked) {
    if (i === keys.length) {
      if (coinCount(picked) > 0) out.push(clone(picked));
      return;
    }
    const k = keys[i];
    for (let c = 0; c <= counts[i]; c++) {
      picked[k] = c;
      rec(i + 1, picked);
    }
  }
  rec(0, empty());
  return out;
}

/**
 * Can `changeCents` be deposited given per-denom slot capacity?
 * @param {number} changeCents
 * @param {Inventory} capacity — empty slots per denom
 */
function canDepositChange(changeCents, capacity) {
  if (changeCents === 0) return true;
  return makeAmount(capacity, changeCents, ORDER) !== null;
}

/** Capacity after paying subset S from current inv toward full tray */
function emptySlotsAfterPay(current, spent, full) {
  const after = subInv(current, spent);
  if (!after) return null;
  const cap = empty();
  for (const k of ['Q', 'D', 'N', 'P', '$']) {
    cap[k] = (full[k] ?? 0) - (after[k] ?? 0);
    if (cap[k] < 0) return null;
  }
  return cap;
}

// ---------------------------------------------------------------------------
// Coverage tests — minimum inventory theorem
// ---------------------------------------------------------------------------

/**
 * @param {Inventory} fullTray
 * @param {number} minCents
 * @param {number} maxCents
 * @param {number} [step=1]
 */
function testCoverage(fullTray, minCents, maxCents, step = 1) {
  const fails = [];
  for (let c = minCents; c <= maxCents; c += step) {
    if (!makeAmount(fullTray, c)) fails.push(c);
  }
  return { ok: fails.length === 0, fails, tested: Math.floor((maxCents - minCents) / step) + 1 };
}

/** Brute-force: find all minimum-count inventories covering 1–99¢ */
function findMinimumInventories(maxCoins = 10) {
  const found = [];
  const denoms = ORDER;

  /** @param {number} idx @param {Inventory} picked */
  function rec(idx, picked) {
    const n = coinCount(picked);
    if (n > maxCoins) return;
    if (idx === denoms.length) {
      if (n === 0) return;
      const { ok } = testCoverage(picked, 1, 99);
      if (ok) found.push({ inv: clone(picked), coins: n, face: faceCents(picked) });
      return;
    }
    const k = denoms[idx];
    for (let c = 0; c <= 4; c++) {
      rec(idx + 1, { ...picked, [k]: c });
    }
  }
  rec(0, empty());

  if (found.length === 0) return found;
  const minN = Math.min(...found.map((f) => f.coins));
  return found.filter((f) => f.coins === minN);
}

// ---------------------------------------------------------------------------
// Firmware spend map (MVP)
// ---------------------------------------------------------------------------

/**
 * @param {number} totalCents — e.g. 2024 for $20.24
 * @param {Inventory} current
 * @param {Inventory} fullTray
 * @param {{ postPenny?: boolean, maxExtraBills?: number }} [opts]
 */
function spendMap(totalCents, current, fullTray, opts = {}) {
  const { postPenny = false, maxExtraBills = 5 } = opts;
  const dollarsFloor = Math.floor(totalCents / 100);
  let centsNeeded = totalCents % 100;

  if (postPenny) {
    centsNeeded = Math.round(centsNeeded / 5) * 5;
  }

  // Try exact cents from inventory
  const exactCoins = makeAmount(current, centsNeeded);
  if (exactCoins) {
    return {
      mode: 'exact',
      saleCents: totalCents,
      handoverCents: dollarsFloor * 100 + centsNeeded,
      bills: dollarsFloor,
      billLed: false,
      coins: exactCoins,
      changeCents: 0,
    };
  }

  // Overpay solver: prefer handing ALL coins on tray, then search subsets
  /** @type {ReturnType<typeof spendMap> | null} */
  let best = null;

  const allCoins = clone(current);
  /** @type {Inventory[]} */
  const subsetOrder = [allCoins, ...allSubsets(current).filter((s) => coinCount(s) < coinCount(allCoins))];

  for (let extra = 1; extra <= maxExtraBills; extra++) {
    const B = dollarsFloor + extra;
    for (const S of subsetOrder) {
      const coinVal = invValueCents(S);
      const payment = B * 100 + coinVal;
      if (payment < totalCents) continue;
      const change = payment - totalCents;
      const cap = emptySlotsAfterPay(current, S, fullTray);
      if (!cap) continue;
      if (!canDepositChange(change, cap)) continue;

      const candidate = {
        mode: 'overpay',
        saleCents: totalCents,
        handoverCents: payment,
        bills: B,
        billLed: B > dollarsFloor,
        coins: S,
        changeCents: change,
        changeDeposit: makeAmount(cap, change),
      };
      if (
        !best ||
        candidate.bills < best.bills ||
        (candidate.bills === best.bills &&
          (coinCount(candidate.coins) > coinCount(best.coins) ||
            (coinCount(candidate.coins) === coinCount(best.coins) &&
              candidate.handoverCents < best.handoverCents)))
      ) {
        best = candidate;
      }
    }
    // Bills only (no coins from tray)
    {
      const payment = B * 100;
      if (payment >= totalCents) {
        const change = payment - totalCents;
        const cap = emptySlotsAfterPay(current, empty(), fullTray);
        if (cap && canDepositChange(change, cap)) {
          const candidate = {
            mode: 'overpay',
            saleCents: totalCents,
            handoverCents: payment,
            bills: B,
            billLed: B > dollarsFloor,
            coins: empty(),
            changeCents: change,
            changeDeposit: makeAmount(cap, change),
          };
          if (
            !best ||
            candidate.bills < best.bills ||
            (candidate.bills === best.bills && coinCount(best.coins) === 0 && candidate.handoverCents < best.handoverCents)
          ) {
            best = candidate;
          }
        }
      }
    }
  }

  if (best) return best;
  return { mode: 'NO_FIT', saleCents: totalCents, bills: dollarsFloor, billLed: false };
}

function formatDollars(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Scenario suite
// ---------------------------------------------------------------------------

const scenarios = [
  {
    name: '$14.37 exact (full tray)',
    tray: TRAYS.ONE_NICKEL,
    current: TRAYS.ONE_NICKEL,
    totalCents: 1437,
    expect: { mode: 'exact', billLed: false },
  },
  {
    name: '$5.99 exact',
    tray: TRAYS.ONE_NICKEL,
    current: TRAYS.ONE_NICKEL,
    totalCents: 599,
    expect: { mode: 'exact', billLed: false },
  },
  {
    name: '$20.24 depleted — 14¢ on hand (1D+4P)',
    tray: TRAYS.ONE_NICKEL,
    current: { Q: 0, D: 1, N: 0, P: 4, $: 0 },
    totalCents: 2024,
    expect: { mode: 'overpay', billLed: true, handoverCents: 2114 },
  },
  {
    name: '$20.24 with 14¢ — TWO_NICKEL tray',
    tray: TRAYS.TWO_NICKEL,
    current: { Q: 0, D: 1, N: 0, P: 4, $: 0 },
    totalCents: 2024,
    expect: { mode: 'overpay', billLed: true, handoverCents: 2114 },
  },
  {
    name: 'Short inventory but maxExtraBills=0 — NO_FIT',
    tray: TRAYS.ONE_NICKEL,
    current: { Q: 0, D: 1, N: 0, P: 4, $: 0 },
    totalCents: 2024,
    maxExtraBills: 0,
    expect: { mode: 'NO_FIT' },
  },
  {
    name: 'Post-penny $5.95 rounded (595¢) full tray',
    tray: TRAYS.POST_PENNY,
    current: TRAYS.POST_PENNY,
    totalCents: 595,
    expect: { mode: 'exact', billLed: false },
    postPenny: true,
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

// Only run CLI when executed directly (not imported)
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain || process.argv[1]?.includes('exact-change-wallet-sim')) {
  runCli();
}

function runCli() {
  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
  if (cond) {
    passed++;
    if (VERBOSE) console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

function section(title) {
  console.log(`\n${'─'.repeat(60)}\n${title}\n${'─'.repeat(60)}`);
}

section('Minimum inventory — coverage 1–99¢');
for (const [name, tray] of Object.entries(TRAYS)) {
  if ((tray.P ?? 0) === 0 && (tray.$ ?? 0) === 0 && name === 'POST_PENNY') {
    const r = testCoverage(tray, 5, 95, 5);
    assert(r.ok, `${name} (${formatInv(tray)}) covers 5–95¢ step 5 — ${r.tested} amounts`);
    if (!r.ok) console.error(`    fails: ${r.fails.slice(0, 10).join(', ')}`);
  } else if ((tray.$ ?? 0) > 0) {
    const r = testCoverage(tray, 5, 95, 5);
    assert(r.ok, `${name} (${formatInv(tray)}) covers nickel-rounded 5–95¢`);
  } else if ((tray.P ?? 0) > 0) {
    const r = testCoverage(tray, 1, 99);
    assert(r.ok, `${name} (${formatInv(tray)}) covers 1–99¢ — ${coinCount(tray)} coins, ${faceCents(tray)}¢ face`);
    if (!r.ok) console.error(`    fails at: ${r.fails.join(', ')}`);
  }
}

section('Minimum 10-coin inventories (exhaustive search)');
const mins = findMinimumInventories(10);
const minSet = new Set(mins.map((m) => formatInv(m.inv)));
console.log(`Found ${mins.length} ten-coin solutions:`);
for (const m of mins) {
  console.log(`  ${formatInv(m.inv)} = ${m.face}¢`);
}
assert(minSet.has('3Q·1D·2N·4P'), 'includes 3Q·1D·2N·4P (2-nickel / 99¢)');
assert(minSet.has('3Q·2D·1N·4P'), 'includes 3Q·2D·1N·4P (1-nickel / 104¢)');
assert(mins.every((m) => m.coins === 10), 'all have exactly 10 coins');

section('1-nickel vs 2-nickel — 9-coin 3Q·1D·1N·4P must fail');
const nine = { Q: 3, D: 1, N: 1, P: 4, $: 0 };
const nineTest = testCoverage(nine, 1, 99);
assert(!nineTest.ok, `3Q·1D·1N·4P fails (${nineTest.fails.length} gaps)`);
assert(nineTest.fails.includes(20), 'first gap includes 20¢');

section('Exact pay — every cent amount 1–99 with full trays');
for (const [name, tray] of [
  ['ONE_NICKEL', TRAYS.ONE_NICKEL],
  ['TWO_NICKEL', TRAYS.TWO_NICKEL],
]) {
  let exactOk = 0;
  for (let c = 1; c <= 99; c++) {
    const m = spendMap(c, tray, tray);
    if (m.mode === 'exact' && m.billLed === false && m.changeCents === 0) exactOk++;
  }
  assert(exactOk === 99, `${name}: 99/99 exact spend maps at full inventory`);
}

section('Scenario tests (firmware MVP)');
for (const sc of scenarios) {
  const r = spendMap(sc.totalCents, sc.current, sc.tray, {
    postPenny: sc.postPenny,
    maxExtraBills: sc.maxExtraBills,
  });
  console.log(`\n  ${sc.name}`);
  console.log(`    inventory: ${formatInv(sc.current)}`);
  console.log(`    → ${r.mode}${r.mode !== 'NO_FIT' ? ` handover ${formatDollars(r.handoverCents)} bills=${r.bills} billLED=${r.billLed} coins=${formatInv(r.coins)} change=${r.changeCents ?? 0}¢` : ''}`);
  assert(r.mode === sc.expect.mode, `${sc.name}: mode ${r.mode}`);
  if (sc.expect.billLed !== undefined) assert(r.billLed === sc.expect.billLed, `${sc.name}: billLed=${r.billLed}`);
  if (sc.expect.handoverCents !== undefined) assert(r.handoverCents === sc.expect.handoverCents, `${sc.name}: handover ${r.handoverCents}¢ expected ${sc.expect.handoverCents}¢`);
}

section('$20.24 / 14¢ hand — verify bill LED, $21.14 handover, all coins out');
{
  const r = spendMap(2024, { Q: 0, D: 1, N: 0, P: 4, $: 0 }, TRAYS.ONE_NICKEL);
  assert(r.mode === 'overpay', 'overpay mode');
  assert(r.billLed === true, 'bill LED on');
  assert(r.bills >= 21, `at least 21 paper dollars (got ${r.bills})`);
  assert(r.handoverCents === 2114, `handover $21.14 (got ${formatDollars(r.handoverCents)})`);
  assert(coinCount(r.coins) === 5, 'hands all 5 coins (1D+4P)');
  assert(r.changeCents === 90, '90¢ change back');
}

section('Random depleted inventories — 500 trials');
{
  let noFit = 0;
  let overpay = 0;
  let exact = 0;
  const full = TRAYS.ONE_NICKEL;
  for (let t = 0; t < 500; t++) {
    /** @type {Inventory} */
    const cur = empty();
    for (const k of ORDER) {
      cur[k] = Math.floor(Math.random() * ((full[k] ?? 0) + 1));
    }
    const totalCents = (1 + Math.floor(Math.random() * 99)) * 100 + Math.floor(Math.random() * 100);
    const r = spendMap(totalCents, cur, full);
    if (r.mode === 'NO_FIT') noFit++;
    else if (r.mode === 'overpay') overpay++;
    else exact++;
  }
  console.log(`  exact=${exact} overpay=${overpay} NO_FIT=${noFit}`);
  assert(exact + overpay + noFit === 500, 'all trials classified');
}

section('Summary');
console.log(`\nPassed: ${passed}  Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
}
console.log('All validations OK.\n');
}

export { makeAmount, testCoverage, findMinimumInventories, spendMap, formatInv, formatDollars, empty };

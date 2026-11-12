/**
 * Substack “Add tags” helper — one PascalCase tag at a time (never a Keywords mega-line).
 *
 * Usage (Substack post editor → Settings / Publish sidebar open):
 * 1. Open DevTools Console on the editor tab.
 * 2. Paste this whole file and press Enter.
 * 3. Run:  startTagPaste()
 * 4. Stop early:  stopTagPaste()
 *
 * Never paste a whole `Keywords: #A #B #C` string as one chip. That creates an
 * undeletable-looking mega-tag in Substack’s dropdown (e.g. the ControlledOpposition
 * blob). This script always splits those lines into individual tags and strips `#`.
 *
 * If you already have a mega-tag stuck in the publication dropdown, Substack may not
 * let you delete it from the UI — avoid selecting it; this script will refuse to
 * re-create anything with spaces or a `Keywords:` prefix.
 *
 * 2026-11-12 fixes:
 * - Do NOT send Escape (closes Substack publish/preview).
 * - Do NOT force-clear immediately after Enter (that raced React and wiped chips).
 * - Prefer clicking listbox Create / exact option; wait until chip sticks, then clear.
 *
 * Tags for: governance/war/echos-of-jade-helm.md
 */

(() => {
  const TAGS = [
    "JadeHelm",
    "TedCruz",
    "KevinMalone",
    "Trump",
    "MAGA",
    "Texas",
    "Minnesota",
    "Michigan",
    "Arizona",
    "California",
    "ElectionFraud",
    "VoterRegistration",
    "ImmigrantBloc",
    "Attrition",
    "SanctuaryCities",
    "TaintedMeme",
    "GenXGigi",
    "CVAP",
    "StatueOfLiberty",
    "EmmaLazarus",
    "Alexandria",
    "Napoleon",
    "CivilWar",
    "TONA",
    "Midterms2026",
    "Iran",
    "Tehran",
    "JCPOA",
    "Obama",
    "SeminoleCounty",
    "Lubbock",
    "Dorchester",
    "Wallingford",
    "TEAM",
    "MailInBallots",
    "BigSurprise",
    "JDVance",
    "MarjorieTaylorGreene",
    "ThomasMassie",
    "DualSinEater",
    "DivorceDance",
    "GobbleThenSplit",
    "Ivermectin",
    "Parasites",
    "Learjet",
    "N722BD",
    "MarALago",
    "Missile",
    "ControlledOpposition",
    "EdGallrein",
    "PeteHegseth",
    "RFKJr",
    "MAHA",
    "StephenMiller",
    "NSA",
    "CIA",
    "NationalDivorce",
    "Hollywood",
    "SpaceX",
    "Europe",
    "ForeignInfluence",
    "Israel",
    "Nationalist",
    "Globalist",
    "ParadigmThreat",
  ];

  const PLACEHOLDER = "Select or create tags";
  const AFTER_TYPE_MS = 250;
  const AFTER_COMMIT_MS = 200;
  const CHIP_WAIT_MS = 4000;
  const AFTER_CLEAR_MS = 120;
  const MAX_TAG_LEN = 48;

  let queue = [];
  let running = false;
  let timer = null;

  function expandToIndividualTags(input) {
    const rawList = Array.isArray(input) ? input : [input];
    const out = [];
    const seen = new Set();

    for (const raw of rawList) {
      let s = String(raw ?? "");
      s = s.replace(/^\s*Keywords\s*:\s*/i, "");
      const parts = s.split(/[#\s,;]+/).map((p) => p.trim()).filter(Boolean);

      for (let part of parts) {
        if (/^keywords$/i.test(part)) continue;
        part = part.replace(/#/g, "").trim();
        if (!part) continue;
        if (!isSafeIndividualTag(part)) {
          console.warn("[substack-tags] skipped unsafe / mega token:", part);
          continue;
        }
        const key = part.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(part);
      }
    }
    return out;
  }

  function isSafeIndividualTag(tag) {
    const t = String(tag ?? "").trim();
    if (!t) return false;
    if (/\s/.test(t)) return false;
    if (/^keywords$/i.test(t)) return false;
    if (t.includes("#")) return false;
    if (t.length > MAX_TAG_LEN) return false;
    if (!/^(?=.*[A-Za-z])[A-Za-z0-9]+$/.test(t)) return false;
    return true;
  }

  function findTagInput() {
    const byPlaceholder = document.querySelector(
      `input[placeholder="${PLACEHOLDER}"]`
    );
    if (byPlaceholder) return byPlaceholder;
    return document.querySelector('input[role="combobox"][aria-autocomplete="list"]');
  }

  function findTagSection(input) {
    let el = input;
    for (let i = 0; i < 8 && el; i++) {
      const text = el.innerText || "";
      if (/Add tags/i.test(text)) return el;
      el = el.parentElement;
    }
    return input.parentElement || document.body;
  }

  function nativeSetValue(input, value) {
    const proto = window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) desc.set.call(input, value);
    else input.value = value;

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        data: value || null,
        inputType: value ? "insertText" : "deleteContentBackward",
      })
    );
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setInputValue(input, value) {
    if (!isSafeIndividualTag(value)) {
      throw new Error(`[substack-tags] refused to type mega/unsafe tag: ${JSON.stringify(value)}`);
    }
    nativeSetValue(input, value);
  }

  function clearInput(input) {
    nativeSetValue(input, "");
  }

  function pressKey(input, key, keyCode) {
    const opts = {
      key,
      code:
        key === "Enter"
          ? "Enter"
          : key === "ArrowDown"
            ? "ArrowDown"
            : key,
      keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
    };
    input.dispatchEvent(new KeyboardEvent("keydown", opts));
    if (key === "Enter" || key.length === 1) {
      input.dispatchEvent(new KeyboardEvent("keypress", opts));
    }
    input.dispatchEvent(new KeyboardEvent("keyup", opts));
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function isBlank(input) {
    return !String(input.value || "").trim();
  }

  function normalizeChipText(raw) {
    return String(raw || "")
      .replace(/\u00d7/g, "") // ×
      .replace(/\s*Remove.*$/i, "")
      .replace(/\s+/g, "")
      .trim();
  }

  /** Selected chips only — scoped to Add tags section, not the whole page. */
  function selectedChips(input) {
    const section = findTagSection(input);
    const found = [];
    const seen = new Set();

    section.querySelectorAll("button, span, div, a").forEach((el) => {
      if (el === input || el.contains(input) || input.contains(el)) return;
      // Prefer compact chip-like nodes (short exact token).
      const t = normalizeChipText(el.textContent);
      if (!isSafeIndividualTag(t)) return;
      // Ignore long containers that merely include a tag name among other copy.
      if ((el.textContent || "").trim().length > t.length + 4) return;
      const key = t.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      found.push(t);
    });
    return found;
  }

  function alreadyHasChip(input, tag) {
    const want = tag.toLowerCase();
    return selectedChips(input).some((t) => t.toLowerCase() === want);
  }

  async function typeIntoCombobox(input, text) {
    input.focus();
    input.click();
    clearInput(input);
    await sleep(40);

    // insertText is what many React controlled inputs listen for.
    let inserted = false;
    try {
      inserted = document.execCommand("insertText", false, text);
    } catch (_) {
      inserted = false;
    }
    if (!inserted || String(input.value || "").trim() !== text) {
      setInputValue(input, text);
    }
    await sleep(AFTER_TYPE_MS);
  }

  function listboxOptions() {
    return Array.from(document.querySelectorAll('[role="option"]'));
  }

  function clickCommitOption(tag) {
    const options = listboxOptions();
    if (!options.length) return null;

    const want = tag.toLowerCase();

    // Exact existing-tag row (not "Create …").
    const exact = options.find((o) => {
      const t = normalizeChipText(o.textContent);
      return t.toLowerCase() === want && !/create/i.test(o.textContent || "");
    });
    if (exact) {
      exact.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      exact.click();
      return "exact";
    }

    // Create “TagName” / Create TagName
    const create = options.find((o) => {
      const raw = o.textContent || "";
      return /create/i.test(raw) && raw.toLowerCase().includes(want);
    });
    if (create) {
      create.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      create.click();
      return "create";
    }

    return null;
  }

  async function commitTag(input, tag) {
    const clicked = clickCommitOption(tag);
    if (clicked) return clicked;

    // No option yet — give the listbox a moment, try again.
    await sleep(200);
    const clicked2 = clickCommitOption(tag);
    if (clicked2) return clicked2;

    // Arrow to first/create option, then Enter.
    pressKey(input, "ArrowDown", 40);
    await sleep(80);
    pressKey(input, "Enter", 13);
    await sleep(AFTER_COMMIT_MS);

    if (alreadyHasChip(input, tag)) return "arrow-enter";

    // Plain Enter on the input (Substack docs: enter keyword + Enter).
    pressKey(input, "Enter", 13);
    return "enter";
  }

  async function waitForChip(input, tag) {
    const start = Date.now();
    while (Date.now() - start < CHIP_WAIT_MS) {
      if (alreadyHasChip(input, tag)) return true;
      // Sometimes the field clears on success before our chip scan catches up.
      if (isBlank(input)) {
        await sleep(120);
        if (alreadyHasChip(input, tag)) return true;
      }
      await sleep(100);
    }
    return alreadyHasChip(input, tag);
  }

  async function clearAfterSuccess(input) {
    if (!isBlank(input)) {
      clearInput(input);
      await sleep(AFTER_CLEAR_MS);
    }
  }

  async function pasteOne(tag) {
    const safe = expandToIndividualTags([tag]);
    if (safe.length !== 1) {
      throw new Error(
        `[substack-tags] pasteOne expected one individual tag, got ${JSON.stringify(safe)} from ${JSON.stringify(tag)}`
      );
    }
    const one = safe[0];

    const input = findTagInput();
    if (!input) throw new Error(`No tag input found (placeholder="${PLACEHOLDER}")`);

    if (alreadyHasChip(input, one)) {
      console.log(`[substack-tags] skip (already present): ${one} (${queue.length} left)`);
      await clearAfterSuccess(input);
      return;
    }

    await typeIntoCombobox(input, one);
    const how = await commitTag(input, one);
    await sleep(AFTER_COMMIT_MS);

    const ok = await waitForChip(input, one);
    if (ok) {
      await clearAfterSuccess(input);
      console.log(`[substack-tags] added (${how}): ${one} (${queue.length} left)`);
      return;
    }

    // One retry: re-type and click Create if the listbox appeared late.
    console.warn(`[substack-tags] first pass missed ${one}; retrying…`);
    await typeIntoCombobox(input, one);
    await commitTag(input, one);
    const ok2 = await waitForChip(input, one);
    if (ok2) {
      await clearAfterSuccess(input);
      console.log(`[substack-tags] added (retry): ${one} (${queue.length} left)`);
      return;
    }

    console.warn(
      `[substack-tags] FAILED to stick: ${one} — leaving field alone (${queue.length} left). Selected now:`,
      selectedChips(input)
    );
  }

  async function runQueue() {
    if (running) {
      console.warn("[substack-tags] already running");
      return;
    }
    running = true;
    try {
      while (queue.length && running) {
        const tag = queue.shift();
        await pasteOne(tag);
      }
      if (running) console.log("[substack-tags] done", selectedChips(findTagInput() || document.body));
    } catch (err) {
      console.error("[substack-tags]", err);
    } finally {
      running = false;
    }
  }

  window.startTagPaste = function startTagPaste(tags = TAGS) {
    queue = expandToIndividualTags(tags);
    console.log(`[substack-tags] queue ${queue.length} individual tags:`, queue.slice());
    return runQueue();
  };

  window.pasteNextTag = async function pasteNextTag() {
    if (!queue.length) {
      queue = expandToIndividualTags(TAGS);
      console.log(`[substack-tags] reloaded default queue (${queue.length})`);
    }
    const tag = queue.shift();
    await pasteOne(tag);
    return tag;
  };

  window.expandKeywordsLine = function expandKeywordsLine(line) {
    const tags = expandToIndividualTags([line]);
    console.log("[substack-tags] expanded to", tags.length, "tags:", tags);
    return tags;
  };

  window.startTagPasteFromKeywordsLine = function startTagPasteFromKeywordsLine(line) {
    return startTagPaste(expandToIndividualTags([line]));
  };

  window.stopTagPaste = function stopTagPaste() {
    running = false;
    if (timer) clearTimeout(timer);
    console.log("[substack-tags] stop requested; remaining:", queue.slice());
  };

  window.peekTagQueue = function peekTagQueue() {
    return queue.slice();
  };

  window.peekSelectedTags = function peekSelectedTags() {
    const input = findTagInput();
    return input ? selectedChips(input) : [];
  };

  console.log(
    "[substack-tags] ready (click Create / wait-for-chip; no Escape; clear only after stick). startTagPaste(); peekSelectedTags(); stopTagPaste()."
  );
})();

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
 * Tags for: influence/stolen_credit/before-barney-and-pokemon.md
 */

(() => {
  const TAGS = [
    "Nintendo",
    "Barney",
    "Teletubbies",
    "Pokemon",
    "PocketMonsters",
    "DonkeyKong",
    "MetroidPrime",
    "StarFoxZero",
    "HalfLife2",
    "PixelRemaster",
    "PublicDomain",
    "VacuumInverse",
    "WeatherChannel",
    "Morrison",
    "PennyArcade",
    "MetroidOtherM",
    "MetroidDread",
    "DukeNukemForever",
    "RednerGroup",
  ];

  const PLACEHOLDER = "Select or create tags";
  const BLANK_MS = 120;
  const AFTER_ENTER_MS = 350;
  const MAX_WAIT_BLANK_MS = 15000;
  /** Substack mega-chips are whole Keywords lines; refuse anything that looks like one. */
  const MAX_TAG_LEN = 48;

  let queue = [];
  let running = false;
  let timer = null;

  /**
   * Expand any mix of:
   * - single tags
   * - "Keywords: #Foo #Bar"
   * - "#Foo #Bar #Baz"
   * into individual hash-free tokens. Never returns a mega-line.
   */
  function expandToIndividualTags(input) {
    const rawList = Array.isArray(input) ? input : [input];
    const out = [];
    const seen = new Set();

    for (const raw of rawList) {
      let s = String(raw ?? "");
      s = s.replace(/^\s*Keywords\s*:\s*/i, "");
      // Split on #, whitespace, commas, semicolons — never keep a multi-hash blob.
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
    if (/\s/.test(t)) return false; // mega-chip / Keywords blob
    if (/^keywords$/i.test(t)) return false;
    if (t.includes("#")) return false;
    if (t.length > MAX_TAG_LEN) return false;
    // Prefer Option B style: letters/digits (PascalCase, short acronyms, e.g. 501c3).
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

  function setInputValue(input, value) {
    if (!isSafeIndividualTag(value)) {
      throw new Error(`[substack-tags] refused to type mega/unsafe tag: ${JSON.stringify(value)}`);
    }
    const proto = window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) desc.set.call(input, value);
    else input.value = value;

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        data: value,
        inputType: "insertText",
      })
    );
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function pressEnter(input) {
    const opts = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true };
    input.dispatchEvent(new KeyboardEvent("keydown", opts));
    input.dispatchEvent(new KeyboardEvent("keypress", opts));
    input.dispatchEvent(new KeyboardEvent("keyup", opts));
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function isBlank(input) {
    return !String(input.value || "").trim();
  }

  async function waitUntilBlank(input) {
    const start = Date.now();
    while (!isBlank(input)) {
      if (Date.now() - start > MAX_WAIT_BLANK_MS) {
        throw new Error("Timed out waiting for Add tags field to clear");
      }
      await sleep(BLANK_MS);
    }
    await sleep(BLANK_MS);
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

    input.focus();
    await waitUntilBlank(input);

    setInputValue(input, one);
    await sleep(80);
    pressEnter(input);
    await sleep(AFTER_ENTER_MS);

    console.log(`[substack-tags] added: ${one} (${queue.length} left)`);
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
      if (running) console.log("[substack-tags] done");
    } catch (err) {
      console.error("[substack-tags]", err);
    } finally {
      running = false;
    }
  }

  /** Queue individual tags only. Accepts TAGS array or a raw Keywords: #A #B line. */
  window.startTagPaste = function startTagPaste(tags = TAGS) {
    queue = expandToIndividualTags(tags);
    console.log(`[substack-tags] queue ${queue.length} individual tags (no #, no mega-lines):`, queue.slice());
    return runQueue();
  };

  /** Paste only the next individual tag once the field is blank. */
  window.pasteNextTag = async function pasteNextTag() {
    if (!queue.length) {
      queue = expandToIndividualTags(TAGS);
      console.log(`[substack-tags] reloaded default queue (${queue.length})`);
    }
    const tag = queue.shift();
    await pasteOne(tag);
    return tag;
  };

  /**
   * Split a pasted Keywords mega-line into individuals (preview only).
   * Example:
   *   expandKeywordsLine('Keywords: #ControlledOpposition #PoisonPill #Mudflood')
   * → ['ControlledOpposition','PoisonPill','Mudflood']
   */
  window.expandKeywordsLine = function expandKeywordsLine(line) {
    const tags = expandToIndividualTags([line]);
    console.log("[substack-tags] expanded to", tags.length, "tags:", tags);
    return tags;
  };

  /** Queue from a Keywords line / clipboard blob, then paste one-by-one. */
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

  console.log(
    "[substack-tags] ready. startTagPaste() uses individual tags only; never paste a Keywords: #A #B mega-line as one chip."
  );
})();

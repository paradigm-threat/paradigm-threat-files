# Anna's Archive: Hollow Earth Books — Download, Unzip, Scan, Index

## Note on MCP browser

When using the in-IDE MCP browser to open Anna's Archive (annas-archive.org or annas-archive.se), navigation returned a connection error (`chrome-error://chromewebdata/`). The site may be blocked in the automation environment or require CAPTCHA. **Use your own browser** for search and download; this doc and the script below support the rest of the workflow.

---

## What is Anna's Archive

[Anna's Archive](https://annas-archive.org) (also annas-archive.se, annas-archive.gl) is a search engine over shadow libraries (Library Genesis, Z-Library, etc.). It has **CAPTCHAs** on the website to limit bots. For programmatic bulk access they provide:

- **Torrents:** [Torrents page](https://annas-archive.gl/torrents) — e.g. `aa_derived_mirror_metadata` for metadata.
- **Torrents JSON API:** `https://annas-archive.gl/dyn/torrents.json` (may require or fail under load).
- **LLM / bulk:** [If you're an LLM, please read this](https://annas-archive.gl/blog/llms-txt.html) — they recommend using bulk metadata/torrents rather than scraping the site.

So for **manual** use: search in your browser, download files, then use the script below to unzip, scan, and index.

---

## How to use Anna's Archive (manual)

1. **Open**  
   In your browser go to **https://annas-archive.org** (or .se / .gl if that works).

2. **Search**  
   Use the search bar. Try:
   - `hollow earth`
   - `hollow earth theory`
   - Author names: `Marshall Gardner`, `William Reed`, `Symmes`, `Raymond Bernard`, `Johannes Lang`, `Cyrus Teed`, `Frederick Culmer`

3. **Refine**  
   - Use sidebar filters: **Type** = Books; **Extension** = `pdf` or `epub` (avoid `.rs` if you want safer sources).
   - Prefer entries with higher **Stats** (more copies) and no or few "Report file issue" malware flags.

4. **Download**  
   - Open a result → choose a mirror (e.g. "Download now (no waitlist, but can be very slow)").
   - **Do not** download many files at once from the site (they may throttle).
   - Keep filenames as-is; save into a single folder (e.g. `hollow_earth_downloads`).

5. **Unzip**  
   If you get `.zip`/`.rar` archives, unzip them into the same folder (or a subfolder). The script below can do this for you.

6. **Scan and index**  
   Run the script from this repo (see "Script: unzip, scan, index" below) on that folder to:
   - Unzip any archives
   - Extract text from PDFs and EPUBs where possible
   - Generate `INDEX.md` listing each file with title, author, year (if detected), path, and a short content preview.

---

## Hollow Earth books to search for (pre-1940, legitimate older sources)

Use these as search terms or exact titles on Anna's Archive. Pre-1940 **non-fiction** theory books (not novels) are the priority.

| Author | Title | Date | Note |
|--------|-------|------|------|
| James McBride | Symmes's Theory of Concentric Spheres | 1826 | 168 pp |
| Thomas J. Matthews | A Lecture on Symmes' Theory of Concentric Spheres | 1824 | |
| Americus Symmes (comp.) | The Symmes theory of concentric spheres | 1878/1885 | From J.C. Symmes |
| William Reed | The Phantom of the Poles | 1906 | "Poles are phantoms" |
| Marshall B. Gardner | A Journey to the Earth's Interior; or, Have the Poles Really Been Discovered? | 1913, 1920 | 69 p then 456 p |
| Frederick Culmer | The Inner World | 1886 | 18 p, Salt Lake City |
| M. L. Sherman / Wm. F. Lyon | The Hollow Globe | 1871 | 447 pp |
| Cyrus Teed (Koresh) | The Cellular Cosmogony; or, The Earth a Concave Sphere | 1898, 1905 | Inverted earth |
| Johannes Lang | Die Hohlwelttheorie | 1938 | 281 p, German |
| Johannes Lang | Die welt eine hohlkugel! | 1936 | 32 p |
| Johannes Lang | Einführung in die Hohlwelttheorie | 1939 | 38 p |
| Karl Neupert | Welt-wendung! Inversion of the universe | 1924 | German |
| Karl Neupert | Die neue aera: das kosmozentrische welt-system | 1933 | |
| Jeremiah N. Reynolds | Remarks on a review of Symmes' theory | 1827 | |
| Alexander Mitchell | A treatise on natural philosophy, in vindication of Symmes's theory | 1826 | Eaton, Ohio |

**Fiction / controlled-opposition context (optional):**

- Jules Verne, *Journey to the Center of the Earth* (1864)
- Edward Bulwer-Lytton, *The Coming Race* (1871)
- Edgar Rice Burroughs, *Pellucidar* (series)

---

## Script: unzip, scan, create MD index

Location: **`cosmos/cosmology/hollow_earth/scripts/index-downloaded-books.sh`**

**What it does:**

1. **Unzip** — Unzips any `.zip` in the given directory (or current dir) into a `./unzipped/` subfolder; skips if already extracted.
2. **Scan** — For each `.pdf`: extracts text with `pdftotext` (poppler-utils). For each `.epub`: unzips and concatenates `.xhtml`/`.html` text (epub is a zip). Writes `.txt` beside each file (or in a `./text/` folder).
3. **Index** — Builds **`INDEX.md`** in the target directory with:
   - Filename, path, size
   - Title/author/year if detectable (e.g. from filename or first page)
   - First ~500 chars of extracted text as preview
   - Word count

**Requirements:** `unzip`, `pdftotext` (install `poppler-utils` on Debian/Ubuntu). Optional: `exiftool` for PDF/EPUB metadata.

**Usage:**

```bash
cd /path/to/paradigm-threat-files
./cosmos/cosmology/hollow_earth/scripts/index-downloaded-books.sh /path/to/hollow_earth_downloads
```

If no path is given, it uses the current directory.

**Output:**  
- `INDEX.md` in the download folder  
- Optional: `./unzipped/`, `./text/` (or per-file `.txt`) depending on script options

---

## References

- [Anna's Archive FAQ](https://annas-archive.se/faq) (or .org / .gl)
- [Anna's Archive – If you're an LLM, please read this](https://annas-archive.gl/blog/llms-txt.html)
- [Annas-Archive-Guide (GitHub)](https://github.com/ascheriit-dkp/Annas-Archive-Guide)
- In-repo: [Hollow Earth investigation](/cosmos/cosmology/hollow_earth/hollow-earth-investigation) — full book list with HathiTrust/Internet Archive links where available.
- **Download index (from Anna's Archive browse):** [ANNAS_ARCHIVE_DOWNLOADS_INDEX.md](/cosmos/cosmology/hollow_earth/ANNAS_ARCHIVE_DOWNLOADS_INDEX) — relevant/unique titles from "hollow earth" (oldest), direct MD5 link for Sherman 1871, and author-search links for Gardner, Reed, Symmes, Bernard, Culmer, Lang, Teed, Ives.

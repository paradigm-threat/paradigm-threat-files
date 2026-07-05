# Image generation (Hugging Face, local CLI)

Local-only pipeline for **paradigm-threat-files** articles and **paradigm-threat-timeline** chapters. Uses [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/en/tasks/text-to-image) (FLUX family). **No API calls from the browser** — Site AI / WebMCP only prepare prompts and CLI commands.

## HF token setup

1. Create a **fine-grained** token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) with **Make calls to Inference Providers**.
2. Enable Inference Providers billing/credits in account settings if prompted.
3. Provide the token via **one** of (first match wins):

| Source | Path / variable |
|--------|-----------------|
| Environment | `HF_TOKEN` or `HUGGING_FACE_HUB_TOKEN` |
| Repo root (gitignored) | `paradigm-threat-files/.hf_token` |
| Debate notes (gitignored) | `docs/debate-notes/.hf_token` or `.hr_token` |

Never commit tokens. One line, no quotes.

```bash
export HF_TOKEN=hf_...
# or
echo 'hf_...' > /home/ari/dev/pt/paradigm-threat-files/.hf_token
chmod 600 /home/ari/dev/pt/paradigm-threat-files/.hf_token
```

Install deps:

```bash
pip install -r paradigm-threat-files/scripts/image_gen/requirements.txt
```

## Models

| Profile | HF model | Use |
|---------|----------|-----|
| `draft` | `black-forest-labs/FLUX.1-schnell` | Fast previews |
| `final` | `black-forest-labs/FLUX.1-Krea-dev` | Hero / concept art (ChatGPT-tier target) |

Override with `--model-id` on the CLI.

## CLI tools

All run from `paradigm-threat-files/scripts/` (or with absolute paths).

### Generate

```bash
python3 generate-illustration.py --article science/cern_portal/out-of-this-door-might-come-something.md --slot hero --model final --dry-run
python3 generate-illustration.py --article science/cern_portal/out-of-this-door-might-come-something.md --slot hero --model final
```

Timeline chapter (16:9):

```bash
python3 generate-illustration.py --article ../paradigm-threat-timeline/content/12.ce-18th-mudflood-and-pugachev/12.05.00-1774-ce-the-mars-catastrophe.md --aspect timeline --model final
```

### Scan (suggestions only — no API)

```bash
python3 scan-illustrations.py
python3 scan-illustrations.py --corpus files
```

### Annotate (programmatic date/labels — use after base gen)

```bash
python3 annotate-illustration.py --input science/cern_portal/foo.png --date "1774 CE" --style etched
```

## Overwrite policy

- **Default:** if the output PNG exists, generation **aborts**.
- **`--yes-overwrite`:** backs up existing file to `*.bak` then writes (agents must get explicit user approval).
- **`--dry-run`:** print prompt, path, model — no API call.
- **`--force`:** ignore unchanged manifest hash.

## Markdown convention

Optional block after subtitle:

```markdown
<!-- image-gen:hero
prompt: CERN buried ring, documentary concept art, no modern UI
aspect: hero
model: final
date: 1774 CE
-->
```

Pending work (scan picks up):

```markdown
<!-- image-gen:pending hero -->
```

Timeline embed: `![alt](media/...){.book-illustration}`

## Sidecar manifest

Each generated image gets `basename.png.image-gen.json` with prompt, model, seed, source markdown path.

## Timeline prompt template

Sky-era rules and cinematic spec: [`paradigm-threat-timeline/docs/IMAGE_GENERATION_PROMPT.md`](../../paradigm-threat-timeline/docs/IMAGE_GENERATION_PROMPT.md)

## Article hero rules

[`docs/instructions/ARTICLES.md`](instructions/ARTICLES.md) — reuse corpus art first; absolute `https://paradigmthreat.net/...` URLs when embedding.

## WebMCP

Read-only tool `prepare_illustration_prompt` (site) returns merged prompt + CLI command — does **not** call HF. Run `generate-illustration.py` locally after approval.

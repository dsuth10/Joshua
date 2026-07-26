# Joshua Audiobook Studio

Local-first audiobook production for the Joshua workspace.

Slice 0 provides deterministic Markdown inspection and extraction, source hashing, project
manifests, environment diagnostics, and the Gate G0 audit. Speech synthesis is deliberately
deferred until the source-fidelity gate passes.

## Slice 0 quick start

From `Audiobook_Studio`:

```powershell
$env:UV_CACHE_DIR = "$PWD\.uv-cache"
$env:UV_PYTHON_INSTALL_DIR = "$PWD\.uv-python"
uv sync --extra dev --python 3.12
uv run audiobook doctor --json
uv run audiobook inspect --project projects/berani-ginger-juice/project.yaml
uv run audiobook extract --project projects/berani-ginger-juice/project.yaml
uv run audiobook manifest validate --project projects/berani-ginger-juice
```

Run the complete Slice 0 audit with:

```powershell
.\scripts\g0-audit.cmd
```

### Ubuntu 24.04 under WSL2

The supported audiobook runtime is Ubuntu 24.04 under WSL2. Open Ubuntu and run:

```bash
cd /mnt/c/Users/dsuth/Documents/Joshua/Audiobook_Studio
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Close and reopen Ubuntu after the first `uv` installation, then run:

```bash
cd /mnt/c/Users/dsuth/Documents/Joshua/Audiobook_Studio
bash scripts/g0-audit.sh
```

The Linux audit uses separate `.venv-wsl` and cache directories so it cannot conflict
with the Windows development environment. This includes separate pytest temporary and
cache directories because Windows-created permissions are not portable through `/mnt/c`.

Generated audio, model weights, virtual environments, and local caches are not committed.

## Slice 1 voice bake-off

After Gate G0 passes, bootstrap the isolated speech workers in Ubuntu:

```bash
cd /mnt/c/Users/dsuth/Documents/Joshua/Audiobook_Studio
bash scripts/bootstrap-slice1.sh
```

This installs Linux speech prerequisites and creates separate locked environments for
Kokoro, Qwen3-TTS, and Chatterbox. It does not clone a human voice.

Generate the source-identical comparison samples:

```bash
bash scripts/generate-bakeoff.sh
```

Model weights download on first use. Only one model is loaded at a time for the 10 GB
RTX 3080. Samples are written beneath
`projects/berani-ginger-juice/qa/audio/voice-bakeoff/`; generation logs and a compact
results manifest are retained for diagnosis.

Complete `projects/berani-ginger-juice/voice-bakeoff/scorecard.md` while listening.
Do not approve a voice with omitted, repeated, or invented words. Voice approval is a
separate human-gated command and is not performed by the generation script.

## Slice 2 chapter production

Gate G1 locked `qwen-designed-clone` as the Ginger Juice production voice. Bootstrap the
isolated faster-whisper environment in Ubuntu:

```bash
cd /mnt/c/Users/dsuth/Documents/Joshua/Audiobook_Studio
bash scripts/bootstrap-slice2.sh
```

Then run the restartable production stages:

```bash
bash scripts/generate-chapter.sh
```

The script creates a 31-chunk narration plan, renders missing chunks, proves a complete
cache-hit rerun, assembles and globally masters the chapter, and runs batch transcription
and technical QA. Qwen loads once for the initial batch. If that batch fails, isolated
per-chunk retries preserve diagnostic evidence and allow successful work to resume.

The script deliberately stops before classroom delivery packaging. Confirm the project's
rights fields first, then run:

```bash
.venv-wsl/bin/audiobook package \
  --project projects/berani-ginger-juice/project.yaml
```

Complete `projects/berani-ginger-juice/qa/manual-checklist.md` after listening. Automated
QA leaves the project in `manual_review`; it cannot close Gate G2.

## Slice 3 general-purpose engine

Project sources may now use `format: markdown`, `text`, `docx`, or `pdf`. Supported
selectors include whole document, a single heading, an exclusive heading range,
inclusive physical PDF pages, paragraph ranges, and long unique literal anchors.

Inspect before extracting:

```bash
.venv-wsl/bin/audiobook inspect --project projects/my-project/project.yaml
.venv-wsl/bin/audiobook extract --project projects/my-project/project.yaml
```

DOCX selection should normally use headings because pagination varies by renderer and
fonts. PDF page ranges refer to physical pages; text-empty pages fail with an explicit
OCR-required error. Markdown extraction supports ATX and Setext headings, ignores fenced
code headings, speaks link labels rather than URLs, and excludes image paths and footnote
URLs.

An ordered `source.selections` list creates independent chapter source directories and a
chapter index in the manifest. FFmpeg chapter metadata uses millisecond boundaries.
Plain-text projects may select inclusive `line_range` or `paragraph_range` spans.
Multi-chapter M4B assembly concatenates the accepted chapter WAVs and embeds ordered
chapter titles and boundaries in the output.

Recovery and schema maintenance:

```bash
.venv-wsl/bin/audiobook recover --project projects/my-project/project.yaml
.venv-wsl/bin/audiobook manifest migrate --project projects/my-project/project.yaml
```

Recovery removes only incomplete `*.partial.wav` files. Migration creates a versioned
backup before changing a manifest and records migration history.

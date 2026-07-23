# Gate G0 Status — Berani / Ginger Juice

**Date:** 2026-07-23  
**Overall result:** PASS

## Completed and passing

- The `Audiobook_Studio` project scaffold exists with locked Python dependencies.
- Static quality checks pass:
  - Ruff lint
  - Ruff formatting
  - mypy type checking
- The non-GPU test suite passes: **11 tests passed**.
- The Markdown extractor finds the chapter uniquely by heading:
  - Heading: `Ginger Juice (Pages 65–69)`
  - Source lines: 553–618
  - Word count: 942
  - Prose paragraphs: 31
- Repeated extraction produces byte-for-byte identical source artifacts and manifest.
- The generated manifest passes schema validation.
- The local NVIDIA GPU is detected:
  - NVIDIA GeForce RTX 3080
  - 10,240 MiB VRAM
- Ollama is reachable and reports `qwen3.5:latest`.
- User-supplied WSL verification confirms:
  - Ubuntu 24.04.4 LTS under WSL2
  - Python 3.12.3
  - FFmpeg and FFprobe 6.1.1
  - NVIDIA GeForce RTX 3080 visible inside WSL
  - Ubuntu 24.04 selected as the default distribution

## Gate decision

Gate G0 passed on 2026-07-23 under the supported Ubuntu 24.04 WSL2 runtime.

The complete native audit passed:

- Locked Python 3.12 environment synchronized successfully.
- Ruff lint and formatting passed.
- Strict mypy checking passed.
- All 11 non-GPU tests passed.
- The Berani pilot extraction completed.
- The project manifest validated.
- The doctor report returned `overall_status: pass` with no required failures.

Ollama was not reachable at WSL loopback during the audit. This remains a non-blocking
warning because Ollama is optional in Slice 0; its Windows-to-WSL connection will be
configured and tested before a later slice depends on it.

## Evidence

- Machine-readable environment report: [`doctor.json`](doctor.json)
- Frozen source selection: [`../source/original-selection.md`](../source/original-selection.md)
- Normalized narration text: [`../source/narration-text.txt`](../source/narration-text.txt)
- Extraction provenance: [`../source/source-metadata.json`](../source/source-metadata.json)
- Reproducibility manifest: [`../manifest.json`](../manifest.json)

## Re-run command

From the `Audiobook_Studio` directory under Ubuntu:

```bash
bash scripts/g0-audit.sh
```

## Next slice

Begin Slice 1 only after the project owner approves proceeding past this gate.

# Local Audiobook Studio - Full Implementation Plan

**Project location:** `C:\Users\dsuth\Documents\Joshua`  
**Pilot source:** `Units/English/English_Unit_3/Berani.md`  
**Pilot chapter:** `Ginger Juice (Pages 65–69)`  
**Target implementation:** Slices 0-4  
**Primary platform:** Windows 11 with Ubuntu 24.04 under WSL2  
**Primary GPU:** NVIDIA GeForce RTX 3080, 10 GB VRAM  
**Prepared:** 22 July 2026

---

## Contents

1. [Purpose](#1-purpose)
2. [Definition of success](#2-definition-of-success)
3. [Known environment and constraints](#3-known-environment-and-constraints)
4. [Architectural decisions](#4-architectural-decisions)
5. [Target repository layout](#5-target-repository-layout)
6. [Core data contracts](#6-core-data-contracts)
7. [Command-line interface](#7-command-line-interface)
8. [Model and backend strategy](#8-model-and-backend-strategy)
9. [Slice 0 - Foundation and source-fidelity gate](#9-slice-0---foundation-and-source-fidelity-gate)
10. [Slice 1 - Voice bake-off and voice lock](#10-slice-1---voice-bake-off-and-voice-lock)
11. [Slice 2 - Complete Ginger Juice audiobook](#11-slice-2---complete-ginger-juice-audiobook)
12. [Slice 3 - General-purpose audiobook engine](#12-slice-3---general-purpose-audiobook-engine)
13. [Slice 4 - Reusable Codex skill](#13-slice-4---reusable-codex-skill)
14. [Testing strategy](#14-testing-strategy)
15. [Audio quality standards](#15-audio-quality-standards)
16. [Copyright, privacy, and voice-consent controls](#16-copyright-privacy-and-voice-consent-controls)
17. [Logging, reproducibility, and failure recovery](#17-logging-reproducibility-and-failure-recovery)
18. [Risks and mitigations](#18-risks-and-mitigations)
19. [Handoff and completion checklist](#19-handoff-and-completion-checklist)
20. [Reference links](#20-reference-links)

---

## 1. Purpose

Build a local-first system that can take a source document, select a chapter or text range, generate a high-quality narrated audiobook, verify that the spoken result matches the source, and package the output for classroom use.

The first production test is the `Ginger Juice (Pages 65–69)` chapter from *Berani*. After that pilot is proven, generalise the system so it can process Markdown, plain text, Word documents, PDFs, and later EPUB files.

The completed system must be usable in two ways:

1. A deterministic command-line application that a developer can run and test.
2. A thin Codex skill that lets a user request an audiobook in natural language.

Example final request:

> Make a local audiobook of Berani, Ginger Juice pages 65-69, using the approved Ginger Juice voice.

### 1.1 Goals

- Keep source text and generated audio local after model downloads complete.
- Preserve the author's words exactly unless a pronunciation override is explicitly approved and recorded.
- Produce a natural, consistent audiobook voice rather than robotic text-to-speech.
- Support resumable generation so one failed chunk does not require regenerating a whole chapter.
- Compare multiple speech models before locking a production voice.
- Automate objective quality checks and retain a human listening gate.
- Record model versions, settings, hashes, seeds, and source locations so results can be reproduced.
- Make the final workflow simple enough for Codex to operate reliably through a skill.

### 1.2 Non-goals for Slices 0-4

- Training a speech model from scratch.
- Publishing or distributing copyrighted audiobooks publicly.
- Cloning an identifiable person's voice without explicit consent.
- Building a public web service or internet-facing API.
- Producing a complete commercial audiobook mastering suite.
- Automatically inventing music, sound effects, or dramatized multi-character performances.
- Rewriting or simplifying source text without a separate, explicit user request.

---

## 2. Definition of success

The project is complete when all of the following are true:

- The exact *Ginger Juice* chapter is extracted deterministically from `Berani.md`.
- The extracted pilot has the expected baseline of 942 words and 31 prose paragraphs.
- A human has selected and approved one locked Ginger Juice voice profile.
- The full chapter is generated locally and passes automated and manual QA.
- WAV master and M4B or MP3 delivery files are created successfully.
- A new project can be created from Markdown, TXT, DOCX, or PDF input.
- Generation can resume without rerendering successful unchanged chunks.
- The system detects a changed source, voice profile, pronunciation lexicon, or model configuration and invalidates only affected cached work.
- The Codex skill passes structural validation and forward tests.
- A user can ask Codex to create an audiobook without knowing the command-line syntax.

### 2.1 Required slice gates

Do not begin a later slice until the previous gate has passed and the project owner has reviewed the evidence.

| Gate | Meaning | Minimum evidence |
|---|---|---|
| G0 | Foundation and source fidelity pass | `doctor` report, extraction test, hashes, 942-word pilot fixture |
| G1 | Voice selected and locked | Comparable samples, evaluation scorecard, approved voice profile |
| G2 | Ginger Juice chapter complete | Final audio, automated QA report, manual QA sign-off |
| G3 | General engine complete | Four input adapters, two additional chapter tests, resume/cache test |
| G4 | Codex skill complete | Skill validation, three forward tests, natural-language end-to-end run |

---

## 3. Known environment and constraints

### 3.1 Confirmed hardware and software

- Windows computer with an NVIDIA GeForce RTX 3080 and 10,240 MiB VRAM.
- Current NVIDIA driver reports CUDA runtime compatibility.
- Ollama is installed at `C:\Users\dsuth\AppData\Local\Programs\Ollama\ollama.exe`.
- Useful installed Ollama models include:
  - `qwen3.5:latest`
  - `qwen3:8b`
  - `phi4-mini:3.8b`
  - `mistral:latest`
  - `llama3.2:latest`
- `uv` is installed on Windows.
- WSL is enabled, but no Linux distribution is installed yet.
- FFmpeg is not currently available on the Windows terminal path.
- The pilot source exists in both Markdown and Word formats:
  - `Units/English/English_Unit_3/Berani.md`
  - `Units/English/English_Unit_3/Berani.docx`

### 3.2 Runtime choice

Use Ubuntu 24.04 under WSL2 as the canonical speech runtime.

Reasons:

- Qwen3-TTS and Chatterbox are developed and documented primarily for Linux Python environments.
- FlashAttention is easier to use on Linux and can reduce Qwen memory use.
- FFmpeg and audio libraries are straightforward to install and pin.
- NVIDIA CUDA passthrough is supported by WSL2 with the existing Windows driver.
- Separate Linux environments reduce the chance of breaking the user's Windows Ollama installation.

Keep the application source code and finished project outputs inside the Joshua directory. Store large downloaded model caches outside Git, preferably in the WSL user's Hugging Face cache.

### 3.3 Native Windows fallback

If WSL2 installation is not permitted, implement the coordinator natively on Windows and begin with Qwen3-TTS 0.6B without FlashAttention. Record this deviation in `doctor.json`. Do not spend more than half a development day attempting to compile FlashAttention natively on Windows.

### 3.4 Single-GPU constraint

Never keep Ollama, a TTS model, and Whisper loaded on the GPU at the same time.

The orchestration order must be:

1. Run Ollama planning.
2. Send `keep_alive: 0` and verify the Ollama model is unloaded.
3. Run TTS generation.
4. Release the TTS model and CUDA memory.
5. Run Whisper QA.

The application must default to one GPU worker. Parallel CPU preprocessing is allowed, but parallel GPU model inference is not.

---

## 4. Architectural decisions

### 4.1 Separate application logic from the Codex skill

The application is the source of truth. The skill only explains when and how Codex should call it.

Do not duplicate extraction, generation, or QA logic inside `SKILL.md`.

### 4.2 Use isolated backend environments

The coordinator, Qwen, Chatterbox, Kokoro, and Whisper may require incompatible versions of PyTorch, Transformers, NumPy, or audio packages. Give each model backend its own environment and invoke it as a subprocess using JSON request and response files.

This is more reliable than one environment containing every model.

### 4.3 Use deterministic stages

Implement the pipeline as explicit, restartable stages:

```text
inspect -> extract -> plan -> sample/select voice -> render -> assemble -> qa -> package
```

Each stage must:

- Read declared inputs.
- Write declared outputs.
- Record hashes and status.
- Refuse to use stale output when an input hash changes.
- Be runnable independently.

### 4.4 LLM annotations must not control source fidelity

Ollama may suggest:

- Pronunciations.
- Emphasis.
- Emotional direction.
- Pause strength.
- A narration style label.

Ollama must not rewrite the source text. Chunk boundaries are created deterministically before any LLM call. Pydantic validation must reject annotations that reference nonexistent chunks or alter chunk text.

### 4.5 Content-addressed chunk caching

Create a render key for each chunk using at least:

```text
SHA256(
  spoken_text
  + backend_name
  + model_id
  + model_revision
  + voice_profile_hash
  + lexicon_hash
  + generation_settings
)
```

If the render key is unchanged and the audio file passes basic integrity checks, reuse the chunk.

### 4.6 Human approval remains mandatory

Automated checks can detect omissions, repetitions, clipping, silence, and many pronunciation failures. They cannot reliably decide whether a voice is emotionally appropriate. Gate G1 and final Gate G2 therefore require human listening approval.

---

## 5. Target repository layout

Create the following structure by the end of Slice 4:

```text
Joshua/
|-- Audiobook_Studio/
|   |-- pyproject.toml
|   |-- uv.lock
|   |-- README.md
|   |-- src/
|   |   `-- audiobook_studio/
|   |       |-- __init__.py
|   |       |-- cli.py
|   |       |-- settings.py
|   |       |-- doctor.py
|   |       |-- contracts.py
|   |       |-- hashing.py
|   |       |-- project_store.py
|   |       |-- selectors.py
|   |       |-- chunking.py
|   |       |-- narration_plan.py
|   |       |-- ollama_client.py
|   |       |-- orchestration.py
|   |       |-- cache.py
|   |       |-- mastering.py
|   |       |-- qa.py
|   |       |-- packaging.py
|   |       |-- extractors/
|   |       |   |-- base.py
|   |       |   |-- markdown.py
|   |       |   |-- plaintext.py
|   |       |   |-- docx.py
|   |       |   `-- pdf.py
|   |       `-- backends/
|   |           |-- protocol.py
|   |           |-- subprocess_backend.py
|   |           `-- registry.py
|   |-- workers/
|   |   |-- qwen/
|   |   |   |-- pyproject.toml
|   |   |   |-- uv.lock
|   |   |   `-- worker.py
|   |   |-- chatterbox/
|   |   |   |-- pyproject.toml
|   |   |   |-- uv.lock
|   |   |   `-- worker.py
|   |   |-- kokoro/
|   |   |   |-- pyproject.toml
|   |   |   |-- uv.lock
|   |   |   `-- worker.py
|   |   `-- whisper/
|   |       |-- pyproject.toml
|   |       |-- uv.lock
|   |       `-- worker.py
|   |-- configurations/
|   |   |-- defaults.yaml
|   |   |-- voices/
|   |   |   `-- ginger-juice.yaml
|   |   `-- pronunciation/
|   |       `-- berani.yaml
|   |-- schemas/
|   |   |-- project.schema.json
|   |   |-- manifest.schema.json
|   |   |-- narration-plan.schema.json
|   |   `-- backend-request.schema.json
|   |-- tests/
|   |   |-- fixtures/
|   |   |-- unit/
|   |   |-- integration/
|   |   `-- golden/
|   |-- scripts/
|   |   |-- bootstrap-wsl.ps1
|   |   |-- bootstrap-linux.sh
|   |   `-- download-models.sh
|   |-- docs/
|   |   |-- operations.md
|   |   |-- model-licences.md
|   |   `-- troubleshooting.md
|   `-- projects/
|       `-- berani-ginger-juice/
|           |-- project.yaml
|           |-- source/
|           |-- planning/
|           |-- chunks/
|           |   |-- raw/
|           |   `-- mastered/
|           |-- qa/
|           `-- output/
`-- .agents/
    `-- skills/
        `-- make-local-audiobook/
            |-- SKILL.md
            |-- agents/
            |   `-- openai.yaml
            |-- scripts/
            |   `-- run_audiobook.py
            `-- references/
                |-- workflow.md
                |-- model-selection.md
                |-- qa-gates.md
                `-- rights-and-privacy.md
```

### 5.1 Git exclusions

Add narrow ignore rules for generated and large content:

```gitignore
Audiobook_Studio/.venv/
Audiobook_Studio/workers/*/.venv/
Audiobook_Studio/**/__pycache__/
Audiobook_Studio/projects/*/chunks/
Audiobook_Studio/projects/*/output/
Audiobook_Studio/projects/*/qa/audio/
Audiobook_Studio/models/
```

Do not ignore project configuration, manifests, narration plans, pronunciation files, tests, or small QA reports.

---

## 6. Core data contracts

Use Pydantic models in Python and export JSON Schemas into `schemas/`. Include `schema_version` in every persisted contract.

### 6.1 `project.yaml`

This is the user-editable project definition.

```yaml
schema_version: 1
project_id: berani-ginger-juice-p65-69
title: Ginger Juice
subtitle: Berani, pages 65-69

source:
  path: Units/English/English_Unit_3/Berani.md
  path_base: workspace_root
  format: markdown
  selector:
    type: heading_range
    start_heading: "Ginger Juice (Pages 65–69)"
    end_before_heading: "Ari (Pages 69–71)"

rights:
  confirmed: false
  basis: school_education_licence
  audience: enrolled_students_and_staff
  distribution: secure_local_or_school_system_only
  confirmed_by: ""
  confirmed_at: ""

planning:
  ollama_model: qwen3.5:latest
  temperature: 0
  use_llm_annotations: true

voice:
  backend: qwen
  model_id: Qwen/Qwen3-TTS-12Hz-0.6B-Base
  profile: ginger-juice
  language: English

audio:
  target_words_per_minute: 145
  target_lufs: -19
  true_peak_db: -3
  output_sample_rate: 48000
  mono: true

qa:
  asr_model: distil-large-v3
  overall_wer_max: 0.03
  chunk_wer_max: 0.08
  max_generation_attempts: 3
```

Do not hardcode Windows absolute paths in committed project files. Resolve `workspace_root` paths against the discovered Joshua root. Support project-relative paths only when `path_base: project` is explicit.

### 6.2 Source artifact

After extraction, write:

- `source/original-selection.md`: exact selected source with formatting markers.
- `source/narration-text.txt`: exact words to be narrated, with headings and separator lines removed according to deterministic rules.
- `source/source-metadata.json`: source path, selector, hashes, character count, word count, paragraph count, and extraction timestamp.

The pilot baseline must be:

- Heading: `Ginger Juice (Pages 65–69)`.
- Start: the paragraph beginning `Slow Loris Boy is talking`.
- End: the italicised warning ending `or will hurt you!`.
- Word count: 942 using the project's documented tokenizer.
- Prose paragraphs: 31, excluding heading, blank lines, and thematic separator.

### 6.3 Narration plan

Write `planning/narration-plan.json`.

Each chunk record must contain:

```json
{
  "chunk_id": "gj-001",
  "source_paragraph_ids": ["p001"],
  "source_text": "Exact source text",
  "spoken_text": "Exact text or approved pronunciation form",
  "style": "reflective",
  "emotion_strength": 0.25,
  "pause_before_ms": 250,
  "pause_after_ms": 450,
  "pronunciation_keys": ["Ibu"],
  "source_text_sha256": "...",
  "spoken_text_sha256": "..."
}
```

`source_text` must be immutable. `spoken_text` may differ only through deterministic, recorded pronunciation replacements.

### 6.4 Pronunciation lexicon

Store human-readable pronunciation guidance in YAML.

```yaml
schema_version: 1
language: en-AU
entries:
  Ibu:
    say_as: ee-boo
    source: human_approved
    notes: Indonesian term for mother
  macaques:
    say_as: muh-kaks
    source: human_approved
  rambutans:
    say_as: ram-boo-tans
    source: human_approved
```

The final forms must be approved by listening tests. The examples above are starting points, not automatic approval.

### 6.5 Voice profile

Store the locked voice in `configurations/voices/ginger-juice.yaml`.

Required fields:

- Profile name and revision.
- Backend and model.
- Designed or cloned voice reference path and its transcript.
- Consent status for any human reference voice.
- Natural-language voice direction.
- Default pace and emotion settings.
- Recommended chunk length.
- Known pronunciation limitations.
- Reference audio SHA256.
- Date and person who approved the voice.

Recommended voice direction for the bake-off:

> Warm, reflective feminine voice with neutral-to-Australian English. Intimate and vulnerable, with restrained emotion and unhurried pacing. Memories of Ibu are softer and slightly more distant. Build tension gradually during the journey to the dangerous place. Never caricature an animal or use a comic ape voice.

### 6.6 Manifest

Write `manifest.json` after every stage using an atomic replace.

The manifest must include:

- Project schema version.
- Git commit when available.
- Source and extracted-text hashes.
- Configuration, lexicon, and voice-profile hashes.
- Exact model IDs and revisions.
- Dependency lockfile hashes.
- GPU and runtime information.
- Per-stage status and timestamps.
- Per-chunk render key, attempts, seed, duration, audio hash, and QA result.
- Final output paths and hashes.
- Manual approvals.

Never edit the manifest manually. Add a CLI command that can validate it against its JSON Schema.

---

## 7. Command-line interface

Use Typer for the CLI and Rich for readable terminal output. Install an `audiobook` console entry point.

### 7.1 Required commands

```text
audiobook doctor
audiobook project create
audiobook inspect
audiobook extract
audiobook plan
audiobook voice sample
audiobook voice approve
audiobook render
audiobook assemble
audiobook qa
audiobook package
audiobook run
audiobook status
audiobook clean-cache
audiobook manifest validate
```

### 7.2 Behaviour expectations

#### `audiobook doctor`

Check and report:

- Operating system and WSL version.
- GPU name, VRAM, driver, and CUDA availability.
- Python and `uv` versions.
- FFmpeg and FFprobe availability.
- Ollama API accessibility and installed model availability.
- Coordinator and worker environment health.
- Model cache paths and free disk-space warning.
- Whether required model files are present.

Support `--json` and write `doctor.json` for gate evidence.

#### `audiobook project create`

Create a project folder and starter `project.yaml`. Refuse to overwrite an existing project unless `--force` is explicitly passed.

#### `audiobook inspect`

List headings, detected chapter markers, page labels, word counts, and selectable ranges without generating audio.

#### `audiobook extract`

Extract the selected range, calculate hashes and counts, and write source artifacts. Fail if the selector is ambiguous or matches more than once.

#### `audiobook plan`

Create paragraph IDs, deterministic chunks, pronunciation candidates, and optional Ollama annotations. End the Ollama request with `keep_alive: 0`.

#### `audiobook voice sample`

Generate identical bake-off passages for one or more backends. Never compare models using different text.

#### `audiobook voice approve`

Record the selected sample, backend, model, reference audio, profile hash, approver, and timestamp.

#### `audiobook render`

Generate only missing or invalid chunks. Display progress, estimated time, cache hits, attempts, and failures. Do not assemble final audio automatically unless `--continue` is passed.

#### `audiobook assemble`

Standardise chunks, add planned pauses, apply short boundary fades, concatenate them, and perform loudness mastering.

#### `audiobook qa`

Run integrity, audio, ASR, and manifest checks. Produce both `qa/report.json` and a readable `qa/report.html` or `qa/report.md`.

#### `audiobook package`

Require `rights.confirmed: true` and passing QA. Create WAV master plus M4B and/or MP3 delivery formats with metadata.

#### `audiobook run`

Run the safe composite workflow from inspect through package. Pause for human approval when there is no locked voice profile.

### 7.3 Exit codes

Use predictable exit codes:

- `0`: success.
- `2`: invalid configuration or command input.
- `3`: environment or dependency failure.
- `4`: source selection or fidelity failure.
- `5`: model generation failure.
- `6`: automated QA failure.
- `7`: human approval or rights confirmation required.

---

## 8. Model and backend strategy

### 8.1 Primary backend: Qwen3-TTS

Implement Qwen first.

Use this progression:

1. `Qwen3-TTS-12Hz-0.6B-CustomVoice` for the first working sample.
2. `Qwen3-TTS-12Hz-1.7B-VoiceDesign` to design a suitable Ginger Juice persona.
3. Generate a clean 10-20 second reference passage using VoiceDesign.
4. Unload VoiceDesign.
5. Use `Qwen3-TTS-12Hz-0.6B-Base` or the best fitting Base checkpoint to clone and reuse the designed voice.

Load only one Qwen model at a time. Use BF16 or FP16 on the RTX 3080. Prefer FlashAttention 2 if installation succeeds in WSL2; otherwise use PyTorch SDPA and the 0.6B model.

### 8.2 Challenger backend: Chatterbox

Implement Chatterbox after the Qwen path works.

Candidates:

- Chatterbox Turbo for efficient English narration.
- Chatterbox Multilingual V3 if it improves pronunciation or speaker stability.

Use either the model's default voice or a user-owned/consented reference recording. Do not clone a commercial audiobook narrator.

### 8.3 Baseline backend: Kokoro-82M

Use Kokoro as the fast baseline and recovery backend.

Kokoro is valuable for:

- Testing the orchestration pipeline quickly.
- CI smoke tests that should not download or load multi-gigabyte models.
- Generating a usable fallback when the expressive backends fail.

### 8.4 Excluded default: F5-TTS

Do not include F5-TTS in the default production path because the standard pretrained English/Chinese weights are licensed CC-BY-NC even though the code is MIT.

It may be added later as an explicitly non-commercial experimental backend with model-licence acknowledgement.

### 8.5 Backend worker protocol

Each worker must support these actions through JSON files:

```text
doctor
list_voices
prepare_voice
synthesize
release
```

Minimum synthesize request:

```json
{
  "schema_version": 1,
  "request_id": "gj-001-attempt-1",
  "action": "synthesize",
  "model_id": "...",
  "model_revision": "...",
  "text": "...",
  "language": "English",
  "voice_reference": "...",
  "settings": {
    "seed": 12345,
    "pace": 1.0,
    "emotion": 0.25
  },
  "output_path": ".../gj-001.raw.wav"
}
```

Minimum response:

```json
{
  "schema_version": 1,
  "request_id": "gj-001-attempt-1",
  "status": "success",
  "sample_rate": 24000,
  "channels": 1,
  "duration_seconds": 12.4,
  "audio_sha256": "...",
  "warnings": []
}
```

Write response files even on failure. Capture worker stdout and stderr into per-attempt logs.

---

## 9. Slice 0 - Foundation and source-fidelity gate

### 9.1 Objective

Establish a reproducible runtime, project skeleton, deterministic source extraction, hashing, and an auditable PASS/FAIL gate before downloading or integrating all speech models.

### 9.2 Deliverables

- `Audiobook_Studio/` application skeleton.
- WSL2 Ubuntu runtime or documented native Windows fallback.
- Coordinator environment and lockfile.
- `audiobook doctor` command.
- Markdown extractor and heading-range selector.
- Pilot project configuration.
- Source artifacts and manifest.
- Unit and integration tests for exact extraction.
- G0 audit command and evidence.

### 9.3 Tasks

#### Task 0.1 - Create a branch and protect existing work

- Run `git status` before editing.
- Do not modify unrelated Unit 3 lesson files.
- Create a branch using the repository convention, for example `codex/local-audiobook-slice-0`.
- Make one intentional commit for the slice after G0 passes.

#### Task 0.2 - Install and verify WSL2 Ubuntu

This may require administrator approval and a restart.

From an elevated Windows terminal:

```powershell
wsl --install -d Ubuntu-24.04
```

After restart:

```powershell
wsl --list --verbose
```

Expected result: Ubuntu is present and uses WSL version 2.

Inside Ubuntu, verify GPU passthrough:

```bash
nvidia-smi
```

Do not install a separate Linux NVIDIA display driver. WSL uses the Windows host driver.

#### Task 0.3 - Install base Linux tools

Install only required runtime tools:

```bash
sudo apt update
sudo apt install -y ffmpeg git build-essential libsndfile1 sox
```

Install `uv` using its official installer or a pinned project-approved method. Record the version in `doctor.json`.

#### Task 0.4 - Scaffold the coordinator

- Use Python 3.12.
- Configure `pyproject.toml` with a console command named `audiobook`.
- Add core dependencies:
  - `typer`
  - `rich`
  - `pydantic`
  - `pydantic-settings`
  - `PyYAML`
  - `httpx`
  - `soundfile`
  - `numpy`
  - `pyloudnorm`
  - `jiwer`
- Add development dependencies:
  - `pytest`
  - `pytest-cov`
  - `ruff`
  - `mypy`
- Generate and commit `uv.lock`.
- Configure Ruff and mypy in `pyproject.toml`.

Do not add heavy TTS packages to the coordinator environment.

#### Task 0.5 - Implement project discovery

The CLI must locate the Joshua root by walking upward until it finds both `.git` and `Units`. Allow `JOSHUA_ROOT` as an explicit override, but never rely on it silently.

#### Task 0.6 - Implement `doctor`

Implement the checks defined in Section 7.2. A missing optional model is a warning. A missing GPU, FFmpeg, or source file is a failure for the production profile.

#### Task 0.7 - Implement Markdown inspection and extraction

Requirements:

- Read UTF-8 explicitly.
- Parse ATX headings rather than searching arbitrary substrings.
- Match the full normalised heading text.
- Treat the next matching heading as exclusive.
- Preserve inline italics and bold markers in `original-selection.md`.
- Remove the chapter heading and final thematic separator from narration text.
- Convert typographic punctuation only through a documented normaliser.
- Never change words, spelling, or grammar.
- Fail on zero matches or multiple matches.

#### Task 0.8 - Implement the documented word counter

Use a Unicode-aware tokenizer and document its rule. Count contractions and hyphenated words consistently. Freeze the pilot result at 942 words.

If the implementation returns a different total, investigate the tokenizer rather than changing the expected value without approval.

#### Task 0.9 - Implement hashing and the first manifest

Use SHA256. Hash raw source bytes, selected source text, narration text, configuration, and lexicon independently.

Write manifests atomically:

1. Write to `manifest.json.tmp`.
2. Flush and close.
3. Replace `manifest.json`.

#### Task 0.10 - Create tests

Minimum tests:

- Exact heading selection succeeds.
- Missing heading fails.
- Duplicate heading fails.
- End heading is excluded.
- Thematic separator is excluded from narration.
- Italics remain represented in the source artifact.
- Pilot word count equals 942.
- Pilot prose paragraph count equals 31.
- Re-running extraction produces identical hashes.
- Changing one source word changes the appropriate hashes.

Use a small test fixture for most tests and one golden integration test against the real `Berani.md` file.

#### Task 0.11 - Add G0 audit

Create a command or test target equivalent to:

```bash
uv run pytest
uv run ruff check .
uv run mypy src
uv run audiobook doctor --json
uv run audiobook extract --project projects/berani-ginger-juice/project.yaml
uv run audiobook manifest validate --project projects/berani-ginger-juice
```

### 9.4 Gate G0 acceptance criteria

- [ ] WSL2 or approved fallback is documented and reproducible.
- [ ] GPU is visible to the selected runtime.
- [ ] FFmpeg and FFprobe are available.
- [ ] Ollama API is reachable from the coordinator.
- [ ] All Slice 0 tests pass.
- [ ] Ruff and mypy pass.
- [ ] Extraction begins and ends at the correct chapter boundaries.
- [ ] Word count is 942.
- [ ] Prose paragraph count is 31.
- [ ] Repeated extraction is byte-for-byte deterministic.
- [ ] Manifest validates against its schema.
- [ ] No TTS model is required for G0.
- [ ] Project owner reviews the extracted text and approves progression.

---

## 10. Slice 1 - Voice bake-off and voice lock

### 10.1 Objective

Integrate the speech backend protocol, compare voices using identical passages, and lock one approved production voice before rendering the full chapter.

### 10.2 Deliverables

- Backend protocol and subprocess runner.
- Kokoro smoke-test backend.
- Qwen backend.
- Chatterbox backend.
- Three representative bake-off passages.
- Comparable audio samples.
- Evaluation scorecard.
- Locked `ginger-juice.yaml` voice profile.
- G1 audit evidence.

### 10.3 Tasks

#### Task 1.1 - Implement backend contracts

- Add Pydantic request and response models.
- Export their JSON Schema.
- Validate before launching a worker and after reading its response.
- Give each request a unique ID.
- Enforce a timeout and terminate hung workers cleanly.
- Record the worker environment lockfile hash.

#### Task 1.2 - Implement the Kokoro backend first

Use Kokoro to prove the worker protocol with a small model.

Tests must cover:

- Worker health check.
- One short WAV generation.
- Correct sample rate metadata.
- Non-empty, decodable WAV.
- Repeatable request/response handling.
- Failure response for invalid text or model path.

Do not judge final narrator quality from this backend yet.

#### Task 1.3 - Implement the Qwen backend

- Create a separate worker environment.
- Install a CUDA-compatible PyTorch build.
- Install `qwen-tts` and record exact resolved versions.
- Test 0.6B CustomVoice first.
- Add VoiceDesign support.
- Add reusable voice-clone prompt preparation.
- Explicitly delete models and call CUDA cache cleanup before worker exit.
- If VoiceDesign exceeds available memory, retry with SDPA/FlashAttention changes before falling back to CustomVoice.

#### Task 1.4 - Implement the Chatterbox backend

- Create a separate worker environment.
- Start with Chatterbox Turbo.
- Add Multilingual V3 only if needed for quality or pronunciation.
- Support an optional consented reference clip.
- Expose only model-supported settings; do not invent unsupported controls.

#### Task 1.5 - Select bake-off passages

Create three passages totalling approximately 60-90 seconds per voice:

1. **Reflective opening:** the opening paragraphs about no longer wanting to learn human words.
2. **Memory and tenderness:** the passage addressing Ibu and remembering warmth or the forest.
3. **Rising danger:** the journey from the treetops toward the human food place.

All models must receive the same source text. Use the same paragraph boundaries and comparable pause rules.

#### Task 1.6 - Create pronunciation candidates

Test at least:

- Ibu
- macaques
- gibbons
- cicadas
- katydids
- durians
- papayas
- rambutans

Generate samples before and after pronunciation overrides. Keep only overrides that improve listening quality without sounding artificially spelled out.

#### Task 1.7 - Generate voice candidates

Minimum candidates:

- Qwen 0.6B stock/custom voice.
- Qwen designed Ginger Juice voice followed by Base voice cloning.
- Chatterbox Turbo or V3.
- Kokoro best suitable voice.

For any cloned human voice, require a completed consent record before generation.

#### Task 1.8 - Build the evaluation scorecard

Score each candidate from 1-5:

| Criterion | Weight |
|---|---:|
| Naturalness | 25% |
| Intelligibility and source accuracy | 20% |
| Emotional suitability | 20% |
| Voice consistency across passages | 15% |
| Pronunciation of key terms | 10% |
| Compute speed and stability | 10% |

Also record free-form notes and any disqualifying issue, such as hallucinated words, missing phrases, unstable identity, or an inappropriate caricature.

#### Task 1.9 - Lock the voice

After human selection:

- Copy the approved reference audio into a stable project asset location.
- Record its transcript and SHA256.
- Finalise `ginger-juice.yaml`.
- Store approved default settings.
- Mark all rejected candidates as evaluation artifacts, not production choices.
- Add a regression sample that can be regenerated after dependency upgrades.

### 10.4 Gate G1 acceptance criteria

- [ ] Backend protocol is schema validated.
- [ ] Kokoro, Qwen, and Chatterbox each produce a valid sample or have a documented environment-specific failure.
- [ ] All compared models use identical passage text.
- [ ] Samples cover reflection, tenderness, and danger.
- [ ] Key pronunciation terms have been auditioned.
- [ ] No candidate contains omitted, repeated, or invented clauses.
- [ ] Evaluation scorecard is complete.
- [ ] Human approver selects one voice.
- [ ] Approved voice profile and reference hash are frozen.
- [ ] Any cloned voice has explicit consent recorded.
- [ ] Project owner approves progression to the full chapter.

---

## 11. Slice 2 - Complete Ginger Juice audiobook

### 11.1 Objective

Generate, assemble, verify, and package the complete 942-word chapter using the locked voice.

### 11.2 Deliverables

- Deterministic chunking engine.
- Ollama narration annotations.
- Resumable render orchestrator.
- Standardised and mastered chunks.
- Full WAV master.
- M4B and/or MP3 delivery file.
- Automated QA report.
- Manual QA checklist and approval.
- G2 evidence.

### 11.3 Tasks

#### Task 2.1 - Implement paragraph and span parsing

Assign stable paragraph IDs in source order. Preserve metadata for:

- Bold opening text.
- Italic internal thought.
- Italic remembered speech.
- Normal narration.
- Thematic breaks.

Formatting affects performance direction but must not be spoken as markup.

#### Task 2.2 - Implement deterministic sentence splitting

Use a tested sentence-boundary library or a narrow deterministic parser. Protect abbreviations and do not split inside paired quotation marks or italic spans unless required by hard limits.

Chunk targets:

- Preferred: 35-60 words.
- Soft maximum: 75 words.
- Hard maximum: 90 words.
- Expected audio duration: approximately 10-25 seconds.
- Prefer paragraph boundaries.
- Do not join separate remembered speakers into one chunk when a pause is semantically important.

Chunk IDs must remain stable while earlier unrelated chunks are unchanged. Use paragraph-based IDs plus an ordinal within the paragraph.

#### Task 2.3 - Implement Ollama narration planning

Call the local Ollama API with:

- `qwen3.5:latest` by default.
- `temperature: 0`.
- `stream: false`.
- A JSON Schema supplied in `format`.
- Explicit instruction that source text is immutable.
- `keep_alive: 0` when finished.

The LLM returns only annotations keyed by `chunk_id`:

- Style label.
- Emotion strength in a constrained range.
- Pause-before and pause-after recommendations.
- Emphasis spans copied exactly from source.
- Pronunciation candidates.

Reject the result if:

- It includes unknown chunk IDs.
- It omits required chunk IDs.
- An emphasis span is not an exact substring.
- It returns revised narration text.
- Values fall outside schema limits.

If Ollama is unavailable, generate a deterministic default plan and continue with a warning.

#### Task 2.4 - Implement lexicon application

- Apply only `human_approved` pronunciation entries by default.
- Match complete words, not substrings.
- Record every replacement at chunk level.
- Keep source text and spoken text side by side.
- Provide a diff command.
- Fail if a replacement changes punctuation or surrounding words unexpectedly.

#### Task 2.5 - Implement render orchestration

For each chunk:

1. Calculate render key.
2. Reuse a passing cached render if available.
3. Create an attempt request with a deterministic seed.
4. Run the selected backend worker.
5. Validate the returned WAV.
6. Run quick ASR and audio checks.
7. Accept, retry with a new seed, or flag for manual action.

Retry no more than three times automatically. Never loop indefinitely.

Preserve failed attempts in `qa/audio/failed/` until the slice is signed off. Do not use them in the final assembly.

#### Task 2.6 - Implement chunk audio standardisation

Use FFmpeg to:

- Decode model output safely.
- Convert to mono.
- Resample to 48 kHz.
- Store mastered chunks as PCM WAV.
- Trim excessive leading and trailing silence while retaining natural breaths.
- Apply very short fades to prevent clicks.

Do not apply full loudness normalisation independently to every chunk because this can create audible pumping. Apply conservative chunk gain alignment, then master the assembled chapter globally.

#### Task 2.7 - Implement assembly

- Insert planned pauses between chunks.
- Use longer pauses at paragraph and scene boundaries.
- Concatenate without re-encoding where practical.
- Produce an unmastered chapter WAV.
- Apply global loudness normalisation.
- Produce the final WAV master.

Recommended starting pause values:

- Sentence continuation: 150-250 ms.
- Paragraph boundary: 400-650 ms.
- Strong emotional or scene break: 750-1,100 ms.

Tune these values by listening before freezing defaults.

#### Task 2.8 - Implement automated ASR QA

Use a separate faster-whisper worker. Default to `distil-large-v3` for English; allow `large-v3` as an optional verification model.

Before comparison:

- Lowercase for WER only.
- Normalise punctuation and whitespace.
- Preserve a separate original-case transcript for diagnostics.
- Apply explicit equivalence aliases for approved pronunciation spellings.

Required checks:

- Overall WER no greater than 3%.
- Per-chunk WER no greater than 8%.
- No missing paragraph.
- No repeated clause.
- No invented clause.
- All lexicon terms present in expected chunks.

WER is a flagging tool, not sole approval. Inspect all content-word differences.

#### Task 2.9 - Implement technical audio QA

Check:

- File decodes successfully.
- Mono channel count.
- Expected sample rate.
- No NaN or infinite samples.
- No clipping.
- Integrated loudness within 1 LU of target.
- True peak at or below -3 dBTP.
- No unintended silence longer than 1.5 seconds inside a paragraph.
- No abrupt boundary discontinuities.
- Duration is plausible for 942 words, approximately 6-8 minutes.

#### Task 2.10 - Create manual QA checklist

The human reviewer must listen to:

- The first 60 seconds.
- Every pronunciation term.
- At least one italic Ibu passage.
- At least one transition into or out of remembered speech.
- The dangerous-place sequence.
- Every chunk that retried or narrowly passed ASR.
- All joins flagged by the silence/boundary detector.
- The final 45 seconds.

Review for:

- Natural pace.
- Appropriate emotion.
- Stable voice identity.
- No caricature.
- Clear Indonesian and biological terms.
- No audible clicks or loudness jumps.
- No missing or repeated words.

#### Task 2.11 - Package outputs

Required outputs:

- `output/Berani - Ginger Juice - Master.wav`
- `output/Berani - Ginger Juice.m4b`
- Optional `output/Berani - Ginger Juice.mp3`
- `output/Berani - Ginger Juice.transcript.txt`
- `qa/report.json`
- `qa/report.md` or `qa/report.html`

Embed metadata:

- Title: `Ginger Juice`.
- Album/book: `Berani`.
- Chapter/pages: `Pages 65-69`.
- Comment: `Locally generated for authorised educational use`.

Do not include source text in publicly indexed metadata fields beyond normal chapter information.

### 11.4 Gate G2 acceptance criteria

- [ ] Narration plan validates against schema.
- [ ] Source text and spoken-text diff contains only approved pronunciation changes.
- [ ] Ollama has been unloaded before TTS begins.
- [ ] Every planned chunk has one accepted mastered WAV.
- [ ] Re-running render reports 100% cache hits when nothing changes.
- [ ] Changing one chunk invalidates only that chunk and downstream assembly/QA.
- [ ] Overall WER is at or below 3%.
- [ ] Every high-risk content difference has been reviewed.
- [ ] Technical audio checks pass.
- [ ] Final duration is plausible.
- [ ] Human manual QA passes.
- [ ] Rights confirmation is recorded before packaging.
- [ ] WAV and delivery format open and play correctly.
- [ ] Project owner approves progression to generalisation.

---

## 12. Slice 3 - General-purpose audiobook engine

### 12.1 Objective

Generalise the proven *Ginger Juice* pipeline so a user can point it at common document types and select chapters or ranges without modifying application code.

### 12.2 Deliverables

- Markdown, TXT, DOCX, and PDF extractors.
- General selector system.
- Reusable project and voice profiles.
- Multi-chapter support.
- Improved cache and migration handling.
- Two additional *Berani* chapter tests.
- Operational documentation.
- G3 audit evidence.

### 12.3 Extractor contract

Every extractor must implement:

```python
class Extractor(Protocol):
    def inspect(self, source: Path) -> DocumentIndex: ...
    def extract(self, source: Path, selector: Selector) -> ExtractedSelection: ...
```

`DocumentIndex` should expose headings, page labels when available, paragraphs, and stable location identifiers.

### 12.4 Tasks

#### Task 3.1 - Generalise selectors

Support:

- `whole_document`.
- `heading`.
- `heading_range`.
- `page_range`.
- `paragraph_range`.
- `literal_start_end` as an explicit fallback.

Selector rules:

- Ambiguous matches fail.
- Page ranges are inclusive.
- End headings are exclusive in heading-range selection.
- Literal fallback requires sufficiently long unique anchors.
- `inspect` should show the user valid selectors before extraction.

#### Task 3.2 - Plain-text adapter

- Read UTF-8 and detect BOM.
- Preserve blank-line paragraphs.
- Support explicit line and paragraph ranges.
- Treat Markdown-looking text as plain unless format is specified or auto-detection is high confidence.

#### Task 3.3 - DOCX adapter

Use `python-docx` for structural extraction.

Requirements:

- Read paragraph styles and heading levels.
- Preserve paragraph order.
- Preserve emphasis spans where possible.
- Exclude headers, footers, comments, and tracked deletions by default.
- Detect tables and either linearise them deterministically or reject unsupported narrative selections.
- Prefer heading selection over page selection because DOCX pagination depends on renderer and fonts.

If a user requests DOCX page numbers:

1. Attempt deterministic rendering with LibreOffice.
2. Build a page-to-paragraph map.
3. Record renderer version and fonts.
4. Warn that page mapping may differ from Microsoft Word.

For *Berani*, prefer its embedded page-range headings rather than inferred Word page numbers.

#### Task 3.4 - PDF adapter

Use `pypdf` or `pdfplumber` for extraction and Poppler for page rendering.

Requirements:

- Page ranges map to physical PDF pages.
- Preserve page numbers in metadata.
- Remove repeated headers and footers only through reviewed deterministic rules.
- Detect likely scanned pages by low extracted-text density.
- Provide an OCR-required error rather than returning empty text silently.
- Add OCR as an optional fallback using a local engine such as Tesseract.
- Render selected pages for manual boundary verification when layout matters.

#### Task 3.5 - Markdown adapter improvements

- Support Setext headings.
- Support nested heading ranges.
- Ignore headings inside fenced code blocks.
- Preserve block quotes as metadata.
- Provide a safe policy for footnotes and links.

For narration:

- Speak link text, not URLs, by default.
- Exclude Markdown image paths.
- Include image alt text only when configured.
- Exclude footnote URLs but optionally narrate footnote text.

#### Task 3.6 - Multi-chapter projects

Allow a project to contain an ordered list of selections. Each chapter receives its own manifest subsection and audio output. Package M4B chapter markers using FFmpeg metadata.

Do not regenerate unchanged chapters when another chapter is added.

#### Task 3.7 - Configuration layering

Apply settings in this order:

1. Application defaults.
2. Backend defaults.
3. Voice profile.
4. Project configuration.
5. Explicit CLI override.

Record the fully resolved configuration in the manifest.

#### Task 3.8 - Schema migrations

Add a small migration framework before schemas change in production.

- Never silently reinterpret older manifests.
- Keep migrations deterministic and tested.
- Backup a manifest before migrating it.
- Record the migration history.

#### Task 3.9 - Improve resumability

Test interruption at these points:

- Mid-extraction.
- Mid-planning.
- During a worker timeout.
- After some chunks pass.
- During assembly.
- During QA.

The next run must recover safely, reuse valid artifacts, and discard incomplete temporary files.

#### Task 3.10 - Add two generalisation tests

Use two additional *Berani* selections with different characteristics:

1. A chapter narrated by Ari containing dialogue.
2. A later Ginger Juice chapter to test reuse of the locked character voice.

At least one selection must come from DOCX or PDF-style extraction rather than the pilot Markdown path.

Do not process the entire novel for the gate. The purpose is to validate generalisation, not generate a full copyrighted audiobook.

#### Task 3.11 - Documentation

Write concise application documentation outside the skill:

- `README.md`: setup and quick start.
- `docs/operations.md`: normal workflow and recovery.
- `docs/model-licences.md`: model, code, and weight licences.
- `docs/troubleshooting.md`: CUDA OOM, Ollama connectivity, FFmpeg, model download, and WSL issues.

Do not place this application documentation inside the Codex skill.

### 12.5 Gate G3 acceptance criteria

- [ ] Markdown extractor passes pilot regression tests.
- [ ] TXT extractor passes unit and integration tests.
- [ ] DOCX extractor passes structural tests.
- [ ] PDF extractor passes page-range and scanned-page detection tests.
- [ ] Ambiguous selectors fail with useful messages.
- [ ] Multi-chapter assembly creates correct chapter markers.
- [ ] Configuration precedence is tested.
- [ ] Schema migration is tested on a frozen old fixture.
- [ ] Interrupted rendering resumes safely.
- [ ] Two additional *Berani* selections complete successfully.
- [ ] Existing Ginger Juice output remains reproducible.
- [ ] Documentation is sufficient for a developer unfamiliar with the codebase.
- [ ] Project owner approves progression to skill packaging.

---

## 13. Slice 4 - Reusable Codex skill

### 13.1 Objective

Package the proven application as a concise, discoverable Codex skill named `make-local-audiobook`.

The skill must orchestrate the application. It must not recreate the application in prose.

### 13.2 Skill location

Create the skill at:

```text
C:\Users\dsuth\Documents\Joshua\.agents\skills\make-local-audiobook
```

### 13.3 Tasks

#### Task 4.1 - Initialise using the official skill creator

Run the skill-creator initializer rather than creating the structure manually.

Use resources:

- `scripts`
- `references`

Do not create an `assets` directory unless the skill genuinely needs a reusable non-code asset.

Provide interface values for:

- `display_name`: `Make Local Audiobook`
- `short_description`: a concise description under the current interface limit.
- `default_prompt`: a natural example that points at a local document and asks for an audiobook.

Read the skill creator's `references/openai_yaml.md` before generating `agents/openai.yaml`.

#### Task 4.2 - Write triggering metadata

Use only `name` and `description` in YAML frontmatter.

Recommended direction:

```yaml
---
name: make-local-audiobook
description: Create private local audiobooks and narrated chapter recordings from Markdown, text, Word, or PDF source material using the Joshua Audiobook Studio, local Ollama planning, local speech models, resumable chunk generation, pronunciation controls, and transcription-based QA. Use when Codex is asked to narrate a document, chapter, story, reading passage, or book extract; compare local voices; regenerate audiobook sections; or package approved narration as WAV, M4B, or MP3.
---
```

Keep all trigger language in the description because only metadata is available before the skill loads.

#### Task 4.3 - Write a concise `SKILL.md`

Keep the body under 500 lines and preferably much shorter.

It should instruct Codex to:

1. Locate the source and confirm the requested selection.
2. Run `audiobook inspect` when selection is ambiguous.
3. Create or reuse a project.
4. Run the source-fidelity gate.
5. Check rights confirmation before packaging.
6. Reuse a locked voice or present comparable samples when no voice is approved.
7. Run render, QA, and package stages.
8. Stop and report when a gate fails.
9. Return only final outputs and a concise QA summary.

Do not copy full model installation instructions into `SKILL.md`.

#### Task 4.4 - Add a narrow wrapper script

`scripts/run_audiobook.py` should:

- Locate the Joshua root safely.
- Locate `Audiobook_Studio`.
- Invoke the locked coordinator environment.
- Pass through project path and approved subcommands.
- Return the coordinator's exit code.
- Never download models or modify global environments implicitly.

Do not duplicate the coordinator's business logic.

#### Task 4.5 - Add progressive references

Create only these necessary references:

- `workflow.md`: detailed orchestration and pause points.
- `model-selection.md`: when to choose Qwen, Chatterbox, or Kokoro.
- `qa-gates.md`: G0-G4 and audio acceptance rules.
- `rights-and-privacy.md`: rights confirmation, secure output, and voice consent.

Link each reference directly from `SKILL.md` and state when it should be read. Avoid references that link to further nested references.

#### Task 4.6 - Validate the skill

Run the official `quick_validate.py` against the skill directory. Fix all errors and warnings that affect discovery or structure.

Also validate:

- Folder name matches skill name.
- Frontmatter contains no extra fields.
- `agents/openai.yaml` matches current `SKILL.md`.
- No placeholders remain.
- No unnecessary README, changelog, or installation guide exists inside the skill.
- Wrapper script works from a different current working directory.

#### Task 4.7 - Forward-test with realistic prompts

Run fresh-context tests. Do not provide the expected answer to the testing agent.

Required prompts:

1. **Known project:**
   > Make the approved local audiobook for Ginger Juice pages 65-69 from Berani.

2. **Ambiguous selection:**
   > Turn the Ginger Juice chapter in Berani into audio.

   Expected behaviour: inspect headings and ask for or infer the intended occurrence safely rather than choosing an arbitrary chapter.

3. **New document and no approved voice:**
   > Make an audiobook of chapter 2 from this Word document using a warm Australian narrator.

   Expected behaviour: extract and verify text, then create comparable voice samples before full rendering.

4. **Rights or consent failure:**
   > Clone the voice from a famous commercial audiobook narrator and publish the result.

   Expected behaviour: refuse unconsented cloning/public distribution and offer a designed or consented voice instead.

Forward tests that would download large models or consume substantial GPU time require project-owner approval first. Reuse installed models where possible.

#### Task 4.8 - Natural-language end-to-end acceptance run

Start from a new Codex task with only the skill available and the user request. Confirm that the skill:

- Finds the Unit 3 source.
- Selects the correct chapter.
- Uses the approved Ginger Juice profile.
- Reuses valid cached audio.
- Runs QA.
- Returns the final local audio link and QA outcome.

### 13.4 Gate G4 acceptance criteria

- [ ] Skill was created using the official initializer.
- [ ] Skill name is valid and folder name matches.
- [ ] Trigger description covers documents, chapters, narration, voice selection, regeneration, and packaging.
- [ ] `SKILL.md` is concise and imperative.
- [ ] Detailed material is in directly linked references.
- [ ] Wrapper delegates to the application without logic duplication.
- [ ] `agents/openai.yaml` is generated and current.
- [ ] Official skill validation passes.
- [ ] Known-project forward test passes.
- [ ] Ambiguous-selection test behaves safely.
- [ ] New-document/no-voice test pauses for voice selection.
- [ ] Rights/consent test behaves safely.
- [ ] Fresh natural-language end-to-end run passes.
- [ ] Project owner signs off the skill.

---

## 14. Testing strategy

### 14.1 Test layers

#### Unit tests

Cover pure functions:

- Heading normalisation.
- Selectors.
- Word counting.
- Paragraph IDs.
- Sentence splitting.
- Chunk construction.
- Hashing.
- Configuration precedence.
- Lexicon application.
- ASR text normalisation.
- WER calculation.
- Cache-key construction.

#### Contract tests

Validate coordinator-worker request and response schemas without loading models.

#### Integration tests

Use small fixtures to test extraction through manifest creation, assembly, and QA. Mock heavyweight model workers unless the test is explicitly marked `gpu`.

#### Golden tests

Freeze expected pilot metadata:

- Source selection hash.
- Word count.
- Paragraph count.
- Chunk IDs and source hashes.
- Narration-plan schema.

Do not freeze generated waveforms byte-for-byte across GPU/library versions. Instead freeze structural and measured properties.

#### GPU smoke tests

Mark with `pytest.mark.gpu`. These tests should:

- Load each installed model.
- Generate a short known phrase.
- Validate the WAV.
- Release GPU memory.

Exclude GPU tests from normal fast CI unless the runner is explicitly configured.

### 14.2 Required developer commands

```bash
uv run ruff check .
uv run ruff format --check .
uv run mypy src
uv run pytest -m "not gpu"
uv run pytest -m gpu
uv run audiobook doctor
```

### 14.3 Test data rules

- Use short invented text for most fixtures.
- Use the real *Ginger Juice* chapter only for local golden/integration tests.
- Do not commit generated chapter audio.
- Do not upload copyrighted source fixtures to public CI services.

---

## 15. Audio quality standards

### 15.1 Working format

- Mono PCM WAV.
- 48 kHz assembly sample rate.
- Preserve raw model output separately until G2 sign-off.

### 15.2 Final mastering targets

Starting targets for classroom audiobook playback:

- Integrated loudness: -19 LUFS, tolerance +/-1 LU.
- True peak: at or below -3 dBTP.
- No hard clipping.
- No unexpected DC offset.
- Consistent perceived level across chunks.

These are project targets, not a claim of compliance with every commercial distributor.

### 15.3 Delivery formats

- WAV master: lossless archival and editing source.
- M4B: preferred audiobook delivery with chapter markers.
- MP3: optional compatibility copy, approximately 96 kbps mono unless listening tests justify another bitrate.

### 15.4 Performance quality

The voice should:

- Remain consistent across the chapter.
- Read the intentionally non-standard Ginger Juice grammar exactly as written.
- Avoid overacting.
- Use slightly softer delivery for remembered Ibu speech.
- Increase tension gradually in the dangerous-place sequence.
- Avoid treating italics as a completely different speaker unless the passage clearly changes speaker.
- Maintain approximately 140-150 words per minute overall.

---

## 16. Copyright, privacy, and voice-consent controls

### 16.1 Rights gate

`audiobook package` must refuse to run unless `rights.confirmed` is true.

Record:

- Rights basis.
- Intended educational audience.
- Distribution boundary.
- Approver.
- Approval timestamp.

For school use, keep outputs on local or access-controlled school systems and do not publish them publicly by default.

### 16.2 Model downloads

The system may access the internet to download approved model weights and Python packages during setup. After setup, normal audiobook processing must not send source text or audio to external services.

Document every model's:

- Repository.
- Exact model ID and revision.
- Code licence.
- Weight licence.
- Any use restrictions.

### 16.3 Voice cloning

Allow cloning only when the reference voice is:

- The user's own voice.
- A person who has provided explicit consent.
- A synthetic voice generated by an approved model.
- A voice recording with a licence explicitly permitting this use.

Store a consent record and reference-audio hash. Do not infer consent because a recording is publicly accessible.

### 16.4 Local services

- Bind any development UI to `127.0.0.1`, not `0.0.0.0`, unless the user explicitly authorises LAN access.
- Do not expose Ollama or worker endpoints publicly.
- Do not log full source text to general system logs; keep it within the project artifacts.

---

## 17. Logging, reproducibility, and failure recovery

### 17.1 Structured logs

Write newline-delimited JSON logs with:

- Timestamp.
- Project ID.
- Stage.
- Chunk ID when relevant.
- Request ID.
- Severity.
- Event name.
- Duration.
- Error category.

Keep a concise human-readable terminal view.

### 17.2 Seeds

Derive the first seed from the render key. For retries, derive predictable alternate seeds. Record every seed.

### 17.3 Temporary files

- Write model output to `*.partial.wav`.
- Validate it.
- Atomically rename it to `*.raw.wav` only on success.
- Remove abandoned partial files during a safe recovery scan.
- Never delete accepted chunks through a broad wildcard.

### 17.4 Status model

Use explicit statuses:

```text
pending
running
generated
qa_pass
qa_fail
manual_review
approved
packaged
```

Do not treat `generated` as equivalent to complete.

### 17.5 Failure messages

Every failure should tell the developer:

- What stage failed.
- Which chunk or file failed.
- Whether retry is safe.
- Which log contains details.
- The next recommended command.

---

## 18. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| 10 GB VRAM is exceeded | Model crash or system slowdown | Load models sequentially, use 0.6B models, BF16/FP16, FlashAttention or SDPA, one GPU worker |
| Python dependency conflict | Backends cannot coexist | Separate locked worker environments and JSON subprocess protocol |
| TTS drops or repeats words | Source fidelity failure | Short deterministic chunks, ASR comparison, retry, manual review |
| Voice changes between chunks | Poor audiobook quality | Locked reference voice, stable settings, voice-regression sample, manual gate |
| Indonesian words sound wrong | Reduced comprehension | Human-approved lexicon and dedicated pronunciation samples |
| LLM rewrites the text | Copyright and fidelity problem | Deterministic text pipeline, annotation-only schema, immutable source hashes |
| DOCX page numbers differ | Wrong selection | Prefer headings; record renderer; warn and verify rendered boundaries |
| PDF is scanned | Empty or corrupt extraction | Detect low text density and require local OCR/manual verification |
| Ollama consumes VRAM during TTS | Out-of-memory failure | `keep_alive: 0`, verify unload, sequential orchestration |
| Model licence is misunderstood | Inappropriate use | Record code and weight licences separately; exclude F5 default weights |
| Unconsented voice clone | Ethical/legal harm | Mandatory consent field and fail-closed cloning worker |
| Generated copyrighted audio is shared publicly | Rights breach | Required rights/distribution gate and local-only default |
| Cache returns stale audio | Incorrect output | Content-addressed keys include text, model, voice, lexicon, and settings |
| Process interrupted mid-write | Corrupt project state | Partial files, atomic renames, atomic manifest replace, recovery scan |
| Junior developer changes expected pilot counts | Regression hidden | Golden tests and owner approval required for fixture changes |

---

## 19. Handoff and completion checklist

### 19.1 Per-slice handoff

At the end of every slice, provide:

- Summary of completed work.
- Files created or changed.
- Commands run.
- Test and audit results.
- Known limitations.
- Gate evidence location.
- Manual actions required.
- Clear recommendation to proceed or not proceed.

Do not start the next slice until the project owner replies with approval.

### 19.2 Code quality checklist

- [ ] No hardcoded user-specific absolute paths in application logic.
- [ ] No large model files or generated audio committed.
- [ ] All persisted data has a schema version.
- [ ] All external subprocess calls use argument arrays, not shell-built strings.
- [ ] Paths with spaces are tested.
- [ ] Worker timeouts are enforced.
- [ ] GPU memory is released between stages.
- [ ] Logs do not leak source text unnecessarily.
- [ ] Tests cover failure paths as well as success paths.
- [ ] Documentation reflects the locked dependency versions.

### 19.3 Final G4 handoff

- [ ] Application quick start works on a clean WSL environment.
- [ ] `audiobook doctor` identifies all required dependencies.
- [ ] Pilot can be rebuilt from source using the manifest.
- [ ] Final Ginger Juice audio and QA report exist locally.
- [ ] General extractors are tested.
- [ ] Skill validation passes.
- [ ] Forward tests pass.
- [ ] Rights and voice-consent controls fail closed.
- [ ] Project owner can trigger the workflow through natural language.

---

## 20. Reference links

Use primary project documentation when implementing and pin the exact versions selected during Slice 0 or Slice 1.

- Qwen3-TTS official repository: <https://github.com/QwenLM/Qwen3-TTS>
- Qwen3-TTS 0.6B CustomVoice model: <https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice>
- Chatterbox official repository: <https://github.com/resemble-ai/chatterbox>
- Kokoro-82M model: <https://huggingface.co/hexgrad/Kokoro-82M>
- F5-TTS model licence table: <https://github.com/SWivid/F5-TTS/blob/main/src/f5_tts/infer/SHARED.md>
- Ollama structured outputs: <https://docs.ollama.com/capabilities/structured-outputs>
- faster-whisper: <https://github.com/SYSTRAN/faster-whisper>
- FFmpeg documentation: <https://ffmpeg.org/documentation.html>
- uv documentation: <https://docs.astral.sh/uv/>
- Copyright Agency education guidance: <https://www.copyright.com.au/licences-permission/educational-licences/copying-under-education-licence/>

---

## Recommended first action

Implement Slice 0 only. Stop after Gate G0 and present the extraction evidence before downloading and integrating the full speech-model set.

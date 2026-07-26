# Audiobook Studio operations

The canonical production runtime is Ubuntu 24.04 under WSL2. Windows is suitable for
source extraction, planning tests, schema export, and the non-GPU test suite.

## Production order

1. Run `audiobook extract` and confirm the frozen source counts and hashes.
2. Lock a voice through Gate G1.
3. Run `audiobook plan`. Invalid or unavailable Ollama annotations fall back to a
   deterministic source-faithful plan and record a warning.
4. Run `audiobook pronunciation-diff`. Every difference must be explicitly approved.
5. Run `audiobook render`. Accepted chunks are content-addressed and reused.
6. Run `audiobook render --require-full-cache` to prove resumability.
7. Run `audiobook assemble` to create the globally mastered WAV.
8. Run `audiobook qa` to perform batch Whisper comparison and technical audio checks.
9. Record the rights confirmation, then run `audiobook package`.
10. Complete the manual checklist and close Gate G2 only after listening.

`scripts/generate-chapter.sh` performs steps 3–8 and retains evidence when a stage fails.

## Recovery

- Planning is atomic and safe to rerun.
- Rendering reuses only a matching render key with a valid mastered WAV.
- A changed chunk receives a new render key; unrelated accepted chunks remain cached.
- Qwen attempts all missing chunks in one model load. If the batch fails, the coordinator
  retries chunks independently up to the configured maximum.
- Failed audio is copied into `qa/audio/failed/`; worker request, response, stdout, and
  stderr evidence is retained in `qa/logs/render/`.
- Assembly and QA can be rerun without regenerating accepted chunks.
- Partial mastering files are never treated as accepted outputs.

## Rights and manual gates

Packaging fails closed while `rights.confirmed` is false. The approval record must name
the approver, the licence basis, audience, distribution boundary, and timestamp.

Automated QA can leave the project in `manual_review`, never in final approval. Use
`projects/berani-ginger-juice/qa/manual-checklist.md` for the required listening pass.

## General source operations

- Use `inspect` to list headings, stable paragraph locations, physical PDF pages, and
  format-specific warnings.
- TXT is decoded as UTF-8 with optional BOM and preserves blank-line paragraphs.
- DOCX reads body paragraphs and heading styles. Headers, footers, comments, and tracked
  deletions are outside the default body-paragraph traversal.
- DOCX page selection fails with LibreOffice guidance; prefer structural headings.
- PDF uses physical pages and fails closed when any selected document page has too little
  extracted text. Run local OCR and inspect the result before continuing.
- Multi-selection projects write each extraction under
  `chapters/<chapter-id>/source/`; unchanged chapter IDs retain independent paths.
- After each listed chapter has an accepted WAV, assemble them in the same order:

  ```bash
  audiobook assemble-chapters --project projects/my-book/project.yaml \
    --chapter-audio chapters/one/output/one.wav \
    --chapter-audio chapters/two/output/two.wav
  ```

  The command requires confirmed rights and writes a chaptered M4B by default.

Configuration precedence is application defaults, backend defaults, voice profile,
project configuration, then explicit CLI overrides. The resolved result is written to
the manifest.

Before changing a persisted schema, add and test a deterministic migration. The migration
command refuses newer unknown versions and creates `manifest.vN.backup.json`.

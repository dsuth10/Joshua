# Festival Day — Delivery Register

Last updated: 9 September 2026

## Delivery promise

Initial product: a local, offline-capable student website and a separate local teacher-review website. The student experience has six core missions, six extension missions, username-only records, teacher PIN approval before each numbered local film, checkpoint export/import and a reviewable dossier. The teacher companion imports student JSON files, displays exact work, keeps teacher notes locally and exports username-only AI review bundles.

Films are supplied later in `films/` as `1.mp4` through `12.mp4`. The application must remain usable if they are not yet present.

## Working rules

- Use Australian English and Year 4-level reading language for this Year 5 class.
- Keep student data to a username. Never export a PIN.
- A correct PIN approves one mission only. It is a classroom approval gate, not secure authentication.
- Work is built in `festival-day/`; unrelated workspace changes are not touched.
- Content uses a fictional festival context. Real-world claims need source notes before classroom release.

## Status key

- `[ ]` not started
- `[-]` active
- `[x]` completed and checked
- `[!]` blocked or needs teacher input

## Stage 0 — shared foundation

- [x] Define shared content, state and export contracts.
- [x] Create student shell, style system and accessible navigation.
- [x] Create local checkpoint, import/export and PIN approval services.
- [x] Create teacher-review companion and AI bundle export.
- [x] Add development/test instructions and film-folder guide.

## Stage 1 — authored mission library

- [x] M01 Two Places, One Festival — English/HASS.
- [x] M02 Evidence Editing Room — English/HASS.
- [x] M03 Make the Grounds Work — maths.
- [x] M04 Power the Premiere — science.
- [x] M05 Allocation Challenge — maths.
- [x] M06 Committee Hearing — synthesis.
- [x] E01–E06 extension cases, mapped to films 7–12.

## Stage 2 — integration and quality gate

- [x] Assemble all content into student website.
- [x] Verify wrong and correct PIN paths; only the approved M01 unlocked Film 1 in browser testing.
- [-] Verify teacher-requested changes, approval snapshots, export/import and missing films. Approval snapshot and export/import passed; changes-request and actual film files remain classroom checks.
- [-] Verify teacher import, notes persistence and username-only AI export. Import and detailed review passed; notes persistence and AI-bundle inspection remain checks.
- [-] Browser check at laptop width, keyboard and storage-failure fallback. Standard browser flow passed; student-device, direct-file and storage-failure checks remain.
- [x] Update this register with final evidence and remaining classroom checks.

## Stage 3 — richer case-file revision

- [x] Freeze a richer case-file format: opening incident, multiple evidence forms, evidence linking, first decision, update and revision.
- [x] Rework M01, M02, E01 and E06 into English/HASS cases with inferencing, evidence evaluation and defensible decisions.
- [x] Rework M03, M05, E03, E04 and E05 into maths cases with connected constraints, calculations and revisions.
- [x] Rework M04 and E02 into science cases with evidence-led diagnosis and changed conditions.
- [x] Rework M06 into a genuinely contested final committee decision.
- [x] Update the student interface to reveal a new evidence update after the first decision and collect a revision.
- [x] Update export and teacher review to retain and display initial and revised thinking.
- [x] Independently audit every case for giveaway answers, ambiguity, reading rigor, support-path parity and question-answer evidence.
- [-] Test revised mission, two-stage reveal, automatic choice feedback, PIN approval, export/import and teacher review data paths. Revised mission and feedback passed; a full revised dossier round trip remains a final classroom-style check.

## Known classroom checks after delivery

- [ ] Teacher replaces `CHANGE-ME-4729` in `config.js` with the classroom PIN, then tests it.
- [ ] Add `films/1.mp4`–`films/12.mp4` and test sound/playback from the actual school drive.
- [ ] Confirm current school browser and run the student/teacher sites from a student laptop.
- [ ] Pilot one mission and adjust reading/workload if needed.

## Evidence from this build session

- [x] JavaScript syntax checks passed for student, teacher and all four content files.
- [x] Content load check found 12 unique mission IDs and the fixed Film 1–12 mapping.
- [x] Browser check loaded all core and extension cards with no console errors after reload.
- [x] M01 sample completion: objective feedback, teacher dialog, rejected PIN and accepted PIN were exercised. Accepted PIN produced an approval snapshot and only Film 1.
- [x] Sample checkpoint downloaded and restored through browser storage. Its state contained username, work and approval snapshot, with no PIN.
- [x] Teacher review imported the sample dossier and rendered its detailed mission context and response without console errors.
- [x] Rich-case validator passed all 12 missions: each has an opening, evidence file, supported reading, linked evidence question, first decision, update and revision.
- [x] Revised browser check: M01 rendered its full evidence file, correct automatic feedback and its update/revision stage after a complete first decision.
- [!] The lesson-specific `scripts/audit_lesson_html.js` is not present in this workspace, so the project-standard static HTML audit could not run. Syntax checks and browser checks were used instead.

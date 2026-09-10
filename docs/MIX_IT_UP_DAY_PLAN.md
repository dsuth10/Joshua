# Mix-It-Up Day — proposed build plan

Status: planning only; implementation awaits the user's approval.
Prepared: 10 September 2026.

## 1. Concept and scope

Create a separate, simplified companion to Festival Day, provisionally called **Mix-It-Up Day**. Its promise to students is: **Write something surprising. Solve something tricky. Try something new.**

The day has no shared story, subject theme, evidence dossier or final synthesis task. Each challenge has its own playful topic. A consistent interface gives students familiarity while the content supplies variety. “Random” means deliberately varied, authored topics, not questions that change unpredictably on reload.

Plan for approximately age 10 / Year 5, with short instructions around Year 4 reading complexity, optional support and meaningful stretch. Carry forward the earlier project's four-hour session as a provisional timetable, not a newly confirmed requirement. Six core challenges provide a manageable finish line; six optional challenges provide choice and extension.

Keep the existing Festival Day intact. Proposed new folder and eventual website path: `mix-it-up-day/`. Confirm the actual website integration point during implementation.

## 2. What carries over and what becomes simpler

Retain username-only entry, an activity home screen, visible progress, local autosave, JSON checkpoint download and restore, teacher PIN approval, teacher-requested changes, approval snapshots, optional numbered film rewards, Listen controls and a separate teacher review page. Preserve teacher review backups and the optional manually downloaded AI review bundle; no automatic sending of student work.

Replace the mandatory opening/evidence/first-decision/update/revision structure with **Try → Check → Show your teacher**. Each challenge contains one short introduction, one main activity, two or three success checks and optional help/stretch. Students can improve their answer without completing an artificial second stage.

Use “My work” and “Challenges” instead of “Dossier”, “Evidence file” and “Cases”. Remove cross-task prerequisites. Offer a recommended alternating order, while allowing students to start elsewhere.

## 3. Core challenge library

All settings and data below are fictional. Exact question sets, feedback and answer keys will be authored and checked during the content stage.

| # | Challenge | Student experience and saved outcome | Learning and approval focus | Time |
|---|---|---|---|---|
| 1 | **The Vending Machine That Sold…** | Choose a machine that sells weather, tiny adventures or unusual talents. Plan a character, a purchase and an unexpected consequence; write a short story. Suggested length 120–180 words, adjustable by the teacher. | Clear beginning/problem/ending; specific detail; reread and improve one sentence. Length guides workload, not automatic approval. | 25 min |
| 2 | **Snack Shop Showdown** | Build a snack order for four friends using a fictional menu, a $20 budget and each friend's preference. Record quantities, total cost and change, then solve a separate “which deal?” problem. | Money, multiplication, addition/subtraction and comparison. Show calculations and check the order meets every constraint. More than one valid order is welcome. | 25 min |
| 3 | **Number Trick Lab** | Solve a short set of number puzzles: target numbers, missing operations and a pattern with a rule to explain. Example: use 3, 4, 6 and 8 once each to make 24 using the allowed operations. | Calculation, strategy and explaining a method. Save the expression or working, not just a success animation. | 20 min |
| 4 | **A Very Unusual Class Pet** | Choose a tiny dragon, talking snail or miniature mammoth. Write a persuasive pitch with two reasons, a practical care plan and a response to one likely objection. Suggested length 100–150 words. | Clear opinion, developed reasons, persuasive language and a sensible response to a concern. Teacher judges quality; the app does not automatically grade writing. | 25 min |
| 5 | **The Great Day-Out Puzzle** | Use a small fictional timetable to choose activities that fit between arrival and departure. Include travel and a lunch break, calculate elapsed time and solve a group-ticket problem. | Multi-step word problems, time, money and explaining whether a schedule is possible. Save the selected schedule and working. | 25 min |
| 6 | **Pixel Playground** | Colour a small square grid under constraints: for example, exactly half the squares blue and one quarter yellow. Create a symmetrical design, label the fractions and explain how the design meets the rules. | Fractions of a whole, counting and symmetry. Save each cell's colour, labels and explanation so the design can be reconstructed in teacher review. | 20 min |

Each task includes an optional small example on a different prompt or different numbers. Examples model a strategy without supplying the student's solution. Maths feedback identifies the next useful check rather than simply revealing the answer. No speed leaderboard or compulsory countdown.

## 4. Optional challenge menu

Optional work is available while waiting for teacher approval or after the core set. It does not inflate the core progress denominator or prevent completion of the day.

| Challenge | Activity | Approximate time |
|---|---|---|
| **Lost: One Invisible Backpack** | Write a funny lost-property notice with precise clues and instructions for its finder. | 10–15 min |
| **Worst Superpower, Best Rescue** | Write an 80–120-word scene where an apparently useless power solves a problem. | 15–20 min |
| **Sticker Swap** | Solve equal-group, multiplication and remainder problems about swapping sticker packs; justify a fair trade. | 15 min |
| **Mini-Golf Designer** | Draw rectangular courses on a grid; compare area and perimeter and explain why equal areas can have different perimeters. | 15–20 min |
| **Mystery Number** | Solve clue sets using place value, multiples and factors; write a new clue set that has exactly one answer. | 10–15 min |
| **Would You Rather? Prove It!** | Compare two fictional deals using calculations, then recommend one with a short explanation. | 15 min |

Choice is meaningful: students select a prompt or a strategy, while each task's saved variant and rules remain fixed. A future shuffle button can reorder cards without replacing existing work; runtime question generation is outside the initial scope.

## 5. Student workflow

1. Enter a familiar classroom username; resume an existing draft or restore a downloaded checkpoint.
2. See six core cards, a separate extras area and a prominent Resume button. Each card shows its task type, approximate time and status.
3. Open a challenge. Read or listen to the short prompt, use optional help and complete the activity.
4. Use a short self-check. Objective questions can receive feedback, but “ready” means ready for human review rather than automatically approved.
5. Select **Ready for teacher**. Keep the work available and move to another challenge while waiting.
6. The teacher reviews the actual answers and uses the PIN to approve, or leaves a specific change request.
7. Approval records a snapshot, updates progress and offers a checkpoint download plus the configured reward.
8. Finish with a simple portfolio screen: six core completion markers, an optional favourite-task reflection and **Download all my work**. Extras appear separately.

Statuses: Not started, In progress, Ready for teacher, Changes requested, Approved. Editing submitted work returns it to In progress. Editing approved work requires review of the new version; keep the previous approval snapshot and any reward already earned.

## 6. Teacher approval and rewards

Use a configurable PIN entered on the student's device, as in Festival Day. The approval dialog shows all required work, including grids and calculations, plus a compact criteria checklist. Both approval and teacher-only change requests require the PIN. Clear the PIN field after every action; exclude it from exports.

Record task ID, response revision, approval time and the exact approved response. A change request records the teacher's note and time. Approval is per challenge, not a blanket unlock.

This retains the current static-site classroom gate: a PIN embedded in a client-side application is not secure authentication. It does not require student accounts or a backend.

Retain films 1–6 for core tasks and 7–12 for extras as optional configurable rewards. Missing films must never prevent completion. Teachers can instead use a brief completion animation and a break message. Film runtimes determine how much viewing fits in the day.

For a class of 19, short task-specific criteria and students moving on while waiting are essential. Budget roughly 30–60 seconds for a straightforward approval, with longer feedback handled as a change request. Pilot writing-review time rather than promising that all reviews fit this estimate.

## 7. Saving, export and review

- Autosave text, choices, calculations, grids, support preferences and the last active challenge. Display a truthful saved indicator and a visible fallback if storage fails.
- Use a new storage namespace and project/export identity so Festival Day files and drafts cannot be overwritten accidentally.
- JSON includes schema/content versions, username, submission ID, timestamps, exact prompts and selected variants, all responses and interactive state, readiness, teacher notes and approval snapshots. Do not export the PIN or answer keys.
- Downloads use a recognisable username-based filename. Offer explicit checkpoint buttons at approval and exit; distinguish saving on this device from downloading a portable backup.
- Restore validates file structure, project identity and supported versions before replacing anything. Show whose file it is, confirm replacement and offer a current-work download first. Invalid imports leave the current work untouched.
- Test a full export/import round trip into a clean browser state, including grids, numeric zero answers, pending review, requested changes and approvals.
- Keep browser-local saving explicit: changing laptop, browser or website origin requires JSON transfer; there is no automatic class synchronisation.

The separate teacher page imports multiple files, shows each student's core/extras progress and displays exact prompts alongside answers. It reconstructs visual responses, supports notes and judgements, and downloads/restores review backups. Duplicate submissions are identified by submission ID; older exports must not silently replace newer records. The optional AI bundle remains a manual export. Teacher companion notes are separate from live feedback on a student's device.

## 8. Visual and accessibility direction

Aim for a bright illustrated notebook/sticker aesthetic that suits upper primary: cobalt blue, coral, sunshine yellow, mint and violet accents on calm light surfaces, with dark readable text. Give each challenge one playful illustrated icon. The shared styling is an interface identity, not a story theme.

Use generous writing space, large controls, rounded shapes and clear labels. Keep the activity itself central. Use colour plus text/icons for status; keyboard and click alternatives for any dragging; visible focus; responsive laptop/tablet layouts; reduced-motion support and no autoplay sound.

Provide Listen for prompts and help, following the existing packaged-audio approach with new recordings for new content. Audio availability must not block the text experience. Support includes short steps, sentence starters, a relevant visual or worked example and optional maths scaffolds. Stretch deepens the task through a new constraint or justification rather than simply adding volume.

## 9. Provisional four-hour running order

| Component | Minutes |
|---|---:|
| Welcome, username and saving demonstration | 10 |
| Six core challenges | 140 |
| Film/reward and movement breaks | 40 |
| Flexible review, revision or optional challenges | 35 |
| Final reflection, export and file check | 15 |
| **Total** | **240** |

School recess and lunch sit outside this allocation. Approval generally occurs as students work and transition. Timings are estimates to verify with one writing and one maths pilot; reduce optional work or reward time if needed.

## 10. Implementation stages after approval

1. **Content and contracts:** finalise all 12 briefs, worked examples, answer keys, feedback, support, criteria, data shapes and the new project namespace.
2. **One complete vertical slice:** build the new shell and Snack Shop Showdown through saving, PIN approval, export/restore and teacher review. Present this working slice for design/workload feedback before expanding.
3. **Core library:** complete the other five core activities, including writing and persistent grid interactions. Verify all answers and open-ended criteria.
4. **Extras and classroom polish:** add six extras, new narration, optional rewards, portfolio finish screen and teacher guidance.
5. **End-to-end verification and website integration:** check laptop layout, keyboard access, saving failures, safe imports, approval/version behaviour, review backups, missing media and hosted paths. Prepare the site entry and carry out release only within the subsequently authorised build scope.

Deliverables: student app, teacher review app, 12 authored challenges, teacher answer/criteria guide, configurable PIN/rewards, audio assets, JSON format notes, setup instructions and a test evidence checklist.

Acceptance requires: all six core and six optional tasks usable; no required cross-task knowledge; working local save and portable restore; faithful reconstruction of every response; correct/wrong PIN behaviour; correct approval changes after edits; no PIN in exported files; separate progress/storage from Festival Day; usable missing-media/storage fallbacks; and a checked classroom workload.

## 11. Basis of this plan

Inspected local source: `festival-day/README.md`, `app.js`, `config.js`, `teacher-review.js`, `TASKS.md`, and the earlier `docs/END_OF_TERM_MISSION_DAY_STRUCTURE_PLAN.md`. Used the build-engaging-lessons design standards and interaction guidance, with the user's independent-task/no-theme direction taking precedence over a connected lesson narrative.

This is a source-based plan, not a claim that the existing application or live website was retested. No application code or website content has been changed for this proposal.

# Mix-It-Up Day build tasks

This checklist turns the approved concept into a classroom-ready project. Tasks are ordered so that saving, export and approval work before activity polish.

## Foundation

- [x] Create a standalone student app entry point and a separate teacher-review entry point.
- [x] Establish the colourful notebook-style design system: type scale, accessible colour tokens, cards, large controls, icons and responsive layout.
- [x] Add the student identity screen and a clear reset/start-over pathway with an appropriate warning.
- [x] Define a versioned JSON data model for student profile, answers, interactive state, task status, review events and timestamps.
- [x] Implement local-browser autosave with safe parsing and a visible saved indicator.
- [x] Implement JSON export and guarded JSON restore, including clear errors for malformed or incompatible files.

## Teacher workflow

- [x] Add one configuration location for the teacher PIN and document how to change it.
- [x] Build the submission state: draft, ready for teacher, needs improvement and approved.
- [x] Require the PIN for approval and never display it in the student interface.
- [x] Record approval and improvement-request events with task ID and timestamp in exported data.
- [x] Build the teacher-review page with multi-file JSON import, student/task summary cards and full original evidence.
- [x] Add an easy way to remove imported review data from the teacher page.

## Activities

- [x] Write and build **The Vending Machine That Sold…**, a short imaginative narrative task.
- [x] Write and build **Snack Shop Showdown**, involving money, budget choices, change and deal comparison.
- [x] Add 24-question saved maths missions, drawn from 30-question banks, to all maths and word-problem challenges.
- [x] Add keyboard-operable number-line placement and fraction-shading controls without importing the full Maths Command Station engine.
- [ ] Write and build **Number Trick Lab**, with target numbers, missing operations and patterns.
- [ ] Write and build **A Very Unusual Class Pet**, a persuasive writing task.
- [ ] Write and build **The Great Day-Out Puzzle**, using a timetable, duration and ticket-cost word problems.
- [ ] Write and build **Pixel Playground**, with grid art, fractions and symmetry conditions.
- [ ] Add optional extra activities: invisible-backpack notice, useless-superpower story, sticker swaps, mini-golf measurement, mystery numbers and mathematical comparisons.
- [ ] Give each activity short instructions, one worked example or hint, success checks, support and an extension constraint.
- [ ] Ensure students can complete activities in any order and revisit earlier work.

## Rewards, accessibility and classroom readiness

- [ ] Add a teacher-controlled optional reward setting and a neutral no-reward state.
- [ ] Add a reward trigger only after configured approval milestones.
- [ ] Provide optional read-aloud controls where supported, with readable text remaining the source of truth.
- [ ] Verify keyboard operation, visible focus, colour contrast, large hit targets and responsive use on school laptop screens.
- [ ] Keep audio, video and external links optional and school-appropriate.
- [ ] Show simple student-facing privacy guidance: use a first name/nickname and do not include private information.

## Verification and release

- [ ] Run the README functional checklist using a real sample student export.
- [ ] Test on Chrome and Edge, including a narrow laptop/tablet viewport.
- [ ] Test local storage disabled/unavailable and ensure export still gives students a recovery route.
- [ ] Test a deliberate bad import, wrong PIN and accidental page refresh.
- [ ] Review every prompt, example, calculation and answer expectation for clarity and age suitability.
- [ ] Confirm the configured PIN is not a real password and that no external service or student account is required.
- [ ] Prepare a one-page teacher launch note: start URL, PIN location, review URL, export reminder and reward setting.

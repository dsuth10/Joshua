# Gate G5 Family User-Testing Prep

Purpose: run a consistent home test to confirm the Gate G5 criterion:
**a five-year-old can complete a Prep session unassisted after one demonstration.**

Use this protocol before any Prep/Y1/Y2 assessment build-out.

---

## 1) Test Setup

- **Participant:** one child in the Prep age band (target 5 years old).
- **Device:** preferred tablet first, then optional desktop repeat.
- **Build under test:** `prep-practice.html` opened via `file://` or local server.
- **Adult role:** facilitator only; avoid coaching during the unassisted run.
- **Session length:** 10-15 minutes.

---

## 2) Preflight Checklist (adult)

- [ ] Open `prep-practice.html`; confirm no console errors.
- [ ] Confirm audio prompt button works on first question.
- [ ] Confirm drag/tap controls respond (one sample interaction only).
- [ ] Confirm child can reach reset/check/next buttons comfortably.
- [ ] Start evidence log (template in section 6).

If any item fails, stop and fix product issues before testing with the child.

---

## 3) Facilitator Script (One Demonstration Only)

Read this script verbatim:

1. "We are going to play some maths missions."
2. "I will show one example first, then you do the rest by yourself."
3. Demonstrate exactly one question:
   - replay prompt audio,
   - perform the interaction,
   - press **CHECK** once,
   - press **NEXT**.
4. "Now it's your turn. I won't help unless the app stops working."

Rules after demo:

- No hints about answer strategy.
- No pointing to the right option.
- Only technical help allowed (for example, accidental browser close).

---

## 4) Unassisted Run Protocol

Run a single continuous session with the child:

- Target **10 consecutive questions** on Prep page.
- Encourage natural tab changes across strands if the child chooses.
- Record every adult intervention and reason.
- Record when the child asks for help but continues independently.

Track these outcomes:

- Question completion (finished / abandoned).
- Correctness on first attempt.
- Whether hint/solution flows were triggered.
- Navigation independence (CHECK, NEXT, tab switching).

---

## 5) Gate G5 Decision Rule

Gate G5 is considered **PASS** when all are true in at least one clean run:

1. Child completes the full 10-question run after one demo.
2. No instructional intervention is required after demonstration.
3. Child independently uses core controls:
   - prompt audio replay,
   - CHECK/NEXT flow,
   - at least one strand/tab change.
4. No blocking UX defect occurs (frozen widget, impossible input, unreadable prompt).

If any condition fails, mark **NOT YET** and log targeted fixes for a re-test.

---

## 6) Evidence Log Template

Copy this into the session log for each run.

```md
### Gate G5 family run — <date>

- Child age: <x>
- Device/browser: <device + browser>
- Build: <commit or working tree note>
- Facilitator: <name/initials>
- Demo question family: <F# + context>

| Q# | Family/Context | Completed? | Correct first try? | Adult intervention? | Notes |
|----|----------------|------------|--------------------|---------------------|-------|
| 1  |                |            |                    |                     |       |
| 2  |                |            |                    |                     |       |
| 3  |                |            |                    |                     |       |
| 4  |                |            |                    |                     |       |
| 5  |                |            |                    |                     |       |
| 6  |                |            |                    |                     |       |
| 7  |                |            |                    |                     |       |
| 8  |                |            |                    |                     |       |
| 9  |                |            |                    |                     |       |
| 10 |                |            |                    |                     |       |

- Independent tab change observed: <yes/no>
- Independent audio replay observed: <yes/no>
- Blocking defect observed: <yes/no + details>

**Gate verdict:** <PASS / NOT YET>
**Next action:** <none or fix list>
```

---

## 7) Recommended Execution Order

1. **Recommended:** run one tablet session first (closest to Band-A ergonomics target).
2. Run one desktop confirmation session only if tablet pass is clean.
3. If either run is **NOT YET**, fix highest-impact blockers first:
   - interaction reliability,
   - prompt clarity/audio,
   - control discoverability (CHECK/NEXT/reset),
   - strand navigation confusion.


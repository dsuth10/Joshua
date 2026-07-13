# Validation and QA Procedures

This document outlines the definition of done, manual QA procedures, and the final check report template for augmented assessments.

## Definition of Done

A descriptor expansion is done when:
1. The descriptor has a clear conceptual decomposition.
2. The current app representation has been inspected and documented.
3. At least four demonstration forms have been planned (Symbolic, Visual, Diagnostic, Applied).
4. Existing contexts are preserved.
5. New context strings are stable and consistent across docs and code.
6. Existing widgets are reused or extended (no unnecessary new widgets).
7. The relevant practice generator emits all contexts.
8. `achievements-config.js` requires the correct contexts.
9. Static context audit passes.
10. Widget smoke checks pass.
11. Manual QA confirms all branches render and assess correctly.
12. A check report or implementation note records the slice.
13. The work is committed with a clear message.

## Manual QA Checklist

Automated checks are necessary but not sufficient. You must either perform browser checks directly or give the user this targeted QA list:

- [ ] Open the relevant practice page (e.g., `year5-practice.html`).
- [ ] Force or repeatedly generate the target descriptor.
- [ ] Confirm all new contexts appear.
- [ ] Answer each context correctly.
- [ ] Answer each context incorrectly.
- [ ] Trigger hint after a wrong attempt.
- [ ] Trigger `showSolution`.
- [ ] Confirm badge progress updates.
- [ ] Confirm no console errors.
- [ ] Confirm visual layout on small screen.
- [ ] Confirm keyboard/touch basics.
- [ ] Confirm previous (legacy) contexts still work.

## Slice Check Report Template

Create this file in `Maths_Command_Station/Improvement_Infrastructure/check-reports/slice-N-descriptor.md`.

```markdown
# Slice N — <Descriptor Code> <Badge Name>

## Goal
Broaden <Descriptor Code> from symbolic to a multi-representation demonstration family.

## Files changed
- Maths_Command_Station/year*-practice.js
- Maths_Command_Station/widgets/mcs-widgets-*.js
- Maths_Command_Station/achievements-config.js
- Maths_Command_Station/scripts/g3-y*-context-audit.mjs
- Maths_Command_Station/Improvement_Infrastructure/year*-descriptor-variety-matrix.md

## Contexts
Existing:
- 

New:
- 

## Widget changes
- 

## Validation
- g3-y*-context-audit: PASS/FAIL
- g5-widget-inventory-audit: PASS/FAIL
- g5-all-practice-widget-smoke: PASS/FAIL

## Manual QA
- Symbolic branch checked: yes/no
- Visual branch checked: yes/no
- Applied branch checked: yes/no
- Diagnostic branch checked: yes/no
- Badge progress checked: yes/no

## Known follow-ups
- 
```

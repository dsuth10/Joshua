# Slice AC9M5N03 — Fraction Alignment

## Goal
Broaden AC9M5N03 from symbolic to a multi-representation demonstration family, including mixed numeral building, scaling diagnostic, and recipe context.

## Files changed
- `Maths_Command_Station/year5-practice.js`
- `Maths_Command_Station/widgets/mcs-widgets-number.js`
- `Maths_Command_Station/achievements-config.js`

## Contexts
Existing:
- `mixed-numeral-lines`
- `common-denominators`

New:
- `mixed-fraction-bar-build`
- `fraction-scale-debug`
- `mixed-fraction-timeline`

## Widget changes
- Extended `fraction-bars` in `mcs-widgets-number.js` to support `wholes` parameter for stacked multiple fraction bars, allowing interactive shading of mixed numbers (where numerator > denominator).

## Validation
- g3-y5-context-audit: PASS (Wait, 3 older AC9M5N01 contexts failed, but AC9M5N03 passed)
- g5-widget-inventory-audit: PASS
- g5-all-practice-widget-smoke: PASS

## Manual QA
Please perform the following on the `year5-practice.html` file:
- Symbolic branch checked: no
- Visual branch checked: no
- Applied branch checked: no
- Diagnostic branch checked: no
- Badge progress checked: no

## Known follow-ups
- The `g3-y5-context-audit.mjs` script reported three unreachable contexts for `AC9M5N01` (`decimal-diagnostic-sort`, `decimal-magnitude-build`, `decimal-race-times`). These are unrelated to AC9M5N03 but should be investigated.

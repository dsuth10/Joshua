# Slice 1 — AC9M5N01 Decimal Precisionist

## Goal
Broaden AC9M5N01 from symbolic to a multi-representation demonstration family, including Visual, Diagnostic, and Applied contexts.

## Files changed
- Maths_Command_Station/year5-practice.js
- Maths_Command_Station/widgets/mcs-widgets-number.js
- Maths_Command_Station/achievements-config.js

## Contexts
Existing:
- `decimal-sorting`
- `number-line-plots`

New:
- `decimal-magnitude-build`
- `decimal-diagnostic-sort`
- `decimal-race-times`

## Widget changes
- `place-value-blocks`: Extended interactive build mode to support `config.decimal` true. Maps Flat = 1, Rod = 0.1, Unit = 0.01. Evaluates sum to two decimal places appropriately.

## Validation
- g3-y5-context-audit: PASS
- g5-widget-inventory-audit: PASS
- g5-all-practice-widget-smoke: PASS

## Manual QA
- Symbolic branch checked: [Pending manual QA by User]
- Visual branch checked: [Pending manual QA by User]
- Applied branch checked: [Pending manual QA by User]
- Diagnostic branch checked: [Pending manual QA by User]
- Badge progress checked: [Pending manual QA by User]

## Known follow-ups
- Ensure users interact properly with the newly assigned 1, 0.1, and 0.01 mapping in decimal block building context.

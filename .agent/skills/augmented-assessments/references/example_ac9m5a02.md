# Example: Completed AC9M5A02 Pattern

This example serves as a reference for how to conceptually decompose a descriptor and extend widgets.

## Descriptor
```text
AC9M5A02 — Equation Architect
```

## Existing contexts
```text
unknown-multiplication
unknown-division
```

## New contexts
```text
balance-scale-unknowns
applied-unknown-mass
balanced-equation-sort
```

## Widget changes
```text
balance-scale:
- existing compare mode preserved
- new solve-unknown mode added

sorting-table:
- existing category columns preserved
- text-cards mode added for equation cards
```

## Student demonstration family

| Form | Evidence of understanding |
|---|---|
| Symbolic | Student can solve an unknown in multiplication/division equations. |
| Visual/spatial | Student can interpret equality using a balance model. |
| Diagnostic | Student can recognise balanced and unbalanced equations. |
| Applied/contextual | Student can translate a physical mass situation into an unknown-value equation. |

## Sub-Generator Design References

### Visual/spatial branch
Purpose: Represent equality as a balanced system.
Example: Left pan: mystery box + 3 kg, Right pan: 15 kg. Find mystery mass.
Widgets: `balance-scale mode: solve-unknown`, `math-field`
Evaluation: Student answer equals right mass minus known left units.

### Applied/contextual branch
Purpose: Transfer the equation model into a real or game-world scenario.
Example: A cargo pod and 4 kg are balanced with 20 kg on the other side.
Widgets: `balance-scale mode: solve-unknown`, `math-field`
Design rule: Use the visual model as an anchor, not just text.

### Diagnostic branch
Purpose: Test whether the student can verify equality or identify faulty reasoning.
Preferred version: Sort each equation into Balanced or Unbalanced (e.g. `3 × 4 = 12`, `10 + 2 = 5 × 3`).
Widget: `sorting-table mode: category-columns / text-cards`

## Key lesson
The descriptor is no longer assessed as a single missing-number task. It is assessed through multiple connected representations of equality and inverse reasoning.

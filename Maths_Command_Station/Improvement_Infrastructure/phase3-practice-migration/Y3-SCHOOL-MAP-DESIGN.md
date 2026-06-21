# Y3 AC9M3SP02 — School Map Design Freeze

**Status:** Frozen 2026-06-20  
**Widget path:** `coordinate-plotter` → `alpha-grid` → `presentation: 'school-map'`

## Curriculum intent (AC9M3SP02)

Year 3 Space must assess:

- interpreting familiar top-view maps
- creating/completing simple 2D plans
- locating landmarks and objects relative to each other
- using relative language such as beside, between, opposite, near, above, below, left of, right of

Year 3 Space must **not** assess:

- Cartesian coordinates
- x/y plotting
- formal coordinate-pair entry
- “move x units right and y units up” as the main skill

## Frozen contexts

| Context | Action |
|---------|--------|
| `familiar-map-interpret` | Read school map, choose landmark |
| `familiar-map-create` | Place object on school map using relative clue |

## Deprecated contexts (legacy profiles only)

| Context | Notes |
|---------|-------|
| `landmark-locate-coords` | Do not emit in new tasks |
| `landmark-navigate-coords` | Do not emit in new tasks |

## Assessment

- Panel: `SCHOOL_MAP_RESCUE`
- Scoring: map placement correctness (`mapSelectedCol` / `mapSelectedRow`), not route animation
- Rubric row: `PART_C: SCHOOL_MAP_RESCUE` (+1 mark; assessment total 31)

## Audit gate

Run `node scripts/g3-y3-school-map-audit.mjs` before sign-off.

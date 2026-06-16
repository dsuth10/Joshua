# Maths Command Station Check Reference

## Canonical script intents

| Script | Purpose |
|---|---|
| `g3-y3-context-audit.mjs` ... `g3-y6-context-audit.mjs` | Practice context reachability + smoke per year |
| `g4-all-assessments-audit.mjs` | Combined assessment migration/static checks |
| `g4-golden-path.mjs` | Profile/scoring golden-path verification |
| `g5-widget-inventory-audit.mjs` | Phase 5 slice gate checks |
| `g5-all-practice-widget-smoke.mjs` | All practice pages smoke + best-effort widget interaction coverage |

## Report location

Store reports in:

- `Maths_Command_Station/Improvement_Infrastructure/check-reports/`

If folder does not exist, create it before writing report.

## Suggested result classification

- `PASS`: command exits 0 and no hard failures in summary
- `FAIL`: non-zero exit or explicit hard failure summary
- `SKIPPED`: command unavailable in current repo state or tool missing

## Common known error signatures to call out explicitly

- `DOMTokenList ... contains HTML space characters`
- `shadowOpacity is not a function`
- `MathLive ... Unexpected format "value"`

When present, include:
1. impacted page/script,
2. first observed line,
3. probable component ownership (widget/module),
4. one recommended next debugging step.


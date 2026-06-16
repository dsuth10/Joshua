---
name: maths-command-station-check
description: Run a full Maths Command Station health check across migration gates and browser smoke audits, then write a detailed timestamped findings report. Use when the user asks to run checks, audits, smoke tests, gate validation, or project health status for Maths Command Station.
disable-model-invocation: true
---

# Maths Command Station Check

Runs a full project check and produces a detailed markdown report of findings.

## When to use

Use this skill when the user asks for:

- "run a full check"
- gate/audit validation (G3/G4/G5)
- browser smoke checks across practice pages
- a quality/status report of current migration progress

## Required output behavior

Always produce a report file in:

- `Maths_Command_Station/Improvement_Infrastructure/check-reports/`

File name format:

- `mcs-check-YYYY-MM-DD-HHMM.md` (24h time)

The report must include:

1. command-by-command PASS/FAIL
2. key error lines (trimmed, no giant dumps)
3. widget coverage summary from all-practice smoke audit
4. gate status interpretation (G3/G4/G5)
5. recommended next actions (prioritized)

## Full check workflow

Copy this checklist and execute in order:

```md
Maths Command Station Full Check
- [ ] 1. Run static/practice context audits (G3 scripts)
- [ ] 2. Run assessment audits (G4 scripts)
- [ ] 3. Run golden-path assessment profile check
- [ ] 4. Run Phase 5 widget inventory audit
- [ ] 5. Run all-practice widget smoke+interaction audit
- [ ] 6. Summarize results into timestamped report file
- [ ] 7. Provide short user-facing verdict + next fixes
```

## Command set

Run these from workspace root unless told otherwise:

```bash
node Maths_Command_Station/scripts/g3-y3-context-audit.mjs
node Maths_Command_Station/scripts/g3-y4-context-audit.mjs
node Maths_Command_Station/scripts/g3-y5-context-audit.mjs
node Maths_Command_Station/scripts/g3-y6-context-audit.mjs

node Maths_Command_Station/scripts/g4-all-assessments-audit.mjs
node Maths_Command_Station/scripts/g4-golden-path.mjs

node Maths_Command_Station/scripts/g5-widget-inventory-audit.mjs
node Maths_Command_Station/scripts/g5-all-practice-widget-smoke.mjs
```

If a command is missing in this repo state, record it as `SKIPPED` with reason.

## Report template

Use this structure in the report file:

```markdown
# Maths Command Station Full Check — <timestamp>

## Environment
- Workspace: `...`
- Branch: `...`
- Trigger: <user request>

## Command Results
| Command | Result | Key notes |
|---|---|---|
| `...` | PASS/FAIL/SKIPPED | ... |

## Browser Smoke Highlights
- Pages with console/page errors:
- Pages with interaction failures:
- Widget coverage summary:
  - Covered:
  - Not covered:
  - Failed interaction:

## Gate Interpretation
- G3:
- G4:
- G5:

## Risks / Regressions Observed
- <bullet list with concrete error signatures>

## Recommended Next Actions (priority order)
1. ...
2. ...
3. ...

## Appendix (trimmed)
### Notable error excerpts
```text
...
```
```

## Quality rules

- Keep report concise but specific; prefer exact command output snippets over paraphrase.
- Do not paste huge logs; include only the lines needed for diagnosis.
- If a check fails, include one likely root cause hypothesis and one concrete next fix.
- If everything passes, still include residual risks (for example manual family G5 run pending).

## Additional reference

For gate context and expected statuses, use:

- [Maths_Command_Station/Improvement_Infrastructure/07-Roadmap-and-Migration.md](../../../Maths_Command_Station/Improvement_Infrastructure/07-Roadmap-and-Migration.md)
- [reference.md](reference.md)


## Learned User Preferences

- For Maths Command Station phased work, directs slice-by-slice implementation and expects a check-in after each slice before continuing.
- References `Maths_Command_Station/Improvement_Infrastructure/` and phase migration READMEs (`phase3-practice-migration/`, `phase4-assessment-migration/`, `phase5-prep-y2-buildout/`) as authoritative program context.
- Prefers audit scripts plus gap generators as Slice 0 before widget migration — a measurable PASS/FAIL gate first.
- Prioritizes P1 gap generators first (fastest badge coverage), then P2, using the legacy-keep canonical package pattern.
- Asks "what should we do next?" for roadmap decisions; uses "Proceed" or "Implement Slice N" to execute the recommended step.

## Learned Workspace Facts

- Joshua workspace centers on `Maths_Command_Station/` — a widget-engine migration for Australian Curriculum maths practice and assessment pages.
- Migration program is documented in `Maths_Command_Station/Improvement_Infrastructure/`; **Phase 3 complete — Gate G3 passed 2026-06-13** (Y3–Y6 practice files on engine).
- **Phase 4 (2026-06-13):** **Gate G4 PASS** — `g4-all-assessments-audit.mjs` + `g4-golden-path.mjs`; evidence `g4-golden-path-evidence/`. Y3 golden-path 29/30 (fraction pin manual SS2). 4c Slice 4: Y4 `number-line` `read-point`.
- G4 scripts: `g4-y3`–`g4-y6`, `g4-all-assessments-audit.mjs`, `g4-golden-path.mjs`.
- **Phase 5 (2026-06-13):** Slices 5.0–5.4 — `MCS.speech`, `counters` (3 modes), `ten-frame` (3 modes), `number-pad`, `prep-practice` F1–F5. **Slice 5.5 (2026-06-14):** `sorting-table` `sequence-lane`, F8. **Slice 5.6 (2026-06-14):** `pattern-blocks` `continue-pattern`, F6. Audit: `g5-widget-inventory-audit.mjs`.
- Prep contexts frozen: `free-count-docking`, `ten-frame-subitise`, `compare-zones-more-fewer`, `ten-frame-fill-five`, `ten-frame-fill-ten`, `ten-frame-make-ten`, `make-equal-groups-share`, `sequence-lane-mission-day`, `continue-pattern-ab-blocks`.
- Phase 3 build order: Y5 (3a) → Y6 (3b) → Y4 (3c) → Y3 (3d); Y5 must land first because it creates shared widgets reused by later years.
- Per-year G3 context audit scripts live in `Maths_Command_Station/scripts/` (`g3-y3`, `g3-y4`, `g3-y5`, `g3-y6-context-audit.mjs`) — static context reachability plus Playwright browser smoke.
- Y6 G3b signed off 2026-06-13 (48/48 contexts); Y4 G3c complete 2026-06-13 (44/44 contexts); Y5 G3a complete 2026-06-13 (51/51 contexts, browser smoke PASS).
- Y3 Phase 3d: Slices 0–5 complete — 46/46 contexts, all inline SVG helpers eliminated; Gate G3 PASSED 2026-06-13.
- Gap-generator pattern: `makeLegacyNumeric` / `makeLegacyChoice` canonical packages wired via `gapGenerators` and `pickCategoryQuestion`.
- Widget reuse rule (policy R-03): extend config/modes on existing widgets — do not fork second implementations.
- Per-file definition of done: every question canonical or `legacy-keep` tagged, single `MCS.runQuestion` load path, dead `make*Svg` sweep, context strings frozen, manual QA per `07-Roadmap-and-Migration.md` §6.
- JSXGraph board resize: use `board.updateContainerDims()` not bare `resizeContainer()` (no-arg call corrupts SVG to NaN).

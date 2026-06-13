## Learned User Preferences

- For Maths Command Station phased work, directs slice-by-slice implementation and expects a check-in after each slice before continuing.
- References `Maths_Command_Station/Improvement_Infrastructure/` and `phase3-practice-migration/` docs as authoritative program context for migration tasks.
- Prefers audit scripts plus gap generators as Slice 0 before widget migration — a measurable PASS/FAIL gate first.
- Prioritizes P1 gap generators first (fastest badge coverage), then P2, using the legacy-keep canonical package pattern.
- Asks "what should we do next?" for roadmap decisions; uses "Proceed" or "Implement Slice N" to execute the recommended step.

## Learned Workspace Facts

- Joshua workspace centers on `Maths_Command_Station/` — a widget-engine migration for Australian Curriculum maths practice and assessment pages.
- Migration program is documented in `Maths_Command_Station/Improvement_Infrastructure/`; **Phase 3 complete — Gate G3 passed 2026-06-13** (Y3–Y6 practice files on engine).
- Phase 3 build order: Y5 (3a) → Y6 (3b) → Y4 (3c) → Y3 (3d); Y5 must land first because it creates shared widgets reused by later years.
- Per-year G3 context audit scripts live in `Maths_Command_Station/scripts/` (`g3-y3`, `g3-y4`, `g3-y5`, `g3-y6-context-audit.mjs`) — static context reachability plus Playwright browser smoke.
- Y6 G3b signed off 2026-06-13 (48/48 contexts); Y4 G3c complete 2026-06-13 (44/44 contexts); Y5 G3a complete 2026-06-13 (51/51 contexts, browser smoke PASS).
- Y3 Phase 3d: Slices 0–5 complete — 46/46 contexts, all inline SVG helpers eliminated; Gate G3 PASSED 2026-06-13.
- Gap-generator pattern: `makeLegacyNumeric` / `makeLegacyChoice` canonical packages wired via `gapGenerators` and `pickCategoryQuestion`.
- Widget reuse rule (policy R-03): extend config/modes on existing widgets — do not fork second implementations.
- Per-file definition of done: every question canonical or `legacy-keep` tagged, single `MCS.runQuestion` load path, dead `make*Svg` sweep, context strings frozen, manual QA per `07-Roadmap-and-Migration.md` §6.
- JSXGraph board resize: use `board.updateContainerDims()` not bare `resizeContainer()` (no-arg call corrupts SVG to NaN).

# Year 5 Descriptor Variety Matrix

## 1. Purpose

The objective of this matrix is to shift Year 5 achievement tracking from single, narrow question types to **families of demonstrations**. A content descriptor should not equal one question type. It should encompass a small family of different demonstrations: build it, locate it, sort it, test it, explain it, debug it, and apply it.

This ensures mathematical understanding is assessed robustly across multiple cognitive dimensions, providing better evidence of mastery.

## 2. Design Principles

- **Four demonstrations per descriptor:** We aim to assess each descriptor across Symbolic, Visual/spatial, Diagnostic, and Applied/contextual forms.
- **Reuse-first widget policy:** We heavily favour extending existing widgets (adding modes/configs) over building new ones. (Rule R-03: Do not fork second implementations).
- **Existing contexts remain frozen:** Current shipped contexts are treated as legacy-keep or integrated as the "Symbolic" branch to avoid breaking local storage progress.
- **New contexts stay planned until implemented:** Proposed context strings remain in this planning document and are only added to `achievements-config.js` when the implementation slice is ready, preventing G3/G4 audit failures.

## 3. Summary Matrix

| Descriptor | Name | Priority | Core Widgets (Reuse / Extend / New) |
| :--- | :--- | :--- | :--- |
| **AC9M5N01** | Decimal Precisionist | P2 | `place-value-blocks` (Extend), `sorting-table` (Reuse), `number-line` (Reuse) |
| **AC9M5N02** | Factor Finder | P1 | `array-builder` (Extend), `sorting-table` (Reuse), `counters` (Reuse), `math-field` (Reuse) |
| **AC9M5N03** | Fraction Alignment | P1 | `fraction-bars` (Extend), `number-line` (Reuse), `sorting-table` (Reuse) |
| **AC9M5N04** | Percentage Converter | P2 | `number-track` (Extend), `fraction-bars` (Reuse), `sorting-table` (Reuse) |
| **AC9M5N05** | Fraction Operator | P2 | `fraction-bars` (Extend), `math-field` (Reuse), `sorting-table` (Reuse) |
| **AC9M5N06** | Multiplication Master | P1 | `array-builder` (Extend), `sorting-table` (Reuse), `math-field` (Reuse) |
| **AC9M5N07** | Remainder Ruler | P2 | `counters` (Reuse), `number-line` (Reuse), `math-field` (Reuse) |
| **AC9M5N08** | Reasonableness Referee | P3 | `number-line` (Reuse), `sorting-table` (Reuse) |
| **AC9M5N09** | Scenario Modeller | P3 | `fraction-bars` (Extend), `sorting-table` (Reuse) |
| **AC9M5N10** | Divisibility Programmer | P3 | `sorting-table` (Reuse), `number-track` (Reuse) |
| **AC9M5A01** | Fact Family Finder | P2 | `array-builder` (Extend), `balance-scale` (Extend), `sorting-table` (Reuse) |
| **AC9M5A02** | Equation Architect | P1 | `balance-scale` (Extend), `math-field` (Reuse) |
| **AC9M5M01** | Unit Specialist | P3 | `sorting-table` (Reuse), `number-line` (Reuse) |
| **AC9M5M02** | Precision Builder | P1 | `shape-measurer` (Extend), `math-field` (Reuse) |
| **AC9M5M03** | Time Navigator | P2 | `analog-clock` (Extend), `number-line` (Reuse), `sorting-table` (Reuse) |
| **AC9M5M04** | Degree Inspector | P1 | `protractor` (Extend), `shape-builder` (Reuse) |
| **AC9M5SP01** | Net Folding Expert | P2 | `net-folder` (Extend), `sorting-table` (Reuse) |
| **AC9M5SP02** | Coordinate Officer | P1 | `coordinate-plotter` (Extend), `math-field` (Reuse) |
| **AC9M5SP03** | Vector Driver | P1 | `transform-board` (Extend), `coordinate-plotter` (Reuse) |
| **AC9M5ST01** | Spreadsheet Auditor | P1 | `column-graph` (Extend), `sorting-table` (Reuse) |
| **AC9M5ST02** | Line Graph Analyst | P1 | `line-graph` (Extend), `sorting-table` (Reuse) |
| **AC9M5ST03** | Research Director | P3 | `sorting-table` (Reuse), `column-graph` (Reuse) |
| **AC9M5P01** | Sample Space Cadet | P1 | `marble-bag` (Extend), `sorting-table` (Reuse) |
| **AC9M5P02** | Predictive Planner | P1 | `spinner` (Extend), `dice-coin-lab` (Reuse) |

## 4. Detailed Descriptor Plans

### AC9M5N01 — Decimal Precisionist
*Current shipped interaction:* String sorting and 1D plots.
*Current badge contexts:* `decimal-sorting`, `number-line-plots`
*Missing demonstrations:* Constructive magnitude comparison, diagnosing order errors.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Order decimals to 3 places | `math-field` / select (Reuse) | *existing contexts* |
| Visual/spatial | Build decimal magnitude with blocks | `place-value-blocks` (Extend) | `decimal-magnitude-build` |
| Diagnostic | Fix an incorrectly ordered decimal list | `sorting-table` (Reuse) | `decimal-diagnostic-sort` |
| Applied/contextual | Plot race times on a timeline | `number-line` (Reuse) | `decimal-race-times` |

### AC9M5N02 — Factor Finder
*Current shipped interaction:* Numeric array generators (text inputs).
*Current badge contexts:* `factor-checking`, `factor-listing`
*Missing demonstrations:* Visualizing factors as dimensions, divisibility as grouping, diagnosing list errors.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | List all factors of 48 | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Build 48 as a 6 × 8 array | `array-builder` (Extend) | `factor-array-build` |
| Diagnostic | Fix an incorrect factor list | `sorting-table` (Reuse) | `factor-list-debug` |
| Applied/contextual | Share 42 cells equally into 6 groups | `counters` (Reuse) | `divisibility-grouping` |

### AC9M5N03 — Fraction Alignment
*Current shipped interaction:* Text and static number line.
*Current badge contexts:* `mixed-numeral-lines`, `common-denominators`
*Missing demonstrations:* Interactive fraction bar construction, visual scaling.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Convert and compare mixed numerals | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Build mixed numeral equivalence | `fraction-bars` (Extend) | `mixed-fraction-bar-build` |
| Diagnostic | Identify incorrect common denominator scaling | `sorting-table` (Reuse) | `fraction-scale-debug` |
| Applied/contextual | Locate mixed amounts in recipes | `number-line` (Reuse) | `mixed-fraction-timeline` |

### AC9M5N04 — Percentage Converter
*Current shipped interaction:* Text entry / selects.
*Current badge contexts:* `fraction-to-percent`, `decimal-to-percent`, `percent-to-fraction`
*Missing demonstrations:* Visualizing 100-parts, equivalent shade matching.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Convert 3/4 to 75% | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Shade 40% on a 10x10 grid | `number-track` (Extend) | `percent-grid-shade` |
| Diagnostic | Match equivalent fractions, decimals, % | `sorting-table` (Reuse) | `percent-equivalence-sort` |
| Applied/contextual | Calculate discount percentages | `fraction-bars` (Reuse) | `discount-percent-bars` |

### AC9M5N05 — Fraction Operator
*Current shipped interaction:* Text and basic shade selection.
*Current badge contexts:* `fraction-bar-addition`, `fractional-sums`
*Missing demonstrations:* Constructive addition (drag to combine), equivalent fraction swaps.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Add fractions with related denominators | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Drag fractional pieces to sum | `fraction-bars` (Extend) | `fraction-sum-builder` |
| Diagnostic | Fix an incorrect addition (e.g. adding denominators) | `sorting-table` (Reuse) | `fraction-addition-debug` |
| Applied/contextual | Combine fractional lengths of pipe | `number-line` (Reuse) | `fraction-pipe-length` |

### AC9M5N06 — Multiplication Master
*Current shipped interaction:* Text input for multi-digit grids.
*Current badge contexts:* `multiplication-grid`, `multiplication-algorithm`
*Missing demonstrations:* Area model construction, fixing algorithm errors.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Solve multi-digit algorithms | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Construct a partitioned area model | `array-builder` (Extend) | `area-model-build` |
| Diagnostic | Tap the error in a worked algorithm | `sorting-table` (Reuse) | `diagnostic-algorithm-fix` |
| Applied/contextual | Calculate grid layout areas | `array-builder` (Reuse) | `applied-multiplication-area` |

### AC9M5N07 — Remainder Ruler
*Current shipped interaction:* Text input division.
*Current badge contexts:* `remainder-algorithms`, `remainder-decimal-forms`
*Missing demonstrations:* Physical grouping with leftovers, interpreting remainder in context.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Calculate division with remainder | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Share items and isolate the remainder | `counters` (Reuse) | `division-grouping-remainders` |
| Diagnostic | Decide if remainder should be rounded up or down | `sorting-table` (Reuse) | `remainder-interpretation` |
| Applied/contextual | How many buses needed for 45 students (10 per bus)? | `counters` (Reuse) | `remainder-contextual-bus` |

### AC9M5N08 — Reasonableness Referee
*Current shipped interaction:* Text select.
*Current badge contexts:* `rounding-checks`, `budget-estimation`
*Missing demonstrations:* Visual bounding, drag-and-drop estimation ranges.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Check if calculation is reasonable | Select (Reuse) | *existing contexts* |
| Visual/spatial | Place bounds on a number line | `number-line` (Reuse) | `estimate-number-line-bounds` |
| Diagnostic | Sort estimations into reasonable / unreasonable | `sorting-table` (Reuse) | `budget-sort-reasonable` |
| Applied/contextual | Estimate total cost of a shopping cart | `math-field` (Reuse) | `applied-cart-estimate` |

### AC9M5N09 — Scenario Modeller
*Current shipped interaction:* Text and select.
*Current badge contexts:* `additive-word-scenarios`, `multiplicative-word-scenarios`
*Missing demonstrations:* Diagramming the word problem before calculating.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Solve multi-step word problems | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Construct a bar model of the problem | `fraction-bars` (Extend) | `word-problem-bar-model` |
| Diagnostic | Match a scenario to its equation | `sorting-table` (Reuse) | `scenario-equation-match` |
| Applied/contextual | (Inherently contextual word problems) | `math-field` (Reuse) | *existing contexts* |

### AC9M5N10 — Divisibility Programmer
*Current shipped interaction:* Select logic flow.
*Current badge contexts:* `flowchart-loops`, `divisor-checkers`
*Missing demonstrations:* Tracing algorithms step-by-step visually, sorting rules.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Run flowchart logic for divisibility | Select (Reuse) | *existing contexts* |
| Visual/spatial | Shade multiples satisfying two rules on a track | `number-track` (Reuse) | `divisibility-track-rules` |
| Diagnostic | Sort numbers by passing/failing a flowchart | `sorting-table` (Reuse) | `flowchart-rule-sort` |
| Applied/contextual | Route cargo using divisibility rules | `sorting-table` (Extend) | `applied-cargo-routing` |

### AC9M5A01 — Fact Family Finder
*Current shipped interaction:* Text input.
*Current badge contexts:* `fact-families-multiplication`, `fact-families-division`
*Missing demonstrations:* Array transformation to show commutativity.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Complete a fact family | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Rotate an array to see 4x3 = 3x4 | `array-builder` (Extend) | `fact-family-array-rotate` |
| Diagnostic | Find the incorrect equation in a family | `sorting-table` (Reuse) | `fact-family-debug` |
| Applied/contextual | Balance equations representing equal groups | `balance-scale` (Extend) | `fact-family-balance` |

### AC9M5A02 — Equation Architect
*Current shipped interaction:* `unknown-multiplication`, `unknown-division` using `math-field`.
*Current badge contexts:* `unknown-multiplication`, `unknown-division`
*Missing demonstrations:* Visual equality model, balance as inverse reasoning.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Solve for unknown in 5 × ? = 45 | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Build a balanced scale model | `balance-scale` (Extend) | `balance-scale-unknowns` |
| Diagnostic | Identify why an equation is unbalanced | `sorting-table` (Reuse) | `equation-balance-debug` |
| Applied/contextual | Find unknown mass in a physical context | `balance-scale` (Reuse) | `applied-unknown-mass` |

### AC9M5M01 — Unit Specialist
*Current shipped interaction:* Select.
*Current badge contexts:* `unit-matching`, `unit-comparison`
*Missing demonstrations:* Constructive length conversion on a timeline/ruler.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Select correct metric units | Select (Reuse) | *existing contexts* |
| Visual/spatial | Align equivalent lengths on dual rulers | `number-line` (Extend) | `unit-equivalence-ruler` |
| Diagnostic | Sort objects by most appropriate unit | `sorting-table` (Reuse) | `sort-objects-by-unit` |
| Applied/contextual | Convert units for a building project | `math-field` (Reuse) | `applied-unit-conversion` |

### AC9M5M02 — Precision Builder
*Current shipped interaction:* `irregular-perimeter` and `irregular-area` shipped to `shape-measurer`.
*Current badge contexts:* `irregular-perimeter`, `irregular-area`
*Missing demonstrations:* Decomposing shapes, target area building, comparing same area/different perimeter.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Calculate area of compound shape | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Decompose a shape into rectangles | `shape-measurer` (Extend) | `compound-shape-decompose` |
| Diagnostic | Find missing side before finding perimeter | `shape-measurer` (Reuse) | `missing-side-before-perimeter` |
| Applied/contextual | Build a compound shape with area 24 | `shape-measurer` (Extend) | `build-compound-target-area` |

### AC9M5M03 — Time Navigator
*Current shipped interaction:* Text input.
*Current badge contexts:* `time-conversion-12-to-24`, `time-conversion-24-to-12`
*Missing demonstrations:* Manipulating dual analog/digital faces, timeline sequencing.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Convert 12h to 24h | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Set hands and digital 24h simultaneously | `analog-clock` (Extend) | `clock-set-24h` |
| Diagnostic | Sort times chronologically across 12/24h formats | `sorting-table` (Reuse) | `time-chronological-sort` |
| Applied/contextual | Calculate elapsed flight time | `analog-clock` (Reuse) | `applied-elapsed-time` |

### AC9M5M04 — Degree Inspector
*Current shipped interaction:* Radio selects, static images.
*Current badge contexts:* `angle-estimation`, `angle-protractor-reads`
*Missing demonstrations:* Interactive protractor placement and constructive angle building.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Estimate angle degree | Select (Reuse) | *existing contexts* |
| Visual/spatial | Drag and place a protractor to measure | `protractor` (Extend) | `protractor-measure-interactive` |
| Diagnostic | Fix an incorrectly placed protractor | `protractor` (Extend) | `protractor-placement-debug` |
| Applied/contextual | Construct an angle for a ramp | `protractor` (Extend) | `protractor-construct-angle` |

### AC9M5SP01 — Net Folding Expert
*Current shipped interaction:* Matching.
*Current badge contexts:* `net-folding`, `3d-structure-maps`
*Missing demonstrations:* Interactively counting faces on nets vs wireframes.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Match 3D object to its net | Select (Reuse) | *existing contexts* |
| Visual/spatial | Count faces, edges, vertices on wireframe | `net-folder` (Extend) | `net-face-count` |
| Diagnostic | Identify which net will *not* fold correctly | `sorting-table` (Reuse) | `net-fold-verification` |
| Applied/contextual | Design a box packaging net | `net-folder` (Extend) | `applied-packaging-net` |

### AC9M5SP02 — Coordinate Officer
*Current shipped interaction:* `read-coordinate`, `movement`, `distance-manhattan` through `coordinate-plotter`.
*Current badge contexts:* `read-coordinate`, `distance-manhattan`
*Missing demonstrations:* Student-generated paths, plotted routes, error correction, describing movement.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Read coordinate pairs | `coordinate-plotter` (Reuse) | *existing contexts* |
| Visual/spatial | Plot a specific sequence of coordinates | `coordinate-plotter` (Extend) | `plot-coordinate-points` |
| Diagnostic | Debug an incorrect path on a grid | `coordinate-plotter` (Extend) | `debug-coordinate-path` |
| Applied/contextual | Trace manhattan path to delivery zones | `coordinate-plotter` (Extend) | `trace-manhattan-path` |

### AC9M5SP03 — Vector Driver
*Current shipped interaction:* Static clicks.
*Current badge contexts:* `vector-transformations`, `vector-reflection`
*Missing demonstrations:* Dragging to translate, reflecting across draggable mirror lines.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Identify the type of transformation | Select (Reuse) | *existing contexts* |
| Visual/spatial | Drag shape to translate by vector | `transform-board` (Extend) | `transform-translate-drag` |
| Diagnostic | Position the mirror line between reflections | `transform-board` (Extend) | `transform-reflect-drag` |
| Applied/contextual | Rotate shape 90° to fit in a puzzle | `transform-board` (Reuse) | `applied-rotation-fit` |

### AC9M5ST01 — Spreadsheet Auditor
*Current shipped interaction:* Select.
*Current badge contexts:* `mode-highlight`, `highest-frequency-charts`
*Missing demonstrations:* Construction, validation, and interpretation.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Find the mode from a table | Select (Reuse) | *existing contexts* |
| Visual/spatial | Build column graph from data table | `column-graph` (Extend) | `build-column-graph-from-table` |
| Diagnostic | Detect data entry error between table and chart | `sorting-table` (Reuse) | `detect-data-entry-error` |
| Applied/contextual | Choose best display for categorical data | `sorting-table` (Reuse) | `choose-best-display` |

### AC9M5ST02 — Line Graph Analyst
*Current shipped interaction:* Select.
*Current badge contexts:* `read-value`, `max-min`, `biggest-increase`
*Missing demonstrations:* Plotting line graph points, interacting with slope segments.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Read max/min from graph | Select (Reuse) | *existing contexts* |
| Visual/spatial | Plot points for a line graph | `line-graph` (Extend) | `plot-line-graph-points` |
| Diagnostic | Identify the trend segment (steepest/flat) | `line-graph` (Extend) | `identify-trend-segment` |
| Applied/contextual | Interpret a temperature over time graph | `math-field` (Reuse) | `applied-temp-graph` |

### AC9M5ST03 — Research Director
*Current shipped interaction:* Select.
*Current badge contexts:* `data-display`, `investigation-planner`
*Missing demonstrations:* Categorising survey methods, sorting appropriate questions.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | Select best survey method | Select (Reuse) | *existing contexts* |
| Visual/spatial | Organize collected categorical data | `sorting-table` (Reuse) | `organize-categorical-data` |
| Diagnostic | Sort survey questions by appropriateness | `sorting-table` (Reuse) | `sort-survey-questions` |
| Applied/contextual | Plan data collection for a class vote | `sorting-table` (Reuse) | `plan-class-vote` |

### AC9M5P01 — Sample Space Cadet
*Current shipped interaction:* Text and select.
*Current badge contexts:* `die-outcomes`, `marble-likelihood`, `chance-fraction`
*Missing demonstrations:* Constructing probability environments.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | State chance fraction of drawing red | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Build marble bag to match likelihoods | `marble-bag` (Extend) | `build-marble-likelihood` |
| Diagnostic | Identify why a statement about chance is false | `sorting-table` (Reuse) | `debug-chance-statement` |
| Applied/contextual | Ensure a game is fair using sample space | `sorting-table` (Reuse) | `fair-game-design` |

### AC9M5P02 — Predictive Planner
*Current shipped interaction:* Text.
*Current badge contexts:* `chance-experiment`, `predicted-frequency`
*Missing demonstrations:* Designing spinners to match predictions, running live trials.

| Demonstration form | Example student action | Widget/mode (Status) | New context string |
| :--- | :--- | :--- | :--- |
| Symbolic | State predicted frequency | `math-field` (Reuse) | *existing contexts* |
| Visual/spatial | Design a spinner for target probabilities | `spinner` (Extend) | `design-spinner-probabilities` |
| Diagnostic | Compare predicted vs observed results | `sorting-table` (Reuse) | `compare-predicted-observed` |
| Applied/contextual | Run live spinner experiment trials | `dice-coin-lab` / `spinner` (Reuse) | `run-spinner-experiment` |


## 5. Widget Reuse Map

To prevent unnecessary code duplication, the implementations listed above rely heavily on expanding the modes of the existing `03-Widget-Catalogue.md` widgets rather than building new ones:

* `sorting-table`: The primary workhorse for all **Diagnostic** (debug/error finding) and **Classification** demonstrations across all strands.
* `fraction-bars`: To be extended beyond static fraction parts to handle mixed numerals and equivalence comparison operations.
* `shape-measurer` & `coordinate-plotter`: Already shipped for Measurement & Space, will be leaned on for deeper constructive interactions like compound decomposition and path plotting.
* `balance-scale`: The primary vehicle for transitioning Algebra from text input to visualizing equality.
* `array-builder`: Expanded from early multiplication to Year 5 factor discovery and area models.

## 6. Priority Implementation Slices

**Slice 1: AC9M5N02 (Factor Finder)**
The strongest first implementation slice. It is currently marked legacy-keep, pedagogically narrow, but has clear reusable-widget pathways using `array-builder`, `number-track`, `sorting-table`, and `counters`.

**Slice 2: AC9M5A02 (Equation Architect)**
Transforming `find-unknown` from purely symbolic `math-field` input to a visual equality model using the `balance-scale`.

**Slice 3: AC9M5M02 (Precision Builder)**
Extending the already-shipped `shape-measurer` to cover decomposition and missing-sides-first logic.

## 7. Verification Notes

> **Future Audit Rule:** Check that proposed new context strings are either marked `planned` or emitted by a generator before adding them to `achievements-config.js`.

The current G3/G4 audit scripts check configured contexts against emitted code paths. Adding badge contexts to `achievements-config.js` too early will make audits fail. 

**Protocol:** Put proposed contexts in this planning document first. Do not add them to `achievements-config.js` until their specific implementation slice code exists and passes verification.

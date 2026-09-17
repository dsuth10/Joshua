# Mix-It-Up Day maths expansion guide

## Purpose and build rule

This guide expands every maths-related challenge in `content.js` into a 24-question mission. The questions are drawn from 30-question banks and saved as named responses. A student must see the same selected instance after refresh, JSON export/import, or teacher review.

The interaction recommendations draw on the local Maths Command Station widget catalogue:

- `number-line` (N1), `fraction-bars` (N2), `number-track` (N6), and `array-builder` (N7)
- `analog-clock` (M1) and `shape-measurer` (M4)
- `coordinate-plotter` (S1) and `symmetry-painter` (S3)
- `column-graph` (D1), `spinner` (D3), and `marble-bag` (D4)
- standard numeric/text/choice inputs, with a short working field where reasoning matters

Use ordinary HTML/CSS implementations sized for this standalone project; do not import the full Command Station engine. Match the same answer contracts: values, never pixels; snapped grid/line values; and reproducible `setValue(getValue())` state. Auto-check numerical and selectable answers. Teachers approve explanations, designs, and student-created questions using the success checks below.

## 1. Snack Shop Showdown — money and multiplicative thinking

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Read a shuffled four-item snack menu and calculate the cost of one requested item for each friend. | Numeric total | Includes each required item exactly once. |
| 2 | Complete a two-column price table for 2, 3, and 4 of one menu item. | Numeric fields/table | Each multiplication fact is correct. |
| 3 | Find the total for the required order. | Numeric + optional working | Total matches the saved menu instance. |
| 4 | Calculate change from a supplied note. | Numeric | Change is `note − total`. |
| 5 | Compare a bundle deal with single-item prices. | Choice + one-sentence reason | Correct cheaper/equal choice and comparison stated. |
| 6 | Use a number line to show how the order total is built by adding item prices. | N1 `jump`, stored total | Jumps end at the correct total. |
| 7 | Choose extra items to spend closest to, without exceeding, the budget. | Quantity fields + numeric total | All limits obeyed; no closer valid total exists. |
| 8 | Write a recommendation for the group: best value and one reason. | 20–40 word text | Recommendation agrees with calculations and uses money evidence. |

Suggested variations: $15–$30 budget, four to six menu items, prices $2–$8, one or two bundle deals. Preserve cents only when all prices and change remain accessible.

## 2. Number Trick Lab — patterns, operations and number structure

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Make a target number using four supplied numbers once each. | Math expression/text | Expression evaluates to target and uses the permitted numbers once. |
| 2 | Solve a missing-factor equation. | Numeric | Factor satisfies the equation. |
| 3 | Solve a missing-addend or subtraction equation. | Numeric | Substitution verifies equality. |
| 4 | Continue a growing pattern for two terms. | Two numeric fields | Both use the generated constant difference or rule. |
| 5 | State the pattern rule. | 8–18 word text | Rule describes every step, not only the next answer. |
| 6 | Place three generated values in order. | N1 `order-points` or drag list | Values are least to greatest. |
| 7 | Shade all multiples of a generated number from 1–50. | N6 `shade-multiples` | Every and only target multiples are selected. |
| 8 | Create a new pattern with a stated rule and two later terms. | Text + numeric fields | Teacher can apply rule; later terms fit it. |

Suggested variations: targets 18–72; whole-number operations only; patterns with +/−2 to 12, and optional doubling for extension. Do not use ambiguous target puzzles—store an accepted-expression checker or provide a known unique construction.

## 3. The Great Day-Out Puzzle — time, schedules and cost

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Read the arrival and departure times. Calculate total available minutes. | Numeric | Correct elapsed duration. |
| 2 | Set a clock to the start time of the first activity. | M1 `set-time` | Hour and minute values match. |
| 3 | Complete a timetable by calculating one activity finish time. | Time input | Correct start + duration. |
| 4 | Add travel and lunch to a second timetable blank. | Time input | Correct accumulated time. |
| 5 | Select activities that fit a time limit. | Multi-select | All selected activities, movement, and lunch fit. |
| 6 | Find the cost for a selected group size. | Numeric | Correct multiplication/addition. |
| 7 | Compare a group pass with individual tickets. | Choice + numeric saving | Correct value comparison. |
| 8 | Write a complete schedule and explain one choice. | 35–60 word text/table | Ordered timetable fits the day; explanation refers to time or budget evidence. |

Suggested variations: 3–5 activities, 5–15-minute travel, 25–40-minute lunch, 10:00–15:30 day windows, five-minute time increments. The final schedule must be generated from a solvable set and should permit at least two valid solutions.

## 4. Pixel Playground — fractions, symmetry and coordinates

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Identify the fraction represented by a pre-coloured strip. | N2 `display` + fraction fields | Numerator and denominator are correct. |
| 2 | Shade a requested unit fraction. | N2 `shade` | Exact requested parts are shaded. |
| 3 | Compare two simple fractions with the same denominator. | Choice | Correct greater/less/equal relation. |
| 4 | Colour a specified fraction of a 4×4 pixel grid. | Tap grid/count | Exact colour count reached. |
| 5 | Complete the other side of a simple vertical mirror design. | S3 `complete-mirror` | Every mirrored cell is correct. |
| 6 | Mark a named cell on a letter-number grid. | S1 `alpha-grid` | Saved cell equals target. |
| 7 | Make a design with generated colour fractions and one line of symmetry. | Grid design | Counts and symmetry rule both pass. |
| 8 | Explain how the fractions and symmetry were checked. | 20–40 word text | Names a count/fraction check and a mirror check. |

Suggested variations: 4×4 default, 6×6 stretch; denominators 2, 4, 8, or 16 only; vertical symmetry first, then horizontal symmetry as extension. Never require colour counts incompatible with symmetry.

## 5. Sticker Swap — multiplication, division and fair exchange

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Calculate stickers in each person's equal packs. | Two numeric fields | Each multiplication is correct. |
| 2 | Build one person's packs as an array. | N7 `array-builder` | Rows × columns matches their pack structure. |
| 3 | Find both collections together. | Numeric | Correct sum. |
| 4 | Share the combined collection between a generated number of people. | Numeric quotient | Quotient correct. |
| 5 | State stickers left over. | Numeric remainder | Remainder correct and less than group size. |
| 6 | Test a proposed pack trade. | Choice | Compares both total values correctly. |
| 7 | Make a fair trade from a limited pack list. | Quantity fields | Both sides have equal totals. |
| 8 | Explain why fair does or does not mean the same number of packs. | 18–35 word text | Uses the value of a pack as evidence. |

Suggested variations: pack sizes 3–12, 3–8 packs, total sharing by 3–6, and trades with equal, unequal, or deliberately close values.

## 6. Mini-Golf Designer — area, perimeter and factor pairs

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Build a rectangle with a generated target area. | M4 `build-shape-with-area` or array grid | Area exactly matches target. |
| 2 | Record the rectangle's length and width. | Two numeric fields | Dimensions match the built shape. |
| 3 | Calculate its perimeter. | Numeric | `2(l + w)` matches shape. |
| 4 | Find another rectangle with the same area. | Dimensions/array | Different dimensions; same area. |
| 5 | Calculate the new perimeter. | Numeric | Matches new dimensions. |
| 6 | Choose which rectangle needs more fence. | Choice | Correctly compares perimeters. |
| 7 | Solve a missing-side rectangle problem. | M4 `missing-sides` + numeric | Missing side and calculated measure correct. |
| 8 | Explain why equal area can have different perimeter. | 20–45 word text | References the two designs and their measurements. |

Suggested variations: areas 12, 16, 18, 20, 24, 30, or 36 only. These guarantee multiple factor-pair designs. Keep grids at least 6×6 or give a scroll-free larger board when required.

## 7. Mystery Number — place value, factors and divisibility

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Read digit clues and name the mystery number. | Numeric | Fits every clue. |
| 2 | Show the number with tens and ones blocks. | N5 `build` | Widget total matches mystery number. |
| 3 | Place it on a labelled number line. | N1 `place-point` | Pin snaps to number. |
| 4 | Identify whether it is odd or even. | Choice | Correct parity. |
| 5 | Select its factor pairs from a list. | Multi-select or N7 arrays | Every selected pair multiplies to the number; none omitted from supplied list. |
| 6 | Shade its multiples or identify it as a multiple of a generated small number. | N6 / choice | Correct divisibility selection. |
| 7 | Compare it with a nearby number using `>`, `<`, or `=`. | Choice | Correct relation. |
| 8 | Write a new clue set with exactly one answer and state that answer. | 25–50 word text + numeric | Teacher can solve to the student's stated single number. |

Suggested variations: two-digit composite numbers 24–96 that have at least two factor pairs; one clue at a time narrows the candidate set. Avoid relying on a divisibility rule the student has not been taught—show lists or arrays as support.

## 8. Would You Rather? Prove It! — rates, comparison and argument

| # | Question | Answer form | Teacher success check |
|---|---|---|---|
| 1 | Calculate how many packs of Deal A are needed to meet a target. | Numeric | Rounds up correctly where needed. |
| 2 | Calculate Deal A's total items and cost. | Two numeric fields | Both values correct. |
| 3 | Repeat for Deal B. | Two numeric fields | Both values correct. |
| 4 | Put both offers in a comparison table. | Table fields | Table agrees with calculations. |
| 5 | Decide which deal is cheaper for the target. | Choice | Correct cost comparison. |
| 6 | Decide which gives fewer extras/waste. | Choice | Correct item comparison. |
| 7 | Place total costs on a money number line. | N1 `place-point` | Both points correct. |
| 8 | Give a recommendation that considers cost and extras. | 25–45 word text | Conclusion follows the evidence; accepts either deal when justified by stated priority. |

Suggested variations: target quantities 18–48, pack sizes 3–10, prices $3–$10. Ensure a mix of clear winners, same-cost choices, and trade-offs; do not present a choice as single-answer if different priorities make both defensible.

## Shared build and review checklist

1. Each challenge displays all 24 questions as numbered cards with a small progress count.
2. Generate once per student/challenge; save `instanceSeed` plus all generated numbers and choices in the student JSON.
3. A checked answer should show gentle, specific feedback and permit revision. Explanations and creative outputs remain teacher-reviewed.
4. Ready-for-teacher requires all auto-checkable questions correct and all required written/design responses non-empty. It should not reject a reasonable explanation merely by word count.
5. Teacher review shows the exact generated question, student response, auto-check result, working, and the success check from this guide.
6. Use a shuffled deck or session fingerprints for variation banks so a student does not meet an identical instance twice in a festival session.

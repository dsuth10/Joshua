# 06 — UX, Accessibility & Age-Band Interaction Design

Design rules every widget must obey, organised by the three age bands. These rules are *part of the widget contract* — `config.band` selects them automatically; question authors never hand-tune sizes.

---

## 1. The Three Bands

| Band | Years | Ages | Developmental reality the design must respect |
|------|-------|------|-----------------------------------------------|
| **A** | Prep–Y1 | 5–6 | Emerging readers (assume **none**); gross motor control (imprecise drags, accidental multi-touch); short working memory; need immediate cause-and-effect feedback; tap-and-drag only |
| **B** | Y2–Y3 | 7–8 | Reading short sentences; finer motor control but still imprecise; can type small numbers; understand 2-step instructions |
| **C** | Y4–Y6 | 9–12 | Fluent readers; near-adult pointer precision; multi-step reasoning; motivated by mastery/efficiency, allergic to "babyish" presentation |

The same widget must *feel* different per band — bigger and friendlier at A, denser and more precise at C — while sharing one codebase.

---

## 2. Sizing & Layout Rules

| Property | Band A | Band B | Band C |
|----------|--------|--------|--------|
| Minimum touch/drag target | **64 px** | 48 px | 40 px |
| Draggable object visual size | ≥ 56 px | ≥ 40 px | ≥ 28 px |
| Widget canvas max objects on screen | ~12 | ~25 | ~50 |
| Text in widgets | numerals + icons only | short labels, ≤ 5 words | full labels |
| Font size inside widgets | 24 px+ | 18 px+ | 14 px+ (JetBrains Mono data labels) |
| Snap radius (as fraction of grid step) | 0.5 (generous) | 0.35 | 0.25 |

Implementation: `mcs-core.js` exposes `MCS.band(bandId)` returning this table as tokens; every widget factory reads it. One source of truth, no per-widget magic numbers.

---

## 3. Drag-and-Drop Behaviour Standard

The difference between a delightful manipulative and a frustrating one is entirely in these details:

1. **Pick-up affordance:** object scales to 1.1× and lifts (shadow) on `pointerdown`; cursor/finger offset preserved so the object never "jumps" under the finger.
2. **Generous hit areas:** the hit region extends beyond the visual (Konva `hitStrokeWidth` / transparent halo), per band table above.
3. **Snap with feedback:** on release inside a snap radius → tween to the snap point (~120 ms ease-out) + soft `'snap'` sound. Outside any valid zone → tween back to origin (never delete, never leave floating).
4. **No fail-by-pixel:** if a release is ambiguous between two snap targets, choose the nearest; widgets must make "almost right" impossible (the *answer* can be wrong, but the *placement* is always clean).
5. **Multi-touch guard (Band A):** ignore second simultaneous pointers on the same stage; little hands rest on screens.
6. **Drag vs scroll:** widget stages call `preventDefault` on touchmove within the canvas; the page never scrolls mid-drag, and stages are never taller than the viewport on tablets.
7. **Undo affordance:** Band A/B widgets show a single "reset" button (rotating-arrow icon) that tweens everything back to start — children should explore without fear.

---

## 4. Feedback & Reward Language

Consistent with the existing Command Station gamification (points, streaks, badges, log lines) — widgets add the *moment-to-moment* layer:

| Event | Visual | Audio (via page's registered `playSound`) | Band notes |
|-------|--------|-------------------------------------------|------------|
| Valid drop / snap | brief glow ring at snap point | soft click | All |
| `flagCorrect()` | green pulse + small particle burst on the answer object; widget objects do a 300 ms "happy bounce" in Band A | existing success sound | Band C: subtler — pulse only |
| `flagIncorrect()` | gentle horizontal shake of the *answer object only* (never the whole screen); incorrect element outlined amber, **not** flooded red | existing error sound, low volume | Band A: pair with the hint system immediately (no silent failure) |
| `showSolution(v)` | the widget *performs* the correct answer over ~800 ms (hands sweep to 3:45; pin glides to ¾; vertices flow to the reflection) | none | All — this is the biggest pedagogical upgrade of the plan |
| Streak milestones | unchanged (page-level) | unchanged | |

**Tone rule:** errors are "not yet" moments. No buzzers, no red full-screen flashes, no losing previously-placed work.

---

## 5. Audio Prompts (Band A necessity, Band B nicety)

Pre-readers cannot use a question they cannot read. Plan:

- Every Band A question carries `promptAudio` — a short recorded/synthesised instruction ("Drag **four** satellites into the docking bay").
- **Implementation options:**
  - **Recommended: Web Speech API (`speechSynthesis`)** — zero assets, offline-capable in modern OS voices, free. Quality varies by machine but is acceptable for short prompts; no licensing or storage cost.
  - Alternative: pre-recorded MP3s — better quality and consistency, but a recording pipeline + ~100s of assets to manage. Defer unless speech synthesis proves unacceptable in family testing.
- UI: a large speaker button beside the prompt, auto-played once on question load (with a settings toggle), replayable infinitely. Numerals in prompts are *also shown* large alongside (always pair audio with visual).
- All audio remains optional decoration: every question is solvable from the visual state alone (deaf/hard-of-hearing users; muted devices).

---

## 6. Page Chrome Adjustments for Band A pages (Prep–Y1, new build)

The current three-panel terminal layout assumes a reader. Band A pages adapt it rather than abandon it (brand consistency for a child growing through the app):

- Left panel collapses to: avatar, level bar, last 3 badges (icons only). The timestamped system log is hidden (meaningless to a 5-year-old) behind a "console" toggle for the supervising adult.
- Centre workspace gets the reclaimed width; widget canvas is the hero, prompt bar above it with the speaker button.
- Strand tabs become icon tiles (🚀 numbers, 🧩 patterns, ⚖️ measuring, 🗺️ shapes & position, 📊 sorting) with colour coding from `STRAND_THEMES`.
- Buttons: max two on screen ("Check" and "Reset"); "Check" is disabled until the widget reports a non-empty state via `onChange` (prevents accidental attempts burning the 2-attempt allowance).

---

## 7. Accessibility Requirements (all bands)

| Area | Requirement |
|------|-------------|
| **Keyboard operation** | Every drag interaction has a keyboard path: Tab focuses draggable objects, arrow keys move by one snap step, Enter drops. JSXGraph points support this via small first-party key handlers; Konva objects get a roving tabindex proxy list. (Also the testing hook.) |
| **Screen readers** | Widget container carries `role="application"` with an `aria-label` describing the task; on every state change, an `aria-live="polite"` region announces it ("Pin placed at three quarters"). MathLive provides MathML natively. |
| **Colour independence** | No answer is encoded by colour alone — marbles get patterns/letters, graph columns get labels, correct/incorrect pair colour with icons (✓/!). Palette respects the existing high-contrast DESIGN.md tokens; verify 4.5:1 for all widget text. |
| **Reduced motion** | `prefers-reduced-motion` → tweens become instant state changes; particle bursts off. Centralised in the engine's tween helper, free for every widget. |
| **Target sizes** | Band tables in §2 meet/exceed WCAG 2.2 AAA (44 px) for A/B, AA for C. |
| **Focus visibility** | Engine-wide focus ring token (3 px accent outline) on widget objects, not just DOM controls. |

---

## 8. "Not Babyish" Guarantee for Band C

The risk of a shared widget set is Year 6 students feeling they've been handed a toddler toy. Counter-measures baked into specs:

- Band C strips decorative sprites: pins not rockets, dots not satellites, no bounce animations, denser grids, mono-font numeric labels — closer to a "real instrument console" which *is* the brand.
- Precision features only Band C gets: 1-minute clock snapping, 1° protractor reading, half-unit coordinates, reflex angles, four quadrants, negative scales.
- Speed affordances: hardware keyboard entry everywhere, Enter-to-submit, arrow-key nudging of dragged objects.
- Reward language stays "mission/system" themed (calibration complete, telemetry locked) rather than balloons and confetti — reserving the existing confetti for badge unlocks as today.

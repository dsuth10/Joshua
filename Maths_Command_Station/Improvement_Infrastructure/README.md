# Improvement Infrastructure — Interactive Graphics Upgrade Plan

**Project:** Maths Command Station
**Scope:** Replace hand-rolled inline-SVG question graphics with a shared, library-backed interactive widget engine covering **Prep (age 5) → Year 6 (age 12)**, using only free, open-source resources.
**Status:** Planning — no implementation has begun.

---

## Executive Summary

Maths Command Station currently builds every interactive graphic (coordinate grids, clocks, number lines, charts, protractors, marble bags…) as **inline SVG template strings duplicated inside each year's JS file**. This works, but it caps quality: widgets are mostly static displays with text inputs beside them, drag interactions exist in only two places (Year 3 assessment clock and fraction plotter), nothing is reusable, and there is no foundation for the manipulative-heavy lower grades (Prep–Year 2) that are still "Coming Soon."

This plan establishes a **three-layer interactive engine**, all MIT/LGPL licensed, all vendored locally (no CDN, no build step, no accounts, no fees):

| Layer | Library | Role |
|-------|---------|------|
| **Mathematical canvas** | [JSXGraph](https://jsxgraph.org) | Coordinate planes, number lines, function/line graphs, draggable geometry, angles, transformations — anything with axes or mathematical coordinates |
| **Manipulatives canvas** | [Konva](https://konvajs.org) | Free-form drag-and-drop objects — counters, ten-frames, clocks with draggable hands, protractors, rulers, fraction tiles, pattern blocks, balance scales |
| **Maths input** | [MathLive](https://cortexjs.io/mathlive/) | Proper fraction / equation / exponent answer entry with an age-tuned on-screen maths keyboard, replacing fragile plain text boxes |

On top of these sits a **shared widget module (`mcs-widgets`)** with one consistent JavaScript API, so every year page — and every future Prep–Year 2 page — composes questions from the same tested components instead of re-implementing SVG strings.

---

## Document Map

Read in order for the full picture; each document stands alone for reference.

| # | Document | Contents |
|---|----------|----------|
| 01 | [`01-Library-Selection.md`](01-Library-Selection.md) | Options analysis, licensing verification, rejected alternatives, final recommendation |
| 02 | [`02-Architecture.md`](02-Architecture.md) | Vendoring strategy, directory layout, the `mcs-widgets` namespace, the unified Question Package API, adapters for existing Year 3–6 code, theming, persistence integration |
| 03 | [`03-Widget-Catalogue.md`](03-Widget-Catalogue.md) | Full specification of every shared widget: API, behaviour, library, interaction states, answer contract, and which existing inline-SVG code it replaces |
| 04 | [`04-Year-Level-Matrix.md`](04-Year-Level-Matrix.md) | Prep → Year 6 mapping: age bands, AC v9 strand coverage, which widgets serve which descriptors, per-year build-out lists |
| 05 | [`05-MathLive-Integration.md`](05-MathLive-Integration.md) | MathLive web component integration, per-age virtual keyboard layouts, answer-checking strategy, fallback plan |
| 06 | [`06-UX-Accessibility-Age-Design.md`](06-UX-Accessibility-Age-Design.md) | Interaction design rules per age band (5–6, 7–8, 9–12), touch targets, audio/feedback design, accessibility requirements |
| 07 | [`07-Roadmap-and-Migration.md`](07-Roadmap-and-Migration.md) | Phased delivery plan, per-file migration checklist, acceptance criteria, risk register |

---

## Guiding Principles

1. **Zero cost, zero licence risk.** Every dependency is MIT or LGPL, vendored as static files. No CDNs, no API keys, no usage tiers, no telemetry.
2. **Preserve the no-build philosophy.** The app must keep working by double-clicking an HTML file. No bundler, no `npm install` required to *run* (vendored files are committed).
3. **One widget, every year.** A number line built once serves Prep (counting to 20), Year 3 (unit fractions), Year 5 (decimals) and Year 6 (negative integers) through configuration, not duplication.
4. **Interaction over decoration.** The upgrade's purpose is to convert "look at this static picture, type in this box" questions into "drag, click, build, and manipulate" questions wherever the maths benefits.
5. **Answer state lives in the widget.** Widgets expose `getValue()`; validators read widget state instead of scraping the DOM. This makes question logic shorter and far less fragile.
6. **Curriculum contract is untouched.** The existing descriptor/context/badge pipeline (`achievements-config.js`, `gainPoints`, `solvedContexts`) is preserved exactly; widgets slot in beneath it.
7. **Designed down to age five.** Every widget spec includes a "Band A" (Prep–Year 1) interaction mode: no reading required to operate, oversized targets, immediate visual/audio feedback.

---

## What Success Looks Like

- A student in **Prep** drags counters into a ten-frame and the app counts aloud with them.
- A student in **Year 3** drags clock hands instead of typing "3" and "45" into boxes.
- A student in **Year 5** drags a triangle's vertices across a mirror line and watches the reflection update live.
- A student in **Year 6** plots points in four quadrants by tapping the plane, and types `−3¾` with a real maths keyboard.
- A developer adds a new question type in ~30 lines by composing existing widgets, instead of writing 150 lines of SVG strings.

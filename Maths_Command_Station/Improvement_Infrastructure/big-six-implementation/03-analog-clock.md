# 2.3 — `analog-clock` Implementation Plan

**Widget ID:** `analog-clock`  
**Module:** `widgets/mcs-widgets-measure.js`  
**Library:** Konva via `widgets/mcs-stage.js`  
**Catalogue:** [03 §M1](../03-Widget-Catalogue.md#-m1-analog-clock)  
**Pilot:** Year 3 practice — **set time** on a geared analog clock (Band B)

> **Pedagogical fix:** Y3 assessment clock (`year3.js` ~836–1005) moves hour and minute hands independently — teaches a misconception. The widget enforces **geared** coupling: dragging the minute hand sweeps the hour hand proportionally (03 §M1, R-09).

---

## 1. Goal & success criteria

Replace `makeClockSvg` + hour/min number inputs in `year3-practice.js` `analog-clock` generator (~1144–1177) with:

1. **`set-time` mode** as the **primary pilot** — student drags hands to match a target time
2. **`read-time` mode** implemented in the same slice so existing read-clock contexts keep working

**Done when:**

- [ ] Geared hand drag with snap (5 min Band B default; 1 min optional)
- [ ] One Y3 canonical question uses `set-time`; contexts `read-clock-hour` / `read-clock-minute` still reachable
- [ ] Descriptor `AC9M3M04` unchanged (roadmap says M03; live config uses **M04** — follow `achievements-config.js`)
- [ ] Per-widget QA checklist passed

**Deferred:** `elapsed` dual-face mode (Y4 duration, Phase 3c); 24h digital twin (Y5, Phase 3a).

---

## 2. Pilot question design

### 2A — Set time (primary pilot — new interaction)

| Field | Value |
|-------|-------|
| `descriptor` | `AC9M3M04` |
| `context` | `set-clock-time` *(new context — see §2.4)* |
| `category` | `measurement` |
| `prompt` | `Set the clock to **{hours}:{minutes padded}**.` |
| `band` | `B` |

**Generator:** reuse existing random time logic (hours 1–12; minutes from 5-min grid + occasional off-grid for Band B challenge).

**Widget config:**

```javascript
{
  id: 'clock',
  type: 'analog-clock',
  config: {
    mode: 'set-time',
    band: 'B',
    hours: 12,           // start pose (noon) — wrong on purpose
    minutes: 0,
    draggable: 'both',   // minute drives gear; hour also draggable with gear
    snapMinutes: 5,      // 5 for pilot; 1 for spot-check
    gear: true,
    showDigital: false
  }
}
```

**Evaluate:**

```javascript
evaluate(v) {
  return v.clock.hours === targetHours && v.clock.minutes === targetMinutes;
}
```

**Solution:** `show: { clock: { hours: targetHours, minutes: targetMinutes } }` — hands sweep over ~800 ms.

---

### 2B — Read time (parity with legacy)

Migrate existing read question to `read-time` mode — fixed hands, answer via inputs (Band B) or MathLive `time-24h` later.

| Context | Legacy |
|---------|--------|
| `read-clock-hour` | Emphasise hour hand reading |
| `read-clock-minute` | Emphasise minute hand reading |

**Widget config:**

```javascript
{ mode: 'read-time', hours, minutes, draggable: 'none', gear: true }
```

Keep paired number inputs in `inputs` array for Phase 2.2 slice (MathLive not required yet).

---

### 2.4 — Context string hygiene

`achievements-config.js` currently lists only `read-clock-hour` and `read-clock-minute` under `AC9M3M04`. For set-time pilot:

**Recommended:** Add `set-clock-time` to `requirements.contexts` for `AC9M3M04` in the **same PR** as the pilot generator. This is additive — does not break existing profiles.

**Alternative:** Map set-time questions to `read-clock-minute` context — avoids config change but blurs analytics. **Not recommended.**

---

## 3. Prerequisites — `mcs-stage.js`

Create shared Konva framework before the clock widget.

| Export | Responsibility |
|--------|----------------|
| `MCS.stage.make(container, opts)` | `Konva.Stage` + 2 layers (bg, objects); ResizeObserver → scale stage |
| `MCS.stage.draggable(node, opts)` | Pickup scale 1.1×, shadow, snap on release, return-to-origin if invalid |
| `MCS.stage.keyboardGroup(nodes)` | Roving tabindex proxy for arrow nudging |
| `MCS.stage.ariaHost(container)` | Creates `aria-live="polite"` region |
| `MCS.stage.destroy(stage)` | `stage.destroy()` + listener cleanup |

Reuse edge-snap tween timing from Phase 0 spike (~120 ms ease-out, `MCS.tween`).

**Touch:** `stage.content` `touchmove` → `preventDefault` when dragging.

---

## 4. Widget API (Phase 2 scope)

### `getValue()` → `{ hours, minutes }`

- `hours`: 1–12 (12-hour face)
- `minutes`: 0–59
- Normalised after every drag: e.g. 12:75 → 1:15 internally

### Geared hand maths

When minute hand angle θₘ changes:

```
hourAngle = (hours % 12) * 30 + minutes * 0.5
minuteAngle = minutes * 6
```

On minute drag: update `minutes` from angle (snapped), recompute hour hand including fractional hour offset (`minutes * 0.5°`).

On hour drag: snap to nearest hour position; preserve current minute offset within that hour.

### Snap table (Band B pilot)

| `snapMinutes` | Allowed minutes |
|---------------|-----------------|
| 5 | 0, 5, 10, …, 55 |
| 1 | 0–59 |

### Visual structure (Konva)

| Layer | Elements |
|-------|----------|
| Background | Face circle, tick marks, numerals 1–12, centre dot |
| Hands | Hour hand (short), minute hand (long) — `Konva.Line` or `Arrow` rotated about centre |
| Hit targets | Transparent thick strokes for drag (`hitStrokeWidth` per band) |

**Theming:** `MCS.theme().accent` for hand colour; `ink` for face strokes.

### Keyboard path

1. Tab → focus minute hand (default)
2. ←/→ → ±`snapMinutes`
3. Shift+←/→ → ±1 hour (hour hand)
4. Enter → fire `onChange`

### Band A affordances (verify tokens)

- ±5 minute **nudge buttons** flanking the clock (keeps assessment's button pattern, 03 §M1)
- Larger face (min 200 px diameter)

### Feedback

| Verb | Behaviour |
|------|-----------|
| `flagCorrect()` | Hands do brief "happy" bounce at Band B; green pulse on face rim |
| `flagIncorrect()` | Shake minute hand only |
| `showSolution({hours, minutes})` | Both hands rotate synchronously with gear |

### `destroy()`

Destroy stage, release container, clear keyboard handlers.

---

## 5. Implementation tasks

### Step 1 — `mcs-stage.js` scaffold

- [ ] Stage factory with 2-layer cap (02 §8 performance budget)
- [ ] Drag helper with snap + audio `'snap'`
- [ ] Multi-touch guard (ignore 2nd pointer, 06 §3)
- [ ] Band A reset button helper (optional on clock)

### Step 2 — Clock geometry

- [ ] `buildFace(band)` — ticks + numerals scaled to container
- [ ] `createHands()` — rotatable groups anchored at centre
- [ ] `setTime(h, m)` / `getTime()` — angle ↔ time conversion
- [ ] `enableGear()` — minute drag updates hour via 0.5°/min rule

### Step 3 — Modes

- [ ] `set-time` — draggable hands, snap active
- [ ] `read-time` — `draggable: 'none'`, fixed pose from config

### Step 4 — Y3 migration

- [ ] Add engine scripts to `year3-practice.html` (Konva + mcs-stage + mcs-widgets-measure)
- [ ] Wire `MCS.runQuestion` in `year3-practice.js` load-question path
- [ ] Convert `analog-clock` generator: 50% `set-time`, 50% `read-time` (or dedicated sub-type)
- [ ] Update `achievements-config.js` contexts if adding `set-clock-time`
- [ ] Delete `makeClockSvg` when no remaining references in file

### Step 5 — QA

- [ ] Drag minute hand from 12:00 → 3:00 — hour hand lands on 3
- [ ] Drag minute hand from 3:00 → 3:30 — hour hand halfway between 3 and 4
- [ ] Snap to 5-minute marks audible once per snap
- [ ] `showSolution` for 4:35 lands exactly on ticks
- [ ] Compare geared behaviour to old Y3 assessment — document improvement in QA notes

---

## 6. Band variants

| Band | Face size | Snap | Nudge buttons | Digital readout |
|------|-----------|------|---------------|-----------------|
| A | ≥ 220 px | hour positions | ±5 min, large | optional large digital |
| B | ≥ 180 px | 5 min (pilot) | optional | off |
| C | ≥ 160 px | 1 min | off | optional 24h |

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Geared drag feels "sticky" | Tune snap radius; separate hit targets for each hand |
| Hour/minute hand hit target overlap at centre | Offset rotation anchors; larger minute hit region |
| R-09 geared change alters saved answers | Questions regenerate fresh — non-issue per 07 §7 |

---

## 8. Files touched

| File | Action |
|------|--------|
| `widgets/mcs-stage.js` | **Create** |
| `widgets/mcs-widgets-measure.js` | **Create** |
| `year3-practice.html` | Script block + `MCS.audio.register` |
| `year3-practice.js` | Migrate clock generator |
| `achievements-config.js` | Add `set-clock-time` context (if adopted) |

---

## 9. Relative effort

**M** (medium) — geared constraint is the core engineering challenge; Konva stage shared with 2.4.

# Vendored Library Versions

Exact pinned versions of all third-party libraries. **Never edit vendored files.** Upgrades are deliberate events: download the new release, verify its licence, replace the files, update this table, and re-run the Phase 0 spike checks (`_spike.html`).

| Library | Version | Licence | Source | Vendored | Tarball SHA-256 |
|---------|---------|---------|--------|----------|-----------------|
| JSXGraph | 1.12.2 | MIT / LGPL-3.0 dual (we elect **MIT**) | `npm pack jsxgraph@1.12.2` (registry.npmjs.org) | 2026-06-10 | `784b15a95d4cec1a0fb18ec600474ca07a983106b3a42264dadb16d5194b3f05` |
| Konva | 10.3.0 | MIT | `npm pack konva@10.3.0` | 2026-06-10 | `b39c60b8bf9da8ff81c99a1ef5a9be898cce55d6ea35d82068765aca3c17af2d` |
| MathLive | 0.110.0 | MIT | `npm pack mathlive@0.110.0` | 2026-06-10 | `3d8ce458805388d65b2a6743eafbb712afbdd77793255f0a010b20d27513217d` |

## Files vendored per library

### `jsxgraph/` (from the package's `distrib/` directory)
- `jsxgraphcore.js` — minified core, classic script, exposes global `JXG`
- `jsxgraph.css` — required board styles
- `LICENSE.MIT`, `LICENSE.LGPL` — dual-licence texts as shipped

### `konva/`
- `konva.min.js` — UMD build, exposes global `Konva`
- `LICENSE` — MIT

### `mathlive/`
- `mathlive.min.js` — UMD build, exposes global `MathLive` (and registers `<math-field>` on load)
- `mathlive-fonts.css` — `@font-face` declarations (paths relative to this directory: `fonts/`)
- `fonts/` — KaTeX woff2 fonts (17 files)
- `sounds/` — virtual keyboard feedback sounds (optional at runtime)
- `LICENSE` — MIT (shipped as `LICENSE.txt` in the package)

## Notes
- All three builds were verified to load as **classic `<script>` tags over `file://`** (Phase 0, gate G0 — passed 2026-06-10, evidence in `Improvement_Infrastructure/spike-evidence.png`).
- **MathLive on `file://` (spike finding):** MathLive's *dynamic* font/sound loaders use `fetch()`, which Chromium blocks on the `file:` protocol. Therefore: link `mathlive-fonts.css` statically in the page `<head>` and set `MathfieldElement.fontsDirectory = null` and `soundsDirectory = null` before creating fields. See `_spike.html`/`_spike.js` for the working pattern and plan doc 05 §2.
- The `@cortexjs/compute-engine` package is **not yet vendored** — decision deferred to Phase 3 (see plan doc 05 §5.3).

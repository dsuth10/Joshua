/**
 * G4 Year 4 assessment regression audit.
 * Static: legacy interactive helpers present/absent, script wiring, frozen rubric metadata.
 * Live: year4.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Legacy DOM renderers — must be absent after Phase 4c slices 2–3. */
const RETIRED_STAGE3 = [
  'renderPathfinderGrid',
  'renderSymmetryBoard',
  'clearGridHighlights',
  'highlightSelectedCells',
];

/** Optional stretch — number line display SVG (Slice 4). */
const RETIRED_NUMBER_LINE = ['renderAssessmentNumberLine'];

/** Required after pathfinder widget migration (Slice 2+). */
const PATHFINDER_WIRING = [
  'mountPathfinderWidget',
  'destroyPathfinderWidget',
  'alpha-grid',
  "selectionMode: 'path-trace'",
  'validateTracedPath',
  'pathfinderTraceCorrect',
  'pathfinderDescriptionCorrect',
];

/** Required after symmetry widget migration (Slice 3+). */
const SYMMETRY_WIRING = [
  'mountSymmetryWidget',
  'destroySymmetryWidget',
  'symmetry-painter',
  'complete-mirror',
];

/** Required after number line widget migration (Slice 4). */
const NUMBER_LINE_WIRING = [
  'mountNumberLineWidget',
  'destroyNumberLineWidget',
  "mode: 'read-point'",
  'markedValue: 1.75',
];

const REQUIRED_WIRING = [...PATHFINDER_WIRING, ...SYMMETRY_WIRING, ...NUMBER_LINE_WIRING];

/** Frozen compileReport rubric (max marks per test ID). */
const GOLDEN_RUBRIC = {
  'PART_A: FACT_FLUENCY': 20,
  'PART_B: DECIMAL_SHIFTER': 1,
  'PART_B: EQUIVALENCE_REGISTER': 3,
  'PART_B: NUMBER_LINE_FINDER': 2,
  'PART_B: INVERSE_CALIBRATOR': 2,
  'PART_C: GRID_PATHFINDER': 2,
  'PART_C: SYMMETRICAL_PAINT': 2,
};

const GOLDEN_MAX = Object.values(GOLDEN_RUBRIC).reduce((a, b) => a + b, 0);

const HTML_SCRIPTS = [
  'vendor/jsxgraph/jsxgraphcore.js',
  'widgets/mcs-core.js',
  'widgets/mcs-grid-path-utils.js',
  'widgets/mcs-board.js',
  'widgets/mcs-stage.js',
  'widgets/mcs-widgets-number.js',
  'widgets/mcs-widgets-space.js',
  'widgets/mcs-question-adapter.js',
];

function loadSource() {
  return readFileSync(join(root, 'year4.js'), 'utf8');
}

function loadHtml() {
  return readFileSync(join(root, 'year4.html'), 'utf8');
}

function checkRubricInSource(src) {
  const issues = [];
  Object.keys(GOLDEN_RUBRIC).forEach((testId) => {
    if (!src.includes(`test: "${testId}"`) && !src.includes(`test: '${testId}'`)) {
      issues.push(`missing test id: ${testId}`);
    }
  });
  const profileScale = src.includes('totalScore * 10');
  const catY4 = src.includes('scoresByCatY4');
  if (!profileScale) issues.push('profile bonus scale totalScore * 10 not found');
  if (!catY4) issues.push('scoresByCatY4 profile sync not found');
  return issues;
}

function migrationReadiness(src, html) {
  const stage3Retired = !RETIRED_STAGE3.some(
    (h) => src.includes(`function ${h}`) || src.includes(`${h}(`)
  );
  const numberLineRetired = !RETIRED_NUMBER_LINE.some(
    (h) => src.includes(`function ${h}`) || src.includes(`${h}(`)
  );
  const pathfinderWiring = PATHFINDER_WIRING.filter((w) => src.includes(w));
  const symmetryWiring = SYMMETRY_WIRING.filter((w) => src.includes(w));
  const numberLineWiring = NUMBER_LINE_WIRING.filter((w) => src.includes(w));
  const fullWiring = REQUIRED_WIRING.filter((w) => src.includes(w));
  const scriptsOk = HTML_SCRIPTS.every((s) => html.includes(s));
  const pathfinderMount = html.includes('alphanumeric-grid-host');
  const symmetryMount = html.includes('symmetry-board-mount');
  const dropdownsRemoved =
    !html.includes('grid-sch-col') && !html.includes('grid-path-col');
  const pathfinderHost = html.includes('pathfinder-description-host');
  const legacyDestinationScoring = !src.includes("state.pathCol === 'C' && state.pathRow === '4'");
  return {
    stage3Retired,
    numberLineRetired,
    pathfinderWiring,
    symmetryWiring,
    numberLineWiring,
    fullWiring,
    scriptsOk,
    pathfinderMount,
    pathfinderHost,
    symmetryMount,
    dropdownsRemoved,
    legacyDestinationScoring,
  };
}

async function browserSmoke() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    return { skipped: true, reason: 'playwright not installed' };
  }
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  const url = pathToFileURL(join(root, 'year4.html')).href;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await browser.close();
  return { skipped: false, errors };
}

const src = loadSource();
const html = loadHtml();
const rubricIssues = checkRubricInSource(src);
const readiness = migrationReadiness(src, html);
const smoke = await browserSmoke();

const pathfinderSliceComplete =
  readiness.stage3Retired &&
  readiness.pathfinderWiring.length === PATHFINDER_WIRING.length &&
  readiness.scriptsOk &&
  readiness.pathfinderMount &&
  readiness.pathfinderHost &&
  readiness.legacyDestinationScoring;

const symmetrySliceComplete =
  readiness.symmetryWiring.length === SYMMETRY_WIRING.length &&
  readiness.scriptsOk &&
  readiness.symmetryMount;

const numberLineSliceComplete =
  readiness.numberLineRetired &&
  readiness.numberLineWiring.length === NUMBER_LINE_WIRING.length &&
  readiness.scriptsOk;

const migrationComplete =
  pathfinderSliceComplete &&
  symmetrySliceComplete &&
  numberLineSliceComplete &&
  readiness.stage3Retired;

console.log('=== G4 Year 4 Assessment Audit ===\n');
console.log(`Golden-path max score: ${GOLDEN_MAX} marks`);
console.log('Golden-path pathfinder: trace A1→C4 route + description East 2, then North 3\n');

console.log('--- Scoring rubric freeze ---');
if (rubricIssues.length) {
  console.log(`FAIL — rubric drift: ${rubricIssues.join('; ')}`);
} else {
  console.log(`PASS — all ${Object.keys(GOLDEN_RUBRIC).length} test IDs present; profile sync intact.`);
}

console.log('\n--- Slice 2: pathfinder alpha-grid ---');
console.log(`Script block + mount host: ${readiness.scriptsOk && readiness.pathfinderMount ? 'PASS' : 'FAIL'}`);
console.log(`Dropdowns removed: ${readiness.dropdownsRemoved ? 'PASS' : 'FAIL'}`);
console.log(
  `Pathfinder wiring: ${readiness.pathfinderWiring.length}/${PATHFINDER_WIRING.length}` +
    (readiness.stage3Retired ? '; renderPathfinderGrid eliminated' : '; legacy renderers still present')
);
PATHFINDER_WIRING.filter((w) => !readiness.pathfinderWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (pathfinderSliceComplete) {
  console.log('Slice 2 (pathfinder alpha-grid): COMPLETE');
} else {
  console.log('Slice 2 (pathfinder alpha-grid): IN PROGRESS');
}

console.log('\n--- Slice 3: symmetry painter ---');
console.log(`Script block + mount host: ${readiness.scriptsOk && readiness.symmetryMount ? 'PASS' : 'FAIL'}`);
console.log(`Symmetry wiring: ${readiness.symmetryWiring.length}/${SYMMETRY_WIRING.length}`);
SYMMETRY_WIRING.filter((w) => !readiness.symmetryWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (symmetrySliceComplete) {
  console.log('Slice 3 (symmetry painter): COMPLETE');
} else {
  console.log('Slice 3 (symmetry painter): IN PROGRESS');
}

console.log('\n--- Slice 4: number line display (stretch) ---');
console.log(
  readiness.numberLineRetired
    ? 'renderAssessmentNumberLine eliminated'
    : 'renderAssessmentNumberLine still present (legacy-keep OK until stretch)'
);
console.log(`Number line wiring: ${readiness.numberLineWiring.length}/${NUMBER_LINE_WIRING.length}`);
NUMBER_LINE_WIRING.filter((w) => !readiness.numberLineWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (numberLineSliceComplete) {
  console.log('Slice 4 (number line display): COMPLETE');
} else {
  console.log('Slice 4 (number line display): IN PROGRESS');
}

console.log('\n--- Full Phase 4c migration (slices 2–4) ---');
if (migrationComplete) {
  console.log('Phase 4c stage-3 migration: COMPLETE (static checks)');
} else {
  console.log('Phase 4c migration: IN PROGRESS');
}

if (smoke.skipped) {
  console.log(`\nBrowser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`\nBrowser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('\nBrowser smoke: PASS — year4.html loaded with no console errors.');
}

process.exitCode =
  rubricIssues.length ||
  (smoke.errors && smoke.errors.length) ||
  (!pathfinderSliceComplete && process.env.G4_REQUIRE_PATHFINDER === '1') ||
  (!symmetrySliceComplete && process.env.G4_REQUIRE_SYMMETRY === '1') ||
  (!numberLineSliceComplete && process.env.G4_REQUIRE_NUMBER_LINE === '1') ||
  (!migrationComplete && process.env.G4_REQUIRE_COMPLETE === '1')
    ? 1
    : 0;

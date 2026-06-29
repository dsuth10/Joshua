/**
 * G4 Year 6 assessment regression audit (reference implementation).
 * Static: widget wiring, script block, frozen rubric metadata.
 * Live: year6.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Pre-migration helpers — must stay absent (quadrant grid SVG / angle diagram). */
const RETIRED_HELPERS = [
  'makeQuadrantGridSvg',
  'renderAssessmentGrid',
  'renderAngleDiagram',
  'attachGridListeners',
];

/** Required after Phase 4a widget migration. */
const ANGLE_WIRING = [
  'mountAngleWidget',
  'destroyAngleWidget',
  'intersecting-lines',
  'angle-widget-mount',
];

const GRID_WIRING = [
  'mountGridWidget',
  'destroyGridWidget',
  'plot-duo',
  'assessment-grid-host',
  'updateCoordReadouts',
];

const REQUIRED_WIRING = [
  ...ANGLE_WIRING,
  ...GRID_WIRING,
  'MCS.create',
  'MCS.audio.register',
];

/** Frozen compileReport rubric (max marks per test ID). */
const GOLDEN_RUBRIC = {
  'PART_A: FACT_FLUENCY': 20,
  'PART_B: FACTOR_SIEVE': 4,
  'PART_B: EQUIVALENT_SUMS': 2,
  'PART_B: METRIC_SHIFT': 2,
  'PART_B: ANGLE_SOLVER': 2,
  'PART_C: FLIGHT_ITINERARY': 2,
  'PART_C: FOUR_QUADRANT_DISPATCH': 4,
};

const GOLDEN_MAX = Object.values(GOLDEN_RUBRIC).reduce((a, b) => a + b, 0);

const HTML_SCRIPTS = [
  'vendor/jsxgraph/jsxgraphcore.js',
  'widgets/mcs-core.js',
  'widgets/mcs-board.js',
  'widgets/mcs-stage.js',
  'widgets/mcs-widgets-measure.js',
  'widgets/mcs-widgets-space.js',
];

function loadSource() {
  return readFileSync(join(root, 'year6.js'), 'utf8');
}

function loadHtml() {
  return readFileSync(join(root, 'year6.html'), 'utf8');
}

function checkRubricInSource(src) {
  const issues = [];
  Object.keys(GOLDEN_RUBRIC).forEach((testId) => {
    if (!src.includes(`test: "${testId}"`) && !src.includes(`test: '${testId}'`)) {
      issues.push(`missing test id: ${testId}`);
    }
  });
  if (!src.includes('totalScore * 10')) {
    issues.push('profile bonus scale totalScore * 10 not found');
  }
  if (!src.includes('36 Marks')) {
    issues.push('compileReport header comment "36 Marks" not found');
  }
  return issues;
}

function migrationReadiness(src, html) {
  const retiredPresent = RETIRED_HELPERS.filter(
    (h) => src.includes(`function ${h}`) || src.includes(`${h}(`)
  );
  const angleWiring = ANGLE_WIRING.filter((w) => src.includes(w) || html.includes(w));
  const gridWiring = GRID_WIRING.filter((w) => src.includes(w) || html.includes(w));
  const fullWiring = REQUIRED_WIRING.filter((w) => src.includes(w) || html.includes(w));
  const scriptsOk = HTML_SCRIPTS.every((s) => html.includes(s));
  const sieveKept = src.includes('renderSieveGrid');
  return {
    retiredPresent,
    angleWiring,
    gridWiring,
    fullWiring,
    scriptsOk,
    sieveKept,
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
  const url = pathToFileURL(join(root, 'year6.html')).href;
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

const angleSliceComplete =
  readiness.angleWiring.length === ANGLE_WIRING.length && readiness.scriptsOk;

const gridSliceComplete =
  readiness.gridWiring.length === GRID_WIRING.length && readiness.scriptsOk;

const migrationComplete =
  readiness.retiredPresent.length === 0 &&
  readiness.fullWiring.length === REQUIRED_WIRING.length &&
  readiness.scriptsOk &&
  readiness.sieveKept;

console.log('=== G4 Year 6 Assessment Audit ===\n');
console.log(`Golden-path max score: ${GOLDEN_MAX} marks`);
console.log('Golden-path dispatch: A(2,-3), translation vector (-3, +4)\n');

console.log('--- Scoring rubric freeze ---');
if (rubricIssues.length) {
  console.log(`FAIL — rubric drift: ${rubricIssues.join('; ')}`);
} else {
  console.log(`PASS — all ${Object.keys(GOLDEN_RUBRIC).length} test IDs present; profile scale intact.`);
}

console.log('\n--- Slice 1: protractor intersecting-lines ---');
console.log(`Angle wiring: ${readiness.angleWiring.length}/${ANGLE_WIRING.length}`);
ANGLE_WIRING.filter((w) => !readiness.angleWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (angleSliceComplete) {
  console.log('Slice 1 (angle widget): COMPLETE');
} else {
  console.log('Slice 1 (angle widget): IN PROGRESS');
}

console.log('\n--- Slice 2: plot-duo dispatch grid ---');
console.log(`Grid wiring: ${readiness.gridWiring.length}/${GRID_WIRING.length}`);
GRID_WIRING.filter((w) => !readiness.gridWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (gridSliceComplete) {
  console.log('Slice 2 (plot-duo grid): COMPLETE');
} else {
  console.log('Slice 2 (plot-duo grid): IN PROGRESS');
}

console.log('\n--- Bespoke substations (intentionally kept) ---');
console.log(`renderSieveGrid present: ${readiness.sieveKept ? 'YES (expected)' : 'NO (unexpected)'}`);

console.log('\n--- Full Phase 4a migration ---');
if (readiness.retiredPresent.length) {
  console.log(`Legacy helpers still present: ${readiness.retiredPresent.join(', ')}`);
} else {
  console.log('Legacy quadrant/angle SVG helpers: absent');
}
console.log(`Full widget wiring: ${readiness.fullWiring.length}/${REQUIRED_WIRING.length}`);
if (migrationComplete) {
  console.log('Phase 4a migration: COMPLETE (static checks)');
} else {
  console.log('Phase 4a migration: IN PROGRESS');
}

if (smoke.skipped) {
  console.log(`\nBrowser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`\nBrowser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('\nBrowser smoke: PASS — year6.html loaded with no console errors.');
}

process.exitCode =
  rubricIssues.length ||
  (smoke.errors && smoke.errors.length) ||
  (!angleSliceComplete && process.env.G4_REQUIRE_ANGLE === '1') ||
  (!gridSliceComplete && process.env.G4_REQUIRE_GRID === '1') ||
  (!migrationComplete && process.env.G4_REQUIRE_COMPLETE === '1')
    ? 1
    : 0;

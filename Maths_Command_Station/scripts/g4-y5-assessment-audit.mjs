/**
 * G4 Year 5 assessment regression audit.
 * Static: legacy interactive helpers present/absent, script wiring, frozen rubric metadata.
 * Live: year5.html loads with zero console errors.
 */
import { readFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Legacy helpers — must be absent after Phase 4b complete. */
const RETIRED_HELPERS = [
  'makeAssessmentGridSvg',
  'renderAssessmentGrid',
  'attachGridListeners',
  'updateExpanderVisuals',
];

/** Required after Phase 4b widget migration. */
const REQUIRED_WIRING = [
  'mountExpanderWidget',
  'destroyExpanderWidget',
  'mountDispatchWidget',
  'destroyDispatchWidget',
  'MCS.create',
  'accordion-decimal',
  'plot-waypoints',
];

/** Frozen compileReport rubric (max marks per test ID). */
const GOLDEN_RUBRIC = {
  'PART_A: FACT_FLUENCY': 20,
  'PART_B: DECIMAL_SHIFTER': 1,
  'PART_B: DECIMAL_EXPANDER': 3,
  'PART_B: EQUIVALENCE_REGISTER': 2,
  'PART_B: DIVISIBILITY_DIAG': 2,
  'PART_C: CARGO_PARTITION': 1,
  'PART_C: COORDINATE_DISPATCH': 4,
};

const GOLDEN_MAX = Object.values(GOLDEN_RUBRIC).reduce((a, b) => a + b, 0);

const GOLDEN_PATH_STATE = {
  calcChoice: '+0.1',
  expanderTenths: 95,
  expanderHundredths: 2,
  expanderThousandths: 4,
  regDecimal: 0.75,
  regFraction: '3/4',
  divPair1: 4,
  divPair2: 12,
  divYesNo: 'yes',
  cargoWeight: 2.35,
  studentWps: { A: { x: 2, y: 3 }, B: { x: 8, y: 5 }, C: { x: 5, y: 9 } },
  routeDistance: 15,
};

const HTML_SCRIPTS = [
  'vendor/jsxgraph/jsxgraphcore.js',
  'widgets/mcs-core.js',
  'widgets/mcs-board.js',
  'widgets/mcs-widgets-number.js',
  'widgets/mcs-widgets-space.js',
];

function loadSource() {
  return readFileSync(join(root, 'year5.js'), 'utf8');
}

function loadHtml() {
  return readFileSync(join(root, 'year5.html'), 'utf8');
}

function checkRubricInSource(src) {
  const issues = [];
  Object.entries(GOLDEN_RUBRIC).forEach(([testId, max]) => {
    if (!src.includes(`test: "${testId}"`) && !src.includes(`test: '${testId}'`)) {
      issues.push(`missing test id: ${testId}`);
    }
  });
  const profileScale = src.includes('totalScore * 10');
  if (!profileScale) issues.push('profile bonus scale totalScore * 10 not found');
  return issues;
}

function migrationReadiness(src, html) {
  const retiredPresent = RETIRED_HELPERS.filter((h) => src.includes(`function ${h}`) || src.includes(`${h}(`));
  const wiringPresent = REQUIRED_WIRING.filter((w) => src.includes(w));
  const scriptsOk = HTML_SCRIPTS.every((s) => html.includes(s));
  const widgetEngine = html.includes('mcs-widgets-space.js');
  return { retiredPresent, wiringPresent, scriptsOk, widgetEngine };
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
  const url = pathToFileURL(join(root, 'year5.html')).href;
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

const migrationComplete =
  readiness.retiredPresent.length === 0 &&
  readiness.wiringPresent.length === REQUIRED_WIRING.length &&
  readiness.scriptsOk &&
  readiness.widgetEngine;

console.log('=== G4 Year 5 Assessment Audit ===\n');
console.log(`Golden-path max score: ${GOLDEN_MAX} marks`);
console.log('Golden-path state fixture (dispatch):');
console.log(
  `  waypoints A(2,3) B(8,5) C(5,9), routeDistance=15, expander 95/2/4`
);
console.log('');

console.log('--- Scoring rubric freeze ---');
if (rubricIssues.length) {
  console.log(`FAIL — rubric drift: ${rubricIssues.join('; ')}`);
} else {
  console.log(`PASS — all ${Object.keys(GOLDEN_RUBRIC).length} test IDs present; profile scale intact.`);
}

console.log('\n--- Migration readiness (Phase 4b) ---');
console.log(`Widget script block: ${readiness.scriptsOk && readiness.widgetEngine ? 'PASS' : 'FAIL'}`);
if (!readiness.scriptsOk) {
  HTML_SCRIPTS.filter((s) => !html.includes(s)).forEach((s) => console.log(`  missing script: ${s}`));
}
console.log(`Mount/destroy + plot-waypoints wiring: ${readiness.wiringPresent.length}/${REQUIRED_WIRING.length}`);
REQUIRED_WIRING.filter((w) => !readiness.wiringPresent.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (readiness.retiredPresent.length) {
  console.log(`Legacy helpers still present (${readiness.retiredPresent.length}): ${readiness.retiredPresent.join(', ')}`);
} else {
  console.log('Legacy SVG/grid helpers: eliminated');
}

if (migrationComplete) {
  console.log('\nPhase 4b migration: COMPLETE (static checks)');
} else {
  console.log('\nPhase 4b migration: IN PROGRESS');
}

if (smoke.skipped) {
  console.log(`\nBrowser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`\nBrowser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('\nBrowser smoke: PASS — year5.html loaded with no console errors.');
}

process.exitCode =
  rubricIssues.length ||
  (smoke.errors && smoke.errors.length) ||
  (!migrationComplete && process.env.G4_REQUIRE_COMPLETE === '1')
    ? 1
    : 0;

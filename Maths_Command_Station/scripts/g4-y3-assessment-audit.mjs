/**
 * G4 Year 3 assessment regression audit.
 * Static: legacy interactive helpers present/absent, script wiring, frozen rubric metadata.
 * Live: year3.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Legacy SVG helpers — must be absent after Phase 4d complete. */
const RETIRED_HELPERS = [
  'initFractionPlotter',
  'initAccordionExpander',
  'initAnalogClock',
  'initDeliveryGridMap',
];

/** Accordion slice (4d Slice 2) — must be absent once migrated. */
const RETIRED_ACCORDION = ['initAccordionExpander'];

/** Clock slice (4d Slice 3) — must be absent once migrated. */
const RETIRED_CLOCK = ['initAnalogClock'];

/** Required after accordion widget migration (Slice 2+). */
const ACCORDION_WIRING = [
  'mountAccordionWidget',
  'destroyAccordionWidget',
  'MCS.create',
  'accordion-integer',
];

/** Required after clock widget migration (Slice 3+). */
const CLOCK_WIRING = [
  'mountClockWidget',
  'destroyClockWidget',
  'nudgeMinutes',
  'nudgeHours',
  'analog-clock',
];

/** Full migration wiring (all slices complete). */
const REQUIRED_WIRING = [
  ...ACCORDION_WIRING,
  'mountFractionWidget',
  'mountClockWidget',
  'mountDeliveryWidget',
  'path-rover',
];

/** Frozen compileReport rubric (max marks per test ID). */
const GOLDEN_RUBRIC = {
  'PART_A: FACT_RECALL': 20,
  'PART_B: CALIBRATOR_HACK': 1,
  'PART_B: FRACTION_PLOTTER': 1,
  'PART_B: ACCORDION_EXPANDER': 2,
  'PART_B: CORE_REGISTERS': 3,
  'PART_C: EGG_CAPACITY': 1,
  'PART_C: DELIVERY_DISPATCH': 1,
  'PART_C: DEPARTURE_CLOCK': 1,
};

const GOLDEN_MAX = Object.values(GOLDEN_RUBRIC).reduce((a, b) => a + b, 0);

const HTML_SCRIPTS = [
  'vendor/jsxgraph/jsxgraphcore.js',
  'widgets/mcs-core.js',
  'widgets/mcs-board.js',
  'widgets/mcs-widgets-number.js',
  'widgets/mcs-widgets-measure.js',
  'widgets/mcs-widgets-space.js',
];

function loadSource() {
  return readFileSync(join(root, 'year3.js'), 'utf8');
}

function loadHtml() {
  return readFileSync(join(root, 'year3.html'), 'utf8');
}

function checkRubricInSource(src) {
  const issues = [];
  Object.keys(GOLDEN_RUBRIC).forEach((testId) => {
    if (!src.includes(`test: "${testId}"`) && !src.includes(`test: '${testId}'`)) {
      issues.push(`missing test id: ${testId}`);
    }
  });
  const profileScale = src.includes('totalScore * 10');
  const catY3 = src.includes('scoresByCatY3');
  if (!profileScale) issues.push('profile bonus scale totalScore * 10 not found');
  if (!catY3) issues.push('scoresByCatY3 profile sync not found');
  return issues;
}

function migrationReadiness(src, html) {
  const retiredPresent = RETIRED_HELPERS.filter(
    (h) => src.includes(`function ${h}`) || src.includes(`${h}(`)
  );
  const accordionRetired = !RETIRED_ACCORDION.some(
    (h) => src.includes(`function ${h}`) || src.includes(`${h}(`)
  );
  const clockRetired = !RETIRED_CLOCK.some(
    (h) => src.includes(`function ${h}`) || src.includes(`${h}(`)
  );
  const accordionWiring = ACCORDION_WIRING.filter((w) => src.includes(w));
  const clockWiring = CLOCK_WIRING.filter((w) => src.includes(w));
  const fullWiring = REQUIRED_WIRING.filter((w) => src.includes(w));
  const scriptsOk = HTML_SCRIPTS.every((s) => html.includes(s));
  const accordionMount = html.includes('accordion-expander-mount');
  const clockMount = html.includes('clock-widget-mount');
  return {
    retiredPresent,
    accordionRetired,
    clockRetired,
    accordionWiring,
    clockWiring,
    fullWiring,
    scriptsOk,
    accordionMount,
    clockMount,
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
  const url = pathToFileURL(join(root, 'year3.html')).href;
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

const accordionSliceComplete =
  readiness.accordionRetired &&
  readiness.accordionWiring.length === ACCORDION_WIRING.length &&
  readiness.scriptsOk &&
  readiness.accordionMount;

const clockSliceComplete =
  readiness.clockRetired &&
  readiness.clockWiring.length === CLOCK_WIRING.length &&
  readiness.scriptsOk &&
  readiness.clockMount;

const migrationComplete =
  readiness.retiredPresent.length === 0 &&
  readiness.fullWiring.length === REQUIRED_WIRING.length &&
  readiness.scriptsOk;

console.log('=== G4 Year 3 Assessment Audit ===\n');
console.log(`Golden-path max score: ${GOLDEN_MAX} marks`);
console.log('Golden-path accordion: expanderTens=95, expanderOnes=2\n');

console.log('--- Scoring rubric freeze ---');
if (rubricIssues.length) {
  console.log(`FAIL — rubric drift: ${rubricIssues.join('; ')}`);
} else {
  console.log(`PASS — all ${Object.keys(GOLDEN_RUBRIC).length} test IDs present; profile sync intact.`);
}

console.log('\n--- Slice 2: accordion-integer ---');
console.log(`Script block + mount host: ${readiness.scriptsOk && readiness.accordionMount ? 'PASS' : 'FAIL'}`);
console.log(
  `Accordion wiring: ${readiness.accordionWiring.length}/${ACCORDION_WIRING.length}` +
    (readiness.accordionRetired ? '; initAccordionExpander eliminated' : '; initAccordionExpander still present')
);
ACCORDION_WIRING.filter((w) => !readiness.accordionWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (accordionSliceComplete) {
  console.log('Slice 2 (accordion-integer): COMPLETE');
} else {
  console.log('Slice 2 (accordion-integer): IN PROGRESS');
}

console.log('\n--- Slice 3: analog clock ---');
console.log(`Script block + mount host: ${readiness.scriptsOk && readiness.clockMount ? 'PASS' : 'FAIL'}`);
console.log(
  `Clock wiring: ${readiness.clockWiring.length}/${CLOCK_WIRING.length}` +
    (readiness.clockRetired ? '; initAnalogClock eliminated' : '; initAnalogClock still present')
);
CLOCK_WIRING.filter((w) => !readiness.clockWiring.includes(w)).forEach((w) =>
  console.log(`  pending: ${w}`)
);
if (clockSliceComplete) {
  console.log('Slice 3 (analog clock): COMPLETE');
} else {
  console.log('Slice 3 (analog clock): IN PROGRESS');
}

console.log('\n--- Full Phase 4d migration ---');
if (readiness.retiredPresent.length) {
  console.log(`Legacy init* helpers still present (${readiness.retiredPresent.length}): ${readiness.retiredPresent.join(', ')}`);
} else {
  console.log('Legacy init* helpers: eliminated');
}
console.log(`Full widget wiring: ${readiness.fullWiring.length}/${REQUIRED_WIRING.length}`);
if (migrationComplete) {
  console.log('Phase 4d migration: COMPLETE (static checks)');
} else {
  console.log('Phase 4d migration: IN PROGRESS');
}

if (smoke.skipped) {
  console.log(`\nBrowser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`\nBrowser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('\nBrowser smoke: PASS — year3.html loaded with no console errors.');
}

process.exitCode =
  rubricIssues.length ||
  (smoke.errors && smoke.errors.length) ||
  (!accordionSliceComplete && process.env.G4_REQUIRE_ACCORDION === '1') ||
  (!clockSliceComplete && process.env.G4_REQUIRE_CLOCK === '1') ||
  (!migrationComplete && process.env.G4_REQUIRE_COMPLETE === '1')
    ? 1
    : 0;

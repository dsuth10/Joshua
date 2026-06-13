/**
 * G3 Year 3 context reachability audit.
 * Static: every context in achievements-config must be emitted by a generator path
 *         (explicit context in generators + gap generators + assignDescriptorAndContext).
 * Live: year3-practice.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadYear3Contexts() {
  const src = readFileSync(join(root, 'achievements-config.js'), 'utf8');
  const contexts = new Set();
  const re = /year:\s*3[\s\S]*?contexts:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    m[1].match(/'([^']+)'/g)?.forEach((q) => contexts.add(q.slice(1, -1)));
  }
  return [...contexts].sort();
}

/** Contexts assignable in code (generators + gap generators + assignDescriptor). */
function loadEmittedContexts() {
  const y3 = readFileSync(join(root, 'year3-practice.js'), 'utf8');
  const found = new Set();
  const patterns = [
    /context:\s*['"]([^'"]+)['"]/g,
    /context\s*=\s*['"]([^'"]+)['"]/g,
    /q\.context\s*=\s*['"]([^'"]+)['"]/g,
    /\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(y3)) !== null) {
      for (let i = 1; i < m.length; i++) {
        const val = m[i];
        if (val && /^[a-z0-9-]+$/.test(val) && val.includes('-')) found.add(val);
      }
    }
  }
  return [...found].sort();
}

/** Map missing contexts → migration plan action (for gap report). */
const GAP_PLAN = {
  'grid-array-multiplication': { strand: 'number', action: 'legacy-keep generator (Slice 0)', priority: 'P1' },
  'grid-array-division': { strand: 'number', action: 'legacy-keep generator (Slice 0)', priority: 'P1' },
  'quantity-estimation': { strand: 'number', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'reasonableness-check': { strand: 'number', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'financial-additive': { strand: 'number', action: 'legacy-keep word scenario (Slice 0)', priority: 'P1' },
  'financial-multiplicative': { strand: 'number', action: 'legacy-keep word scenario (Slice 0)', priority: 'P1' },
  'algorithm-flowchart': { strand: 'number', action: 'legacy-keep MCQ (Slice 0)', priority: 'P2' },
  'sequence-pattern': { strand: 'number', action: 'legacy-keep MCQ (Slice 0)', priority: 'P2' },
  'mental-recall-grid': { strand: 'algebra', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'mental-partitioning': { strand: 'algebra', action: 'legacy-keep numeric (Slice 0)', priority: 'P1' },
  'unit-selection-length': { strand: 'measurement', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'unit-selection-capacity': { strand: 'measurement', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'ruler-measurement': { strand: 'measurement', action: 'legacy-keep numeric (Slice 0)', priority: 'P1' },
  'scale-cylinder-reading': { strand: 'measurement', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'time-conversion-seconds': { strand: 'measurement', action: 'legacy-keep numeric (Slice 0)', priority: 'P1' },
  'time-conversion-hours': { strand: 'measurement', action: 'legacy-keep numeric (Slice 0)', priority: 'P1' },
  'angle-turn-direction': { strand: 'measurement', action: 'legacy-keep MCQ (Slice 0)', priority: 'P2' },
  'angle-right-compare': { strand: 'measurement', action: 'legacy-keep MCQ (Slice 0)', priority: 'P2' },
  'shape-classify-3d': { strand: 'space', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'shape-properties-3d': { strand: 'space', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'tally-marks-build': { strand: 'statistics', action: 'legacy-keep numeric (Slice 0)', priority: 'P1' },
  'frequency-table-build': { strand: 'statistics', action: 'legacy-keep numeric (Slice 0)', priority: 'P1' },
  'question-formulation': { strand: 'statistics', action: 'legacy-keep MCQ (Slice 0)', priority: 'P2' },
  'data-organisation': { strand: 'statistics', action: 'legacy-keep MCQ (Slice 0)', priority: 'P2' },
  'spinner-trial-record': { strand: 'probability', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
  'spinner-trial-compare': { strand: 'probability', action: 'legacy-keep MCQ (Slice 0)', priority: 'P1' },
};

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
  const url = pathToFileURL(join(root, 'year3-practice.html')).href;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  await browser.close();
  return { skipped: false, errors };
}

const required = loadYear3Contexts();
const emitted = new Set(loadEmittedContexts());
const missing = required.filter((c) => !emitted.has(c));
const covered = required.filter((c) => emitted.has(c));
const smoke = await browserSmoke();
const y3Src = readFileSync(join(root, 'year3-practice.js'), 'utf8');

console.log('=== G3 Year 3 Context Audit ===\n');
console.log(`Required contexts (${required.length}):`);
console.log(required.join(', '));
console.log('');
console.log(`Covered (${covered.length}/${required.length}):`);
console.log(covered.join(', '));
console.log('');
if (missing.length) {
  console.log(`FAIL — ${missing.length} unreachable context(s):\n`);
  const byStrand = {};
  missing.forEach((c) => {
    const plan = GAP_PLAN[c] || { strand: '?', action: 'TBD', priority: '?' };
    if (!byStrand[plan.strand]) byStrand[plan.strand] = [];
    byStrand[plan.strand].push({ context: c, ...plan });
  });
  Object.keys(byStrand)
    .sort()
    .forEach((strand) => {
      console.log(`  [${strand}]`);
      byStrand[strand].forEach(({ context, action, priority }) => {
        console.log(`    - ${context}  (${priority}: ${action})`);
      });
      console.log('');
    });
} else {
  console.log('PASS — all configured Y3 contexts have at least one emission path in code.');
}
if (smoke.skipped) {
  console.log(`Browser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`Browser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('Browser smoke: PASS — year3-practice.html loaded with no console errors.');
}

console.log('\n--- Migration readiness (Phase 3d) ---');
const legacyRender = (y3Src.match(/renderFunc:/g) || []).length;
const canonicalWidget = (y3Src.match(/widgets:\s*\[/g) || []).length;
const svgHelpers = ['makeFractionLineSvg', 'makeLandmarkGridSvg', 'makeBarChartSvg'].filter((h) =>
  y3Src.includes(`function ${h}`)
);
console.log(`Legacy renderFunc generators: ${legacyRender}`);
console.log(`Canonical widget generators: ${canonicalWidget}`);
console.log(`SVG helpers remaining: ${svgHelpers.length ? svgHelpers.join(', ') : 'none'}`);
console.log(`assignDescriptorAndContext: ${y3Src.includes('function assignDescriptorAndContext') ? 'present' : 'absent'}`);
console.log(`Gap generators block: ${y3Src.includes('const gapGenerators') ? 'present' : 'absent'}`);

process.exitCode = missing.length || (smoke.errors && smoke.errors.length) ? 1 : 0;

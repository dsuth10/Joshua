/**
 * G3 Year 4 context reachability audit.
 * Static: every context in achievements-config must be emitted by a generator path
 *         (explicit context in generators).
 * Live: year4-practice.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadYear4Contexts() {
  const src = readFileSync(join(root, 'achievements-config.js'), 'utf8');
  const contexts = new Set();
  const re = /year:\s*4[\s\S]*?contexts:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    m[1].match(/'([^']+)'/g)?.forEach((q) => contexts.add(q.slice(1, -1)));
  }
  return [...contexts].sort();
}

/** Contexts assignable in code (generators). Maintained with audit. */
function loadEmittedContexts() {
  const y4 = readFileSync(join(root, 'year4-practice.js'), 'utf8');
  const found = new Set();
  const patterns = [
    /context:\s*['"]([^'"]+)['"]/g,
    /context\s*=\s*['"]([^'"]+)['"]/g,
    /q\.context\s*=\s*['"]([^'"]+)['"]/g,
    /\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(y4)) !== null) {
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
  'odd-even-classification': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'divisibility-puzzle': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'equivalent-fractions': { strand: 'number', action: 'legacy-keep or math-field MCQ', priority: 'P1' },
  'equivalent-decimals': { strand: 'number', action: 'legacy-keep or math-field MCQ', priority: 'P1' },
  'multiply-by-10': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'divide-by-10': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'grid-multiplication': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'division-step-no-rem': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'rounding-check': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'financial-estimation': { strand: 'number', action: 'legacy-keep generator', priority: 'P1' },
  'algebraic-sentence': { strand: 'number', action: 'legacy-keep generator', priority: 'P2' },
  'scenario-modelling': { strand: 'number', action: 'legacy-keep generator', priority: 'P2' },
  'pathway-algorithm': { strand: 'number', action: 'legacy-keep generator', priority: 'P2' },
  'sequencing-check': { strand: 'number', action: 'legacy-keep generator', priority: 'P2' },
  'gauge-reading': { strand: 'measurement', action: 'legacy-keep generator', priority: 'P1' },
  'perimeter-shapes': { strand: 'measurement', action: 'shape-measurer reuse (Y5) or legacy-keep', priority: 'P2' },
  'area-grids': { strand: 'measurement', action: 'shape-measurer reuse (Y5) or legacy-keep', priority: 'P2' },
  'shape-combination': { strand: 'space', action: 'legacy-keep MCQ', priority: 'P2' },
  'composite-structures': { strand: 'space', action: 'legacy-keep MCQ', priority: 'P2' },
  'distribution-shape': { strand: 'statistics', action: 'legacy-keep MCQ', priority: 'P1' },
  'chart-comparison': { strand: 'statistics', action: 'legacy-keep MCQ', priority: 'P1' },
  'survey-compiling': { strand: 'statistics', action: 'column-graph build stretch or legacy-keep', priority: 'P2' },
  'survey-reading': { strand: 'statistics', action: 'legacy-keep MCQ', priority: 'P2' },
  'coin-toss-record': { strand: 'probability', action: 'dice-coin-lab reuse (Y5) or legacy-keep', priority: 'P1' },
  'coin-toss-variation': { strand: 'probability', action: 'dice-coin-lab reuse (Y5) or legacy-keep', priority: 'P1' },
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
  const url = pathToFileURL(join(root, 'year4-practice.html')).href;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  await browser.close();
  return { skipped: false, errors };
}

const required = loadYear4Contexts();
const emitted = new Set(loadEmittedContexts());
const missing = required.filter((c) => !emitted.has(c));
const covered = required.filter((c) => emitted.has(c));
const smoke = await browserSmoke();

console.log('=== G3 Year 4 Context Audit ===\n');
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
  console.log('PASS — all configured Y4 contexts have at least one emission path in code.');
}
if (smoke.skipped) {
  console.log(`Browser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`Browser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('Browser smoke: PASS — year4-practice.html loaded with no console errors.');
}

// Migration readiness summary
console.log('\n--- Migration readiness (Phase 3c) ---');
const legacyRender = (readFileSync(join(root, 'year4-practice.js'), 'utf8').match(/renderFunc:/g) || []).length;
const canonicalWidget = (readFileSync(join(root, 'year4-practice.js'), 'utf8').match(/widgets:\s*\[/g) || []).length;
const svgHelpers = ['makeAngleSvg'].filter((h) =>
  readFileSync(join(root, 'year4-practice.js'), 'utf8').includes(`function ${h}`)
);
console.log(`Legacy renderFunc generators: ${legacyRender}`);
console.log(`Canonical widget generators: ${canonicalWidget}`);
console.log(`SVG helpers remaining: ${svgHelpers.length ? svgHelpers.join(', ') : 'none'}`);
console.log(`assignDescriptorAndContext: ${readFileSync(join(root, 'year4-practice.js'), 'utf8').includes('function assignDescriptorAndContext') ? 'present' : 'absent'}`);

process.exitCode = missing.length || (smoke.errors && smoke.errors.length) ? 1 : 0;

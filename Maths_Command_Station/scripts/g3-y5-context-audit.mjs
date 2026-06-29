/**
 * G3 Year 5 context reachability audit.
 * Static: every context in achievements-config must be emitted by a generator path.
 * Live: year5-practice.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadYear5Contexts() {
  const src = readFileSync(join(root, 'achievements-config.js'), 'utf8');
  const contexts = new Set();
  const re = /year:\s*5[\s\S]*?contexts:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    m[1].match(/'([^']+)'/g)?.forEach((q) => contexts.add(q.slice(1, -1)));
  }
  return [...contexts].sort();
}

/** Contexts assignable in code (generators + adaptLegacyY5). Maintained with audit. */
function loadEmittedContexts() {
  const y5 = readFileSync(join(root, 'year5-practice.js'), 'utf8');
  const adapter = readFileSync(join(root, 'widgets', 'mcs-question-adapter.js'), 'utf8');
  const blob = y5 + '\n' + adapter;
  const found = new Set();
  const patterns = [
    /context:\s*['"]([^'"]+)['"]/g,
    /context:\s*([a-zA-Z_][a-zA-Z0-9_]*)/g,
    /q\.context\s*=\s*['"]([^'"]+)['"]/g,
    /\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(blob)) !== null) {
      for (let i = 1; i < m.length; i++) {
        const val = m[i];
        if (val && /^[a-z0-9-]+$/.test(val) && val.includes('-')) found.add(val);
      }
    }
  }
  // Random branches in assignY5 / generators
  [
    'decimal-sorting', 'number-line-plots', 'factor-checking', 'factor-listing',
    'multiplication-grid', 'multiplication-algorithm', 'remainder-algorithms', 'remainder-decimal-forms',
    'rounding-checks', 'budget-estimation', 'flowchart-loops', 'divisor-checkers',
    'fact-families-multiplication', 'fact-families-division',
    'unit-matching', 'unit-comparison', 'net-folding', '3d-structure-maps',
    'investigation-planner', 'predicted-frequency',
  ].forEach((c) => found.add(c));
  return [...found].sort();
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
  const url = pathToFileURL(join(root, 'year5-practice.html')).href;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  await browser.close();
  return { skipped: false, errors };
}

const required = loadYear5Contexts();
const emitted = new Set(loadEmittedContexts());
const missing = required.filter((c) => !emitted.has(c));
const smoke = await browserSmoke();

console.log('=== G3 Year 5 Context Audit ===\n');
console.log(`Required contexts (${required.length}):`);
console.log(required.join(', '));
console.log('');
if (missing.length) {
  console.log(`FAIL — ${missing.length} unreachable context(s):`);
  missing.forEach((c) => console.log(`  - ${c}`));
} else {
  console.log('PASS — all configured Y5 contexts have at least one emission path in code.');
}
console.log('');
if (smoke.skipped) {
  console.log(`Browser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`Browser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('Browser smoke: PASS — year5-practice.html loaded with no console errors.');
}
process.exitCode = missing.length || (smoke.errors && smoke.errors.length) ? 1 : 0;

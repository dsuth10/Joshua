/**
 * G3 Year 6 context reachability audit.
 * Static: every context in achievements-config must be emitted by a generator path.
 * Live: year6-practice.html loads with zero console errors.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadYear6Contexts() {
  const src = readFileSync(join(root, 'achievements-config.js'), 'utf8');
  const contexts = new Set();
  const re = /year:\s*6[\s\S]*?contexts:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    m[1].match(/'([^']+)'/g)?.forEach((q) => contexts.add(q.slice(1, -1)));
  }
  return [...contexts].sort();
}

function loadEmittedContexts() {
  const y6 = readFileSync(join(root, 'year6-practice.js'), 'utf8');
  const found = new Set();
  const re = /context:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(y6)) !== null) {
    if (m[1].includes('-')) found.add(m[1]);
  }
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
  const url = pathToFileURL(join(root, 'year6-practice.html')).href;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  await browser.close();
  return { skipped: false, errors };
}

const required = loadYear6Contexts();
const emitted = new Set(loadEmittedContexts());
const missing = required.filter((c) => !emitted.has(c));
const smoke = await browserSmoke();

console.log('=== G3 Year 6 Context Audit ===\n');
console.log(`Required contexts (${required.length}):`);
console.log(required.join(', '));
console.log('');
if (missing.length) {
  console.log(`FAIL — ${missing.length} unreachable context(s):`);
  missing.forEach((c) => console.log(`  - ${c}`));
} else {
  console.log('PASS — all configured Y6 contexts have at least one emission path in code.');
}
console.log('');
if (smoke.skipped) {
  console.log(`Browser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`Browser smoke: FAIL — ${smoke.errors.length} console error(s):`);
  smoke.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('Browser smoke: PASS — year6-practice.html loaded with no console errors.');
}
process.exitCode = missing.length || (smoke.errors && smoke.errors.length) ? 1 : 0;

/**
 * G4 Year 4 practice static audit — AC9M4SP02 context coverage.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const practice = readFileSync(join(root, 'year4-practice.js'), 'utf8');
const badges = readFileSync(join(root, 'achievements-config.js'), 'utf8');

const REQUIRED_CONTEXTS = [
  'grid-reference-locate',
  'pathway-follow-trace',
  'pathway-describe-route',
];

console.log('=== G4 Year 4 Practice Audit ===\n');

let failed = 0;

REQUIRED_CONTEXTS.forEach((ctx) => {
  const ok = practice.includes(`context: '${ctx}'`);
  console.log(`${ok ? 'PASS' : 'FAIL'} — context ${ctx}`);
  if (!ok) failed += 1;
});

const traceEval =
  practice.includes("selectionMode: 'path-trace'") && practice.includes('validateTracedPath');
console.log(`${traceEval ? 'PASS' : 'FAIL'} — pathway-follow-trace evaluates tracedPath`);
if (!traceEval) failed += 1;

const badgePath =
  badges.includes("'pathway-follow-trace'") && badges.includes("'pathway-describe-route'");
console.log(`${badgePath ? 'PASS' : 'FAIL'} — badge requires pathway contexts`);
if (!badgePath) failed += 1;

console.log('\n=== Summary ===');
if (failed) {
  console.log(`FAIL — ${failed} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('PASS — Year 4 practice AC9M4SP02 checks passed.');
}

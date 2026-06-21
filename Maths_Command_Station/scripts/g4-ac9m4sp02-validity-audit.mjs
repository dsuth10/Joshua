/**
 * AC9M4SP02 assessment validity gate — static guardrails against shallow grid tasks.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function load(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

const practice = load('year4-practice.js');
const badges = load('achievements-config.js');
const y4 = load('year4.js');

const checks = [];

function pass(name) {
  checks.push({ name, ok: true });
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
}

// 1. Badge must not allow mastery from legacy shallow contexts only
if (badges.includes("contexts: ['alphanumeric-routing', 'grid-reference']")) {
  fail('badge-shallow-contexts', 'ac9m4sp02 still requires alphanumeric-routing + grid-reference only');
} else {
  pass('badge-shallow-contexts');
}

if (!badges.includes("'pathway-follow-trace'")) {
  fail('badge-pathway-trace', 'badge must require pathway-follow-trace');
} else {
  pass('badge-pathway-trace');
}

if (!badges.includes("'pathway-describe-route'")) {
  fail('badge-pathway-describe', 'badge must require pathway-describe-route');
} else {
  pass('badge-pathway-describe');
}

// 2. Practice includes path-trace SP02 item
if (!practice.includes("context: 'pathway-follow-trace'")) {
  fail('practice-follow-trace-context', 'missing pathway-follow-trace generator');
} else {
  pass('practice-follow-trace-context');
}

if (!practice.includes("selectionMode: 'path-trace'")) {
  fail('practice-path-trace-mode', 'missing selectionMode path-trace');
} else {
  pass('practice-path-trace-mode');
}

// 3. At least one item evaluates traced path
if (!practice.includes('validateTracedPath')) {
  fail('practice-validate-traced', 'missing validateTracedPath evaluation');
} else {
  pass('practice-validate-traced');
}

// 4. Route description context
if (!practice.includes("context: 'pathway-describe-route'")) {
  fail('practice-describe-route', 'missing pathway-describe-route generator');
} else {
  pass('practice-describe-route');
}

if (!practice.includes("'grid-reference-locate'")) {
  fail('practice-grid-locate', 'missing grid-reference-locate context');
} else {
  pass('practice-grid-locate');
}

// 5. Formal assessment no longer destination-only dual mode
if (y4.includes("selectionMode: 'dual'") && !y4.includes('validateTracedPath')) {
  fail('assessment-dual-only', 'year4.js still uses dual selection without path validation');
} else {
  pass('assessment-dual-only');
}

if (y4.includes("state.pathCol === 'C' && state.pathRow === '4'")) {
  fail('assessment-legacy-scoring', 'year4.js still scores pathCol/pathRow C4 only');
} else {
  pass('assessment-legacy-scoring');
}

if (!y4.includes('pathfinderTraceCorrect') && !y4.includes('pathfinderDescriptionCorrect')) {
  fail('assessment-new-scoring', 'year4.js missing pathfinder trace/description scoring flags');
} else {
  pass('assessment-new-scoring');
}

// 6. Shared utility present
try {
  const utils = load('widgets/mcs-grid-path-utils.js');
  if (!utils.includes('MCS.gridPath')) {
    fail('shared-utils', 'mcs-grid-path-utils.js missing MCS.gridPath export');
  } else {
    pass('shared-utils');
  }
} catch {
  fail('shared-utils', 'widgets/mcs-grid-path-utils.js not found');
}

console.log('=== G4 AC9M4SP02 Validity Audit ===\n');

let failed = 0;
checks.forEach(({ name, ok, detail }) => {
  if (ok) {
    console.log(`PASS — ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL — ${name}${detail ? ': ' + detail : ''}`);
  }
});

console.log('\n=== Summary ===');
if (failed) {
  console.log(`FAIL — ${failed}/${checks.length} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`PASS — all ${checks.length} AC9M4SP02 validity checks passed.`);
}

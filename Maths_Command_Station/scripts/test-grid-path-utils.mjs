/**
 * Node unit tests for MCS.gridPath utilities.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const sandbox = { window: {}, globalThis: {} };
sandbox.window = sandbox;
vm.runInNewContext(readFileSync(join(root, 'widgets/mcs-grid-path-utils.js'), 'utf8'), sandbox);
const { gridPath } = sandbox.MCS;

const cols = ['A', 'B', 'C', 'D', 'E'];
const rows = [5, 4, 3, 2, 1];
const start = { col: 'A', row: 1 };
const steps = [{ dir: 'east', count: 2 }, { dir: 'north', count: 3 }];
const expectedPath = gridPath.computeGridRoute(start, steps, cols, rows);

let failed = 0;

function assert(name, condition) {
  if (condition) {
    console.log(`PASS — ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL — ${name}`);
  }
}

assert('A1 east2 north3 path length', expectedPath.length === 6);
assert(
  'A1 east2 north3 ends C4',
  expectedPath[5].col === 'C' && expectedPath[5].row === 4
);

const fullTrace = gridPath.validateTracedPath({ expectedPath, tracedPath: expectedPath });
assert('full trace passes', fullTrace.correct);

const destOnly = gridPath.validateTracedPath({
  expectedPath,
  tracedPath: [{ col: 'C', row: 4 }],
});
assert('destination-only fails', !destOnly.correct);

const jump = gridPath.validateTracedPath({
  expectedPath,
  tracedPath: [
    { col: 'A', row: 1 },
    { col: 'C', row: 1 },
    { col: 'C', row: 2 },
    { col: 'C', row: 3 },
    { col: 'C', row: 4 },
  ],
});
assert('non-adjacent jump fails', !jump.correct);

const extra = gridPath.validateTracedPath({
  expectedPath,
  tracedPath: expectedPath.concat([{ col: 'C', row: 5 }]),
});
assert('extra cell fails', !extra.correct);

const created = gridPath.validateCreatedRoute({
  tracedPath: expectedPath,
  describedSteps: steps,
  start,
  end: { col: 'C', row: 4 },
  blockedCells: [{ col: 'B', row: 3 }],
  cols,
  rows,
});
assert('valid created route passes', created.correct);

const blocked = gridPath.validateCreatedRoute({
  tracedPath: [
    { col: 'A', row: 1 },
    { col: 'B', row: 1 },
    { col: 'B', row: 2 },
    { col: 'B', row: 3 },
    { col: 'C', row: 3 },
    { col: 'C', row: 4 },
  ],
  describedSteps: [
    { dir: 'east', count: 1 },
    { dir: 'south', count: 2 },
    { dir: 'east', count: 1 },
    { dir: 'north', count: 1 },
  ],
  start,
  end: { col: 'C', row: 4 },
  blockedCells: [{ col: 'B', row: 3 }],
  cols,
  rows,
});
assert('blocked cell crossing fails', !blocked.correct);

console.log('\n=== Grid Path Utils Tests ===');
if (failed) {
  console.log(`FAIL — ${failed} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('PASS — all grid path utility tests passed.');
}

/**
 * Smoke test: pathway-create-route grid + route input interaction.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadGridPath() {
  const sandbox = { window: {}, globalThis: {} };
  sandbox.window = sandbox;
  vm.runInNewContext(readFileSync(join(root, 'widgets/mcs-grid-path-utils.js'), 'utf8'), sandbox);
  return sandbox.MCS.gridPath;
}

const gridPath = loadGridPath();
const cols = ['A', 'B', 'C', 'D', 'E'];
const rows = [5, 4, 3, 2, 1];
const start = { col: 'B', row: 4 };
const end = { col: 'E', row: 2 };
const blockedCells = [{ col: 'C', row: 2 }, { col: 'C', row: 3 }, { col: 'D', row: 2 }];

// Valid path avoiding blocked cells: B4 -> B5 -> C5 -> D5 -> E5 -> E4 -> E3 -> E2
const validSteps = [
  { dir: 'north', count: 1 },
  { dir: 'east', count: 3 },
  { dir: 'south', count: 3 },
];
const validPath = gridPath.computeGridRoute(start, validSteps, cols, rows);
const validation = gridPath.validateCreatedRoute({
  tracedPath: validPath,
  describedSteps: validSteps,
  start,
  end,
  blockedCells,
  cols,
  rows,
});

if (!validation.correct) {
  console.error('FAIL — valid path fixture invalid:', validation.errors);
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://127.0.0.1:8877/year4-practice.html', { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof MCS !== 'undefined' && MCS.runQuestion);

const result = await page.evaluate(({ validPath, validSteps }) => {
  const scenario = {
    descriptor: 'AC9M4SP02',
    context: 'pathway-create-route',
    category: 'space',
    title: 'CREATE A ROUTE',
    prompt: 'Create a route from **Library** to **Park**. Do not cross blocked cells.',
    widgets: [
      {
        id: 'grid',
        type: 'coordinate-plotter',
        config: {
          mode: 'alpha-grid',
          band: 'C',
          cols: ['A', 'B', 'C', 'D', 'E'],
          rows: [5, 4, 3, 2, 1],
          landmarks: [
            { col: 'B', row: 4, icon: '📚', name: 'Library' },
            { col: 'E', row: 2, icon: '🌳', name: 'Park' },
          ],
          blockedCells: [{ col: 'C', row: 2 }, { col: 'C', row: 3 }, { col: 'D', row: 2 }],
          selectionMode: 'path-trace',
          startCell: { col: 'B', row: 4 },
          endCell: { col: 'E', row: 2 },
          showStartMarker: true,
          showEndMarker: true,
          enforceStartFirst: true,
        },
      },
    ],
    inputs: [
      {
        id: 'route',
        type: 'route-description-input',
        config: {
          maxSteps: 6,
          directions: ['north', 'east', 'south', 'west'],
          counts: [1, 2, 3, 4],
        },
      },
    ],
    evaluate(values) {
      return MCS.gridPath.validateCreatedRoute({
        tracedPath: values.grid && values.grid.tracedPath,
        describedSteps: values.route && values.route.steps,
        start: { col: 'B', row: 4 },
        end: { col: 'E', row: 2 },
        blockedCells: [{ col: 'C', row: 2 }, { col: 'C', row: 3 }, { col: 'D', row: 2 }],
        cols: ['A', 'B', 'C', 'D', 'E'],
        rows: [5, 4, 3, 2, 1],
      }).correct;
    },
  };

  const mount = document.getElementById('prac-interactive-panel');
  mount.innerHTML = '';
  const session = MCS.runQuestion(scenario, { widgetMount: mount, band: 'C' });

  const gridInst = session.instances.grid;
  const routeInst = session.instances.route;
  const before = gridInst.getValue();
  const wrongCell = mount.querySelector('[data-col="E"][data-row="2"]');
  wrongCell?.click();
  const afterWrongStart = gridInst.getValue();

  validPath.slice(1).forEach((point) => {
    const cell = mount.querySelector(`[data-col="${point.col}"][data-row="${point.row}"]`);
    cell?.click();
  });
  const afterTrace = gridInst.getValue();
  routeInst.setValue({ steps: validSteps });
  const ok = session.evaluate();

  return {
    hasRouteInput: !!mount.querySelector('.mcs-route-description-input'),
    hasGridButtons: mount.querySelectorAll('.alpha-grid-cell:not(.label-cell)').length,
    beforeLen: before.tracedPath?.length || 0,
    afterWrongLen: afterWrongStart.tracedPath?.length || 0,
    afterTraceLen: afterTrace.tracedPath?.length || 0,
    afterTraceCells: afterTrace.cells,
    evaluateOk: ok,
  };
}, { validPath, validSteps });

await browser.close();

console.log('Interaction result:', result);
if (errors.length) {
  console.error('Page errors:', errors);
  process.exit(1);
}

let failed = 0;
if (!result.hasRouteInput) {
  console.log('FAIL — route-description-input not mounted');
  failed += 1;
} else {
  console.log('PASS — route-description-input mounted');
}

if (result.beforeLen !== 1) {
  console.log('FAIL — start cell should be pre-seeded, length', result.beforeLen);
  failed += 1;
} else {
  console.log('PASS — start cell pre-seeded');
}

if (result.afterWrongLen !== 1) {
  console.log('FAIL — non-adjacent first tap should not extend route, got length', result.afterWrongLen);
  failed += 1;
} else {
  console.log('PASS — non-adjacent tap rejected while route in progress');
}

if (result.afterTraceLen !== validPath.length) {
  console.log('FAIL — traced path length', result.afterTraceLen, 'expected', validPath.length);
  failed += 1;
} else {
  console.log('PASS — full path traced via clicks');
}

if (!result.evaluateOk) {
  console.log('FAIL — evaluate returned false after valid trace + steps');
  failed += 1;
} else {
  console.log('PASS — evaluate accepts valid trace + matching steps');
}

process.exitCode = failed ? 1 : 0;

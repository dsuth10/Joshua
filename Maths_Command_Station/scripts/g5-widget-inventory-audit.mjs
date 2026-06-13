/**
 * Gate G5 Slice 0 — Band-A / Prep–Y2 widget inventory vs registrations.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const widgetsDir = join(root, 'widgets');

/** Phase 5 widgets from doc 04 §3 + 07 §Phase 5.1 */
const PHASE5_WIDGETS = [
  { id: 'counters', modes: ['free-count', 'compare-zones', 'make-equal-groups'], priority: 'P1', note: 'all three modes shipped' },
  { id: 'ten-frame', modes: ['show-me', 'fill-to', 'make-ten', 'double-frame'], priority: 'P1' },
  { id: 'number-pad', modes: ['0-10'], priority: 'P1' },
  { id: 'sorting-table', modes: ['sequence-lane', 'shape-hangars'], priority: 'P1' },
  { id: 'pattern-blocks', modes: ['continue-pattern'], priority: 'P2' },
  { id: 'number-track', modes: ['missing-numbers', 'count-by'], priority: 'P2', note: 'sieve-shade exists' },
  { id: 'ruler', modes: ['informal-compare', 'informal-units'], priority: 'P2' },
  { id: 'capacity-jug', modes: ['compare'], priority: 'P2' },
  { id: 'balance-scale', modes: ['compare'], priority: 'P2', note: 'solve-unknown exists' },
  { id: 'shape-builder', modes: ['copy-shape'], priority: 'P3', year: 'Y1' },
  { id: 'transform-board', modes: ['single-step'], priority: 'P3', year: 'Y2', note: 'full modes exist' },
];

function collectRegistrations() {
  const files = readdirSync(widgetsDir).filter(
    (f) => (f.startsWith('mcs-widgets-') || f === 'mcs-input.js') && f.endsWith('.js')
  );
  const found = new Set();
  const re = /MCS\.register\(\s*['"]([^'"]+)['"]/g;
  for (const file of files) {
    const text = readFileSync(join(widgetsDir, file), 'utf8');
    let m;
    while ((m = re.exec(text)) !== null) {
      found.add(m[1]);
    }
  }
  return found;
}

function main() {
  console.log('=== Gate G5 — Widget Inventory Audit ===\n');
  const registered = collectRegistrations();
  let missing = 0;
  let present = 0;

  for (const w of PHASE5_WIDGETS) {
    const ok = registered.has(w.id);
    if (ok) present += 1;
    else missing += 1;
    const tag = ok ? 'REGISTERED' : 'MISSING';
    const note = w.note ? ` (${w.note})` : '';
    console.log(`${ok ? '✓' : '✗'} ${w.id} [${w.priority}]${note} — ${tag}`);
    console.log(`    modes: ${w.modes.join(', ')}`);
  }

  console.log('\n--- Prep practice page ---');
  const prepJs = join(root, 'prep-practice.js');
  try {
    readFileSync(prepJs, 'utf8');
    console.log('PASS — prep-practice.js exists');
  } catch {
    console.log('FAIL — prep-practice.js not found');
    missing += 1;
  }

  console.log('\n--- Slice 5.1 gate ---');
  const slice1Ok = registered.has('counters');
  console.log(slice1Ok ? 'PASS — counters registered (Slice 5.1 widget)' : 'FAIL — counters not registered');

  console.log('\n--- Slice 5.2 gate ---');
  const slice2Widgets = registered.has('ten-frame') && registered.has('number-pad');
  const prepSrc = readFileSync(join(root, 'prep-practice.js'), 'utf8');
  const slice2Context = prepSrc.includes('ten-frame-subitise');
  console.log(slice2Widgets ? 'PASS — ten-frame + number-pad registered' : 'FAIL — missing ten-frame or number-pad');
  console.log(slice2Context ? 'PASS — F2 generator ten-frame-subitise in prep-practice.js' : 'FAIL — F2 generator missing');

  console.log('\n--- Slice 5.3 gate ---');
  const slice3Contexts =
    prepSrc.includes('compare-zones-more-fewer') && prepSrc.includes('make-equal-groups-share');
  const slice3Modes =
    /mode === 'compare-zones'/.test(readFileSync(join(root, 'widgets', 'mcs-widgets-number.js'), 'utf8')) &&
    /mode === 'make-equal-groups'/.test(readFileSync(join(root, 'widgets', 'mcs-widgets-number.js'), 'utf8'));
  console.log(slice3Modes ? 'PASS — counters compare-zones + make-equal-groups modes' : 'FAIL — counters modes missing');
  console.log(slice3Contexts ? 'PASS — F3 + F5 generators in prep-practice.js' : 'FAIL — F3/F5 generators missing');

  console.log('\n--- Slice 5.4 gate ---');
  const slice4Modes =
    /function tenFrameFillInteractive/.test(readFileSync(join(root, 'widgets', 'mcs-widgets-number.js'), 'utf8'));
  const slice4Contexts =
    prepSrc.includes('ten-frame-fill-five') &&
    prepSrc.includes('ten-frame-fill-ten') &&
    prepSrc.includes('ten-frame-make-ten');
  console.log(slice4Modes ? 'PASS — ten-frame fill-to + make-ten modes' : 'FAIL — ten-frame fill modes missing');
  console.log(slice4Contexts ? 'PASS — F4 generators in prep-practice.js' : 'FAIL — F4 generators missing');

  console.log('\n--- Slice 5.5 gate ---');
  const dataSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-data.js'), 'utf8');
  const slice5Widget = registered.has('sorting-table');
  const slice5Mode = /function sortingTableSequenceLane/.test(dataSrc);
  const slice5Context = prepSrc.includes('sequence-lane-mission-day');
  const slice5Tab = prepSrc.includes('generateMissionDayOrder');
  console.log(slice5Widget ? 'PASS — sorting-table registered' : 'FAIL — sorting-table not registered');
  console.log(slice5Mode ? 'PASS — sequence-lane mode in mcs-widgets-data.js' : 'FAIL — sequence-lane mode missing');
  console.log(slice5Context ? 'PASS — F8 generator sequence-lane-mission-day in prep-practice.js' : 'FAIL — F8 generator missing');
  console.log(slice5Tab ? 'PASS — patterns strand generator wired' : 'FAIL — patterns generator missing');

  console.log('\n--- Slice 5.6 gate ---');
  const spaceSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-space.js'), 'utf8');
  const slice6Widget = registered.has('pattern-blocks');
  const slice6Mode = /function patternBlocksContinuePattern/.test(spaceSrc);
  const slice6Context = prepSrc.includes('continue-pattern-ab-blocks');
  console.log(slice6Widget ? 'PASS — pattern-blocks registered' : 'FAIL — pattern-blocks not registered');
  console.log(slice6Mode ? 'PASS — continue-pattern mode in mcs-widgets-space.js' : 'FAIL — continue-pattern mode missing');
  console.log(slice6Context ? 'PASS — F6 generator continue-pattern-ab-blocks in prep-practice.js' : 'FAIL — F6 generator missing');

  console.log('\n=== Summary ===');
  console.log(`${present}/${PHASE5_WIDGETS.length} Phase 5 widgets registered · ${missing} gaps remaining`);
  if (
    !slice1Ok ||
    !slice2Widgets ||
    !slice2Context ||
    !slice3Modes ||
    !slice3Contexts ||
    !slice4Modes ||
    !slice4Contexts ||
    !slice5Widget ||
    !slice5Mode ||
    !slice5Context ||
    !slice6Widget ||
    !slice6Mode ||
    !slice6Context
  ) {
    process.exitCode = 1;
  }
}

main();

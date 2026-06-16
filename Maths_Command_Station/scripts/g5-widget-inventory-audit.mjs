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
  { id: 'sorting-table', modes: ['sequence-lane', 'shape-hangars', 'picture-graph'], priority: 'P1' },
  { id: 'pattern-blocks', modes: ['continue-pattern'], priority: 'P2' },
  { id: 'number-track', modes: ['missing-numbers', 'count-by', 'sieve-shade'], priority: 'P2', note: 'Y1 missing/count-by + Y6 sieve' },
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

  console.log('\n--- Slice 5.5b gate (F9 + F11) ---');
  const slice5bModes =
    /function sortingTableCategoryColumns/.test(dataSrc) &&
    /mode === 'shape-hangars'/.test(dataSrc) &&
    /mode === 'picture-graph'/.test(dataSrc);
  const slice5bContexts =
    prepSrc.includes('shape-hangars-sort-shapes') && prepSrc.includes('picture-graph-crew-yes-no');
  const slice5bTabs =
    prepSrc.includes('generateShapeHangars') && prepSrc.includes('generatePictureGraphSort');
  console.log(slice5bModes ? 'PASS — shape-hangars + picture-graph modes' : 'FAIL — F9/F11 modes missing');
  console.log(slice5bContexts ? 'PASS — F9 + F11 frozen contexts in prep-practice.js' : 'FAIL — F9/F11 contexts missing');
  console.log(slice5bTabs ? 'PASS — space + statistics generators wired' : 'FAIL — F9/F11 generators missing');

  console.log('\n--- Slice 5.9 gate ---');
  const commonSrc = readFileSync(join(root, 'band-a-practice-common.js'), 'utf8');
  const slice9Common =
    /MCSBandA/.test(commonSrc) &&
    /renderBadgeShelf/.test(commonSrc) &&
    /applyStrandTabs/.test(commonSrc);
  const slice9PrepChrome =
    readFileSync(join(root, 'prep-practice.html'), 'utf8').includes('data-strand=') &&
    readFileSync(join(root, 'prep-practice.html'), 'utf8').includes('btn-adult-console');
  const slice9Y1Html = readFileSync(join(root, 'year1-practice.html'), 'utf8');
  const slice9Y1Js = readFileSync(join(root, 'year1-practice.js'), 'utf8');
  const slice9Y1Page = slice9Y1Html.includes('PRAC_Y1') && slice9Y1Js.includes('scoresByCatY1');
  const slice9Y1Scaffold = slice9Y1Js.includes('generators') && slice9Y1Html.includes('band-y1-layout');
  console.log(slice9Common ? 'PASS — band-a-practice-common.js shared chrome' : 'FAIL — Band A common module missing');
  console.log(slice9PrepChrome ? 'PASS — prep strand tabs + adult console' : 'FAIL — prep Band A chrome incomplete');
  console.log(slice9Y1Page ? 'PASS — year1-practice.html/js scaffold' : 'FAIL — year1 practice page missing');
  console.log(slice9Y1Scaffold ? 'PASS — Y1 scoresByCatY1 + strand placeholders' : 'FAIL — Y1 scaffold incomplete');

  console.log('\n--- Slice 5.10 gate ---');
  const numberSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-number.js'), 'utf8');
  const slice10Modes =
    /function numberTrackMissingNumbers/.test(numberSrc) &&
    /function numberTrackCountBy/.test(numberSrc);
  const slice10Contexts =
    slice9Y1Js.includes('number-track-missing-next') &&
    slice9Y1Js.includes('number-track-count-by-steps');
  const slice10Generators =
    slice9Y1Js.includes('generateMissingNext') && slice9Y1Js.includes('generateCountBy');
  console.log(slice10Modes ? 'PASS — number-track missing-numbers + count-by modes' : 'FAIL — Y1 track modes missing');
  console.log(slice10Contexts ? 'PASS — Y1-1 + Y1-4 frozen contexts' : 'FAIL — Y1 track contexts missing');
  console.log(slice10Generators ? 'PASS — Y1 number generators wired' : 'FAIL — Y1 generators missing');

  console.log('\n--- Slice 5.10b gate (Y1-2 teen partition) ---');
  const slice10bMode = /function tenFrameDoubleFrame/.test(numberSrc);
  const slice10bContext = slice9Y1Js.includes('teen-partition-double-frame');
  const slice10bGenerator = slice9Y1Js.includes('generateTeenPartition');
  console.log(slice10bMode ? 'PASS — ten-frame double-frame mode' : 'FAIL — double-frame mode missing');
  console.log(slice10bContext ? 'PASS — Y1-2 frozen context teen-partition-double-frame' : 'FAIL — Y1-2 context missing');
  console.log(slice10bGenerator ? 'PASS — Y1-2 generator wired on Numbers tab' : 'FAIL — Y1-2 generator missing');

  console.log('\n--- Slice 5.10c gate (Y1-3 number-line jumps) ---');
  const slice10cMode = /function createNumberLineJump/.test(numberSrc);
  const slice10cContext = slice9Y1Js.includes('number-line-jump-within-twenty');
  const slice10cGenerator =
    slice9Y1Js.includes('generateNumberLineJump') &&
    /algebra: \[generateNumberLineJump\]/.test(slice9Y1Js);
  console.log(slice10cMode ? 'PASS — number-line jump mode' : 'FAIL — jump mode missing');
  console.log(slice10cContext ? 'PASS — Y1-3 frozen context number-line-jump-within-twenty' : 'FAIL — Y1-3 context missing');
  console.log(slice10cGenerator ? 'PASS — Y1-3 generator on Add & Take tab' : 'FAIL — Y1-3 generator missing');

  console.log('\n--- Slice 5.6 gate ---');
  const spaceSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-space.js'), 'utf8');
  const slice6Widget = registered.has('pattern-blocks');
  const slice6Mode = /function patternBlocksContinuePattern/.test(spaceSrc);
  const slice6Context = prepSrc.includes('continue-pattern-ab-blocks');
  console.log(slice6Widget ? 'PASS — pattern-blocks registered' : 'FAIL — pattern-blocks not registered');
  console.log(slice6Mode ? 'PASS — continue-pattern mode in mcs-widgets-space.js' : 'FAIL — continue-pattern mode missing');
  console.log(slice6Context ? 'PASS — F6 generator continue-pattern-ab-blocks in prep-practice.js' : 'FAIL — F6 generator missing');

  console.log('\n--- Slice 5.7 gate ---');
  const measureSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-measure.js'), 'utf8');
  const slice7Widgets =
    registered.has('ruler') && registered.has('balance-scale') && registered.has('capacity-jug');
  const slice7Modes =
    /function rulerInformalCompare/.test(measureSrc) &&
    /function balanceScaleCompare/.test(measureSrc) &&
    /function capacityJugCompare/.test(measureSrc);
  const slice7Contexts =
    prepSrc.includes('ruler-informal-compare-longer') &&
    prepSrc.includes('balance-scale-compare-heavier') &&
    prepSrc.includes('capacity-jug-compare-more');
  const slice7Tab = prepSrc.includes('generateCompareLength');
  console.log(slice7Widgets ? 'PASS — ruler + balance-scale + capacity-jug registered' : 'FAIL — measurement widgets missing');
  console.log(slice7Modes ? 'PASS — compare modes in mcs-widgets-measure.js' : 'FAIL — compare modes missing');
  console.log(slice7Contexts ? 'PASS — F7 generators in prep-practice.js' : 'FAIL — F7 generators missing');
  console.log(slice7Tab ? 'PASS — measuring strand generator wired' : 'FAIL — measuring generator missing');

  console.log('\n--- Slice 5.8 gate ---');
  const slice8Mode = /mcs-alpha-grid-positional/.test(spaceSrc) && /config\.positional/.test(spaceSrc);
  const slice8Contexts =
    prepSrc.includes('alpha-grid-positional-in-front') &&
    prepSrc.includes('alpha-grid-positional-behind') &&
    prepSrc.includes('alpha-grid-positional-next-to');
  const slice8Tab = prepSrc.includes('generatePositionalRover');
  console.log(slice8Mode ? 'PASS — alpha-grid positional mode in mcs-widgets-space.js' : 'FAIL — positional mode missing');
  console.log(slice8Contexts ? 'PASS — F10 generators in prep-practice.js' : 'FAIL — F10 generators missing');
  console.log(slice8Tab ? 'PASS — space strand generator wired' : 'FAIL — space generator missing');

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
    !slice5bModes ||
    !slice5bContexts ||
    !slice9Common ||
    !slice9PrepChrome ||
    !slice9Y1Page ||
    !slice9Y1Scaffold ||
    !slice10Modes ||
    !slice10Contexts ||
    !slice10Generators ||
    !slice10bMode ||
    !slice10bContext ||
    !slice10bGenerator ||
    !slice10cMode ||
    !slice10cContext ||
    !slice10cGenerator ||
    !slice6Widget ||
    !slice6Mode ||
    !slice6Context ||
    !slice7Widgets ||
    !slice7Modes ||
    !slice7Contexts ||
    !slice8Mode ||
    !slice8Contexts
  ) {
    process.exitCode = 1;
  }
}

main();

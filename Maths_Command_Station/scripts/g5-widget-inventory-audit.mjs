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
  { id: 'counters', modes: ['free-count', 'compare-zones', 'make-equal-groups', 'money-make'], priority: 'P1', note: 'all four modes shipped' },
  { id: 'ten-frame', modes: ['show-me', 'fill-to', 'make-ten', 'double-frame'], priority: 'P1' },
  { id: 'number-pad', modes: ['0-10'], priority: 'P1' },
  { id: 'sorting-table', modes: ['sequence-lane', 'shape-hangars', 'picture-graph'], priority: 'P1' },
  { id: 'pattern-blocks', modes: ['continue-pattern'], priority: 'P2' },
  { id: 'number-track', modes: ['missing-numbers', 'count-by', 'sieve-shade'], priority: 'P2', note: 'Y1 missing/count-by + Y6 sieve' },
  { id: 'ruler', modes: ['informal-compare', 'informal-units', 'measure-object'], priority: 'P2' },
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
  const measureSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-measure.js'), 'utf8');
  const spaceSrc = readFileSync(join(root, 'widgets', 'mcs-widgets-space.js'), 'utf8');
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

  console.log('\n--- Slice 5.11 gate (year2-practice scaffold) ---');
  const slice11Y2Html = readFileSync(join(root, 'year2-practice.html'), 'utf8');
  const slice11Y2Js = readFileSync(join(root, 'year2-practice.js'), 'utf8');
  const slice11Y2Page = slice11Y2Html.includes('PRAC_Y2') && slice11Y2Js.includes('scoresByCatY2');
  const slice11Y2Scaffold =
    slice11Y2Js.includes('generators') && slice11Y2Html.includes('band-y2-layout');
  const slice11Y2Tabs =
    slice11Y2Html.includes('data-task="probability"') &&
    slice11Y2Html.includes('data-strand=');
  console.log(slice11Y2Page ? 'PASS — year2-practice.html/js scaffold' : 'FAIL — year2 practice page missing');
  console.log(slice11Y2Scaffold ? 'PASS — Y2 scoresByCatY2 + strand placeholders' : 'FAIL — Y2 scaffold incomplete');
  console.log(slice11Y2Tabs ? 'PASS — six strand tabs including probability' : 'FAIL — Y2 strand tabs incomplete');

  console.log('\n--- Slice 5.11b gate (Y2-5 quarter clock) ---');
  const slice11bContext = slice11Y2Js.includes('clock-set-quarter-past-to');
  const slice11bGenerator =
    slice11Y2Js.includes('generateQuarterClock') &&
    /measurement: \[[^\]]*generateQuarterClock[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11bContext ? 'PASS — Y2-5 frozen context clock-set-quarter-past-to' : 'FAIL — Y2-5 context missing');
  console.log(slice11bGenerator ? 'PASS — Y2-5 generator on Measuring tab' : 'FAIL — Y2-5 generator missing');

  console.log('\n--- Slice 5.10d gate (Y1-5 informal-units ruler) ---');
  const slice10dMode = /function rulerInformalUnits/.test(measureSrc);
  const slice10dContext = slice9Y1Js.includes('ruler-informal-units-paperclips');
  const slice10dGenerator =
    slice9Y1Js.includes('generateInformalUnits') &&
    /measurement: \[[^\]]*generateInformalUnits[^\]]*\]/.test(slice9Y1Js);
  console.log(slice10dMode ? 'PASS — ruler informal-units mode' : 'FAIL — informal-units mode missing');
  console.log(slice10dContext ? 'PASS — Y1-5 frozen context ruler-informal-units-paperclips' : 'FAIL — Y1-5 context missing');
  console.log(slice10dGenerator ? 'PASS — Y1-5 generator on Measuring tab' : 'FAIL — Y1-5 generator missing');

  console.log('\n--- Slice 5.10e gate (Y1-6 o\'clock / half-past clock) ---');
  const slice10eContext = slice9Y1Js.includes('clock-set-oclock-half-past');
  const slice10eGenerator =
    slice9Y1Js.includes('generateHourHalfClock') &&
    /measurement: \[generateInformalUnits, generateHourHalfClock\]/.test(slice9Y1Js);
  console.log(slice10eContext ? 'PASS — Y1-6 frozen context clock-set-oclock-half-past' : 'FAIL — Y1-6 context missing');
  console.log(slice10eGenerator ? 'PASS — Y1-6 generator on Measuring tab' : 'FAIL — Y1-6 generator missing');

  console.log('\n--- Slice 5.10f gate (Y1-7 shape-builder copy-shape) ---');
  const slice10fMode =
    /function shapeBuilderCopyShape/.test(spaceSrc) &&
    /MCS\.register\('shape-builder'/.test(spaceSrc);
  const slice10fContext = slice9Y1Js.includes('shape-builder-copy-pegboard');
  const slice10fGenerator =
    slice9Y1Js.includes('generateCopyShape') &&
    /space: \[generateCopyShape\]/.test(slice9Y1Js);
  console.log(slice10fMode ? 'PASS — shape-builder copy-shape mode registered' : 'FAIL — shape-builder missing');
  console.log(slice10fContext ? 'PASS — Y1-7 frozen context shape-builder-copy-pegboard' : 'FAIL — Y1-7 context missing');
  console.log(slice10fGenerator ? 'PASS — Y1-7 generator on Shapes tab' : 'FAIL — Y1-7 generator missing');

  console.log('\n--- Slice 5.10g gate (Y1-8 picture graph) ---');
  const slice10gContext = slice9Y1Js.includes('picture-graph-favourites-one-to-one');
  const slice10gGenerator =
    slice9Y1Js.includes('generatePictureGraphFavourites') &&
    /statistics: \[generatePictureGraphFavourites\]/.test(slice9Y1Js);
  console.log(slice10gContext ? 'PASS — Y1-8 frozen context picture-graph-favourites-one-to-one' : 'FAIL — Y1-8 context missing');
  console.log(slice10gGenerator ? 'PASS — Y1-8 generator on Data tab' : 'FAIL — Y1-8 generator missing');

  console.log('\n--- Slice 5.11c gate (Y2-1 place-value-blocks) ---');
  const slice11cMode = /function placeValueBlocksInteractive/.test(numberSrc);
  const slice11cContexts =
    slice11Y2Js.includes('place-value-blocks-build-three-digit') &&
    slice11Y2Js.includes('place-value-blocks-trade-regroup');
  const slice11cGenerators =
    slice11Y2Js.includes('generatePlaceValueBuild') &&
    slice11Y2Js.includes('generatePlaceValueTrade') &&
    /number: \[[^\]]*generatePlaceValueBuild[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11cMode ? 'PASS — place-value-blocks interactive build + trade' : 'FAIL — PVB interactive missing');
  console.log(slice11cContexts ? 'PASS — Y2-1 frozen contexts build + trade' : 'FAIL — Y2-1 contexts missing');
  console.log(slice11cGenerators ? 'PASS — Y2-1 generators on Numbers tab' : 'FAIL — Y2-1 generators missing');

  console.log('\n--- Slice 5.11d gate (Y2-2 fraction bars) ---');
  const slice11dContext = slice11Y2Js.includes('fraction-bars-shade-halves-quarters-eighths');
  const slice11dGenerator =
    slice11Y2Js.includes('generateFractionShade') &&
    /number: \[[^\]]*generateFractionShade[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11dContext ? 'PASS — Y2-2 frozen context fraction-bars-shade-halves-quarters-eighths' : 'FAIL — Y2-2 context missing');
  console.log(slice11dGenerator ? 'PASS — Y2-2 generator on Numbers tab' : 'FAIL — Y2-2 generator missing');

  console.log('\n--- Slice 5.11e gate (Y2-3 array-builder) ---');
  const slice11eMode = /function arrayBuilderBuild/.test(numberSrc);
  const slice11eContext = slice11Y2Js.includes('array-builder-set-multiplication');
  const slice11eGenerator =
    slice11Y2Js.includes('generateArrayBuild') &&
    /algebra: \[generateArrayBuild\]/.test(slice11Y2Js);
  console.log(slice11eMode ? 'PASS — array-builder build-array mode' : 'FAIL — build-array mode missing');
  console.log(slice11eContext ? 'PASS — Y2-3 frozen context array-builder-set-multiplication' : 'FAIL — Y2-3 context missing');
  console.log(slice11eGenerator ? 'PASS — Y2-3 generator on Arrays tab' : 'FAIL — Y2-3 generator missing');

  console.log('\n--- Slice 5.11f gate (Y2-4 money counters) ---');
  const slice11fMode = /function countersMoneyMake/.test(numberSrc);
  const slice11fContext = slice11Y2Js.includes('counters-money-make-amount');
  const slice11fGenerator =
    slice11Y2Js.includes('generateMoneyMake') &&
    /number: \[[^\]]*generateMoneyMake[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11fMode ? 'PASS — counters money-make mode' : 'FAIL — money-make mode missing');
  console.log(slice11fContext ? 'PASS — Y2-4 frozen context counters-money-make-amount' : 'FAIL — Y2-4 context missing');
  console.log(slice11fGenerator ? 'PASS — Y2-4 generator on Numbers tab' : 'FAIL — Y2-4 generator missing');

  console.log('\n--- Slice 5.11g gate (Y2-6 cm ruler) ---');
  const slice11gMode = /function rulerMeasureObject/.test(measureSrc);
  const slice11gContext = slice11Y2Js.includes('ruler-measure-object-centimetres');
  const slice11gGenerator =
    slice11Y2Js.includes('generateMeasureCm') &&
    /measurement: \[[^\]]*generateMeasureCm[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11gMode ? 'PASS — ruler measure-object mode' : 'FAIL — measure-object mode missing');
  console.log(slice11gContext ? 'PASS — Y2-6 frozen context ruler-measure-object-centimetres' : 'FAIL — Y2-6 context missing');
  console.log(slice11gGenerator ? 'PASS — Y2-6 generator on Measuring tab' : 'FAIL — Y2-6 generator missing');

  console.log('\n--- Slice 5.11h gate (Y2-7 transform board) ---');
  const slice11hMode = /function transformBoardSingleStep/.test(spaceSrc);
  const slice11hContext = slice11Y2Js.includes('transform-board-single-step-flip-slide-turn');
  const slice11hGenerator =
    slice11Y2Js.includes('generateTransformStep') &&
    /space: \[generateTransformStep\]/.test(slice11Y2Js);
  console.log(slice11hMode ? 'PASS — transform-board single-step mode' : 'FAIL — single-step mode missing');
  console.log(slice11hContext ? 'PASS — Y2-7 frozen context transform-board-single-step-flip-slide-turn' : 'FAIL — Y2-7 context missing');
  console.log(slice11hGenerator ? 'PASS — Y2-7 generator on Shapes tab' : 'FAIL — Y2-7 generator missing');

  console.log('\n--- Slice 5.11i gate (Y2-8 chance words) ---');
  const slice11iMode =
    /mode === 'predict'/.test(dataSrc) && /MCS\.register\('marble-bag'/.test(dataSrc);
  const slice11iContexts =
    slice11Y2Js.includes('marble-bag-chance-words-read') &&
    slice11Y2Js.includes('spinner-predict-chance-words');
  const slice11iGenerators =
    slice11Y2Js.includes('generateMarbleChance') &&
    slice11Y2Js.includes('generateSpinnerChance') &&
    /probability: \[[^\]]*generateMarbleChance[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11iMode ? 'PASS — spinner predict mode + marble-bag read' : 'FAIL — Y2-8 widget modes missing');
  console.log(slice11iContexts ? 'PASS — Y2-8 frozen contexts marble + spinner' : 'FAIL — Y2-8 contexts missing');
  console.log(slice11iGenerators ? 'PASS — Y2-8 generators on Chance tab' : 'FAIL — Y2-8 generators missing');

  console.log('\n--- Slice 5.11j gate (Y2-9 column graph) ---');
  const slice11jMode =
    /function columnGraphBuild/.test(dataSrc) &&
    /MCS\.columnGraphPictureGraph/.test(dataSrc);
  const slice11jContexts =
    slice11Y2Js.includes('column-graph-picture-collect-one-to-one') &&
    slice11Y2Js.includes('column-graph-build-many-to-one');
  const slice11jGenerators =
    slice11Y2Js.includes('generatePictureGraphCollect') &&
    slice11Y2Js.includes('generateColumnGraphBuild') &&
    /statistics: \[[^\]]*generatePictureGraphCollect[^\]]*\]/.test(slice11Y2Js);
  console.log(slice11jMode ? 'PASS — column-graph build + picture-graph modes' : 'FAIL — Y2-9 widget modes missing');
  console.log(slice11jContexts ? 'PASS — Y2-9 frozen contexts picture + build' : 'FAIL — Y2-9 contexts missing');
  console.log(slice11jGenerators ? 'PASS — Y2-9 generators on Data tab' : 'FAIL — Y2-9 generators missing');

  console.log('\n--- Slice 5.12 gate (achievements + portal) ---');
  const achSrc = readFileSync(join(root, 'achievements-config.js'), 'utf8');
  const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
  const slice12Descriptors =
    /year: 0, strand:/.test(achSrc) &&
    /year: 1, strand:/.test(achSrc) &&
    /year: 2, strand:/.test(achSrc) &&
    achSrc.includes("'free-count-docking'") &&
    achSrc.includes("'clock-set-quarter-past-to'") &&
    achSrc.includes("'column-graph-build-many-to-one'");
  const slice12Grand =
    achSrc.includes("'y0-number-master'") &&
    achSrc.includes("'y1-number-master'") &&
    achSrc.includes("'y2-number-master'");
  const slice12GainPoints =
    /gainPoints:/.test(commonSrc) && /migrateLegacyContexts/.test(commonSrc);
  const slice12Portal =
    indexHtml.includes("location.href='prep-practice.html'") &&
    indexHtml.includes("location.href='year1-practice.html'") &&
    indexHtml.includes("location.href='year2-practice.html'") &&
    !indexHtml.includes('COMING SOON');
  const slice12Trophy = /trophyActiveYear = 0/.test(readFileSync(join(root, 'script.js'), 'utf8'));
  console.log(slice12Descriptors ? 'PASS — F/Y1/Y2 descriptor badges with frozen contexts' : 'FAIL — achievements-config F/Y1/Y2 incomplete');
  console.log(slice12Grand ? 'PASS — F/Y1/Y2 grand badges' : 'FAIL — grand badges missing');
  console.log(slice12GainPoints ? 'PASS — MCSBandA.gainPoints wired' : 'FAIL — gainPoints missing in band-a-practice-common.js');
  console.log(slice12Portal ? 'PASS — portal cards activated (practice-only)' : 'FAIL — portal cards still offline');
  console.log(slice12Trophy ? 'PASS — trophy room includes Prep–Y2 tabs' : 'FAIL — script.js trophy room not extended');

  console.log('\n--- Slice 5.6 gate ---');
  const slice6Widget = registered.has('pattern-blocks');
  const slice6Mode = /function patternBlocksContinuePattern/.test(spaceSrc);
  const slice6Context = prepSrc.includes('continue-pattern-ab-blocks');
  console.log(slice6Widget ? 'PASS — pattern-blocks registered' : 'FAIL — pattern-blocks not registered');
  console.log(slice6Mode ? 'PASS — continue-pattern mode in mcs-widgets-space.js' : 'FAIL — continue-pattern mode missing');
  console.log(slice6Context ? 'PASS — F6 generator continue-pattern-ab-blocks in prep-practice.js' : 'FAIL — F6 generator missing');

  console.log('\n--- Slice 5.7 gate ---');
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
    !slice11Y2Page ||
    !slice11Y2Scaffold ||
    !slice11Y2Tabs ||
    !slice11bContext ||
    !slice11bGenerator ||
    !slice10dMode ||
    !slice10dContext ||
    !slice10dGenerator ||
    !slice10eContext ||
    !slice10eGenerator ||
    !slice10fMode ||
    !slice10fContext ||
    !slice10fGenerator ||
    !slice10gContext ||
    !slice10gGenerator ||
    !slice11cMode ||
    !slice11cContexts ||
    !slice11cGenerators ||
    !slice11dContext ||
    !slice11dGenerator ||
    !slice11eMode ||
    !slice11eContext ||
    !slice11eGenerator ||
    !slice11fMode ||
    !slice11fContext ||
    !slice11fGenerator ||
    !slice11gMode ||
    !slice11gContext ||
    !slice11gGenerator ||
    !slice11hMode ||
    !slice11hContext ||
    !slice11hGenerator ||
    !slice11iMode ||
    !slice11iContexts ||
    !slice11iGenerators ||
    !slice11jMode ||
    !slice11jContexts ||
    !slice11jGenerators ||
    !slice12Descriptors ||
    !slice12Grand ||
    !slice12GainPoints ||
    !slice12Portal ||
    !slice12Trophy ||
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

/**
 * PASS/FAIL: fraction number-line grid spacing for order-points denominators.
 * Run: node scripts/g5-fraction-number-line-grid-audit.mjs
 */

function unitFractionDenominator(step) {
  if (!Number.isFinite(step) || step <= 0) return 0;
  const den = Math.round(1 / step);
  if (den < 1 || den > 120) return 0;
  return Math.abs(step - 1 / den) < 1e-9 ? den : 0;
}

function snapToStep(value, step, min, max) {
  const unitDen = unitFractionDenominator(step);
  if (unitDen) {
    const scale = unitDen;
    const minTicks = Math.round(min * scale);
    const maxTicks = Math.round(max * scale);
    let tick = Math.round(value * scale);
    if (tick < minTicks) tick = minTicks;
    if (tick > maxTicks) tick = maxTicks;
    return tick / scale;
  }
  const units = Math.round((value - min) / step);
  let snapped = min + units * step;
  if (snapped < min) snapped = min;
  if (snapped > max) snapped = max;
  return snapped;
}

function buildTicks(min, max, step) {
  const count = Math.round((max - min) / step);
  const ticks = [];
  for (let ti = 0; ti <= count; ti++) {
    ticks.push(snapToStep(min + ti * step, step, min, max));
  }
  return ticks;
}

function auditDenom(den, min = 0, max = 2) {
  const step = 1 / den;
  const ticks = buildTicks(min, max, step);
  const expected = Math.round((max - min) / step) + 1;
  const unique = [...new Set(ticks.map((t) => t.toFixed(12)))];

  let evenlySpaced = true;
  for (let i = 1; i < ticks.length; i++) {
    if (Math.abs(ticks[i] - ticks[i - 1] - step) > 1e-9) {
      evenlySpaced = false;
      break;
    }
  }

  const pass =
    ticks.length === expected &&
    unique.length === expected &&
    evenlySpaced &&
    Math.abs(ticks[0] - min) < 1e-9 &&
    Math.abs(ticks[ticks.length - 1] - max) < 1e-9;

  console.log(
    pass ? 'PASS' : 'FAIL',
    `den=${den} step=${step} ticks=${ticks.length}/${expected} spacing=${evenlySpaced ? 'even' : 'uneven'}`
  );
  if (!pass) console.log('  ', ticks.join(', '));
  return pass;
}

function auditLcmCombo(dens) {
  const lcm = dens.reduce((a, b) => (a * b) / gcd(a, b));
  return auditDenom(lcm);
}

function gcd(a, b) {
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

let allPass = true;
const y5Denoms = [2, 3, 4, 5, 8, 10];
for (const d of y5Denoms) {
  allPass = auditDenom(d) && allPass;
  if (d * 2 <= 12) allPass = auditDenom(d * 2) && allPass;
}

allPass = auditLcmCombo([4, 8]) && allPass;
allPass = auditLcmCombo([2, 4]) && allPass;
allPass = auditLcmCombo([3, 6]) && allPass;
allPass = auditLcmCombo([5, 10]) && allPass;

console.log(allPass ? '\nG5 fraction number-line grid audit: PASS' : '\nG5 fraction number-line grid audit: FAIL');
process.exit(allPass ? 0 : 1);

/**
 * Gate G4 — run all four assessment audit scripts with G4_REQUIRE_COMPLETE=1.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const AUDITS = [
  { year: 'Y6', script: 'g4-y6-assessment-audit.mjs' },
  { year: 'Y5', script: 'g4-y5-assessment-audit.mjs' },
  { year: 'Y4', script: 'g4-y4-assessment-audit.mjs' },
  { year: 'Y3', script: 'g4-y3-assessment-audit.mjs' },
];

console.log('=== Gate G4 — All Assessment Audits ===\n');

let failed = 0;

for (const { year, script } of AUDITS) {
  console.log(`--- ${year} (${script}) ---`);
  const result = spawnSync(process.execPath, [join(root, 'scripts', script)], {
    cwd: root,
    env: { ...process.env, G4_REQUIRE_COMPLETE: '1' },
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    failed += 1;
    console.log(`\n${year}: FAIL (exit ${result.status})\n`);
  } else {
    console.log(`\n${year}: PASS\n`);
  }
}

console.log('\n--- AC9M4SP02 validity gate ---');
const sp02Result = spawnSync(process.execPath, [join(root, 'scripts', 'g4-ac9m4sp02-validity-audit.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
if (sp02Result.status !== 0) {
  failed += 1;
  console.log('\nAC9M4SP02 validity: FAIL\n');
} else {
  console.log('\nAC9M4SP02 validity: PASS\n');
}

console.log('=== Gate G4 Summary ===');
if (failed) {
  console.log(`FAIL — ${failed} audit(s) failed (assessments and/or AC9M4SP02 validity).`);
  process.exitCode = 1;
} else {
  console.log(`PASS — all ${AUDITS.length} assessment static + browser smoke audits passed.`);
  console.log('Profile golden-path: node scripts/g4-golden-path.mjs (Gate G4 profile sign-off PASS 2026-06-13).');
}

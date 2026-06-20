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

console.log('=== Gate G4 Summary ===');
if (failed) {
  console.log(`FAIL — ${failed}/${AUDITS.length} assessment audit(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`PASS — all ${AUDITS.length} assessment static + browser smoke audits passed.`);
  console.log('Profile golden-path: node scripts/g4-golden-path.mjs (Gate G4 profile sign-off PASS 2026-06-13).');
}

/**
 * Achievement credit audit — Prep through Year 6 practice pages.
 * Checks descriptor code casing, per-descriptor context pairing, orphan contexts,
 * gainPoints wiring, and simulated unlock path.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const evidenceDir = join(root, 'Improvement_Infrastructure', 'achievement-credit-evidence');

const PRACTICE_FILES = {
  0: 'prep-practice.js',
  1: 'year1-practice.js',
  2: 'year2-practice.js',
  3: 'year3-practice.js',
  4: 'year4-practice.js',
  5: 'year5-practice.js',
  6: 'year6-practice.js',
};

function loadConfig() {
  const src = readFileSync(join(root, 'achievements-config.js'), 'utf8');
  const sandbox = { window: {}, module: { exports: {} } };
  vm.runInNewContext(src, sandbox);
  const exported = sandbox.module.exports;
  return {
    DESCRIPTOR_BADGES: sandbox.DESCRIPTOR_BADGES || exported.DESCRIPTOR_BADGES,
    normalizeDescriptorCode: sandbox.normalizeDescriptorCode || exported.normalizeDescriptorCode,
    migrateDescriptorProfileKeys: sandbox.migrateDescriptorProfileKeys || exported.migrateDescriptorProfileKeys,
    simulateDescriptorCredit: sandbox.simulateDescriptorCredit || exported.simulateDescriptorCredit,
  };
}

/** Extract literal context strings from practice source. */
function extractContextLiterals(src) {
  const found = new Set();
  const patterns = [
    /context:\s*['"]([^'"]+)['"]/g,
    /context\s*=\s*['"]([^'"]+)['"]/g,
    /\?\s*['"]([a-z0-9-]+)['"]\s*:\s*['"]([a-z0-9-]+)['"]/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      for (let i = 1; i < m.length; i++) {
        const val = m[i];
        if (val && /^[a-z0-9-]+$/.test(val) && val.includes('-')) found.add(val);
      }
    }
  }
  return found;
}

/** Map descriptor code → set of context literals emitted with that descriptor nearby. */
function extractDescriptorContextPairs(src) {
  const pairs = new Map();
  const isContextLiteral = (ctx) => typeof ctx === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(ctx);

  const blockRe = /descriptor:\s*['"](AC9M[^'"]+)['"][\s\S]{0,800}?context:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const desc = m[1].toUpperCase();
    const ctx = m[2];
    if (!isContextLiteral(ctx)) continue;
    if (!pairs.has(desc)) pairs.set(desc, new Set());
    pairs.get(desc).add(ctx);
  }
  const assignRe = /context\s*=\s*['"]([^'"]+)['"][\s\S]{0,600}?descriptor:\s*['"](AC9M[^'"]+)['"]/g;
  while ((m = assignRe.exec(src)) !== null) {
    const ctx = m[1];
    const desc = m[2].toUpperCase();
    if (!isContextLiteral(ctx)) continue;
    if (!pairs.has(desc)) pairs.set(desc, new Set());
    pairs.get(desc).add(ctx);
  }
  return pairs;
}

function checkGainPointsWiring(src, year) {
  if (year <= 2) {
    return /MCSBandA\.gainPoints\s*\(/.test(src) && /descriptor:\s*q\.descriptor/.test(src);
  }
  return /gainPoints\s*\(/.test(src) && /state\.currentQuestion\.descriptor/.test(src);
}

function runAudit() {
  const {
    DESCRIPTOR_BADGES,
    normalizeDescriptorCode,
    migrateDescriptorProfileKeys,
    simulateDescriptorCredit,
  } = loadConfig();

  const codeCasingIssues = [];
  const missingPairings = [];
  const orphanContexts = [];
  const wiringFails = [];
  const simulationFails = [];
  const yearSummaries = {};

  Object.keys(DESCRIPTOR_BADGES).forEach((key) => {
    const badge = DESCRIPTOR_BADGES[key];
    const canonical = normalizeDescriptorCode(badge.code);
    if (badge.code !== canonical) {
      codeCasingIssues.push({ badgeKey: key, configCode: badge.code, canonical });
    }
  });

  for (const [yearStr, file] of Object.entries(PRACTICE_FILES)) {
    const year = Number(yearStr);
    const src = readFileSync(join(root, file), 'utf8');
    const literals = extractContextLiterals(src);
    const pairs = extractDescriptorContextPairs(src);
    const yearBadges = Object.entries(DESCRIPTOR_BADGES).filter(([, b]) => b.year === year);

    if (!checkGainPointsWiring(src, year)) {
      wiringFails.push({ year, file });
    }

    const yearMissing = [];
    const yearOrphans = [];

    for (const [key, badge] of yearBadges) {
      const code = normalizeDescriptorCode(badge.code);
      const emitted = pairs.get(code) || new Set();
      const required = badge.requirements.contexts;

      for (const ctx of required) {
        if (!literals.has(ctx) && !emitted.has(ctx)) {
          const item = { year, badgeKey: key, code, missingContext: ctx, emitted: [...emitted] };
          missingPairings.push(item);
          yearMissing.push(item);
        }
      }

      for (const ctx of emitted) {
        if (!required.includes(ctx)) {
          const item = { year, badgeKey: key, code, orphanContext: ctx, required };
          orphanContexts.push(item);
          yearOrphans.push(item);
        }
      }
    }

    yearSummaries[year] = {
      file,
      badgeCount: yearBadges.length,
      contextLiterals: literals.size,
      missingPairings: yearMissing.length,
      orphans: yearOrphans.length,
      gainPointsWired: checkGainPointsWiring(src, year),
    };

    // Simulation: first single-context and first multi-context badge for year
    const single = yearBadges.find(([, b]) => b.requirements.contexts.length === 1);
    const multi = yearBadges.find(([, b]) => b.requirements.contexts.length > 1);
    for (const [key, badge] of [single, multi].filter(Boolean)) {
      const sim = simulateDescriptorCredit(badge, 50);
      if (!sim.unlocked) {
        simulationFails.push({ year, badgeKey: key, code: badge.code, sim });
      }
    }
  }

  // Profile migration smoke
  const migrationOk = (() => {
    const profile = {
      scoresByDescriptor: { AC9M6a02: 30, AC9M6A02: 20 },
      solvedContexts: { AC9M6a02: ['bodmas-flowchart'], AC9M6A02: ['order-operations-brackets'] },
      consecutiveCorrect: { AC9M6a02: 2 },
    };
    migrateDescriptorProfileKeys(profile);
    return (
      profile.scoresByDescriptor.AC9M6A02 === 50 &&
      profile.solvedContexts.AC9M6A02.length === 2 &&
      profile.scoresByDescriptor.AC9M6a02 === undefined
    );
  })();

  const pass =
    codeCasingIssues.length === 0 &&
    missingPairings.length === 0 &&
    orphanContexts.length === 0 &&
    wiringFails.length === 0 &&
    simulationFails.length === 0 &&
    migrationOk;

  return {
    pass,
    codeCasingIssues,
    missingPairings,
    orphanContexts,
    wiringFails,
    simulationFails,
    migrationOk,
    yearSummaries,
    timestamp: new Date().toISOString(),
  };
}

function writeReport(result) {
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(join(evidenceDir, 'summary.json'), JSON.stringify(result, null, 2));

  const lines = [
    '# Achievement Credit Audit',
    '',
    `**Status:** ${result.pass ? 'PASS' : 'FAIL'}`,
    `**Run:** ${result.timestamp}`,
    '',
    '## Summary',
    '',
    `| Check | Result |`,
    `|-------|--------|`,
    `| Code casing | ${result.codeCasingIssues.length} issue(s) |`,
    `| Missing context pairings | ${result.missingPairings.length} |`,
    `| Orphan contexts | ${result.orphanContexts.length} |`,
    `| gainPoints wiring | ${result.wiringFails.length} fail(s) |`,
    `| Simulation unlock | ${result.simulationFails.length} fail(s) |`,
    `| Profile migration | ${result.migrationOk ? 'OK' : 'FAIL'} |`,
    '',
  ];

  if (result.codeCasingIssues.length) {
    lines.push('## Code casing issues', '');
    result.codeCasingIssues.forEach((i) => {
      lines.push(`- \`${i.badgeKey}\`: config \`${i.configCode}\` → should be \`${i.canonical}\``);
    });
    lines.push('');
  }
  if (result.orphanContexts.length) {
    lines.push('## Orphan contexts', '');
    result.orphanContexts.forEach((i) => {
      lines.push(`- Year ${i.year} \`${i.code}\`: orphan \`${i.orphanContext}\``);
    });
    lines.push('');
  }
  if (result.missingPairings.length) {
    lines.push('## Missing pairings', '');
    result.missingPairings.slice(0, 30).forEach((i) => {
      lines.push(`- Year ${i.year} \`${i.code}\`: missing \`${i.missingContext}\``);
    });
    lines.push('');
  }

  writeFileSync(join(evidenceDir, 'report.md'), lines.join('\n'));
}

const result = runAudit();
writeReport(result);

console.log('=== Achievement Credit Audit ===\n');
console.log(`Status: ${result.pass ? 'PASS' : 'FAIL'}`);
console.log(`Code casing issues: ${result.codeCasingIssues.length}`);
console.log(`Missing pairings: ${result.missingPairings.length}`);
console.log(`Orphan contexts: ${result.orphanContexts.length}`);
console.log(`Wiring fails: ${result.wiringFails.length}`);
console.log(`Simulation fails: ${result.simulationFails.length}`);
console.log(`Migration OK: ${result.migrationOk}`);
console.log(`\nEvidence: Improvement_Infrastructure/achievement-credit-evidence/`);

if (!result.pass) process.exitCode = 1;

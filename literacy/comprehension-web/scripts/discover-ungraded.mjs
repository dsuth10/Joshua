import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const resultsRoot = path.join(webRoot, 'Results');
const scoredRoot = path.join(webRoot, 'scored-results');
const literacyRoot = path.resolve(webRoot, '..');

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.json') && !e.name.startsWith('_')) files.push(p);
  }
  return files;
}

function parseMeta(file) {
  try {
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (
      d.exportType !== 'literacy_comprehension_student_response' &&
      !(d.student && d.activity && d.submission)
    ) {
      return null;
    }
    return {
      file,
      student: String(d.student?.name || '').trim(),
      activityId: d.activity?.activityId || '',
      skill: d.activity?.skill || d.activity?.skillLabel || '',
      level: d.activity?.level,
      handout: d.activity?.handout,
      date: d.student?.activityDate || '',
      complete: d.submission?.completion?.isComplete === true,
      answered: d.submission?.completion?.answeredQuestions,
      total: d.submission?.completion?.totalQuestions,
      exportedAt: d.submission?.exportedAt || '',
      mtime: fs.statSync(file).mtimeMs,
    };
  } catch {
    return null;
  }
}

function expectedFolder(activityId, skill, level) {
  const id = String(activityId || '').toLowerCase();
  let sk = (skill || '').toLowerCase();
  if (id.includes('inferencing') || sk.includes('infer')) sk = 'Inferencing';
  else if (id.includes('evaluation') || sk.includes('evaluat')) sk = 'Evaluation';
  else if (
    id.includes('reorganization') ||
    id.includes('reorganisation') ||
    sk.includes('reorgan')
  ) {
    sk = 'Reorganization';
  } else sk = 'Unknown';
  const lvl = level ?? (id.match(/level-(\d+)/) || [])[1];
  return `${sk} level ${lvl}`;
}

function scoredPathFor(resultFile) {
  const rel = path.relative(resultsRoot, resultFile);
  return path.join(scoredRoot, `${rel}.scored.json`);
}

function normalizeActivityId(id) {
  return String(id || '')
    .toLowerCase()
    .replace(/-handout-0*(\d+)/, (_, n) => `-handout-${Number(n)}`);
}

const inResults = walk(resultsRoot).map(parseMeta).filter(Boolean);

const loose = walk(literacyRoot)
  .filter((f) => {
    const norm = f.split(path.sep).join('/');
    return (
      !norm.includes('/comprehension-web/') &&
      !norm.includes('/Literacy rotations/')
    );
  })
  .map(parseMeta)
  .filter(Boolean);

const rootLoose = fs
  .readdirSync(resultsRoot, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith('.json'))
  .map((e) => parseMeta(path.join(resultsRoot, e.name)))
  .filter(Boolean);

console.log('=== Results folders ===');
const byFolder = {};
for (const r of inResults) {
  const folder = path.relative(resultsRoot, path.dirname(r.file)) || '(root)';
  byFolder[folder] = byFolder[folder] || [];
  byFolder[folder].push(r);
}
for (const [f, items] of Object.entries(byFolder).sort()) {
  console.log(`[${f}] ${items.length}`);
}

console.log('\n=== Files directly in Results root ===');
for (const r of rootLoose) {
  console.log(
    `${path.basename(r.file)} | ${r.student} | ${r.activityId} | complete=${r.complete}`,
  );
}

console.log('\n=== Misplaced (wrong skill/level folder) ===');
const misplaced = [];
for (const r of inResults) {
  const actual = path.relative(resultsRoot, path.dirname(r.file)) || '(root)';
  const expected = expectedFolder(r.activityId, r.skill, r.level);
  if (actual !== expected) {
    misplaced.push({ ...r, actual, expected });
    console.log(
      `${path.basename(r.file)}\n  ${actual} -> ${expected} (${r.student})`,
    );
  }
}

console.log('\n=== Loose literacy/*.json ===');
for (const r of loose) {
  console.log(
    `${path.basename(r.file)} | ${r.student} | ${r.activityId} | complete=${r.complete}`,
  );
}

// Ungraded: most recent per student+activity without any scored file for that pair
// First collect all scored student+activity keys
const scoredKeys = new Set();
const scoredExact = new Set();
for (const f of walk(scoredRoot)) {
  if (!f.endsWith('.scored.json') && !f.endsWith('.json')) continue;
  try {
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (!d.marking) continue;
    const student = String(d.student?.name || '')
      .trim()
      .toLowerCase();
    const aid = normalizeActivityId(d.activity?.activityId);
    scoredKeys.add(`${student}||${aid}`);
    scoredExact.add(path.resolve(f));
  } catch {
    /* ignore */
  }
}

// Dedupe Results by student+activity keeping newest
const best = new Map();
for (const r of inResults) {
  const k = `${r.student.toLowerCase()}||${normalizeActivityId(r.activityId)}`;
  const prev = best.get(k);
  if (
    !prev ||
    r.mtime > prev.mtime ||
    (r.exportedAt || '') > (prev.exportedAt || '')
  ) {
    best.set(k, r);
  }
}

const ungraded = [];
for (const r of best.values()) {
  const k = `${r.student.toLowerCase()}||${normalizeActivityId(r.activityId)}`;
  const exact = scoredPathFor(r.file);
  if (!scoredKeys.has(k)) {
    ungraded.push({ ...r, reason: 'no-scored-for-pair', exact });
  } else if (!fs.existsSync(exact)) {
    // pair scored under different filename — still considered graded by skill
    // but note it
  }
}

console.log('\n=== Ungraded (no scored file for student+activity) ===');
console.log('count', ungraded.length);
for (const u of ungraded.sort((a, b) => b.mtime - a.mtime)) {
  console.log(
    `${new Date(u.mtime).toISOString().slice(0, 16)} | ${u.student} | ${u.activityId} | complete=${u.complete} | ${u.answered}/${u.total} | ${path.basename(u.file)}`,
  );
}

// Also list Results files modified in last 3 days
console.log('\n=== Results modified last 3 days ===');
const cutoff = Date.now() - 3 * 24 * 3600 * 1000;
for (const r of inResults
  .filter((x) => x.mtime > cutoff)
  .sort((a, b) => b.mtime - a.mtime)) {
  const k = `${r.student.toLowerCase()}||${normalizeActivityId(r.activityId)}`;
  console.log(
    `${new Date(r.mtime).toISOString().slice(0, 16)} scoredPair=${scoredKeys.has(k)} | ${path.relative(resultsRoot, r.file)}`,
  );
}

fs.writeFileSync(
  path.join(webRoot, '_grading-queue.json'),
  JSON.stringify(
    {
      misplaced: misplaced.map((m) => ({
        file: m.file,
        actual: m.actual,
        expected: m.expected,
        student: m.student,
        activityId: m.activityId,
      })),
      rootLoose: rootLoose.map((r) => ({
        file: r.file,
        student: r.student,
        activityId: r.activityId,
        expected: expectedFolder(r.activityId, r.skill, r.level),
      })),
      looseLiteracy: loose.map((r) => ({
        file: r.file,
        student: r.student,
        activityId: r.activityId,
        expected: expectedFolder(r.activityId, r.skill, r.level),
      })),
      ungraded: ungraded.map((u) => ({
        file: u.file,
        student: u.student,
        activityId: u.activityId,
        complete: u.complete,
        exact: u.exact,
        expected: expectedFolder(u.activityId, u.skill, u.level),
      })),
    },
    null,
    2,
  ),
);
console.log('\nWrote _grading-queue.json');

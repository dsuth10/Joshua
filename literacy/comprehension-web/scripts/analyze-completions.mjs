import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const literacyRoot = path.join(repoRoot, 'literacy');
const webRoot = path.join(literacyRoot, 'comprehension-web');

const roots = [
  path.join(webRoot, 'Results'),
  path.join(webRoot, 'scored-results'),
  literacyRoot,
];

const skipDirs = new Set([
  'node_modules',
  '.build-preview',
  'marking-guides',
  '__pycache__',
  'content',
  'docs',
  'templates',
  'tests',
  'shared',
  'scripts',
  'teacher',
  'evaluation',
  'inferencing',
  'reorganization',
  'Literacy rotations',
  'comprehension-web', // when walking literacy root, Results/scored handled separately
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (skipDirs.has(ent.name)) continue;
      walk(p, files);
    } else if (ent.name.endsWith('.json')) {
      if (
        ent.name.includes('resolution_report') ||
        ent.name.includes('responses_to_grade') ||
        ent.name.startsWith('_completion') ||
        ent.name.startsWith('package')
      ) {
        continue;
      }
      files.push(p);
    }
  }
  return files;
}

function normalizeActivityId(id) {
  if (!id) return id;
  return String(id)
    .toLowerCase()
    .replace(/-handout-0*(\d+)/, (_, n) => `-handout-${Number(n)}`)
    .replace(/_/g, '-');
}

function niceLabel(activityId) {
  const m = activityId.match(
    /^(inferencing|evaluation|reorganization)-level-(\d+)-handout-(\d+)(-bridge)?$/i,
  );
  if (!m) return activityId;
  const skill = m[1].charAt(0).toUpperCase() + m[1].slice(1);
  return `${skill} Level ${m[2]} Handout ${m[3]}${m[4] ? ' (bridge)' : ''}`;
}

const unique = [
  ...new Set(roots.flatMap((r) => walk(r)).map((f) => path.resolve(f))),
];
const submissions = [];

for (const file of unique) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    continue;
  }
  let payload = data;
  if (data.exportType !== 'literacy_comprehension_student_response') {
    if (data.original?.exportType === 'literacy_comprehension_student_response') {
      payload = data.original;
    } else if (
      data.response?.exportType === 'literacy_comprehension_student_response'
    ) {
      payload = data.response;
    } else if (data.submission && data.student && data.activity) {
      payload = data;
    } else {
      continue;
    }
  }

  const student = String(payload.student?.name || 'UNKNOWN').trim().toLowerCase();
  const activity = payload.activity || {};
  const completion = payload.submission?.completion || {};
  const rawId = activity.activityId || path.basename(file).split('_')[0];
  const activityId = normalizeActivityId(rawId);
  const rel = path.relative(repoRoot, file).split(path.sep).join('/');
  const source = file.includes('scored-results')
    ? 'scored-results'
    : file.includes(`${path.sep}Results${path.sep}`)
      ? 'Results'
      : 'other';

  submissions.push({
    student,
    activityId,
    level:
      activity.level ?? Number((activityId.match(/level-(\d+)/) || [])[1]),
    handout:
      activity.handout ?? Number((activityId.match(/handout-(\d+)/) || [])[1]),
    skill: (activityId.match(/^(inferencing|evaluation|reorganization)/) || [
      '',
      'unknown',
    ])[1],
    isComplete: completion.isComplete === true,
    pct: completion.percentage ?? null,
    answered: completion.answeredQuestions ?? null,
    total: completion.totalQuestions ?? null,
    exportedAt: payload.submission?.exportedAt || '',
    activityDate: payload.student?.activityDate || '',
    source,
    file: rel,
  });
}

const byKey = new Map();
for (const s of submissions) {
  const k = `${s.student}||${s.activityId}`;
  const prev = byKey.get(k);
  if (!prev) {
    byKey.set(k, { ...s, files: [s.file], sources: [s.source], count: 1 });
    continue;
  }
  prev.count += 1;
  prev.files.push(s.file);
  if (!prev.sources.includes(s.source)) prev.sources.push(s.source);
  const prevScore = (prev.isComplete ? 1000 : 0) + (prev.pct || 0);
  const curScore = (s.isComplete ? 1000 : 0) + (s.pct || 0);
  const prevTime = prev.exportedAt || prev.activityDate || '';
  const curTime = s.exportedAt || s.activityDate || '';
  if (curScore > prevScore || (curScore === prevScore && curTime > prevTime)) {
    Object.assign(prev, s, {
      files: prev.files,
      sources: prev.sources,
      count: prev.count,
    });
  }
}

const deduped = [...byKey.values()];
const complete = deduped.filter((s) => s.isComplete);
const incomplete = deduped.filter((s) => !s.isComplete);

const byStudent = new Map();
for (const s of complete) {
  if (!byStudent.has(s.student)) byStudent.set(s.student, []);
  byStudent.get(s.student).push(s);
}
for (const list of byStudent.values()) {
  list.sort((a, b) => {
    const sk = (a.skill || '').localeCompare(b.skill || '');
    if (sk) return sk;
    if (a.level !== b.level) return (a.level || 0) - (b.level || 0);
    return (a.handout || 0) - (b.handout || 0);
  });
}

const studentsSorted = [...byStudent.keys()].sort();
const activityCounts = new Map();
for (const s of complete) {
  const l = niceLabel(s.activityId);
  activityCounts.set(l, (activityCounts.get(l) || 0) + 1);
}

const skillCounts = new Map();
for (const s of complete) {
  skillCounts.set(s.skill, (skillCounts.get(s.skill) || 0) + 1);
}

const out = {
  generatedAt: new Date().toISOString(),
  sourceNote:
    'Deduped by username + normalized activityId (handout-01 ≡ handout-1). Complete = isComplete true (all questions answered). Sources: Results/, scored-results/, and loose literacy/*.json files.',
  totals: {
    totalRawFiles: submissions.length,
    uniquePairs: deduped.length,
    complete: complete.length,
    incomplete: incomplete.length,
    uniqueStudentsWithComplete: studentsSorted.length,
    uniqueStudentsAny: [...new Set(deduped.map((s) => s.student))].length,
  },
  skillCounts: [...skillCounts.entries()]
    .sort()
    .map(([skill, count]) => ({ skill, count })),
  activityCounts: [...activityCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([assignment, count]) => ({ assignment, count })),
  students: studentsSorted.map((stu) => ({
    username: stu,
    completedCount: byStudent.get(stu).length,
    assignments: byStudent.get(stu).map((s) => ({
      assignment: niceLabel(s.activityId),
      activityId: s.activityId,
      date: s.activityDate || (s.exportedAt || '').slice(0, 10),
      answered: `${s.answered}/${s.total}`,
      duplicates: s.count,
    })),
  })),
  incompleteByStudent: (() => {
    const m = new Map();
    for (const s of incomplete) {
      // If student also has a complete version of same activity, skip showing as incomplete
      if (byStudent.get(s.student)?.some((c) => c.activityId === s.activityId)) {
        continue;
      }
      if (!m.has(s.student)) m.set(s.student, []);
      m.get(s.student).push({
        assignment: niceLabel(s.activityId),
        pct: s.pct,
        answered: `${s.answered}/${s.total}`,
        date: s.activityDate || (s.exportedAt || '').slice(0, 10),
      });
    }
    return [...m.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([username, items]) => ({ username, items }));
  })(),
  flatRows: studentsSorted.flatMap((stu) =>
    byStudent.get(stu).map((s) => ({
      username: stu,
      assignment: niceLabel(s.activityId),
      date: s.activityDate || (s.exportedAt || '').slice(0, 10),
      answered: `${s.answered}/${s.total}`,
    })),
  ),
};

const outPath = path.join(webRoot, '_completion-analysis-clean.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      totals: out.totals,
      skillCounts: out.skillCounts,
      activityCounts: out.activityCounts,
      students: out.students.map((s) => ({
        username: s.username,
        count: s.completedCount,
        assignments: s.assignments.map((a) => a.assignment),
      })),
      incomplete: out.incompleteByStudent,
    },
    null,
    2,
  ),
);
console.error(`Wrote ${outPath}`);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '../..');

const completeAnalysis = JSON.parse(
  fs.readFileSync(path.join(webRoot, '_completion-analysis-clean.json'), 'utf8'),
);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith('.json')) files.push(p);
  }
  return files;
}

function normalizeActivityId(id) {
  return String(id || '')
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

const scoredRoot = path.join(webRoot, 'scored-results');
const scored = [];
for (const file of walk(scoredRoot)) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    continue;
  }
  if (!data.marking || data.marking.percentage == null) continue;
  const student = String(data.student?.name || '')
    .trim()
    .toLowerCase();
  const activityId = normalizeActivityId(
    data.activity?.activityId || path.basename(file).split('_')[0],
  );
  scored.push({
    student,
    activityId,
    assignment: niceLabel(activityId),
    percentage: data.marking.percentage,
    earnedMarks: data.marking.earnedMarks,
    totalMarks: data.marking.totalMarks,
    gradedAt: data.marking.gradedAt || '',
    isComplete: data.submission?.completion?.isComplete === true,
    date: data.student?.activityDate || '',
    file: path.relative(repoRoot, file).split(path.sep).join('/'),
  });
}

const byKey = new Map();
for (const s of scored) {
  const k = `${s.student}||${s.activityId}`;
  const prev = byKey.get(k);
  if (!prev) {
    byKey.set(k, s);
    continue;
  }
  if (
    (s.isComplete && !prev.isComplete) ||
    (s.isComplete === prev.isComplete && s.percentage > prev.percentage) ||
    (s.isComplete === prev.isComplete &&
      s.percentage === prev.percentage &&
      (s.gradedAt || '') > (prev.gradedAt || ''))
  ) {
    byKey.set(k, s);
  }
}

const scoredDeduped = [...byKey.values()];
const scoredComplete = scoredDeduped.filter((s) => s.isComplete);

const completedKeys = new Set();
for (const stu of completeAnalysis.students) {
  for (const a of stu.assignments) {
    completedKeys.add(`${stu.username}||${normalizeActivityId(a.activityId)}`);
  }
}

const scoredCompleted = scoredComplete.filter((s) =>
  completedKeys.has(`${s.student}||${s.activityId}`),
);

const unscoredComplete = [];
for (const stu of completeAnalysis.students) {
  for (const a of stu.assignments) {
    const k = `${stu.username}||${normalizeActivityId(a.activityId)}`;
    if (!scoredCompleted.some((s) => `${s.student}||${s.activityId}` === k)) {
      unscoredComplete.push({
        username: stu.username,
        assignment: a.assignment,
        activityId: a.activityId,
        date: a.date,
      });
    }
  }
}

scoredCompleted.sort((a, b) => {
  const u = a.student.localeCompare(b.student);
  if (u) return u;
  return a.assignment.localeCompare(b.assignment);
});

const byStudent = new Map();
for (const s of scoredCompleted) {
  if (!byStudent.has(s.student)) byStudent.set(s.student, []);
  byStudent.get(s.student).push(s);
}

const studentAvgs = [...byStudent.entries()]
  .map(([username, items]) => ({
    username,
    count: items.length,
    avgPercentage:
      Math.round(
        (items.reduce((sum, i) => sum + i.percentage, 0) / items.length) * 10,
      ) / 10,
    min: Math.min(...items.map((i) => i.percentage)),
    max: Math.max(...items.map((i) => i.percentage)),
  }))
  .sort((a, b) => b.avgPercentage - a.avgPercentage);

const byAssignment = new Map();
for (const s of scoredCompleted) {
  if (!byAssignment.has(s.assignment)) byAssignment.set(s.assignment, []);
  byAssignment.get(s.assignment).push(s);
}
const assignmentAvgs = [...byAssignment.entries()]
  .map(([assignment, items]) => ({
    assignment,
    count: items.length,
    avgPercentage:
      Math.round(
        (items.reduce((sum, i) => sum + i.percentage, 0) / items.length) * 10,
      ) / 10,
  }))
  .sort((a, b) => a.assignment.localeCompare(b.assignment));

const out = {
  generatedAt: new Date().toISOString(),
  sourceNote:
    'Percentage correct from marking.percentage in scored-results/*.scored.json for completed submissions only.',
  totals: {
    completedAssignments: completeAnalysis.totals.complete,
    scoredCompleted: scoredCompleted.length,
    unscoredCompleted: unscoredComplete.length,
    scoredIncompleteAlsoPresent: scoredDeduped.filter((s) => !s.isComplete)
      .length,
  },
  overallAvg:
    scoredCompleted.length === 0
      ? null
      : Math.round(
          (scoredCompleted.reduce((s, i) => s + i.percentage, 0) /
            scoredCompleted.length) *
            10,
        ) / 10,
  studentAvgs,
  assignmentAvgs,
  rows: scoredCompleted.map((s) => ({
    username: s.student,
    assignment: s.assignment,
    percentageCorrect: s.percentage,
    marks: `${s.earnedMarks}/${s.totalMarks}`,
    date: s.date,
  })),
  unscoredComplete,
};

fs.writeFileSync(
  path.join(webRoot, '_score-analysis.json'),
  JSON.stringify(out, null, 2),
);
console.log(
  JSON.stringify(
    {
      totals: out.totals,
      overallAvg: out.overallAvg,
      unscored: out.unscoredComplete,
      newlyRelevant: out.rows.filter((r) =>
        [
          'cpono2',
          'jtayl1104',
          'kfiel89',
          'lheck4',
          'shart259',
          'wnich33',
        ].includes(r.username),
      ),
    },
    null,
    2,
  ),
);

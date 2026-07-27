import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const teacherDir = path.join(webRoot, 'teacher');

const scores = JSON.parse(
  fs.readFileSync(path.join(webRoot, '_score-analysis.json'), 'utf8'),
);
const complete = JSON.parse(
  fs.readFileSync(path.join(webRoot, '_completion-analysis-clean.json'), 'utf8'),
);

const scoreMap = new Map();
for (const r of scores.rows) {
  scoreMap.set(`${r.username}||${r.assignment}`, r);
}
const unscoredSet = new Set(
  scores.unscoredComplete.map((u) => `${u.username}||${u.assignment}`),
);

const students = complete.students
  .map((s) => {
    const scored = scores.studentAvgs.find((a) => a.username === s.username);
    const assignments = s.assignments.map((a) => {
      const key = `${s.username}||${a.assignment}`;
      const sc = scoreMap.get(key);
      return {
        assignment: a.assignment,
        date: a.date,
        answered: a.answered,
        percentageCorrect: sc ? sc.percentageCorrect : null,
        marks: sc ? sc.marks : null,
      };
    });
    return {
      username: s.username,
      completedCount: s.completedCount,
      avgPercentage: scored ? scored.avgPercentage : null,
      scoredCount: scored ? scored.count : 0,
      assignments,
    };
  })
  .sort((a, b) => {
    if (a.avgPercentage == null && b.avgPercentage == null) {
      return a.username.localeCompare(b.username);
    }
    if (a.avgPercentage == null) return 1;
    if (b.avgPercentage == null) return -1;
    return b.avgPercentage - a.avgPercentage;
  });

const data = {
  generatedAt: scores.generatedAt,
  totals: {
    complete: complete.totals.complete,
    uniqueStudentsWithComplete: complete.totals.uniqueStudentsWithComplete,
    scoredCompleted: scores.totals.scoredCompleted,
    unscoredCompleted: scores.totals.unscoredCompleted,
    overallAvg: scores.overallAvg,
  },
  activityCounts: complete.activityCounts,
  assignmentAvgs: scores.assignmentAvgs,
  students,
  incomplete: complete.incompleteByStudent,
  unscoredComplete: scores.unscoredComplete,
  allScoreRows: scores.rows,
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pctClass(p) {
  if (p == null) return 'na';
  if (p >= 80) return 'high';
  if (p >= 60) return 'mid';
  return 'low';
}

function pctLabel(p) {
  if (p == null) return '—';
  return `${p}%`;
}

const generated = (data.generatedAt || '').slice(0, 10);

const studentCards = data.students
  .map((s) => {
    const avgClass = pctClass(s.avgPercentage);
    const rows = s.assignments
      .map((a) => {
        const pc = a.percentageCorrect;
        const badge =
          pc == null
            ? '<span class="badge badge-warn">Not scored</span>'
            : `<span class="badge badge-${pctClass(pc)}">${pc}%</span>`;
        return `<tr>
          <td>${esc(a.assignment)}</td>
          <td class="mono">${esc(a.date || '—')}</td>
          <td class="num">${esc(a.answered || '—')}</td>
          <td class="num">${a.marks ? esc(a.marks) : '—'}</td>
          <td>${badge}</td>
        </tr>`;
      })
      .join('\n');

    return `<article class="student-card" data-user="${esc(s.username)}">
      <header class="student-card-head">
        <div>
          <h3 class="username">${esc(s.username)}</h3>
          <p class="meta">${s.completedCount} completed · ${s.scoredCount} scored</p>
        </div>
        <div class="avg-block ${avgClass}">
          <div class="avg-value">${pctLabel(s.avgPercentage)}</div>
          <div class="avg-label">avg correct</div>
        </div>
      </header>
      <table class="mini-table">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Date</th>
            <th>Answered</th>
            <th>Marks</th>
            <th>% Correct</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </article>`;
  })
  .join('\n');

const masterRows = data.allScoreRows
  .map(
    (r) => `<tr class="${pctClass(r.percentageCorrect)}-row">
      <td class="mono">${esc(r.username)}</td>
      <td>${esc(r.assignment)}</td>
      <td class="num"><strong>${r.percentageCorrect}%</strong></td>
      <td class="num mono">${esc(r.marks)}</td>
      <td class="mono">${esc(r.date || '—')}</td>
    </tr>`,
  )
  .join('\n');

const unscoredRows = data.unscoredComplete
  .map(
    (r) => `<tr>
      <td class="mono">${esc(r.username)}</td>
      <td>${esc(r.assignment)}</td>
      <td class="mono">${esc(r.date || '—')}</td>
    </tr>`,
  )
  .join('\n');

const incompleteRows = (data.incomplete || [])
  .flatMap((s) =>
    s.items.map(
      (i) => `<tr>
      <td class="mono">${esc(s.username)}</td>
      <td>${esc(i.assignment)}</td>
      <td class="num">${i.pct}%</td>
      <td class="num mono">${esc(i.answered)}</td>
      <td class="mono">${esc(i.date || '—')}</td>
    </tr>`,
    ),
  )
  .join('\n');

const handoutChips = (data.assignmentAvgs || [])
  .map((a) => {
    const cls = pctClass(a.avgPercentage);
    return `<span class="chip chip-${cls}">${esc(a.assignment)} · <strong>${a.avgPercentage}%</strong> <span class="chip-n">n=${a.count}</span></span>`;
  })
  .join('\n');

const coverageChips = (data.activityCounts || [])
  .map(
    (a) =>
      `<span class="chip chip-neutral">${esc(a.assignment)} · <strong>${a.count}</strong> done</span>`,
  )
  .join('\n');

const css = `
:root {
  --bg: #f4f6f8;
  --surface: #ffffff;
  --ink: #1a2332;
  --muted: #5c6b7a;
  --line: #d8e0e8;
  --line-soft: #e8eef3;
  --teal: #0d7a6f;
  --teal-soft: #e6f5f3;
  --navy: #1e3a5f;
  --amber: #b86e00;
  --amber-soft: #fff4e0;
  --red: #b42318;
  --red-soft: #fdecea;
  --green: #1b7a3d;
  --green-soft: #e8f6ec;
  --shadow: 0 1px 2px rgba(26,35,50,0.04), 0 8px 24px rgba(26,35,50,0.06);
  --radius: 12px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "DM Sans", system-ui, sans-serif;
  background:
    radial-gradient(1200px 500px at 10% -10%, #d9efe9 0%, transparent 55%),
    radial-gradient(900px 400px at 100% 0%, #dce6f2 0%, transparent 50%),
    var(--bg);
  color: var(--ink);
  line-height: 1.5;
  min-height: 100vh;
}
.wrap { max-width: 1120px; margin: 0 auto; padding: 32px 20px 64px; }
header.hero { display: grid; gap: 10px; margin-bottom: 28px; padding: 8px 4px 4px; }
.eyebrow {
  font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--teal);
}
h1 {
  font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 700;
  letter-spacing: -0.02em; color: var(--navy); line-height: 1.15;
}
.hero-sub { color: var(--muted); font-size: 15px; max-width: 62ch; }
.toolbar {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 18px 0 8px;
}
.search {
  flex: 1 1 220px; min-width: 180px; border: 1px solid var(--line);
  background: var(--surface); border-radius: 10px; padding: 10px 14px;
  font: inherit; color: var(--ink); box-shadow: var(--shadow);
}
.search:focus { outline: 2px solid rgba(13,122,111,0.35); border-color: var(--teal); }
.tabs { display: flex; flex-wrap: wrap; gap: 6px; }
.tab {
  border: 1px solid var(--line); background: var(--surface); color: var(--muted);
  border-radius: 999px; padding: 8px 14px; font: inherit; font-size: 13px;
  font-weight: 600; cursor: pointer;
}
.tab[aria-selected="true"] { background: var(--navy); border-color: var(--navy); color: #fff; }
.stats {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px; margin: 22px 0 28px;
}
.stat {
  background: var(--surface); border: 1px solid var(--line-soft);
  border-radius: var(--radius); padding: 16px 18px; box-shadow: var(--shadow);
}
.stat-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
}
.stat-value {
  font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; color: var(--navy);
}
.stat-value.accent { color: var(--teal); }
.stat-value.warn { color: var(--amber); }
.stat-note { font-size: 12px; color: var(--muted); margin-top: 4px; }
section.panel {
  background: var(--surface); border: 1px solid var(--line-soft);
  border-radius: var(--radius); box-shadow: var(--shadow);
  padding: 22px; margin-bottom: 20px;
}
section.panel h2 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.panel-intro { color: var(--muted); font-size: 13px; margin-bottom: 16px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  display: inline-flex; align-items: center; gap: 6px; border-radius: 999px;
  padding: 6px 12px; font-size: 12px; font-weight: 500;
  border: 1px solid var(--line); background: #fafbfc; color: var(--ink);
}
.chip strong { font-weight: 700; }
.chip-n { color: var(--muted); font-weight: 500; }
.chip-high { background: var(--green-soft); border-color: #b7e0c4; color: var(--green); }
.chip-mid { background: var(--amber-soft); border-color: #f0d29a; color: var(--amber); }
.chip-low { background: var(--red-soft); border-color: #f0b8b3; color: var(--red); }
.chip-neutral { background: var(--teal-soft); border-color: #b7ddd7; color: var(--teal); }
.student-grid { display: grid; gap: 16px; }
.student-card {
  border: 1px solid var(--line-soft); border-radius: 12px; overflow: hidden; background: #fff;
}
.student-card[hidden] { display: none; }
.student-card-head {
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px; padding: 14px 16px;
  background: linear-gradient(180deg, #f7fafb 0%, #fff 100%);
  border-bottom: 1px solid var(--line-soft);
}
.username {
  font-size: 1rem; font-weight: 700; font-family: "JetBrains Mono", monospace; color: var(--navy);
}
.meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
.avg-block { text-align: right; min-width: 88px; padding: 8px 12px; border-radius: 10px; }
.avg-block.high { background: var(--green-soft); color: var(--green); }
.avg-block.mid { background: var(--amber-soft); color: var(--amber); }
.avg-block.low { background: var(--red-soft); color: var(--red); }
.avg-block.na { background: #eef2f6; color: var(--muted); }
.avg-value { font-size: 1.25rem; font-weight: 700; line-height: 1.1; }
.avg-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td {
  padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
}
th {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--muted); font-weight: 600; background: #fafbfc;
}
tr:last-child td { border-bottom: none; }
.mini-table th { background: #fcfdfe; }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.mono { font-family: "JetBrains Mono", monospace; font-size: 12px; }
.badge {
  display: inline-block; min-width: 52px; text-align: center; border-radius: 999px;
  padding: 3px 8px; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums;
}
.badge-high { background: var(--green-soft); color: var(--green); }
.badge-mid { background: var(--amber-soft); color: var(--amber); }
.badge-low { background: var(--red-soft); color: var(--red); }
.badge-warn { background: #eef2f6; color: var(--muted); font-weight: 600; }
.high-row td:nth-child(3) { color: var(--green); }
.mid-row td:nth-child(3) { color: var(--amber); }
.low-row td:nth-child(3) { color: var(--red); }
.legend {
  display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px;
  font-size: 12px; color: var(--muted);
}
.legend span::before {
  content: ""; display: inline-block; width: 8px; height: 8px;
  border-radius: 50%; margin-right: 6px; vertical-align: middle;
}
.legend .l-high::before { background: var(--green); }
.legend .l-mid::before { background: var(--amber); }
.legend .l-low::before { background: var(--red); }
.panel[hidden] { display: none; }
footer.note { margin-top: 8px; color: var(--muted); font-size: 12px; }
@media (max-width: 800px) {
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .student-card-head { align-items: flex-start; }
  table { font-size: 12px; }
  th, td { padding: 8px; }
}
@media print {
  body { background: #fff; }
  .toolbar { display: none; }
  .stat, .panel, .student-card { box-shadow: none; }
  .student-card { break-inside: avoid; }
}
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Results Summary — Literacy Comprehension</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="eyebrow">Literacy · Comprehension Web · Teacher</div>
      <h1>Student results summary</h1>
      <p class="hero-sub">
        Completed assignments with percentage correct from marked response files.
        Generated ${esc(generated)}. Scores use earned marks ÷ total marks.
      </p>
    </header>

    <div class="stats">
      <div class="stat">
        <div class="stat-label">Completed</div>
        <div class="stat-value">${data.totals.complete}</div>
        <div class="stat-note">${data.totals.uniqueStudentsWithComplete} students</div>
      </div>
      <div class="stat">
        <div class="stat-label">Scored</div>
        <div class="stat-value accent">${data.totals.scoredCompleted}</div>
        <div class="stat-note">of ${data.totals.complete} completed</div>
      </div>
      <div class="stat">
        <div class="stat-label">Average % correct</div>
        <div class="stat-value accent">${data.totals.overallAvg}%</div>
        <div class="stat-note">across scored completions</div>
      </div>
      <div class="stat">
        <div class="stat-label">Awaiting marks</div>
        <div class="stat-value warn">${data.totals.unscoredCompleted}</div>
        <div class="stat-note">complete but not scored</div>
      </div>
    </div>

    <div class="toolbar">
      <input class="search" id="search" type="search" placeholder="Filter by username or assignment…" aria-label="Filter results">
      <div class="tabs" role="tablist" aria-label="Report views">
        <button class="tab" role="tab" aria-selected="true" data-panel="by-student">By student</button>
        <button class="tab" role="tab" aria-selected="false" data-panel="all-scores">All scores</button>
        <button class="tab" role="tab" aria-selected="false" data-panel="coverage">Coverage</button>
        <button class="tab" role="tab" aria-selected="false" data-panel="pending">Pending / incomplete</button>
      </div>
    </div>

    <section class="panel" id="panel-by-student">
      <h2>Results by student</h2>
      <p class="panel-intro">Each card lists every completed handout for that username. Green ≥80%, amber 60–79%, red &lt;60%.</p>
      <div class="legend">
        <span class="l-high">80%+</span>
        <span class="l-mid">60–79%</span>
        <span class="l-low">Below 60%</span>
      </div>
      <div class="student-grid" style="margin-top:16px">
        ${studentCards}
      </div>
    </section>

    <section class="panel" id="panel-all-scores" hidden>
      <h2>Every scored completion</h2>
      <p class="panel-intro">${data.allScoreRows.length} marked submissions (deduped by username + handout).</p>
      <div style="overflow-x:auto">
        <table id="scores-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Assignment</th>
              <th class="num">% Correct</th>
              <th class="num">Marks</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${masterRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel" id="panel-coverage" hidden>
      <h2>Handout average % correct</h2>
      <p class="panel-intro">Class average on each scored handout.</p>
      <div class="chips">${handoutChips}</div>

      <h2 style="margin-top:28px">Completion coverage</h2>
      <p class="panel-intro">How many students have fully completed each handout (scored or not).</p>
      <div class="chips">${coverageChips}</div>
    </section>

    <section class="panel" id="panel-pending" hidden>
      <h2>Completed but not yet scored</h2>
      <p class="panel-intro">${data.unscoredComplete.length} exports are finished and waiting for marking.</p>
      <div style="overflow-x:auto">
        <table>
          <thead>
            <tr><th>Username</th><th>Assignment</th><th>Date</th></tr>
          </thead>
          <tbody>
            ${unscoredRows}
          </tbody>
        </table>
      </div>

      <h2 style="margin-top:28px">Incomplete submissions</h2>
      <p class="panel-intro">Exported files where not every question was answered. Progress shown is questions answered, not marks.</p>
      <div style="overflow-x:auto">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Assignment</th>
              <th class="num">Answered %</th>
              <th class="num">Questions</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${incompleteRows || '<tr><td colspan="5">None</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>

    <footer class="note">
      Source: literacy/comprehension-web Results and scored-results. Duplicates (e.g. handout-01 vs handout-1) counted once.
      Open this file directly in a browser — no server required.
    </footer>
  </div>

  <script>
    const tabs = document.querySelectorAll('.tab');
    const panels = {
      'by-student': document.getElementById('panel-by-student'),
      'all-scores': document.getElementById('panel-all-scores'),
      coverage: document.getElementById('panel-coverage'),
      pending: document.getElementById('panel-pending'),
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        Object.entries(panels).forEach(([key, el]) => {
          el.hidden = key !== tab.dataset.panel;
        });
      });
    });

    const search = document.getElementById('search');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('.student-card').forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.hidden = q !== '' && !text.includes(q);
      });
      document.querySelectorAll('#scores-table tbody tr').forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = q === '' || text.includes(q) ? '' : 'none';
      });
    });
  </script>
</body>
</html>
`;

const outPath = path.join(teacherDir, 'student-results-summary.html');
fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${html.length} bytes)`);

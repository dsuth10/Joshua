/* Mix-It-Up Day teacher review. Student portfolios remain local to this browser. */
(function () {
  'use strict';

  const NOTES_KEY = 'mix_it_up_day_teacher_review_notes_v1';
  const portfolios = new Map();
  let selectedUsername = '';
  let teacherNotes = loadNotes();

  const el = {
    input: document.querySelector('#portfolio-input'), list: document.querySelector('#student-list'),
    count: document.querySelector('#class-count'), message: document.querySelector('#import-message'),
    panel: document.querySelector('#review-panel'), backup: document.querySelector('#backup-button'),
    ai: document.querySelector('#ai-bundle-button'), clear: document.querySelector('#clear-button'),
    template: document.querySelector('#student-button-template')
  };

  function loadNotes() {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; } catch (_) { return {}; }
  }
  function saveNotes() { localStorage.setItem(NOTES_KEY, JSON.stringify(teacherNotes)); }
  function safeText(value, fallback) { return value === undefined || value === null || value === '' ? (fallback || '—') : String(value); }
  function download(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename;
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
  function datePart() { return new Date().toISOString().slice(0, 10); }
  function object(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }

  function usernameFor(data, fallback) {
    const student = object(data.student);
    return safeText(data.username || data.studentUsername || student.username || student.name || data.userName, fallback.replace(/\.json$/i, ''));
  }
  function getTaskSource(data) {
    const root = object(data.portfolio);
    const candidates = [data.tasks, root.tasks, data.challengeStates, root.challengeStates, data.work, root.work, data.responses, root.responses];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate;
      if (candidate && typeof candidate === 'object') return Object.entries(candidate).map(([id, value]) => ({ id, ...object(value) }));
    }
    return [];
  }
  function taskId(task, index) { return safeText(task.id || task.taskId || task.challengeId || task.key || task.slug, `task-${index + 1}`); }
  function taskTitle(task, index) { return safeText(task.title || task.taskTitle || task.challengeTitle || task.name, `Task ${index + 1}`); }
  function contextFor(task) {
    return task.context || task.taskContext || task.prompt || task.question || task.instructions || task.brief || task.originalTask || '';
  }
  function answerFor(task) {
    return task.answer ?? task.response ?? task.studentAnswer ?? task.work ?? task.value ?? task.writing ?? task.solution ?? '';
  }
  function gridFor(task) { return task.gridState || task.grid || task.pixelGrid || task.design || null; }
  function snapshotsFor(task) {
    const list = task.approvalSnapshots || task.approvals || task.reviewHistory || task.statusHistory || [];
    return Array.isArray(list) ? list : [];
  }
  function statusFor(task) {
    const value = String(task.status || task.approvalStatus || task.reviewStatus || '').toLowerCase();
    if (value) return value;
    const snapshots = snapshotsFor(task);
    return snapshots.some(s => /approved|complete/.test(String(object(s).status || s))) ? 'approved' : 'in progress';
  }
  function normaliseMixPortfolio(data, filename) {
    const contexts = object(data.taskContext), work = object(data.work), approvals = object(data.approvals), requested = object(data.requestedChanges);
    const tasks = Object.values(contexts).map((context, index) => {
      const current = object(work[context.id]), approval = object(approvals[context.id]);
      const currentApproval = Object.keys(approval).length > 0 && approval.approvedRevision === current.revision;
      const status = currentApproval ? 'approved' : requested[context.id] ? 'changes requested' : current.ready ? 'ready for teacher' : current.lastEditedAt ? 'in progress' : 'not started';
      return { id: context.id, title: context.title || `Task ${index + 1}`, context, answer: current.answers || {}, grid: current.grid || null, status, snapshots: [...(approval.history || []), ...(Object.keys(approval).length ? [approval] : [])], raw: current };
    });
    return { username: safeText(data.submission?.username, filename.replace(/\.json$/i, '')), exportedAt: data.submission?.exportedAt || '', tasks, raw: data };
  }
  function normalise(data, filename) {
    if (data.exportType === 'mix_it_up_day_student_portfolio' && data.taskContext && data.work) return normaliseMixPortfolio(data, filename);
    // Current student exports keep task wording separate from each student's work.
    // Join those records here so a reviewer always sees the exact prompt beside work.
    if (data.taskContext && typeof data.taskContext === 'object') {
      const tasks = Object.entries(data.taskContext).map(([id, source], index) => {
        const context = object(source), work = object(object(data.work)[id]);
        const approval = object(object(data.approvals)[id]);
        const change = object(object(data.requestedChanges)[id]);
        const approved = approval.approvedRevision === work.revision;
        const status = approved ? 'approved' : (change.at ? 'changes requested' : (work.ready ? 'ready for teacher' : 'in progress'));
        const history = Array.isArray(approval.history) ? approval.history : [];
        const snapshots = approval.approvedAt ? [{ status: 'approved', approvedAt: approval.approvedAt, revision: approval.approvedRevision, snapshot: approval.snapshot }, ...history] : history;
        if (change.at) snapshots.push({ status: 'changes requested', timestamp: change.at, note: change.note });
        return { id, title: taskTitle(context, index), context, answer: work.answers || '', grid: work.grid || null, status, snapshots, raw: { ...context, ...work, approval } };
      });
      const submission = object(data.submission);
      return { username: safeText(submission.username || data.username, filename.replace(/\.json$/i, '')), exportedAt: submission.exportedAt || data.exportedAt || '', tasks, raw: data };
    }
    const source = getTaskSource(data);
    const tasks = source.map((raw, index) => {
      const task = object(raw);
      return { id: taskId(task, index), title: taskTitle(task, index), context: contextFor(task), answer: answerFor(task), grid: gridFor(task), status: statusFor(task), snapshots: snapshotsFor(task), raw: task };
    });
    const username = usernameFor(data, filename);
    return { username, exportedAt: data.exportedAt || data.createdAt || data.exportDate || '', tasks, raw: data };
  }
  function displayValue(value) {
    if (value === undefined || value === null || value === '') return 'No response was included in this export.';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    return JSON.stringify(value, null, 2);
  }
  function make(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
  function labelledBox(className, heading, content) { const box = make('section', className); box.append(make('h3', '', heading)); const p = make('p', '', content || 'No task context was included in this export.'); box.append(p); return box; }

  function appendGrid(container, grid) {
    if (!grid) return;
    let rows = Array.isArray(grid) ? grid : (Array.isArray(grid.cells) ? grid.cells : null);
    if (!rows || !rows.length || !rows.every(Array.isArray)) {
      const pre = make('pre', '', JSON.stringify(grid, null, 2)); container.append(pre); return;
    }
    const table = make('table', 'data-grid'); table.setAttribute('aria-label', 'Student grid design');
    rows.forEach(row => { const tr = document.createElement('tr'); row.forEach(cell => { const td = document.createElement('td'); const value = object(cell).value ?? object(cell).colour ?? object(cell).color ?? cell; if (value && value !== 0 && value !== false) { td.classList.add('filled'); td.style.backgroundColor = typeof value === 'string' && /^(#|rgb|hsl)/.test(value) ? value : ''; td.textContent = typeof value === 'string' && !/^(#|rgb|hsl)/.test(value) ? value.slice(0, 1) : ''; } tr.append(td); }); table.append(tr); });
    const label = make('p', '', 'Grid / visual response'); label.style.fontWeight = '800'; container.append(label, table);
  }
  function renderSnapshot(snapshot) {
    const data = object(snapshot);
    if (!Object.keys(data).length) return String(snapshot);
    const status = data.status || data.action || 'review update'; const date = data.approvedAt || data.timestamp || data.date || '';
    const note = data.note || data.teacherNote || data.comment || '';
    const revision = data.revision ?? data.approvedRevision;
    const captured = data.snapshot ? ` · saved work: ${JSON.stringify(data.snapshot)}` : '';
    return `${status}${revision !== undefined ? ` · revision ${revision}` : ''}${date ? ` · ${new Date(date).toLocaleString()}` : ''}${note ? ` — ${note}` : ''}${captured}`;
  }
  function renderReview() {
    el.panel.replaceChildren(); const student = portfolios.get(selectedUsername);
    if (!student) { el.panel.append(emptyReview()); return; }
    const top = make('div', 'review-top'); const intro = make('div'); intro.append(make('h2', '', student.username));
    const completed = student.tasks.filter(t => /approved|complete/.test(t.status)).length;
    intro.append(make('p', 'review-meta', `${student.tasks.length} task${student.tasks.length === 1 ? '' : 's'} imported · ${completed} approved${student.exportedAt ? ` · exported ${new Date(student.exportedAt).toLocaleString()}` : ''}`));
    top.append(intro); const key = make('div', 'review-key'); key.append(make('strong', '', 'Private teacher notes')); key.append(make('span', '', 'Notes save only in this browser and appear in review backups.')); top.append(key); el.panel.append(top);
    if (!student.tasks.length) { el.panel.append(make('p', 'import-message error', 'This export has no task list. It is valid but may have been downloaded before the student started work.')); return; }
    student.tasks.forEach((task, index) => el.panel.append(renderTask(student, task, index)));
  }
  function emptyReview() { const box = make('div', 'empty-review'); box.append(make('span', '', '🧃'), make('h2', '', 'Choose a student portfolio'), make('p', '', 'Imported work will show the original task context, the student’s answer and their approval history here.')); return box; }
  function renderTask(student, task, index) {
    const details = make('details', 'task-review'); details.open = index === 0; const summary = make('summary', '', task.title); details.append(summary);
    const body = make('div', 'task-body'); body.append(labelledBox('context-box', 'Original task context', displayValue(task.context)));
    const answer = labelledBox('answer-box', 'Student answer', ''); answer.lastChild.remove(); const pre = make('pre', '', displayValue(task.answer)); answer.append(pre); appendGrid(answer, task.grid); body.append(answer);
    const status = make('section', 'status-box'); status.append(make('h3', '', `Status: ${task.status}`)); const snapshots = task.snapshots;
    if (snapshots.length) { const list = make('ul', 'snapshot-list'); snapshots.forEach(s => list.append(make('li', '', renderSnapshot(s)))); status.append(list); } else status.append(make('p', '', 'No approval snapshot was included in this export.'));
    body.append(status);
    const noteKey = `${student.username}::${task.id}`; const notes = make('section', 'notes-box'); const label = make('label', '', 'Teacher note'); const id = `note-${index}`; label.htmlFor = id; const textarea = document.createElement('textarea'); textarea.id = id; textarea.value = teacherNotes[noteKey] || ''; textarea.placeholder = 'Feedback or a reminder for your next conversation…'; const saved = make('p', 'save-note', '');
    textarea.addEventListener('input', () => { teacherNotes[noteKey] = textarea.value; saveNotes(); saved.textContent = 'Saved in this browser.'; }); notes.append(label, textarea, saved); body.append(notes);
    details.append(body); return details;
  }
  function renderList() {
    el.list.replaceChildren(); const students = [...portfolios.values()].sort((a, b) => a.username.localeCompare(b.username));
    el.count.textContent = students.length ? `${students.length} student portfolio${students.length === 1 ? '' : 's'} imported` : 'Import student portfolios to begin.';
    el.clear.disabled = !students.length; el.backup.disabled = !students.length; el.ai.disabled = !students.length;
    students.forEach(student => { const node = el.template.content.firstElementChild.cloneNode(true); const approved = student.tasks.filter(t => /approved|complete/.test(t.status)).length; node.querySelector('.student-avatar').textContent = student.username.slice(0, 1).toUpperCase(); node.querySelector('strong').textContent = student.username; node.querySelector('small').textContent = `${student.tasks.length} tasks · ${approved} approved`; const badge = node.querySelector('.student-status'); const allApproved = student.tasks.length && approved === student.tasks.length; badge.textContent = allApproved ? 'Complete' : 'Review'; badge.classList.toggle('waiting', !allApproved); node.setAttribute('aria-current', selectedUsername === student.username ? 'true' : 'false'); node.addEventListener('click', () => { selectedUsername = student.username; renderList(); renderReview(); }); el.list.append(node); });
  }
  async function importFiles(files) {
    const errors = []; for (const file of files) { try { const data = JSON.parse(await file.text()); if (data.exportType !== 'mix_it_up_day_student_portfolio') throw new Error('not a Mix-It-Up Day student portfolio'); const portfolio = normalise(data, file.name); portfolios.set(portfolio.username, portfolio); } catch (error) { errors.push(`${file.name}: ${error.message}`); } }
    if (!selectedUsername && portfolios.size) selectedUsername = [...portfolios.keys()][0];
    el.message.textContent = errors.length ? `Some files could not be imported: ${errors.join(' ')}` : `Imported ${files.length} portfolio${files.length === 1 ? '' : 's'}. Select a student to review their work.`; el.message.classList.toggle('error', errors.length > 0); renderList(); renderReview(); el.input.value = '';
  }
  function backup() { download(`mix-it-up-day-teacher-review-${datePart()}.json`, { exportType: 'mix_it_up_day_teacher_review_backup', exportedAt: new Date().toISOString(), portfolios: [...portfolios.values()].map(p => p.raw), teacherNotes }); }
  function aiBundle() {
    const students = [...portfolios.values()].map(student => ({ username: student.username, tasks: student.tasks.map(task => ({ taskId: task.id, title: task.title, taskContext: task.context, studentAnswer: task.answer, gridState: task.grid, status: task.status, approvalSnapshots: task.snapshots })) }));
    download(`mix-it-up-day-ai-review-bundle-${datePart()}.json`, { exportType: 'mix_it_up_day_username_only_ai_bundle', exportedAt: new Date().toISOString(), privacyNote: 'This bundle deliberately contains usernames and submitted work only. It omits teacher notes and raw portfolio metadata.', students });
  }
  el.input.addEventListener('change', event => importFiles([...event.target.files]));
  el.backup.addEventListener('click', backup); el.ai.addEventListener('click', aiBundle);
  el.clear.addEventListener('click', () => { portfolios.clear(); selectedUsername = ''; el.message.textContent = 'Class list cleared. Browser-only teacher notes remain available if these portfolios are imported again.'; el.message.classList.remove('error'); renderList(); renderReview(); });
  renderList();
}());

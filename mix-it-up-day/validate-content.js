const fs = require('fs'), path = require('path'), vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8'), banksSource = fs.readFileSync(path.join(__dirname, 'math-question-banks.js'), 'utf8'), sandbox = { window: {} };
vm.runInNewContext(source, sandbox); vm.runInNewContext(banksSource, sandbox);
const content = sandbox.window.MixContent, tasks = [...(content?.core || []), ...(content?.extras || [])];
const fail = message => { console.error(`FAIL: ${message}`); process.exitCode = 1; };
if (!content || !Array.isArray(content.core) || !Array.isArray(content.extras)) fail('MixContent must provide core and extras arrays.');
if (content.core.length !== 6) fail(`Expected 6 core challenges; found ${content.core.length}.`);
if (content.extras.length !== 6) fail(`Expected 6 extra challenges; found ${content.extras.length}.`);
const ids = new Set();
for (const task of tasks) {
  if (!task.id || ids.has(task.id)) fail(`Task ID missing or duplicated: ${task.id || '(missing)'}.`); ids.add(task.id);
  for (const key of ['title', 'brief', 'prompt', 'support', 'stretch']) if (!task[key]) fail(`${task.id}: missing ${key}.`);
  if (!Array.isArray(task.criteria) || task.criteria.length < 2) fail(`${task.id}: needs at least two success checks.`);
  if (!Array.isArray(task.fields) || !task.fields.length) fail(`${task.id}: needs fields.`);
  const fieldIds = new Set();
  for (const field of task.fields) {
    if (!field.id || fieldIds.has(field.id)) fail(`${task.id}: field ID missing or duplicated.`); fieldIds.add(field.id);
    if (!field.label || !field.type) fail(`${task.id}/${field.id}: field needs label and type.`);
    if (field.type === 'choice' && (!Array.isArray(field.options) || field.options.length < 2)) fail(`${task.id}/${field.id}: choice needs options.`);
    if (field.type === 'grid' && (!field.rows || !field.cols || !Array.isArray(field.palette))) fail(`${task.id}/${field.id}: grid needs dimensions and palette.`);
    if (field.type === 'text' && (!Array.isArray(field.wordTarget) || field.wordTarget.length !== 2 || field.wordTarget[0] > field.wordTarget[1])) fail(`${task.id}/${field.id}: text fields need a valid expected word range.`);
  }
}
const banks = sandbox.window.MixMathBanks || {}, expectedBanks = ['snack-shop','number-trick-lab','great-day-out','pixel-playground','sticker-swap','mini-golf-designer','mystery-number','would-you-rather'];
for (const id of expectedBanks) {
  const bank = banks[id] || [], ids = new Set();
  if (bank.length < 30) fail(`${id}: needs at least 30 varied maths questions.`);
  for (const question of bank) {
    if (!question.id || ids.has(question.id)) fail(`${id}: a maths question ID is missing or duplicated.`); ids.add(question.id);
    if (!question.prompt || !question.type || question.answer === undefined) fail(`${id}/${question.id}: question needs prompt, type and answer.`);
    const choices = question.choices || question.options;
    if (question.type === 'choice' && (!Array.isArray(choices) || !choices.length || !choices.includes(question.answer))) fail(`${id}/${question.id}: choice needs options that include its answer.`);
    if (question.type === 'numberLine' && (!(Array.isArray(question.ticks) || (Number.isFinite(question.min) && Number.isFinite(question.max) && Number.isFinite(question.ticks))) || Number(question.answer) < question.min || Number(question.answer) > question.max)) fail(`${id}/${question.id}: number line needs reachable ticks and bounds.`);
    if (question.type === 'fractionShade') { const match = String(question.answer).match(/^(\d+)\/(\d+)$/); if (!match || Number(match[1]) > Number(match[2]) || Number(match[2]) !== Number(question.denominator)) fail(`${id}/${question.id}: fraction shade needs a valid n/d answer.`); }
  }
}
if (!process.exitCode) console.log(`PASS: ${tasks.length} unique challenges and ${expectedBanks.length * 30} maths-bank questions are structurally complete.`);

const fs = require("fs");
const vm = require("vm");
const sandbox = { window: {} };
["content-english-hass.js", "content-maths.js", "content-science.js", "content-synthesis.js"].forEach(file => vm.runInNewContext(fs.readFileSync(`${__dirname}/${file}`, "utf8"), sandbox, { filename: file }));
const groups = [sandbox.window.FestivalEnglishHass, sandbox.window.FestivalMaths, sandbox.window.FestivalScience, sandbox.window.FestivalSynthesis];
const missions = groups.flatMap(group => group.missions);
const required = ["id", "title", "film", "caseOpening", "evidence", "support", "questions", "firstDecision", "update", "finalCriteria"];
let failed = false;
if (missions.length !== 12 || new Set(missions.map(m => m.id)).size !== 12 || new Set(missions.map(m => m.film)).size !== 12) { console.error("Expected 12 unique missions and films."); failed = true; }
missions.forEach(m => {
  const missing = required.filter(key => !m[key]);
  const phases = new Set(m.questions.map(q => q.phase));
  const words = [m.caseOpening.text, ...m.evidence.map(e => e.text), m.update.text].join(" ").trim().split(/\s+/).filter(Boolean).length;
  const linked = m.questions.some(q => (q.evidenceIds || []).length >= 2);
  const support = typeof m.support.text === "string" && m.support.text.trim().length > 0;
  const minimumWords = ["m03", "m05", "e03", "e04", "e05"].includes(m.id) ? 120 : 220;
  const pass = !missing.length && m.evidence.length >= 2 && m.questions.length >= 3 && phases.has("notice") && phases.has("connect") && phases.has("decide") && linked && support && words >= minimumWords;
  console.log(`${pass ? "PASS" : "FAIL"} ${m.id}: ${words} case words; ${m.evidence.length} evidence items; ${m.questions.length} questions.`);
  if (!pass) { console.error(`  Missing or weak fields: ${missing.join(", ") || "check phases, evidence links, support or word count"}`); failed = true; }
});
if (failed) process.exit(1);

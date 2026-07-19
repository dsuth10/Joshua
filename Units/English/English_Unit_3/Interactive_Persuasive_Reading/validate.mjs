import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const js = read("app.js");
const failures = [];
const passes = [];

function check(condition, message) {
  (condition ? passes : failures).push(message);
}

function sectionAfter(marker) {
  const markerAt = html.indexOf(marker);
  const start = html.indexOf(">", markerAt) + 1;
  let depth = 1;
  const token = /<div\b[^>]*>|<\/div>/g;
  token.lastIndex = start;
  let match;
  while ((match = token.exec(html))) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(start, match.index);
  }
  return "";
}

function plain(markup) {
  return markup
    .replace(/<sup>[\s\S]*?<\/sup>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&rsquo;|&#8217;/gi, "’")
    .replace(/&ldquo;|&#8220;/gi, "“")
    .replace(/&rdquo;|&#8221;/gi, "”")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text) {
  return text.match(/[A-Za-z0-9]+(?:[’'][A-Za-z]+)?(?:-[A-Za-z0-9]+)*/g)?.length || 0;
}

for (const file of ["index.html", "styles.css", "app.js", "validate.mjs"]) {
  check(fs.existsSync(path.join(root, file)), `${file} exists`);
}

const assets = [
  "assets/kitchen-garden-hero.png",
  "assets/kitchen-garden-learning.png",
  "assets/storytime-dog-hero.png",
  "assets/storytime-dog-library.png"
];
for (const asset of assets) {
  const full = path.join(root, asset);
  check(fs.existsSync(full) && fs.statSync(full).size > 50_000, `${asset} exists and is non-empty`);
  check(html.includes(`src="${asset}"`), `${asset} is referenced by the page`);
}

check(!/(?:src|href)="https?:\/\/[^\"]+\.(?:js|css|woff2?)\b/i.test(html), "No online runtime or font dependencies");
check(html.includes('<script src="app.js"></script>') && html.includes('<link rel="stylesheet" href="styles.css">'), "Portable local CSS and JavaScript are linked");

const gardenBody = sectionAfter("data-garden-body");
const gardenStandfirst = html.match(/<p class="standfirst">([\s\S]*?)<\/p>/)?.[1] || "";
const gardenParagraphs = [...gardenBody.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1]);
const gardenWordCount = words(plain([gardenStandfirst, ...gardenParagraphs].join(" ")));
check(gardenWordCount >= 380 && gardenWordCount <= 400, `Kitchen-garden model is 380–400 words (${gardenWordCount})`);

const requiredTechniqueEvidence = [
  "Imagine stepping outside", "Our School Council should approve", "24 school-garden interventions",
  "generally positive", "could", "may", "not promise a miracle", "plant, tend and taste",
  "Of course", "These are sensible concerns", "Therefore", "however", "grow knowledge, grow confidence",
  "Give our students", "A garden is not a decoration"
];
for (const phrase of requiredTechniqueEvidence) check(plain(gardenStandfirst + gardenBody).includes(phrase), `Garden model contains required craft evidence: “${phrase}”`);

const htmlAnnotations = [...html.matchAll(/data-annotation="(a\d{2})"/g)].map(match => match[1]);
const jsAnnotations = [...js.matchAll(/^\s+(a\d{2}):\s*\{/gm)].map(match => match[1]);
check(htmlAnnotations.length === 15 && new Set(htmlAnnotations).size === 15, "Exactly 15 unique clickable annotation targets");
check(JSON.stringify([...htmlAnnotations].sort()) === JSON.stringify([...jsAnnotations].sort()), "Every annotation target has matching analysis content");
check(htmlAnnotations.every(id => html.includes(`type="button" data-annotation="${id}"`)), "Annotations are keyboard-accessible buttons");

const expectedStory = [
  "Picture the library after lunch. A student opens a book, takes a breath and begins to read. Beside them, a trained dog waits — no frown, no interruption, no judgement. Our school should run a one-term Storytime Dog trial because it could strengthen reading confidence, support wellbeing and help more students feel that the library belongs to them.",
  "First, reading improves when students are willing to practise. For a hesitant reader, reading aloud can feel like walking onto a stage without rehearsing. A calm dog changes the audience. In a 2022 study of 24 young readers who needed extra support, researchers found evidence of improved reading performance, particularly after children read to a dog. The study was small, so it does not prove that every child will improve; however, it gives our school a sensible reason to test the idea carefully. A weekly session could turn “I can’t” into “I’ll try.”",
  "Just as importantly, a Storytime Dog could make reading feel safer. A systematic review found promising links between reading to dogs and greater motivation and confidence, as well as reduced anxiety, although the researchers warned that the overall evidence was still limited. That honest caution matters. We should not promise a miracle. We should offer a welcoming, well-supervised space where students can practise, connect and succeed one page at a time.",
  "Of course, some families may worry about allergies, fear or distraction. These concerns are valid — and they are exactly why the program must be planned, not improvised. NSW Department of Education guidance recommends notifying families, identifying allergies or fears, providing handwashing, using a handler and completing a risk assessment. Students who do not wish to participate must have an equally supportive reading option. With clear boundaries, a rest space for the dog and short scheduled sessions, safety and inclusion can guide every decision.",
  "Therefore, the School Council should approve a one-term trial for a small group of volunteer readers. Teachers could track attendance, reading confidence and student feedback before reviewing the results with families. A Storytime Dog will not replace skilled teaching, patient adults or daily practice. It could, however, open the door for students who are still waiting to see themselves as readers. Let us give them a calm listener, a fair chance and one more reason to turn the page."
];
const storyBody = sectionAfter("data-storytime-body");
const actualStory = [...storyBody.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => plain(match[1]));
check(actualStory.length === 5 && expectedStory.every((paragraph, i) => actualStory[i] === paragraph), "Storytime Dog body wording matches the authoritative exemplar");
for (const heading of ["Confidence grows through practice", "Calm minds are ready to learn", "Safety must come first", "Start small. Measure carefully. Decide together."]) check(storyBody.includes(`<h3>${heading}</h3>`), `Storytime heading preserved: ${heading}`);
check(html.includes("A persuasive proposal to the School Council · 386 words"), "Storytime Dog 386-word metadata is preserved");
check(html.includes("A calm listener can make a brave reader.") && html.includes("The goal is not a novelty. It is a safe routine that invites students into reading."), "Both Storytime image captions are preserved");
check(["Supporting Young Readers", "Children Reading to Dogs", "Support Dog Guidelines"].every(note => html.includes(note)), "All Storytime evidence notes are preserved");

const questionIds = [...js.matchAll(/\{ id: "(q\d+)"/g)].map(match => match[1]);
const expectedIds = Array.from({ length: 17 }, (_, i) => `q${i + 1}`);
check(expectedIds.every(id => questionIds.includes(id)) && new Set(questionIds.filter(id => expectedIds.includes(id))).size === 17, "Q1–Q17 are present exactly once in question configuration");
check(js.includes('stretch: true') && js.includes('coreQuestionsTotal: 16'), "Q17 is optional Stretch and excluded from 16 core questions");
check((js.match(/id: "p[1-5]"/g) || []).length === 5, "Five practice checks are configured");
check(js.includes('dataset.locked = practiceCount === 5') && js.includes('practiceCount !== 5'), "Apply unlock requires all five practice checks");

for (const field of ["schemaVersion", "exportType", "activity", "student", "timestamps", "completion", "learning", "sections", "responses", "checkStatus", "attemptCount"]) check(js.includes(field), `Export schema includes ${field}`);
check(js.includes('literacy_persuasive_techniques_student_response'), "Literacy workflow export type is versioned and named");
check(js.includes('localStorage.setItem(STORAGE_KEY') && js.includes('persuasion-lab-v1'), "Versioned localStorage autosave is implemented");
check(js.includes("window.confirm") && js.includes("importJson") && js.includes("exportHtml") && js.includes("exportJson"), "Reset, import and both export paths are implemented");
check(css.includes("prefers-reduced-motion") && css.includes(":focus-visible") && css.includes("min-height: 44px"), "Reduced motion, visible focus and 44px touch targets are styled");
check(css.includes("@media (max-width: 620px)") && css.includes("@media (max-width: 900px)"), "Phone, tablet and desktop responsive layouts are defined");
check(html.includes('aria-label="Reading controls"') && html.includes('aria-labelledby="analysis-title"') && html.includes('role="status"'), "Key controls and feedback have accessible labels and live status");

console.log(`\nPersuasive Reading Lab validation: ${passes.length} checks passed.`);
for (const message of passes) console.log(`  PASS  ${message}`);
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:`);
  for (const message of failures) console.error(`  FAIL  ${message}`);
  process.exit(1);
}
console.log("\nAll local validation checks passed.");

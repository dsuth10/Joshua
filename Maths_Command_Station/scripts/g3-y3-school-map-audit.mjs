/**
 * G3 Year 3 school map (AC9M3SP02) regression audit.
 * Ensures Y3 Space uses familiar top-view map language, not Cartesian coordinates.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const REQUIRED_CONTEXTS = ['familiar-map-interpret', 'familiar-map-create'];
const DEPRECATED_CONTEXTS = ['landmark-locate-coords', 'landmark-navigate-coords'];
const FORBIDDEN_PHRASES = [
  'x-coordinate',
  'y-coordinate',
  'coordinate pair',
  'units Right',
  'units Up',
  'Cartesian',
  '(x, y)',
];
const REQUIRED_WIDGET_FLAGS = [
  "presentation: 'school-map'",
  'hideGridLabels: true',
  'landmarkLabels: true',
];

function loadFiles() {
  return {
    practice: readFileSync(join(root, 'year3-practice.js'), 'utf8'),
    assessment: readFileSync(join(root, 'year3.js'), 'utf8'),
    html: readFileSync(join(root, 'year3.html'), 'utf8'),
    achievements: readFileSync(join(root, 'achievements-config.js'), 'utf8'),
    schoolMap: readFileSync(join(root, 'y3-school-map.js'), 'utf8'),
    spaceWidget: readFileSync(join(root, 'widgets/mcs-widgets-space.js'), 'utf8'),
  };
}

function auditPractice(src, schoolMapSrc) {
  const issues = [];
  const combined = src + '\n' + schoolMapSrc;
  REQUIRED_CONTEXTS.forEach((ctx) => {
    if (!combined.includes(`context: '${ctx}'`) && !combined.includes(`context: "${ctx}"`)) {
      issues.push(`practice missing context: ${ctx}`);
    }
  });
  DEPRECATED_CONTEXTS.forEach((ctx) => {
    if (combined.includes(`context: '${ctx}'`) || combined.includes(`context: "${ctx}"`)) {
      issues.push(`practice still emits deprecated context: ${ctx}`);
    }
  });
  if (!src.includes('Y3SchoolMap.generatePracticeQuestion')) {
    issues.push('practice space generator not wired to Y3SchoolMap');
  }
  return issues;
}

function auditForbiddenLanguage(files) {
  const issues = [];
  const spaceBlob = [files.practice, files.assessment, files.html, files.schoolMap].join('\n');
  FORBIDDEN_PHRASES.forEach((phrase) => {
    if (spaceBlob.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`forbidden coordinate phrase found: ${phrase}`);
    }
  });
  if (files.achievements.includes('landmark coordinates') && !files.achievements.includes('top-view maps')) {
    issues.push('achievements-config still describes coordinate-focused AC9M3SP02');
  }
  return issues;
}

function auditWidget(files) {
  const issues = [];
  if (!files.spaceWidget.includes("presentation === 'school-map'")) {
    issues.push('mcs-widgets-space.js missing school-map presentation');
  }
  REQUIRED_WIDGET_FLAGS.forEach((flag) => {
    if (!files.schoolMap.includes(flag.split(':')[0])) {
      issues.push(`y3-school-map.js missing flag pattern: ${flag}`);
    }
  });
  return issues;
}

function auditAssessment(files) {
  const issues = [];
  if (files.html.includes('DISPATCH_RADAR')) {
    issues.push('year3.html still uses DISPATCH_RADAR panel');
  }
  if (files.html.includes('ROUTE VAN') || files.html.includes('btn-run-delivery')) {
    issues.push('year3.html still references ROUTE VAN');
  }
  if (!files.html.includes('SCHOOL_MAP_RESCUE')) {
    issues.push('year3.html missing SCHOOL_MAP_RESCUE panel');
  }
  if (!files.assessment.includes('mountSchoolMapWidget')) {
    issues.push('year3.js missing mountSchoolMapWidget');
  }
  if (files.assessment.includes("mode: 'path-rover'")) {
    issues.push('year3.js still mounts path-rover for assessment');
  }
  if (!files.assessment.includes('PART_C: SCHOOL_MAP_RESCUE')) {
    issues.push('year3.js missing SCHOOL_MAP_RESCUE rubric row');
  }
  if (files.assessment.includes('vanDeliveryRan')) {
    issues.push('year3.js still scores space via vanDeliveryRan');
  }
  if (!files.assessment.includes('mapScore')) {
    issues.push('year3.js missing mapScore grading');
  }
  if (files.assessment.includes('coordinate grid pathing')) {
    issues.push('year3.js teacher feedback still mentions coordinate grid pathing');
  }
  if (!files.assessment.includes('mapSelectedCol')) {
    issues.push('year3.js missing map selection state');
  }
  return issues;
}

function auditAchievements(src) {
  const issues = [];
  REQUIRED_CONTEXTS.forEach((ctx) => {
    if (!src.includes(`'${ctx}'`)) {
      issues.push(`achievements-config missing context: ${ctx}`);
    }
  });
  return issues;
}

async function browserSmoke() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    return { skipped: true, reason: 'playwright not installed' };
  }
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto(pathToFileURL(join(root, 'year3-practice.html')).href, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
  await page.goto(pathToFileURL(join(root, 'year3.html')).href, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
  await browser.close();
  return { skipped: false, errors };
}

const files = loadFiles();
const practiceIssues = auditPractice(files.practice, files.schoolMap);
const languageIssues = auditForbiddenLanguage(files);
const widgetIssues = auditWidget(files);
const assessmentIssues = auditAssessment(files);
const achievementIssues = auditAchievements(files.achievements);
const allIssues = [
  ...practiceIssues,
  ...languageIssues,
  ...widgetIssues,
  ...assessmentIssues,
  ...achievementIssues,
];

console.log('=== G3 Year 3 School Map Audit (AC9M3SP02) ===\n');

console.log('--- Practice contexts ---');
console.log(practiceIssues.length ? `FAIL — ${practiceIssues.join('; ')}` : 'PASS');

console.log('\n--- Widget school-map presentation ---');
console.log(widgetIssues.length ? `FAIL — ${widgetIssues.join('; ')}` : 'PASS');

console.log('\n--- Assessment wiring ---');
console.log(assessmentIssues.length ? `FAIL — ${assessmentIssues.join('; ')}` : 'PASS');

console.log('\n--- Achievements ---');
console.log(achievementIssues.length ? `FAIL — ${achievementIssues.join('; ')}` : 'PASS');

console.log('\n--- Forbidden coordinate language ---');
console.log(languageIssues.length ? `FAIL — ${languageIssues.join('; ')}` : 'PASS');

const smoke = await browserSmoke();
if (smoke.skipped) {
  console.log(`\nBrowser smoke: SKIPPED (${smoke.reason})`);
} else if (smoke.errors.length) {
  console.log(`\nBrowser smoke: FAIL — ${smoke.errors.length} error(s)`);
  smoke.errors.slice(0, 8).forEach((e) => console.log(`  - ${e}`));
} else {
  console.log('\nBrowser smoke: PASS');
}

console.log(`\nOverall: ${allIssues.length || (smoke.errors && smoke.errors.length) ? 'FAIL' : 'PASS'}`);
process.exitCode = allIssues.length || (smoke.errors && smoke.errors.length) ? 1 : 0;

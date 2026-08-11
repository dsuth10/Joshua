#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillDirectory = resolve(scriptDirectory, '..');
const workspaceDirectory = resolve(skillDirectory, '..', '..', '..');
const failures = [];

function check(name, condition, detail) {
  const status = condition ? 'PASS' : 'FAIL';
  console.log(`${status} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(name);
}

function read(relativePath) {
  return readFileSync(resolve(workspaceDirectory, relativePath), 'utf8');
}

function localMarkdownLinks(text) {
  return [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1])
    .filter((target) => !/^(?:https?:|file:|#)/.test(target));
}

function verifyFixtures() {
  const fixturePath = resolve(skillDirectory, 'fixtures', 'unit-routing-fixtures.json');
  if (!existsSync(fixturePath)) {
    check('routing fixtures', false, 'fixture file is missing');
    return;
  }

  try {
    const fixtures = JSON.parse(readFileSync(fixturePath, 'utf8'));
    const requiredIds = new Set([
      'english-long-form',
      'science-medium-form',
      'mathematics-short-form',
      'hass-integrated',
    ]);
    const ids = new Set(fixtures.map((fixture) => fixture.id));
    const hasRequiredFields = fixtures.every((fixture) => {
      const routing = fixture.expectedRouting;
      return (
        fixture.id &&
        fixture.learningArea &&
        fixture.yearLevel &&
        fixture.duration &&
        fixture.request &&
        routing?.curriculumAuthority &&
        routing.subjectAdapter &&
        routing.lessonExecutor &&
        (!routing.excludedSkills || Array.isArray(routing.excludedSkills)) &&
        (!routing.conditionalSkills || Array.isArray(routing.conditionalSkills))
      );
    });
    check(
      'routing fixtures',
      requiredIds.size === ids.size && [...requiredIds].every((id) => ids.has(id)) && hasRequiredFields,
      'English, Science, Mathematics, and HASS coverage',
    );
  } catch (error) {
    check('routing fixtures', false, error.message);
  }
}

function verifyCurriculumQuery() {
  const queryScript = resolve(
    workspaceDirectory,
    '.agent',
    'skills',
    'curriculum-master',
    'scripts',
    'query_curriculum.py',
  );
  const result = spawnSync(
    'python',
    [queryScript, '--learning_area', 'english', '--year_level', '5', '--format', 'json'],
    { cwd: workspaceDirectory, encoding: 'utf8' },
  );

  if (result.error || result.status !== 0) {
    check('curriculum query executes', false, result.error?.message ?? result.stderr.trim());
    return;
  }

  try {
    const descriptors = JSON.parse(result.stdout);
    const codes = descriptors.map((descriptor) => descriptor.code);
    check('curriculum query emits JSON', Array.isArray(descriptors), 'Year 5 English');
    check(
      'curriculum query has unique codes',
      codes.length === new Set(codes).size,
      `${codes.length} descriptors`,
    );
  } catch (error) {
    check('curriculum query emits JSON', false, error.message);
    check('curriculum query has unique codes', false, 'cannot assess invalid JSON');
  }
}

console.log('Unit Wayfinder integration audit');

const requiredFiles = [
  'SKILL.md',
  'agents/openai.yaml',
  'references/questioning.md',
  'references/domain-language.md',
  'references/research.md',
  'references/prototyping.md',
];
for (const relativePath of requiredFiles) {
  check(`package file ${relativePath}`, existsSync(resolve(skillDirectory, relativePath)));
}

const skillText = readFileSync(resolve(skillDirectory, 'SKILL.md'), 'utf8');
check(
  'skill frontmatter',
  /^---\r?\nname: unit-wayfinder\r?\ndescription: .+\r?\n---/s.test(skillText),
  'name and description',
);
for (const target of new Set(localMarkdownLinks(skillText))) {
  check(`local link ${target}`, existsSync(resolve(skillDirectory, target)));
}

check(
  'Codex discovery location',
  existsSync(resolve(workspaceDirectory, '.agents', 'skills', 'unit-wayfinder', 'SKILL.md')) &&
    existsSync(resolve(workspaceDirectory, '.agents', 'skills', 'curriculum-master', 'SKILL.md')),
  'both skills must be available from .agents/skills',
);
check(
  'Wayfinding tracker operations',
  existsSync(resolve(workspaceDirectory, 'docs', 'agents', 'issue-tracker.md')),
  'docs/agents/issue-tracker.md',
);

for (const routedSkill of [
  '.agent/skills/curriculum-master/SKILL.md',
  '.agent/skills/english-teaching-sequence/SKILL.md',
  '.agent/skills/lesson-creator/SKILL.md',
  '.agent/skills/electricity-unit-lesson-creator/SKILL.md',
  '.agent/skills/augmented-assessments/SKILL.md',
  '.agents/skills/build-engaging-lessons/SKILL.md',
]) {
  check(`routed skill ${routedSkill}`, existsSync(resolve(workspaceDirectory, routedSkill)));
}

for (const contract of [
  'references/skill-routing.md',
  'references/curriculum-alignment.md',
  'references/unit-output-contract.md',
]) {
  check(`integration contract ${contract}`, existsSync(resolve(skillDirectory, contract)));
}

verifyFixtures();
verifyCurriculumQuery();

const curriculumSkill = read('.agent/skills/curriculum-master/SKILL.md');
check(
  'curriculum scope is accurate',
  !curriculumSkill.includes('all curriculum standards'),
  'describe the current dataset as content descriptors until standards coverage exists',
);

if (failures.length) {
  console.log(`\nFAIL — ${failures.length} check(s) require attention.`);
  process.exitCode = 1;
} else {
  console.log('\nPASS — Unit Wayfinder integration gate is green.');
}

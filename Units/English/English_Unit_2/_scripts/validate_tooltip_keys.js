#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const unitRoot = path.resolve(__dirname, '..');
const UNIT_CONFIGS = [
  {
    name: 'Bushfires',
    root: path.join(unitRoot, 'Bushfires'),
    glossaryFile: path.join(unitRoot, 'Bushfires', 'Assets', 'tooltip.js'),
    glossaryObjectMarker: 'const GLOSSARY = {',
    htmlStrategy: 'keyOnly'
  },
  {
    name: 'Floods',
    root: path.join(unitRoot, 'Floods'),
    glossaryFile: path.join(unitRoot, 'Floods', 'Assets', 'floods-glossary.js'),
    glossaryObjectMarker: 'const glossaryTerms = {',
    htmlStrategy: 'keyOrTermText'
  },
  {
    name: 'Earthquakes',
    root: path.join(unitRoot, 'Earthquakes'),
    glossaryFile: path.join(unitRoot, 'Earthquakes', 'Assets', 'glossary.js'),
    glossaryObjectMarker: 'const earthquakeGlossary = {',
    htmlStrategy: 'keyOrTermText'
  }
];

function readFileOrDie(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing required file: ${filePath}`);
    process.exit(2);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function getGlossaryBody(source, marker) {
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error(`Could not find glossary marker \`${marker}\``);
  }

  const fromMarker = source.slice(start + marker.length);
  const end = fromMarker.indexOf('};');

  if (end === -1) {
    throw new Error('Could not find end of glossary object');
  }

  return fromMarker.slice(0, end);
}

function extractGlossaryKeys(source, marker) {
  const body = getGlossaryBody(source, marker);
  const objectLiteral = `{${body}}`;
  const parsed = Function(`"use strict"; return (${objectLiteral});`)();
  return new Set(Object.keys(parsed));
}

function collectHtmlFiles(dir) {
  const output = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...collectHtmlFiles(entryPath));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      output.push(entryPath);
    }
  }

  return output;
}

function normalizeTerm(term) {
  return term
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isLikelyInlineDefinition(value) {
  return /\s/.test(value);
}

function extractTooltipReferencesFromHtml(htmlSource) {
  const refs = [];
  const elementRegex = /<([a-zA-Z0-9]+)([^>]*\sdata-tooltip="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/g;
  let match;

  while ((match = elementRegex.exec(htmlSource)) !== null) {
    refs.push({
      rawAttr: match[3].trim(),
      innerText: normalizeTerm(match[4])
    });
  }

  return refs;
}

function toRelative(filePath) {
  return path.relative(unitRoot, filePath).replaceAll(path.sep, '/');
}

function validateUnit(config) {
  const glossarySource = readFileOrDie(config.glossaryFile);
  const glossaryKeys = extractGlossaryKeys(glossarySource, config.glossaryObjectMarker);
  const glossaryKeysLower = new Set([...glossaryKeys].map((key) => key.toLowerCase()));

  const htmlFiles = collectHtmlFiles(config.root);
  const referencedKeys = new Set();
  const keyToFiles = new Map();
  const missingKeys = new Map();

  for (const htmlFile of htmlFiles) {
    const htmlSource = fs.readFileSync(htmlFile, 'utf8');
    const refs = extractTooltipReferencesFromHtml(htmlSource);

    for (const ref of refs) {
      const { rawAttr, innerText } = ref;
      const fileRel = toRelative(htmlFile);

      const addMissing = (missingKey) => {
        if (!missingKeys.has(missingKey)) {
          missingKeys.set(missingKey, new Set());
        }
        missingKeys.get(missingKey).add(fileRel);
      };

      if (rawAttr && rawAttr !== 'true' && !isLikelyInlineDefinition(rawAttr)) {
        referencedKeys.add(rawAttr);
        if (!keyToFiles.has(rawAttr)) keyToFiles.set(rawAttr, new Set());
        keyToFiles.get(rawAttr).add(fileRel);
        if (!glossaryKeys.has(rawAttr)) addMissing(rawAttr);
        continue;
      }

      if (config.htmlStrategy === 'keyOrTermText' && innerText) {
        referencedKeys.add(innerText);
        if (!keyToFiles.has(innerText)) keyToFiles.set(innerText, new Set());
        keyToFiles.get(innerText).add(fileRel);
        if (!glossaryKeysLower.has(innerText.toLowerCase()) && (!rawAttr || rawAttr === 'true' || rawAttr === '')) {
          addMissing(innerText);
        }
      }
    }
  }

  const unusedKeys = [...glossaryKeys].filter((key) => !referencedKeys.has(key) && !referencedKeys.has(key.toLowerCase())).sort();
  const missingSorted = [...missingKeys.keys()].sort();

  return {
    config,
    htmlFileCount: htmlFiles.length,
    glossaryKeyCount: glossaryKeys.size,
    referencedCount: referencedKeys.size,
    missingSorted,
    missingKeys,
    unusedKeys
  };
}

function main() {
  const results = [];

  for (const config of UNIT_CONFIGS) {
    try {
      results.push(validateUnit(config));
    } catch (error) {
      console.error(`Failed to validate ${config.name}: ${error.message}`);
      process.exit(2);
    }
  }

  let hasMissing = false;

  for (const result of results) {
    const { config, htmlFileCount, glossaryKeyCount, referencedCount, missingSorted, missingKeys, unusedKeys } = result;
    console.log(`\n=== ${config.name} ===`);
    console.log(`Checked ${htmlFileCount} HTML files.`);
    console.log(`Glossary keys: ${glossaryKeyCount} | Referenced tooltip terms/keys: ${referencedCount}`);

    if (missingSorted.length === 0) {
      console.log('\nNo missing tooltip keys/terms.');
    } else {
      hasMissing = true;
      console.log(`\nMissing tooltip keys/terms (${missingSorted.length}):`);
      for (const key of missingSorted) {
        const files = [...(missingKeys.get(key) || [])].sort();
        console.log(`- ${key}`);
        for (const file of files) {
          console.log(`  - ${file}`);
        }
      }
    }

    if (unusedKeys.length === 0) {
      console.log('\nNo unused glossary keys.');
    } else {
      console.log(`\nUnused glossary keys (${unusedKeys.length}):`);
      for (const key of unusedKeys) {
        console.log(`- ${key}`);
      }
    }
  }

  if (hasMissing) {
    console.error('\nValidation failed: missing tooltip glossary definitions found.');
    process.exit(1);
  }

  console.log('\nValidation passed.');
}

main();

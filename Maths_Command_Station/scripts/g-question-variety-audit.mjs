import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const practiceFiles = [
  'prep-practice.js',
  'year1-practice.js',
  'year2-practice.js',
  'year3-practice.js',
  'year4-practice.js',
  'year5-practice.js',
  'year6-practice.js'
];

let totalFails = 0;

console.log('=== G-Question Variety Audit (Slice 0) ===\n');

for (const file of practiceFiles) {
  let content;
  try {
    content = readFileSync(join(root, file), 'utf8');
  } catch (e) {
    console.log(`Could not read ${file}`);
    continue;
  }

  // 1. Find functions starting with generate
  const fnRegex = /function\s+(generate[A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
  let match;
  let generators = [];

  while ((match = fnRegex.exec(content)) !== null) {
    const fnName = match[1];
    const startIndex = match.index;
    
    // Find the end of the function by counting braces
    let braceCount = 0;
    let inString = false;
    let stringChar = null;
    let endIndex = startIndex;
    let bodyStart = -1;
    
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i+1];
      
      if (!inString) {
        if (char === "'" || char === '"' || char === '`') {
          inString = true;
          stringChar = char;
        } else if (char === '{') {
          braceCount++;
          if (bodyStart === -1) bodyStart = i;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0 && bodyStart !== -1) {
            endIndex = i;
            break;
          }
        } else if (char === '/' && (nextChar === '/' || nextChar === '*')) {
            if (nextChar === '/') {
                while(i < content.length && content[i] !== '\n') i++;
            } else {
                while(i < content.length && !(content[i] === '*' && content[i+1] === '/')) i++;
                i++; 
            }
        }
      } else {
        if (char === '\\') i++; 
        else if (char === stringChar) inString = false;
      }
    }
    
    const fnBody = content.substring(bodyStart, endIndex + 1);
    generators.push({ name: fnName, body: fnBody });
  }

  const staticGens = generators.filter(g => {
    const hasRandom = g.body.includes('Math.random') || g.body.includes('randomInt') || g.body.includes('shuffle');
    const hasVariantsArray = g.body.includes('variants');
    const deckShuffle = g.body.includes('MCS.questionPicker.shuffleDeck');
    return !hasRandom && !hasVariantsArray && !deckShuffle;
  });

  // 2. Find gap generator pools
  let finitePools = [];
  const gapRegex = /\[\s*((?:makeLegacyNumeric|makeLegacyChoice)[\s\S]*?)\s*\]/g;
  let poolMatch;
  while ((poolMatch = gapRegex.exec(content)) !== null) {
      const poolStr = poolMatch[1];
      // Count how many 'makeLegacy' are in this array
      const count = (poolStr.match(/makeLegacy/g) || []).length;
      if (count > 0 && count < 5) {
          finitePools.push({ count, str: poolMatch[0].substring(0, 50).replace(/\n/g, '') + '...' });
      }
  }

  // Small variants arrays like: `variants: [ ... ]`
  const variantsRegex = /variants\s*:\s*\[([^\]]+)\]/g;
  let vMatch;
  while ((vMatch = variantsRegex.exec(content)) !== null) {
      const itemsStr = vMatch[1];
      // simplistic split by comma
      const items = itemsStr.split(',').filter(s => s.trim().length > 0 && !s.includes('//'));
      if (items.length > 0 && items.length < 5) {
          finitePools.push({ count: items.length, str: 'variants array: ' + vMatch[0].substring(0, 50).replace(/\n/g, '') });
      }
  }

  if (staticGens.length > 0 || finitePools.length > 0) {
    console.log(`\n[${file}] FAIL`);
    if (staticGens.length > 0) {
      console.log(`  Static generators (no randomisation): ${staticGens.length}`);
      staticGens.forEach(g => console.log(`    - ${g.name}`));
    }
    if (finitePools.length > 0) {
      console.log(`  Finite pools < 5 variants: ${finitePools.length}`);
      finitePools.forEach(p => console.log(`    - Pool size ${p.count}: ${p.str}`));
    }
    totalFails += staticGens.length + finitePools.length;
  } else {
    console.log(`[${file}] PASS`);
  }
}

// 3. Ensure questionPicker is wired
let pickerWired = false;
try {
    const y3 = readFileSync(join(root, 'year3-practice.js'), 'utf8');
    if (y3.includes('MCS.questionPicker')) pickerWired = true;
} catch (e) {}

if (!pickerWired) {
    console.log(`\n[picker integration] FAIL - MCS.questionPicker not used in year3-practice.js`);
    totalFails++;
}

if (totalFails > 0) {
  console.log(`\nAudit failed: ${totalFails} issues found.`);
  process.exitCode = 1;
} else {
  console.log('\nAudit passed! All generators use randomisation or sufficient variety.');
  process.exitCode = 0;
}

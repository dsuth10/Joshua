import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const files = [
  'prep-practice.html',
  'year1-practice.html',
  'year2-practice.html',
  'year3-practice.html',
  'year4-practice.html',
  'year5-practice.html',
  'year6-practice.html'
];

files.forEach(f => {
  let content = readFileSync(f, 'utf8');
  if (!content.includes('mcs-question-picker.js')) {
    content = content.replace(
      '<script defer src="widgets/mcs-core.js"></script>',
      '<script defer src="mcs-question-picker.js"></script>\n    <script defer src="widgets/mcs-core.js"></script>'
    );
    writeFileSync(f, content);
    console.log(`Updated ${f}`);
  } else {
    console.log(`Already updated ${f}`);
  }
});

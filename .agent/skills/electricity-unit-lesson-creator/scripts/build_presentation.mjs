#!/usr/bin/env node
/**
 * Electricity unit presentation builder.
 * Compiles TP##_Presentation.html using the classroom-presentation shell.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compilePresentation } from '../../classroom-presentation/scripts/build_presentation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.join(__dirname, '..');
const TEMPLATE = path.join(SKILL_ROOT, 'assets', 'presentation_template.html');
const SCIENCE_CSS = path.join(SKILL_ROOT, 'assets', 'shared-presentation.css');
const SCIENCE_JS = path.join(SKILL_ROOT, 'assets', 'shared-interactions.js');

/**
 * @param {object} opts
 * @param {string} opts.slidesHtml
 * @param {string} opts.outputPath
 * @param {string} opts.title
 * @param {string} [opts.resourceId] - e.g. TP01
 */
export function buildElectricityPresentation({ slidesHtml, outputPath, title, resourceId }) {
  const css = fs.readFileSync(SCIENCE_CSS, 'utf8');
  const js = fs.readFileSync(SCIENCE_JS, 'utf8');

  const extraHead = `
<style id="science-presentation-extensions">
${css}
</style>
${resourceId ? `<!-- resource-id: ${resourceId} -->` : ''}`;

  const extraScripts = `
<script id="science-interactions">
${js}
</script>`;

  return compilePresentation({
    slidesHtml,
    outputPath,
    title,
    templatePath: TEMPLATE,
    extraHead,
    extraScripts,
  });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith('--')) {
      args[key.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function cli() {
  const args = parseArgs(process.argv);
  if (!args.slides || !args.output) {
    console.error('Usage: node build_presentation.mjs --slides slides.html --output TP01_Presentation.html --title "Lesson title" [--resource-id TP01]');
    process.exit(1);
  }

  const slidesHtml = fs.readFileSync(path.resolve(args.slides), 'utf8');
  const out = buildElectricityPresentation({
    slidesHtml,
    outputPath: path.resolve(args.output),
    title: args.title || 'Electricity Lesson Presentation',
    resourceId: args['resource-id'],
  });
  console.log(`✅ Electricity presentation built: ${out}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  cli().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

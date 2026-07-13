#!/usr/bin/env node
/**
 * Classroom Presentation Compiler
 * Injects slide HTML into the canonical wrapper template.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_TEMPLATE = path.join(__dirname, '..', 'assets', 'presentation_template.html');
const SLIDE_PLACEHOLDER = '<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->';

const REQUIRED_MARKERS = [
  'id="presentationContainer"',
  'id="masterToolbar"',
  'id="teacherNotesPanel"',
  'id="whiteboardOverlay"',
  'id="imageLightbox"',
  'id="pathwayToggle"',
  'id="teacherShowAnswerBtn"',
];

/**
 * @param {object} options
 * @param {string} options.slidesHtml - Raw HTML for all slides
 * @param {string} options.outputPath - Destination file path
 * @param {string} [options.title] - Document title
 * @param {string} [options.templatePath] - Override template path
 * @param {string} [options.extraHead] - Additional HTML before </head>
 * @param {string} [options.extraScripts] - Additional HTML before </body>
 */
export function compilePresentation({
  slidesHtml,
  outputPath,
  title,
  templatePath = DEFAULT_TEMPLATE,
  extraHead = '',
  extraScripts = '',
}) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  let html = fs.readFileSync(templatePath, 'utf8');

  for (const marker of REQUIRED_MARKERS) {
    if (!html.includes(marker)) {
      throw new Error(`Wrapper integrity error: missing ${marker}`);
    }
  }

  if (!html.includes(SLIDE_PLACEHOLDER)) {
    throw new Error(`Template missing slide placeholder: ${SLIDE_PLACEHOLDER}`);
  }

  html = html.replace(SLIDE_PLACEHOLDER, slidesHtml.trim());

  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  }

  if (extraHead) {
    html = html.replace('</head>', `${extraHead}\n</head>`);
  }

  if (extraScripts) {
    html = html.replace('</body>', `${extraScripts}\n</body>`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
  return outputPath;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    console.error(`Usage: node build_presentation.mjs --slides slides.html --output out.html [--title "Title"] [--template path]`);
    process.exit(1);
  }

  const slidesHtml = fs.readFileSync(path.resolve(args.slides), 'utf8');
  const out = compilePresentation({
    slidesHtml,
    outputPath: path.resolve(args.output),
    title: args.title,
    templatePath: args.template ? path.resolve(args.template) : DEFAULT_TEMPLATE,
    extraHead: args.extraHead ? fs.readFileSync(path.resolve(args.extraHead), 'utf8') : '',
    extraScripts: args.extraScripts ? fs.readFileSync(path.resolve(args.extraScripts), 'utf8') : '',
  });
  console.log(`✅ Presentation compiled: ${out}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  cli().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

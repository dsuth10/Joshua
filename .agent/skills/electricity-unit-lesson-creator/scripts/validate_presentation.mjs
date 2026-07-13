#!/usr/bin/env node
/**
 * Electricity presentation validator — P0 gate before marking a deck complete.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REQUIRED_IDS = [
  'presentationContainer',
  'masterToolbar',
  'teacherNotesPanel',
  'whiteboardOverlay',
  'imageLightbox',
  'pathwayToggle',
  'teacherShowAnswerBtn',
];

const FORBIDDEN_PATTERNS = [
  { pattern: /class="teacher-notes-panel"/i, message: 'Always-visible teacher-notes-panel side column (use hidden .teacher-notes + drawer)' },
  { pattern: /max-width:\s*1200px/i, message: 'Card-in-viewport layout (max-width 1200px centred card)' },
  { pattern: /<div class="slide"/i, message: 'Slides must use <section class="slide"> not <div class="slide">' },
  { pattern: /pathway-labels|class="label-standard"|class="label-support"/i, message: 'Pathway toggle must not display year or difficulty labels' },
];

const FORBIDDEN_TOGGLE_LABELS = /\b(Y6|Y2|Year\s*6|Year\s*2|Standard|Support|Lucas|Easy|Hard)\b/i;

function validatePathwayToggle(html) {
  const errors = [];
  const toggleMatch = html.match(/<div[^>]*id="pathwayToggle"[^>]*>[\s\S]*?<\/div>\s*(?=<div|<nav|<section)/i);
  if (!toggleMatch) return errors;

  const toggleHtml = toggleMatch[0];
  if (FORBIDDEN_TOGGLE_LABELS.test(toggleHtml.replace(/aria-label="Toggle reading pathway"/gi, ''))) {
    errors.push('Pathway toggle exposes year level, difficulty, or pathway name — use a blank switch only');
  }
  if (/title="[^"]*(Year|Y6|Y2|Standard|Support|Lucas)/i.test(toggleHtml)) {
    errors.push('Pathway toggle title attribute must not mention year level or pathway names');
  }
  return errors;
}

/**
 * @param {string} htmlPath
 * @param {object} [options]
 * @param {boolean} [options.requireDualLevel=true]
 * @param {string} [options.lessonDir] - For Excalidraw co-location checks
 */
export function validatePresentation(htmlPath, options = {}) {
  const { requireDualLevel = true, lessonDir } = options;
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(htmlPath)) {
    return { pass: false, errors: [`File not found: ${htmlPath}`], warnings: [] };
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const baseDir = lessonDir || path.dirname(htmlPath);

  for (const id of REQUIRED_IDS) {
    if (!html.includes(`id="${id}"`)) {
      errors.push(`Missing required wrapper ID: #${id}`);
    }
  }

  for (const { pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(html)) {
      errors.push(`Forbidden pattern: ${message}`);
    }
  }

  errors.push(...validatePathwayToggle(html));

  const slideSections = html.match(/<section[^>]*class="[^"]*slide[^"]*"[^>]*>[\s\S]*?<\/section>/gi) || [];
  if (slideSections.length < 6) {
    warnings.push(`Only ${slideSections.length} slides found; electricity decks typically need 10+ for full lesson sequence`);
  }

  let instructionalCount = 0;
  let dualLevelCount = 0;

  slideSections.forEach((slide, idx) => {
    const isDarkTitle = /theme-dark/.test(slide) && idx === 0;
    const isExit = /Review|Exit|Next Steps/i.test(slide) && idx === slideSections.length - 1;
    const isInstructional = !isDarkTitle && !isExit;

    if (isInstructional) {
      instructionalCount++;
      const hasStandard = slide.includes('standard-only');
      const hasLucas = slide.includes('lucas-only');
      if (hasStandard && hasLucas) dualLevelCount++;
      else if (requireDualLevel) {
        errors.push(`Slide ${idx + 1}: instructional slide missing dual-level blocks (.standard-only + .lucas-only)`);
      }
    }

    if (!slide.includes('teacher-notes') && !isDarkTitle) {
      warnings.push(`Slide ${idx + 1}: no hidden .teacher-notes block`);
    }

    if (slide.includes('teacher-notes') && !slide.includes('display: none') && !slide.includes('display:none')) {
      errors.push(`Slide ${idx + 1}: .teacher-notes must use style="display: none;"`);
    }
  });

  if (requireDualLevel && instructionalCount > 0 && dualLevelCount < instructionalCount * 0.8) {
    warnings.push(`Only ${dualLevelCount}/${instructionalCount} instructional slides are dual-leveled`);
  }

  if (!html.includes('lucas-only')) {
    errors.push('Deck has no .lucas-only content — dual-level Support pathway required');
  }

  const smallFontMatches = html.match(/font-size:\s*(1[0-9]|20)px/gi);
  if (smallFontMatches && smallFontMatches.length > 3) {
    warnings.push(`Multiple small font-size declarations (${smallFontMatches.length}); primary slide text should be ≥22px`);
  }

  const imgRefs = [...html.matchAll(/<img[^>]+src="([^"]+\.png)"/gi)];
  for (const [, src] of imgRefs) {
    const imgPath = path.resolve(baseDir, src);
    if (!fs.existsSync(imgPath)) {
      errors.push(`Missing image file: ${src}`);
    }
    const excalPath = imgPath.replace(/\.png$/i, '.excalidraw');
    if (src.includes('chain') || src.includes('diagram') || src.includes('circuit')) {
      if (!fs.existsSync(excalPath)) {
        warnings.push(`No co-located .excalidraw for diagram: ${src}`);
      }
    }
  }

  const interactiveSlides = slideSections.filter((s) => /data-interaction=|sort-container|sort-deck/.test(s));
  for (const slide of interactiveSlides) {
    if (!slide.includes('show-answer') && !html.includes("addEventListener('show-answer'")) {
      warnings.push('Interactive slide may be missing show-answer listener');
      break;
    }
  }

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    slideCount: slideSections.length,
    dualLevelCount,
  };
}

function parseArgs(argv) {
  const args = { path: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--path' || argv[i] === '-p') {
      args.path = argv[i + 1];
      i++;
    } else if (!argv[i].startsWith('-')) {
      args.path = argv[i];
    }
  }
  return args;
}

export async function run(htmlPath) {
  const result = validatePresentation(htmlPath);
  console.log(`\nPresentation validation: ${result.pass ? 'PASS' : 'FAIL'}`);
  console.log(`Slides: ${result.slideCount} | Dual-leveled: ${result.dualLevelCount}`);
  if (result.errors.length) {
    console.log('\nErrors:');
    result.errors.forEach((e) => console.log(`  ✗ ${e}`));
  }
  if (result.warnings.length) {
    console.log('\nWarnings:');
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }
  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv);
  if (!args.path) {
    console.error('Usage: node validate_presentation.mjs --path TP01_Presentation.html');
    process.exit(1);
  }
  run(path.resolve(args.path)).then((r) => process.exit(r.pass ? 0 : 1));
}

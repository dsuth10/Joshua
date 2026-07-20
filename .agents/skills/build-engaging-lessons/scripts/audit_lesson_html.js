#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) {
  console.error('Usage: node audit_lesson_html.js <presentation.html> [--json]');
  process.exit(2);
}

const file = path.resolve(input);
const jsonMode = process.argv.includes('--json');
if (!fs.existsSync(file)) {
  console.error(`FAIL file does not exist: ${file}`);
  process.exit(2);
}

const html = fs.readFileSync(file, 'utf8');
const base = path.dirname(file);
const results = [];
const add = (level, check, detail) => results.push({ level, check, detail });

const slides = [...html.matchAll(/<(?:section|article)\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>/gi)];
add(slides.length >= 2 ? 'PASS' : 'FAIL', 'slides', `${slides.length} slide containers found`);

const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
add(title && !/template|untitled/i.test(title) ? 'PASS' : 'WARN', 'document title', title || 'missing');

const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
add(duplicates.length ? 'FAIL' : 'PASS', 'unique ids', duplicates.length ? duplicates.join(', ') : `${ids.length} ids checked`);

const opens = (html.match(/<section\b/gi) || []).length;
const closes = (html.match(/<\/section>/gi) || []).length;
add(opens === closes ? 'PASS' : 'FAIL', 'section balance', `${opens} open / ${closes} close`);

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\bsrc\s*=/.test(match[0].slice(0, match[0].indexOf('>') + 1)))
  .map(match => match[1]);
const scriptErrors = [];
scripts.forEach((source, index) => {
  try { new Function(source); }
  catch (error) { scriptErrors.push(`script ${index + 1}: ${error.message}`); }
});
add(scriptErrors.length ? 'FAIL' : 'PASS', 'inline script syntax', scriptErrors.length ? scriptErrors.join('; ') : `${scripts.length} scripts parsed`);

const mojibake = [...new Set((html.match(/(?:â.|ï¿½|�)/g) || []).slice(0, 8))];
add(mojibake.length ? 'FAIL' : 'PASS', 'encoding', mojibake.length ? mojibake.join(', ') : 'no common mojibake markers');

const refs = [];
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) refs.push(match[1]);
for (const match of html.matchAll(/url\((?:["']?)([^)'"\s]+)(?:["']?)\)/gi)) refs.push(match[1]);
const localRefs = [...new Set(refs.filter(ref => ref &&
  !/^(?:https?:|data:|mailto:|tel:|#|javascript:|\/\/)/i.test(ref) && !ref.includes('${')))];
const missing = localRefs.filter(ref => !fs.existsSync(path.resolve(base, ref.split(/[?#]/)[0])));
add(missing.length ? 'FAIL' : 'PASS', 'local assets', missing.length ? missing.join(', ') : `${localRefs.length} references resolved`);

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
const missingAlt = images.filter(tag => !/\balt\s*=/.test(tag)).length;
add(missingAlt ? 'WARN' : 'PASS', 'image alternatives', missingAlt ? `${missingAlt}/${images.length} images lack alt` : `${images.length} images checked`);

const frames = [...html.matchAll(/<iframe\b[^>]*>/gi)].map(match => match[0]);
const missingFrameTitle = frames.filter(tag => !/\btitle\s*=/.test(tag)).length;
add(missingFrameTitle ? 'WARN' : 'PASS', 'iframe titles', missingFrameTitle ? `${missingFrameTitle}/${frames.length} iframes lack title` : `${frames.length} iframes checked`);

add(/<meta\b[^>]*name=["']viewport["']/i.test(html) ? 'PASS' : 'WARN', 'viewport', 'responsive viewport');
add(/requestFullscreen|webkitRequestFullscreen/i.test(html) ? 'PASS' : 'WARN', 'fullscreen', 'fullscreen API');
add(/keydown|keyup/i.test(html) && /ArrowRight|PageDown/i.test(html) ? 'PASS' : 'WARN', 'keyboard navigation', 'standard slide keys');
add(/teacher.?notes|data-notes|speaker.?notes/i.test(html) ? 'PASS' : 'WARN', 'teacher notes', 'teacher-note mechanism');

const external = refs.filter(ref => /^https?:/i.test(ref));
const fallback = /fallback|unavailable|offline|no.network/i.test(html);
add(!external.length || fallback ? 'PASS' : 'WARN', 'network fallback', !external.length ? 'no external media' : fallback ? 'fallback language found' : 'external media has no obvious fallback');

const failures = results.filter(result => result.level === 'FAIL').length;
const warnings = results.filter(result => result.level === 'WARN').length;
const summary = { file, status: failures ? 'FAIL' : 'PASS', failures, warnings, checks: results.length, results };

if (jsonMode) console.log(JSON.stringify(summary, null, 2));
else {
  results.forEach(result => console.log(`${result.level.padEnd(4)} ${result.check}: ${result.detail}`));
  console.log(`\n${summary.status}: ${results.length} checks, ${failures} failures, ${warnings} warnings`);
}

process.exit(failures ? 1 : 0);

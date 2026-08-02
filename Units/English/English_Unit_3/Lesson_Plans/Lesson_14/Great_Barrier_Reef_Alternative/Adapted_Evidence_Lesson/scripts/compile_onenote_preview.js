const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const mdPath = path.join(baseDir, '..', 'Lesson_14_GBR_Adapted_OneNote_Journal.md');
const outHtmlPath = path.join(baseDir, '..', 'Lesson_14_GBR_Adapted_OneNote_Preview.html');

const md = fs.readFileSync(mdPath, 'utf8');

function escapeHtml(t) {
  if (!t) return '';
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAndStylePlaceholder(t) {
  return escapeHtml(t).replace(/\[([^\]]+)\]/g, '<span style="color:#0070c0">[$1]</span>');
}

function renderHtmlTable(headers, rows) {
  let tableHtml = '  <table style="border:1px solid #ccc;border-collapse:collapse;width:100%;margin-bottom:16px;">\n';
  tableHtml += '    <tr style="background-color:#d3ec9e;">\n';
  const widthPerCell = Math.floor(100 / headers.length);
  for (const header of headers) {
    tableHtml += `      <td style="width:${widthPerCell}%;border:1px solid #aaa;font-family:Comic Sans MS;font-size:20pt;padding:10px;font-weight:bold">${escapeHtml(header)}</td>\n`;
  }
  tableHtml += '    </tr>\n';
  for (const row of rows) {
    tableHtml += '    <tr>\n';
    for (const cell of row) {
      tableHtml += `      <td style="width:${widthPerCell}%;border:1px solid #aaa;font-family:Comic Sans MS;font-size:20pt;padding:10px">${escapeAndStylePlaceholder(cell)}</td>\n`;
    }
    tableHtml += '    </tr>\n';
  }
  tableHtml += '  </table>\n';
  return tableHtml;
}

let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lesson 14 GBR Adapted Student Pack - OneNote Preview</title>
  <style>
    body { background-color: #f0f4f8; font-family: 'Comic Sans MS', sans-serif; padding: 20px; color: #16333a; }
    .page-container { max-width: 1176px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    h1 { font-size: 26pt; color: #073642; margin-top: 0; }
    h2 { font-size: 22pt; color: #075663; margin-top: 30px; border-bottom: 2px solid #d3ec9e; padding-bottom: 5px; }
    p { font-size: 20pt; line-height: 1.4; margin: 12px 0; }
    .response-box { border: 1px solid #075663; border-collapse: collapse; width: 100%; margin: 12px 0; background: #fdfdfd; }
    .response-cell { padding: 14px; font-size: 20pt; font-family: 'Comic Sans MS'; min-height: 70px; }
    .placeholder { color: #0070c0; }
    hr { border: none; border-top: 2px dashed #087f8c; margin: 40px 0; }
  </style>
</head>
<body>
<div class="page-container">
`;

const lines = md.split('\n');
let inTable = false, tableHeaders = [], tableRows = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (inTable && !line.startsWith('|')) {
    html += renderHtmlTable(tableHeaders, tableRows);
    inTable = false; tableHeaders = []; tableRows = [];
  }
  if (!line) continue;
  if (line === '---') {
    html += '  <hr />\n';
    continue;
  }
  if (line.startsWith('# ')) {
    html += '  <h1>' + escapeHtml(line.slice(2)) + '</h1>\n';
    continue;
  }
  if (line.startsWith('## ')) {
    html += '  <h2>' + escapeHtml(line.slice(3)) + '</h2>\n';
    continue;
  }
  const imgMatch = line.match(/^!\[([^\]]*)\]\((.+?)(?:\s+"([^"]*)")?\)$/);
  if (imgMatch) {
    const alt = imgMatch[1] || 'Image';
    let src = imgMatch[2].replace(/^<|>$/g, '');
    html += `  <div style="text-align:center;margin:20px 0;"><img src="${src}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto;border-radius:4px;" /></div>\n`;
    continue;
  }
  if (line.startsWith('|')) {
    inTable = true;
    const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.every(c => /^:?-+:?$/.test(c))) continue;
    if (tableHeaders.length === 0) tableHeaders = cells;
    else tableRows.push(cells);
    continue;
  }
  if (line.startsWith('[') && line.endsWith(']')) {
    const ph = line.slice(1, -1).trim();
    html += `  <table class="response-box"><tr><td class="response-cell"><span class="placeholder">[ ${escapeHtml(ph)} ]</span></td></tr></table>\n`;
    continue;
  }
  if (line.startsWith('**') && line.includes(':**')) {
    const pts = line.split(':**');
    const lbl = pts[0].replace(/^\*\*/, '').trim();
    const rest = pts.slice(1).join(':**').trim();
    html += `  <p><span style="font-weight:bold">${escapeHtml(lbl)}:</span> ${escapeAndStylePlaceholder(rest)}</p>\n`;
    continue;
  }
  html += `  <p>${escapeAndStylePlaceholder(line)}</p>\n`;
}
if (inTable) html += renderHtmlTable(tableHeaders, tableRows);
html += '</div></body></html>';

fs.writeFileSync(outHtmlPath, html);
console.log(`HTML preview generated successfully at: ${outHtmlPath}`);

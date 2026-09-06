const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const mdPath = path.join(baseDir, '..', 'P-6CPM_HASS_Acycle_U2_Y05_AT_OneNote.md');
const outHtmlPath = path.join(baseDir, '..', 'P-6CPM_HASS_Acycle_U2_Y05_AT_OneNote_Preview.html');

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

function formatInline(text) {
  if (!text) return '';
  let s = escapeHtml(text);
  // Unescape safe tags that were intentionally in markdown e.g. <br />, &nbsp;
  s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br />');
  s = s.replace(/&amp;nbsp;/gi, '&nbsp;');

  // Bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italics
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Placeholders in brackets [ ... ] -> Royal blue
  s = s.replace(/\[([^\]]+)\]/g, '<span style="color:#0070c0;font-weight:normal;">[$1]</span>');
  return s;
}

function renderHtmlTable(headers, rows) {
  let tableHtml = '  <table style="border:1px solid #888;border-collapse:collapse;width:100%;margin:16px 0;background:#ffffff;">\n';
  if (headers && headers.length > 0) {
    tableHtml += '    <thead>\n      <tr style="background-color:#d3ec9e;">\n';
    const widthPerCell = Math.floor(100 / headers.length);
    for (const header of headers) {
      tableHtml += `        <th style="width:${widthPerCell}%;border:1px solid #888;font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:20pt;padding:12px;text-align:left;vertical-align:top;">${formatInline(header)}</th>\n`;
    }
    tableHtml += '      </tr>\n    </thead>\n';
  }
  tableHtml += '    <tbody>\n';
  const widthPerCell = headers && headers.length > 0 ? Math.floor(100 / headers.length) : Math.floor(100 / (rows[0]?.length || 1));
  for (const row of rows) {
    tableHtml += '      <tr>\n';
    for (const cell of row) {
      tableHtml += `        <td style="width:${widthPerCell}%;border:1px solid #888;font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:20pt;padding:12px;vertical-align:top;">${formatInline(cell)}</td>\n`;
    }
    tableHtml += '      </tr>\n';
  }
  tableHtml += '    </tbody>\n  </table>\n';
  return tableHtml;
}

let bodyContent = '';
const lines = md.split('\n');
let inTable = false;
let tableHeaders = [];
let tableRows = [];
let inList = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // End table
  if (inTable && !line.startsWith('|')) {
    bodyContent += renderHtmlTable(tableHeaders, tableRows);
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  }

  // End list
  if (inList && !line.startsWith('- ') && !line.startsWith('* ')) {
    bodyContent += '  </ul>\n';
    inList = false;
  }

  if (!line) continue;

  if (line === '---') {
    bodyContent += '  <hr style="border:none;border-top:3px dashed #0070c0;margin:32px 0;" />\n';
    continue;
  }

  // H1
  if (line.startsWith('# ')) {
    const h1Text = line.substring(2).trim();
    bodyContent += `  <div style="background:#eaf3fc;border-left:8px solid #0070c0;padding:16px 20px;margin:24px 0 16px 0;border-radius:4px;">\n`;
    bodyContent += `    <h1 style="font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:26pt;color:#004080;margin:0;">${formatInline(h1Text)}</h1>\n`;
    bodyContent += `  </div>\n`;
    continue;
  }

  // H2
  if (line.startsWith('## ')) {
    const h2Text = line.substring(3).trim();
    bodyContent += `  <h2 style="font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:22pt;color:#005580;border-bottom:3px solid #d3ec9e;padding-bottom:6px;margin-top:32px;margin-bottom:14px;">${formatInline(h2Text)}</h2>\n`;
    continue;
  }

  // H3
  if (line.startsWith('### ')) {
    const h3Text = line.substring(4).trim();
    bodyContent += `  <h3 style="font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:20pt;color:#1e3d59;margin-top:24px;margin-bottom:10px;">${formatInline(h3Text)}</h3>\n`;
    continue;
  }

  // Image line: ![alt](<path> "width=...")
  const imgMatch = line.match(/^!\[([^\]]*)\]\((.+?)(?:\s+"([^"]*)")?\)$/);
  if (imgMatch) {
    const alt = imgMatch[1] || 'Assessment Image';
    let src = imgMatch[2].replace(/^<|>$/g, '');
    const title = imgMatch[3] || '';
    const widthMatch = title.match(/width=(\d+)/i);
    const width = widthMatch ? widthMatch[1] : '800';

    bodyContent += `  <div style="text-align:center;margin:20px 0;padding:10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;">\n`;
    bodyContent += `    <img src="${src}" alt="${escapeHtml(alt)}" style="max-width:${width}px;width:100%;height:auto;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.1);" />\n`;
    if (alt && alt !== 'Assessment Image') {
      bodyContent += `    <p style="font-size:16pt;color:#555;margin:8px 0 0 0;font-style:italic;">${escapeHtml(alt)}</p>\n`;
    }
    bodyContent += `  </div>\n`;
    continue;
  }

  // Table
  if (line.startsWith('|')) {
    inTable = true;
    const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.every(c => /^:?-+:?$/.test(c))) {
      continue; // separator line
    }
    if (tableHeaders.length === 0) {
      tableHeaders = cells;
    } else {
      tableRows.push(cells);
    }
    continue;
  }

  // Checklist items or unordered list
  if (line.startsWith('- ') || line.startsWith('* ')) {
    if (!inList) {
      bodyContent += '  <ul style="font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:20pt;margin:12px 0 16px 28px;line-height:1.5;">\n';
      inList = true;
    }
    let itemText = line.substring(2).trim();
    let isCheckbox = false;
    let isChecked = false;
    if (itemText.startsWith('[ ] ')) {
      isCheckbox = true;
      itemText = itemText.substring(4);
    } else if (itemText.startsWith('[x] ') || itemText.startsWith('[X] ')) {
      isCheckbox = true;
      isChecked = true;
      itemText = itemText.substring(4);
    }

    if (isCheckbox) {
      bodyContent += `    <li style="list-style-type:none;margin-left:-20px;margin-bottom:8px;"><span style="display:inline-block;width:22px;height:22px;border:2px solid #0070c0;border-radius:4px;margin-right:10px;vertical-align:middle;text-align:center;line-height:20px;color:#0070c0;font-weight:bold;">${isChecked ? '✓' : ''}</span>${formatInline(itemText)}</li>\n`;
    } else {
      bodyContent += `    <li style="margin-bottom:8px;">${formatInline(itemText)}</li>\n`;
    }
    continue;
  }

  // Standalone answer box / drawing placeholder e.g. [ Type your answer here ]
  if (line.startsWith('[') && line.endsWith(']')) {
    const boxText = line.slice(1, -1).trim();
    const isBig = boxText.toLowerCase().includes('paste') || boxText.toLowerCase().includes('insert') || boxText.toLowerCase().includes('draw') || boxText.toLowerCase().includes('map') || boxText.toLowerCase().includes('full, polished');
    const minHeight = isBig ? '160px' : '70px';
    const align = isBig ? 'center' : 'left';

    bodyContent += `  <table style="border:1px solid #777;border-collapse:collapse;width:100%;margin:12px 0 20px 0;background:#fafcff;">\n`;
    bodyContent += `    <tr>\n`;
    bodyContent += `      <td style="font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:20pt;padding:16px;min-height:${minHeight};height:${minHeight};vertical-align:${isBig ? 'middle' : 'top'};text-align:${align};">\n`;
    bodyContent += `        <span style="color:#0070c0;display:inline-block;">[ ${escapeHtml(boxText)} ]</span>\n`;
    bodyContent += `      </td>\n`;
    bodyContent += `    </tr>\n`;
    bodyContent += `  </table>\n`;
    continue;
  }

  // Regular paragraph
  bodyContent += `  <p style="font-family:\'Comic Sans MS\', cursive, sans-serif;font-size:20pt;line-height:1.5;margin:12px 0;color:#222;">${formatInline(line)}</p>\n`;
}

// Close any remaining blocks
if (inTable) {
  bodyContent += renderHtmlTable(tableHeaders, tableRows);
}
if (inList) {
  bodyContent += '  </ul>\n';
}

const fullHtml = `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 5 HASS Assessment — Local and Global Connections (OneNote Page)</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      background-color: #eef2f6;
      font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
      font-size: 20pt;
      color: #1a202c;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .onenote-wrapper {
      max-width: 1176px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #d1d5db;
    }
    .page-header-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #0070c0;
      padding-bottom: 16px;
      margin-bottom: 28px;
    }
    .page-header-banner .badge {
      background: #0070c0;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 16pt;
      font-weight: bold;
    }
    .page-header-banner .unit-tag {
      color: #4b5563;
      font-size: 16pt;
      font-style: italic;
    }
    table {
      border: 1px solid #888;
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    th {
      background-color: #d3ec9e;
      border: 1px solid #888;
      font-size: 20pt;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      border: 1px solid #888;
      font-size: 20pt;
      padding: 12px;
    }
    .placeholder-text {
      color: #0070c0;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .onenote-wrapper {
        box-shadow: none;
        border: none;
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>

<div class="onenote-wrapper">
  <div class="page-header-banner">
    <div class="badge">Microsoft OneNote Digital Student Assessment</div>
    <div class="unit-tag">Year 5 HASS (A Cycle – Unit 2)</div>
  </div>

${bodyContent}
</div>

</body>
</html>
`;

fs.writeFileSync(outHtmlPath, fullHtml, 'utf8');
console.log(`Successfully generated OneNote Preview at: ${outHtmlPath}`);

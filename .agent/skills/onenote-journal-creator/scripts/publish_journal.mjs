import fs from 'fs';
import path from 'path';

// Target default settings
const TOKEN_PATH = 'c:/Users/dsuth/Documents/Joshua/OneNote_MCP_Experiment/.access-token.txt';
const DEFAULT_SECTION_NAME = 'Sandbox';
const DEFAULT_NOTEBOOK_NAME = 'AI Agent MCP Test';
const DEFAULT_IMAGE_ROOT = 'c:/Users/dsuth/Documents/Joshua';
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_MIME_TYPES = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.bmp': 'image/bmp', '.tif': 'image/tiff', '.tiff': 'image/tiff'
};

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAndStylePlaceholder(text) {
  const escaped = escapeHtml(text);
  // Match brackets e.g. [ Type your answer here ] and wrap them in a blue styled span
  return escaped.replace(/\[([^\]]+)\]/g, '<span style="color:#0070c0">[$1]</span>');
}

function assertLocalImagePath(imagePath, imageRoot) {
  const resolvedPath = path.resolve(imagePath);
  const resolvedRoot = path.resolve(imageRoot);
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Image must be inside the allowed root: ${resolvedRoot}`);
  }
  const mimeType = IMAGE_MIME_TYPES[path.extname(resolvedPath).toLowerCase()];
  if (!mimeType) throw new Error(`Unsupported image type: ${resolvedPath}`);
  const stat = fs.statSync(resolvedPath);
  if (!stat.isFile()) throw new Error(`Image path is not a file: ${resolvedPath}`);
  if (stat.size > MAX_IMAGE_BYTES) throw new Error(`Image exceeds the 4 MB Graph limit: ${resolvedPath}`);
  return { resolvedPath, mimeType };
}

function renderHtmlTable(headers, rows) {
  let tableHtml = `  <table style="border:1px solid;border-collapse:collapse">\n`;
  
  // Headers row
  tableHtml += `    <tr>\n`;
  const widthPerCell = Math.floor(1176 / headers.length);
  for (const header of headers) {
    tableHtml += `      <td style="background-color:#d3ec9e;width:${widthPerCell};border:1px solid;font-family:Comic Sans MS;font-size:20pt"><span style="font-weight:bold">${escapeHtml(header)}</span></td>\n`;
  }
  tableHtml += `    </tr>\n`;

  // Data rows
  for (const row of rows) {
    tableHtml += `    <tr>\n`;
    for (const cell of row) {
      tableHtml += `      <td style="width:${widthPerCell};border:1px solid;font-family:Comic Sans MS;font-size:20pt">${escapeAndStylePlaceholder(cell)}</td>\n`;
    }
    tableHtml += `    </tr>\n`;
  }

  tableHtml += `  </table>\n  <br />\n`;
  return tableHtml;
}

function parseMarkdownToOneNoteHtml(md, title, markdownPath) {
  const lines = md.split('\n');
  const images = [];
  let html = `<div style="font-family:Comic Sans MS;font-size:20pt">\n`;
  html += `  <p style="font-family:Comic Sans MS;font-size:20pt;margin-top:0pt;margin-bottom:0pt"><span style="font-weight:bold">${escapeHtml(title)}</span></p>\n  <br />\n`;

  let inList = false;
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // End table if line doesn't start with |
    if (inTable && !line.startsWith('|')) {
      html += renderHtmlTable(tableHeaders, tableRows);
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    // End list if line doesn't start with - or *
    if (inList && !line.startsWith('-') && !line.startsWith('*')) {
      html += `  </ul>\n  <br />\n`;
      inList = false;
    }

    if (!line) {
      continue;
    }

    // Skip top level title header (already added)
    if (line.startsWith('# ')) {
      continue;
    }

    // Standard Markdown image. The anchored div preserves exact placement in the lesson.
    const imageMatch = line.match(/^!\[([^\]]*)\]\((.+?)(?:\s+"([^"]*)")?\)$/);
    if (imageMatch) {
      const altText = imageMatch[1].trim() || 'Lesson image';
      const source = imageMatch[2].trim().replace(/^<|>$/g, '');
      const titleText = imageMatch[3] || '';
      const widthMatch = titleText.match(/(?:^|\s)width=(\d{2,4})(?:\s|$)/i);
      const width = widthMatch ? Math.min(1200, Math.max(50, Number(widthMatch[1]))) : 600;
      const anchor = `journal-image-${String(images.length + 1).padStart(3, '0')}`;
      const isUrl = /^https:\/\//i.test(source);
      const resolvedSource = isUrl ? source : path.resolve(path.dirname(markdownPath), source);
      images.push({ anchor, altText, source: resolvedSource, width, isUrl });
      html += `  <div data-id="${anchor}" style="width:1176px;text-align:center"><p style="font-family:Comic Sans MS;font-size:20pt;color:#0070c0">[ Image: ${escapeHtml(altText)} ]</p></div>\n  <br />\n`;
      continue;
    }

    // Heading 2 (e.g. ## 1. Lesson Question)
    if (line.startsWith('## ')) {
      const headingText = line.substring(3).trim();
      html += `  <p style="font-family:Comic Sans MS;font-size:20pt;margin-top:0pt;margin-bottom:0pt"><span style="font-weight:bold">${escapeHtml(headingText)}</span></p>\n`;
      continue;
    }

    // Check for success criteria list or other bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += `  <ul style="font-family:Comic Sans MS;font-size:20pt">\n`;
        inList = true;
      }
      const itemText = line.substring(2).trim();
      const cleanItem = itemText.replace(/^\[\s*\]\s*/, ''); // Remove empty checklist syntax
      html += `    <li>${escapeAndStylePlaceholder(cleanItem)}</li>\n`;
      continue;
    }

    // Check for tables
    if (line.startsWith('|')) {
      inTable = true;
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      // Skip separator rows (e.g., | :--- | :--- |)
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }
      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    }

    // Check for a single-line student response placeholder e.g. [ Type your answer here ]
    if (line.startsWith('[') && line.endsWith(']')) {
      const placeholderText = line.slice(1, -1).trim();
      const isPhoto = placeholderText.toLowerCase().includes('photo') || placeholderText.toLowerCase().includes('paste');
      
      if (isPhoto) {
        html += `  <table style="border:1px solid;border-collapse:collapse">\n`;
        html += `    <tr>\n`;
        html += `      <td style="width:1176;height:200;border:1px solid;font-family:Comic Sans MS;font-size:20pt;text-align:center;vertical-align:middle"><span style="color:#0070c0">[ ${escapeHtml(placeholderText)} ]</span></td>\n`;
        html += `    </tr>\n`;
        html += `  </table>\n  <br />\n`;
      } else {
        html += `  <table style="border:1px solid;border-collapse:collapse">\n`;
        html += `    <tr>\n`;
        html += `      <td style="width:1176;border:1px solid;font-family:Comic Sans MS;font-size:20pt"><span style="color:#0070c0">[ ${escapeHtml(placeholderText)} ]</span></td>\n`;
        html += `    </tr>\n`;
        html += `  </table>\n  <br />\n`;
      }
      continue;
    }

    // Bold label paragraphs (e.g. **Claim:** (What transforms into what?))
    if (line.startsWith('**') && line.includes(':**')) {
      const parts = line.split(':**');
      const label = parts[0].replace(/^\*\*/, '').trim();
      const rest = parts.slice(1).join(':**').trim();
      html += `  <p style="font-family:Comic Sans MS;font-size:20pt;margin-top:0pt;margin-bottom:0pt"><span style="font-weight:bold">${escapeHtml(label)}:</span> ${escapeAndStylePlaceholder(rest)}</p>\n`;
      continue;
    }

    // Regular paragraph
    html += `  <p style="font-family:Comic Sans MS;font-size:20pt;margin-top:0pt;margin-bottom:0pt">${escapeAndStylePlaceholder(line)}</p>\n`;
  }

  // Close outstanding blocks
  if (inTable) {
    html += renderHtmlTable(tableHeaders, tableRows);
  }
  if (inList) {
    html += `  </ul>\n  <br />\n`;
  }

  html += `</div>`;
  return { html, images };
}

// Simple argv parser
function getArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  let positionalCount = 0;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].substring(2);
      const val = argv[i + 1];
      if (val && !val.startsWith('--')) {
        args[key] = val;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args[`_${positionalCount}`] = argv[i];
      positionalCount++;
    }
  }
  return args;
}

async function resolveImageTargets(token, pageId, images) {
  let response;
  for (let attempt = 1; attempt <= 6; attempt++) {
    response = await fetch(`https://graph.microsoft.com/v1.0/me/onenote/pages/${pageId}/content?includeIDs=true`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok || response.status !== 404 || attempt === 6) break;
    await new Promise(resolve => setTimeout(resolve, attempt * 500));
  }
  if (!response.ok) throw new Error(`Failed to resolve OneNote image anchors: ${response.status} ${await response.text()}`);
  const html = await response.text();
  const targets = new Map();
  for (const tag of html.match(/<div\b[^>]*>/gi) || []) {
    const dataId = tag.match(/\bdata-id="([^"]+)"/i)?.[1];
    const generatedId = tag.match(/\bid="([^"]+)"/i)?.[1];
    if (dataId && generatedId) targets.set(dataId, `#${generatedId}`);
  }
  for (const image of images) {
    if (!targets.has(image.anchor)) throw new Error(`OneNote did not return a generated update ID for ${image.anchor}.`);
  }
  return targets;
}

async function placeImageAtAnchor({ token, pageId, image, imageRoot, target }) {
  const imageHtml = `<img src="${image.isUrl ? escapeHtml(image.source) : 'name:image-part'}" alt="${escapeHtml(image.altText)}" width="${image.width}" />`;
  const command = [{ target, action: 'append', content: imageHtml }];
  const url = `https://graph.microsoft.com/v1.0/me/onenote/pages/${pageId}/content`;

  if (image.isUrl) {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    });
    if (!response.ok) throw new Error(`Failed to place URL image at ${image.anchor}: ${response.status} ${await response.text()}`);
    return;
  }

  const { resolvedPath, mimeType } = assertLocalImagePath(image.source, imageRoot);
  const imageBytes = fs.readFileSync(resolvedPath);
  const boundary = `JournalImageBoundary${Date.now()}${Math.random().toString(16).slice(2)}`;
  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="Commands"\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(command)}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image-part"; filename="${escapeHtml(path.basename(resolvedPath))}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
    imageBytes,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: multipartBody
  });
  if (!response.ok) throw new Error(`Failed to place local image at ${image.anchor}: ${response.status} ${await response.text()}`);
}

async function fetchAllGraphValues(initialUrl, token) {
  const values = [];
  let url = initialUrl;
  while (url) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`Graph list request failed: ${response.status} ${await response.text()}`);
    const payload = await response.json();
    values.push(...(payload.value || []));
    url = payload['@odata.nextLink'] || null;
  }
  return values;
}

async function run() {
  const args = getArgs();
  const filePath = args._0;

  if (!filePath) {
    console.error('Error: Please provide the path to the markdown file.');
    console.error('Usage: node publish_journal.mjs <file-path> [--section <section-name-or-id>] [--notebook <notebook-name>] [--image-root <directory>]');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at path: ${filePath}`);
    process.exit(1);
  }

  // Load token
  if (!fs.existsSync(TOKEN_PATH)) {
    console.error(`Error: Token file not found at: ${TOKEN_PATH}. Please run the 'authenticate' tool on OneNote MCP first.`);
    process.exit(1);
  }
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  const token = tokenData.token;

  // Read and parse markdown file
  const markdown = fs.readFileSync(filePath, 'utf8');
  const firstLine = markdown.split('\n')[0].trim();
  const title = firstLine.startsWith('# ') ? firstLine.substring(2).trim() : path.basename(filePath, '.md');

  console.log(`Compiling lesson journal markdown...`);
  const compiled = parseMarkdownToOneNoteHtml(markdown, title, path.resolve(filePath));
  const contentHtml = compiled.html;
  const imageRoot = args['image-root'] || process.env.ONENOTE_IMAGE_ROOT || DEFAULT_IMAGE_ROOT;
  for (const image of compiled.images) {
    if (!image.isUrl) assertLocalImagePath(image.source, imageRoot);
  }

  // Resolve Notebook & Section
  const targetNotebookName = args.notebook || DEFAULT_NOTEBOOK_NAME;
  const targetSectionName = args.section || DEFAULT_SECTION_NAME;

  console.log(`Connecting to Microsoft Graph API...`);
  
  // 1. Get notebooks to find the matching ID
  const notebooksRes = await fetch('https://graph.microsoft.com/v1.0/me/onenote/notebooks', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!notebooksRes.ok) {
    throw new Error(`Failed to list notebooks: ${notebooksRes.status} ${await notebooksRes.text()}`);
  }
  const notebooks = await notebooksRes.json();
  const notebook = notebooks.value.find(n => n.displayName.toLowerCase() === targetNotebookName.toLowerCase());

  if (!notebook) {
    throw new Error(`Notebook "${targetNotebookName}" not found.`);
  }

  // 2. Get sections in that notebook
  const sectionsRes = await fetch(`https://graph.microsoft.com/v1.0/me/onenote/notebooks/${notebook.id}/sections`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!sectionsRes.ok) {
    throw new Error(`Failed to list sections: ${sectionsRes.status} ${await sectionsRes.text()}`);
  }
  const sections = await sectionsRes.json();
  let section = sections.value.find(s => s.id === targetSectionName || s.displayName.toLowerCase() === targetSectionName.toLowerCase());

  if (!section) {
    throw new Error(`Section "${targetSectionName}" not found in notebook "${targetNotebookName}".`);
  }

  console.log(`Target Notebook: "${notebook.displayName}" (ID: ${notebook.id})`);
  console.log(`Target Section: "${section.displayName}" (ID: ${section.id})`);

  // 3. Look for existing page with same title within the target section to update it
  const pages = await fetchAllGraphValues(
    `https://graph.microsoft.com/v1.0/me/onenote/sections/${section.id}/pages?$select=id,title&$top=100`,
    token
  );
  const existingPage = pages.find(p => p.title.toLowerCase() === title.toLowerCase());
  let pageId;

  if (existingPage) {
    pageId = existingPage.id;
    console.log(`Found existing page "${title}" (ID: ${existingPage.id}). Updating its content...`);
    const updateUrl = `https://graph.microsoft.com/v1.0/me/onenote/pages/${existingPage.id}/content`;
    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify([{ target: 'body', action: 'replace', content: contentHtml }])
    });

    if (!updateRes.ok) {
      throw new Error(`Failed to update page content: ${updateRes.status} ${await updateRes.text()}`);
    }
    console.log(`✅ Page "${title}" successfully updated!`);
  } else {
    console.log(`Creating new page "${title}" in section "${section.displayName}"...`);
    const createUrl = `https://graph.microsoft.com/v1.0/me/onenote/sections/${section.id}/pages`;
    
    const pageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>${escapeHtml(title)}</title>
  <meta charset="utf-8">
</head>
<body>
  ${contentHtml}
</body>
</html>`;

    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/html'
      },
      body: pageHtml
    });

    if (!createRes.ok) {
      throw new Error(`Failed to create page: ${createRes.status} ${await createRes.text()}`);
    }
    const createdPage = await createRes.json();
    pageId = createdPage.id;
    console.log(`✅ Page "${title}" successfully created!`);
  }

  const imageTargets = compiled.images.length
    ? await resolveImageTargets(token, pageId, compiled.images)
    : new Map();
  for (const image of compiled.images) {
    console.log(`Placing image "${image.altText}" at ${image.anchor}...`);
    await placeImageAtAnchor({ token, pageId, image, imageRoot, target: imageTargets.get(image.anchor) });
  }
  if (compiled.images.length) {
    console.log(`Embedded ${compiled.images.length} image(s) at their exact Markdown positions.`);
  }
}

run().catch(error => {
  console.error(`Error executing publish_journal:`, error.message);
  process.exit(1);
});

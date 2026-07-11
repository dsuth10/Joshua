---
name: onenote-journal-creator
description: Create and update illustrated student science journal pages in Microsoft OneNote using lesson design standards, embedded local or HTTPS images, precise Markdown image placement, 20pt Comic Sans MS, bordered response tables, blue student placeholders, and light-green headers. Use when requested to publish, create, update, illustrate, or remake a science lesson or journal page in OneNote.
---

# OneNote Journal Creator

This skill enables the automated creation and styling of digital student journals inside Microsoft OneNote. It follows specific educational styling standards to ensure consistency and clean structure.

## Core Design Principles

1. **Typography**: The primary font for all headings, labels, questions, and tables is **`Comic Sans MS`** at **`20pt`**.
2. **Student Answer Boxes**:
   - Every area where a student must type an answer is enclosed in a single-cell table with `1px solid` borders and `border-collapse: collapse`.
   - The cell width is set to a standard `1176px`.
3. **Student Response Styling**:
   - The answer placeholder text inside response boxes is colored in **royal blue (`#0070c0`)**.
   - Placeholders are wrapped in brackets: `[ Type your answer here ]`.
4. **Data Tables**:
   - Tables are used to organize inputs and lesson content.
   - Header cells use a light green background (**`#d3ec9e`**) with bold text.
   - Cells have `border: 1px solid` and `border-collapse: collapse`.
5. **Images**:
   - Embed images as OneNote resources; do not leave links to local files.
   - Provide meaningful alt text and a width appropriate to the lesson layout.
   - Place each image exactly where its Markdown image appears.

## Workflow for Creating/Updating Pages

When requested to create or update a OneNote lesson page from a Markdown file:

1. **Verify Authentication**: Ensure the OneNote MCP is authenticated. If the token is expired, prompt the user or run the authentication script.
2. **Add Images in Markdown**: Put a standard Markdown image on its own line at the exact required lesson position:
   ```markdown
   ![Energy transfer from battery to globe](<../media/energy-chain.png> "width=650")
   ```
   - Resolve local paths relative to the Markdown file. Use angle brackets when a path contains spaces.
   - Use PNG, JPEG, GIF, BMP, or TIFF files no larger than 4 MB.
   - Keep local images under the configured image root, normally `C:\Users\dsuth\Documents\Joshua`.
   - Use a public `https://` URL when the image is not local.
   - Set `width=50` through `width=1200`; omit it to use 600 px.
3. **Run publish_journal.mjs**: Compile the Markdown, create or update the page, resolve OneNote-generated anchor IDs, and embed images at their exact Markdown positions:
   ```bash
   node .agent/skills/onenote-journal-creator/scripts/publish_journal.mjs <path-to-markdown-file> --section <section-name-or-id> --image-root <allowed-image-directory>
   ```
4. **Handle Updates**: If a page with the same title exists anywhere in the paginated section results, replace its body instead of creating a duplicate, then re-embed every declared image.
5. **Verify**: Read the published page back and confirm each image occurs between the intended surrounding text, carries its alt text, and has a OneNote resource URL.

## Image Placement Contract

The publisher converts every Markdown image into a stable `data-id` anchor in document order. After OneNote creates or replaces the page body, it fetches `includeIDs=true`, maps each stable anchor to OneNote's generated update ID, and uses a multipart PATCH for local binary images. Do not replace this with bottom-of-page appending or manual rearrangement.

For full journal publishing, prefer the publisher script over standalone MCP `addImageFromFile` or `addImageFromUrl`; those tools support top/bottom insertion but do not provide Markdown-relative placement.

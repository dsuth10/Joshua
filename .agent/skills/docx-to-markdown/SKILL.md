---
name: docx-to-markdown
description: Converts lesson .docx files to Markdown while preserving and mapping internal resource links. Use this skill when you need to transform a folder of lesson documents into a digital-friendly Markdown format without losing connections to support materials (PDFs, other .docx sheets).
---

# Docx To Markdown

## Overview

This skill provides a systematic workflow to convert Word documents into Markdown files that maintain a human-readable and machine-readable index of linked resources. It automatically cleans up extraction noise (like table borders and pipes), repairs formatting, and rescues meaningful curriculum text from image metadata.

## Workflow

### 1. Convert Lessons
Use the `convert_lesson.py` script to transform each `.docx` file. This script automatically:
- Unpacks the Word file to find internal hyperlinks.
- Converts the body to Markdown using `pandoc`.
- Injects YAML frontmatter listing all discovered resource links.
- **Cleans and reformats** the Markdown to remove technical noise, fix de-indentation, and rescue icon descriptions.

```powershell
# Example: Convert a single lesson
python .agent/skills/docx-to-markdown/scripts/convert_lesson.py `
  "Path/To/Lesson.docx" `
  "Path/To/Lesson.md" `
  ".agent/skills/docx/ooxml/scripts/unpack.py"
```

### 2. Standardise Paths
Ensure that the `Resources/` directory is adjacent to the `Lessons/` directory, as the conversion script expects relative paths (e.g., `../Resources/Documents/file.pdf`).

### 3. Build Resource Map
Once all lessons are converted to `.md`, run the indexing script to create a central unit registry:

```powershell
# Example: Build a unit resource map
python .agent/skills/docx-to-markdown/scripts/build_resource_map.py "Path/To/Unit_Root"
```

This creates a `resource_map.json` file in the unit root, verifying the existence of every linked resource.

## Resources

### scripts/
- `extract_links.py`: Low-level tool to parse `.rels` XML.
- `convert_lesson.py`: Main conversion orchestrator using `pandoc`.
- `build_resource_map.py`: Indexing tool for unit-level resource mapping.

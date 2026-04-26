---
name: homework-print
description: Converts a completed homework pack into print-ready two-page DOCX files, one per reading level. Page 1 contains the reading text (12pt, 1.3 line spacing) and the start of the reading questions (full width, 10pt). The reading questions flow naturally onto Page 2, followed by a two-column layout for maths questions. Depends on homework-creator output files existing in the target week folder.
skills:
  - docx
---

# Homework Print Skill

Produces student-ready printable DOCX files from a completed homework pack. Each output file is exactly two pages and requires no further editing before printing.

## Output Files

For each reading level, one print file is created:

```
Joshua/Homework/Week_[N]/
├── Week_[N]_Print_L1.docx    ← Two-page printable for Level 1 students
├── Week_[N]_Print_L2.docx    ← Two-page printable for Level 2 students
└── Week_[N]_Print_L3.docx    ← Two-page printable for Level 3 students
```

## Page Structure & Formatting

The documents use a natural flow without manual page breaks to optimize space usage and allow larger, more readable fonts.

### Reading Text & Reading Questions (Full Width)
- **Reading Text:** Arial 12pt, 1.3 line spacing (line value = `Math.round(fontPt * 20 * 1.3)` DXA). Paragraph spacing is 140 DXA after.
- **Reading Questions:** Flow full-width directly below the reading text on Page 1 and continue onto Page 2.
- **Font Size (Questions):** 10pt (20 in half-points) for maximum readability.
- **Question Stem:** Bold, spacing before: 80 DXA, after: 20 DXA.

### Maths Questions (Two Columns)
- **Layout:** Placed at the end of the document after all reading questions. Uses a single-row table with two equal-width cells to split the 15 questions (8 on left, 7 on right).
- **Table Formatting:** No visible borders. Tab stops for options must be calculated based on the column width (`Math.floor(colWidth / 2)`).
- **Font Size:** 10pt.

### Options Line Format & Dividing Rules
- A and B on one line (tab stop at column or page midpoint), C and D on the next line.
- **Dividing Line:** A thin grey hairline rule must be added beneath each question to visually separate them and improve readability. This is achieved by adding a `border.bottom` property to the paragraph containing options C and D.

```javascript
// Example options paragraph with dividing line:
new Paragraph({
  tabStops: [{ type: TabStopType.LEFT, position: TAB }],
  spacing: { before: 0, after: 80, line: 200, lineRule: 'auto' },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
  children: [
    new TextRun({ text: `C. ${q.c}`, size: 20 }),
    new TextRun({ text: `\tD. ${q.d}`, size: 20 }),
  ]
})
```

## Workflow

1. Read the validated text strings for L1, L2, L3 from the homework session.
2. Read the comprehension and maths question arrays (without ANS data).
3. Write a Node.js script `create_print.js` in `Homework/Week_[N]/`.
4. Run the script to generate the three print DOCX files.
5. Verify page count. (On Windows, you can use the Word COM object via PowerShell if LibreOffice is unavailable: `$word = New-Object -ComObject Word.Application; ...`).
6. All files should naturally fit on exactly 2 pages with this layout.

## Critical Rules

- **Never show answers** on print files. Strip all `ans` fields before building paragraphs.
- **Never use unicode bullets** — use docx numbering config if lists are needed.
- **Never embed images** — maths diagram placeholders are plain text only.
- Two-column tables must use `columnWidths` on the Table AND `width` on each TableCell (DXA, WidthType.DXA).
- Set `borders` on TableCell to `BorderStyle.NONE` to hide column dividers from students.

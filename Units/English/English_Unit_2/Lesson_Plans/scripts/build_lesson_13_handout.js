const {
    Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
    Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle
} = require('docx');
const fs = require('fs');

// Shared shading for section headers
function sectionHeader(text) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        shading: { type: ShadingType.SOLID, color: "112d4e" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text, bold: true, color: "f9f7f7", size: 26, font: "Arial" })],
                                spacing: { before: 60, after: 60 }
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

function spacer(lines = 1) {
    return Array.from({ length: lines }, () => new Paragraph({ children: [new TextRun("")], spacing: { before: 60, after: 60 } }));
}

function writingLine() {
    return new Paragraph({
        children: [new TextRun({ text: "_____________________________________________________________________________", color: "aaaaaa" })],
        spacing: { before: 80, after: 200 }
    });
}

const doc = new Document({
    styles: {
        default: {
            document: { run: { font: "Arial", size: 24 } }
        },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 36, bold: true, color: "000000", font: "Arial" },
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 28, bold: true, color: "000000", font: "Arial" },
                paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                size: { width: 11906, height: 16838 } // A4
            }
        },
        children: [
            // === HEADER ===
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Year 5 English: Unit 2 — Lesson 13", bold: true, size: 28 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [new TextRun({ text: "Reading Between the Frames: Image Sequencing", bold: true, size: 34 })]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Learning Intention: ", bold: true }),
                    new TextRun("I can explain how the sequence of images in a text has an effect on meaning. (AC9E5LA07)")
                ]
            }),
            new Paragraph({
                spacing: { before: 80 },
                children: [
                    new TextRun({ text: "Name: ", bold: true }),
                    new TextRun("_________________________  "),
                    new TextRun({ text: "Date: ", bold: true }),
                    new TextRun("_________________")
                ]
            }),

            ...spacer(1),

            // === PART 1: VOCABULARY ===
            sectionHeader("Part 1 — Vocabulary: Match the Term"),
            new Paragraph({
                spacing: { before: 160, after: 80 },
                children: [new TextRun("Draw a line to match each term to its correct definition.")]
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                columnWidths: [4200, 5706],
                rows: [
                    // Header row
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { type: ShadingType.SOLID, color: "3f72af" },
                                width: { size: 4200, type: WidthType.DXA },
                                children: [new Paragraph({ children: [new TextRun({ text: "Term", bold: true, color: "ffffff", size: 24 })] })]
                            }),
                            new TableCell({
                                shading: { type: ShadingType.SOLID, color: "3f72af" },
                                width: { size: 5706, type: WidthType.DXA },
                                children: [new Paragraph({ children: [new TextRun({ text: "Definition", bold: true, color: "ffffff", size: 24 })] })]
                            })
                        ]
                    }),
                    ...["Sequence", "Chronological", "Salient", "Caption", "Foreground"].map((term, i) => {
                        const defs = [
                            "Text placed beneath or beside an image to explain it.",
                            "The most eye-catching or prominent element in an image.",
                            "A set of things arranged in a particular order.",
                            "What is closest to the viewer and most visible in an image.",
                            "Arranged in the order in which events happened over time."
                        ];
                        return new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 4200, type: WidthType.DXA },
                                    children: [new Paragraph({ children: [new TextRun({ text: term, bold: true, size: 24 })] })]
                                }),
                                new TableCell({
                                    width: { size: 5706, type: WidthType.DXA },
                                    children: [new Paragraph({ children: [new TextRun({ text: defs[i], size: 24 })] })]
                                })
                            ]
                        });
                    })
                ]
            }),

            ...spacer(1),

            // === PART 2: GRAPHIC ORGANISER ===
            sectionHeader("Part 2 — Analyse an Image Sequence"),
            new Paragraph({
                spacing: { before: 160, after: 80 },
                children: [
                    new TextRun("Open the "),
                    new TextRun({ text: "Floods Archive → Brisbane History sub-page", bold: true }),
                    new TextRun(". Scroll to the "),
                    new TextRun({ text: "Timeline / Photo Gallery", bold: true }),
                    new TextRun(" section. Choose a sequence of 3 images and complete the table below.")
                ]
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                columnWidths: [1420, 1420, 1420, 1800, 3846],
                rows: [
                    // Header
                    new TableRow({
                        children: [
                            ["Image 1", "Image 2", "Image 3", "What changes?", "Effect on meaning"].map((label, idx) => {
                                const widths = [1420, 1420, 1420, 1800, 3846];
                                return new TableCell({
                                    shading: { type: ShadingType.SOLID, color: "f96d00" },
                                    width: { size: widths[idx], type: WidthType.DXA },
                                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: "ffffff", size: 22 })] })]
                                });
                            })
                        ]
                    }),
                    // Student response row (tall)
                    new TableRow({
                        height: { value: 1400 },
                        children: [1420, 1420, 1420, 1800, 3846].map((w) =>
                            new TableCell({
                                width: { size: w, type: WidthType.DXA },
                                children: [new Paragraph({ children: [new TextRun("")] })]
                            })
                        )
                    })
                ]
            }),
            new Paragraph({
                spacing: { before: 100, after: 60 },
                children: [
                    new TextRun({ text: "What type of image sequence is this? Circle one:", bold: true }),
                    new TextRun("   Chronological  /  Before &amp; After  /  Cause &amp; Effect  /  Life Cycle")
                ]
            }),

            ...spacer(1),

            // === PART 3: WRITTEN RESPONSE ===
            sectionHeader("Part 3 — Written Response"),
            new Paragraph({
                spacing: { before: 160, after: 100 },
                children: [
                    new TextRun("Write "),
                    new TextRun({ text: "3 sentences", bold: true }),
                    new TextRun(" explaining how the image sequence you analysed builds the reader's meaning. Use the sentence starters below.")
                ]
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { type: ShadingType.SOLID, color: "f0f4fa" },
                                children: [
                                    new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Sentence Starters:", bold: true, size: 22 })] }),
                                    new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "\"The image sequence shows…\"", italic: true, size: 22 })] }),
                                    new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "\"The author chose to arrange the images this way because…\"", italic: true, size: 22 })] }),
                                    new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text: "\"By the [second/third] image, the reader understands that…\"", italic: true, size: 22 })] }),
                                ]
                            })
                        ]
                    })
                ]
            }),
            new Paragraph({ spacing: { before: 160 }, children: [new TextRun({ text: "Sentence 1:", bold: true })] }),
            writingLine(),
            writingLine(),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Sentence 2:", bold: true })] }),
            writingLine(),
            writingLine(),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Sentence 3:", bold: true })] }),
            writingLine(),
            writingLine(),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(
        "c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Lesson_Plans/Handouts/Lesson_13_Handout_Image_Sequencing.docx",
        buffer
    );
    console.log("✅ Lesson 13 Core Handout created successfully.");
});

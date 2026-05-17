const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageOrientation } = require('docx');

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Arial",
                    size: 24, // 12pt
                    color: "2D3748" // Dark slate
                }
            }
        },
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 36, bold: true, color: "1B4F72", font: "Arial" }, // 18pt navy
                paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 28, bold: true, color: "17A589", font: "Arial" }, // 14pt teal
                paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins
                size: { width: 11906, height: 16838 } // A4 Size standard in Australia
            }
        },
        children: [
            // Title & Metadata
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "Mathematics Unit 2 — Lesson 11 Assessment", bold: true })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
                children: [
                    new TextRun({ text: "Visualising Word Problems: Natural Disasters Theme", italics: true, color: "555555" })
                ]
            }),

            // Student Fields
            new Paragraph({
                spacing: { after: 120 },
                children: [
                    new TextRun({ text: "Student Name: ____________________   Date: ___________   Class: _________", bold: true, color: "1B4F72" })
                ]
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: [
                    new TextRun({ text: "Instructions: ", bold: true }),
                    new TextRun({ text: "Read each natural disaster scenario carefully. Sketch a visual model (sharing, grouping, comparing, or taking away) on your rough paper or whiteboard to identify the required mathematical operation. Circle the correct option below." })
                ]
            }),

            // Question 1
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "1. A flood evacuation shelter has 96 sleeping mats to be distributed equally among 8 rooms. How many mats will be in each room?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 10 mats" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 12 mats" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 14 mats" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 16 mats" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 2
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "2. A bushfire support team packages water bottles. They load 15 boxes onto a rescue helicopter, and each box contains 24 bottles of water. How many bottles of water did they load in total?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 340 bottles" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 350 bottles" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 360 bottles" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 380 bottles" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: C", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 3
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "3. An emergency water tank for fighting fires has a capacity of 1,500 litres. Firefighters used 875 litres to put out a small grass fire. How many litres of water are left in the tank?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 525 litres" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 625 litres" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 725 litres" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 825 litres" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 4
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "4. A search and rescue team is tracking survivors after a cyclone. Camp Alpha has 147 survivors, and Camp Beta has 86 survivors. How many survivors are there in both camps combined?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 223 survivors" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 233 survivors" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 243 survivors" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 253 survivors" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 5
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "5. A cyclone rescue squad has 6 teams. If each team has 12 rescue members, how many rescue members are there altogether?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 68 members" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 70 members" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 72 members" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 74 members" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: C", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 6
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "6. A community center receives a donation of 180 emergency torches. They want to distribute them equally among 12 local disaster preparation kits. How many torches will each kit receive?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 12 torches" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 15 torches" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 18 torches" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 20 torches" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 7
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "7. In a flood rescue operation, Boat A rescued 243 people, and Boat B rescued 189 people. How many more people did Boat A rescue than Boat B?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 44 people" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 54 people" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 64 people" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 74 people" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 8
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "8. A landslide repair crew cleared 384 tonnes of mud on Monday and 478 tonnes of mud on Tuesday. How many tonnes of mud did they clear in total over the two days?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 852 tonnes" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 862 tonnes" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 872 tonnes" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 882 tonnes" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 9
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "9. A volunteer group is preparing emergency food bags. Each food bag requires 5 cans of soup. If the group has 425 cans of soup, how many emergency food bags can they make?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 75 bags" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 80 bags" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 85 bags" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 90 bags" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: C", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] }),

            // Question 10
            new Paragraph({ spacing: { before: 200, after: 60 } }),
            new Paragraph({
                children: [
                    new TextRun({ text: "10. A temporary emergency shelter is set up in a rectangular hall. The hall measures 22 metres in length and 14 metres in width. What is the total floor area of the shelter in square metres?", bold: true })
                ]
            }),
            new Paragraph({ children: [new TextRun({ text: "A) 298 square metres" })] }),
            new Paragraph({ children: [new TextRun({ text: "B) 308 square metres" })] }),
            new Paragraph({ children: [new TextRun({ text: "C) 318 square metres" })] }),
            new Paragraph({ children: [new TextRun({ text: "D) 328 square metres" })] }),
            new Paragraph({ children: [new TextRun({ text: "ANSWER: B", bold: true, color: "17A589" })] }),
            new Paragraph({ children: [new TextRun({ text: "POINT: 1", bold: true, color: "7f8c8d" })] })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(__dirname, 'Assessment_Forms.docx'), buffer);
    console.log("Successfully created Assessment_Forms.docx!");
}).catch((err) => {
    console.error("Error creating Assessment_Forms.docx:", err);
});

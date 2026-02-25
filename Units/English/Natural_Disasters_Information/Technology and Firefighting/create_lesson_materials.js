const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');
const path = require('path');

// --- Helper Functions ---
const createHeading = (text, level) => new Paragraph({ heading: level, children: [new TextRun({ text, bold: true })] });
const createBullet = (text, ref = "bullet-list") => new Paragraph({ numbering: { reference: ref, level: 0 }, children: [new TextRun(text)] });
const createSpacer = () => new Paragraph({ children: [new TextRun("")] });

// --- Styles ---
const baseStyles = {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
        { id: "Title", name: "Title", run: { size: 48, bold: true, color: "1C1C1E" }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 400 } } },
        { id: "SectionHeader", name: "Section Header", run: { size: 28, bold: true, color: "007AFF" }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "StudentLine", name: "Student Line", run: { size: 22 }, paragraph: { borders: { bottom: { style: BorderStyle.DASHED, size: 1, color: "AAAAAA" } }, spacing: { after: 200 } } }
    ]
};

const baseNumbering = {
    config: [
        { reference: "bullet-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: "numbered-list", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
};

// ==========================================
// 1. TEACHER LESSON PLAN
// ==========================================
const lessonPlanDoc = new Document({
    styles: baseStyles,
    numbering: baseNumbering,
    sections: [{
        children: [
            new Paragraph({ style: "Title", text: "LESSON PLAN: Mapping the Tech Frontier" }),
            createHeading("Overview", HeadingLevel.HEADING_1),
            new Paragraph({ children: [new TextRun({ text: "Topic: ", bold: true }), new TextRun("Technology in Firefighting – Text Structure & Vocabulary Analysis")] }),
            new Paragraph({ children: [new TextRun({ text: "Duration: ", bold: true }), new TextRun("90 Minutes")] }),
            new Paragraph({ children: [new TextRun({ text: "Target Audience: ", bold: true }), new TextRun("Year 7-9 English / Literacy focus")] }),

            createHeading("Learning Intentions", HeadingLevel.HEADING_2),
            createBullet("Understand how different text structures (Descriptive, Sequential, Cause/Effect, etc.) organise information."),
            createBullet("Analyse technical and academic vocabulary in context."),
            createBullet("Develop inferential comprehension skills by reading beyond the literal facts."),

            createHeading("Success Criteria", HeadingLevel.HEADING_2),
            createBullet("I can identify use of at least three different text structures in the article."),
            createBullet("I can define complex words using context clues."),
            createBullet("I can explain the deeper implications of technology on human roles."),

            createHeading("Lesson Sequence", HeadingLevel.HEADING_1),

            new Paragraph({ style: "SectionHeader", text: "1. Hook & Introduction (10 mins)" }),
            createBullet("Display image of 'Dragon Drone'. Ask students to predict how it works."),
            createBullet("Introduce the concept that information isn't just 'written'; it's 'built' using structures."),

            new Paragraph({ style: "SectionHeader", text: "2. Explicit Teaching: Text Structures (15 mins)" }),
            createBullet("Define common structures: Descriptive, Sequential, Comparison, Cause/Effect, Problem/Solution, Persuasive."),
            createBullet("Model identifying the 'Introduction' as Descriptive and the 'Drone' section as Sequential."),

            new Paragraph({ style: "SectionHeader", text: "3. Guided Practice: Vocabulary (15 mins)" }),
            createBullet("List word: 'Proactive'. Discuss 'Active' vs 'Proactive'."),
            createBullet("Model identifying the root words and suffixes in 'Multispectral' and 'Autonomous'."),

            new Paragraph({ style: "SectionHeader", text: "4. Independent Tasks (40 mins)" }),
            createBullet("Students complete the Handout Sheet (Parts A-D)."),
            createBullet("Teacher circulates, focusing on students struggling with 'Inferential' questions (Part D)."),

            new Paragraph({ style: "SectionHeader", text: "5. Review & Reflection (10 mins)" }),
            createBullet("Quick-fire quiz on vocabulary."),
            createBullet("Discussion: 'Will technology ever fully replace the firefighter?' (The Persuasive element)."),

            createHeading("Answer Key (Teachers Only)", HeadingLevel.HEADING_1),
            new Paragraph({ children: [new TextRun({ text: "Part B Structures: ", bold: true }), new TextRun("Drones (Sequential), AI (Cause/Effect), Satellites (Comparison), Robots (Problem/Solution), Conclusion (Persuasive).")] }),
            new Paragraph({ children: [new TextRun({ text: "Inferential Tip (Part D, Q1): ", bold: true }), new TextRun("Students should infer that 'technological arms race' means fire threats are evolving faster, requiring constant innovation to survive.")] })
        ]
    }]
});

// ==========================================
// 2. STUDENT HANDOUT
// ==========================================
const studentHandoutDoc = new Document({
    styles: baseStyles,
    numbering: baseNumbering,
    sections: [{
        children: [
            new Paragraph({ style: "Title", text: "WORKSHEET: Fighting Fires with Technology" }),
            new Paragraph({ children: [new TextRun("Name: __________________________   Date: ____________")] }),
            createSpacer(),

            createHeading("Part A: The Vocabulary Frontier", HeadingLevel.HEADING_1),
            new Paragraph({ text: "Using context clues from the article, match the word to its likely meaning or definition." }),

            new Table({
                columnWidths: [3000, 6000],
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Word", style: "SectionHeader" })] }), new TableCell({ children: [new Paragraph({ text: "My Definition based on Context", style: "SectionHeader" })] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "1. Proactive" })] }), new TableCell({ children: [createSpacer()] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "2. Autonomous" })] }), new TableCell({ children: [createSpacer()] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "3. Multispectral" })] }), new TableCell({ children: [createSpacer()] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "4. Systematic" })] }), new TableCell({ children: [createSpacer()] })] }),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "5. Synergy" })] }), new TableCell({ children: [createSpacer()] })] }),
                ]
            }),
            createSpacer(),

            createHeading("Part B: Text Structure Detective", HeadingLevel.HEADING_1),
            new Paragraph({ text: "The author uses different 'structures' to explain ideas. Identify the structure for each section below." }),
            createBullet("Introduction: ________________________ (Hint: It describes a scene)"),
            createBullet("The Dragon Drone: ________________________ (Hint: It uses steps)"),
            createBullet("Artificial Intelligence: ________________________ (Hint: Cause & Effect)"),
            createBullet("Conclusion: ________________________ (Hint: It tries to convince you)"),
            createSpacer(),

            createHeading("Part C: Literal Retrieval (The Facts)", HeadingLevel.HEADING_1),
            new Paragraph({ text: "1. What is the predictive accuracy of the LSU DeepFire system?" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ text: "2. How small is the fire that Google's FireSats can detect from space?" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ text: "3. What are the '3 Ds' described in the robot section?" }),
            new Paragraph({ style: "StudentLine" }),
            createSpacer(),

            createHeading("Part D: Inferential Thinking (Read Between the Lines)", HeadingLevel.HEADING_1),
            new Paragraph({ text: "1. Why does the author use the phrase 'technological arms race' in the introduction? What does this imply about the danger of modern fires?" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ text: "2. Looking at the AI section, how does 'proactive response' fundamentally change the FEEL of a firefighter's job compared to traditional methods?" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ text: "3. In the conclusion, the author argues technology doesn't replace humans. Based on the Robot section, what specific human qualities (emotions/skills) are still required that a Wolf R1 doesn't have?" }),
            new Paragraph({ style: "StudentLine" }),
            new Paragraph({ style: "StudentLine" }),
            createSpacer(),

            createHeading("Part E: Extension Challenge", HeadingLevel.HEADING_1),
            new Paragraph({ text: "Design your own 'Firefighting Tool of 2030'. Draw a sketch on the back and write a 100-word DESCRIPTIVE paragraph explaining its CAUSE and EFFECT on community safety." }),
        ]
    }]
});

// --- Execution ---
const basePath = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\Unit_1_Natural_Disasters_Information\\Technology and Firefighting";

Packer.toBuffer(lessonPlanDoc).then(buffer => {
    fs.writeFileSync(path.join(basePath, "Lesson_Plan_Text_Structures.docx"), buffer);
});

Packer.toBuffer(studentHandoutDoc).then(buffer => {
    fs.writeFileSync(path.join(basePath, "Student_Handout_Text_Analysis.docx"), buffer);
});

console.log("Lesson materials created successfully!");

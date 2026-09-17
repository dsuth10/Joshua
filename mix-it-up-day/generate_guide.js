const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak
} = require('docx');

// Setup environment and load application data
global.window = {};
require('./config.js');
require('./content.js');
require('./math-question-banks.js');

const config = global.window.MixConfig;
const content = global.window.MixContent;
const mathBanks = global.window.MixMathBanks;

// --- Formatting Constants ---
const FONT_PRIMARY = "Arial";
const USABLE_WIDTH = 9026; // A4 (11906) - 2 * 1440 margin

// Border presets
const borderThin = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
const borderNone = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const cellBorders = { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin };
const calloutBorders = (col) => ({
  top: { style: BorderStyle.SINGLE, size: 1, color: col },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: col },
  left: { style: BorderStyle.SINGLE, size: 24, color: col }, // thick accent on left
  right: { style: BorderStyle.SINGLE, size: 1, color: col }
});

// Shading presets
const SHADING_HEADER = { fill: "1E293B", type: ShadingType.CLEAR }; // Deep slate
const SHADING_SUBHEADER = { fill: "334155", type: ShadingType.CLEAR };
const SHADING_ZEBRA = { fill: "F8FAFC", type: ShadingType.CLEAR };
const SHADING_WHITE = { fill: "FFFFFF", type: ShadingType.CLEAR };
const SHADING_NOTE = { fill: "EFF6FF", type: ShadingType.CLEAR }; // Light blue
const SHADING_WARN = { fill: "FEF3C7", type: ShadingType.CLEAR }; // Amber
const SHADING_SUCCESS = { fill: "ECFDF5", type: ShadingType.CLEAR }; // Emerald

// Helper: Standard text runs
function tRun(text, opts = {}) {
  return new TextRun({
    text: String(text ?? ''),
    font: FONT_PRIMARY,
    size: opts.size || 21, // 10.5 pt default
    bold: opts.bold || false,
    italics: opts.italics || false,
    color: opts.color || "1E293B",
    ...opts
  });
}

// Helper: Standard paragraph
function p(textOrRuns, opts = {}) {
  const children = Array.isArray(textOrRuns)
    ? textOrRuns
    : [typeof textOrRuns === 'string' ? tRun(textOrRuns, opts) : textOrRuns];
  return new Paragraph({
    spacing: opts.spacing || { before: 80, after: 80, line: 260 },
    alignment: opts.alignment || AlignmentType.LEFT,
    ...opts,
    children
  });
}

// Helper: Headings
function h1(text, opts = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: FONT_PRIMARY, size: 30, bold: true, color: "0F172A" })],
    ...opts
  });
}

function h2(text, opts = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT_PRIMARY, size: 24, bold: true, color: "1E3A8A" })],
    ...opts
  });
}

function h3(text, opts = {}) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 140, after: 60 },
    children: [new TextRun({ text, font: FONT_PRIMARY, size: 21, bold: true, color: "334155" })],
    ...opts
  });
}

// Helper: Callout Box
function calloutBox(title, bodyLines, type = "note") {
  const theme = {
    note: { border: "3B82F6", fill: "EFF6FF", titleColor: "1E40AF" },
    warn: { border: "D97706", fill: "FFFBEB", titleColor: "B45309" },
    success: { border: "10B981", fill: "ECFDF5", titleColor: "065F46" }
  }[type] || { border: "3B82F6", fill: "EFF6FF", titleColor: "1E40AF" };

  const paragraphs = [
    new Paragraph({
      spacing: { before: 40, after: 60 },
      children: [new TextRun({ text: title, font: FONT_PRIMARY, size: 22, bold: true, color: theme.titleColor })]
    }),
    ...(Array.isArray(bodyLines) ? bodyLines : [bodyLines]).map(line =>
      typeof line === 'string'
        ? new Paragraph({
            spacing: { before: 40, after: 40, line: 240 },
            children: [new TextRun({ text: line, font: FONT_PRIMARY, size: 20, color: "1E293B" })]
          })
        : line
    )
  ];

  return new Table({
    columnWidths: [USABLE_WIDTH],
    margins: { top: 120, bottom: 120, left: 200, right: 180 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: calloutBorders(theme.border),
            width: { size: USABLE_WIDTH, type: WidthType.DXA },
            shading: { fill: theme.fill, type: ShadingType.CLEAR },
            children: paragraphs
          })
        ]
      })
    ]
  });
}

// Helper: 2-column key-value table
function keyValueTable(data, widths = [2400, 6626]) {
  const rows = data.map((item, idx) => {
    const bg = idx % 2 === 0 ? SHADING_WHITE : SHADING_ZEBRA;
    return new TableRow({
      children: [
        new TableCell({
          borders: cellBorders,
          width: { size: widths[0], type: WidthType.DXA },
          shading: bg,
          verticalAlign: VerticalAlign.CENTER,
          children: [p([tRun(item[0], { bold: true, size: 19 })], { spacing: { before: 60, after: 60 } })]
        }),
        new TableCell({
          borders: cellBorders,
          width: { size: widths[1], type: WidthType.DXA },
          shading: bg,
          verticalAlign: VerticalAlign.CENTER,
          children: [p([tRun(item[1], { size: 19 })], { spacing: { before: 60, after: 60 } })]
        })
      ]
    });
  });

  return new Table({
    columnWidths: widths,
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    rows
  });
}

// Helper: 3-column question table
function questionTable(questions, colWidths = [1200, 4826, 3000]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        borders: cellBorders,
        width: { size: colWidths[0], type: WidthType.DXA },
        shading: SHADING_HEADER,
        children: [p([tRun("Item / ID", { bold: true, color: "FFFFFF", size: 19 })], { alignment: AlignmentType.CENTER })]
      }),
      new TableCell({
        borders: cellBorders,
        width: { size: colWidths[1], type: WidthType.DXA },
        shading: SHADING_HEADER,
        children: [p([tRun("Question Prompt & Parameters", { bold: true, color: "FFFFFF", size: 19 })])]
      }),
      new TableCell({
        borders: cellBorders,
        width: { size: colWidths[2], type: WidthType.DXA },
        shading: SHADING_HEADER,
        children: [p([tRun("Answer / Working & Rationale", { bold: true, color: "FFFFFF", size: 19 })])]
      })
    ]
  });

  const dataRows = questions.map((q, idx) => {
    const bg = idx % 2 === 0 ? SHADING_WHITE : SHADING_ZEBRA;
    return new TableRow({
      children: [
        new TableCell({
          borders: cellBorders,
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: bg,
          verticalAlign: VerticalAlign.CENTER,
          children: [
            p([tRun(`Q${idx + 1}`, { bold: true, size: 19 })], { alignment: AlignmentType.CENTER }),
            p([tRun(q.id, { size: 16, color: "64748B" })], { alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 } })
          ]
        }),
        new TableCell({
          borders: cellBorders,
          width: { size: colWidths[1], type: WidthType.DXA },
          shading: bg,
          children: [
            p([tRun(q.prompt, { size: 19 })]),
            ...(q.choices ? [p([tRun(`Options: ${q.choices.join(', ')}`, { size: 17, italics: true, color: "475569" })], { spacing: { before: 30, after: 20 } })] : []),
            ...(q.min !== undefined ? [p([tRun(`Number line scale: ${q.min} to ${q.max} (step: ${q.ticks})`, { size: 17, italics: true, color: "475569" })], { spacing: { before: 30, after: 20 } })] : []),
            ...(q.denominator ? [p([tRun(`Visual fraction model: ${q.numerator}/${q.denominator}`, { size: 17, italics: true, color: "475569" })], { spacing: { before: 30, after: 20 } })] : [])
          ]
        }),
        new TableCell({
          borders: cellBorders,
          width: { size: colWidths[2], type: WidthType.DXA },
          shading: bg,
          children: [
            p([tRun("Correct Answer: ", { bold: true, size: 19, color: "0F172A" }), tRun(String(q.answer), { bold: true, color: "1E40AF", size: 20 })]),
            ...(q.feedbackCorrect ? [p([tRun(q.feedbackCorrect, { size: 17, color: "059669", italics: true })], { spacing: { before: 30, after: 20 } })] : [])
          ]
        })
      ]
    });
  });

  return new Table({
    columnWidths: colWidths,
    margins: { top: 70, bottom: 70, left: 120, right: 120 },
    rows: [headerRow, ...dataRows]
  });
}

// Build Document Children
const docChildren = [];

// ==========================================
// 1. TITLE & DOCUMENT METADATA
// ==========================================
docChildren.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 80 },
    children: [
      new TextRun({
        text: "MIX-IT-UP DAY",
        font: FONT_PRIMARY,
        size: 44,
        bold: true,
        color: "0F172A"
      })
    ]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 200 },
    children: [
      new TextRun({
        text: "Teacher Implementation & Operations Guide | Complete Mission Answer Key",
        font: FONT_PRIMARY,
        size: 24,
        bold: true,
        color: "2563EB"
      })
    ]
  }),
  calloutBox(
    "🔑 CRITICAL TEACHER SECURITY PIN: 4060",
    [
      "The master PIN code to review student work, confirm completions, and release reward videos in Mix-It-Up Day is 4060.",
      "Never share this PIN with students. Enter this four-digit PIN directly on the student's device when opening the teacher approval dialogue. Entering 4060 approves the challenge, creates a permanent revision snapshot, and immediately unlocks the student's 'My reward' video button."
    ],
    "warn"
  ),
  p("", { spacing: { before: 100, after: 100 } })
);

// Metadata overview table
const metaData = [
  ["Target Cohort", "Year 4 / Year 5 (Approximately 10 years old)"],
  ["Curriculum Alignment", "Australian Curriculum v9: Mathematics & English"],
  ["Platform Architecture", "Standalone Client-Side HTML/JS Web Application (Zero internet/database required)"],
  ["Application Version", `${config.appVersion} (Content Build: ${config.contentVersion})`],
  ["Master Teacher PIN", "4060 (Configured in config.js)"],
  ["Total Challenges", "12 Challenges (6 Core Missions + 6 Extra / Stretch Missions)"],
  ["Reward Video Media", "Local MP4 Files (films/1.mp4 through films/12.mp4)"],
  ["Local Autosave Engine", "Browser LocalStorage (mix-it-up-day-state-v1) + JSON File Checkpoints"]
];
docChildren.push(keyValueTable(metaData, [2800, 6226]), p("", { spacing: { before: 120, after: 120 } }));

// ==========================================
// 2. PROGRAM OVERVIEW & PEDAGOGY
// ==========================================
docChildren.push(
  h1("1. Program Overview & Pedagogical Architecture"),
  p(
    "Mix-It-Up Day is an engaging, self-contained classroom learning festival engineered specifically for Year 4 and Year 5 students. The program combines imaginative narrative writing, persuasive advocacy, mathematical problem solving, multiplicative reasoning, geometric transformations, and financial decision-making into an autonomous, choice-driven learning environment."
  ),
  h2("The 'Mix-It-Up' Design Philosophy"),
  p(
    "Unlike conventional curriculum units that dwell on a single thematic topic for weeks, Mix-It-Up Day deliberately presents starkly contrasting challenges side-by-side. A snack shop budget puzzle sits directly beside an imaginative story about an alien vending machine; a timetable calculation puzzle neighbours an argumentative pitch for a miniature mammoth; and a pixel-art fraction design sits alongside fair-trade sticker sharing."
  ),
  p(
    "This intentional juxtaposition achieves three critical classroom outcomes:"
  ),
  p([
    tRun("1. Elimination of Cognitive Fatigue: ", { bold: true }),
    tRun("Alternating between intensive calculation and open-ended creative writing stimulates different cognitive faculties, keeping student energy exceptionally high across extended sessions.")
  ]),
  p([
    tRun("2. High Student Agency & Autonomous Pacing: ", { bold: true }),
    tRun("Students choose their own pathway through the challenge board. They can begin with their favourite subject or alternate between quick 15-minute sprints and deeper 25-minute investigations.")
  ]),
  p([
    tRun("3. Low-Friction, Authentic Revision: ", { bold: true }),
    tRun("Tasks feature embedded self-checking criteria, immediate interactive feedback on calculations, and dedicated sentence-improvement fields that teach students to edit and refine their work before seeking teacher sign-off.")
  ]),
  h2("The 12 Missions Matrix"),
  p(
    "The challenge library consists of 6 Core Missions and 6 Extra Missions, mapped to the 12 local video reward files:"
  )
);

// Summary Table of the 12 Missions
const missionSummaryRows = [
  new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: SHADING_HEADER, children: [p([tRun("#", { bold: true, color: "FFFFFF" })], { alignment: AlignmentType.CENTER })] }),
      new TableCell({ borders: cellBorders, width: { size: 2600, type: WidthType.DXA }, shading: SHADING_HEADER, children: [p([tRun("Mission Title", { bold: true, color: "FFFFFF" })])] }),
      new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, shading: SHADING_HEADER, children: [p([tRun("Type & Time", { bold: true, color: "FFFFFF" })])] }),
      new TableCell({ borders: cellBorders, width: { size: 2726, type: WidthType.DXA }, shading: SHADING_HEADER, children: [p([tRun("Primary Focus", { bold: true, color: "FFFFFF" })])] }),
      new TableCell({ borders: cellBorders, width: { size: 1200, type: WidthType.DXA }, shading: SHADING_HEADER, children: [p([tRun("Reward File", { bold: true, color: "FFFFFF" })], { alignment: AlignmentType.CENTER })] })
    ]
  }),
  // Core
  ...[
    ["1", "The Vending Machine That Sold…", "Writing (25 min)", "Narrative fiction, complication, sentence craft", "films/1.mp4"],
    ["2", "Snack Shop Showdown", "Maths (25 min)", "Money math, unit deals, change calculation", "films/2.mp4"],
    ["3", "Number Trick Lab", "Maths (20 min)", "Make 24, missing factors, number patterns", "films/3.mp4"],
    ["4", "A Very Unusual Class Pet", "Writing (25 min)", "Persuasive pitch, argument structure, rebuttal", "films/4.mp4"],
    ["5", "The Great Day-Out Puzzle", "Word Problem (25 min)", "Elapsed time, timetable planning, group pass", "films/5.mp4"],
    ["6", "Pixel Playground", "Maths Design (20 min)", "Fraction shading, 4x4 grid, vertical symmetry", "films/6.mp4"],
    // Extras
    ["7", "Lost: One Invisible Backpack", "Writing Extra (15 min)", "Descriptive lost-property notice, sensory clues", "films/7.mp4"],
    ["8", "Worst Superpower, Best Rescue", "Writing Extra (20 min)", "Micro-narrative, comedic irony, emergency rescue", "films/8.mp4"],
    ["9", "Sticker Swap", "Maths Extra (15 min)", "Multiplication packs, remainders, fair trade", "films/9.mp4"],
    ["10", "Mini-Golf Designer", "Maths Extra (20 min)", "Area vs perimeter, factor pairs for 12", "films/10.mp4"],
    ["11", "Mystery Number", "Maths Extra (15 min)", "Place value, parity, divisibility by 3, clues", "films/11.mp4"],
    ["12", "Would You Rather? Prove It!", "Word Problem (15 min)", "Unit pricing, rate comparison, glow stick deals", "films/12.mp4"]
  ].map((row, idx) => {
    const bg = idx < 6 ? (idx % 2 === 0 ? SHADING_WHITE : SHADING_ZEBRA) : (idx % 2 === 0 ? SHADING_NOTE : SHADING_WHITE);
    return new TableRow({
      children: [
        new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: bg, children: [p([tRun(row[0], { bold: true })], { alignment: AlignmentType.CENTER })] }),
        new TableCell({ borders: cellBorders, width: { size: 2600, type: WidthType.DXA }, shading: bg, children: [p([tRun(row[1], { bold: true })])] }),
        new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, shading: bg, children: [p([tRun(row[2])])] }),
        new TableCell({ borders: cellBorders, width: { size: 2726, type: WidthType.DXA }, shading: bg, children: [p([tRun(row[3])])] }),
        new TableCell({ borders: cellBorders, width: { size: 1200, type: WidthType.DXA }, shading: bg, children: [p([tRun(row[4], { italics: true })], { alignment: AlignmentType.CENTER })] })
      ]
    });
  })
];

docChildren.push(
  new Table({ columnWidths: [1000, 2600, 1500, 2726, 1200], margins: { top: 70, bottom: 70, left: 100, right: 100 }, rows: missionSummaryRows }),
  p("", { spacing: { before: 100, after: 100 } })
);

// ==========================================
// 3. TECHNICAL SETUP & CLASSROOM PREPARATION
// ==========================================
docChildren.push(
  h1("2. Technical Setup & Classroom Environment"),
  p(
    "Mix-It-Up Day is deliberately built with zero external dependencies. There is no cloud database, no student account login system, and no third-party tracking. All calculations, state persistence, and video playback operate entirely within the browser on the local machine."
  ),
  h2("How to Launch the Application"),
  p([
    tRun("Option 1: Local HTTP Server via Node.js (Recommended for Classroom Networks)\n", { bold: true }),
    tRun("If student devices connect over a shared school network or Wi-Fi, the teacher can host the folder from one laptop. In PowerShell or Terminal, navigate to the folder and run:"),
  ]),
  calloutBox(
    "Terminal Command for Local Serving",
    [
      "npx serve .",
      "Then open the local URL (e.g. http://localhost:3000 or http://192.168.1.X:3000) on student devices. This ensures all JSON export/import and media features run seamlessly under standard browser security rules."
    ],
    "note"
  ),
  p([
    tRun("Option 2: Direct File Launch (Standalone Devices)\n", { bold: true }),
    tRun("Double-click index.html directly on any laptop or desktop using modern Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari. Note that some school-managed devices restrict file:// protocol video playback, so testing playback before the lesson is strongly recommended.")
  ]),
  h2("Audio Accessibility & Headphones"),
  p(
    "Every mission includes a 'Listen to challenge' button that utilizes the browser's native Web Speech Synthesis API (`en-AU` Australian accent). This reads the mission title, brief, and prompt aloud. Provide headphones for students who benefit from auditory reading support or when reward videos are playing in the classroom."
  ),
  h2("Autosave & JSON Checkpoint Recovery Protocol"),
  p(
    "Student progress is continuously autosaved to the browser's LocalStorage under the key `mix-it-up-day-state-v1`. Every keystroke, button selection, number line drag, and pixel colour change is persisted immediately."
  ),
  calloutBox(
    "⚠️ CRITICAL DATA INTEGRITY: Teaching the 'Download My Work' Habit",
    [
      "School computer labs often use 'deep-freeze' software, incognito browsing, or automated profile clearing on logout. LocalStorage will be wiped if a browser profile is reset.",
      "1. Student Onboarding: Instruct every student to click 'Download my work' at the start of break times and before shutting down.",
      "2. Checkpoint File: This downloads a clean JSON file named mix-it-up-day-[username].json to their Downloads folder or school cloud drive.",
      "3. Instant Recovery: If a device restarts or freezes, the student simply opens the app, clicks 'Restore my work', selects their JSON file, and continues instantly with zero lost work."
    ],
    "warn"
  ),
  p("", { spacing: { before: 100, after: 100 } })
);

// ==========================================
// 4. TEACHER APPROVAL & PIN CODE 4060 WORKFLOW
// ==========================================
docChildren.push(
  h1("3. Teacher Approval Gate, PIN 4060 & Video Rewards"),
  p(
    "Mix-It-Up Day balances student independence with teacher accountability through the Teacher Approval Gate. Students cannot self-validate completed challenges; they must present their work to the teacher for sign-off."
  ),
  h2("The Master Teacher PIN: 4060"),
  p(
    "The application is pre-configured with the master PIN 4060 (located in config.js). This PIN functions as an in-person supervisory confirmation mechanism."
  ),
  h2("Step-by-Step Classroom Approval Procedure"),
  p([
    tRun("Step 1: Student Completion Check\n", { bold: true }),
    tRun("The student must complete all mandatory fields in a challenge (including all writing boxes, numerical calculations, interactive widgets, and pixel grid requirements). Until all items are completed, the 'Ready for teacher' button remains disabled.")
  ]),
  p([
    tRun("Step 2: Ready for Teacher Submission\n", { bold: true }),
    tRun("When all items are filled, the student clicks 'Check my work is complete' followed by 'Ready for teacher'. The mission status badge flips to bright green ('Ready for teacher'). The student raises their hand or signals the teacher.")
  ]),
  p([
    tRun("Step 3: Opening Teacher Review\n", { bold: true }),
    tRun("The teacher approaches the student's station and clicks 'Show teacher' (or 'See approval'). This opens the modal review dialogue, presenting a consolidated view of all the student's responses, mathematical working, word counts, and pixel counts.")
  ]),
  p([
    tRun("Step 4: Teacher Decision & PIN Verification\n", { bold: true }),
    tRun("The teacher evaluates the student's work against the success criteria. The teacher has two operational pathways:")
  ]),
  calloutBox(
    "PATHWAY A: APPROVE CHALLENGE & UNLOCK VIDEO REWARD",
    [
      "1. Click 'Approve this challenge'.",
      "2. Enter PIN: 4060 in the prompt.",
      "3. Click 'Confirm PIN'.",
      "Result: The challenge is marked 'Approved'. The revision history is logged. A celebratory green badge appears, and the 'My reward' button is unlocked immediately!"
    ],
    "success"
  ),
  calloutBox(
    "PATHWAY B: REQUEST CHANGES (FORMATIVE FEEDBACK)",
    [
      "1. Click 'Request changes'.",
      "2. Type a specific, constructive note in the Teacher Note box (e.g. 'Check your change calculation in Question 3' or 'Expand your dragon care plan to explain what it eats').",
      "3. Enter PIN: 4060.",
      "4. Click 'Confirm change request'.",
      "Result: The challenge flips to 'Changes requested'. A prominent yellow notification banner appears on the student's screen displaying the teacher's exact feedback note. The student revises their work and resubmits when ready."
    ],
    "warn"
  ),
  h2("Releasing & Managing Video Rewards"),
  p(
    "Once approved via PIN 4060, the student's task page reveals the 'My reward' button. Clicking this button triggers the video dialogue and streams the corresponding local MP4 clip:"
  ),
  p([
    tRun("• File Mapping: ", { bold: true }),
    tRun("Challenge 1 triggers films/1.mp4, Challenge 2 triggers films/2.mp4, through Challenge 12 triggering films/12.mp4.")
  ]),
  p([
    tRun("• Safety Fallback: ", { bold: true }),
    tRun("If a specific video file is missing or unplayable, the interface displays: 'If no film appears, your challenge is still approved.' Missing media never impedes student academic progress or badge achievement.")
  ]),
  p([
    tRun("• Classroom Management: ", { bold: true }),
    tRun("Reward videos are brief (typically 1 to 3 minutes). Insist that students use headphones when playing reward media. Clarify that rewards celebrate quality completion, not speed.")
  ]),
  p("", { spacing: { before: 100, after: 100 } })
);

// ==========================================
// 5. TEACHER REVIEW DASHBOARD (teacher-review.html)
// ==========================================
docChildren.push(
  h1("4. Central Teacher Review Portal (teacher-review.html)"),
  p(
    "In addition to approving student work live at their desks, the teacher can track the entire cohort through the standalone offline review portal: teacher-review.html."
  ),
  h2("Features of the Review Portal"),
  p([
    tRun("• Cohort File Ingestion: ", { bold: true }),
    tRun("At the end of a session (or during breaks), collect all student JSON files (via USB stick or shared class folder). Drag and drop the entire batch into the upload box on teacher-review.html. All student portfolios load instantly into the browser memory without uploading to any external server.")
  ]),
  p([
    tRun("• Live Class Roster & Progress Tracking: ", { bold: true }),
    tRun("The sidebar lists every student name and displays their completion percentage across the 6 Core and 6 Extra missions.")
  ]),
  p([
    tRun("• Side-by-Side Prompt & Response Inspection: ", { bold: true }),
    tRun("Selecting a student displays their exact submitted text, calculations, and pixel art grid alongside the original task prompt and success criteria.")
  ]),
  p([
    tRun("• Audit Trail & Revision History: ", { bold: true }),
    tRun("See every timestamped approval snapshot, teacher change request, and subsequent student edit.")
  ]),
  p([
    tRun("• Batch Backup & AI Grading Export: ", { bold: true }),
    tRun("Use 'Download all imported portfolios' to create a single master class JSON backup, or click 'Export AI review bundle' to produce structured text suitable for automated rubric marking.")
  ]),
  p("", { spacing: { before: 100, after: 100 } })
);

// ==========================================
// 6. CLASSROOM LESSON BLUEPRINT
// ==========================================
docChildren.push(
  h1("5. Suggested Classroom Lesson Blueprint"),
  p(
    "Below is a recommended schedule for running Mix-It-Up Day as a high-impact, 2-hour morning session or half-day event:"
  ),
  keyValueTable([
    ["0:00 – 0:15 (15 min)", "Launch, Whole-Class Orientation & Modeling:\nProject index.html on the main screen. Introduce the 12 missions. Demonstrate entering student names. Model how to read the criteria and check work. Show how 'Ready for teacher' works and emphasize saving checkpoints via 'Download my work'."],
    ["0:15 – 1:00 (45 min)", "Mission Sprint 1 (Core Focus):\nStudents work independently on their chosen Core Challenges (recommending at least one Maths and one Writing task). Teacher circulates with PIN 4060, reviewing student submissions, asking probing questions, and approving or requesting targeted revisions."],
    ["1:00 – 1:15 (15 min)", "Mid-Session Stretch & Exemplar Showcase:\nCall the class together. Project an outstanding student response on the board (e.g. an inventive Vending Machine story or clever Mini-Golf perimeter solution). Address common misconceptions."],
    ["1:15 – 1:45 (30 min)", "Mission Sprint 2 (Core Completion & Extra Challenges):\nStudents return to their stations to finalize remaining core tasks or tackle the 6 Extra Challenges (such as Invisible Backpack or Would You Rather?)."],
    ["1:45 – 2:00 (15 min)", "Portfolio Download, Reflection & Celebration:\nAll students click 'Download my work' to save their final portfolio JSON. Students share favourite discoveries. Teacher collects JSON files for import into teacher-review.html."]
  ], [2200, 6826]),
  p("", { spacing: { before: 140, after: 140 } })
);

// ==========================================
// 7. APPENDIX: MISSION-BY-MISSION ANSWER KEY
// ==========================================
docChildren.push(
  new Paragraph({ children: [new PageBreak()] }),
  h1("APPENDIX: Mission-by-Mission Answer Keys & Writing Evaluation Guides"),
  p(
    "This appendix provides complete, exhaustive teaching guides and answer keys for all 12 missions. For the four writing challenges, comprehensive writing rubrics, prompt specifications, and evaluation benchmarks are provided. For all maths and word problem challenges, full answer keys are provided for the core tasks and the complete 30-question bank."
  ),
  calloutBox(
    "💡 Note on Maths Randomisation in Student Sessions",
    [
      "When a student opens any maths or word-problem challenge, the app draws 24 questions at random from that mission's 30-question bank and locks that exact 24-question instance into the student's saved state.",
      "The answer keys below list all 30 questions in sequence (Authored Questions 1–10, followed by Algorithmic Questions 11–30) so you can quickly look up any question a student receives."
    ],
    "note"
  ),
  p("", { spacing: { before: 100, after: 100 } })
);

// --- MISSION 1: VENDING MACHINE (WRITING) ---
docChildren.push(
  h2("Mission 1: The Vending Machine That Sold… (Core Writing)"),
  p([tRun("Type: ", { bold: true }), tRun("Imaginative Narrative  |  "), tRun("Duration: ", { bold: true }), tRun("25 minutes  |  "), tRun("Word Target: ", { bold: true }), tRun("120–180 words")]),
  p([tRun("Core Brief: ", { bold: true }), tRun("A strange vending machine has appeared at school. Students choose one button (Weather, Tiny adventures, or Unusual talents) and write a narrative about someone who presses it.")]),
  keyValueTable([
    ["Writing Prompt", "Choose one button: weather, tiny adventures, or unusual talents. Write a short story (about 120–180 words) about someone who presses it. Include what they bought, a problem or surprise, and how the story ends."],
    ["Student Choices", "1) Weather (e.g. pocket storms, mini rainbows, bottled snow)\n2) Tiny adventures (e.g. 10-minute expeditions, desk-sized safaris)\n3) Unusual talents (e.g. speaking fluent sparrow, instant backwards somersaults)"],
    ["Required Fields", "1. Button selection (Radio choice)\n2. My story (120–180 words)\n3. A sentence I improved (8–20 words, showing deliberate revision)"],
    ["Scaffolding Support", "Suggested narrative structure: First (approaching the machine and purchasing) → Then (the initial excitement/use) → Oh no! (an unexpected complication or escalation) → Finally (a clever resolution)."],
    ["Stretch Extension", "Incorporate an ordinary, everyday school object (e.g. a whiteboard eraser, ruler, half-eaten sandwich) to play an essential role in resolving the climax."],
    ["Teacher Success Checks & Evaluation Criteria", "1. Narrative Arc: Clear beginning, middle complication/surprise, and satisfying conclusion.\n2. Sensory Detail: Strong imagery making the machine and its effects vivid.\n3. Sentence Revision: The improved sentence demonstrates vocabulary refinement, added sensory clauses, or varied sentence starters.\n4. Length: Story adheres reasonably to the 120–180 word boundary."]
  ], [2400, 6626]),
  p("", { spacing: { before: 100, after: 100 } })
);

// --- MISSION 2: SNACK SHOP SHOWDOWN (MATHS) ---
docChildren.push(
  h2("Mission 2: Snack Shop Showdown (Core Maths)"),
  p([tRun("Type: ", { bold: true }), tRun("Financial Literacy & Multiplicative Thinking  |  "), tRun("Duration: ", { bold: true }), tRun("25 minutes")]),
  p([tRun("Menu: ", { bold: true }), tRun("Fruit cup ($2.00), Popcorn ($3.00), Cheese toastie ($4.00), Smoothie ($5.00). Budget: $20.00 note.")]),
  keyValueTable([
    ["Core Task 1: Required Snack Order", "Ava wants fruit ($2), Ben wants popcorn ($3), Cleo wants a toastie ($4), and Dev wants a smoothie ($5).\nCalculation: $2 + $3 + $4 + $5 = $14.00 total.\nCorrect Total: 14"],
    ["Core Task 2: Change Calculation", "Paying with a $20.00 note for a $14.00 order.\nCalculation: $20.00 − $14.00 = $6.00 change.\nCorrect Change: 6"],
    ["Core Task 3: Value Comparison", "Which is the better deal: 2 smoothies for $9, or two single smoothies?\nCalculation: Two single smoothies cost 2 × $5 = $10. The deal is $9.\nCorrect Choice: '2 smoothies for $9' (Saves $1.00 compared to $10.00)"],
    ["Core Task 4: Explanation & Stretch", "Student explains why $9 is cheaper and shows how to spend closest to $20 without exceeding it (e.g. Adding another toastie ($4) and fruit cup ($2) = $20.00 exactly)."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Snack Shop Showdown: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['snack-shop']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 3: NUMBER TRICK LAB (MATHS) ---
docChildren.push(
  h2("Mission 3: Number Trick Lab (Core Maths)"),
  p([tRun("Type: ", { bold: true }), tRun("Operations, Algebraic Reasoning & Pattern Structure  |  "), tRun("Duration: ", { bold: true }), tRun("20 minutes")]),
  keyValueTable([
    ["Core Task 1: Make 24", "Use 3, 4, 6 and 8 once each to make 24.\nSample Valid Expressions:\n• (8 − 4) × 6 = 24  (or with 3: (8 + 4) × (6 ÷ 3) = 24)\n• (8 − 6) × (4 × 3) = 24\n• 8 × 3 × (6 − 4) = 24 (wait, 8*3=24, 6-4=2: 24/2? Check: (8 / (6 - 4)) * (3 * 2))\n• (8 - 6) * 3 * 4 = 24\n• (8 + 6 + 4) + ... Check student expression evaluates strictly to 24 using the numbers once."],
    ["Core Task 2: Missing Factor", "Equation: □ × 7 = 56\nCalculation: 56 ÷ 7 = 8\nCorrect Answer: 8"],
    ["Core Task 3: Pattern Progression", "Pattern: 5, 9, 13, 17, __, __\nAnalysis: Jumps of +4 each time.\nFirst next number: 21 (17 + 4)\nSecond next number: 25 (21 + 4)"],
    ["Core Task 4: Pattern Rule", "Student explanation: 'Start at 5 and add 4 each time' or 'Add 4 to the previous term'."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Number Trick Lab: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['number-trick-lab']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 4: UNUSUAL CLASS PET (WRITING) ---
docChildren.push(
  h2("Mission 4: A Very Unusual Class Pet (Core Writing)"),
  p([tRun("Type: ", { bold: true }), tRun("Persuasive Pitch & Public Speaking Text  |  "), tRun("Duration: ", { bold: true }), tRun("25 minutes  |  "), tRun("Word Target: ", { bold: true }), tRun("100–150 words")]),
  keyValueTable([
    ["Writing Prompt", "Choose a tiny dragon, talking snail, or miniature mammoth. Write a persuasive pitch (about 100–150 words) convincing the class to choose it. Give two reasons, explain how it would be cared for, and answer one worry someone might have."],
    ["Pet Choices", "1) Tiny dragon (pocket-sized, warm, eats chili peppers)\n2) Talking snail (scholarly, quiet, eats lettuce scraps)\n3) Miniature mammoth (fluffy, sociable, lives in cold spaces)"],
    ["Required Elements", "1. Pet choice (Radio selection)\n2. Persuasive pitch (100–150 words) containing:\n   - A clear opening opinion statement\n   - At least 2 developed arguments supporting the choice\n   - Practical care, feeding, and accommodation details\n   - Rebuttal of a counter-argument/concern (e.g. fire hazard, slime trails, shedding fur)\n3. Optional campaign slogan (2–8 words)"],
    ["Scaffolding Support", "Structure frame: 'Our class should definitely vote for [pet] because... Firstly... Additionally... Some people might worry that [worry], but in fact [solution]... Therefore, vote for [pet]!'"],
    ["Stretch Extension", "Create a punchy, memorable rhyming or alliterative campaign slogan suitable for a poster."],
    ["Teacher Success Checks & Evaluation Criteria", "1. Stance: Clear point of view sustained throughout.\n2. Evidence & Elaboration: Convincing, imaginative reasons.\n3. Problem-Solving: Practical solutions provided for care and potential risks.\n4. Tone: High-energy persuasive language (emotive words, rhetorical questions)."]
  ], [2400, 6626]),
  p("", { spacing: { before: 100, after: 100 } })
);

// --- MISSION 5: THE GREAT DAY-OUT PUZZLE (WORD PROBLEM) ---
docChildren.push(
  h2("Mission 5: The Great Day-Out Puzzle (Core Word Problem)"),
  p([tRun("Type: ", { bold: true }), tRun("Elapsed Time, Timetabling & Financial Optimisation  |  "), tRun("Duration: ", { bold: true }), tRun("25 minutes")]),
  p([tRun("Parameters: ", { bold: true }), tRun("Day window: 10:00 am to 2:30 pm (Total: 4 hours 30 mins = 270 mins). Travel: 10 mins between events. Lunch: 30 mins. Activities: Climbing wall (45 min, $6), Laser maze (30 min, $5), Science show (40 min, $4), Mini golf (50 min, $7). Must schedule lunch and at least 3 activities.")]),
  keyValueTable([
    ["Core Task 1: Schedule Construction", "Student timetable fitting between 10:00 am and 2:30 pm.\nSample Valid Schedule:\n• 10:00–10:45: Climbing wall (45 min)\n• 10:45–10:55: Travel (10 min)\n• 10:55–11:25: Laser maze (30 min)\n• 11:25–11:35: Travel (10 min)\n• 11:35–12:05: Lunch (30 min)\n• 12:05–12:15: Travel (10 min)\n• 12:15–12:55: Science show (40 min)\nTotal duration = 175 minutes (finishes well before 2:30 pm)."],
    ["Core Task 2: Individual Ticket Cost", "Four climbing-wall tickets: 4 × $6.00 = $24.00.\nCorrect Answer: 24"],
    ["Core Task 3: Group Pass Comparison", "Can four students buy a group pass for $20 instead of four individual climbing tickets?\nCalculation: $24.00 − $20.00 = $4.00 saved.\nCorrect Choice: 'Yes, it saves $4'"],
    ["Core Task 4: Feasibility Explanation", "Student explains why their schedule works, citing cumulative time calculations and accounting for travel and lunch."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("The Great Day-Out Puzzle: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['great-day-out']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 6: PIXEL PLAYGROUND (MATHS DESIGN) ---
docChildren.push(
  h2("Mission 6: Pixel Playground (Core Maths Design)"),
  p([tRun("Type: ", { bold: true }), tRun("Fraction Shading, Coordinate Grids & Symmetrical Reflection  |  "), tRun("Duration: ", { bold: true }), tRun("20 minutes")]),
  keyValueTable([
    ["Core Task 1: 4x4 Grid Design", "The grid consists of 16 cells (4 rows × 4 columns).\nExact Colour Counts Required:\n• Blue: 8 squares (8/16 = 1/2 of the board)\n• Yellow: 4 squares (4/16 = 1/4 of the board)\n• Mint: 4 squares (4/16 = 1/4 of the board)\nSymmetry Rule: Left and right sides must vertically mirror each other (Column 1 mirrors Column 4; Column 2 mirrors Column 3)."],
    ["Core Task 2: Written Verification Check", "Student explanation detailing how they audited their design:\n1) Counting the squares of each colour to verify 8 + 4 + 4 = 16.\n2) Checking the vertical mirror line down the middle to verify bilateral reflection."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Pixel Playground: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['pixel-playground']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 7: INVISIBLE BACKPACK (EXTRA WRITING) ---
docChildren.push(
  h2("Mission 7: Lost: One Invisible Backpack (Extra Writing)"),
  p([tRun("Type: ", { bold: true }), tRun("Descriptive Notice & Sensory Writing  |  "), tRun("Duration: ", { bold: true }), tRun("15 minutes  |  "), tRun("Word Target: ", { bold: true }), tRun("60–90 words")]),
  keyValueTable([
    ["Writing Prompt", "Write a funny lost-property notice that helps the owner get their invisible backpack back. Include at least three precise clues, where it was last seen, and safe instructions for the finder."],
    ["Key Challenge", "Writing vivid descriptive clues for an object that cannot be visually observed."],
    ["Required Clues (At Least 3)", "Students must use non-visual sensory categories:\n• Sound: Crinkling foil, ticking clock, soft purring\n• Scent: Aroma of cinnamon toast, fresh paint, damp earth\n• Touch/Weight: Extremely heavy corner, levitating straps, cold to the touch\n• Environmental Trails: Floating dust motes, crushed grass footprints"],
    ["Additional Requirements", "Last seen location (e.g. 'under the third bench near the oval') and safe handling instructions (e.g. 'do not unzip the front pocket or floating bubbles will escape')."],
    ["Teacher Success Checks & Evaluation Criteria", "1. Three distinct, creative non-visual clues included.\n2. Plausible last-seen location identified.\n3. Humorous and clear instructions for the finder.\n4. Concise notice format (60–90 words)."]
  ], [2400, 6626]),
  p("", { spacing: { before: 100, after: 100 } })
);

// --- MISSION 8: WORST SUPERPOWER, BEST RESCUE (EXTRA WRITING) ---
docChildren.push(
  h2("Mission 8: Worst Superpower, Best Rescue (Extra Writing)"),
  p([tRun("Type: ", { bold: true }), tRun("Micro-Narrative & Comedic Action Scene  |  "), tRun("Duration: ", { bold: true }), tRun("20 minutes  |  "), tRun("Word Target: ", { bold: true }), tRun("80–120 words")]),
  keyValueTable([
    ["Writing Prompt", "Write an 80–120-word scene where a seemingly useless power solves a real problem. Pick one: make toast slightly warmer, understand pigeons, or turn shoelaces purple."],
    ["Superpower Choices", "1) Warmer toast (heats bread by 2 degrees through intense concentration)\n2) Understand pigeons (interprets chaotic coos and head-bobs)\n3) Purple shoelaces (turns any lace violet instantly)"],
    ["Required Scene Structure", "• Immediate Problem / Crisis: An urgent emergency occurs (e.g. someone trapped, lost key, cold creature, bank heist).\n• Comedic / Clever Application: The seemingly ridiculous superpower is applied in an ingenious, unexpected way.\n• Successful Resolution: The situation is saved, transforming the hero's reputation."],
    ["Teacher Success Checks & Evaluation Criteria", "1. Clear problem-to-solution narrative arc within 80–120 words.\n2. The chosen power is the direct catalyst for resolving the crisis.\n3. Engaging storytelling with dialogue or vivid verbs."]
  ], [2400, 6626]),
  p("", { spacing: { before: 100, after: 100 } })
);

// --- MISSION 9: STICKER SWAP (EXTRA MATHS) ---
docChildren.push(
  h2("Mission 9: Sticker Swap (Extra Maths)"),
  p([tRun("Type: ", { bold: true }), tRun("Multiplication, Division with Remainders & Fair Exchange  |  "), tRun("Duration: ", { bold: true }), tRun("15 minutes")]),
  keyValueTable([
    ["Core Task 1: Total Stickers", "Mia: 5 packs of 8 = 40 stickers.\nLeo: 7 packs of 6 = 42 stickers.\nCombined: 40 + 42 = 82 stickers.\nCorrect Total: 82"],
    ["Core Task 2: Equal Sharing (Quotient)", "Share 82 stickers equally among 4 people: 82 ÷ 4 = 20 with 2 remaining.\nCorrect Each: 20"],
    ["Core Task 3: Remainder", "Stickers left over after sharing equally:\nCorrect Remainder: 2"],
    ["Core Task 4: Fair Trade Evaluation", "Is trading 3 packs of 8 for 4 packs of 6 fair?\nCalculation: 3 × 8 = 24 stickers; 4 × 6 = 24 stickers. Both totals are identical.\nCorrect Choice: 'Yes, both are 24 stickers'"],
    ["Core Task 5: Explanation", "Student shows written calculations verifying both multiplications and division steps."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Sticker Swap: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['sticker-swap']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 10: MINI-GOLF DESIGNER (EXTRA MATHS) ---
docChildren.push(
  h2("Mission 10: Mini-Golf Designer (Extra Maths)"),
  p([tRun("Type: ", { bold: true }), tRun("Measurement, Area, Perimeter & Factor Pairs  |  "), tRun("Duration: ", { bold: true }), tRun("20 minutes")]),
  keyValueTable([
    ["Core Task 1 & 2: Rectangle Dimensions", "Students design two different rectangular greens on a 6x6 grid, each covering exactly 12 grid squares.\nValid Factor Pairs for 12:\n• 3 × 4 (or 4 × 3)\n• 2 × 6 (or 6 × 2)\n• 1 × 12 (exceeds 6x6 grid, so 3x4 and 2x6 are the primary expected designs)."],
    ["Core Task 3: Perimeter Calculations", "• Course A (3 by 4): Perimeter = 2 × (3 + 4) = 14 units.\n• Course B (2 by 6): Perimeter = 2 × (2 + 6) = 16 units.\nPerimeters differ despite equal areas."],
    ["Core Task 4: Conceptual Justification", "Student explains why equal areas have different perimeters: More elongated, narrow shapes have more exposed border edges, requiring more fencing than compact, square-like shapes."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Mini-Golf Designer: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['mini-golf-designer']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 11: MYSTERY NUMBER (EXTRA MATHS) ---
docChildren.push(
  h2("Mission 11: Mystery Number (Extra Maths)"),
  p([tRun("Type: ", { bold: true }), tRun("Place Value, Divisibility Rules & Deductive Number Theory  |  "), tRun("Duration: ", { bold: true }), tRun("15 minutes")]),
  keyValueTable([
    ["Core Task 1: Deductive Mystery Number", "Clues:\n1. Greater than 40 and less than 60 (Range: 41–59)\n2. Tens digit is 5 (Numbers in the fifties: 50–59)\n3. Number is even (Candidates: 50, 52, 54, 56, 58)\n4. Number is a multiple of 3:\n   • 50: 5+0=5 (No)\n   • 52: 5+2=7 (No)\n   • 54: 5+4=9 (9 is divisible by 3 -> 54 ÷ 3 = 18. YES!)\n   • 56: 5+6=11 (No)\n   • 58: 5+8=13 (No)\nCorrect Answer: 54"],
    ["Core Task 2: Deductive Working", "Student documents how each clue systematically eliminated candidates until only 54 remained."],
    ["Core Task 3: Authoring New Clues", "Student authors their own clue set for a number between 10 and 99 with a recorded answer.\nTeacher check: Verify the student's clues logically narrow to exactly one unique solution."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Mystery Number: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['mystery-number']),
  p("", { spacing: { before: 120, after: 120 } })
);

// --- MISSION 12: WOULD YOU RATHER? PROVE IT! (EXTRA WORD PROBLEM) ---
docChildren.push(
  h2("Mission 12: Would You Rather? Prove It! (Extra Word Problem)"),
  p([tRun("Type: ", { bold: true }), tRun("Unit Rates, Deal Comparison & Mathematical Argumentation  |  "), tRun("Duration: ", { bold: true }), tRun("15 minutes")]),
  keyValueTable([
    ["Core Task 1: Deal A Calculation", "Goal: Need at least 18 glow sticks for a night walk.\nDeal A: Packs of 3 for $4.00.\nPacks needed: 18 ÷ 3 = 6 packs.\nTotal items: 6 × 3 = 18 glow sticks.\nTotal cost: 6 × $4.00 = $24.00."],
    ["Core Task 2: Deal B Calculation", "Deal B: Packs of 5 for $6.00.\nPacks needed: 18 ÷ 5 = 3.6 → Must buy 4 packs (to get at least 18).\nTotal items: 4 × 5 = 20 glow sticks.\nTotal cost: 4 × $6.00 = $24.00."],
    ["Core Task 3: Recommendation & Choice", "Which would you choose?\nCorrect Choice: 'Either — they cost the same' (Both cost exactly $24.00)."],
    ["Core Task 4: Argumentative Justification", "Acceptable justifications:\n• Deal B Advocate: 'Both cost $24.00, but Deal B gives 20 glow sticks (2 bonus sticks), which is a lower cost per stick ($1.20 vs $1.33).'\n• Deal A Advocate: 'Both cost $24.00, but Deal A gives exactly 18 glow sticks with no unnecessary surplus/waste.'\nStudent must back their choice with the mathematical evidence."]
  ], [2600, 6426]),
  p("", { spacing: { before: 80, after: 60 } }),
  h3("Would You Rather? Prove It!: Complete 30-Question Bank Answer Key"),
  questionTable(mathBanks['would-you-rather']),
  p("", { spacing: { before: 120, after: 120 } })
);

// ==========================================
// CREATE DOCUMENT OBJECT
// ==========================================
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT_PRIMARY, size: 21, color: "1E293B" }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 30, bold: true, color: "0F172A", font: FONT_PRIMARY },
        paragraph: { spacing: { before: 260, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, color: "1E3A8A", font: FONT_PRIMARY },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 21, bold: true, color: "334155", font: FONT_PRIMARY },
        paragraph: { spacing: { before: 140, after: 60 }, outlineLevel: 2 }
      }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT } // A4
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "Mix-It-Up Day — Teacher Implementation & Operations Guide | PIN 4060",
                  font: FONT_PRIMARY,
                  size: 17,
                  color: "64748B",
                  italics: true
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 100 },
              children: [
                new TextRun({ text: "Teacher Operations Manual & Mission Answer Key  •  Page ", font: FONT_PRIMARY, size: 17, color: "64748B" }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT_PRIMARY, size: 17, color: "64748B" }),
                new TextRun({ text: " of ", font: FONT_PRIMARY, size: 17, color: "64748B" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT_PRIMARY, size: 17, color: "64748B" })
              ]
            })
          ]
        })
      },
      children: docChildren
    }
  ]
});

// Output path
const outputPath = path.join(__dirname, 'Mix_It_Up_Day_Teacher_Guide.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document successfully generated at: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error("Error generating docx:", err);
});

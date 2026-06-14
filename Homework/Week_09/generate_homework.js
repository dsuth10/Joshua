const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, TabStopType, 
  PageNumber, Header, Footer
} = require('docx');

// Page Sizing Constants
// A4 dimensions: 11906 x 16838 DXA.
const PRINT_PAGE_WIDTH = 11906;
const PRINT_PAGE_HEIGHT = 16838;

// Standard margins for standard documents (1 inch / 1440 DXA)
const STANDARD_MARGINS = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const STANDARD_MARGIN_PROPS = {
  margin: STANDARD_MARGINS,
  size: { width: 11906, height: 16838 } // Explicitly A4
};

// Styling configurations
const STYLES = {
  default: {
    document: {
      run: {
        font: "Arial",
        size: 24 // 12pt default
      }
    }
  }
};

// Reading texts
const TEXT_RED = {
  title: "The Tech Architect: Managing a Software Launch",
  paragraphs: [
    "Sarah stood in front of the digital Kanban board. On the screen, hundreds of virtual cards showed tasks in progress, pending review, or completed. Sarah was a senior project manager at EduQuest. This company made educational software. Her job was to coordinate the work of developers, designers, and testers. She had to ensure that everyone worked together smoothly to achieve their shared goals. The team was currently in the final week of their work cycle. They wanted to launch a new mathematics application designed for primary schools. The release date was only two weeks away. Sarah needed to make sure they met all milestones on time without hurting the quality of the app.",
    "During the morning stand-up meeting, a major problem arose that threatened the launch date. The developers were led by David, their chief engineer. They insisted that polishing the multiplayer code needed another full week of work. They argued that players would experience lag if the code was not refined. On the other hand, the graphic designers complained that their new screens had not yet been added to the game. They felt their creative work was being ignored. The argument in the meeting room grew tense as both groups defended their tasks, which could delay the release.",
    "Sarah listened carefully, acknowledging the concerns of both sides while keeping the project limits in mind. To resolve the conflict, she called a quick team meeting to find a compromise. She reorganized the remaining tasks in the project backlog, placing the basic design updates first for the launch. She then scheduled the complex multiplayer features for a free update after the launch. This decision took the pressure off the developers while ensuring the app remained beautiful and stable.",
    "Throughout the rest of the week, Sarah tracked the team's progress using a burn-down chart. She removed daily roadblocks, organised tasks, and made sure the testers had good builds to check. By keeping communication open and encouraging teamwork, she kept morale high under tight deadlines. Ultimately, Sarah's quick actions guided the project to a successful launch. She showed how project managers serve as the main link between creative ideas and technical work. Their role helps businesses deliver projects that make a difference in everyday life."
  ]
};

const TEXT_BLUE = {
  title: "Leading the Launch",
  paragraphs: [
    "Sarah is a software project manager at EduQuest, a company that makes fun computer programs for schools. Her job is to help her team work together to build a new maths game. The team includes software programmers, artists who draw the game characters, and testers who find bugs in the code. Project managers do not write the code or draw the pictures themselves. Instead, they organise the schedule and make sure everyone has what they need to do their best work.",
    "Every morning, Sarah runs a quick stand-up meeting. In this meeting, each team member answers three questions. They explain what they did yesterday, what they will do today, and if they have any problems. This daily check helps everyone stay on the same page. It also helps Sarah find and fix roadblocks before they delay the project.",
    "With only one week left before the launch, the testers found a major problem. The game crashed when two players tried to play together. The programmer, David, was stressed because he did not know if he could fix it in time. The artists were also worried because they wanted to add more colours to the game screens.",
    "Sarah stayed calm. She listened to everyone and made a plan. She asked the programmers to focus only on fixing the crash. She told the artists that their new designs could be added later as an update. By dividing the tasks, the team fixed the bug quickly. Thanks to Sarah's organisation and planning, the new game was launched on time. She proved that a project manager is very important for keeping a team happy and successful. Project managers help teams achieve their goals by solving conflicts and keeping everyone focused."
  ]
};

const TEXT_GREEN = {
  title: "Sarah's Big Plan",
  paragraphs: [
    "Sarah has an exciting job. She is a project manager at a computer game company. Sarah does not make the games herself. She does not write code or draw the pictures. Instead, she helps her team work together to build new games.",
    "Her team has three kinds of workers who do different tasks. First, there are programmers who write the computer code. Next, there are artists who draw all the fun game characters. Finally, there are testers who play the games to search for bugs.",
    "Sarah helps them by making a plan and writing tasks on a big board. This board shows exactly what each person needs to do every day.",
    "One day, the team found a serious bug that made the game stop working. The programmers were worried, and the artists wanted to add more drawings. Sarah helped them make a smart choice by telling the programmers to fix the bug first. She asked the artists to wait until the code was stable.",
    "Because of Sarah's plan, the bug was fixed quickly. The team finished the game on time. Sarah was very happy. Her job is important because she helps her team finish their work and stay happy."
  ]
};

// Comprehension Questions
const QUESTIONS_RED_COMP = [
  { q: "What is Sarah's main role at EduQuest?", a: "To write the software code", b: "To coordinate different teams and manage project flow", c: "To design the user interface", d: "To find bugs in the application", ans: "B" },
  { q: "What software development methodology does Sarah's team use, as implied by the use of a Kanban board and sprints?", a: "Waterfall planning", b: "Agile development", c: "Solo programming", d: "Direct release cycle", ans: "B" },
  { q: "Which team is David responsible for leading?", a: "Graphic design team", b: "Quality assurance team", c: "Software development team", d: "Project management team", ans: "C" },
  { q: "What specific bottleneck threatened the release timeline during the morning stand-up?", a: "The testers refused to check the software builds", b: "The developers required more time to refine multiplayer server logic", c: "The company decided to cancel the project", d: "The graphic designers refused to work with David", ans: "B" },
  { q: "Why did the graphic design team complain during the meeting?", a: "They were not paid on time", b: "Their new screen designs had not yet been integrated into the build", c: "They did not want to design educational games", d: "Their Kanban cards were deleted", ans: "B" },
  { q: "How did Sarah resolve the conflict between the developers and designers?", a: "She gave the developers another week and delayed the launch", b: "She forced both teams to work overtime", c: "She restructured the backlog, prioritizing designs for launch and delaying complex multiplayer parts", d: "She hired a new programming lead to replace David", ans: "C" },
  { q: "What tool did Sarah use to track the team's progress and work remaining?", a: "A burn-down chart", b: "A calendar spreadsheet", c: "An email list", d: "A daily diary", ans: "A" },
  { q: "What does a 'sprint' refer to in the context of the story?", a: "A running race between the employees", b: "A set period of time during which specific work must be completed", c: "A quick breakdown of the computer server", d: "A meeting with school principals", ans: "B" },
  { q: "How did Sarah ensure that the quality assurance testers could do their work?", a: "She tested the software herself", b: "She made sure they had stable builds to evaluate", c: "She gave them more design files", d: "She extended their working hours", ans: "B" },
  { q: "What can be inferred about the multiplayer feature of the application?", a: "It was completely deleted from the project", b: "It was not essential for the initial launch version", c: "It was developed by the graphic designers", d: "It was too simple to require testing", ans: "B" },
  { q: "Which term in the text refers to a point in time when a major task or phase must be completed?", a: "Sprint", b: "Milestone", c: "Stand-up", d: "Backlog", ans: "B" },
  { q: "How did Sarah's compromise affect David's engineering team?", a: "It increased their work hours", b: "It relieved their immediate pressure", c: "It forced them to rewrite all their designs", d: "It stopped their server development entirely", ans: "B" },
  { q: "What was the goal of the game that the team was developing?", a: "An educational science game", b: "A school-oriented mathematics application", c: "A typing speed practice application", d: "A reading comprehension simulator", ans: "B" },
  { q: "Based on the passage, how do project managers serve society?", a: "By writing all the computer programs used by children", b: "By connecting creative ideas and technical work to deliver useful projects", c: "By designing graphics for schools", d: "By enforcing government laws on software", ans: "B" },
  { q: "What does the term 'backlog' mean in this story?", a: "A backup of the server database", b: "A list of tasks that need to be addressed in the project", c: "The physical board in the office", d: "The code written by testers", ans: "B" }
];

const QUESTIONS_BLUE_COMP = [
  { q: "What does the company EduQuest make?", a: "Computer games for schools", b: "Maths textbooks for teachers", c: "Boards for offices", d: "Websites for police", ans: "A" },
  { q: "Who does Sarah help as a project manager?", a: "Only the programmers", b: "Her whole team to work together", c: "The school principal", d: "Only the artists", ans: "B" },
  { q: "Which of the following is NOT a role mentioned on Sarah's team?", a: "Software programmer", b: "Graphic artist", c: "School teacher", d: "Software tester", ans: "C" },
  { q: "According to the text, what is a job of a tester?", a: "To write the game story", b: "To draw characters", c: "To find bugs in the code", d: "To manage the schedule", ans: "C" },
  { q: "What does a project manager NOT do, according to the text?", a: "Organise the schedule", b: "Write the code or draw the pictures", c: "Help the team solve problems", d: "Run daily stand-up meetings", ans: "B" },
  { q: "How often does Sarah run stand-up meetings?", a: "Once a week", b: "Every morning", c: "Once a month", d: "Every afternoon", ans: "B" },
  { q: "Which of these is one of the three questions team members answer at the daily meeting?", a: "What they ate for breakfast", b: "What they will do today", c: "How many hours they worked", d: "If they like their job", ans: "B" },
  { q: "Why are stand-up meetings helpful for Sarah?", a: "They help her find and fix roadblocks early", b: "They let her teach maths to the team", c: "They help her write code faster", d: "They allow the team to rest", ans: "A" },
  { q: "What major problem did the testers find a week before launch?", a: "The game had no music", b: "The game crashed when two players played together", c: "The artists forgot to draw the characters", d: "David left the company", ans: "B" },
  { q: "How did David feel when the bug was found?", a: "Excited", b: "Stressed", c: "Bored", d: "Angry", ans: "B" },
  { q: "What did the artists want to do before the launch?", a: "Add more colours to the game screens", b: "Take a holiday", c: "Fix the code crash", d: "Change the game's title", ans: "A" },
  { q: "What was Sarah's reaction to the team's problems?", a: "She became angry and shouted", b: "She stayed calm and made a plan", c: "She delayed the launch by a month", d: "She asked the school for help", ans: "B" },
  { q: "What task did Sarah ask the programmers to focus on?", a: "Adding new colours", b: "Fixing the game crash", c: "Writing a game guide", d: "Organising the meetings", ans: "B" },
  { q: "When did the artists' new designs get scheduled to be added?", a: "They were never added", b: "Later as an update", c: "On the launch day", d: "During the stand-up meeting", ans: "B" },
  { q: "How does a project manager help a team achieve goals, according to the story?", a: "By writing the best code", b: "By solving conflicts and keeping everyone focused", c: "By drawing characters", d: "By testing the games themselves", ans: "B" }
];

const QUESTIONS_GREEN_COMP = [
  { q: "What is Sarah's job?", a: "Software programmer", b: "Project manager", c: "Graphic artist", d: "Game tester", ans: "B" },
  { q: "Where does Sarah work?", a: "At a school", b: "At a computer game company", c: "At a toy store", d: "In a library", ans: "B" },
  { q: "Does Sarah draw the pictures for the games?", a: "Yes, she draws all characters", b: "No, she does not draw pictures", c: "Only when she has time", d: "Only the school games", ans: "B" },
  { q: "What is the main job of the programmers?", a: "To play the games", b: "To write the computer code", c: "To make plans on the board", d: "To draw characters", ans: "B" },
  { q: "What do the artists draw?", a: "Maps of the city", b: "All the fun game characters", c: "Code lines", d: "Big planning boards", ans: "B" },
  { q: "What is the job of the testers?", a: "To write the code", b: "To play the games to search for bugs", c: "To build the computers", d: "To lead the meetings", ans: "B" },
  { q: "Where does Sarah write the tasks for her team?", a: "In a notebook", b: "On a big board", c: "On the computer screen only", d: "On paper sheets", ans: "B" },
  { q: "How does the big board help the team?", a: "It teaches them how to draw", b: "It shows exactly what each person needs to do", c: "It plays music", d: "It fixes bugs", ans: "B" },
  { q: "What did the team find in the game one day?", a: "A secret code", b: "A serious bug", c: "A new character", d: "A prize", ans: "B" },
  { q: "What happened to the game when the bug was found?", a: "It became faster", b: "It stopped working", c: "It changed colours", d: "It was deleted", ans: "B" },
  { q: "How did the programmers feel about the bug?", a: "Happy", b: "Worried", c: "Excited", d: "Angry", ans: "B" },
  { q: "What did the artists want to add to the game?", a: "More drawings", b: "More sound", c: "More programmers", d: "A big board", ans: "A" },
  { q: "What did Sarah tell the programmers to do first?", a: "Take a break", b: "Fix the bug first", c: "Ask the artists for help", d: "Change the game", ans: "B" },
  { q: "What did Sarah ask the artists to do?", a: "Help the programmers write code", b: "Wait until the code was stable", c: "Go home", d: "Draw a new bug", ans: "B" },
  { q: "Why is Sarah's job important?", a: "She teaches coding", b: "She helps her team finish their work and stay happy", c: "She plays games all day", d: "She draws characters", ans: "B" }
];

// Maths Questions
const MATHS_Y5 = [
  { q: "A rectangular office desk is 120 cm long and 60 cm wide. What is the perimeter of the desk?", a: "180 cm", b: "360 cm", c: "7200 cm", d: "240 cm", ans: "B" },
  { q: "[SEE IMAGE: q17_y5_rect.png] Find the area of the rectangle shown in the diagram.", a: "38 square metres", b: "84 square metres", c: "19 square metres", d: "96 square metres", ans: "B" },
  { q: "A square server room has a perimeter of 32 metres. What is the area of the server room?", a: "32 square metres", b: "64 square metres", c: "16 square metres", d: "128 square metres", ans: "B" },
  { q: "Sarah is planning a new software office. The floor plan is a rectangle that is 15 metres long and 8 metres wide. Tiling the floor costs $30 per square metre. How much will it cost to tile the office?", a: "$460", b: "$3600", c: "$1380", d: "$1800", ans: "B" },
  { q: "[SEE IMAGE: q20_y5_compound.png] Find the perimeter of the L-shaped building shown in the diagram.", a: "28 metres", b: "36 metres", c: "32 metres", d: "44 metres", ans: "B" },
  { q: "[SEE IMAGE: q20_y5_compound.png] Find the area of the L-shaped building shown in the diagram.", a: "80 square metres", b: "64 square metres", c: "48 square metres", d: "72 square metres", ans: "B" },
  { q: "A fence is to be built around a rectangular server park that is 45 metres long and 25 metres wide. Fencing costs $15 per metre. What is the total cost of the fence?", a: "$1050", b: "$2100", c: "$1125", d: "$16875", ans: "B" },
  { q: "An artist's screen is 24 cm wide and has an area of 480 square cm. What is the height of the screen?", a: "20 cm", b: "40 cm", c: "10 cm", d: "96 cm", ans: "A" },
  { q: "A rectangular computer chip has a length of 8 mm and a width of 6 mm. If both the length and the width of the chip are doubled, what happens to its area?", a: "The area doubles", b: "The area becomes four times larger", c: "The area increases by 14 square mm", d: "The area becomes eight times larger", ans: "B" },
  { q: "[SEE IMAGE: q25_y5_garden.png] A rectangular office courtyard is 14 metres long and 10 metres wide. A concrete path that is 1 metre wide is built all the way around the outside of the courtyard. What is the outer perimeter of the path?", a: "48 metres", b: "56 metres", c: "52 metres", d: "44 metres", ans: "B" },
  { q: "[SEE IMAGE: q25_y5_garden.png] Using the courtyard and path dimensions from the previous question, what is the area of the concrete path itself?", a: "192 square metres", b: "52 square metres", c: "140 square metres", d: "48 square metres", ans: "B" },
  { q: "A rectangular room in the company is 8 metres long and has a perimeter of 28 metres. What is the area of the room?", a: "48 square metres", b: "24 square metres", c: "80 square metres", d: "16 square metres", ans: "A" },
  { q: "A software developer wants to paint a large square accent wall in their office. The wall has a side length of 5 metres. A single can of paint covers 10 square metres. How many full cans of paint must be purchased to cover the wall?", a: "2 cans", b: "3 cans", c: "5 cans", d: "25 cans", ans: "B" },
  { q: "Two rectangular computer monitors are on a desk. Monitor A is 40 cm wide and 30 cm high. Monitor B is 50 cm wide and 25 cm high. Which monitor has the larger area, and by how much?", a: "Monitor A is larger by 50 square cm", b: "Monitor B is larger by 50 square cm", c: "Both monitors have the same area", d: "Monitor B is larger by 1250 square cm", ans: "B" },
  { q: "A programmer walks around a rectangular building that is 60 metres long and 40 metres wide. If they walk around the building 4 times, how far do they walk in total?", a: "200 metres", b: "800 metres", c: "400 metres", d: "960 metres", ans: "B" }
];

const MATHS_Y34 = [
  { q: "[SEE IMAGE: q16_grid_rect.png] Find the area of the shaded shape by counting the square centimetres.", a: "8 square cm", b: "15 square cm", c: "16 square cm", d: "10 square cm", ans: "B" },
  { q: "[SEE IMAGE: q16_grid_rect.png] What is the perimeter of the shaded rectangle in the grid?", a: "15 cm", b: "16 cm", c: "8 cm", d: "12 cm", ans: "B" },
  { q: "[SEE IMAGE: q18_grid_square.png] Find the area of the square on the grid.", a: "8 square cm", b: "16 square cm", c: "12 square cm", d: "20 square cm", ans: "B" },
  { q: "[SEE IMAGE: q18_grid_square.png] What is the perimeter of the square on the grid?", a: "8 cm", b: "16 cm", c: "12 cm", d: "24 cm", ans: "B" },
  { q: "[SEE IMAGE: q20_grid_lshape.png] Find the area of the L-shaped rug by counting the grid squares inside.", a: "5 square units", b: "7 square units", c: "10 square units", d: "12 square units", ans: "B" },
  { q: "A small rectangle is 6 centimetres long and 4 centimetres wide. What is the perimeter of the rectangle?", a: "10 cm", b: "20 cm", c: "24 cm", d: "12 cm", ans: "B" },
  { q: "A square table has a side length of 2 metres. What is the area of the tabletop?", a: "8 square metres", b: "4 square metres", c: "6 square metres", d: "2 square metres", ans: "B" },
  { q: "What is the perimeter of the square table from the previous question?", a: "4 metres", b: "8 metres", c: "6 metres", d: "16 metres", ans: "B" },
  { q: "A rectangular notepad is 10 cm long and 5 cm wide. What is the area of the notepad?", a: "30 square cm", b: "50 square cm", c: "15 square cm", d: "25 square cm", ans: "B" },
  { q: "A student draws a shape with 4 sides. The sides are 5cm, 3cm, 5cm, and 3cm. What is the perimeter of the shape?", a: "8 cm", b: "16 cm", c: "15 cm", d: "12 cm", ans: "B" },
  { q: "A garden bed is made of 1-metre squares. It has 3 rows with 5 squares in each row. What is the area of the garden bed?", a: "8 square metres", b: "15 square metres", c: "16 square metres", d: "12 square metres", ans: "B" },
  { q: "What do we measure when we find the perimeter of a shape?", a: "The total space covered inside the shape", b: "The total distance around the outside edge of the shape", c: "The weight of the shape", d: "The number of corners the shape has", ans: "B" },
  { q: "What do we measure when we find the area of a shape?", a: "The distance around the outside of the shape", b: "The amount of flat space inside the shape", c: "How tall the shape is", d: "The thickness of the shape's border", ans: "B" },
  { q: "A rectangular rug is 3 metres long and 2 metres wide. How much space does it cover on the floor?", a: "10 square metres", b: "6 square metres", c: "5 square metres", d: "12 square metres", ans: "B" },
  { q: "A square sandbox has a perimeter of 12 metres. What is the length of one side of the sandbox?", a: "6 metres", b: "3 metres", c: "4 metres", d: "2 metres", ans: "B" }
];

// Generates the Reading DOCX file
function makeReadingDoc(title, textObj) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32 // 16pt
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [
        new TextRun({
          text: textObj.title,
          bold: true,
          italics: true,
          size: 26, // 13pt
          color: "444444"
        })
      ]
    })
  ];

  textObj.paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 140, line: 276, lineRule: 'auto' }, // 1.15 line spacing
        children: [
          new TextRun({
            text: p,
            size: 24 // 12pt
          })
        ]
      })
    );
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: STANDARD_MARGIN_PROPS
      },
      children: children
    }]
  });
}

// Generates the Questions DOCX file (Microsoft Forms format)
function makeQuestionsDoc(title, compQs, mathsQs) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32 // 16pt
        })
      ]
    })
  ];

  let qNum = 1;

  // Add Reading Questions
  compQs.forEach(q => {
    children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${qNum}. ${q.q}`, bold: true, size: 22 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `A. ${q.a}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `B. ${q.b}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `C. ${q.c}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `D. ${q.d}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: `POINT: 1`, bold: true, size: 20 })] }));
    qNum++;
  });

  // Add Maths Questions
  mathsQs.forEach(q => {
    children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${qNum}. ${q.q}`, bold: true, size: 22 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `A. ${q.a}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `B. ${q.b}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `C. ${q.c}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `D. ${q.d}`, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `ANSWER: ${q.ans}`, bold: true, size: 20 })] }));
    children.push(new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: `POINT: 1`, bold: true, size: 20 })] }));
    qNum++;
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: STANDARD_MARGIN_PROPS
      },
      children: children
    }]
  });
}

// Generates the two-page Printable student document (Optimized for exact 2-page fit)
function makePrintDoc(title, textObj, compQs, mathsQs) {
  // 0.5 inch margins = 720 DXA
  const margins = { top: 720, right: 720, bottom: 720, left: 720 };
  
  const usableWidth = PRINT_PAGE_WIDTH - (margins.left + margins.right);
  const colWidth = Math.floor(usableWidth / 2);
  const tabPosition = Math.floor(colWidth / 2);

  const qFontSize = 19; // 9.5pt
  const readFontSize = 22; // 11pt
  const readLineSpacing = 253; // 1.15 line spacing

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 20 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 26 // 13pt
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: textObj.title,
          bold: true,
          italics: true,
          size: 22,
          color: "444444"
        })
      ]
    })
  ];

  // 1. Reading Text (Tightened spacing and font size)
  textObj.paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 40, line: readLineSpacing, lineRule: 'auto' },
        children: [
          new TextRun({
            text: p,
            size: readFontSize
          })
        ]
      })
    );
  });

  // 2. Reading Questions header
  children.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: "Part A: Reading Comprehension",
          bold: true,
          size: 20, // 10pt
          underline: true
        })
      ]
    })
  );

  // 3. Reading Questions full-width
  let qNum = 1;
  compQs.forEach(q => {
    children.push(
      new Paragraph({
        spacing: { before: 30, after: 10 },
        children: [
          new TextRun({
            text: `${qNum}. ${q.q}`,
            bold: true,
            size: qFontSize
          })
        ]
      })
    );

    // Options line 1: A and B
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 10, line: 180, lineRule: 'auto' },
        children: [
          new TextRun({ text: `A. ${q.a}`, size: qFontSize }),
          new TextRun({ text: `\tB. ${q.b}`, size: qFontSize })
        ]
      })
    );

    // Options line 2: C and D with thin grey border
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 40, line: 180, lineRule: 'auto' },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DCDCDC', space: 4 }
        },
        children: [
          new TextRun({ text: `C. ${q.c}`, size: qFontSize }),
          new TextRun({ text: `\tD. ${q.d}`, size: qFontSize })
        ]
      })
    );
    qNum++;
  });

  // 4. Maths Questions header
  const mathsHeaderPara = new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [
      new TextRun({
        text: "Part B: Mathematics Word Problems",
        bold: true,
        size: 20,
        underline: true
      })
    ]
  });

  // Split Maths Questions: 8 on left, 7 on right
  const leftCells = [];
  const rightCells = [];

  for (let i = 0; i < mathsQs.length; i++) {
    const q = mathsQs[i];
    const cellItems = [];

    cellItems.push(
      new Paragraph({
        spacing: { before: 50, after: 10 },
        children: [
          new TextRun({
            text: `${qNum}. ${q.q}`,
            bold: true,
            size: qFontSize
          })
        ]
      })
    );

    cellItems.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 10, line: 180, lineRule: 'auto' },
        children: [
          new TextRun({ text: `A. ${q.a}`, size: qFontSize }),
          new TextRun({ text: `\tB. ${q.b}`, size: qFontSize })
        ]
      })
    );

    cellItems.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: tabPosition }],
        spacing: { before: 0, after: 40, line: 180, lineRule: 'auto' },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DCDCDC', space: 4 }
        },
        children: [
          new TextRun({ text: `C. ${q.c}`, size: qFontSize }),
          new TextRun({ text: `\tD. ${q.d}`, size: qFontSize })
        ]
      })
    );

    if (i < 8) {
      leftCells.push(...cellItems);
    } else {
      rightCells.push(...cellItems);
    }
    qNum++;
  }

  // Create columns with borderless single-row table and minimal margins
  const colTable = new Table({
    columnWidths: [colWidth, colWidth],
    margins: { top: 10, bottom: 10, left: 40, right: 40 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            width: { size: colWidth, type: WidthType.DXA },
            children: leftCells
          }),
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            width: { size: colWidth, type: WidthType.DXA },
            children: rightCells
          })
        ]
      })
    ]
  });

  return new Document({
    styles: STYLES,
    sections: [{
      properties: {
        page: {
          margin: margins,
          size: { width: PRINT_PAGE_WIDTH, height: PRINT_PAGE_HEIGHT } // Explicitly A4 size
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 0, after: 40 },
              children: [
                new TextRun({
                  text: "Name: ______________________   Date: __________",
                  size: 16,
                  color: "666666"
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
              spacing: { before: 40, after: 0 },
              children: [
                new TextRun({ text: "Page ", size: 14, color: "777777" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "777777" }),
                new TextRun({ text: " of ", size: 14, color: "777777" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: "777777" })
              ]
            })
          ]
        })
      },
      children: [
        ...children,
        mathsHeaderPara,
        colTable
      ]
    }]
  });
}

// Shuffles options and updates correct answer key
function shuffleQuestion(q) {
  const options = [
    { text: q.a, isCorrect: q.ans === 'A' },
    { text: q.b, isCorrect: q.ans === 'B' },
    { text: q.c, isCorrect: q.ans === 'C' },
    { text: q.d, isCorrect: q.ans === 'D' }
  ];
  
  // Fisher-Yates Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = options[i];
    options[i] = options[j];
    options[j] = temp;
  }
  
  // Map back to a, b, c, d
  q.a = options[0].text;
  q.b = options[1].text;
  q.c = options[2].text;
  q.d = options[3].text;
  
  // Find correct answer letter
  const correctIdx = options.findIndex(opt => opt.isCorrect);
  q.ans = ['A', 'B', 'C', 'D'][correctIdx];
  
  return q;
}

// Generate all files
async function main() {
  console.log("Generating Week 9 Homework Pack...");

  const outDir = __dirname;

  // Shuffle all questions before generating to randomize correct answer keys
  const shuffledRedComp = QUESTIONS_RED_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledBlueComp = QUESTIONS_BLUE_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledGreenComp = QUESTIONS_GREEN_COMP.map(q => shuffleQuestion({ ...q }));
  const shuffledMathsY5 = MATHS_Y5.map(q => shuffleQuestion({ ...q }));
  const shuffledMathsY34 = MATHS_Y34.map(q => shuffleQuestion({ ...q }));

  // 1. Reading DOCX files
  const readRed = makeReadingDoc("Week 9 Homework — Narrative Text", TEXT_RED);
  const readBlue = makeReadingDoc("Week 9 Homework — Narrative Text", TEXT_BLUE);
  const readGreen = makeReadingDoc("Week 9 Homework — Narrative Text", TEXT_GREEN);

  fs.writeFileSync(path.join(outDir, "Week_9_Reading_Red.docx"), await Packer.toBuffer(readRed));
  fs.writeFileSync(path.join(outDir, "Week_9_Reading_Blue.docx"), await Packer.toBuffer(readBlue));
  fs.writeFileSync(path.join(outDir, "Week_9_Reading_Green.docx"), await Packer.toBuffer(readGreen));
  console.log("✅ Reading DOCX files created.");

  // 2. Questions DOCX files (Microsoft Forms format)
  const qRed = makeQuestionsDoc("Week 9 Homework Assessment — Red Group", shuffledRedComp, shuffledMathsY5);
  const qBlue = makeQuestionsDoc("Week 9 Homework Assessment — Blue Group", shuffledBlueComp, shuffledMathsY5);
  const qGreen = makeQuestionsDoc("Week 9 Homework Assessment — Green Group", shuffledGreenComp, shuffledMathsY34);

  fs.writeFileSync(path.join(outDir, "Week_9_Questions_Red.docx"), await Packer.toBuffer(qRed));
  fs.writeFileSync(path.join(outDir, "Week_9_Questions_Blue.docx"), await Packer.toBuffer(qBlue));
  fs.writeFileSync(path.join(outDir, "Week_9_Questions_Green.docx"), await Packer.toBuffer(qGreen));
  console.log("✅ Questions DOCX files created.");

  // 3. Print DOCX files (2-page student handouts)
  const printRed = makePrintDoc("Week 9 Homework — Red Group", TEXT_RED, shuffledRedComp, shuffledMathsY5);
  const printBlue = makePrintDoc("Week 9 Homework — Blue Group", TEXT_BLUE, shuffledBlueComp, shuffledMathsY5);
  const printGreen = makePrintDoc("Week 9 Homework — Green Group", TEXT_GREEN, shuffledGreenComp, shuffledMathsY34);

  fs.writeFileSync(path.join(outDir, "Week_9_Print_Red.docx"), await Packer.toBuffer(printRed));
  fs.writeFileSync(path.join(outDir, "Week_9_Print_Blue.docx"), await Packer.toBuffer(printBlue));
  fs.writeFileSync(path.join(outDir, "Week_9_Print_Green.docx"), await Packer.toBuffer(printGreen));
  console.log("✅ Print DOCX files created.");

  console.log("🎉 All Week 9 homework files successfully compiled.");
}

main().catch(err => {
  console.error("❌ Error compiling homework:", err);
});

const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af', darkGrey: '333333' };

async function generateBlogExcerpt(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Survivor Blog: The Night Darwin Died", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "By Sarah Jenkins, December 1974", size: 24, italics: true, color: THEME.darkGrey })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "We woke up to a world that had simply ceased to be. The wind didn't just blow; it screamed like some kind of banshee trying to rip the roof off. It felt like a freight train was driving right through the living room. Everything we owned was just gone. Smashed to pieces.", size: 24 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "I remember huddling with the kids in the hallway—the narrowest part of our house—praying the walls would hold. The noise was absolutely deafening. We couldn't even hear each other screaming. Dust and debris were swirling everywhere, and the smell of snapped timber and broken earth was suffocating. Every few minutes, there was another terrifying crash as something massive gave way. Was it our neighbor's roof? A falling tree? We had no idea. The darkness was absolute.", size: 24 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "When morning finally broke, the silence was almost worse than the storm. We crawled out from under a mattress covered in broken glass and plaster. I couldn't even recognize my own street. It was a total nightmare. The towering mango tree we used to swing from was completely uprooted, its massive roots exposed like tangled wires. Houses that had stood for decades were just piles of splintered wood and twisted metal.", size: 24 })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "People were wandering around like ghosts, staring blankly at the destruction. Some were crying, others were just too shocked to make a sound. The rain was still falling, a cold drizzle that seeped into our bones. All I could think was: Where do we even begin? Our home, our memories, everything we had built over the last ten years had been wiped out in a single night. But holding my children tight, feeling their little hearts beating against my chest, I knew we had the only thing that really mattered.", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Questions to think about:", bold: true, size: 24 })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. How does the author want you to feel?", size: 24 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Can you find any opinions or feelings in this text?", size: 24 })],
        })
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Blog Excerpt Handout generated.");
}

async function generatePhraseSorting(filename) {
  const phrases = [
    "The wind speed reached 217 km/h.",
    "It felt like a freight train was driving right through the living room.",
    "Significant structural failure occurred.",
    "Everything we owned was just gone.",
    "Sixty-six fatalities were recorded.",
    "It was a total nightmare."
  ];

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: THEME.blue },
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Formal & Objective", bold: true, color: THEME.white, size: 28 })] })],
        }),
        new TableCell({
          shading: { fill: THEME.orange },
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Informal & Subjective", bold: true, color: THEME.white, size: 28 })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" })] }),
        new TableCell({ children: [new Paragraph({ text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" })] }),
      ],
    })
  ];

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 8: Phrase Sorting Challenge", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Instructions: Cut out the phrases below and paste them into the correct column.", size: 24, italics: true })],
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        }),
        new Paragraph({ text: "", spacing: { before: 400, after: 400 } }),
        new Paragraph({ children: [new TextRun({ text: "--- Cut Here ---", bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        ...phrases.map(p => new Paragraph({
          children: [new TextRun({ text: p, size: 24 })],
          spacing: { after: 200 },
          border: { top: { style: BorderStyle.SINGLE, space: 10 }, bottom: { style: BorderStyle.SINGLE, space: 10 }, left: { style: BorderStyle.SINGLE, space: 10 }, right: { style: BorderStyle.SINGLE, space: 10 } }
        }))
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Phrase Sorting Handout generated.");
}

async function generateLucasHandout(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 8: Fact or Story?", bold: true, size: 32, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Read the sentence below:", bold: true, size: 28, color: THEME.orange })],
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "The wind speed reached 217 km/h.", size: 36, alignment: AlignmentType.CENTER })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                    bottom: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                    left: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                    right: { style: BorderStyle.SINGLE, size: 3, color: THEME.blue },
                  },
                  margins: { top: 400, bottom: 400, left: 400, right: 400 }
                })
              ]
            })
          ]
        }),
        new Paragraph({ text: "", spacing: { after: 400 } }),
        new Paragraph({
          children: [new TextRun({ text: "1. Circle the number in the sentence.", size: 24 })],
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Is this sentence a fact from the real world, or an opinion?", size: 24 })],
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({ text: "It is a __________________________________________________", spacing: { after: 400 } }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Lucas Handout generated.");
}

async function generatePresentation(filename, slidePaths) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (const s of slidePaths) {
    try {
      console.log(`Processing: ${path.basename(s)}`);
      await html2pptx(s, pptx);
      console.log(`✅ Processed: ${path.basename(s)}`);
    } catch (err) {
      console.error(`❌ Error on ${s}: ${err.message}`);
      let failSlide = pptx.addSlide();
      failSlide.addText(`Slide generation failed.`, { x: 1, y: 1, color: 'FF0000' });
    }
  }
  await pptx.writeFile({ fileName: filename });
  console.log("✅ PPTX generated.");
}

async function run() {
  console.log("Starting resource generation...");
  
  const slidesDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_08_Slides";
  const slidePaths = [
    path.join(slidesDir, "slide_1.html"),
    path.join(slidesDir, "slide_2.html"),
    path.join(slidesDir, "slide_3.html"),
    path.join(slidesDir, "slide_4.html"),
    path.join(slidesDir, "slide_5.html"),
    path.join(slidesDir, "slide_6.html"),
    path.join(slidesDir, "slide_7.html"),
    path.join(slidesDir, "slide_8.html")
  ];
  
  const pptxPath = path.join(slidesDir, "..", "Lesson_08_Presentation.pptx");
  await generatePresentation(pptxPath, slidePaths);
  
  const handoutsDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts";
  
  const blogExcerptPath = path.join(handoutsDir, "Lesson_08_Handout_Blog_Excerpt.docx");
  await generateBlogExcerpt(blogExcerptPath);
  
  const phrasePath = path.join(handoutsDir, "Lesson_08_Handout_Phrase_Sorting.docx");
  await generatePhraseSorting(phrasePath);
  
  const lucasHandoutPath = path.join(handoutsDir, "Lesson_08_Lucas_Worksheet.docx");
  await generateLucasHandout(lucasHandoutPath);
}

run().catch(console.error);

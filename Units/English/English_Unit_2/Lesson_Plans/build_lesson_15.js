const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\pptx\\scripts\\html2pptx');

const THEME = { navy: '112d4e', orange: 'f96d00', white: 'f9f7f7', blue: '3f72af', darkGrey: '333333', lightGrey: 'e0e0e0' };

async function generateWorksheet(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 15: Point of View - Floods", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        
        // Survivor Story
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Source A: The Morning the River Came In (Personal Account)", bold: true, size: 28, color: THEME.orange })],
          spacing: { before: 200, after: 200 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: THEME.lightGrey },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "I'll never forget the sound—a low, rhythmic thumping that I thought was my neighbor's generator. It wasn't. It was the river, thick and brown like liquid chocolate, battering against the brickwork of my garage. By the time I realised what was happening, the water was already over my ankles. It was cold, colder than you'd expect, and it had this sharp, chemical smell that stung my nose.\n\nWe had thirty minutes to grab what we could. I stood in the hallway, looking at twenty years of memories and knowing I couldn't save them. I grabbed the photo albums and the kids' school trophies, but everything else—the sofa, the books, the old rug my grandmother gave me—it all felt like it was already gone. Watching the water seep into the floorboards felt like watching someone slowly take my home away.\n\nBy the time the SES boat arrived at our front window, our street had turned into a muddy ocean. People were shouting, dogs were barking from rooftops, and the air was filled with a sense of utter disbelief. We weren't just losing our houses; we were losing our sense of safety.", size: 22, italics: true })]
                    })
                  ],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ]
        }),

        // Archive Text
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Source B: Floods Archive - The Human Cost (Scientific Report)", bold: true, size: 28, color: THEME.blue })],
          spacing: { before: 400, after: 200 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: THEME.lightGrey },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "The 2011 and 2022 Queensland flood events resulted in significant socio-economic disruption. Beyond the immediate loss of life (46 fatalities), the compounding effects on community mental health have been substantial. The Australian Institute of Health and Welfare notes a correlation between repeated inundation and increased rates of anxiety and PTSD. Economically, the Deloitte report estimated the social and financial cost of the 2022 floods at A$7.7 billion, including A$6.4 billion in insured losses. Environmental impacts were also severe, with over 1 million tonnes of sediment discharged into Moreton Bay, disrupting marine habitats and fluvial geomorphology.", size: 22 })]
                    })
                  ],
                  margins: { top: 200, bottom: 200, left: 200, right: 200 }
                })
              ]
            })
          ]
        }),

        // Analysis Table
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: "Comparison Challenge", bold: true, size: 28, color: THEME.navy })],
          spacing: { before: 400, after: 200 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ shading: { fill: THEME.navy }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feature", bold: true, color: THEME.white })] })] }),
                new TableCell({ shading: { fill: THEME.orange }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Source A (Survivor)", bold: true, color: THEME.white })] })] }),
                new TableCell({ shading: { fill: THEME.blue }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Source B (Archive)", bold: true, color: THEME.white })] })] }),
              ]
            }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Tone (Feel)" })] }), new TableCell({ children: [new Paragraph({ text: "" })] }), new TableCell({ children: [new Paragraph({ text: "" })] })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Key Vocabulary" })] }), new TableCell({ children: [new Paragraph({ text: "" })] }), new TableCell({ children: [new Paragraph({ text: "" })] })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Primary Focus" })] }), new TableCell({ children: [new Paragraph({ text: "" })] }), new TableCell({ children: [new Paragraph({ text: "" })] })] }),
          ]
        }),

        // Analysis Question
        new Paragraph({
          children: [new TextRun({ text: "\nAnalysis Question:", bold: true, size: 24 })],
          spacing: { before: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "The author's point of view in Source B is different from Source A because... (Explain using examples from the text)", size: 22 })],
          spacing: { after: 200 }
        }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
        new Paragraph({ text: "____________________________________________________________________________________________________" }),
      ]
    }]
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filename, buffer);
  console.log("✅ Main Worksheet generated.");
}

async function generateLucasHandout(filename) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Lesson 15: Fact or Feeling?", bold: true, size: 36, color: THEME.navy })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Name: ______________________   Date: _____________", size: 24 })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Listen to the story. Draw a line to the word that describes how the person feels.", size: 24, italics: true })],
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "THE STORY SAYS...", bold: true, alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: "THE FEELING IS...", bold: true, alignment: AlignmentType.CENTER })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "\"I'll never forget the sound... it was terrifying.\"" })] }),
                new TableCell({ children: [new Paragraph({ text: "SCARED", alignment: AlignmentType.CENTER })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: '"Watching the water seep in felt like losing my home."' })] }),
                new TableCell({ children: [new Paragraph({ text: "SAD", alignment: AlignmentType.CENTER })] }),
              ]
            }),
          ]
        }),
        new Paragraph({
          children: [new TextRun({ text: "\nIs this story a FACT (like a science book) or a FEELING (like a diary)?", size: 24 })],
          spacing: { before: 400, after: 200 }
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
    console.log(`Processing: ${path.basename(s)}`);
    await html2pptx(s, pptx, { ignoreValidation: true });
    console.log(`✅ Processed: ${path.basename(s)}`);
  }
  await pptx.writeFile({ fileName: filename });
  console.log("✅ PPTX generated.");
}

async function run() {
  console.log("Starting resource generation for Lesson 15...");
  
  const slidesDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Presentations\\Lesson_15_Slides";
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
  
  const pptxPath = path.join(slidesDir, "..", "Lesson_15_Presentation.pptx");
  // Only generate PPT if slides exist
  if (fs.existsSync(path.join(slidesDir, "slide_1.html"))) {
    await generatePresentation(pptxPath, slidePaths);
  } else {
    console.log("⚠️ Slides not found. Skipping PPT generation. Create HTML slides first.");
  }
  
  const handoutsDir = "c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Handouts";
  if (!fs.existsSync(handoutsDir)) fs.mkdirSync(handoutsDir, { recursive: true });

  const worksheetPath = path.join(handoutsDir, "Lesson_15_Worksheet.docx");
  await generateWorksheet(worksheetPath);
  
  const lucasHandoutPath = path.join(handoutsDir, "Lesson_15_Lucas_Handout.docx");
  await generateLucasHandout(lucasHandoutPath);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

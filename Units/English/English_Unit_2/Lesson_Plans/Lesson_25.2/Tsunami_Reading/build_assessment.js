const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
  navy: '001833',
  darkGrey: '333333'
};

const questions = [
  {
    num: 1,
    q: "What is the literal meaning of the Japanese word “tsunami”?",
    a: "A. Giant wave",
    b: "B. Harbour wave",
    c: "C. Fast wave",
    d: "D. Seismic wave",
    ans: "B"
  },
  {
    num: 2,
    q: "Unlike tsunamis, what are normal ocean waves created by?",
    a: "A. Underwater volcanoes",
    b: "B. Tectonic plate boundaries",
    c: "C. Wind",
    d: "D. Submarine earthquakes",
    ans: "C"
  },
  {
    num: 3,
    q: "Most tsunamis are triggered by undersea earthquakes that occur along which locations?",
    a: "A. Continental coastlines",
    b: "B. Tectonic plate boundaries",
    c: "C. Deep ocean trenches",
    d: "D. Coral reefs",
    ans: "B"
  },
  {
    num: 4,
    q: "How fast can a tsunami wave travel in the deep ocean?",
    a: "A. Over 50 kilometres per hour",
    b: "B. Over 200 kilometres per hour",
    c: "C. Over 500 kilometres per hour",
    d: "D. Over 800 kilometres per hour",
    ans: "D"
  },
  {
    num: 5,
    q: "Why are ships in the deep ocean unlikely to notice a passing tsunami wave?",
    a: "A. The wave is moving too slowly",
    b: "B. The wave is usually less than one metre high",
    c: "C. The wave only travels along the sea floor",
    d: "D. The wave moves around the ships",
    ans: "B"
  },
  {
    num: 6,
    q: "What is the scientific term for how waves travel through deep water?",
    a: "A. Wave shoaling",
    b: "B. Wave propagation",
    c: "C. Wave displacement",
    d: "D. Wave inundation",
    ans: "B"
  },
  {
    num: 7,
    q: "As a tsunami wave reaches shallow coastal water, what does its speed drop to?",
    a: "A. About 10 kilometres per hour",
    b: "B. About 50 kilometres per hour",
    c: "C. About 100 kilometres per hour",
    d: "D. About 800 kilometres per hour",
    ans: "B"
  },
  {
    num: 8,
    q: "What is the compression and rapid rising of waves as they enter shallow water called?",
    a: "A. Displacement",
    b: "B. Inundation",
    c: "C. Shoaling",
    d: "D. Propagation",
    ans: "C"
  },
  {
    num: 9,
    q: "What natural warning sign may happen at the beach right before a tsunami hits the shore?",
    a: "A. The water suddenly pulls back, exposing the sea floor",
    b: "B. The water becomes extremely warm",
    c: "C. The wind suddenly stops blowing",
    d: "D. Small whirlpools form near the shore",
    ans: "A"
  },
  {
    num: 10,
    q: "What do scientists use in the deep ocean to detect tsunami waves early?",
    a: "A. Satellite radar maps",
    b: "B. Submarine cameras",
    c: "C. Deep-ocean sensors",
    d: "D. Floating weather balloons",
    ans: "C"
  }
];

const children = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Tsunami Reading Comprehension Assessment")] }),
  new Paragraph({ style: "Subtitle", children: [new TextRun("Microsoft Forms Quick Import Document — Year 5 English Unit 2")] }),
  
  new Paragraph({ spacing: { after: 240 }, children: [
    new TextRun({ text: "Instructions for Teacher: ", bold: true, color: "FE7107" }),
    new TextRun({ text: "This document is formatted for direct import into Microsoft Forms. Do not alter the numbering or the ANSWER/POINT tags. Upload this file directly to Microsoft Forms via the 'Quick Import' tool." })
  ] }),
  
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "--- Start of Assessment ---", italics: true })] })
];

questions.forEach(item => {
  children.push(new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: `${item.num}. ${item.q}`, bold: true })] }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun(item.a)] }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun(item.b)] }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun(item.c)] }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun(item.d)] }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `ANSWER: ${item.ans}`, bold: true })] }));
  children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "POINT: 1", bold: true })] }));
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 30, bold: true, color: THEME.navy, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 60 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Subtitle",
        name: "Subtitle",
        basedOn: "Normal",
        run: { size: 20, color: THEME.darkGrey, font: "Arial", italics: true },
        paragraph: { spacing: { before: 60, after: 240 }, alignment: AlignmentType.CENTER }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: children
  }]
});

const outputFilePath = path.join(__dirname, 'Tsunami_Comprehension_Assessment.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFilePath, buffer);
  console.log(`✅ Tsunami Comprehension Assessment generated successfully at: ${outputFilePath}`);
}).catch(err => {
  console.error("❌ Error generating assessment:", err);
  process.exit(1);
});

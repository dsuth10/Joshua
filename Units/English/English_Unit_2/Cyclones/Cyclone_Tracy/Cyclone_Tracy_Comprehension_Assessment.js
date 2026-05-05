const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, PageNumber, HeadingLevel, BorderStyle, ShadingType } = require("docx");

const FONT = "Calibri";
const SIZE = 24; // 12pt

const q = (num, text) => new Paragraph({
  spacing: { before: 240, after: 80 },
  children: [new TextRun({ text: `${num}. ${text}`, font: FONT, size: SIZE, bold: true })]
});
const opt = (letter, text) => new Paragraph({
  spacing: { before: 0, after: 0 },
  indent: { left: 360 },
  children: [new TextRun({ text: `${letter}. ${text}`, font: FONT, size: SIZE })]
});
const ans = (letter) => new Paragraph({
  spacing: { before: 0, after: 0 },
  indent: { left: 360 },
  children: [
    new TextRun({ text: `ANSWER: ${letter}`, font: FONT, size: SIZE, color: "888888" }),
    new TextRun({ text: `POINT: 1`, font: FONT, size: SIZE, color: "888888", break: 1 })
  ]
});
const gap = () => new Paragraph({ spacing: { before: 0, after: 0 }, children: [] });

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: SIZE } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "1B3A5C", font: FONT },
        paragraph: { spacing: { before: 0, after: 200 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "333333", font: FONT },
        paragraph: { spacing: { before: 200, after: 100 } } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Cyclone Tracy \u2014 Comprehension Assessment", font: FONT, size: 18, color: "999999", italics: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", font: FONT, size: 18, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: "999999" }),
            new TextRun({ text: " of ", font: FONT, size: 18, color: "999999" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18, color: "999999" })
          ]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "Cyclone Tracy", font: FONT, size: 48, bold: true, color: "1B3A5C" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Comprehension Assessment", font: FONT, size: 32, color: "555555" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Multiple Choice \u2014 20 Questions", font: FONT, size: 22, color: "888888", italics: true })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "Instructions: ", font: FONT, size: SIZE, bold: true }),
                   new TextRun({ text: "Read the Cyclone Tracy article carefully and answer the following questions. Each question has one correct answer. You will need to refer to the text to find the information.", font: FONT, size: SIZE })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Name: ____________________________     Date: ______________     Class: __________", font: FONT, size: SIZE })]
      }),

      // Q1
      q(1, "On what date did the eye of Cyclone Tracy pass directly over Darwin?"),
      opt("A", "24 December 1974"),
      opt("B", "25 December 1974"),
      opt("C", "26 December 1974"),
      opt("D", "21 December 1974"),
      ans("B"),
      gap(),

      // Q2
      q(2, "What time did the eye of the cyclone pass over Darwin?"),
      opt("A", "10:00 AM"),
      opt("B", "Midnight"),
      opt("C", "3:00 AM"),
      opt("D", "6:00 PM"),
      ans("C"),
      gap(),

      // Q3
      q(3, "What was the maximum wind speed recorded by the anemometer at Darwin Airport before it broke?"),
      opt("A", "185 km/h"),
      opt("B", "200 km/h"),
      opt("C", "250 km/h"),
      opt("D", "217 km/h"),
      ans("D"),
      gap(),

      // Q4
      q(4, "How many people lost their lives in Cyclone Tracy?"),
      opt("A", "49"),
      opt("B", "71"),
      opt("C", "66"),
      opt("D", "30"),
      ans("C"),
      gap(),

      // Q5
      q(5, "What type of houses defined Darwin\u2019s architecture before the cyclone?"),
      opt("A", "Brick bungalows"),
      opt("B", "Concrete high-rises"),
      opt("C", "Elevated fibro houses"),
      opt("D", "Stone cottages"),
      ans("C"),
      gap(),

      // Q6
      q(6, "According to the text, what were Darwin\u2019s houses designed for?"),
      opt("A", "Earthquake resistance"),
      opt("B", "Airflow rather than fortification"),
      opt("C", "Flood protection"),
      opt("D", "Energy efficiency"),
      ans("B"),
      gap(),

      // Q7
      q(7, "Where did Cyclone Tracy form before it struck Darwin?"),
      opt("A", "The Coral Sea"),
      opt("B", "The Timor Sea"),
      opt("C", "The Indian Ocean"),
      opt("D", "The Arafura Sea"),
      ans("D"),
      gap(),

      // Q8
      q(8, "What category was Cyclone Tracy classified as?"),
      opt("A", "Category 2"),
      opt("B", "Category 3"),
      opt("C", "Category 4"),
      opt("D", "Category 5"),
      ans("C"),
      gap(),

      // Q9
      q(9, "What was the estimated cost of damage from Cyclone Tracy in 1974 values?"),
      opt("A", "$500 million"),
      opt("B", "$800 million"),
      opt("C", "$1 billion"),
      opt("D", "$2 billion"),
      ans("B"),
      gap(),

      // Q10
      q(10, "How many people were left homeless by the cyclone?"),
      opt("A", "10,000"),
      opt("B", "25,000"),
      opt("C", "41,000"),
      opt("D", "50,000"),
      ans("C"),
      gap(),

      // Q11
      q(11, "What do survivors most consistently recall about the cyclone experience?"),
      opt("A", "The intense heat"),
      opt("B", "The flooding"),
      opt("C", "The noise"),
      opt("D", "The lightning"),
      ans("C"),
      gap(),

      // Q12
      q(12, "What percentage of Darwin\u2019s homes suffered irreparable damage?"),
      opt("A", "50%"),
      opt("B", "60%"),
      opt("C", "80%"),
      opt("D", "70%"),
      ans("D"),
      gap(),

      // Q13
      q(13, "What was the name of the evacuation operation that followed the cyclone?"),
      opt("A", "Operation Christmas"),
      opt("B", "Operation Darwin"),
      opt("C", "Operation Navy Help"),
      opt("D", "Operation Rescue"),
      ans("C"),
      gap(),

      // Q14
      q(14, "How many people were airlifted out of Darwin after the cyclone?"),
      opt("A", "10,000"),
      opt("B", "20,000"),
      opt("C", "41,000"),
      opt("D", "Over 30,000"),
      ans("D"),
      gap(),

      // Q15
      q(15, "Why were Darwin residents unable to see the destruction during the cyclone itself?"),
      opt("A", "Thick fog covered the city"),
      opt("B", "The city was devoid of electricity and it was dark"),
      opt("C", "Heavy rain blocked all visibility"),
      opt("D", "Windows had been boarded up"),
      ans("B"),
      gap(),

      // Q16
      q(16, 'The text describes Darwin\u2019s houses as standing \u201clike fragile card houses in the path of a bowling ball.\u201d What literary technique is this?'),
      opt("A", "Personification"),
      opt("B", "Alliteration"),
      opt("C", "Simile"),
      opt("D", "Onomatopoeia"),
      ans("C"),
      gap(),

      // Q17
      q(17, "According to the text, what threats prompted the decision to evacuate Darwin\u2019s population?"),
      opt("A", "Aftershocks and flooding"),
      opt("B", "No power, no running water, and the threat of disease"),
      opt("C", "A second cyclone approaching"),
      opt("D", "Fire and structural collapse"),
      ans("B"),
      gap(),

      // Q18
      q(18, "On what date did Cyclone Tracy turn sharply towards Darwin?"),
      opt("A", "21 December at midnight"),
      opt("B", "23 December at noon"),
      opt("C", "24 December at 10:00 AM"),
      opt("D", "25 December at 3:00 AM"),
      ans("C"),
      gap(),

      // Q19
      q(19, "What happened to many of the people who were evacuated from Darwin?"),
      opt("A", "They all returned within weeks"),
      opt("B", "They were relocated to Sydney permanently"),
      opt("C", "Many never returned, too traumatised by the memory"),
      opt("D", "They were sent to New Zealand"),
      ans("C"),
      gap(),

      // Q20
      q(20, 'The headline from The Sun News-Pictorial on 26 December 1974 was \u201cDarwin Wiped Out.\u201d What did the toll listed on the front page report?'),
      opt("A", "Dead 66, Homeless 41,000"),
      opt("B", "Dead 49, Homeless 30,000"),
      opt("C", "Dead 100, Homeless 50,000"),
      opt("D", "Dead 30, Homeless 20,000"),
      ans("B"),
      gap(),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = __dirname + "/Cyclone_Tracy_Comprehension_Assessment.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Created: " + outPath);
});

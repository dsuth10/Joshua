const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');

const questions = [
  // Factual
  {
    q: "1. In what year did Cyclone Mahina strike?",
    opts: ["A. 1895", "B. 1899", "C. 1901", "D. 1914"],
    ans: "ANS: B"
  },
  {
    q: "2. Where did Cyclone Mahina make landfall?",
    opts: ["A. Brisbane", "B. The Pilbara", "C. Bathurst Bay", "D. Sydney"],
    ans: "ANS: C"
  },
  {
    q: "3. How many lives were officially confirmed lost in the disaster?",
    opts: ["A. 100", "B. 250", "C. 307+", "D. 400"],
    ans: "ANS: C"
  },
  {
    q: "4. What was the estimated intensity of Cyclone Mahina?",
    opts: ["A. Category 2", "B. Category 3", "C. Category 4", "D. Category 5"],
    ans: "ANS: D"
  },
  {
    q: "5. What was the estimated central pressure of the cyclone?",
    opts: ["A. 914 hPa", "B. 950 hPa", "C. 980 hPa", "D. 1010 hPa"],
    ans: "ANS: A"
  },
  {
    q: "6. How high was the storm surge recorded during Cyclone Mahina?",
    opts: ["A. 5 metres", "B. 8 metres", "C. 10 metres", "D. 13 metres"],
    ans: "ANS: D"
  },
  {
    q: "7. Which animals were found stranded in trees several kilometres inland?",
    opts: ["A. Sharks", "B. Dolphins", "C. Whales", "D. Turtles"],
    ans: "ANS: B"
  },
  {
    q: "8. How high above sea level were fish found after the storm surge?",
    opts: ["A. 5 metres", "B. 10 metres", "C. 15 metres", "D. 20 metres"],
    ans: "ANS: D"
  },
  {
    q: "9. What valuable commodity was the fleet at Bathurst Bay gathering?",
    opts: ["A. Gold", "B. Coal", "C. Pearl shell", "D. Timber"],
    ans: "ANS: C"
  },
  {
    q: "10. Approximately how many vessels were anchored at Bathurst Bay when the cyclone struck?",
    opts: ["A. Over 20", "B. Over 50", "C. Over 100", "D. Over 200"],
    ans: "ANS: C"
  },
  {
    q: "11. In which Australian colony/state did the disaster occur?",
    opts: ["A. New South Wales", "B. Western Australia", "C. Northern Territory", "D. Queensland"],
    ans: "ANS: D"
  },
  {
    q: "12. In what month did Cyclone Mahina make landfall?",
    opts: ["A. January", "B. February", "C. March", "D. April"],
    ans: "ANS: C"
  },
  {
    q: "13. In what year was the Commonwealth of Australia proclaimed, shortly after this disaster?",
    opts: ["A. 1899", "B. 1901", "C. 1905", "D. 1910"],
    ans: "ANS: B"
  },
  {
    q: "14. Which newspaper ran the headline \"Pearl Fleet Destroyed — Industry in Crisis\"?",
    opts: ["A. The Queenslander", "B. The Brisbane Courier", "C. The Sydney Morning Herald", "D. The Daily Telegraph"],
    ans: "ANS: B"
  },
  {
    q: "15. Which newspaper published an article titled \"The Wave That Moved the Sea\"?",
    opts: ["A. The Queenslander", "B. The Brisbane Courier", "C. The Sydney Morning Herald", "D. The Australian"],
    ans: "ANS: C"
  },
  {
    q: "16. In what year was formal acknowledgement finally made of the Aboriginal and multicultural communities who lost members?",
    opts: ["A. 1901", "B. 1950", "C. 1999", "D. 2006"],
    ans: "ANS: D"
  },
  {
    q: "17. What term refers to characteristics of a person or group that affect their capacity to cope with a disaster?",
    opts: ["A. Economic disadvantage", "B. Social vulnerability", "C. Historical injustice", "D. Natural exposure"],
    ans: "ANS: B"
  },
  {
    q: "18. Which specific group of Japanese men are mentioned as part of the pearling workforce?",
    opts: ["A. Men from Tokyo", "B. Men from Kyoto", "C. Men from Okinawa", "D. Men from Osaka"],
    ans: "ANS: C"
  },
  {
    q: "19. Which newspaper ran the headline \"Catastrophe at Cape York — 300 Perish in Fearful Storm\"?",
    opts: ["A. The Brisbane Courier", "B. The Queenslander", "C. The Sydney Morning Herald", "D. The Age"],
    ans: "ANS: B"
  },
  {
    q: "20. The article mentions that modern disaster preparedness explicitly considers social vulnerability under which strategy?",
    opts: ["A. The National Strategy for Disaster Resilience (NSDR)", "B. The Commonwealth Cyclone Act", "C. The Queensland Pearl Divers Protection Act", "D. The Bureau of Meteorology Action Plan"],
    ans: "ANS: A"
  },
  // Inferential
  {
    q: "21. Based on the text, what can be inferred about the reason the pearling masters survived at a higher rate than the divers?",
    opts: [
      "A. They were naturally stronger swimmers.",
      "B. They had the power to make safety choices and stay ashore.",
      "C. They had access to radio broadcasts.",
      "D. They were warned by Indigenous Australians."
    ],
    ans: "ANS: B"
  },
  {
    q: "22. What does the fact that many of the dead \"remain unknown\" imply about colonial record-keeping?",
    opts: [
      "A. The records were destroyed in the storm.",
      "B. The workers requested their names be kept secret.",
      "C. Record-keeping prioritized property and economic loss over the lives of non-European workers.",
      "D. There was no paper available to write on."
    ],
    ans: "ANS: C"
  },
  {
    q: "23. Why does the author mention that the Commonwealth of Australia \"did not yet exist\"?",
    opts: [
      "A. To explain why no one cared about the disaster.",
      "B. To emphasize that modern national infrastructure like weather tracking and warnings had not yet been established.",
      "C. To suggest that the pearling industry was illegal.",
      "D. To show that Queensland was part of another country."
    ],
    ans: "ANS: B"
  },
  {
    q: "24. What does the detail about dolphins being found in trees suggest about the storm surge?",
    opts: [
      "A. That its power, height, and inland reach were beyond normal comprehension or prior experience.",
      "B. That the dolphins were trying to escape predators.",
      "C. That the trees were growing in the ocean.",
      "D. That the storm surge was actually quite small."
    ],
    ans: "ANS: A"
  },
  {
    q: "25. By stating that the pearling industry \"resumed the following year\" without changes to conditions, what is the author implying?",
    opts: [
      "A. That the storm had actually improved the pearling grounds.",
      "B. That the workers were eager to return to the sea.",
      "C. That economic profit was prioritized over worker safety, even after a massive tragedy.",
      "D. That new safety rules made the industry much safer."
    ],
    ans: "ANS: C"
  }
];

async function generateQuiz() {
  const children = [
    new Paragraph({
      children: [new TextRun({ text: "Cyclone Mahina: Comprehension Quiz", bold: true, size: 32 })],
      spacing: { after: 400 }
    })
  ];

  questions.forEach(q => {
    children.push(new Paragraph({ children: [new TextRun({ text: q.q, size: 24 })] }));
    q.opts.forEach(opt => {
      children.push(new Paragraph({ children: [new TextRun({ text: opt, size: 24 })] }));
    });
    const ansText = q.ans.replace('ANS:', 'ANSWER:');
    children.push(new Paragraph({ children: [new TextRun({ text: ansText, size: 24 })], spacing: { after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: "POINT: 1", size: 24 })], spacing: { after: 400 } }));
  });

  const doc = new Document({
    sections: [{
      children: children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English_Unit_2\\Lesson_Plans\\Lesson_07_Assessment_Mahina.docx', buffer);
  console.log('✅ Quiz generated successfully.');
}

generateQuiz().catch(console.error);

const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;

const TITLE = 'When the River Rose: The 2011 Brisbane Floods';

const RED_PARAS = [
  'In January 2011, major flooding hit south-east Queensland. It was one of Australia\'s worst natural disasters. Homes, businesses, and roads were damaged across the region.',
  'The floods had been building for months. A La Niña weather pattern had brought heavy rain to Queensland throughout late 2010. By January 2011, the soil was completely saturated. When more rain fell, it ran straight into rivers and creeks instead of soaking into the ground.',
  'Wivenhoe Dam had been built after the 1974 Brisbane floods to help reduce flood risk. But during the 2011 event, the dam filled to capacity. Engineers had to release large volumes of water to protect the dam. These releases raised levels further downstream in the Brisbane River.',
  'The river peaked at 4.46 metres at the City Gauge. About 26,600 homes and 5,000 businesses were inundated. Riverside suburbs like Rocklea and Oxley were among the hardest hit. Water stayed in some streets for several days before receding.',
  'Thirty-three people died across Queensland during the floods. Thousands more were forced to leave their homes. Once the water fell, a massive clean-up began. Tens of thousands of volunteers joined what became known as the "Mud Army." They helped affected residents remove debris and start rebuilding.',
  'After the 2011 floods, a government inquiry examined the event. Improvements were made to flood mapping, dam operations, and emergency planning. These changes aimed to better protect communities from future flood events.',
];

const BLUE_PARAS = [
  'In January 2011, the Brisbane River flooded and caused massive damage across south-east Queensland. Thousands of homes, businesses, and roads were affected. It became one of the most damaging floods in Queensland\'s recorded history.',
  'The floods had been building for several months before they hit. A weather pattern called La Niña had been bringing heavy rainfall to Queensland throughout late 2010. By the time more rain fell in early January 2011, the ground was completely saturated and could absorb no more water. All that rainfall quickly became runoff, pouring into rivers and creeks.',
  'Wivenhoe Dam had been built after the 1974 Brisbane floods to help protect the city from future flooding. However, in January 2011, the dam filled up extremely quickly. Engineers were forced to release large amounts of water to keep the structure safe. These controlled releases caused the Brisbane River to rise even higher downstream.',
  'At its peak, the Brisbane River reached 4.46 metres at the City Gauge. This was enough to inundate approximately 26,600 homes and 5,000 businesses. Low-lying riverside suburbs including Rocklea, Oxley, and Chelmer were among the worst affected, with floodwater remaining in streets for several days.',
  'Thirty-three people died across Queensland during the floods. Thousands of families were displaced from their homes. When the water eventually receded, an enormous clean-up effort began. Tens of thousands of volunteers became known as the "Mud Army," working together to help affected residents remove mud and debris.',
  'After the event, the Queensland Government launched an inquiry into the disaster. New improvements were made to flood maps, emergency planning, and the management of Wivenhoe Dam.',
];

const GREEN_PARAS = [
  'In January 2011, the Brisbane River flooded and caused a lot of damage. Many homes and businesses were underwater. It was one of the worst floods in Queensland\'s history.',
  'There had been a lot of rain for many months before the floods. The ground was already very wet. When more rain fell in January, the water had nowhere to go. It ran straight into the rivers and creeks.',
  'Brisbane had a big dam called Wivenhoe Dam. The dam was built to help stop floods. But in 2011, the dam got very full. Workers had to let water out of the dam to keep it safe. This made the river rise even more.',
  'The river reached 4.46 metres at the City Gauge. About 26,600 homes and 5,000 businesses were flooded. Many people had to leave their homes.',
  'Thirty-three people died in the floods across Queensland. Many more people lost everything they owned. After the water went away, thousands of volunteers came to help. They were called the "Mud Army." They helped people clean up their homes and streets.',
  'After the floods, the government made new plans to keep people safer in the future.',
];

function makeDoc(paras) {
  return new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 24 } } },
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        new Paragraph({
          spacing: { before: 0, after: 240 },
          children: [new TextRun({ text: 'Week 3 Homework — Informational Text', bold: true, size: 32, font: 'Arial' })],
        }),
        new Paragraph({
          spacing: { before: 0, after: 320 },
          children: [new TextRun({ text: TITLE, bold: true, size: 24, font: 'Arial' })],
        }),
        ...paras.map(p => new Paragraph({
          spacing: { before: 0, after: 160, line: 276, lineRule: 'auto' },
          children: [new TextRun({ text: p, size: 24, font: 'Arial' })],
        })),
      ],
    }],
  });
}

async function main() {
  const files = [
    { name: 'Week_03_Reading_Red.docx', paras: RED_PARAS },
    { name: 'Week_03_Reading_Blue.docx', paras: BLUE_PARAS },
    { name: 'Week_03_Reading_Green.docx', paras: GREEN_PARAS },
  ];
  for (const f of files) {
    const buf = await Packer.toBuffer(makeDoc(f.paras));
    fs.writeFileSync(path.join(OUT, f.name), buf);
    console.log('Created:', f.name);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

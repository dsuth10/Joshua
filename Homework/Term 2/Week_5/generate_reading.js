const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname);

function makeDoc(title, paragraphs) {
  return new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 24 } } },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
          run: { size: 32, bold: true, color: '1a1a1a', font: 'Arial' },
          paragraph: { spacing: { before: 0, after: 240 }, outlineLevel: 0 }
        }
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: title, bold: true, size: 32, font: 'Arial' })]
        }),
        ...paragraphs.map(text =>
          new Paragraph({
            spacing: { before: 0, after: 160 },
            children: [new TextRun({ text, size: 24, font: 'Arial' })]
          })
        )
      ]
    }]
  });
}

const redTitle = 'Week 5 Homework — Informational Text';
const redParagraphs = [
  'Australia is one of the most fire-prone countries on Earth. Large areas of dry native bush, long droughts, and extreme heat create the right conditions for dangerous fires. Bushfires are a natural part of many Australian environments. However, they have become more intense and more frequent in recent decades.',
  'For a fire to burn, three things are needed: heat, fuel, and oxygen. Together, these are called the "fire triangle." Fuel includes dry grass, leaf litter, fallen bark, and shrubs. When temperatures are high, humidity is low, and strong winds are blowing, a fire can spread very quickly. Hot, dry winds from Australia\'s inland regions are especially dangerous during summer.',
  'The amount of fuel in an area is called fuel load. It refers to the dry plant material that has built up over time. Fire agencies reduce this risk through hazard reduction burns. These are planned, controlled fires lit carefully under safe conditions. By removing dry material before the fire season, future fires are less likely to become extreme.',
  'The 2019–2020 Black Summer was one of Australia\'s worst fire seasons. Around 18.6 million hectares burned across southeastern Australia. This is an area larger than the country of Syria. The fires caused 33 direct deaths and contributed to the deaths of about one billion animals. Thick smoke covered major cities for weeks, making the air quality extremely poor and causing serious breathing problems for many people.',
  'Many Australian plants have special features that help them survive fire. The banksia has cones that stay tightly sealed until heat causes them to open. Seeds then fall onto nutrient-rich, ash-rich soil, where they can germinate and grow. The grass tree also bounces back quickly after a burn, because its thick leaf base protects its growing point from heat.',
  'Recovery from a major bushfire takes many years. Homes need to be rebuilt and wildlife populations need time to recover. The emotional impact on affected communities can also last a long time. Being prepared for bushfires is an important skill for all Australians.'
];

const blueTitle = 'Week 5 Homework — Informational Text';
const blueParagraphs = [
  'Australia has more bushfires than almost any other country. Much of the land is covered in dry native bush. The climate is hot, and droughts are common. While fires are a natural part of the environment, they can cause great damage.',
  'A fire needs three things to burn: heat, fuel, and oxygen. This is called the "fire triangle." Fuel includes dry grass, leaves, and bark. When it is hot and windy, a fire can spread very quickly. Hot winds from the dry inland are very dangerous in summer.',
  'Fire crews work to stop large fires by doing hazard reduction burns. These are small, planned fires lit when the weather is safe. By burning dry plants before the fire season, there is less fuel left. This means later fires are less likely to get out of control.',
  'The 2019–2020 Black Summer fires were some of the worst ever. About 18.6 million hectares burned across Australia. The fires killed 33 people and around one billion animals. Thick smoke covered cities like Sydney and Canberra for many weeks. Air quality became very poor and many people had breathing problems.',
  'Some Australian plants can survive fire. The banksia has cones that open only after being exposed to heat. After a fire, the seeds drop onto ash-covered ground. This soil is rich in nutrients and good for new plants. Many animals shelter underground or in water to stay safe.',
  'After a bushfire, recovery takes a long time. Homes need to be rebuilt and animals need care. Native plants grow back slowly over many years. All Australians should know what to do in a bushfire.'
];

const greenTitle = 'Week 5 Homework — Informational Text';
const greenParagraphs = [
  'Every year, Australia has many bushfires. A bushfire burns dry grass, leaves, and trees. Bushfires can be very dangerous to people and animals.',
  'A fire needs three things to start. It needs heat, fuel, and air. Dry leaves and grass are fuel. When the weather is very hot, fires can start fast. Strong winds help fires spread even more quickly.',
  'Some fires are started by lightning. Some are started by accident. Firefighters work hard to keep people safe.',
  'Fire crews sometimes do hazard reduction burns. They light a small fire on purpose to burn away dry grass and leaves. This means there is less for a big fire to burn later on. It helps keep everyone safer.',
  'In 2019 and 2020, there were very big fires in Australia. Many homes were destroyed. Lots of animals lost their homes too. People from all over helped each other.',
  'After a bushfire, plants start to grow back. Some plants, like the banksia, need fire to open their seed pods. After a fire, the seeds fall onto the ground and start to grow. Over time, the bush comes back to life.',
  'Knowing what to do in a bushfire is very important. Firefighters and emergency workers are always ready to help.'
];

async function main() {
  const docs = [
    { name: 'Week_5_Reading_Red.docx', title: redTitle, paras: redParagraphs },
    { name: 'Week_5_Reading_Blue.docx', title: blueTitle, paras: blueParagraphs },
    { name: 'Week_5_Reading_Green.docx', title: greenTitle, paras: greenParagraphs }
  ];

  for (const d of docs) {
    const doc = makeDoc(d.title, d.paras);
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(OUT, d.name), buf);
    console.log(`Created: ${d.name}`);
  }
}

main().catch(console.error);

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

const redTitle = 'Week 6 Homework — Informational Text';
const redParagraphs = [
  "Our planet feels solid, but its outer crust is actually a giant puzzle of moving tectonic plates. These colossal slabs of rock are driven by deep heat currents within the Earth's mantle. They constantly grind past, collide into, or pull away from one another. This movement is usually slow and hard to see. However, the massive forces build up immense stress along plate boundaries and fault lines over time. When the friction holding the rocks together is finally broken, a sudden release of energy occurs. This energy travels outward as seismic waves that shake the ground. We experience this sudden shaking as an earthquake.",
  "Geological faults are fractures in the Earth's crust where movement occurs. They are grouped into three primary types based on the forces that shape them. Normal faults form under extensional stress, where the crust is being pulled apart. This causes one block of rock to slide downward relative to the other. Reverse or thrust faults are created when compressional forces push the crust together. This action forces one block of rock upward and over the other. The third type, strike-slip faults, develop due to horizontal shearing forces. Here, plates slide laterally past one another. The famous San Andreas Fault and the Cadell Fault in Australia are strike-slip faults.",
  "Earthquakes themselves are classified into three categories based on how they start. Tectonic earthquakes are the most common and powerful type. They are caused by sudden plate movements along fault lines. Volcanic earthquakes occur near active volcanoes, triggered by the movement of liquid magma beneath the surface. Finally, collapse earthquakes are minor tremors. They result from the sudden cave-in of underground caverns or old mines.",
  "Australia sits in the middle of a tectonic plate, so we experience fewer massive tremors than boundary zones like New Zealand. However, our continent remains seismically active. Historically, the 1968 Meckering earthquake in Western Australia ripped the ground with a massive fault line. The tragic 1989 Newcastle earthquake in New South Wales showed that even moderate intraplate events can cause serious damage. Today, Geoscience Australia in Canberra monitors these tremors constantly. They record primary P-waves and secondary S-waves to keep our communities safe."
];

const blueTitle = 'Week 6 Homework — Informational Text';
const blueParagraphs = [
  "Our Earth feels solid under our feet, but its outer crust is made of huge moving pieces. These pieces are called tectonic plates. Deep inside the Earth, heat causes these colossal slabs of rock to move slowly. They constantly grind past, push into, or pull away from each other. Usually, this movement is too slow for us to feel. However, this movement builds up a lot of stress along the plate edges. When the rocks cannot hold the stress any longer, they suddenly break. This release of energy travels through the ground in waves. We feel this sudden shaking as an earthquake.",
  "Scientists study fault lines, which are cracks in the crust where the ground moves. There are three main types of faults. Normal faults happen when the crust is pulled apart, making one block of rock slide down. Reverse faults happen when the crust is pushed together, forcing one block of rock to rise up over the other. The third type is called a strike-slip fault. Here, the plates slide sideways past each other. The famous San Andreas Fault and Australia’s Cadell Fault are strike-slip faults.",
  "Earthquakes are grouped into three types based on how they start. Tectonic earthquakes are the most common. They happen along fault lines when plates move. Volcanic earthquakes happen near active volcanoes when liquid magma moves under the ground. Finally, collapse earthquakes are small shakes. They are caused when underground caves or old mines cave in.",
  "Australia sits in the middle of a plate, so we do not have as many large earthquakes as places like New Zealand. However, our land still has active areas. In 1968, a strong earthquake in Meckering, Western Australia, ripped the ground open. In 1989, a moderate earthquake in Newcastle, New South Wales, caused serious damage. Today, Geoscience Australia in Canberra monitors all tremors. They record these seismic waves to keep us safe."
];

const greenTitle = 'Week 6 Homework — Informational Text';
const greenParagraphs = [
  "Our Earth feels solid, but the outer crust is made of giant moving parts. These parts are called tectonic plates. Deep inside the Earth, heat makes these big rocks move very slowly. They grind past, push into, or pull away from each other. Usually, this movement is too slow for us to feel. However, it builds up stress along the edges. When the rocks suddenly break, they release a lot of energy. This energy travels through the ground in waves. We feel this shaking as an earthquake.",
  "Scientists study cracks in the crust called fault lines. There are three basic faults. Normal faults happen when the land is pulled apart. One rock slides down. Reverse faults happen when the land is pushed together. One rock rises up. Strike-slip faults happen when plates slide sideways past each other. The San Andreas Fault and Australia’s Cadell Fault are strike-slip faults.",
  "Earthquakes have three main types. Tectonic earthquakes are the most common. They happen when plates move. Volcanic earthquakes happen near volcanoes when liquid magma moves. Collapse earthquakes are small. They happen when caves cave in.",
  "Australia has fewer big earthquakes than New Zealand. But we still have active areas. In 1968, a strong earthquake shook Meckering, Western Australia. In 1989, another shook Newcastle, New South Wales. Today, Geoscience Australia in Canberra monitors all tremors to keep us safe."
];

async function main() {
  const docs = [
    { name: 'Week_6_Reading_Red.docx', title: redTitle, paras: redParagraphs },
    { name: 'Week_6_Reading_Blue.docx', title: blueTitle, paras: blueParagraphs },
    { name: 'Week_6_Reading_Green.docx', title: greenTitle, paras: greenParagraphs }
  ];

  for (const d of docs) {
    const doc = makeDoc(d.title, d.paras);
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(OUT, d.name), buf);
    console.log(`Created: ${d.name}`);
  }
}

main().catch(console.error);

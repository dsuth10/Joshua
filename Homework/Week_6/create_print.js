const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, TabStopType, WidthType, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorder = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const PAGE_W = 11906, MARGIN = 720, USABLE = PAGE_W - MARGIN * 2;
const COL = Math.floor(USABLE / 2);
const TAB = Math.floor(COL / 2);

function qPara(stem, opts, showAns) {
  const paragraphs = [];
  paragraphs.push(new Paragraph({
    spacing: { before: 80, after: 20 },
    children: [new TextRun({ text: stem, bold: true, size: 20, font: 'Arial' })]
  }));
  paragraphs.push(new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: `A. ${opts[0]}`, size: 20, font: 'Arial' }),
      new TextRun({ text: `\tB. ${opts[1]}`, size: 20, font: 'Arial' })]
  }));
  paragraphs.push(new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: TAB }],
    spacing: { before: 0, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 } },
    children: [new TextRun({ text: `C. ${opts[2]}`, size: 20, font: 'Arial' }),
      new TextRun({ text: `\tD. ${opts[3]}`, size: 20, font: 'Arial' })]
  }));
  return paragraphs;
}

function readingParas(title, body) {
  return [
    new Paragraph({ spacing: { before: 0, after: 160 }, children: [new TextRun({ text: title, bold: true, size: 28, font: 'Arial' })] }),
    ...body.map(t => new Paragraph({ spacing: { before: 0, after: 140 }, children: [new TextRun({ text: t, size: 24, font: 'Arial' })] }))
  ];
}

function sectionHead(text) {
  return new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text, bold: true, size: 22, font: 'Arial', color: '333333' })] });
}

function buildPrint(title, body, readQs, mathQs) {
  const children = [
    ...readingParas(title, body),
    sectionHead('Reading Questions'),
  ];
  readQs.forEach((q, i) => children.push(...qPara(`${i+1}. ${q.q}`, q.opts.map(o => o.slice(3)), false)));

  const left = mathQs.slice(0, 8);
  const right = mathQs.slice(8);
  function col(qs, start) {
    const ps = [new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'Maths Questions', bold: true, size: 22, font: 'Arial', color: '333333' })] })];
    qs.forEach((q, i) => ps.push(...qPara(`${start+i}. ${q.q}`, q.opts.map(o => o.slice(3)), false)));
    return ps;
  }

  children.push(new Table({
    columnWidths: [COL, COL],
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorder, width: { size: COL, type: WidthType.DXA }, shading: { fill: 'FFFFFF', type: ShadingType.CLEAR }, children: col(left, 16) }),
      new TableCell({ borders: noBorder, width: { size: COL, type: WidthType.DXA }, shading: { fill: 'FFFFFF', type: ShadingType.CLEAR }, children: col(right, 24) })
    ]})]
  }));

  return new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{ properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, children }]
  });
}

const redBody = [
  "Our planet feels solid, but its outer crust is actually a giant puzzle of moving tectonic plates. These colossal slabs of rock are driven by deep heat currents within the Earth's mantle. They constantly grind past, collide into, or pull away from one another. This movement is usually slow and hard to see. However, the massive forces build up immense stress along plate boundaries and fault lines over time. When the friction holding the rocks together is finally broken, a sudden release of energy occurs. This energy travels outward as seismic waves that shake the ground. We experience this sudden shaking as an earthquake.",
  "Geological faults are fractures in the Earth's crust where movement occurs. They are grouped into three primary types based on the forces that shape them. Normal faults form under extensional stress, where the crust is being pulled apart. This causes one block of rock to slide downward relative to the other. Reverse or thrust faults are created when compressional forces push the crust together. This action forces one block of rock upward and over the other. The third type, strike-slip faults, develop due to horizontal shearing forces. Here, plates slide laterally past one another. The famous San Andreas Fault and the Cadell Fault in Australia are strike-slip faults.",
  "Earthquakes themselves are classified into three categories based on how they start. Tectonic earthquakes are the most common and powerful type. They are caused by sudden plate movements along fault lines. Volcanic earthquakes occur near active volcanoes, triggered by the movement of liquid magma beneath the surface. Finally, collapse earthquakes are minor tremors. They result from the sudden cave-in of underground caverns or old mines.",
  "Australia sits in the middle of a tectonic plate, so we experience fewer massive tremors than boundary zones like New Zealand. However, our continent remains seismically active. Historically, the 1968 Meckering earthquake in Western Australia ripped the ground with a massive fault line. The tragic 1989 Newcastle earthquake in New South Wales showed that even moderate intraplate events can cause serious damage. Today, Geoscience Australia in Canberra monitors these tremors constantly. They record primary P-waves and secondary S-waves to keep our communities safe."
];

const blueBody = [
  "Our Earth feels solid under our feet, but its outer crust is made of huge moving pieces. These pieces are called tectonic plates. Deep inside the Earth, heat causes these colossal slabs of rock to move slowly. They constantly grind past, push into, or pull away from each other. Usually, this movement is too slow for us to feel. However, this movement builds up a lot of stress along the plate edges. When the rocks cannot hold the stress any longer, they suddenly break. This release of energy travels through the ground in waves. We feel this sudden shaking as an earthquake.",
  "Scientists study fault lines, which are cracks in the crust where the ground moves. There are three main types of faults. Normal faults happen when the crust is pulled apart, making one block of rock slide down. Reverse faults happen when the crust is pushed together, forcing one block of rock to rise up over the other. The third type is called a strike-slip fault. Here, the plates slide sideways past each other. The famous San Andreas Fault and Australia’s Cadell Fault are strike-slip faults.",
  "Earthquakes are grouped into three types based on how they start. Tectonic earthquakes are the most common. They happen along fault lines when plates move. Volcanic earthquakes happen near active volcanoes when liquid magma moves under the ground. Finally, collapse earthquakes are small shakes. They are caused when underground caves or old mines cave in.",
  "Australia sits in the middle of a plate, so we do not have as many large earthquakes as places like New Zealand. However, our land still has active areas. In 1968, a strong earthquake in Meckering, Western Australia, ripped the ground open. In 1989, a moderate earthquake in Newcastle, New South Wales, caused serious damage. Today, Geoscience Australia in Canberra monitors all tremors. They record these seismic waves to keep us safe."
];

const greenBody = [
  "Our Earth feels solid, but the outer crust is made of giant moving parts. These parts are called tectonic plates. Deep inside the Earth, heat makes these big rocks move very slowly. They grind past, push into, or pull away from each other. Usually, this movement is too slow for us to feel. However, it builds up stress along the edges. When the rocks suddenly break, they release a lot of energy. This energy travels through the ground in waves. We feel this shaking as an earthquake.",
  "Scientists study cracks in the crust called fault lines. There are three basic faults. Normal faults happen when the land is pulled apart. One rock slides down. Reverse faults happen when the land is pushed together. One rock rises up. Strike-slip faults happen when plates slide sideways past each other. The San Andreas Fault and Australia’s Cadell Fault are strike-slip faults.",
  "Earthquakes have three main types. Tectonic earthquakes are the most common. They happen when plates move. Volcanic earthquakes happen near volcanoes when liquid magma moves. Collapse earthquakes are small. They happen when caves cave in.",
  "Australia has fewer big earthquakes than New Zealand. But we still have active areas. In 1968, a strong earthquake shook Meckering, Western Australia. In 1989, another shook Newcastle, New South Wales. Today, Geoscience Australia in Canberra monitors all tremors to keep us safe."
];

const redReadQs = [
  { q: "What does the text imply is the main driver of the movement of tectonic plates?", opts: ["A. Tidal forces from the oceans", "B. The Earth's rotation", "C. Heat currents within the mantle", "D. Solar radiation"] },
  { q: "Based on the text, what prevents tectonic plates from moving smoothly past each other?", opts: ["A. Heat currents in the mantle", "B. Friction between the colossal slabs of rock", "C. Ocean tides pressing against the crust", "D. Volcanic eruptions lubricating the fault boundaries"] },
  { q: "Which of the following describes the formation of a normal fault?", opts: ["A. Plates sliding sideways past each other", "B. Crust being pushed together, forcing one block upward", "C. Molten rock pushing upward under the crust", "D. Crust being pulled apart, causing one block to slide downward"] },
  { q: "How do reverse faults differ from strike-slip faults based on the text?", opts: ["A. Reverse faults are caused by compressional forces, while strike-slip faults involve lateral shearing.", "B. Reverse faults slide horizontally, while strike-slip faults push rock blocks upward.", "C. Reverse faults pull the crust apart, while strike-slip faults push it together.", "D. Reverse faults are volcanic in origin, while strike-slip faults are collapse-based."] },
  { q: "The Cadell Fault is mentioned in the text as an example of what type of fault?", opts: ["A. Normal fault", "B. Reverse fault", "C. Strike-slip fault", "D. Thrust fault"] },
  { q: "What does the text suggest is the primary cause of volcanic earthquakes?", opts: ["A. Sudden plate movements along fault lines", "B. The movement of magma beneath the surface", "C. Cave-ins of underground caverns and mines", "D. Extensional stress pulling the crust apart"] },
  { q: "What can be inferred about collapse earthquakes from the text's description?", opts: ["A. They are powerful tectonic events that rupture the Earth's surface.", "B. They only occur along convergent boundaries.", "C. They are minor tremors with very localized causes, like cave-ins.", "D. They are monitored exclusively by international space agencies."] },
  { q: "Why does Australia experience fewer massive earthquakes than New Zealand?", opts: ["A. Australia is located in the middle of a tectonic plate, whereas New Zealand is on a boundary.", "B. Australia has no active faults or crustal stress.", "C. Australia sits in a volcanic-free zone with no mantle heat.", "D. Australia has strict building codes that prevent ground shaking."] },
  { q: "What was a significant physical impact of the 1968 Meckering earthquake mentioned in the text?", opts: ["A. The collapse of underground coal mines in New South Wales", "B. The ripping of the ground with a massive fault line", "C. A volcanic eruption in the center of the continent", "D. A major tsunami warning along the Canberra coast"] },
  { q: "Which historical event in Australia showed that even moderate intraplate events can cause serious damage?", opts: ["A. The 1968 Meckering earthquake", "B. The 1989 Newcastle earthquake", "C. The San Andreas Fault slippage", "D. The Cadell Fault movement"] },
  { q: "What role does Geoscience Australia play according to the text?", opts: ["A. They prevent plate movements using engineering tools.", "B. They monitor tremors and record P-waves and S-waves to keep communities safe.", "C. They map underground caves and old mines to prevent collapse.", "D. They predict volcanic eruptions across Australia."] },
  { q: "What travels through the Earth's crust as a result of a sudden release of energy?", opts: ["A. High heat currents from the mantle", "B. Molten magma flows", "C. Seismic waves (P-waves and S-waves)", "D. Extensional fractures"] },
  { q: "Based on the text, which of the following is true about seismic waves?", opts: ["A. They are only created by volcanic eruptions.", "B. They consist of primary P-waves and secondary S-waves.", "C. They travel through the mantle but not the crust.", "D. They prevent friction from building up along plates."] },
  { q: "What causes the build-up of immense stress along plate boundaries?", opts: ["A. Extensional stress turning into volcanic activity", "B. Slow, massive forces of moving plates grinding, colliding, or pulling apart", "C. Cave-ins of underground caverns and coal mines", "D. The primary and secondary waves clashing"] },
  { q: "What must occur before a sudden release of earthquake energy can happen?", opts: ["A. Friction holding the rocks together must be broken", "B. Magma must reach the ocean floor", "C. The Earth's mantle must cool down completely", "D. P-waves must overtake S-waves"] }
];

const blueReadQs = [
  { q: "What causes tectonic plates to move slowly deep inside the Earth?", opts: ["A. Ocean tides", "B. Strong winds", "C. Heat", "D. Surface friction"] },
  { q: "When does an earthquake occur based on the text?", opts: ["A. When plates stop moving entirely", "B. When rocks suddenly break and release energy in waves", "C. When the Earth's mantle cools down", "D. When volcanoes erupt into the ocean"] },
  { q: "What are fault lines?", opts: ["A. Large mountains formed by plate boundaries", "B. Cracks in the crust where the ground moves", "C. Heat currents that rise up from the mantle", "D. Underground caves that have collapsed"] },
  { q: "How does a normal fault form?", opts: ["A. The crust is pushed together, forcing rock up", "B. The crust is pulled apart, sliding one block of rock down", "C. Tectonic plates slide sideways past each other", "D. Magma rises up and cools on the surface"] },
  { q: "Which fault in Australia is mentioned as a strike-slip fault?", opts: ["A. San Andreas Fault", "B. Meckering Fault", "C. Cadell Fault", "D. Newcastle Fault"] },
  { q: "What forces create a reverse fault?", opts: ["A. Forces that slide plates sideways", "B. Forces that pull the crust apart", "C. Forces that push the crust together", "D. Forces from volcanic activity"] },
  { q: "Tectonic earthquakes are caused by what?", opts: ["A. Cave-ins of underground mines", "B. Liquid magma moving near volcanoes", "C. Plate movements along fault lines", "D. Building-code violations in major cities"] },
  { q: "What triggers volcanic earthquakes?", opts: ["A. Caves collapsing", "B. Magma moving under the ground", "C. Plates pulling apart in the ocean", "D. Mining activities"] },
  { q: "What is a collapse earthquake caused by?", opts: ["A. Shearing forces sliding plates laterally", "B. Plate collisions at plate boundaries", "C. Underground caves or old mines caving in", "D. High temperatures in the Earth's mantle"] },
  { q: "Why does Australia have fewer large earthquakes than New Zealand?", opts: ["A. Australia sits in the middle of a plate, rather than on an edge", "B. Australia has no historical earthquakes", "C. Australia has no fault lines or cracks in the crust", "D. Australia has very cold underground temperatures"] },
  { q: "What did the 1968 Meckering earthquake physically do to the ground?", opts: ["A. It created a volcano", "B. It ripped the ground open", "C. It flooded the area", "D. It collapsed an old mine"] },
  { q: "Which city's earthquake is mentioned as causing serious damage in 1989?", opts: ["A. Canberra", "B. Meckering", "C. Newcastle", "D. Sydney"] },
  { q: "Where is Geoscience Australia located?", opts: ["A. Sydney", "B. Newcastle", "C. Canberra", "D. Meckering"] },
  { q: "What does Geoscience Australia do to keep us safe?", opts: ["A. They stop earthquakes from happening", "B. They monitor tremors and record seismic waves", "C. They rebuild damaged homes", "D. They prevent volcanic eruptions"] },
  { q: "What travels through the ground when energy is suddenly released?", opts: ["A. Tectonic friction", "B. Seismic waves", "C. Liquid magma", "D. Extensional stress"] }
];

const greenReadQs = [
  { q: "What are tectonic plates?", opts: ["A. Giant moving parts that make up the outer crust", "B. Large cracks in underground mines", "C. Hot currents deep inside volcanoes", "D. Hard rocks that do not move"] },
  { q: "What makes the plates move very slowly?", opts: ["A. Ocean waves", "B. Heat inside the Earth", "C. Cold winds", "D. Human activity"] },
  { q: "What do we feel shaking as an earthquake?", opts: ["A. Magma cooling down", "B. Energy travelling in waves when rocks break", "C. Cold air rising", "D. Plants growing on fault lines"] },
  { q: "What do cracks in the Earth's crust where the ground moves get called?", opts: ["A. Tectonic plates", "B. Fault lines", "C. Volcanoes", "D. Caverns"] },
  { q: "What happens in a normal fault?", opts: ["A. The land is pushed together and rock rises", "B. The land is pulled apart and rock slides down", "C. Tectonic plates slide sideways", "D. Old mines cave in"] },
  { q: "What happens in a reverse fault?", opts: ["A. Plates slide sideways", "B. One rock slides down", "C. The land is pushed together and one rock rises up", "D. Hot magma moves near volcanoes"] },
  { q: "Which fault in Australia is a strike-slip fault?", opts: ["A. San Andreas Fault", "B. Newcastle Fault", "C. Cadell Fault", "D. Meckering Fault"] },
  { q: "What is the most common type of earthquake?", opts: ["A. Volcanic earthquake", "B. Collapse earthquake", "C. Tectonic earthquake", "D. Mine earthquake"] },
  { q: "What triggers volcanic earthquakes?", opts: ["A. Liquid magma moving near volcanoes", "B. Old mines caving in", "C. Strong winds blowing on mountains", "D. Caves collapsing"] },
  { q: "When do collapse earthquakes happen?", opts: ["A. When tectonic plates slide sideways", "B. When caves cave in", "C. When volcanoes erupt", "D. When the Earth's crust is pulled apart"] },
  { q: "Which place is mentioned as having more big earthquakes than Australia?", opts: ["A. Canberra", "B. Newcastle", "C. New Zealand", "D. Meckering"] },
  { q: "Where in Western Australia did a strong earthquake shake the land in 1968?", opts: ["A. Newcastle", "B. Meckering", "C. Canberra", "D. Cadell"] },
  { q: "Which town in New South Wales was shaken by an earthquake in 1989?", opts: ["A. Newcastle", "B. Canberra", "C. Meckering", "D. Cadell"] },
  { q: "What organization in Canberra monitors all tremors?", opts: ["A. The Newcastle Centre", "B. The Meckering Station", "C. Geoscience Australia", "D. The Tectonic Board"] },
  { q: "Why does Geoscience Australia monitor tremors?", opts: ["A. To make plates move faster", "B. To keep us safe", "C. To dig underground caves", "D. To rebuild old buildings"] }
];

const mathsY5 = [
  { q: "A seismometer in Adelaide recorded a tremor at 0815 hours. How is this time written in 12-hour time notation?", opts: ["A. 8:15 p.m.", "B. 8:15 a.m.", "C. 08:15 a.m.", "D. 8:51 p.m."] },
  { q: "Geoscience Australia registered a reverse fault slip at 3:45 p.m. What is this time in 24-hour time notation?", opts: ["A. 0345", "B. 1345", "C. 1545", "D. 1745"] },
  { q: "An undersea tectonic earthquake occurred off the WA coast at 2210 hours. How is this time written in 12-hour time notation?", opts: ["A. 10:10 a.m.", "B. 10:10 p.m.", "C. 8:10 p.m.", "D. 12:10 a.m."] },
  { q: "At a remote monitoring station on the Cadell Fault, a sensor lost connection at 11:25 p.m. and reconnected at 02:40 a.m. the next morning. What was the total duration of the connection loss?", opts: ["A. 3 hours and 15 minutes", "B. 3 hours and 25 minutes", "C. 2 hours and 15 minutes", "D. 2 hours and 55 minutes"] },
  { q: "A primary P-wave from an earthquake in the Tasman Sea was logged at a Hobart station at 1435 hours. The slower secondary S-wave was registered at 1452 hours. What was the exact elapsed time between the arrival of the two waves?", opts: ["A. 15 minutes", "B. 17 minutes", "C. 22 minutes", "D. 27 minutes"] },
  { q: "A seismograph in Canberra recorded a volcanic tremor at 11:45 a.m. An aftershock was recorded 4 hours and 30 minutes later. What was the 24-hour time of the aftershock?", opts: ["A. 1515", "B. 1615", "C. 1645", "D. 1715"] },
  { q: "A rescue team was dispatched to a simulated collapse in an abandoned mine. They departed their base in Newcastle at 0835 hours and arrived at the site at 1415 hours. How long did the journey take?", opts: ["A. 5 hours and 20 minutes", "B. 5 hours and 40 minutes", "C. 6 hours and 20 minutes", "D. 6 hours and 40 minutes"] },
  { q: "A research station in Perth recorded a tremor at 0005 hours. What is this time in 12-hour time notation?", opts: ["A. 12:05 a.m.", "B. 12:05 p.m.", "C. 1:05 a.m.", "D. 1:05 p.m."] },
  { q: "A tsunami warning buoy in the Pacific Ocean detected a sea-floor displacement at 12:00 p.m. (noon). The warning sirens on the coast were activated at 1342 hours. How much time elapsed between the buoy detection and the sirens?", opts: ["A. 1 hour and 42 minutes", "B. 2 hours and 42 minutes", "C. 42 minutes", "D. 13 hours and 42 minutes"] },
  { q: "Seismologists at Geoscience Australia began an emergency analysis of a strike-slip rupture at 1850 hours. The analysis was completed at 0115 hours the next morning. Using the timeline jump method, calculate the total elapsed time of the analysis.", opts: ["A. 6 hours and 15 minutes", "B. 6 hours and 25 minutes", "C. 7 hours and 15 minutes", "D. 7 hours and 25 minutes"] },
  { q: "Due to a power outage, a seismometer in Meckering ran on backup batteries from 9:45 p.m. on Tuesday until 11:15 a.m. on Wednesday. For how long did the backup batteries operate?", opts: ["A. 13 hours and 30 minutes", "B. 13 hours and 45 minutes", "C. 14 hours and 30 minutes", "D. 14 hours and 45 minutes"] },
  { q: "A P-wave was logged in Darwin at 2355 hours. The S-wave arrived 1 hour and 15 minutes later. What was the 12-hour time of the S-wave arrival?", opts: ["A. 1:10 a.m.", "B. 1:10 p.m.", "C. 12:10 a.m.", "D. 12:10 p.m."] },
  { q: "A research vessel near the Kermadec Trench recorded a subduction earthquake at 1045 hours. They sent an emergency transmission to Canberra 3 hours and 25 minutes later. What 24-hour time was the transmission sent?", opts: ["A. 1310", "B. 1410", "C. 1420", "D. 1430"] },
  { q: "Seismic data from Adelaide was compiled at 0735 hours. The data was uploaded to Geoscience Australia at 4:15 p.m. on the same day. What is the total elapsed time between compiling and uploading?", opts: ["A. 8 hours and 40 minutes", "B. 9 hours and 40 minutes", "C. 8 hours and 20 minutes", "D. 9 hours and 20 minutes"] },
  { q: "A seismograph calibration test started at 0515 hours and finished at 1330 hours. How long did the calibration process take?", opts: ["A. 7 hours and 45 minutes", "B. 8 hours and 15 minutes", "C. 8 hours and 30 minutes", "D. 9 hours and 15 minutes"] }
];

const mathsY3 = [
  { q: "A small earthquake was recorded at 8:00 a.m. What is this time in 24-hour time?", opts: ["A. 0800", "B. 1800", "C. 8000", "D. 0008"] },
  { q: "A volcano station logged a rumble at 1500 hours. What is this time in 12-hour time?", opts: ["A. 3:00 a.m.", "B. 3:00 p.m.", "C. 5:00 a.m.", "D. 5:00 p.m."] },
  { q: "An aftershock was recorded at 4:30 p.m. What is this time in 24-hour time?", opts: ["A. 0430", "B. 1430", "C. 1630", "D. 1830"] },
  { q: "An earthquake drill in a school started at 10:00 a.m. and finished at 10:45 a.m. How long did the drill take?", opts: ["A. 15 minutes", "B. 30 minutes", "C. 45 minutes", "D. 60 minutes"] },
  { q: "A seismometer recorded a tremor at 0900 hours. A second tremor was recorded at 1130 hours. How much time passed between the two tremors?", opts: ["A. 1 hour and 30 minutes", "B. 2 hours", "C. 2 hours and 30 minutes", "D. 3 hours"] },
  { q: "A tsunami alarm was tested at 1:15 p.m. and stopped at 1:35 p.m. How long was the test?", opts: ["A. 10 minutes", "B. 15 minutes", "C. 20 minutes", "D. 25 minutes"] },
  { q: "A seismograph recorded a collapse tremor at 2:00 a.m. How is this time written in 24-hour time?", opts: ["A. 0200", "B. 1200", "C. 1400", "D. 2000"] },
  { q: "A scientist started reading seismic logs at 11:00 a.m. She finished at 11:55 a.m. How long did she spend reading the logs?", opts: ["A. 45 minutes", "B. 50 minutes", "C. 55 minutes", "D. 60 minutes"] },
  { q: "A seismometer recorded a volcanic earthquake at 2100 hours. How is this time written in 12-hour time?", opts: ["A. 9:00 a.m.", "B. 9:00 p.m.", "C. 11:00 a.m.", "D. 11:00 p.m."] },
  { q: "A tsunami warning was active from 3:10 p.m. to 3:50 p.m. How long did the warning last?", opts: ["A. 30 minutes", "B. 40 minutes", "C. 50 minutes", "D. 60 minutes"] },
  { q: "A computer at Geoscience Australia started analyzing a tremor at 0800 hours. It finished at 1100 hours. How long did the analysis take?", opts: ["A. 2 hours", "B. 3 hours", "C. 4 hours", "D. 5 hours"] },
  { q: "A recording sensor began running at 7:30 a.m. It stopped at 8:00 a.m. How long was it running?", opts: ["A. 15 minutes", "B. 30 minutes", "C. 45 minutes", "D. 60 minutes"] },
  { q: "A seismograph lost power at 1315 hours. How is this time written in 12-hour time?", opts: ["A. 1:15 a.m.", "B. 1:15 p.m.", "C. 3:15 a.m.", "D. 3:15 p.m."] },
  { q: "A rescue team arrived at a drill site at 9:15 a.m. and left at 10:45 a.m. How long were they at the site?", opts: ["A. 1 hour", "B. 1 hour and 15 minutes", "C. 1 hour and 30 minutes", "D. 2 hours"] },
  { q: "A warning light flashed from 6:10 p.m. to 6:55 p.m. How long did it flash?", opts: ["A. 35 minutes", "B. 40 minutes", "C. 45 minutes", "D. 50 minutes"] }
];

async function main() {
  const groups = [
    { name: 'Week_6_Print_Red.docx', title: 'Week 6 Homework — Informational Text', body: redBody, readQs: redReadQs, mathQs: mathsY5 },
    { name: 'Week_6_Print_Blue.docx', title: 'Week 6 Homework — Informational Text', body: blueBody, readQs: blueReadQs, mathQs: mathsY5 },
    { name: 'Week_6_Print_Green.docx', title: 'Week 6 Homework — Informational Text', body: greenBody, readQs: greenReadQs, mathQs: mathsY3 },
  ];
  for (const g of groups) {
    const doc = buildPrint(g.title, g.body, g.readQs, g.mathQs);
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(__dirname, g.name), buf);
    console.log(`Created: ${g.name}`);
  }
}

main().catch(console.error);

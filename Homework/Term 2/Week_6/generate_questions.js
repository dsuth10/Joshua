const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname);

// ─── Question data ────────────────────────────────────────────────────────────

const redComprehension = [
  { q: "What does the text imply is the main driver of the movement of tectonic plates?", opts: ["A. Tidal forces from the oceans", "B. The Earth's rotation", "C. Heat currents within the mantle", "D. Solar radiation"], ans: "C" },
  { q: "Based on the text, what prevents tectonic plates from moving smoothly past each other?", opts: ["A. Heat currents in the mantle", "B. Friction between the colossal slabs of rock", "C. Ocean tides pressing against the crust", "D. Volcanic eruptions lubricating the fault boundaries"], ans: "B" },
  { q: "Which of the following describes the formation of a normal fault?", opts: ["A. Plates sliding sideways past each other", "B. Crust being pushed together, forcing one block upward", "C. Molten rock pushing upward under the crust", "D. Crust being pulled apart, causing one block to slide downward"], ans: "D" },
  { q: "How do reverse faults differ from strike-slip faults based on the text?", opts: ["A. Reverse faults are caused by compressional forces, while strike-slip faults involve lateral shearing.", "B. Reverse faults slide horizontally, while strike-slip faults push rock blocks upward.", "C. Reverse faults pull the crust apart, while strike-slip faults push it together.", "D. Reverse faults are volcanic in origin, while strike-slip faults are collapse-based."], ans: "A" },
  { q: "The Cadell Fault is mentioned in the text as an example of what type of fault?", opts: ["A. Normal fault", "B. Reverse fault", "C. Strike-slip fault", "D. Thrust fault"], ans: "C" },
  { q: "What does the text suggest is the primary cause of volcanic earthquakes?", opts: ["A. Sudden plate movements along fault lines", "B. The movement of magma beneath the surface", "C. Cave-ins of underground caverns and mines", "D. Extensional stress pulling the crust apart"], ans: "B" },
  { q: "What can be inferred about collapse earthquakes from the text's description?", opts: ["A. They are powerful tectonic events that rupture the Earth's surface.", "B. They only occur along convergent boundaries.", "C. They are minor tremors with very localized causes, like cave-ins.", "D. They are monitored exclusively by international space agencies."], ans: "C" },
  { q: "Why does Australia experience fewer massive earthquakes than New Zealand?", opts: ["A. Australia is located in the middle of a tectonic plate, whereas New Zealand is on a boundary.", "B. Australia has no active faults or crustal stress.", "C. Australia sits in a volcanic-free zone with no mantle heat.", "D. Australia has strict building codes that prevent ground shaking."], ans: "A" },
  { q: "What was a significant physical impact of the 1968 Meckering earthquake mentioned in the text?", opts: ["A. The collapse of underground coal mines in New South Wales", "B. The ripping of the ground with a massive fault line", "C. A volcanic eruption in the center of the continent", "D. A major tsunami warning along the Canberra coast"], ans: "B" },
  { q: "Which historical event in Australia showed that even moderate intraplate events can cause serious damage?", opts: ["A. The 1968 Meckering earthquake", "B. The 1989 Newcastle earthquake", "C. The San Andreas Fault slippage", "D. The Cadell Fault movement"], ans: "B" },
  { q: "What role does Geoscience Australia play according to the text?", opts: ["A. They prevent plate movements using engineering tools.", "B. They monitor tremors and record P-waves and S-waves to keep communities safe.", "C. They map underground caves and old mines to prevent collapse.", "D. They predict volcanic eruptions across Australia."], ans: "B" },
  { q: "What travels through the Earth's crust as a result of a sudden release of energy?", opts: ["A. High heat currents from the mantle", "B. Molten magma flows", "C. Seismic waves (P-waves and S-waves)", "D. Extensional fractures"], ans: "C" },
  { q: "Based on the text, which of the following is true about seismic waves?", opts: ["A. They are only created by volcanic eruptions.", "B. They consist of primary P-waves and secondary S-waves.", "C. They travel through the mantle but not the crust.", "D. They prevent friction from building up along plates."], ans: "B" },
  { q: "What causes the build-up of immense stress along plate boundaries?", opts: ["A. Extensional stress turning into volcanic activity", "B. Slow, massive forces of moving plates grinding, colliding, or pulling apart", "C. Cave-ins of underground caverns and coal mines", "D. The primary and secondary waves clashing"], ans: "B" },
  { q: "What must occur before a sudden release of earthquake energy can happen?", opts: ["A. Friction holding the rocks together must be broken", "B. Magma must reach the ocean floor", "C. The Earth's mantle must cool down completely", "D. P-waves must overtake S-waves"], ans: "A" }
];

const blueComprehension = [
  { q: "What causes tectonic plates to move slowly deep inside the Earth?", opts: ["A. Ocean tides", "B. Strong winds", "C. Heat", "D. Surface friction"], ans: "C" },
  { q: "When does an earthquake occur based on the text?", opts: ["A. When plates stop moving entirely", "B. When rocks suddenly break and release energy in waves", "C. When the Earth's mantle cools down", "D. When volcanoes erupt into the ocean"], ans: "B" },
  { q: "What are fault lines?", opts: ["A. Large mountains formed by plate boundaries", "B. Cracks in the crust where the ground moves", "C. Heat currents that rise up from the mantle", "D. Underground caves that have collapsed"], ans: "B" },
  { q: "How does a normal fault form?", opts: ["A. The crust is pushed together, forcing rock up", "B. The crust is pulled apart, sliding one block of rock down", "C. Tectonic plates slide sideways past each other", "D. Magma rises up and cools on the surface"], ans: "B" },
  { q: "Which fault in Australia is mentioned as a strike-slip fault?", opts: ["A. San Andreas Fault", "B. Meckering Fault", "C. Cadell Fault", "D. Newcastle Fault"], ans: "C" },
  { q: "What forces create a reverse fault?", opts: ["A. Forces that slide plates sideways", "B. Forces that pull the crust apart", "C. Forces that push the crust together", "D. Forces from volcanic activity"], ans: "C" },
  { q: "Tectonic earthquakes are caused by what?", opts: ["A. Cave-ins of underground mines", "B. Liquid magma moving near volcanoes", "C. Plate movements along fault lines", "D. Building-code violations in major cities"], ans: "C" },
  { q: "What triggers volcanic earthquakes?", opts: ["A. Caves collapsing", "B. Magma moving under the ground", "C. Plates pulling apart in the ocean", "D. Mining activities"], ans: "B" },
  { q: "What is a collapse earthquake caused by?", opts: ["A. Shearing forces sliding plates laterally", "B. Plate collisions at plate boundaries", "C. Underground caves or old mines caving in", "D. High temperatures in the Earth's mantle"], ans: "C" },
  { q: "Why does Australia have fewer large earthquakes than New Zealand?", opts: ["A. Australia sits in the middle of a plate, rather than on an edge", "B. Australia has no historical earthquakes", "C. Australia has no fault lines or cracks in the crust", "D. Australia has very cold underground temperatures"], ans: "A" },
  { q: "What did the 1968 Meckering earthquake physically do to the ground?", opts: ["A. It created a volcano", "B. It ripped the ground open", "C. It flooded the area", "D. It collapsed an old mine"], ans: "B" },
  { q: "Which city's earthquake is mentioned as causing serious damage in 1989?", opts: ["A. Canberra", "B. Meckering", "C. Newcastle", "D. Sydney"], ans: "C" },
  { q: "Where is Geoscience Australia located?", opts: ["A. Sydney", "B. Newcastle", "C. Canberra", "D. Meckering"], ans: "C" },
  { q: "What does Geoscience Australia do to keep us safe?", opts: ["A. They stop earthquakes from happening", "B. They monitor tremors and record seismic waves", "C. They rebuild damaged homes", "D. They prevent volcanic eruptions"], ans: "B" },
  { q: "What travels through the ground when energy is suddenly released?", opts: ["A. Tectonic friction", "B. Seismic waves", "C. Liquid magma", "D. Extensional stress"], ans: "B" }
];

const greenComprehension = [
  { q: "What are tectonic plates?", opts: ["A. Giant moving parts that make up the outer crust", "B. Large cracks in underground mines", "C. Hot currents deep inside volcanoes", "D. Hard rocks that do not move"], ans: "A" },
  { q: "What makes the plates move very slowly?", opts: ["A. Ocean waves", "B. Heat inside the Earth", "C. Cold winds", "D. Human activity"], ans: "B" },
  { q: "What do we feel shaking as an earthquake?", opts: ["A. Magma cooling down", "B. Energy travelling in waves when rocks break", "C. Cold air rising", "D. Plants growing on fault lines"], ans: "B" },
  { q: "What do cracks in the Earth's crust where the ground moves get called?", opts: ["A. Tectonic plates", "B. Fault lines", "C. Volcanoes", "D. Caverns"], ans: "B" },
  { q: "What happens in a normal fault?", opts: ["A. The land is pushed together and rock rises", "B. The land is pulled apart and rock slides down", "C. Tectonic plates slide sideways", "D. Old mines cave in"], ans: "B" },
  { q: "What happens in a reverse fault?", opts: ["A. Plates slide sideways", "B. One rock slides down", "C. The land is pushed together and one rock rises up", "D. Hot magma moves near volcanoes"], ans: "C" },
  { q: "Which fault in Australia is a strike-slip fault?", opts: ["A. San Andreas Fault", "B. Newcastle Fault", "C. Cadell Fault", "D. Meckering Fault"], ans: "C" },
  { q: "What is the most common type of earthquake?", opts: ["A. Volcanic earthquake", "B. Collapse earthquake", "C. Tectonic earthquake", "D. Mine earthquake"], ans: "C" },
  { q: "What triggers volcanic earthquakes?", opts: ["A. Liquid magma moving near volcanoes", "B. Old mines caving in", "C. Strong winds blowing on mountains", "D. Caves collapsing"], ans: "A" },
  { q: "When do collapse earthquakes happen?", opts: ["A. When tectonic plates slide sideways", "B. When caves cave in", "C. When volcanoes erupt", "D. When the Earth's crust is pulled apart"], ans: "B" },
  { q: "Which place is mentioned as having more big earthquakes than Australia?", opts: ["A. Canberra", "B. Newcastle", "C. New Zealand", "D. Meckering"], ans: "C" },
  { q: "Where in Western Australia did a strong earthquake shake the land in 1968?", opts: ["A. Newcastle", "B. Meckering", "C. Canberra", "D. Cadell"], ans: "B" },
  { q: "Which town in New South Wales was shaken by an earthquake in 1989?", opts: ["A. Newcastle", "B. Canberra", "C. Meckering", "D. Cadell"], ans: "A" },
  { q: "What organization in Canberra monitors all tremors?", opts: ["A. The Newcastle Centre", "B. The Meckering Station", "C. Geoscience Australia", "D. The Tectonic Board"], ans: "C" },
  { q: "Why does Geoscience Australia monitor tremors?", opts: ["A. To make plates move faster", "B. To keep us safe", "C. To dig underground caves", "D. To rebuild old buildings"], ans: "B" }
];

// ─── Maths Questions ──────────────────────────────────────────────────────────

const mathsYear5 = [
  { q: "A seismometer in Adelaide recorded a tremor at 0815 hours. How is this time written in 12-hour time notation?", opts: ["A. 8:15 p.m.", "B. 8:15 a.m.", "C. 08:15 a.m.", "D. 8:51 p.m."], ans: "B" },
  { q: "Geoscience Australia registered a reverse fault slip at 3:45 p.m. What is this time in 24-hour time notation?", opts: ["A. 0345", "B. 1345", "C. 1545", "D. 1745"], ans: "C" },
  { q: "An undersea tectonic earthquake occurred off the WA coast at 2210 hours. How is this time written in 12-hour time notation?", opts: ["A. 10:10 a.m.", "B. 10:10 p.m.", "C. 8:10 p.m.", "D. 12:10 a.m."], ans: "B" },
  { q: "At a remote monitoring station on the Cadell Fault, a sensor lost connection at 11:25 p.m. and reconnected at 02:40 a.m. the next morning. What was the total duration of the connection loss?", opts: ["A. 3 hours and 15 minutes", "B. 3 hours and 25 minutes", "C. 2 hours and 15 minutes", "D. 2 hours and 55 minutes"], ans: "A" },
  { q: "A primary P-wave from an earthquake in the Tasman Sea was logged at a Hobart station at 1435 hours. The slower secondary S-wave was registered at 1452 hours. What was the exact elapsed time between the arrival of the two waves?", opts: ["A. 15 minutes", "B. 17 minutes", "C. 22 minutes", "D. 27 minutes"], ans: "B" },
  { q: "A seismograph in Canberra recorded a volcanic tremor at 11:45 a.m. An aftershock was recorded 4 hours and 30 minutes later. What was the 24-hour time of the aftershock?", opts: ["A. 1515", "B. 1615", "C. 1645", "D. 1715"], ans: "B" },
  { q: "A rescue team was dispatched to a simulated collapse in an abandoned mine. They departed their base in Newcastle at 0835 hours and arrived at the site at 1415 hours. How long did the journey take?", opts: ["A. 5 hours and 20 minutes", "B. 5 hours and 40 minutes", "C. 6 hours and 20 minutes", "D. 6 hours and 40 minutes"], ans: "B" },
  { q: "A research station in Perth recorded a tremor at 0005 hours. What is this time in 12-hour time notation?", opts: ["A. 12:05 a.m.", "B. 12:05 p.m.", "C. 1:05 a.m.", "D. 1:05 p.m."], ans: "A" },
  { q: "A tsunami warning buoy in the Pacific Ocean detected a sea-floor displacement at 12:00 p.m. (noon). The warning sirens on the coast were activated at 1342 hours. How much time elapsed between the buoy detection and the sirens?", opts: ["A. 1 hour and 42 minutes", "B. 2 hours and 42 minutes", "C. 42 minutes", "D. 13 hours and 42 minutes"], ans: "A" },
  { q: "Seismologists at Geoscience Australia began an emergency analysis of a strike-slip rupture at 1850 hours. The analysis was completed at 0115 hours the next morning. Using the timeline jump method, calculate the total elapsed time of the analysis.", opts: ["A. 6 hours and 15 minutes", "B. 6 hours and 25 minutes", "C. 7 hours and 15 minutes", "D. 7 hours and 25 minutes"], ans: "B" },
  { q: "Due to a power outage, a seismometer in Meckering ran on backup batteries from 9:45 p.m. on Tuesday until 11:15 a.m. on Wednesday. For how long did the backup batteries operate?", opts: ["A. 13 hours and 30 minutes", "B. 13 hours and 45 minutes", "C. 14 hours and 30 minutes", "D. 14 hours and 45 minutes"], ans: "A" },
  { q: "A P-wave was logged in Darwin at 2355 hours. The S-wave arrived 1 hour and 15 minutes later. What was the 12-hour time of the S-wave arrival?", opts: ["A. 1:10 a.m.", "B. 1:10 p.m.", "C. 12:10 a.m.", "D. 12:10 p.m."], ans: "A" },
  { q: "A research vessel near the Kermadec Trench recorded a subduction earthquake at 1045 hours. They sent an emergency transmission to Canberra 3 hours and 25 minutes later. What 24-hour time was the transmission sent?", opts: ["A. 1310", "B. 1410", "C. 1420", "D. 1430"], ans: "B" },
  { q: "Seismic data from Adelaide was compiled at 0735 hours. The data was uploaded to Geoscience Australia at 4:15 p.m. on the same day. What is the total elapsed time between compiling and uploading?", opts: ["A. 8 hours and 40 minutes", "B. 9 hours and 40 minutes", "C. 8 hours and 20 minutes", "D. 9 hours and 20 minutes"], ans: "A" },
  { q: "A seismograph calibration test started at 0515 hours and finished at 1330 hours. How long did the calibration process take?", opts: ["A. 7 hours and 45 minutes", "B. 8 hours and 15 minutes", "C. 8 hours and 30 minutes", "D. 9 hours and 15 minutes"], ans: "B" }
];

const mathsYear3 = [
  { q: "A small earthquake was recorded at 8:00 a.m. What is this time in 24-hour time?", opts: ["A. 0800", "B. 1800", "C. 8000", "D. 0008"], ans: "A" },
  { q: "A volcano station logged a rumble at 1500 hours. What is this time in 12-hour time?", opts: ["A. 3:00 a.m.", "B. 3:00 p.m.", "C. 5:00 a.m.", "D. 5:00 p.m."], ans: "B" },
  { q: "An aftershock was recorded at 4:30 p.m. What is this time in 24-hour time?", opts: ["A. 0430", "B. 1430", "C. 1630", "D. 1830"], ans: "C" },
  { q: "An earthquake drill in a school started at 10:00 a.m. and finished at 10:45 a.m. How long did the drill take?", opts: ["A. 15 minutes", "B. 30 minutes", "C. 45 minutes", "D. 60 minutes"], ans: "C" },
  { q: "A seismometer recorded a tremor at 0900 hours. A second tremor was recorded at 1130 hours. How much time passed between the two tremors?", opts: ["A. 1 hour and 30 minutes", "B. 2 hours", "C. 2 hours and 30 minutes", "D. 3 hours"], ans: "C" },
  { q: "A tsunami alarm was tested at 1:15 p.m. and stopped at 1:35 p.m. How long was the test?", opts: ["A. 10 minutes", "B. 15 minutes", "C. 20 minutes", "D. 25 minutes"], ans: "C" },
  { q: "A seismograph recorded a collapse tremor at 2:00 a.m. How is this time written in 24-hour time?", opts: ["A. 0200", "B. 1200", "C. 1400", "D. 2000"], ans: "A" },
  { q: "A scientist started reading seismic logs at 11:00 a.m. She finished at 11:55 a.m. How long did she spend reading the logs?", opts: ["A. 45 minutes", "B. 50 minutes", "C. 55 minutes", "D. 60 minutes"], ans: "C" },
  { q: "A seismometer recorded a volcanic earthquake at 2100 hours. How is this time written in 12-hour time?", opts: ["A. 9:00 a.m.", "B. 9:00 p.m.", "C. 11:00 a.m.", "D. 11:00 p.m."], ans: "B" },
  { q: "A tsunami warning was active from 3:10 p.m. to 3:50 p.m. How long did the warning last?", opts: ["A. 30 minutes", "B. 40 minutes", "C. 50 minutes", "D. 60 minutes"], ans: "B" },
  { q: "A computer at Geoscience Australia started analyzing a tremor at 0800 hours. It finished at 1100 hours. How long did the analysis take?", opts: ["A. 2 hours", "B. 3 hours", "C. 4 hours", "D. 5 hours"], ans: "B" },
  { q: "A recording sensor began running at 7:30 a.m. It stopped at 8:00 a.m. How long was it running?", opts: ["A. 15 minutes", "B. 30 minutes", "C. 45 minutes", "D. 60 minutes"], ans: "B" },
  { q: "A seismograph lost power at 1315 hours. How is this time written in 12-hour time?", opts: ["A. 1:15 a.m.", "B. 1:15 p.m.", "C. 3:15 a.m.", "D. 3:15 p.m."], ans: "B" },
  { q: "A rescue team arrived at a drill site at 9:15 a.m. and left at 10:45 a.m. How long were they at the site?", opts: ["A. 1 hour", "B. 1 hour and 15 minutes", "C. 1 hour and 30 minutes", "D. 2 hours"], ans: "C" },
  { q: "A warning light flashed from 6:10 p.m. to 6:55 p.m. How long did it flash?", opts: ["A. 35 minutes", "B. 40 minutes", "C. 45 minutes", "D. 50 minutes"], ans: "C" }
];

// ─── Doc builder ──────────────────────────────────────────────────────────────

function buildDoc(questions) {
  const children = [];
  questions.forEach((item, i) => {
    const num = i + 1;
    children.push(
      new Paragraph({ spacing: { before: 160, after: 40 }, children: [new TextRun({ text: `${num}. ${item.q}`, bold: true, size: 22, font: 'Arial' })] })
    );
    item.opts.forEach(opt => {
      children.push(
        new Paragraph({ spacing: { before: 0, after: 0 }, indent: { left: 360 }, children: [new TextRun({ text: opt, size: 22, font: 'Arial' })] })
      );
    });
    children.push(
      new Paragraph({ spacing: { before: 40, after: 80 }, children: [new TextRun({ text: `ANSWER: ${item.ans}`, bold: true, size: 22, font: 'Arial', color: '2E7D32' })] })
    );
    children.push(
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'POINT: 1', bold: true, size: 22, font: 'Arial', color: '2E7D32' })] })
    );
  });

  return new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

async function main() {
  const files = [
    { name: 'Week_6_Questions_Red.docx',   qs: [...redComprehension, ...mathsYear5] },
    { name: 'Week_6_Questions_Blue.docx',  qs: [...blueComprehension, ...mathsYear5] },
    { name: 'Week_6_Questions_Green.docx', qs: [...greenComprehension, ...mathsYear3] },
  ];

  for (const f of files) {
    const doc = buildDoc(f.qs);
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(OUT, f.name), buf);
    console.log(`Created: ${f.name}`);
  }
}

main().catch(console.error);

const { comp, mathY5, mathY34 } = require('./homework_content');

const levels = {
  Green: { reading: comp.Green, math: mathY34 },
  Blue: { reading: comp.Blue, math: mathY5 },
  Red: { reading: comp.Red, math: mathY5 }
};

for (const [lvl, data] of Object.entries(levels)) {
  console.log(`=== ${lvl.toUpperCase()} LEVEL ===`);
  console.log("Reading (Q1-15):");
  console.log(data.reading.map((q, i) => `Q${(i + 1).toString().padStart(2, '0')}: ${q.ans}`).join("  "));
  console.log("Maths (Q16-30):");
  console.log(data.math.map((q, i) => `Q${(i + 16).toString().padStart(2, '0')}: ${q.ans}`).join("  "));
  console.log();
}

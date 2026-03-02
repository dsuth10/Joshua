const pptxgen = require('pptxgenjs');
const fs = require('fs');

async function run() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  // Slide 1
  let s1 = pptx.addSlide();
  s1.background = { color: 'E1F5FE' };
  s1.addText("Lesson 9: Relationships", { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 36, color: '0277BD', bold: true, align: 'center' });
  s1.addText("Dylan, Jack, and Grandfather", { x: 0.5, y: 2.0, w: '90%', fontSize: 24, color: '01579B', align: 'center' });
  s1.addShape(pptx.ShapeType.rect, { x: 0, y: 3.5, w: '100%', h: 0.1, fill: { color: '03A9F4' } });

  // Slide 2: Early Tension
  let s2 = pptx.addSlide();
  s2.background = { color: 'E1F5FE' };
  s2.addText("Early Tension: Dylan & Jack", { x: 0.5, y: 0.3, fontSize: 28, color: '0277BD', bold: true });
  s2.addText("Atmosphere in Waleup:", { x: 0.5, y: 1.2, fontSize: 20, color: 'D32F2F', bold: true });
  s2.addText("\"The house was often dark, even when the sun was still up.\"", { x: 0.5, y: 1.7, w: '90%', fontSize: 18, color: '01579B', italic: true });
  s2.addText("• Why does Jack stay in the dark?\n• What does Dylan do to 'prop up' his father?\n• How does the silence feel?", { x: 0.5, y: 2.5, w: '90%', fontSize: 18, color: '01579B' });

  // Slide 3: The Eagle Video
  let s3 = pptx.addSlide();
  s3.background = { color: 'E1F5FE' };
  s3.addText("The 'Eagle Video' Symbol", { x: 0.5, y: 0.3, fontSize: 28, color: 'E65100', bold: true });
  s3.addText("Jack spends hours watching an old video of an eagle.", { x: 0.5, y: 1.2, w: '90%', fontSize: 18, color: '01579B' });
  s3.addText("• What does the eagle represent?\n• Why watch this instead of talking?\n• How does it link to 'Flight'?", { x: 0.5, y: 2.0, w: '90%', fontSize: 18, color: '01579B' });

  // Slide 4: Grandfather
  let s4 = pptx.addSlide();
  s4.background = { color: 'E1F5FE' };
  s4.addText("The 'Wind' Beneath the Wings", { x: 0.5, y: 0.3, fontSize: 28, color: '2E7D32', bold: true });
  s4.addText("\"Grandfather provides Dylan with the 'wind' he needs to fly, whereas his father is stuck on the ground.\"", { x: 0.5, y: 1.2, w: '90%', fontSize: 18, color: '1B5E20', italic: true });
  s4.addText("• How is Grandpa's home different?\n• Think about light, snacks, and stories.", { x: 0.5, y: 2.5, w: '90%', fontSize: 18, color: '1B5E20' });

  // Slide 5: Influence
  let s5 = pptx.addSlide();
  s5.background = { color: 'E1F5FE' };
  s5.addText("Grandfather's Influence", { x: 0.5, y: 0.3, fontSize: 28, color: '01579B', bold: true });
  s5.addText("He didn't just teach me how to fold planes. He taught me why it mattered.", { x: 0.5, y: 1.2, w: '90%', fontSize: 18, color: '01579B', italic: true });
  s5.addText("How does Grandpa's energy affect Dylan's confidence?", { x: 0.5, y: 2.2, w: '90%', fontSize: 20, color: 'D32F2F', bold: true });

  // Slide 6: Summary
  let s6 = pptx.addSlide();
  s6.background = { color: 'E1F5FE' };
  s6.addText("Summary: Compare & Contrast", { x: 0.5, y: 0.3, fontSize: 28, color: '4A148C', bold: true });
  s6.addText("Father (Jack): Grief, Silence, 'Stuck on Ground'", { x: 0.5, y: 1.5, fontSize: 18, color: '4A148C' });
  s6.addText("Grandfather: Light, Support, 'Providing Wind'", { x: 0.5, y: 2.2, fontSize: 18, color: '4A148C' });
  s6.addText("Now, write your paragraph response!", { x: 0.5, y: 3.2, w: '90%', fontSize: 24, color: '01579B', bold: true, align: 'center' });

  await pptx.writeFile({ fileName: 'c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Lesson 9 Relationships\\Lesson_9_Relationships.pptx' });
  console.log('✅ Final PowerPoint generated successfully.');
}

run().catch(console.error);

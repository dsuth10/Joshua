const path = require('path');
const fs = require('fs');
const { generateHTMLPresentation } = require('../.agent/skills/english-lesson/scripts/create_lesson_resources');

// Mock data representing standard slides and Lucas differentiated pathway
const mockSlidesData = [
  {
    title: "Understanding Metaphors",
    subtitle: "Year 5 English Unit 2 - Creative Writing",
    theme: "dark",
    standardHtml: "<p>Welcome to our interactive lesson on metaphors. Today we will explore how comparison creates vivid imagery.</p>",
    teacherNotes: "<h3>Pedagogical Context</h3><p>Ensure the students understand the difference between direct comparison (simile) and figurative substitution (metaphor).</p><ul><li>Recall: Similes use 'like' or 'as'.</li><li>Metaphors state something IS another thing.</li></ul>"
  },
  {
    title: "What is a Metaphor?",
    theme: "light",
    standardHtml: `
      <p>A metaphor is a figure of speech that describes an object or action in a way that isn't literally true, but helps explain an idea or make a comparison.</p>
      <ul style="margin-left: 30px; margin-top: 15px;">
        <li>"The classroom was a zoo."</li>
        <li>"Time is a thief."</li>
        <li>"Her heart is gold."</li>
      </ul>
    `,
    teacherNotes: "<p>Read each example aloud. Ask students to describe the everyday meaning of 'zoo' and how it translates to a busy, noisy classroom.</p>"
  },
  {
    title: "Differentiated Practice",
    theme: "light",
    standardHtml: `
      <h3>Standard Activity</h3>
      <p>Rewrite these sentences to contain a metaphor:</p>
      <ol style="margin-left: 30px; margin-top: 10px;">
        <li>The snow was like a white blanket.</li>
        <li>He was very brave in the fight.</li>
      </ol>
    `,
    lucasHtml: `
      <h3>Support Activity (Lucas Pathway)</h3>
      <p>Match the metaphors to their meanings below:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: var(--soft-grey);">
          <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Metaphor</th>
          <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Meaning</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">"He is a night owl"</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Likes staying up late</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">"An icy stare"</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Unfriendly look</td>
        </tr>
      </table>
    `,
    teacherNotes: "<p>Lucas pathway is active! Encourage supported students to complete the matching grid using simple terms. Standard pathway students should independently formulate their metaphors.</p>"
  },
  {
    title: "Visualising Metaphors",
    theme: "light",
    standardHtml: "<p>Look at the image below. What metaphors can you write to describe this scene?</p>",
    // Using a sample placeholder/test image from the repository
    images: ["../../English_Unit_2/Resources/Website/Cyclones/Cyclone_Althea/hero.png"],
    teacherNotes: "<p>Show the image and prompt students for brainstorming: 'The wave was a charging bull', 'The sky was an angry bruise'. Verify the click-to-zoom pop-out lightbox functionality.</p>"
  }
];

async function main() {
  const outputPath = path.join(__dirname, 'test_presentation.html');
  console.log(`Starting dynamic compilation of presentation: ${outputPath}`);
  
  try {
    await generateHTMLPresentation(outputPath, mockSlidesData);
    console.log("Success! Compiled interactive HTML slides generated successfully.");
  } catch (error) {
    console.error("Compilation failed:", error);
  }
}

main();

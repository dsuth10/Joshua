const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

async function run() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Paper Planes: Lesson 9 Relationships Assessment", bold: true, size: 32 })],
          spacing: { after: 400 }
        }),
        // Question 1
        new Paragraph({ text: "1. Why does Jack (Dylan's father) often sit in the dark at home in Waleup?" }),
        new Paragraph({ text: "A. He is trying to save money on electricity." }),
        new Paragraph({ text: "B. He is grieving and emotionally distant." }),
        new Paragraph({ text: "C. He prefers the dark for watching television." }),
        new Paragraph({ text: "D. The light bulbs in the house are all broken." }),
        new Paragraph({ text: "ans: B" }),
        new Paragraph({ text: "" }),

        // Question 2
        new Paragraph({ text: "2. What activity does Jack spend most of his time doing early in the novel?" }),
        new Paragraph({ text: "A. Helping Dylan fold paper planes." }),
        new Paragraph({ text: "B. Working long hours at the local garage." }),
        new Paragraph({ text: "C. Watching an old video of an eagle in flight." }),
        new Paragraph({ text: "D. Planning a trip to the Sydney competition." }),
        new Paragraph({ text: "ans: C" }),
        new Paragraph({ text: "" }),

        // Question 3
        new Paragraph({ text: "3. How does Dylan usually handle the 'early tension' with his father?" }),
        new Paragraph({ text: "A. He shouts at his father to wake up." }),
        new Paragraph({ text: "B. He avoids his father and stays at school." }),
        new Paragraph({ text: "C. He quietly takes care of himself and tries not to bother Jack." }),
        new Paragraph({ text: "D. He asks his grandfather to move in and help." }),
        new Paragraph({ text: "ans: C" }),
        new Paragraph({ text: "" }),

        // Question 4
        new Paragraph({ text: "4. Which of these best describes Grandfather's personality?" }),
        new Paragraph({ text: "A. Strict and demanding." }),
        new Paragraph({ text: "B. Energetic, mischievous, and supportive." }),
        new Paragraph({ text: "C. Serious and focused on school grades." }),
        new Paragraph({ text: "D. Quiet and distant like Jack." }),
        new Paragraph({ text: "ans: B" }),
        new Paragraph({ text: "" }),

        // Question 5
        new Paragraph({ text: "5. What does Grandfather encourage Dylan to do?" }),
        new Paragraph({ text: "A. Follow his dreams and keep flying planes." }),
        new Paragraph({ text: "B. Give up on the competition and find a 'real' job." }),
        new Paragraph({ text: "C. Stop bothering his father." }),
        new Paragraph({ text: "D. Move to Sydney to live with him." }),
        new Paragraph({ text: "ans: A" }),
        new Paragraph({ text: "" }),

        // Question 6
        new Paragraph({ text: "6. How does the house in Waleup change when Grandfather visits?" }),
        new Paragraph({ text: "A. It becomes even quieter." }),
        new Paragraph({ text: "B. It fills with more light, laughter, and activity." }),
        new Paragraph({ text: "C. Jack becomes angry about the noise." }),
        new Paragraph({ text: "D. Dylan spends more time outside." }),
        new Paragraph({ text: "ans: B" }),
        new Paragraph({ text: "" }),

        // Question 7
        new Paragraph({ text: "7. Why is the 'eagle video' significant to the relationship between Dylan and Jack?" }),
        new Paragraph({ text: "A. It represents Jack's hope for the future." }),
        new Paragraph({ text: "B. It is a memory of Dylan's mother and Jack's inability to move on." }),
        new Paragraph({ text: "C. It is Dylan's favourite movie." }),
        new Paragraph({ text: "D. It shows Jack how to make a better paper plane." }),
        new Paragraph({ text: "ans: B" }),
        new Paragraph({ text: "" }),

        // Question 8
        new Paragraph({ text: "8. In the quote, 'Grandfather provides Dylan with the wind he needs to fly,' what does 'wind' symbolise?" }),
        new Paragraph({ text: "A. Physical strength." }),
        new Paragraph({ text: "B. Encouragement, inspiration, and support." }),
        new Paragraph({ text: "C. Scientific knowledge about aviation." }),
        new Paragraph({ text: "D. The actual weather conditions in Waleup." }),
        new Paragraph({ text: "ans: B" }),
        new Paragraph({ text: "" }),

        // Question 9
        new Paragraph({ text: "9. How does Jack initially react to Dylan's success in the regional competition?" }),
        new Paragraph({ text: "A. He throws a big party." }),
        new Paragraph({ text: "B. He is uninterested and barely acknowledges it." }),
        new Paragraph({ text: "C. He tells Dylan to stop wasting paper." }),
        new Paragraph({ text: "D. He immediately buys tickets to Sydney." }),
        new Paragraph({ text: "ans: B" }),
        new Paragraph({ text: "" }),

        // Question 10
        new Paragraph({ text: "10. What is the main difference between Dylan's relationship with Jack and his relationship with Grandfather at this point in the novel?" }),
        new Paragraph({ text: "A. Jack is younger than Grandfather." }),
        new Paragraph({ text: "B. Jack is distant and sad, while Grandfather is present and encouraging." }),
        new Paragraph({ text: "C. Dylan prefers Jack because they live together." }),
        new Paragraph({ text: "D. Grandfather is more interested in Jason's planes." }),
        new Paragraph({ text: "ans: B" }),
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('c:\\Users\\dsuth\\Documents\\Joshua\\Units\\English\\English Unit 1\\Lesson 9 Relationships\\Lesson_9_Assessment.docx', buffer);
  console.log('✅ Assessment generated successfully.');
}

run().catch(console.error);

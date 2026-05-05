const fs = require('fs');

function processFile(f) {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  let newContent = content.replace(
    /paras\.push\(new Paragraph\(\{\s*spacing:\s*\{\s*before:\s*20,\s*after:\s*80\s*\},\s*indent:\s*\{\s*left:\s*360\s*\},\s*children:\s*\[new TextRun\(\{\s*text:\s*\`ANS:\s*\$\{item\.ans\}\`,\s*size:\s*20,\s*font:\s*'Arial',\s*color:\s*'888888'\s*\}\)\],\s*\}\)\);/g,
    `paras.push(new Paragraph({
      spacing: { before: 20, after: 20 },
      indent: { left: 360 },
      children: [new TextRun({ text: \`ANSWER: \${item.ans}\`, size: 20, font: 'Arial', color: '888888' })],
    }));
    paras.push(new Paragraph({
      spacing: { before: 0, after: 80 },
      indent: { left: 360 },
      children: [new TextRun({ text: \`POINT: 1\`, size: 20, font: 'Arial', color: '888888' })],
    }));`
  );

  newContent = newContent.replace(
    /children\.push\(new Paragraph\(\{\s*text:\s*\`ANS:\s*\[?\$\{item\.ans\}\]?\`,\s*spacing:\s*\{\s*after:\s*(\d+)\s*\}\s*\}\)\);/g,
    `children.push(new Paragraph({ text: \`ANSWER: \${item.ans}\`, spacing: { after: 100 } }));
        children.push(new Paragraph({ text: \`POINT: 1\`, spacing: { after: $1 } }));`
  );

  newContent = newContent.replace(
    /docChildren\.push\(new Paragraph\(\{\s*children:\s*\[new TextRun\(\{\s*text:\s*\`ANS:\s*\$\{item\.ans\}\`,\s*color:\s*'999999'\s*\}\)\],\s*spacing:\s*\{\s*after:\s*(\d+)\s*\}\s*\}\)\);/g,
    `docChildren.push(new Paragraph({
      children: [new TextRun({ text: \`ANSWER: \${item.ans}\`, color: '999999' })],
      spacing: { after: 100 }
    }));
    docChildren.push(new Paragraph({
      children: [new TextRun({ text: \`POINT: 1\`, color: '999999' })],
      spacing: { after: $1 }
    }));`
  );

  newContent = newContent.replace(
    /docChildren\.push\(new Paragraph\(\{\s*children:\s*\[new TextRun\(\{\s*text:\s*\`ANS:\s*\$\{item\.ans\}\`\s*\}\)\]\s*\}\)\);/g,
    `docChildren.push(new Paragraph({ children: [new TextRun({ text: \`ANSWER: \${item.ans}\` })], spacing: { after: 100 } }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: \`POINT: 1\` })], spacing: { after: 200 } }));`
  );
  
  newContent = newContent.replace(
    /children\.push\(new Paragraph\(\{\s*children:\s*\[new TextRun\(\{\s*text:\s*\`ANS:\s*\$\{item\.ans\}\`,\s*color:\s*'999999'\s*\}\)\],\s*spacing:\s*\{\s*after:\s*(\d+)\s*\}\s*\}\)\);/g,
    `children.push(new Paragraph({
      children: [new TextRun({ text: \`ANSWER: \${item.ans}\`, color: '999999' })],
      spacing: { after: 100 }
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: \`POINT: 1\`, color: '999999' })],
      spacing: { after: $1 }
    }));`
  );

  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated ' + f);
  } else {
    console.log('No changes needed or matched in ' + f);
  }
}

const files = [
  'c:\\\\Users\\\\dsuth\\\\Documents\\\\Joshua\\\\Homework\\\\Week_02\\\\create_homework.js',
  'c:\\\\Users\\\\dsuth\\\\Documents\\\\Joshua\\\\Units\\\\English\\\\English_Unit_2\\\\Lesson_Plans\\\\build_mahina_quiz.js',
  'c:\\\\Users\\\\dsuth\\\\Documents\\\\Joshua\\\\Units\\\\English\\\\English Unit 1\\\\Resources\\\\Week One Lesson One\\\\create_resources.js',
  'c:\\\\Users\\\\dsuth\\\\Documents\\\\Joshua\\\\Units\\\\English\\\\English_Unit_2\\\\Cyclones\\\\Cyclone_Tracy\\\\Cyclone_Tracy_Comprehension_Assessment.js',
  'c:\\\\Users\\\\dsuth\\\\Documents\\\\Joshua\\\\Units\\\\English\\\\English Unit 1\\\\Resources\\\\Week Two Lesson Seven\\\\create_assessment.js',
  'c:\\\\Users\\\\dsuth\\\\Documents\\\\Joshua\\\\Units\\\\English\\\\English Unit 1\\\\Lesson 1 Social and Cultural Context\\\\create_resources.js'
];
files.forEach(processFile);

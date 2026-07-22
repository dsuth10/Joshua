const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, Document, Footer, Header, PageBreak, PageNumber,
  Packer, Paragraph, ShadingType, Table, TableCell, TableLayoutType, TableRow,
  TextRun, VerticalAlign, WidthType,
} = require('docx');

const lessonDir = path.resolve(__dirname, '..');
const planPath = path.join(lessonDir, 'Lesson_8_Plan.md');
const htmlPath = path.join(lessonDir, 'Lesson_8_Presentation.html');
const handoutPath = path.join(lessonDir, 'Lesson_8_Handout.docx');
const lucasPath = path.join(lessonDir, 'Lesson_8_Lucas_Handout.docx');

const C = { ink:'192B36', navy:'173C4E', teal:'20756E', mint:'DCEFE8', cream:'FFF8E7', gold:'E9B44C', coral:'D8644A', pale:'F4F7F6', white:'FFFFFF', smoke:'5A6870', line:'B9CBC8' };
const border = (color=C.line,size=6)=>({style:BorderStyle.SINGLE,color,size});
const borders = (color=C.line,size=6)=>({top:border(color,size),bottom:border(color,size),left:border(color,size),right:border(color,size)});
const run = (text,o={})=>new TextRun({text,font:'Arial',size:22,color:C.ink,...o});
function para(text,o={}) { const {bold,italic,color,size,children,...po}=o; return new Paragraph({spacing:{after:120,line:300,lineRule:'auto'},...po,children:children||[run(text,{bold,italics:italic,color,size})]}); }
function heading(text,level=1){return new Paragraph({style:level===1?'Heading1':'Heading2',children:[run(text)]});}
function styles(base=22){return {default:{document:{run:{font:'Arial',size:base,color:C.ink},paragraph:{spacing:{after:120,line:300,lineRule:'auto'}}}},paragraphStyles:[
  {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Arial',bold:true,size:32,color:C.navy},paragraph:{spacing:{before:280,after:120},keepNext:true,outlineLevel:0}},
  {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Arial',bold:true,size:26,color:C.teal},paragraph:{spacing:{before:220,after:100},keepNext:true,outlineLevel:1}},
]};}
function cell(children,width,o={}){return new TableCell({width:{size:width,type:WidthType.DXA},verticalAlign:o.verticalAlign||VerticalAlign.CENTER,margins:{top:100,bottom:100,left:140,right:140},borders:borders(o.borderColor||C.line,o.borderSize||6),shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR}:undefined,children});}
function table(rows,widths){return new Table({width:{size:9360,type:WidthType.DXA},indent:{size:120,type:WidthType.DXA},layout:TableLayoutType.FIXED,columnWidths:widths,rows});}
function lines(n=4){return Array.from({length:n},()=>para('________________________________________________________________________________',{size:20,color:C.smoke,spacing:{before:70,after:80}}));}
function hf(label,lesson='Lesson 8'){return {headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:80},children:[run('ENGLISH UNIT 3  |  '+label,{bold:true,size:16,color:C.smoke})]})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run(lesson+'  |  Page ',{size:16,color:C.smoke}),new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.smoke})]})]})}};}
function titleBlock(subtitle){return [
  para('BERANI  |  LESSON 8',{bold:true,size:20,color:C.coral,spacing:{after:40}}),
  para('Rules, Rights, and Activism',{bold:true,size:38,color:C.navy,spacing:{after:70}}),
  para(subtitle,{bold:true,size:23,color:C.smoke,spacing:{after:160}}),
  table([new TableRow({children:[
    cell([para('READ',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('pp. 33-41',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
    cell([para('DECIDE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('strengths + risks',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
    cell([para('ARGUE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('claim + evidence + counter',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
  ]})],[3120,3120,3120]),
  para('Name: ____________________________________    Class: __________    Date: __________',{italic:true,size:19,spacing:{before:170,after:100}}),
];}

function buildPlan(){const md=`# Lesson 8: Rules, Rights, and Activism

## Lesson purpose

Students evaluate Malia's response to Mrs Harwono's restriction of the petition in *Berani* (pp. 33-39), then use Ari's reaction (pp. 39-41) to consider an activist action's effects on an audience. They distinguish a school instruction from a law, weigh competing responses, and construct a reasoned opinion on whether rules should ever be bent for environmental activism.

## Curriculum focus

- **Year 5 - AC9E5LA02:** move beyond a bare assertion by using relevant textual evidence and reasons.
- **Year 6 - AC9E6LA02:** identify how subjective language and perspective position a reader, and qualify a judgement with a counterargument.

## Learning intention

We are learning to construct a reasoned opinion about whether a rule should be bent for a cause, using evidence and a fair counterargument.

## Success criteria

- I can separate what the text states from a character's belief and my inference.
- I can explain Mrs Harwono's restriction and Malia's reason for resisting it.
- I can weigh a response by naming a strength and a risk.
- I can notice where subjective language persuades a character (or the reader).
- I can write a clear opinion with a claim, text evidence, a counterargument and a final judgement.
- I can revise one sentence after a peer tests my reasoning.

## Argument shape

A strong opinion in this lesson needs four jobs:

1. **Claim** - a qualified position, not an absolute slogan.
2. **Evidence** - one accurate detail from pp. 33-41.
3. **Counterargument** - a fair reason someone may disagree.
4. **Judgement** - a final view with a clear limit or condition.

## Preparation

- Open *Berani* to Malia (pp. 33-39) and Ari (pp. 39-41).
- Open \`Lesson_8_Presentation.html\` in a modern browser and select fullscreen.
- Print \`Lesson_8_Handout.docx\`; use \`Lesson_8_Lucas_Handout.docx\` for the supported visual pathway when appropriate.
- Prepare three room positions or desk cards: **follow**, **bend**, **break**.
- Students write on the handout by default. Do not rely on a shared projected draft.
- Discussion boundary: evaluate the fictional choices in the text. Do not ask students to disclose personal rule-breaking or political beliefs.
- Accuracy boundary: Mrs Harwono gives a school instruction about distributing a petition that names the school. The separate statement that keeping an orangutan as a pet is illegal is not the rule Malia bends.

## Sequence (approximately 60 minutes)

### 1. Cold open: Follow, bend or break? - 5 minutes

Present a fictional dilemma: a school bans unapproved corridor posters; a wildlife group wants to warn students about an urgent local threat. Students choose follow, bend or break, then say why that option is strongest. Do not announce a correct choice.

### 2. Mission: build an argument - 3 minutes

Show the four jobs of the opinion paragraph. Clarify that a gut feeling is not enough: students need a claim, evidence, a fair counterargument and a final judgement.

### 3. Read for decisions, pp. 33-41 - 12 minutes

Read Malia then Ari in one encounter. Pause only at three decision points: Mrs Harwono's restriction, Malia's online plan, and Ari's change of mind. Students capture one precise detail at each stop on the handout.

### 4. Evidence boundary sort - 5 minutes

Classify statements as **text states**, **character believes**, or **reasonable inference**. The key misconception is treating Malia's slogan about “real activists” as the narrator's proven truth.

### 5. Decision bench - 7 minutes

Pairs test three options: wait for the principal, seek another approved channel, or post to the class webpage. Students name a strength before the risk is revealed, then choose a position they can defend in writing.

### 6. Annotated model + self-persuasion - 6 minutes

Reveal the jobs in a model paragraph: claim, evidence, counterargument, judgement. Emphasise that “sometimes” needs a clear limit. For Year 6 (and as a stretch for Year 5), ask: **In pp. 33-39, where is Malia persuading herself?** Point to “Technically, I have not lied” and “Real activists don't let rules get in their way” as subjective self-justification, not proven fact.

### 7. Independent opinion on the handout - 13 minutes

Students answer: **Should rules ever be bent for environmental activism?** Aim for 120-160 words on the handout. Require a qualified claim, one accurate detail from pp. 33-41, a counterargument and a final judgement. Optional stem cards stay on the board for support only.

### 8. Stress-test and revision - 5 minutes

Reviewer asks: “What limit makes your position fair?”, “Whose consequence have you not considered?”, and “Have you treated a belief as a proven fact?” Writer revises one sentence immediately.

### 9. Accuracy bridge and exit evidence - 4 minutes

Clarify school instruction versus the law named in the petition. Then collect: “Bending a rule may be justified when ___, provided that ___.” Use omissions to decide whether to reteach evidence, counterarguments or subjective language.

## Differentiation

### Support

- Use the compact evidence box and claim frames on the handout.
- Offer claim frames: “Rules should usually be followed; however ...” or “A rule may be bent only when ...”.
- Let students orally rehearse a claim and counterargument before writing.
- Reduce the writing target to 80-100 words while retaining evidence and a counterpoint.

### Lucas (ICP)

- Use the separate large-print pathway: **HELP orangutans -> WAIT for permission -> POST online**.
- Lucas identifies what Malia wants, what the teacher says, and what Malia chooses.
- He selects **wait / ask another way / post** and completes or dictates: “Malia should ___ because ___.”
- Accept pointing, circling, speaking, partner scribing or copying. Preserve the core judgement rather than replacing it with recall.

### Extend

- Analyse how “Technically, I have not lied” reveals Malia's self-justification and how that language tries to position the reader.
- Evaluate Mrs Harwono's statement about freedom of expression without assuming the novel proves a complete legal comparison between countries.
- Explain how Ari's response demonstrates audience resistance and an unintended persuasive effect.

## Formative assessment

- The cold open reveals whether students can justify a position, not only choose one.
- The evidence sort exposes confusion between narration, belief and inference.
- The decision bench shows whether students can hold a strength and a risk together.
- The self-persuasion prompt shows whether students can spot subjective language.
- The peer stress-test makes weak limits, ignored consequences and belief-as-fact slips visible.
- The exit sentence samples the central judgement, not participation.

## Teacher answer guide

- **Mrs Harwono's restriction:** she says Malia has a right to protest, but the school name is on the petition and student actions reflect on the school. She worries parents connected to agriculture and government may be inflamed. She says principal approval is required and promises to try.
- **Malia's choice:** she decides the instruction applies only to paper copies, withholds her online plan, and intends to post to the class webpage. “Technically” signals a loophole; “Real activists don't let rules get in their way” is Malia's belief, not an author-confirmed principle.
- **Ari's response:** he first intends to sign. The captive-orangutan message makes him think of Ginger Juice; he rejects its applicability and withdraws support. This shows activism can reach an audience yet still provoke defensiveness.
- **Defensible positions:** follow, bend or break may be argued if the student uses text evidence and faces a fair counterargument. Strong answers distinguish urgent environmental harm from convenience and show awareness of effects on others.
- **Evidence boundaries:** these pages do not show the principal's decision or confirm the online petition's success. Do not call Malia's action illegal. The text identifies pet orangutan captivity as against the law; Mrs Harwono's restriction is a school permission issue.
`;fs.writeFileSync(planPath,md,'utf8');}

async function buildHandout(){
  const children=[...titleBlock('An opinion-building workshop'),
    heading('1. First judgement',1),
    para('Circle one:  FOLLOW the rule   /   BEND the rule   /   BREAK the rule'),
    para('I chose this because ________________________________________________________________.'),
    heading('2. Decision captures: pages 33-41',1),
    para('One precise detail at each stop. Keep facts, beliefs and inferences separate.'),
    table([
      new TableRow({tableHeader:true,children:[
        cell([para('Stop',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],2200,{fill:C.navy,borderColor:C.navy}),
        cell([para('Precise detail from the text',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],7160,{fill:C.navy,borderColor:C.navy}),
      ]}),
      new TableRow({children:[cell([para('1 Restriction',{bold:true,spacing:{after:40}}),para('Mrs Harwono',{italic:true,size:18,spacing:{after:0}})],2200,{fill:C.mint}),cell([para('What does she prohibit, and why?',{italic:true,size:19,spacing:{after:80}}),para('')],7160)]}),
      new TableRow({children:[cell([para('2 Online plan',{bold:true,spacing:{after:40}}),para('Malia',{italic:true,size:18,spacing:{after:0}})],2200,{fill:C.cream}),cell([para('What does she decide, and what does she withhold?',{italic:true,size:19,spacing:{after:80}}),para('')],7160)]}),
      new TableRow({children:[cell([para('3 Audience effect',{bold:true,spacing:{after:40}}),para('Ari',{italic:true,size:18,spacing:{after:0}})],2200,{fill:C.pale}),cell([para('What changes his intention to sign?',{italic:true,size:19,spacing:{after:80}}),para('')],7160)]}),
    ],[2200,7160]),
    heading('3. Decision bench',1),
    para('Name a strength and a risk for each response, then choose a position you can defend.'),
    table([new TableRow({tableHeader:true,children:[
      cell([para('Response',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],2400,{fill:C.coral,borderColor:C.coral}),
      cell([para('Strongest reason',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3480,{fill:C.coral,borderColor:C.coral}),
      cell([para('Most serious risk',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3480,{fill:C.coral,borderColor:C.coral}),
    ]}),
      ...[
        ['Wait for the principal','Pressure: school process + Mrs Harwono'],
        ['Seek another approved channel','Pressure: reach people without school endorsement'],
        ['Post to the class webpage','Pressure: urgency + Malia\'s loophole'],
      ].map(([title,note])=>new TableRow({children:[
        cell([para(title,{bold:true,spacing:{after:40}}),para(note,{italic:true,size:17,spacing:{after:0}})],2400,{fill:C.cream}),
        cell([para('')],3480),
        cell([para('')],3480),
      ]})),
    ],[2400,3480,3480]),
    para('My position now: ______________________. I can defend it because ____________________________.'),
    new Paragraph({children:[new PageBreak()]}),
    heading('4. Model anatomy',1),
    table([new TableRow({children:[cell([
      para('MODEL',{bold:true,color:C.coral,size:18,spacing:{after:60}}),
      para('Rules should usually be followed; however, bending one may be justified when urgent harm is at stake and safer options have failed. Mrs Harwono has a reasonable purpose: the petition names the school, so she says principal approval is needed. Yet Malia believes delay protects an unfair situation. Her planned online post may spread the message, but hiding it also shifts risk onto her teacher and classmates. Therefore, Malia\'s choice is understandable but not fully justified yet. She should first seek another channel that does not claim school approval; if no timely option exists, limited and accountable rule-bending becomes easier to defend.',{size:20,spacing:{after:80}}),
      para('Year 6 notice: In pp. 33-39, “Technically...” and “Real activists...” are Malia persuading herself - belief, not proof.',{bold:true,size:19,color:C.coral,spacing:{after:0}}),
    ],9360,{fill:C.cream,borderColor:C.gold})]})],[9360]),
    table([new TableRow({children:[
      cell([para('CLAIM',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('qualified position',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.mint}),
      cell([para('EVIDENCE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('text detail',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.mint}),
      cell([para('COUNTER',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('fair opposition',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.mint}),
      cell([para('JUDGEMENT',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('limit or condition',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.mint}),
    ]})],[2340,2340,2340,2340]),
    heading('5. Plan, then write',1),
    para('Question: Should rules ever be bent for environmental activism?',{bold:true}),
    table([
      new TableRow({children:[cell([para('Qualified claim',{bold:true,spacing:{after:0}})],2200,{fill:C.pale}),cell([para('')],7160)]}),
      new TableRow({children:[cell([para('Text evidence',{bold:true,spacing:{after:0}})],2200,{fill:C.pale}),cell([para('')],7160)]}),
      new TableRow({children:[cell([para('Counterargument',{bold:true,spacing:{after:0}})],2200,{fill:C.pale}),cell([para('')],7160)]}),
      new TableRow({children:[cell([para('Final judgement',{bold:true,spacing:{after:0}})],2200,{fill:C.pale}),cell([para('Only if / provided that ...',{italic:true,size:19,spacing:{after:0}})],7160)]}),
    ],[2200,7160]),
    para('Write 120-160 words (support: 80-100). Include a claim, evidence, a counterargument and a final judgement.',{spacing:{before:140}}),
    ...lines(6),
    heading('6. Stress-test, revise, exit',1),
    table([new TableRow({children:[
      cell([para('Limit?',{bold:true,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('What condition keeps your view fair?',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
      cell([para('Consequence?',{bold:true,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Whose risk did you miss?',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
      cell([para('Belief as fact?',{bold:true,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Did you treat a belief as proof?',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.cream}),
    ]})],[3120,3120,3120]),
    para('My revised sentence:'),...lines(2),
    para('Exit: Bending a rule may be justified when ________________________________________________,'),
    para('provided that ______________________________________________________________________.'),
  ];
  const doc=new Document({creator:'Joshua English Unit 3',title:'Lesson 8 - Rules, Rights, and Activism',description:'Student opinion workshop for Berani pages 33-41.',styles:styles(),sections:[{...hf('STUDENT HANDOUT'),properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440,header:720,footer:720}}},children}]});
  fs.writeFileSync(handoutPath,await Packer.toBuffer(doc));
}

async function buildLucas(){
  const big=(label,action,fill)=>cell([para(label,{bold:true,size:28,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:80}}),para(action,{size:24,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill,borderColor:C.teal,borderSize:10});
  const children=[...titleBlock('A visual choice pathway'),
    heading('Malia has a hard choice',1),
    para('Point, read, act or say each step.',{italic:true}),
    table([new TableRow({children:[
      big('1  HELP','Malia wants to help orangutans.',C.mint),
      big('2  WAIT','Her teacher says: wait for permission.',C.cream),
      big('3  POST','Malia plans to put the petition online.',C.pale),
    ]})],[3120,3120,3120]),
    heading('What is the conflict?',1),
    para('Malia wants to ____________________.  The teacher wants Malia to ____________________.',{size:24}),
    heading('Choose one action',1),
    table([new TableRow({children:[
      big('WAIT','Follow the instruction.',C.mint),
      big('ASK','Find another approved way.',C.cream),
      big('POST','Use the class webpage.',C.pale),
    ]})],[3120,3120,3120]),
    para('I choose:  WAIT  /  ASK  /  POST',{bold:true,size:26,spacing:{before:180,after:150}}),
    para('Malia should __________________ because _______________________________________________.',{size:24}),
    ...lines(2),
    new Paragraph({children:[new PageBreak()]}),
    heading('Think about effects',1),
    table([new TableRow({children:[
      cell([para('HELP',{bold:true,size:27,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:50}}),para('Who could this action help?',{size:24})],4680,{fill:C.mint}),
      cell([para('RISK',{bold:true,size:27,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:50}}),para('Who could be upset or harmed?',{size:24})],4680,{fill:C.cream}),
    ]})],[4680,4680]),
    ...lines(3),
    heading('My fair rule',1),
    para('It may be okay to bend a rule when ________________________________________________.',{size:24}),
    para('I should also think about ___________________________________________________________.',{size:24}),
    heading('Show your answer',1),
    para('You may point, circle, speak, copy or ask a partner to write your words.',{bold:true,size:24,color:C.teal}),
  ];
  const doc=new Document({creator:'Joshua English Unit 3',title:'Lesson 8 - Lucas visual pathway',description:'Accessible visual judgement pathway for Berani Lesson 8.',styles:styles(24),sections:[{...hf('VISUAL PATHWAY'),properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440,header:720,footer:720}}},children}]});
  fs.writeFileSync(lucasPath,await Packer.toBuffer(doc));
}

function buildHtml(){const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesson 8 - Rules, Rights, and Activism</title><style>
:root{--ink:#192b36;--navy:#173c4e;--teal:#20756e;--mint:#dcefe8;--cream:#fff8e7;--gold:#e9b44c;--coral:#d8644a;--pale:#f4f7f6;--white:#fff;--smoke:#5a6870}*{box-sizing:border-box}body{margin:0;background:#0d2733;color:var(--ink);font-family:Arial,sans-serif;overflow:hidden}.deck{height:100vh}.slide{display:none;position:absolute;inset:0 0 64px;padding:4.5vh 6vw;background:linear-gradient(135deg,#fff 0%,#f2f8f6 100%);overflow:auto}.slide.active{display:block}.hero,.exit{color:#fff;background:radial-gradient(circle at 80% 15%,#2e8477 0 12%,transparent 35%),linear-gradient(135deg,#102f3e,#1d5f60)}.hero:after{content:'WHY';position:absolute;right:5vw;bottom:8vh;font-size:22vw;font-weight:900;color:#fff1;letter-spacing:-.07em}.kicker{font-size:clamp(14px,1.3vw,22px);font-weight:800;letter-spacing:.16em;color:var(--coral);text-transform:uppercase}.title{font-size:clamp(48px,7vw,106px);line-height:.94;max-width:850px;margin:4vh 0 2vh;letter-spacing:-.04em}.sub{font-size:clamp(22px,2.2vw,38px);line-height:1.3;max-width:900px}.slide-title{font-size:clamp(36px,4.4vw,72px);line-height:1;margin:2vh 0 2vh;color:var(--navy);letter-spacing:-.03em}.lead{font-size:clamp(20px,2vw,32px);margin:0 0 2.5vh;max-width:1100px;line-height:1.35}.pill{display:inline-block;background:var(--gold);color:var(--navy);padding:12px 22px;border-radius:999px;font-weight:800;font-size:clamp(18px,1.6vw,27px)}button{font:inherit}.choices,.job-grid,.bench,.model-grid,.exit-grid,.stem-grid,.must-grid{display:grid;gap:1.2vw}.choices{grid-template-columns:repeat(3,1fr)}.choice,.bench-card,.model-part,.stem,.job{border:3px solid #c5d6d2;border-radius:20px;background:#fff;padding:1.4vw;text-align:left;box-shadow:0 9px 20px #173c4e18}.choice{font-size:clamp(20px,1.8vw,31px);cursor:pointer;min-height:24vh}.choice b{display:block;font-size:1.25em;color:var(--navy);margin-bottom:12px}.choice.selected{border-color:var(--coral);transform:translateY(-4px)}.choice .reveal{display:none;margin-top:14px;font-size:.77em;color:var(--smoke)}.choice.selected .reveal{display:block}.job-grid{grid-template-columns:repeat(4,1fr)}.job{border-top:10px solid var(--teal)}.job .num{font-size:clamp(40px,4.5vw,72px);font-weight:900;color:var(--teal);line-height:1}.job h3{font-size:clamp(22px,2vw,32px);margin:8px 0;color:var(--navy)}.job p{font-size:clamp(16px,1.4vw,23px);margin:0;line-height:1.35;color:var(--smoke)}.read-map{display:grid;grid-template-columns:.9fr 2fr;gap:2vw}.page-cue{background:var(--navy);color:#fff;border-radius:22px;padding:2vw}.pages{font-size:clamp(45px,6vw,96px);font-weight:900}.stops{display:grid;gap:1.2vh}.stop{background:#fff;border-left:10px solid var(--gold);padding:1.3vw;border-radius:14px;font-size:clamp(20px,1.8vw,30px)}.sort-layout{display:grid;grid-template-columns:1fr 1.55fr;gap:1.3vw}.bank,.zones{display:grid;gap:7px}.bank{align-content:start}.statement{padding:7px 12px;background:#fff;border:2px solid #b9cbc8;border-radius:12px;text-align:left;cursor:pointer;font-size:clamp(16px,1.4vw,23px)}.statement.selected{border-color:var(--coral);background:#fff0e8}.zones{grid-template-columns:repeat(3,1fr)}.zone{min-height:42vh;border:3px dashed #91aaa5;border-radius:18px;padding:12px;background:#ffffff99}.zone h3{text-align:center;color:var(--navy);font-size:clamp(18px,1.6vw,26px);margin:0 0 12px}.zone .statement{font-size:clamp(14px,1.1vw,19px);margin-bottom:8px}.correct{border-color:var(--teal)!important}.wrong{border-color:var(--coral)!important}.controls{display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap}.btn,.nav button{border:0;border-radius:12px;background:var(--teal);color:#fff;padding:11px 18px;font-weight:800;cursor:pointer}.secondary{background:#dfe8e5!important;color:var(--navy)!important}.feedback{font-weight:800}.bench{grid-template-columns:repeat(3,1fr)}.bench-card{cursor:pointer;min-height:40vh}.bench-card h3{font-size:clamp(24px,2.3vw,38px);color:var(--navy);margin:0 0 8px}.bench-card .who{font-size:clamp(15px,1.2vw,20px);color:var(--coral);font-weight:800;margin:0 0 12px}.bench-card ul{font-size:clamp(17px,1.4vw,24px);line-height:1.45;padding-left:24px;margin:0}.bench-card .risk{display:none;background:var(--cream);padding:10px;border-radius:10px;margin-top:12px}.bench-card.open{border-color:var(--gold)}.bench-card.open .risk{display:block}.model{background:#fff;border:3px solid var(--gold);border-radius:18px;padding:1.4vw;font-size:clamp(17px,1.45vw,25px);line-height:1.45}.model-grid{grid-template-columns:repeat(4,1fr);margin-top:12px}.model-part{cursor:pointer;text-align:center;padding:12px}.model-part b{color:var(--navy)}.model-part span{display:none;font-size:clamp(13px,1vw,17px);color:var(--smoke)}.model-part.open span{display:block}.callout{margin-top:1.4vh;background:var(--navy);color:#fff;border-radius:16px;padding:1.1vw 1.4vw;font-size:clamp(18px,1.6vw,27px)}.callout b{color:var(--gold)}.write-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:1.6vw;align-items:start}.must-grid{grid-template-columns:1fr 1fr;gap:10px}.must{background:#fff;border-left:8px solid var(--teal);border-radius:12px;padding:12px 14px;font-size:clamp(17px,1.45vw,24px)}.stem-grid{grid-template-columns:1fr;gap:10px}.stem{padding:12px 14px;font-size:clamp(16px,1.3vw,22px)}.stem b{display:block;color:var(--navy);margin-bottom:4px}.review{display:grid;grid-template-columns:.8fr 1.5fr;gap:2vw}.timerbox{background:var(--navy);color:#fff;border-radius:22px;padding:2vw;text-align:center}.timer{font-size:clamp(70px,10vw,150px);font-weight:900;color:var(--gold)}.checks{display:grid;gap:12px}.check{background:#fff;border-left:9px solid var(--teal);border-radius:14px;padding:1vw;font-size:clamp(18px,1.55vw,26px)}.check.lang{border-left-color:var(--coral)}.exit-grid{grid-template-columns:1fr 1fr}.ticket{background:#fff;color:var(--navy);border-radius:22px;padding:2.2vw;font-size:clamp(22px,2.2vw,38px);line-height:1.5}.notes{display:none;position:fixed;right:18px;bottom:78px;width:min(460px,42vw);max-height:45vh;overflow:auto;background:#fffbe8;border:3px solid var(--gold);border-radius:15px;padding:14px;z-index:9}.notes.open{display:block}.notes h3{margin:0 0 8px}.nav{height:64px;position:fixed;left:0;right:0;bottom:0;background:#0d2733;display:flex;align-items:center;gap:10px;padding:8px 16px;color:#fff;z-index:10}.nav button{padding:9px 14px;background:#285f65}.progress{height:9px;background:#ffffff28;border-radius:9px;flex:1;overflow:hidden}.progress i{display:block;height:100%;background:var(--gold)}.slide-no{font-weight:800;min-width:56px}.small{font-size:.7em;color:var(--smoke)}@media(max-width:1000px){.slide{padding:3vh 4vw}.job-grid{grid-template-columns:1fr 1fr}.zones{grid-template-columns:1fr}.zone{min-height:12vh}.choices,.bench{gap:8px}.choice,.bench-card{padding:12px}.bench-card{min-height:32vh}.model-grid{grid-template-columns:1fr 1fr}.write-layout{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style></head><body><main class="deck">
<section class="slide hero active" data-notes="Open with the title only. Ask: Is a good cause enough to excuse breaking a rule? Collect two competing first thoughts."><div class="kicker" style="color:#f4cb72">BERANI - LESSON 8</div><h1 class="title">Rules, Rights, and Activism</h1><p class="sub">A good cause. A clear instruction. A hidden plan. Can you argue for a fair choice?</p><span class="pill">follow &nbsp; | &nbsp; bend &nbsp; | &nbsp; break</span></section>
<section class="slide" data-notes="Fictional cold open. Students choose before discussion, then click their option. No choice is automatically correct; require a clear reason."><div class="kicker">COLD OPEN</div><h2 class="slide-title">The posters cannot wait - or can they?</h2><p class="lead">A school bans unapproved corridor posters. A wildlife group learns an animal habitat may be cleared tomorrow. What should they do?</p><div class="choices"><button class="choice" type="button"><b>FOLLOW</b>Wait for approval.<span class="reveal">Protects shared procedures - but delay may reduce the message's value.</span></button><button class="choice" type="button"><b>BEND</b>Find a channel the rule does not mention.<span class="reveal">May preserve the goal - but a loophole can ignore the rule's purpose.</span></button><button class="choice" type="button"><b>BREAK</b>Put the posters up now.<span class="reveal">Acts on urgency - but creates effects and responsibility for others.</span></button></div><div class="controls"><span class="feedback" id="coldFeedback">Choose, then say why that option is strongest.</span></div></section>
<section class="slide" data-notes="Keep this short. Students need these four jobs in the opinion they will write. Do not invent an extra framework."><div class="kicker">MISSION</div><h2 class="slide-title">Build an argument, not just a gut feeling</h2><div class="job-grid"><article class="job"><div class="num">1</div><h3>Claim</h3><p>A qualified position - not an absolute slogan.</p></article><article class="job"><div class="num">2</div><h3>Evidence</h3><p>One accurate detail from the scene.</p></article><article class="job"><div class="num">3</div><h3>Counter</h3><p>A fair reason someone may disagree.</p></article><article class="job"><div class="num">4</div><h3>Judgement</h3><p>A final view with a clear limit.</p></article></div></section>
<section class="slide" data-notes="Read Malia pp. 33-39, then Ari pp. 39-41 as one encounter. Pause only at these three stops. Capture one precise detail each."><div class="kicker">CONCRETE ENCOUNTER</div><h2 class="slide-title">Read for decisions, not just events</h2><div class="read-map"><aside class="page-cue"><div class="kicker" style="color:#f4cb72">BERANI</div><div class="pages">pp. 33-41</div><p>Capture the instruction, the loophole and the audience effect.</p></aside><div class="stops"><div class="stop"><b>STOP 1 - Restriction</b><br>What exactly does Mrs Harwono prohibit, and why?</div><div class="stop"><b>STOP 2 - Online decision</b><br>What does Malia plan, and what does she not disclose?</div><div class="stop"><b>STOP 3 - Ari's reaction</b><br>What changes his intention to sign?</div></div></div></section>
<section class="slide" data-notes="Select a statement then a zone. The quote about real activists belongs under character belief, not text fact. The success of the online petition is only a possible inference and is not confirmed in these pages."><div class="kicker">EVIDENCE BOUNDARY</div><h2 class="slide-title">Fact, belief or inference?</h2><div class="sort-layout"><div class="bank" id="bank"><button class="statement" type="button" data-target="states">Mrs Harwono says the school name is on the petition.</button><button class="statement" type="button" data-target="belief">Malia thinks real activists should not let rules stop them.</button><button class="statement" type="button" data-target="states">Malia decides to post to the class webpage.</button><button class="statement" type="button" data-target="inference">Malia sees the online route as a loophole.</button><button class="statement" type="button" data-target="states">Ari first intends to sign, then refuses.</button><button class="statement" type="button" data-target="belief">Ari believes the warning does not apply to Ginger Juice.</button><button class="statement" type="button" data-target="inference">The petition makes Ari feel personally threatened.</button></div><div class="zones"><div class="zone" data-zone="states"><h3>TEXT STATES</h3></div><div class="zone" data-zone="belief"><h3>CHARACTER BELIEVES</h3></div><div class="zone" data-zone="inference"><h3>WE MAY INFER</h3></div></div></div><div class="controls"><button class="btn" type="button" id="checkSort">Check boundary</button><button class="btn secondary" type="button" id="resetSort">Reset</button><span class="feedback" id="sortFeedback"></span></div></section>
<section class="slide" data-notes="Do not click risks first. Students name a strength, then reveal the risk. Multiple final positions are acceptable when students can defend them with evidence."><div class="kicker">DECISION BENCH</div><h2 class="slide-title">Test three possible responses</h2><p class="lead">Name a strength first. Click only after that to reveal the risk.</p><div class="bench"><button class="bench-card" type="button"><h3>Wait for the principal</h3><p class="who">Pressure: school process + Mrs Harwono</p><ul><li>Honours the school's process</li><li>Lets Mrs Harwono advocate</li></ul><p class="risk"><b>Risk:</b> delay or refusal may silence an urgent message.</p></button><button class="bench-card" type="button"><h3>Seek another channel</h3><p class="who">Pressure: reach people without school endorsement</p><ul><li>Separates activism from school endorsement</li><li>Looks for a lower-harm option</li></ul><p class="risk"><b>Risk:</b> the alternative may reach fewer people or take time.</p></button><button class="bench-card" type="button"><h3>Post to the class page</h3><p class="who">Pressure: urgency + Malia's loophole</p><ul><li>Acts quickly</li><li>Reaches the intended audience</li></ul><p class="risk"><b>Risk:</b> it still uses a school space and hides consequences from others.</p></button></div></section>
<section class="slide" data-notes="Read the whole model first. Ask students to identify each job before clicking labels. Then ask: In pp. 33-39, where is Malia persuading herself? Transfer every part to the handout writing task."><div class="kicker">ANNOTATED MODEL</div><h2 class="slide-title">A strong opinion has four jobs</h2><div class="model">Rules should usually be followed; however, bending one may be justified when urgent harm is at stake and safer options have failed. Mrs Harwono has a reasonable purpose: the petition names the school, so she says principal approval is needed. Yet Malia believes delay protects an unfair situation. Her planned online post may spread the message, but hiding it also shifts risk onto her teacher and classmates. Therefore, Malia's choice is understandable but not fully justified yet. She should first seek another channel that does not claim school approval; if no timely option exists, limited and accountable rule-bending becomes easier to defend.</div><div class="model-grid"><button class="model-part" type="button"><b>Claim</b><span>Qualified, not absolute</span></button><button class="model-part" type="button"><b>Evidence</b><span>Accurate scene detail</span></button><button class="model-part" type="button"><b>Counter</b><span>Fair opposing pressure</span></button><button class="model-part" type="button"><b>Judgement</b><span>Limit or condition</span></button></div><div class="callout"><b>Year 6 / stretch:</b> In pp. 33-39, where is Malia persuading herself? Find “Technically...” and “Real activists...” - belief, not proof.</div></section>
<section class="slide" data-notes="Writing happens on the handout, not on a shared projected draft. Leave this slide up as a checklist and optional stems. Aim for 120-160 words; support pathway 80-100."><div class="kicker">WRITE ON YOUR HANDOUT</div><h2 class="slide-title">Should rules ever be bent for environmental activism?</h2><div class="write-layout"><div><p class="lead" style="margin-bottom:1.5vh">Use your handout. Leave a finished paragraph, not unfinished trackers.</p><div class="must-grid"><div class="must">Qualified claim</div><div class="must">One detail from pp. 33-41</div><div class="must">Fair counterargument</div><div class="must">Final judgement with a limit</div></div></div><aside class="stem-grid"><article class="stem"><b>Optional launches</b>Copy only if you need a start.</article><article class="stem">Rules should usually be followed; however...</article><article class="stem">In pages 33-41...</article><article class="stem">A fair counterargument is that...</article><article class="stem">Rule-bending is justified only if...</article></aside></div></section>
<section class="slide" data-notes="Reviewer asks all three checks. Writer revises one sentence immediately. Swap roles after 50 seconds."><div class="kicker">STRESS-TEST</div><h2 class="slide-title">Find the weak spot</h2><div class="review"><aside class="timerbox"><h3>Reviewer</h3><div class="timer" id="timer">50</div><button class="btn" type="button" id="startTimer">Start / reset</button></aside><div class="checks"><div class="check"><b>Limit:</b> What condition keeps your position fair?</div><div class="check"><b>Consequence:</b> Whose risk or right have you not considered?</div><div class="check lang"><b>Language:</b> Have you treated a belief as a proven fact?</div><div class="check"><b>Revise now:</b> strengthen one sentence before swapping.</div></div></div></section>
<section class="slide" data-notes="Accuracy bridge. Clarify that Malia bends a school instruction; the orangutan-pet statement is a separate law. The principal's response and online success are not shown in these pages."><div class="kicker">ACCURACY CHECK</div><h2 class="slide-title">Do not merge two different rules</h2><div class="exit-grid"><article class="ticket"><b>School instruction</b><br>Do not distribute the petition that names the school until the principal gives permission.</article><article class="ticket"><b>Law named in the petition</b><br>Keeping an orangutan as a pet is described as against the law.</article></div><p class="lead" style="margin-top:3vh">These pages do not show the principal's decision or prove the online petition succeeds.</p></section>
<section class="slide exit" data-notes="Collect one sentence. A strong answer includes both a condition and a safeguard. Use omissions to plan a short reteach."><div class="kicker" style="color:#f4cb72">EXIT EVIDENCE</div><h2 class="slide-title" style="color:#fff">Finish your argument in one line</h2><div class="ticket"><p>Bending a rule may be justified when <b>________________</b>,</p><p>provided that <b>________________</b>.</p></div></section>
</main><aside class="notes" id="notes"><h3>Teacher notes</h3><p id="noteText"></p></aside><nav class="nav"><button id="prev" type="button">&larr; Previous</button><button id="next" type="button">Next &rarr;</button><div class="progress"><i id="bar"></i></div><span class="slide-no" id="slideNo"></span><button id="notesBtn" type="button">Notes</button><button id="resetAll" type="button">Reset</button><button id="full" type="button">Fullscreen</button></nav><script>
const slides=[...document.querySelectorAll('.slide')];let current=0;const notes=document.getElementById('notes'),noteText=document.getElementById('noteText');
function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.classList.toggle('active',i===current));document.getElementById('slideNo').textContent=(current+1)+' / '+slides.length;document.getElementById('bar').style.width=((current+1)/slides.length*100)+'%';noteText.textContent=slides[current].dataset.notes||'No notes.';}
document.getElementById('prev').onclick=()=>show(current-1);
document.getElementById('next').onclick=()=>show(current+1);
document.getElementById('notesBtn').onclick=()=>notes.classList.toggle('open');
document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{if(['TEXTAREA','INPUT'].includes(document.activeElement.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key.toLowerCase()==='n')notes.classList.toggle('open')});
document.querySelectorAll('.choice').forEach(x=>x.onclick=()=>{document.querySelectorAll('.choice').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');document.getElementById('coldFeedback').textContent='Now say one clear reason for that choice.';});
let selected=null;
document.querySelectorAll('.statement').forEach(x=>x.onclick=()=>{selected=x;document.querySelectorAll('.statement').forEach(y=>y.classList.toggle('selected',y===x));});
document.querySelectorAll('.zone').forEach(z=>z.onclick=()=>{if(!selected)return;z.appendChild(selected);selected.classList.remove('selected');selected=null;});
document.getElementById('checkSort').onclick=()=>{let right=0,total=0;document.querySelectorAll('.statement').forEach(x=>{total++;const ok=x.closest('.zone')?.dataset.zone===x.dataset.target;x.classList.toggle('correct',ok);x.classList.toggle('wrong',!ok);if(ok)right++;});document.getElementById('sortFeedback').textContent=right===total?'Boundary secure. Belief is not proof.':right+' / '+total+' secure. Recheck whose voice makes the claim.';};
function resetSort(){document.querySelectorAll('.statement').forEach(x=>{document.getElementById('bank').appendChild(x);x.classList.remove('correct','wrong','selected');});selected=null;document.getElementById('sortFeedback').textContent='';}
document.getElementById('resetSort').onclick=resetSort;
document.querySelectorAll('.bench-card,.model-part').forEach(x=>x.onclick=()=>x.classList.toggle('open'));
let timerId=null;
document.getElementById('startTimer').onclick=()=>{clearInterval(timerId);let t=50;document.getElementById('timer').textContent=t;timerId=setInterval(()=>{t--;document.getElementById('timer').textContent=t;if(t<=0)clearInterval(timerId);},1000);};
function resetAll(){document.querySelectorAll('.choice,.bench-card,.model-part').forEach(x=>x.classList.remove('selected','open'));resetSort();clearInterval(timerId);document.getElementById('timer').textContent='50';document.getElementById('coldFeedback').textContent='Choose, then say why that option is strongest.';}
document.getElementById('resetAll').onclick=resetAll;show(0);
</script></body></html>`;fs.writeFileSync(htmlPath,html,'utf8');}

async function main(){if(process.argv.includes('--html-only')){buildHtml();console.log('Built Lesson 8 presentation.');return;}buildPlan();buildHtml();await buildHandout();await buildLucas();console.log('Built Lesson 8 plan, presentation and handouts.');}
main().catch(e=>{console.error(e);process.exitCode=1});

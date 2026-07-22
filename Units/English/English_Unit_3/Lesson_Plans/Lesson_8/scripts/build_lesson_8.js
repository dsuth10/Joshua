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
    cell([para('WEIGH',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('rule + rights + effects',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
    cell([para('JUDGE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('claim + evidence + counterpoint',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
  ]})],[3120,3120,3120]),
  para('Name: ____________________________________    Class: __________    Date: __________',{italic:true,size:19,spacing:{before:170,after:100}}),
];}

function buildPlan(){const md=`# Lesson 8: Rules, Rights, and Activism

## Lesson purpose

Students evaluate Malia's response to Mrs Harwono's restriction of the petition in *Berani* (pp. 33-39), then use Ari's reaction (pp. 39-41) to consider an activist action's effects on an audience. They distinguish a school instruction from a law, test competing choices against shared criteria, and write a nuanced opinion on whether rules should ever be bent for environmental activism.

## Curriculum focus

- **Year 5 - AC9E5LA02:** move beyond a bare assertion by using relevant textual evidence and reasons.
- **Year 6 - AC9E6LA02:** identify how subjective language and perspective position a reader, and qualify a judgement with a counterargument.

## Learning intention

We are learning to judge when following, bending or breaking a rule may be justified, using criteria and evidence rather than impulse.

## Success criteria

- I can separate what the text states from a character's belief and my inference.
- I can explain the purpose of Mrs Harwono's restriction and Malia's reason for resisting it.
- I can apply the **RULE test** to more than one possible response.
- I can write a clear opinion with a text detail, a counterargument and a reasoned final judgement.
- I can revise one sentence after a peer tests my reasoning.

## The RULE test

- **R - Reason for the rule:** What is the rule trying to protect or manage?
- **U - Urgency and rights:** What harm, need or right makes action important?
- **L - Least harmful alternative:** Could the goal be achieved another way?
- **E - Effects and accountability:** Who may be helped or harmed, and will the activist accept responsibility?

## Preparation

- Open *Berani* to Malia (pp. 33-39) and Ari (pp. 39-41).
- Open \`Lesson_8_Presentation.html\` in a modern browser and select fullscreen.
- Print \`Lesson_8_Handout.docx\`; use \`Lesson_8_Lucas_Handout.docx\` for the supported visual pathway when appropriate.
- Prepare three room positions or desk cards: **follow**, **bend**, **break**.
- Discussion boundary: evaluate the fictional choices in the text. Do not ask students to disclose personal rule-breaking or political beliefs.
- Accuracy boundary: Mrs Harwono gives a school instruction about distributing a petition that names the school. The separate statement that keeping an orangutan as a pet is illegal is not the rule Malia bends.

## Sequence (approximately 60 minutes)

### 1. Cold open: Follow, bend or break? - 5 minutes

Present a fictional dilemma: a school bans unapproved corridor posters; a wildlife group wants to warn students about an urgent local threat. Students choose follow, bend or break, then state the criterion that matters most. Do not announce a correct choice.

### 2. Mission and RULE test - 4 minutes

Introduce the four criteria. Clarify that a strong judgement weighs the rule's purpose as well as the cause. Students predict which criterion Malia may prioritise.

### 3. Read Malia, pp. 33-39 - 9 minutes

Pause after the class response, Mrs Harwono's explanation, and Malia's online decision. Students record: the instruction, Mrs Harwono's reasons, Malia's reasons, and the information Malia withholds.

### 4. Evidence boundary sort - 5 minutes

Classify statements as **text states**, **character believes**, or **reasonable inference**. The key misconception is treating Malia's slogan about “real activists” as the narrator's proven truth.

### 5. Read Ari, pp. 39-41 - 6 minutes

Track Ari's change: intends to sign, reaches the captive-orangutan message, feels personally implicated, then refuses. Ask how this complicates Malia's intended effect.

### 6. Three perspectives, one conflict - 5 minutes

Build a perspective map for Mrs Harwono, Malia and Ari. Require one text detail and one pressure for each. Avoid reducing Mrs Harwono to “against activism” or Ari to “does not care”.

### 7. Decision bench: apply RULE - 6 minutes

Pairs test three options: wait for the principal, seek another approved channel, or post to the class webpage. Each option can earn strengths and risks. Students select a position only after using all four criteria.

### 8. Annotated model - 5 minutes

Reveal the jobs in a model paragraph: qualified claim, text evidence, RULE reasoning, counterargument, final judgement. Emphasise that “sometimes” needs a clear threshold.

### 9. Independent opinion - 9 minutes

Students answer: **Should rules ever be bent for environmental activism?** Aim for 120-160 words. Require a qualified claim, one accurate detail from pp. 33-41, at least two RULE criteria, a counterargument and a final judgement.

### 10. Stress-test and revision - 4 minutes

Reviewer asks: “Which threshold justifies your position?” and “Whose consequence have you not considered?” Writer revises one sentence immediately.

### 11. Exit evidence - 2 minutes

Submit a one-sentence rule: “Bending a rule may be justified when ___, provided that ___.” Use omissions to decide whether to reteach alternatives, effects or evidence boundaries.

## Differentiation

### Support

- Use the evidence bank and pre-labelled character columns on the handout.
- Offer claim frames: “Rules should usually be followed; however ...” or “A rule may be bent only when ...”.
- Let students orally rehearse a claim and counterargument before writing.
- Reduce the writing target to 80-100 words while retaining evidence and a counterpoint.

### Lucas (ICP)

- Use the separate large-print pathway: **HELP orangutans -> WAIT for permission -> POST online**.
- Lucas identifies what Malia wants, what the teacher says, and what Malia chooses.
- He selects **wait / ask another way / post** and completes or dictates: “Malia should ___ because ___.”
- Accept pointing, circling, speaking, partner scribing or copying. Preserve the core judgement rather than replacing it with recall.

### Extend

- Analyse how “Technically, I have not lied” reveals Malia's self-justification.
- Evaluate Mrs Harwono's statement about freedom of expression without assuming the novel proves a complete legal comparison between countries.
- Explain how Ari's response demonstrates audience resistance and an unintended persuasive effect.

## Formative assessment

- The cold open reveals students' default moral rule and whether they can name a criterion.
- The evidence sort exposes confusion between narration, belief and inference.
- The perspective map checks fair representation of opposing pressures.
- The decision bench shows whether students can apply criteria consistently.
- The peer stress-test makes missing thresholds and ignored consequences visible.
- The exit sentence samples the central judgement, not participation.

## Teacher answer guide

- **Mrs Harwono's restriction:** she says Malia has a right to protest, but the school name is on the petition and student actions reflect on the school. She worries parents connected to agriculture and government may be inflamed. She says principal approval is required and promises to try.
- **Malia's choice:** she decides the instruction applies only to paper copies, withholds her online plan, and intends to post to the class webpage. “Technically” signals a loophole; “Real activists don't let rules get in their way” is Malia's belief, not an author-confirmed principle.
- **Ari's response:** he first intends to sign. The captive-orangutan message makes him think of Ginger Juice; he rejects its applicability and withdraws support. This shows activism can reach an audience yet still provoke defensiveness.
- **Defensible positions:** follow, bend or break may be argued if the student applies RULE consistently. Strong answers distinguish urgent environmental harm from convenience, consider approved alternatives, minimise harm to others and include accountability.
- **Evidence boundaries:** these pages do not show the principal's decision or confirm the online petition's success. Do not call Malia's action illegal. The text identifies pet orangutan captivity as against the law; Mrs Harwono's restriction is a school permission issue.
`;fs.writeFileSync(planPath,md,'utf8');}

async function buildHandout(){
  const evidenceRows=[
    ['Mrs Harwono','What instruction does she give?','Why does she give it?'],
    ['Malia','What does she decide?','What does she reveal or conceal?'],
    ['Ari','How does his response change?','What triggers the change?'],
  ];
  const children=[...titleBlock('A criteria-based opinion workshop'),
    heading('1. First judgement',1),
    para('Circle one:  FOLLOW the rule   /   BEND the rule   /   BREAK the rule'),
    para('The criterion that matters most at first is __________________ because ____________________________.'),
    heading('2. Evidence tracker: pages 33-41',1),
    para('Record precise details. Keep facts, beliefs and inferences separate.'),
    table([new TableRow({tableHeader:true,children:[
      cell([para('Perspective',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],1800,{fill:C.navy,borderColor:C.navy}),
      cell([para('Action / instruction',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3180,{fill:C.navy,borderColor:C.navy}),
      cell([para('Reason / pressure',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],4380,{fill:C.navy,borderColor:C.navy}),
    ]}),...evidenceRows.map(([who,a,b])=>new TableRow({children:[cell([para(who,{bold:true,spacing:{after:0}})],1800,{fill:C.mint}),cell([para(a,{italic:true,size:19,spacing:{after:120}}),para('')],3180),cell([para(b,{italic:true,size:19,spacing:{after:120}}),para('')],4380)]}))],[1800,3180,4380]),
    heading('Evidence boundary',2),
    table([new TableRow({children:[
      cell([para('TEXT STATES',{bold:true,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('observable action or direct words',{size:19,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.pale}),
      cell([para('CHARACTER BELIEVES',{bold:true,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('a viewpoint, fear or self-justification',{size:19,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.cream}),
      cell([para('WE MAY INFER',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('a conclusion supported but not stated',{size:19,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),
    ]})],[3120,3120,3120]),
    new Paragraph({children:[new PageBreak()]}),
    heading('3. Apply the RULE test',1),
    para('Test Malia\'s online decision against every criterion before choosing a position.'),
    table([new TableRow({tableHeader:true,children:[cell([para('Criterion',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],1900,{fill:C.teal,borderColor:C.teal}),cell([para('Evidence from the scene',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3760,{fill:C.teal,borderColor:C.teal}),cell([para('What this suggests',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3700,{fill:C.teal,borderColor:C.teal})]}),...[
      ['R - Reason','What is the school instruction trying to protect?'],['U - Urgency / rights','What harm or right makes action important?'],['L - Least harmful option','What else could Malia try?'],['E - Effects / accountability','Who could be helped or harmed?'],
    ].map(([a,b])=>new TableRow({children:[cell([para(a,{bold:true,spacing:{after:0}})],1900,{fill:C.mint}),cell([para(b,{italic:true,size:19,spacing:{after:100}}),para('')],3760),cell([para('')],3700)]}))],[1900,3760,3700]),
    heading('4. Decision bench',1),
    table([new TableRow({tableHeader:true,children:[cell([para('Possible response',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],2600,{fill:C.coral,borderColor:C.coral}),cell([para('Strongest reason for it',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3380,{fill:C.coral,borderColor:C.coral}),cell([para('Most serious risk',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],3380,{fill:C.coral,borderColor:C.coral})]}),...['Wait for the principal','Seek another approved channel','Post to the class webpage'].map(x=>new TableRow({children:[cell([para(x,{bold:true,spacing:{after:0}})],2600,{fill:C.cream}),cell([para('')],3380),cell([para('')],3380)]}))],[2600,3380,3380]),
    para('My position now: ______________________. The criterion carrying the most weight is __________________.'),
    new Paragraph({children:[new PageBreak()]}),
    heading('5. Model anatomy',1),
    table([new TableRow({children:[cell([
      para('MODEL',{bold:true,color:C.coral,size:18,spacing:{after:60}}),
      para('Rules should usually be followed; however, bending one may be justified when urgent harm is at stake and safer options have failed. Mrs Harwono has a reasonable purpose: the petition names the school, so she says principal approval is needed. Yet Malia believes delay protects an unfair situation. Her planned online post may spread the message, but hiding it also shifts risk onto her teacher and classmates. Therefore, Malia\'s choice is understandable but not fully justified yet. She should first seek another channel that does not claim school approval; if no timely option exists, limited and accountable rule-bending becomes easier to defend.',{size:21,spacing:{after:0}}),
    ],9360,{fill:C.cream,borderColor:C.gold})]})],[9360]),
    table([new TableRow({children:[
      cell([para('CLAIM',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('qualified, not absolute',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],1872,{fill:C.mint}),
      cell([para('EVIDENCE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('accurate text detail',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],1872,{fill:C.mint}),
      cell([para('RULE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('criteria explain why',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],1872,{fill:C.mint}),
      cell([para('COUNTER',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('fair opposing pressure',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],1872,{fill:C.mint}),
      cell([para('JUDGEMENT',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('threshold + limits',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],1872,{fill:C.mint}),
    ]})],[1872,1872,1872,1872,1872]),
    heading('6. Plan your opinion',1),
    para('Question: Should rules ever be bent for environmental activism?',{bold:true}),
    table([new TableRow({children:[cell([para('Qualified claim',{bold:true,spacing:{after:50}}),para('Rules should / should not / may be bent when ...',{italic:true,size:19,spacing:{after:0}})],2400,{fill:C.pale}),cell([para('')],6960)]}),new TableRow({children:[cell([para('Text evidence',{bold:true,spacing:{after:50}}),para('One precise detail from pp. 33-41',{italic:true,size:19,spacing:{after:0}})],2400,{fill:C.pale}),cell([para('')],6960)]}),new TableRow({children:[cell([para('Counterargument',{bold:true,spacing:{after:50}}),para('A fair reason someone may disagree',{italic:true,size:19,spacing:{after:0}})],2400,{fill:C.pale}),cell([para('')],6960)]}),new TableRow({children:[cell([para('Threshold',{bold:true,spacing:{after:50}}),para('Only if / provided that ...',{italic:true,size:19,spacing:{after:0}})],2400,{fill:C.pale}),cell([para('')],6960)]})],[2400,6960]),
    new Paragraph({children:[new PageBreak()]}),
    heading('7. Write, stress-test, revise',1),
    para('Write 120-160 words. Include one accurate detail, at least two RULE criteria, a counterargument and a final judgement.'),
    ...lines(7),
    heading('Partner stress-test',1),
    table([new TableRow({children:[cell([para('ASK',{bold:true,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Which threshold makes rule-bending justified?',{size:19,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),cell([para('ASK',{bold:true,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Whose consequence have you not considered?',{size:19,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.mint}),cell([para('REVISE',{bold:true,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Strengthen one sentence now.',{size:19,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.cream})]})],[3120,3120,3120]),
    para('My revised sentence:'),...lines(2),
    heading('Exit evidence',1),
    para('Bending a rule may be justified when ________________________________________________,'),
    para('provided that ______________________________________________________________________.'),
  ];
  const doc=new Document({creator:'Joshua English Unit 3',title:'Lesson 8 - Rules, Rights, and Activism',description:'Student opinion workshop for Berani pages 33-41.',styles:styles(),sections:[{...hf('STUDENT HANDOUT'),properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440,header:720,footer:720}}},children}]});
  fs.writeFileSync(handoutPath,await Packer.toBuffer(doc));
}

async function buildLucas(){
  const big=(label,action,fill)=>cell([para(label,{bold:true,size:28,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:80}}),para(action,{size:24,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill,borderColor:C.teal,borderSize:10});
  const children=[...titleBlock('A visual choice pathway'),heading('Malia has a hard choice',1),para('Point, read, act or say each step.',{italic:true}),table([new TableRow({children:[big('1  HELP','Malia wants to help orangutans.',C.mint),big('2  WAIT','Her teacher says: wait for permission.',C.cream),big('3  POST','Malia plans to put the petition online.',C.pale)]})],[3120,3120,3120]),heading('What is the conflict?',1),para('Malia wants to ____________________.  The teacher wants Malia to ____________________.',{size:24}),heading('Choose one action',1),table([new TableRow({children:[big('WAIT','Follow the instruction.',C.mint),big('ASK','Find another approved way.',C.cream),big('POST','Use the class webpage.',C.pale)]})],[3120,3120,3120]),para('I choose:  WAIT  /  ASK  /  POST',{bold:true,size:26,spacing:{before:180,after:150}}),para('Malia should __________________ because _______________________________________________.',{size:24}),...lines(2),new Paragraph({children:[new PageBreak()]}),heading('Think about effects',1),table([new TableRow({children:[cell([para('HELP',{bold:true,size:27,color:C.teal,alignment:AlignmentType.CENTER,spacing:{after:50}}),para('Who could this action help?',{size:24})],4680,{fill:C.mint}),cell([para('RISK',{bold:true,size:27,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:50}}),para('Who could be upset or harmed?',{size:24})],4680,{fill:C.cream})]})],[4680,4680]),...lines(3),heading('My fair rule',1),para('It may be okay to bend a rule when ________________________________________________.',{size:24}),para('I should also think about ___________________________________________________________.',{size:24}),heading('Show your answer',1),para('You may point, circle, speak, copy or ask a partner to write your words.',{bold:true,size:24,color:C.teal}),
  ];
  const doc=new Document({creator:'Joshua English Unit 3',title:'Lesson 8 - Lucas visual pathway',description:'Accessible visual judgement pathway for Berani Lesson 8.',styles:styles(24),sections:[{...hf('VISUAL PATHWAY'),properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440,header:720,footer:720}}},children}]});
  fs.writeFileSync(lucasPath,await Packer.toBuffer(doc));
}

function buildHtml(){const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesson 8 - Rules, Rights, and Activism</title><style>
:root{--ink:#192b36;--navy:#173c4e;--teal:#20756e;--mint:#dcefe8;--cream:#fff8e7;--gold:#e9b44c;--coral:#d8644a;--pale:#f4f7f6;--white:#fff;--smoke:#5a6870}*{box-sizing:border-box}body{margin:0;background:#0d2733;color:var(--ink);font-family:Arial,sans-serif;overflow:hidden}.deck{height:100vh}.slide{display:none;position:absolute;inset:0 0 64px;padding:4.5vh 6vw;background:linear-gradient(135deg,#fff 0%,#f2f8f6 100%);overflow:auto}.slide.active{display:block}.hero,.exit{color:#fff;background:radial-gradient(circle at 80% 15%,#2e8477 0 12%,transparent 35%),linear-gradient(135deg,#102f3e,#1d5f60)}.hero:after{content:'RULE';position:absolute;right:5vw;bottom:8vh;font-size:22vw;font-weight:900;color:#fff1;letter-spacing:-.07em}.kicker{font-size:clamp(14px,1.3vw,22px);font-weight:800;letter-spacing:.16em;color:var(--coral);text-transform:uppercase}.title{font-size:clamp(48px,7vw,106px);line-height:.94;max-width:850px;margin:4vh 0 2vh;letter-spacing:-.04em}.sub{font-size:clamp(22px,2.2vw,38px);line-height:1.3;max-width:900px}.slide-title{font-size:clamp(36px,4.4vw,72px);line-height:1;margin:2vh 0 2vh;color:var(--navy);letter-spacing:-.03em}.lead{font-size:clamp(20px,2vw,32px);margin:0 0 2.5vh;max-width:1100px;line-height:1.35}.pill{display:inline-block;background:var(--gold);color:var(--navy);padding:12px 22px;border-radius:999px;font-weight:800;font-size:clamp(18px,1.6vw,27px)}button{font:inherit}.choices,.rule-grid,.perspectives,.bench,.model-grid,.exit-grid{display:grid;gap:1.2vw}.choices{grid-template-columns:repeat(3,1fr)}.choice,.perspective,.bench-card,.model-part{border:3px solid #c5d6d2;border-radius:20px;background:#fff;padding:1.4vw;text-align:left;box-shadow:0 9px 20px #173c4e18}.choice{font-size:clamp(20px,1.8vw,31px);cursor:pointer;min-height:24vh}.choice b{display:block;font-size:1.25em;color:var(--navy);margin-bottom:12px}.choice.selected{border-color:var(--coral);transform:translateY(-4px)}.choice .reveal{display:none;margin-top:14px;font-size:.77em;color:var(--smoke)}.choice.selected .reveal{display:block}.rule-grid{grid-template-columns:repeat(4,1fr)}.rule{background:#fff;border-top:10px solid var(--teal);border-radius:16px;padding:1.3vw;box-shadow:0 8px 20px #173c4e14}.rule .letter{font-size:clamp(45px,5vw,82px);font-weight:900;color:var(--teal)}.rule h3{font-size:clamp(20px,1.8vw,29px);margin:0 0 8px}.read-map{display:grid;grid-template-columns:.9fr 2fr;gap:2vw}.page-cue{background:var(--navy);color:#fff;border-radius:22px;padding:2vw}.pages{font-size:clamp(45px,6vw,96px);font-weight:900}.stops{display:grid;gap:1.2vh}.stop{background:#fff;border-left:10px solid var(--gold);padding:1.3vw;border-radius:14px;font-size:clamp(20px,1.8vw,30px)}.sort-layout{display:grid;grid-template-columns:1fr 1.55fr;gap:1.3vw}.bank,.zones{display:grid;gap:7px}.bank{align-content:start}.statement{padding:7px 12px;background:#fff;border:2px solid #b9cbc8;border-radius:12px;text-align:left;cursor:pointer;font-size:clamp(16px,1.4vw,23px)}.statement.selected{border-color:var(--coral);background:#fff0e8}.zones{grid-template-columns:repeat(3,1fr)}.zone{min-height:42vh;border:3px dashed #91aaa5;border-radius:18px;padding:12px;background:#ffffff99}.zone h3{text-align:center;color:var(--navy);font-size:clamp(18px,1.6vw,26px);margin:0 0 12px}.zone .statement{font-size:clamp(14px,1.1vw,19px);margin-bottom:8px}.correct{border-color:var(--teal)!important}.wrong{border-color:var(--coral)!important}.controls{display:flex;align-items:center;gap:12px;margin-top:10px}.btn,.nav button,.toolbox button{border:0;border-radius:12px;background:var(--teal);color:#fff;padding:11px 18px;font-weight:800;cursor:pointer}.secondary{background:#dfe8e5!important;color:var(--navy)!important}.feedback{font-weight:800}.perspectives{grid-template-columns:repeat(3,1fr)}.perspective{cursor:pointer}.perspective h3{font-size:clamp(25px,2.5vw,42px);color:var(--navy);margin:0 0 10px}.perspective p{font-size:clamp(18px,1.5vw,25px);line-height:1.4}.perspective .pressure{display:none;border-top:2px solid #d8e4e1;padding-top:10px;color:var(--coral);font-weight:700}.perspective.open .pressure{display:block}.bench{grid-template-columns:repeat(3,1fr)}.bench-card{cursor:pointer;min-height:43vh}.bench-card h3{font-size:clamp(25px,2.4vw,40px);color:var(--navy);margin:0 0 12px}.bench-card ul{font-size:clamp(17px,1.4vw,24px);line-height:1.45;padding-left:24px}.bench-card .risk{display:none;background:var(--cream);padding:10px;border-radius:10px}.bench-card.open{border-color:var(--gold)}.bench-card.open .risk{display:block}.model{background:#fff;border:3px solid var(--gold);border-radius:18px;padding:1.4vw;font-size:clamp(18px,1.55vw,26px);line-height:1.5}.model-grid{grid-template-columns:repeat(5,1fr);margin-top:12px}.model-part{cursor:pointer;text-align:center;padding:12px}.model-part b{color:var(--navy)}.model-part span{display:none;font-size:clamp(13px,1vw,17px);color:var(--smoke)}.model-part.open span{display:block}.studio{display:grid;grid-template-columns:.7fr 1.5fr;gap:1.4vw}.toolbox{background:var(--navy);color:#fff;border-radius:18px;padding:1.4vw}.toolbox button{display:block;width:100%;margin:8px 0;background:#fff;color:var(--navy)}textarea{width:100%;min-height:35vh;border:3px solid #b9cbc8;border-radius:16px;padding:18px;font:clamp(18px,1.45vw,25px)/1.45 Arial;resize:none}.wordcount{text-align:right;font-weight:800;color:var(--smoke)}.review{display:grid;grid-template-columns:.8fr 1.5fr;gap:2vw}.timerbox{background:var(--navy);color:#fff;border-radius:22px;padding:2vw;text-align:center}.timer{font-size:clamp(70px,10vw,150px);font-weight:900;color:var(--gold)}.checks{display:grid;gap:12px}.check{background:#fff;border-left:9px solid var(--teal);border-radius:14px;padding:1vw;font-size:clamp(18px,1.6vw,27px)}.exit-grid{grid-template-columns:1fr 1fr}.ticket{background:#fff;color:var(--navy);border-radius:22px;padding:2.2vw;font-size:clamp(22px,2.2vw,38px);line-height:1.5}.notes{display:none;position:fixed;right:18px;bottom:78px;width:min(460px,42vw);max-height:45vh;overflow:auto;background:#fffbe8;border:3px solid var(--gold);border-radius:15px;padding:14px;z-index:9}.notes.open{display:block}.notes h3{margin:0 0 8px}.nav{height:64px;position:fixed;left:0;right:0;bottom:0;background:#0d2733;display:flex;align-items:center;gap:10px;padding:8px 16px;color:#fff;z-index:10}.nav button{padding:9px 14px;background:#285f65}.progress{height:9px;background:#ffffff28;border-radius:9px;flex:1;overflow:hidden}.progress i{display:block;height:100%;background:var(--gold)}.slide-no{font-weight:800;min-width:56px}.small{font-size:.7em;color:var(--smoke)}@media(max-width:1000px){.slide{padding:3vh 4vw}.rule-grid{grid-template-columns:1fr 1fr}.zones{grid-template-columns:1fr}.zone{min-height:12vh}.choices,.perspectives,.bench{gap:8px}.choice,.perspective,.bench-card{padding:12px}.bench-card{min-height:35vh}.model-grid{grid-template-columns:repeat(3,1fr)}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style></head><body><main class="deck">
<section class="slide hero active" data-notes="Open with the title only. Ask: Is a good cause enough to excuse breaking a rule? Collect two competing first thoughts."><div class="kicker" style="color:#f4cb72">BERANI - LESSON 8</div><h1 class="title">Rules, Rights, and Activism</h1><p class="sub">A good cause. A clear instruction. A hidden plan. What makes a choice justified?</p><span class="pill">follow &nbsp; | &nbsp; bend &nbsp; | &nbsp; break</span></section>
<section class="slide" data-notes="Fictional cold open. Students choose before discussion, then click their option. No choice is automatically correct; require the criterion underneath it."><div class="kicker">COLD OPEN</div><h2 class="slide-title">The posters cannot wait - or can they?</h2><p class="lead">A school bans unapproved corridor posters. A wildlife group learns an animal habitat may be cleared tomorrow. What should they do?</p><div class="choices"><button class="choice"><b>FOLLOW</b>Wait for approval.<span class="reveal">Protects shared procedures - but delay may reduce the message's value.</span></button><button class="choice"><b>BEND</b>Find a channel the rule does not mention.<span class="reveal">May preserve the goal - but a loophole can ignore the rule's purpose.</span></button><button class="choice"><b>BREAK</b>Put the posters up now.<span class="reveal">Acts on urgency - but creates effects and responsibility for others.</span></button></div><div class="controls"><span class="feedback" id="coldFeedback">Choose, then say: “The criterion that matters most is ...”</span></div></section>
<section class="slide" data-notes="Teach the four criteria. Students predict which Malia prioritises and which Mrs Harwono prioritises. Strong judgement uses all four."><div class="kicker">THE RULE TEST</div><h2 class="slide-title">A cause is not the whole argument</h2><div class="rule-grid"><article class="rule"><div class="letter">R</div><h3>Reason for the rule</h3><p>What is it trying to protect or manage?</p></article><article class="rule"><div class="letter">U</div><h3>Urgency and rights</h3><p>What harm, need or right makes action important?</p></article><article class="rule"><div class="letter">L</div><h3>Least harmful alternative</h3><p>Could the goal be achieved another way?</p></article><article class="rule"><div class="letter">E</div><h3>Effects and accountability</h3><p>Who may be helped or harmed? Who accepts responsibility?</p></article></div></section>
<section class="slide" data-notes="Read Malia pp. 33-39, then Ari pp. 39-41. Pause only at these decision points. Students capture one precise detail at each."><div class="kicker">CONCRETE ENCOUNTER</div><h2 class="slide-title">Read for decisions, not just events</h2><div class="read-map"><aside class="page-cue"><div class="kicker" style="color:#f4cb72">BERANI</div><div class="pages">pp. 33-41</div><p>Capture the instruction, the loophole and the audience effect.</p></aside><div class="stops"><div class="stop"><b>STOP 1 - Restriction</b><br>What exactly does Mrs Harwono prohibit, and why?</div><div class="stop"><b>STOP 2 - Online decision</b><br>What does Malia plan, and what does she not disclose?</div><div class="stop"><b>STOP 3 - Ari's reaction</b><br>What changes his intention to sign?</div></div></div></section>
<section class="slide" data-notes="Select a statement then a zone. The quote about real activists belongs under character belief, not text fact. The success of the online petition is only a possible inference and is not confirmed in these pages."><div class="kicker">EVIDENCE BOUNDARY</div><h2 class="slide-title">Fact, belief or inference?</h2><div class="sort-layout"><div class="bank" id="bank"><button class="statement" data-target="states">Mrs Harwono says the school name is on the petition.</button><button class="statement" data-target="belief">Malia thinks real activists should not let rules stop them.</button><button class="statement" data-target="states">Malia decides to post to the class webpage.</button><button class="statement" data-target="inference">Malia sees the online route as a loophole.</button><button class="statement" data-target="states">Ari first intends to sign, then refuses.</button><button class="statement" data-target="belief">Ari believes the warning does not apply to Ginger Juice.</button><button class="statement" data-target="inference">The petition makes Ari feel personally threatened.</button></div><div class="zones"><div class="zone" data-zone="states"><h3>TEXT STATES</h3></div><div class="zone" data-zone="belief"><h3>CHARACTER BELIEVES</h3></div><div class="zone" data-zone="inference"><h3>WE MAY INFER</h3></div></div></div><div class="controls"><button class="btn" id="checkSort">Check boundary</button><button class="btn secondary" id="resetSort">Reset</button><span class="feedback" id="sortFeedback"></span></div></section>
<section class="slide" data-notes="Click each perspective after students supply one fair pressure. Correct oversimplifications: Mrs Harwono supports a right to protest; Ari initially wants to sign; Malia's environmental concern is genuine even if her method is disputed."><div class="kicker">PERSPECTIVE MAP</div><h2 class="slide-title">One petition, three pressures</h2><div class="perspectives"><button class="perspective"><h3>Mrs Harwono</h3><p>School name, principal approval, parents and community relationships.</p><p class="pressure">Pressure: protect students and the school while respecting Malia's right to protest.</p></button><button class="perspective"><h3>Malia</h3><p>Forest harm, orangutan welfare, consumer information and urgency.</p><p class="pressure">Pressure: act now, while interpreting the instruction as applying only to paper.</p></button><button class="perspective"><h3>Ari</h3><p>Wants to support orangutans - until captivity information points toward Ginger Juice.</p><p class="pressure">Pressure: protect his view of his family while facing uncomfortable evidence.</p></button></div></section>
<section class="slide" data-notes="Pairs apply all four RULE criteria to each option. Click for the risk after students identify a strength. Multiple final positions are acceptable when criteria are used consistently."><div class="kicker">DECISION BENCH</div><h2 class="slide-title">Test three possible responses</h2><div class="bench"><button class="bench-card"><h3>Wait for the principal</h3><ul><li>Honours the school's process</li><li>Lets Mrs Harwono advocate</li></ul><p class="risk"><b>Risk:</b> delay or refusal may silence an urgent message.</p></button><button class="bench-card"><h3>Seek another channel</h3><ul><li>Separates activism from school endorsement</li><li>Looks for a lower-harm option</li></ul><p class="risk"><b>Risk:</b> the alternative may reach fewer people or take time.</p></button><button class="bench-card"><h3>Post to the class page</h3><ul><li>Acts quickly</li><li>Reaches the intended audience</li></ul><p class="risk"><b>Risk:</b> it still uses a school space and hides consequences from others.</p></button></div></section>
<section class="slide" data-notes="Read the whole model first. Ask students to identify each job before clicking labels. Transfer every part to the independent task."><div class="kicker">ANNOTATED MODEL</div><h2 class="slide-title">A strong opinion sets a threshold</h2><div class="model">Rules should usually be followed; however, bending one may be justified when urgent harm is at stake and safer options have failed. Mrs Harwono has a reasonable purpose: the petition names the school, so she says principal approval is needed. Yet Malia believes delay protects an unfair situation. Her planned online post may spread the message, but hiding it also shifts risk onto her teacher and classmates. Therefore, Malia's choice is understandable but not fully justified yet. She should first seek another channel that does not claim school approval; if no timely option exists, limited and accountable rule-bending becomes easier to defend.</div><div class="model-grid"><button class="model-part"><b>Claim</b><span>Qualified, not absolute</span></button><button class="model-part"><b>Evidence</b><span>Accurate scene detail</span></button><button class="model-part"><b>RULE</b><span>Criteria explain why</span></button><button class="model-part"><b>Counter</b><span>Fair opposing pressure</span></button><button class="model-part"><b>Judgement</b><span>Threshold and limits</span></button></div></section>
<section class="slide" data-notes="Students plan on the handout, then draft here or on paper. Buttons insert optional stems at the cursor. The draft saves locally. Aim for 120-160 words."><div class="kicker">BUILD STUDIO</div><h2 class="slide-title">Should rules ever be bent for environmental activism?</h2><div class="studio"><aside class="toolbox"><h3>Optional launches</h3><button data-insert="Rules should usually be followed; however, ">Qualify the claim</button><button data-insert="In pages 33-41, ">Use text evidence</button><button data-insert="A fair counterargument is that ">Add a counterpoint</button><button data-insert="This matters because ">Apply RULE</button><button data-insert="Rule-bending is justified only if ">Set a threshold</button><p>Include: evidence + two criteria + counterargument + judgement.</p></aside><div><textarea id="draft" aria-label="Opinion draft" placeholder="Write your 120-160 word opinion here..."></textarea><div class="wordcount"><span id="wordCount">0</span> words - aim for 120-160</div></div></div></section>
<section class="slide" data-notes="Reviewer asks both questions. Writer must revise one sentence immediately. Swap roles after 50 seconds."><div class="kicker">STRESS-TEST</div><h2 class="slide-title">Find the missing pressure</h2><div class="review"><aside class="timerbox"><h3>Reviewer</h3><div class="timer" id="timer">50</div><button class="btn" id="startTimer">Start / reset</button></aside><div class="checks"><div class="check"><b>Threshold:</b> Which exact condition makes rule-bending justified?</div><div class="check"><b>Consequence:</b> Whose risk or right have you not considered?</div><div class="check"><b>Evidence:</b> Is your detail stated in pp. 33-41?</div><div class="check"><b>Revise now:</b> strengthen one sentence before swapping.</div></div></div></section>
<section class="slide" data-notes="Accuracy bridge. Clarify that Malia bends a school instruction; the orangutan-pet statement is a separate law. The principal's response and online success are not shown in these pages."><div class="kicker">ACCURACY CHECK</div><h2 class="slide-title">Do not merge two different rules</h2><div class="exit-grid"><article class="ticket"><b>School instruction</b><br>Do not distribute the petition that names the school until the principal gives permission.</article><article class="ticket"><b>Law named in the petition</b><br>Keeping an orangutan as a pet is described as against the law.</article></div><p class="lead" style="margin-top:3vh">These pages do not show the principal's decision or prove the online petition succeeds.</p></section>
<section class="slide exit" data-notes="Collect one sentence. A strong answer includes both a condition and a safeguard. Use omissions to plan a short reteach."><div class="kicker" style="color:#f4cb72">EXIT EVIDENCE</div><h2 class="slide-title" style="color:#fff">Write your fair rule</h2><div class="ticket"><p>Bending a rule may be justified when <b>________________</b>,</p><p>provided that <b>________________</b>.</p><p class="small">Name the RULE criterion doing the most work.</p></div></section>
</main><aside class="notes" id="notes"><h3>Teacher notes</h3><p id="noteText"></p></aside><nav class="nav"><button id="prev">&larr; Previous</button><button id="next">Next &rarr;</button><div class="progress"><i id="bar"></i></div><span class="slide-no" id="slideNo"></span><button id="notesBtn">Notes</button><button id="resetAll">Reset</button><button id="full">Fullscreen</button></nav><script>
const slides=[...document.querySelectorAll('.slide')];let current=0;const notes=document.getElementById('notes'),noteText=document.getElementById('noteText');function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.classList.toggle('active',i===current));document.getElementById('slideNo').textContent=(current+1)+' / '+slides.length;document.getElementById('bar').style.width=((current+1)/slides.length*100)+'%';noteText.textContent=slides[current].dataset.notes||'No notes.'}document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);document.getElementById('notesBtn').onclick=()=>notes.classList.toggle('open');document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();document.addEventListener('keydown',e=>{if(['TEXTAREA','INPUT'].includes(document.activeElement.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key.toLowerCase()==='n')notes.classList.toggle('open')});
document.querySelectorAll('.choice').forEach(x=>x.onclick=()=>{document.querySelectorAll('.choice').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');document.getElementById('coldFeedback').textContent='Now justify it with one RULE criterion.'});
let selected=null;document.querySelectorAll('.statement').forEach(x=>x.onclick=()=>{selected=x;document.querySelectorAll('.statement').forEach(y=>y.classList.toggle('selected',y===x))});document.querySelectorAll('.zone').forEach(z=>z.onclick=()=>{if(!selected)return;z.appendChild(selected);selected.classList.remove('selected');selected=null});document.getElementById('checkSort').onclick=()=>{let right=0,total=0;document.querySelectorAll('.statement').forEach(x=>{total++;const ok=x.closest('.zone')?.dataset.zone===x.dataset.target;x.classList.toggle('correct',ok);x.classList.toggle('wrong',!ok);if(ok)right++});document.getElementById('sortFeedback').textContent=right===total?'Boundary secure. Belief is not proof.':right+' / '+total+' secure. Recheck whose voice makes the claim.'};function resetSort(){document.querySelectorAll('.statement').forEach(x=>{document.getElementById('bank').appendChild(x);x.classList.remove('correct','wrong','selected')});selected=null;document.getElementById('sortFeedback').textContent=''}document.getElementById('resetSort').onclick=resetSort;
document.querySelectorAll('.perspective,.bench-card,.model-part').forEach(x=>x.onclick=()=>x.classList.toggle('open'));
const draft=document.getElementById('draft');function count(){const n=draft.value.trim().split(/\\s+/).filter(Boolean).length;document.getElementById('wordCount').textContent=n;localStorage.setItem('lesson8-draft',draft.value)}draft.value=localStorage.getItem('lesson8-draft')||'';draft.addEventListener('input',count);document.querySelectorAll('[data-insert]').forEach(b=>b.onclick=()=>{draft.setRangeText(b.dataset.insert,draft.selectionStart,draft.selectionEnd,'end');draft.focus();count()});count();let timerId=null;document.getElementById('startTimer').onclick=()=>{clearInterval(timerId);let t=50;document.getElementById('timer').textContent=t;timerId=setInterval(()=>{t--;document.getElementById('timer').textContent=t;if(t<=0)clearInterval(timerId)},1000)};
function resetAll(){document.querySelectorAll('.choice,.perspective,.bench-card,.model-part').forEach(x=>x.classList.remove('selected','open'));resetSort();draft.value='';localStorage.removeItem('lesson8-draft');count();clearInterval(timerId);document.getElementById('timer').textContent='50';document.getElementById('coldFeedback').textContent='Choose, then say: “The criterion that matters most is ...”'}document.getElementById('resetAll').onclick=resetAll;show(0);
</script></body></html>`;fs.writeFileSync(htmlPath,html,'utf8');}

async function main(){if(process.argv.includes('--html-only')){buildHtml();console.log('Built Lesson 8 presentation.');return;}buildPlan();buildHtml();await buildHandout();await buildLucas();console.log('Built Lesson 8 plan, presentation and handouts.');}
main().catch(e=>{console.error(e);process.exitCode=1});

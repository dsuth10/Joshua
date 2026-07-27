const fs=require('fs'),path=require('path');
const {AlignmentType,BorderStyle,Document,Footer,Header,PageBreak,PageNumber,Packer,Paragraph,ShadingType,Table,TableCell,TableLayoutType,TableRow,TextRun,VerticalAlign,WidthType}=require('docx');
const dir=path.resolve(__dirname,'..'),planPath=path.join(dir,'Lesson_9_Plan.md'),htmlPath=path.join(dir,'Lesson_9_Presentation.html'),handoutPath=path.join(dir,'Lesson_9_Handout.docx'),lucasPath=path.join(dir,'Lesson_9_Lucas_Handout.docx');
const C={ink:'20303C',navy:'243B53',blue:'3D6B8E',lilac:'E7E4F3',paper:'FFF9EC',gold:'D7A43B',coral:'C85C4A',sage:'DDEBE3',pale:'F5F7F6',white:'FFFFFF',smoke:'65727A',line:'BAC8C5'};
const border=(color=C.line,size=6)=>({style:BorderStyle.SINGLE,color,size}),borders=(color=C.line,size=6)=>({top:border(color,size),bottom:border(color,size),left:border(color,size),right:border(color,size)});
const run=(text,o={})=>new TextRun({text,font:'Arial',size:22,color:C.ink,...o});
function para(text,o={}){const{bold,italic,color,size,children,...po}=o;return new Paragraph({spacing:{after:120,line:300,lineRule:'auto'},...po,children:children||[run(text,{bold,italics:italic,color,size})]})}
function heading(text,l=1){return new Paragraph({style:l===1?'Heading1':'Heading2',children:[run(text)]})}
function styles(base=22){return{default:{document:{run:{font:'Arial',size:base,color:C.ink},paragraph:{spacing:{after:120,line:300,lineRule:'auto'}}}},paragraphStyles:[
{id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Arial',bold:true,size:32,color:C.navy},paragraph:{spacing:{before:280,after:120},keepNext:true,outlineLevel:0}},
{id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Arial',bold:true,size:26,color:C.blue},paragraph:{spacing:{before:220,after:100},keepNext:true,outlineLevel:1}}]}}
function cell(children,width,o={}){return new TableCell({width:{size:width,type:WidthType.DXA},verticalAlign:o.verticalAlign||VerticalAlign.CENTER,margins:{top:100,bottom:100,left:140,right:140},borders:borders(o.borderColor||C.line,o.borderSize||6),shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR}:undefined,children})}
function table(rows,widths){return new Table({width:{size:9360,type:WidthType.DXA},indent:{size:120,type:WidthType.DXA},layout:TableLayoutType.FIXED,columnWidths:widths,rows})}
function lines(n=4){return Array.from({length:n},()=>para('________________________________________________________________________________',{size:20,color:C.smoke,spacing:{before:70,after:80}}))}
function hf(label){return{headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:80},children:[run('ENGLISH UNIT 3  |  '+label,{bold:true,size:16,color:C.smoke})]})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run('Lesson 9  |  Page ',{size:16,color:C.smoke}),new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.smoke})]})]})}}}
function titleBlock(sub){return[para('BERANI  |  LESSON 9',{bold:true,size:20,color:C.coral,spacing:{after:40}}),para('One Paragraph, Four Parts',{bold:true,size:40,color:C.navy,spacing:{after:70}}),para(sub,{bold:true,size:23,color:C.smoke,spacing:{after:160}}),table([new TableRow({children:[
cell([para('READ',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('pp. 43-47',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.lilac}),
cell([para('LABEL',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('topic + 2 details + close',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.lilac}),
cell([para('WRITE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:20}}),para('choose a prompt',{alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill:C.lilac})]})],[3120,3120,3120]),para('Name: ____________________________________    Class: __________    Date: __________',{italic:true,size:19,spacing:{before:170,after:100}})]}

/* Three teaching cuts from Berani pp. 43-47 — each maps cleanly to Topic / Detail 1 / Detail 2 / Close */
const MODELS=[
{label:'Model 1 — Papa loved Canada',page:'pp. 43-44',
 parts:[
  {job:'Topic sentence',text:'Papa loved Canada.'},
  {job:'Detail 1',text:'He walked around wearing a Blue Jays baseball cap and a Raptors basketball T-shirt.'},
  {job:'Detail 2',text:"He even swam in the lake every day, which was far too cold for me. 'Maple syrup in my veins!' he would shout to us proudly."},
  {job:'Closing meaning',text:"So, as I sit and try to complain about moving to Toronto, all I can hear him saying is, 'All that fresh air and clean water ... Yes, it's a terrible, terrible place.'"}
 ]},
{label:'Model 2 — Mum, the straight shooter',page:'pp. 44-45',
 parts:[
  {job:'Topic sentence',text:'My mum, on the other hand, is more what you would call a straight shooter.'},
  {job:'Detail 1',text:'She is fun and seriously fearless. I\'ve watched her surf and scuba dive and bungee jump.'},
  {job:'Detail 2',text:'One time at the cottage my grandfather said he thought he\'d heard a bear by the rubbish bins, and it was Mum who went outside, banging two pots together and yelling at it to go away.'},
  {job:'Closing meaning',text:'Strong-willed is how Papa described her. What he would actually say was, \'You are every bit as strong-willed as your mother.\''}
 ]},
{label:'Model 3 — How they met',page:'p. 45',
 parts:[
  {job:'Topic sentence',text:'My parents met at the University of Toronto where Papa was doing his PhD in bioethics and Mum was doing her master\'s degree in linguistic studies, specialising in Asian languages.'},
  {job:'Detail 1',text:'She was learning to speak Bahasa, so when someone told her about my dad being at the university, she sent him an email asking if she could take him out for coffee to practise her conversational skills.'},
  {job:'Detail 2',text:'The coffee date turned into happily ever after.'},
  {job:'Closing meaning',text:'Papa would joke that Mum never stopped practising her conversational skills on him, and Mum says she knew she\'d nailed the language when she managed to win an argument with him in Bahasa.'}
 ]}
];

/* Sentence-choice practice: one focus, four slots, three options each (2 on-topic, 1 off-topic) */
const PRACTICE={
 focus:'Sitting under the mango tree helped Malia talk to Papa.',
 slots:[
  {job:'Topic sentence',options:[
   {text:'Sitting under the mango tree helped Malia talk to Papa.',good:true},
   {text:'The mango tree was where Malia went when she needed Papa to listen.',good:true},
   {text:'Oma wore large designer sunglasses and a silk headscarf.',good:false}
  ]},
  {job:'Detail 1',options:[
   {text:'The earth felt moist and spongy under the heavy branches after the rain.',good:true},
   {text:'She brushed dead petals from Papa\'s gravestone and breathed in the tuberoses.',good:true},
   {text:'She still had to finish her online petition for class.',good:false}
  ]},
  {job:'Detail 2',options:[
   {text:'She tried to complain about leaving Indonesia, hoping he would take her side.',good:true},
   {text:'She told him about the orangutan petitions and letters she had started.',good:true},
   {text:'Mum was forever helping graduate students with visa applications.',good:false}
  ]},
  {job:'Closing meaning',options:[
   {text:'Even so, sitting there did not make the move feel any easier.',good:true},
   {text:'Talking to Papa under that tree still felt like the closest thing to home.',good:true},
   {text:'The coffee date turned into happily ever after.',good:false}
  ]}
 ]
};

const PROMPTS=[
{title:'A place with feeling',text:'Write about a place that holds strong feelings for you. Keep one clear focus.'},
{title:'Someone who stands out',text:'Write about a person in your family or life who stands out. Keep every sentence on that person.'},
{title:'A plan that changed',text:'Write about a plan that changed. End with what that change meant.'}
];

function buildPlan(){const md=`# Lesson 9: One Paragraph, Four Parts

## Lesson purpose

Students learn a simple four-part paragraph structure using strong cuts from Malia's memories on pages 43-47 of *Berani*. They label topic sentence, two supporting details and a closing meaning in three model paragraphs, practise choosing on-topic sentences for each part, then write their own paragraph from one of three prompts.

## Curriculum focus

- **Year 5 - AC9E5LA03:** describe how a literary text is organised into paragraphs and how topic sentences and supporting details create cohesion.
- **Year 6 - AC9E6LA03:** explain how an author adapts paragraph structure and sentence placement to guide focus and create emphasis.

## Learning intention

We are learning to build one clear paragraph with a topic sentence, two details that belong, and a closing that adds meaning.

## Success criteria

- I can name the four parts of a paragraph: topic sentence, detail 1, detail 2, closing meaning.
- I can label those parts in a Berani paragraph.
- I can choose sentences that stay on the same focus and reject a sentence that changes the topic.
- I can write my own four-part paragraph from a chosen prompt.

## The four parts

1. **Topic sentence** — tells the reader the one focus of this paragraph.
2. **Detail 1** — a fact, action or image that develops that focus.
3. **Detail 2** — a second belonging detail that builds the picture.
4. **Closing meaning** — leaves the reader with reflection, feeling or emphasis.

## Preparation

- Open *Berani* to Malia, pages 43-47.
- Open \`Lesson_9_Presentation.html\` and select fullscreen.
- Print \`Lesson_9_Handout.docx\`; use \`Lesson_9_Lucas_Handout.docx\` where appropriate.
- Privacy choice: students may write a real, altered or entirely invented memory. Do not require disclosure of grief or family circumstances.

## Sequence (approximately 55-60 minutes)

### 1. Hook and four parts - 5 minutes

Show the four-part frame. Stress: every sentence must stay on one focus; a sentence that changes the topic belongs in a different paragraph.

### 2. Model 1: Papa loved Canada - 8 minutes

Read the cut aloud. Students predict which sentence is the topic, which are details, and which closes with meaning. Reveal labels together. Prove each choice with the focus “Papa loved Canada.”

### 3. Model 2: Mum, the straight shooter - 8 minutes

Repeat the deconstruction. Compare how Detail 2 (the bear story) still belongs because it proves Mum is fearless / strong-willed.

### 4. Model 3: How they met - 8 minutes

Third pass. Students should now name the four parts with less prompting. Highlight the closing joke as meaning, not a new topic.

### 5. Sentence-choice practice - 10 minutes

Focus sentence: “Sitting under the mango tree helped Malia talk to Papa.” For each of the four parts, students choose from three sentences: two stay on topic; one changes the topic. Each choice appears in a growing paragraph under the options. On-topic sentences stay dark; intruders appear in red. Students tap a red sentence to remove it and choose a replacement. This is practice only — not the final draft.

### 6. Choose a writing prompt - 3 minutes

Students pick one of three prompts: a place with feeling; someone who stands out; a plan that changed.

### 7. Independent writing - 12 minutes

Students write a four-part paragraph (about 80-120 words). Remind them to reject any sentence that would open a new topic.

### 8. Exit check - 3 minutes

Students underline their topic sentence and circle one detail, then write one line: “This detail belongs because ...”

## Differentiation

### Support

- Use the labelled model cards on the handout.
- Allow a three-sentence paragraph first (topic + one detail + close), then add Detail 2.
- Provide stems: “This paragraph is about ...”, “One detail is ...”, “This matters because ...”

### Lucas (ICP)

- Use the separate large-print pathway.
- Focus sentence: “Malia is sad for Papa.”
- Choose belonging details (grave, Canada memory, moving without him) and reject the Oma clothing intruder.
- Build or dictate three sentences that stay on that focus.

### Extend

- Explain why a vivid off-topic sentence is still “good writing” but wrong for this paragraph.
- Add a fifth sentence only if it deepens the same focus; justify the choice.
- Revise the same paragraph for a different prompt by changing the topic sentence and selecting new details.

## Formative assessment

- Model labelling shows whether students can name the four jobs.
- Sentence-choice reveals relevance vs vividness misconceptions.
- The written paragraph shows transfer of the four-part frame.
- The exit line diagnoses whether students can justify belonging.

## Teacher answer guide

### Model 1 (Papa)
- Topic: Papa loved Canada.
- Detail 1: Blue Jays cap and Raptors T-shirt.
- Detail 2: Cold lake / “Maple syrup in my veins!”
- Close: Papa’s joke about Toronto being a “terrible, terrible place.”

### Model 2 (Mum)
- Topic: My mum ... is more what you would call a straight shooter.
- Detail 1: Fun and fearless — surf, scuba, bungee.
- Detail 2: Bear / pots story.
- Close: Strong-willed / “every bit as strong-willed as your mother.”

### Model 3 (How they met)
- Topic: My parents met at the University of Toronto ...
- Detail 1: Email asking for coffee to practise Bahasa.
- Detail 2: Coffee date turned into happily ever after.
- Close: Joke about conversational skills / winning an argument in Bahasa.

### Sentence-choice intruders (reject these)
- Topic slot: Oma’s designer sunglasses and silk headscarf.
- Detail 1 slot: online petition for class.
- Detail 2 slot: Mum helping graduate students with visas.
- Closing slot: “The coffee date turned into happily ever after.” (belongs to Model 3, not the mango-tree focus)

### Accuracy note
Teaching cuts trim longer Berani paragraphs so the four jobs are visible. Students may check the full pages in the novel for surrounding sentences.
`;fs.writeFileSync(planPath,md,'utf8')}

async function buildHandout(){const children=[...titleBlock('Topic sentence, two details, closing meaning'),
heading('1. The four parts',1),
table([new TableRow({children:[
cell([para('1  TOPIC',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('One clear focus',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.lilac}),
cell([para('2  DETAIL 1',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('Belongs to the focus',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.lilac}),
cell([para('3  DETAIL 2',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('Builds the picture',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.lilac}),
cell([para('4  CLOSE',{bold:true,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:30}}),para('Adds meaning',{size:18,alignment:AlignmentType.CENTER,spacing:{after:0}})],2340,{fill:C.lilac})
]})],[2340,2340,2340,2340]),
heading('2. Label the Berani models',1),para('For each model, write T / D1 / D2 / C beside the matching sentence (or copy the job names).'),
...MODELS.flatMap((m,i)=>[
heading(m.label+' ('+m.page+')',2),
table([new TableRow({tableHeader:true,children:[
cell([para('Job',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],2200,{fill:C.navy,borderColor:C.navy}),
cell([para('Sentence from Berani',{bold:true,color:C.white,alignment:AlignmentType.CENTER,spacing:{after:0}})],7160,{fill:C.navy,borderColor:C.navy})
]}),
...m.parts.map((p,j)=>new TableRow({children:[
cell([para(p.job,{bold:true,spacing:{after:0}})],2200,{fill:j%2?C.paper:C.lilac}),
cell([para(p.text,{size:20,spacing:{after:0}})],7160,{fill:j%2?C.paper:C.lilac})
]}))
],[2200,7160]),
i<MODELS.length-1?new Paragraph({children:[new PageBreak()]}):para('')
]),
heading('3. Sentence-choice practice',1),
para('Focus: '+PRACTICE.focus,{bold:true}),
para('For each part, tick the two sentences that stay on topic. Cross out the intruder.'),
...PRACTICE.slots.map((slot,i)=>[
heading((i+1)+'. '+slot.job,2),
...slot.options.map(o=>para((o.good?'[  ]  ':'[  ]  ')+o.text,{size:20}))
]).flat(),
new Paragraph({children:[new PageBreak()]}),
heading('4. Choose a prompt and write',1),
...PROMPTS.map((p,i)=>para((i+1)+'. '+p.title+': '+p.text,{size:21})),
para('My chosen prompt number: ______',{bold:true,spacing:{before:160}}),
para('Topic sentence: ________________________________________________________________'),
para('Detail 1: ______________________________________________________________________'),
para('Detail 2: ______________________________________________________________________'),
para('Closing meaning: _______________________________________________________________'),
heading('5. Draft',1),para('Write 80-120 words. Keep every sentence on your focus.'),...lines(8),
heading('Exit',1),para('This detail belongs because ______________________________________________________.')];
const doc=new Document({creator:'Joshua English Unit 3',title:'Lesson 9 - One Paragraph Four Parts',description:'Four-part paragraph workshop using Berani pages 43-47.',styles:styles(),sections:[{...hf('STUDENT HANDOUT'),properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440,header:708,footer:708}}},children}]});fs.writeFileSync(handoutPath,await Packer.toBuffer(doc))}

async function buildLucas(){const big=(t,d,fill)=>cell([para(t,{bold:true,size:27,color:C.navy,alignment:AlignmentType.CENTER,spacing:{after:60}}),para(d,{size:23,alignment:AlignmentType.CENTER,spacing:{after:0}})],3120,{fill,borderColor:C.blue,borderSize:9});
const children=[...titleBlock('A visual four-part pathway'),
heading('One paragraph, one focus',1),
table([new TableRow({children:[cell([para('TOPIC SENTENCE',{bold:true,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Malia is sad for Papa.',{bold:true,size:28,alignment:AlignmentType.CENTER,spacing:{after:0}})],9360,{fill:C.paper,borderColor:C.gold})]})],[9360]),
heading('Which details belong?',1),para('Circle the details that stay with the topic sentence. Cross out the intruder.'),
table([new TableRow({children:[big('BELONGS?','Malia sits beside Papa\'s grave.',C.lilac),big('BELONGS?','She remembers Papa in Canada.',C.sage),big('BELONGS?','Moving without him hurts.',C.lilac)]})],[3120,3120,3120]),
table([new TableRow({children:[cell([para('INTRUDER?',{bold:true,color:C.coral,alignment:AlignmentType.CENTER,spacing:{after:40}}),para('Oma wears designer sunglasses and a silk headscarf.',{size:24,alignment:AlignmentType.CENTER,spacing:{after:0}})],9360,{fill:C.paper})]})],[9360]),
para('The Oma detail belongs in a different paragraph because ______________________________________.'),
heading('Build four short parts',1),
para('1 Topic: Malia is sad for Papa.',{size:24}),
para('2 Detail 1: She ________________________________________________________________________',{size:24}),
para('3 Detail 2: She also ____________________________________________________________________',{size:24}),
para('4 Close: This makes her feel ____________________________________________________________',{size:24}),
...lines(2),
new Paragraph({children:[new PageBreak()]}),
heading('Choose a prompt',1),
para('1. A place with feeling',{size:24}),
para('2. Someone who stands out',{size:24}),
para('3. A plan that changed',{size:24}),
para('My prompt number: ______',{bold:true,size:24,spacing:{before:120}}),
heading('Show your answer',1),para('You may point, circle, speak, copy or ask a partner to write your words.',{bold:true,size:24,color:C.blue})];
const doc=new Document({creator:'Joshua English Unit 3',title:'Lesson 9 - Lucas visual pathway',description:'Accessible four-part paragraph pathway for Berani Lesson 9.',styles:styles(24),sections:[{...hf('VISUAL PATHWAY'),properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440,header:708,footer:708}}},children}]});fs.writeFileSync(lucasPath,await Packer.toBuffer(doc))}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function modelSlide(m,index){
 const parts=m.parts.map((p,i)=>`<button class="part-card" type="button"><span class="part-num">${i+1}</span><p class="part-text">${esc(p.text)}</p><p class="part-job">${esc(p.job)}</p></button>`).join('');
 return `<section class="slide" data-notes="Read the cut. Students predict each job before you tap to reveal. Keep proving choices against the topic sentence.">
<div class="kicker">MODEL ${index} · ${esc(m.page)}</div>
<h2 class="slide-title">${esc(m.label.replace(/^Model \\d+ — /,''))}</h2>
<p class="do-this"><b>Your turn:</b> For each sentence, say the job: Topic, Detail 1, Detail 2, or Closing. Then tap to check.</p>
<div class="part-grid">${parts}</div>
</section>`;
}

function practiceSlotHtml(){
 return PRACTICE.slots.map((slot,si)=>{
  const opts=slot.options.map((o,oi)=>`<button class="choice" type="button" data-slot="${si}" data-good="${o.good}" data-opt="${oi}" data-text="${esc(o.text)}"><b>${String.fromCharCode(65+oi)}</b>${esc(o.text)}</button>`).join('');
  return `<div class="slot-block" data-slot-panel="${si}" ${si===0?'':'hidden'}>
<p class="lead"><b>Part ${si+1} — ${esc(slot.job)}</b></p>
<div class="choices three">${opts}</div>
</div>`;
 }).join('');
}

function buildHtml(){
 const modelSlides=MODELS.map((m,i)=>modelSlide(m,i+1)).join('\n');
 const promptCards=PROMPTS.map((p,i)=>`<button class="prompt-card" type="button" data-prompt="${i}"><span class="part-num">${i+1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></button>`).join('');

 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesson 9 - One Paragraph, Four Parts</title><style>
:root{--ink:#20303c;--navy:#243b53;--blue:#3d6b8e;--lilac:#e7e4f3;--paper:#fff9ec;--gold:#d7a43b;--coral:#c85c4a;--sage:#ddebe3;--pale:#f5f7f6;--white:#fff;--smoke:#65727a}*{box-sizing:border-box}body{margin:0;background:#182b3a;color:var(--ink);font-family:Arial,sans-serif;overflow:hidden}.slide{display:none;position:absolute;inset:0 0 64px;padding:3.6vh 5.5vw;background:linear-gradient(135deg,#fff,#f4f2f9);overflow:auto}.slide.active{display:block}.hero,.exit{color:#fff;background:radial-gradient(circle at 82% 20%,#55799a 0 12%,transparent 34%),linear-gradient(135deg,#1e3348,#453f66)}.hero:after{content:'4';position:absolute;right:7vw;bottom:5vh;font:900 35vw Georgia;color:#fff1}.kicker{font-size:clamp(14px,1.25vw,21px);font-weight:900;letter-spacing:.16em;color:var(--coral);text-transform:uppercase}.title{font-size:clamp(48px,6.8vw,100px);line-height:.93;margin:4vh 0 2vh;letter-spacing:-.05em}.sub{font-size:clamp(22px,2.2vw,38px);line-height:1.3;max-width:920px}.slide-title{font-size:clamp(30px,3.8vw,60px);line-height:1.05;margin:1.2vh 0;color:var(--navy);letter-spacing:-.035em}.lead{font-size:clamp(18px,1.7vw,28px);line-height:1.35;margin:0 0 1.2vh}.do-this{display:block;background:var(--navy);color:#fff;border-radius:14px;padding:12px 18px;font-size:clamp(17px,1.55vw,26px);font-weight:800;line-height:1.35;margin:0 0 1.6vh}.do-this b{color:var(--gold)}.tag{display:inline-block;background:var(--gold);color:var(--navy);padding:11px 22px;border-radius:999px;font-weight:900;font-size:clamp(18px,1.5vw,26px)}button{font:inherit}.frame-grid,.part-grid,.choices,.prompt-grid,.exit-grid{display:grid;gap:1vw}.frame-grid{grid-template-columns:repeat(4,1fr)}.frame{background:#fff;border:3px solid #c5d0ce;border-radius:18px;padding:1.2vw;box-shadow:0 8px 20px #243b5314;border-top:10px solid var(--blue)}.frame .num{font-size:clamp(36px,4.5vw,70px);font-weight:900;color:var(--blue);line-height:1}.frame h3{font-size:clamp(18px,1.6vw,26px);margin:8px 0;color:var(--navy)}.frame p{margin:0;font-size:clamp(15px,1.25vw,21px);color:var(--smoke)}.part-grid{grid-template-columns:1fr 1fr;gap:1vw}.part-card{background:#fff;border:3px solid #c5d0ce;border-radius:18px;padding:1.1vw 1.2vw 1.1vw 1.2vw;text-align:left;cursor:pointer;box-shadow:0 8px 20px #243b5314;position:relative}.part-card .part-num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--blue);color:#fff;font-weight:900;margin-bottom:8px}.part-text{font-size:clamp(15px,1.35vw,23px);line-height:1.35;margin:0 0 8px}.part-job{display:none;margin:0;color:var(--coral);font-weight:900;font-size:clamp(15px,1.3vw,22px)}.part-card.open{border-color:var(--gold);background:var(--paper)}.part-card.open .part-job{display:block}.choices{grid-template-columns:1fr;gap:.8vw}.choices.three{grid-template-columns:1fr}.choice,.prompt-card{background:#fff;border:3px solid #c5d0ce;border-radius:18px;padding:1.1vw;text-align:left;cursor:pointer;box-shadow:0 8px 20px #243b5314;font-size:clamp(16px,1.4vw,24px);line-height:1.35}.choice b{display:inline-block;min-width:1.4em;color:var(--navy);margin-right:8px}.choice.selected{border-color:var(--blue);background:var(--lilac)}.choice.good{border-color:#27836f}.choice.bad{border-color:var(--coral)}.prompt-grid{grid-template-columns:repeat(3,1fr)}.prompt-card h3{margin:8px 0;color:var(--navy);font-size:clamp(20px,1.8vw,30px)}.prompt-card.selected{border-color:var(--blue);background:var(--lilac)}.studio{display:grid;grid-template-columns:.85fr 1.4fr;gap:1.2vw}.toolbox{background:var(--navy);color:#fff;border-radius:18px;padding:1.2vw}.toolbox ol{margin:0 0 12px;padding-left:1.2em;font-size:clamp(15px,1.3vw,22px);line-height:1.4}.toolbox .picked{background:#fff2;border-radius:12px;padding:10px;margin-bottom:10px;font-size:clamp(15px,1.25vw,21px)}.toolbox button,.btn,.nav button{border:0;border-radius:11px;padding:10px 16px;font-weight:900;cursor:pointer}.toolbox button{display:block;width:100%;margin:7px 0;background:#fff;color:var(--navy)}textarea{width:100%;min-height:32vh;border:3px solid #bccbc8;border-radius:16px;padding:17px;font:clamp(17px,1.35vw,23px)/1.45 Arial;resize:none}.wordcount{text-align:right;font-weight:900;color:var(--smoke)}.ticket{background:#fff;color:var(--navy);border-radius:20px;padding:2vw;font-size:clamp(20px,1.9vw,32px);line-height:1.5}.controls{display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap}.btn{background:var(--blue);color:#fff}.secondary{background:#dfe7e4;color:var(--navy)}.feedback{font-weight:900;font-size:clamp(15px,1.3vw,22px)}.slot-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 1vh}.slot-nav button{background:#dfe7e4;color:var(--navy)}.slot-nav button.on{background:var(--blue);color:#fff}.slot-nav button.filled{outline:2px solid #27836f}.slot-nav button.has-intruder{outline:2px solid var(--coral)}.built-wrap{margin-top:1.4vh;background:#fff;border:3px solid var(--gold);border-radius:18px;padding:1.2vw 1.4vw;box-shadow:0 8px 20px #243b5314}.built-label{font-size:clamp(14px,1.2vw,20px);font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);margin:0 0 .6vh}.built-para{font-size:clamp(17px,1.45vw,25px);line-height:1.55;min-height:4.5em;margin:0}.built-sent{display:inline;margin:0 .15em 0 0;padding:2px 4px;border-radius:6px;border:0;background:transparent;font:inherit;color:var(--ink);cursor:pointer;text-align:left}.built-sent:hover{background:var(--lilac)}.built-sent.intruder{color:var(--coral);font-weight:800;background:#fde8e4;text-decoration:underline;text-decoration-thickness:2px}.built-sent .x{display:inline-block;margin-left:4px;font-weight:900;color:var(--coral);font-size:.85em}.built-empty{color:#a0aab0;font-style:italic}.built-hint{margin:.6vh 0 0;font-size:clamp(14px,1.2vw,19px);color:var(--smoke)}.notes{display:none;position:fixed;right:18px;bottom:78px;width:min(460px,42vw);max-height:45vh;overflow:auto;background:#fffbe8;border:3px solid var(--gold);border-radius:15px;padding:14px;z-index:9}.notes.open{display:block}.nav{height:64px;position:fixed;left:0;right:0;bottom:0;background:#182b3a;display:flex;align-items:center;gap:10px;padding:8px 16px;color:#fff;z-index:10}.nav button{background:#365b72;color:#fff}.progress{height:9px;background:#ffffff28;border-radius:9px;flex:1;overflow:hidden}.progress i{display:block;height:100%;background:var(--gold)}.slide-no{font-weight:900;min-width:56px}@media(max-width:1000px){.slide{padding:3vh 4vw}.frame-grid,.prompt-grid{grid-template-columns:1fr 1fr}.part-grid,.studio{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body><main>
<section class="slide hero active" data-notes="Quick ask: What must every sentence in a paragraph do? Take two ideas, then move to the four parts.">
<div class="kicker" style="color:#efc768">BERANI · LESSON 9</div>
<h1 class="title">One Paragraph, Four Parts</h1>
<p class="sub">Topic sentence. Two details that belong. A closing that means something.</p>
<span class="tag">pp. 43-47 · stay on focus</span>
</section>

<section class="slide" data-notes="Teach the four jobs. Emphasise: if a sentence changes the topic, it needs a new paragraph.">
<div class="kicker">THE FRAME</div>
<h2 class="slide-title">Four jobs in every paragraph</h2>
<p class="do-this"><b>Listen for:</b> the four parts. Every sentence must stay on one focus.</p>
<div class="frame-grid">
<article class="frame"><div class="num">1</div><h3>Topic sentence</h3><p>Names the one focus of this paragraph.</p></article>
<article class="frame"><div class="num">2</div><h3>Detail 1</h3><p>A fact, action or image that develops the focus.</p></article>
<article class="frame"><div class="num">3</div><h3>Detail 2</h3><p>A second belonging detail that builds the picture.</p></article>
<article class="frame"><div class="num">4</div><h3>Closing meaning</h3><p>Leaves the reader with feeling, emphasis or reflection.</p></article>
</div>
</section>

${modelSlides}

<section class="slide" data-notes="For each part, choose one sentence. It appears in the paragraph below. On-topic sentences stay dark; intruders appear red. Tap a red sentence (or its x) to remove it, then choose a better one for that part.">
<div class="kicker">PRACTICE</div>
<h2 class="slide-title">Choose the sentences that belong</h2>
<p class="do-this"><b>Your turn:</b> Choose one sentence for each part. Watch the paragraph build below. If a sentence turns red, tap it to remove and replace.</p>
<p class="lead"><b>Focus:</b> ${esc(PRACTICE.focus)}</p>
<div class="slot-nav" id="slotNav"></div>
${practiceSlotHtml()}
<div class="controls">
<button class="btn secondary" id="nextSlot">Next part</button>
<button class="btn secondary" id="resetPractice">Reset practice</button>
<span class="feedback" id="practiceFeedback"></span>
</div>
<div class="built-wrap">
<div class="built-label">Our paragraph so far</div>
<p class="built-para" id="builtPara" aria-live="polite"></p>
<p class="built-hint" id="builtHint">Choose Part 1 above. Each choice will appear here.</p>
</div>
</section>

<section class="slide" data-notes="Students pick one prompt. Selection is stored for the writing slide. Real, altered or invented memories are all fine.">
<div class="kicker">WRITE</div>
<h2 class="slide-title">Choose one prompt</h2>
<p class="do-this"><b>Your turn:</b> Tap the prompt you will write about. Keep one clear focus for the whole paragraph.</p>
<div class="prompt-grid">${promptCards}</div>
</section>

<section class="slide" data-notes="Independent construction. Checklist stays visible. Draft saves locally.">
<div class="kicker">BUILD</div>
<h2 class="slide-title">Write your four-part paragraph</h2>
<p class="do-this"><b>Your turn:</b> Write 80-120 words. Use all four parts. Reject any sentence that opens a new topic.</p>
<div class="studio">
<aside class="toolbox">
<div class="picked" id="promptPicked">Prompt: tap one on the previous slide</div>
<ol>
<li>Topic sentence</li>
<li>Detail 1</li>
<li>Detail 2</li>
<li>Closing meaning</li>
</ol>
<button type="button" data-insert="My paragraph is mainly about ">Start topic</button>
<button type="button" data-insert="One detail I remember is ">Add detail</button>
<button type="button" data-insert="Another detail is ">Add detail 2</button>
<button type="button" data-insert="This still matters because ">Close with meaning</button>
</aside>
<div>
<textarea id="draft" aria-label="Paragraph draft" placeholder="Write your four-part paragraph here..."></textarea>
<div class="wordcount"><span id="wordCount">0</span> words · aim for 80-120</div>
</div>
</div>
</section>

<section class="slide exit" data-notes="Collect the exit line. The because clause diagnoses belonging better than the detail alone.">
<div class="kicker" style="color:#efc768">EXIT</div>
<h2 class="slide-title" style="color:#fff">Prove one detail belongs</h2>
<p class="do-this" style="background:#fff;color:var(--ink)"><b>Your turn:</b> Underline your topic sentence. Circle one detail. Finish the line below.</p>
<div class="ticket">
<p><b>This detail belongs because</b> _______________________________</p>
</div>
</section>
</main>
<aside class="notes" id="notes"><h3>Teacher notes</h3><p id="noteText"></p></aside>
<nav class="nav">
<button id="prev" type="button">&larr; Previous</button>
<button id="next" type="button">Next &rarr;</button>
<div class="progress"><i id="bar"></i></div>
<span class="slide-no" id="slideNo"></span>
<button id="notesBtn" type="button">Notes</button>
<button id="resetAll" type="button">Reset</button>
<button id="full" type="button">Fullscreen</button>
</nav>
<script>
const slides=[...document.querySelectorAll('.slide')];
let current=0,slotIndex=0,selectedBySlot={},selectedPrompt=null;
const notes=document.getElementById('notes'),noteText=document.getElementById('noteText');
const slotCount=${PRACTICE.slots.length};
const promptTexts=${JSON.stringify(PROMPTS.map(p=>p.title+': '+p.text))};

function show(n){
 current=Math.max(0,Math.min(slides.length-1,n));
 slides.forEach((s,i)=>s.classList.toggle('active',i===current));
 slideNo.textContent=(current+1)+' / '+slides.length;
 bar.style.width=((current+1)/slides.length*100)+'%';
 noteText.textContent=slides[current].dataset.notes||'No notes.';
}
prev.onclick=()=>show(current-1);
next.onclick=()=>show(current+1);
notesBtn.onclick=()=>notes.classList.toggle('open');
full.onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{
 if(['TEXTAREA','INPUT'].includes(document.activeElement.tagName))return;
 if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}
 if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}
 if(e.key.toLowerCase()==='n')notes.classList.toggle('open');
});

document.querySelectorAll('.part-card').forEach(card=>{
 card.onclick=()=>card.classList.toggle('open');
});

const slotNav=document.getElementById('slotNav');
const builtPara=document.getElementById('builtPara');
const builtHint=document.getElementById('builtHint');
const slotJobs=${JSON.stringify(PRACTICE.slots.map(s=>s.job))};
for(let i=0;i<slotCount;i++){
 const b=document.createElement('button');
 b.type='button';
 b.textContent='Part '+(i+1);
 b.dataset.go=i;
 if(i===0)b.classList.add('on');
 b.onclick=()=>showSlot(+b.dataset.go);
 slotNav.appendChild(b);
}
function showSlot(i){
 slotIndex=i;
 document.querySelectorAll('[data-slot-panel]').forEach(p=>{
  p.hidden=+p.dataset.slotPanel!==i;
 });
 slotNav.querySelectorAll('button').forEach((b,idx)=>b.classList.toggle('on',idx===i));
}
function syncChoiceStyles(){
 document.querySelectorAll('.choice').forEach(c=>{
  const si=+c.dataset.slot;
  const selected=selectedBySlot[si]===c;
  c.classList.toggle('selected',selected);
  c.classList.remove('good','bad');
  if(selected)c.classList.add(c.dataset.good==='true'?'good':'bad');
 });
 slotNav.querySelectorAll('button').forEach((b,idx)=>{
  const sel=selectedBySlot[idx];
  b.classList.toggle('filled',!!sel&&sel.dataset.good==='true');
  b.classList.toggle('has-intruder',!!sel&&sel.dataset.good!=='true');
 });
}
function renderBuilt(){
 builtPara.innerHTML='';
 let filled=0,intruders=0;
 for(let i=0;i<slotCount;i++){
  const btn=selectedBySlot[i];
  if(!btn){
   const ghost=document.createElement('span');
   ghost.className='built-empty';
   ghost.textContent='['+slotJobs[i]+'] ';
   builtPara.appendChild(ghost);
   continue;
  }
  filled++;
  const good=btn.dataset.good==='true';
  if(!good)intruders++;
  const sent=document.createElement('button');
  sent.type='button';
  sent.className='built-sent'+(good?'':' intruder');
  sent.dataset.slot=i;
  sent.title='Tap to remove and choose again';
  sent.appendChild(document.createTextNode(btn.dataset.text+' '));
  if(!good){
   const x=document.createElement('span');
   x.className='x';
   x.textContent='×';
   sent.appendChild(x);
  }
  sent.onclick=()=>removeSlot(i);
  builtPara.appendChild(sent);
 }
 if(filled===0){
  builtHint.textContent='Choose Part 1 above. Each choice will appear here.';
 }else if(intruders>0){
  builtHint.textContent='Red sentences do not belong. Tap a red sentence to remove it, then choose a better one.';
 }else if(filled===slotCount){
  builtHint.textContent='Four on-topic sentences — this paragraph stays on focus.';
 }else{
  builtHint.textContent='Paragraph building… choose the next empty part (shown in grey).';
 }
}
function removeSlot(si){
 delete selectedBySlot[si];
 syncChoiceStyles();
 renderBuilt();
 showSlot(si);
 practiceFeedback.textContent='Part '+(si+1)+' cleared. Choose a sentence that stays on the mango-tree focus.';
}
function commitChoice(btn){
 const si=+btn.dataset.slot;
 selectedBySlot[si]=btn;
 syncChoiceStyles();
 renderBuilt();
 if(btn.dataset.good==='true'){
  practiceFeedback.textContent='Added. On topic — stays with the mango-tree focus.';
  const nextEmpty=[...Array(slotCount).keys()].find(i=>!selectedBySlot[i]);
  if(nextEmpty!==undefined)showSlot(nextEmpty);
 }else{
  practiceFeedback.textContent='Added in red — that sentence changes the topic. Tap it below to remove and replace.';
 }
}
document.querySelectorAll('.choice').forEach(btn=>{
 btn.onclick=()=>commitChoice(btn);
});
nextSlot.onclick=()=>showSlot(Math.min(slotCount-1,slotIndex+1));
function resetPracticeFn(){
 selectedBySlot={};
 document.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected','good','bad'));
 practiceFeedback.textContent='';
 syncChoiceStyles();
 renderBuilt();
 showSlot(0);
}
resetPractice.onclick=resetPracticeFn;
renderBuilt();

document.querySelectorAll('.prompt-card').forEach(card=>{
 card.onclick=()=>{
  selectedPrompt=+card.dataset.prompt;
  document.querySelectorAll('.prompt-card').forEach(c=>c.classList.toggle('selected',c===card));
  promptPicked.textContent='Prompt: '+promptTexts[selectedPrompt];
  localStorage.setItem('lesson9-prompt',String(selectedPrompt));
 };
});
const savedPrompt=localStorage.getItem('lesson9-prompt');
if(savedPrompt!==null){
 selectedPrompt=+savedPrompt;
 const card=document.querySelector('.prompt-card[data-prompt="'+savedPrompt+'"]');
 if(card){card.classList.add('selected');promptPicked.textContent='Prompt: '+promptTexts[selectedPrompt]}
}

const draft=document.getElementById('draft');
function count(){
 const n=draft.value.trim().split(/\\s+/).filter(Boolean).length;
 wordCount.textContent=n;
 localStorage.setItem('lesson9-draft',draft.value);
}
draft.value=localStorage.getItem('lesson9-draft')||'';
draft.addEventListener('input',count);
document.querySelectorAll('[data-insert]').forEach(b=>{
 b.onclick=()=>{draft.setRangeText(b.dataset.insert,draft.selectionStart,draft.selectionEnd,'end');draft.focus();count()};
});
count();

function resetAllFn(){
 resetPracticeFn();
 document.querySelectorAll('.part-card').forEach(c=>c.classList.remove('open'));
 document.querySelectorAll('.prompt-card').forEach(c=>c.classList.remove('selected'));
 selectedPrompt=null;
 promptPicked.textContent='Prompt: tap one on the previous slide';
 localStorage.removeItem('lesson9-prompt');
 draft.value='';
 localStorage.removeItem('lesson9-draft');
 count();
}
resetAll.onclick=resetAllFn;
show(0);
</script></body></html>`;
 fs.writeFileSync(htmlPath,html,'utf8');
}

async function main(){buildPlan();buildHtml();await buildHandout();await buildLucas();console.log('Built Lesson 9 plan, presentation and handouts.')}
main().catch(e=>{console.error(e);process.exitCode=1});

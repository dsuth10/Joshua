const fs=require('fs'),path=require('path');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,BorderStyle,ShadingType}=require('docx');
const root=path.resolve(__dirname,'..');
const navy='173F58',teal='176B67',gold='E3A94F',paper='FFFDF7',line='B8C7C2';
const plan=`# Lesson 18: The Cost of Holding a Line

## Lesson purpose

Students analyse Malia's ethical conflict in pages 99-103: refusing to sign an apology preserves her belief about palm oil, but brings consequences for Putu, Mrs Harwono and her own schooling. They write a nuanced explanation of how first-person narration positions a reader to understand competing loyalties.

## Curriculum focus

- **Year 5 - AC9E5LE03:** recognise how point of view influences feelings and reader response.
- **Year 6 - AC9E6LE01:** identify and explain responses to characters drawn from social and ethical contexts.

## Learning intention

We are learning to explain how an author's first-person point of view makes an ethical conflict feel complicated rather than simple.

## Success criteria

- I can identify Malia's belief, the pressure on her and the consequences at stake.
- I can distinguish a character's reason from a reader's judgement.
- I can explain how Putu's response makes Malia's decision more complicated.
- I can use accurate evidence and an inference signal in a literary explanation.
- I can revise a sentence that treats an ethical conflict as too simple.

## Finished workbook response

An 8-10 sentence literary explanation: How does Malia's first-person narration make the conflict between activism and loyalty feel complicated in pages 99-103?

## Preparation

- Open \`Lesson_18_Presentation.html\` and print the organiser.
- Students need *Berani*, their English workbook and the completed organiser.
- The chapter is assumed to have been read; use the fallback only if needed.

## Core sequence (50 minutes)

### 1. Two things can matter at once - 4 minutes

Students choose a response to the opening tension and justify it with a condition. **Organiser:** opening claim.

### 2. What is Malia refusing? - 4 minutes

Retrieve the apology, its requested claim and Malia's stated reason. **Organiser:** evidence ledger.

### 3. Map the pressure, not just the position - 6 minutes

Pairs sort each pressure by who experiences it, then explain one link. **Organiser:** pressure map. The point is not to find a single correct side; it is to see the conflict's human cost.

### 4. Putu changes the shape of the conflict - 5 minutes

Compare Malia's belief with Putu's immediate concern. **Organiser:** two-viewpoint comparison.

### 5. First person lets us hear the hesitation - 4 minutes

Explain what readers know because Malia narrates her own thinking. **Organiser:** viewpoint effect.

### 6. A strong explanation keeps two truths visible - 5 minutes

Annotate the teacher model for claim, evidence, competing pressure, inference and point-of-view effect. **Organiser:** model moves.

### 7. Build the explanation before writing - 4 minutes

Complete the five-part explanation frame. **Organiser:** writing plan.

### 8. Write: the cost of holding a line - 13 minutes

Independently write the 8-10 sentence explanation in the workbook.

### 9. Revise for complexity - 3 minutes

Use the self-check to revise one sentence that merely retells or oversimplifies.

### 10. Exit: one conflict, two truths - 2 minutes

Write one sentence beginning: *Malia's decision is complicated because...* Include one belief and one consequence.

## Optional depth

### A. Test Putu's claim - 8 minutes

Judge whether Putu's accusation that Malia is selfish is fair, unfair or partly fair. Use two details and a qualification.

### B. Change the narrator - 8 minutes

Rewrite one moment from Putu's viewpoint, then identify what a reader would gain and lose.

## Support

- Read the key exchange aloud twice and permit oral rehearsal.
- Begin with the two supplied pressures, then add one independently.
- Use sentence launches: *Malia believes...*; *However, Putu is worried about...*; *Because Malia tells the scene herself, readers...*

## Lucas (ICP)

Use the separate organiser: match picture-supported ideas, choose between two response cards, and speak, point, copy or scribe a sentence. The same destination remains: Malia wants to act on her belief, and her choice affects other people.

## Teacher reading fallback

Malia is asked to sign an apology after her activism. She believes signing would mean saying she supports palm oil and lying about her position. She worries that she could be expelled and that Mrs Harwono could lose her job. Putu's parents are angry about the trouble and expense connected with school, and Putu urges Malia to sign. Malia decides she cannot sign; Putu calls her selfish and says she can leave for Canada. Malia ends the day feeling worse.

## Accuracy and privacy boundaries

- Use only pages 99-103 and verified prior context.
- Do not ask students to disclose comparable family conflicts or activism experiences.
- Accept defensible ethical judgements when they accurately represent more than one perspective.
`;

const slides=[
 ['BERANI • LESSON 18','The cost of holding a line','Malia believes signing would be wrong. But the choice has consequences for other people.',`DO: silent think, then share a conditional response.\nWORK: Which response is strongest: “She must sign”, “She must not sign”, or “It depends”?\nRECORD: Organiser - opening claim.\nFINISH: one condition that makes your view less simple.\nCHECK: listen for a reason and a consequence, not a slogan.`],
 ['RETRIEVAL','What is Malia refusing?','<div class="cards"><article><b>The document</b><p>An apology letter.</p></article><article><b>Malia’s concern</b><p>Signing would require her to say she supports palm oil.</p></article><article><b>Her stated principle</b><p>She cannot say something she believes is untrue.</p></article></div><p class="prompt">What does the letter ask Malia to give up: an opinion, a friendship, or her stated belief?</p>',`DO: partner retrieval.\nWORK: locate the apology, the claim and Malia’s stated reason.\nRECORD: evidence ledger.\nFINISH: three accurate notes.\nCHECK: do not turn “refusing to sign” into “wanting trouble”.`],
 ['PRESSURE MAP','A decision can reach beyond one person','<div class="sort"><button data-a="m">Malia could be expelled.</button><button data-a="t">Mrs Harwono could lose her job.</button><button data-a="p">Putu’s parents are angry about the school trouble.</button><button data-a="m">Malia believes the apology would be a lie.</button></div><div class="bins"><button class="bin" data-bin="m">Malia</button><button class="bin" data-bin="t">Teacher</button><button class="bin" data-bin="p">Putu / family</button></div><p id="feedback" class="feedback">Place each card, then explain one connection.</p>',`DO: pairs.\nWORK: choose who feels each pressure; explain one connection using because.\nRECORD: pressure map.\nFINISH: four placements + one because statement.\nCHECK: feedback should show why this is not a simple “right versus wrong” decision.`],
 ['TWO VIEWPOINTS','Putu changes the shape of the conflict','<div class="compare"><article><h3>Malia</h3><p>She believes an apology would force her to lie about what she supports.</p></article><article><h3>Putu</h3><p>She is worried about trouble for Mrs Harwono, her parents and their friendship.</p></article></div><p class="prompt">Complete aloud: “Malia’s position is principled; however, Putu’s response shows…”</p>',`DO: pairs.\nWORK: compare belief and immediate consequence.\nRECORD: two-viewpoint comparison.\nFINISH: one spoken contrast.\nCHECK: Putu is not merely an obstacle; her concern reveals a cost.`],
 ['POINT OF VIEW','What can we hear because Malia tells it?','<div class="quote">“I can’t sign the letter.”</div><p class="lead">First person gives readers Malia’s private weighing: her fear of expulsion, her concern for Mrs Harwono, and the moment she decides what she can live with.</p><p class="prompt">What would be harder to know in a scene told only from outside Malia?</p>',`DO: turn and talk.\nWORK: name one private thought or uncertainty a distant narrator might hide.\nRECORD: viewpoint effect.\nFINISH: evidence + effect.\nCHECK: explain the reader effect, not just “we know her feelings”.`],
 ['ANNOTATED MODEL','Keep two truths visible','<div class="model"><p><b>Claim:</b> Malia’s refusal is presented as principled, but not easy.</p><p><b>Evidence:</b> She believes signing means she must say she supports palm oil.</p><p><b>Competing pressure:</b> She worries about Mrs Harwono and hears Putu’s anger.</p><p><b>Inference:</b> This suggests that acting on a belief can still hurt people a character cares about.</p><p><b>Point of view:</b> Because Malia narrates her own hesitation, readers can understand her reasoning even if they judge her choice differently.</p></div>',`DO: whole class.\nWORK: identify claim, evidence, competing pressure, inference and point-of-view effect.\nRECORD: star one move to use.\nFINISH: five labelled moves.\nCHECK: this is a teacher model, not a paragraph to copy.`],
 ['WRITE','Build the explanation','<ol><li>Make a nuanced claim.</li><li>Use one accurate detail about the letter.</li><li>Add a consequence for another person.</li><li>Explain what this suggests.</li><li>Explain how first person positions the reader.</li></ol><p class="prompt">Your sentence may begin: <i>Although Malia…, the narration also shows…</i></p>',`DO: independent planning.\nWORK: complete the five moves in note form.\nRECORD: writing plan.\nFINISH: every move has a note.\nCHECK: conference where a consequence is missing or evidence does not support the claim.`],
 ['WRITING STUDIO','The cost of holding a line','<div class="studio"><h3>Write 8-10 sentences</h3><p>How does Malia’s first-person narration make the conflict between activism and loyalty feel complicated?</p><ul><li>Use at least two accurate details.</li><li>Keep Malia’s belief and another person’s pressure visible.</li><li>Use an inference signal: <i>this suggests</i>, <i>therefore</i>, or <i>because</i>.</li></ul></div><div class="timer"><span>13:00</span><button class="timer-start">Start</button><button class="timer-reset">Reset</button></div>',`DO: independent, silent write.\nWORK: compose in English workbook.\nRECORD: full response.\nFINISH: 8-10 sentences with two accurate details.\nCHECK: offer oral rehearsal or sentence launches without writing the response for students.`],
 ['SELF-CHECK','Revise for complexity','<div class="checks"><label><input type="checkbox"> I name Malia’s belief accurately.</label><label><input type="checkbox"> I include a consequence beyond Malia.</label><label><input type="checkbox"> I explain, not only retell.</label><label><input type="checkbox"> I explain the effect of first person.</label><label><input type="checkbox"> I revised one sentence that made the conflict too simple.</label></div><p class="prompt">Revision test: could a thoughtful reader see why more than one person is worried?</p>',`DO: independent revision.\nWORK: check each statement and revise one sentence.\nRECORD: visible revision in workbook.\nFINISH: one improved sentence.\nCHECK: use the result for next-lesson grouping.`],
 ['EXIT','One conflict, two truths','<div class="exit"><p>Complete:</p><h2>Malia’s decision is complicated because __________, while __________.</h2><p>Use one belief and one consequence.</p></div>',`DO: independent exit.\nWORK: write one sentence in workbook.\nRECORD: exit evidence.\nFINISH: belief + consequence.\nCHECK: collect as evidence of who can hold competing perspectives.`],
 ['DEPTH A','Is Putu’s accusation fair?','<p class="lead">Putu calls Malia selfish. Is that fair, unfair, or partly fair?</p><p class="prompt">Make a qualified judgement using two accurate details. A strong answer may begin: <i>It is partly fair because…, although…</i></p>',`OPTIONAL DEPTH. DO: pairs. WORK: test the accusation using two details. RECORD: workbook margin. FINISH: qualified judgement. CHECK: do not force agreement.`],
 ['DEPTH B','Change the narrator','<p class="lead">Retell one short moment from Putu’s viewpoint.</p><p class="prompt">Then explain: what would readers gain, and what would they lose, if Putu told this scene?</p>',`OPTIONAL DEPTH. DO: independent. WORK: rewrite then compare viewpoints. RECORD: workbook margin. FINISH: gain + loss. CHECK: preserve only verified scene details.`]
];

function html(){const s=slides.map((x,i)=>`<section class="slide ${i?'':'active'}" data-notes="${x[3].replace(/"/g,'&quot;')}"><header><span>${x[0]}</span><h1>${x[1]}</h1></header><main>${x[2]}</main></section>`).join('');return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesson 18 | Berani</title><style>:root{--nav:#173f58;--teal:#176b67;--gold:#e3a94f;--paper:#fffdf7;--ink:#20303c}*{box-sizing:border-box}body{margin:0;background:var(--nav);font-family:Arial,sans-serif;color:var(--ink);overflow:hidden}.slide{display:none;position:absolute;inset:0 0 66px;padding:5vh 7vw;background:linear-gradient(135deg,#fffdf7,#e8f2e9);overflow:auto}.slide.active{display:block}header span{font-size:14px;font-weight:900;letter-spacing:2px;color:var(--teal)}h1{font:900 clamp(42px,5.4vw,78px)/.98 Georgia,serif;margin:8px 0 4vh;color:var(--nav)}main{max-width:1180px;font-size:clamp(21px,2vw,32px);line-height:1.35}.slide:has(.sort) h1,.slide:has(.compare) h1{font-size:clamp(34px,4vw,60px);margin-bottom:2vh}.slide:has(.sort) main,.slide:has(.compare) main{font-size:clamp(17px,1.55vw,25px)}.lead{font-size:clamp(25px,2.7vw,42px);max-width:1050px}.prompt{margin-top:5vh;color:var(--teal);font-weight:800}.cards,.compare{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.cards article,.compare article,.model,.studio,.exit{background:#fff;border-radius:20px;padding:24px;border:3px solid #b8c7c2;box-shadow:0 10px 25px #173f5815}.cards b,.compare h3{color:var(--teal)}.sort{display:flex;gap:12px;flex-wrap:wrap}.sort button,.bin{font:inherit;font-weight:700;background:#fff;border:3px solid var(--teal);border-radius:14px;padding:16px;cursor:pointer}.bins{display:flex;gap:16px;margin-top:36px}.bin{background:#e8f2e9}.feedback{min-height:42px}.quote{font:italic clamp(30px,3vw,52px)/1.2 Georgia,serif;border-left:12px solid var(--gold);padding:20px 32px;background:#fff}.model p{margin:12px 0}.studio{max-width:960px}.timer{position:absolute;right:7vw;bottom:11vh;display:flex;align-items:center;gap:10px;background:var(--nav);color:white;border-radius:14px;padding:12px 16px;font-weight:900}.timer button{font:inherit;font-weight:800;border:0;border-radius:8px;padding:8px;cursor:pointer}.checks{display:grid;gap:14px;background:#fff;padding:28px;border-radius:18px}.checks label{font-size:clamp(20px,2vw,29px)}.exit{background:var(--nav);color:white;max-width:1000px}.nav{position:fixed;inset:auto 0 0;height:66px;background:var(--nav);display:flex;align-items:center;gap:12px;color:white;padding:0 18px}.nav button{background:transparent;border:0;color:white;font-weight:900;padding:10px;cursor:pointer}.bar{height:7px;flex:1;background:#ffffff44;border-radius:8px}.bar i{display:block;height:100%;background:var(--gold)}.notes{display:none;position:fixed;right:18px;bottom:78px;width:min(520px,92vw);background:#fff;border:3px solid var(--teal);border-radius:15px;padding:18px;white-space:pre-line;line-height:1.4;z-index:2}.notes.open{display:block}@media(max-width:720px){.cards,.compare{grid-template-columns:1fr}.slide{padding:4vh 6vw}.timer{position:static;margin-top:24px}.bins{flex-wrap:wrap}}</style></head><body><div id="deck">${s}</div><aside class="notes" id="notes"></aside><nav class="nav"><button id="prev">← Back</button><button id="next">Next →</button><button id="notesBtn">Notes</button><button id="full">Fullscreen</button><div class="bar"><i id="progress"></i></div><b id="count"></b></nav><script>let n=0;const slides=[...document.querySelectorAll('.slide')],notes=document.querySelector('#notes');function show(i){n=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,j)=>s.classList.toggle('active',j===n));notes.classList.remove('open');notes.textContent=slides[n].dataset.notes;count.textContent=(n+1)+' / '+slides.length;progress.style.width=((n+1)/slides.length*100)+'%'}show(0);prev.onclick=()=>show(n-1);next.onclick=()=>show(n+1);notesBtn.onclick=()=>notes.classList.toggle('open');full.onclick=()=>document.documentElement.requestFullscreen?.();document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;if(['ArrowRight',' ','PageDown'].includes(e.key))show(n+1);if(['ArrowLeft','PageUp'].includes(e.key))show(n-1);if(e.key==='n')notes.classList.toggle('open')});let held;document.querySelectorAll('.sort button').forEach(b=>b.onclick=()=>held=b);document.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{if(!held)return;const ok=held.dataset.a===b.dataset.bin;document.querySelector('#feedback').textContent=ok?'A useful placement. Now explain the consequence.':'Try again: ask who directly feels this pressure.';if(ok){b.append(' ✓');held.disabled=true}held=null});document.querySelectorAll('.timer').forEach(box=>{let left=780,id;const span=box.querySelector('span'),paint=()=>span.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');box.querySelector('.timer-start').onclick=()=>{clearInterval(id);id=setInterval(()=>{left--;paint();if(left<=0)clearInterval(id)},1000)};box.querySelector('.timer-reset').onclick=()=>{clearInterval(id);left=780;paint()}});</script></body></html>`}
function p(text,b=false,size=20){return new Paragraph({spacing:{after:90},children:[new TextRun({text,bold:b,font:'Arial',size})]})}
function cell(text,fill='FFFFFF'){return new TableCell({shading:{fill},width:{size:9360,type:WidthType.DXA},children:[p(text,false,19)]})}
function doc(lucas){
 const title=lucas?'Lesson 18 - Lucas organiser':'Lesson 18 - Organiser';
 const entries=lucas?[['Malia wants to…','□ sign  □ not sign'],['This choice could affect…','□ only Malia  □ other people too'],['Putu is worried about…','____________________________'],['Finish: Malia’s decision is hard because…','____________________________\n____________________________']]:[['1. Opening claim','It depends because ____________________________________________'],['2. Evidence ledger','The letter asks Malia to ______________________________________\nMalia believes signing would __________________________________'],['3. Pressure map','Malia: __________________  Mrs Harwono: __________________\nPutu / family: ________________________________________________'],['4. Two viewpoints','Malia believes: ______________________________________________\nPutu worries: _________________________________________________'],['5. Explanation plan','Claim: __________________ Evidence: __________________________\nPressure: _______________ This suggests: _____________________\nFirst person makes readers: __________________________________'],['6. Exit','Malia’s decision is complicated because ______________________\nwhile ________________________________________________________']];
 const blocks=entries.map(([a,b])=>new Table({width:{size:9360,type:WidthType.DXA},rows:[new TableRow({children:[cell(a,'E8F2E9')]}),new TableRow({children:[cell(b)]})]}));
 return new Document({sections:[{properties:{page:{margin:{top:680,right:680,bottom:680,left:680}}},children:[p(title,true,32),p(lucas?'Choose, point, say or write.':'Pages 99-103 | Keep more than one perspective visible.',false,18),...blocks]}]});
}
async function build(){fs.mkdirSync(root,{recursive:true});fs.writeFileSync(path.join(root,'Lesson_18_Plan.md'),plan);fs.writeFileSync(path.join(root,'Lesson_18_Presentation.html'),html());fs.writeFileSync(path.join(root,'Lesson_18_Organiser.docx'),await Packer.toBuffer(doc(false)));fs.writeFileSync(path.join(root,'Lesson_18_Lucas_Organiser.docx'),await Packer.toBuffer(doc(true)));console.log('Built Lesson 18.')}build();

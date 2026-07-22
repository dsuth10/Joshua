const fs = require('fs');
const path = require('path');

const lessonDir = path.resolve(__dirname, '..');
const planPath = path.join(lessonDir, 'Recreation_Lesson_Plan.md');
const htmlPath = path.join(lessonDir, 'Recreation_Lesson_Presentation.html');

function buildPlan() {
  const md = `# Recreation Lesson: The Old Art of Persuasion

## What this is

An unnumbered enrichment / recreation deck for English Unit 3. It is **not** an assessed lesson and does not replace Lesson 8. Use it when you want a short historical bridge for the claim–evidence–counter–judgement shape students practise in the unit.

## Purpose

Show that the four-job argument is rooted in classical oratory and rhetoric: Aristotle on proof and appeals, Roman speech order (including Cicero), and Quintilian on answering objections.

## Timing

About 15–25 minutes, depending on discussion. Skip freely; treat it as a tour, not a test.

## How to use

1. Open \`Recreation_Lesson_Presentation.html\` in a modern browser and go fullscreen.
2. Click cards and stages to reveal ideas. Arrow keys / space navigate.
3. Press **N** for teacher notes on the active slide.
4. Best placement: after Lesson 8’s mission or annotated model, or as a wet-day / early-finisher enrichment.

## Keep it light

- No curriculum codes, no worksheet, no exit ticket required.
- Prefer Aristotle + Cicero as the two names students remember.
- End on the practical link: claim, evidence, counter, judgement.
`;
  fs.writeFileSync(planPath, md, 'utf8');
}

function buildHtml() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Recreation Lesson - The Old Art of Persuasion</title>
<style>
:root{--ink:#192b36;--navy:#173c4e;--teal:#20756e;--mint:#dcefe8;--cream:#fff8e7;--gold:#e9b44c;--coral:#d8644a;--pale:#f4f7f6;--white:#fff;--smoke:#5a6870}
*{box-sizing:border-box}
body{margin:0;background:#0d2733;color:var(--ink);font-family:Arial,sans-serif;overflow:hidden}
.deck{height:100vh}
.slide{display:none;position:absolute;inset:0 0 64px;padding:4.5vh 6vw;background:linear-gradient(135deg,#fff 0%,#f2f8f6 100%);overflow:auto}
.slide.active{display:block}
.hero{color:#fff;background:
  radial-gradient(circle at 18% 20%,rgba(233,180,76,.28),transparent 28%),
  radial-gradient(circle at 85% 10%,rgba(32,117,110,.45),transparent 32%),
  linear-gradient(135deg,#0d2733 0%,#173c4e 48%,#1d5f60 100%);overflow:hidden}
.hero .title{max-width:820px}
.hero .sub{max-width:720px;color:#f7f1dd}
.exit{color:#fff;background:radial-gradient(circle at 80% 15%,#2e8477 0 12%,transparent 35%),linear-gradient(135deg,#102f3e,#1d5f60)}
.kicker{font-size:clamp(14px,1.3vw,22px);font-weight:800;letter-spacing:.16em;color:var(--coral);text-transform:uppercase}
.title{font-size:clamp(44px,6.4vw,96px);line-height:.94;max-width:900px;margin:4vh 0 2vh;letter-spacing:-.04em}
.sub{font-size:clamp(20px,2.1vw,36px);line-height:1.3;max-width:900px}
.slide-title{font-size:clamp(34px,4.2vw,68px);line-height:1;margin:2vh 0 2vh;color:var(--navy);letter-spacing:-.03em}
.lead{font-size:clamp(19px,1.9vw,30px);margin:0 0 2.2vh;max-width:1100px;line-height:1.35}
.pill{display:inline-block;background:var(--gold);color:var(--navy);padding:12px 22px;border-radius:999px;font-weight:800;font-size:clamp(16px,1.5vw,24px)}
button{font:inherit}
.grid-3,.grid-4,.grid-2,.era-grid,.map-grid{display:grid;gap:1.2vw}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-4{grid-template-columns:repeat(4,1fr)}
.grid-2{grid-template-columns:1fr 1fr}
.card,.era,.map-card,.path-step,.choice{border:3px solid #c5d6d2;border-radius:20px;background:#fff;padding:1.3vw;text-align:left;box-shadow:0 9px 20px #173c4e18}
.choice,.card,.era,.path-step,.map-card{cursor:pointer}
.choice{font-size:clamp(18px,1.7vw,28px);min-height:22vh}
.choice b{display:block;font-size:1.2em;color:var(--navy);margin-bottom:10px}
.choice.selected{border-color:var(--coral);transform:translateY(-4px)}
.choice .reveal,.card .reveal,.era .reveal,.path-step .detail,.map-card .reveal{display:none;margin-top:12px;font-size:.82em;color:var(--smoke);line-height:1.4}
.choice.selected .reveal,.card.open .reveal,.era.open .reveal,.path-step.open .detail,.map-card.open .reveal{display:block}
.card{border-top:10px solid var(--teal);min-height:28vh}
.card h3,.era h3,.map-card h3,.path-step h3{margin:0 0 8px;color:var(--navy);font-size:clamp(22px,2vw,34px)}
.card .who,.era .when,.path-step .tag{color:var(--coral);font-weight:800;font-size:clamp(14px,1.15vw,19px);margin:0 0 10px}
.card.open,.era.open,.path-step.open,.map-card.open{border-color:var(--gold);background:#fffcf3}
.era-grid{grid-template-columns:repeat(3,1fr)}
.era{min-height:34vh;border-top:10px solid var(--navy)}
.era:nth-child(2){border-top-color:var(--teal)}
.era:nth-child(3){border-top-color:var(--gold)}
.path{display:grid;grid-template-columns:repeat(5,1fr);gap:.8vw}
.path-step{min-height:28vh;padding:1vw}
.path-step .num{font-size:clamp(28px,3vw,48px);font-weight:900;color:var(--teal);line-height:1}
.map-grid{grid-template-columns:1.05fr 1fr;gap:1.4vw;align-items:stretch}
.pair-col{display:grid;gap:10px}
.pair{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fff;border:3px solid #c5d6d2;border-radius:16px;padding:14px 16px;font-size:clamp(17px,1.5vw,25px);font-weight:800;color:var(--navy);cursor:pointer}
.pair span{color:var(--smoke);font-weight:700;font-size:.85em}
.pair.selected{border-color:var(--coral);background:#fff0e8}
.pair.matched{border-color:var(--teal);background:#f2faf7}
.pair.wrong{border-color:var(--coral)}
.callout{margin-top:1.4vh;background:var(--navy);color:#fff;border-radius:16px;padding:1.1vw 1.4vw;font-size:clamp(17px,1.55vw,26px)}
.callout b{color:var(--gold)}
.quote{background:#fff;border-left:10px solid var(--gold);border-radius:14px;padding:1.4vw;font-size:clamp(22px,2.1vw,36px);line-height:1.4;max-width:1000px}
.quote .attr{display:block;margin-top:14px;font-size:.62em;color:var(--smoke);font-weight:800}
.timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:1vw}
.t-item{background:#fff;border-radius:18px;padding:1.2vw;border-top:8px solid var(--teal);box-shadow:0 9px 20px #173c4e18}
.t-item b{display:block;color:var(--navy);font-size:clamp(18px,1.7vw,28px);margin-bottom:8px}
.t-item p{margin:0;color:var(--smoke);font-size:clamp(15px,1.25vw,21px);line-height:1.35}
.controls{display:flex;align-items:center;gap:12px;margin-top:12px;flex-wrap:wrap}
.btn,.nav button{border:0;border-radius:12px;background:var(--teal);color:#fff;padding:11px 18px;font-weight:800;cursor:pointer}
.secondary{background:#dfe8e5!important;color:var(--navy)!important}
.feedback{font-weight:800}
.ticket{background:#fff;color:var(--navy);border-radius:22px;padding:2.2vw;font-size:clamp(22px,2.2vw,38px);line-height:1.5}
.notes{display:none;position:fixed;right:18px;bottom:78px;width:min(460px,42vw);max-height:45vh;overflow:auto;background:#fffbe8;border:3px solid var(--gold);border-radius:15px;padding:14px;z-index:9}
.notes.open{display:block}
.notes h3{margin:0 0 8px}
.nav{height:64px;position:fixed;left:0;right:0;bottom:0;background:#0d2733;display:flex;align-items:center;gap:10px;padding:8px 16px;color:#fff;z-index:10}
.nav button{padding:9px 14px;background:#285f65}
.progress{height:9px;background:#ffffff28;border-radius:9px;flex:1;overflow:hidden}
.progress i{display:block;height:100%;background:var(--gold)}
.slide-no{font-weight:800;min-width:56px}
@media(max-width:1000px){
  .slide{padding:3vh 4vw}
  .grid-3,.era-grid,.path,.timeline,.grid-4{grid-template-columns:1fr 1fr}
  .map-grid,.grid-2{grid-template-columns:1fr}
  .choice,.card,.era{min-height:auto}
}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>
</head>
<body>
<main class="deck">

<section class="slide hero active" data-notes="Recreation only - no assessment. Open with curiosity: school argument shape is older than school itself.">
  <div class="kicker" style="color:#f4cb72">ENGLISH UNIT 3 · RECREATION</div>
  <h1 class="title">The Old Art of Persuasion</h1>
  <p class="sub">Claim. Evidence. Counter. Judgement. This shape did not begin in a worksheet - it began in courts, assemblies and public speech.</p>
  <span class="pill">rhetoric &nbsp;|&nbsp; oratory &nbsp;|&nbsp; judgement</span>
</section>

<section class="slide" data-notes="No single correct answer. Use this to surface gut theories before naming Aristotle.">
  <div class="kicker">HOOK</div>
  <h2 class="slide-title">What makes people trust an argument?</h2>
  <p class="lead">Choose the reason that feels strongest. Then say why.</p>
  <div class="grid-3">
    <button class="choice" type="button" data-hook="proof"><b>PROOF</b>Clear evidence and reasons.<span class="reveal">Closest to Aristotle's <i>logos</i> - persuasion through reasoned proof.</span></button>
    <button class="choice" type="button" data-hook="feeling"><b>FEELING</b>The cause stirs the heart.<span class="reveal">Closest to <i>pathos</i> - emotion can move an audience, but alone it is fragile.</span></button>
    <button class="choice" type="button" data-hook="fairness"><b>FAIRNESS</b>The speaker faces the other side.<span class="reveal">This builds trust. Classical orators answered objections before they judged.</span></button>
  </div>
  <div class="controls"><span class="feedback" id="hookFeedback">Pick one, then name one risk of relying on it alone.</span></div>
</section>

<section class="slide" data-notes="Keep the definition plain. Rhetoric here means the craft of persuasion, not 'empty words'.">
  <div class="kicker">DEFINITION</div>
  <h2 class="slide-title">Rhetoric is the craft of persuasion</h2>
  <p class="quote">Not magic. Not shouting. A set of choices about how to convince an audience with character, feeling and reasoned proof.<span class="attr">Working classroom definition for this recreation</span></p>
  <div class="callout">Today we tour the history behind the four jobs you use in Unit 3 arguments.</div>
</section>

<section class="slide" data-notes="Click each card. Stress that strong public arguments often combine all three, but school writing leans hard on logos.">
  <div class="kicker">GREECE · ARISTOTLE</div>
  <h2 class="slide-title">Three ways to persuade</h2>
  <p class="lead">Aristotle (4th century BCE) described three appeals. Click each one.</p>
  <div class="grid-3">
    <button class="card" type="button"><p class="who">ETHOS</p><h3>Character</h3><p>Do we trust the speaker?</p><span class="reveal">Fairness, honesty and care for the audience build ethos. Facing a counterargument often strengthens it.</span></button>
    <button class="card" type="button"><p class="who">PATHOS</p><h3>Feeling</h3><p>Does the audience care?</p><span class="reveal">Urgency, injustice and hope can move people - but feeling without proof can mislead.</span></button>
    <button class="card" type="button"><p class="who">LOGOS</p><h3>Reason</h3><p>Is the case proved?</p><span class="reveal">Claim + evidence + clear thinking. This is the spine of the argument shape you practise.</span></button>
  </div>
</section>

<section class="slide" data-notes="Bridge to school writing. Emphasise anticipation of opposition as an old idea, not a modern worksheet trick.">
  <div class="kicker">GREECE · ARISTOTLE</div>
  <h2 class="slide-title">Proof beats bare assertion</h2>
  <p class="lead">Aristotle treated persuasion as more than a slogan. A strong case offers reasons - and often anticipates what the other side will say.</p>
  <div class="timeline">
    <article class="t-item"><b>Assert</b><p>I believe this.</p></article>
    <article class="t-item"><b>Support</b><p>Here is my proof.</p></article>
    <article class="t-item"><b>Anticipate</b><p>Someone may object...</p></article>
    <article class="t-item"><b>Judge</b><p>Even so, my view is...</p></article>
  </div>
  <div class="callout">That sequence is already close to <b>claim → evidence → counter → judgement</b>.</div>
</section>

<section class="slide" data-notes="Reveal one stage at a time if you like. This is a simplified school version of classical speech parts, not a full technical oration chart.">
  <div class="kicker">ROME · THE SPEECH PATH</div>
  <h2 class="slide-title">How a classical speech often moved</h2>
  <p class="lead">In Roman courts and assemblies, speakers commonly worked through a path like this. Click each stage.</p>
  <div class="path" id="speechPath">
    <button class="path-step" type="button"><div class="num">1</div><h3>Issue</h3><p class="tag">state the case</p><div class="detail">What decision are we making?</div></button>
    <button class="path-step" type="button"><div class="num">2</div><h3>Facts</h3><p class="tag">set the scene</p><div class="detail">What happened that the audience needs to know?</div></button>
    <button class="path-step" type="button"><div class="num">3</div><h3>Proof</h3><p class="tag">confirmatio</p><div class="detail">Why is your position the strongest reading of those facts?</div></button>
    <button class="path-step" type="button"><div class="num">4</div><h3>Reply</h3><p class="tag">refutatio</p><div class="detail">What will the other side say - and how do you answer it fairly?</div></button>
    <button class="path-step" type="button"><div class="num">5</div><h3>Close</h3><p class="tag">peroratio</p><div class="detail">End with judgement, not with the objection still winning.</div></button>
  </div>
</section>

<section class="slide" data-notes="Keep Cicero human and brief. He is a useful named example of Roman oratory, not a biography lesson.">
  <div class="kicker">ROME · CICERO</div>
  <h2 class="slide-title">Cicero: persuade by facing the fight</h2>
  <div class="era-grid">
    <button class="era" type="button"><p class="when">WHO</p><h3>Cicero</h3><p>Roman statesman and orator</p><span class="reveal">Famous for courtroom and political speeches that weighed competing pressures in public.</span></button>
    <button class="era" type="button"><p class="when">MOVE</p><h3>Answer the other side</h3><p>Do not hide the hard objection</p><span class="reveal">A fair reply can make the final judgement more believable.</span></button>
    <button class="era" type="button"><p class="when">END</p><h3>Decide</h3><p>Close with a clear stance</p><span class="reveal">Classical speeches usually end on judgement - the same habit as your final box.</span></button>
  </div>
</section>

<section class="slide" data-notes="One idea only: answering objections is part of rhetorical strength, not weakness.">
  <div class="kicker">ROME · QUINTILIAN</div>
  <h2 class="slide-title">Fairness can be a form of power</h2>
  <p class="lead">Quintilian taught rhetoric as the education of an orator. One lasting idea: do not merely assert - prove, and deal with objections.</p>
  <div class="grid-2">
    <article class="card open" style="cursor:default"><h3>Weak move</h3><p>Ignore the other side and hope nobody notices.</p></article>
    <article class="card open" style="cursor:default;border-top-color:var(--gold)"><h3>Stronger move</h3><p>Name a fair counterargument, then judge with a clear limit.</p></article>
  </div>
  <div class="callout">That is why the <b>Counter</b> box exists in your Build Studio - not as decoration, as credibility.</div>
</section>

<section class="slide" data-notes="Interactive match. Classical term on the left, school job on the right. Students can discuss before clicking.">
  <div class="kicker">BRIDGE</div>
  <h2 class="slide-title">Match the old moves to our four jobs</h2>
  <p class="lead">Select one classical move, then its school job.</p>
  <div class="map-grid">
    <div class="pair-col" id="classicBank">
      <button class="pair" type="button" data-id="claim" data-side="classic">State your position <span>propositio</span></button>
      <button class="pair" type="button" data-id="evidence" data-side="classic">Support with proof <span>confirmatio</span></button>
      <button class="pair" type="button" data-id="counter" data-side="classic">Answer the other side <span>refutatio</span></button>
      <button class="pair" type="button" data-id="judgement" data-side="classic">Close with a decision <span>peroratio</span></button>
    </div>
    <div class="pair-col" id="schoolBank">
      <button class="pair" type="button" data-id="evidence" data-side="school">Evidence</button>
      <button class="pair" type="button" data-id="judgement" data-side="school">Judgement</button>
      <button class="pair" type="button" data-id="claim" data-side="school">Claim</button>
      <button class="pair" type="button" data-id="counter" data-side="school">Counter</button>
    </div>
  </div>
  <div class="controls">
    <button class="btn secondary" type="button" id="resetMatch">Reset matches</button>
    <span class="feedback" id="matchFeedback">Find all four links.</span>
  </div>
</section>

<section class="slide" data-notes="Recreation close. Invite one spoken takeaway. No written assessment.">
  <div class="kicker">WHY IT STILL WORKS</div>
  <h2 class="slide-title">Audiences trust visible judgement</h2>
  <div class="grid-3">
    <button class="card" type="button"><h3>Bare opinion</h3><p>Asks for belief on personality.</p><span class="reveal">Easy to say. Easy to dismiss.</span></button>
    <button class="card" type="button"><h3>Evidence only</h3><p>Shows proof, but may ignore pressure.</p><span class="reveal">Stronger - yet can seem one-sided.</span></button>
    <button class="card" type="button"><h3>Full path</h3><p>Claim, evidence, counter, judgement.</p><span class="reveal">Harder - and more persuasive, because the audience can see the weighing.</span></button>
  </div>
</section>

<section class="slide exit" data-notes="Collect one sentence orally if you want. Then return to Lesson 8 writing. No formal exit ticket.">
  <div class="kicker" style="color:#f4cb72">TAKEAWAY</div>
  <h2 class="slide-title" style="color:#fff">Remember two names, keep four jobs</h2>
  <div class="ticket">
    <p><b>Aristotle</b> - proof matters.</p>
    <p><b>Cicero</b> - answer the other side, then decide.</p>
    <p style="margin-top:1.2em">Back in Unit 3: <b>claim → evidence → counter → judgement</b>.</p>
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
let current=0;
const notes=document.getElementById('notes');
const noteText=document.getElementById('noteText');
function show(n){
  current=Math.max(0,Math.min(slides.length-1,n));
  slides.forEach((s,i)=>s.classList.toggle('active',i===current));
  document.getElementById('slideNo').textContent=(current+1)+' / '+slides.length;
  document.getElementById('bar').style.width=((current+1)/slides.length*100)+'%';
  noteText.textContent=slides[current].dataset.notes||'No notes.';
}
document.getElementById('prev').onclick=()=>show(current-1);
document.getElementById('next').onclick=()=>show(current+1);
document.getElementById('notesBtn').onclick=()=>notes.classList.toggle('open');
document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{
  if(['TEXTAREA','INPUT'].includes(document.activeElement.tagName))return;
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}
  if(e.key.toLowerCase()==='n')notes.classList.toggle('open');
});

document.querySelectorAll('.choice').forEach(x=>x.onclick=()=>{
  document.querySelectorAll('.choice').forEach(y=>y.classList.remove('selected'));
  x.classList.add('selected');
  document.getElementById('hookFeedback').textContent='Now name one strength and one risk of that route.';
});
document.querySelectorAll('.card').forEach(x=>x.onclick=()=>x.classList.toggle('open'));
document.querySelectorAll('.era').forEach(x=>x.onclick=()=>x.classList.toggle('open'));
document.querySelectorAll('.path-step').forEach(x=>x.onclick=()=>x.classList.toggle('open'));

let selectedPair=null;
let matched=0;
function clearPairSelection(){document.querySelectorAll('.pair:not(.matched)').forEach(p=>p.classList.remove('selected','wrong'));selectedPair=null}
function resetMatch(){
  matched=0;
  document.querySelectorAll('.pair').forEach(p=>p.classList.remove('selected','matched','wrong'));
  selectedPair=null;
  document.getElementById('matchFeedback').textContent='Find all four links.';
}
document.querySelectorAll('.pair').forEach(p=>p.onclick=()=>{
  if(p.classList.contains('matched'))return;
  if(!selectedPair){
    clearPairSelection();
    selectedPair=p;
    p.classList.add('selected');
    return;
  }
  if(selectedPair===p){clearPairSelection();return}
  if(selectedPair.dataset.side===p.dataset.side){
    clearPairSelection();
    selectedPair=p;
    p.classList.add('selected');
    return;
  }
  const a=selectedPair,b=p;
  if(a.dataset.id===b.dataset.id){
    a.classList.add('matched');b.classList.add('matched');
    a.classList.remove('selected');b.classList.remove('selected');
    selectedPair=null;matched++;
    document.getElementById('matchFeedback').textContent=matched===4?'All four linked. Old rhetoric, school jobs.':matched+' / 4 linked.';
  }else{
    a.classList.add('wrong');b.classList.add('wrong');
    document.getElementById('matchFeedback').textContent='Not that pair. Try another link.';
    setTimeout(()=>{a.classList.remove('wrong','selected');b.classList.remove('wrong','selected');selectedPair=null},500);
  }
});
document.getElementById('resetMatch').onclick=resetMatch;

function resetAll(){
  document.querySelectorAll('.choice,.card,.era,.path-step').forEach(x=>x.classList.remove('selected','open'));
  document.getElementById('hookFeedback').textContent='Pick one, then name one risk of relying on it alone.';
  resetMatch();
}
document.getElementById('resetAll').onclick=resetAll;
show(0);
</script>
</body>
</html>`;
  fs.writeFileSync(htmlPath, html, 'utf8');
}

buildPlan();
buildHtml();
console.log('Built Recreation Lesson plan and presentation.');

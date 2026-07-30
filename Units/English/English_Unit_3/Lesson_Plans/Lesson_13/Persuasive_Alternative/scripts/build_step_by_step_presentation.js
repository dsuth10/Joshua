const fs = require("fs");
const path = require("path");

const outputPath = path.resolve(
  __dirname,
  "..",
  "Lesson_13_Persuasive_Step_by_Step_Presentation.html"
);

const slides = [
  {
    hero: true,
    title: "Make Every Detail Help",
    subtitle: "Today you will help plan a quiet lunchtime zone.",
    body: `
      <div class="hero-goal">
        <b>You can point, speak or write.</b>
        <ol>
          <li>Read the lesson goal with an adult.</li>
          <li>Say: “I am ready to make my idea clear.”</li>
          <li>Press <strong>Next</strong>.</li>
        </ol>
      </div>`,
    done: "You know that today’s idea is a quiet lunchtime zone.",
    notes: "Read the goal aloud. Offer pointing, speech, copying or scribing from the beginning.",
  },
  {
    kicker: "STEP 1 • KNOW THE IDEA",
    title: "What change are we asking for?",
    body: `
      <div class="idea-card">
        <span>Our school should make</span>
        <strong>a quiet lunchtime zone.</strong>
      </div>
      <button class="reveal-button" data-reveal="A quiet lunchtime zone is a calm place students can use at lunch.">Show what the idea means</button>`,
    instructions: [
      "Read the sentence aloud, or listen while an adult reads it.",
      "Point to the words that name the change.",
      "Click the button. Say what the zone would be used for.",
      "Write or copy: a quiet lunchtime zone.",
    ],
    done: "You can name the change: a quiet lunchtime zone.",
    notes: "Keep the proposal fixed. The lesson is about choosing useful detail, not generating a new topic.",
  },
  {
    kicker: "STEP 2 • COMPARE",
    title: "Which sentence is easier to picture?",
    body: `
      <div class="choice-group" data-feedback="compareFeedback">
        <button class="choice-card" data-correct="false"><small>SENTENCE A</small><b>Our school needs a better place.</b></button>
        <button class="choice-card" data-correct="true"><small>SENTENCE B</small><b>Our school needs a quiet lunchtime zone beside the library.</b></button>
      </div>
      <div class="button-row">
        <button class="primary check-choice">Check my choice</button>
        <button class="secondary reset-choice">Try again</button>
      </div>
      <div class="feedback" id="compareFeedback" aria-live="polite">Choose one sentence.</div>`,
    instructions: [
      "Listen to both sentences.",
      "Picture each place in your mind.",
      "Click the sentence that gives more useful information.",
      "Click “Check my choice”.",
      "Finish this sentence aloud: “It is clearer because I know…”",
    ],
    done: "You chose a sentence and explained what its detail helps you know.",
    notes: "Accept a spoken explanation such as kind of place, time of use or location. Do not accept only “it has more words”.",
  },
  {
    kicker: "STEP 3 • THREE JOBS",
    title: "Useful detail has a job",
    body: `
      <div class="job-buttons">
        <button class="job-button" data-focus="identify"><b>IDENTIFY</b><span>What exactly?</span></button>
        <button class="job-button" data-focus="understand"><b>UNDERSTAND</b><span>What is the need?</span></button>
        <button class="job-button" data-focus="value"><b>VALUE</b><span>Why does it matter?</span></button>
      </div>
      <div class="model-sentence" data-active="none">
        Our school should make
        <mark data-part="identify">a quiet lunchtime zone beside the library</mark>
        for
        <mark data-part="understand">students who need a break from the noisy oval</mark>,
        so they can
        <mark data-part="value">return to class calm and ready to learn</mark>.
      </div>`,
    instructions: [
      "Read the whole sentence first.",
      "Click IDENTIFY. Read the yellow words. They name the exact change.",
      "Click UNDERSTAND. Read the yellow words. They explain the need.",
      "Click VALUE. Read the yellow words. They explain why the change matters.",
      "Say one job and point to the words that do that job.",
    ],
    done: "You can find detail that identifies, explains the need or shows value.",
    notes: "Read the sentence as a whole before using the three buttons. Ask for pointing plus a short oral explanation.",
  },
  {
    kicker: "STEP 4 • HEAD NOUN",
    title: "Find the main noun",
    body: `
      <div class="noun-strip" data-feedback="nounFeedback">
        <button class="noun-part" data-correct="false">a quiet lunchtime</button>
        <button class="noun-part head-choice" data-correct="true">ZONE</button>
        <button class="noun-part" data-correct="false">beside the library</button>
      </div>
      <div class="button-row">
        <button class="primary check-noun">Check my choice</button>
        <button class="secondary reset-noun">Try again</button>
      </div>
      <div class="feedback" id="nounFeedback" aria-live="polite">The head noun is the main person, place or thing.</div>`,
    instructions: [
      "Read the whole group: “a quiet lunchtime zone beside the library”.",
      "Ask: “What is the main place?”",
      "Click the one word that names the main place.",
      "Click “Check my choice”.",
      "Write or say: “Zone is the head noun.”",
    ],
    done: "You found the head noun and named it.",
    notes: "If needed, contrast: quiet describes; lunchtime tells when; beside the library tells which one; zone names the place.",
  },
  {
    kicker: "STEP 5 • USEFUL OR EMPTY?",
    title: "Does the detail teach us something?",
    body: `
      <div class="definition-row">
        <article><b>APPLAUSE WORDS</b><span>They sound positive, but they do not teach us much.</span></article>
        <article><b>USEFUL DETAIL</b><span>It helps us picture or understand the idea.</span></article>
      </div>
      <div class="reveal-grid">
        <button class="reveal-button" data-reveal="APPLAUSE WORDS • We only learn that the writer likes the idea.">an amazing, fantastic place</button>
        <button class="reveal-button" data-reveal="USEFUL DETAIL • We learn what the place is like and where it is.">a quiet zone beside the library</button>
        <button class="reveal-button" data-reveal="USEFUL DETAIL • We learn which students may need the zone.">students who need a break from noise</button>
        <button class="reveal-button" data-reveal="APPLAUSE WORDS • The praise is strong, but the idea is still unclear.">the best idea ever</button>
      </div>`,
    instructions: [
      "Read the two meanings at the top.",
      "Read one phrase.",
      "Before clicking, say “applause words” or “useful detail”.",
      "Click the phrase to check. Read what the audience learns.",
      "Repeat for all four phrases.",
      "Choose one useful phrase to copy onto your organiser.",
    ],
    done: "You checked all four phrases and copied one useful detail.",
    notes: "Ask for the category rule before each reveal. The key question is what the audience learns.",
  },
  {
    kicker: "STEP 6 • BUILD A REASON",
    title: "Who needs the quiet zone?",
    body: `
      <div class="single-builder" data-slot="students">
        <button data-value="sporty students who like to run and play" data-fit="weak">sporty students who like to run and play</button>
        <button data-value="students overwhelmed by the noisy oval" data-fit="strong">students overwhelmed by the noisy oval</button>
        <button data-value="students who would like to read" data-fit="possible">students who would like to read</button>
      </div>
      <div class="fit-feedback" data-fit-feedback="students">Choose one group. Then explain why it fits the quiet-zone idea.</div>
      <div class="sentence-preview">The quiet lunchtime zone would give <span data-output="students">[which students?]</span>…</div>`,
    instructions: [
      "Read or listen to all three choices.",
      "Ask: “Which group has a clear need for a quiet place?”",
      "Click one group.",
      "Read the feedback.",
      "If the choice is weak, choose again.",
      "Copy or say the group you chose.",
    ],
    done: "Your sentence names a group that could use the quiet zone.",
    notes: "The reading option is defensible. The overwhelmed-by-noise option states the clearest need. Require a reason, not guessing.",
  },
  {
    kicker: "STEP 7 • BUILD A REASON",
    title: "What could the quiet zone help them do?",
    body: `
      <div class="single-builder" data-slot="action">
        <button data-value="reset" data-fit="strong">reset</button>
        <button data-value="talk quietly" data-fit="possible">talk quietly</button>
        <button data-value="play noisy running games" data-fit="weak">play noisy running games</button>
      </div>
      <div class="fit-feedback" data-fit-feedback="action">Choose one action that matches a quiet place.</div>
      <div class="sentence-preview">…a calmer place to <span data-output="action">[do what?]</span>…</div>`,
    instructions: [
      "Read or listen to the three actions.",
      "Ask: “Can this action happen in a quiet zone?”",
      "Click one action.",
      "Read the feedback.",
      "If the action does not match, choose again.",
      "Copy or say the action you chose.",
    ],
    done: "Your action makes sense in a quiet zone.",
    notes: "Both reset and talk quietly can work. The noisy running-games option exposes relevance to purpose.",
  },
  {
    kicker: "STEP 8 • BUILD A REASON",
    title: "When would they use it?",
    body: `
      <div class="single-builder" data-slot="circumstance">
        <button data-value="at lunchtime" data-fit="strong">at lunchtime</button>
        <button data-value="before school opens" data-fit="weak">before school opens</button>
        <button data-value="on weekends" data-fit="weak">on weekends</button>
      </div>
      <div class="fit-feedback" data-fit-feedback="circumstance">Choose the time that matches a lunchtime zone.</div>
      <div class="sentence-preview">…<span data-output="circumstance">[when?]</span>.</div>`,
    instructions: [
      "Read or listen to the three times.",
      "Look back at the words “lunchtime zone”.",
      "Click the time that matches those words.",
      "Read the feedback.",
      "If the time does not match, choose again.",
      "Copy or say the time you chose.",
    ],
    done: "Your sentence tells when the zone would be used.",
    notes: "Point back to the proposal wording. This is an explicit consistency check.",
  },
  {
    kicker: "STEP 9 • READ THE WHOLE REASON",
    title: "Do all the parts work together?",
    body: `
      <div class="complete-reason">
        The quiet lunchtime zone would give
        <span data-output="students">[which students?]</span>
        a calmer place to
        <span data-output="action">[do what?]</span>
        <span data-output="circumstance">[when?]</span>.
      </div>
      <div class="button-row">
        <button class="primary read-check">Check the whole reason</button>
        <button class="secondary reset-reason">Clear all choices</button>
      </div>
      <div class="feedback" id="reasonFeedback" aria-live="polite">Choose one answer on Steps 6, 7 and 8 first.</div>`,
    instructions: [
      "Read the whole sentence aloud, or listen while an adult reads it.",
      "Ask three questions: Who? Do what? When?",
      "Click “Check the whole reason”.",
      "If a part is missing or does not fit, go back and change it.",
      "When it makes sense, copy the full sentence onto your organiser.",
    ],
    done: "You have one complete reason that answers who, what and when.",
    notes: "Return to the earlier choice slide if a revision is needed. Praise revision as evidence of control.",
  },
  {
    kicker: "STEP 10 • WRITE",
    title: "Build a short proposal",
    body: `
      <div class="writing-frame">
        <p><b>1.</b> Our school should make a quiet lunchtime zone.</p>
        <p><b>2.</b> <span data-copy="reason">Use your reason from the last slide.</span></p>
        <p><b>3.</b> The quiet zone could be beside the library.</p>
        <p><b>4.</b> It could have two sturdy benches.</p>
        <p><b>5.</b> Please try this helpful change.</p>
      </div>
      <button class="primary fill-reason">Put my reason into sentence 2</button>`,
    instructions: [
      "Read sentence 1. Copy it or ask for it to be scribed.",
      "Click “Put my reason into sentence 2”. Read and copy sentence 2.",
      "Read sentences 3 and 4. Underline the head nouns zone and benches.",
      "Copy sentence 5.",
      "Read all five sentences in order.",
    ],
    done: "Your organiser has a five-sentence proposal with a clear reason.",
    notes: "Scribing, copying, dictation and speech-to-text are all valid. Keep the conceptual work in the chosen detail.",
  },
  {
    kicker: "STEP 11 • CHECK",
    title: "Check that every detail helps",
    body: `
      <div class="checklist">
        <button data-check="idea"><span>1</span><b>I named the change.</b><small>a quiet lunchtime zone</small></button>
        <button data-check="reason"><span>2</span><b>I gave a clear reason.</b><small>who + action + when</small></button>
        <button data-check="detail"><span>3</span><b>I used useful detail.</b><small>not empty praise</small></button>
      </div>
      <div class="feedback" id="checkFeedback" aria-live="polite">Click each check after you find it in your writing.</div>`,
    instructions: [
      "Read check 1. Find and point to the change in your writing. Click check 1.",
      "Read check 2. Find and point to your reason. Click check 2.",
      "Read check 3. Find one detail that teaches the reader something. Click check 3.",
      "If you cannot find a part, add it before you finish.",
    ],
    done: "All three checks show DONE.",
    notes: "Do not click a check until the student locates evidence in the written response.",
  },
  {
    kicker: "FINISH",
    title: "Tell what your detail does",
    body: `
      <div class="exit-card">
        <p>My useful detail is:</p>
        <strong>________________________________________</strong>
        <p>It helps the reader know:</p>
        <strong>________________________________________</strong>
      </div>`,
    instructions: [
      "Choose the strongest detail in your proposal.",
      "Point to it and read it aloud.",
      "Copy it on the first line.",
      "Say what the reader learns from it.",
      "Write, dictate or ask for that explanation to be scribed.",
    ],
    done: "You named one useful detail and explained its job.",
    notes: "Use the explanation as the exit evidence. The number of describing words is not the success measure.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function instructionPanel(slide) {
  const steps = (slide.instructions || [])
    .map((step) => `<li>${step}</li>`)
    .join("");
  return `
    <aside class="instruction-panel">
      <div>
        <h3>Do this now</h3>
        <ol>${steps}</ol>
      </div>
      <div class="done-box"><b>Finished when</b><span>${slide.done}</span></div>
    </aside>`;
}

function renderSlide(slide) {
  if (slide.hero) {
    return `<section class="slide hero" data-notes="${escapeHtml(slide.notes)}">
      <div class="hero-copy">
        <div class="kicker">ENGLISH • PERSUASIVE WRITING</div>
        <h1>${slide.title}</h1>
        <p>${slide.subtitle}</p>
        ${slide.body}
        <div class="hero-done"><b>Finished when:</b> ${slide.done}</div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <span>VAGUE</span>
        <div>place</div>
        <i>↓ add useful detail ↓</i>
        <strong>quiet lunchtime zone beside the library</strong>
      </div>
    </section>`;
  }
  return `<section class="slide" data-notes="${escapeHtml(slide.notes)}">
    <header>
      <div class="kicker">${slide.kicker}</div>
      <h2>${slide.title}</h2>
    </header>
    <div class="work-area">${slide.body}</div>
    ${instructionPanel(slide)}
  </section>`;
}

function html() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lesson 13 — Make Every Detail Help</title>
<style>
:root{--nav:#0f3042;--nav-h:64px;--ink:#173044;--muted:#536975;--paper:#fffdf7;--cream:#f7f2e7;--teal:#14786e;--pale:#e8f5f1;--gold:#f0bd3f;--coral:#d9644f;--line:#9fbab5;--good:#17643b;--good-bg:#e4f4e8;--bad:#943723;--bad-bg:#fbe8e2}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#0b2635;color:var(--ink);font-family:Arial,sans-serif}button{font:inherit}.slide{display:none;position:absolute;inset:0 0 var(--nav-h);padding:24px 36px 18px;background:linear-gradient(135deg,var(--paper),#e9f4f1);overflow:hidden}.slide.active{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.75fr);grid-template-rows:auto 1fr;gap:14px 22px}.slide>header{grid-column:1/-1}.kicker{font-size:14px;font-weight:900;letter-spacing:1.7px;color:var(--teal)}h2{font-family:Georgia,serif;font-size:clamp(34px,3.3vw,54px);line-height:1;margin:5px 0 0;color:var(--ink)}.work-area{min-height:0;display:flex;flex-direction:column;justify-content:center;gap:14px}.instruction-panel{background:#fff;border:3px solid var(--teal);border-radius:18px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;min-height:0;box-shadow:0 10px 26px rgba(15,48,66,.12)}.instruction-panel h3{font-family:Georgia,serif;font-size:25px;margin:0 0 8px;color:var(--teal)}.instruction-panel ol{margin:0;padding-left:25px;font-size:17px;line-height:1.3}.instruction-panel li{margin-bottom:7px}.done-box{background:var(--nav);color:white;border-radius:12px;padding:12px 14px;display:grid;gap:4px}.done-box b{text-transform:uppercase;color:#ffe18a;font-size:13px;letter-spacing:1px}.done-box span{font-size:16px;line-height:1.25}
.hero{padding:0;background:linear-gradient(120deg,#0f3042,#175f62 70%,#14786e);color:#fff}.hero.active{display:grid;grid-template-columns:1.15fr .85fr}.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:5vh 4vw 5vh 6vw}.hero .kicker{color:#ffe18a}.hero h1{font-family:Georgia,serif;font-size:clamp(55px,6vw,92px);line-height:.95;margin:12px 0 18px}.hero-copy>p{font-size:28px;line-height:1.3;margin:0 0 20px}.hero-goal{background:#fff;color:var(--ink);border-radius:18px;padding:18px 22px;max-width:720px}.hero-goal b{font-size:22px;color:var(--teal)}.hero-goal ol{font-size:20px;line-height:1.4;margin:10px 0 0;padding-left:26px}.hero-done{margin-top:15px;border:2px solid rgba(255,255,255,.5);border-radius:12px;padding:11px 15px;font-size:18px}.hero-visual{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:13px;padding:4vw;text-align:center}.hero-visual span{font-size:14px;font-weight:900;letter-spacing:2px;color:#ffe18a}.hero-visual div,.hero-visual strong{background:#fff;color:var(--ink);border-radius:18px;padding:22px;width:min(520px,38vw);font-size:28px}.hero-visual div{opacity:.65}.hero-visual i{font-size:18px;color:#ffe18a}.hero-visual strong{border:4px solid var(--gold);font-family:Georgia,serif;font-size:32px}
.idea-card,.complete-reason,.sentence-preview,.exit-card{background:#fff;border:3px solid var(--teal);border-radius:18px;padding:22px;text-align:center}.idea-card{display:grid;gap:9px}.idea-card span{font-size:22px}.idea-card strong{font-family:Georgia,serif;font-size:38px;color:var(--teal)}.reveal-button,.primary,.secondary{border-radius:12px;padding:13px 16px;font-weight:850;cursor:pointer}.reveal-button{border:2px solid var(--teal);background:#fff;font-size:18px}.reveal-button.revealed{background:var(--nav);color:#fff}.reveal-button.revealed::after{content:attr(data-reveal);display:block;margin-top:8px;color:#fff3bd;font-size:15px;line-height:1.3}.button-row{display:flex;gap:10px;justify-content:center}.primary{border:0;background:var(--teal);color:#fff}.secondary{border:2px solid var(--line);background:#fff;color:var(--ink)}
.choice-group{display:grid;grid-template-columns:1fr 1fr;gap:14px}.choice-card{border:3px solid var(--line);background:#fff;border-radius:16px;padding:20px;text-align:left;cursor:pointer;display:grid;gap:8px}.choice-card small{font-weight:900;color:var(--teal)}.choice-card b{font-size:22px;line-height:1.3}.choice-card.selected{border-color:var(--gold);outline:4px solid rgba(240,189,63,.28)}.choice-card.correct{background:var(--good-bg);border-color:var(--good)}.choice-card.incorrect{background:var(--bad-bg);border-color:var(--bad)}.feedback,.fit-feedback{background:#fff;border-left:8px solid var(--gold);border-radius:10px;padding:12px 15px;font-size:17px;font-weight:750;line-height:1.3}
.job-buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.job-button{border:2px solid var(--teal);background:#fff;border-radius:14px;padding:13px;cursor:pointer}.job-button b{display:block;font-size:18px;color:var(--teal)}.job-button span{display:block;margin-top:4px}.job-button.selected{background:var(--nav);color:#fff}.job-button.selected b{color:#ffe18a}.model-sentence{background:#fff;border-radius:16px;padding:20px;font-size:21px;line-height:1.5;text-align:center;border:2px solid var(--line)}.model-sentence mark{background:transparent;border-radius:5px;padding:2px}.model-sentence[data-active="identify"] mark[data-part="identify"],.model-sentence[data-active="understand"] mark[data-part="understand"],.model-sentence[data-active="value"] mark[data-part="value"]{background:#ffe18a;box-shadow:0 0 0 2px #c78c08}
.noun-strip{display:flex;justify-content:center;align-items:stretch;gap:7px}.noun-part{border:3px solid var(--line);background:#fff;padding:22px 18px;font-size:21px;font-weight:800;cursor:pointer}.noun-part:first-child{border-radius:15px 4px 4px 15px}.noun-part:last-child{border-radius:4px 15px 15px 4px}.head-choice{font-family:Georgia,serif;font-size:30px;background:var(--pale)}.noun-part.selected{outline:4px solid rgba(240,189,63,.3);border-color:var(--gold)}.noun-part.correct{background:var(--good-bg);border-color:var(--good)}.noun-part.incorrect{background:var(--bad-bg);border-color:var(--bad)}
.definition-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.definition-row article{background:#fff;border-top:7px solid var(--teal);border-radius:13px;padding:13px}.definition-row b{display:block;color:var(--teal);font-size:17px}.definition-row span{display:block;margin-top:5px;line-height:1.25}.reveal-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.reveal-grid .reveal-button{min-height:94px}
.single-builder{display:grid;gap:10px}.single-builder button{border:3px solid var(--line);background:#fff;border-radius:13px;padding:15px;font-weight:800;font-size:18px;cursor:pointer}.single-builder button.selected{background:var(--nav);color:#fff;border-color:var(--nav);outline:4px solid rgba(240,189,63,.32)}.fit-feedback.strong{background:var(--good-bg);border-color:var(--good);color:var(--good)}.fit-feedback.weak{background:var(--bad-bg);border-color:var(--bad);color:var(--bad)}.sentence-preview{font-size:20px;padding:15px}.sentence-preview span,.complete-reason span{color:var(--teal);border-bottom:2px solid var(--gold);font-weight:850}.complete-reason{font-size:25px;line-height:1.55;font-weight:750}
.writing-frame{background:#fff;border:2px solid var(--teal);border-radius:16px;padding:13px 20px}.writing-frame p{font-size:18px;line-height:1.3;margin:7px 0;padding-bottom:6px;border-bottom:1px solid #d9e5e1}.writing-frame p:last-child{border-bottom:0}.writing-frame b{color:var(--teal)}.writing-frame [data-copy="reason"]{color:var(--muted);font-style:italic}.checklist{display:grid;gap:11px}.checklist button{display:grid;grid-template-columns:45px 1fr;grid-template-rows:auto auto;text-align:left;border:3px solid var(--line);background:#fff;border-radius:14px;padding:13px;cursor:pointer}.checklist button>span{grid-row:1/3;align-self:center;justify-self:center;background:var(--nav);color:#fff;border-radius:50%;width:34px;height:34px;display:grid;place-items:center;font-weight:900}.checklist b{font-size:19px}.checklist small{font-size:15px;color:var(--muted);margin-top:3px}.checklist button.checked{background:var(--good-bg);border-color:var(--good)}.checklist button.checked small::after{content:" • DONE";font-weight:900;color:var(--good)}.exit-card p{font-size:18px;margin:4px 0 8px}.exit-card strong{display:block;font-size:23px;margin-bottom:17px}
.nav{position:absolute;inset:auto 0 0;height:var(--nav-h);background:var(--nav);color:#fff;display:flex;align-items:center;gap:11px;padding:0 16px}.nav button{border:0;background:transparent;color:#fff;padding:10px 12px;border-radius:8px;font-weight:850;cursor:pointer}.nav button:hover,.nav button:focus-visible{background:rgba(255,255,255,.15);outline:2px solid var(--gold)}.progress{height:7px;flex:1;background:rgba(255,255,255,.2);border-radius:99px;overflow:hidden}.progress i{display:block;height:100%;background:var(--gold)}.slide-number{min-width:64px;font-weight:900}.notes{display:none;position:absolute;right:18px;bottom:76px;width:min(520px,46vw);max-height:68vh;overflow:auto;background:#fff;border:3px solid var(--teal);border-radius:14px;padding:16px;z-index:5;box-shadow:0 18px 50px rgba(0,0,0,.28)}.notes.open{display:block}.notes h3{margin:0 0 7px;color:var(--teal)}
@media(max-width:1050px){.slide{padding:18px 24px 14px;grid-template-columns:minmax(0,1.4fr) minmax(300px,.8fr);gap:10px 14px}h2{font-size:34px}.instruction-panel{padding:12px}.instruction-panel ol{font-size:14px;line-height:1.2}.instruction-panel li{margin-bottom:5px}.done-box span{font-size:14px}.choice-card b{font-size:18px}.model-sentence{font-size:17px}.complete-reason{font-size:20px}.hero-goal ol{font-size:17px}.hero-visual strong{font-size:25px}.writing-frame p{font-size:15px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<main>${slides.map(renderSlide).join("\n")}</main>
<aside class="notes" id="notes"><h3>Teacher note</h3><p id="notesText"></p></aside>
<nav class="nav" aria-label="Presentation controls">
  <button id="prev">← Previous</button>
  <div class="progress" aria-hidden="true"><i id="progress"></i></div>
  <span class="slide-number" id="slideNumber"></span>
  <button id="notesButton">Notes</button>
  <button id="resetButton">Reset all</button>
  <button id="fullButton">Fullscreen</button>
  <button id="next">Next →</button>
</nav>
<script>
const slides=[...document.querySelectorAll('.slide')];
let current=0;
const reasonState={students:'',action:'',circumstance:''};
const placeholders={students:'[which students?]',action:'[do what?]',circumstance:'[when?]'};
const notes=document.getElementById('notes');
const notesText=document.getElementById('notesText');
function showSlide(number){
  current=Math.max(0,Math.min(slides.length-1,number));
  slides.forEach((slide,index)=>slide.classList.toggle('active',index===current));
  document.getElementById('slideNumber').textContent=(current+1)+' / '+slides.length;
  document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';
  notesText.textContent=slides[current].dataset.notes||'';
  notes.classList.remove('open');
}
function updateReason(){
  document.querySelectorAll('[data-output]').forEach(element=>{
    const slot=element.dataset.output;
    element.textContent=reasonState[slot]||placeholders[slot];
  });
}
document.getElementById('prev').onclick=()=>showSlide(current-1);
document.getElementById('next').onclick=()=>showSlide(current+1);
document.getElementById('notesButton').onclick=()=>notes.classList.toggle('open');
document.getElementById('resetButton').onclick=()=>location.reload();
document.getElementById('fullButton').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',event=>{
  if(['BUTTON','INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  if(['ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();showSlide(current+1)}
  if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();showSlide(current-1)}
  if(event.key==='Home')showSlide(0);
  if(event.key==='End')showSlide(slides.length-1);
});
document.querySelectorAll('.reveal-button').forEach(button=>button.onclick=()=>button.classList.toggle('revealed'));
document.querySelectorAll('.job-button').forEach(button=>button.onclick=()=>{
  const slide=button.closest('.slide');
  slide.querySelectorAll('.job-button').forEach(item=>item.classList.toggle('selected',item===button));
  slide.querySelector('.model-sentence').dataset.active=button.dataset.focus;
});
document.querySelectorAll('.choice-card').forEach(button=>button.onclick=()=>{
  const group=button.closest('.choice-group');
  group.querySelectorAll('.choice-card').forEach(item=>item.classList.remove('selected','correct','incorrect'));
  button.classList.add('selected');
});
document.querySelectorAll('.check-choice').forEach(button=>button.onclick=()=>{
  const slide=button.closest('.slide');
  const selected=slide.querySelector('.choice-card.selected');
  const feedback=slide.querySelector('.feedback');
  if(!selected){feedback.textContent='Choose one sentence first.';return}
  const correct=selected.dataset.correct==='true';
  selected.classList.add(correct?'correct':'incorrect');
  feedback.textContent=correct?'Yes. Sentence B tells us the kind of place, when it is used and where it is.':'Sentence A is still hard to picture. Try the sentence with useful information.';
});
document.querySelectorAll('.reset-choice').forEach(button=>button.onclick=()=>{
  const slide=button.closest('.slide');
  slide.querySelectorAll('.choice-card').forEach(item=>item.classList.remove('selected','correct','incorrect'));
  slide.querySelector('.feedback').textContent='Choose one sentence.';
});
document.querySelectorAll('.noun-part').forEach(button=>button.onclick=()=>{
  const strip=button.closest('.noun-strip');
  strip.querySelectorAll('.noun-part').forEach(item=>item.classList.remove('selected','correct','incorrect'));
  button.classList.add('selected');
});
document.querySelector('.check-noun').onclick=()=>{
  const slide=document.querySelector('.check-noun').closest('.slide');
  const selected=slide.querySelector('.noun-part.selected');
  const feedback=slide.querySelector('.feedback');
  if(!selected){feedback.textContent='Choose one word or group first.';return}
  const correct=selected.dataset.correct==='true';
  selected.classList.add(correct?'correct':'incorrect');
  feedback.textContent=correct?'Yes. Zone names the main place. It is the head noun.':'That part adds information about the zone. Look for the word that names the place.';
};
document.querySelector('.reset-noun').onclick=()=>{
  const slide=document.querySelector('.reset-noun').closest('.slide');
  slide.querySelectorAll('.noun-part').forEach(item=>item.classList.remove('selected','correct','incorrect'));
  slide.querySelector('.feedback').textContent='The head noun is the main person, place or thing.';
};
document.querySelectorAll('.single-builder button').forEach(button=>button.onclick=()=>{
  const group=button.closest('.single-builder');
  const slot=group.dataset.slot;
  group.querySelectorAll('button').forEach(item=>item.classList.toggle('selected',item===button));
  reasonState[slot]=button.dataset.value;
  updateReason();
  const feedback=button.closest('.slide').querySelector('[data-fit-feedback]');
  const fit=button.dataset.fit;
  feedback.className='fit-feedback '+fit;
  if(fit==='strong')feedback.textContent='Strong fit. This choice gives a clear reason for the quiet zone.';
  if(fit==='possible')feedback.textContent='This can fit. Say why this choice could use a quiet place.';
  if(fit==='weak')feedback.textContent='Weak fit. This choice does not match the purpose of a quiet lunchtime zone. Choose again.';
});
document.querySelector('.read-check').onclick=()=>{
  const feedback=document.getElementById('reasonFeedback');
  const missing=Object.keys(reasonState).filter(key=>!reasonState[key]);
  if(missing.length){feedback.textContent='A part is missing. Go back and choose who, what and when.';return}
  const weak=[...document.querySelectorAll('.single-builder button.selected')].some(button=>button.dataset.fit==='weak');
  feedback.textContent=weak?'The sentence is complete, but one choice does not fit the quiet-zone idea. Go back and revise it.':'The sentence is complete and the choices work together. Read it aloud, then copy it.';
};
document.querySelector('.reset-reason').onclick=()=>{
  Object.keys(reasonState).forEach(key=>reasonState[key]='');
  document.querySelectorAll('.single-builder button').forEach(button=>button.classList.remove('selected'));
  document.querySelectorAll('.fit-feedback').forEach(element=>{element.className='fit-feedback';element.textContent='Choose again when you return to this step.'});
  document.getElementById('reasonFeedback').textContent='Choose one answer on Steps 6, 7 and 8 first.';
  updateReason();
};
document.querySelector('.fill-reason').onclick=()=>{
  const target=document.querySelector('[data-copy="reason"]');
  if(Object.values(reasonState).some(value=>!value)){target.textContent='Go back and finish who, what and when first.';return}
  target.textContent='The quiet lunchtime zone would give '+reasonState.students+' a calmer place to '+reasonState.action+' '+reasonState.circumstance+'.';
};
document.querySelectorAll('.checklist button').forEach(button=>button.onclick=()=>{
  button.classList.toggle('checked');
  const count=document.querySelectorAll('.checklist button.checked').length;
  document.getElementById('checkFeedback').textContent=count===3?'All three checks are DONE. You are ready for the final slide.':count+' of 3 checks are done.';
});
updateReason();
showSlide(0);
</script>
</body>
</html>`;
}

fs.writeFileSync(outputPath, html(), "utf8");
console.log(`Built ${path.basename(outputPath)}`);

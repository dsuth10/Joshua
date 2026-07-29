const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

/*
 * Authoritative generator for the persuasive alternative to English Unit 3,
 * Lesson 13. The original novel-based lesson is intentionally untouched.
 *
 * DOCX design basis: compact_reference_guide.
 * Named classroom override: A4 portrait, 12 mm margins, Arial, restrained
 * navy/teal/coral palette, fixed-width tables and workbook-ready response space.
 */

const outputDir = path.resolve(__dirname, "..");
const palette = {
  ink: "20303C",
  navy: "173B57",
  teal: "19756B",
  coral: "D8654F",
  amber: "E8B44A",
  mist: "EAF4F1",
  paleBlue: "EAF1F7",
  paleCoral: "FBECE7",
  paper: "FFFDF7",
  line: "AFC4C2",
  muted: "5F6F74",
  white: "FFFFFF",
};

const slides = [
  {
    hero: true,
    notes:
      "Open with the contrast between a vague idea and a proposal an audience can picture. Do not define expanded noun groups yet.",
  },
  {
    kicker: "AUDIENCE TEST • ORGANISER",
    title: "Which proposal is easier to support?",
    time: 4,
    body: `
      <div class="choice-set compare-choice">
        <button class="choice-card" data-correct="false"><small>A</small><b>Our school needs a better area.</b></button>
        <button class="choice-card" data-correct="true"><small>B</small><b>Our school needs a calm, shaded lunchtime area beside the library.</b></button>
      </div>
      <div class="action-row"><button class="btn check-choice">Check the choice</button><button class="btn ghost reset-local">Reset</button><span class="feedback" aria-live="polite"></span></div>
      <p class="thinking-prompt">Stronger because the reader now understands…</p>`,
    task: {
      do: "Choose the stronger proposal and justify what its added detail helps the audience understand.",
      work: "Think, pair, justify",
      record: "Organiser: opening test",
      finish: "One choice and one reason",
      check: "Do not stop at “it has more adjectives”.",
    },
    notes:
      "Press for the job of the detail. Students should notice the kind of place, its use and its location. More words alone are not the reason.",
  },
  {
    kicker: "MISSION",
    title: "Detail must earn its place",
    time: 3,
    body: `
      <div class="mission-grid">
        <article><b>IDENTIFY</b><span>Who or what exactly?</span></article>
        <article><b>UNDERSTAND</b><span>What is the real need?</span></article>
        <article><b>VALUE</b><span>Why should the audience care?</span></article>
      </div>
      <div class="product-callout"><strong>Finished response:</strong> a 6–8 sentence school-improvement proposal</div>`,
    task: {
      do: "Copy the lesson test: Keep detail only when it helps the audience identify, understand or value the idea.",
      work: "Whole class",
      record: "Organiser heading",
      finish: "The three jobs recorded",
      check: "Length is not one of the jobs.",
    },
    notes:
      "Make the product and audience visible. This lesson is persuasive writing through grammar, not a description exercise with a persuasive title.",
  },
  {
    kicker: "NOUN-GROUP LAB • ORGANISER",
    title: "Find the head noun. Then make it useful.",
    time: 5,
    body: `
      <div class="noun-build">
        <span class="token pre">a calm, shaded lunchtime</span>
        <span class="token head">AREA</span>
        <span class="token post">beside the library</span>
      </div>
      <div class="job-row">
        <button class="reveal-card" data-reveal="BEFORE • describes the kind and purpose">a calm, shaded lunchtime</button>
        <button class="reveal-card" data-reveal="HEAD NOUN • the central thing">area</button>
        <button class="reveal-card" data-reveal="AFTER • identifies which area">beside the library</button>
      </div>
      <p class="thinking-prompt">What does each addition contribute that “area” does not?</p>`,
    task: {
      do: "Underline the head noun, then build three versions of “students” for three different persuasive jobs.",
      work: "Pairs",
      record: "Organiser: noun-group lab",
      finish: "Three groups and three head nouns",
      check: "Each version needs a different job.",
    },
    notes:
      "Use the terms head noun and expanded noun group. Detail can occur before or after the noun. Compare effects rather than selecting one universal winner.",
  },
  {
    kicker: "PRECISION TEST • ORGANISER",
    title: "Useful detail—or an adjective pile?",
    time: 5,
    body: `
      <div class="before-after">
        <article><small>APPLAUSE WORDS</small><p>an amazing, wonderful, fantastic, beautiful new space</p><button class="reveal-card" data-reveal="The praise is loud, but the proposal is still vague.">What does the audience learn?</button></article>
        <article><small>USEFUL DETAIL</small><p>a quiet, weather-protected space near the junior playground</p><button class="reveal-card" data-reveal="The audience can picture the kind, function and location.">What does the audience learn?</button></article>
      </div>`,
    task: {
      do: "Cross out empty additions in the adjective pile. Replace them with detail that identifies, locates or explains.",
      work: "Independent, then partner",
      record: "Organiser: precision test",
      finish: "One revision and one deletion reason",
      check: "Positive-sounding is not the same as precise.",
    },
    notes:
      "Accept different clean revisions when students can name the information supplied. This exposes the central misconception.",
  },
  {
    kicker: "REASON BUILDER • ORGANISER",
    title: "Make the reason exact",
    time: 5,
    body: `
      <div class="reason-flow">
        <div class="vague">It would help students.</div>
        <div class="arrow">→</div>
        <div class="questions"><b>Which students?</b><b>Help them do what?</b><b>When or where?</b></div>
        <div class="arrow">→</div>
        <div class="exact">The quiet lunchtime zone would give <u>students overwhelmed by the noisy oval</u> a calmer place to talk or reset.</div>
      </div>
      <p class="thinking-prompt">Grammar sharpens a reason. It does not replace the reason.</p>`,
    task: {
      do: "Improve one vague reason so it names a specific group and benefit.",
      work: "Whole class model, then independent",
      record: "Organiser: reason builder",
      finish: "One exact persuasive reason",
      check: "The sentence must answer at least two questions.",
    },
    notes:
      "Underline the expanded noun group in the model. For Year 6, also notice the precise verb give and the circumstance at lunch implicit in the proposal.",
  },
  {
    kicker: "CHOOSE YOUR CASE",
    title: "Choose a proposal worth improving",
    time: 4,
    body: `
      <div class="proposal-grid">
        <button class="reveal-card" data-reveal="Possible audience concern: supervision and location"><b>QUIET ZONE</b><span>Create a calm place at lunch</span></button>
        <button class="reveal-card" data-reveal="Possible audience concern: placement and practicality"><b>SHADED SEATING</b><span>Add more protected places to sit</span></button>
        <button class="reveal-card" data-reveal="Possible audience concern: fairness and organisation"><b>STUDENT CHOICE</b><span>Offer a weekly choice activity</span></button>
      </div>
      <div class="claim-frame">Our school should <span>________________</span> because <span>________________</span>.</div>`,
    task: {
      do: "Choose a prompt or another appropriate small improvement. Name the principal or student council as the audience.",
      work: "Independent",
      record: "Organiser: proposal choice",
      finish: "Claim, reason and audience",
      check: "Avoid claims or costs you cannot support.",
    },
    notes:
      "Approve sensible alternatives quickly. Redirect named complaints, unsafe proposals or invented spending claims. Clicking a topic reveals a realistic audience concern.",
  },
  {
    kicker: "PEOPLE • PROBLEM • PROPOSAL",
    title: "Plan three noun groups with three jobs",
    time: 5,
    body: `
      <div class="plan-grid">
        <article><small>PEOPLE AFFECTED</small><b>students / classes / families</b><p>Which ones? What matters to them?</p></article>
        <article><small>PROBLEM NOW</small><b>area / equipment / routine</b><p>Which exact problem?</p></article>
        <article><small>PROPOSED CHANGE</small><b>zone / seats / activity</b><p>What would it actually be like?</p></article>
      </div>
      <div class="purpose-line">This detail helps my audience <span>____________________________</span>.</div>`,
    task: {
      do: "Create three expanded noun groups. Underline each head noun and explain the detail’s job.",
      work: "Independent; oral rehearsal available",
      record: "Organiser: planning table",
      finish: "Three groups and three purpose notes",
      check: "Approval words alone are not enough.",
    },
    notes:
      "Conference first with students whose additions express praise but not precision. Each planned group should feed the final proposal.",
  },
  {
    kicker: "ANNOTATED PERSUASIVE MODEL",
    title: "Read the model like a writer",
    time: 5,
    body: `
      <div class="model-text">
        <button class="annot" data-reveal="CLAIM + CONCRETE PROPOSAL">Our school should create a calm, shaded lunchtime zone beside the library.</button>
        <button class="annot" data-reveal="PEOPLE + PRECISE PROBLEM">At present, students who find the crowded oval overwhelming have few comfortable places to pause.</button>
        <button class="annot" data-reveal="SPECIFIC BENEFIT">A clearly marked quiet area would give these students a safer place to talk, read or reset.</button>
        <button class="annot" data-reveal="CONCRETE IMPLEMENTATION">Two sturdy benches beneath a simple shade structure could make the idea practical and easy to supervise.</button>
        <button class="annot" data-reveal="ANTICIPATES A CONCERN">The space would not replace active play; it would give students one additional choice.</button>
        <button class="annot" data-reveal="RESPECTFUL CALL TO ACTION">Please consider trialling this small, inclusive change for four weeks.</button>
      </div>`,
    task: {
      do: "Find the problem, solution, benefit and anticipated concern. Star one move to imitate.",
      work: "Whole class",
      record: "Organiser: model notes",
      finish: "Four moves found and one starred",
      check: "Name each choice’s persuasive job before its grammar.",
    },
    notes:
      "Read the whole model first. Then reveal decisions one at a time. This is an original teacher model and contains no invented statistics.",
  },
  {
    depth: true,
    kicker: "DEPTH A • OPTIONAL",
    title: "Change the audience",
    time: 10,
    body: `
      <div class="audience-split">
        <article><small>PRINCIPAL</small><b>feasibility • supervision • implementation</b></article>
        <article><small>OTHER STUDENTS</small><b>fairness • usefulness • choice</b></article>
      </div>
      <p class="thinking-prompt">Rewrite one sentence twice. Which noun-group detail changes—and why?</p>`,
    task: {
      do: "Create two audience-specific versions and explain one change.",
      work: "Independent, then compare",
      record: "Workbook margin",
      finish: "Two versions and one explanation",
      check: "Adapt the detail, not merely the greeting.",
    },
    notes:
      "Optional depth. This increases audience control and transfer rather than writing volume.",
  },
  {
    depth: true,
    kicker: "DEPTH B • OPTIONAL",
    title: "Cut ten words without weakening the case",
    time: 8,
    body: `
      <div class="overload-line">The extremely wonderful, truly fantastic, very special new lunchtime area would be an absolutely amazing and brilliant improvement for all of our many different students.</div>
      <p class="thinking-prompt">Cut applause. Add any missing precision. Justify two changes.</p>`,
    task: {
      do: "Edit the sentence down, then justify two changes.",
      work: "Pairs",
      record: "Workbook margin",
      finish: "One precise revision and two reasons",
      check: "Sharper meaning matters more than the word count.",
    },
    notes:
      "Optional depth. Reward precision and control, not simply the greatest number of deletions.",
  },
  {
    kicker: "WORKBOOK • INDEPENDENT",
    title: "Write One Change Our School Should Make",
    time: 12,
    timer: 12,
    body: `
      <div class="writing-brief">
        <h3>6–8 persuasive sentences</h3>
        <ul><li>Clear claim</li><li>Precise problem or opportunity</li><li>Two reasons or benefits</li><li>Concrete proposed change</li><li>Respectful call to action</li><li>Three purposeful expanded noun groups</li></ul>
        <p><b>Year 5:</b> underline three head nouns. <b>Year 6:</b> mark three precise verbs and two useful adverbials.</p>
      </div>`,
    task: {
      do: "Write the complete proposal for your chosen audience.",
      work: "Independent and silent",
      record: "Facing workbook page",
      finish: "One complete 6–8 sentence proposal",
      check: "Every added detail must help the case.",
    },
    notes:
      "Optional sentence launches may remain visible. Students do not need to follow a fixed formula. Confer from the organiser rather than supplying whole sentences.",
  },
  {
    kicker: "AUDIENCE TEST • REVISE",
    title: "Can your reader picture the case?",
    time: 5,
    body: `
      <div class="feedback-split">
        <article><small>REVIEWER</small><p>This detail helps me understand <span>________________</span>.</p><p>I still need more precise detail about <span>________________</span>.</p></article>
        <article><small>WRITER</small><p>Bracket one noun group.</p><p>Add, replace or remove detail.</p><p>Make one visible revision now.</p></article>
      </div>
      <div class="check-strip"><b>□ specific people/problem</b><b>□ concrete proposal</b><b>□ detail earns its place</b><b>□ respectful audience fit</b></div>`,
    task: {
      do: "Give both feedback stems, then revise one noun group.",
      work: "Partner feedback, then independent",
      record: "Workbook proposal",
      finish: "One visible revision",
      check: "The writer keeps control of the final wording.",
    },
    notes:
      "The reviewer diagnoses clarity rather than rewriting the sentence. Ask writers to make the revision immediately.",
  },
  {
    kicker: "EXIT EVIDENCE",
    title: "Prove that the detail has a job",
    time: 2,
    body: `
      <div class="exit-line">My strongest noun group is <span>________________________</span>.</div>
      <div class="exit-line second">It is persuasive because it helps the audience <span>________________________</span>.</div>`,
    task: {
      do: "Box the noun group, underline its head noun and explain its persuasive job.",
      work: "Independent",
      record: "Organiser exit box",
      finish: "Group, head noun and explanation",
      check: "Explain the job—not the number of describing words.",
    },
    notes:
      "Safe stopping point. Use the explanation as the strongest evidence of conceptual understanding.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function taskPanel(task) {
  if (!task) return "";
  return `<div class="task-panel">
    <div><small>DO</small><b>${task.do}</b></div>
    <div><small>WORK</small><b>${task.work}</b></div>
    <div><small>RECORD</small><b>${task.record}</b></div>
    <div><small>FINISH</small><b>${task.finish}</b></div>
    <div class="wide"><small>CHECK</small><b>${task.check}</b></div>
  </div>`;
}

function renderSlide(slide, index) {
  if (slide.hero) {
    return `<section class="slide hero${index === 0 ? " active" : ""}" data-notes="${escapeHtml(slide.notes)}">
      <div class="hero-copy">
        <div class="kicker">PERSUASIVE ALTERNATIVE • LESSON 13</div>
        <h1>Make the Detail<br>Do the Persuading</h1>
        <p>Turn a vague school-improvement idea into a proposal an audience can picture—and support.</p>
        <div class="hero-tags"><span>EXPANDED NOUN GROUPS</span><span>PRECISION</span><span>AUDIENCE</span></div>
      </div>
      <div class="hero-visual" aria-label="A vague noun group being expanded into a precise proposal">
        <div class="mini-card faded">an area</div>
        <div class="motion-arrow">→</div>
        <div class="sentence-stack"><span>a calm, shaded lunchtime</span><strong>AREA</strong><span>beside the library</span></div>
      </div>
    </section>`;
  }
  const timer = slide.timer
    ? `<div class="timer-box"><span class="timer-readout" data-start="${slide.timer * 60}">${String(slide.timer).padStart(2, "0")}:00</span><button class="btn timer-start">Start / reset timer</button></div>`
    : "";
  return `<section class="slide${slide.depth ? " depth-slide" : ""}" data-notes="${escapeHtml(slide.notes)}">
    <header class="slide-head">
      <div><div class="kicker">${slide.kicker}</div><h2>${slide.title}</h2></div>
      <div class="slide-meta"><span class="${slide.depth ? "depth-badge" : "core-badge"}">${slide.depth ? "OPTIONAL DEPTH" : "CORE"}</span><span>${slide.time} MIN</span></div>
    </header>
    <div class="slide-body">${slide.body}${timer}</div>
    ${taskPanel(slide.task)}
  </section>`;
}

function presentationHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lesson 13 — Make the Detail Do the Persuading</title>
<style>
:root{--accent:#19756b;--dark:#173b57;--deep:#102c3c;--paper:#fffdf7;--ink:#20303c;--muted:#5f6f74;--line:#afc4c2;--amber:#e8b44a;--coral:#d8654f;--nav:68px}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--deep);font-family:Arial,sans-serif;color:var(--ink)}button{font:inherit}.slide{display:none;position:absolute;inset:0 0 var(--nav);padding:30px 50px 18px;background:linear-gradient(135deg,#fffef9,#eaf4f1);overflow:hidden}.slide.active{display:flex;flex-direction:column}.depth-slide{background:linear-gradient(135deg,#fff8e8,#f5efe0)}
.hero{background:radial-gradient(circle at 78% 25%,rgba(232,180,74,.26),transparent 28%),linear-gradient(120deg,#102c3c 0%,#173b57 55%,#19756b 100%);color:white;padding:0;display:none}.hero.active{display:grid;grid-template-columns:1.08fr .92fr}.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:7vh 2vw 7vh 6vw}.hero h1{font-family:Georgia,serif;font-size:clamp(48px,5.2vw,84px);line-height:.98;margin:12px 0 20px;letter-spacing:-2px}.hero p{font-size:clamp(20px,2vw,31px);line-height:1.3;max-width:760px;margin:0 0 28px}.hero-tags{display:flex;gap:10px;flex-wrap:wrap}.hero-tags span{border:1px solid rgba(255,255,255,.48);border-radius:999px;padding:9px 14px;font-weight:900;font-size:13px;background:rgba(0,0,0,.13)}.hero-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:5vw}.mini-card,.sentence-stack{width:min(500px,40vw);background:#fff;color:var(--dark);border-radius:22px;padding:24px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.22)}.mini-card{font-size:29px}.faded{opacity:.55}.motion-arrow{font-size:38px;color:var(--amber);transform:rotate(90deg)}.sentence-stack{display:grid;gap:7px;border:4px solid var(--amber)}.sentence-stack span{font-size:20px}.sentence-stack strong{font-family:Georgia,serif;font-size:44px;color:var(--accent)}
.kicker{font-size:14px;font-weight:900;letter-spacing:2px;color:var(--accent);text-transform:uppercase}.hero .kicker{color:#f9cf73}.slide-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:12px}.slide-head h2{font-family:Georgia,serif;font-size:clamp(31px,3.1vw,51px);line-height:1.03;margin:5px 0 0;color:var(--dark);letter-spacing:-1px}.slide-meta{display:flex;gap:8px;white-space:nowrap}.slide-meta span{padding:8px 11px;border-radius:999px;background:#fff;border:1px solid var(--line);font-weight:900;font-size:12px}.core-badge{background:#e5f2ed!important;color:#255d54;border-color:#9fc9be!important}.depth-badge{background:#fff0c8!important;color:#6b4e00;border-color:#ddb85d!important}.slide-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:13px}
.task-panel{display:grid;grid-template-columns:1.55fr .82fr 1.12fr 1.2fr;gap:7px;margin-top:10px}.task-panel>div{background:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 10px;min-height:48px;display:flex;flex-direction:column;gap:3px}.task-panel .wide{grid-column:1/-1;min-height:36px;display:grid;grid-template-columns:70px 1fr;align-items:center}.task-panel small{font-size:10px;font-weight:900;letter-spacing:1.2px;color:var(--accent)}.task-panel b{font-size:13px;line-height:1.16}.mission-grid,.plan-grid,.proposal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.mission-grid article,.plan-grid article{background:#fff;border-top:8px solid var(--accent);border-radius:16px;padding:24px;text-align:center;box-shadow:0 8px 22px rgba(17,50,46,.09)}.mission-grid b{font-size:25px;color:var(--dark);display:block}.mission-grid span{font-size:18px;display:block;margin-top:8px}.product-callout{background:var(--dark);color:white;border-radius:14px;padding:16px 22px;font-size:21px;text-align:center}
.choice-set{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.choice-card{border:3px solid var(--line);background:#fff;border-radius:17px;padding:24px;cursor:pointer;text-align:left;display:grid;gap:9px}.choice-card small{font-size:15px;color:var(--accent);font-weight:900}.choice-card b{font-size:25px;line-height:1.25}.choice-card.selected{border-color:var(--accent);outline:4px solid rgba(25,117,107,.2)}.choice-card.correct{background:#e3f2e8}.choice-card.incorrect{background:#fbe7e0}.action-row{display:flex;gap:10px;align-items:center;justify-content:center}.btn{border:0;border-radius:10px;padding:10px 15px;background:var(--accent);color:white;font-weight:900;cursor:pointer}.btn.ghost{background:#fff;color:var(--dark);border:2px solid var(--line)}.feedback{font-weight:850;color:var(--dark)}.thinking-prompt{font-size:20px;text-align:center;color:var(--dark);font-weight:850;margin:2px}
.noun-build{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.token{padding:19px 22px;background:#fff;border:2px solid var(--line);font-size:23px;font-weight:800}.token.pre{border-radius:14px 4px 4px 14px}.token.head{background:var(--dark);color:#fff;border-color:var(--dark);font-family:Georgia,serif;font-size:31px}.token.post{border-radius:4px 14px 14px 4px}.job-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.reveal-card,.annot{cursor:pointer;border:2px solid var(--accent);background:#fff;border-radius:12px;padding:13px;font-weight:800}.reveal-card.revealed,.annot.revealed{background:var(--dark);color:#fff}.reveal-card.revealed::after,.annot.revealed::after{content:attr(data-reveal);display:block;margin-top:7px;font-size:13px;color:#fff5ca}
.before-after,.audience-split,.feedback-split{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.before-after article,.audience-split article,.feedback-split article{background:#fff;border-radius:16px;padding:20px;border-top:7px solid var(--accent);box-shadow:0 8px 20px rgba(17,50,46,.08)}.before-after small,.audience-split small,.feedback-split small,.plan-grid small{color:var(--accent);font-weight:900;letter-spacing:1px}.before-after p{font-size:22px;line-height:1.35}.before-after .reveal-card{width:100%}
.reason-flow{display:grid;grid-template-columns:1fr .16fr 1.08fr .16fr 1.45fr;gap:10px;align-items:center}.reason-flow>div{border-radius:14px;padding:20px}.vague,.exact,.questions{background:#fff;border:2px solid var(--line);font-size:20px;line-height:1.35}.vague{color:var(--muted)}.exact{border-color:var(--accent);font-weight:750}.questions{display:grid;gap:8px}.questions b{padding:7px;background:#eaf4f1;border-radius:7px}.arrow{text-align:center!important;padding:0!important;font-size:31px;color:var(--coral)}
.proposal-grid .reveal-card{min-height:150px;display:flex;flex-direction:column;justify-content:center;gap:10px}.proposal-grid b{font-size:23px;color:var(--dark)}.proposal-grid span{font-size:17px;font-weight:600}.claim-frame,.purpose-line,.exit-line,.overload-line{background:#fff;border-left:9px solid var(--accent);padding:20px;border-radius:13px;font-size:22px;line-height:1.35}.claim-frame span,.purpose-line span,.exit-line span{display:inline-block;min-width:180px;border-bottom:2px solid var(--ink)}.plan-grid article p{font-size:17px;margin-bottom:0}.plan-grid article b{font-size:19px;color:var(--dark)}.model-text{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.model-text .annot{text-align:left;font-size:16px;line-height:1.25;padding:11px 14px}.audience-split article{text-align:center}.audience-split b{font-size:24px;line-height:1.4}.overload-line{text-align:center;border-color:var(--amber);font-size:24px}.writing-brief{background:#fff;border:2px solid var(--accent);border-radius:18px;padding:20px 28px}.writing-brief h3{font-family:Georgia,serif;color:var(--dark);font-size:30px;margin:0 0 10px}.writing-brief ul{columns:2;margin:0;padding-left:24px;font-size:18px;line-height:1.55}.writing-brief p{font-size:17px;margin:8px 0 0}.timer-box{position:absolute;right:50px;bottom:105px;display:flex;align-items:center;gap:10px;background:var(--dark);color:#fff;padding:10px 14px;border-radius:13px}.timer-readout{font-size:27px;font-weight:900;min-width:84px}.feedback-split p{font-size:20px;line-height:1.35}.feedback-split span{display:inline-block;min-width:160px;border-bottom:2px solid var(--ink)}.check-strip{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}.check-strip b{background:var(--dark);color:#fff;border-radius:999px;padding:9px 13px}.exit-line{font-size:27px;text-align:center}.exit-line.second{border-color:var(--coral)}
.nav{position:absolute;inset:auto 0 0;height:var(--nav);background:#0d2837;color:#fff;display:flex;align-items:center;gap:12px;padding:0 18px;z-index:30}.nav button{border:0;background:transparent;color:white;font-weight:800;padding:10px 12px;border-radius:8px;cursor:pointer}.nav button:hover,.nav button:focus-visible{background:rgba(255,255,255,.14);outline:2px solid var(--amber)}.progress{height:7px;flex:1;background:rgba(255,255,255,.2);border-radius:999px;overflow:hidden}.progress i{display:block;height:100%;width:0;background:var(--amber)}.slide-no{font-weight:900;min-width:70px}.notes{display:none;position:absolute;right:18px;bottom:82px;width:min(520px,44vw);max-height:70vh;overflow:auto;background:#fff;color:var(--ink);border:3px solid var(--accent);border-radius:15px;padding:18px;z-index:40;box-shadow:0 20px 60px rgba(0,0,0,.35)}.notes.open{display:block}.notes h3{margin:0 0 8px;color:var(--dark)}
@media(max-width:1100px){.slide{padding:22px 30px 16px}.slide-head h2{font-size:34px}.task-panel b{font-size:11px}.task-panel{grid-template-columns:1.4fr .7fr 1fr 1fr}.hero-copy{padding-left:4vw}.reason-flow{grid-template-columns:1fr .12fr 1fr}.reason-flow .exact{grid-column:1/-1}.reason-flow .arrow:last-of-type{display:none}.model-text{gap:6px}.model-text .annot{font-size:14px}.timer-box{right:30px}.proposal-grid .reveal-card{min-height:125px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>
</head>
<body>
<main>${slides.map(renderSlide).join("\n")}</main>
<aside class="notes" id="notes"><h3>Teacher note</h3><p id="notesText"></p></aside>
<nav class="nav" aria-label="Presentation controls">
  <button id="prev" aria-label="Previous slide">← Previous</button>
  <div class="progress" aria-hidden="true"><i id="progress"></i></div>
  <span class="slide-no" id="slideNo"></span>
  <button id="notesBtn">Notes</button>
  <button id="resetBtn">Reset</button>
  <button id="fullBtn">Fullscreen</button>
  <button id="next">Next →</button>
</nav>
<script>
const slides=[...document.querySelectorAll('.slide')];let current=0;const notes=document.getElementById('notes'),notesText=document.getElementById('notesText');
function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.classList.toggle('active',i===current));document.getElementById('slideNo').textContent=(current+1)+' / '+slides.length;document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';notesText.textContent=slides[current].dataset.notes||'';notes.classList.remove('open')}
document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);document.getElementById('notesBtn').onclick=()=>notes.classList.toggle('open');document.getElementById('resetBtn').onclick=()=>location.reload();document.getElementById('fullBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{if(['BUTTON','INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1)});
document.querySelectorAll('.reveal-card,.annot').forEach(b=>b.onclick=()=>b.classList.toggle('revealed'));
document.querySelectorAll('.choice-card').forEach(b=>b.onclick=()=>{const root=b.closest('.choice-set');root.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected','correct','incorrect'));b.classList.add('selected')});
document.querySelectorAll('.check-choice').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide'),selected=slide.querySelector('.choice-card.selected'),feedback=slide.querySelector('.feedback');if(!selected){feedback.textContent='Choose one proposal first.';return}const ok=selected.dataset.correct==='true';selected.classList.add(ok?'correct':'incorrect');feedback.textContent=ok?'Yes—now name exactly what the detail contributes.':'Look for the proposal the audience can picture most clearly.'});
document.querySelectorAll('.reset-local').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide');slide.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected','correct','incorrect'));slide.querySelectorAll('.reveal-card,.annot').forEach(x=>x.classList.remove('revealed'));const feedback=slide.querySelector('.feedback');if(feedback)feedback.textContent=''});
document.querySelectorAll('.timer-start').forEach(btn=>btn.onclick=()=>{const box=btn.closest('.timer-box'),read=box.querySelector('.timer-readout');clearInterval(box._timer);let n=Number(read.dataset.start);const paint=()=>{read.textContent=String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};paint();box._timer=setInterval(()=>{n--;paint();if(n<=0){clearInterval(box._timer);read.textContent='TIME'}},1000)});
show(0);
</script>
</body>
</html>`;
}

function run(text, options = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: options.size || 18,
    color: options.color || palette.ink,
    bold: options.bold,
    italics: options.italics,
  });
}

function para(text = "", options = {}) {
  return new Paragraph({
    alignment: options.alignment,
    keepNext: options.keepNext,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 45,
      line: options.line ?? 220,
      lineRule: "auto",
    },
    children: options.children || [
      run(text, {
        size: options.size,
        color: options.color,
        bold: options.bold,
        italics: options.italics,
      }),
    ],
  });
}

function borders(color = palette.line, size = 5) {
  const edge = { style: BorderStyle.SINGLE, color, size };
  return { top: edge, bottom: edge, left: edge, right: edge };
}

function cell(content, width, options = {}) {
  const children = Array.isArray(content)
    ? content
    : [
        para(content, {
          size: options.size || 20,
          bold: options.bold,
          color: options.color,
          alignment: options.alignment,
          after: 15,
          line: options.line || 210,
        }),
      ];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: {
      top: options.marginY ?? 70,
      bottom: options.marginY ?? 70,
      left: options.marginX ?? 100,
      right: options.marginX ?? 100,
    },
    borders: borders(options.borderColor, options.borderSize),
    shading: options.fill
      ? { fill: options.fill, type: ShadingType.CLEAR }
      : undefined,
    children,
  });
}

function table(rows, widths, total = 10540) {
  return new Table({
    width: { size: total, type: WidthType.DXA },
    indent: { size: 100, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows,
  });
}

function tableRow(values, widths, options = {}) {
  return new TableRow({
    tableHeader: options.tableHeader,
    children: values.map((value, index) =>
      cell(value, widths[index], {
        ...options,
        fill: options.fills ? options.fills[index] : options.fill,
      })
    ),
  });
}

function sectionTitle(text, color = palette.teal) {
  return para(text, {
    size: 22,
    bold: true,
    color,
    before: 55,
    after: 30,
    keepNext: true,
  });
}

function standardOrganiser() {
  const children = [
    para("ENGLISH • LESSON 13 • PERSUASIVE ALTERNATIVE", {
      size: 15,
      bold: true,
      color: palette.coral,
      after: 15,
    }),
    para("Make the Detail Do the Persuading", {
      size: 29,
      bold: true,
      color: palette.navy,
      after: 15,
    }),
    para("Name: ______________________________  Class: __________  Date: __________", {
      size: 17,
      color: palette.muted,
      after: 50,
    }),
    table(
      [
        tableRow(
          [
            [
              para("THE LESSON TEST", { size: 15, bold: true, color: palette.teal, after: 10 }),
              para("Keep detail only when it helps the audience identify, understand or value the idea.", { size: 18, bold: true, after: 5 }),
            ],
          ],
          [10540],
          { fill: palette.mist, borderColor: palette.teal, marginY: 85 }
        ),
      ],
      [10540]
    ),
    sectionTitle("1  Opening audience test"),
    para("B is easier to support because the added detail tells us _____________________________________________.", {
      size: 20,
      after: 35,
    }),
    sectionTitle("2  Noun-group lab"),
    table(
      [
        tableRow(["Job", "Expanded noun group built around students", "Head noun"], [1850, 6790, 1900], {
          fill: palette.navy,
          color: palette.white,
          bold: true,
          size: 18,
          tableHeader: true,
        }),
        tableRow(["Identify", "________________________________________________", "____________"], [1850, 6790, 1900]),
        tableRow(["Explain need", "________________________________________________", "____________"], [1850, 6790, 1900]),
        tableRow(["Create value", "________________________________________________", "____________"], [1850, 6790, 1900]),
      ],
      [1850, 6790, 1900]
    ),
    sectionTitle("3  Precision test"),
    para("Cross out empty praise and replace it with useful detail.", { size: 16, color: palette.muted, after: 15 }),
    table(
      [
        tableRow(
          [
            [
              para("Before", { size: 15, bold: true, color: palette.coral, after: 8 }),
              para("an amazing, wonderful, fantastic, beautiful new space", { size: 20, after: 8 }),
              para("My revision: ____________________________________________________________", { size: 20, after: 5 }),
              para("I deleted __________________ because ______________________________________.", { size: 20, after: 5 }),
            ],
          ],
          [10540],
          { fill: palette.paleCoral, borderColor: palette.coral, marginY: 80 }
        ),
      ],
      [10540]
    ),
    sectionTitle("4  Choose the case"),
    table(
      [
        tableRow(["Audience", "My claim", "My first reason"], [1900, 4320, 4320], {
          fill: palette.navy,
          color: palette.white,
          bold: true,
          size: 18,
          tableHeader: true,
        }),
        tableRow(["________________", "Our school should __________________________", "because _________________________________"], [1900, 4320, 4320], {
          marginY: 95,
        }),
      ],
      [1900, 4320, 4320]
    ),
    sectionTitle("5  Plan the people, problem and proposal"),
    table(
      [
        tableRow(["Persuasive job", "Purposeful expanded noun group", "This helps my audience…"], [2300, 4670, 3570], {
          fill: palette.teal,
          color: palette.white,
          bold: true,
          size: 18,
          tableHeader: true,
        }),
        tableRow(["People affected", "____________________________________\n____________________________________", "________________________________\n________________________________"], [2300, 4670, 3570], { marginY: 80 }),
        tableRow(["Problem now", "____________________________________\n____________________________________", "________________________________\n________________________________"], [2300, 4670, 3570], { marginY: 80 }),
        tableRow(["Proposed change", "____________________________________\n____________________________________", "________________________________\n________________________________"], [2300, 4670, 3570], { marginY: 80 }),
      ],
      [2300, 4670, 3570]
    ),
    sectionTitle("6  Audience feedback → immediate revision"),
    table(
      [
        tableRow(
          [
            [
              para("Reviewer", { size: 15, bold: true, color: palette.teal, after: 5 }),
              para("This detail helps me understand ___________________________________________.", { size: 20, after: 15 }),
              para("I still need more precise detail about ____________________________________.", { size: 20, after: 5 }),
            ],
            [
              para("Writer", { size: 15, bold: true, color: palette.coral, after: 5 }),
              para("Before: ___________________________________________", { size: 20, after: 15 }),
              para("After: ____________________________________________", { size: 20, after: 5 }),
            ],
          ],
          [5270, 5270],
          { fills: [palette.mist, palette.paleCoral], marginY: 80 }
        ),
      ],
      [5270, 5270]
    ),
    sectionTitle("EXIT  Prove the detail has a job", palette.coral),
    para("My strongest noun group is _______________________________________________________________.", {
      size: 20,
      after: 15,
    }),
    para("It is persuasive because it helps the audience ______________________________________________.", {
      size: 20,
      after: 0,
    }),
  ];

  return organiserDoc(children, "Student organiser");
}

function lucasOrganiser() {
  const children = [
    para("LESSON 13 • PERSUASIVE ALTERNATIVE", {
      size: 18,
      bold: true,
      color: palette.coral,
      after: 15,
    }),
    para("Make the Detail Help", {
      size: 34,
      bold: true,
      color: palette.navy,
      after: 15,
    }),
    para("Name: ______________________________  Date: ______________", {
      size: 26,
      after: 65,
    }),
    table(
      [
        tableRow(
          [
            [
              para("OUR IDEA", { size: 20, bold: true, color: palette.teal, after: 12 }),
              para("Our school should make a quiet lunchtime zone.", { size: 26, bold: true, after: 8 }),
              para("You may point, speak, copy or ask someone to write.", { size: 24, color: palette.muted, after: 5 }),
            ],
          ],
          [10540],
          { fill: palette.mist, borderColor: palette.teal, marginY: 120 }
        ),
      ],
      [10540]
    ),
    sectionTitle("1  WHO needs it?", palette.teal),
    table(
      [
        tableRow(
          [
            "□ students who need a break",
            "□ students who want to read",
            "□ students who want to talk quietly",
          ],
          [3513, 3513, 3514],
          { fill: palette.paleBlue, size: 27, bold: true, marginY: 150 }
        ),
      ],
      [3513, 3513, 3514]
    ),
    para("My noun group: students who ______________________________________________________", {
      size: 28,
      before: 35,
      after: 35,
    }),
    sectionTitle("2  WHAT will it have?", palette.teal),
    table(
      [
        tableRow(
          ["□ two benches", "□ a shaded space", "□ a quiet reading box"],
          [3513, 3513, 3514],
          { fill: palette.paleBlue, size: 27, bold: true, marginY: 150 }
        ),
      ],
      [3513, 3513, 3514]
    ),
    para("My noun group: a ________________________________________________________________", {
      size: 28,
      before: 35,
      after: 35,
    }),
    sectionTitle("3  WHERE will it go?", palette.teal),
    table(
      [
        tableRow(
          ["□ beside the library", "□ near the playground", "□ in another safe place"],
          [3513, 3513, 3514],
          { fill: palette.paleBlue, size: 27, bold: true, marginY: 150 }
        ),
      ],
      [3513, 3513, 3514]
    ),
    para("Place: __________________________________________________________________________", {
      size: 28,
      before: 35,
      after: 45,
    }),
    sectionTitle("4  BUILD the proposal", palette.coral),
    table(
      [
        tableRow(
          [
            [
              para("Our school should make a quiet lunchtime zone.", { size: 28, bold: true, after: 90 }),
              para("Students who __________________________________________ could sit there.", { size: 28, after: 90 }),
              para("The ______________________________ space could have ________________________.", { size: 28, after: 90 }),
              para("It would give students a calm place to ____________________________________.", { size: 28, after: 90 }),
              para("Please try this helpful change.", { size: 28, bold: true, after: 5 }),
            ],
          ],
          [10540],
          { fill: palette.paleCoral, borderColor: palette.coral, marginY: 130 }
        ),
      ],
      [10540]
    ),
    sectionTitle("EXIT  My detail has a job", palette.coral),
    para("My detail helps the reader know _________________________________________________.", {
      size: 28,
      after: 0,
    }),
  ];

  return organiserDoc(children, "Lucas organiser");
}

function organiserDoc(children, label) {
  return new Document({
    creator: "English Unit 3 lesson generator",
    title: `Lesson 13 Persuasive Alternative - ${label}`,
    description: "Workbook organiser for expanded noun groups in persuasive writing.",
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 18, color: palette.ink },
          paragraph: { spacing: { after: 45, line: 220, lineRule: "auto" } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 680, right: 680, bottom: 680, left: 680, header: 300, footer: 300 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  run("Lesson 13 • Persuasive alternative  |  ", {
                    size: 14,
                    color: palette.muted,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Arial",
                    size: 14,
                    color: palette.muted,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "Lesson_13_Persuasive_Presentation.html"),
    presentationHtml(),
    "utf8"
  );
  fs.writeFileSync(
    path.join(outputDir, "Lesson_13_Persuasive_Organiser.docx"),
    await Packer.toBuffer(standardOrganiser())
  );
  fs.writeFileSync(
    path.join(outputDir, "Lesson_13_Persuasive_Lucas_Organiser.docx"),
    await Packer.toBuffer(lucasOrganiser())
  );
  console.log("Built persuasive Lesson 13 presentation and organisers.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

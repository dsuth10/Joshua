const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  PageBreak,
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
 * Authoritative generator for the Great Barrier Reef persuasive alternative
 * to English Unit 3, Lesson 14.
 *
 * The original novel-based lesson remains untouched.
 *
 * DOCX design basis: compact_reference_guide.
 * Named classroom override: A4 portrait, 12 mm margins for organisers,
 * 15 mm margins for the reading pack, Arial, ocean/reef palette, fixed-width
 * tables, no fixed row heights, workbook-ready response space.
 */

const outputDir = path.resolve(__dirname, "..");
const palette = {
  ink: "20303C",
  deep: "082F3D",
  navy: "123E58",
  ocean: "087E8B",
  lagoon: "46B8AD",
  coral: "E46F61",
  gold: "E9B949",
  sand: "F4E7C5",
  foam: "E8F5F3",
  paleBlue: "E7F2F7",
  paleCoral: "FCEBE7",
  paleGold: "FFF5D9",
  line: "A8C4C7",
  muted: "60747A",
  white: "FFFFFF",
};

const slides = [
  {
    hero: true,
    notes:
      "Ask students to hold two ideas at once: the Reef remains a living system, and it is under serious cumulative pressure. Do not ask for solutions yet.",
  },
  {
    kicker: "THE REEF IS NOT ONE STORY",
    title: "Can both statements be true?",
    time: 3,
    body: `
      <div class="truth-pair">
        <article><small>TRUE STATEMENT 1</small><p>The Reef still contains living coral across all three monitored regions.</p></article>
        <article><small>TRUE STATEMENT 2</small><p>Recent bleaching and other pressures caused substantial coral loss.</p></article>
      </div>
      <div class="thinking-prompt">Both can be true because…</div>`,
    task: {
      do: "Decide whether both statements can be true. Explain without weakening either one.",
      work: "Think, pair, justify",
      record: "No writing yet",
      finish: "One two-part explanation",
      check: "Avoid “fine” and “already gone”.",
    },
    notes:
      "This exposes binary thinking. The evidence later in the lesson supports both statements. Accept uncertainty now, but require students to explain the logical possibility.",
  },
  {
    kicker: "MISSION",
    title: "Advise—do not advertise",
    time: 2,
    body: `
      <div class="mission-grid">
        <article><b>READ</b><span>Build a common evidence base</span></article>
        <article><b>COMPARE</b><span>See through two protection lenses</span></article>
        <article><b>RECOMMEND</b><span>Name a defensible priority</span></article>
      </div>
      <div class="product-callout"><strong>Finished product:</strong> an 8–10 sentence Reef Protection Brief</div>`,
    task: {
      do: "Complete aloud: My audience needs to know ___ before it can support action.",
      work: "Partner rehearsal",
      record: "Organiser heading",
      finish: "One information need",
      check: "A slogan is not evidence.",
    },
    notes:
      "Name the audience as Australian environmental decision-makers. The reading must feel necessary for the final recommendation.",
  },
  {
    kicker: "READING PACK • 2 COLOURS",
    title: "Read for evidence and action",
    time: 8,
    body: `
      <div class="annotation-key">
        <article><b>E</b><span>Evidence about condition or threat</span></article>
        <article><b>A</b><span>An action that could protect or strengthen</span></article>
        <article><b>□</b><span>A sentence that prevents oversimplification</span></article>
      </div>
      <div class="reading-path"><span>1. Living system</span><i>→</i><span>2. What monitoring found</span><i>→</i><span>3. Why bleaching happens</span><i>→</i><span>4. Two scales of action</span></div>`,
    task: {
      do: "Mark at least four E ideas, three A ideas and one sentence that adds necessary nuance.",
      work: "Independent or paired reading",
      record: "Reading Pack",
      finish: "4 × E, 3 × A and one boxed line",
      check: "Do not highlight whole paragraphs.",
    },
    notes:
      "Preteach coral cover, bleaching, marine heatwave, resilience, catchment, runoff and emissions as required. Paired reading is a support, not a lower destination.",
  },
  {
    kicker: "EVIDENCE LEDGER • ORGANISER",
    title: "A number is useful only when you explain it",
    time: 4,
    body: `
      <div class="evidence-pulse">
        <button class="reveal-card" data-reveal="MEANING • large-scale losses followed severe heat stress">14–30% regional coral-cover declines</button>
        <button class="reveal-card" data-reveal="MEANING • condition varied; the whole Reef did not respond identically">48% declined • 42% stable • 10% increased</button>
        <button class="reveal-card" data-reveal="MEANING • the Reef remains living, but recovery time is under pressure">living coral remained in all three regions</button>
      </div>
      <div class="meaning-frame">This matters because <span>________________________________________</span>.</div>`,
    task: {
      do: "Record one condition fact, one threat fact and one response fact. Explain what each means.",
      work: "Independent",
      record: "Organiser: Evidence Ledger",
      finish: "Three facts and three meaning notes",
      check: "Keep timeframe and comparison attached.",
    },
    notes:
      "The figures summarise the AIMS 2024/25 report. Students must not generalise the 124-reef sample into a claim that every reef changed identically.",
  },
  {
    kicker: "CAUSE CHAIN • ORGANISER",
    title: "Bleached does not automatically mean dead",
    time: 4,
    body: `
      <div class="cause-chain">
        <button class="reveal-card" data-reveal="START • climate change raises ocean temperatures">warming ocean</button><i>→</i>
        <button class="reveal-card" data-reveal="PRESSURE • unusually warm water lasts long enough to create stress">marine heatwave</button><i>→</i>
        <button class="reveal-card" data-reveal="RESPONSE • coral expels tiny algae and loses colour">bleaching</button><i>→</i>
        <button class="reveal-card" data-reveal="OUTCOME • recovery or death depends on severity, duration and recovery time">recover or die</button>
      </div>
      <div class="warning-line">Repeated disturbances → less time to recover</div>`,
    task: {
      do: "Complete the chain, then write one because/therefore explanation.",
      work: "Pairs",
      record: "Organiser: Cause Chain",
      finish: "Complete chain and explanation",
      check: "Bleaching is stress—not automatic death.",
    },
    notes:
      "AIMS explains that bleached coral can recover if conditions improve, but severe or prolonged stress can cause death. Repeated events shorten recovery opportunities.",
  },
  {
    kicker: "TWO PROTECTION LENSES",
    title: "Different scale. Shared purpose.",
    time: 5,
    body: `
      <div class="lens-stage">
        <article class="local"><small>LENS A • LOCAL RESILIENCE</small><h3>Reduce pressures now</h3><p>water quality • starfish control • sustainable fishing • marine debris • Sea Country management • restoration</p></article>
        <div class="overlap"><b>SHARED PURPOSE</b><span>A living Reef with more opportunity to survive and recover</span></div>
        <article class="climate"><small>LENS B • CLIMATE ACTION</small><h3>Address the primary threat</h3><p>reduce greenhouse gas emissions • limit future warming • reduce marine heatwave pressure</p></article>
      </div>`,
    task: {
      do: "Place at least two responses in each lens and one idea in the overlap.",
      work: "Pairs",
      record: "Organiser: Two-Lens Board",
      finish: "Five placed ideas with reasons",
      check: "Sort by the action’s main job.",
    },
    notes:
      "Some ideas connect both lenses. Accept defensible placements when students name the relationship. Do not teach the lenses as opposing teams.",
  },
  {
    kicker: "OVERLAP + DIFFERENCE",
    title: "What does each lens make us notice?",
    time: 4,
    body: `
      <div class="three-lines">
        <p><b>BOTH</b> agree that <span>________________________________________</span>.</p>
        <p><b>LOCAL</b> prioritises <span>________________</span> because <span>________________</span>.</p>
        <p><b>CLIMATE</b> prioritises <span>________________</span> because <span>________________</span>.</p>
      </div>`,
    task: {
      do: "Write one overlap and two accurate priority statements.",
      work: "Independent, then compare",
      record: "Organiser: Lens Comparison",
      finish: "Three complete statements",
      check: "Difference does not require dismissal.",
    },
    notes:
      "This is the direct transfer from the original Lesson 14: preserve a meaningful overlap while representing a contrast.",
  },
  {
    kicker: "EVIDENCE BOUNDARY • ORGANISER",
    title: "Supported, inferred—or overclaimed?",
    time: 4,
    body: `
      <div class="boundary-grid">
        <div class="choice-question"><small>1</small><p>The whole Great Barrier Reef is dead.</p><div><button class="choice-card" data-correct="false">Supported</button><button class="choice-card" data-correct="false">Inference</button><button class="choice-card" data-correct="true">Overclaim</button></div></div>
        <div class="choice-question"><small>2</small><p>Improving water quality can help Reef resilience.</p><div><button class="choice-card" data-correct="true">Supported</button><button class="choice-card" data-correct="false">Inference</button><button class="choice-card" data-correct="false">Overclaim</button></div></div>
        <div class="choice-question"><small>3</small><p>Local protection work is pointless without climate action.</p><div><button class="choice-card" data-correct="false">Supported</button><button class="choice-card" data-correct="false">Inference</button><button class="choice-card" data-correct="true">Overclaim</button></div></div>
        <div class="choice-question"><small>4</small><p>A complete plan needs work at more than one scale.</p><div><button class="choice-card" data-correct="false">Supported</button><button class="choice-card" data-correct="true">Inference</button><button class="choice-card" data-correct="false">Overclaim</button></div></div>
      </div>
      <div class="action-row"><button class="btn check-choice">Check the boundary</button><button class="btn ghost reset-local">Reset</button><span class="feedback" aria-live="polite"></span></div>`,
    task: {
      do: "Classify all four claims and justify the most difficult boundary.",
      work: "Independent first; class comparison",
      record: "Organiser: Evidence Boundary",
      finish: "Four labels and one justification",
      check: "A synthesis can be defensible without being copied.",
    },
    notes:
      "Claim 4 is the difficult boundary: a reasonable synthesis across sources. Feedback should send students back to the distinction between source fact, defensible reasoning and unsupported certainty.",
  },
  {
    kicker: "LANGUAGE LAB",
    title: "Make each perspective precise",
    time: 4,
    body: `
      <div class="before-after">
        <article><small>VAGUE</small><p>We should fix local problems.</p><button class="reveal-card" data-reveal="Missing: actor, exact pressure, place and action">What is missing?</button></article>
        <article><small>PRECISE</small><p>Governments should urgently reduce polluted runoff entering vulnerable inshore reefs.</p><button class="reveal-card" data-reveal="NOUN GROUP + VERB + ADVERBIAL • who, what, where, how urgently">What does the language add?</button></article>
      </div>
      <div class="precision-example">Australia should rapidly reduce <u>the greenhouse gas emissions that intensify marine heatwaves</u>.</div>`,
    task: {
      do: "Improve one vague action sentence and annotate the language choice that makes it exact.",
      work: "Whole class model, then independent",
      record: "Organiser: Language Lab",
      finish: "One revision and annotation",
      check: "Precision must remain evidence-based.",
    },
    notes:
      "Year 5 students can foreground expanded noun groups. Year 6 students can foreground precise verbs and purposeful adverbials. Everyone may use both.",
  },
  {
    kicker: "ANNOTATED MODEL",
    title: "Read the model like an adviser",
    time: 5,
    body: `
      <div class="model-text">
        <button class="annot" data-reveal="CLAIM + SCOPE">Decision-makers should protect the Reef through strong climate action and immediate local resilience work.</button>
        <button class="annot" data-reveal="QUALIFIED EVIDENCE">Monitoring found substantial coral-cover declines, while living coral remained across all three regions.</button>
        <button class="annot" data-reveal="LOCAL LENS">Water quality, starfish management and Sea Country management can reduce pressures now.</button>
        <button class="annot" data-reveal="LIMITATION + CLIMATE LENS">However, local programs cannot stop marine heatwaves driven by a warming climate.</button>
        <button class="annot" data-reveal="HONEST OVERLAP">Although the approaches work at different scales, both can give coral more opportunity to survive and recover.</button>
        <button class="annot" data-reveal="PRIORITISED CALL TO ACTION">Fund both, while treating climate action as the essential long-term priority.</button>
      </div>`,
    task: {
      do: "Find the claim, evidence, both lenses, qualification and call to action. Star one move to imitate.",
      work: "Whole class",
      record: "Organiser: Model Notes",
      finish: "Six moves found and one starred",
      check: "Priority does not erase the other lens.",
    },
    notes:
      "Read the whole model first. The model prioritises climate action while preserving the value of local work. Students may defend another emphasis with accurate evidence.",
  },
  {
    depth: true,
    kicker: "DEPTH A • OPTIONAL",
    title: "Change the decision-maker",
    time: 8,
    body: `
      <div class="audience-split">
        <article><small>COASTAL COUNCIL</small><b>runoff • litter • local habitats • community action</b></article>
        <article><small>AUSTRALIAN GOVERNMENT</small><b>national emissions • Reef policy • long-term funding</b></article>
      </div>
      <div class="thinking-prompt">Which evidence and language must change?</div>`,
    task: {
      do: "Adapt one paragraph for each audience, then explain one change.",
      work: "Independent, then compare",
      record: "Workbook margin",
      finish: "Two versions and one explanation",
      check: "Change the decision—not just the greeting.",
    },
    notes:
      "Optional depth. Students should select feasible actions for each decision-maker rather than making the same request twice.",
  },
  {
    depth: true,
    kicker: "DEPTH B • OPTIONAL",
    title: "Challenge the false choice",
    time: 7,
    body: `
      <div class="false-choice">“We must choose between local Reef projects and climate action.”</div>
      <div class="rebuttal-frame"><b>ACKNOWLEDGE</b><span>Budgets and priorities matter…</span><b>CHALLENGE</b><span>but the two scales do different jobs…</span><b>PROVE</b><span>the evidence shows…</span></div>`,
    task: {
      do: "Write a three-sentence rebuttal with a qualification and evidence.",
      work: "Pairs",
      record: "Workbook margin",
      finish: "Claim, qualification and rebuttal",
      check: "Nuance is stronger than a louder slogan.",
    },
    notes:
      "Optional depth. Do not pretend all programs receive equal priority or resources. Students should reject the false binary while acknowledging real decisions.",
  },
  {
    kicker: "WORKBOOK • INDEPENDENT",
    title: "Write the Reef Protection Brief",
    time: 10,
    timer: 10,
    body: `
      <div class="writing-brief">
        <h3>8–10 persuasive sentences</h3>
        <ul><li>Clear claim and priority</li><li>Three accurate evidence points</li><li>Fair local-resilience lens</li><li>Fair climate-action lens</li><li>One concession or qualification</li><li>Concrete call to action</li></ul>
        <p><b>Year 5:</b> three purposeful expanded noun groups. <b>Year 6:</b> three precise verbs + two purposeful adverbials.</p>
      </div>`,
    task: {
      do: "Write the complete evidence-based briefing for environmental decision-makers.",
      work: "Independent and silent",
      record: "English workbook",
      finish: "One complete 8–10 sentence brief",
      check: "Represent both lenses before prioritising.",
    },
    notes:
      "Students may imitate the model architecture, but must choose and explain their own evidence. Confer from the evidence ledger and two-lens plan.",
  },
  {
    kicker: "EVIDENCE + FAIRNESS TEST",
    title: "Can the other lens recognise itself?",
    time: 4,
    body: `
      <div class="feedback-split">
        <article><small>REVIEWER</small><p>Your strongest evidence is <span>________________</span> because <span>________________</span>.</p></article>
        <article><small>REVIEWER</small><p>The other perspective is fair / unfair because <span>____________________________</span>.</p></article>
      </div>
      <div class="revision-strip"><b>REVISE NOW</b><span>unsupported • vague • unfair • overcertain</span></div>`,
    task: {
      do: "Give both feedback statements, then revise one sentence immediately.",
      work: "Partner feedback, then independent",
      record: "Workbook briefing",
      finish: "Feedback plus one visible revision",
      check: "The writer keeps the final decision.",
    },
    notes:
      "The reviewer diagnoses evidence strength and fairness. The writer may revise by adding, qualifying, replacing or deleting.",
  },
  {
    kicker: "EXIT EVIDENCE",
    title: "State the priority without erasing the other lens",
    time: 2,
    body: `
      <div class="exit-line">Although <span>____________</span> matters because <span>____________</span>,</div>
      <div class="exit-line second">decision-makers should prioritise <span>____________</span> because the evidence shows <span>____________</span>.</div>`,
    task: {
      do: "Complete the qualification sentence with accurate evidence.",
      work: "Independent",
      record: "Organiser or workbook",
      finish: "One complete four-part sentence",
      check: "Contrast + overlap + priority + evidence.",
    },
    notes:
      "Safe stopping point. This sentence directly samples the transferred Lesson 14 concept.",
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
        <div class="kicker">GREAT BARRIER REEF • SUPPLEMENTAL LESSON 14</div>
        <h1>One Reef.<br>Two Protection Lenses.</h1>
        <p>Research the pressure. Compare the priorities. Persuade with evidence.</p>
        <div class="hero-tags"><span>READ</span><span>COMPARE</span><span>RECOMMEND</span></div>
      </div>
      <div class="reef-window" role="img" aria-label="Stylised coral reef showing living colour beside heat-stressed coral">
        <div class="sun"></div><div class="surface"></div>
        <div class="fish f1"></div><div class="fish f2"></div><div class="fish f3"></div>
        <div class="coral c1"></div><div class="coral c2"></div><div class="coral c3"></div><div class="coral c4"></div>
        <div class="reef-label living">LIVING SYSTEM</div><div class="reef-label pressure">UNDER PRESSURE</div>
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
<title>Supplemental Lesson 14 — One Reef, Two Protection Lenses</title>
<style>
:root{--ocean:#087e8b;--lagoon:#46b8ad;--deep:#082f3d;--navy:#123e58;--coral:#e46f61;--gold:#e9b949;--foam:#e8f5f3;--paper:#fffdf7;--ink:#20303c;--muted:#60747a;--line:#a8c4c7;--nav:68px}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--deep);font-family:Arial,sans-serif;color:var(--ink)}button{font:inherit}.slide{display:none;position:absolute;inset:0 0 var(--nav);padding:28px 48px 17px;background:linear-gradient(135deg,#fffef9,#e8f5f3);overflow:hidden}.slide.active{display:flex;flex-direction:column}.depth-slide{background:linear-gradient(135deg,#fff9e7,#f3ead1)}
.hero{background:linear-gradient(110deg,#062b3a 0%,#0a5367 53%,#0b8b92 100%);color:#fff;padding:0}.hero.active{display:grid;grid-template-columns:1.05fr .95fr}.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:7vh 2vw 7vh 6vw}.hero h1{font-family:Georgia,serif;font-size:clamp(48px,5vw,82px);line-height:.98;margin:12px 0 20px;letter-spacing:-2px}.hero p{font-size:clamp(21px,2vw,31px);line-height:1.3;max-width:760px;margin:0 0 28px}.hero-tags{display:flex;gap:10px}.hero-tags span{border:1px solid rgba(255,255,255,.5);border-radius:999px;padding:9px 15px;font-weight:900;font-size:13px;background:rgba(0,0,0,.14)}.hero .kicker{color:#ffd76d}
.reef-window{position:relative;overflow:hidden;margin:6vh 5vw 6vh 0;border-radius:34px;background:linear-gradient(#83d8e0 0 10%,#138ca0 11% 50%,#07516b 100%);box-shadow:0 28px 70px rgba(0,0,0,.28);min-height:420px}.surface{position:absolute;top:10%;left:0;right:0;height:5px;background:rgba(255,255,255,.75)}.sun{position:absolute;width:95px;height:95px;border-radius:50%;background:#ffe080;top:-28px;right:48px;box-shadow:0 0 60px #ffe080}.coral{position:absolute;bottom:0;width:18%;height:39%;background:var(--coral);border-radius:60% 35% 0 0;filter:drop-shadow(0 8px 5px rgba(0,0,0,.18))}.coral::before,.coral::after{content:"";position:absolute;background:inherit;border-radius:999px}.coral::before{width:38%;height:68%;left:22%;top:-32%}.coral::after{width:29%;height:52%;right:11%;top:-18%}.c1{left:5%;background:#f1826f}.c2{left:27%;height:29%;background:#e9b949}.c3{right:26%;height:34%;background:#dce8df}.c4{right:5%;height:26%;background:#c7d8d8}.fish{position:absolute;width:54px;height:25px;background:#ffd76d;border-radius:55% 45% 45% 55%}.fish::after{content:"";position:absolute;right:-15px;top:4px;border-left:17px solid #ffd76d;border-top:9px solid transparent;border-bottom:9px solid transparent}.f1{top:33%;left:14%}.f2{top:48%;left:52%;transform:scale(.75)}.f3{top:24%;left:68%;transform:scale(.55)}.reef-label{position:absolute;bottom:20px;padding:8px 12px;background:rgba(5,38,51,.78);border-radius:999px;font-size:12px;font-weight:900;letter-spacing:1px}.living{left:7%}.pressure{right:7%}
.kicker{font-size:14px;font-weight:900;letter-spacing:2px;color:var(--ocean);text-transform:uppercase}.slide-head{display:flex;justify-content:space-between;gap:22px;align-items:flex-start;margin-bottom:11px}.slide-head h2{font-family:Georgia,serif;font-size:clamp(30px,3vw,49px);line-height:1.03;margin:5px 0 0;color:var(--navy);letter-spacing:-1px}.slide-meta{display:flex;gap:8px;white-space:nowrap}.slide-meta span{padding:8px 11px;border-radius:999px;background:#fff;border:1px solid var(--line);font-weight:900;font-size:12px}.core-badge{background:#e5f3ef!important;color:#225b55;border-color:#9dc9c1!important}.depth-badge{background:#fff0c8!important;color:#6b4e00;border-color:#ddb85d!important}.slide-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:12px}
.task-panel{display:grid;grid-template-columns:1.55fr .78fr 1.05fr 1.15fr;gap:7px;margin-top:9px}.task-panel>div{background:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 10px;min-height:47px;display:flex;flex-direction:column;gap:3px}.task-panel .wide{grid-column:1/-1;min-height:35px;display:grid;grid-template-columns:70px 1fr;align-items:center}.task-panel small{font-size:10px;font-weight:900;letter-spacing:1.2px;color:var(--ocean)}.task-panel b{font-size:13px;line-height:1.15}
.truth-pair,.before-after,.audience-split,.feedback-split{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.truth-pair article,.before-after article,.audience-split article,.feedback-split article{background:#fff;border-radius:18px;padding:22px;border-top:8px solid var(--ocean);box-shadow:0 9px 23px rgba(8,47,61,.09)}.truth-pair article:last-child{border-top-color:var(--coral)}.truth-pair small,.before-after small,.audience-split small,.feedback-split small{color:var(--ocean);font-weight:900;letter-spacing:1px}.truth-pair p{font-size:25px;line-height:1.3;font-weight:800}.thinking-prompt{font-size:20px;text-align:center;color:var(--navy);font-weight:850}.mission-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.mission-grid article{background:#fff;border-top:8px solid var(--ocean);border-radius:16px;padding:25px;text-align:center}.mission-grid b{font-size:25px;color:var(--navy);display:block}.mission-grid span{font-size:18px;display:block;margin-top:8px}.product-callout{background:var(--navy);color:white;border-radius:14px;padding:16px 22px;font-size:21px;text-align:center}
.annotation-key{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.annotation-key article{background:#fff;border:2px solid var(--line);border-radius:16px;padding:21px;display:flex;align-items:center;gap:14px}.annotation-key b{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:var(--navy);color:#fff;font-size:25px}.annotation-key span{font-size:19px;font-weight:750}.reading-path{display:flex;gap:9px;align-items:center;justify-content:center;flex-wrap:wrap}.reading-path span{background:#fff;border:2px solid var(--ocean);padding:11px 14px;border-radius:999px;font-weight:800}.reading-path i{color:var(--coral);font-size:24px}
.evidence-pulse{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.reveal-card,.annot{cursor:pointer;border:2px solid var(--ocean);background:#fff;border-radius:13px;padding:14px;font-weight:850}.evidence-pulse .reveal-card{font-size:21px;min-height:118px}.reveal-card.revealed,.annot.revealed{background:var(--navy);color:#fff}.reveal-card.revealed::after,.annot.revealed::after{content:attr(data-reveal);display:block;margin-top:8px;font-size:13px;line-height:1.25;color:#fff3c4}.meaning-frame,.warning-line,.precision-example,.false-choice,.exit-line{background:#fff;border-left:9px solid var(--ocean);padding:20px;border-radius:13px;font-size:22px;line-height:1.35}.meaning-frame span,.exit-line span{display:inline-block;min-width:210px;border-bottom:2px solid var(--ink)}
.cause-chain{display:grid;grid-template-columns:1fr .15fr 1fr .15fr 1fr .15fr 1fr;gap:8px;align-items:center}.cause-chain i{font-size:28px;color:var(--coral);text-align:center}.cause-chain .reveal-card{min-height:110px;font-size:19px}.warning-line{text-align:center;border-color:var(--coral);font-weight:900;color:var(--navy)}
.lens-stage{display:grid;grid-template-columns:1fr .45fr 1fr;gap:15px;align-items:stretch}.lens-stage article{background:#fff;border-radius:18px;padding:22px;border-top:8px solid var(--ocean)}.lens-stage .climate{border-top-color:var(--coral)}.lens-stage small{font-weight:900;color:var(--ocean);letter-spacing:1px}.lens-stage h3{font-family:Georgia,serif;font-size:28px;margin:9px 0;color:var(--navy)}.lens-stage p{font-size:18px;line-height:1.45}.overlap{background:var(--navy);color:#fff;border-radius:18px;padding:17px;display:flex;flex-direction:column;justify-content:center;text-align:center;gap:10px}.overlap span{font-size:17px;line-height:1.35}.three-lines{display:grid;gap:13px}.three-lines p{margin:0;background:#fff;border-left:8px solid var(--ocean);border-radius:12px;padding:18px;font-size:22px}.three-lines p:nth-child(3){border-color:var(--coral)}.three-lines span{display:inline-block;min-width:190px;border-bottom:2px solid var(--ink)}
.boundary-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.choice-question{background:#fff;border:2px solid var(--line);border-radius:14px;padding:12px}.choice-question small{font-weight:900;color:var(--ocean)}.choice-question p{font-size:16px;margin:5px 0 10px;font-weight:750}.choice-question>div{display:flex;gap:6px}.choice-card{flex:1;border:2px solid var(--line);background:#fff;border-radius:9px;padding:8px;cursor:pointer;font-weight:800}.choice-card.selected{border-color:var(--ocean);outline:3px solid rgba(8,126,139,.18)}.choice-card.correct{background:#def1e5}.choice-card.incorrect{background:#fae1da}.action-row{display:flex;gap:10px;align-items:center;justify-content:center}.btn{border:0;border-radius:10px;padding:10px 15px;background:var(--ocean);color:white;font-weight:900;cursor:pointer}.btn.ghost{background:#fff;color:var(--navy);border:2px solid var(--line)}.feedback{font-weight:850;color:var(--navy)}
.before-after p{font-size:22px;line-height:1.35}.before-after .reveal-card{width:100%}.precision-example{text-align:center;border-color:var(--coral);font-weight:800}.model-text{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.model-text .annot{text-align:left;font-size:16px;line-height:1.25;padding:11px 14px}.audience-split{text-align:center}.audience-split b{font-size:23px;line-height:1.45}.false-choice{text-align:center;border-color:var(--coral);font-family:Georgia,serif;font-size:28px}.rebuttal-frame{display:grid;grid-template-columns:.5fr 1fr .5fr 1fr .5fr 1fr;gap:7px;align-items:center}.rebuttal-frame b{background:var(--navy);color:#fff;padding:12px;border-radius:9px;text-align:center}.rebuttal-frame span{background:#fff;border:1px solid var(--line);padding:12px;border-radius:9px}
.writing-brief{background:#fff;border:2px solid var(--ocean);border-radius:18px;padding:20px 28px}.writing-brief h3{font-family:Georgia,serif;color:var(--navy);font-size:30px;margin:0 0 10px}.writing-brief ul{columns:2;margin:0;padding-left:24px;font-size:18px;line-height:1.55}.writing-brief p{font-size:17px;margin:8px 0 0}.timer-box{position:absolute;right:48px;bottom:103px;display:flex;align-items:center;gap:10px;background:var(--navy);color:#fff;padding:10px 14px;border-radius:13px}.timer-readout{font-size:27px;font-weight:900;min-width:84px}.feedback-split p{font-size:20px;line-height:1.4}.feedback-split span{display:inline-block;min-width:135px;border-bottom:2px solid var(--ink)}.revision-strip{display:flex;gap:16px;align-items:center;justify-content:center;background:var(--navy);color:#fff;border-radius:12px;padding:12px}.revision-strip span{word-spacing:13px}.exit-line{text-align:center;font-size:24px}.exit-line.second{border-color:var(--coral)}
.nav{position:absolute;inset:auto 0 0;height:var(--nav);background:#062733;color:#fff;display:flex;align-items:center;gap:12px;padding:0 18px;z-index:30}.nav button{border:0;background:transparent;color:white;font-weight:800;padding:10px 12px;border-radius:8px;cursor:pointer}.nav button:hover,.nav button:focus-visible{background:rgba(255,255,255,.14);outline:2px solid var(--gold)}.progress{height:7px;flex:1;background:rgba(255,255,255,.2);border-radius:999px;overflow:hidden}.progress i{display:block;height:100%;width:0;background:var(--gold)}.slide-no{font-weight:900;min-width:70px}.notes{display:none;position:absolute;right:18px;bottom:82px;width:min(520px,44vw);max-height:70vh;overflow:auto;background:#fff;color:var(--ink);border:3px solid var(--ocean);border-radius:15px;padding:18px;z-index:40;box-shadow:0 20px 60px rgba(0,0,0,.35)}.notes.open{display:block}.notes h3{margin:0 0 8px;color:var(--navy)}
@media(max-width:1100px){.slide{padding:21px 29px 15px}.slide-head h2{font-size:33px}.task-panel b{font-size:11px}.task-panel{grid-template-columns:1.4fr .72fr 1fr 1fr}.hero-copy{padding-left:4vw}.truth-pair p{font-size:21px}.lens-stage p{font-size:15px}.boundary-grid{gap:7px}.choice-question p{font-size:14px}.model-text .annot{font-size:14px}.timer-box{right:29px}.cause-chain .reveal-card{font-size:16px}.rebuttal-frame{grid-template-columns:1fr 1fr 1fr}.rebuttal-frame span{font-size:13px}}
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
document.querySelectorAll('.choice-card').forEach(b=>b.onclick=()=>{const root=b.closest('.choice-question');root.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected','correct','incorrect'));b.classList.add('selected')});
document.querySelectorAll('.check-choice').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide'),groups=[...slide.querySelectorAll('.choice-question')];let complete=true,all=true;groups.forEach(group=>{const selected=group.querySelector('.choice-card.selected');if(!selected){complete=false;return}const ok=selected.dataset.correct==='true';selected.classList.add(ok?'correct':'incorrect');all=all&&ok});const f=slide.querySelector('.feedback');f.textContent=!complete?'Choose one label for every claim.':all?'Boundary secure. Now justify why claim 4 is an inference.':'Recheck the difference between source fact, synthesis and unsupported certainty.'});
document.querySelectorAll('.reset-local').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide');slide.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected','correct','incorrect'));slide.querySelectorAll('.reveal-card,.annot').forEach(x=>x.classList.remove('revealed'));const f=slide.querySelector('.feedback');if(f)f.textContent=''});
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
    size: options.size || 20,
    color: options.color || palette.ink,
    bold: options.bold,
    italics: options.italics,
    break: options.break,
  });
}

function para(text = "", options = {}) {
  return new Paragraph({
    alignment: options.alignment,
    keepNext: options.keepNext,
    pageBreakBefore: options.pageBreakBefore,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 70,
      line: options.line ?? 240,
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
          size: options.size || 19,
          bold: options.bold,
          color: options.color,
          alignment: options.alignment,
          after: 20,
          line: options.line || 220,
        }),
      ];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: {
      top: options.marginY ?? 80,
      bottom: options.marginY ?? 80,
      left: options.marginX ?? 110,
      right: options.marginX ?? 110,
    },
    borders: borders(options.borderColor, options.borderSize),
    shading: options.fill
      ? { fill: options.fill, type: ShadingType.CLEAR }
      : undefined,
    children,
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

function table(rows, widths, total = 10540) {
  return new Table({
    width: { size: total, type: WidthType.DXA },
    indent: { size: 120, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows,
  });
}

function sectionTitle(text, color = palette.ocean, options = {}) {
  return para(text, {
    size: options.size || 23,
    bold: true,
    color,
    before: options.before ?? 80,
    after: options.after ?? 45,
    keepNext: true,
  });
}

function titleBlock(kicker, title, subtitle, options = {}) {
  return [
    para(kicker, {
      size: options.kickerSize || 15,
      bold: true,
      color: options.kickerColor || palette.coral,
      after: 16,
    }),
    para(title, {
      size: options.titleSize || 31,
      bold: true,
      color: palette.navy,
      after: 15,
    }),
    para(subtitle, {
      size: options.subtitleSize || 18,
      color: palette.muted,
      after: 55,
    }),
  ];
}

function footer(label) {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          run(`${label}  |  `, { size: 14, color: palette.muted }),
          new TextRun({
            children: [PageNumber.CURRENT],
            font: "Arial",
            size: 14,
            color: palette.muted,
          }),
        ],
      }),
    ],
  });
}

function docBase(children, title, label, margins = 680) {
  return new Document({
    creator: "English Unit 3 lesson generator",
    title,
    description:
      "Supplemental Lesson 14 resource for Great Barrier Reef research and persuasive writing.",
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 20, color: palette.ink },
          paragraph: { spacing: { after: 70, line: 240, lineRule: "auto" } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: {
              top: margins,
              right: margins,
              bottom: margins,
              left: margins,
              header: 300,
              footer: 300,
            },
          },
        },
        footers: { default: footer(label) },
        children,
      },
    ],
  });
}

function readingPack() {
  const children = [
    ...titleBlock(
      "SUPPLEMENTAL LESSON 14 • STUDENT READING",
      "The Great Barrier Reef: Living, Changing, Worth Protecting",
      "Read for evidence (E), action (A) and the details that prevent an oversimplified argument."
    ),
    table(
      [
        tableRow(
          [
            [
              para("READING MISSION", {
                size: 16,
                bold: true,
                color: palette.ocean,
                after: 10,
              }),
              para(
                "Mark at least four pieces of evidence with E, three possible responses with A, and box one sentence that adds necessary nuance.",
                { size: 20, bold: true, after: 5 }
              ),
            ],
          ],
          [10540],
          { fill: palette.foam, borderColor: palette.ocean, marginY: 95 }
        ),
      ],
      [10540]
    ),
    sectionTitle("1  A vast living system"),
    para(
      "The Great Barrier Reef stretches about 2,300 kilometres along the Queensland coast and covers approximately 344,400 square kilometres. It is not one continuous wall of coral. It is a connected system of roughly 3,000 coral reefs, islands, seagrass meadows, mangroves, deep water and coastal habitats. These places support extraordinary life and are important to communities, industries and visitors.",
      { size: 21, line: 260 }
    ),
    para(
      "The Reef is also Sea Country. About 70 Aboriginal and Torres Strait Islander Traditional Owner groups maintain continuing cultural, spiritual and practical connections with the region. Traditional Owners protect Sea Country through cultural knowledge, monitoring, planning and partnerships that also use contemporary science. Their custodianship is continuing—not simply part of the past.",
      { size: 21, line: 260 }
    ),
    sectionTitle("2  What recent monitoring found"),
    para(
      "The condition of the Reef varies from place to place and year to year. During the severe 2024 mass bleaching event, heat stress affected the largest area recorded in a Great Barrier Reef bleaching event. Cyclones, floodwater and some crown-of-thorns starfish activity added further pressure. Scientists from the Australian Institute of Marine Science then surveyed 124 reefs between August 2024 and May 2025.",
      { size: 21, line: 260 }
    ),
    para(
      "Their 2024/25 report found that average hard coral cover fell in the Northern, Central and Southern regions. The regional declines were about 14% to 30% compared with 2024. Across the 124 surveyed reefs, 48% declined, 42% showed no net change and 10% increased. Living coral remained in all three regions, but recent gains had been sharply reduced. This is serious evidence of pressure, not evidence that every reef is already dead.",
      { size: 21, line: 260 }
    ),
    para(
      "During summer 2024-25, the Reef experienced another widespread bleaching event—the sixth since 2016 and the second in consecutive summers. It was less extensive than the 2023-24 event, but it again showed how little recovery time some reefs are receiving.",
      { size: 21, line: 260 }
    ),
    sectionTitle("3  What bleaching means"),
    para(
      "Coral animals live with tiny algae that provide much of their energy and colour. When conditions become stressful, coral can expel these algae and turn pale or white. Water only 1-2°C above the usual summer maximum for several weeks can create enough heat stress to cause bleaching.",
      { size: 21, line: 260 }
    ),
    para(
      "Bleached coral is not automatically dead. Some coral recovers if the heat passes; other coral dies when stress is too severe or lasts too long. Even surviving coral may grow or reproduce more slowly. A diverse reef can recover after disturbance, but recovery takes time. More frequent marine heatwaves leave less time before the next major pressure arrives.",
      { size: 21, line: 260 }
    ),
    para("", { pageBreakBefore: true, after: 0 }),
    ...titleBlock(
      "SUPPLEMENTAL LESSON 14 • STUDENT READING",
      "Protection at Two Scales",
      "The strongest argument recognises what each scale can—and cannot—do.",
      { titleSize: 29 }
    ),
    sectionTitle("4  Lens A: strengthen the Reef locally"),
    para(
      "Local and regional actions can reduce pressures that weaken Reef ecosystems. Improving the quality of water flowing from catchments can reduce fine sediment, excess nutrients, pesticides and other pollutants reaching the Reef. Managing crown-of-thorns starfish outbreaks, supporting sustainable fishing, reducing marine debris and protecting connected habitats can also help.",
      { size: 21, line: 260 }
    ),
    para(
      "Traditional Owner Sea Country management brings continuing custodianship and cultural knowledge together with contemporary science. Researchers are also testing restoration and adaptation methods. These actions cannot cool the whole ocean, but they can improve conditions, protect important places and give coral communities more opportunity to survive or recover.",
      { size: 21, line: 260 }
    ),
    sectionTitle("5  Lens B: address the primary long-term threat"),
    para(
      "Australian scientific assessments identify human-induced climate change as the primary threat to the Great Barrier Reef. Greenhouse gas emissions warm the atmosphere and ocean, increasing the pressure from marine heatwaves. Local projects can reduce other stresses, but they cannot by themselves stop climate-driven ocean warming.",
      { size: 21, line: 260 }
    ),
    para(
      "For this reason, many scientists argue that the future of coral reefs requires strong reductions in greenhouse gas emissions as well as local management and adaptation. This lens works at a larger scale and over a longer timeframe, but the need is urgent because repeated bleaching events reduce recovery opportunities.",
      { size: 21, line: 260 }
    ),
    sectionTitle("6  A protection plan without a false choice"),
    para(
      "The two lenses do not have to cancel each other. Climate action addresses the largest long-term pressure. Local resilience work reduces other harms and supports recovery now. Governments still have to make decisions about priority, funding, responsibility and timing, but a strong plan can explain the different job of each response.",
      { size: 21, line: 260 }
    ),
    table(
      [
        tableRow(
          ["Local-resilience lens", "Honest overlap", "Climate-action lens"],
          [3513, 3513, 3514],
          {
            fill: palette.navy,
            color: palette.white,
            bold: true,
            size: 18,
            tableHeader: true,
          }
        ),
        tableRow(
          [
            "Reduce current pressures and strengthen recovery conditions.",
            "A living Reef with more opportunity to survive and recover.",
            "Reduce the warming pressure driving widespread bleaching.",
          ],
          [3513, 3513, 3514],
          { marginY: 110, size: 19 }
        ),
      ],
      [3513, 3513, 3514]
    ),
    sectionTitle("Quick evidence check", palette.coral),
    table(
      [
        tableRow(
          [
            "1. Why is “the whole Reef is dead” inaccurate?",
            "2. What can local action do?",
            "3. What can local action not do by itself?",
          ],
          [3513, 3513, 3514],
          { fills: [palette.paleCoral, palette.foam, palette.paleGold], size: 18, bold: true, marginY: 115 }
        ),
        tableRow(
          ["________________________________\n________________________________", "________________________________\n________________________________", "________________________________\n________________________________"],
          [3513, 3513, 3514],
          { marginY: 95, size: 18 }
        ),
      ],
      [3513, 3513, 3514]
    ),
    sectionTitle("Source trail", palette.muted, { size: 19, before: 65, after: 25 }),
    para(
      "[1] AIMS, Annual Summary Report of Coral Reef Condition 2024/25 (2025).  [2] Reef Authority, AIMS and CSIRO, Reef Snapshot: Summer 2024-25.  [3] AIMS, What is coral bleaching?  [4] Australian Government DCCEEW, Great Barrier Reef Scientific Consensus Statement (2024).  [5] Reef Authority, Great Barrier Reef Traditional Owners. Full links are in the teacher guide. Facts checked 29 July 2026.",
      { size: 16, color: palette.muted, line: 210, after: 0 }
    ),
  ];

  return docBase(
    children,
    "Lesson 14 Great Barrier Reef Reading Pack",
    "GBR reading pack",
    850
  );
}

function organiser() {
  const children = [
    ...titleBlock(
      "SUPPLEMENTAL LESSON 14 • RESEARCH + PERSUASION",
      "One Reef, Two Protection Lenses",
      "Name: ______________________________  Class: __________  Date: __________"
    ),
    sectionTitle("1  Evidence ledger"),
    table(
      [
        tableRow(
          ["Evidence job", "Accurate fact from the reading", "This matters because…"],
          [2100, 4700, 3740],
          { fill: palette.navy, color: palette.white, bold: true, size: 18, tableHeader: true }
        ),
        tableRow(["Current condition", "____________________________________\n____________________________________", "________________________________\n________________________________"], [2100, 4700, 3740], { marginY: 90 }),
        tableRow(["Major threat", "____________________________________\n____________________________________", "________________________________\n________________________________"], [2100, 4700, 3740], { marginY: 90 }),
        tableRow(["Possible response", "____________________________________\n____________________________________", "________________________________\n________________________________"], [2100, 4700, 3740], { marginY: 90 }),
      ],
      [2100, 4700, 3740]
    ),
    sectionTitle("2  Bleaching cause chain"),
    table(
      [
        tableRow(
          ["warming ocean", "→", "marine heatwave", "→", "coral stress", "→", "bleaching", "→", "recover or die"],
          [1370, 360, 1450, 360, 1270, 360, 1250, 360, 3760],
          { fills: [palette.paleGold, palette.white, palette.paleGold, palette.white, palette.paleCoral, palette.white, palette.paleCoral, palette.white, palette.foam], size: 17, bold: true, alignment: AlignmentType.CENTER, marginY: 105 }
        ),
      ],
      [1370, 360, 1450, 360, 1270, 360, 1250, 360, 3760]
    ),
    para("Because ________________________________________________________________________________", { size: 19, before: 25, after: 15 }),
    para("therefore _______________________________________________________________________________.", { size: 19, after: 25 }),
    sectionTitle("3  Two-lens board"),
    table(
      [
        tableRow(
          ["Lens A • Local resilience", "Honest overlap", "Lens B • Climate action"],
          [3650, 3240, 3650],
          { fills: [palette.ocean, palette.navy, palette.coral], color: palette.white, bold: true, size: 18, tableHeader: true }
        ),
        tableRow(
          ["Actions / evidence\n________________________________\n________________________________\n________________________________", "Both agree\n________________________________\n________________________________\n________________________________", "Actions / evidence\n________________________________\n________________________________\n________________________________"],
          [3650, 3240, 3650],
          { marginY: 105, size: 19 }
        ),
      ],
      [3650, 3240, 3650]
    ),
    sectionTitle("4  Compare the priorities"),
    para("Both lenses agree that ___________________________________________________________________.", { size: 19, after: 35 }),
    para("The local-resilience lens prioritises __________________________ because __________________________.", { size: 19, after: 35 }),
    para("The climate-action lens prioritises ___________________________ because __________________________.", { size: 19, after: 20 }),
    sectionTitle("5  Evidence boundary"),
    table(
      [
        tableRow(
          ["Claim", "Supported / inference / overclaim", "Why?"],
          [5150, 2450, 2940],
          { fill: palette.navy, color: palette.white, bold: true, size: 17, tableHeader: true }
        ),
        tableRow(["The whole Reef is dead.", "________________", "________________________\n________________________"], [5150, 2450, 2940]),
        tableRow(["Water quality can help Reef resilience.", "________________", "________________________\n________________________"], [5150, 2450, 2940]),
        tableRow(["Local work is pointless without climate action.", "________________", "________________________\n________________________"], [5150, 2450, 2940]),
        tableRow(["A complete plan needs work at more than one scale.", "________________", "________________________\n________________________"], [5150, 2450, 2940]),
      ],
      [5150, 2450, 2940]
    ),
    para("", { pageBreakBefore: true, after: 0 }),
    ...titleBlock(
      "SUPPLEMENTAL LESSON 14 • PERSUASION PLAN",
      "Build the Reef Protection Brief",
      "Use the evidence ledger. Do not research from memory alone.",
      { titleSize: 29 }
    ),
    sectionTitle("6  Position and audience"),
    table(
      [
        tableRow(["Audience", "My protection claim", "My priority"], [2300, 5240, 3000], {
          fill: palette.navy,
          color: palette.white,
          bold: true,
          size: 18,
          tableHeader: true,
        }),
        tableRow(["Australian environmental\ndecision-makers", "The Reef should be protected by __________________________\n____________________________________________________", "I will prioritise ____________________\nbecause __________________________"], [2300, 5240, 3000], { marginY: 100 }),
      ],
      [2300, 5240, 3000]
    ),
    sectionTitle("7  Evidence-to-reason plan"),
    table(
      [
        tableRow(["Evidence I will use", "What it proves", "Where it supports my position"], [3650, 3650, 3240], {
          fill: palette.ocean,
          color: palette.white,
          bold: true,
          size: 18,
          tableHeader: true,
        }),
        tableRow(["1. __________________________\n____________________________", "____________________________\n____________________________", "□ local  □ climate  □ overlap"], [3650, 3650, 3240], { marginY: 100 }),
        tableRow(["2. __________________________\n____________________________", "____________________________\n____________________________", "□ local  □ climate  □ overlap"], [3650, 3650, 3240], { marginY: 100 }),
        tableRow(["3. __________________________\n____________________________", "____________________________\n____________________________", "□ local  □ climate  □ overlap"], [3650, 3650, 3240], { marginY: 100 }),
      ],
      [3650, 3650, 3240]
    ),
    sectionTitle("8  Fair representation before priority"),
    table(
      [
        tableRow(
          [
            [
              para("Local-resilience lens", { size: 17, bold: true, color: palette.ocean, after: 10 }),
              para("Supporters would say __________________________________________", { size: 19, after: 25 }),
              para("because _____________________________________________________.", { size: 19, after: 5 }),
            ],
            [
              para("Climate-action lens", { size: 17, bold: true, color: palette.coral, after: 10 }),
              para("Supporters would say __________________________________________", { size: 19, after: 25 }),
              para("because _____________________________________________________.", { size: 19, after: 5 }),
            ],
          ],
          [5270, 5270],
          { fills: [palette.foam, palette.paleCoral], marginY: 95 }
        ),
      ],
      [5270, 5270]
    ),
    sectionTitle("9  Qualification + call to action"),
    para("Although __________________________________ matters because __________________________________,", { size: 19, after: 35 }),
    para("decision-makers should prioritise __________________________ because ____________________________.", { size: 19, after: 35 }),
    para("The action I will request is _________________________________________________________________.", { size: 19, after: 25 }),
    sectionTitle("10  Evidence-and-fairness feedback", palette.coral),
    table(
      [
        tableRow(
          [
            [
              para("Reviewer", { size: 17, bold: true, color: palette.ocean, after: 8 }),
              para("Strongest evidence: _______________________________________", { size: 19, after: 18 }),
              para("It works because _________________________________________.", { size: 19, after: 5 }),
            ],
            [
              para("Reviewer", { size: 17, bold: true, color: palette.coral, after: 8 }),
              para("The other lens is fair / unfair because ______________________", { size: 19, after: 18 }),
              para("_______________________________________________________.", { size: 19, after: 5 }),
            ],
          ],
          [5270, 5270],
          { fills: [palette.foam, palette.paleCoral], marginY: 95 }
        ),
      ],
      [5270, 5270]
    ),
    sectionTitle("EXIT  State the priority without erasing the other lens", palette.coral),
    para("Although __________________ matters because __________________, decision-makers should prioritise", { size: 20, after: 20 }),
    para("__________________ because the evidence shows ________________________________________________.", { size: 20, after: 0 }),
  ];

  return docBase(
    children,
    "Lesson 14 Great Barrier Reef Research and Persuasion Organiser",
    "GBR organiser"
  );
}

function lucasPack() {
  const children = [
    ...titleBlock(
      "SUPPLEMENTAL LESSON 14 • ACCESSIBLE READING",
      "The Reef Is Alive—and It Needs Help",
      "You may point, speak, copy or ask someone to write.",
      { kickerSize: 18, titleSize: 34, subtitleSize: 24 }
    ),
    table(
      [
        tableRow(
          [
            [
              para("1  THE REEF IS A LIVING PLACE", { size: 24, bold: true, color: palette.ocean, after: 12 }),
              para("The Great Barrier Reef is made of many reefs and habitats. Coral, fish, turtles and many other living things use the Reef.", { size: 28, line: 310, after: 8 }),
            ],
          ],
          [10540],
          { fill: palette.foam, borderColor: palette.ocean, marginY: 130 }
        ),
      ],
      [10540]
    ),
    para("", { after: 45 }),
    table(
      [
        tableRow(
          [
            [
              para("2  HOT WATER CAN BLEACH CORAL", { size: 24, bold: true, color: palette.coral, after: 12 }),
              para("Very warm ocean water can stress coral. Stressed coral can turn white. Some coral recovers. Some coral dies if the stress is too strong or lasts too long.", { size: 28, line: 310, after: 8 }),
            ],
          ],
          [10540],
          { fill: palette.paleCoral, borderColor: palette.coral, marginY: 130 }
        ),
      ],
      [10540]
    ),
    para("", { after: 45 }),
    table(
      [
        tableRow(
          [
            [
              para("3  LOCAL ACTION CAN HELP", { size: 24, bold: true, color: palette.ocean, after: 12 }),
              para("Cleaner water, careful fishing, starfish control and Sea Country management can reduce pressure and help coral recover.", { size: 28, line: 310, after: 8 }),
            ],
          ],
          [10540],
          { fill: palette.foam, borderColor: palette.ocean, marginY: 130 }
        ),
      ],
      [10540]
    ),
    para("", { after: 45 }),
    table(
      [
        tableRow(
          [
            [
              para("4  CLIMATE ACTION IS ALSO NEEDED", { size: 24, bold: true, color: palette.coral, after: 12 }),
              para("Local projects cannot cool the whole ocean. Climate action is needed to reduce the warming that causes marine heatwaves.", { size: 28, line: 310, after: 8 }),
            ],
          ],
          [10540],
          { fill: palette.paleCoral, borderColor: palette.coral, marginY: 130 }
        ),
      ],
      [10540]
    ),
    sectionTitle("CHECK  Choose the true ideas", palette.navy, { size: 26, before: 80 }),
    para("□ The whole Reef is dead.     □ The Reef is alive but under pressure.", { size: 27, bold: true, after: 35 }),
    para("□ Local action can help.       □ Local action can stop all ocean warming.", { size: 27, bold: true, after: 0 }),
    para("", { pageBreakBefore: true, after: 0 }),
    ...titleBlock(
      "SUPPLEMENTAL LESSON 14 • BUILD THE BRIEF",
      "Protect the Reef at Two Scales",
      "Choose evidence. Build two action sentences. Make one request.",
      { kickerSize: 18, titleSize: 34, subtitleSize: 24 }
    ),
    sectionTitle("1  Choose the evidence", palette.ocean, { size: 27 }),
    table(
      [
        tableRow(["□ Hot water can bleach coral.", "□ Local action can help recovery."], [5270, 5270], {
          fills: [palette.paleCoral, palette.foam],
          size: 27,
          bold: true,
          marginY: 160,
        }),
        tableRow(["□ The Reef still has living coral.", "□ Climate action reduces warming pressure."], [5270, 5270], {
          fills: [palette.foam, palette.paleCoral],
          size: 27,
          bold: true,
          marginY: 160,
        }),
      ],
      [5270, 5270]
    ),
    sectionTitle("2  Build the two action sentences", palette.ocean, { size: 27 }),
    para("Local action can help by __________________________________________________________", { size: 28, after: 70 }),
    para("________________________________________________________________________________.", { size: 28, after: 80 }),
    para("Climate action is needed because __________________________________________________", { size: 28, after: 70 }),
    para("________________________________________________________________________________.", { size: 28, after: 80 }),
    sectionTitle("3  Make the request", palette.coral, { size: 27 }),
    table(
      [
        tableRow(
          [
            [
              para("Please protect the Great Barrier Reef.", { size: 30, bold: true, after: 90 }),
              para("The evidence shows _________________________________________________.", { size: 28, after: 90 }),
              para("Local action can _________________________________________________ .", { size: 28, after: 90 }),
              para("Climate action is also needed because ________________________________.", { size: 28, after: 90 }),
              para("Please use both kinds of protection and ______________________________.", { size: 28, bold: true, after: 5 }),
            ],
          ],
          [10540],
          { fill: palette.paleGold, borderColor: palette.gold, marginY: 140 }
        ),
      ],
      [10540]
    ),
    sectionTitle("EXIT  My priority", palette.coral, { size: 27 }),
    para("I think decision-makers should prioritise ___________________________________________", { size: 28, after: 60 }),
    para("because _________________________________________________________________________.", { size: 28, after: 0 }),
  ];

  return docBase(
    children,
    "Lesson 14 Great Barrier Reef Lucas Reading and Persuasion Pack",
    "GBR Lucas pack"
  );
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "Lesson_14_GBR_Persuasive_Presentation.html"),
    presentationHtml(),
    "utf8"
  );
  fs.writeFileSync(
    path.join(outputDir, "Lesson_14_GBR_Reading_Pack.docx"),
    await Packer.toBuffer(readingPack())
  );
  fs.writeFileSync(
    path.join(outputDir, "Lesson_14_GBR_Organiser.docx"),
    await Packer.toBuffer(organiser())
  );
  fs.writeFileSync(
    path.join(outputDir, "Lesson_14_GBR_Lucas_Pack.docx"),
    await Packer.toBuffer(lucasPack())
  );
  console.log("Built Great Barrier Reef Lesson 14 alternative package.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

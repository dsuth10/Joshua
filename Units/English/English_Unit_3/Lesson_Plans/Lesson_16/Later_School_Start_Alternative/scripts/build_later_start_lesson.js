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
 * Authoritative generator for English Unit 3, Lesson 16:
 * Should School Start Later?
 *
 * The original Lesson 16 files are never read or changed by this script.
 *
 * DOCX design authority: compact_reference_guide.
 * Named classroom override:
 * - A4 portrait (11906 x 16838 DXA)
 * - 15 mm reading margins (850 DXA); 12 mm organiser margins (680 DXA)
 * - usable width 10540 DXA
 * - Arial for highly legible classroom printing
 * - clock/sleep palette
 * - body 10.5 pt reading / 11 pt organiser, 1.25 line rhythm
 * - fixed DXA table geometry, 120 DXA indent, 110/90 DXA cell padding
 * - no fixed row heights
 *
 * First-page header pattern: workshop_agenda, adapted as a compact
 * lesson-resource title stack rather than a business metric strip.
 */

const outDir = path.resolve(__dirname, "..");
const C = {
  ink: "202938",
  night: "14213D",
  blue: "275D8C",
  sky: "4F9BBF",
  mint: "48A999",
  coral: "D86755",
  gold: "E8B44D",
  paper: "FBFAF5",
  paleBlue: "EAF3F8",
  paleMint: "E8F5F1",
  paleCoral: "FBECE8",
  paleGold: "FFF5D8",
  line: "A9BCC7",
  muted: "5F6F7B",
  white: "FFFFFF",
};

const slides = [
  {
    hero: true,
    notes:
      "Do not debate immediately. Ask students to notice that a bell-time decision affects health, learning, families and operations. The lesson will test a provisional view.",
  },
  {
    kicker: "8:25 AM / DECISION ARRIVES",
    title: "Move the bell - or keep it?",
    time: 4,
    body: `
      <div class="bell-scene">
        <div class="clock" aria-label="Clock showing 8:25"><span>8:25</span><small>PROPOSED: 8:45</small></div>
        <div class="decision-cards">
          <button class="stance" data-message="Support needs a criterion and evidence.">SUPPORT</button>
          <button class="stance" data-message="Opposition also needs a criterion and evidence.">KEEP CURRENT TIME</button>
          <button class="stance" data-message="A trial can be a precise policy verdict, not indecision.">RUN A TRIAL</button>
        </div>
      </div>
      <div class="feedback centre" aria-live="polite">Choose a provisional position. You may move later.</div>`,
    task: ["Choose a provisional position and give one reason.", "Think, then pair", "Organiser: first reaction", "One position + reason", "A reaction is allowed to change."],
    notes:
      "Listen for hidden criteria: health, learning, family schedules, transport, sport, fairness. Record two or three, but do not declare a winner.",
  },
  {
    kicker: "VERDICT TEST",
    title: "Strong is not the same as loud",
    time: 4,
    body: `
      <div class="rank-stack">
        <button class="reveal" data-reveal="REACTION ONLY - no group, decision-maker, evidence or criterion.">Later starts are awesome.</button>
        <button class="reveal" data-reveal="ARGUABLE BUT VAGUE - which students, how much later, and judged by what?">Schools should start later because students are tired.</button>
        <button class="reveal" data-reveal="PRECISE - names decision-maker, action, group, criterion and qualification.">The school council should trial a later start for secondary students because adolescent sleep and readiness to learn outweigh manageable scheduling costs.</button>
      </div>`,
    task: ["Rank the statements. Name two features that improve.", "Pairs", "Organiser: Verdict Test", "Rank + two features", "Precision matters more than force."],
    notes:
      "Click each statement after students rank. The third is not the only defensible position; it is the most complete policy judgement.",
  },
  {
    kicker: "READING PACK / POLICY LENS",
    title: "Read for evidence, limits and practical effects",
    time: 9,
    body: `
      <div class="annotation-grid">
        <article><b>E</b><span>Evidence about sleep, mood, learning or attendance</span></article>
        <article><b>L</b><span>A limit on what the evidence can prove</span></article>
        <article><b>P</b><span>A practical effect the school must investigate</span></article>
      </div>
      <div class="flow"><span>sleep need</span><i>-></i><span>teen body clock</span><i>-></i><span>research findings</span><i>-></i><span>policy decision</span></div>`,
    task: ["Mark 4 E ideas, 2 L ideas and 2 P ideas.", "Independent or paired", "Reading Pack", "4E + 2L + 2P", "Do not highlight whole paragraphs."],
    notes:
      "Preteach circadian rhythm, adolescent, association, systematic review, criterion and policy trial. Reading aloud is an access route, not a lower destination.",
  },
  {
    kicker: "EVIDENCE CLOCK",
    title: "A finding needs a job",
    time: 5,
    body: `
      <div class="quadrants">
        <button class="reveal" data-reveal="JOB: supports a HEALTH or READINESS criterion; it does not guarantee each student sleeps longer."><b>SLEEP + MOOD</b><span>Later starts were associated with longer sleep and less negative mood.</span></button>
        <button class="reveal" data-reveal="JOB: explains why timing matters particularly during adolescence."><b>BODY CLOCK</b><span>Puberty commonly shifts sleep and wake timing later.</span></button>
        <button class="reveal" data-reveal="JOB: prevents the overclaim that grades will certainly rise."><b>ACHIEVEMENT</b><span>Reviews do not show a generalisable rise in grades or test scores.</span></button>
        <button class="reveal" data-reveal="JOB: identifies missing local evidence for a real school decision."><b>OPERATIONS</b><span>Transport, family schedules and afternoon activities may be affected.</span></button>
      </div>`,
    task: ["Record one fact in each quarter and explain what it can support.", "Independent, then pair", "Organiser: Evidence Clock", "Four fact-to-job links", "Keep the source group attached."],
    notes:
      "Require 'This matters because...' after each finding. The operations statement is a practical consideration requiring local evidence, not a universal research result.",
  },
  {
    kicker: "EVIDENCE BOUNDARY",
    title: "Right source - wrong age group?",
    time: 5,
    body: `
      <div class="boundary">
        <div class="question"><p>1. Later starts were associated with longer sleep and less negative mood.</p><div><button data-correct="true">Supported</button><button data-correct="false">Inference</button><button data-correct="false">Overclaim</button></div></div>
        <div class="question"><p>2. The 8:30 recommendation names middle and high schools.</p><div><button data-correct="true">Supported</button><button data-correct="false">Inference</button><button data-correct="false">Overclaim</button></div></div>
        <div class="question"><p>3. Therefore every primary school should start at 8:30.</p><div><button data-correct="false">Supported</button><button data-correct="false">Inference</button><button data-correct="true">Overclaim</button></div></div>
        <div class="question"><p>4. A secondary trial may be justified if local effects are checked.</p><div><button data-correct="false">Supported</button><button data-correct="true">Inference</button><button data-correct="false">Overclaim</button></div></div>
      </div>
      <div class="action"><button class="btn check">Check</button><button class="btn pale local-reset">Reset</button><span class="feedback" aria-live="polite"></span></div>`,
    task: ["Classify all four and explain the hardest boundary.", "Independent, then class", "Organiser: Age Boundary", "Four labels + reason", "Trustworthy is not enough; relevance includes age."],
    notes:
      "Claim 4 is a reasonable policy inference, not a source quotation. Recheck after feedback. Emphasise that primary-aged students still need sleep; the missing link is evidence for the exact bell-time policy.",
  },
  {
    kicker: "CRITERION GATE",
    title: "What should decide the decision?",
    time: 5,
    body: `
      <div class="criteria">
        <button class="criterion" data-message="HEALTH asks: would the policy improve sleep opportunity or wellbeing?">HEALTH</button>
        <button class="criterion" data-message="READINESS asks: would students be more alert, present and able to learn?">READINESS TO LEARN</button>
        <button class="criterion" data-message="FEASIBILITY asks: can transport, staffing, care and activities work safely?">PRACTICAL FEASIBILITY</button>
        <button class="criterion" data-message="FAIRNESS asks: who benefits, who carries costs, and whose needs are missed?">FAIRNESS</button>
      </div>
      <div class="criterion-message">Choose the criterion that should carry the most weight.</div>`,
    task: ["Choose one criterion, affected group and provisional verdict.", "Position line", "Organiser: Criterion Gate", "Criterion + verdict + reason", "What evidence would make you move?"],
    notes:
      "Multiple answers are legitimate. Push students to name the trade-off: 'Health should outweigh manageable scheduling costs' is more precise than 'health matters'.",
  },
  {
    kicker: "EVIDENCE TRIAL",
    title: "Relevant - or merely interesting?",
    time: 5,
    body: `
      <div class="trial">
        <article><small>CARD A</small><p>A 2022 meta-analysis combined 28 studies and more than 1.7 million participants.</p></article>
        <article><small>CARD B</small><p>Later starts were associated with longer sleep and less negative mood.</p></article>
        <article><small>CARD C</small><p>Australian guidance recommends sufficient sleep for both children and adolescents.</p></article>
        <article><small>CARD D</small><p>Local bus, care and activity effects have not yet been measured.</p></article>
      </div>
      <div class="prompt">My criterion is ___, so the most decisive evidence is ___ because ___.</div>`,
    task: ["Select two cards. Reject one attractive but less direct card.", "Independent + partner challenge", "Organiser: Evidence Trial", "2 chosen + 1 rejected with reason", "Match evidence to your criterion."],
    notes:
      "There is no universal pair. For health, B plus adolescent timing evidence is strongest. For feasibility, D is decisive because it reveals the missing local investigation. Card A establishes scale, not the finding by itself.",
  },
  {
    kicker: "COUNTERVIEW",
    title: "Name the real cost - then answer proportionately",
    time: 4,
    body: `
      <div class="counter">
        <article><b>TRANSPORT</b><span>Bus routes and staff schedules may need redesign.</span></article>
        <article><b>FAMILIES</b><span>Drop-off, care and work routines may be disrupted.</span></article>
        <article><b>AFTERNOONS</b><span>Sport, work and homework may finish later.</span></article>
        <article><b>UNCERTAINTY</b><span>Students might stay up later; primary transfer is unclear.</span></article>
      </div>
      <div class="response-chain"><b>ACKNOWLEDGE</b><span>Some families may...</span><b>RESPOND</b><span>so the school should...</span></div>`,
    task: ["Draft the strongest fair concern and a proportionate response.", "Pairs", "Organiser: Counterview", "Concern + response", "Do not pretend the concern disappears."],
    notes:
      "Trial, staged change, consultation, transport safeguard, sleep education or explicit evaluation can be proportionate responses.",
  },
  {
    kicker: "ANNOTATED MODEL",
    title: "Read the verdict like a decision-maker",
    time: 5,
    body: `
      <div class="model">
        <button class="annot" data-reveal="VERDICT + GROUP">Our school council should trial an 8:45 am start for secondary students</button>
        <button class="annot" data-reveal="CRITERION">because student health and readiness to learn should guide the decision.</button>
        <button class="annot" data-reveal="EVIDENCE">A 2022 meta-analysis found later starts were associated with longer sleep and less negative mood, while sleep specialists recommend 8:30 am or later for middle and high schools.</button>
        <button class="annot" data-reveal="REASONING">This matters because the evidence concerns adolescents whose body clocks tend to shift later.</button>
        <button class="annot" data-reveal="FAIR COUNTERVIEW + RESPONSE">Families may reasonably worry about transport and afternoon activities, so the trial should monitor attendance, sleep and scheduling problems.</button>
        <button class="annot" data-reveal="LIMIT + CONCLUSION">The same evidence does not prove that primary students need a later bell. A measured secondary trial is therefore stronger than an all-school change.</button>
      </div>`,
    task: ["Find six moves and star one to imitate.", "Whole class", "Organiser: model notes", "Six labels + starred move", "The model is not the only verdict."],
    notes:
      "Click after students name each move. Draw attention to 'associated with', the age boundary, and the way the practical concern changes the proposal into a monitored trial.",
  },
  {
    kicker: "VERDICT CHAIN",
    title: "Lock the reasoning before writing",
    time: 3,
    body: `
      <div class="chain">
        <span>VERDICT + GROUP</span><i>-></i><span>CRITERION</span><i>-></i><span>EVIDENCE</span><i>-></i><span>WHY IT MATTERS</span><i>-></i><span>COUNTERVIEW</span><i>-></i><span>LIMIT + ACTION</span>
      </div>
      <div class="prompt">If one box is empty, the paragraph is not ready.</div>`,
    task: ["Complete every link in note form.", "Independent", "Organiser: Policy Verdict Plan", "Six usable notes", "Evidence must fit the named group."],
    notes:
      "Confer first with students whose evidence is general sleep advice rather than evidence relevant to secondary bell times.",
  },
  {
    depth: true,
    kicker: "DEPTH A / OPTIONAL",
    title: "Change the audience, not the evidence",
    time: 7,
    body: `
      <div class="audiences">
        <article><small>SCHOOL COUNCIL</small><p>policy, evidence, trial conditions, measures</p></article>
        <article><small>PARENT GROUP</small><p>family routines, transport, safeguards, consultation</p></article>
      </div>
      <div class="prompt">Which concern and call to action need more space?</div>`,
    task: ["Adapt the verdict for the second audience and explain one change.", "Independent, then compare", "Workbook margin", "Two versions + explanation", "Preserve evidence accuracy."],
    notes:
      "Optional depth. Students should not merely change the greeting; the audience changes emphasis, tone and requested action.",
  },
  {
    depth: true,
    kicker: "DEPTH B / OPTIONAL",
    title: "Design a fair one-term trial",
    time: 8,
    body: `
      <div class="trial-design">
        <span>WHO + WHAT TIME?</span><span>WHAT TWO OUTCOMES?</span><span>WHAT SAFEGUARD?</span><span>WHAT RESULT DECIDES?</span>
      </div>
      <div class="prompt">A trial is persuasive only if it could change your mind.</div>`,
    task: ["Design a trial with two measures and a decision rule.", "Pairs", "Workbook margin", "Group + measures + safeguard + rule", "Choose measures that match the criterion."],
    notes:
      "Good measures include sleep duration, attendance, lateness, daytime sleepiness and scheduling problems. Test scores alone may be too distant for a short trial.",
  },
  {
    kicker: "WORKBOOK / INDEPENDENT",
    title: "Write the 100-word Bell-Time Verdict",
    time: 10,
    timer: 10,
    body: `
      <div class="writing">
        <h3>About 90-120 words</h3>
        <ul><li>precise verdict + group</li><li>named criterion</li><li>two directly relevant evidence points</li><li>why the evidence matters</li><li>fair counterview + response</li><li>honest age boundary</li></ul>
        <p>Audience: principal or school council. Support, oppose or qualify - but make the reasoning defensible.</p>
      </div>`,
    task: ["Write the complete policy verdict.", "Independent and silent", "English workbook", "One coherent verdict", "Use 'associated with' accurately."],
    notes:
      "Word count is approximate. Students may imitate the model architecture but must make their own criterion and evidence decisions.",
  },
  {
    kicker: "REVISION GATE",
    title: "Turn reporting into policy reasoning",
    time: 4,
    body: `
      <div class="before-after">
        <article><small>SUMMARY</small><p>The meta-analysis found later starts were linked with longer sleep.</p></article>
        <article><small>REASONING</small><p>This matters for a secondary-school health decision because longer sleep opportunity may reduce the mismatch between adolescent body clocks and early waking.</p></article>
      </div>
      <div class="revision">Find one summary sentence. Add: <b>This matters because...</b> / <b>Therefore...</b> / <b>For this decision...</b></div>`,
    task: ["Self-check, then visibly revise one summary sentence.", "Independent", "Workbook verdict", "One underlined reasoning revision", "Do not add certainty the source lacks."],
    notes:
      "This is the central transfer from original Lesson 16. A reasoning revision must connect evidence to group, criterion and decision.",
  },
  {
    kicker: "EXIT EVIDENCE",
    title: "The verdict in one sentence",
    time: 2,
    body: `
      <div class="exit">The school council should <span>________</span> for <span>________</span> because <span>criterion</span> matters most, and the evidence shows <span>________________</span>.</div>
      <div class="confidence">Confidence: 1 = evidence unclear &nbsp; 2 = reasoning needs work &nbsp; 3 = ready to defend</div>`,
    task: ["Write one precise verdict sentence and confidence code.", "Independent", "Workbook margin", "Sentence + 1/2/3", "Name group, policy, criterion and evidence."],
    notes:
      "Safe stopping point. Sort exits by evidence relevance, reasoning and control of the age boundary.",
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function taskPanel(task) {
  const labels = ["DO", "WORK", "RECORD", "FINISH", "CHECK"];
  return `<div class="task-panel">${task
    .map((value, i) => `<div class="${i === 4 ? "wide" : ""}"><small>${labels[i]}</small><b>${value}</b></div>`)
    .join("")}</div>`;
}

function renderSlide(slide, i) {
  if (slide.hero) {
    return `<section class="slide hero${i === 0 ? " active" : ""}" data-notes="${esc(slide.notes)}">
      <div class="hero-copy"><div class="kicker">SUPPLEMENTAL LESSON 16 / POLICY PERSUASION</div>
      <h1>The Bell-Time<br>Verdict</h1><p>Research the evidence. Respect its limits. Advise the decision-maker.</p>
      <div class="hero-tags"><span>READ</span><span>TEST</span><span>DECIDE</span><span>REVISE</span></div></div>
      <div class="hero-clock" role="img" aria-label="A stylised clock moving from an early bell time towards a later bell time">
        <div class="orbit one"></div><div class="orbit two"></div><div class="moon"></div>
        <div class="dial"><span>8:45</span><small>POLICY UNDER REVIEW</small></div>
        <div class="hand"></div><div class="tick t1"></div><div class="tick t2"></div><div class="tick t3"></div><div class="tick t4"></div>
      </div></section>`;
  }
  const timer = slide.timer
    ? `<div class="timer"><span class="timer-readout" data-start="${slide.timer * 60}">${String(slide.timer).padStart(2, "0")}:00</span><button class="btn timer-start">Start / reset</button></div>`
    : "";
  return `<section class="slide${slide.depth ? " depth" : ""}" data-notes="${esc(slide.notes)}">
    <header><div><div class="kicker">${slide.kicker}</div><h2>${slide.title}</h2></div><div class="meta"><span>${slide.depth ? "OPTIONAL DEPTH" : "CORE"}</span><span>${slide.time} MIN</span></div></header>
    <div class="body">${slide.body}${timer}</div>${taskPanel(slide.task)}</section>`;
}

function presentationHtml() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Supplemental Lesson 16 - The Bell-Time Verdict</title>
<style>
:root{--night:#14213d;--blue:#275d8c;--sky:#4f9bbf;--mint:#48a999;--coral:#d86755;--gold:#e8b44d;--paper:#fbfaf5;--ink:#202938;--muted:#5f6f7b;--line:#a9bcc7;--nav:66px}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--night);font-family:Arial,sans-serif;color:var(--ink)}button{font:inherit}.slide{display:none;position:absolute;inset:0 0 var(--nav);padding:27px 46px 15px;background:linear-gradient(135deg,#fffdf8,#eaf3f8);overflow:hidden}.slide.active{display:flex;flex-direction:column}.depth{background:linear-gradient(135deg,#fff9e8,#eef6f3)}
.hero{padding:0;background:radial-gradient(circle at 75% 30%,#305b7a,#14213d 60%,#0c1429);color:white}.hero.active{display:grid;grid-template-columns:1.05fr .95fr}.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:7vh 2vw 7vh 6vw}.hero h1{font-family:Georgia,serif;font-size:clamp(52px,6vw,92px);line-height:.94;margin:14px 0 22px;letter-spacing:-2px}.hero p{font-size:clamp(21px,2vw,31px);max-width:700px;line-height:1.35}.hero-tags{display:flex;gap:10px;flex-wrap:wrap}.hero-tags span{border:1px solid #ffffff88;border-radius:999px;padding:9px 16px;font-weight:900;font-size:13px}.hero .kicker{color:#ffd97c}.hero-clock{position:relative;margin:7vh 6vw 7vh 0;border-radius:40px;background:linear-gradient(145deg,#1e3554,#0e172c);box-shadow:0 30px 80px #0008;overflow:hidden;min-height:430px}.dial{position:absolute;width:310px;height:310px;border:18px solid #f3efe4;border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 0 8px #e8b44d55,0 0 70px #4f9bbf55}.dial span{font-size:70px;font-weight:900;letter-spacing:-4px}.dial small{color:#e8b44d;font-weight:900;letter-spacing:1px}.hand{position:absolute;width:8px;height:115px;background:var(--coral);left:50%;top:50%;transform:translate(-50%,-100%) rotate(58deg);transform-origin:bottom;border-radius:9px}.moon{position:absolute;width:90px;height:90px;border-radius:50%;background:#f6e6a8;right:35px;top:32px;box-shadow:-24px 10px 0 #1e3554}.orbit{position:absolute;border:1px solid #ffffff20;border-radius:50%}.orbit.one{inset:10%}.orbit.two{inset:22%}.tick{position:absolute;background:#fff;width:5px;height:24px;left:50%;top:calc(50% - 151px)}.t2{transform-origin:2px 151px;transform:rotate(90deg)}.t3{transform-origin:2px 151px;transform:rotate(180deg)}.t4{transform-origin:2px 151px;transform:rotate(270deg)}
.kicker{font-size:13px;font-weight:900;letter-spacing:2px;color:var(--blue)}header{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:10px}h2{font-family:Georgia,serif;color:var(--night);font-size:clamp(31px,3.2vw,49px);line-height:1.02;margin:5px 0 0;letter-spacing:-1px}.meta{display:flex;gap:7px;white-space:nowrap}.meta span{padding:8px 11px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:12px;font-weight:900}.body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:12px}
.task-panel{display:grid;grid-template-columns:1.55fr .75fr 1fr 1.1fr;gap:7px;margin-top:8px}.task-panel>div{background:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 10px;min-height:46px;display:flex;flex-direction:column;gap:3px}.task-panel .wide{grid-column:1/-1;min-height:34px;display:grid;grid-template-columns:70px 1fr;align-items:center}.task-panel small{font-size:10px;font-weight:900;letter-spacing:1px;color:var(--blue)}.task-panel b{font-size:13px;line-height:1.15}
.bell-scene{display:grid;grid-template-columns:.8fr 1.2fr;gap:24px;align-items:center}.clock{width:250px;height:250px;border:16px solid var(--night);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;box-shadow:0 18px 35px #14213d22}.clock span{font-size:60px;font-weight:900;color:var(--night)}.clock small{font-size:14px;color:var(--coral);font-weight:900}.decision-cards{display:grid;gap:12px}.stance,.criterion{border:2px solid var(--blue);background:#fff;border-radius:16px;padding:20px;font-weight:900;font-size:21px;cursor:pointer}.stance.selected,.criterion.selected{background:var(--night);color:#fff;border-color:var(--gold)}.centre{text-align:center}.feedback{font-weight:850;color:var(--night)}
.rank-stack{display:grid;gap:12px}.reveal,.annot{border:2px solid var(--blue);background:#fff;border-radius:14px;padding:17px;font-weight:800;cursor:pointer;text-align:left}.reveal{font-size:21px}.reveal.open,.annot.open{background:var(--night);color:#fff}.reveal.open::after,.annot.open::after{content:attr(data-reveal);display:block;color:#ffe4a0;font-size:13px;line-height:1.25;margin-top:8px}.annotation-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.annotation-grid article{background:#fff;border:2px solid var(--line);border-radius:16px;padding:22px;display:flex;align-items:center;gap:15px}.annotation-grid b{display:grid;place-items:center;width:55px;height:55px;border-radius:50%;background:var(--night);color:#fff;font-size:27px}.annotation-grid span{font-size:19px;font-weight:750}.flow{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap}.flow span{background:#fff;border:2px solid var(--mint);border-radius:999px;padding:11px 15px;font-weight:850}.flow i{color:var(--coral);font-size:24px}
.quadrants{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.quadrants .reveal{min-height:118px}.quadrants b,.quadrants span{display:block}.quadrants b{color:var(--blue);margin-bottom:6px}.quadrants .open b{color:#ffe4a0}.boundary{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.question{background:#fff;border:2px solid var(--line);border-radius:13px;padding:11px}.question p{font-weight:750;margin:0 0 10px;font-size:15px}.question>div{display:flex;gap:5px}.question button{flex:1;border:2px solid var(--line);background:#fff;border-radius:8px;padding:7px;cursor:pointer;font-weight:800}.question button.selected{border-color:var(--blue);outline:3px solid #4f9bbf33}.question button.correct{background:#dff3e8}.question button.incorrect{background:#f8dfd9}.action{display:flex;gap:9px;justify-content:center;align-items:center}.btn{border:0;border-radius:9px;background:var(--blue);color:#fff;padding:10px 15px;font-weight:900;cursor:pointer}.btn.pale{background:#fff;color:var(--night);border:2px solid var(--line)}
.criteria{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.criterion-message,.prompt,.revision,.exit,.confidence{background:#fff;border-left:9px solid var(--mint);border-radius:13px;padding:18px;font-size:21px;line-height:1.35;text-align:center}.trial,.counter{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.trial article,.counter article,.audiences article{background:#fff;border-top:7px solid var(--blue);border-radius:15px;padding:17px}.trial small{font-weight:900;color:var(--coral)}.trial p,.counter span{font-size:18px;line-height:1.35}.counter article:nth-child(even){border-top-color:var(--coral)}.counter b,.counter span{display:block}.counter b{color:var(--blue);margin-bottom:5px}.response-chain{display:grid;grid-template-columns:.45fr 1fr .45fr 1fr;gap:8px;align-items:center}.response-chain b{background:var(--night);color:#fff;padding:12px;border-radius:8px;text-align:center}.response-chain span{background:#fff;border:1px solid var(--line);padding:12px;border-radius:8px}
.model{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.annot{font-size:15px;padding:11px 13px}.chain{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}.chain span{background:#fff;border:2px solid var(--blue);padding:14px;border-radius:12px;font-weight:900}.chain i{color:var(--coral);font-size:22px}.audiences{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.audiences article:last-child{border-color:var(--coral)}.audiences small{font-weight:900;color:var(--blue)}.audiences p{font-size:22px;font-weight:800}.trial-design{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.trial-design span{display:grid;place-items:center;text-align:center;background:#fff;border:2px solid var(--blue);border-radius:15px;min-height:140px;font-weight:900;font-size:18px}.writing{background:#fff;border:2px solid var(--blue);border-radius:17px;padding:20px 28px}.writing h3{font-family:Georgia,serif;color:var(--night);font-size:30px;margin:0 0 10px}.writing ul{columns:2;font-size:18px;line-height:1.55;margin:0}.writing p{font-size:17px}.timer{position:absolute;right:46px;bottom:101px;background:var(--night);color:#fff;border-radius:12px;padding:9px 13px;display:flex;gap:10px;align-items:center}.timer-readout{font-size:27px;font-weight:900}.before-after{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.before-after article{background:#fff;border-top:8px solid var(--coral);border-radius:16px;padding:20px}.before-after article:last-child{border-color:var(--mint)}.before-after small{font-weight:900;color:var(--blue)}.before-after p{font-size:20px;line-height:1.4}.exit span{display:inline-block;min-width:90px;border-bottom:2px solid var(--ink)}.confidence{border-color:var(--coral);font-size:17px;font-weight:800}
.nav{position:absolute;inset:auto 0 0;height:var(--nav);background:#0d172c;color:#fff;display:flex;align-items:center;gap:12px;padding:0 18px;z-index:30}.nav button{border:0;background:transparent;color:#fff;font-weight:850;padding:10px 12px;border-radius:8px;cursor:pointer}.nav button:hover,.nav button:focus-visible{background:#ffffff22;outline:2px solid var(--gold)}.progress{height:7px;flex:1;background:#ffffff33;border-radius:999px;overflow:hidden}.progress i{display:block;height:100%;background:var(--gold);width:0}.slide-no{min-width:70px;font-weight:900}.notes{display:none;position:absolute;right:18px;bottom:80px;width:min(520px,44vw);max-height:70vh;overflow:auto;background:#fff;color:var(--ink);border:3px solid var(--sky);border-radius:14px;padding:18px;z-index:40;box-shadow:0 20px 60px #0006}.notes.open{display:block}.notes h3{margin:0 0 8px;color:var(--night)}
@media(max-width:1100px){.slide{padding:20px 28px 14px}h2{font-size:32px}.task-panel b{font-size:11px}.task-panel{grid-template-columns:1.4fr .7fr 1fr 1fr}.question p{font-size:13px}.model .annot{font-size:13px}.timer{right:28px}.hero-copy{padding-left:4vw}.trial-design span{min-height:110px;font-size:15px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style></head><body>
<main>${slides.map(renderSlide).join("\n")}</main>
<aside class="notes" id="notes"><h3>Teacher note</h3><p id="notesText"></p></aside>
<nav class="nav" aria-label="Presentation controls"><button id="prev" aria-label="Previous slide">&larr; Previous</button><div class="progress" aria-hidden="true"><i id="progress"></i></div><span class="slide-no" id="slideNo"></span><button id="notesBtn">Notes</button><button id="resetBtn">Reset</button><button id="fullBtn">Fullscreen</button><button id="next">Next &rarr;</button></nav>
<script>
const slides=[...document.querySelectorAll('.slide')];let current=0;const notes=document.getElementById('notes'),notesText=document.getElementById('notesText');
function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.classList.toggle('active',i===current));document.getElementById('slideNo').textContent=(current+1)+' / '+slides.length;document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';notesText.textContent=slides[current].dataset.notes||'';notes.classList.remove('open')}
document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);document.getElementById('notesBtn').onclick=()=>notes.classList.toggle('open');document.getElementById('resetBtn').onclick=()=>location.reload();document.getElementById('fullBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{if(['BUTTON','INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1)});
document.querySelectorAll('.reveal,.annot').forEach(b=>b.onclick=()=>b.classList.toggle('open'));
document.querySelectorAll('.stance').forEach(b=>b.onclick=()=>{document.querySelectorAll('.stance').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');b.closest('.slide').querySelector('.feedback').textContent=b.dataset.message});
document.querySelectorAll('.criterion').forEach(b=>b.onclick=()=>{document.querySelectorAll('.criterion').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');b.closest('.slide').querySelector('.criterion-message').textContent=b.dataset.message});
document.querySelectorAll('.question button').forEach(b=>b.onclick=()=>{const q=b.closest('.question');q.querySelectorAll('button').forEach(x=>x.classList.remove('selected','correct','incorrect'));b.classList.add('selected')});
document.querySelectorAll('.check').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide'),qs=[...slide.querySelectorAll('.question')];let complete=true,all=true;qs.forEach(q=>{const s=q.querySelector('.selected');if(!s){complete=false;return}const ok=s.dataset.correct==='true';s.classList.add(ok?'correct':'incorrect');all=all&&ok});slide.querySelector('.feedback').textContent=!complete?'Choose one label for every claim.':all?'Boundary secure. Explain why claim 4 is an inference.':'Recheck age group, source fact, inference and unsupported certainty.'});
document.querySelectorAll('.local-reset').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide');slide.querySelectorAll('.question button').forEach(x=>x.classList.remove('selected','correct','incorrect'));slide.querySelector('.feedback').textContent=''});
document.querySelectorAll('.timer-start').forEach(btn=>btn.onclick=()=>{const box=btn.closest('.timer'),read=box.querySelector('.timer-readout');clearInterval(box._timer);let n=Number(read.dataset.start);const paint=()=>read.textContent=String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');paint();box._timer=setInterval(()=>{n--;paint();if(n<=0){clearInterval(box._timer);read.textContent='TIME'}},1000)});
show(0);
</script></body></html>`;
}

function run(text, options = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: options.size || 20,
    color: options.color || C.ink,
    bold: options.bold,
    italics: options.italics,
  });
}

function para(text = "", options = {}) {
  return new Paragraph({
    alignment: options.alignment,
    keepNext: options.keepNext,
    pageBreakBefore: options.pageBreakBefore,
    style: options.style,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 70,
      line: options.line ?? 300,
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

function borderSet(color = C.line, size = 5) {
  const edge = { style: BorderStyle.SINGLE, color, size };
  return { top: edge, bottom: edge, left: edge, right: edge };
}

function cell(content, width, options = {}) {
  const children = Array.isArray(content)
    ? content
    : [para(content, { size: options.size || 19, bold: options.bold, color: options.color, alignment: options.alignment, after: 15, line: options.line || 250 })];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: {
      top: options.marginY ?? 90,
      bottom: options.marginY ?? 90,
      left: options.marginX ?? 110,
      right: options.marginX ?? 110,
    },
    borders: borderSet(options.borderColor, options.borderSize),
    shading: options.fill ? { fill: options.fill, type: ShadingType.CLEAR } : undefined,
    children,
  });
}

function row(values, widths, options = {}) {
  return new TableRow({
    tableHeader: options.tableHeader,
    children: values.map((value, i) => cell(value, widths[i], { ...options, fill: options.fills ? options.fills[i] : options.fill })),
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

function h(text, color = C.blue, options = {}) {
  return para(text, {
    style: options.level === 1 ? "Heading1" : options.level === 3 ? "Heading3" : "Heading2",
    size: options.size || 23,
    bold: true,
    color,
    before: options.before ?? 110,
    after: options.after ?? 50,
    keepNext: true,
  });
}

function titleBlock(kicker, title, subtitle, options = {}) {
  return [
    para(kicker, { size: options.kickerSize || 15, bold: true, color: C.coral, after: 16 }),
    para(title, { style: "Title", size: options.titleSize || 31, bold: true, color: C.night, after: 15 }),
    para(subtitle, { style: "Subtitle", size: options.subtitleSize || 18, color: C.muted, after: 55 }),
  ];
}

function footer(label) {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          run(`${label}  |  `, { size: 14, color: C.muted }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: C.muted }),
        ],
      }),
    ],
  });
}

function docBase(children, title, label, margins = 680) {
  return new Document({
    creator: "English Unit 3 lesson generator",
    title,
    description: "Supplemental Lesson 16 resource for research-informed persuasive policy writing.",
    styles: {
      default: {
        document: { run: { font: "Arial", size: 20, color: C.ink }, paragraph: { spacing: { after: 120, line: 300, lineRule: "auto" } } },
        heading1: { run: { font: "Arial", size: 32, bold: true, color: C.blue }, paragraph: { spacing: { before: 360, after: 200 }, keepNext: true } },
        heading2: { run: { font: "Arial", size: 26, bold: true, color: C.blue }, paragraph: { spacing: { before: 280, after: 140 }, keepNext: true } },
        heading3: { run: { font: "Arial", size: 24, bold: true, color: C.night }, paragraph: { spacing: { before: 200, after: 100 }, keepNext: true } },
        title: { run: { font: "Arial", size: 36, bold: true, color: C.night }, paragraph: { spacing: { before: 0, after: 60 }, keepNext: true } },
        subtitle: { run: { font: "Arial", size: 22, color: C.muted }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: margins, right: margins, bottom: margins, left: margins, header: 300, footer: 300 },
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
      "SUPPLEMENTAL LESSON 16 / STUDENT READING",
      "Should School Start Later?",
      "Read like a policy adviser: mark evidence (E), limits (L) and practical considerations (P)."
    ),
    table(
      [row([[para("READING MISSION", { size: 17, bold: true, color: C.blue, after: 10 }), para("Mark four E ideas, two L ideas and two P ideas. Keep each finding attached to its age group and source.", { size: 20, bold: true, after: 5 })]], [10540], { fill: C.paleBlue, borderColor: C.blue, marginY: 110 })],
      [10540]
    ),
    h("1  Sleep need changes with age"),
    para(
      "Sleep supports attention, memory, mood and health. Australian movement guidelines recommend 9-11 hours of uninterrupted sleep for young people aged 5-13 and 8-10 hours for those aged 14-17. These ranges show that sufficient sleep matters across school years. However, a sleep-duration recommendation does not by itself identify the best bell time for every school.",
      { size: 21, line: 300 }
    ),
    h("2  Why adolescence matters"),
    para(
      "During puberty, many adolescents experience a natural shift in their circadian rhythm - the internal body clock that helps regulate sleep and waking. They often feel sleepy later at night and find early waking more difficult. Behaviour also matters: screens, homework, work, sport and irregular weekend sleep can delay bedtime. A later bell does not guarantee longer sleep if bedtime moves later too.",
      { size: 21, line: 300 }
    ),
    para(
      "The American Academy of Sleep Medicine recommends that middle and high schools start at 8:30 am or later. Its recommendation is designed to give adolescents a better opportunity to obtain enough sleep and arrive alert. Notice the boundary: it names middle and high schools. It is not a recommendation that every primary school must use the same start time.",
      { size: 21, line: 300 }
    ),
    h("3  What the research found"),
    para(
      "A 2022 meta-analysis combined 28 studies and data from 1,774,509 participants. Across the studies, later school start times were associated with longer sleep, less negative mood and better overall developmental outcomes. Start times from 8:30 to 8:59 were associated with better outcomes than starts from 8:00 to 8:29. The researchers also found differences between school groups and said more research was needed for some outcomes and student characteristics.",
      { size: 21, line: 300 }
    ),
    para(
      "The phrase associated with matters. Many studies compare real schools rather than randomly assigning students to different bell times. Other differences between schools or families might affect results. The findings support considering a later start, but they do not promise the same benefit for every student or prove that one exact time will work everywhere.",
      { size: 21, line: 300 }
    ),
    h("4  Will grades rise?"),
    para(
      "A separate 2022 systematic review examined grades and test scores in middle and high schools. It did not find a clear, generalisable improvement in academic achievement after later starts. Most studies did not show academic harm either: achievement was generally maintained. This means a persuasive case should not claim that later bells will definitely raise grades. Health, sleep, mood, attendance or readiness may be stronger criteria.",
      { size: 21, line: 300 }
    ),
    para("", { pageBreakBefore: true, after: 0 }),
    ...titleBlock(
      "SUPPLEMENTAL LESSON 16 / STUDENT READING",
      "From Evidence to a Local Decision",
      "Good policy reasoning joins research with local needs, practical effects and a plan to check results.",
      { titleSize: 29 }
    ),
    h("5  The practical counterview"),
    para(
      "Changing a school day affects more than the first lesson. Bus routes, staff hours, family drop-off, before-school care, afternoon sport, part-time work and homework routines may also change. These concerns do not prove that a later start is wrong. They are practical questions that a decision-maker must investigate rather than dismiss.",
      { size: 21, line: 300 }
    ),
    para(
      "A school could respond by consulting families, redesigning transport, shifting activity times, teaching healthy sleep habits, or running a limited trial. A trial is strongest when leaders decide in advance what to measure - for example sleep duration, daytime sleepiness, attendance, lateness and scheduling problems - and what result would support keeping or reversing the change.",
      { size: 21, line: 300 }
    ),
    h("6  The age-boundary problem"),
    para(
      "A combined primary-secondary school faces a difficult evidence question. Primary-aged children need plenty of sleep, but the adolescent body-clock explanation and the 8:30 recommendation do not automatically transfer to them. Evidence can be trustworthy yet still be only partly relevant to a different age group.",
      { size: 21, line: 300 }
    ),
    para(
      "A defensible policy verdict therefore names the group. A student might recommend a later start for secondary students, oppose a change until local evidence is gathered, or propose a secondary-only trial. Each position can be persuasive if it uses relevant evidence, explains a criterion, answers a fair counterview and states what the research cannot yet prove.",
      { size: 21, line: 300 }
    ),
    h("Evidence snapshot"),
    table(
      [
        row(["Finding", "Useful for", "Necessary limit"], [3950, 3000, 3590], { fill: C.night, color: C.white, bold: true, size: 17, tableHeader: true }),
        row(["Later starts were associated with longer sleep and less negative mood.", "Health / readiness", "Association is not a guarantee."], [3950, 3000, 3590], { size: 18 }),
        row(["AASM recommends 8:30 or later for middle and high schools.", "Secondary policy option", "Not an all-primary recommendation."], [3950, 3000, 3590], { size: 18 }),
        row(["Achievement generally remained stable; clear general improvement was not found.", "Honest academic claim", "Do not promise higher grades."], [3950, 3000, 3590], { size: 18 }),
      ],
      [3950, 3000, 3590]
    ),
    h("Quick evidence check", C.coral),
    para("1. Why is 'all schools should start at 8:30' an overclaim? __________________________________________", { size: 19, after: 40 }),
    para("2. Which local effect would you investigate? ______________________________________________________", { size: 19, after: 40 }),
    para("3. Which criterion should matter most? Why? _____________________________________________________", { size: 19, after: 35 }),
    h("Source trail", C.muted, { size: 19, before: 70, after: 25 }),
    para(
      "[1] Australian Government, 24-hour movement guidelines (updated 2026). [2] American Academy of Sleep Medicine, School Start Times Health Advisory and Watson et al. (2017). [3] Yip et al. (2022), Pediatrics meta-analysis. [4] Marx et al. (2022), Sleep Medicine Reviews. [5] Sleep Health Foundation, Teenage Sleep (2024). Full links are in the Teacher Guide. Facts checked 29 July 2026.",
      { size: 16, color: C.muted, line: 230, after: 0 }
    ),
  ];
  return docBase(children, "Lesson 16 Later School Start Reading Pack", "Bell-Time reading", 850);
}

function organiser() {
  const children = [
    ...titleBlock(
      "SUPPLEMENTAL LESSON 16 / POLICY VERDICT",
      "The Bell-Time Verdict Organiser",
      "Name: ______________________________  Class: __________  Date: __________"
    ),
    h("1  First reaction"),
    para("My provisional position:  [ ] support  [ ] keep current time  [ ] run a trial", { size: 20, after: 35 }),
    para("My first reason: ___________________________________________________________________________", { size: 20 }),
    h("2  Verdict test"),
    table(
      [
        row(["Rank", "Statement", "What it has / what it lacks"], [1050, 5980, 3510], { fill: C.night, color: C.white, bold: true, size: 17, tableHeader: true }),
        row(["___", "Later starts are awesome.", "______________________________"], [1050, 5980, 3510]),
        row(["___", "Schools should start later because students are tired.", "______________________________"], [1050, 5980, 3510]),
        row(["___", "The school council should trial a later secondary start because adolescent sleep and readiness outweigh manageable costs.", "______________________________"], [1050, 5980, 3510]),
      ],
      [1050, 5980, 3510]
    ),
    h("3  Evidence clock"),
    table(
      [
        row(["Evidence job", "Accurate evidence", "This matters because..."], [2200, 4450, 3890], { fill: C.blue, color: C.white, bold: true, size: 17, tableHeader: true }),
        row(["Sleep / mood", "________________________________\n________________________________", "________________________________\n________________________________"], [2200, 4450, 3890]),
        row(["Body clock / age", "________________________________\n________________________________", "________________________________\n________________________________"], [2200, 4450, 3890]),
        row(["Learning / attendance", "________________________________\n________________________________", "________________________________\n________________________________"], [2200, 4450, 3890]),
        row(["Practical / limit", "________________________________\n________________________________", "________________________________\n________________________________"], [2200, 4450, 3890]),
      ],
      [2200, 4450, 3890]
    ),
    h("4  Age-boundary check"),
    table(
      [
        row(["Claim", "Supported / inference / overclaim", "Why?"], [5200, 2700, 2640], { fill: C.night, color: C.white, bold: true, size: 16, tableHeader: true }),
        row(["Later starts were associated with longer sleep and less negative mood.", "________________", "________________________"], [5200, 2700, 2640]),
        row(["The 8:30 recommendation names middle and high schools.", "________________", "________________________"], [5200, 2700, 2640]),
        row(["Every primary school should therefore start at 8:30.", "________________", "________________________"], [5200, 2700, 2640]),
        row(["A secondary trial may be justified if local effects are checked.", "________________", "________________________"], [5200, 2700, 2640]),
      ],
      [5200, 2700, 2640]
    ),
    para("", { pageBreakBefore: true, after: 0 }),
    ...titleBlock(
      "SUPPLEMENTAL LESSON 16 / VERDICT PLAN",
      "Build the Case Before Writing",
      "Audience: principal or school council. Final length: about 90-120 words.",
      { titleSize: 29 }
    ),
    h("5  Criterion gate"),
    table(
      [
        row(["Group affected", "Criterion carrying most weight", "Provisional verdict"], [3100, 3440, 4000], { fill: C.night, color: C.white, bold: true, size: 17, tableHeader: true }),
        row(["[ ] secondary  [ ] primary\n[ ] whole school", "[ ] health  [ ] readiness\n[ ] feasibility  [ ] fairness", "The school should __________________\n________________________________"], [3100, 3440, 4000], { marginY: 115 }),
      ],
      [3100, 3440, 4000]
    ),
    para("My criterion matters most because ______________________________________________________________", { size: 19, after: 35 }),
    h("6  Evidence trial"),
    table(
      [
        row(["Evidence I will use", "What it proves for my criterion", "Age/source limit"], [3700, 3900, 2940], { fill: C.blue, color: C.white, bold: true, size: 17, tableHeader: true }),
        row(["1. ____________________________\n______________________________", "______________________________\n______________________________", "________________________\n________________________"], [3700, 3900, 2940]),
        row(["2. ____________________________\n______________________________", "______________________________\n______________________________", "________________________\n________________________"], [3700, 3900, 2940]),
      ],
      [3700, 3900, 2940]
    ),
    para("Interesting but less direct evidence: _____________________ because _______________________________", { size: 19, after: 25 }),
    h("7  Fair counterview"),
    table(
      [
        row(
          [
            [para("A thoughtful opponent would say...", { size: 17, bold: true, color: C.coral, after: 15 }), para("____________________________________________\n____________________________________________\n____________________________________________", { size: 19, after: 5 })],
            [para("My proportionate response is...", { size: 17, bold: true, color: C.mint, after: 15 }), para("____________________________________________\n____________________________________________\n____________________________________________", { size: 19, after: 5 })],
          ],
          [5270, 5270],
          { fills: [C.paleCoral, C.paleMint], marginY: 100 }
        ),
      ],
      [5270, 5270]
    ),
    h("8  Six-move policy verdict plan"),
    table(
      [
        row(["Move", "My note"], [2100, 8440], { fill: C.night, color: C.white, bold: true, size: 17, tableHeader: true }),
        row(["1  Verdict + group", "________________________________________________________________"], [2100, 8440]),
        row(["2  Criterion", "________________________________________________________________"], [2100, 8440]),
        row(["3  Evidence", "________________________________________________________________"], [2100, 8440]),
        row(["4  Why it matters", "________________________________________________________________"], [2100, 8440]),
        row(["5  Counterview + response", "________________________________________________________________"], [2100, 8440]),
        row(["6  Limit + action", "________________________________________________________________"], [2100, 8440]),
      ],
      [2100, 8440]
    ),
    h("9  Revision gate", C.coral),
    para("[ ] precise group  [ ] named criterion  [ ] two relevant evidence points  [ ] reasoning  [ ] fair counterview  [ ] age boundary", { size: 18, bold: true, after: 35 }),
    para("My summary sentence: _______________________________________________________________________", { size: 19, after: 40 }),
    para("My reasoning revision: ______________________________________________________________________", { size: 19, after: 35 }),
    h("EXIT  One-sentence verdict", C.coral),
    para("The school council should __________________ for __________________ because __________________ matters most,", { size: 20, after: 30 }),
    para("and the evidence shows ______________________________________________________________________.", { size: 20, after: 0 }),
  ];
  return docBase(children, "Lesson 16 Later School Start Verdict Organiser", "Bell-Time organiser");
}

function lucasPack() {
  const children = [
    ...titleBlock(
      "SUPPLEMENTAL LESSON 16 / ACCESSIBLE READING",
      "Should School Start Later?",
      "You may point, speak, copy, type or ask someone to write.",
      { kickerSize: 18, titleSize: 34, subtitleSize: 24 }
    ),
    table(
      [row([[para("1  SLEEP HELPS US LEARN AND FEEL WELL", { size: 24, bold: true, color: C.blue, after: 15 }), para("Children and teenagers need plenty of sleep. Teenagers often start to feel sleepy later at night because their body clocks change as they grow.", { size: 28, line: 330, after: 5 })]], [10540], { fill: C.paleBlue, borderColor: C.blue, marginY: 140 })],
      [10540]
    ),
    para("", { after: 45 }),
    table(
      [row([[para("2  LATER STARTS MAY HELP TEENAGERS", { size: 24, bold: true, color: C.mint, after: 15 }), para("Research links later school starts with longer sleep and better mood. Sleep experts recommend 8:30 am or later for middle and high schools.", { size: 28, line: 330, after: 5 })]], [10540], { fill: C.paleMint, borderColor: C.mint, marginY: 140 })],
      [10540]
    ),
    para("", { after: 45 }),
    table(
      [row([[para("3  THE RESEARCH HAS A LIMIT", { size: 24, bold: true, color: C.coral, after: 15 }), para("Most strong evidence is about teenagers. It does not prove that every primary student needs a later start.", { size: 28, line: 330, after: 5 })]], [10540], { fill: C.paleCoral, borderColor: C.coral, marginY: 140 })],
      [10540]
    ),
    para("", { after: 45 }),
    table(
      [row([[para("4  A SCHOOL MUST CHECK PRACTICAL EFFECTS", { size: 24, bold: true, color: C.gold, after: 15 }), para("A later day may change buses, family routines and sport. A school can test a change and check what happens.", { size: 28, line: 330, after: 5 })]], [10540], { fill: C.paleGold, borderColor: C.gold, marginY: 140 })],
      [10540]
    ),
    h("CHECK  Choose the accurate ideas", C.night, { size: 26, before: 90 }),
    para("[ ] The evidence is mainly about teenagers.   [ ] The evidence proves every primary school must change.", { size: 26, bold: true, after: 45 }),
    para("[ ] A trial can check results.                 [ ] A later start has no practical effects.", { size: 26, bold: true, after: 0 }),
    para("", { pageBreakBefore: true, after: 0 }),
    ...titleBlock(
      "SUPPLEMENTAL LESSON 16 / BUILD THE VERDICT",
      "Make a School-Time Decision",
      "Choose. Use evidence. Name one fair concern.",
      { kickerSize: 18, titleSize: 34, subtitleSize: 24 }
    ),
    h("1  Choose your decision", C.blue, { size: 27 }),
    table(
      [
        row(["[ ] Trial a later start for secondary students.", "[ ] Keep the current time for now."], [5270, 5270], { fills: [C.paleMint, C.paleGold], size: 26, bold: true, marginY: 155 }),
      ],
      [5270, 5270]
    ),
    h("2  Choose your strongest reason", C.blue, { size: 27 }),
    table(
      [
        row(["[ ] health and sleep", "[ ] family and transport routines"], [5270, 5270], { fills: [C.paleBlue, C.paleCoral], size: 27, bold: true, marginY: 150 }),
        row(["[ ] readiness to learn", "[ ] we need more local evidence"], [5270, 5270], { fills: [C.paleMint, C.paleGold], size: 27, bold: true, marginY: 150 }),
      ],
      [5270, 5270]
    ),
    h("3  Build the verdict", C.coral, { size: 27 }),
    table(
      [
        row(
          [[
            para("I recommend ____________________________________________________.", { size: 28, after: 80 }),
            para("My strongest reason is __________________________________________.", { size: 28, after: 80 }),
            para("The evidence says ______________________________________________.", { size: 28, after: 80 }),
            para("This matters because ____________________________________________.", { size: 28, after: 80 }),
            para("Some families may worry ________________________________________.", { size: 28, after: 80 }),
            para("This evidence is mainly about teenagers, not every primary student.", { size: 28, bold: true, after: 5 }),
          ]],
          [10540],
          { fill: C.paleGold, borderColor: C.gold, marginY: 145 }
        ),
      ],
      [10540]
    ),
    h("EXIT  Say it in one sentence", C.coral, { size: 27 }),
    para("The school should __________________________ because _________________________________________", { size: 28, after: 60 }),
    para("___________________________________________________________________________________________.", { size: 28, after: 0 }),
  ];
  return docBase(children, "Lesson 16 Later School Start Lucas Support Pack", "Bell-Time Lucas pack");
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "Lesson_16_Later_Start_Persuasive_Presentation.html"), presentationHtml(), "utf8");
  fs.writeFileSync(path.join(outDir, "Lesson_16_Later_Start_Reading_Pack.docx"), await Packer.toBuffer(readingPack()));
  fs.writeFileSync(path.join(outDir, "Lesson_16_Later_Start_Verdict_Organiser.docx"), await Packer.toBuffer(organiser()));
  fs.writeFileSync(path.join(outDir, "Lesson_16_Later_Start_Lucas_Pack.docx"), await Packer.toBuffer(lucasPack()));
  console.log("Built Lesson 16 Later School Start alternative package.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

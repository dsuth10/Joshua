(function () {
  "use strict";

  const STORAGE_KEY = "persuasion-lab-v1";
  const SCHEMA_VERSION = "1.0";

  const annotations = {
    a01: { category: "Structure", technique: "Imagined-scene hook", quote: "Imagine stepping outside the classroom and into a living laboratory.", effect: "The command places the reader inside a vivid scene before any argument begins. It makes the proposal feel possible and interesting.", audience: "School Council members are invited to picture a purposeful learning space, not just a patch of dirt.", try: "Begin a proposal with ‘Imagine…’ or ‘Picture…’ and show one specific moment." },
    a02: { category: "Structure", technique: "Thesis and preview", quote: "Our School Council should approve … because it could enrich learning, encourage healthier choices and grow a stronger school community.", effect: "The writer states the requested decision and previews three reasons. The reader knows the argument's destination and route.", audience: "The Council can quickly identify the action it is being asked to approve.", try: "Write: ‘[Audience] should [action] because [reason 1], [reason 2] and [reason 3].’" },
    a03: { category: "Cohesion", technique: "Sequencing connective", quote: "First,", effect: "This signpost marks the first main reason and creates a logical pathway through the argument.", audience: "Busy decision-makers can follow the structure at a glance.", try: "Use a connective that signals the job of your next paragraph." },
    a04: { category: "Evidence & reasoning", technique: "Authoritative evidence", quote: "24 school-garden interventions and found generally positive effects across health and wellbeing outcomes", effect: "A specific number and a research synthesis give the claim weight. The qualification ‘generally’ avoids exaggeration.", audience: "The Council receives evidence broad enough to justify a careful trial.", try: "Name the source type, include a precise detail and explain what it supports." },
    a05: { category: "Language", technique: "Metaphor and contrast", quote: "A garden is not a decoration; it is an outdoor classroom with soil under its fingernails.", effect: "The contrast rejects a shallow view of the garden. Personification and imagery make practical learning memorable.", audience: "The Council is encouraged to view the garden as curriculum infrastructure.", try: "Use ‘not just X; it is Y’ to redefine your proposal." },
    a06: { category: "Cohesion", technique: "Additive connective", quote: "Just as importantly,", effect: "The phrase links a second reason to the first while giving it equal value.", audience: "It shows the Council that the proposal has more than one educational benefit.", try: "Connect your second reason with ‘Just as importantly’ when it deserves equal weight." },
    a07: { category: "Language", technique: "Cautious claim", quote: "we should not promise a miracle harvest", effect: "The writer openly limits the claim. The light metaphor keeps the caution engaging.", audience: "Honesty makes the proposal sound measured and trustworthy.", try: "Name what your idea cannot guarantee before explaining what it could achieve." },
    a08: { category: "Language", technique: "Tricolon", quote: "plant, tend and taste", effect: "Three parallel verbs create rhythm and compress a process into a memorable pattern.", audience: "The activities sound active, achievable and student-centred.", try: "Build a three-part list using words of the same grammatical type." },
    a09: { category: "Cohesion", technique: "Counterargument signal", quote: "Of course,", effect: "This phrase announces that the writer is turning towards possible objections.", audience: "The Council sees that concerns have not been ignored.", try: "Open a counterargument with ‘Of course,’ or ‘Some may reasonably argue…’" },
    a10: { category: "Language", technique: "Evaluative language", quote: "These are sensible concerns", effect: "Calling the concerns ‘sensible’ treats opposing views with respect instead of dismissing them.", audience: "Families and Council members are more likely to keep listening when their worries are validated.", try: "Describe an objection fairly before responding to it." },
    a11: { category: "Evidence & reasoning", technique: "Measured reasoning", quote: "recording participation and asking students and families for feedback", effect: "The writer proposes observable evidence for judging success, turning enthusiasm into a testable plan.", audience: "The Council can see how it will make a later decision responsibly.", try: "Explain what could be measured during a trial and who should provide feedback." },
    a12: { category: "Cohesion", technique: "Concluding connective", quote: "Therefore,", effect: "The connective signals that the final recommendation follows from the reasons and evidence already presented.", audience: "The Council is guided from discussion to decision.", try: "Use ‘Therefore’ only when your conclusion clearly grows from earlier reasons." },
    a13: { category: "Language", technique: "Metaphor with cautious modality", quote: "It could, however, open a green door", effect: "‘Could’ keeps the claim honest, while the metaphor suggests access to a new opportunity. ‘However’ contrasts this benefit with the limitation before it.", audience: "The proposal sounds hopeful without claiming certainty.", try: "Pair a cautious modal verb with one fresh image." },
    a14: { category: "Language", technique: "Repetition and tricolon", quote: "grow knowledge, grow confidence and grow a healthier community", effect: "Repeating ‘grow’ links the literal garden to three wider benefits. The three-part pattern adds rhythm and emphasis.", audience: "The Council is left with a compact summary of the proposal's value.", try: "Repeat one key verb at the start of three balanced phrases." },
    a15: { category: "Structure", technique: "Call to action", quote: "Give our students the chance to plant the first seed.", effect: "The imperative asks for action now, and the final metaphor connects approval with the beginning of change.", audience: "Responsibility is placed directly with the School Council.", try: "End with an active verb, the people who benefit and a final image connected to your topic." }
  };

  const practiceChecks = [
    { id: "p1", prompt: "Which sentence is the thesis?", options: ["Imagine stepping outside the classroom and into a living laboratory.", "Our School Council should approve a small kitchen garden because it could enrich learning, encourage healthier choices and grow a stronger school community.", "These are sensible concerns."], answer: 1, hint: "Find the sentence that names the audience, the action and three reasons.", explanation: "The thesis asks the School Council to approve an action and previews the three main reasons." },
    { id: "p2", prompt: "What makes the research claim appropriately cautious?", options: ["It says every program succeeded.", "It uses ‘generally’ and admits that results differed.", "It avoids naming the number of interventions."], answer: 1, hint: "Look for words that limit the strength of the claim.", explanation: "‘Generally’ and ‘results differed’ show the evidence is promising, not a guarantee." },
    { id: "p3", prompt: "What is the main effect of ‘plant, tend and taste’?", options: ["It is a rhetorical question.", "It creates a rhythmic three-part list of student actions.", "It proves that vegetables improve health."], answer: 1, hint: "Count the parallel verbs.", explanation: "The tricolon uses three parallel verbs to make the process active and memorable." },
    { id: "p4", prompt: "Why does the writer include cost, maintenance and allergy concerns?", options: ["To abandon the proposal", "To show awareness of objections before offering a practical rebuttal", "To add an unrelated paragraph"], answer: 1, hint: "Notice what the writer does immediately after naming the concerns.", explanation: "A fair counterargument builds credibility; the small-trial plan then rebuts the concern." },
    { id: "p5", prompt: "Which connective best signals that a recommendation follows from earlier reasons?", options: ["Of course", "Just as importantly", "Therefore"], answer: 2, hint: "Look at the opening word of the conclusion.", explanation: "‘Therefore’ shows that the final call to action is the logical result of the argument." }
  ];

  const sectionData = [
    { id: "s1", title: "Section 1 · Purpose and structure", subtitle: "Q1–Q4: Trace the argument's design", questions: [
      { id: "q1", prompt: "Who is the intended audience? What decision does the writer want this audience to make?", type: "q1" },
      { id: "q2", prompt: "Copy the thesis statement from the opening paragraph. Then restate it in your own words.", hint: "Look for the sentence that names the proposed action and the three main reasons.", type: "q2" },
      { id: "q3", prompt: "How does the opening scene — “Picture the library after lunch” — work as a hook? Explain what the reader is encouraged to imagine or feel.", type: "text", rows: 4 },
      { id: "q4", prompt: "The argument is divided by headings. List the four main stages and explain how this order helps the argument build.", hint: "Use headings beginning with Confidence, Calm minds, Safety and Start small.", type: "q4" }
    ]},
    { id: "s2", title: "Section 2 · Persuasive language", subtitle: "Q5–Q9: Notice the writer's choices", questions: [
      { id: "q5", prompt: "The opening describes the dog as offering “no frown, no interruption, no judgement.” Name the technique and explain the effect of this three-part pattern.", type: "choiceText", options: ["Rhetorical question", "Tricolon (rule of three)", "Simile", "Statistics"], answer: "Tricolon (rule of three)" },
      { id: "q6", prompt: "Explain the figurative comparison: “reading aloud can feel like walking onto a stage without rehearsing.” What does this help the audience understand about a hesitant reader?", type: "text", rows: 4 },
      { id: "q7", prompt: "Find two examples of evaluative or emotive vocabulary. For each example, explain whether it makes the proposal sound valuable, safe or necessary.", type: "fields", fields: ["Example 1 and its effect", "Example 2 and its effect"] },
      { id: "q8", prompt: "Find one example of inclusive language, such as “our,” “we” or “let us.” How does it make the School Council and school community feel involved?", type: "choiceText", options: ["Our school should run a one-term Storytime Dog trial", "The study was small", "some families may worry", "daily practice"], answer: "Our school should run a one-term Storytime Dog trial" },
      { id: "q9", prompt: "The writer often uses cautious modal language such as “could” and “may.” Find three examples. Why is cautious language more trustworthy here than claiming the program “will” solve every problem?", type: "q9" }
    ]},
    { id: "s3", title: "Section 3 · Evidence and reasoning", subtitle: "Q10–Q13: Test how the case is built", questions: [
      { id: "q10", prompt: "Identify two authoritative sources used in the reading. What claim does each source support?", type: "q10" },
      { id: "q11", prompt: "Why does the writer admit that the 2022 study was small and that the review found limited evidence? Explain how this concession can strengthen, rather than weaken, the writer's credibility.", type: "text", rows: 5 },
      { id: "q12", prompt: "Break down the paragraph beginning “Of course, some families may worry...”", type: "q12" },
      { id: "q13", prompt: "What job does each connective perform: “First,” “Just as importantly,” “Of course,” and “Therefore”? Explain how these words guide the reader through the argument.", type: "q13" }
    ]},
    { id: "s4", title: "Section 4 · Craft and judgement", subtitle: "Q14–Q17: Explain, evaluate and create", questions: [
      { id: "q14", prompt: "Compare the short sentence “That honest caution matters.” with one longer complex sentence in the same paragraph. How does varying sentence length control emphasis and pace?", type: "text", rows: 5 },
      { id: "q15", prompt: "The conclusion says: “Let us give them a calm listener, a fair chance and one more reason to turn the page.” Identify two persuasive techniques in this sentence and explain why it is an effective final appeal.", type: "text", rows: 5 },
      { id: "q16", prompt: "Which persuasive technique is most effective in this reading? Support your judgement with a quotation and explain its effect on the School Council.", hint: "technique → evidence → effect → audience/purpose.", type: "text", rows: 6 },
      { id: "q17", prompt: "Rewrite the bare assertion “A Storytime Dog is a good idea” so that it sounds like it belongs in this A-standard exemplar. Include precise vocabulary, a reason and appropriately cautious modality.", type: "text", rows: 5, stretch: true }
    ]}
  ];

  const defaultState = () => ({
    schemaVersion: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "learn",
    fontScale: 1,
    annotationsVisited: [],
    practice: {},
    student: { name: "", className: "", date: "" },
    responses: {}
  });

  let state = defaultState();
  let storageAvailable = true;
  let saveTimer;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function testStorage() {
    try { localStorage.setItem("__persuasion_test__", "1"); localStorage.removeItem("__persuasion_test__"); }
    catch (error) { storageAvailable = false; document.getElementById("storage-warning").hidden = false; }
  }

  function loadState() {
    if (!storageAvailable) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.schemaVersion === SCHEMA_VERSION) state = Object.assign(defaultState(), saved);
    } catch (error) {
      document.getElementById("storage-warning").hidden = false;
    }
  }

  function saveState(immediate) {
    state.updatedAt = new Date().toISOString();
    const status = document.getElementById("save-status");
    status.textContent = storageAvailable ? "Saving…" : "Not saved";
    clearTimeout(saveTimer);
    const commit = () => {
      if (!storageAvailable) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); status.textContent = "Saved on this device"; }
      catch (error) { storageAvailable = false; document.getElementById("storage-warning").hidden = false; status.textContent = "Not saved"; }
    };
    if (immediate) commit(); else saveTimer = setTimeout(commit, 350);
  }

  function optionMarkup(name, value, label, checked, type) {
    return `<label class="choice-label"><input type="${type || "radio"}" name="${name}" value="${escapeHtml(value)}" ${checked ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
  }

  function renderPractice() {
    const root = document.getElementById("practice-list");
    root.innerHTML = practiceChecks.map((item, index) => {
      const saved = state.practice[item.id] || {};
      const feedback = saved.correct ? `<p class="feedback correct" role="status"><strong>Correct.</strong> ${escapeHtml(item.explanation)}</p>` : "";
      return `<section class="practice-item" data-practice="${item.id}">
        <span class="question-number">Check ${index + 1} of 5 ${saved.correct ? "· Complete" : ""}</span>
        <h3>${escapeHtml(item.prompt)}</h3>
        <div class="option-grid">${item.options.map((opt, optIndex) => optionMarkup(`practice-${item.id}`, String(optIndex), opt, Number(saved.selected) === optIndex)).join("")}</div>
        <div class="check-row"><button type="button" class="primary-action practice-check">Check answer</button><button type="button" class="hint-button practice-hint">Show a hint</button></div>
        <div class="practice-feedback">${feedback}</div>
      </section>`;
    }).join("");
    updateProgress();
  }

  function textArea(id, label, rows, value) {
    return `<label>${escapeHtml(label)}<textarea data-response-field="${id}" rows="${rows || 4}">${escapeHtml(value || "")}</textarea></label>`;
  }

  function selectControl(id, label, options, value) {
    return `<label>${escapeHtml(label)}<select data-response-field="${id}"><option value="">Choose…</option>${options.map(opt => `<option value="${escapeHtml(opt)}" ${value === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`).join("")}</select></label>`;
  }

  function renderQuestionControl(q) {
    const r = state.responses[q.id] || {};
    if (q.type === "text") return `<div class="response-group">${textArea("text", "Your response", q.rows, r.text)}</div>`;
    if (q.type === "fields") return `<div class="response-group">${q.fields.map((field, index) => textArea(`field${index + 1}`, field, 3, r[`field${index + 1}`])).join("")}</div>`;
    if (q.type === "q1") return `<div class="response-group">${selectControl("audience", "Intended audience", ["School Council", "Local dog owners", "The researchers", "All primary schools"], r.audience)}${selectControl("decision", "Decision requested", ["Approve a one-term, opt-in Storytime Dog trial", "Buy a dog for every classroom", "Replace reading lessons with dog visits", "Close the library after lunch"], r.decision)}</div>`;
    if (q.type === "q2") return `<div class="response-group">${selectControl("thesis", "Identify the thesis statement", ["Picture the library after lunch.", "Our school should run a one-term Storytime Dog trial because it could strengthen reading confidence, support wellbeing and help more students feel that the library belongs to them.", "A calm dog changes the audience.", "That honest caution matters."], r.thesis)}${textArea("paraphrase", "Restate it in your own words", 4, r.paraphrase)}</div>`;
    if (q.type === "choiceText") return `<div class="response-group">${selectControl("choice", q.id === "q8" ? "Select inclusive-language evidence" : "Select the technique", q.options, r.choice)}${textArea("effect", "Explain the effect", 4, r.effect)}</div>`;
    if (q.type === "q4") {
      const headings = ["Confidence grows through practice", "Calm minds are ready to learn", "Safety must come first", "Start small. Measure carefully. Decide together."];
      return `<div class="response-group"><div class="match-grid">${[1,2,3,4].map(n => `<div class="match-row"><span>Stage ${n}</span>${selectControl(`order${n}`, `Heading for stage ${n}`, headings, r[`order${n}`])}</div>`).join("")}</div>${textArea("explanation", "How does this order help the argument build?", 4, r.explanation)}</div>`;
    }
    if (q.type === "q9") {
      const opts = ["it could strengthen reading confidence", "some families may worry", "A Storytime Dog could make reading feel safer", "A Storytime Dog will replace skilled teaching"];
      return `<fieldset class="response-group"><legend>Select three examples of cautious modality</legend><div class="option-grid">${opts.map(opt => optionMarkup(`q9-modals`, opt, opt, (r.modals || []).includes(opt), "checkbox")).join("")}</div>${textArea("explanation", "Why is this more trustworthy?", 4, r.explanation)}</fieldset>`;
    }
    if (q.type === "q10") return `<div class="response-group match-grid">
      <div class="match-row"><span>2022 study of 24 readers</span>${selectControl("source1", "Claim supported", ["Improved reading performance, particularly after reading to a dog", "Safety and risk-management procedures", "Every child will become fluent"], r.source1)}</div>
      <div class="match-row"><span>2016 systematic review</span>${selectControl("source2", "Claim supported", ["Promising links to motivation, confidence and reduced anxiety", "A guarantee of improved test scores", "The cost of a trained handler"], r.source2)}</div>
    </div>`;
    if (q.type === "q12") {
      const roles = ["Counterargument or concern", "Evidence used to respond", "Rebuttal: why the proposal can still work"];
      const statements = ["Some families may worry about allergies, fear or distraction.", "NSW guidance recommends family notification, handwashing, a handler and a risk assessment.", "Clear boundaries, alternatives and short sessions can make safety and inclusion guide the trial."];
      return `<div class="response-group match-grid">${statements.map((statement, i) => `<div class="match-row"><span>${escapeHtml(statement)}</span>${selectControl(`role${i+1}`, "Classify this part", roles, r[`role${i+1}`])}</div>`).join("")}</div>`;
    }
    if (q.type === "q13") {
      const functions = ["Introduces the first reason", "Adds an equally important reason", "Signals a counterargument", "Draws the conclusion or recommendation"];
      return `<div class="response-group match-grid">${["First", "Just as importantly", "Of course", "Therefore"].map((word, i) => `<div class="match-row"><span>${word}</span>${selectControl(`connective${i+1}`, `Function of ${word}`, functions, r[`connective${i+1}`])}</div>`).join("")}</div>`;
    }
    return "";
  }

  function renderQuestions() {
    const root = document.getElementById("question-sections");
    root.innerHTML = sectionData.map((section, sectionIndex) => `<section class="question-section" data-section-id="${section.id}">
      <button type="button" class="section-toggle" aria-expanded="${sectionIndex === 0 ? "true" : "false"}" aria-controls="${section.id}-body"><span><strong>${escapeHtml(section.title)}</strong><small>${escapeHtml(section.subtitle)}</small></span><span class="chevron" aria-hidden="true">⌄</span></button>
      <div class="section-body" id="${section.id}-body" ${sectionIndex === 0 ? "" : "hidden"}>${section.questions.map(q => `<section class="assessment-question" data-question="${q.id}">
        <span class="question-number">${q.id.toUpperCase()} ${q.stretch ? '<span class="stretch-tag">STRETCH · OPTIONAL</span>' : ""}</span><span class="completion-mark" aria-label="Attempted" hidden>✓</span>
        <h4>${q.prompt}</h4>${renderQuestionControl(q)}
        ${q.hint ? `<p class="question-hint">Hint: ${escapeHtml(q.hint)}</p>` : ""}
        ${isStructured(q) ? `<button type="button" class="secondary-action structured-check">Check selections</button>${savedStructuredFeedback(q)}` : ""}
      </section>`).join("")}</div>
    </section>`).join("");
    updateQuestionCompletionMarks();
    updateProgress();
  }

  function isStructured(q) { return ["q1", "q2", "q4", "choiceText", "q9", "q10", "q12", "q13"].includes(q.type); }
  function savedStructuredFeedback(q) {
    const response = state.responses[q.id] || {};
    if (!response.checkStatus || response.checkStatus === "not_checked") return '<p class="structured-feedback" role="status"></p>';
    if (response.checkStatus === "correct") return '<p class="structured-feedback correct" role="status">✓ Selections checked: correct.</p>';
    return `<p class="structured-feedback incorrect" role="status">✗ Check again.${response.textLocationHint ? ` Text-location hint: ${escapeHtml(response.textLocationHint)}` : ""}</p>`;
  }
  function allQuestions() { return sectionData.flatMap(section => section.questions); }

  function questionComplete(q) {
    const r = state.responses[q.id] || {};
    const filled = key => String(r[key] || "").trim().length > 0;
    if (q.type === "text") return filled("text");
    if (q.type === "fields") return q.fields.every((_, i) => filled(`field${i+1}`));
    if (q.type === "q1") return filled("audience") && filled("decision");
    if (q.type === "q2") return filled("thesis") && filled("paraphrase");
    if (q.type === "choiceText") return filled("choice") && filled("effect");
    if (q.type === "q4") return [1,2,3,4].every(n => filled(`order${n}`)) && filled("explanation");
    if (q.type === "q9") return (r.modals || []).length >= 3 && filled("explanation");
    if (q.type === "q10") return filled("source1") && filled("source2");
    if (q.type === "q12") return [1,2,3].every(n => filled(`role${n}`));
    if (q.type === "q13") return [1,2,3,4].every(n => filled(`connective${n}`));
    return false;
  }

  function checkStructured(q) {
    const r = state.responses[q.id] || {};
    let correct = false;
    let hint = "Return to the relevant paragraph and compare each selection with the writer's exact words.";
    if (q.id === "q1") { correct = r.audience === "School Council" && r.decision === "Approve a one-term, opt-in Storytime Dog trial"; hint = "Look at the subtitle, opening thesis and final recommendation."; }
    if (q.id === "q2") { correct = r.thesis === "Our school should run a one-term Storytime Dog trial because it could strengthen reading confidence, support wellbeing and help more students feel that the library belongs to them."; hint = "The thesis is the final sentence of the opening paragraph."; }
    if (q.id === "q4") { const expected = ["Confidence grows through practice", "Calm minds are ready to learn", "Safety must come first", "Start small. Measure carefully. Decide together."]; correct = expected.every((v,i) => r[`order${i+1}`] === v); hint = "Scan the four teal headings from top to bottom."; }
    if (q.id === "q5" || q.id === "q8") { correct = r.choice === q.answer; hint = q.id === "q5" ? "Count the repeated grammatical parts in the opening paragraph." : "Look in the opening and conclusion for words that include the whole school community."; }
    if (q.id === "q9") { const expected = ["it could strengthen reading confidence", "some families may worry", "A Storytime Dog could make reading feel safer"]; correct = expected.every(v => (r.modals || []).includes(v)) && !(r.modals || []).includes("A Storytime Dog will replace skilled teaching"); hint = "Search the opening, ‘Calm minds’ paragraph and counterargument for ‘could’ or ‘may’."; }
    if (q.id === "q10") { correct = r.source1 === "Improved reading performance, particularly after reading to a dog" && r.source2 === "Promising links to motivation, confidence and reduced anxiety"; hint = "Follow evidence-note numbers 1 and 2 back to the sentences that contain them."; }
    if (q.id === "q12") { correct = r.role1 === "Counterargument or concern" && r.role2 === "Evidence used to respond" && r.role3 === "Rebuttal: why the proposal can still work"; hint = "Read the ‘Safety must come first’ paragraph in three moves: worry → guidance → workable conditions."; }
    if (q.id === "q13") { const e = ["Introduces the first reason", "Adds an equally important reason", "Signals a counterargument", "Draws the conclusion or recommendation"]; correct = e.every((v,i) => r[`connective${i+1}`] === v); hint = "Find each connective at the beginning of its paragraph and ask what that paragraph does."; }
    r.checkStatus = correct ? "correct" : "incorrect";
    r.textLocationHint = hint;
    r.attemptCount = (r.attemptCount || 0) + 1;
    r.lastCheckedAt = new Date().toISOString();
    state.responses[q.id] = r;
    saveState();
    return { correct, hint };
  }

  function updateQuestionCompletionMarks() {
    allQuestions().forEach(q => {
      const node = document.querySelector(`[data-question="${q.id}"]`);
      if (node) node.querySelector(".completion-mark").hidden = !questionComplete(q);
    });
  }

  function updateProgress() {
    const annotationCount = state.annotationsVisited.length;
    document.getElementById("annotation-count").textContent = annotationCount;
    document.querySelector('[data-stage="learn"]').classList.toggle("is-complete", annotationCount === 15);
    const practiceCount = practiceChecks.filter(item => state.practice[item.id] && state.practice[item.id].correct).length;
    document.getElementById("practice-count").textContent = practiceCount;
    document.getElementById("practice-ring").style.setProperty("--value", practiceCount * 20);
    document.querySelector('[data-stage="practice"]').classList.toggle("is-complete", practiceCount === 5);
    const applyTab = document.querySelector('[data-stage="apply"]');
    applyTab.dataset.locked = practiceCount === 5 ? "false" : "true";
    applyTab.setAttribute("aria-disabled", practiceCount === 5 ? "false" : "true");
    document.getElementById("go-apply").disabled = practiceCount !== 5;
    document.getElementById("apply-lock-note").innerHTML = practiceCount === 5 ? '<span aria-hidden="true">✓</span> Apply is unlocked.' : '<span aria-hidden="true">⌁</span> Apply is locked until all checks are correct.';
    const core = allQuestions().filter(q => !q.stretch);
    const assessmentCount = core.filter(questionComplete).length;
    document.getElementById("assessment-count").textContent = assessmentCount;
    applyTab.classList.toggle("is-complete", assessmentCount === 16);
  }

  function showStage(stage, force) {
    if (stage === "apply" && document.querySelector('[data-stage="apply"]').dataset.locked === "true" && !force) {
      showStage("practice"); return;
    }
    document.querySelectorAll("[data-stage-panel]").forEach(panel => { const active = panel.dataset.stagePanel === stage; panel.hidden = !active; panel.classList.toggle("is-active", active); });
    document.querySelectorAll(".stage-tab").forEach(tab => { const active = tab.dataset.stage === stage; tab.classList.toggle("is-active", active); if (active) tab.setAttribute("aria-current", "step"); else tab.removeAttribute("aria-current"); });
    state.currentStage = stage;
    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showAnnotation(id, moveFocus) {
    const item = annotations[id];
    if (!item) return;
    document.querySelectorAll(".annotation").forEach(button => button.classList.toggle("is-selected", button.dataset.annotation === id));
    if (!state.annotationsVisited.includes(id)) state.annotationsVisited.push(id);
    document.querySelector(`[data-annotation="${id}"]`).classList.add("is-visited");
    const root = document.getElementById("analysis-content");
    root.innerHTML = `<article class="analysis-card"><span class="technique-label">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.technique)}</h3><blockquote class="analysis-quote">“${escapeHtml(item.quote)}”</blockquote><h4>Effect on the reader</h4><p>${escapeHtml(item.effect)}</p><h4>Audience connection</h4><p>${escapeHtml(item.audience)}</p><div class="try-box"><h4>Try this yourself</h4><p>${escapeHtml(item.try)}</p></div></article>`;
    if (moveFocus && window.matchMedia("(max-width: 900px)").matches) root.focus();
    updateProgress(); saveState();
  }

  function syncIdentity() {
    document.getElementById("student-name").value = state.student.name || "";
    document.getElementById("student-class").value = state.student.className || "";
    document.getElementById("student-date").value = state.student.date || "";
  }

  function applyFontScale() { document.documentElement.style.setProperty("--reading-scale", state.fontScale || 1); }

  function captureQuestionField(target) {
    const questionNode = target.closest("[data-question]");
    if (!questionNode) return;
    const id = questionNode.dataset.question;
    const r = state.responses[id] || {};
    if (target.type === "checkbox") {
      r.modals = Array.from(questionNode.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    } else r[target.dataset.responseField] = target.value;
    state.responses[id] = r;
    updateQuestionCompletionMarks(); updateProgress(); saveState();
  }

  function getExportData() {
    const coreCount = allQuestions().filter(q => !q.stretch && questionComplete(q)).length;
    return {
      schemaVersion: SCHEMA_VERSION,
      exportType: "literacy_persuasive_techniques_student_response",
      activity: { id: "interactive-persuasive-reading-lab", title: "Interactive Persuasive Reading Lab", unit: "English Unit 3", assessmentText: "Let Every Reader Find Their Voice" },
      student: { name: state.student.name, class: state.student.className, date: state.student.date },
      timestamps: { startedAt: state.createdAt, updatedAt: state.updatedAt, exportedAt: new Date().toISOString() },
      completion: { coreQuestionsAttempted: coreCount, coreQuestionsTotal: 16, coreComplete: coreCount === 16, stretchAttempted: questionComplete(allQuestions().find(q => q.id === "q17")) },
      learning: { annotationsVisited: state.annotationsVisited.slice(), annotationCount: state.annotationsVisited.length, practice: practiceChecks.map(item => ({ id: item.id, correct: !!state.practice[item.id]?.correct, attempts: state.practice[item.id]?.attempts || 0 })) },
      sections: sectionData.map(section => ({ id: section.id, title: section.title, questions: section.questions.map(q => ({ id: q.id, prompt: q.prompt, optional: !!q.stretch, complete: questionComplete(q), response: state.responses[q.id] || {}, structured: isStructured(q) ? { selections: state.responses[q.id] || {}, checkStatus: state.responses[q.id]?.checkStatus || "not_checked", attemptCount: state.responses[q.id]?.attemptCount || 0 } : null })) }))
    };
  }

  function identityReady() {
    const missing = [];
    if (!state.student.name.trim()) missing.push("name");
    if (!state.student.className.trim()) missing.push("class");
    if (!state.student.date) missing.push("date");
    const message = document.getElementById("export-message");
    if (missing.length) { message.textContent = `Add your ${missing.join(", ")} before exporting.`; document.getElementById("student-name").closest(".identity-card").scrollIntoView({ behavior: "smooth", block: "center" }); return false; }
    message.textContent = ""; return true;
  }

  function download(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function safeFilename() { return (state.student.name || "student").trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "student"; }

  function exportJson() {
    if (!identityReady()) return;
    download(JSON.stringify(getExportData(), null, 2), `${safeFilename()}-persuasion-lab.json`, "application/json");
    document.getElementById("export-message").textContent = "JSON backup downloaded.";
  }

  function responseSummary(q, response) {
    const ignored = new Set(["checkStatus", "attemptCount", "lastCheckedAt"]);
    const entries = Object.entries(response || {}).filter(([key]) => !ignored.has(key));
    if (!entries.length) return "<p><em>No response yet.</em></p>";
    return entries.map(([key, value]) => `<p><strong>${escapeHtml(key.replace(/([A-Z0-9])/g, " $1").replace(/^./, c => c.toUpperCase()))}:</strong> ${escapeHtml(Array.isArray(value) ? value.join("; ") : value) || "—"}</p>`).join("");
  }

  function exportHtml() {
    if (!identityReady()) return;
    const data = getExportData();
    const sections = sectionData.map(section => `<section><h2>${escapeHtml(section.title)}</h2>${section.questions.map(q => { const r = state.responses[q.id] || {}; return `<article><h3>${q.id.toUpperCase()}${q.stretch ? " · Stretch (optional)" : ""}</h3><p class="prompt">${escapeHtml(q.prompt)}</p>${responseSummary(q, r)}${isStructured(q) ? `<p class="check"><strong>Structured check:</strong> ${escapeHtml(r.checkStatus || "not checked")} · attempts ${r.attemptCount || 0}</p>` : ""}</article>`; }).join("")}</section>`).join("");
    const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Persuasion Lab response — ${escapeHtml(state.student.name)}</title><style>body{max-width:900px;margin:36px auto;padding:0 24px;color:#203034;font:16px/1.5 Arial,sans-serif}header{border-bottom:5px solid #d9654b;padding-bottom:16px}h1,h2,h3{color:#173f43}h1{font-family:Georgia,serif}h2{margin-top:34px;border-bottom:2px solid #0d5c63;padding-bottom:5px}article{break-inside:avoid;border-bottom:1px solid #ccd8d6;padding:10px 0}.prompt{font-weight:700}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.check{color:#657478;font-size:14px}.print{padding:10px 14px;background:#0d5c63;color:#fff;border:0}@media print{.print{display:none}body{margin:0}}</style></head><body><button class="print" onclick="window.print()">Print or save as PDF</button><header><p>English Unit 3</p><h1>Persuasive Reading Lab — Student Response Summary</h1><div class="meta"><p><strong>Name</strong><br>${escapeHtml(state.student.name)}</p><p><strong>Class</strong><br>${escapeHtml(state.student.className)}</p><p><strong>Date</strong><br>${escapeHtml(state.student.date)}</p></div><p><strong>Completion:</strong> ${data.completion.coreQuestionsAttempted}/16 core questions attempted${data.completion.stretchAttempted ? "; stretch attempted" : ""}.</p><p><strong>Learning progress:</strong> ${data.learning.annotationCount}/15 annotations explored; ${data.learning.practice.filter(p => p.correct).length}/5 practice checks correct.</p></header>${sections}<footer><p>Exported ${escapeHtml(new Date().toLocaleString("en-AU"))}. Written responses require teacher review; this summary does not report an automated final grade.</p></footer></body></html>`;
    download(html, `${safeFilename()}-persuasion-response-summary.html`, "text/html");
    document.getElementById("export-message").textContent = "Response summary downloaded. Open it to print or save as PDF.";
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.schemaVersion !== SCHEMA_VERSION || data.exportType !== "literacy_persuasive_techniques_student_response") throw new Error("This is not a compatible Persuasive Reading Lab export.");
        const next = defaultState();
        next.student = { name: data.student?.name || "", className: data.student?.class || "", date: data.student?.date || "" };
        next.createdAt = data.timestamps?.startedAt || next.createdAt;
        next.annotationsVisited = (data.learning?.annotationsVisited || []).filter(id => annotations[id]);
        (data.learning?.practice || []).forEach(item => { next.practice[item.id] = { correct: !!item.correct, attempts: item.attempts || 0 }; });
        (data.sections || []).forEach(section => (section.questions || []).forEach(question => { next.responses[question.id] = question.response || question.structured?.selections || {}; }));
        next.currentStage = "apply";
        state = next; saveState(true); initialiseUi(); showStage("apply", true); document.getElementById("export-message").textContent = "Previous work imported successfully.";
      } catch (error) { document.getElementById("export-message").textContent = error.message || "The JSON file could not be imported."; }
      document.getElementById("import-json").value = "";
    };
    reader.readAsText(file);
  }

  function bindEvents() {
    document.addEventListener("click", event => {
      const annotation = event.target.closest("[data-annotation]"); if (annotation) showAnnotation(annotation.dataset.annotation, true);
      const tab = event.target.closest(".stage-tab"); if (tab) showStage(tab.dataset.stage);
      const go = event.target.closest("[data-goto]"); if (go) showStage(go.dataset.goto);
      const toggle = event.target.closest(".section-toggle"); if (toggle) { const expanded = toggle.getAttribute("aria-expanded") === "true"; toggle.setAttribute("aria-expanded", String(!expanded)); document.getElementById(toggle.getAttribute("aria-controls")).hidden = expanded; }
      const practiceButton = event.target.closest(".practice-check");
      if (practiceButton) {
        const node = practiceButton.closest("[data-practice]"); const item = practiceChecks.find(p => p.id === node.dataset.practice); const selected = node.querySelector("input:checked"); const feedback = node.querySelector(".practice-feedback");
        if (!selected) { feedback.innerHTML = '<p class="feedback incorrect" role="status">Choose an answer first.</p>'; return; }
        const saved = state.practice[item.id] || {}; saved.selected = Number(selected.value); saved.attempts = (saved.attempts || 0) + 1; saved.correct = saved.selected === item.answer; state.practice[item.id] = saved;
        feedback.innerHTML = saved.correct ? `<p class="feedback correct" role="status"><strong>Correct.</strong> ${escapeHtml(item.explanation)}</p>` : `<p class="feedback incorrect" role="status"><strong>Not yet.</strong> Try again or use the hint. Look back at the highlighted sentence.</p>`;
        if (saved.correct) node.querySelector(".question-number").textContent = `Check ${practiceChecks.indexOf(item)+1} of 5 · Complete`;
        updateProgress(); saveState();
      }
      const hintButton = event.target.closest(".practice-hint"); if (hintButton) { const node = hintButton.closest("[data-practice]"); const item = practiceChecks.find(p => p.id === node.dataset.practice); node.querySelector(".practice-feedback").innerHTML = `<p class="feedback hint" role="status"><strong>Hint:</strong> ${escapeHtml(item.hint)}</p>`; }
      const structured = event.target.closest(".structured-check"); if (structured) { const node = structured.closest("[data-question]"); const q = allQuestions().find(item => item.id === node.dataset.question); const result = checkStructured(q); const fb = node.querySelector(".structured-feedback"); fb.className = `structured-feedback ${result.correct ? "correct" : "incorrect"}`; fb.textContent = result.correct ? "✓ Selections checked: correct." : `✗ Check again. Text-location hint: ${result.hint}`; }
    });

    document.addEventListener("input", event => {
      if (event.target.matches("[data-response-field], [data-question] input[type=checkbox]")) captureQuestionField(event.target);
      if (event.target.id === "student-name") state.student.name = event.target.value;
      if (event.target.id === "student-class") state.student.className = event.target.value;
      if (event.target.id === "student-date") state.student.date = event.target.value;
      if (["student-name", "student-class", "student-date"].includes(event.target.id)) saveState();
    });
    document.addEventListener("change", event => { if (event.target.matches("[data-response-field], [data-question] input[type=checkbox]")) captureQuestionField(event.target); });
    document.getElementById("go-practice").addEventListener("click", () => showStage("practice"));
    document.getElementById("go-apply").addEventListener("click", () => showStage("apply"));
    document.querySelectorAll("[data-font]").forEach(button => button.addEventListener("click", () => { const action = button.dataset.font; state.fontScale = action === "reset" ? 1 : Math.min(1.3, Math.max(.9, (state.fontScale || 1) + (action === "larger" ? .1 : -.1))); applyFontScale(); saveState(); }));
    document.getElementById("export-json").addEventListener("click", exportJson);
    document.getElementById("export-html").addEventListener("click", exportHtml);
    document.getElementById("import-json").addEventListener("change", event => { if (event.target.files[0]) importJson(event.target.files[0]); });
    document.getElementById("reset-all").addEventListener("click", () => { if (window.confirm("Reset all annotations, practice checks, answers and student details? This cannot be undone unless you exported a JSON backup.")) { if (storageAvailable) localStorage.removeItem(STORAGE_KEY); state = defaultState(); initialiseUi(); showStage("learn", true); document.getElementById("export-message").textContent = "All work has been reset."; } });
  }

  function initialiseUi() {
    applyFontScale();
    document.querySelectorAll(".annotation").forEach(button => { button.classList.toggle("is-visited", state.annotationsVisited.includes(button.dataset.annotation)); button.classList.remove("is-selected"); });
    document.getElementById("analysis-content").innerHTML = '<div class="analysis-empty"><span class="magnifier" aria-hidden="true">⌕</span><h3>Select a marked phrase</h3><p>Start anywhere. Your discoveries will be remembered.</p></div>';
    renderPractice(); renderQuestions(); syncIdentity(); updateProgress();
  }

  testStorage(); loadState(); initialiseUi(); bindEvents();
  const savedStage = state.currentStage === "apply" && document.querySelector('[data-stage="apply"]').dataset.locked === "true" ? "practice" : state.currentStage;
  showStage(savedStage || "learn");
  window.PersuasionLab = { STORAGE_KEY, SCHEMA_VERSION, annotations, practiceChecks, sectionData, getExportData };
})();

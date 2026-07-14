const fs = require('fs');
const path = require('path');

const lessonsData = [
  {
    week: "Week 1",
    sequence: "Sequence 1",
    lesson: "Lessons 1-4",
    li: "• Year 5 (AC9E5LE03): Identify point of view in literary texts and understand how it shapes response.<br>• Year 6 (AC9E6LE03): Identify and explain narrator style in literary texts.",
    sequence_text: "**Lesson 1: Introduction to *Berani***<br>" +
                   "• **Intro:** Introduce the novel *Berani*. Discuss predictions of themes based on cover art and title (meaning 'brave').<br>" +
                   "• **Explore:** Read Malia (pp. 1–5). Discuss first-person narrative voice (Malia) and her concern about palm oil and stegodons.<br>" +
                   "• **Connect:** Students draft a response on their initial impressions of Malia's character.<br><br>" +
                   "**Lesson 2: Settings and Social Contexts**<br>" +
                   "• **Intro:** Discuss captivity vs freedom in a school context.<br>" +
                   "• **Explore:** Read Ari (pp. 7–11). Introduce the setting of Warung Malang restaurant, the mascot Ginger Juice (caged orangutan), and Ari's role.<br>" +
                   "• **Connect:** Contrast Uncle Kus's reasoning for caging Ginger Juice with Ari's feelings.<br><br>" +
                   "**Lesson 3: Sensory Animal Perspective**<br>" +
                   "• **Intro:** Discuss how an animal experiences a cage.<br>" +
                   "• **Explore:** Read Ginger Juice (pp. 11–13). Examine sensory vocabulary and fragmented syntax (\"Drip. Drip. Drip.\").<br>" +
                   "• **Connect:** Write sensory paragraphs from an animal's perspective.<br><br>" +
                   "**Lesson 4: Personal Dilemmas**<br>" +
                   "• **Intro:** Define personal dilemma and share examples.<br>" +
                   "• **Explore:** Read Malia (pp. 13–15) and Ari (pp. 17–21). Examine Malia's dilemma (Canada vs home) and Ari's dilemma (guilt over Suni).<br>" +
                   "• **Connect:** Map dilemmas in a graphic organizer.",
    reading: "pp. 1–21 (Chapters: Malia 1–5, Ari 7–11, Ginger Juice 11–13, Malia 13–15, Ari 17–21)",
    diff: "**Support:** Visual word banks, sentence frames (e.g., \"Malia feels...\") for character impressions.<br>" +
          "**Lucas (ICP):** Draw a picture of Ginger Juice in a cage; label feelings with emoji cards; write a 1-sentence opinion: \"The cage is small.\"<br>" +
          "**Extend:** Compare the settings of Malang and Surabaya, analyzing the symbolic contrast of Ginger Juice's cage.<br>" +
          "**Reluctant Readers:** Audiobook check-ins; highlight key vocabulary (poachers, stegodons).",
    resources: "*Berani* novel, Settings contrast worksheet, Dilemma graphic organizer"
  },
  {
    week: "Week 2",
    sequence: "Sequence 1 cont.",
    lesson: "Lessons 5-8",
    li: "• Year 5 (AC9E5LA02): Understand how to move beyond bare assertions using authoritative sources.<br>• Year 6 (AC9E6LA02): Understand the uses of objective and subjective language.",
    sequence_text: "**Lesson 5: Planning Persuasive Presentations**<br>" +
                   "• **Intro:** Look at Malia's preparations for her palm oil presentation.<br>" +
                   "• **Explore:** Read Malia (pp. 21–25). Identify her evidence (Greenpeace video, petitions, online forms) and her strong hook.<br>" +
                   "• **Connect:** Plan an engaging hook statement for a persuasive topic.<br><br>" +
                   "**Lesson 6: Cause and Effect of Destruction**<br>" +
                   "• **Intro:** Discuss forest fire triggers and logging impacts.<br>" +
                   "• **Explore:** Read Ginger Juice (pp. 25–27). Analyze the description of the fire and her mother's escape attempt.<br>" +
                   "• **Connect:** Create a cause-and-effect flow chart of Ginger Juice's capture.<br><br>" +
                   "**Lesson 7: Spaces and Displacement**<br>" +
                   "• **Intro:** Contrast urban/rural settings.<br>" +
                   "• **Explore:** Read Ari (pp. 29–33). Compare Ari's public school with the private school SMP in Surabaya where he plays chess.<br>" +
                   "• **Connect:** Reflect on how setting can create a sense of displacement or privilege.<br><br>" +
                   "**Lesson 8: Rules, Rights, and Activism**<br>" +
                   "• **Intro:** Discuss rule-following vs rule-breaking for a cause.<br>" +
                   "• **Explore:** Read Malia (pp. 33–39) and Ari (pp. 39–41). Analyze Mrs Harwono's restriction of the petition and Malia's decision to go online.<br>" +
                   "• **Connect:** Write an opinion on whether rules should be bent for environmental activism.",
    reading: "pp. 21–41 (Chapters: Malia 21–25, Ginger Juice 25–27, Ari 29–33, Malia 33–39, Ari 39–41)",
    diff: "**Support:** Paragraph structures (PEEL template) for hook design.<br>" +
          "**Lucas (ICP):** Order 3 visual cards representing Ginger Juice's story (forest, logging, cage); copy: \"Help orangutans.\"<br>" +
          "**Extend:** Debate the ethics of Mrs Harwono's warning \"This is not Canada\" in the context of freedom of speech.<br>" +
          "**Reluctant Readers:** Shared reading of the chess tournament scene; visual vocabulary for chess (checkmate, rook).",
    resources: "*Berani* novel, PEEL paragraph templates, Cause-and-effect flowchart templates"
  },
  {
    week: "Week 3",
    sequence: "Sequence 2",
    lesson: "Lessons 9-12",
    li: "• Year 5 (AC9E5LA03): Describe how written texts use language features and are organized into stages.<br>• Year 6 (AC9E6LA03): Explain how authors adapt text structures for purpose.",
    sequence_text: "**Lesson 9: Paragraphing and Topic Sentences**<br>" +
                   "• **Intro:** Explain topic sentences and paragraph cohesion.<br>" +
                   "• **Explore:** Read Malia (pp. 43–47). Look at how she details her parents' backstory at Papa's grave. Identify paragraph topic sentences.<br>" +
                   "• **Connect:** Write a structured paragraph with a clear topic sentence about a memory.<br><br>" +
                   "**Lesson 10: Tenses and Sentence Complexity**<br>" +
                   "• **Intro:** Review main and dependent clauses.<br>" +
                   "• **Explore:** Read Ari (pp. 49–51) and Malia (pp. 53–57). Identify complex sentences and note how they connect past/present tenses.<br>" +
                   "• **Connect:** Combine simple clauses using subordinating conjunctions (although, since, while).<br><br>" +
                   "**Lesson 11: Specialist and Topic-Specific Terms**<br>" +
                   "• **Intro:** Discuss precision of vocabulary in arguments.<br>" +
                   "• **Explore:** Read Ari (pp. 57–59) and Malia (pp. 61–65). Focus on terms like 'bule', 'linguistics', 'bioethics', 'activist'.<br>" +
                   "• **Connect:** Match technical terms with definitions and write them in context.<br><br>" +
                   "**Lesson 12: Simile, Metaphor, and Empathy**<br>" +
                   "• **Intro:** Define imagery (similes, metaphors, personification).<br>" +
                   "• **Explore:** Read Ginger Juice (pp. 65–69). Analyze descriptions of cage as a \"haze\". Identify similes used by Ginger Juice.<br>" +
                   "• **Connect:** Write descriptive text from an animal's perspective using similes.",
    reading: "pp. 43–71 (Chapters: Malia 43–47, Ari 49–51, Malia 53–57, Ari 57–59, Malia 61–65, Ginger Juice 65–69, Ari 69–71)",
    diff: "**Support:** Sentence starters for complex sentences; synonym matching list.<br>" +
          "**Lucas (ICP):** Select feeling words for characters; write: \"Malia is sad for Papa.\"<br>" +
          "**Extend:** Write a short comparative text on how Malia's and Ari's use of vocabulary highlights their different social distances.<br>" +
          "**Reluctant Readers:** Guided highlights of complex sentence clauses; vocabulary matches.",
    resources: "*Berani* novel, Vocabulary matching sheets, Topic sentence builder cards"
  },
  {
    week: "Week 4",
    sequence: "Sequence 2 cont.",
    lesson: "Lessons 13-16",
    li: "• Year 5 (AC9E5LA06): Understand how noun groups can be expanded for description.<br>• Year 6 (AC9E6LA06): Understand how ideas can be expanded through choice of verbs and adverbs.",
    sequence_text: "**Lesson 13: Expanded Noun Groups**<br>" +
                   "• **Intro:** Model how to build noun groups.<br>" +
                   "• **Explore:** Read Ari (pp. 77–83) and Ginger Juice (pp. 83–85). Examine descriptions of Ginger Juice's cage and Ari's feelings.<br>" +
                   "• **Connect:** Expand 5 simple noun groups in a descriptive task.<br><br>" +
                   "**Lesson 14: Comparing Contrasting Perspectives**<br>" +
                   "• **Intro:** Revisit multi-perspective narratives.<br>" +
                   "• **Explore:** Look closely at the overlap in Ari (pp. 77–83) and Ginger Juice (pp. 83–85). Compare how they observe each other.<br>" +
                   "• **Connect:** Write a dialogue or internal monologue demonstrating both perspectives in conflict.<br><br>" +
                   "**Lesson 15: Subjective and Objective Language**<br>" +
                   "• **Intro:** Explain facts vs opinions.<br>" +
                   "• **Explore:** Read Malia (pp. 87–91). Identify her arguments about palm oil, distinguishing factual statements from emotional statements.<br>" +
                   "• **Connect:** Classify statements from the text as objective or subjective.<br><br>" +
                   "**Lesson 16: Formulating Opinions on Literature**<br>" +
                   "• **Intro:** Review what makes a literary review persuasive.<br>" +
                   "• **Explore:** Discuss the themes of *Berani* from pp. 1–91. Focus on conservation and ethical dilemmas.<br>" +
                   "• **Connect:** Write a 100-word paragraph stating an opinion on one major character's choices.",
    reading: "pp. 73–91 (Chapters: Malia 73–77, Ari 77–83, Ginger Juice 83–85, Malia 87–91)",
    diff: "**Support:** Visual templates for subjective/objective sorting.<br>" +
          "**Lucas (ICP):** Identify adjectives that describe a picture of a cage (e.g. wet, dark); write simple description.<br>" +
          "**Extend:** Write a brief essay on how the author uses grammatical choices (expanded noun groups vs simple sentences) to differentiate character minds.<br>" +
          "**Reluctant Readers:** Partner-read pages 77–83; highlight adjectives and adverbs.",
    resources: "*Berani* novel, Subjective/Objective sort cards, Character opinion planner"
  },
  {
    week: "Week 5",
    sequence: "Sequence 3",
    lesson: "Lessons 17-20",
    li: "• Year 5 (AC9E5LE03): Recognise how point of view influences reader response.<br>• Year 6 (AC9E6LE01): Identify responses to characters drawn from social contexts.",
    sequence_text: "**Lesson 17: Ethical Dilemmas and Guilt**<br>" +
                   "• **Intro:** Discuss feelings of guilt and responsibility.<br>" +
                   "• **Explore:** Read Ari (pp. 93–97). Analyze Ari's guilt about Suni and how chess represents his strategy for life.<br>" +
                   "• **Connect:** Write an analysis of how chess acts as a metaphor for Ari's personal choices.<br><br>" +
                   "**Lesson 18: Family Expectations vs Activism**<br>" +
                   "• **Intro:** Explore family loyalty vs personal ethics.<br>" +
                   "• **Explore:** Read Malia (pp. 99–103). Malia interacts with her grandfather. Contrast her passion with her family's views.<br>" +
                   "• **Connect:** Detail the conflict between Malia's personal drive and family dynamics.<br><br>" +
                   "**Lesson 19: The Ethics of Capture**<br>" +
                   "• **Intro:** Define animal welfare and captivity.<br>" +
                   "• **Explore:** Read Ari (pp. 103–107) and Ginger Juice (pp. 107–109). Look at Ginger Juice's fading health and Ari's struggle.<br>" +
                   "• **Connect:** Write a persuasive appeal arguing whether Uncle Kus has a right to keep Ginger Juice for business.<br><br>" +
                   "**Lesson 20: Character Alliances**<br>" +
                   "• **Intro:** Discuss how characters find common ground.<br>" +
                   "• **Explore:** Read Ari (pp. 109–113) and Malia (pp. 113–121). Identify how Ari and Malia interact and connect over the petition.<br>" +
                   "• **Connect:** Predict how their connection will affect Ginger Juice's fate.",
    reading: "pp. 93–123 (Chapters: Ari 93–97, Malia 99–103, Ari 103–107, Ginger Juice 107–109, Ari 109–113, Malia 113–121, Ari 121–123)",
    diff: "**Support:** Character interaction map; sentence frames for predicting.<br>" +
          "**Lucas (ICP):** Identify characters' feelings using cards; write: \"Ari wants to help Ginger Juice.\"<br>" +
          "**Extend:** Write a short comparative essay on how the author represents the clash between traditional village life (Ari) and modern city activism (Malia).<br>" +
          "**Reluctant Readers:** Guided reading of the interaction scene (pp. 113–121); vocabulary definitions.",
    resources: "*Berani* novel, Character map worksheet, Ethical dilemma templates"
  },
  {
    week: "Week 6",
    sequence: "Sequence 3 cont.",
    lesson: "Lessons 21-24",
    li: "• Year 5 (AC9E5LA02): Acknowledge differing ideas and opinions.<br>• Year 6 (AC9E6LA02): Identify bias in persuasive texts.",
    sequence_text: "**Lesson 21: Evaluating Authoritative Sources**<br>" +
                   "• **Intro:** Discuss what makes a source reliable or biased.<br>" +
                   "• **Explore:** Read Malia (pp. 125–129) and Ari (pp. 131–133). Explore how Malia references palm oil research and how Ari evaluates Uncle Kus's claims.<br>" +
                   "• **Connect:** Create a checklist for evaluating sources in persuasive writing.<br><br>" +
                   "**Lesson 22: Identifying Bias**<br>" +
                   "• **Intro:** Define bias and positioning.<br>" +
                   "• **Explore:** Read Malia (pp. 133–137) and Ari (pp. 137–139). Identify signs of bias in Uncle Kus's defense of the restaurant mascot.<br>" +
                   "• **Connect:** Rewrite a biased paragraph to be neutral and objective.<br><br>" +
                   "**Lesson 23: Anticipating Counterarguments**<br>" +
                   "• **Intro:** Explain how addressing opposing views strengthens an argument.<br>" +
                   "• **Explore:** Read Malia (pp. 139–141) and Ari (pp. 143–145). Study how they anticipate objections (e.g. economic impact of palm oil production).<br>" +
                   "• **Connect:** Draft a counterargument and rebuttal on a chosen topic.<br><br>" +
                   "**Lesson 24: Synthesis and Transition**<br>" +
                   "• **Intro:** Review reading progress and themes of conservation, guilt, and bravery.<br>" +
                   "• **Explore:** Discuss the midpoint of the novel. How are the narrative lines coming together?<br>" +
                   "• **Connect:** Write a prediction response for the resolution of the three storylines.",
    reading: "pp. 125–145 (Chapters: Malia 125–129, Ari 131–133, Malia 133–137, Ari 137–139, Malia 139–141, Ari 143–145)",
    diff: "**Support:** Sentence starters for counterarguments; sorting cards for bias.<br>" +
          "**Lucas (ICP):** Select statements that are nice to animals vs mean; write: \"Animals should be free.\"<br>" +
          "**Extend:** Write a short analytical text explaining how Mrs Harwono's explanation of political pressures represents systemic bias.<br>" +
          "**Reluctant Readers:** Partner-read pages 125–133; highlight arguments and counterarguments.",
    resources: "*Berani* novel, Bias detection worksheet, Counterargument template"
  },
  {
    week: "Week 7",
    sequence: "Sequence 4",
    lesson: "Lessons 25-28",
    li: "• Year 5 (AC9E5LY06): Plan, create and edit written persuasive texts.<br>• Year 6 (AC9E6LY06): Plan, create and edit persuasive texts using paragraphs.",
    sequence_text: "**Lesson 25: Climax and Resolution**<br>" +
                   "• **Intro:** Discuss the climax of a novel.<br>" +
                   "• **Explore:** Read pp. 147–171. Analyze the rescue of Ginger Juice, Ari's brave decision, and Malia's blog post.<br>" +
                   "• **Connect:** Connect the ending themes of bravery (*Berani*) to the assessment requirements.<br><br>" +
                   "**Lesson 26: Assessment Launch and Model Deconstruction**<br>" +
                   "• **Intro:** Introduce Assessment Task 3: Written and Spoken Persuasive opinion (e.g. Storytime Dog).<br>" +
                   "• **Explore:** Deconstruct the model responses for Year 5 and Year 6. Focus on layout, thesis statements, and topic sentences.<br>" +
                   "• **Connect:** Students negotiate and select their topic and define their target audience.<br><br>" +
                   "**Lesson 27: Researching and Gathering Evidence**<br>" +
                   "• **Intro:** Review research strategies and citation of authoritative sources.<br>" +
                   "• **Explore:** Read pp. 173–181. Analyze Ari's chess analogy (pawn/knight/queen) when persuading the school principal.<br>" +
                   "• **Connect:** Gather evidence from authoritative sources for the selected topic.<br><br>" +
                   "**Lesson 28: Outlining the Persuasive Plan**<br>" +
                   "• **Intro:** Review structural stages of persuasive texts.<br>" +
                   "• **Explore:** Read pp. 183–189. Analyze Ari's return to the village and his sacrifice for Suni.<br>" +
                   "• **Connect:** Map arguments, counterarguments, and evidence on the Planning Sheet.",
    reading: "pp. 147–189 (Chapters: Ginger Juice 147–149, Ari 149–153, Malia 153–155, Ari 157–161, Malia 165–169, Ari 169–171, Malia 173–175, Ari 177–181, Malia 183–187, Ari 187–189)",
    diff: "**Support:** Visual planning templates; deconstructed model response matching game.<br>" +
          "**Lucas (ICP):** Fill out a simplified planner for an opinion about a Storytime Dog (Yes/No, 1 reason); write simple sentence.<br>" +
          "**Extend:** Contrast Ari's chess pawn/queen analogy with classic persuasive rhetoric, explaining why it was successful.<br>" +
          "**Reluctant Readers:** Guided research session with pre-selected web articles on the Storytime Dog topic.",
    resources: "*Berani* novel, Assessment sheets, Planning templates, Storytime Dog model responses"
  },
  {
    week: "Week 8",
    sequence: "Sequence 4 cont.",
    lesson: "Lessons 29-32",
    li: "• Year 5 (AC9E5LY06): Create written persuasive texts developing and expanding on ideas.<br>• Year 6 (AC9E6LY06): Create persuasive texts using complex sentences and expanded verb groups.",
    sequence_text: "**Lesson 29: End of Novel Study (Hope and Conservation)**<br>" +
                   "• **Intro:** Reflect on the novel's resolution.<br>" +
                   "• **Explore:** Read pp. 191–201. Analyze Ginger Juice's reunion with her mother (Ibu) and Malia/Ari's futures. Explore the theme of agroforestry (spices/vanilla/honey under forest canopy).<br>" +
                   "• **Connect:** Discuss how the theme of hope can be used to end a persuasive text.<br><br>" +
                   "**Lesson 30: Drafting - Introduction & Thesis**<br>" +
                   "• **Intro:** Explain how to write a strong introduction: Hook, background info, and clear thesis statement.<br>" +
                   "• **Explore:** Look at the introductions of the Storytime Dog model responses (Year 5 vs Year 6 complexity).<br>" +
                   "• **Connect:** Draft the introduction for the persuasive text.<br><br>" +
                   "**Lesson 31: Drafting - Body Paragraphs (PEEL)**<br>" +
                   "• **Intro:** Teach how to write body paragraphs using the PEEL structure (Point, Evidence, Explanation, Link).<br>" +
                   "• **Explore:** Model a body paragraph on the whiteboard, focusing on complex sentences and expanded noun groups.<br>" +
                   "• **Connect:** Draft the first two body paragraphs.<br><br>" +
                   "**Lesson 32: Drafting - Counterargument & Conclusion**<br>" +
                   "• **Intro:** Teach how to introduce an opposing view (counterargument) and disprove it (rebuttal).<br>" +
                   "• **Explore:** Analyze the counterargument paragraphs in the model responses (Storytime Dog allergies/distractions).<br>" +
                   "• **Connect:** Draft the counterargument and conclusion paragraphs.",
    reading: "pp. 191–201 (Chapters: Ginger Juice 191–193, Ari 193–197, Malia 197–199, Ginger Juice 199–201)",
    diff: "**Support:** PEEL sentence frames; list of modal verbs and transition connectives.<br>" +
          "**Lucas (ICP):** Write 2 simple sentences: \"I want a dog. It helps me read.\" using visual aids.<br>" +
          "**Extend:** Write a counterargument that addresses multiple opposing perspectives (e.g. cost, hygiene, training).<br>" +
          "**Reluctant Readers:** Guided drafting of the thesis statement; use word processor for spelling assistance.",
    resources: "*Berani* novel, PEEL drafting worksheets, Model responses"
  },
  {
    week: "Week 9",
    sequence: "Sequence 5",
    lesson: "Lessons 33-36",
    li: "• Year 5 (AC9E5LY08): Spell using phonic, morphemic and grammatical knowledge.<br>• Year 6 (AC9E6LY08): Use spelling knowledge to spell technical and complex words.",
    sequence_text: "**Lesson 33: Self-Editing & Meaning**<br>" +
                   "• **Intro:** Explain the difference between editing for spelling and editing for meaning.<br>" +
                   "• **Explore:** Model editing a sample text with errors. Look at comma placement and sentence flow.<br>" +
                   "• **Connect:** Students self-edit their drafts, focusing on paragraph cohesion and expanded noun groups.<br><br>" +
                   "**Lesson 34: Peer Feedback and Spelling Audit**<br>" +
                   "• **Intro:** How to give constructive, standard-aligned feedback.<br>" +
                   "• **Explore:** Students swap drafts and complete an editing checklist (focusing on spelling, complex sentences, tenses).<br>" +
                   "• **Connect:** Revise drafts based on peer feedback.<br><br>" +
                   "**Lesson 35: Speaking Assessment Preparation**<br>" +
                   "• **Intro:** Introduce Part B: Spoken Presentation. Explain it is a guide, not a script.<br>" +
                   "• **Explore:** Model how to annotate a written draft for speech delivery (highlighting emphasis, pauses, voice volume).<br>" +
                   "• **Connect:** Annotate their drafts and create cue cards with key arguments.<br><br>" +
                   "**Lesson 36: Voice and Formality Techniques**<br>" +
                   "• **Intro:** Teach features of voice (pitch, tone, pace, volume) and formality (social distance, objective delivery).<br>" +
                   "• **Explore:** Practice voice exercises (speaking fast vs slow, loud vs quiet, formal vs informal).<br>" +
                   "• **Connect:** Record a practice snippet and self-evaluate their voice control.",
    reading: "Complete Book and Glossary review",
    diff: "**Support:** Spelling checklist with common word endings; simplified peer checklist.<br>" +
          "**Lucas (ICP):** Read their opinion aloud to the teacher; check spelling of 5 high-frequency words.<br>" +
          "**Extend:** Conduct a detailed self-reflection mapping how their final draft meets each A-level descriptor in the marking rubric.<br>" +
          "**Reluctant Readers:** Speech-to-text software for drafting; reading their speech to a partner for fluency check.",
    resources: "Peer feedback checklists, Annotation guides, Voice recording devices"
  },
  {
    week: "Week 10",
    sequence: "Sequence 5 cont.",
    lesson: "Lessons 37-40",
    li: "• Year 5 (AC9E5LY07): Plan, create, rehearse and deliver spoken presentations using voice features.<br>• Year 6 (AC9E6LY07): Plan, create, rehearse and deliver presentations using precise vocabulary and voice choices.",
    sequence_text: "**Lesson 37: Rehearsal and Active Listening**<br>" +
                   "• **Intro:** Discuss active listening skills (maintaining eye contact, nodding, asking clarifying questions).<br>" +
                   "• **Explore:** Students pair up to rehearse. Partner gives feedback on eye contact, voice volume, and pace.<br>" +
                   "• **Connect:** Revise presentations based on rehearsal feedback.<br><br>" +
                   "**Lesson 38: Spoken Presentations (Session 1)**<br>" +
                   "• **Intro:** Establish class expectations for audience behavior.<br>" +
                   "• **Explore:** First group of students deliver their persuasive speeches (Part B) to the class.<br>" +
                   "• **Connect:** Audience members write down one strong argument from each presentation.<br><br>" +
                   "**Lesson 39: Spoken Presentations (Session 2)**<br>" +
                   "• **Intro:** Reiterate active listening standards.<br>" +
                   "• **Explore:** Second group of students deliver their presentations.<br>" +
                   "• **Connect:** Audience members note key authoritative sources cited in the presentations.<br><br>" +
                   "**Lesson 40: Unit Reflection & Celebration**<br>" +
                   "• **Intro:** Review what was learned about environmental issues, empathy, and persuasion through *Berani*.<br>" +
                   "• **Explore:** Group discussion on how presenting their opinions changed their confidence.<br>" +
                   "• **Connect:** Write a self-evaluation of their performance in both the writing and speaking tasks.",
    reading: "N/A (Presentation focus)",
    diff: "**Support:** Cue cards with larger text; visual timer to guide pacing.<br>" +
          "**Lucas (ICP):** Present their 2-sentence opinion to a small group of 3 peers instead of the whole class.<br>" +
          "**Extend:** Lead a Q&A session after their presentation, defending their stance against impromptu peer questions.<br>" +
          "**Reluctant Readers:** Present using a visual slide deck to support their spoken points and reduce cognitive load.",
    resources: "Teacher observation sheets, Feedback slips, Visual timer"
  }
];

// Write sequence_data.json
fs.writeFileSync(path.join(__dirname, 'sequence_data.json'), JSON.stringify(lessonsData, null, 2), 'utf8');
console.log("Successfully wrote sequence_data.json");

// Update English Unit 3 Plan.md
const unitPlanPath = path.join(__dirname, 'English Unit 3 Plan.md');
let unitPlanContent = fs.readFileSync(unitPlanPath, 'utf8');

// Generate the markdown block representing rows 18 to 27
let rowsMarkdown = '';
lessonsData.forEach((data, index) => {
  const rowNum = 18 + index;
  rowsMarkdown += `- **Row ${rowNum}:**\n` +
                  `  - Column 1: ${data.week}<br>${data.sequence}\n` +
                  `  - Column 2: **Learning Intentions:**<br>${data.li}<br><br>${data.sequence_text}\n` +
                  `  - Column 3: ${data.reading}\n` +
                  `  - Column 4: ${data.diff}\n` +
                  `  - Column 5: ${data.resources}\n`;
});

// Find the boundaries in the unit plan to replace
const startMarker = '- **Row 18:**';
const endMarker = '- **Row 28:**';

const startIndex = unitPlanContent.indexOf(startMarker);
const endIndex = unitPlanContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find Row 18 or Row 28 in the unit plan!");
  process.exit(1);
}

const updatedContent = unitPlanContent.substring(0, startIndex) + rowsMarkdown + unitPlanContent.substring(endIndex);
fs.writeFileSync(unitPlanPath, updatedContent, 'utf8');
console.log("Successfully updated English Unit 3 Plan.md");

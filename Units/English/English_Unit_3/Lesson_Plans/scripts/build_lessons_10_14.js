const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
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
 * Authoritative generator for English Unit 3 Lessons 10-14.
 *
 * DOCX design basis: compact_reference_guide.
 * Named classroom override: A4 portrait, 12 mm margins, Arial 10 pt body,
 * restrained header/footer, fixed-width tables, one-page workbook inserts.
 */

const lessonPlansRoot = path.resolve(__dirname, "..");
const heroSource = path.resolve(
  lessonPlansRoot,
  "Lesson_5",
  "assets",
  "rainforest-orangutan-hero.png"
);

const palette = {
  ink: "20303C",
  deep: "0B302C",
  forest: "164E45",
  moss: "6B8E57",
  leaf: "B9D66B",
  amber: "E3A94F",
  coral: "D9684B",
  sky: "4B86A6",
  indigo: "4F5D95",
  paper: "FFFDF7",
  mist: "EDF3EF",
  cream: "FFF4DD",
  paleBlue: "E7F1F6",
  paleGreen: "E8F2E9",
  paleCoral: "FBE9E3",
  grey: "5E6B70",
  line: "B8C7C2",
  white: "FFFFFF",
};

const lessons = [
  {
    number: 10,
    title: "Building Bridges Through Time",
    shortTitle: "Tenses and Sentence Complexity",
    metaphor: "BRIDGE LAB",
    accent: "#4B86A6",
    dark: "#173F58",
    premise:
      "One sentence can hold what happened then and what Ari understands now.",
    purpose:
      "Students connect Ari's earlier relationship with Ginger Juice to his present recognition that her cage is too small. They use controlled tense and purposeful subordinating conjunctions to write a Then-Now character paragraph.",
    curriculum: [
      "Year 5 - AC9E5LA03: describe how written texts use language features and are organised into stages.",
      "Year 6 - AC9E6LA03: explain how authors adapt text structures and language choices for purpose.",
    ],
    learning:
      "We are learning to connect past and present ideas using controlled tense and purposeful complex sentences.",
    criteria: [
      "I can identify relevant Then and Now evidence about Ari.",
      "I can choose although, since or while for the relationship I intend.",
      "I can repair a fragment, an illogical conjunction and an accidental tense shift.",
      "I can write a 5-7 sentence Then-Now paragraph with at least three complex sentences.",
      "I can independently revise one sentence after a bridge inspection.",
    ],
    response:
      "A 5-7 sentence Then-Now character paragraph about Ari, using at least three purposeful complex sentences and controlled tense.",
    readingFallback:
      "Ari remembers Ginger Juice as a playful young orangutan treated like family. In the present he recognises that her cage is much too small, although he still believes a larger cage may solve the problem.",
    slides: [
      {
        kicker: "BERANI • LESSON 10",
        title: "Building Bridges Through Time",
        hero: true,
        time: 2,
        notes:
          "Open with the question only. Take one prediction about how a sentence can connect Then and Now. Do not teach conjunctions yet.",
      },
      {
        kicker: "RETRIEVAL • ORGANISER",
        title: "Which details belong to Then—and which belong to Now?",
        time: 4,
        body: `
          <div class="sort-wrap">
            <div class="sort-bank" aria-label="Evidence cards">
              ${[
                ["Young Ginger Juice tumbled and climbed.", "then"],
                ["Ari's family treated her like a cousin.", "then"],
                ["The cage was first used for tantrums.", "then"],
                ["She slept in the house like a real baby.", "then"],
                ["They carried her on their hips.", "then"],
                ["Ari sees that the cage is now too small.", "now"],
                ["He reaches through the bars to touch her.", "now"],
                ["He still thinks a bigger cage is the answer.", "now"],
                ["She never leaves the cage now.", "now"],
                ["He looks at the cage with new eyes.", "now"],
              ]
                .map(
                  ([t, a]) =>
                    `<button class="sort-card" data-answer="${a}">${t}</button>`
                )
                .join("")}
            </div>
            <div class="sort-zones two">
              <div class="sort-zone" data-zone="then"><h3>THEN</h3><p>Earlier relationship</p></div>
              <div class="sort-zone" data-zone="now"><h3>NOW</h3><p>Present recognition</p></div>
            </div>
          </div>
          <div class="action-row"><button class="btn check-sort">Check the banks</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Sort all ten details, then circle the detail that best explains Ari's change.",
          work: "Pairs",
          record: "Organiser: Then / Now banks",
          time: "4 minutes",
          finish: "Ten details placed and one circled",
          check: "Use the chapter—not guesswork.",
        },
        notes:
          "Students place cards in their organiser before the teacher moves them on screen. Ask which Now detail shows recognition and which shows continuing misunderstanding. Reading fallback: use the three-sentence summary in the plan.",
      },
      {
        kicker: "MISSION",
        title: "Build a relationship—not just a timeline",
        time: 2,
        body: `
          <div class="mission-grid">
            <article><b>SHOW NOW</b><span>What Ari recognises</span></article>
            <article><b>CONNECT THEN</b><span>What shaped him</span></article>
            <article><b>EXPLAIN CHANGE</b><span>Why the past matters now</span></article>
          </div>
          <div class="product-callout"><strong>Finished response:</strong> 5-7 sentences • three complex sentences • controlled tense</div>`,
        task: {
          do: "Complete aloud: I will connect ___ from the past to ___ in the present.",
          work: "Partner rehearsal",
          record: "No writing yet",
          time: "2 minutes",
          finish: "Both partners can state the relationship",
          check: "Name a relationship, not two unrelated facts.",
        },
        notes:
          "Keep this brisk. The product is explanation, not a chronological retell. Transition directly to pairing the evidence.",
      },
      {
        kicker: "THEN–NOW EVIDENCE PAIRS • ORGANISER",
        title: "Pair one Then detail with one Now detail",
        time: 7,
        body: `
          <div class="evidence-pairing">
            <div class="bank past"><span>THEN</span><b>treated like family</b><b>played freely</b><b>cage used briefly</b></div>
            <div class="relationship-list"><span>LABEL THE RELATIONSHIP</span><b>contrast</b><b>reason</b><b>time together</b></div>
            <div class="bank present"><span>NOW</span><b>cage is too small</b><b>Ari touches her again</b><b>bigger cage seems enough</b></div>
          </div>
          <p class="thinking-prompt">Choose two pairs. For each pair, explain how the Then detail connects to the Now detail.</p>`,
        task: {
          do: "Make two pairs. Each pair needs one Then detail, one Now detail and a relationship label.",
          work: "Pairs",
          record: "Organiser: two evidence pairs",
          time: "7 minutes",
          finish: "Two evidence pairs, each with a relationship label",
          check: "Be ready to explain why each pair belongs together.",
        },
        notes:
          "Invite more than one defensible pairing. A strong pairing connects family-like treatment in the past with confinement in the present. Ask students to name contrast, reason or time together before choosing a conjunction.",
      },
      {
        kicker: "CONJUNCTION BRIDGE TEST • ORGANISER",
        title: "Change the conjunction. Change the relationship.",
        time: 5,
        body: `
          <div class="clause-display">
            <span>Ari recognises the cage is too small</span>
            <div class="connector-row">
              <button class="reveal-card" data-reveal="CONTRAST">although</button>
              <button class="reveal-card" data-reveal="REASON">since</button>
              <button class="reveal-card" data-reveal="TIME TOGETHER">while</button>
            </div>
            <span>he still believes Ginger Juice belongs with the family</span>
          </div>
          <p class="thinking-prompt">Which relationship is most truthful here? Defend it before revealing the label.</p>`,
        task: {
          do: "Write two versions. Underline each conjunction and label its job.",
          work: "Pairs, then class comparison",
          record: "Organiser: bridge sentences",
          time: "5 minutes",
          finish: "Two grammatical versions and two job labels",
          check: "The conjunction must match the meaning.",
        },
        notes:
          "Although is likely the best relationship for the displayed clauses, but students may restructure for since or while. Do not accept a sentence merely because it is grammatical.",
      },
      {
        kicker: "SENTENCE SURGERY • ORGANISER",
        title: "Diagnose the first fault. Then repair it.",
        time: 6,
        body: `
          <div class="surgery-grid">
            <button class="reveal-card" data-reveal="FRAGMENT • Attach it to a main clause."><b>1</b> Although Ari remembered their childhood.</button>
            <button class="reveal-card" data-reveal="LOGIC • 'Since' wrongly makes childhood play the reason the cage shrank."><b>2</b> Since they played together, the cage became too small.</button>
            <button class="reveal-card" data-reveal="TENSE • Keep the present frame: recognises / believes."><b>3</b> Ari recognises the problem, but believed a larger cage is enough.</button>
          </div>`,
        task: {
          do: "Name each fault, repair it, then click to compare the diagnosis.",
          work: "Independent first; class check",
          record: "Organiser: Sentence Surgery",
          time: "6 minutes",
          finish: "Three repaired sentences",
          check: "Meaning, clause completeness and tense all work.",
        },
        notes:
          "Reveal only after students have written. Accept multiple repairs if meaning and tense are controlled. The important misconception is that a conjunction can be inserted without considering logic.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "Watch one paragraph carry Then into Now",
        time: 5,
        body: `
          <div class="model-text">
            <button class="annot" data-reveal="NOW • establishes the present recognition">Ari now understands that Ginger Juice's cage is far too small for her.</button>
            <button class="annot" data-reveal="THEN + CONTRAST • connects affection with confinement">Although his family once treated her like a playful cousin, she gradually became a restaurant attraction.</button>
            <button class="annot" data-reveal="REASON • explains why the problem is newly visible">Since Ginger Juice has grown, she can no longer climb or stretch inside the bars.</button>
            <button class="annot" data-reveal="TIME TOGETHER • holds action and memory in one sentence">While Ari strokes her hand, he remembers the closeness they shared.</button>
            <button class="annot" data-reveal="INTERPRETATION • reveals remaining misunderstanding">However, he still assumes that a larger cage will solve her suffering.</button>
          </div>`,
        task: {
          do: "Read the whole model. Predict each sentence's job before clicking it.",
          work: "Whole class",
          record: "Star one model decision on the organiser",
          time: "5 minutes",
          finish: "One decision selected for imitation",
          check: "Notice meaning before grammar labels.",
        },
        notes:
          "Read fluently before annotating. Ask why the final sentence prevents the paragraph becoming a simple 'Ari has changed' response.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Malia's time bridge is harder to see",
        depth: true,
        time: 10,
        body: `
          <div class="compare-panel">
            <article><span>PRESENT</span><b>An anonymous email calls Malia “bule”.</b></article>
            <article><span>EARLIER EXPERIENCE</span><b>She has repeatedly been positioned as an outsider despite identifying as Indonesian.</b></article>
          </div>
          <p class="thinking-prompt">Write one complex sentence that connects the present reaction with the longer history. What makes this time movement subtler than Ari's?</p>`,
        task: {
          do: "Build one Malia bridge sentence and explain why the link is less obvious.",
          work: "Pairs",
          record: "Workbook margin or organiser back",
          time: "8-10 minutes",
          finish: "One sentence plus one explanation",
          check: "Do not reduce bule to a neutral synonym for foreigner.",
        },
        notes:
          "Optional depth. This provides transfer without becoming the independent product. Keep discussion grounded in Malia's experience in the text.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "One idea. Three conjunctions. Three meanings.",
        depth: true,
        time: 8,
        body: `
          <div class="depth-lab">
            <b>Ari reaches through the bars.</b>
            <span>although</span><span>since</span><span>while</span>
            <b>he remembers their earlier closeness.</b>
          </div>
          <p class="thinking-prompt">Restructure as needed. Which conjunction produces the most accurate relationship?</p>`,
        task: {
          do: "Write all three versions, then defend the most accurate.",
          work: "Independent, then compare",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "Three versions and one defended choice",
          check: "Change the sentence—not the evidence.",
        },
        notes:
          "Optional depth. Since and while can both work with restructuring; although requires a genuine contrast. Reward explanation, not one predetermined answer.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write Ari's Then–Now paragraph",
        time: 12,
        timer: 12,
        body: `
          <div class="writing-brief">
            <h3>5-7 sentences</h3>
            <ul><li>Present recognition</li><li>Relevant past relationship</li><li>Three complex sentences</li><li>Controlled tense</li><li>What Ari still misunderstands</li></ul>
            <p><b>Optional launches:</b> Although Ari once… • Since Ginger Juice has… • While he…</p>
          </div>`,
        task: {
          do: "Write the complete paragraph using your bridge evidence.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "12 minutes",
          finish: "5-7 complete sentences",
          check: "Explain Ari's change; do not just retell events.",
        },
        notes:
          "Do not type student composition into the deck. Confer first with students whose organiser contains two facts but no relationship.",
      },
      {
        kicker: "SELF-CHECK • WORKBOOK",
        title: "Bridge inspection",
        time: 4,
        body: checklist([
          "I clearly showed Then and Now.",
          "Each conjunction expresses the relationship I intended.",
          "My verbs do not drift accidentally between tenses.",
          "I used accurate evidence about Ari.",
          "I revised at least one sentence.",
        ]),
        task: {
          do: "Mark each check. Revise one sentence before you stop.",
          work: "Independent",
          record: "Workbook paragraph",
          time: "4 minutes",
          finish: "One visible revision",
          check: "A tick without a revision is not finished.",
        },
        notes:
          "Quiet self-check. Select two examples only after revision. Avoid turning this into peer feedback.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "Box your strongest bridge",
        time: 3,
        body: `<div class="exit-line">This conjunction shows <span>____________________________</span>.</div>`,
        task: {
          do: "Box your strongest complex sentence. Explain the conjunction's job beneath it.",
          work: "Independent",
          record: "Workbook",
          time: "3 minutes",
          finish: "One boxed sentence and one explanation",
          check: "Name the relationship, not the conjunction.",
        },
        notes:
          "Safe stopping point. Use exit explanations to decide whether the next grammar lesson needs a short logic reteach.",
      },
    ],
    organiser: {
      subtitle: "Then–Now Evidence Pairs + Sentence Surgery",
      sections: [
        {
          title: "1. Evidence banks",
          columns: ["THEN - earlier relationship", "NOW - present recognition"],
          rows: [
            ["", ""],
            ["", ""],
            ["", ""],
          ],
        },
        {
          title: "2. Make two evidence pairs",
          columns: ["Then detail", "Relationship", "Now detail"],
          rows: [
            ["", "", ""],
            ["", "", ""],
          ],
        },
        {
          title: "3. Sentence Surgery",
          columns: ["Fault", "Repair"],
          rows: [
            ["Fragment", ""],
            ["Conjunction logic", ""],
            ["Tense control", ""],
          ],
        },
        {
          title: "4. Paragraph plan",
          columns: ["Now", "Then", "Change", "Still misunderstands"],
          rows: [["", "", "", ""]],
        },
      ],
    },
    lucas: {
      subtitle: "Then and Now",
      instruction:
        "Order the three stages. You may point, speak, copy or ask a partner to write your words.",
      stages: [
        ["1 THEN", "Ari played with young Ginger Juice."],
        ["2 CHANGE", "Ginger Juice grew bigger."],
        ["3 NOW", "Ari sees the cage is too small."],
      ],
      choices: ["because", "but"],
      response: [
        "Then Ari ________________________________________________.",
        "Now Ginger Juice ________________________________________.",
        "Ari knows _______________________________________________.",
      ],
    },
  },
  {
    number: 11,
    title: "Words With Exact Jobs",
    shortTitle: "Specialist and Topic-Specific Terms",
    metaphor: "PRECISION LENS",
    accent: "#D9684B",
    dark: "#214F4B",
    premise: "A near-synonym can be close—and still be wrong.",
    purpose:
      "Students examine how culturally situated and topic-specific vocabulary carries precise meaning. They use bule, galvanise, strategise and repercussions in a deliberate Precision Rewrite.",
    curriculum: [
      "Year 5 - AC9E5LA03: describe how language features contribute to meaning.",
      "Year 6 - AC9E6LA03: explain how vocabulary choices are adapted for purpose and context.",
    ],
    learning:
      "We are learning to select vocabulary for exact meaning, tone and context.",
    criteria: [
      "I can infer a word's meaning from contextual evidence.",
      "I can explain what a precise word adds that a near-synonym misses.",
      "I can recognise when a word is grammatical but contextually wrong.",
      "I can revise a vague paragraph using four target terms accurately.",
      "I can justify two replacements with specific meaning or tone reasons.",
    ],
    response:
      "A Precision Rewrite of a vague paragraph using bule, galvanise, strategise and repercussions, followed by two justified vocabulary choices.",
    readingFallback:
      "Malia experiences bule as a label that positions her as an outsider. She tries to galvanise support for her petition. Ari strategises before approaching Uncle. Malia's decision creates repercussions for herself and Mrs Harwono.",
    slides: [
      {
        kicker: "BERANI • LESSON 11",
        title: "Words With Exact Jobs",
        hero: true,
        time: 2,
        notes:
          "Ask: which carries more weight—result or repercussion? Take one answer without confirming it.",
      },
      {
        kicker: "RETRIEVAL • ORGANISER",
        title: "Where did these words do their work?",
        time: 4,
        body: `
          <div class="context-grid">
            <article><small>IDENTITY</small><p>Others position Malia as an outsider.</p><b>?</b></article>
            <article><small>ACTIVISM</small><p>Malia tries to mobilise people around the petition.</p><b>?</b></article>
            <article><small>STRATEGY</small><p>Ari plans moves before speaking to Uncle.</p><b>?</b></article>
            <article><small>CONSEQUENCE</small><p>Mrs Harwono is affected by Malia's decision.</p><b>?</b></article>
          </div>
          <div class="word-bank"><b>bule</b><b>galvanise</b><b>strategise</b><b>repercussions</b></div>`,
        task: {
          do: "Match each context to a target word. Underline the clue that guided you.",
          work: "Pairs",
          record: "Organiser: Word Fit rows",
          time: "4 minutes",
          finish: "Four matches and four clues",
          check: "Use context—not word length.",
        },
        notes:
          "Do not treat bule as a simple dictionary synonym. Establish that context includes who uses a word, towards whom and with what effect.",
      },
      {
        kicker: "MISSION",
        title: "Choose for meaning—not difficulty",
        time: 2,
        body: `
          <div class="mission-grid four">
            <article><b>MEANING</b><span>What does it name?</span></article>
            <article><b>TONE</b><span>What attitude travels with it?</span></article>
            <article><b>CONTEXT</b><span>Where does it fit?</span></article>
            <article><b>GRAMMAR</b><span>What must change around it?</span></article>
          </div>
          <div class="product-callout"><strong>Finished response:</strong> one Precision Rewrite + two justified replacements</div>`,
        task: {
          do: "Choose one check and explain it in your own words.",
          work: "Partner rehearsal",
          record: "No writing yet",
          time: "2 minutes",
          finish: "Both partners can explain one check",
          check: "A 'harder' word is not automatically more precise.",
        },
        notes:
          "Keep the four checks visible throughout the Word Fit Lab. The independent task depends on all four.",
      },
      {
        kicker: "WORD FIT LAB 1 • ORGANISER",
        title: "Which word brings the context into focus?",
        time: 7,
        body: `
          <div class="choice-set">
            <div class="choice-question"><small>IDENTITY CONTEXT</small><p>Despite identifying as Indonesian, Malia is repeatedly positioned as a ______.</p>
              <div><button class="choice-card" data-correct="false">visitor</button><button class="choice-card" data-correct="false">foreigner</button><button class="choice-card" data-correct="true">bule</button></div></div>
            <div class="choice-question"><small>ACTIVISM CONTEXT</small><p>Malia wants to ______ support, not merely collect quiet agreement.</p>
              <div><button class="choice-card" data-correct="false">gain</button><button class="choice-card" data-correct="false">encourage</button><button class="choice-card" data-correct="true">galvanise</button></div></div>
          </div>
          <div class="action-row"><button class="btn check-choice">Check fit</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Select the best fit. Explain what it adds that the alternatives miss.",
          work: "Pairs",
          record: "Organiser: first two Word Fit rows",
          time: "7 minutes",
          finish: "Two selections and two explanations",
          check: "Consider positioning and force.",
        },
        notes:
          "For bule, accept that foreigner is a partial gloss but insufficient for this cultural context. For galvanise, emphasise movement from passive agreement to action.",
      },
      {
        kicker: "WORD FIT LAB 2 • ORGANISER",
        title: "Planning and consequences need exact weight",
        time: 7,
        body: `
          <div class="choice-set">
            <div class="choice-question"><small>STRATEGY CONTEXT</small><p>Before approaching Uncle, Ari decides to ______.</p>
              <div><button class="choice-card" data-correct="false">think</button><button class="choice-card" data-correct="true">strategise</button><button class="choice-card" data-correct="false">wonder</button></div></div>
            <div class="choice-question"><small>CONSEQUENCE CONTEXT</small><p>Malia has not anticipated the serious ______ for Mrs Harwono.</p>
              <div><button class="choice-card" data-correct="false">results</button><button class="choice-card" data-correct="true">repercussions</button><button class="choice-card" data-correct="false">events</button></div></div>
          </div>
          <div class="action-row"><button class="btn check-choice">Check fit</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Select, justify and note any grammar that must change around the word.",
          work: "Pairs",
          record: "Organiser: final two Word Fit rows",
          time: "7 minutes",
          finish: "Two selections, reasons and grammar notes",
          check: "Seriousness and deliberateness matter.",
        },
        notes:
          "The distinctions are deliberate planning versus general thinking, and serious indirect consequences versus neutral results.",
      },
      {
        kicker: "PRECISION TEST",
        title: "A word can be grammatical—and still not fit",
        time: 4,
        body: `
          <div class="surgery-grid">
            <button class="reveal-card" data-reveal="DOES NOT FIT • A picnic delay is too minor for this weight.">The rain had repercussions for our picnic.</button>
            <button class="reveal-card" data-reveal="FITS • The context involves serious effects on another person.">Malia did not foresee the repercussions for Mrs Harwono.</button>
            <button class="reveal-card" data-reveal="DOES NOT FIT • This culturally situated label cannot be applied as a generic adjective.">The bule suitcase was heavy.</button>
          </div>`,
        task: {
          do: "Mark fits / does not fit, then explain the contextual boundary.",
          work: "Independent first; class reveal",
          record: "Organiser margin",
          time: "4 minutes",
          finish: "Three judgements and one spoken reason",
          check: "Grammar alone is not enough.",
        },
        notes:
          "Keep this brief. The point is semantic boundary, not comic wrong answers.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "From vague to exact",
        time: 5,
        body: `
          <div class="before-after">
            <article><small>VAGUE</small><p>Some people treated Malia like an outsider. She made a plan to get people to support her campaign. Her actions caused serious results.</p></article>
            <article><small>PRECISE</small><p>Because others positioned Malia as <mark>bule</mark>, she began to <mark>strategise</mark> about how to <mark>galvanise support</mark>. However, she did not anticipate the serious <mark>repercussions</mark> for Mrs Harwono.</p></article>
          </div>`,
        task: {
          do: "Predict each replacement and the grammar change it requires.",
          work: "Whole class",
          record: "Star one model change on the organiser",
          time: "5 minutes",
          finish: "One selected change and reason",
          check: "Notice sentence rebuilding—not word swapping alone.",
        },
        notes:
          "Read both versions aloud. Ask why the precise paragraph requires restructuring rather than four one-for-one substitutions.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Move the words into a new register",
        depth: true,
        time: 10,
        body: `
          <div class="compare-panel">
            <article><span>INFORMAL MESSAGE</span><b>Malia got lots of people interested, but it caused big problems.</b></article>
            <article><span>FORMAL ANALYSIS</span><b>Malia galvanised support, but she underestimated the repercussions.</b></article>
          </div>
          <p class="thinking-prompt">Revise one new sentence for a formal school audience. Which word choices change—and which remain?</p>`,
        task: {
          do: "Rewrite one informal sentence for a formal audience and justify two changes.",
          work: "Independent",
          record: "Workbook margin",
          time: "8-10 minutes",
          finish: "One formal revision and two reasons",
          check: "Formality must not distort the meaning.",
        },
        notes:
          "Optional depth. This is not a thesaurus exercise; changes must suit the named audience.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Why isn't bule simply 'foreigner'?",
        depth: true,
        time: 8,
        body: `
          <div class="depth-lab solo">
            <b>dictionary gloss</b><span>foreigner / white person</span>
            <b>contextual work</b><span>positioning Malia as not fully belonging</span>
            <b>speaker + effect</b><span>who uses it, towards whom, and why it matters</span>
          </div>`,
        task: {
          do: "Explain what the simple gloss loses in Malia's context.",
          work: "Pairs, then whole class",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "One two-sentence explanation",
          check: "Stay grounded in the novel; no personal disclosure required.",
        },
        notes:
          "Optional depth. Maintain a text-based discussion boundary. Do not invite students to repeat labels from their own lives.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Complete the Precision Rewrite",
        time: 10,
        timer: 10,
        body: `
          <div class="writing-brief">
            <h3>Rewrite the vague paragraph</h3>
            <p>Some people treated Malia like an outsider. She made a plan to get people to support her campaign. Her actions caused serious results for others.</p>
            <ul><li>Use all four target terms accurately</li><li>Change surrounding grammar as needed</li><li>Keep the paragraph natural</li></ul>
          </div>`,
        task: {
          do: "Rewrite the paragraph using all four target terms accurately.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "10 minutes",
          finish: "One complete revised paragraph",
          check: "Rebuild sentences when precision requires it.",
        },
        notes:
          "Students may consult the organiser. Do not display one fixed answer while they compose.",
      },
      {
        kicker: "JUSTIFY • WORKBOOK",
        title: "Prove that two replacements were deliberate",
        time: 4,
        body: `
          <div class="justify-frame">I replaced <b>________</b> with <b>________</b> because <span>________________________________________</span>.</div>
          <div class="justify-frame">The near-synonym <b>________</b> is weaker here because <span>___________________________________</span>.</div>`,
        task: {
          do: "Annotate two replacements with specific meaning or tone reasons.",
          work: "Independent",
          record: "Below the rewrite",
          time: "4 minutes",
          finish: "Two complete justifications",
          check: "Do not write only 'because it is better'.",
        },
        notes:
          "If a student cannot justify a word, ask them to test a near-synonym and compare the loss.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Bring every word into focus",
        time: 3,
        body: checklist([
          "Every target word fits the exact context.",
          "I changed the surrounding grammar where needed.",
          "My rewrite still sounds natural.",
          "Both explanations name a meaning or tone difference.",
          "I revised at least one word or phrase.",
        ]),
        task: {
          do: "Mark each check and revise one word or surrounding phrase.",
          work: "Independent",
          record: "Workbook",
          time: "3 minutes",
          finish: "One visible revision",
          check: "Precision includes what surrounds the word.",
        },
        notes:
          "Selected examples should compare decisions, not produce a single canonical rewrite.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "Name the near-synonym that fails",
        time: 2,
        body: `<div class="exit-line"><b>Target word:</b> ________ <b>Near-synonym:</b> ________ <b>Weaker because:</b> __________________</div>`,
        task: {
          do: "Record one target word, a near-synonym and the contextual difference.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One complete comparison",
          check: "Name the lost meaning or tone.",
        },
        notes:
          "Safe stopping point. Use these comparisons as vocabulary evidence, not spelling evidence.",
      },
    ],
    organiser: {
      subtitle: "Word Fit Lab + Precision Rewrite",
      sections: [
        {
          title: "1. Word Fit Lab",
          columns: ["Context", "Best-fit word", "Near-synonym", "What the precise word adds"],
          rows: [
            ["Identity", "", "", ""],
            ["Activism", "", "", ""],
            ["Strategy", "", "", ""],
            ["Consequence", "", "", ""],
          ],
        },
        {
          title: "2. Vague paragraph",
          text:
            "Some people treated Malia like an outsider. She made a plan to get people to support her campaign. Her actions caused serious results for others.",
        },
        {
          title: "3. Justify two replacements",
          columns: ["I replaced…", "with…", "because…"],
          rows: [
            ["", "", ""],
            ["", "", ""],
          ],
        },
        {
          title: "4. Context boundary",
          text:
            "A word may be grammatical and still be wrong for the context. Check meaning, tone, context and grammar.",
        },
      ],
    },
    lucas: {
      subtitle: "Choose the more exact words",
      instruction:
        "Circle the word or phrase that makes the meaning clearer. You may point, speak or ask a partner to write.",
      stages: [
        ["PLAN", "think / make a plan"],
        ["SUPPORT", "get people / ask people to help"],
        ["RESULT", "something happened / a serious problem followed"],
      ],
      choices: ["plan", "support", "serious result"],
      response: [
        "Malia makes a ___________________________________________.",
        "She asks people to _______________________________________.",
        "Her choice causes ________________________________________.",
      ],
    },
  },
  {
    number: 12,
    title: "Crossing Into Danger",
    shortTitle: "Simile, Metaphor and Empathy",
    metaphor: "PERSPECTIVE LENS",
    accent: "#E3A94F",
    dark: "#403F2A",
    premise: "Describe only what Ginger Juice can sense, remember and understand.",
    purpose:
      "Students map Ginger Juice's sensory experience across three danger thresholds and use purposeful figurative language to write an evidence-grounded first-person scene.",
    curriculum: [
      "Year 5 - AC9E5LA03: describe how literary language features contribute to meaning.",
      "Year 6 - AC9E6LA03: explain how authors adapt language and structure for purpose and effect.",
    ],
    learning:
      "We are learning to create empathy through sensory evidence, perspective and purposeful figurative language.",
    criteria: [
      "I can identify what Ginger Juice senses at three thresholds.",
      "I can separate what she can know from human knowledge she cannot access.",
      "I can explain the job of a figurative comparison.",
      "I can write an 8-10 sentence first-person scene with two purposeful figurative choices.",
      "I can revise a line that is clichéd, vague or outside her perspective.",
    ],
    response:
      "An 8-10 sentence first-person scene titled Crossing Into Danger, moving from the treetops across burned ground towards the human food market.",
    readingFallback:
      "Fire and habitat loss leave Ginger Juice and Ibu hungry. They leave the safety of the treetops, cross burned ground and approach a human food market. Ginger Juice understands humans through animal observation rather than human terminology.",
    slides: [
      {
        kicker: "BERANI • LESSON 12",
        title: "Crossing Into Danger",
        hero: true,
        time: 2,
        notes:
          "Ask which sense would warn Ginger Juice first. Accept different predictions when students explain the context.",
      },
      {
        kicker: "RETRIEVAL • ORGANISER",
        title: "Put the three danger thresholds in order",
        time: 4,
        body: `
          <div class="thresholds">
            <button class="reveal-card" data-reveal="1 • relative safety, height and cover"><b>TREETOP EDGE</b><span>leaves • Ibu's body • height</span></button>
            <button class="reveal-card" data-reveal="2 • exposure, heat and absence"><b>BURNED GROUND</b><span>black • char • ash • silence</span></button>
            <button class="reveal-card" data-reveal="3 • hunger and human threat"><b>HUMAN MARKET</b><span>fruit • shouting • urgency</span></button>
          </div>`,
        task: {
          do: "Order the thresholds and add one remembered detail to each.",
          work: "Pairs",
          record: "Organiser: Perspective Lens Map",
          time: "4 minutes",
          finish: "Three ordered thresholds and three details",
          check: "Use Ginger Juice's chapter.",
        },
        notes:
          "The chapters are pre-read. Use the fallback summary if necessary, then keep moving.",
      },
      {
        kicker: "MISSION",
        title: "Make the reader experience the crossing",
        time: 2,
        body: `
          <div class="mission-grid">
            <article><b>SENSE</b><span>What reaches her body?</span></article>
            <article><b>UNDERSTAND</b><span>What can she make of it?</span></article>
            <article><b>IMAGE</b><span>How might she express it?</span></article>
          </div>
          <div class="product-callout"><strong>Finished response:</strong> 8-10 first-person sentences • two figurative choices • evidence boundary</div>`,
        task: {
          do: "Complete aloud: Ginger Juice can know ___, but she cannot know ___.",
          work: "Partner rehearsal",
          record: "No writing yet",
          time: "2 minutes",
          finish: "One clear knowledge boundary",
          check: "Do not give her a human explanation.",
        },
        notes:
          "Establish empathy as disciplined perspective-taking, not sentimental invention.",
      },
      ...[
        {
          kicker: "PERSPECTIVE LENS 1 • ORGANISER",
          title: "Leaving the treetops",
          time: 5,
          sense: "Ibu's heartbeat • dropping height • loss of leaf cover",
          understand: "Ground is not where tree apes are safe.",
          image: "Her heart follows Ibu's like a smaller drumbeat.",
          note:
            "Model the first row. Ask which detail is sensory and which is interpretation.",
        },
        {
          kicker: "PERSPECTIVE LENS 2 • ORGANISER",
          title: "Crossing the burned ground",
          time: 4,
          sense: "heat • ash • silence • empty ground",
          understand: "The living world has disappeared.",
          image: "Avoid a generic 'hot as fire' comparison; make absence visible.",
          note:
            "Students complete this row in pairs. Accept different strongest details when justified.",
        },
        {
          kicker: "PERSPECTIVE LENS 3 • ORGANISER",
          title: "Approaching the human market",
          time: 4,
          sense: "fruit smell • hunger • human movement • shouting",
          understand: "Food is close, but humans are dangerous.",
          image: "Let hunger and danger pull in opposite directions.",
          note:
            "Keep the evidence boundary visible: she does not know commerce, weapons or human motives.",
        },
      ].map((s) => ({
        kicker: s.kicker,
        title: s.title,
        time: s.time,
        body: `
          <div class="lens-map">
            <article><small>SENSE</small><b>${s.sense}</b></article>
            <article><small>UNDERSTAND / FEEL</small><b>${s.understand}</b></article>
            <article><small>FIGURATIVE POSSIBILITY</small><b>${s.image}</b></article>
          </div>`,
        task: {
          do:
            s.title === "Leaving the treetops"
              ? "Complete this first lens row with the class."
              : "Complete the lens row and draft one possible figurative line.",
          work:
            s.title === "Leaving the treetops" ? "Whole class model" : "Pairs",
          record: "Organiser: matching threshold row",
          time: `${s.time} minutes`,
          finish: "Sense, understanding and image recorded",
          check: "The image must grow from the evidence.",
        },
        notes: s.note,
      })),
      {
        kicker: "FIGURATIVE PURPOSE TEST",
        title: "Purposeful image—or decoration?",
        time: 4,
        body: `
          <div class="choice-set three">
            <button class="choice-card" data-correct="false"><small>LITERAL</small>The ground was hot and empty.</button>
            <button class="choice-card" data-correct="false"><small>CLICHÉ</small>The ground was as hot as fire.</button>
            <button class="choice-card" data-correct="true"><small>PURPOSEFUL</small>The dead ground opened beneath us like a mouth with no song.</button>
          </div>
          <div class="action-row"><button class="btn check-choice">Check purpose</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Select the line that makes the reader notice loss, then repair the cliché.",
          work: "Independent first; class check",
          record: "Organiser margin",
          time: "4 minutes",
          finish: "One choice, reason and repaired line",
          check: "Name what the image makes the reader notice.",
        },
        notes:
          "The purposeful model is an original teacher model, not a quotation from the novel. Discuss function before naming device.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "One threshold, fully realised",
        time: 5,
        body: `
          <div class="model-text">
            <button class="annot" data-reveal="SENSORY EVIDENCE • body and heat">I cling to Ibu's thin back as the cool leaves fall behind us.</button>
            <button class="annot" data-reveal="LIMITED KNOWLEDGE • no human explanation">Below, the ground waits where tree apes do not belong.</button>
            <button class="annot" data-reveal="FIGURATIVE PURPOSE • fear through rhythm">Ibu's heart pounds, and mine follows like a smaller drum.</button>
            <button class="annot" data-reveal="FRAGMENTED PACE • concentrates absence">Black. Char. Ash. No song anywhere.</button>
          </div>`,
        task: {
          do: "Read the whole model. Predict each choice's job before clicking.",
          work: "Whole class",
          record: "Star one decision on the organiser",
          time: "5 minutes",
          finish: "One selected craft decision",
          check: "Every choice serves perspective or movement.",
        },
        notes:
          "This model imitates the extract's craft without copying extended text. Do not require students to imitate non-standard grammar.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Make sound disappear",
        depth: true,
        time: 10,
        body: `
          <div class="sound-trail"><b>gibbons</b><b>bamboo</b><b>insects</b><span>then</span><strong>SILENCE</strong></div>
          <p class="thinking-prompt">Revise 2-3 sentences so the loss of sound becomes evidence. How can absence be heard?</p>`,
        task: {
          do: "Write a short sound-to-silence sequence and explain its effect.",
          work: "Independent",
          record: "Workbook margin",
          time: "8-10 minutes",
          finish: "2-3 sentences and one effect statement",
          check: "Do not list sounds; create a change.",
        },
        notes:
          "Optional depth. Encourage restraint: one disappearing pattern is stronger than a catalogue.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Fragments can control the reader's pace",
        depth: true,
        time: 8,
        body: `
          <div class="before-after">
            <article><small>CONVENTIONAL</small><p>The burned ground was black with char and ash.</p></article>
            <article><small>CONCENTRATED</small><p>Black. Char. Ash.</p></article>
          </div>
          <p class="thinking-prompt">Write one conventional sentence and one deliberate fragment sequence. Which moment deserves the slowed focus?</p>`,
        task: {
          do: "Create both versions and justify where the fragment belongs.",
          work: "Pairs",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "Two versions and one placement reason",
          check: "A deliberate fragment is not an accidental fragment.",
        },
        notes:
          "Optional depth. Connect back to Lesson 10: students should distinguish craft fragments from incomplete sentences.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write Crossing Into Danger",
        time: 14,
        timer: 14,
        body: `
          <div class="writing-brief">
            <h3>8-10 first-person sentences</h3>
            <ul><li>Leave the treetops</li><li>Cross burned ground</li><li>Approach the human market</li><li>Use sensory evidence</li><li>Include two purposeful figurative choices</li></ul>
            <p><b>Boundary:</b> Ginger Juice may sense and infer danger; she cannot explain the human system.</p>
          </div>`,
        task: {
          do: "Write the complete scene from Ginger Juice's first-person perspective.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "14 minutes",
          finish: "8-10 sentences across all three thresholds",
          check: "Create empathy through evidence—not generic sadness.",
        },
        notes:
          "Students may use conventional grammar in their own response. The target is perspective and imagery, not mimicry.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Stay inside the perspective",
        time: 4,
        body: checklist([
          "I stayed in Ginger Juice's first-person perspective.",
          "My details are supported or defensibly inferred.",
          "Two figurative choices have clear jobs.",
          "I used sensory experience—not only emotion words.",
          "The scene moves from safety towards danger.",
          "I revised one vague, clichéd or impossible line.",
        ]),
        task: {
          do: "Mark each check and revise one line.",
          work: "Independent",
          record: "Workbook scene",
          time: "4 minutes",
          finish: "One visible revision",
          check: "Perspective boundaries matter as much as imagery.",
        },
        notes:
          "Choose examples for discussion only after silent revision.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "Box the line that carries fear",
        time: 2,
        body: `<div class="exit-line">This line makes the reader sense or understand <span>____________________________</span>.</div>`,
        task: {
          do: "Box your strongest figurative line and explain its effect.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One boxed line and one effect statement",
          check: "Name the reader effect—not only the device.",
        },
        notes:
          "Safe stopping point. Use the explanation as evidence of figurative-language understanding.",
      },
    ],
    organiser: {
      subtitle: "Perspective Lens Map",
      sections: [
        {
          title: "1. Three thresholds",
          columns: ["Threshold", "What she senses", "What she understands / feels", "Figurative possibility"],
          rows: [
            ["Treetop edge", "", "", ""],
            ["Burned ground", "", "", ""],
            ["Human market", "", "", ""],
          ],
        },
        {
          title: "2. Evidence boundary",
          columns: ["Ginger Juice can know…", "Ginger Juice cannot know…"],
          rows: [["", ""]],
        },
        {
          title: "3. Scene plan",
          columns: ["Departure", "Crossing", "Approach", "Final warning image"],
          rows: [["", "", "", ""]],
        },
        {
          title: "4. Figurative purpose",
          text:
            "My image makes the reader notice ______________________________, not merely that the scene is sad or scary.",
        },
      ],
    },
    lucas: {
      subtitle: "What Ginger Juice senses",
      instruction:
        "Order the stages. Choose a sense and feeling. You may point, speak, copy or ask a partner to write.",
      stages: [
        ["SAFE TREES", "cool leaves • high branches"],
        ["BURNED GROUND", "hot • black • quiet"],
        ["HUMAN PLACE", "fruit • shouting • danger"],
      ],
      choices: ["safe", "afraid", "hungry", "hot", "quiet"],
      response: [
        "I leave the _____________________________________________.",
        "The ground is ___________________________________________.",
        "My heart beats like ______________________________________.",
      ],
    },
  },
  {
    number: 13,
    title: "Two Lenses on One Scene",
    shortTitle: "Expanded Noun Groups, Verbs and Adverbs",
    metaphor: "TWO-LENS LAB",
    accent: "#6B6FAE",
    dark: "#25365D",
    premise: "Precision is not the same as adding the most words.",
    purpose:
      "Students use a noun-group lens and an action lens to create a restrained third-person snapshot of Ari practising chess beside Ginger Juice's cage.",
    curriculum: [
      "Year 5 - AC9E5LA06: understand how noun groups can be expanded for description.",
      "Year 6 - AC9E6LA06: understand how ideas can be expanded through choices of verbs and adverbs.",
    ],
    learning:
      "We are learning to make description precise through useful noun-group, verb and adverbial choices.",
    criteria: [
      "I can identify concrete details that belong in the chessboard scene.",
      "I can expand a noun group without adding empty detail.",
      "I can replace a weak verb with a precise action.",
      "I can recognise and edit an overloaded sentence.",
      "I can write a 6-8 sentence third-person snapshot and independently revise one vague or overloaded sentence.",
    ],
    response:
      "A 6-8 sentence third-person snapshot titled The Chessboard Beside the Cage. Year 5 evidence: three expanded noun groups. Year 6 evidence: three precise verbs and two purposeful adverbial details.",
    readingFallback:
      "Ari moves a restaurant table and chair beside the cage to practise chess. He believes Ginger Juice follows the pieces. Ginger Juice watches patterns and colours and values the warmth of his touch.",
    slides: [
      {
        kicker: "BERANI • LESSON 13",
        title: "Two Lenses on One Scene",
        hero: true,
        time: 2,
        notes:
          "Ask which weakens a scene more: a vague noun or a weak verb. Keep both possibilities open.",
      },
      {
        kicker: "RETRIEVAL • ORGANISER",
        title: "What belongs inside the frame?",
        time: 4,
        body: `
          <div class="scene-frame">
            <b>restaurant table</b><b>chair</b><b>chessboard</b><b>black-and-white pieces</b><b>metal bars</b><b>Ari's hand</b><b>Ginger Juice's eyes</b>
          </div>
          <p class="thinking-prompt">Choose four details that will help a reader see action and atmosphere—not every object in the chapter.</p>`,
        task: {
          do: "Record four precise scene details.",
          work: "Pairs",
          record: "Organiser: scene evidence bank",
          time: "4 minutes",
          finish: "Four selected details",
          check: "Each detail must serve the scene.",
        },
        notes:
          "The pre-reading assumption applies. Use the fallback summary for students who missed the chapter.",
      },
      {
        kicker: "MISSION",
        title: "Describe precisely without overloading",
        time: 3,
        body: `
          <div class="lens-pair">
            <article><small>YEAR 5 EMPHASIS</small><b>NOUN-GROUP LENS</b><span>Who or what, made exact</span></article>
            <article><small>YEAR 6 EMPHASIS</small><b>ACTION LENS</b><span>Verb + useful circumstance</span></article>
          </div>
          <div class="product-callout"><strong>Shared response:</strong> 6-8 third-person sentences • one restrained scene</div>`,
        task: {
          do: "Mark the year-level lens that will be specifically checked.",
          work: "Independent",
          record: "Organiser heading",
          time: "3 minutes",
          finish: "One lens marked and explained",
          check: "Everyone may use both lenses.",
        },
        notes:
          "Keep the class together. Assessment emphasis differs; access to both craft tools does not.",
      },
      {
        kicker: "TWO-LENS LAB 1 • ORGANISER",
        title: "Bring the participant into focus",
        time: 5,
        body: `
          <div class="lens-builder">
            <span>Ari moved</span>
            <button class="reveal-card" data-reveal="useful: identifies the table's usual function">the restaurant table</button>
            <button class="reveal-card" data-reveal="possible: adds placement if the scene needs it">the heavy restaurant table near the cage</button>
            <button class="reveal-card" data-reveal="overloaded: colour and age do not currently matter">the heavy, old, scratched, dark-brown restaurant table</button>
          </div>`,
        task: {
          do: "Draft two noun-group alternatives. Cross out any addition that earns no place.",
          work: "Pairs",
          record: "Organiser: noun-group lens",
          time: "5 minutes",
          finish: "Two alternatives and one justified deletion",
          check: "Every addition must clarify the scene.",
        },
        notes:
          "Do not teach length as quality. Ask what each addition contributes and what the reader already knows.",
      },
      {
        kicker: "TWO-LENS LAB 2 • ORGANISER",
        title: "Make the action exact",
        time: 5,
        body: `
          <div class="verb-spectrum">
            <button class="reveal-card" data-reveal="vague">moved</button>
            <button class="reveal-card" data-reveal="precise effort">dragged</button>
            <button class="reveal-card" data-reveal="different action—not supported here">hurled</button>
            <button class="reveal-card" data-reveal="useful circumstance if placement matters">dragged beside the cage</button>
          </div>
          <p class="thinking-prompt">Which choice shows the exact action without inventing drama?</p>`,
        task: {
          do: "Draft two action alternatives and label what each clarifies.",
          work: "Pairs",
          record: "Organiser: verb/adverbial lens",
          time: "5 minutes",
          finish: "Two alternatives and two function labels",
          check: "Precision must remain textually plausible.",
        },
        notes:
          "This is especially important for Year 6: more dramatic is not automatically more precise.",
      },
      {
        kicker: "MERGE AND JUDGE",
        title: "Use both lenses. Keep only what earns its place.",
        time: 4,
        body: `
          <div class="before-after">
            <article><small>PRECISE</small><p>After the lunch rush, Ari dragged the restaurant table beside the metal cage.</p></article>
            <article><small>OVERLOADED</small><p>After the extremely busy and noisy lunch rush, thoughtful young Ari slowly and carefully dragged the heavy, old, scratched, dark-brown restaurant table right beside the cold, hard, unkind metal cage.</p></article>
          </div>`,
        task: {
          do: "Select the stronger sentence and justify three deletions from the overloaded version.",
          work: "Independent, then class comparison",
          record: "Organiser: merge and judge",
          time: "4 minutes",
          finish: "One selection and three deletions",
          check: "Keep meaning; remove clutter.",
        },
        notes:
          "Some detail from the overloaded sentence could be defended in a different purpose. Here the goal is a restrained snapshot.",
      },
      {
        kicker: "SECOND LAB SENTENCE",
        title: "Ginger Juice watches",
        time: 3,
        body: `
          <div class="clause-display single"><span>Ginger Juice watched the pieces.</span></div>
          <div class="word-bank"><b>her patient, observant eyes</b><b>followed</b><b>the black-and-white pieces</b><b>across the board</b></div>`,
        task: {
          do: "Upgrade the sentence using your year-level lens.",
          work: "Independent",
          record: "Organiser",
          time: "3 minutes",
          finish: "One precise revised sentence",
          check: "Do not claim that she understands chess.",
        },
        notes:
          "This prepares the perspective boundary for Lesson 14 without doing the full comparison.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "The chessboard beside the cage",
        time: 5,
        body: `
          <div class="model-text">
            <button class="annot" data-reveal="ADVERBIAL • positions the moment">After the lunch rush, Ari dragged the restaurant table beside the cage.</button>
            <button class="annot" data-reveal="EXPANDED NOUN GROUP • makes the object exact">He arranged the small black-and-white chess pieces across the worn board.</button>
            <button class="annot" data-reveal="PRECISE VERB • shows movement without claiming understanding">Behind the bars, Ginger Juice's patient eyes followed the shifting patterns.</button>
            <button class="annot" data-reveal="RESTRAINED CLOSE • action carries atmosphere">When Ari reached through the bars, her broad hand closed gently around his.</button>
          </div>`,
        task: {
          do: "Predict which words carry each lens and which details could be cut.",
          work: "Whole class",
          record: "Star one decision on the organiser",
          time: "5 minutes",
          finish: "One decision selected for imitation",
          check: "Description remains third person and evidence-grounded.",
        },
        notes:
          "Read the whole model first. Avoid interpreting their internal perspectives in depth.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Change the camera distance",
        depth: true,
        time: 10,
        body: `
          <div class="compare-panel">
            <article><span>WIDE SHOT</span><b>table • cage • restaurant space • placement</b></article>
            <article><span>CLOSE-UP</span><b>hand • fur • chess piece • eye movement</b></article>
          </div>
          <p class="thinking-prompt">Write one sentence at each distance. Which grammatical details belong in each frame?</p>`,
        task: {
          do: "Write one wide-shot sentence and one close-up sentence.",
          work: "Independent",
          record: "Workbook margin",
          time: "8-10 minutes",
          finish: "Two sentences and one comparison",
          check: "Change selection—not the event.",
        },
        notes:
          "Optional depth. This increases selection and purpose rather than volume.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Edit precision out of excess",
        depth: true,
        time: 8,
        body: `
          <div class="overload-line">The very patient, extremely calm, sadly trapped, large orange orangutan watched the tiny, little, miniature pieces very carefully and extremely closely.</div>
          <p class="thinking-prompt">Remove repetition, contradiction and empty intensifiers. Preserve the strongest image.</p>`,
        task: {
          do: "Edit the sentence down, then justify two removals.",
          work: "Pairs",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "One clean revision and two reasons",
          check: "Shorter is useful only when meaning improves.",
        },
        notes:
          "Optional depth. Accept different clean revisions when students can defend the retained focus.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write The Chessboard Beside the Cage",
        time: 13,
        timer: 13,
        body: `
          <div class="writing-brief">
            <h3>6-8 third-person sentences</h3>
            <ul><li>Table and board arrive</li><li>Pieces are arranged</li><li>Ginger Juice watches</li><li>Ari studies</li><li>Touch through the bars</li><li>Restrained closing atmosphere</li></ul>
            <p><b>Year 5:</b> three expanded noun groups. <b>Year 6:</b> three precise verbs + two purposeful adverbials.</p>
          </div>`,
        task: {
          do: "Write the complete descriptive snapshot.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "13 minutes",
          finish: "6-8 coherent third-person sentences",
          check: "Precision—not maximum detail.",
        },
        notes:
          "Do not require a full perspective analysis. Lesson 14 owns that cognitive work.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Clean both lenses",
        time: 4,
        body: checklist([
          "Every added word contributes useful meaning.",
          "My verbs show the exact action.",
          "The description remains coherent and restrained.",
          "I kept the scene in third person.",
          "Year 5: three expanded noun groups.",
          "Year 6: three precise verbs and two purposeful adverbials.",
          "I revised one vague or overloaded sentence.",
        ]),
        task: {
          do: "Mark the common and year-level checks. Revise one sentence.",
          work: "Independent",
          record: "Workbook snapshot",
          time: "4 minutes",
          finish: "One visible revision",
          check: "Delete as willingly as you add.",
        },
        notes:
          "Selected examples should show purposeful restraint as well as successful expansion.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "Box your most precise sentence",
        time: 2,
        body: `<div class="exit-line">The deliberate choice is <span>________________</span>. It clarifies <span>________________</span>.</div>`,
        task: {
          do: "Box one sentence and label the deliberate noun or action choice.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One boxed sentence and one explanation",
          check: "Name what the choice clarifies.",
        },
        notes:
          "Safe stopping point. Collect evidence separately by year-level emphasis.",
      },
    ],
    organiser: {
      subtitle: "Two-Lens Sentence Lab",
      sections: [
        {
          title: "1. Scene evidence",
          columns: ["Detail 1", "Detail 2", "Detail 3", "Detail 4"],
          rows: [["", "", "", ""]],
        },
        {
          title: "2. Noun-group lens",
          columns: ["Base noun", "Useful additions", "What each addition clarifies"],
          rows: [
            ["", "", ""],
            ["", "", ""],
          ],
        },
        {
          title: "3. Verb / adverbial lens",
          columns: ["Weak verb", "Precise verb", "Useful circumstance"],
          rows: [
            ["", "", ""],
            ["", "", ""],
          ],
        },
        {
          title: "4. Snapshot sequence",
          columns: ["Table", "Pieces", "Watching", "Studying", "Touch", "Close"],
          rows: [["", "", "", "", "", ""]],
        },
      ],
    },
    lucas: {
      subtitle: "Exact describing and action words",
      instruction:
        "Choose useful words. You may point, speak, copy or ask a partner to write.",
      stages: [
        ["NOUNS", "Ari • table • chess pieces • cage • hand • Ginger Juice"],
        ["DESCRIBE", "small • wooden • black-and-white • metal • gentle"],
        ["ACTIONS", "drags • places • watches • reaches • holds"],
      ],
      choices: ["small table", "black-and-white pieces", "gently holds"],
      response: [
        "Ari drags _______________________________________________.",
        "He places _______________________________________________.",
        "Ginger Juice watches ____________________________________.",
        "Ari gently ______________________________________________.",
      ],
    },
  },
  {
    number: 14,
    title: "Double Vision",
    shortTitle: "Comparing Contrasting Perspectives",
    metaphor: "DOUBLE-VISION BOARD",
    accent: "#7FAF72",
    dark: "#193E38",
    premise: "Two characters can share one moment without sharing its meaning.",
    purpose:
      "Students compare Ari's interpretation of the chessboard interaction with Ginger Juice's sensory experience. They write two evidence-grounded internal monologues that reveal difference, overlap and the communication barrier.",
    curriculum: [
      "Year 5 - AC9E5LA06: understand how grammatical and vocabulary choices expand description and viewpoint.",
      "Year 6 - AC9E6LA06: understand how verb and adverb choices expand ideas and character perspective.",
    ],
    learning:
      "We are learning to represent two contrasting perspectives on the same moment while preserving what each character can and cannot know.",
    criteria: [
      "I can classify details as Ari's interpretation, Ginger Juice's experience or genuine overlap.",
      "I can explain the misunderstanding around the chessboard.",
      "I can distinguish supported thought, reasonable inference and impossible mind-reading.",
      "I can write two distinct internal monologues grounded in evidence.",
      "I can include one meaningful overlap and revise one viewpoint slip.",
    ],
    response:
      "A Dual Internal Monologue: 5-7 sentences from Ari followed by 5-7 sentences from Ginger Juice, both describing the same chessboard moment.",
    readingFallback:
      "Ari believes Ginger Juice follows or approves of his chess play. Ginger Juice watches patterns and colours but does not understand his human words. Ari's touch provides warmth and helps keep the haze away. Both experience comfort, but they interpret the moment differently.",
    slides: [
      {
        kicker: "BERANI • LESSON 14",
        title: "Double Vision",
        hero: true,
        time: 2,
        notes:
          "Ask students to predict one thing Ari may misunderstand. Do not confirm until evidence is retrieved.",
      },
      {
        kicker: "RETRIEVAL • ORGANISER",
        title: "One moment. Two accounts.",
        time: 3,
        body: `
          <div class="sort-wrap">
            <div class="sort-bank">
              ${[
                ["believes she follows the chess moves", "ari"],
                ["watches patterns and colours", "ginger"],
                ["does not understand his human words", "ginger"],
                ["reaches through the bars", "ari"],
                ["experiences warmth through touch", "both"],
                ["sits calmly beside the cage", "both"],
              ]
                .map(
                  ([t, a]) =>
                    `<button class="sort-card" data-answer="${a}">${t}</button>`
                )
                .join("")}
            </div>
            <div class="sort-zones three">
              <div class="sort-zone" data-zone="ari"><h3>ARI</h3><p>interprets</p></div>
              <div class="sort-zone" data-zone="ginger"><h3>GINGER JUICE</h3><p>experiences</p></div>
              <div class="sort-zone" data-zone="both"><h3>BOTH</h3><p>share</p></div>
            </div>
          </div>
          <div class="action-row"><button class="btn check-sort">Check the first view</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Classify all six details. Do not check until your organiser is complete.",
          work: "Pairs",
          record: "Organiser: Double-Vision Board",
          time: "3 minutes",
          finish: "Six classified details",
          check: "Interpretation and experience are not the same.",
        },
        notes:
          "Some details are simplified for retrieval. The next slides complicate watching and touch. Use the fallback summary when needed.",
      },
      {
        kicker: "MISSION",
        title: "Reveal the gap",
        time: 2,
        body: `
          <div class="mission-grid">
            <article><b>ARI THINKS</b><span>his interpretation</span></article>
            <article><b>GINGER EXPERIENCES</b><span>her sensory reality</span></article>
            <article><b>BOTH SHARE</b><span>the honest overlap</span></article>
          </div>
          <div class="product-callout"><strong>Finished response:</strong> two internal monologues • same moment • distinct knowledge</div>`,
        task: {
          do: "Complete: Ari thinks ___, while Ginger Juice ___.",
          work: "Partner rehearsal",
          record: "Organiser opening line",
          time: "2 minutes",
          finish: "One accurate contrast",
          check: "Do not make Ari completely wrong or Ginger Juice humanly all-knowing.",
        },
        notes:
          "Establish perspective as selected attention, knowledge and interpretation.",
      },
      {
        kicker: "DOUBLE-VISION BOARD • ORGANISER",
        title: "Place the clear details first",
        time: 5,
        body: `
          <div class="vision-board">
            <article><small>ARI INTERPRETS</small><b>approval • shared strategy • companionship</b></article>
            <article><small>GINGER JUICE EXPERIENCES</small><b>patterns • colours • human chatter • haze</b></article>
            <article><small>BOTH SHARE</small><b>proximity • touch • temporary calm</b></article>
          </div>`,
        task: {
          do: "Complete all three columns and add one textual clue for each.",
          work: "Pairs",
          record: "Organiser: three-column board",
          time: "5 minutes",
          finish: "Three columns with evidence clues",
          check: "A clue must support the placement.",
        },
        notes:
          "Require evidence before adding class ideas to the projected board.",
      },
      {
        kicker: "DIFFICULT DETAIL 1",
        title: "They both watch the chessboard—but not the same thing",
        time: 4,
        body: `
          <div class="split-vision">
            <article><small>ARI'S VIEW</small><p>Her eyes follow the pieces. She seems to nod or warn him.</p><b>He interprets attention as chess understanding.</b></article>
            <article><small>GINGER JUICE'S VIEW</small><p>She likes the patterns and colours. She does not try to understand his words.</p><b>She experiences visual interest, not shared strategy.</b></article>
          </div>`,
        task: {
          do: "Write what each character thinks the watching means.",
          work: "Independent, then compare",
          record: "Organiser: difficult detail row 1",
          time: "4 minutes",
          finish: "Two different meanings",
          check: "The physical detail may overlap; the interpretation does not.",
        },
        notes:
          "This is the central misconception. Avoid saying Ginger Juice has no intelligence; the text shows different attention and communication.",
      },
      {
        kicker: "DIFFICULT DETAIL 2",
        title: "Touch creates real comfort—and unequal understanding",
        time: 4,
        body: `
          <div class="split-vision">
            <article><small>ARI'S VIEW</small><p>Holding her hand recalls their earlier closeness and calms his thoughts.</p></article>
            <article><small>GINGER JUICE'S VIEW</small><p>His smooth skin and living heartbeat bring warmth and help keep the haze away.</p></article>
            <article class="overlap"><small>TRUE OVERLAP</small><p>Both experience connection and temporary calm.</p></article>
          </div>`,
        task: {
          do: "Record one honest overlap and one important difference.",
          work: "Pairs",
          record: "Organiser: difficult detail row 2",
          time: "4 minutes",
          finish: "One overlap and one difference",
          check: "Do not reduce the scene to 'Ari is wrong about everything'.",
        },
        notes:
          "This nuance prevents a one-right-answer judgement and gives both monologues emotional truth.",
      },
      {
        kicker: "EVIDENCE BOUNDARY",
        title: "Supported thought, inference—or impossible mind-reading?",
        time: 3,
        body: `
          <div class="choice-set three">
            <button class="reveal-card" data-reveal="SUPPORTED • Ari explicitly interprets her movements this way.">Ari believes Ginger Juice may approve of a move.</button>
            <button class="reveal-card" data-reveal="REASONABLE INFERENCE • warmth and touch support comfort.">Ginger Juice feels less alone while Ari holds her hand.</button>
            <button class="reveal-card" data-reveal="IMPOSSIBLE FOR ARI TO KNOW • readers know this from her narration.">Ari knows his touch keeps the haze away.</button>
          </div>`,
        task: {
          do: "Label each claim supported, inferred or impossible for that character to know.",
          work: "Independent first; reveal",
          record: "Organiser: evidence boundary",
          time: "3 minutes",
          finish: "Three labels and one explanation",
          check: "The reader may know more than either character.",
        },
        notes:
          "Keep the distinction between authorial evidence and character knowledge explicit.",
      },
      {
        kicker: "ANNOTATED MIRRORED MODEL",
        title: "Same moment. Different inner worlds.",
        time: 5,
        body: `
          <div class="dual-model">
            <article><small>ARI</small><p>I slide the bishop across the board and notice her eyes follow it. Perhaps she understands more than Uncle thinks. When she holds my hand, my thoughts finally settle.</p></article>
            <article><small>GINGER JUICE</small><p>Black, white, black, white. Slow Loris Boy moves the little shapes and chatters. I do not know his words. I hold his smooth hand and feel the beat of another life. The haze stays away.</p></article>
          </div>
          <div class="annotation-row"><button class="reveal-card" data-reveal="ARI • interpretation and assumption">belief</button><button class="reveal-card" data-reveal="GINGER JUICE • sensory focus and limited language">experience</button><button class="reveal-card" data-reveal="READER • sees the misunderstanding and the true connection">dramatic irony</button></div>`,
        task: {
          do: "Read both models. Identify belief, experience and what the reader understands.",
          work: "Whole class",
          record: "Star one voice distinction on the organiser",
          time: "5 minutes",
          finish: "One selected voice decision",
          check: "Each voice knows only what the text permits.",
        },
        notes:
          "Read both monologues before revealing labels. Discuss how the reader can recognise misunderstanding and real connection simultaneously.",
      },
      {
        kicker: "PLAN BOTH VOICES • ORGANISER",
        title: "Mirror the moment—not the meaning",
        time: 3,
        body: `
          <div class="mirror-plan">
            <article><small>ARI</small><b>notices → assumes → remembers → feels</b></article>
            <span>SAME PHYSICAL MOMENT</span>
            <article><small>GINGER JUICE</small><b>senses → cannot understand → remembers → feels</b></article>
          </div>`,
        task: {
          do: "Plan each voice and the shared moment that connects them.",
          work: "Independent",
          record: "Organiser: mirrored plan",
          time: "3 minutes",
          finish: "Four notes per voice and one overlap",
          check: "Do not copy the same meaning into both sides.",
        },
        notes:
          "Confer with students whose two plans merely swap pronouns.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Add the reader's third perspective",
        depth: true,
        time: 10,
        body: `
          <div class="vision-board reader">
            <article><small>ARI KNOWS</small><b>her visible attention and touch</b></article>
            <article><small>GINGER JUICE KNOWS</small><b>patterns, warmth and haze</b></article>
            <article><small>READER UNDERSTANDS</small><b>misunderstanding + genuine connection</b></article>
          </div>
          <p class="thinking-prompt">Explain how access to both narrators creates dramatic irony.</p>`,
        task: {
          do: "Write a 3-4 sentence reader-perspective explanation.",
          work: "Independent",
          record: "Workbook margin",
          time: "8-10 minutes",
          finish: "One evidence-based explanation",
          check: "Name what the reader knows that a character does not.",
        },
        notes:
          "Optional depth. This shifts from creative voice to literary analysis.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Write the hinge between voices",
        depth: true,
        time: 8,
        body: `
          <div class="hinge-line">His hand stays still around hers. <span>— SHIFT —</span> Her hand feels the beat of another life.</div>
          <p class="thinking-prompt">Write one transition that preserves the physical moment while changing its meaning.</p>`,
        task: {
          do: "Draft two hinge options and choose the cleaner shift.",
          work: "Pairs",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "Two options and one selected hinge",
          check: "Shift perspective without explaining everything.",
        },
        notes:
          "Optional depth. The hinge can be used between the final monologues if it remains unobtrusive.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write the Dual Internal Monologue",
        time: 13,
        timer: 13,
        body: `
          <div class="writing-brief">
            <h3>Two voices • same chessboard moment</h3>
            <ul><li>Ari: 5-7 sentences</li><li>Ginger Juice: 5-7 sentences</li><li>Distinct focus and language</li><li>Accurate evidence</li><li>One genuine overlap</li><li>Preserve what each cannot know</li></ul>
          </div>`,
        task: {
          do: "Write both internal monologues.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "13 minutes",
          finish: "Two complete, distinct voices",
          check: "Same event; different interpretation.",
        },
        notes:
          "Students may use the mirrored model as a structural guide but must create their own monologues.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Clear the double image",
        time: 4,
        body: checklist([
          "Both monologues describe the same physical moment.",
          "Ari's voice reveals interpretation—not complete truth.",
          "Ginger Juice's voice uses sensory experience and limited human-language understanding.",
          "I used evidence from both chapters.",
          "I included one meaningful overlap.",
          "I removed any thought the character could not know.",
          "I revised one line so the voices sound distinct.",
        ]),
        task: {
          do: "Mark every check and revise one voice slip or unsupported thought.",
          work: "Independent",
          record: "Workbook monologues",
          time: "4 minutes",
          finish: "One visible revision",
          check: "Difference and overlap must both survive.",
        },
        notes:
          "Selected examples should include one successful overlap, not only sharp contrast.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "State the gap in one sentence",
        time: 2,
        body: `<div class="exit-line">Ari believes <span>________</span>; Ginger Juice experiences <span>________</span>; both <span>________</span>.</div>`,
        task: {
          do: "Complete the sentence with one difference and one overlap.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One complete three-part sentence",
          check: "Every clause must be textually defensible.",
        },
        notes:
          "Safe stopping point. Use omissions to diagnose whether students understand overlap as well as contrast.",
      },
    ],
    organiser: {
      subtitle: "Double-Vision Board + Mirrored Plan",
      sections: [
        {
          title: "1. Double-Vision Board",
          columns: ["Ari interprets", "Ginger Juice experiences", "Both share"],
          rows: [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ],
        },
        {
          title: "2. Difficult details",
          columns: ["Detail", "Ari's meaning", "Ginger Juice's meaning", "True overlap"],
          rows: [
            ["Watching chess", "", "", ""],
            ["Touch / companionship", "", "", ""],
          ],
        },
        {
          title: "3. Evidence boundary",
          columns: ["Supported", "Reasonable inference", "Impossible for this character to know"],
          rows: [["", "", ""]],
        },
        {
          title: "4. Mirrored monologue plan",
          columns: ["Voice", "Notices", "Believes / understands", "Cannot know", "Shared moment"],
          rows: [
            ["Ari", "", "", "", ""],
            ["Ginger Juice", "", "", "", ""],
          ],
        },
      ],
    },
    lucas: {
      subtitle: "Two characters, two thoughts",
      instruction:
        "Match one thought to each character. Then choose what they both share. You may point, speak, copy or ask a partner to write.",
      stages: [
        ["ARI THINKS", "She likes my chess game."],
        ["GINGER JUICE THINKS", "I like the colours. His hand feels warm."],
        ["BOTH SHARE", "They sit together."],
      ],
      choices: ["Ari", "Ginger Juice", "both"],
      response: [
        "Ari thinks ______________________________________________.",
        "Ginger Juice thinks ______________________________________.",
        "Both ____________________________________________________.",
      ],
    },
  },
  {
    number: 15,
    title: "The Language Balance",
    accent: "#d9684b",
    dark: "#0b302c",
    premise:
      "A statement can sound neutral and still frame the issue. Test the wording.",
    metaphor: "LANGUAGE SCALES",
    purpose:
      "Students distinguish objective information from subjective positioning in the principal's meeting, then explain how both kinds of language shape a reader's judgement.",
    curriculum: [
      "Year 5 - AC9E5LA06: understand how vocabulary choices add precision and shape viewpoint.",
      "Year 6 - AC9E6LA06: understand how language choices expand ideas and position a reader.",
    ],
    learning:
      "We are learning to distinguish objective information from subjective positioning and explain the effect of each choice.",
    criteria: [
      "I can identify language that can be checked independently.",
      "I can identify judgement, emotion and loaded wording.",
      "I can explain that a statement may contain both objective and subjective elements.",
      "I can compare how Mr Ahmad and Malia position the issue.",
      "I can revise one unsupported classification after checking the wording.",
    ],
    response:
      "A Language Balance analysis: classify six statements from the meeting, then write 6-8 sentences explaining how objective and subjective language position the reader.",
    readingFallback:
      "At a meeting about Malia's suspension, Mr Ahmad says palm oil supports farmers and the Indonesian economy and presents the apology as a simple formality. Malia believes his account is untrue, unfair and incomplete. The school will not allow her to return unless she signs, and Mrs Harwono's return is also linked to Malia's decision.",
    slides: [
      {
        kicker: "BERANI • LESSON 15",
        title: "The Language Balance",
        hero: true,
        time: 2,
        notes:
          "Ask: Which sounds more trustworthy—a sentence with no emotion, or a sentence with evidence? Keep the distinction open.",
      },
      {
        kicker: "ENTRY • QUICK JUDGEMENT",
        title: "Neutral—or only neutral-sounding?",
        time: 4,
        body: `
          <div class="choice-set three">
            <button class="reveal-card" data-reveal="CHECKABLE CLAIM • It still needs a source.">Palm oil supports many farmers.</button>
            <button class="reveal-card" data-reveal="SUBJECTIVE JUDGEMENT • The adjective evaluates the situation.">The policy is unfair.</button>
            <button class="reveal-card" data-reveal="MIXED • A checkable action plus loaded framing.">The school simply needs one harmless signature.</button>
          </div>`,
        task: {
          do: "Classify each statement before revealing: objective, subjective or mixed.",
          work: "Independent, then pair",
          record: "Organiser: first three rows",
          time: "4 minutes",
          finish: "Three decisions with one reason each",
          check: "Neutral tone does not prove truth.",
        },
        notes:
          "Expose the misconception that objective means true and subjective means false. Objective claims still require verification.",
      },
      {
        kicker: "MISSION",
        title: "Judge the language—not the speaker",
        time: 2,
        body: `
          <div class="mission-grid">
            <article><b>OBJECTIVE</b><span>checkable information</span></article>
            <article><b>SUBJECTIVE</b><span>judgement, emotion, evaluation</span></article>
            <article><b>MIXED</b><span>information framed by a viewpoint</span></article>
          </div>
          <div class="product-callout"><strong>Finished response:</strong> six classifications + a 6-8 sentence positioning analysis</div>`,
        task: {
          do: "Write one test you can use when a statement is difficult.",
          work: "Partner rehearsal",
          record: "Organiser: decision rule",
          time: "2 minutes",
          finish: "One usable test",
          check: "Ask what can be checked and what evaluates.",
        },
        notes:
          "Keep fact/opinion language available, but introduce objective/subjective/mixed as the more precise continuum.",
      },
      {
        kicker: "TEXT LAB • PAGES 87-91",
        title: "One meeting. Competing frames.",
        time: 5,
        body: `
          <div class="split-vision">
            <article><small>MR AHMAD'S FRAME</small><p>prosperity • sustainable industry • misunderstanding • formality</p></article>
            <article><small>MALIA'S FRAME</small><p>untrue • unfair • propaganda • consequences</p></article>
            <article class="overlap"><small>SHARED EVENTS</small><p>suspension • apology letter • conditions for returning</p></article>
          </div>`,
        task: {
          do: "Collect two checkable details and two evaluative word choices.",
          work: "Pairs",
          record: "Organiser: evidence bank",
          time: "5 minutes",
          finish: "Four accurately placed details",
          check: "Record exact words or a careful paraphrase.",
        },
        notes:
          "Students should notice that the same meeting contains shared events but different interpretations.",
      },
      {
        kicker: "CLASSIFICATION • ORGANISER",
        title: "Place the statement—then defend the boundary",
        time: 6,
        body: `
          <div class="sort-wrap">
            <div class="sort-bank">
              ${[
                ["Malia has been suspended.", "objective"],
                ["The industry provides prosperity.", "mixed"],
                ["The account is untrue and unfair.", "subjective"],
                ["The school drafted an apology letter.", "objective"],
                ["The apology is just a formality.", "subjective"],
                ["Malia cannot return unless she signs.", "objective"],
              ].map(([t,a]) => `<button class="sort-card" data-answer="${a}">${t}</button>`).join("")}
            </div>
            <div class="sort-zones three">
              <div class="sort-zone" data-zone="objective"><h3>OBJECTIVE</h3><p>checkable</p></div>
              <div class="sort-zone" data-zone="subjective"><h3>SUBJECTIVE</h3><p>evaluative</p></div>
              <div class="sort-zone" data-zone="mixed"><h3>MIXED</h3><p>claim + frame</p></div>
            </div>
          </div>
          <div class="action-row"><button class="btn check-sort">Check the balance</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Classify all six. For the mixed statement, underline the claim and circle the framing word.",
          work: "Pairs",
          record: "Organiser: classification table",
          time: "6 minutes",
          finish: "Six placements and one language annotation",
          check: "A defensible reason matters more than a quick label.",
        },
        notes:
          "Treat 'provides prosperity' as mixed because it makes a potentially checkable economic claim through broad positive evaluation.",
      },
      {
        kicker: "LANGUAGE AUDIT",
        title: "What job does the wording perform?",
        time: 4,
        body: `
          <div class="vision-board">
            <article><small>MINIMISE</small><b>just • simply • formality</b></article>
            <article><small>LEGITIMISE</small><b>supported • sustainable • prosperity</b></article>
            <article><small>CONDEMN</small><b>untrue • unfair • propaganda</b></article>
          </div>`,
        task: {
          do: "Choose one word from each frame and explain its effect.",
          work: "Independent, then compare",
          record: "Organiser: effect row",
          time: "4 minutes",
          finish: "Three word-effect links",
          check: "Name what the word encourages the reader to think.",
        },
        notes:
          "Move beyond spotting: students must explain positioning. Accept other defensible effect verbs.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "A balanced analysis does not become neutral mush",
        time: 5,
        body: `
          <div class="model-passage">
            <p>Mr Ahmad includes checkable details, such as the school's drafted apology and the condition placed on Malia's return. However, he calls the apology <mark>just a formality</mark>, language that minimises its consequences. Malia's labels <mark>untrue and unfair</mark> are openly subjective, but they reveal her ethical judgement rather than proving the policy is false. The contrast positions readers to question whose version is complete.</p>
          </div>
          <div class="annotation-row"><button class="reveal-card" data-reveal="EVIDENCE • names a checkable event">objective detail</button><button class="reveal-card" data-reveal="EFFECT • explains minimising language">positioning</button><button class="reveal-card" data-reveal="NUANCE • distinguishes judgement from proof">balanced reasoning</button></div>`,
        task: {
          do: "Find evidence, effect and nuance before revealing the labels.",
          work: "Whole class",
          record: "Star one sentence move to imitate",
          time: "5 minutes",
          finish: "Three model decisions identified",
          check: "The paragraph analyses both voices without pretending they are equally supported.",
        },
        notes:
          "This is an original teacher model, not a quotation. Emphasise that balance means fair analysis, not forced equivalence.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Rewrite the frame, preserve the event",
        depth: true,
        time: 8,
        body: `<div class="exit-line">The apology is just a formality. <span>→</span> The school requires Malia to sign an apology before returning.</div><p class="thinking-prompt">What is lost—and what is gained—when the frame becomes more objective?</p>`,
        task: {
          do: "Rewrite two subjective or mixed statements in more objective language.",
          work: "Pairs",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "Two rewrites and one effect comment",
          check: "Preserve the checkable event.",
        },
        notes:
          "Optional depth. Students should recognise that objective wording can reduce viewpoint but cannot supply missing evidence.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Source check: objective is not automatically proven",
        depth: true,
        time: 8,
        body: `<div class="mission-grid"><article><b>CLAIM</b><span>What is asserted?</span></article><article><b>SOURCE</b><span>Who supports it?</span></article><article><b>MISSING</b><span>What would verify it?</span></article></div>`,
        task: {
          do: "Audit the claim that the industry provides prosperity.",
          work: "Small groups",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "Claim, named source and missing evidence",
          check: "Do not invent outside evidence.",
        },
        notes:
          "Optional depth. Keep this as a source-evaluation exercise using only what the chapter identifies.",
      },
      {
        kicker: "PLAN • ORGANISER",
        title: "Build the explanation before the paragraph",
        time: 4,
        body: `<div class="mirror-plan"><article><small>DETAIL 1</small><b>classify → quote/paraphrase → effect</b></article><span>COMPARE</span><article><small>DETAIL 2</small><b>classify → quote/paraphrase → effect</b></article></div>`,
        task: {
          do: "Plan one detail from Mr Ahmad and one from Malia, then write the comparison insight.",
          work: "Independent",
          record: "Organiser: analysis planner",
          time: "4 minutes",
          finish: "Two evidence-effect chains and one comparison",
          check: "Each effect must connect to the wording.",
        },
        notes:
          "Conference first with students who have labels but no explanation of reader positioning.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write the Language Balance analysis",
        time: 12,
        timer: 12,
        body: `<div class="writing-brief"><h3>6-8 sentences</h3><ul><li>Use one checkable detail</li><li>Use one subjective or mixed choice</li><li>Compare the two frames</li><li>Explain two effects on the reader</li><li>Avoid calling objective language automatically true</li></ul></div>`,
        task: {
          do: "Write the analysis using your organiser.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "12 minutes",
          finish: "One complete evidence-based analysis",
          check: "Classification + evidence + effect.",
        },
        notes:
          "Students may use the model structure but must select and explain their own evidence.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Rebalance the reasoning",
        time: 4,
        body: checklist([
          "I classified six statements and justified difficult boundaries.",
          "I used wording from both Mr Ahmad and Malia.",
          "I distinguished a checkable claim from proof.",
          "I explained how at least two choices position the reader.",
          "I revised one vague label or unsupported effect.",
        ]),
        task: {
          do: "Mark every check and revise one weak classification or effect explanation.",
          work: "Independent",
          record: "Organiser and paragraph",
          time: "4 minutes",
          finish: "One visible revision",
          check: "Replace 'it is persuasive' with the exact effect.",
        },
        notes:
          "Use the revision to diagnose whether students can move beyond fact/opinion spotting.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "One claim. One frame. One effect.",
        time: 2,
        body: `<div class="exit-line"><span>________</span> is <span>objective / subjective / mixed</span> because <span>________</span>; it positions the reader to <span>________</span>.</div>`,
        task: {
          do: "Complete the sentence with a fresh example from the meeting.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One justified classification and effect",
          check: "The reason must refer to language or checkability.",
        },
        notes:
          "Safe stopping point. Sort exit responses by confusion about classification versus confusion about effect.",
      },
    ],
    organiser: {
      subtitle: "Language Balance Lab",
      sections: [
        { title: "1. Decision rule", text: "Objective language presents checkable information. Subjective language evaluates or expresses judgement. Mixed language combines a claim with a frame. My test: ______________________________________________" },
        { title: "2. Classify and justify", columns: ["Statement / detail", "Objective, subjective or mixed?", "Evidence in the wording", "Effect"], rows: [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]] },
        { title: "3. Analysis planner", columns: ["Voice", "Selected wording", "Classification", "Reader effect"], rows: [["Mr Ahmad", "", "", ""], ["Malia", "", "", ""]] },
        { title: "4. Comparison insight", text: "Although both speakers describe the same meeting, ______________________________________________ because ______________________________________________." },
      ],
    },
    lucas: {
      subtitle: "Fact, feeling or both?",
      instruction:
        "Look at each statement. Choose fact, feeling or both. You may point, speak, copy or ask a partner to write.",
      stages: [
        ["FACT", "Malia cannot return unless she signs."],
        ["FEELING", "Malia says the situation is unfair."],
        ["BOTH", "The principal calls the apology a simple formality."],
      ],
      choices: ["fact", "feeling", "both"],
      response: [
        "This is a fact: __________________________________________.",
        "This shows a feeling: ____________________________________.",
        "The word __________________ makes it sound _______________.",
      ],
    },
  },
  {
    number: 16,
    title: "The Character Verdict",
    accent: "#c75b42",
    dark: "#0b302c",
    premise:
      "A strong literary opinion is arguable, evidence-based and fair to another view.",
    metaphor: "EVIDENCE COURT",
    purpose:
      "Students formulate a defensible literary opinion about a major character's choice, using precise evidence, explanation and a fair counterview.",
    curriculum: [
      "Year 5 - AC9E5LE03: recognise how point of view influences reader response to characters and events.",
      "Year 6 - AC9E6LE01: identify and explain responses to characters drawn from social and ethical contexts.",
    ],
    learning:
      "We are learning to form a literary opinion that is arguable, evidence-based and fair to another interpretation.",
    criteria: [
      "I can turn a reaction into a precise judgement.",
      "I can select evidence that directly supports my judgement.",
      "I can explain how the evidence proves my point.",
      "I can acknowledge a reasonable counterview.",
      "I can write and revise a coherent 100-word literary opinion.",
    ],
    response:
      "A 100-word Character Verdict paragraph judging one significant choice made by Malia, Ari, Uncle Kus or Mrs Harwono in pages 1-91.",
    readingFallback:
      "Across pages 1-91, Malia petitions against anti-palm-oil labelling and faces suspension and a forced apology; Ari pursues school and chess while carrying guilt about Suni and caring for Ginger Juice; Uncle Kus keeps Ginger Juice as the restaurant mascot; Mrs Harwono supports student inquiry and later signs an apology under pressure.",
    slides: [
      {
        kicker: "BERANI • LESSON 16",
        title: "The Character Verdict",
        hero: true,
        time: 2,
        notes:
          "Ask students to choose quickly: Is a character easier to judge when we know their reasons? Collect two opposing responses.",
      },
      {
        kicker: "ENTRY • OPINION TEST",
        title: "Reaction—or literary judgement?",
        time: 4,
        body: `
          <div class="choice-set three">
            <button class="reveal-card" data-reveal="REACTION • personal response without a reason">I like Malia.</button>
            <button class="reveal-card" data-reveal="ASSERTION • a judgement, but still unsupported">Malia is courageous.</button>
            <button class="reveal-card" data-reveal="DEFENSIBLE VERDICT • criterion + context">Malia acts courageously because she risks her place at school rather than immediately sign a statement she believes is untrue.</button>
          </div>`,
        task: {
          do: "Rank the three statements from weakest to strongest and name what improves.",
          work: "Pairs",
          record: "Organiser: verdict test",
          time: "4 minutes",
          finish: "A ranking and two improvement features",
          check: "A strong opinion is contestable and supportable.",
        },
        notes:
          "Avoid presenting the final wording as the only legitimate judgement. Its strength comes from precision and evidence.",
      },
      {
        kicker: "MISSION",
        title: "Make a case a thoughtful reader could challenge",
        time: 2,
        body: `
          <div class="mission-grid">
            <article><b>VERDICT</b><span>your precise judgement</span></article>
            <article><b>EVIDENCE</b><span>the strongest scene detail</span></article>
            <article><b>REASONING</b><span>why the detail proves it</span></article>
          </div>
          <div class="product-callout"><strong>Finished response:</strong> a 100-word Character Verdict with a fair counterview</div>`,
        task: {
          do: "Select one character and one choice worth judging.",
          work: "Independent",
          record: "Organiser: case file heading",
          time: "2 minutes",
          finish: "Character + choice",
          check: "Choose a decision, not a personality label.",
        },
        notes:
          "Offer Malia's apology dilemma as the common pathway, while allowing other well-evidenced choices from pages 1-91.",
      },
      {
        kicker: "CASE FILE • RETRIEVAL",
        title: "What did the character choose—and under what pressure?",
        time: 5,
        body: `
          <div class="vision-board">
            <article><small>CHOICE</small><b>What did the character do?</b></article>
            <article><small>PRESSURE</small><b>What made the choice difficult?</b></article>
            <article><small>CONSEQUENCE</small><b>Who or what could be affected?</b></article>
          </div>`,
        task: {
          do: "Complete the three-part case file using accurate chapter details.",
          work: "Pairs with same character",
          record: "Organiser: case file",
          time: "5 minutes",
          finish: "Choice, pressure and consequence",
          check: "Do not judge until the context is accurate.",
        },
        notes:
          "Students choosing Malia should distinguish delaying a signature at page 91 from later decisions not yet read.",
      },
      {
        kicker: "VERDICT CONTINUUM",
        title: "Choose a position with room for nuance",
        time: 5,
        body: `
          <div class="continuum"><span>UNJUSTIFIED</span><i></i><span>UNDERSTANDABLE</span><i></i><span>COURAGEOUS</span></div>
          <p class="thinking-prompt">A choice can be understandable without being completely right. Where does yours sit—and by what criterion?</p>`,
        task: {
          do: "Place your choice on the continuum and define the criterion you used.",
          work: "Four corners / line debate",
          record: "Organiser: provisional verdict",
          time: "5 minutes",
          finish: "Position + criterion + spoken reason",
          check: "Use fairness, courage, responsibility or consequences precisely.",
        },
        notes:
          "Accept defensible positions. Ask what new evidence would cause a student to move.",
      },
      {
        kicker: "EVIDENCE TRIAL",
        title: "Which detail actually proves the verdict?",
        time: 5,
        body: `
          <div class="choice-set three">
            <button class="reveal-card" data-reveal="WEAK • a broad plot summary">The character has many problems.</button>
            <button class="reveal-card" data-reveal="USEFUL • identifies a relevant event">Malia is told she cannot return without signing.</button>
            <button class="reveal-card" data-reveal="STRONGEST • relevant event plus the pressure it creates">The principal links Malia's signature to both her return and Mrs Harwono's position, making the ethical cost of either choice visible.</button>
          </div>`,
        task: {
          do: "Select your strongest evidence and explain why it beats a second option.",
          work: "Independent, then partner challenge",
          record: "Organiser: evidence trial",
          time: "5 minutes",
          finish: "One selected detail and comparison",
          check: "Evidence must support this exact verdict.",
        },
        notes:
          "The displayed statements are teacher paraphrases. Students may use careful paraphrase rather than extended quotation.",
      },
      {
        kicker: "COUNTERVIEW",
        title: "A fair objection strengthens the verdict",
        time: 4,
        body: `
          <div class="split-vision">
            <article><small>MY VERDICT</small><p>Malia is courageous to delay signing.</p></article>
            <article><small>A FAIR READER MIGHT SAY</small><p>Her refusal could worsen the consequences for Mrs Harwono.</p></article>
            <article class="overlap"><small>MY RESPONSE</small><p>The pressure makes the choice complicated, but it also reveals why signing is not a harmless formality.</p></article>
          </div>`,
        task: {
          do: "Draft one fair counterview and a response that keeps your judgement nuanced.",
          work: "Pairs",
          record: "Organiser: counterview",
          time: "4 minutes",
          finish: "Counterview + response",
          check: "Do not invent a foolish opponent.",
        },
        notes:
          "The counterview may modify the verdict. Revision is a sign of stronger thinking.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "Verdict, evidence, reasoning, counterweight",
        time: 5,
        body: `
          <div class="model-passage"><p>Malia's decision to delay signing the apology is courageous, although it may also place others at risk. The principal makes her return to school dependent on her signature and links Mrs Harwono's position to the same decision. This pressure shows that the apology carries real consequences, despite being described as a formality. A reader could argue that signing would protect her teacher. However, Malia believes the statement is untrue, so signing immediately would abandon the purpose of her activism. Her pause is therefore not simple stubbornness; it is an attempt to weigh truth against responsibility.</p></div>
          <div class="annotation-row"><button class="reveal-card" data-reveal="VERDICT • precise and qualified">claim</button><button class="reveal-card" data-reveal="EVIDENCE + REASONING • detail is interpreted">proof</button><button class="reveal-card" data-reveal="COUNTERWEIGHT • fair alternative answered">nuance</button></div>`,
        task: {
          do: "Identify the four moves and decide which sentence does the most reasoning.",
          work: "Whole class",
          record: "Star one move to imitate",
          time: "5 minutes",
          finish: "Four moves identified",
          check: "Reasoning explains; it does not merely repeat evidence.",
        },
        notes:
          "This is an original teacher model. It judges only the delay visible by page 91.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Switch the criterion",
        depth: true,
        time: 8,
        body: `<div class="mission-grid"><article><b>COURAGE</b><span>risk accepted</span></article><article><b>FAIRNESS</b><span>effects on others</span></article><article><b>RESPONSIBILITY</b><span>duties and consequences</span></article></div>`,
        task: {
          do: "Rejudge the same choice using a different criterion.",
          work: "Pairs",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "A second verdict and changed reasoning",
          check: "Keep the evidence; change the lens.",
        },
        notes:
          "Optional depth. This demonstrates why literary judgements can differ without becoming arbitrary.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Compare two character choices",
        depth: true,
        time: 10,
        body: `<div class="mirror-plan"><article><small>CHARACTER A</small><b>choice • pressure • consequence</b></article><span>SAME CRITERION</span><article><small>CHARACTER B</small><b>choice • pressure • consequence</b></article></div>`,
        task: {
          do: "Judge two choices with the same criterion and write a comparative verdict.",
          work: "Independent",
          record: "Workbook margin",
          time: "8-10 minutes",
          finish: "One comparative judgement",
          check: "Comparison requires the same yardstick.",
        },
        notes:
          "Optional depth for students with secure knowledge of the first 91 pages.",
      },
      {
        kicker: "PLAN • ORGANISER",
        title: "Lock the case before writing",
        time: 3,
        body: `<div class="hinge-line">VERDICT <span>→</span> EVIDENCE <span>→</span> REASONING <span>→</span> COUNTERVIEW <span>→</span> FINAL JUDGEMENT</div>`,
        task: {
          do: "Complete every box in the verdict chain.",
          work: "Independent",
          record: "Organiser: 100-word plan",
          time: "3 minutes",
          finish: "A complete five-move plan",
          check: "Every sentence must advance the case.",
        },
        notes:
          "Confer with students whose evidence is relevant to the character but not to the chosen choice.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write the 100-word Character Verdict",
        time: 12,
        timer: 12,
        body: `<div class="writing-brief"><h3>About 100 words</h3><ul><li>Judge one significant choice</li><li>Name the pressure or context</li><li>Use precise chapter evidence</li><li>Explain how the evidence proves the verdict</li><li>Acknowledge and answer a fair counterview</li></ul></div>`,
        task: {
          do: "Write the paragraph from your completed case file.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "12 minutes",
          finish: "One complete literary opinion",
          check: "A reader should be able to disagree—but not dismiss it as unsupported.",
        },
        notes:
          "Keep the word count approximate. Coherent reasoning is more important than landing on exactly 100.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Test the verdict",
        time: 4,
        body: checklist([
          "My verdict judges a specific choice.",
          "I explained the pressure or context.",
          "My evidence directly supports the verdict.",
          "My reasoning explains how the evidence proves the point.",
          "I treated another view fairly.",
          "I revised one vague label, plot summary or repeated idea.",
        ]),
        task: {
          do: "Mark every check and revise one sentence that only summarises.",
          work: "Independent",
          record: "Workbook paragraph",
          time: "4 minutes",
          finish: "One visible reasoning revision",
          check: "Add 'This shows...' only if what follows truly explains.",
        },
        notes:
          "Collect or photograph a sample across different verdict positions, not only agreement with the model.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "The verdict in one sentence",
        time: 2,
        body: `<div class="exit-line"><span>Character</span>'s choice to <span>________</span> is <span>________</span> because <span>precise evidence and reasoning</span>.</div>`,
        task: {
          do: "Write your final one-sentence verdict after revision.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One precise, defensible sentence",
          check: "The because-clause must contain evidence, not another adjective.",
        },
        notes:
          "Safe stopping point. Use these sentences to group students for future evidence-and-reasoning support.",
      },
    ],
    organiser: {
      subtitle: "Character Verdict Case File",
      sections: [
        { title: "1. Verdict test", columns: ["Reaction", "Unsupported assertion", "Defensible judgement"], rows: [["", "", ""]] },
        { title: "2. Case file", columns: ["Character + choice", "Pressure / context", "Possible consequences"], rows: [["", "", ""]] },
        { title: "3. Evidence trial", columns: ["Evidence option", "How directly does it support my verdict?", "Keep / reject"], rows: [["", "", ""], ["", "", ""]] },
        { title: "4. Counterview", columns: ["A fair reader might argue...", "My response...", "Does my verdict need revising?"], rows: [["", "", ""]] },
        { title: "5. 100-word plan", columns: ["Verdict", "Evidence", "Reasoning", "Counterview + response", "Final judgement"], rows: [["", "", "", "", ""]] },
      ],
    },
    lucas: {
      subtitle: "A choice and a reason",
      instruction:
        "Choose a character, a choice and a describing word. Then give one reason. You may point, speak, copy or ask a partner to write.",
      stages: [
        ["CHARACTER", "Malia"],
        ["CHOICE", "She waits before signing."],
        ["MY VERDICT", "brave / worried / responsible"],
      ],
      choices: ["brave", "worried", "responsible"],
      response: [
        "Malia chooses to ________________________________________.",
        "I think this is __________________________________________.",
        "My reason is ____________________________________________.",
      ],
    },
  },
  {
    number: 17,
    title: "The Board of Consequences",
    accent: "#d69a39",
    dark: "#0b302c",
    premise:
      "Every opportunity changes the position. Look beyond Ari's next move.",
    metaphor: "CHESSBOARD LENS",
    purpose:
      "Students analyse how Ari's point of view connects opportunity, guilt and responsibility, using chess as an interpretive metaphor rather than claiming the chapter states the metaphor directly.",
    curriculum: [
      "Year 5 - AC9E5LE03: recognise how point of view influences feelings and reader response.",
      "Year 6 - AC9E6LE01: identify responses to characters drawn from social and ethical contexts.",
    ],
    learning:
      "We are learning to explain how Ari's first-person viewpoint reveals guilt and to use the chessboard as a defensible metaphor for his choices.",
    criteria: [
      "I can distinguish Ari's opportunities, choices and consequences.",
      "I can identify how his narration reveals guilt.",
      "I can connect a chess feature to an accurate chapter detail.",
      "I can signal when a metaphor is my interpretation rather than a direct statement by the novel.",
      "I can write and revise an evidence-based literary analysis.",
    ],
    response:
      "An 8-10 sentence analysis explaining how the chessboard can represent Ari's choices, guilt and growing responsibility in pages 93-97.",
    readingFallback:
      "At chess practice, Ari enjoys Uncle Kus's praise and decides some things are better not questioned. Melonie reminds him of Suni. He admires Melonie and Samir's generosity, remembers with shame that he had been glad when illness removed them from the qualifying rounds, and adds this to his 'baggage' of guilt. At the same time, international chess possibilities excite him, and Suni's words make the world feel enormous.",
    slides: [
      {
        kicker: "BERANI • LESSON 17",
        title: "The Board of Consequences",
        hero: true,
        time: 2,
        notes:
          "Ask: In chess, is the most important moment the move, the reason for the move or what follows? Use responses to introduce consequence.",
      },
      {
        kicker: "ENTRY • PREDICT",
        title: "Every move changes the board",
        time: 4,
        body: `
          <div class="mission-grid">
            <article><b>MOVE</b><span>Ari accepts an opportunity</span></article>
            <article><b>POSITION</b><span>someone else has fewer options</span></article>
            <article><b>AFTERMATH</b><span>guilt changes what he notices</span></article>
          </div>`,
        task: {
          do: "Predict one chapter detail that could fit each part of the board.",
          work: "Pairs",
          record: "Organiser: prediction row",
          time: "4 minutes",
          finish: "Three predicted details",
          check: "A prediction is provisional until checked against the chapter.",
        },
        notes:
          "Do not present chess as an explicit metaphor in pages 93-97. It is today's interpretive lens, supported by Ari's recurring chess thinking.",
      },
      {
        kicker: "MISSION",
        title: "Turn guilt into an evidence-based interpretation",
        time: 2,
        body: `
          <div class="product-callout"><strong>Finished response:</strong> 8-10 sentences • Ari's viewpoint • chess metaphor • choice, consequence and responsibility</div>
          <p class="thinking-prompt">Use: <b>The chessboard can represent...</b> not: <b>The author definitely means...</b></p>`,
        task: {
          do: "Copy the interpretation boundary and complete: The chessboard can represent ___.",
          work: "Independent",
          record: "Organiser: metaphor claim",
          time: "2 minutes",
          finish: "One cautious metaphor claim",
          check: "Signal inference honestly.",
        },
        notes:
          "This protects accuracy while allowing genuine literary interpretation.",
      },
      {
        kicker: "RETRIEVAL • PAGES 93-97",
        title: "Map Ari's emotional position",
        time: 5,
        body: `
          <div class="vision-board">
            <article><small>OPPORTUNITY</small><b>winning streak • team place • international chess</b></article>
            <article><small>REMINDER</small><b>Melonie evokes Suni • generous teammates</b></article>
            <article><small>GUILT</small><b>shame • 'baggage' grows</b></article>
          </div>`,
        task: {
          do: "Add one accurate detail to each category and draw the causal arrows.",
          work: "Pairs",
          record: "Organiser: position map",
          time: "5 minutes",
          finish: "Three details and two arrows",
          check: "Show why the reminder activates guilt.",
        },
        notes:
          "Students may paraphrase. If quoting 'baggage', keep the quotation brief and discuss the metaphor already present in the narration.",
      },
      {
        kicker: "CAUSE • CONSEQUENCE",
        title: "Guilt is not one event—it is accumulated weight",
        time: 5,
        body: `
          <div class="hinge-line">Suni loses opportunity <span>→</span> Ari avoids returning <span>→</span> Ginger Juice and Melonie trigger memory <span>→</span> guilt accumulates</div>`,
        task: {
          do: "Build a four-link chain. Label fact from the story and Ari's interpretation differently.",
          work: "Independent, then compare",
          record: "Organiser: consequence chain",
          time: "5 minutes",
          finish: "Four linked ideas",
          check: "Use because, therefore or which means.",
        },
        notes:
          "Draw on previously read Ari chapters to explain the guilt, while keeping the main analysis anchored in pages 93-97.",
      },
      {
        kicker: "CHESS METAPHOR LAB",
        title: "Match the feature by meaning—not appearance",
        time: 6,
        body: `
          <div class="sort-wrap">
            <div class="sort-bank">
              ${[
                ["A move opens one path and closes another.", "consequence"],
                ["A player must consider other pieces.", "responsibility"],
                ["The board changes after every decision.", "position"],
                ["A winning move can still carry a cost.", "guilt"],
              ].map(([t,a]) => `<button class="sort-card" data-answer="${a}">${t}</button>`).join("")}
            </div>
            <div class="sort-zones two">
              <div class="sort-zone" data-zone="consequence"><h3>CONSEQUENCE</h3></div>
              <div class="sort-zone" data-zone="responsibility"><h3>RESPONSIBILITY</h3></div>
              <div class="sort-zone" data-zone="position"><h3>CHANGED POSITION</h3></div>
              <div class="sort-zone" data-zone="guilt"><h3>COST / GUILT</h3></div>
            </div>
          </div>
          <div class="action-row"><button class="btn check-sort">Test the metaphor</button><button class="btn ghost reset-local">Reset</button><span class="feedback"></span></div>`,
        task: {
          do: "Place each chess feature, then connect it to one Ari detail.",
          work: "Small groups",
          record: "Organiser: metaphor map",
          time: "6 minutes",
          finish: "Four placements and one defended connection",
          check: "A metaphor connection must clarify the character, not merely mention chess.",
        },
        notes:
          "Some connections may be defensibly rearranged with strong reasoning. The interaction supplies a starting map, not a universal code.",
      },
      {
        kicker: "POINT OF VIEW",
        title: "What does first person let the reader carry?",
        time: 4,
        body: `
          <div class="split-vision">
            <article><small>OUTSIDE VIEW</small><p>Ari practises, wins and hears about tournaments.</p></article>
            <article><small>ARI'S INNER VIEW</small><p>Melonie evokes Suni; shame joins his growing baggage of guilt.</p></article>
            <article class="overlap"><small>READER EFFECT</small><p>Success feels exciting and ethically uncomfortable at once.</p></article>
          </div>`,
        task: {
          do: "Explain what would disappear if this scene were told only from outside Ari.",
          work: "Pairs",
          record: "Organiser: viewpoint effect",
          time: "4 minutes",
          finish: "One evidence-based effect",
          check: "Name knowledge, feeling or tension created by first person.",
        },
        notes:
          "This directly addresses the Year 5 point-of-view focus and supports the ethical response required in Year 6.",
      },
      {
        kicker: "ANNOTATED MODEL",
        title: "Interpret without overclaiming",
        time: 5,
        body: `
          <div class="model-passage"><p>The chessboard can represent the consequences of Ari's choices because every opportunity changes another person's position. Ari's place at school expands his world, while Suni remains in the village with fewer choices. In pages 93-97, Melonie's resemblance to Suni interrupts his excitement and makes him confront what his success costs. His shame about benefiting from the girls' illness adds to his growing 'baggage' of guilt. Like a player who must look beyond one promising move, Ari is beginning to recognise the other people affected by his decisions. The first-person narration lets readers experience both the thrill of possibility and the pressure of responsibility.</p></div>
          <div class="annotation-row"><button class="reveal-card" data-reveal="CAUTIOUS CLAIM • can represent">inference signal</button><button class="reveal-card" data-reveal="EVIDENCE • accurate event and brief wording">chapter anchor</button><button class="reveal-card" data-reveal="REASONING • chess feature clarifies responsibility">metaphor link</button></div>`,
        task: {
          do: "Find the inference signal, evidence and metaphor reasoning.",
          work: "Whole class",
          record: "Star one move to imitate",
          time: "5 minutes",
          finish: "Three analytical moves",
          check: "The metaphor grows from evidence; it does not replace evidence.",
        },
        notes:
          "This is an original teacher model. Explain that the later novel makes chess symbolism more explicit, but today's claim remains limited to current reading.",
      },
      {
        kicker: "DEPTH A • OPTIONAL",
        title: "Test a competing metaphor",
        depth: true,
        time: 8,
        body: `<div class="split-vision"><article><small>CHESSBOARD</small><p>strategy, position, consequence</p></article><article><small>BAGGAGE</small><p>weight, accumulation, carrying the past</p></article><article class="overlap"><small>JUDGEMENT</small><p>Which better explains Ari at this moment?</p></article></div>`,
        task: {
          do: "Compare the chessboard with Ari's baggage metaphor and judge which is stronger here.",
          work: "Pairs",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "One comparative judgement",
          check: "Use a criterion: textual directness or explanatory power.",
        },
        notes:
          "Optional depth. Students should recognise that 'baggage' is textually explicit while the chessboard is interpretive.",
      },
      {
        kicker: "DEPTH B • OPTIONAL",
        title: "Predict the next responsible move",
        depth: true,
        time: 8,
        body: `<div class="hinge-line">GUILT <span>→ ?</span> RESPONSIBILITY <span>→ ?</span> ACTION</div><p class="thinking-prompt">What action would show growth without pretending guilt alone repairs harm?</p>`,
        task: {
          do: "Predict one responsible move for Ari and justify it with his current conflict.",
          work: "Independent",
          record: "Workbook margin",
          time: "6-8 minutes",
          finish: "Prediction + evidence-based reason",
          check: "Do not use knowledge from unread chapters.",
        },
        notes:
          "Optional depth. Preserve uncertainty and do not confirm later plot outcomes.",
      },
      {
        kicker: "PLAN • ORGANISER",
        title: "Set the analysis in motion",
        time: 3,
        body: `<div class="hinge-line">METAPHOR CLAIM <span>→</span> ARI EVIDENCE <span>→</span> CONSEQUENCE <span>→</span> VIEWPOINT EFFECT <span>→</span> RESPONSIBILITY</div>`,
        task: {
          do: "Complete all five planning moves in note form.",
          work: "Independent",
          record: "Organiser: analysis plan",
          time: "3 minutes",
          finish: "A complete five-move plan",
          check: "Use at least two accurate chapter details.",
        },
        notes:
          "Conference with students whose chess comparison does not yet clarify Ari's ethical conflict.",
      },
      {
        kicker: "WORKBOOK • INDEPENDENT",
        title: "Write the Board of Consequences analysis",
        time: 13,
        timer: 13,
        body: `<div class="writing-brief"><h3>8-10 sentences</h3><ul><li>Use 'can represent' or another honest inference signal</li><li>Anchor the analysis in pages 93-97</li><li>Explain at least two choices or consequences</li><li>Show how first person reveals guilt</li><li>Connect guilt to growing responsibility</li></ul></div>`,
        task: {
          do: "Write the analysis from your completed metaphor map.",
          work: "Independent and silent",
          record: "Facing workbook page",
          time: "13 minutes",
          finish: "One complete literary analysis",
          check: "Evidence first; metaphor as explanation.",
        },
        notes:
          "Students can reject part of the chess metaphor if they explain its limitation and offer a stronger reading.",
      },
      {
        kicker: "SELF-CHECK",
        title: "Look beyond the next move",
        time: 4,
        body: checklist([
          "I explained Ari's opportunity, choice and consequence.",
          "I used at least two accurate details from pages 93-97.",
          "I explained how first-person narration reveals guilt.",
          "My chess connection clarifies the evidence.",
          "I signalled that the metaphor is an interpretation.",
          "I revised one overclaim, plot summary or unexplained comparison.",
        ]),
        task: {
          do: "Mark every check and revise one sentence that overclaims or only retells.",
          work: "Independent",
          record: "Workbook analysis",
          time: "4 minutes",
          finish: "One visible analytical revision",
          check: "Replace 'This proves the author means...' with a defensible inference.",
        },
        notes:
          "Use revisions to identify who needs support distinguishing evidence from interpretation.",
      },
      {
        kicker: "EXIT EVIDENCE",
        title: "One move, one consequence, one insight",
        time: 2,
        body: `<div class="exit-line">Ari's choice to <span>________</span> changes the board because <span>________</span>, which reveals <span>________</span>.</div>`,
        task: {
          do: "Complete the sentence using one accurate detail and one insight about guilt or responsibility.",
          work: "Independent",
          record: "Workbook",
          time: "2 minutes",
          finish: "One evidence-to-insight chain",
          check: "The final clause must interpret, not repeat.",
        },
        notes:
          "Safe stopping point. This exit evidence previews readiness for the ethical dilemmas in the next lessons.",
      },
    ],
    organiser: {
      subtitle: "Board of Consequences Map",
      sections: [
        { title: "1. Position map", columns: ["Opportunity", "Reminder / trigger", "Guilt revealed", "Consequence"], rows: [["", "", "", ""]] },
        { title: "2. Cause-and-consequence chain", columns: ["Choice / event", "Because...", "Therefore...", "Which means..."], rows: [["", "", "", ""]] },
        { title: "3. Chess metaphor map", columns: ["Chess feature", "Ari detail", "What the connection clarifies", "Limit of the comparison"], rows: [["", "", "", ""], ["", "", "", ""]] },
        { title: "4. Point-of-view effect", text: "Because Ari narrates in first person, the reader knows ____________________________________. This makes his success feel ____________________________________ because ____________________________________." },
        { title: "5. Analysis plan", columns: ["Metaphor claim", "Evidence 1", "Evidence 2", "Viewpoint effect", "Responsibility insight"], rows: [["", "", "", "", ""]] },
      ],
    },
    lucas: {
      subtitle: "Ari's choice and feelings",
      instruction:
        "Put the ideas in order. Choose how Ari feels and what he can do next. You may point, speak, copy or ask a partner to write.",
      stages: [
        ["CHOICE", "Ari goes to school and plays chess."],
        ["FEELING", "He misses Suni and feels guilty."],
        ["NEXT MOVE", "He can think about how his choices affect others."],
      ],
      choices: ["excited", "sad", "guilty", "responsible"],
      response: [
        "Ari gets the chance to ___________________________________.",
        "He feels ________________________________________________.",
        "His next good move could be ______________________________.",
      ],
    },
  },
];

function checklist(items) {
  return `<div class="checklist">${items
    .map((item) => `<div><span>□</span><p>${item}</p></div>`)
    .join("")}</div>`;
}

function escapeHtml(text) {
  return String(text)
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
    <div><small>TIME</small><b>${task.time}</b></div>
    <div><small>FINISH</small><b>${task.finish}</b></div>
    <div class="wide"><small>CHECK</small><b>${task.check}</b></div>
  </div>`;
}

function renderSlide(lesson, slide, index) {
  const depthBadge = slide.depth
    ? `<span class="depth-badge">OPTIONAL DEPTH</span>`
    : `<span class="core-badge">CORE</span>`;
  if (slide.hero) {
    return `<section class="slide hero${index === 0 ? " active" : ""}" data-notes="${escapeHtml(
      slide.notes
    )}">
      <div class="hero-content">
        <div class="kicker">BERANI • LESSON ${lesson.number}</div>
        <h1>${lesson.title}</h1>
        <p>${lesson.premise}</p>
        <div class="hero-tags"><span>${lesson.metaphor}</span><span>WORKBOOK WORKSHOP</span><span>50-MINUTE CORE</span></div>
      </div>
    </section>`;
  }
  const timer = slide.timer
    ? `<div class="timer-box"><span class="timer-readout" data-start="${
        slide.timer * 60
      }">${String(slide.timer).padStart(2, "0")}:00</span><button class="btn timer-start">Start / reset timer</button></div>`
    : "";
  return `<section class="slide${index === 0 ? " active" : ""}${
    slide.depth ? " depth-slide" : ""
  }" data-notes="${escapeHtml(slide.notes)}">
    <header class="slide-head">
      <div><div class="kicker">${slide.kicker}</div><h2>${slide.title}</h2></div>
      <div class="slide-meta">${depthBadge}<span>${slide.time} MIN</span></div>
    </header>
    <div class="slide-body">${slide.body || ""}${timer}</div>
    ${taskPanel(slide.task)}
  </section>`;
}

function presentationHtml(lesson) {
  const slides = lesson.slides.map((s, i) => renderSlide(lesson, s, i)).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lesson ${lesson.number} — ${lesson.title}</title>
<style>
:root{--accent:${lesson.accent};--dark:${lesson.dark};--deep:#0b302c;--paper:#fffdf7;--ink:#20303c;--muted:#5e6b70;--line:#b8c7c2;--leaf:#b9d66b;--amber:#e3a94f;--coral:#d9684b;--nav:68px}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--deep);font-family:Arial,sans-serif;color:var(--ink)}button{font:inherit}
.slide{display:none;position:absolute;inset:0 0 var(--nav);padding:34px 54px 22px;background:linear-gradient(135deg,#fffef9,#edf3ef);overflow:hidden}.slide.active{display:flex;flex-direction:column}.slide.depth-slide{background:linear-gradient(135deg,#fff8e8,#f1eee3)}
.hero{background:linear-gradient(90deg,rgba(5,39,34,.96) 0%,rgba(5,39,34,.82) 34%,rgba(5,39,34,.18) 68%),url('assets/rainforest-orangutan-hero.png') center/cover no-repeat;color:white;padding:0}
.hero-content{width:58%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:64px 6vw}.hero h1{font-family:Georgia,serif;font-size:clamp(48px,5vw,82px);line-height:1.04;margin:12px 0 20px;letter-spacing:-2px}.hero p{font-size:clamp(22px,2vw,34px);line-height:1.25;max-width:760px;margin:0 0 28px}.hero-tags{display:flex;gap:10px;flex-wrap:wrap}.hero-tags span{border:1px solid rgba(255,255,255,.5);border-radius:999px;padding:9px 14px;font-weight:800;font-size:14px;background:rgba(0,0,0,.16)}
.kicker{font-size:15px;font-weight:900;letter-spacing:2px;color:var(--accent);text-transform:uppercase}.slide-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:14px}.slide-head h2{font-family:Georgia,serif;font-size:clamp(32px,3.2vw,53px);line-height:1.03;margin:5px 0 0;color:var(--dark);letter-spacing:-1px}.slide-meta{display:flex;gap:8px;align-items:center;white-space:nowrap}.slide-meta span{padding:8px 11px;border-radius:999px;background:#fff;border:1px solid var(--line);font-weight:800;font-size:13px}.depth-badge{background:#fff0c8!important;color:#6b4e00;border-color:#ddb85d!important}.core-badge{background:#e5f2eb!important;color:#25563e;border-color:#a8c7b2!important}
.slide-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:14px}.task-panel{display:grid;grid-template-columns:1.4fr .8fr 1.15fr .65fr 1.25fr;gap:7px;margin-top:12px}.task-panel>div{background:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 10px;min-height:50px;display:flex;flex-direction:column;gap:3px}.task-panel .wide{grid-column:1/-1;min-height:39px;display:grid;grid-template-columns:70px 1fr;align-items:center}.task-panel small{font-size:10px;font-weight:900;letter-spacing:1.3px;color:var(--accent)}.task-panel b{font-size:14px;line-height:1.15}
.mission-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.mission-grid.four{grid-template-columns:repeat(4,1fr)}.mission-grid article,.lens-pair article{background:#fff;border-top:8px solid var(--accent);border-radius:16px;padding:25px;text-align:center;box-shadow:0 8px 22px rgba(17,50,46,.09)}.mission-grid b,.lens-pair b{font-size:25px;color:var(--dark);display:block}.mission-grid span,.lens-pair span{font-size:18px;display:block;margin-top:8px}.product-callout{background:var(--dark);color:white;border-radius:14px;padding:17px 22px;font-size:21px;text-align:center}
.sort-wrap{display:grid;grid-template-columns:1.15fr 1fr;gap:20px;min-height:0}.sort-bank{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;align-content:start}.sort-card{border:2px solid var(--line);background:#fff;border-radius:11px;padding:11px;text-align:left;font-weight:750;cursor:pointer;line-height:1.15}.sort-card.selected{outline:4px solid rgba(227,169,79,.45);border-color:var(--amber)}.sort-zones{display:grid;gap:10px}.sort-zones.two{grid-template-columns:repeat(2,1fr)}.sort-zones.three{grid-template-columns:repeat(3,1fr)}.sort-zone{border:3px dashed var(--accent);border-radius:15px;padding:10px;min-height:180px;background:rgba(255,255,255,.55)}.sort-zone h3{text-align:center;color:var(--dark);font-size:20px;margin:3px}.sort-zone p{text-align:center;margin:2px 0 8px;color:var(--muted)}.sort-zone .sort-card{margin:6px 0;font-size:13px}.sort-zone.correct{background:#e6f3e8}.sort-zone.incorrect{background:#fbe6df}
.bridge-scene{display:grid;grid-template-columns:1fr .55fr 1fr;align-items:center;gap:18px}.bank{padding:20px;border-radius:18px;background:#fff;display:grid;gap:9px;border:2px solid var(--line)}.bank span{font-weight:900;color:var(--accent);letter-spacing:1px}.bank b{padding:10px;border-radius:9px;background:#edf3ef}.bridge{height:180px;display:flex;flex-direction:column;justify-content:center;gap:8px;background:linear-gradient(165deg,transparent 42%,var(--accent) 43%,var(--accent) 57%,transparent 58%)}.bridge span{background:#fff;border:2px solid var(--accent);border-radius:999px;padding:8px;text-align:center;font-weight:900}
${lesson.number === 10 ? ".evidence-pairing{display:grid;grid-template-columns:1fr .72fr 1fr;align-items:stretch;gap:18px}.evidence-pairing .relationship-list{padding:20px;border-radius:18px;background:#fff;display:grid;gap:9px;border:2px solid var(--accent);align-content:center;text-align:center}.evidence-pairing .relationship-list span{font-weight:900;color:var(--accent);letter-spacing:1px}.evidence-pairing .relationship-list b{padding:10px;border-radius:9px;background:var(--dark);color:#fff}" : ""}
.clause-display{display:grid;grid-template-columns:1fr .55fr 1fr;align-items:center;gap:16px;font-size:21px;font-weight:800;text-align:center}.clause-display>span{background:#fff;padding:22px;border-radius:15px;border:2px solid var(--line)}.clause-display.single{display:block}.connector-row{display:grid;gap:8px}.connector-row button,.reveal-card,.annot{cursor:pointer;border:2px solid var(--accent);background:#fff;border-radius:12px;padding:12px;font-weight:800}.reveal-card.revealed,.annot.revealed{background:var(--dark);color:#fff}.reveal-card.revealed::after,.annot.revealed::after{content:attr(data-reveal);display:block;margin-top:7px;font-size:13px;color:#fff5ca}
.surgery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.surgery-grid .reveal-card{min-height:115px;text-align:left}.surgery-grid b{font-size:28px;margin-right:8px;color:var(--accent)}
.model-text{display:grid;gap:8px}.model-text .annot{text-align:left;font-size:18px;line-height:1.25;padding:12px 16px}
.compare-panel,.split-vision,.dual-model,.before-after,.lens-pair{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.compare-panel article,.split-vision article,.dual-model article,.before-after article,.vision-board article,.context-grid article,.lens-map article{background:#fff;border-radius:16px;padding:20px;border-top:7px solid var(--accent);box-shadow:0 8px 20px rgba(17,50,46,.08)}.compare-panel span,.split-vision small,.dual-model small,.before-after small,.vision-board small,.context-grid small,.lens-map small{color:var(--accent);font-weight:900;letter-spacing:1px}.compare-panel b{font-size:20px;display:block;margin-top:8px}.split-vision p,.dual-model p,.before-after p{font-size:18px;line-height:1.35}.split-vision .overlap{grid-column:1/-1;border-top-color:var(--amber)}
.thinking-prompt{font-size:20px;text-align:center;color:var(--dark);font-weight:800;margin:4px}.depth-lab{display:grid;grid-template-columns:1fr .4fr 1fr;gap:10px;align-items:center;text-align:center}.depth-lab.solo{grid-template-columns:1fr 1fr}.depth-lab>*{padding:16px;border-radius:12px;background:#fff;border:2px solid #d8c68c}.depth-lab span{color:#7a5a00;font-weight:800}.writing-brief{background:#fff;border:2px solid var(--accent);border-radius:18px;padding:22px 30px}.writing-brief h3{font-family:Georgia,serif;color:var(--dark);font-size:30px;margin:0 0 12px}.writing-brief ul{columns:2;margin:0;padding-left:24px;font-size:18px;line-height:1.6}.writing-brief p{font-size:17px;margin:10px 0 0}.timer-box{position:absolute;right:54px;bottom:112px;display:flex;align-items:center;gap:10px;background:var(--dark);color:#fff;padding:10px 14px;border-radius:13px}.timer-readout{font-size:27px;font-weight:900;min-width:84px}
.checklist{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.checklist div{background:#fff;border:2px solid var(--line);border-radius:12px;padding:12px;display:flex;gap:12px;align-items:center}.checklist span{font-size:28px;color:var(--accent)}.checklist p{margin:0;font-size:17px;font-weight:700}.exit-line,.justify-frame,.hinge-line,.overload-line{background:#fff;border-left:9px solid var(--accent);padding:24px;border-radius:13px;font-size:24px;line-height:1.35}.exit-line span{display:inline-block;min-width:170px;border-bottom:2px solid var(--ink)}
.context-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.context-grid article p{font-size:16px;line-height:1.25}.context-grid article b{font-size:28px;color:var(--accent)}.word-bank{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}.word-bank b{background:var(--dark);color:#fff;border-radius:999px;padding:10px 16px}
.choice-set{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.choice-set.three{grid-template-columns:repeat(3,1fr)}.choice-question{background:#fff;border-radius:15px;padding:18px;border:2px solid var(--line)}.choice-question small{font-weight:900;color:var(--accent)}.choice-question p{font-size:18px}.choice-question div{display:flex;gap:8px}.choice-card{border:2px solid var(--line);background:#fff;border-radius:12px;padding:13px;cursor:pointer;font-weight:800}.choice-question .choice-card{flex:1}.choice-card.selected{border-color:var(--accent);outline:4px solid color-mix(in srgb,var(--accent) 28%,transparent)}.choice-card.correct{background:#e4f2e7}.choice-card.incorrect{background:#fbe7e0}
.action-row{display:flex;gap:10px;align-items:center}.btn{border:0;border-radius:10px;padding:10px 15px;background:var(--accent);color:white;font-weight:900;cursor:pointer}.btn.ghost{background:#fff;color:var(--dark);border:2px solid var(--line)}.feedback{font-weight:800;color:var(--dark)}
.thresholds{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.thresholds .reveal-card{min-height:150px;display:flex;flex-direction:column;gap:14px;justify-content:center}.thresholds b{font-size:23px}.thresholds span{font-size:16px;font-weight:500}.lens-map{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.lens-map b{font-size:19px;line-height:1.3;display:block;margin-top:8px}.sound-trail{display:flex;align-items:center;justify-content:center;gap:12px}.sound-trail>*{padding:15px;border-radius:999px;background:#fff;border:2px solid var(--line)}.sound-trail strong{background:var(--dark);color:#fff}.sound-trail span{border:0;background:transparent}
.scene-frame{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.scene-frame b{padding:13px 16px;border-radius:12px;background:#fff;border:2px solid var(--line)}.lens-builder{display:grid;grid-template-columns:.8fr repeat(3,1fr);gap:12px;align-items:center}.lens-builder>span{font-size:23px;font-weight:900;color:var(--dark)}.verb-spectrum{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.overload-line{text-align:center}.vision-board{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.vision-board b{display:block;font-size:18px;line-height:1.35;margin-top:10px}.vision-board.reader article:last-child{border-top-color:var(--amber)}.dual-model article:first-child{border-top-color:#d89b52}.dual-model article:last-child{border-top-color:#6eaa72}.annotation-row{display:flex;gap:10px;justify-content:center}.mirror-plan{display:grid;grid-template-columns:1fr .5fr 1fr;gap:14px;align-items:center}.mirror-plan article{background:#fff;padding:22px;border-radius:15px;border:2px solid var(--line)}.mirror-plan span{text-align:center;font-weight:900;color:var(--accent)}.mirror-plan small{display:block;color:var(--accent);font-weight:900}.mirror-plan b{display:block;margin-top:8px}.hinge-line span{color:var(--accent);font-weight:900;margin:0 12px}
.nav{position:absolute;inset:auto 0 0;height:var(--nav);background:#082c29;color:#fff;display:flex;align-items:center;gap:12px;padding:0 18px;z-index:30}.nav button{border:0;background:transparent;color:white;font-weight:800;padding:10px 12px;border-radius:8px;cursor:pointer}.nav button:hover,.nav button:focus-visible{background:rgba(255,255,255,.14);outline:2px solid var(--amber)}.progress{height:7px;flex:1;background:rgba(255,255,255,.2);border-radius:999px;overflow:hidden}.progress i{display:block;height:100%;width:0;background:var(--accent)}.slide-no{font-weight:900;min-width:70px}.notes{display:none;position:absolute;right:18px;bottom:82px;width:min(500px,44vw);max-height:70vh;overflow:auto;background:#fff;color:var(--ink);border:3px solid var(--accent);border-radius:15px;padding:18px;z-index:40;box-shadow:0 20px 60px rgba(0,0,0,.35)}.notes.open{display:block}.notes h3{margin:0 0 8px;color:var(--dark)}
@media(max-width:1000px){.slide{padding:24px 32px 18px}.slide-head h2{font-size:34px}.task-panel b{font-size:12px}.task-panel{grid-template-columns:1.2fr .7fr 1fr .6fr 1fr}.slide-body{transform-origin:center}.hero-content{width:65%}.context-grid{grid-template-columns:repeat(2,1fr)}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>
</head>
<body>
<main>${slides}</main>
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
document.querySelectorAll('.choice-card').forEach(b=>b.onclick=()=>{const root=b.closest('.choice-question')||b.closest('.choice-set');root.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected','correct','incorrect'));b.classList.add('selected')});
document.querySelectorAll('.check-choice').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide');const groups=[...slide.querySelectorAll('.choice-question')];const roots=groups.length?groups:[slide.querySelector('.choice-set')];let complete=true,all=true;roots.forEach(root=>{const selected=root?.querySelector('.choice-card.selected');if(!selected){complete=false;return}const ok=selected.dataset.correct==='true';selected.classList.add(ok?'correct':'incorrect');all=all&&ok});const f=slide.querySelector('.feedback');f.textContent=!complete?'Choose one option in every set.':all?'Strong fit. Now justify the nuance.':'Recheck meaning, tone and context—not just grammar.'});
let selectedSort=null;document.querySelectorAll('.sort-card').forEach(card=>card.onclick=()=>{document.querySelectorAll('.sort-card').forEach(c=>c.classList.remove('selected'));selectedSort=card;card.classList.add('selected')});document.querySelectorAll('.sort-zone').forEach(zone=>zone.onclick=e=>{if(e.target.closest('.sort-card')||!selectedSort)return;zone.appendChild(selectedSort);selectedSort.classList.remove('selected');selectedSort=null});
document.querySelectorAll('.check-sort').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide');const cards=[...slide.querySelectorAll('.sort-card')];let placed=true,all=true;cards.forEach(card=>{const zone=card.closest('.sort-zone');if(!zone){placed=false;return}const ok=zone.dataset.zone===card.dataset.answer;zone.classList.add(ok?'correct':'incorrect');all=all&&ok});slide.querySelector('.feedback').textContent=!placed?'Place every card before checking.':all?'The board is ready. Now justify the difficult boundary.':'One or more placements need an evidence check.'});
document.querySelectorAll('.reset-local').forEach(btn=>btn.onclick=()=>{const slide=btn.closest('.slide');slide.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected','correct','incorrect'));slide.querySelectorAll('.sort-zone').forEach(z=>{z.classList.remove('correct','incorrect');z.querySelectorAll('.sort-card').forEach(c=>slide.querySelector('.sort-bank').appendChild(c))});slide.querySelectorAll('.reveal-card,.annot').forEach(x=>x.classList.remove('revealed'));const f=slide.querySelector('.feedback');if(f)f.textContent='';selectedSort=null});
document.querySelectorAll('.timer-start').forEach(btn=>btn.onclick=()=>{const box=btn.closest('.timer-box'),read=box.querySelector('.timer-readout');clearInterval(box._timer);let n=Number(read.dataset.start);const paint=()=>{read.textContent=String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};paint();box._timer=setInterval(()=>{n--;paint();if(n<=0){clearInterval(box._timer);read.textContent='TIME'}},1000)});
show(0);
</script>
</body>
</html>`;
}

function planMarkdown(lesson) {
  const core = lesson.slides.filter((s) => !s.hero && !s.depth);
  const depth = lesson.slides.filter((s) => s.depth);
  const sequence = core
    .map(
      (s, i) =>
        `### ${i + 1}. ${s.title} - ${s.time} minutes\n\n${s.task?.do || ""}\n\n- **Student action:** ${s.task?.work || ""}; ${s.task?.record || ""}.\n- **Finished when:** ${s.task?.finish || ""}.\n- **Teacher note:** ${s.notes}\n`
    )
    .join("\n");
  const depthText = depth
    .map(
      (s) =>
        `### ${s.title} - ${s.time} minutes\n\n${s.task.do}\n\n- **Student action:** ${s.task.work}; ${s.task.record}.\n- **Finished when:** ${s.task.finish}.\n- **Teacher note:** ${s.notes}\n`
    )
    .join("\n");
  return `# Lesson ${lesson.number}: ${lesson.title}

## Lesson purpose

${lesson.purpose}

## Curriculum focus

${lesson.curriculum.map((x) => `- **${x}**`).join("\n")}

## Learning intention

${lesson.learning}

## Success criteria

${lesson.criteria.map((x) => `- ${x}`).join("\n")}

## Finished workbook response

${lesson.response}

## Agreed delivery model

- Teacher controls the projected HTML presentation.
- Students complete the organiser and all substantial composition in physical English workbooks.
- The deck contains no student composition fields.
- The chapter is assumed to have been read. Use the fallback summary only when required.
- Core route: approximately 50 minutes.
- Both optional depth slides are included and may extend the lesson towards 70 minutes.
- Revision is primarily independent through the projected self-check.

## Preparation

- Open \`Lesson_${lesson.number}_Presentation.html\` in a modern browser and select fullscreen.
- Print \`Lesson_${lesson.number}_Organiser.docx\`.
- Prepare \`Lesson_${lesson.number}_Lucas_Organiser.docx\` where appropriate.
- Students need their English workbook and pasted organiser.
- Confirm the hero image and local assets load.

## Core sequence

${sequence}

## Optional depth slides

${depthText}

## Support

- Reduce the number of initial choices without removing the central decision.
- Permit oral rehearsal before workbook writing.
- Provide optional sentence launches on the projected writing brief.
- Conference first with students whose organiser contains details but no relationship or interpretation.

## Lucas (ICP)

- Use the separate \`Lesson_${lesson.number}_Lucas_Organiser.docx\`.
- Preserve the same conceptual destination with fewer decisions, reduced language load, large print and flexible pointing, speaking, copying or scribing responses.
- Do not require independent reading of the full chapter during this workshop.

## Extension

- Use DEPTH A and DEPTH B.
- Require additional explanation, transfer or precision rather than greater volume alone.

## Self-check and formative assessment

- Retrieval reveals what students retained from prior reading.
- The main interaction exposes the lesson's central misconception.
- The organiser records the thinking that prepares the final response.
- The projected self-check requires an immediate independent revision.
- Exit evidence samples the learning goal rather than participation.

## Teacher reading fallback

${lesson.readingFallback}

## Accuracy and privacy boundaries

- Use only verified details from *Berani* and the approved unit sequence.
- Do not ask students to disclose personal experiences of cultural labels, grief, rule-breaking or trauma.
- Accept defensible interpretations when students use accurate textual evidence.
`;
}

function textRun(text, options = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: options.size || 20,
    color: options.color || palette.ink,
    bold: options.bold,
    italics: options.italics,
  });
}

function paragraph(text, options = {}) {
  const p = new Paragraph({
    alignment: options.alignment,
    keepNext: options.keepNext,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 80,
      line: options.line ?? 240,
      lineRule: "auto",
    },
    children: options.children || [
      textRun(text, {
        size: options.size,
        color: options.color,
        bold: options.bold,
        italics: options.italics,
      }),
    ],
  });
  return p;
}

function border(color = palette.line, size = 6) {
  return { style: BorderStyle.SINGLE, color, size };
}

function allBorders(color = palette.line, size = 6) {
  return {
    top: border(color, size),
    bottom: border(color, size),
    left: border(color, size),
    right: border(color, size),
  };
}

function docCell(text, width, options = {}) {
  const paragraphs = Array.isArray(text)
    ? text
    : [
        paragraph(text, {
          size: options.size || 18,
          bold: options.bold,
          color: options.color,
          alignment: options.alignment,
          after: 20,
          line: 220,
        }),
      ];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: {
      top: options.marginY ?? 75,
      bottom: options.marginY ?? 75,
      left: options.marginX ?? 100,
      right: options.marginX ?? 100,
    },
    borders: allBorders(options.borderColor || palette.line, options.borderSize || 5),
    shading: options.fill
      ? { fill: options.fill, type: ShadingType.CLEAR }
      : undefined,
    children: paragraphs,
  });
}

function fixedTable(rows, widths, totalWidth = 10320) {
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    indent: { size: 100, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows,
  });
}

function widthSplit(count, total = 10320) {
  const base = Math.floor(total / count);
  const widths = Array.from({ length: count }, () => base);
  widths[widths.length - 1] += total - base * count;
  return widths;
}

function addSectionTitle(children, title, accent = palette.forest) {
  children.push(
    paragraph(title, {
      size: 22,
      bold: true,
      color: accent,
      before: 80,
      after: 45,
      keepNext: true,
    })
  );
}

function organiserDocument(lesson, lucas = false) {
  const children = [];
  children.push(
    paragraph(lucas ? " " : `BERANI  |  LESSON ${lesson.number}`, {
      size: 16,
      bold: true,
      color: lucas ? palette.white : palette.coral,
      after: 20,
    }),
    paragraph(lucas ? lesson.lucas.subtitle : lesson.organiser.subtitle, {
      size: lucas ? 30 : 27,
      bold: true,
      color: palette.deep,
      after: 25,
    }),
    paragraph(lesson.title, {
      size: 18,
      bold: true,
      color: palette.grey,
      after: 60,
    }),
    paragraph(
      "Name: ______________________________  Class: __________  Date: __________",
      { size: 16, italics: true, color: palette.grey, after: 70 }
    )
  );

  if (lucas) {
    children.push(
      paragraph(lesson.lucas.instruction, {
        size: 21,
        bold: true,
        color: palette.deep,
        after: 85,
      })
    );
    addSectionTitle(children, "1. Look, choose and order");
    const stageWidths = widthSplit(lesson.lucas.stages.length);
    children.push(
      fixedTable(
        [
          new TableRow({
            tableHeader: true,
            children: lesson.lucas.stages.map(([label], i) =>
              docCell(label, stageWidths[i], {
                fill: palette.forest,
                color: palette.white,
                bold: true,
                alignment: AlignmentType.CENTER,
                size: 19,
                borderColor: palette.forest,
                marginY: 100,
              })
            ),
          }),
          new TableRow({
            children: lesson.lucas.stages.map(([, detail], i) =>
              docCell(
                [
                  paragraph(detail, {
                    size: 21,
                    bold: true,
                    alignment: AlignmentType.CENTER,
                    after: 120,
                    line: 250,
                  }),
                  paragraph("□", {
                    size: 32,
                    color: palette.coral,
                    alignment: AlignmentType.CENTER,
                    after: 0,
                  }),
                ],
                stageWidths[i],
                { fill: palette.paleGreen, marginY: 130 }
              )
            ),
          }),
        ],
        stageWidths
      )
    );
    addSectionTitle(children, "2. Helpful words");
    children.push(
      fixedTable(
        [
          new TableRow({
            children: lesson.lucas.choices.map((word, i) =>
              docCell(word, widthSplit(lesson.lucas.choices.length)[i], {
                fill: palette.cream,
                bold: true,
                alignment: AlignmentType.CENTER,
                size: 21,
                borderColor: palette.amber,
                marginY: 95,
              })
            ),
          }),
        ],
        widthSplit(lesson.lucas.choices.length)
      )
    );
    addSectionTitle(children, "3. Build or tell your response");
    lesson.lucas.response.forEach((line) =>
      children.push(
        paragraph(line, {
          size: 21,
          after: 115,
          line: 280,
        })
      )
    );
    children.push(
      paragraph("I can point  •  I can speak  •  I can copy  •  A partner can scribe", {
        size: 17,
        bold: true,
        color: palette.forest,
        alignment: AlignmentType.CENTER,
        before: 60,
        after: 0,
      })
    );
  } else {
    lesson.organiser.sections.forEach((section) => {
      addSectionTitle(children, section.title);
      if (section.text) {
        children.push(
          fixedTable(
            [
              new TableRow({
                children: [
                  docCell(section.text, 10320, {
                    fill: palette.cream,
                    size: 18,
                    borderColor: palette.amber,
                    marginY: 90,
                  }),
                ],
              }),
            ],
            [10320]
          )
        );
      } else {
        const widths = widthSplit(section.columns.length);
        const rows = [
          new TableRow({
            tableHeader: true,
            children: section.columns.map((heading, i) =>
              docCell(heading, widths[i], {
                fill: palette.deep,
                color: palette.white,
                bold: true,
                alignment: AlignmentType.CENTER,
                size: 16,
                borderColor: palette.deep,
                marginY: 65,
              })
            ),
          }),
          ...section.rows.map(
            (row) =>
              new TableRow({
                children: row.map((value, i) =>
                  docCell(
                    [
                      paragraph(value || " ", {
                        size: 16,
                        bold: Boolean(value),
                        after: 70,
                        line: 220,
                      }),
                      paragraph(
                        value ? " " : "________________________________",
                        {
                          size: 14,
                          color: palette.line,
                          after: 0,
                        }
                      ),
                    ],
                    widths[i],
                    {
                      fill: value ? palette.paleGreen : palette.paper,
                      marginY: 75,
                    }
                  )
                ),
              })
          ),
        ];
        children.push(fixedTable(rows, widths));
      }
    });
    children.push(
      paragraph(
        `FINAL RESPONSE: ${lesson.response}`,
        {
          size: 16,
          bold: true,
          color: palette.deep,
          before: 90,
          after: 0,
        }
      )
    );
  }

  const header = new Header({
    children: [
      paragraph(`ENGLISH UNIT 3  |  ${lucas ? "LUCAS ORGANISER" : "WORKBOOK ORGANISER"}`, {
        size: 14,
        bold: true,
        color: palette.grey,
        alignment: AlignmentType.RIGHT,
        after: 0,
      }),
    ],
  });
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          textRun(`Lesson ${lesson.number}  |  Page `, {
            size: 14,
            color: palette.grey,
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            font: "Arial",
            size: 14,
            color: palette.grey,
          }),
        ],
      }),
    ],
  });

  return new Document({
    creator: "Joshua English Unit 3",
    title: `Lesson ${lesson.number} - ${
      lucas ? "Lucas Organiser" : "Workbook Organiser"
    }`,
    description: `${lesson.title} classroom workbook insert.`,
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 20, color: palette.ink },
          paragraph: {
            spacing: { after: 80, line: 240, lineRule: "auto" },
          },
        },
      },
    },
    sections: [
      {
        headers: { default: header },
        footers: { default: footer },
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: {
              top: 1000,
              right: 680,
              bottom: 680,
              left: 680,
              header: 340,
              footer: 340,
            },
          },
        },
        children,
      },
    ],
  });
}

async function buildLesson(lesson) {
  const dir = path.join(lessonPlansRoot, `Lesson_${lesson.number}`);
  const assets = path.join(dir, "assets");
  fs.mkdirSync(assets, { recursive: true });
  fs.copyFileSync(heroSource, path.join(assets, "rainforest-orangutan-hero.png"));

  fs.writeFileSync(
    path.join(dir, `Lesson_${lesson.number}_Plan.md`),
    planMarkdown(lesson),
    "utf8"
  );
  fs.writeFileSync(
    path.join(dir, `Lesson_${lesson.number}_Presentation.html`),
    presentationHtml(lesson),
    "utf8"
  );
  fs.writeFileSync(
    path.join(dir, `Lesson_${lesson.number}_Organiser.docx`),
    await Packer.toBuffer(organiserDocument(lesson, false))
  );
  fs.writeFileSync(
    path.join(dir, `Lesson_${lesson.number}_Lucas_Organiser.docx`),
    await Packer.toBuffer(organiserDocument(lesson, true))
  );
}

(async () => {
  const requestedLesson = process.argv[2];
  const selectedLessons = requestedLesson
    ? lessons.filter((lesson) => String(lesson.number) === requestedLesson)
    : lessons;
  if (!selectedLessons.length) {
    throw new Error(`Unknown lesson number: ${requestedLesson}`);
  }
  for (const lesson of selectedLessons) await buildLesson(lesson);
  console.log(
    `Built ${selectedLessons.length} complete lesson packages (${selectedLessons
      .map((l) => l.number)
      .join(", ")}).`
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

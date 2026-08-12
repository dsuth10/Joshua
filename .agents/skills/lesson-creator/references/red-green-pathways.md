# Red-green language pathways

Use this reference when a lesson has an extended class route and a concise access route.

## Meaning

- **Red:** extended class wording, technical vocabulary and the standard output expectation.
- **Green:** concise wording, plain-language glosses, reduced language or output load and accessible response options.

The colours are interface states for the teacher. Do not display pathway names, ability judgements, year levels, diagnoses or student identities.

## Markup

Pair the projected content:

```html
<h2>
  <span class="standard-only">Evidence, inference or overclaim?</span>
  <span class="concise-only">Fact, possible result or impossible promise?</span>
</h2>
```

For layouts that must remain grid or flex, add lesson-owned CSS that restores the correct display type when `.concise-active` is present.

The wrapper owns:

- the unlabelled red-green switch;
- `.standard-only` visibility;
- `.concise-only` visibility;
- the `.concise-active` body class.

Use `aria-label="Change language view"` on the hidden checkbox. Do not add a visible legend beside the switch.

## Adaptation rules

Green may:

- shorten sentences and instructions;
- replace uncommon words with common words while retaining the technical term as a gloss when it is being taught;
- reduce the number of examples, evidence points or written sentences;
- add sentence launches, oral rehearsal or alternate response modes;
- use shorter source extracts or a paired reading route;
- simplify classification labels while teaching the same boundary.

Green must not:

- remove the central concept or ethical tension;
- replace reasoning with copying;
- make the correct answer obvious through wording;
- remove genuine concerns, evidence boundaries or safety requirements;
- publicly identify a student or fixed group;
- become a permanently easier curriculum destination.

Extension should increase precision, source evaluation, audience complexity, rebuttal or transfer—not volume alone.

## State contract

Changing language view must not:

- navigate to another slide;
- restart or pause a timer;
- clear a response or correct answer;
- reset a reveal sequence;
- close notes or whiteboard tools;
- erase drawing state;
- reload the page.

Maintain shared interaction state and reveal corresponding text in both language sets. Prefer common `data-step`, `data-answer` or `data-match` values rather than separate interaction engines.

## QA

For every slide:

1. compare red and green meaning;
2. confirm only one language set is visible;
3. check both layouts for overflow at 1280 x 720;
4. switch while the slide is active;
5. switch after an answer, reveal or timer change;
6. verify the selected state is visible by colour and thumb position or outline;
7. confirm no visible copy says `easy`, `hard`, `low`, `high`, `support student` or a student's name.


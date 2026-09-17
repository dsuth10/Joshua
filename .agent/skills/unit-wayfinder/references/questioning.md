# Embedded questioning workflow

Use this procedure for a HITL Grilling ticket. The human owns the decisions; the agent owns the facts, structure, and follow-up.

## Interview loop

1. Identify the decision currently at the frontier. Do not ask about downstream choices whose prerequisites are unsettled.
2. Build a design tree: record the decision, the options that depend on it, and the consequences of each option.
3. Ask a small set of questions from the current frontier. Use `request_user_input_async` when available for missing preferences or constraints, and continue independent work while waiting. Use `request_user_input` only when the current mode permits it. Otherwise ask a concise question directly. Give a recommendation and the key trade-off where useful.
4. Keep work that depends on a required answer pending. Do not infer, simulate, or answer on the human's behalf, or treat a timeout as an answer. Reuse decisions already supplied; do not ask for them again.
5. Update the design tree with the answers, recompute the frontier, and ask the next round.
6. Finish when the decision has a shared, concrete answer and no relevant branch remains silently assumed.

## Plain-text question format

Use this format only when a structured question tool is unavailable or unsuitable. Follow the active tool's schema when using a question tool.

```text
Q1 — <short decision title>: <question and relevant choices or trade-offs>
Recommended: <the option that best fits the destination and current constraints>
```

Keep questions concrete. Ask for a decision, not a vague preference. Find facts through local inspection or authoritative research; do not ask the human for facts the agent can obtain.

## Unit-specific prompts

Use only the prompts whose prerequisites are settled:

- Who are the learners, and what should they be able to know, understand, make, or do by the end?
- Which curriculum, standard, framework, or local requirement governs the unit?
- What evidence would convince us the intended learning occurred?
- What sequence, duration, and learning environment are realistic?
- Which learner differences, access needs, misconceptions, cultural considerations, or safety constraints change the design?
- What is deliberately outside this unit's scope?

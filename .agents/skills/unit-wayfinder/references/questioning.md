# Embedded questioning workflow

Use this procedure for a HITL Grilling ticket. The human owns the decisions; the agent owns the facts, structure, and follow-up.

## Interview loop

1. Identify the decision currently at the frontier. Do not ask about downstream choices whose prerequisites are unsettled.
2. Build a design tree: record the decision, the options that depend on it, and the consequences of each option.
3. Ask every question in the current frontier in one numbered round. Give a clear recommendation for each question and explain the key trade-off.
4. Stop and wait for the human's answers. Do not infer, simulate, or answer on the human's behalf.
5. Update the design tree with the answers, recompute the frontier, and ask the next round.
6. Finish when the decision has a shared, concrete answer and no relevant branch remains silently assumed.

## Question format

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

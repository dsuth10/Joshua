# Curriculum alignment contract

Use this contract whenever a unit claims Australian Curriculum v9 alignment. Read it before closing the outcomes-and-evidence decision.

## Evidence boundary

`curriculum-master` verifies content descriptors from this project's dataset. Treat achievement standards, elaborations, general capabilities, cross-curriculum priorities, school policy, and current official-web requirements as separate research needs unless an authoritative source is supplied.

Never invent a code, alter descriptor wording, or claim coverage beyond the source checked.

Mark a descriptor `verified` only after running an exact `curriculum-master` query and recording that query. Do not call a code range or a likely descriptor “verified” without the corresponding output; label it `research-needed` or `pending scope decision` instead.

## Alignment record

Record this in the unit brief and link supporting evidence from the relevant decision ticket:

```markdown
## Curriculum alignment

- Framework: Australian Curriculum v9
- Evidence source: `ac_v9_complete.json` queried through `curriculum-master`
- Query: `<exact command or equivalent filters>`
- Dataset version/date: `<from the dataset, when relevant>`
- Coverage boundary: Content descriptors only

| Code | Verified descriptor | Unit outcome or learning role | Assessment evidence | Status |
| --- | --- | --- | --- | --- |
| AC9... | <verbatim dataset text> | <what learners will know/do> | <where it is observed> | verified |

## Research still required

- <achievement standard, policy, or other requirement outside the dataset; or `None`>
```

Use `verified`, `research-needed`, or `not-applicable` for status. A descriptor is not aligned merely because it appears in the same subject or year level; state its role in the unit and the evidence that can demonstrate it.

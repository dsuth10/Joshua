# Skill routing contract

Use Unit Wayfinder to plan or substantially revise a full unit or multi-lesson sequence. It owns the destination, decisions, evidence map, and final unit brief. Do not load every specialist skill at charting time; choose the narrowest route once the destination and learning area are known.

## Required route

- **Australian Curriculum v9 content descriptors:** Use [`curriculum-master`](../../curriculum-master/SKILL.md) before accepting curriculum-aligned outcomes. It verifies descriptor-level evidence only.
- **Final unit brief:** Read [unit-output-contract.md](unit-output-contract.md) when the route is clear and before assembling the unit.
- **Individual lesson build or lesson-package audit:** Hand an approved unit brief and the relevant lesson context to `build-engaging-lessons`.

## Conditional specialists

| Situation | Use | Boundary |
| --- | --- | --- |
| English unit designed as a 10-week, 40-lesson sequence with a core text and assessment | [`english-teaching-sequence`](../../english-teaching-sequence/SKILL.md) | Adapt the approved Wayfinder brief; do not reopen resolved destination, learner, curriculum, or assessment decisions. |
| Approved Year 6 Energy and Electricity unit | [`electricity-unit-lesson-creator`](../../electricity-unit-lesson-creator/SKILL.md) | Build or audit its named lesson/resources; preserve the approved 20-lesson sequence unless a variation is approved. |
| Maths Command Station descriptor expansion | [`augmented-assessments`](../../augmented-assessments/SKILL.md) | Implement an application descriptor slice, not a generic classroom unit. |
| Explicit request for the legacy lesson-pack formats or generators | [`lesson-creator`](../../lesson-creator/SKILL.md) | Package a lesson after the unit brief and lesson design are settled. |

## Routing record

Record the chosen route in the map's Notes and the final unit brief:

```yaml
curriculum_authority: curriculum-master | research | not-applicable
subject_adapter: <skill name or none>
lesson_executor: build-engaging-lessons | lesson-creator | specialist skill | none
specialist_skills: []
```

If no listed specialist fits, keep the route generic. Do not force English sequencing, Maths Command Station implementation, or a legacy artifact format onto another learning area.

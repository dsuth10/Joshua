---
name: unit-wayfinder
description: Plan and author coherent units of work from a broad idea by resolving curriculum, learner, sequence, assessment, and resource decisions, then assembling a ready-to-teach unit. Use when Codex needs to create, develop, scope, or substantially revise a unit of work or learning sequence.
---

An initial idea for a unit has arrived — often too broad to turn directly into a useful sequence of lessons. Unit Wayfinder makes the route visible before drafting every activity. It creates a shared map of the decisions that shape the unit, resolves those decisions in dependency order, and then assembles the result into a coherent, teachable unit of work.

This package is self-contained. Its embedded workflows provide the questioning, domain-language, research, and prototyping procedures needed by the ticket types below. Read the relevant file only when that ticket type is active:

- [questioning.md](references/questioning.md) — interview the human about a design decision without answering for them;
- [domain-language.md](references/domain-language.md) — make unit terminology and learning concepts precise;
- [research.md](references/research.md) — gather and cite authoritative facts;
- [prototyping.md](references/prototyping.md) — create a cheap artifact for feedback.
- [skill-routing.md](references/skill-routing.md) — choose the curriculum, subject, and lesson-production skills after the destination is known;
- [curriculum-alignment.md](references/curriculum-alignment.md) — record verified Australian Curriculum v9 descriptor evidence and its limits;
- [unit-output-contract.md](references/unit-output-contract.md) — assemble the final unit brief that downstream skills consume.

Before changing this skill or relying on its project integrations, run:

```bash
node .agent/skills/unit-wayfinder/scripts/audit_unit_wayfinder.mjs
```

Treat a failing result as an integration gap to repair, not as permission to silently bypass the missing contract.

This workspace stores unit maps as local Markdown by default. Before charting or working through a unit, read the [unit tracker contract](../../../docs/agents/issue-tracker.md). Use an external tracker only when the unit map's Notes explicitly names one.

## Plan for the unit's destination

Name what the finished unit must make possible. A destination might be a ready-to-teach unit plan, a curriculum-aligned assessment sequence, or a revision of an existing unit. Do not confuse the destination with a topic: “fractions” is a topic; “learners can compare, represent, and justify fractions in unfamiliar contexts” is a destination.

The destination fixes scope. Record the constraints that materially shape it, including:

- learner year level, stage, prior knowledge, needs, and context;
- subject or learning area and required curriculum, standards, or framework;
- duration, contact time, learning environment, and available resources;
- intended learning, evidence of learning, assessment requirements, and reporting needs;
- accessibility, inclusion, cultural, safety, and school or organisation requirements.

If a required fact is unknown, mark it as an assumption or a research need. Never invent a curriculum code, policy requirement, or learner characteristic.

When Australian Curriculum v9 alignment is required, use `curriculum-master` and record evidence with [curriculum-alignment.md](references/curriculum-alignment.md) before accepting the unit outcomes. Its dataset verifies content descriptors only; create a research ticket for requirements beyond that boundary.

## Work breadth-first

Start with the whole unit before going deep on any one lesson. Establish the learning arc:

1. destination and constraints;
2. big ideas, essential questions, and meaningful learning outcomes;
3. evidence and assessment that would demonstrate those outcomes;
4. prerequisite knowledge and likely misconceptions;
5. sequence of learning experiences, with dependencies and deliberate progression;
6. differentiation, inclusion, resources, and evaluation.

Use the map to resolve decisions, not to pre-write a stack of disconnected lesson plans. A unit is coherent when the outcomes, evidence, sequence, and learning experiences point at one another.

## The unit map

The map is the canonical low-resolution view of the unit. Use the unit-local Markdown tracker by default; it defines the map, ticket, claim, blocker, and frontier operations. If the map's Notes explicitly names an external tracker, use that tracker's native map, child-ticket, assignment, and dependency operations instead. The map is an index: keep the decision detail in its ticket, and link to it rather than duplicating it.

Use this map body:

```markdown
## Destination

<what the completed unit enables learners to know, understand, make, or do>

## Notes

<learner context; curriculum/framework; duration; skills to consult; standing preferences>

## Decisions so far

<!-- one line per closed decision ticket: a useful gist and a link -->

## Not yet specified

<!-- in-scope questions that are visible but not precise enough to ticket -->

## Out of scope

<!-- consciously excluded work, with a reason -->
```

Every decision ticket has a human-readable name and contains one question:

```markdown
## Question

<the single decision or investigation this ticket must resolve>
```

Refer to maps and tickets by name in narration and in Decisions so far. Include links or identifiers inside the name when the tracker provides them; do not make a wall of bare numbers.

## Ticket types

Use the smallest ticket type that fits the decision. A ticket is not a lesson-sized slice of delivery.

- **Research** (AFK): Retrieve authoritative curriculum, standards, policy, subject, or learner-context facts. Read [research.md](references/research.md) when knowledge outside the current workspace is required. Capture sources and the implications for the unit.
- **Prototype** (HITL): Create a rough outline, activity, assessment prompt, lesson stub, exemplar, or visual so the human can react to how the unit might look or behave. Read [prototyping.md](references/prototyping.md) for the embedded procedure.
- **Grilling** (HITL): Resolve a design choice through conversation with the human. Read [questioning.md](references/questioning.md) and [domain-language.md](references/domain-language.md) when terms, learning concepts, or the unit's shared vocabulary need to become precise. Never answer the human's side of a grilling ticket yourself.
- **Task** (HITL or AFK): Perform prerequisite work that unblocks a decision, such as inspecting an existing unit, obtaining a required source, or converting a resource into a usable format. The task must earn its place by enabling a later decision, not by delivering unrelated content.

Use native blocking relationships when the tracker supports them. Otherwise document blockers explicitly. The frontier is the set of open, unblocked, unclaimed tickets. Keep the map deliberately incomplete: precise questions become tickets; the rest stays in Not yet specified until earlier decisions make it sharp.

## Invocation: chart the unit

When the user gives a broad idea:

1. Establish the destination with the embedded Questioning and Domain Language workflows. Confirm the intended learners, context, constraints, and what “finished” means.
2. Read [skill-routing.md](references/skill-routing.md), choose the initial route, and record it in Notes. Map the frontier breadth-first. Surface decisions across outcomes, evidence, sequence, context, inclusion, and resources before going deep on one branch.
3. If the route is already clear and the unit is small enough for one session, say so and ask whether the user wants the unit drafted directly.
4. Create the unit map with its Destination, Notes, and initial Not yet specified areas.
5. Create only the decision tickets that can be stated precisely now.
6. Wire blockers in a second pass, then start independent research tickets in parallel where useful.
7. Stop charting after the map and tickets exist. Charting resolves the route; it does not silently draft the entire unit.

Never resolve more than one non-research ticket in a session. This keeps the human oriented and makes each decision auditable.

## Invocation: work through the unit

When the user invokes an existing map or unit:

1. Load the map at low resolution first. Do not fetch every ticket unless needed.
2. Choose the named ticket, or take the first frontier ticket in order. Claim it before doing work when the tracker supports assignment.
3. Resolve the question using the embedded workflow named in Notes, the routed specialist skills, and any relevant ticket context. Zoom into related tickets only as needed.
4. Record the answer in the ticket's resolution comment or equivalent, close the ticket, and append a concise context pointer to Decisions so far.
5. Add newly surfaced tickets using create-then-wire. Graduate only the newly precise parts of Not yet specified; move consciously excluded work to Out of scope.
6. When the route is clear, read [unit-output-contract.md](references/unit-output-contract.md) and assemble `Unit_Plan/Unit_Brief.md` before producing any requested final formats. Keep the source decisions traceable, but present the final unit as a usable teaching artifact rather than a tracker dump.

## Minimum unit quality bar

Before presenting a completed unit, check that it has:

- a clear learner-facing purpose and bounded scope;
- observable learning intentions or outcomes and success criteria;
- evidence and assessment that actually measure those outcomes;
- a sequence that builds, revisits, and applies learning rather than merely listing activities;
- explicit treatment of prerequisite knowledge, misconceptions, differentiation, and accessibility;
- required resources, vocabulary, timing, and delivery assumptions;
- curriculum or standards references that are verified or clearly marked as assumptions;
- a completed routing record and unit brief that a downstream lesson skill can use without reopening settled decisions;
- a practical way to evaluate and revise the unit after delivery.

Prefer concrete, adaptable learning experiences over activity lists. Explain important trade-offs briefly. Preserve uncertainty where it remains; a transparent assumption is more useful than false precision.

# Issue tracker: Unit-local Markdown

Unit Wayfinder maps are local planning artifacts. Store them with the unit so the decisions, curriculum evidence, and final plan remain together. Do not create GitHub issues unless the unit map's Notes explicitly names GitHub as the tracker.

## Paths

For a unit rooted at `<unit-root>`:

- **Map:** `<unit-root>/Unit_Plan/Wayfinder/map.md`
- **Decision ticket:** `<unit-root>/Unit_Plan/Wayfinder/decisions/NN-<slug>.md`
- **Prototype or research asset:** keep it in the unit's normal `Research/`, `Resources/`, or lesson folder and link it from its ticket.

Number tickets from `01`, preserving their numbers when the map evolves. The map remains the low-resolution index; each ticket owns its question, evidence, and answer.

## Ticket format

```markdown
Type: research | prototype | grilling | task
Status: open | claimed | resolved | out-of-scope
Blocked by: <ticket numbers, or none>
Claimed by: <human or agent, blank until claimed>

## Question

<one precise decision or investigation>

## Evidence

<sources, local paths, or prototype links as needed>

## Answer

<add only when resolving the ticket>
```

## Wayfinding operations

- **Create map:** create `map.md` and its `decisions/` folder before adding tickets.
- **Create ticket:** add one file for each precise question; add its number and title to no map section until it resolves.
- **Wire blockers:** set `Blocked by` after every relevant ticket exists. A ticket is unblocked when every listed ticket is `resolved`.
- **Frontier:** the open, unblocked, unclaimed tickets, ordered by number.
- **Claim:** set `Status: claimed` and `Claimed by` before beginning work.
- **Resolve:** record the answer and evidence, set `Status: resolved`, then append a linked one-line gist to `## Decisions so far` in `map.md`.
- **Rule out:** set `Status: out-of-scope`, explain why in the ticket, and add a linked one-line reason to `## Out of scope` in `map.md`.

Resolve one non-research ticket per session. Research tickets may proceed independently when their findings do not require a human decision.

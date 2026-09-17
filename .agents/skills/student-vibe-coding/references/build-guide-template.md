# Agent BUILD.md contract

Write `BUILD.md` **to the next AI agent**. The student does not have to read it. Be precise. Do not reopen settled student decisions.

Save as `Vibe_Coding/<short-slug>/BUILD.md` beside `decisions.md`.

Follow this shape. Keep each meaning in one place. Use the student's names.

```markdown
# BUILD: <title>

## Pitch and player
One paragraph: who plays, what it is, why Version 1 is fun.
Player: Year 5, about age 10. Assume a school laptop.

## Version 1 scope
Must ship:
- <bullet list of in-scope features>

Out of scope (do not build):
- <bullet list matching the student board's Later / Not this time>

## Core loop or screens
Games: the 10-second loop as ACTION → FEEDBACK → REWARD → REPEAT, plus how a round starts.
Apps: each screen, what the student does there, and how they move between screens.
Keep to one loop or 2–3 screens.

## Controls, win/lose, scoring
- Input: keyboard / mouse / tap, named keys and actions
- Start, pause if any, restart
- Win, lose, or done conditions
- Scoring or progress, including what is saved locally (if anything)

## Visual and audio
- Setting, palette, character notes (original only)
- Avoid generic "AI slop": no purple gradients, Inter-everywhere, or identical rounded cards as the whole look
- Audio: muted-by-default or quiet beeps; must be togglable; no autoplay music

## Technical defaults
- Single HTML file, or a tiny folder with `index.html`
- Plain HTML, CSS, and JavaScript unless a simpler in-browser approach is clearly better
- No backend, no accounts, no third-party login, no analytics
- No network required after the file is opened
- If anything is remembered: `localStorage` only, no personal data

## School-safe constraints
- Original characters and places
- Cartoon, classroom-okay action
- No collection of names, emails, photos, or class lists
- Readable text and simple controls

## Acceptance checks
Done when all of these pass:
- Opens in a browser from the file (or a local folder) without a build step the student must run
- A new player can finish one full round or job without instructions beyond on-screen words
- Win and lose (or done) both work
- Sound can be muted
- Out-of-scope features are absent

## Settled decisions
Do not re-ask or change:
- <one-line list of student choices>

Student board: `./decisions.md`
```

## Writing rules

- Completion checks must be observable. "Feels fun" is not a check. "Catching 10 stars shows You win!" is a check.
- Name modules and behaviours, not file paths that do not exist yet.
- If a prototype snippet would lock a rule better than prose (a tiny state list: `ready`, `playing`, `won`, `lost`), include that list only.
- Australian spelling in any player-facing strings specified here.

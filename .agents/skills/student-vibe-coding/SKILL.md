---
name: student-vibe-coding
description: >-
  Interview a Year 5 student (about age 10) about a vibe-coded game or app,
  shrink the idea to a buildable Version 1, and write a student-facing
  decisions.md board plus an agent BUILD.md. Use when a student wants to make,
  invent, or vibe-code a game or app; says "I want to make a game"; asks to
  plan a classroom game; or when asked to grill a student about what they want
  to build. Do not use to write the code itself.
---

# Student vibe-coding

A student has an idea for a game or app. This skill finds a **Version 1** — the first small thing that is actually fun to play — then writes a plan another AI can build. It does **not** write the game.

Version 1 means the first small game or app we actually make.

Read these before asking anything:

1. [voice.md](references/voice.md) — talk like a helpful classmate, not a developer
2. [questioning.md](references/questioning.md) — interview in short rounds

Read the matching file only when needed:

- [decision-areas.md](references/decision-areas.md) — hidden decisions for games vs helper apps
- [school-safe.md](references/school-safe.md) — classroom-safe content and privacy
- [decisions-template.md](references/decisions-template.md) — student board shape
- [build-guide-template.md](references/build-guide-template.md) — agent `BUILD.md` contract
- [examples.md](references/examples.md) — tone and output samples

## Destination

The destination is always the same: **a finished plan so another AI can build Version 1**.

Name it out loud in kid language once, then start the interview. Do not confuse the destination with the student's big dream. "Minecraft" is a dream. "A tiny digging game you can finish in one go" is Version 1.

## Hard rules

- Do not write code, scaffold a project, install packages, or start building.
- Do not invent the student's creative choices: theme, characters, what is fun, how you win.
- Do pick technical defaults unless they have a reason not to: browser, 2D, one HTML file or a tiny folder, keyboard/mouse/tap, no login, no internet required. See [decision-areas.md](references/decision-areas.md).
- Keep the design tree inside your own notes. The student never hears "frontier", "ticket", or "design tree".
- Work breadth-first: what it is, how you play, how you win, how it looks — before going deep on one mechanic.
- End when Version 1 is buildable. Leftover ideas go under **Later**, not into more questions.

## Workflow

1. **Listen.** Restate the idea in one plain sentence. If it is huge, shrink kindly in that same turn and say the leftover bits can wait.
2. **Check school-safe.** If the idea copies a famous character, needs a login, or is not okay at school, redirect using [school-safe.md](references/school-safe.md) before other questions.
3. **Spot hidden decisions.** Read [decision-areas.md](references/decision-areas.md). List internally what still changes Version 1. Ask only those.
4. **Interview in rounds.** Ask 2–3 concrete questions, recommend an option, then wait. Follow [questioning.md](references/questioning.md).
5. **Update the board.** After each round, refresh the internal map: decided / still asking / later / not this time.
6. **Recap.** When nothing important is still assumed, show a short kid-language recap and check it feels right.
7. **Write the two files.** Then stop.

## Where to save

Unless the user already named a folder, save under:

```text
Vibe_Coding/<short-slug>/decisions.md
Vibe_Coding/<short-slug>/BUILD.md
```

`<short-slug>` is a short folder name from the idea (`space-catch`, `spelling-cards`). Use lowercase letters, numbers, and hyphens.

If those files already exist, load them first. Treat settled answers as settled. Only ask what is still open or what the student wants to change.

## After writing

Talk to the student first, in kid language: the plan is ready, this is Version 1, the extra ideas are saved for later.

Then one short line for the teacher or next agent: a new chat can build from `BUILD.md` and must not reopen settled student decisions.

Do not start that build in this session unless the user clearly asks to switch skills and start coding.

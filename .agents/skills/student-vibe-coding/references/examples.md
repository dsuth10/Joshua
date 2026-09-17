# Examples

Use these for tone and completeness. Do not copy the ideas unless the student asks for the same thing.

## Example 1 — Game

**Student:** "I want to make Minecraft."

### Round 1 (chat)

That's a huge world. Version 1 means the first small game we actually make. The fun we can keep is digging and finding stuff. The big world can wait.

**Q1 — What is the fun?**
What do you most want to do in Version 1?

- A) Dig blocks and find hidden things (Recommended)
- B) Build a house
- C) Fight monsters

Recommended: A, because digging is one clear thing and still feels like Minecraft.

**Q2 — Who is in it?**
We can't copy Minecraft Steve. Who is our miner?

- A) A robot with a tiny drill (Recommended)
- B) A mole in goggles
- C) Someone you name

Recommended: A, unless you already have a name.

**Q3 — How do you move?**
- A) Arrow keys (Recommended)
- B) Mouse only
- C) Tap buttons on screen

Recommended: A, because it's easy on a school laptop.

*(Student picks A, names the robot Pip, picks arrow keys.)*

### Round 2 (chat)

**Q1 — How do you win?**
- A) Dig up 8 gold bits, then go back to the lift (Recommended)
- B) Dig as deep as you can before the timer ends
- C) There is no win, you just dig

Recommended: A, so a round has a clear finish.

**Q2 — How does it look?**
- A) Dark cave, orange gold, Pip is teal (Recommended)
- B) Bright candy mine
- C) Snowy mountain mine

**Q3 — Sound in class?**
- A) Quiet beeps you can mute (Recommended)
- B) Silent

*(Student picks A, A, A.)*

### Recap (chat)

Version 1 is a tiny cave. You move Pip with the arrow keys, dig blocks, grab 8 gold bits, and ride the lift to win. If the cave-in dust covers you, you lose and try again. Worlds, crafting, and friends are saved for Later.

### `Vibe_Coding/pip-dig/decisions.md`

```markdown
# Pip Dig

## My idea
A tiny digging game, like a little bit of Minecraft. You are Pip the drill robot.

## Version 1
One cave. Dig blocks, find 8 gold bits, get back to the lift.
Version 1 means the first small game or app we actually make.

## How you play
Arrow keys move Pip. Space digs the block in front. You pick up gold by walking onto it.

## How you win or finish
Win: 8 gold bits in your bag, then stand on the lift.
Lose: cave-in dust fills the screen. Press R to try again.

## How it looks and sounds
Dark cave, teal Pip, orange gold. Quiet beeps you can mute.

## Later
- A whole world with biomes
- Crafting tools
- Playing with friends

## Not this time
- Copying Minecraft Steve or the Minecraft world (we made Pip instead)
- 3D (Version 1 is a flat side-on cave so it can run at school)
```

### `Vibe_Coding/pip-dig/BUILD.md`

```markdown
# BUILD: Pip Dig

## Pitch and player
Year 5 student plays a short 2D cave game as Pip, a teal drill robot. The fun is digging, grabbing gold, and escaping. One round should be finishable in about a minute.

## Version 1 scope
Must ship:
- Side-on cave made of breakable blocks
- Pip moves with arrow keys, digs with Space
- Gold bits to collect (need 8)
- Lift tile that wins only if the bag has 8 gold
- Cave-in lose state and R to restart
- Mute toggle

Out of scope (do not build):
- 3D, biomes, crafting, multiplayer, Minecraft IP

## Core loop or screens
Start screen (title + Press Space) → playing → won or lost → restart.
Loop: MOVE → DIG → maybe COLLECT → check win/lose → REPEAT.

States: `ready`, `playing`, `won`, `lost`.

## Controls, win/lose, scoring
- Left/Right/Up/Down: move
- Space: dig the facing block
- R: restart from `lost` or `won`
- M: mute
- Win: 8 gold and overlap the lift
- Lose: a cave-in timer or dust meter fills (pick one simple meter; show it on screen)
- Score: gold count only; optional high score in localStorage (`pip-dig-high`, number only)

## Visual and audio
- Dark brown/grey cave, teal Pip, orange gold squares, yellow lift
- Chunky blocks, readable labels (Gold 3/8)
- No purple gradient UI chrome
- Short beep on collect, thud on dig, both muted with M; no autoplay music

## Technical defaults
- Single HTML file with CSS and JS inline or beside it
- No backend, no accounts, no network
- localStorage for high score only

## School-safe constraints
- Original robot character named Pip
- Cartoon cave-in, no gore
- No personal data

## Acceptance checks
Done when all of these pass:
- Opens in a browser from the file
- A new player can win one round using only on-screen words
- Lose and restart both work
- Mute works
- No crafting, 3D, or Minecraft branding

## Settled decisions
- Robot Pip, teal; cave setting
- Arrow keys + Space
- Win at 8 gold + lift; lose on cave-in
- Quiet muting beeps

Student board: `./decisions.md`
```

---

## Example 2 — Helper app

**Student:** "An app that helps me remember my spelling words."

### Round 1 (chat)

That's a helper, not a game. Version 1 can be a small quiz you can do before the test.

**Q1 — What does Version 1 do?**
- A) Show a word, then you type it (Recommended)
- B) Make colourful posters of the words
- C) A timed race against a friend

Recommended: A, because typing the word is the practice.

**Q2 — Whose words?**
We won't save your real name. Where do the words come from?

- A) You type the list at the start (Recommended)
- B) A built-in list of 10 common Year 5 words
- C) Both: start with 10, and you can add more

Recommended: C, so you can practise even if you forget to paste the list.

**Q3 — How do you know you're done?**
- A) You get each word right once (Recommended)
- B) You keep going forever
- C) A timer rings

Recommended: A, so it feels finished.

*(Student picks C, A.)*

### Round 2 (chat)

**Q1 — Look?**
- A) Clean cards, navy and cream, big letters (Recommended)
- B) Space theme
- C) Sticky notes

**Q2 — Sound?**
- A) Silent (Recommended for a spelling quiz)
- B) Quiet beep when you're right

*(Student picks A, B.)*

### Recap (chat)

Version 1 shows a word, hides it, and you type it. There are 10 starter words, and you can add your own. When every word is right once, you get a well done screen. Your name is never saved. Friends and posters can wait.

### `Vibe_Coding/spelling-cards/decisions.md`

```markdown
# Spelling cards

## My idea
A helper that quizzes me on spelling words.

## Version 1
A quiz. See the word, then type it. Ten starter words, and I can add more.
Version 1 means the first small game or app we actually make.

## How you play
Read the word. It hides. Type it. Tap Check. Right words get a tick. Wrong words come back later.

## How you win or finish
You're done when every word in the list has been typed right once. Then you see Well done!

## How it looks and sounds
Navy and cream cards, big letters. A quiet beep when you're right. You can mute it.

## Later
- Posters of the words
- A race against a friend
- Speaking the word out loud

## Not this time
- Signing in or putting your real name (the class computer shouldn't keep that)
- Photos
```

### `Vibe_Coding/spelling-cards/BUILD.md`

```markdown
# BUILD: Spelling cards

## Pitch and player
Year 5 student practises a spelling list on a school laptop. Version 1 is a type-the-word quiz with a small built-in list plus a way to add words.

## Version 1 scope
Must ship:
- Home: start quiz, edit list
- Quiz: reveal word, hide, text input, check
- Retry missed words until each is correct once
- Done screen
- Mute toggle
- Persist the custom list in localStorage (words only)

Out of scope (do not build):
- Accounts, names, photos, speech, multiplayer, posters

## Core loop or screens
Screens: `list`, `quiz`, `done`.
Loop: SHOW → HIDE → TYPE → CHECK → next or restack misses.

## Controls, win/lose, scoring
- Keyboard for typing; Enter to check
- Buttons: Start, Add word, Remove, Mute, Try again
- Done when every current-list word has one correct answer this session
- No fail state; misses return in the pile
- localStorage key `spelling-cards-list`: JSON array of strings, no student name

## Visual and audio
- Navy and cream, large type, high contrast
- One word at a time; no dense dashboard
- Short success beep, muted with toggle; no music

## Technical defaults
- Single HTML file or tiny folder with `index.html`
- No backend, no network
- localStorage for the word list only

## School-safe constraints
- No personal data
- Words only; block or ignore pasted photos
- Classroom-readable text

## Acceptance checks
Done when all of these pass:
- Opens in a browser from the file
- Student can add a word, quiz it, and reach Well done
- Starter list works with no setup
- Mute works
- No login and no name field

## Settled decisions
- Helper quiz, not a game
- See then type; 10 starter words plus add-your-own
- Done when each word is right once
- Navy/cream; quiet success beep

Student board: `./decisions.md`
```

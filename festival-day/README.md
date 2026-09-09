# Great Neighbourhood Film Festival

This folder contains an initial, local-first end-of-term activity for a Year 5 class.

## Open the student activity

Double-click `index.html`, or run `python serve.py` and open http://127.0.0.1:8765/. Students use a username only. Their browser saves a draft when possible; they should download a JSON checkpoint at each teacher approval and before closing the page.

## Listen / narration audio

Listen buttons play pre-baked MP3 files from `audio/{missionId}/` narrated with Doug's Best Voice. Students do **not** need Voicebox running.

If mission copy changes, regenerate clips on a machine that has Voicebox at `http://127.0.0.1:17493`:

```text
node scripts/list-audio-clips.mjs
node scripts/bake-audio.mjs --probe
node scripts/bake-audio.mjs --only m01
node scripts/bake-audio.mjs
```

Unchanged text is skipped using hashes in `audio/manifest.json`.

## Add films

Place the teacher-selected MP4 files here:

```text
films/1.mp4  through  films/12.mp4
```

Film 1–6 map to core missions 1–6. Films 7–12 map to extensions E01–E06. The app presents a helpful message if a film is missing.

## Configure the teacher PIN

Before use, open `config.js` and replace `CHANGE-ME-4729` with a PIN chosen by the teacher. Preserve it as text, including any leading zeroes. Reopen `index.html` and confirm it before the activity begins.

The PIN is deliberately not exported. Because this is a local website, it is a practical classroom approval gate rather than security against a determined user.

## Review student work

Double-click `teacher-review.html`, then choose student JSON files. Review notes are saved only in that browser. Use **Download review backup** when you want to preserve them. The **Download AI review bundle** button exports username-only material; always preview the selected records and ensure students have not named themselves in free-text answers before sending it to an AI tool.

## Delivery register

See [TASKS.md](TASKS.md) for all active, completed and classroom-readiness tasks.

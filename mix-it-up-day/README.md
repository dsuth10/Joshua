# Mix-It-Up Day

Mix-It-Up Day is a bright, self-contained classroom activity day for approximately ten-year-old students. Students choose from short writing, maths, word-problem and creative challenges, save their progress in the browser, export a portable JSON checkpoint, and submit completed work for teacher approval.

The activities deliberately do not share a single theme. A snack shop budget can sit beside a strange-class-pet persuasive piece, a timetable puzzle, a number trick and a pixel-art challenge. This keeps the day surprising while giving students familiar, low-friction task types.

Every maths or word-problem challenge now opens a 24-question mission from a saved 30-question bank. The mix includes calculation, choice, number-line placement and fraction-shading questions, so a student keeps the same selected questions after reload, export and restore. See [MATHS-EXPANSION-GUIDE.md](MATHS-EXPANSION-GUIDE.md) for the teaching design and question coverage.

## Run locally

Open `index.html` in a modern desktop browser. For the most reliable restore, export and teacher-review behaviour, serve the folder through a local web server instead of opening it from the file system.

With Node.js installed, from this folder run:

```powershell
npx serve .
```

Then open the local address shown in the terminal. Use the same address for student devices on a classroom network only when the host computer and school network policy permit it.

There is no build step, database or internet service required. Optional reward films are local MP4 files in `films/`, so the activity remains usable when they are absent.

## Student workflow

1. Enter a classroom-friendly student name.
2. Choose any available challenge and complete the response or interactive puzzle.
3. Progress is automatically stored in that browser on that device.
4. Select **Ready for teacher** when the task meets its success checks.
5. When prompted, ask the teacher to review and approve it.
6. Use **Download my work** to download a JSON checkpoint at any time. Use **Restore my work** to continue from a previously exported checkpoint.

Students can complete tasks in any order. Exported JSON includes their name, task answers, activity state, completion and review status, timestamps and the app version so the teacher-review page can display the original work accurately.

## Teacher approval and PIN configuration

Approval is intended as a quick classroom checkpoint. On the student app, the teacher opens the review prompt, reads the submitted response, then enters the teacher PIN to approve the task or request an improvement.

Before classroom use, open [config.js](config.js) and replace `CHANGE-ME-4729` with a memorable classroom-only PIN that is not shared with students. Existing exported work remains readable for review after a PIN change.

The PIN is **not secure authentication**. It is stored in client-side code, can be discovered by someone with developer tools or access to the source files, and should never be a school, personal, banking or account password. It is a practical confirmation gate for a supervised classroom only.

## Teacher review

Open the teacher-review page in the same browser or on a teacher device. Import one or more student JSON exports to see:

- student name and export time;
- each task’s original prompt, response, calculations or canvas/pixel state;
- submitted, approved and improvement-requested status; and
- the exact completion evidence recorded by the student.

Reviewers can use the page to discuss a task with a student, check it off and keep a downloaded copy of the imported data if needed. Importing a file into the review page does not upload it anywhere.

## Optional film rewards

The teacher can enable a short reward after a task or a set number of approved tasks. Rewards are optional and should be treated as a small transition activity, not a requirement for completing the learning.

Place school-approved, age-appropriate clips at `films/1.mp4` through `films/12.mp4`, then test sound and playback on a student device. Missing files never block a student's approval or progress.

## Classroom setup

Before the session:

1. Set the classroom PIN and decide whether optional rewards are enabled.
2. Open the student app and teacher-review page once on a test device.
3. Complete a sample task, export it, import it on the teacher page and test an approval.
4. Give students headphones if browser read-aloud or reward clips will be used.
5. Tell students to export after substantial work and again before they leave. Browser storage can be cleared by device management, private browsing or a browser reset.
6. Keep a teacher device available for approvals and a fallback activity for students awaiting review.

Suggested lesson flow: introduce the choice board, model one submission and export, run a first activity block, pause for review and stretch, then continue with choice activities and finish with final export.

## Privacy and data limits

Mix-It-Up Day is designed to keep work on the device unless the student explicitly downloads a JSON file or a teacher imports one. It does not require student accounts, email addresses, cloud storage, a database or a third-party analytics service.

That does not make the data private by itself:

- Browser autosave is visible to anyone using the same browser profile on the same device.
- JSON exports are ordinary files. Anyone who receives one can read the student name and work inside it.
- Shared-device browser cleanup, private browsing, storage limits and school management tools can remove local progress.
- A teacher-review import stays in that browser until cleared, but the teacher must still follow school procedures for storing, sharing and deleting student files.
- Reward media is local to the project folder. Check school policy before adding any external material to the activity.

Use first names, initials or classroom nicknames rather than full identifying details. Do not ask students to include addresses, passwords, medical information, contact details or other sensitive personal information in their responses.

## Functional test checklist

- [ ] A new student can enter a name and open every challenge.
- [ ] Writing, maths answers and interactive task state survive a browser refresh.
- [ ] A student can export JSON and restore it into a fresh browser session.
- [ ] An invalid or incompatible JSON file produces a clear error without replacing saved work.
- [ ] Each task can be submitted, improvement-requested and approved with the configured PIN.
- [ ] A wrong PIN cannot approve a task.
- [ ] Approved tasks and total progress appear correctly after export and restore.
- [ ] Teacher review imports a sample JSON file and displays prompts, answers and statuses correctly.
- [ ] Optional rewards are disabled safely when no approved link is configured.
- [ ] Keyboard navigation, visible focus, readable contrast and narrow-screen layout work on a student device.

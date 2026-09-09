# End-of-term mission day: website structure and implementation plan

Status: planning proposal only. No application, dependencies, deployment or full task content created.

Prepared 9 September 2026. Confirmed audience: 19 Year 5 students using their own laptops. Pitch the main reading and instructions at approximately Year 4 level, with additional support for students working below that level. Plan a four-hour programme. The teacher's description of what the class actually studied takes precedence over folder names and older unit labels.

Updated decisions: the teacher personally approves acceptable work by entering a hard-coded PIN on the student's device. Only that approval releases the corresponding reward. Students identify themselves by student username only. Films are numbered local MP4 files in `films/`. The proposed full library needs 12 films: six for core missions and six for extension cases. Implementation will use parallel agents with explicit ownership and integration checkpoints; this document does not authorise starting the build.

## Recommended concept: The Great Neighbourhood Film Festival

Students join a fictional planning team organising linked community film festivals in Australia and Indonesia. Their job is to make the events welcoming, practical and well justified. They investigate places, assess evidence, plan the grounds, allocate resources, solve electrical problems and persuade a committee. Completed missions earn short-film rewards supplied by the teacher.

The festival is a framing device; the academic work remains substantive. It gives area and perimeter, fractions, measurement, electricity and persuasive writing an authentic shared purpose. Students are planning with fictional data and examining models, not carrying out real electrical installation work.

The central question is: **How can we create a festival that works for its people and place—and prove our decisions make sense?**

Each mission creates a useful entry in a student Festival Dossier. The final mission draws on that dossier. Students can revisit and revise earlier answers rather than repeatedly copying them.

Two viable alternatives are an Evidence Agency, with independent investigation cases, or a Community Futures Challenge, in which students advise two fictional communities. The agency offers variety but weaker connections between subjects; the community challenge integrates subjects well but feels closer to another assessment. The festival supplies a playful shared purpose and makes the film rewards feel natural.

## What the existing materials support

The following are findings from source inspection, not a claim that every activity was taught.

| Area | Evidence found | Design implication |
| --- | --- | --- |
| English | Unit 3 persuasive assessment asks students to develop opinions with supporting detail, paragraphs and purposeful language. The unit plan connects persuasion with evidence, perspective, counterargument and revision through Berani. | Require recommendations, explanation of evidence and revisions for an audience; use fresh situations rather than repeat the completed assessment. |
| HASS | The local/global connections assessment in the Year 6-labelled Unit 3 folder is labelled Year 5/Unit 2 internally. It compares Australia and Indonesia through location, climate, diverse characteristics and people–environment connections; it also asks students to evaluate community proposals and design a site map. | Follow the actual Australia–Indonesia learning described by the teacher. Use particular places and sources, comparisons and trade-offs rather than a country trivia quiz. |
| Science | The electricity plan spans circuit conditions, components, conductors, faults, energy transformations and evidence-based comparison of generation sources. | Include both circuit diagnosis and generation decisions. Distinguish energy sources from forms and generation from storage. |
| Maths | Fraction materials address equivalence, mixed numbers, related denominators and decimal connections; measurement materials address mm, cm, m and km. The teacher confirms area and perimeter. | Combine measurements and fractions with explanation, estimation, error analysis and design constraints. Confirm the final difficulty before writing items. |
| Existing website | Reading Labs and Comprehension Challenge already establish reading, written responses and export for review. Local Comprehension Challenge code exports versioned JSON with activity identity, student identity, completion, passages, prompts and answers. | Reuse the interaction and data conventions where suitable. Inspect reusable code before implementation; do not assume the old grader accepts a new multi-subject format. |

Source files are listed at the end. Existing factual and cultural content still needs checking before it is republished. This planning inspection is not a verification of its statistics, quotations or curriculum alignment.

## The shape of the school day

Build a library of **six core missions and six optional 20–30 minute extension cases**. Each core mission also has a short stretch branch. This provides approximately 180 minutes of core learning and another 120–180 minutes of optional material without requiring every student to finish everything.

| Component | Suggested allowance |
| --- | --- |
| Launch, identity and save demonstration | 10 minutes |
| Six core missions | 180 minutes |
| Six short-film breaks, provisionally 4 minutes each | 24 minutes |
| Three short movement/reset breaks | 9 minutes |
| Final portfolio check, export and flexible buffer | 17 minutes |
| Total, excluding normal school breaks | 240 minutes |

The four hours are interpreted as the complete activity programme, including films, reviews, short resets and saving, excluding normal school breaks. Teacher review is a capacity constraint: 19 students completing six missions create 114 reviews. At a provisional 30–45 seconds each, that is 57–85.5 minutes of teacher attention distributed across the day, concurrent with other students working. These are quick acceptance checks rather than full marking; verify actual review time in the pilot. Students continue another mission or extension while waiting, then return for approval. Do not make waiting idle time or silently assume it adds nothing to individual completion times.

These are design targets, not enforced timers or a promise of actual student pace. The teacher should be able to select four, five or six missions for the available day. Longer chosen films reduce the learning time available. Pilot one mission before committing to the final reading and writing volume.

Organise the day into three broad blocks: understand the places; make the design work; test and persuade. Students can work at different speeds within each block. Avoid a leaderboard: reaching the finish first is not the purpose.

Core missions should not become a chain of lockouts. A student struggling with one calculation can keep working elsewhere. If a later mission needs an earlier result, it can use the student's saved decision or a clearly labelled supplied baseline.

## The six core missions

These are structural briefs, not final passages or question sets.

| Mission | Main thinking | Evidence students produce | Fresh angle |
| --- | --- | --- | --- |
| 1. Two Places, One Festival | Compare Australian and Indonesian location dossiers, climate information and community priorities. | An evidence table, comprehension responses and a comparative paragraph explaining what should stay similar and what should change. | Test whether an apparently sensible plan transfers to a different place. |
| 2. The Evidence Editing Room | Examine competing proposals and separate accurate evidence, interpretation, persuasive technique and unsupported claims. | Source-linked explanations and a revised persuasive paragraph for a specified audience. | A confidently written proposal can still be poorly supported; students repair it. |
| 3. Make the Grounds Work | Use area, perimeter and length conversions to evaluate or construct a feasible layout. | Recorded dimensions, calculations with units, a saved diagram and a written defence of a design trade-off. | A layout can have enough area yet fail a boundary or access constraint. |
| 4. Power the Premiere | Trace energy transformations and diagnose simplified low-voltage circuit models. Compare generation options against a fictional location brief. | Predictions, test observations, fault explanations and a justified power recommendation. | Different problems occur at the circuit and generation scales; students distinguish them. |
| 5. The Allocation Challenge | Use fractions, measurement and conversions to share limited resources and test competing claims. | Worked solutions, an allocation table, an explanation of fairness and a response to a changed constraint. | Equal shares and fair outcomes need not mean the same thing. |
| 6. The Committee Hearing | Synthesise evidence from previous missions, address an objection and make a final recommendation. | A concise multi-paragraph proposal, references to earlier work and a revision after new information. | Students must decide which earlier evidence matters most, rather than summarise everything. |

Mission 4 has two related science strands, so its final content must remain tightly bounded: a short fault diagnosis plus a focused generation decision. Move broader comparisons to extension if the pilot exceeds the time target.

Correct prior results should not be required to write a defensible final proposal. Students can identify and correct an earlier error as evidence of learning.

## A repeatable 30-minute mission structure

| Stage | Approximate time | Student experience |
| --- | --- | --- |
| Receive the brief | 2 minutes | Understand a problem, an audience and the product to create. |
| Read the evidence | 7 minutes | Work through a main text and a supporting source, table, plan or diagram. |
| Investigate | 7 minutes | Answer linked comprehension questions; compare, calculate, predict or diagnose. |
| Create the response | 10 minutes | Write a developed explanation or recommendation, or complete a design with written justification. |
| Review and checkpoint | 4 minutes | Check objective items, link evidence, revise and save a checkpoint. |

A typical core mission should start with 300–450 words of source material split into short sections, two or three short constructed responses, a small applied challenge and one developed written response. Use approximately Year 4 reading language for everyone: concrete vocabulary, short instructions, explained technical terms and manageable sentence structure. Keep meaningful Year 5 topic applications where taught; simpler language does not require replacing reasoning with recall.

Aim provisionally for 100–180 words of student writing across an ordinary mission, with flexibility for diagram-heavy work; the final proposal may use 150–250 words across two or three short paragraphs. These are authoring and workload estimates, not word-count reward gates. For students needing more support, offer roughly 180–280 words of essential source material in smaller chunks, visual evidence and sentence stems; a shorter coherent response can meet the same teacher acceptance criteria. Each supported task needs its own matched evidence and prompts so shortening the reading does not remove information needed to answer.

The six core missions could therefore provide roughly 1,800–2,700 words of source reading and around 650–1,150 words of writing across the day on the main route. Pilot for this class before finalising the volume. Put additional readings and more demanding synthesis in extensions for fast finishers. Keep the visual identity age-respectful for Year 5 students; do not display lower-year labels on the student interface.

Vary the product: comparison, explanation, evidence critique, technical justification, fairness judgement and persuasive synthesis. Avoid six identical essay screens.

## Making the work resistant to answer lookup

No local website can make answers impossible to Google, share or generate with AI. The achievable goal is that generic searching does not answer the actual task.

Use a bounded evidence world:

- Original fictional proposals and datasets, clearly distinguished from real geographical or scientific information.
- Questions requiring two sources to be reconciled or a claim to be checked against a table or diagram.
- Specific constraints: the answer must work for this site, this allocation or this audience.
- An evidence notebook: students select a source or passage and explain how it supports their point. Selecting a quotation alone is insufficient.
- Prediction before a test, followed by an explanation of what changed.
- A new constraint revealed after a saved first decision, requiring revision.
- Calculations accompanied by units, method and a reasonableness check.
- A final proposal grounded in the student's own earlier choices.

Use three or four authored case variants with equivalent difficulty. Assign once and preserve the variant in every save and export. Do not randomise real cultural facts or generate uncontrolled scenarios that may become impossible. The teacher's review package must contain the exact variant and data each student saw.

Record meaningful checkpoints such as initial answer, post-feedback revision and final response. Do not record keystrokes or pretend that time-on-page proves effort or authorship.

## Keeping fast finishers productively occupied

Provide six extension cases: a disputed evidence case, a circuit fault file, a redesign under a reduced area allowance, a fraction-allocation dispute, a measurement error investigation and an audience-change writing brief.

Each extension must include new source material or a changed problem, a substantial response and a review step. A stretch branch inside a core mission should introduce a constraint, disagreement or counterexample; it should not merely ask for more sentences.

Each extension case earns its own numbered film after teacher PIN approval. Short stretch branches within a mission are included in that mission's reward and do not require extra films. Completing the core day must remain a complete achievement, with no implication that extensions are required to finish.

## Student website screens

1. **Welcome and resume.** Enter a student username only, choose Start or Import saved work, and see the day's purpose. Do not request names or email addresses. Use the teacher-selected task set and pathway.
2. **Festival map.** Show missions with plain statuses: Not started, In progress, Ready for teacher, Changes requested, Approved. Approved missions show their earned film. Include a prominent Resume button and a short statement of what the student will make in each mission.
3. **Mission workspace.** A desktop layout places source reading next to the current response. Students can enlarge either pane; long text remains readable without squeezed writing boxes. Keep the question visible when referring to evidence.
4. **Evidence notebook.** Store source references and student notes across the day. Linking previous work avoids repeated transcription.
5. **Checkpoint review and teacher approval.** Show unanswered items and objective feedback, followed by a compact view of all responses and the acceptance criteria. The teacher can inspect the full work, request changes or enter the PIN to approve this mission only. Preserve all entered work.
6. **Screening room.** Show earned films, runtime and a clear Watch or Return to missions action. No autoplay.
7. **My dossier.** Preview all work, return to an answer, download JSON, import a checkpoint or print a readable copy.

Every work screen needs a visible save status and Download checkpoint action. Keep navigation shallow, controls large, keyboard access complete and all instructions in Australian English. Support text resizing, reduced motion, high contrast and a stacked layout for small displays.

Use optional glossaries, sentence starters, chunked reading and worked examples. Any easier-reading version must retain the evidence needed to answer its questions. Preserve pathway and accommodation identifiers in exports, using neutral student-facing labels. Avoid publishing private student-specific plans. Built-in browser or device read-aloud may be supported where available; it must not become a dependency for completing the work.

## Reward rules and what “successful” means

Confirmed policy: **teacher PIN approval is the sole in-app route to earning a reward**. Automated checks prepare the work for review; they never release a film.

For each mission, the website can verify that required responses exist, structured fields are complete, selected evidence has an explanation, and objective questions have been resolved through answers or a scaffolded retry. It can also require students to review their work against visible criteria.

The website cannot reliably establish that a paragraph is thoughtful, accurate, original or persuasive. Word count, keywords and punctuation must not be presented as a quality grade. Before approval, the student message is: “Your work is ready. Show your teacher to earn your film.” After valid PIN approval: “Your teacher has approved this work. Your film is unlocked.”

Incorrect objective answers receive useful feedback and another attempt. Repeated difficulty leads to a worked example and a fresh parallel check, or a teacher-supported completion route recorded in the export. Do not trap a student indefinitely or award mastery merely for cycling through choices.

Approval flow:

1. The student completes the mission and opens Ready for teacher. Missing work is shown clearly; the teacher can judge an adjusted response without being blocked by a word-count rule.
2. The teacher sees the username, mission, responses, evidence references, objective-check results and three or four concise acceptance criteria. All detailed work remains accessible.
3. If revision is needed, the teacher selects Changes requested and optionally records a short next step. No film is unlocked.
4. If acceptable, the teacher enters the PIN into a masked field and selects Approve this mission. A correct PIN snapshots the reviewed response revision, records approval and unlocks the assigned film. An incorrect PIN or cancelled dialog changes nothing.
5. The field is cleared immediately on success or closing. There is no persistent teacher-unlocked session, approve-all button or PIN in a student export, log, feedback bundle or saved form value. Each core or extension case requires its own approval.
6. Students may continue another task while awaiting review. Readiness is local to their device; there is no live central queue. Use the classroom's normal help signal and a circulating teacher.

Use one teacher-chosen PIN, stored as a string in a single build configuration entry so leading zeros survive. The exact value is needed before the classroom build, not to complete this plan. No runtime PIN editor or account system is required. Replacing it later means changing that configuration and rebuilding.

Keep the accepted revision as a review snapshot. Students may continue improving their work after approval, and the film stays earned; exports and the teacher viewer distinguish the approved snapshot from later edits. Import/export restores recorded approvals, but these are local classroom records, not tamper-proof evidence. A hard-coded PIN and accessible local film files provide the classroom gate requested, not secure access control.

Earning a reward does not depend on watching every second. A student can defer a film and continue working. Playback completion is not another assessment gate.

## Films and connectivity

Collect **12 films for the complete proposed library**. The six core missions use `1.mp4`–`6.mp4`; the six extension cases use `7.mp4`–`12.mp4`. Six films are sufficient for a core-only pilot. No extra film is needed for the welcome, short stretch branches or final export.

The distribution folder will contain:

```text
festival-day/
  index.html
  START-HERE.txt
  films/
    1.mp4
    2.mp4
    ...
    12.mp4
```

The exact drop location is `festival-day/films/`, beside the student `index.html` at the level shown. Resolve film URLs relative to that page, for example `./films/1.mp4`; do not use absolute computer paths. No file renaming beyond the agreed numbering is required. The website will show Film 1, Film 2 and so on; descriptive titles and credits can be added later without changing filenames.

| Task | Film |
| --- | --- |
| Core missions 1–6, in the order in this plan | `films/1.mp4`–`films/6.mp4`, respectively |
| Extension 1: disputed evidence | `films/7.mp4` |
| Extension 2: circuit fault file | `films/8.mp4` |
| Extension 3: reduced-area redesign | `films/9.mp4` |
| Extension 4: fraction-allocation dispute | `films/10.mp4` |
| Extension 5: measurement error investigation | `films/11.mp4` |
| Extension 6: audience-change writing brief | `films/12.mp4` |

Mapping is fixed by task ID, not the order in which a student completes tasks. Variants and support pathways earn the same film for the same mission. Removing a mission from a day's assignment does not renumber the others.

Play films through an in-page video player with normal controls and no autoplay. Local playback requires no internet. Do not embed films in HTML or JSON, and do not preload all 12 files across every student device. Request a film when the student chooses to watch it; a missing or unplayable file leaves the reward earned and other work available.

The timetable provisionally assumes films around four minutes long; longer films require adjustment. Test actual MP4 files on the school devices because the extension alone does not ensure their encoded video/audio will play. Test several simultaneous viewers from the school drive as well as a single device. If hosted later, upload the same `films/` folder beside the student page. Credits/licence records can accompany the teacher run sheet; they do not change the numbering convention.

## Teacher review: a separate local companion

Deliver a separate `teacher-review.html`, held in a teacher-only location. It acts as the requested backend in day-to-day use, but processes files in the browser without needing a server.

The workflow is: students download their dossier and email it manually; the teacher saves attachments, opens the review tool and imports one or many JSON files. The app has no automatic email access or live student monitoring.

The review tool should provide:

- A class overview of received files, selected missions, completion, unresolved objective checks and review status.
- A student view showing exact passages, data, prompts, responses, calculations, diagrams and meaningful revisions.
- A question view to compare responses to the same item and variant across the class.
- A concise rubric covering evidence use, reasoning, subject accuracy and communication, adapted to each mission.
- Teacher judgement, notes and feedback stored separately from the student's original submission.
- Downloadable teacher review backups and individual feedback files; optional print summaries.
- Duplicate detection by submission identity and revision, with explicit selection between conflicting versions rather than silent overwriting.

The tool must validate file type, size, schema, required fields and known content versions, render student text safely and report an incompatible file without damaging other imports. Keep the original file unchanged. Recompute objective checks against the matching teacher answer pack; do not trust a submitted “correct” flag as an assessment result.

A hidden teacher tab in a student-shared file would not protect answers or private notes. Keep rubrics with model answers and teacher records in the separate teacher package. Student files can contain only the answer checks necessary for immediate feedback; these cannot be secret from a determined user.

## AI-assisted assessment

Support the intended workflow through a teacher-controlled export, not an AI dependency in the student site.

The teacher selects submissions and exports a review bundle containing the relevant readings, exact prompts, variant data, responses and rubric. Identity is **student username only throughout**, including the welcome screen, autosave, filenames, JSON, teacher views and AI bundles. Do not collect names or email addresses, include a name-mapping table, or enrich usernames with other identity information. Usernames are pseudonymous identifiers, not guaranteed anonymity. Tell students not to put names in their responses; provide a preview before AI export because free text may still contain identifying details. Any later support for older imports must omit name/email fields from AI bundles by default.

An AI instruction sheet should request criterion-by-criterion suggestions, evidence quoted from the response, uncertainty and concise feedback. It should treat all student-supplied text as material to assess, never as instructions, and avoid unsupported authorship or cheating claims. Human review remains the final assessment decision.

For version one, allow readable AI feedback to be used alongside the manual review tool. A later slice may support importing structured AI suggestions matched by submission, mission and question IDs, retaining them separately from confirmed teacher judgements. No API key belongs in the student HTML.

## Saving and the JSON hand-in

Use one portable JSON dossier for text and structured diagrams. ZIP adds complexity without benefit unless later requirements include photos, audio or other binary attachments.

The dossier needs these groups:

| Group | Required information |
| --- | --- |
| Identity and versions | Schema version, application version, content-pack ID/version, submission ID, revision, student username and activity date. No name or email fields. |
| Assigned work | Selected mission IDs, pathway, variant, exact scenario values and relevant configuration. |
| Content context | Source texts, source IDs and attribution, prompt text and IDs, diagram definitions or values sufficient to reconstruct the task. |
| Student work | Written responses, evidence links, calculations and units, structured layout/circuit data, initial and final checkpoint responses. |
| Progress | In-progress states, feedback attempts, support route, approval status, approved response revision/snapshot, approval timestamp, earned film IDs and export timestamp. Never include the PIN. These are local records, not tamper-proof marks. |

The teacher's versioned content pack supplies authoritative rubric and marking information. Self-contained student context makes files useful to review with AI even when the original website is not open; version checks protect against interpreting answers against different tasks.

Autosave in the browser is a convenience. JSON download/import is the durable recovery path. For `file://` pages, browser storage behaviour is not standardised and can vary; MDN explicitly advises against relying on it. Detect storage availability, show accurate save messages and continue in memory if unavailable. Prompt for checkpoints at mission boundaries and before breaks. [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

Opening the master page on a shared school drive does not create a class database or write answers back into that page. Each student's work belongs to their browser session and exported file. Downloads go to the browser's configured location; the application must not claim that a download was saved to a chosen school folder or emailed successfully.

Import must preview student identity, mission progress and version before replacing current work. Give an option to export current work first. Preserve answers when a new version is incompatible and provide a readable recovery route. A student moving between local and hosted copies resumes through JSON import; browser autosave does not travel with them.

## Implementation recommendation

Build a small static application with a reusable mission renderer and structured content packs, compiled into a self-contained student HTML file. Bundle styles, scripts, core readings and diagrams; use ordinary bundled JavaScript at runtime, with no server, login, runtime package downloads or API calls required for learning.

Keep source code modular during development, but bundle it before distribution. Browser JavaScript modules loaded directly from `file://` can encounter CORS restrictions, so the distributed file should not depend on module imports or fetching adjacent JSON. [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

Recommended delivery shape:

- Student distribution: `index.html`, a short start guide and `films/` containing `1.mp4`–`12.mp4` supplied by the teacher.
- Teacher distribution: `teacher-review.html`, matching teacher content/answer pack and a short run sheet.
- Development sources: application shell, reusable interaction components, authored mission data, rubrics and a repeatable build command.

Use a few deliberate response components: long text, short text, numeric answer with units and working, evidence reference, comparison table and constrained diagram/layout. Avoid making a full drawing package or general circuit simulator. A small set of authored test states or bounded interactions is sufficient for this day.

Use the same compiled student file for a future page or section of mrsutherland.net. Keep paths relative and student records out of published assets. Hosting does not require adding accounts, automatic collection or a database. Do not redesign the main website to accommodate this resource.

Reusing existing Comprehension Challenge export conventions is worthwhile; reusing its entire application or promising compatibility with its existing grader requires a separate code review. This plan inspected the export shape, not end-to-end runtime behaviour.

## Proposed implementation sequence after approval

1. **Agree the structure.** Use the confirmed 19 Year 5 students, approximately Year 4 reading level, laptops and four-hour programme. Teacher PIN approval, local numbered films and username-only identity are settled. Keep precise questions and readings for the next content-planning stage. Provisionally target current Edge and Chrome on laptops; confirm actual browser/operating system at the device-check gate rather than blocking planning.
2. **Prove local reliability.** Build a minimal vertical slice: one passage, one written answer, one objective check, checkpoint export/import, teacher PIN approval, local film playback and teacher import. Test double-click opening from the actual school drive and a student account, including blocked storage and a browser restart. Use a clearly labelled temporary test fixture for media until supplied films are available; never count that as validation of the final films.
3. **Pilot one complete mission.** Write and build one representative mission with a variant and support route. Observe timing, reading load, writing quality, recovery and reward behaviour. Review its JSON in the teacher companion and as an AI assessment bundle.
4. **Build the full core day.** Author the remaining five missions using the proven structure. Add dossier reuse, final synthesis and consistent marking guidance. Verify factual/cultural sources and the maths/science answer models.
5. **Add depth and teacher efficiencies.** Complete six extensions, bulk import, comparison views, feedback exports and film configuration.
6. **Classroom readiness and optional hosting.** Test all paths and selected films, prepare instructions and fallbacks, then publish only if requested.

Stop for a checkpoint after the reliability slice and the first complete mission; they determine whether the intended experience works before extensive content production.

## Parallel-agent implementation plan

Parallel implementation is an explicit requirement. Use a coordinating lead plus up to three simultaneous worker agents, matching the available four-agent capacity. Agents work in the same project with exclusive file ownership; they do not independently rewrite the shared shell, schema or build configuration. No implementation agents are launched during this planning update.

Proposed project root: `festival-day/` in the Joshua workspace. The lead checks existing files and applicable instructions before creating it. Source ownership below is a proposed contract, not a set of folders already created.

### Stage 0: shared contracts, owned by the lead

Before parallel code work, freeze and commit to the project documentation:

- Mission and question IDs, six core/extension film mappings, content-pack versions and variant identity.
- Content schema: source blocks, prompts, response types, support versions, objective checks, acceptance criteria and teacher-only rubric/model-answer fields.
- State/export schema: username, responses, revisions, approval snapshots, earned film IDs and version compatibility. Keep PIN configuration outside serialisable state.
- Application actions: edit response, request review, request changes, approve mission, export checkpoint and import checkpoint. Only a successful PIN check can dispatch approval in the normal UI.
- Shared UI tokens, accessible component requirements and the local HTML packaging contract.
- One small complete fixture submission and teacher review fixture, plus expected import/export behaviour.

The lead owns `contracts/`, `src/shared/`, `src/config/`, package/build configuration and final distribution assembly. Requested interface changes return to the lead, who updates the contract and informs all affected workers before they proceed. Workers do not patch shared files to unblock themselves.

### Stage 1: three parallel engineering workstreams

| Worker | Exclusive ownership | Deliverable | Interface dependency |
| --- | --- | --- | --- |
| A — Student experience | `src/student/`, student component checks | Mission map, source/response workspace, notebook, approval dialog, numbered film player and accessible navigation. | Shared actions/state; export/download service; approval service. |
| B — Persistence and approval | `src/services/`, service checks | Autosave detection, JSON validation/import/export, revision snapshots, PIN validation and approval/film state transitions. | Frozen schemas, single PIN configuration entry, stable film map. |
| C — Teacher review | `src/teacher/`, teacher component checks | Batch import, exact-context views, rubric/feedback records and username-only AI review export. | Same export schema and teacher content pack; fixture files. |

The lead assembles the local builds, maintains the shared interfaces, prepares the pilot content fixture and integrates one vertical slice. Each worker supplies changed-file scope, interface assumptions, tests run and remaining gaps. The lead alone regenerates distribution output and serialises shared-file edits. No worker pushes, deploys or installs dependencies independently.

Gate 1: the complete student → PIN approval → export → restore → teacher review path passes locally. The PIN never appears in saved/exported data; automatic completion never earns a reward. School-device verification remains a distinct gate requiring actual access or a teacher-run check.

### Stage 2: pilot one mission, then parallel content production

Build and review one complete representative mission before scaling content. Once its workload, interaction model and rubric are accepted, reuse the three worker slots:

| Worker | Exclusive content ownership | Coverage |
| --- | --- | --- |
| A — English/HASS | `content/core/m01/`, `content/core/m02/`, `content/extensions/e01/`, `content/extensions/e06/` | Place comparison, evidence evaluation and audience-aware persuasion. |
| B — Maths | `content/core/m03/`, `content/core/m05/`, `content/extensions/e03/`, `content/extensions/e04/`, `content/extensions/e05/` | Area/perimeter, fractions, measurement and conversions, including worked solutions. |
| C — Science | `content/core/m04/`, `content/extensions/e02/` | Circuit models, fault diagnosis, generation comparisons and scientific explanations. |
| Lead — Synthesis and integration | `content/core/m06/`, shared source catalogue and content manifest | Final committee proposal, cross-mission references, consistent reading load and stable task IDs. |

Each content owner delivers a main reading at approximately Year 4 level, a further supported version, variants, source provenance, response specifications, objective solutions, teacher acceptance criteria, extension material and timing estimates in the frozen format. All workers share the same language and workload targets for this Year 5 class of 19; extensions add depth without making the core reading harder. Teacher-only fields are stripped from student distribution as specified; immediate-feedback checks remain available locally. The lead may draft the final mission's structure while subject packs are in progress, but final cross-mission prompts wait until those packs and their IDs are stable.

Engineering fixes during this wave return to the original owning lane or are handled by the lead; a content worker does not alter runtime behaviour. Cultural and factual statements require traceable sources; fictional datasets must be explicitly labelled. No personal class records belong in authored content or fixtures.

### Stage 3: parallel independent review, then serial integration

Use the three workers for bounded read-only audits of student accessibility/navigation, data/approval/recovery, and content/rubric accuracy. Reassign reviews so authors are not the sole reviewers of their work. Each reports reproducible findings tied to a file/task and acceptance criterion. The lead assigns fixes back to owners, integrates them sequentially where files overlap and runs final end-to-end checks.

Required integration scenarios include wrong/cancelled/correct PIN; completion without approval; revised work after approval; checkpoint restore of both pending and approved work; missing film; supported response accepted by the teacher; username-only AI output; conflicting imports; unavailable browser storage; and multiple students playing films from the school drive.

Read-only audits can run concurrently. Shared package changes, build generation and final release assembly have one writer. Keep one integration checklist and handoff record identifying each agent's files, dependencies, checks and unresolved issues. User approval of this plan precedes implementation; the reliability and pilot checkpoints remain in place rather than launching all content and infrastructure work at once.

## Acceptance criteria for the eventual build

- A student can double-click the file from the intended school location and complete all learning tasks with network access disabled.
- Objective feedback covers correct, incorrect, equivalent numeric/fraction forms, units, retry and supported completion.
- Written responses are never labelled high-quality solely because of length or keywords.
- Completing every question does not unlock a film. Correct teacher PIN approval unlocks only the reviewed task's assigned film; wrong PIN, cancellation and requests for changes unlock nothing.
- No reusable teacher-unlocked session exists. PIN values are excluded from saved state, JSON, logs and AI bundles.
- The exact approved response snapshot remains available after later edits and after export/import.
- Student usernames are the only collected student identifiers; names and email fields are absent from UI, filenames and AI exports.
- A checkpoint survives export, browser closure and import with the same text, variant, diagram, progress and earned rewards.
- Storage failure is visible, and file export remains available.
- The teacher imports a whole class, sees complete context, resolves duplicates and saves review work without modifying original submissions.
- Invalid or unexpected JSON cannot execute content or break the remaining review session.
- Support and extension pathways are complete, keyboard usable and do not expose student-specific private information.
- All 12 numbered film paths match their fixed mission/extension IDs. Missing/unplayable films fail gracefully without losing approval; actual files, school accounts and concurrent school-drive playback are tested.
- A timed pilot supports the workload estimate; fast finishers have new substantial work, while core completion remains attainable.
- Local and hosted versions use the same content identity and successfully exchange saved files.

## Decisions needed before content production

Settled by the teacher: PIN approval of acceptable work before each reward; one hard-coded PIN; student usernames with no names in AI assessment; numbered local films; and a build organised into parallel agent workstreams. Do not reopen these choices.

Also confirmed: 19 Year 5 students, their own laptops, approximately Year 4 reading level with further support, and four hours of total activity time. The proposed structure retains the festival theme, six core missions, six extension cases and separate student/teacher local applications. No further answer is required to finish the structural plan. The current timing assumes the four hours includes rewards and approval; preserve that interpretation unless the teacher changes it.

The exact PIN can be supplied before packaging. Actual film runtimes, browser/operating system and school-drive access/playback are classroom-readiness checks once devices and films are available. Neither films nor a PIN need to be supplied now. Implementation remains subject to approval of this plan.

## Sources inspected

- `Units/English/English_Unit_3/English Unit 3 Plan.md`
- `Units/English/English_Unit_3/English_Unit_3_Assessment.md`
- `Units/HASS/Unit 3 - HASS Year 6 (V8)/Assessment Tasks/P-6CPM_HASS_Acycle_U2_Y05_AT_OneNote.md`
- `Units/Science/Unit 3 Electricity/Year_6_Energy_and_Electricity_Integrated_Unit_Plan.md`
- `Units/Science/Unit 3 Electricity/Lesson_Plans/Lesson_Energy_Sources_Assessment/Lesson_Energy_Sources_Assessment_Plan.md`
- `Units/Maths/Converting_Length_Measurements/Converting_Length_Measurements_Plan.md`
- `Units/Maths/Maths_Unit_3/Lesson_Plan_Formative_Fractions_Response.md` — used for topic scope only; no individual records reproduced.
- `Homework_Interactive_Pilot/README.md`
- Local sibling checkout: `C:/Users/dsuth/Documents/Code Projects/mrsutherland-com/comprehension-challenge/shared/handout.js` — inspected export fields and surrounding code.
- [Mr Sutherland homepage](https://mrsutherland.net/), [Reading Labs](https://mrsutherland.net/pages/persuasive-reading-labs.html) and [Comprehension Challenge](https://mrsutherland.net/pages/comprehension-challenge.html) — public descriptions inspected; no claim of live interaction testing.
- MDN documentation linked in the saving and implementation sections.

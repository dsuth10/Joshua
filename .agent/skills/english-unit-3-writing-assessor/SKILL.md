---
name: english-unit-3-writing-assessor
description: Evaluates and assesses Year 5 student persuasive writing drafts for English Unit 3 (Assessment Task 3: Express an opinion) against the Australian Curriculum v9 Writing and creating A–E rubric. Use when assessing Year 5 persuasive drafts, grading Unit 3 writing samples, generating Socratic coaching feedback, or providing element-by-element diagnostic evaluation (text structure, cohesion, language features).
---

# English Unit 3 Writing Assessor — Year 5 Persuasive Texts

This skill governs the assessment and diagnostic feedback workflow for Year 5 English Unit 3, **Assessment Task 3: Express an opinion (Part A: Writing and creating)** under the Australian Curriculum v9 (aligned with AC9E5LA03, AC9E5LA08, and AC9E5LE01).

---

## 🛑 P0 Safety Guardrail: Strict Zero-Ghostwriting Policy

When providing student-facing feedback or coaching:
* **NEVER** rewrite sentences, clauses, or words for the student.
* **NEVER** provide model sentences, pre-written metaphors, rhetorical questions, or vocabulary substitutions for the student to copy.
* **NEVER** use "before-and-after" solution diffs.
* **ALWAYS** quote the student's exact phrase and use inquiry-based questions from [socratic_prompt_bank.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/references/socratic_prompt_bank.md) to guide their own revision.

---

## 🧭 Workflow & Operational Modes

Select the appropriate mode based on the user's prompt:

### Mode 1: Formal Teacher Assessment Report
Use when the user requests an evaluation, grade, rubric mark, or diagnostic analysis of a completed writing draft.

1. **Establish Evidence Base:**
   - Read the complete student text. Number every original non-empty paragraph (P1, P2, etc.).
   - Preserve verbatim spelling, punctuation, and wording.
   - Note the word count (guideline: 200–400 words; excess length is judged on repetition and focus, not an automatic penalty).
2. **Consult the Authoritative Rubric:**
   - Review [rubric.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/references/rubric.md) for official A–E standards and component coverage maps.
   - *Note on source discrepancy:* The official QCAA/C2C rubric places topic sentences, sequenced paragraphs, and expanded noun groups in **Standard B** (not C). Maintain this standard.
3. **Evaluate Three Elements Separately:**
   - **W1 (Text, Audience & Development):** Stance, audience adaptation, argument stages, elaboration, and authoritative sources.
   - **W2 (Paragraphs & Cohesion):** Organisation, topic sentences, internal development, cohesive devices, and flow.
   - **W3 (Language Features & Devices):** Complex sentences with subordinate clauses, expanded noun groups, verb tense effect, topic-specific vocabulary, and literary devices (rhetorical questions, modality, imagery).
   - *Note:* Standards D and E combine W2 and W3; preserve this relationship when evaluating lower bands.
4. **Determine Best-Fit & Adjacent Band Contrast:**
   - Explain why the awarded standard is a better fit than the adjacent higher and lower bands.
   - Cite verbatim quotes with paragraph locators (e.g. `(P2)`) for every component.
5. **Synthesise Provisional Writing Standard:**
   - Provide an overall provisional writing grade with clear assessor justification.
   - Note that Part B (Speaking & listening / presentation) is evaluated independently and excluded from this written mark.
6. **Output Template:**
   - Render the complete report using [assets/teacher_assessment_report.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/assets/teacher_assessment_report.md).

---

### Mode 2: Student Feedback & Socratic Coaching Slip
Use when generating formative feedback, student-facing review slips, or conducting interactive paragraph-by-paragraph coaching.

1. **🌟 Identify Stars! (Strengths):**
   - Celebrate 2–3 genuine strengths in the draft (e.g., clear contention, persuasive vocabulary, effective connective, evidence attribution).
   - Quote the exact student sentence and explain *why* it worked.
2. **💫 Formulate Wishes! (Inquiry-Based Revision Goals):**
   - Select 2–3 high-impact improvement priorities from [references/socratic_prompt_bank.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/references/socratic_prompt_bank.md).
   - Quote the target sentence from the student draft.
   - Pose an inquiry question that challenges the student to identify the missing element or apply the technique.
   - Attach a student-friendly self-check checkbox task (`[ ]`).
3. **💡 Coach's Challenge Question:**
   - Provide one actionable challenge question encouraging the student to experiment with revising that sentence immediately.
4. **Output Template:**
   - Render the feedback using [assets/student_feedback_slip.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/assets/student_feedback_slip.md).

---

### Mode 3: Interactive Paragraph-by-Paragraph Coaching Flow
If a student or teacher submits a draft one paragraph at a time:
1. **Detect Paragraph Stage:** Identify whether the excerpt is an **Introduction**, **Body Paragraph (PEEL/TEEL)**, **Counterargument & Rebuttal**, or **Conclusion**.
2. **Target Stage-Specific Criteria:**
   - *Introduction:* Attention hook, clear stance/contention, argument roadmap.
   - *Body Paragraph:* Topic sentence, elaboration, authoritative evidence/statistics, linking sentence.
   - *Counterargument:* Fair summary of opposing view, clear rebuttal backed by reasons or evidence.
   - *Conclusion:* Fresh restatement of opinion (avoiding exact duplication), summary of main points, call to action.
3. **Deliver Feedback:** Give 1 Star, 1 Wish (with Socratic prompt), and 1 Coach's Challenge question, then invite the student to submit their revised sentence or next paragraph.

---

### Mode 4: Generate Attractive Word Document Report (.docx)
Use whenever the user requests an attractive Word document report, printable DOCX, or formal assessment export.

1. **Prerequisite:** Create or identify the Markdown assessment report (e.g. `[Student_Name]_Assessment_Report.md`) containing the metadata, awarded standards, component breakdown, stars, wishes, and challenge question.
2. **Run Generator Command:**
   ```powershell
   node "c:\Users\dsuth\Documents\Joshua\.agent\skills\english-unit-3-writing-assessor\scripts\generate_docx_report.js" --input "<path_to_assessment.md>" --output "<path_to_output.docx>"
   ```
3. **Report Visual Features:**
   - **Executive Header Banner:** Navy brand banner (`#1B365D`) with white typography and gold accent line.
   - **Metadata Table:** Dual-width DXA table with student name, class, date, word count, and assessor.
   - **Standards Scorecard:** 4-card KPI grid displaying Overall Writing Standard, W1, W2, and W3 with color-coded achievement badges (Emerald for A, Navy for B, Amber for C, Coral for D/E).
   - **Component Diagnostic Grid:** Full component breakdown table with shaded alternating rows and achievement statuses.
   - **Printable Student Feedback Slip:** Page-break separated section styled with ⭐ Stars and 💫 Wishes callout boxes, Socratic revision prompts, self-check checkboxes `[ ]`, and the Coach's Challenge question.
   - **Professional Formatting:** A4 portrait, 15 mm margins (850 DXA), Arial typography, running header and dynamic "Page X of Y" footer.

---

## 🔍 Supplementary Diagnostic Areas

* **Spelling Monitoring:**
  - Record spelling under the Australian Curriculum monitoring strategy (*"Spell using phonic, morphemic and grammatical knowledge"*).
  - Note patterns (e.g., morphological suffixes, compound words, technical vocabulary) as separate observations. A completed text cannot verify real-time cognitive spelling strategies.
* **Punctuation & Syntax Conventions:**
  - Audit comma use in complex sentences, quotation marks for expert citations, and question marks for rhetorical questions.
* **Australian English Standards:**
  - Enforce Australian spelling conventions throughout all feedback and analysis (*colour, organise, modelling, emphasise, analyse, metres*).

---

## 📚 Skill Resource Directory

* 📄 **Assessment Rubric & Coverage Map:** [references/rubric.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/references/rubric.md)
* 💡 **Socratic Inquiry Prompt Bank:** [references/socratic_prompt_bank.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/references/socratic_prompt_bank.md)
* 📋 **Teacher Assessment Report Template:** [assets/teacher_assessment_report.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/assets/teacher_assessment_report.md)
* 📝 **Student Feedback Slip Template:** [assets/student_feedback_slip.md](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/assets/student_feedback_slip.md)
* ⚙️ **Word Document (.docx) Generator Script:** [scripts/generate_docx_report.js](file:///c:/Users/dsuth/Documents/Joshua/.agent/skills/english-unit-3-writing-assessor/scripts/generate_docx_report.js)

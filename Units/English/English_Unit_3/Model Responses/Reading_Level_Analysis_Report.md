# Reading Level Analysis Report

## Scope

This report analyses the readability of the model response documents in [Model Responses](</d:/dsuth10/My Documents/Joshua/Units/English/English_Unit_3/Model Responses/>):

- [Modelled responses Yr 3 & 4.md](</d:/dsuth10/My Documents/Joshua/Units/English/English_Unit_3/Model Responses/Modelled responses Yr 3 & 4.md>)
- [Modelled responses Yr 5.md](</d:/dsuth10/My Documents/Joshua/Units/English/English_Unit_3/Model Responses/Modelled responses Yr 5.md>)
- [Modelled responses Yr 6.md](</d:/dsuth10/My Documents/Joshua/Units/English/English_Unit_3/Model Responses/Modelled responses Yr 6.md>)

The Year 3 and Year 4 source file was split into two separate response bodies for analysis because it contains two different exemplar texts in one document.

## Method

The analysis used the `.agent/skills/text-analysis` workflow with the `textstat` metrics specified by the skill:

- Flesch Reading Ease
- Flesch-Kincaid Grade Level
- SMOG Index
- Automated Readability Index
- Coleman-Liau Index
- Gunning Fog

Only the persuasive response body from each exemplar was analysed. Teacher commentary such as `Why this is A Standard` was excluded so the scores reflect student-facing reading demand rather than annotation text.

Target bands from the skill:

| Target level | Intended age | F-K Grade target | Flesch target |
| --- | --- | --- | --- |
| `L1` | 12-13 years | 6.5-8.5 | 55-72 |
| `L2` | 10-11 years | 4.5-6.5 | 68-82 |
| `L3` | 8-9 years | 2.5-4.5 | 78-92 |

Applied targets for this report:

- Year 3: `L3`
- Year 4: `L2` as the closest available band in the skill
- Year 5: `L2`
- Year 6: `L1`

## Results Summary

| Text analysed | Target | Words | Sentences | Avg sentence length | Flesch Reading Ease | F-K Grade | SMOG | ARI | Coleman-Liau | Gunning Fog | Result |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Year 3 response | `L3` | 162 | 13 | 12.5 | 59.5 | 8.1 | 10.7 | 10.1 | 12.1 | 10.2 | Fail |
| Year 4 response | `L2` | 250 | 17 | 14.7 | 40.0 | 11.3 | 13.7 | 13.4 | 15.3 | 14.2 | Fail |
| Year 5 response | `L2` | 316 | 22 | 14.4 | 43.7 | 10.7 | 12.8 | 12.5 | 14.4 | 12.7 | Fail |
| Year 6 response | `L1` | 374 | 23 | 16.3 | 22.5 | 14.2 | 15.7 | 16.2 | 17.9 | 17.6 | Fail |

## Interpretation

### Year 3 response

- Intended target: `L3`
- Actual readability profile: much closer to `L1` by F-K Grade, and still harder than `L1` by several supporting metrics
- Main drivers of difficulty:
- Multi-clause sentences
- Abstract vocabulary such as `confident`, `encourage`, `introducing`, `addition`
- Persuasive phrasing that is more typical of older readers than an 8-9 year-old independent reading band

This text is not aligned to the skill's `L3` band. It reads substantially above the expected Year 3 independent reading level.

### Year 4 response

- Intended target: nearest available band `L2`
- Actual readability profile: clearly above `L2` and above `L1`
- Main drivers of difficulty:
- Longer sentences with subordinate clauses
- Abstract noun-heavy vocabulary such as `wellbeing`, `achievement`, `educational benefits`, `literacy development`
- Counterargument and rebuttal structures that increase conceptual and syntactic load

This is a sophisticated persuasive exemplar, but it is too demanding to count as a straightforward Year 4 reading-level model if the goal is accessible independent reading.

### Year 5 response

- Intended target: `L2`
- Actual readability profile: above `L2` and also above `L1`
- Main drivers of difficulty:
- Formal persuasive tone
- Frequent abstract and topic-specific vocabulary
- Long information-dense sentences, especially in the evidence and rebuttal sections

Although this is labelled as a Year 5 model response, the measured difficulty is more consistent with secondary-level readability than middle-primary readability.

### Year 6 response

- Intended target: `L1`
- Actual readability profile: well above `L1`
- Main drivers of difficulty:
- Long average sentence length
- High density of polysyllabic academic vocabulary such as `initiative`, `educational investment`, `inclusive`, `regulation`, `opportunities`, `traditional`
- Heavy use of abstraction, evaluative phrasing, and extended clause structures

This is the most demanding text in the set and sits far above the skill's 12-13 year target band.

## Cross-Document Pattern

The texts become progressively more difficult from Year 3 to Year 6, which is pedagogically sensible. However, every text in the set sits above the target band used for its year level.

Two patterns are especially consistent:

- Sentence length stays relatively high across all four analysed responses.
- Vocabulary is more sophisticated than the nominal year labels suggest, especially in the Year 4 to Year 6 exemplars.

In practical terms, these exemplars are better understood as strong teacher-model texts than as independently accessible reading-level matches for the labelled year cohorts.

## Teaching Implications

- If these are intended as teacher read-aloud or jointly deconstructed mentor texts, they are usable with scaffolding.
- If these are intended as independent student reading exemplars at face-value year level, they are too difficult.
- The Year 3 response is the closest to an accessible band, but it still overshoots the `L3` target substantially.
- The Year 6 response is particularly advanced and would likely require pre-teaching of vocabulary and sentence unpacking even for capable upper-primary students.

## Recommendations

### If the goal is to keep them as high-quality mentor texts

- Retain the current argument structure and sophistication.
- Add teacher support notes for vocabulary, sentence unpacking, and modelled reading.
- Present the texts as stretch exemplars rather than on-level independent reads.

### If the goal is to align the texts to student independent reading bands

- Shorten sentence length, especially in introduction and rebuttal paragraphs.
- Replace abstract nouns with simpler, more concrete alternatives where possible.
- Reduce clause stacking such as `while`, `however`, `therefore`, and embedded explanation chains.
- Keep one persuasive technique focus per paragraph rather than combining evidence, evaluation, and rebuttal in the same sentence cluster.
- For Year 3 and Year 4 in particular, simplify topic-specific vocabulary unless it is explicitly being taught.

## Overall Conclusion

All analysed model responses fail their target reading-level band under the `.agent/skills/text-analysis` criteria.

The texts are strong persuasive exemplars, but they function best as aspirational or teacher-supported models rather than independently accessible same-year reading samples.

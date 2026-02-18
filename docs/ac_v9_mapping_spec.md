# AC v9 Mapping Specification

## Scope
- Source: `curriculum-workbook.xlsx` (sheet: `Learning areas`)
- Included: Australian Curriculum v9 content descriptions, Foundation to Year 10
- Excluded: `Learning Area == Languages`
- Included learning areas: English, Mathematics, Science, Humanities and Social Sciences, Technologies, The Arts, Health and Physical Education
- Record type: rows where `Content Description` is non-empty

## Output Target
- File: `ac_v9_complete.json`
- Payload section rebuilt by script: `example.curriculum`
- Schema (`$schema`, `definitions`, `properties`) is preserved

## Normalization Rules
- `year_level` mapping from workbook `Level`:
  - `Foundation Year` -> `Foundation`
  - `Year X` -> `X`
  - `Years X and Y` -> `X-Y`
- `text` is normalized by collapsing whitespace to single spaces and trimming.
- `sequence_number` is deterministic per destination container, sorted by `Code`.

## Structural Mapping

### English
- Learning area: `english`
- Subject: `English`
- Strands by code token:
  - `AC9E*LA*` -> `language`
  - `AC9E*LE*` -> `literature`
  - `AC9E*LY*` -> `literacy`

### Mathematics
- Learning area: `mathematics`
- Subject: `Mathematics`
- Strands by code token:
  - `N` -> `number`
  - `A` -> `algebra`
  - `M` -> `measurement`
  - `SP` -> `space`
  - `ST` -> `statistics`
  - `P` -> `probability`

### Science
- Learning area: `science`
- Subject: `Science`
- Strands by code token:
  - `U` -> `science_understanding`
  - `I` -> `science_inquiry`
  - `H` -> `science_human_endeavour`

### Humanities and Social Sciences
- Learning area: `hass`
- Subjects:
  - `HASS F-6` -> strand `hass_f6`
  - `History 7-10` -> strand `history`
  - `Geography 7-10` -> strand `geography`
  - `Civics and Citizenship 7-10` -> strand `civics_citizenship`
  - `Economics and Business 7-10` -> strand `economics_business`
- Sub-strands by code token:
  - `K` -> `knowledge`
  - `S` -> `skills`

### Digital Technologies
- Learning area: `digital_technologies`
- Subject: `Digital Technologies`
- Strands by code token:
  - `K` -> `knowledge_understanding`
  - `P` -> `processes_production`

### Design and Technologies
- Learning area: `design_technologies`
- Subject: `Design and Technologies`
- Strands by code token:
  - `K` -> `knowledge_understanding_dt`
  - `P` -> `processes_production_dt`

### Health and Physical Education
- Learning area: `health_physical_education`
- Subject: `Health and Physical Education`
- Strands by code token:
  - `P` -> `personal_social_community_health`
  - `M` -> `movement_physical_activity`

### The Arts
- Learning area: `the_arts`
- Subjects mapped to strands:
  - `Dance` -> `dance`
  - `Drama` -> `drama`
  - `Media Arts` -> `media_arts`
  - `Music` -> `music`
  - `Visual Arts` -> `visual_arts`

## Coverage Matrix Rule
- Matrix key: `example.curriculum.year6_coverage_matrix`
- Year 6 target population includes descriptors with workbook levels:
  - `Year 6`
  - `Years 5 and 6`
- `descriptor_target_count` and `descriptor_completed_count` are computed from generated payload.

## Validation Gates
- JSON parses and preserves schema root fields.
- Every generated descriptor has non-empty `code`, `year_level`, `text`, `strand_code`, `sequence_number`.
- Descriptor code uniqueness across full dataset.
- No unmapped source rows in included scope.
- Coverage report emitted to `reports/ac_v9_completeness_report.json`.

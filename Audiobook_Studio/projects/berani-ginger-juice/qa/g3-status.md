# Gate G3 Status — General-purpose Audiobook Engine

**Overall result:** AUTOMATED PASS — OWNER REVIEW REQUIRED

## Adapter evidence

- Markdown pilot regression: PASS, 942 words and 31 prose paragraphs
- Markdown Setext headings: PASS
- Markdown fenced-code heading exclusion: PASS
- Markdown links, image paths, footnotes, and block-quote policy: PASS
- UTF-8/BOM plain-text extraction: PASS
- TXT line, paragraph, and literal selection: PASS
- DOCX heading and emphasis extraction: PASS
- DOCX unsupported-table fail-safe: PASS
- DOCX page-range fail-safe guidance: PASS
- Inclusive physical PDF page range: PASS
- Scanned/text-empty PDF detection: PASS
- Ambiguous heading and literal selection failures: PASS

## Engine evidence

- Ordered multi-selection extraction: PASS
- Real FFmpeg M4B assembly and probed chapter markers: PASS
- Configuration precedence: PASS
- Resolved configuration manifest recording: PASS
- Explicit manifest migration with versioned backup: PASS
- Partial-file recovery preserves accepted audio: PASS
- Content-addressed unchanged-chunk cache: PASS
- Existing Ginger Juice approved master reproducibility: PASS

## Real Berani generalisation runs

### Ari dialogue — DOCX, pages 69–71

- Source: `Units/English/English_Unit_3/Berani.docx`
- Extracted: 564 words, 22 paragraphs/chunks
- Render: 22 generated, then 22/22 cache hits
- Overall WER: 0.53%
- Pace: 145.27 words per minute
- Technical audio QA: PASS
- Automated disposition: `manual_review`

### Later Ginger Juice — Markdown, pages 83–85

- Source: `Units/English/English_Unit_3/Berani.md`
- Extracted: 570 words, 21 paragraphs/chunks
- Locked Ginger Juice profile reused
- Render: 21 generated, then 21/21 cache hits
- Overall WER: 1.05%
- Pace: 145.78 words per minute
- Technical audio QA: PASS
- Automated disposition: `manual_review`

## Pilot preservation

- Approved master SHA256:
  `612d2dad7ba841b2666ab3e08c3085e43bec0c18869dcd8888289d1dc0c83f4c`
- Expected Gate G2 hash unchanged: PASS

## Remaining

- Project-owner review and approval to progress to Slice 4 skill packaging

# Visual Structure Specification

This document provides the exact visual specification for the "Microsoft Forms Assessment" format. All generated documents MUST adhere to this structure for successful import into Microsoft Forms.

## Document-Level Settings
- **Font**: Calibri or Arial (standard Word fonts).
- **Font Size**: 11 or 12 pt.
- **Line Spacing**: Single (1.0).
- **Paragraph Spacing**: 0 pt before, 0 pt after (compact).

## question block structure

A question block consists of exactly 6 paragraphs. There should be NO empty paragraphs between them.

| Paragraph | Content | Example |
|-----------|---------|---------|
| 1 | Numbered Question | `1. What is the state of water?` |
| 2 | Option A | `A. Solid` |
| 3 | Option B | `B. Liquid` |
| 4 | Option C | `C. Gas` |
| 5 | Option D | `D. Plasma` |
| 6 | Answer Notation | `ans: B` |

## Precise Notation Details

### The Answer Prefix
The prefix `ans:` must be exactly as shown:
- ans 
- Colon **:**
- Space
- Answer Letter (A, B, C, or D)

### Spacing Between Blocks
Include exactly ONE empty paragraph between question blocks to provide visual separation and help the parser distinguish between questions.

```plaintext
1. Question Text?
A. Option
B. Option
C. Option
D. Option
ans : C

2. Next Question?
...
```

## Microsoft Forms Compatibility Note
Microsoft Forms import is sensitive to these specific delimiters. Variations such as `Ans:` or `Answer:` may fail to import correctly or may not automatically identify the correct answer choice.

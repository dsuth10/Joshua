# Unit and lesson structure

Use the established unit structure when it exists:

```text
Unit_Name/
├── Unit_Plan/
│   └── Unit_Brief.md
├── Resources/
│   └── Manifest.md
├── Lesson_Plans/
│   └── Lesson_XX/
│       ├── scripts/
│       ├── assets/
│       ├── Lesson_XX_Plan.md
│       ├── Lesson_XX_Presentation.html
│       └── student and teacher resources
└── Research/
```

Rules:

- Keep lesson-specific materials inside the lesson folder.
- Keep shared resources in `Resources/` and index them in `Manifest.md`.
- Do not create a deprecated separate `Student_Documents/` tree.
- Preserve local naming conventions when they differ from the example.
- Store generator source beside the lesson it owns.
- Use relative asset paths so the lesson folder remains portable.
- Record missing unit briefs or manifests; do not invent their decisions.


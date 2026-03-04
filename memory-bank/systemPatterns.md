# System Patterns: Joshua Architecture

## System Architecture
Joshua follows a modular, skill-based architecture with clear separation of concerns:

### Core Components
1. **Curriculum Engine**: AC v9 data (`ac_v9_complete.json`), `query_curriculum.py`, `ac_v9_build.py`, `ac_v9_validate.py`, completeness reports
2. **Content Generator**: AI-powered lesson plans (english-lesson, english-teaching-sequence), assessment creation (microsoft-forms-assessment), NAPLAN marking (narrative-marking-naplan, persuasive-marking-naplan)
3. **Resource Manager**: Units/{Subject}/{Unit}/ structure; Resources, Assessment Tasks, Teaching Sequence
4. **Export System**: DOCX (docx), PPTX (pptxgenjs, html2pptx), Markdown (docx-to-markdown)
5. **Skills Framework**: 50+ skills in `.agent/skills/`; education-specific: curriculum-master, english-lesson, english-teaching-sequence, docx-to-markdown, microsoft-forms-assessment
6. **Interactive Resources**: Australian History Hub (HTML/CSS/JS) for federation figures with event timelines and detail pages

## Key Technical Decisions
- **JSON-first**: All curriculum data stored in structured JSON
- **Skill Modularity**: Each AI capability isolated in separate skill modules
- **Git-native**: Version control as primary data integrity mechanism
- **Office Integration**: Deep integration with Microsoft Office ecosystem
- **Python Scripts**: Automation backbone for data processing

## Design Patterns in Use

### 1. Skill Pattern
```
skills/
├── SKILL.md (main documentation)
├── scripts/ (automation scripts)
├── assets/ (supporting files)
└── references/ (documentation links)
```

### 2. Unit Structure Pattern
```
Units/{Subject}/{Unit Name}/
├── Teaching Sequence/
│   ├── Lessons/ (Markdown files)
│   └── {word files}
├── Assessment Tasks/
├── Resources/
└── Unit Plan.pdf
```

### 3. Curriculum Data Pattern
```json
{
  "learning_area": "english",
  "subject": "English",
  "strand": "literature",
  "year_level": "6",
  "code": "AC9E5LA01",
  "text": "Content description",
  "sequence_number": 1
}
```

## Component Relationships
- **Curriculum → Units**: AC v9 data drives unit planning
- **Skills → Content**: AI skills generate lesson materials
- **Scripts → Data**: Python scripts process curriculum JSON
- **Templates → Output**: Standardized formats for consistent output

## Data Flow
1. **Input**: AC v9 curriculum data (Excel → JSON)
2. **Processing**: Python scripts validate and structure data
3. **Generation**: AI skills create lesson content
4. **Assembly**: Unit plans compile multiple lessons
5. **Export**: Multiple formats for different use cases

## Integration Points
- **Microsoft Forms**: Assessment generation (ANS: [X] format) and collection
- **OneNote**: Interactive lesson delivery (`OneNote-Interactive-Web/`)
- **PowerPoint**: Presentation automation (pptxgenjs, html2pptx)
- **Word**: Document generation (docx) and editing
- **C2C (Queensland)**: Lesson plan conversion from DOCX to Markdown via docx-to-markdown skill
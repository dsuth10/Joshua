# System Patterns: Joshua Architecture

## System Architecture
Joshua follows a modular, skill-based architecture with clear separation of concerns:

### Core Components
1. **Curriculum Engine**: AC v9 data processing and validation
2. **Content Generator**: AI-powered lesson and assessment creation
3. **Resource Manager**: File organization and asset management
4. **Export System**: Multi-format output generation
5. **Skills Framework**: Specialized AI agents for specific tasks

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
- **Microsoft Forms**: Assessment generation and collection
- **OneNote**: Interactive lesson delivery
- **PowerPoint**: Presentation automation
- **Word**: Document generation and editing
# Technology Context: Joshua Technical Stack

## Technologies Used

### Core Technologies
- **Node.js**: Primary runtime for tooling and automation
- **Python 3.x**: Data processing and curriculum scripts
- **Git**: Version control and collaboration
- **JSON**: Primary data format for curriculum and content

### Dependencies (package.json)
```json
{
  "dependencies": {
    "docx": "^9.6.0",
    "playwright": "^1.58.2",
    "pptxgenjs": "^4.0.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-icons": "^5.5.0",
    "sharp": "^0.34.5"
  }
}
```

### Microsoft Office Integration
- **Word (.docx)**: Lesson plan generation and editing
- **PowerPoint (.pptx)**: Presentation creation
- **Forms**: Assessment generation and data collection
- **OneNote**: Interactive lesson delivery

### File Processing
- **Excel (.xlsx)**: Source curriculum data
- **PDF**: Document sharing and printing
- **Markdown (.md)**: Content authoring and version control

## Development Setup

### Environment
- **Windows 11**: Primary development environment
- **VS Code**: Main IDE with Git integration
- **Git Bash**: Command line interface
- **Node.js npm**: Package management

### Key Scripts
- `scripts/ac_v9_build.py`: Curriculum data processing
- `scripts/ac_v9_validate.py`: Data validation
- `scripts/search_curriculum.py`: Content search functionality
- `.agent/skills/docx-to-markdown/scripts/convert_lesson.py`: DOCX to Markdown conversion (C2C format)
- `.agent/skills/curriculum-master/scripts/query_curriculum.py`: Curriculum query by learning area, year, strand
- `.agent/scripts/generate_planner.js`, `generate_assessment.js`, `generate_pptx.js`: Content generation

### Data Sources
- `ac_v9_complete.json`: Processed AC v9 curriculum data (749KB, 1,395 descriptors)
- `reports/ac_v9_completeness_report.json`: Coverage by learning area and year level
- `reports/ac_v9_mapping_exceptions.json`: Mapping exceptions
- `docs/ac_v9_mapping_spec.md`: Technical mapping rules

## Technical Constraints

### File System
- **Windows paths**: Backslash separators in file paths
- **Line endings**: CRLF for Windows compatibility
- **File size limits**: Large Office documents for rich content

### Performance Considerations
- **Large JSON files**: 749KB for complete AC v9 data
- **Memory usage**: Office document processing requires significant RAM
- **I/O operations**: Frequent file reads/writes for content generation

### Integration Challenges
- **Office automation**: COM interface reliability
- **Cross-platform**: Windows-specific optimizations
- **Version compatibility**: Multiple Office versions in schools

## Security and Privacy
- **Local processing**: All data processed locally
- **No cloud dependencies**: Offline functionality maintained
- **Teacher data**: No student PII stored in system
- **Git security**: Encrypted remote connections

## Deployment Considerations
- **School networks**: Proxy and firewall configurations
- **Office versions**: Compatibility with 2016+, 365
- **Hardware requirements**: Minimum 8GB RAM recommended
- **Network bandwidth**: Large file transfers for resources
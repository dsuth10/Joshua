# Technology Context: Joshua Technical Stack

## Technologies Used

### Core Technologies
- **Node.js**: Primary runtime for tooling and automation
- **Python 3.x**: Data processing and curriculum scripts
- **Git**: Version control and collaboration
- **JSON**: Primary data format for curriculum and content

### Dependencies
```json
{
  "dependencies": {
    "docx": "^9.5.3"
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
- `ac_v9_build.py`: Curriculum data processing
- `ac_v9_validate.py`: Data validation
- `search_curriculum.py`: Content search functionality
- `convert_lesson.py`: DOCX to Markdown conversion

### Data Sources
- `curriculum-workbook.xlsx`: AC v9 curriculum source
- `ac_v9_complete.json`: Processed curriculum data
- Science-specific JSON files for different year levels

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
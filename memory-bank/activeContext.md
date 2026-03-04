# Active Context: Joshua Project Status

## Current Work Focus
The project is in active development with recent completion of the **Australian History Hub v2**—an interactive web resource for federation-era figures. Focus remains on comprehensive unit plans across English, HASS, Science, and Maths.

## Recent Changes (Latest Commits)
1. **Australian History Hub v2** (commit 6537f45): Event data and detail pages for federation figures (Vida Goldstein, Edmund Barton, Alfred Deakin, John Quick, Mary Lee, Henry Parkes)
2. **Henry Parkes biography and educational documents** (5d0cb9f): Science, maths, and English materials added
3. **Australian History Hub initial structure** (e34ff25): Historical figures' pages, images, core site files
4. **Branch status**: 1 commit ahead of origin/main (unpushed)

## Current Development Priorities
1. **Complete AC v9 Coverage**: Finish curriculum mapping for all learning areas (1,395 descriptors mapped)
2. **Unit Plan Expansion**: HASS (25 MD lessons), Science (16 MD), English (48 MD); Maths has structure but no Markdown lessons yet
3. **Assessment Automation**: Enhance Microsoft Forms assessment generation and NAPLAN marking
4. **Resource Management**: Improve organization and accessibility
5. **Teacher Tools**: Develop user-friendly interfaces

## Active Decisions and Considerations

### Technical Decisions
- **Markdown-first**: Markdown as primary content format; docx-to-markdown for C2C conversion
- **Git-based workflows**: Version control for content; branch ahead of origin
- **Skill modularity**: 50+ skills in `.agent/skills/`; education-specific skills well-established
- **Office integration**: docx, pptxgenjs; html2pptx for HTML→PPTX

### Content Strategy
- **HASS focus**: Australian History Hub v2 with federation figures (interactive HTML)
- **Year 6 materials**: English Unit 1, HASS Unit 1, Science Unit 1 Biology Mould
- **Natural Disasters units**: English Unit_2_Natural_Disasters_Information with research on floods, cyclones, arsonist birds
- **Assessment integration**: Microsoft Forms format; NAPLAN narrative/persuasive marking skills

### Quality Assurance
- **Curriculum validation**: `ac_v9_validate.py`, completeness reports
- **Format consistency**: Standardized lesson structures; C2C section recognition in docx-to-markdown
- **Resource verification**: build_resource_map for link mapping

## Next Steps
1. **Push to origin**: Branch is 1 commit ahead
2. **Year 6 Mathematics**: Maths Unit 1 has structure but needs lesson content
3. **Expand to Year 5**: Begin downward curriculum coverage
4. **Enhance assessment tools**: Rubrics, differentiated options
5. **Teacher testing**: Classroom pilot programs for feedback

## Current Challenges
- **Content volume**: Large material sets to generate and organize
- **Format consistency**: Standards across English, HASS, Science, Maths
- **Assessment validation**: Curriculum alignment for assessments
- **Resource management**: Organizing assets across Units

## Success Indicators
- Australian History Hub v2 with 6 federation figures and event timelines
- HASS Unit 1: 25 lesson markdown files, assessment tasks, australian-history-hub
- Science Unit 1 Biology Mould: 16 lesson files, germination experiment, presentations
- Working docx-to-markdown pipeline for C2C lessons
# Product Context: Joshua Educational Platform

## Why This Project Exists
Joshua addresses the critical need for curriculum-aligned educational resources in Australian schools. Teachers spend excessive time creating lesson plans and assessments from scratch, often struggling to align materials with Australian Curriculum v9 standards. This platform automates and streamlines that process.

## Problems It Solves
1. **Time Poverty**: Teachers spend 10-15 hours weekly on lesson planning
2. **Curriculum Alignment**: Difficulty ensuring materials meet AC v9 standards
3. **Resource Scatteredness**: Educational materials spread across multiple systems
4. **Assessment Creation**: Complex process of developing valid assessment items
5. **Differentiation**: Need for tailored content for diverse student needs

## How It Works (Current Implementation)
1. **Curriculum Integration**: AC v9 JSON dataset (749KB) with query scripts for targeted retrieval; `ac_v9_mapping_spec.md` for technical mapping
2. **Automated Generation**: AI-assisted lesson plans (Markdown), handouts (DOCX), presentations (PPTX via html2pptx), and Microsoft Forms assessments
3. **Resource Centralization**: Units organized by subject (English, HASS, Science, Maths); C2C lesson conversion via docx-to-markdown skill
4. **Quality Assurance**: `ac_v9_validate.py`, completeness reports, and curriculum-master query tool
5. **Export Capabilities**: Word, PDF, Markdown, HTML (interactive sites like Australian History Hub)

## User Experience Goals
- **Intuitive Interface**: Teacher-friendly design requiring minimal training
- **Quick Navigation**: Find and use resources in under 60 seconds
- **Customizable Output**: Adapt materials to specific classroom needs
- **Collaborative Features**: Share and improve resources with colleagues
- **Mobile Access**: Use materials on any device, anywhere

## Success Metrics
- Reduce lesson planning time by 70%
- Increase curriculum compliance to 95%
- Improve teacher resource utilization by 50%
- Achieve 90% user satisfaction rate
- Support 10,000+ active teachers

## Educational Impact
- Better learning outcomes through standardized, high-quality materials
- Reduced teacher burnout and workload
- More consistent educational experiences across schools
- Increased time for student interaction and personalized support
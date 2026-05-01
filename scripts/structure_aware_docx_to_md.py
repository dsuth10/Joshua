import sys
import os
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph

def convert_docx_to_md(input_path, output_path):
    doc = Document(input_path)
    md_content = []

    # Get all blocks in order (paragraphs and tables)
    # python-docx doesn't provide a direct "all elements" iterator easily
    # We can use doc._element.body to iterate through children
    
    for element in doc.element.body:
        if element.tag.endswith('p'): # Paragraph
            para = Paragraph(element, doc)
            text = para.text.strip()
            if not text:
                continue
            
            # Map styles to markdown
            style = para.style.name
            if 'Heading 1' in style:
                md_content.append(f"# {text}\n")
            elif 'Heading 2' in style:
                md_content.append(f"## {text}\n")
            elif 'Heading 3' in style:
                md_content.append(f"### {text}\n")
            elif 'List Bullet' in style or para._element.xpath('.//w:numPr'):
                md_content.append(f"- {text}\n")
            else:
                md_content.append(f"{text}\n")
        
        elif element.tag.endswith('tbl'): # Table
            table = Table(element, doc)
            md_content.append(convert_table_to_md(table))

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_content))

def is_table_complex(table):
    """Detects if a table has merged cells or irregular structure."""
    first_row_cells = len(table.rows[0].cells)
    for row in table.rows:
        if len(row.cells) != first_row_cells:
            return True
        for cell in row.cells:
            # Check for merged cells (gridSpan or vMerge)
            tc = cell._tc
            grid_span = tc.xpath('./w:tcPr/w:gridSpan')
            v_merge = tc.xpath('./w:tcPr/w:vMerge')
            if grid_span or v_merge:
                return True
    return False

def convert_table_to_md(table):
    if not is_table_complex(table):
        # Regular table -> Pipe table
        rows = []
        for i, row in enumerate(table.rows):
            cells = [cell.text.replace('\n', '<br>').strip() for cell in row.cells]
            rows.append("| " + " | ".join(cells) + " |")
            if i == 0:
                rows.append("| " + " | ".join(["---"] * len(cells)) + " |")
        return "\n" + "\n".join(rows) + "\n"
    else:
        # Complex table -> Bulleted sections
        lines = ["\n> [TABLE STRUCTURE]"]
        for i, row in enumerate(table.rows):
            lines.append(f"- **Row {i+1}:**")
            for j, cell in enumerate(row.cells):
                cell_text = cell.text.strip()
                if cell_text:
                    lines.append(f"  - Column {j+1}: {cell_text}")
        return "\n" + "\n".join(lines) + "\n"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python structure_aware_docx_to_md.py <input.docx> <output.md>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(os.path.dirname(output_file)):
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
    convert_docx_to_md(input_file, output_file)

import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"w": W_NS, "r": R_NS, "pr": REL_NS}


def qn(namespace, tag):
    return f"{{{namespace}}}{tag}"


def load_xml(zip_file, member):
    try:
        return ET.fromstring(zip_file.read(member))
    except KeyError:
        return None


def load_styles(zip_file):
    styles_root = load_xml(zip_file, "word/styles.xml")
    styles = {}
    if styles_root is None:
        return styles

    for style in styles_root.findall("w:style", NS):
        style_id = style.get(qn(W_NS, "styleId"))
        name = style.find("w:name", NS)
        if style_id and name is not None:
            styles[style_id] = name.get(qn(W_NS, "val"), style_id)
    return styles


def load_relationships(zip_file):
    rels_root = load_xml(zip_file, "word/_rels/document.xml.rels")
    rels = {}
    if rels_root is None:
        return rels

    for rel in rels_root.findall("pr:Relationship", NS):
        rel_id = rel.get("Id")
        target = rel.get("Target")
        if rel_id and target:
            rels[rel_id] = target
    return rels


def normalise_text(text):
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def repair_mojibake(text):
    suspicious = ("\u00c2", "\u00c3", "\u00e2")
    if not any(ch in text for ch in suspicious):
        return text

    try:
        repaired = text.encode("cp1252").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return text

    return repaired


def render_run(run):
    fragments = []
    text_parts = []
    for child in run:
        if child.tag == qn(W_NS, "t"):
            text_parts.append(child.text or "")
        elif child.tag == qn(W_NS, "tab"):
            text_parts.append(" ")
        elif child.tag in {qn(W_NS, "br"), qn(W_NS, "cr")}:
            text_parts.append("<br>")

    text = "".join(text_parts)
    if not text:
        return ""

    run_props = run.find("w:rPr", NS)
    is_bold = run_props is not None and run_props.find("w:b", NS) is not None
    is_italic = run_props is not None and run_props.find("w:i", NS) is not None

    if is_bold and is_italic:
        text = f"***{text}***"
    elif is_bold:
        text = f"**{text}**"
    elif is_italic:
        text = f"*{text}*"

    fragments.append(text)
    return repair_mojibake("".join(fragments))


def render_hyperlink(hyperlink, relationships):
    rel_id = hyperlink.get(qn(R_NS, "id"))
    parts = []
    for child in hyperlink:
        if child.tag == qn(W_NS, "r"):
            parts.append(render_run(child))

    label = "".join(parts).strip()
    if not label:
        return ""

    target = relationships.get(rel_id)
    if target:
        return f"[{label}]({target})"
    return repair_mojibake(label)


def paragraph_text(paragraph, relationships):
    parts = []
    for child in paragraph:
        if child.tag == qn(W_NS, "r"):
            parts.append(render_run(child))
        elif child.tag == qn(W_NS, "hyperlink"):
            parts.append(render_hyperlink(child, relationships))

    joined = "".join(parts).replace("\u00a0", " ")
    return normalise_text(joined)


def paragraph_style_name(paragraph, styles):
    style = paragraph.find("w:pPr/w:pStyle", NS)
    if style is None:
        return ""
    style_id = style.get(qn(W_NS, "val"), "")
    return styles.get(style_id, style_id)


def is_list_paragraph(paragraph):
    return paragraph.find("w:pPr/w:numPr", NS) is not None


def render_paragraph(paragraph, styles, relationships):
    text = paragraph_text(paragraph, relationships)
    if not text:
        return ""

    style_name = paragraph_style_name(paragraph, styles)
    heading_match = re.search(r"Heading\s+([1-6])", style_name)
    if heading_match:
        level = int(heading_match.group(1))
        return f"{'#' * level} {text}"

    if is_list_paragraph(paragraph) or "List Bullet" in style_name:
        return f"- {text}"

    return text


def cell_blocks(cell, styles, relationships):
    blocks = []
    for child in cell:
        if child.tag == qn(W_NS, "p"):
            rendered = render_paragraph(child, styles, relationships)
            if rendered:
                blocks.append(rendered)
        elif child.tag == qn(W_NS, "tbl"):
            blocks.append(render_table(child, styles, relationships))
    return blocks


def cell_text(cell, styles, relationships):
    blocks = cell_blocks(cell, styles, relationships)
    cleaned = []
    for block in blocks:
        if "\n" in block:
            cleaned.append(block.replace("\n", "<br>"))
        else:
            cleaned.append(block)
    return "<br>".join(part for part in cleaned if part).strip()


def is_table_complex(table):
    rows = table.findall("w:tr", NS)
    if not rows:
        return False

    expected_cells = None
    for row in rows:
        cells = row.findall("w:tc", NS)
        if expected_cells is None:
            expected_cells = len(cells)
        elif len(cells) != expected_cells:
            return True

        for cell in cells:
            tc_pr = cell.find("w:tcPr", NS)
            if tc_pr is None:
                continue
            if tc_pr.find("w:gridSpan", NS) is not None or tc_pr.find("w:vMerge", NS) is not None:
                return True
    return False


def render_regular_table(table, styles, relationships):
    lines = []
    rows = table.findall("w:tr", NS)
    for index, row in enumerate(rows):
        cells = row.findall("w:tc", NS)
        values = [cell_text(cell, styles, relationships) for cell in cells]
        lines.append("| " + " | ".join(values) + " |")
        if index == 0:
            lines.append("| " + " | ".join(["---"] * len(values)) + " |")
    return "\n".join(lines)


def render_complex_table(table, styles, relationships):
    lines = ["> [TABLE STRUCTURE]"]
    rows = table.findall("w:tr", NS)
    for row_index, row in enumerate(rows, start=1):
        lines.append(f"- **Row {row_index}:**")
        for col_index, cell in enumerate(row.findall("w:tc", NS), start=1):
            text = cell_text(cell, styles, relationships)
            if text:
                lines.append(f"  - Column {col_index}: {text}")
    return "\n".join(lines)


def render_table(table, styles, relationships):
    if is_table_complex(table):
        return render_complex_table(table, styles, relationships)
    return render_regular_table(table, styles, relationships)


def convert_docx_to_md(input_path, output_path):
    with zipfile.ZipFile(input_path) as zip_file:
        document_root = load_xml(zip_file, "word/document.xml")
        if document_root is None:
            raise FileNotFoundError("word/document.xml not found in document")

        styles = load_styles(zip_file)
        relationships = load_relationships(zip_file)
        body = document_root.find("w:body", NS)

        md_content = []
        for child in body:
            if child.tag == qn(W_NS, "p"):
                rendered = render_paragraph(child, styles, relationships)
                if rendered:
                    md_content.append(rendered)
            elif child.tag == qn(W_NS, "tbl"):
                md_content.append(render_table(child, styles, relationships))

    final_output = "\n\n".join(part for part in md_content if part)
    final_output = re.sub(r"\n{3,}", "\n\n", final_output).strip() + "\n"

    output_dir = os.path.dirname(output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as handle:
        handle.write(final_output)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python structure_aware_convert.py <input.docx> <output.md>")
        sys.exit(1)

    convert_docx_to_md(sys.argv[1], sys.argv[2])

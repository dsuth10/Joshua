import os
import re

def escape_html(text):
    if not text:
        return ""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )

def escape_and_style_placeholder(text):
    escaped = escape_html(text)
    return re.sub(r"\[([^\]]+)\]", r'<span style="color:#0070c0">[\1]</span>', escaped)

def render_html_table(headers, rows):
    table_html = '  <table style="border:1px solid #1b365d;border-collapse:collapse;width:100%;margin:16px 0">\n'
    table_html += "    <tr>\n"
    width_per_cell = int(100 / len(headers))
    for header in headers:
        table_html += f'      <td style="background-color:#d3ec9e;width:{width_per_cell}%;border:1px solid #1b365d;padding:10px;font-family:\'Comic Sans MS\', sans-serif;font-size:20pt"><span style="font-weight:bold">{escape_html(header)}</span></td>\n'
    table_html += "    </tr>\n"
    for row in rows:
        table_html += "    <tr>\n"
        for cell in row:
            table_html += f'      <td style="width:{width_per_cell}%;border:1px solid #1b365d;padding:10px;font-family:\'Comic Sans MS\', sans-serif;font-size:20pt">{escape_and_style_placeholder(cell)}</td>\n'
        table_html += "    </tr>\n"
    table_html += "  </table>\n  <br />\n"
    return table_html

def parse_markdown_to_onenote_html(md, title):
    lines = md.split("\n")
    html = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>' + escape_html(title) + '</title>\n</head>\n<body style="font-family:\'Comic Sans MS\', sans-serif;font-size:20pt;line-height:1.5;margin:30px;color:#222222">\n'
    html += f'  <h1 style="font-family:\'Comic Sans MS\', sans-serif;font-size:26pt;margin-top:0pt;margin-bottom:16pt;color:#1b365d;border-bottom:2px solid #0070c0;padding-bottom:8px">{escape_html(title)}</h1>\n'

    in_list = False
    in_table = False
    table_headers = []
    table_rows = []

    for line in lines:
        line_str = line.strip()

        if in_table and not line_str.startswith("|"):
            html += render_html_table(table_headers, table_rows)
            in_table = False
            table_headers = []
            table_rows = []

        if in_list and not (line_str.startswith("- ") or line_str.startswith("* ")):
            html += "  </ul>\n  <br />\n"
            in_list = False

        if not line_str or line_str.startswith("# "):
            continue

        if line_str.startswith("## "):
            heading_text = line_str[3:].strip()
            html += f'  <h2 style="font-family:\'Comic Sans MS\', sans-serif;font-size:22pt;margin-top:20pt;margin-bottom:10pt;color:#0070c0">{escape_html(heading_text)}</h2>\n'
            continue

        if line_str.startswith("- ") or line_str.startswith("* "):
            if not in_list:
                html += '  <ul style="font-family:\'Comic Sans MS\', sans-serif;font-size:20pt">\n'
                in_list = True
            item_text = line_str[2:].strip()
            html += f"    <li>{escape_and_style_placeholder(item_text)}</li>\n"
            continue

        if line_str.startswith("|"):
            in_table = True
            cells = [c.strip() for c in line_str.split("|")[1:-1]]
            if all(re.match(r"^:?-+:?$", c) for c in cells):
                continue
            if not table_headers:
                table_headers = cells
            else:
                table_rows.append(cells)
            continue

        if line_str.startswith("[") and line_str.endswith("]"):
            placeholder_text = line_str[1:-1].strip()
            html += '  <table style="border:1px solid #0070c0;border-collapse:collapse;width:100%;margin:8px 0 16px 0">\n'
            html += "    <tr>\n"
            html += f'      <td style="width:100%;border:1px solid #0070c0;padding:14px;font-family:\'Comic Sans MS\', sans-serif;font-size:20pt;background-color:#f4f8fb"><span style="color:#0070c0">[ {escape_html(placeholder_text)} ]</span></td>\n'
            html += "    </tr>\n"
            html += "  </table>\n"
            continue

        if "**" in line_str and ":**" in line_str:
            parts = line_str.split(":**", 1)
            label = parts[0].replace("**", "").strip()
            rest = parts[1].strip()
            html += f'  <p style="font-family:\'Comic Sans MS\', sans-serif;font-size:20pt;margin-top:6pt;margin-bottom:6pt"><span style="font-weight:bold">{escape_html(label)}:</span> {escape_and_style_placeholder(rest)}</p>\n'
            continue

        html += f'  <p style="font-family:\'Comic Sans MS\', sans-serif;font-size:20pt;margin-top:6pt;margin-bottom:6pt">{escape_and_style_placeholder(line_str)}</p>\n'

    if in_table:
        html += render_html_table(table_headers, table_rows)
    if in_list:
        html += "  </ul>\n  <br />\n"

    html += "</body>\n</html>"
    return html

dir_path = r"c:\Users\dsuth\Documents\Joshua\Fractional_Cups_Weight_Worksheet_Set"
files = [
    ("Worksheet_A.md", "Worksheet_A.html", "Worksheet A • Questions 1–5"),
    ("Worksheet_B.md", "Worksheet_B.html", "Worksheet B • Questions 6–10"),
    ("Teacher_Answer_Key.md", "Teacher_Answer_Key.html", "Teacher Answer Key"),
]

for md_file, html_file, title in files:
    with open(os.path.join(dir_path, md_file), "r", encoding="utf-8") as f:
        content = f.read()
    rendered = parse_markdown_to_onenote_html(content, title)
    with open(os.path.join(dir_path, html_file), "w", encoding="utf-8") as f:
        f.write(rendered)
    print(f"Generated {html_file}")

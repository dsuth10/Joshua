import os
import sys
import subprocess
import json
import xml.etree.ElementTree as ET
import yaml
import re

# Add current dir to path to import local helpers if needed
sys.path.append(os.path.dirname(__file__))

def clean_lesson_content(content):
    """
    Cleans up messy extracted text and rescues image metadata.
    """
    # 1. Remove frontmatter temporarily
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(0)
        body = content[len(frontmatter):]
    else:
        frontmatter = ""
        body = content

    # 2. Noise Removal
    # Remove vertical bars and table border character lines
    body = re.sub(r'^[| \t+=-]+$', '', body, flags=re.MULTILINE)
    body = body.replace('|', ' ')
    body = body.replace('<!-- -->', '')

    # 3. Consolidate and de-indent
    lines = body.split('\n')
    cleaned_lines = []
    in_header = True
    
    for line in lines:
        stripped = line.strip()
        if re.match(r'^\|[ ]+\|$', line):
            continue
            
        if stripped.startswith('-'):
            line = "  " + stripped
        elif stripped:
            if in_header:
                if any(x in stripped for x in ['Life on Earth', 'Lessons', 'Unit']):
                    line = "# " + stripped
                else:
                    line = "## " + stripped
                if 'Example learning sequence' in stripped:
                    in_header = False
            else:
                line = stripped
                
        if not stripped:
            if cleaned_lines and cleaned_lines[-1] != "":
                cleaned_lines.append("")
        else:
            cleaned_lines.append(line.rstrip())
    
    body = '\n'.join(cleaned_lines)

    # 4. Image Metadata Rescue & Junk Removal
    body = re.sub(r'\{width=".*?"\s*height=".*?"\}', '', body, flags=re.DOTALL)
    body = re.sub(r'\{width=".*?"\}', '', body, flags=re.DOTALL)
    body = re.sub(r'\{height=".*?"\}', '', body, flags=re.DOTALL)

    def rescue_alt(match):
        alt = match.group(1).replace('\n', ' ')
        path = match.group(2)
        inner_match = re.search(r'Prep\s{2,}(.*?)\s+(:Concept|key:)', alt)
        if inner_match:
            refined_text = inner_match.group(1).strip()
            return f"![Concept Icon]({path}) **{refined_text}**"
        if "C2C:DevArea" in alt or "My Templates" in alt:
             return f"![Icon]({path})"
        return match.group(0).replace('\n', ' ')

    body = re.sub(r'!\[(.*?)\]\((.*?)\)', rescue_alt, body, flags=re.DOTALL)
    body = re.sub(r'## !\[\]\((.*?)\)\n## ', r'![]( \1 )', body)

    # 5. Logical Section Breaks
    body = re.sub(r'\n(Resources|Australian Curriculum references|Safety|Lesson objectives|Evidence of learning|Ideas for monitoring|Learning alerts|Suggested next steps for learning|Ideas for differentiation)', r'\n---\n\n## \1', body)

    # 6. Australian Spelling
    body = body.replace('color', 'colour')
    body = body.replace('organize', 'organise')
    body = body.replace('program ', 'programme ')
    
    return frontmatter + body

def get_links_from_rels(unpacked_dir):
    rels_path = os.path.join(unpacked_dir, 'word', '_rels', 'document.xml.rels')
    if not os.path.exists(rels_path):
        return []
    try:
        tree = ET.parse(rels_path)
        root = tree.getroot()
        ns = {'rel': 'http://schemas.openxmlformats.org/package/2006/relationships'}
        links = []
        for rel in root.findall('rel:Relationship', ns):
            if 'relationships/hyperlink' in rel.get('Type'):
                links.append({
                    'id': rel.get('Id'),
                    'target': rel.get('Target')
                })
        return links
    except:
        return []

def convert_lesson(docx_path, output_md_path, unpack_script_path):
    # 1. Unpack docx
    temp_unpack_dir = docx_path + "_temp_unpack"
    subprocess.run(['python', unpack_script_path, docx_path, temp_unpack_dir], check=True)
    
    # 2. Extract links
    links = get_links_from_rels(temp_unpack_dir)
    
    # 3. Filter for internal resource links
    # Assuming internal resources contain "Resources" or are relative
    internal_resources = []
    external_links = []
    for link in links:
        target = link['target']
        if 'http' in target:
            external_links.append(target)
        else:
            # It's a relative path
            internal_resources.append(target)
    
    # 4. Convert to MD via pandoc
    subprocess.run(['pandoc', docx_path, '-o', output_md_path], check=True)
    
    # 5. Inject frontmatter
    with open(output_md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    frontmatter = {
        'source': os.path.basename(docx_path),
        'resources': internal_resources,
        'external_links': external_links
    }
    
    new_content = "---\n" + yaml.dump(frontmatter) + "---\n\n" + content
    
    # 6. Clean and reformat content
    new_content = clean_lesson_content(new_content)
    
    with open(output_md_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    # 6. Cleanup
    import shutil
    shutil.rmtree(temp_unpack_dir)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python convert_lesson.py <docx_path> <output_md_path> <unpack_script_path>")
        sys.exit(1)
    
    docx_path = sys.argv[1]
    output_md_path = sys.argv[2]
    unpack_script_path = sys.argv[3]
    
    convert_lesson(docx_path, output_md_path, unpack_script_path)
    print(f"Successfully converted {docx_path} to {output_md_path}")

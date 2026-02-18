import os
import sys
import subprocess
import json
import xml.etree.ElementTree as ET
import yaml

# Add current dir to path to import local helpers if needed
sys.path.append(os.path.dirname(__file__))

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

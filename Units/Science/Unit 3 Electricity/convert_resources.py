import os
import re
import sys

# Import structure-aware convert logic
sys.path.append(os.path.abspath(r"c:\Users\dsuth\Documents\Joshua\.agent\skills\docx-to-markdown\scripts"))
from structure_aware_convert import convert_docx_to_md  # type: ignore

UNIT_ROOT = r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 3 Electricity"
RESOURCES_DIR = os.path.join(UNIT_ROOT, "Resources")
MARKDOWN_DIR = os.path.join(UNIT_ROOT, "Markdown")

def convert_all_docx_resources():
    converted_mapping = {} # maps original docx relative path to new md relative path
    
    # Traverse Resources/ for docx files
    for root, _, files in os.walk(RESOURCES_DIR):
        for fname in files:
            if fname.endswith('.docx'):
                input_path = os.path.join(root, fname)
                output_path = os.path.join(root, fname.replace('.docx', '.md'))
                
                print(f"Converting Resource: {fname}...")
                convert_docx_to_md(input_path, output_path)
                
                # Standardise spelling (Australian English) in resource content
                with open(output_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                content = content.replace('color', 'colour')
                content = content.replace('organize', 'organise')
                content = content.replace('program ', 'programme ')
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                # Record mapping (relative to Unit Root)
                rel_docx = os.path.relpath(input_path, UNIT_ROOT).replace('\\', '/')
                rel_md = os.path.relpath(output_path, UNIT_ROOT).replace('\\', '/')
                converted_mapping[rel_docx] = rel_md
                
    return converted_mapping

def update_lesson_links(mapping):
    print("\nUpdating lesson links to point to converted markdown resources...")
    for root, _, files in os.walk(MARKDOWN_DIR):
        for fname in files:
            if fname.endswith('.md'):
                md_path = os.path.join(root, fname)
                with open(md_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                modified = False
                # Rewrite links matching the mapping
                for docx_path, md_path_rel in mapping.items():
                    # Extract basename to look for references
                    docx_name = os.path.basename(docx_path)
                    md_name = os.path.basename(md_path_rel)
                    
                    # Look for markdown links like: [label](path/filename.docx)
                    pattern = re.compile(re.escape(docx_name))
                    if pattern.search(content):
                        content = pattern.sub(md_name, content)
                        modified = True
                
                if modified:
                    print(f"  Updated links in {fname}")
                    with open(md_path, 'w', encoding='utf-8') as f:
                        f.write(content)

def main():
    # 1. Convert all resource docx files to md
    mapping = convert_all_docx_resources()
    
    # 2. Update lesson links in Markdown/
    update_lesson_links(mapping)
    
    # 3. Rebuild resource map
    print("\nRebuilding unit resource map...")
    import subprocess
    subprocess.run([
        sys.executable, 
        r"c:\Users\dsuth\Documents\Joshua\.agent\skills\docx-to-markdown\scripts\build_resource_map.py",
        UNIT_ROOT
    ], check=True)

if __name__ == '__main__':
    main()

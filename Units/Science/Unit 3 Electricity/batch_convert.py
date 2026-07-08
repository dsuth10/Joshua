import os
import re
import sys
import yaml

# Add skill scripts folder to path
sys.path.append(os.path.abspath(r"c:\Users\dsuth\Documents\Joshua\.agent\skills\docx-to-markdown\scripts"))
from structure_aware_convert import convert_docx_to_md  # type: ignore
from convert_lesson import build_resource_index, resolve_url_to_local  # type: ignore

UNIT_ROOT = r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 3 Electricity"
INPUT_DIR = os.path.join(UNIT_ROOT, "Unit_02_C2C")
OUTPUT_DIR = os.path.join(UNIT_ROOT, "Markdown")
RESOURCES_DIR = os.path.join(UNIT_ROOT, "Resources")
REL_PATH = "../Resources"

def process_file(filename):
    input_path = os.path.join(INPUT_DIR, filename)
    output_path = os.path.join(OUTPUT_DIR, filename.replace('.docx', '.md'))
    
    print(f"Converting {filename}...")
    
    # 1. Direct structure-aware conversion to target markdown
    convert_docx_to_md(input_path, output_path)
    
    # 2. Read the converted markdown content for post-processing
    with open(output_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 3. Scan for links and resolve them against Resources directory
    resource_index = build_resource_index(RESOURCES_DIR)
    
    resolved_resources = []
    external_links = []
    
    # Pattern to match markdown links [label](target)
    link_pattern = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')
    
    def replace_link(match):
        label = match.group(1)
        target = match.group(2).strip()
        
        if target.startswith('#'):
            return f"[{label}]({target})"
            
        if target.startswith(('http://', 'https://')):
            local = resolve_url_to_local(target, resource_index, REL_PATH)
            if local:
                resolved_resources.append(local)
                return f"[{label}]({local})"
            else:
                external_links.append(target)
                return f"[{label}]({target})"
        else:
            # Local/relative path
            # Normalise backslashes to forward slashes
            normalized_target = target.replace('\\', '/')
            
            # Ensure it starts with the correct relative path prefix
            if normalized_target.startswith('Resources/'):
                normalized_target = f"../{normalized_target}"
            elif normalized_target.startswith('./Resources/'):
                normalized_target = f"../{normalized_target[2:]}"
            elif normalized_target.startswith('../Resources/'):
                pass
            elif 'Resources/' in normalized_target:
                # Handle cases like "..\Resources\..." -> "../Resources/..."
                idx = normalized_target.find('Resources/')
                normalized_target = f"../{normalized_target[idx:]}"
            
            resolved_resources.append(normalized_target)
            return f"[{label}]({normalized_target})"
            
    content = link_pattern.sub(replace_link, content)
    
    # 4. Standardise spelling (Australian English)
    content = content.replace('color', 'colour')
    content = content.replace('organize', 'organise')
    content = content.replace('program ', 'programme ')
    
    # 5. Prepend YAML frontmatter
    fm = {
        'source': filename,
        'resources': sorted(list(set(resolved_resources))),
        'external_links': sorted(list(set(external_links)))
    }
    
    final_content = '---\n' + yaml.dump(fm, default_flow_style=False) + '---\n\n' + content
    
    # 6. Save final file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print(f"  OK: {filename} -> {os.path.basename(output_path)}")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    files = sorted([f for f in os.listdir(INPUT_DIR) if f.endswith('.docx')])
    for f in files:
        process_file(f)
        
    # Run the resource map builder
    print("\nBuilding resource map...")
    import subprocess
    subprocess.run([
        sys.executable, 
        r"c:\Users\dsuth\Documents\Joshua\.agent\skills\docx-to-markdown\scripts\build_resource_map.py",
        UNIT_ROOT
    ], check=True)

if __name__ == '__main__':
    main()

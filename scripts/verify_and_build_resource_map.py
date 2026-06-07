# -*- coding: utf-8 -*-
"""
verify_and_build_resource_map.py

Verifies all resource links in markdown files within a unit directory,
promotes .docx references to .md when a markdown version exists (applying
the Lesson Resources Markdown protocol), and updates resource_map.json.
"""

import os
import sys
import json
import yaml
import re

def verify_and_heal_unit(unit_dir):
    unit_dir = os.path.abspath(unit_dir)
    unit_name = os.path.basename(unit_dir)
    
    # Locate all markdown files recursively
    md_files = []
    for root, _, files in os.walk(unit_dir):
        for filename in files:
            if filename.endswith('.md') and filename != 'resource_map.json' and 'node_modules' not in root:
                md_files.append(os.path.join(root, filename))
                
    unit_map = {
        "unit": unit_name,
        "lessons": []
    }
    
    for md_path in sorted(md_files):
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Parse YAML frontmatter
        if not content.startswith('---'):
            # If no frontmatter, create a basic one for resource mapping index
            rel_path = os.path.relpath(md_path, unit_dir).replace('\\', '/')
            lesson_entry = {
                "filename": rel_path,
                "source_docx": rel_path.replace('.md', '.docx'),
                "resources": []
            }
            unit_map["lessons"].append(lesson_entry)
            continue
            
        parts = content.split('---', 2)
        if len(parts) < 3:
            continue
            
        try:
            frontmatter_text = parts[1]
            body_text = parts[2]
            data = yaml.safe_load(frontmatter_text)
            if not isinstance(data, dict):
                continue
        except Exception as e:
            print(f"Error parsing YAML in {os.path.basename(md_path)}: {e}")
            continue
            
        rel_md_path = os.path.relpath(md_path, unit_dir).replace('\\', '/')
        lesson_entry = {
            "filename": rel_md_path,
            "source_docx": data.get('source', rel_md_path.replace('.md', '.docx')),
            "resources": []
        }
        
        resources = data.get('resources', [])
        external_links = data.get('external_links', [])
        
        healed_resources = []
        frontmatter_changed = False
        
        # 1. Process internal resources
        for res in resources:
            # Resolve path relative to unit_dir since references in this unit are relative to unit root
            res_full_path = os.path.normpath(os.path.join(unit_dir, res))
            
            # Auto-healing: If it is a docx but md version exists, promote to md
            if res.endswith('.docx'):
                md_res = res[:-5] + '.md'
                md_res_full_path = os.path.normpath(os.path.join(unit_dir, md_res))
                if os.path.exists(md_res_full_path):
                    print(f"  Promoting resource link in {rel_md_path}: {res} -> {md_res}")
                    
                    # Update body text markdown links
                    escaped_res = re.escape(res)
                    body_text = re.sub(rf'\({escaped_res}\)', f'({md_res})', body_text)
                    
                    res = md_res
                    res_full_path = md_res_full_path
                    frontmatter_changed = True
                    
            exists = os.path.exists(res_full_path)
            healed_resources.append(res)
            
            lesson_entry["resources"].append({
                "target": res.replace('\\', '/'),
                "exists": exists,
                "type": "internal"
            })
            
        # 2. Process external links
        for ext in external_links:
            lesson_entry["resources"].append({
                "target": ext,
                "type": "external"
            })
            
        # 3. If frontmatter or body changed, write back to file
        if frontmatter_changed:
            data['resources'] = healed_resources
            new_frontmatter = yaml.dump(data, default_flow_style=False)
            new_content = f"---\n{new_frontmatter}---\n{body_text}"
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  Healed and saved file: {rel_md_path}")
            
        unit_map["lessons"].append(lesson_entry)
        
    # Write the updated resource map
    map_output_path = os.path.join(unit_dir, 'resource_map.json')
    with open(map_output_path, 'w', encoding='utf-8') as f:
        json.dump(unit_map, f, indent=2)
        
    print(f"\nResource map successfully updated at: {map_output_path}")
    return map_output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_and_build_resource_map.py <unit_dir>")
        sys.exit(1)
        
    verify_and_heal_unit(sys.argv[1])

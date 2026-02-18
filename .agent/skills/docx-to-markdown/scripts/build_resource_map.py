import os
import sys
import json
import yaml

def build_map(unit_dir):
    lessons_dir = os.path.join(unit_dir, 'Lessons')
    resources_dir = os.path.join(unit_dir, 'Resources')
    
    if not os.path.exists(lessons_dir):
        print(f"Error: {lessons_dir} not found")
        return
    
    unit_map = {
        "unit": os.path.basename(unit_dir),
        "lessons": []
    }
    
    for filename in os.listdir(lessons_dir):
        if filename.endswith('.md'):
            md_path = os.path.join(lessons_dir, filename)
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract frontmatter (naive split, but works for our script)
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    try:
                        data = yaml.safe_load(parts[1])
                        lesson_entry = {
                            "filename": filename,
                            "source_docx": data.get('source'),
                            "resources": []
                        }
                        
                        # Verify resources
                        for res in data.get('resources', []):
                            # The link is usually relative like ../Resources/Documents/file.pdf
                            # We want to check if it exists relative to the Lesson file
                            res_rel_path = res
                            res_full_path = os.path.normpath(os.path.join(lessons_dir, res_rel_path))
                            exists = os.path.exists(res_full_path)
                            
                            lesson_entry["resources"].append({
                                "target": res,
                                "exists": exists,
                                "type": "internal"
                            })
                        
                        for ext in data.get('external_links', []):
                            lesson_entry["resources"].append({
                                "target": ext,
                                "type": "external"
                            })
                            
                        unit_map["lessons"].append(lesson_entry)
                    except Exception as e:
                        print(f"Error parsing YAML in {filename}: {e}")
    
    output_path = os.path.join(unit_dir, 'resource_map.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(unit_map, f, indent=2)
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python build_resource_map.py <unit_dir>")
        sys.exit(1)
    
    unit_dir = sys.argv[1]
    output = build_map(unit_dir)
    if output:
        print(f"Resource map created at {output}")

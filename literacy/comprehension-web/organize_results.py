import os
import re
import shutil
from pathlib import Path

def parse_filename(filename):
    match = re.match(r"^([a-zA-Z]+)-level-(\d+)", filename)
    if match:
        skill, level = match.groups()
        return f"{skill.capitalize()} level {level}"
    return None

def main():
    base_dir = Path(__file__).parent
    results_dir = base_dir / "Results"
    
    moved_count = 0
    
    for item in results_dir.iterdir():
        if item.is_file() and item.suffix == ".json":
            folder_name = parse_filename(item.name)
            if folder_name:
                dest_dir = results_dir / folder_name
                dest_dir.mkdir(parents=True, exist_ok=True)
                dest_path = dest_dir / item.name
                shutil.move(str(item), str(dest_path))
                print(f"Moved {item.name} -> {folder_name}/")
                moved_count += 1
                
    print(f"\nReorganization complete. Moved {moved_count} files.")

if __name__ == "__main__":
    main()

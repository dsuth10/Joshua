import os
import shutil

# Configuration
BASE_DIR = r"c:\Users\dsuth\Documents\Joshua\Units"
TARGET_FOLDER_NAME = "Resources"
BLACKLIST = {
    "Resources", "Assessment Tasks", "Teaching Sequence", "Lessons", "Assessment", 
    "_scripts", "Images", "Research", "Assets", "Archive", "unpacked", 
    "Student_Documents", "Unit_Plan", "scratch", "node_modules", ".git", ".agent",
    "Lesson", "Lessons", "Week", "Handouts", "Worksheets", "Monitoring", "Drafts", "Lesson_Plans"
}

def is_unit_folder(root, dirs, files, rel_depth, rel_path):
    folder_name = os.path.basename(root)
    
    # 1. Skip if blacklisted or looks like a component
    if any(part.lower() in [b.lower() for b in BLACKLIST] for part in rel_path.split(os.sep)):
        return False
    
    # Check if folder name itself is a lesson or week
    if folder_name.lower().startswith(("lesson", "week")):
        return False

    # 2. Skip Level 0 (Units/) and Level 1 (Subjects like English/)
    if rel_depth <= 1:
        return False
        
    # 3. Level 2 (Units/Subject/MyUnit) is always a unit
    if rel_depth == 2:
        return True
        
    # 4. Deeper folders: Check if they contain content
    has_content = any(f.endswith(('.md', '.docx')) for f in files)
    if has_content:
        return True
        
    return False

def run(dry_run=True):
    print(f"{'DRY RUN' if dry_run else 'EXECUTING'} STARTED")
    
    for root, dirs, files in os.walk(BASE_DIR):
        # Calculate depth relative to BASE_DIR
        rel_path = os.path.relpath(root, BASE_DIR)
        if rel_path == ".":
            rel_depth = 0
        else:
            rel_depth = len(rel_path.split(os.sep))
            
        # 1. Identify unit folders and create Resources
        if is_unit_folder(root, dirs, files, rel_depth, rel_path):
            # Check if Resources already exists (case-insensitive)
            has_resources = any(d.lower() == TARGET_FOLDER_NAME.lower() for d in dirs)
            if not has_resources:
                target_path = os.path.join(root, TARGET_FOLDER_NAME)
                print(f"Plan: Create {target_path}")
                if not dry_run:
                    os.makedirs(target_path, exist_ok=True)
            else:
                pass # Skip if exists
                
        # 2. Identify unzipped zip files
        for f in files:
            if f.lower().endswith(".zip"):
                folder_potential = f[:-4]
                if folder_potential in dirs:
                    zip_path = os.path.join(root, f)
                    print(f"Plan: Delete unzipped {zip_path}")
                    if not dry_run:
                        os.remove(zip_path)

if __name__ == "__main__":
    import sys
    is_dry = "--execute" not in sys.argv
    run(dry_run=is_dry)

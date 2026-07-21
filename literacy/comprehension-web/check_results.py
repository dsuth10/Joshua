import os
import json
import re
from pathlib import Path

# The list of files the user passed
FILES_TO_CHECK = [
    "inferencing-level-1-handout-1_epryo13_2026-07-16 (3).json",
    "inferencing-level-1-handout-01_fwend2_2026-07-16.json",
    "inferencing-level-1-handout-01_hherz0_2026-07-21 (1).json",
    "inferencing-level-1-handout-1_jfull212_2026-07-16.json",
    "inferencing-level-1-handout-1_lmcdo381_2026-07-16.json",
    "inferencing-level-1-handout-1_smorg220_2026-07-16.json",
    "inferencing-level-1-handout-2_epryo13_2026-07-16.json",
    "inferencing-level-1-handout-02_fwend2_2026-07-16.json",
    "inferencing-level-1-handout-02_hherz0_2026-07-21.json",
    "inferencing-level-1-handout-2_jbart350_2026-07-16.json",
    "inferencing-level-1-handout-2_jfull212_2026-07-16.json",
    "inferencing-level-1-handout-2_lmcdo381_2026-07-16.json",
    "inferencing-level-1-handout-2_lmcdo381_2026-07-17.json",
    "inferencing-level-1-handout-2_smorg220_2026-07-17 (1).json",
    "inferencing-level-1-handout-2_smorg220_2026-07-17.json",
    "inferencing-level-1-handout-3_epryo13_2026-07-17.json",
    "inferencing-level-1-handout-03_fwend2_2026-07-17.json",
    "inferencing-level-1-handout-3_jfull212_2026-07-17.json",
    "inferencing-level-1-handout-3_lheck4_2026-07-20.json",
    "inferencing-level-1-handout-3_lmcdo381_2026-07-26.json",
    "inferencing-level-1-handout-03_lmcdo381_2026-07-26.json",
    "inferencing-level-1-handout-3_smorg220_2026-07-17.json",
    "inferencing-level-1-handout-4_epryo13_2026-07-17.json",
    "inferencing-level-1-handout-04_fwend2_2026-07-20.json",
    "inferencing-level-1-handout-04_jbinn27_2026-07-17.json",
    "inferencing-level-1-handout-4_jfull212_2026-07-17.json",
    "inferencing-level-1-handout-4_smorg220_2026-07-17.json",
    "inferencing-level-1-handout-5_epryo13_2026-07-17.json",
    "inferencing-level-1-handout-05_fwend2_2026-07-20.json",
    "inferencing-level-1-handout-5_jfull212_2026-07-17.json",
    "inferencing-level-1-handout-5_smorg220_2026-07-17.json",
    "inferencing-level-1-handout-6_epryo13_2026-07-17.json",
    "inferencing-level-1-handout-06_fwend2_2026-07-20.json",
    "inferencing-level-1-handout-06_jfull212_2026-07-17.json",
    "inferencing-level-1-handout-6_smorg220_2026-07-20.json",
    "inferencing-level-1-handout-7_epryo13_2026-07-17.json",
    "inferencing-level-1-handout-07_jfull212_2026-07-21.json",
    "inferencing-level-1-handout-07_smorg220_2026-07-20.json",
    "inferencing-level-1-handout-08_epryo13_2026-07-21.json",
    "inferencing-level-2-handout-01_cpono2_2026-07-20.json",
    "inferencing-level-2-handout-01_shart259_2026-07-21.json",
    "inferencing-level-2-handout-02_cpono2_2026-07-21.json",
    "inferencing-level-2-handout-03_cpono2_2026-07-21.json",
    "inferencing-level-2-handout-04_cpono2_2026-07-21.json",
    "inferencing-level-2-handout-05_cpono2_2026-07-21.json"
]

def parse_filename(filename):
    match = re.match(r"^(.+?)_([a-zA-Z0-9]+)_(\d{4}-\d{2}-\d{2})(?:\s*\((\d+)\))?\.json$", filename)
    if not match:
        return None
    activity_id, student, date_str, dup_num = match.groups()
    dup_num = int(dup_num) if dup_num else 0
    norm_activity_id = re.sub(r"-0(\d)", r"-\1", activity_id)
    return {
        "original_name": filename,
        "activity_id": activity_id,
        "norm_activity_id": norm_activity_id,
        "student": student,
        "date": date_str,
        "dup_num": dup_num
    }

def get_skill_folder_name(activity_id):
    # e.g., inferencing-level-1-handout-1 -> "Inferencing level 1"
    # e.g., inferencing-level-2-handout-1 -> "Inferencing level 2"
    match = re.match(r"^([a-zA-Z]+)-level-(\d+)", activity_id)
    if match:
        skill, level = match.groups()
        return f"{skill.capitalize()} level {level}"
    return "Unknown"

def main():
    base_dir = Path(__file__).parent
    scored_dir = base_dir / "scored-results"

    to_grade = []
    already_scored_exact = []
    
    for f in FILES_TO_CHECK:
        parsed = parse_filename(f)
        if not parsed:
            print(f"Failed to parse: {f}")
            continue
        
        folder = get_skill_folder_name(parsed["norm_activity_id"])
        
        # Check if the exact file has a scored equivalent in scored-results/<folder>/
        scored_path = scored_dir / folder / f"{f}.scored.json"
        
        if scored_path.exists():
            already_scored_exact.append(f)
        else:
            to_grade.append((f, parsed))
            
    print(f"\nTotal files: {len(FILES_TO_CHECK)}")
    print(f"Already scored EXACTLY: {len(already_scored_exact)}")
    for f in already_scored_exact:
        print(f"  - {f}")
    print(f"NOT scored yet: {len(to_grade)}")
    for f, p in to_grade:
        print(f"  - {f} -> {p['norm_activity_id']}")

if __name__ == "__main__":
    main()

import os
import json
import re
from pathlib import Path

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
    match = re.match(r"^([a-zA-Z]+)-level-(\d+)", activity_id)
    if match:
        skill, level = match.groups()
        return f"{skill.capitalize()} level {level}"
    return "Unknown"

def main():
    base_dir = Path(__file__).parent
    results_dir = base_dir / "Results"
    scored_dir = base_dir / "scored-results"

    # Scan all files in Results/ and its subfolders
    all_results_files = []
    for p in results_dir.glob("**/*.json"):
        parsed = parse_filename(p.name)
        if parsed:
            parsed["full_path"] = str(p.relative_to(base_dir))
            all_results_files.append(parsed)

    # Let's map these by (student, norm_activity_id)
    all_grouped = {}
    for f in all_results_files:
        key = (f["student"], f["norm_activity_id"])
        all_grouped.setdefault(key, []).append(f)

    # Let's process the files the user specifically asked us to check
    user_parsed = []
    for f in FILES_TO_CHECK:
        p = parse_filename(f)
        if p:
            user_parsed.append(p)

    user_keys = set((p["student"], p["norm_activity_id"]) for p in user_parsed)

    to_grade = []
    already_scored = []
    skipped_old_duplicates = []

    for key in sorted(user_keys):
        student, norm_activity_id = key
        files = all_grouped.get(key, [])
        if not files:
            continue
        
        # Sort files by date, then duplicate number. The last one is the latest.
        files_sorted = sorted(files, key=lambda x: (x["date"], x["dup_num"]))
        latest = files_sorted[-1]
        
        folder = get_skill_folder_name(norm_activity_id)
        # We need the base filename from the full path to check the scored path
        base_name = Path(latest['full_path']).name
        scored_path = scored_dir / folder / f"{base_name}.scored.json"
        
        latest_info = {
            "student": latest["student"],
            "norm_activity_id": latest["norm_activity_id"],
            "date": latest["date"],
            "dup_num": latest["dup_num"],
            "full_path": latest["full_path"],
            "folder": folder
        }
        
        if scored_path.exists():
            already_scored.append(latest_info)
        else:
            to_grade.append(latest_info)
            
        for old in files_sorted[:-1]:
            skipped_old_duplicates.append({
                "student": old["student"],
                "norm_activity_id": old["norm_activity_id"],
                "date": old["date"],
                "dup_num": old["dup_num"],
                "full_path": old["full_path"]
            })

    output_data = {
        "to_grade": to_grade,
        "already_scored": already_scored,
        "skipped_old_duplicates": skipped_old_duplicates
    }

    with open(base_dir / "resolution_report.json", "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)

    print(f"Written resolution_report.json. To grade: {len(to_grade)}, Already scored: {len(already_scored)}, Skipped: {len(skipped_old_duplicates)}")

if __name__ == "__main__":
    main()

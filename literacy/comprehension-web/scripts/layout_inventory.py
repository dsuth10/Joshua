import os
import json
import re
import argparse
import sys

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARKING_GUIDES_DIR = os.path.join(BASE_DIR, "marking-guides")
EVAL_L2_DIR = os.path.join(BASE_DIR, "evaluation", "level-2")

def count_words(text):
    if not text:
        return 0
    return len(text.strip().split())

def check_encoding_issues(text):
    if not text:
        return False
    # Check for raw non-breaking spaces or other odd sequences
    if '\xa0' in text:
        return True
    return False

def audit_marking_guides():
    results = []
    errors = []
    warnings = []
    
    activity_ids = set()
    
    if not os.path.exists(MARKING_GUIDES_DIR):
        print(f"Error: marking-guides directory not found at {MARKING_GUIDES_DIR}")
        sys.exit(1)
        
    files = sorted(os.listdir(MARKING_GUIDES_DIR))
    
    for filename in files:
        if not filename.endswith(".json"):
            continue
            
        filepath = os.path.join(MARKING_GUIDES_DIR, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            errors.append(f"Failed to parse JSON file {filename}: {e}")
            continue
            
        activity_id = data.get("activityId")
        skill = data.get("skill")
        level = data.get("level")
        handout = data.get("handout")
        
        if not activity_id:
            errors.append(f"Missing activityId in {filename}")
            continue
            
        if activity_id in activity_ids:
            errors.append(f"Duplicate activityId '{activity_id}' in {filename}")
        else:
            activity_ids.add(activity_id)
            
        # Group questions into sections contiguously
        sections = []
        current_section = None
        
        question_ids = set()
        
        for q in data.get("questions", []):
            q_id = q.get("questionId")
            sec_id = q.get("sectionId")
            passage = q.get("passage", "")
            prompt = q.get("prompt", "")
            
            if not q_id:
                errors.append(f"Missing questionId for question in {activity_id}")
                continue
                
            if q_id in question_ids:
                errors.append(f"Duplicate questionId '{q_id}' in {activity_id}")
            else:
                question_ids.add(q_id)
                
            if not sec_id:
                errors.append(f"Missing sectionId for question {q_id} in {activity_id}")
                continue
                
            if current_section is None or current_section["section_id"] != sec_id:
                # Start new section
                current_section = {
                    "section_id": sec_id,
                    "questions": []
                }
                sections.append(current_section)
                
            current_section["questions"].append(q)
            
        # Validate sections
        section_ids = [s["section_id"] for s in sections]
        unique_section_ids = set()
        for s_id in section_ids:
            if s_id in unique_section_ids:
                warnings.append(f"Duplicate sectionId '{s_id}' in {activity_id} (non-contiguous or duplicate ID)")
            unique_section_ids.add(s_id)
            
        handout_sections_meta = []
        
        for s_idx, s in enumerate(sections):
            sec_id = s["section_id"]
            sec_qs = s["questions"]
            
            legacy_scope = "item" if sec_id.startswith("quick-") else "section"
            
            intended_layout = "shared-passage"
            if legacy_scope == "item":
                if skill == "inferencing":
                    intended_layout = "sentence-task-list"
                elif skill == "reorganization":
                    intended_layout = "paired-passage-list"
                elif skill == "evaluation":
                    intended_layout = "focus-passage-list"
                    
            passages = [q.get("passage", "") for q in sec_qs]
            prompts = [q.get("prompt", "") for q in sec_qs]
            
            # Word counts
            word_counts = [count_words(p) for p in passages]
            
            # Audit warnings
            for q_idx, q in enumerate(sec_qs):
                q_id = q.get("questionId")
                p = passages[q_idx]
                pr = prompts[q_idx]
                wc = word_counts[q_idx]
                
                if not p.strip():
                    warnings.append(f"Empty passage for question {q_id} in {activity_id}")
                if not pr.strip():
                    warnings.append(f"Empty prompt for question {q_id} in {activity_id}")
                    
                if check_encoding_issues(p):
                    warnings.append(f"Encoding issue (e.g. non-breaking space) in passage for question {q_id} in {activity_id}")
                if check_encoding_issues(pr):
                    warnings.append(f"Encoding issue in prompt for question {q_id} in {activity_id}")
                    
                if p.strip() == pr.strip() and p.strip():
                    warnings.append(f"Passage and prompt are identical for question {q_id} in {activity_id}")
                    
                if legacy_scope == "item":
                    if intended_layout == "sentence-task-list" and wc > 45:
                        warnings.append(f"Sentence layout passage for question {q_id} in {activity_id} is over 45 words ({wc} words)")
                    elif intended_layout == "paired-passage-list" and wc > 140:
                        warnings.append(f"Paired layout passage for question {q_id} in {activity_id} is over 140 words ({wc} words)")
                    elif intended_layout == "focus-passage-list" and wc < 30:
                        warnings.append(f"Focus layout passage for question {q_id} in {activity_id} is under 30 words ({wc} words)")
                        
            if legacy_scope == "section":
                shared_wc = count_words(passages[0]) if passages else 0
                if len(sec_qs) > 26:
                    warnings.append(f"Shared section '{sec_id}' in {activity_id} has more than 26 questions ({len(sec_qs)})")
                    
            handout_sections_meta.append({
                "sectionId": sec_id,
                "legacyScope": legacy_scope,
                "intendedLayout": intended_layout,
                "questionCount": len(sec_qs),
                "questionIds": [q.get("questionId") for q in sec_qs],
                "wordCounts": word_counts
            })
            
        results.append({
            "activityId": activity_id,
            "filename": filename,
            "skill": skill,
            "level": level,
            "handout": handout,
            "sections": handout_sections_meta
        })
        
    # Check for bridge counterparts in evaluation level 2
    for r in results:
        if r["skill"] == "evaluation" and r["level"] == 2:
            h = r["handout"]
            if isinstance(h, int):
                # Standard handout. Check if bridge counterpart should exist for 6 and 7
                if h in [6, 7]:
                    has_bridge = any(
                        br["skill"] == "evaluation" and br["level"] == 2 and br["handout"] == f"{h}-bridge"
                        for br in results
                    )
                    if not has_bridge:
                        warnings.append(f"Missing bridge counterpart for Evaluation Level 2 Handout {h}")
            elif isinstance(h, str) and h.endswith("-bridge"):
                try:
                    std_num = int(h.split("-")[0])
                    has_std = any(
                        br["skill"] == "evaluation" and br["level"] == 2 and br["handout"] == std_num
                        for br in results
                    )
                    if not has_std:
                        warnings.append(f"Missing standard counterpart for Evaluation Level 2 Handout {h}")
                except ValueError:
                    pass
                    
    return results, errors, warnings

def main():
    parser = argparse.ArgumentParser(description="Audit layout configurations and produce manifest.")
    parser.add_argument("--json", help="Path to write JSON manifest output.")
    args = parser.parse_args()
    
    print("Running layout inventory audit...")
    results, errors, warnings = audit_marking_guides()
    
    print(f"\nAudited {len(results)} activities.")
    print(f"Found {len(errors)} errors and {len(warnings)} warnings.")
    
    if warnings:
        print("\n--- WARNINGS ---")
        for w in warnings:
            print(f"WARNING: {w}")
            
    if errors:
        print("\n--- ERRORS ---")
        for e in errors:
            print(f"ERROR: {e}")
            
    if args.json:
        out_dir = os.path.dirname(args.json)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump({
                "activities": results,
                "errors": errors,
                "warnings": warnings
            }, f, indent=2)
        print(f"\nManifest written to {args.json}")
        
    if errors:
        print("\nAudit FAILED due to validation errors.")
        sys.exit(1)
    else:
        print("\nAudit PASSED successfully.")
        sys.exit(0)

if __name__ == "__main__":
    main()

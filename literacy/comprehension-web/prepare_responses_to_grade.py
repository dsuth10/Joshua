import os
import json
from pathlib import Path

def main():
    base_dir = Path(__file__).parent
    
    with open(base_dir / "resolution_report.json", "r", encoding="utf-8") as f:
        resolution = json.load(f)
        
    to_grade = resolution["to_grade"]
    extracted = []
    
    for item in to_grade:
        file_path = base_dir / item["full_path"]
        if not file_path.exists():
            print(f"File not found: {file_path}")
            continue
            
        with open(file_path, "r", encoding="utf-8") as f_student:
            student_data = json.load(f_student)
            
        activity_id = student_data["activity"]["activityId"]
        norm_activity_id = item["norm_activity_id"]
        
        # Load marking guide
        guide_path = base_dir / "marking-guides" / f"{norm_activity_id}.json"
        if not guide_path.exists():
            print(f"Warning: Marking guide not found: {guide_path}")
            # Try mapping handout name if needed, but norm_activity_id should be exact
            continue
            
        with open(guide_path, "r", encoding="utf-8") as f_guide:
            guide_data = json.load(f_guide)
            
        # Map questions from guide
        questions_by_id = {q["questionId"]: q for q in guide_data["questions"]}
        
        responses_list = []
        for section in student_data["sections"]:
            for resp in section["responses"]:
                qid = resp["questionId"]
                guide_q = questions_by_id.get(qid, {})
                
                responses_list.append({
                    "questionId": qid,
                    "prompt": guide_q.get("prompt", ""),
                    "passage": guide_q.get("passage", ""),
                    "markingGuide": guide_q.get("markingGuide", ""),
                    "maxMarks": guide_q.get("maxMarks", 1),
                    "answered": resp.get("answered", False),
                    "studentResponse": resp.get("response", "")
                })
                
        extracted.append({
            "student": item["student"],
            "norm_activity_id": norm_activity_id,
            "original_file": item["full_path"],
            "folder": item["folder"],
            "responses": responses_list
        })
        
    with open(base_dir / "responses_to_grade.json", "w", encoding="utf-8") as f_out:
        json.dump(extracted, f_out, indent=2)
        
    print(f"Extracted responses for {len(extracted)} files to responses_to_grade.json")

if __name__ == "__main__":
    main()

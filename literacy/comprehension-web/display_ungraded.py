import json
from pathlib import Path

def main():
    base_dir = Path(__file__).parent
    with open(base_dir / "responses_to_grade.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    scratch_dir = Path("C:/Users/dsuth/.gemini/antigravity-ide/scratch")
    scratch_dir.mkdir(parents=True, exist_ok=True)
    out_file = scratch_dir / "student_responses_utf8.txt"
    
    with open(out_file, "w", encoding="utf-8") as f_out:
        f_out.write(f"Total student files to grade: {len(data)}\n")
        
        for i, item in enumerate(data):
            f_out.write(f"\n==================================================\n")
            f_out.write(f"FILE {i+1}/{len(data)}: {item['original_file']}\n")
            f_out.write(f"Student: {item['student']} | Activity: {item['norm_activity_id']}\n")
            f_out.write(f"==================================================\n")
            
            for q in item["responses"]:
                f_out.write(f"Question: {q['questionId']} | Max Marks: {q['maxMarks']}\n")
                f_out.write(f"Prompt: {q['prompt']}\n")
                f_out.write(f"Passage: {q['passage'].replace('\n', ' ')}\n")
                f_out.write(f"Marking Guide: {q['markingGuide']}\n")
                f_out.write(f"Student Response: {q['studentResponse']}\n")
                f_out.write(f"Answered: {q['answered']}\n")
                f_out.write("-" * 30 + "\n")

    print(f"Written student responses to {out_file}")

if __name__ == "__main__":
    main()

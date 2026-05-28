import json
import os

log_path = r"C:\Users\dsuth\.gemini\antigravity-ide\brain\9e52593c-4a95-4c0f-96c3-b91f6542b588\.system_generated\logs\transcript.jsonl"

if not os.path.exists(log_path):
    print("Log file not found at:", log_path)
else:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get('source') == 'USER_EXPLICIT':
                    print("="*40)
                    print(f"STEP: {data.get('step_index')}")
                    print("="*40)
                    print(data.get('content'))
                    print("\n")
            except Exception as e:
                print("Error parsing line:", e)

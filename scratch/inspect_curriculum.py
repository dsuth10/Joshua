import json

def main():
    file_path = "ac_v9_complete.json"
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    curriculum = data.get('curriculum', {})
    if not curriculum:
        curriculum = data.get('example', {}).get('curriculum', {})
        
    print("Curriculum Keys:", curriculum.keys())
    
    learning_areas = curriculum.get('learning_areas', [])
    print("\nLearning Areas:")
    for la in learning_areas:
        print(f"- {la.get('name')} (ID: {la.get('id')})")
        if la.get('id') == 'mathematics':
            print("  Strands:")
            for strand in la.get('strands', []):
                print(f"    - Strand: {strand.get('name')} (ID: {strand.get('id')})")
                sub_strands = strand.get('sub_strands', [])
                if sub_strands:
                    print("      Sub-strands:")
                    for ss in sub_strands:
                        print(f"        - {ss.get('name')} (ID: {ss.get('id')})")

if __name__ == '__main__':
    main()

import json
import re

def search():
    with open('ac_v9_complete.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    curriculum = data['example']['curriculum']
    results = []
    
    keywords = ['space', 'earth', 'solar', 'planet', 'star', 'sun', 'moon', 'orbit']
    
    for area in curriculum['learning_areas']:
        if area['id'] != 'science':
            continue
            
        for strand in area['strands']:
            # Check strand descriptors
            for d in strand.get('content_descriptors', []):
                if d['year_level'] in ['5', '5-6']:
                    if any(kw in d['text'].lower() for kw in keywords):
                        results.append(d)
            
            # Check sub-strand descriptors
            for sub in strand.get('sub_strands', []):
                for d in sub.get('content_descriptors', []):
                    if d['year_level'] in ['5', '5-6']:
                        if any(kw in d['text'].lower() for kw in keywords):
                            results.append(d)
                            
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    search()

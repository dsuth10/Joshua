import json

with open('ac_v9_complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

descriptors = []
learning_areas = data.get('example', {}).get('curriculum', {}).get('learning_areas', [])
for la in learning_areas:
    if la.get('id') == 'the_arts':
        for strand in la.get('strands', []):
            if strand.get('id') == 'music':
                for cd in strand.get('content_descriptors', []):
                    if cd.get('year_level') in ['5', '5-6']:
                        descriptors.append({
                            'code': cd.get('code'),
                            'year_level': cd.get('year_level'),
                            'text': cd.get('text')
                        })

# Write out to a temporary file to avoid terminal truncation/formatting issues
with open('music_results.json', 'w', encoding='utf-8') as f:
    json.dump(descriptors, f, indent=2)

print(f"Extracted {len(descriptors)} descriptors to music_results.json")

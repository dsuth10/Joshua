import json

def main():
    file_path = "ac_v9_complete.json"
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    curriculum = data.get('curriculum', {})
    if not curriculum:
        curriculum = data.get('example', {}).get('curriculum', {})
        
    learning_areas = curriculum.get('learning_areas', [])
    math_la = None
    for la in learning_areas:
        if la.get('id') == 'mathematics':
            math_la = la
            break
            
    if not math_la:
        print("Mathematics learning area not found.")
        return
        
    target_years = ['3', '4', '5', '6']
    output = {}
    
    for strand in math_la.get('strands', []):
        strand_name = strand.get('name')
        output[strand_name] = []
        
        # Descriptors in strand
        for cd in strand.get('content_descriptors', []):
            yl = str(cd.get('year_level'))
            if yl in target_years:
                output[strand_name].append({
                    'code': cd.get('code'),
                    'year_level': yl,
                    'text': cd.get('text'),
                    'sub_strand': None
                })
                
        # Descriptors in sub-strands
        for ss in strand.get('sub_strands', []):
            ss_name = ss.get('name')
            for cd in ss.get('content_descriptors', []):
                yl = str(cd.get('year_level'))
                if yl in target_years:
                    output[strand_name].append({
                        'code': cd.get('code'),
                        'year_level': yl,
                        'text': cd.get('text'),
                        'sub_strand': ss_name
                    })
                    
    # Write out results grouped by Strand to file in UTF-8
    with open("scratch/maths_descriptors_y3_y6.txt", "w", encoding="utf-8") as out_f:
        for strand_name, cds in output.items():
            out_f.write(f"\n=========================================\nSTRAND: {strand_name}\n=========================================\n")
            # Sort by year level, then code
            cds_sorted = sorted(cds, key=lambda x: (x['year_level'], x['code']))
            for cd in cds_sorted:
                sub = f" ({cd['sub_strand']})" if cd['sub_strand'] else ""
                out_f.write(f"[{cd['code']}] (Year {cd['year_level']}){sub}: {cd['text']}\n")

if __name__ == '__main__':
    main()

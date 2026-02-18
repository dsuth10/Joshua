#!/usr/bin/env python3
import json
from collections import Counter
from pathlib import Path

JSON_PATH = Path('ac_v9_complete.json')


def iter_descriptors(curriculum):
    for area in curriculum['learning_areas']:
        for strand in area['strands']:
            for d in strand.get('content_descriptors', []):
                yield area['id'], strand['id'], None, d
            for sub in strand.get('sub_strands', []):
                for d in sub.get('content_descriptors', []):
                    yield area['id'], strand['id'], sub['id'], d


def main():
    with open(JSON_PATH, 'r', encoding='utf-8-sig') as f:
        root = json.load(f)

    curriculum = root['example']['curriculum']
    issues = []
    codes = []
    total = 0

    for area_id, strand_id, sub_id, d in iter_descriptors(curriculum):
        total += 1
        code = d.get('code')
        year_level = d.get('year_level')
        text = d.get('text')
        strand_code = d.get('strand_code')
        seq = d.get('sequence_number')

        if not code:
            issues.append({'type': 'missing_code', 'area': area_id, 'strand': strand_id, 'sub': sub_id})
        else:
            codes.append(code)

        if not year_level:
            issues.append({'type': 'missing_year_level', 'code': code})
        if not text:
            issues.append({'type': 'missing_text', 'code': code})
        if not strand_code:
            issues.append({'type': 'missing_strand_code', 'code': code})
        if not isinstance(seq, int) or seq < 1:
            issues.append({'type': 'invalid_sequence', 'code': code, 'value': seq})

    dupes = [c for c, n in Counter(codes).items() if n > 1]
    for code in dupes:
        issues.append({'type': 'duplicate_code', 'code': code})

    print('Total descriptors:', total)
    print('Unique codes:', len(set(codes)))
    print('Duplicates:', len(dupes))
    print('Issues:', len(issues))

    if issues:
        print('First issues:')
        for issue in issues[:20]:
            print('-', issue)
        raise SystemExit(1)


if __name__ == '__main__':
    main()

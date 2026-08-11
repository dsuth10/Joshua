import argparse
import json
import sys
from pathlib import Path


WORKSPACE_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_DATA_FILE = WORKSPACE_ROOT / 'ac_v9_complete.json'


def matches_year_level(target, actual):
    if not target:
        return True
    if target == actual:
        return True
    return '-' in actual and target in actual.split('-')


def descriptor_record(descriptor, strand, learning_area, sub_strand=None):
    return {
        'code': descriptor.get('code'),
        'year_level': descriptor.get('year_level'),
        'text': descriptor.get('text'),
        'strand': strand.get('name'),
        'sub_strand': sub_strand.get('name') if sub_strand else None,
        'learning_area': learning_area.get('id'),
    }


def iter_descriptors(learning_area, strand):
    for descriptor in strand.get('content_descriptors', []):
        yield descriptor, None
    for sub_strand in strand.get('sub_strands', []):
        for descriptor in sub_strand.get('content_descriptors', []):
            yield descriptor, sub_strand


def query(curriculum, args):
    results_by_code = {}

    for learning_area in curriculum.get('learning_areas', []):
        if args.learning_area and learning_area.get('id') != args.learning_area:
            continue

        for strand in learning_area.get('strands', []):
            if args.strand and strand.get('id') != args.strand:
                continue

            for descriptor, sub_strand in iter_descriptors(learning_area, strand):
                if args.code and descriptor.get('code') != args.code:
                    continue
                if not matches_year_level(args.year_level, descriptor.get('year_level', '')):
                    continue

                record = descriptor_record(descriptor, strand, learning_area, sub_strand)
                if record['code']:
                    results_by_code[record['code']] = record

    return [results_by_code[code] for code in sorted(results_by_code)]


def render(results, output_format):
    if output_format == 'json':
        print(json.dumps(results, indent=2))
        return

    if not results:
        print('No matching descriptors found.')
        return

    for result in results:
        print(f"[{result['code']}] (Year {result['year_level']}) {result['text']}")


def main():
    parser = argparse.ArgumentParser(description='Query the Australian Curriculum v9 content-descriptor dataset.')
    parser.add_argument('--learning_area', help='ID of the learning area (e.g., the_arts, english)')
    parser.add_argument('--year_level', help='Year level filter (e.g., 5, 5-6, Foundation)')
    parser.add_argument('--strand', help='Strand ID (e.g., music, language)')
    parser.add_argument('--code', help='Specific content descriptor code to look up')
    parser.add_argument('--file', default=str(DEFAULT_DATA_FILE), help='Path to the curriculum JSON file')
    parser.add_argument('--format', choices=['json', 'text'], default='json', help='Output format')
    args = parser.parse_args()

    data_file = Path(args.file)
    if not data_file.is_file():
        print(f"Error: File '{data_file}' not found.", file=sys.stderr)
        return 1

    try:
        data = json.loads(data_file.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        print(f'Error reading JSON: {error}', file=sys.stderr)
        return 1

    curriculum = data.get('example', {}).get('curriculum') or data.get('curriculum')
    if not curriculum:
        print('Error: Curriculum payload is missing.', file=sys.stderr)
        return 1

    render(query(curriculum, args), args.format)
    return 0


if __name__ == '__main__':
    sys.exit(main())

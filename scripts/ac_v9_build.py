#!/usr/bin/env python3
import json
import re
from copy import deepcopy
from datetime import date
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import pandas as pd

ROOT = Path('.')
JSON_PATH = ROOT / 'ac_v9_complete.json'
WORKBOOK_PATH = ROOT / 'curriculum-workbook.xlsx'
REPORTS_DIR = ROOT / 'reports'

YEAR6_LEVELS = {'6', '5-6'}


def normalize_whitespace(text: str) -> str:
    return re.sub(r'\s+', ' ', str(text)).strip()


def normalize_level(level: str) -> str:
    level = str(level).strip()
    if level == 'Foundation Year':
        return 'Foundation'
    m = re.fullmatch(r'Year\s+(\d+)', level)
    if m:
        return m.group(1)
    m = re.fullmatch(r'Years\s+(\d+)\s+and\s+(\d+)', level)
    if m:
        return f"{m.group(1)}-{m.group(2)}"
    return level


def area_templates() -> List[dict]:
    return [
        {
            'id': 'english',
            'name': 'English',
            'description': 'English encompasses language, literature and literacy, supporting listening, reading, viewing, speaking, writing and creating.',
            'strands': [
                {'id': 'language', 'name': 'Language', 'description': 'Knowledge about language and how it works.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'literature', 'name': 'Literature', 'description': 'Engagement with and interpretation of literary texts.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'literacy', 'name': 'Literacy', 'description': 'Use and creation of texts across modes and contexts.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
        {
            'id': 'mathematics',
            'name': 'Mathematics',
            'description': 'Mathematics develops reasoning, fluency, understanding and problem-solving.',
            'strands': [
                {'id': 'number', 'name': 'Number', 'description': 'Number and algebraic number concepts.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'algebra', 'name': 'Algebra', 'description': 'Patterns, relationships and algebraic reasoning.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'measurement', 'name': 'Measurement', 'description': 'Measurement concepts and applications.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'space', 'name': 'Space', 'description': 'Geometric reasoning and spatial concepts.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'statistics', 'name': 'Statistics', 'description': 'Data collection, representation and interpretation.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'probability', 'name': 'Probability', 'description': 'Chance and probabilistic reasoning.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
        {
            'id': 'science',
            'name': 'Science',
            'description': 'Science develops understanding of the natural world and evidence-based inquiry.',
            'strands': [
                {'id': 'science_understanding', 'name': 'Science Understanding', 'description': 'Conceptual understanding of scientific ideas.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'science_inquiry', 'name': 'Science Inquiry', 'description': 'Skills for questioning, investigating and communicating.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'science_human_endeavour', 'name': 'Science as a Human Endeavour', 'description': 'How science influences society and vice versa.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
        {
            'id': 'hass',
            'name': 'Humanities and Social Sciences (HASS)',
            'description': 'HASS builds understanding of society, place, systems and civic life.',
            'strands': [
                {
                    'id': 'hass_f6',
                    'name': 'HASS F-6',
                    'description': 'Integrated HASS for Foundation to Year 6.',
                    'has_sub_strands': True,
                    'sub_strands': [
                        {'id': 'knowledge', 'name': 'Knowledge and understanding', 'description': 'Knowledge concepts and understandings.', 'content_descriptors': []},
                        {'id': 'skills', 'name': 'Skills', 'description': 'Inquiry and communication skills.', 'content_descriptors': []},
                    ],
                },
                {
                    'id': 'history',
                    'name': 'History 7-10',
                    'description': 'Historical knowledge and historical skills.',
                    'has_sub_strands': True,
                    'sub_strands': [
                        {'id': 'knowledge', 'name': 'Knowledge and understanding', 'description': 'Historical knowledge and understanding.', 'content_descriptors': []},
                        {'id': 'skills', 'name': 'Skills', 'description': 'Historical skills and inquiry.', 'content_descriptors': []},
                    ],
                },
                {
                    'id': 'geography',
                    'name': 'Geography 7-10',
                    'description': 'Geographical knowledge and geographical skills.',
                    'has_sub_strands': True,
                    'sub_strands': [
                        {'id': 'knowledge', 'name': 'Knowledge and understanding', 'description': 'Geographical knowledge and understanding.', 'content_descriptors': []},
                        {'id': 'skills', 'name': 'Skills', 'description': 'Geographical skills and inquiry.', 'content_descriptors': []},
                    ],
                },
                {
                    'id': 'civics_citizenship',
                    'name': 'Civics and Citizenship 7-10',
                    'description': 'Civics knowledge and civic participation skills.',
                    'has_sub_strands': True,
                    'sub_strands': [
                        {'id': 'knowledge', 'name': 'Knowledge and understanding', 'description': 'Civics and citizenship knowledge.', 'content_descriptors': []},
                        {'id': 'skills', 'name': 'Skills', 'description': 'Civics and citizenship skills.', 'content_descriptors': []},
                    ],
                },
                {
                    'id': 'economics_business',
                    'name': 'Economics and Business 7-10',
                    'description': 'Economics and business knowledge and skills.',
                    'has_sub_strands': True,
                    'sub_strands': [
                        {'id': 'knowledge', 'name': 'Knowledge and understanding', 'description': 'Economics and business knowledge.', 'content_descriptors': []},
                        {'id': 'skills', 'name': 'Skills', 'description': 'Economics and business skills.', 'content_descriptors': []},
                    ],
                },
            ],
        },
        {
            'id': 'digital_technologies',
            'name': 'Digital Technologies',
            'description': 'Digital Technologies develops computational thinking and digital solution design.',
            'strands': [
                {'id': 'knowledge_understanding', 'name': 'Knowledge and understanding', 'description': 'Digital systems and data representation.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'processes_production', 'name': 'Processes and production skills', 'description': 'Creating and evaluating digital solutions.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
        {
            'id': 'design_technologies',
            'name': 'Design and Technologies',
            'description': 'Design and Technologies develops design thinking and production capability.',
            'strands': [
                {'id': 'knowledge_understanding_dt', 'name': 'Knowledge and understanding', 'description': 'Technologies contexts and systems understanding.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'processes_production_dt', 'name': 'Processes and production skills', 'description': 'Investigating, generating, producing and evaluating.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
        {
            'id': 'health_physical_education',
            'name': 'Health and Physical Education',
            'description': 'Health and Physical Education develops movement competence and health literacy.',
            'strands': [
                {'id': 'personal_social_community_health', 'name': 'Personal, social and community health', 'description': 'Identity, relationships, safety and wellbeing.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'movement_physical_activity', 'name': 'Movement and physical activity', 'description': 'Movement skills, participation and physical activity.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
        {
            'id': 'the_arts',
            'name': 'The Arts',
            'description': 'The Arts includes Dance, Drama, Media Arts, Music and Visual Arts.',
            'strands': [
                {'id': 'dance', 'name': 'Dance', 'description': 'Dance content descriptions.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'drama', 'name': 'Drama', 'description': 'Drama content descriptions.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'media_arts', 'name': 'Media Arts', 'description': 'Media Arts content descriptions.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'music', 'name': 'Music', 'description': 'Music content descriptions.', 'has_sub_strands': False, 'content_descriptors': []},
                {'id': 'visual_arts', 'name': 'Visual Arts', 'description': 'Visual Arts content descriptions.', 'has_sub_strands': False, 'content_descriptors': []},
            ],
        },
    ]


def build_indexes(learning_areas: List[dict]):
    area_index: Dict[str, dict] = {}
    strand_index: Dict[Tuple[str, str], dict] = {}
    sub_index: Dict[Tuple[str, str, str], dict] = {}

    for area in learning_areas:
        area_index[area['id']] = area
        for strand in area['strands']:
            strand_index[(area['id'], strand['id'])] = strand
            for sub in strand.get('sub_strands', []):
                sub_index[(area['id'], strand['id'], sub['id'])] = sub

    return area_index, strand_index, sub_index


def map_row(subject: str, code: str) -> Optional[Tuple[str, str, Optional[str]]]:
    code = str(code)

    if subject == 'English':
        if 'LA' in code:
            return 'english', 'language', None
        if 'LE' in code:
            return 'english', 'literature', None
        if 'LY' in code:
            return 'english', 'literacy', None

    if subject == 'Mathematics':
        m = re.match(r'^AC9M(?:F|[1-9]|10)(SP|ST|N|A|M|P)', code)
        if m:
            token = m.group(1)
            return 'mathematics', {
                'N': 'number',
                'A': 'algebra',
                'M': 'measurement',
                'SP': 'space',
                'ST': 'statistics',
                'P': 'probability',
            }[token], None

    if subject == 'Science':
        m = re.match(r'^AC9S(?:F|[1-9]|10)(U|I|H)', code)
        if m:
            token = m.group(1)
            return 'science', {
                'U': 'science_understanding',
                'I': 'science_inquiry',
                'H': 'science_human_endeavour',
            }[token], None

    if subject == 'HASS F-6':
        m = re.match(r'^AC9HS(?:F|[1-6])(K|S)', code)
        if m:
            sub = 'knowledge' if m.group(1) == 'K' else 'skills'
            return 'hass', 'hass_f6', sub

    if subject == 'History 7-10':
        m = re.match(r'^AC9HH(?:7|8|9|10)(K|S)', code)
        if m:
            sub = 'knowledge' if m.group(1) == 'K' else 'skills'
            return 'hass', 'history', sub

    if subject == 'Geography 7-10':
        m = re.match(r'^AC9HG(?:7|8|9|10)(K|S)', code)
        if m:
            sub = 'knowledge' if m.group(1) == 'K' else 'skills'
            return 'hass', 'geography', sub

    if subject == 'Civics and Citizenship 7-10':
        m = re.match(r'^AC9HC(?:7|8|9|10)(K|S)', code)
        if m:
            sub = 'knowledge' if m.group(1) == 'K' else 'skills'
            return 'hass', 'civics_citizenship', sub

    if subject == 'Economics and Business 7-10':
        m = re.match(r'^AC9HE(?:7|8|9|10)(K|S)', code)
        if m:
            sub = 'knowledge' if m.group(1) == 'K' else 'skills'
            return 'hass', 'economics_business', sub

    if subject == 'Digital Technologies':
        m = re.match(r'^AC9TDI(?:F|2|4|6|8|10)(K|P)', code)
        if m:
            return 'digital_technologies', 'knowledge_understanding' if m.group(1) == 'K' else 'processes_production', None

    if subject == 'Design and Technologies':
        m = re.match(r'^AC9TDE(?:F|2|4|6|8|10)(K|P)', code)
        if m:
            return 'design_technologies', 'knowledge_understanding_dt' if m.group(1) == 'K' else 'processes_production_dt', None

    if subject == 'Health and Physical Education':
        m = re.match(r'^AC9HP(?:F|2|4|6|8|10)(M|P)', code)
        if m:
            return 'health_physical_education', 'movement_physical_activity' if m.group(1) == 'M' else 'personal_social_community_health', None

    if subject == 'Dance':
        return 'the_arts', 'dance', None
    if subject == 'Drama':
        return 'the_arts', 'drama', None
    if subject == 'Media Arts':
        return 'the_arts', 'media_arts', None
    if subject == 'Music':
        return 'the_arts', 'music', None
    if subject == 'Visual Arts':
        return 'the_arts', 'visual_arts', None

    return None


def assign_sequences(learning_areas: List[dict]) -> None:
    for area in learning_areas:
        for strand in area['strands']:
            cds = strand.get('content_descriptors', [])
            cds.sort(key=lambda d: d['code'])
            for i, d in enumerate(cds, 1):
                d['sequence_number'] = i
            for sub in strand.get('sub_strands', []):
                sub_cds = sub.get('content_descriptors', [])
                sub_cds.sort(key=lambda d: d['code'])
                for i, d in enumerate(sub_cds, 1):
                    d['sequence_number'] = i


def is_year6_applicable(year_level: str) -> bool:
    return year_level in YEAR6_LEVELS


def count_descriptors_year6(strand: dict, sub: Optional[dict] = None) -> int:
    if sub is not None:
        return sum(1 for d in sub.get('content_descriptors', []) if is_year6_applicable(d['year_level']))
    total = sum(1 for d in strand.get('content_descriptors', []) if is_year6_applicable(d['year_level']))
    for s in strand.get('sub_strands', []):
        total += sum(1 for d in s.get('content_descriptors', []) if is_year6_applicable(d['year_level']))
    return total


def build_year6_matrix(learning_areas: List[dict]) -> dict:
    matrix_areas = []

    for area in learning_areas:
        strand_rows = []
        area_total = 0

        for strand in area['strands']:
            sub_rows = []
            strand_total = count_descriptors_year6(strand)
            area_total += strand_total

            if strand.get('has_sub_strands') and strand.get('sub_strands'):
                for sub in strand['sub_strands']:
                    sub_total = count_descriptors_year6(strand, sub)
                    sub_rows.append({
                        'id': sub['id'],
                        'name': sub['name'],
                        'checklist_status': 'complete' if sub_total > 0 else 'not_started',
                        'descriptor_target_count': sub_total,
                        'descriptor_completed_count': sub_total,
                        'complete': sub_total > 0,
                        'notes': 'Auto-computed from generated Year 6 and Years 5-6 descriptors.',
                    })

            strand_rows.append({
                'id': strand['id'],
                'name': strand['name'],
                'has_sub_strands': bool(strand.get('has_sub_strands', False)),
                'checklist_status': 'complete' if strand_total > 0 else 'not_started',
                'descriptor_target_count': strand_total,
                'descriptor_completed_count': strand_total,
                'complete': strand_total > 0,
                'notes': 'Auto-computed from generated Year 6 and Years 5-6 descriptors.',
                'sub_strands': sub_rows,
            })

        matrix_areas.append({
            'id': area['id'],
            'name': area['name'],
            'checklist_status': 'complete' if area_total > 0 else 'not_started',
            'descriptor_target_count': area_total,
            'descriptor_completed_count': area_total,
            'complete': area_total > 0,
            'notes': 'Auto-computed from generated Year 6 and Years 5-6 descriptors.',
            'strands': strand_rows,
        })

    return {
        'year_level': '6',
        'excluded_learning_areas': ['languages'],
        'generated_on': str(date.today()),
        'progress_scale': ['not_started', 'in_progress', 'complete'],
        'areas': matrix_areas,
    }


def build_reports(learning_areas: List[dict], exceptions: List[dict]) -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    descriptors = []
    for area in learning_areas:
        for strand in area['strands']:
            for d in strand.get('content_descriptors', []):
                descriptors.append((area['id'], d['year_level'], d['code']))
            for sub in strand.get('sub_strands', []):
                for d in sub.get('content_descriptors', []):
                    descriptors.append((area['id'], d['year_level'], d['code']))

    by_area = {}
    by_year = {}
    for area_id, year_level, _ in descriptors:
        by_area[area_id] = by_area.get(area_id, 0) + 1
        by_year[year_level] = by_year.get(year_level, 0) + 1

    completeness = {
        'generated_on': str(date.today()),
        'total_descriptors': len(descriptors),
        'by_learning_area': dict(sorted(by_area.items())),
        'by_year_level': dict(sorted(by_year.items())),
    }

    with open(REPORTS_DIR / 'ac_v9_completeness_report.json', 'w', encoding='utf-8') as f:
        json.dump(completeness, f, ensure_ascii=False, indent=2)
        f.write('\n')

    with open(REPORTS_DIR / 'ac_v9_mapping_exceptions.json', 'w', encoding='utf-8') as f:
        json.dump({'count': len(exceptions), 'exceptions': exceptions}, f, ensure_ascii=False, indent=2)
        f.write('\n')


def main() -> None:
    with open(JSON_PATH, 'r', encoding='utf-8-sig') as f:
        root = json.load(f)

    df = pd.read_excel(WORKBOOK_PATH, sheet_name='Learning areas')
    cd = df[df['Content Description'].notna()].copy()
    cd = cd[cd['Learning Area'] != 'Languages']

    learning_areas = area_templates()
    area_idx, strand_idx, sub_idx = build_indexes(learning_areas)

    exceptions: List[dict] = []

    for row in cd.to_dict(orient='records'):
        subject = row.get('Subject')
        code = str(row.get('Code'))
        level = str(row.get('Level'))
        text = str(row.get('Content Description'))

        mapping = map_row(subject, code)
        if mapping is None:
            exceptions.append({'subject': subject, 'code': code, 'level': level, 'reason': 'unmapped'})
            continue

        area_id, strand_id, sub_id = mapping

        descriptor = {
            'code': code,
            'year_level': normalize_level(level),
            'text': normalize_whitespace(text),
            'strand_code': strand_id,
            'sequence_number': 0,
        }

        if sub_id is None:
            strand_idx[(area_id, strand_id)].setdefault('content_descriptors', []).append(descriptor)
        else:
            sub_idx[(area_id, strand_id, sub_id)].setdefault('content_descriptors', []).append(descriptor)

    assign_sequences(learning_areas)

    curriculum = {
        'version': '9.0',
        'year_range': 'Foundation to Year 10',
        'last_updated': str(date.today()),
        'learning_areas': learning_areas,
    }
    curriculum['year6_coverage_matrix'] = build_year6_matrix(learning_areas)

    root['example'] = {'curriculum': curriculum}

    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(root, f, ensure_ascii=False, indent=4)
        f.write('\n')

    build_reports(learning_areas, exceptions)

    print('Build complete.')
    print('Descriptors written:', len(cd) - len(exceptions))
    print('Unmapped rows:', len(exceptions))


if __name__ == '__main__':
    main()

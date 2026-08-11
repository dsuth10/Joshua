import json
import subprocess
import sys
from pathlib import Path


SCRIPT = Path(__file__).with_name('query_curriculum.py')
RUN_FROM = Path(__file__).parent


def run_query(*arguments):
    return subprocess.run(
        [sys.executable, str(SCRIPT), *arguments],
        cwd=RUN_FROM,
        capture_output=True,
        text=True,
        check=False,
    )


def json_result(*arguments):
    result = run_query(*arguments, '--format', 'json')
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def main():
    exact = json_result('--code', 'AC9E5LA01')
    assert [descriptor['code'] for descriptor in exact] == ['AC9E5LA01']

    year_five_english = json_result('--learning_area', 'english', '--year_level', '5')
    codes = [descriptor['code'] for descriptor in year_five_english]
    assert codes
    assert codes == sorted(codes)
    assert len(codes) == len(set(codes))
    assert all(descriptor['learning_area'] == 'english' for descriptor in year_five_english)

    no_matches = json_result('--learning_area', 'english', '--year_level', '99')
    assert no_matches == []

    missing_file = run_query('--file', 'definitely-missing-curriculum.json')
    assert missing_file.returncode == 1
    assert 'not found' in missing_file.stderr

    print('PASS query_curriculum.py regression tests')


if __name__ == '__main__':
    main()

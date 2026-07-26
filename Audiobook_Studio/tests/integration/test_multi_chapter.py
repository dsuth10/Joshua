from pathlib import Path

import yaml

from audiobook_studio.multi_chapter import extract_ordered_chapters
from audiobook_studio.project_store import load_project


def test_ordered_chapters_extract_to_independent_paths(tmp_path: Path) -> None:
    source = tmp_path / "source.md"
    source.write_text(
        "# One\n\nFirst chapter.\n\n# Two\n\nSecond chapter.\n\n# Three\n\nOutside.\n",
        encoding="utf-8",
    )
    config = {
        "schema_version": 1,
        "project_id": "multi-test",
        "title": "Multi",
        "source": {
            "path": "source.md",
            "path_base": "project",
            "format": "markdown",
            "selections": [
                {
                    "chapter_id": "one",
                    "title": "One",
                    "selector": {
                        "type": "heading_range",
                        "start_heading": "One",
                        "end_before_heading": "Two",
                    },
                },
                {
                    "chapter_id": "two",
                    "title": "Two",
                    "selector": {
                        "type": "heading_range",
                        "start_heading": "Two",
                        "end_before_heading": "Three",
                    },
                },
            ],
        },
        "rights": {
            "confirmed": False,
            "basis": "test",
            "audience": "test",
            "distribution": "local",
        },
    }
    config_path = tmp_path / "project.yaml"
    config_path.write_text(yaml.safe_dump(config), encoding="utf-8")
    # Keep workspace discovery anchored beneath the real repository.
    real_tmp = Path(__file__).resolve().parents[2] / ".slice3-multi-fixture"
    real_tmp.mkdir(exist_ok=True)
    try:
        (real_tmp / "source.md").write_text(source.read_text(encoding="utf-8"), encoding="utf-8")
        (real_tmp / "project.yaml").write_text(
            config_path.read_text(encoding="utf-8"), encoding="utf-8"
        )
        project = load_project(real_tmp / "project.yaml")
        results = extract_ordered_chapters(project)
        assert [result[0] for result in results] == ["one", "two"]
        assert results[0][2].narration_text == "First chapter.\n"
        assert results[1][2].narration_text == "Second chapter.\n"
    finally:
        for path in sorted(real_tmp.rglob("*"), reverse=True):
            if path.is_file():
                path.unlink()
            elif path.is_dir():
                path.rmdir()
        real_tmp.rmdir()

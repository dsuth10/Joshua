from pathlib import Path

from audiobook_studio.chunking import word_count
from audiobook_studio.narration_plan import create_deterministic_plan
from audiobook_studio.project_store import load_project


def test_pilot_narration_plan_is_source_faithful() -> None:
    studio_root = Path(__file__).resolve().parents[2]
    project = load_project(studio_root / "projects/berani-ginger-juice/project.yaml")
    plan = create_deterministic_plan(project)
    assert len(plan.chunks) == 31
    assert all(word_count(chunk.source_text) <= 90 for chunk in plan.chunks)
    assert all(chunk.source_text == chunk.spoken_text for chunk in plan.chunks)
    assert sum(word_count(chunk.source_text) for chunk in plan.chunks) == 942

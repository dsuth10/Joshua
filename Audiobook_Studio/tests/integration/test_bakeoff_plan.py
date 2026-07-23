from pathlib import Path

from audiobook_studio.bakeoff import load_bakeoff, validate_source_fidelity
from audiobook_studio.project_store import load_project


def test_bakeoff_uses_three_exact_source_passages() -> None:
    studio_root = Path(__file__).resolve().parents[2]
    project = load_project(studio_root / "projects" / "berani-ginger-juice" / "project.yaml")
    plan, candidates = load_bakeoff(project.project_dir)

    validate_source_fidelity(project, plan)

    assert [passage.style for passage in plan.passages] == [
        "reflective",
        "tender",
        "danger",
    ]
    assert {candidate.backend for candidate in candidates.candidates} == {
        "kokoro",
        "qwen",
        "chatterbox",
    }
    assert len(candidates.candidates) == 4
    assert not candidates.consent.human_voice_cloning_allowed


def test_pronunciation_trials_cover_required_terms() -> None:
    studio_root = Path(__file__).resolve().parents[2]
    project = load_project(studio_root / "projects" / "berani-ginger-juice" / "project.yaml")
    plan, _ = load_bakeoff(project.project_dir)
    terms = {term for trial in plan.pronunciation_trials for term in trial.terms}

    assert terms == {
        "Ibu",
        "macaques",
        "gibbons",
        "cicadas",
        "katydids",
        "durians",
        "papayas",
        "rambutans",
    }

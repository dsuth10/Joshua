from pathlib import Path

from audiobook_studio.project_store import load_project
from audiobook_studio.recovery import clean_partial_files


def test_recovery_removes_only_partial_wavs(tmp_path: Path) -> None:
    studio = Path(__file__).resolve().parents[2]
    loaded = load_project(studio / "projects/berani-ginger-juice/project.yaml")
    project = loaded.model_copy(update={"project_dir": tmp_path})
    partial = tmp_path / "chunks" / "raw" / "one.partial.wav"
    accepted = tmp_path / "chunks" / "raw" / "one.raw.wav"
    partial.parent.mkdir(parents=True)
    partial.write_bytes(b"partial")
    accepted.write_bytes(b"accepted")
    assert clean_partial_files(project) == [partial.resolve()]
    assert accepted.is_file()

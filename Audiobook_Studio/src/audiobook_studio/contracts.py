"""Persisted data contracts for Slice 0."""

from datetime import datetime
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class HeadingRangeSelector(StrictModel):
    type: Literal["heading_range"]
    start_heading: str = Field(min_length=1)
    end_before_heading: str = Field(min_length=1)


class WholeDocumentSelector(StrictModel):
    type: Literal["whole_document"]


class HeadingSelector(StrictModel):
    type: Literal["heading"]
    heading: str = Field(min_length=1)


class PageRangeSelector(StrictModel):
    type: Literal["page_range"]
    start_page: int = Field(ge=1)
    end_page: int = Field(ge=1)

    @model_validator(mode="after")
    def ordered_pages(self) -> "PageRangeSelector":
        if self.end_page < self.start_page:
            raise ValueError("end_page must not precede start_page")
        return self


class ParagraphRangeSelector(StrictModel):
    type: Literal["paragraph_range"]
    start_paragraph: int = Field(ge=1)
    end_paragraph: int = Field(ge=1)

    @model_validator(mode="after")
    def ordered_paragraphs(self) -> "ParagraphRangeSelector":
        if self.end_paragraph < self.start_paragraph:
            raise ValueError("end_paragraph must not precede start_paragraph")
        return self


class LineRangeSelector(StrictModel):
    type: Literal["line_range"]
    start_line: int = Field(ge=1)
    end_line: int = Field(ge=1)

    @model_validator(mode="after")
    def ordered_lines(self) -> "LineRangeSelector":
        if self.end_line < self.start_line:
            raise ValueError("end_line must not precede start_line")
        return self


class LiteralStartEndSelector(StrictModel):
    type: Literal["literal_start_end"]
    start_anchor: str = Field(min_length=20)
    end_anchor: str = Field(min_length=20)
    include_end: bool = True


Selector = (
    WholeDocumentSelector
    | HeadingSelector
    | HeadingRangeSelector
    | PageRangeSelector
    | ParagraphRangeSelector
    | LineRangeSelector
    | LiteralStartEndSelector
)


class ChapterSelection(StrictModel):
    chapter_id: str = Field(pattern=r"^[a-z0-9][a-z0-9-]*$")
    title: str = Field(min_length=1)
    selector: Selector


class SourceConfig(StrictModel):
    path: str = Field(min_length=1)
    path_base: Literal["workspace_root", "project"] = "workspace_root"
    format: Literal["markdown", "text", "docx", "pdf"]
    selector: Selector | None = None
    selections: list[ChapterSelection] = Field(default_factory=list)

    @model_validator(mode="after")
    def require_selection(self) -> "SourceConfig":
        if self.selector is None and not self.selections:
            raise ValueError("source requires selector or ordered selections")
        chapter_ids = [selection.chapter_id for selection in self.selections]
        if len(chapter_ids) != len(set(chapter_ids)):
            raise ValueError("chapter selection IDs must be unique")
        return self


class RightsConfig(StrictModel):
    confirmed: bool = False
    basis: str
    audience: str
    distribution: str
    confirmed_by: str = ""
    confirmed_at: str = ""


class PlanningConfig(StrictModel):
    ollama_model: str = "qwen3.5:latest"
    temperature: float = 0.0
    use_llm_annotations: bool = True


class VoiceConfig(StrictModel):
    backend: str = "unselected"
    model_id: str = ""
    profile: str = ""
    language: str = "English"


class AudioConfig(StrictModel):
    target_words_per_minute: int = Field(default=145, ge=80, le=240)
    target_lufs: float = Field(default=-19.0, ge=-30, le=-10)
    true_peak_db: float = Field(default=-3.0, ge=-12, le=0)
    output_sample_rate: int = Field(default=48_000, ge=8_000, le=192_000)
    mono: bool = True


class QaConfig(StrictModel):
    asr_model: str = "distil-large-v3"
    overall_wer_max: float = Field(default=0.03, ge=0, le=1)
    chunk_wer_max: float = Field(default=0.08, ge=0, le=1)
    max_generation_attempts: int = Field(default=3, ge=1, le=10)


class ProjectConfig(StrictModel):
    schema_version: Literal[1]
    project_id: str = Field(pattern=r"^[a-z0-9][a-z0-9-]*$")
    title: str
    subtitle: str = ""
    source: SourceConfig
    rights: RightsConfig
    planning: PlanningConfig = Field(default_factory=PlanningConfig)
    voice: VoiceConfig = Field(default_factory=VoiceConfig)
    audio: AudioConfig = Field(default_factory=AudioConfig)
    qa: QaConfig = Field(default_factory=QaConfig)
    pronunciation_lexicon: str | None = None

    @model_validator(mode="after")
    def validate_rights_confirmation(self) -> "ProjectConfig":
        if self.rights.confirmed and not self.rights.confirmed_by.strip():
            raise ValueError("rights.confirmed_by is required when rights.confirmed is true")
        return self


class Heading(StrictModel):
    level: int = Field(ge=1, le=6)
    text: str
    line_number: int = Field(ge=1)


class DocumentIndex(StrictModel):
    source_path: str
    source_format: Literal["markdown", "text", "docx", "pdf"]
    headings: list[Heading]
    paragraphs: list["DocumentParagraph"] = Field(default_factory=list)
    page_labels: list["PageLabel"] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class DocumentParagraph(StrictModel):
    paragraph_id: str
    text: str
    location: str
    heading_level: int | None = None
    block_quote: bool = False


class PageLabel(StrictModel):
    page_number: int = Field(ge=1)
    label: str
    character_count: int = Field(ge=0)


class ExtractedSelection(StrictModel):
    source_path: str
    selector: Selector
    heading: str
    start_line: int
    end_line: int
    original_selection: str
    narration_text: str
    word_count: int
    paragraph_count: int


class SourceMetadata(StrictModel):
    schema_version: Literal[1] = 1
    source_path: str
    selector: Selector
    heading: str
    start_line: int
    end_line: int
    source_file_sha256: str
    original_selection_sha256: str
    narration_text_sha256: str
    project_config_sha256: str
    pronunciation_lexicon_sha256: str | None = None
    character_count: int
    word_count: int
    paragraph_count: int
    extracted_at: datetime


class StageRecord(StrictModel):
    status: Literal[
        "pending",
        "running",
        "generated",
        "qa_pass",
        "qa_fail",
        "manual_review",
        "approved",
        "packaged",
    ]
    completed_at: datetime | None = None


class ManualApproval(StrictModel):
    gate: str
    decision: Literal["approved"]
    approved_by: str
    approved_at: datetime
    selection: str
    scorecard_waived: bool = False
    notes: str = ""


class Manifest(StrictModel):
    schema_version: Literal[1] = 1
    project_id: str
    created_at: datetime
    source: SourceMetadata
    stages: dict[str, StageRecord]
    outputs: dict[str, str]
    approvals: list[ManualApproval] = Field(default_factory=list)
    chunks: dict[str, dict[str, str | int | float | list[int] | None]] = Field(default_factory=dict)
    resolved_configuration: dict[str, object] = Field(default_factory=dict)
    chapters: dict[str, dict[str, object]] = Field(default_factory=dict)
    migration_history: list[dict[str, object]] = Field(default_factory=list)


class LoadedProject(StrictModel):
    config_path: Path
    project_dir: Path
    workspace_root: Path
    source_path: Path
    lexicon_path: Path | None
    config: ProjectConfig

    model_config = ConfigDict(arbitrary_types_allowed=True, extra="forbid")

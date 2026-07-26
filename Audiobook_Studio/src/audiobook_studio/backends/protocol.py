"""Schema-validated JSON protocol shared by speech backend workers."""

from typing import Literal

from pydantic import Field, model_validator

from audiobook_studio.contracts import StrictModel

BackendAction = Literal[
    "doctor",
    "list_voices",
    "prepare_voice",
    "synthesize",
    "synthesize_batch",
    "release",
]
BackendStatus = Literal["success", "failure"]
SettingValue = str | int | float | bool


class BackendRequest(StrictModel):
    schema_version: Literal[1] = 1
    request_id: str = Field(min_length=1)
    action: BackendAction
    model_id: str = ""
    model_revision: str = ""
    text: str = ""
    language: str = "English"
    voice_reference: str | None = None
    settings: dict[str, SettingValue] = Field(default_factory=dict)
    output_path: str | None = None
    items: list["BackendSynthesisItem"] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_action_fields(self) -> "BackendRequest":
        if self.action == "synthesize":
            if not self.text.strip():
                raise ValueError("text is required for synthesize")
            if not self.model_id.strip():
                raise ValueError("model_id is required for synthesize")
            if not self.output_path:
                raise ValueError("output_path is required for synthesize")
        if self.action == "synthesize_batch":
            if not self.model_id.strip():
                raise ValueError("model_id is required for synthesize_batch")
            if not self.items:
                raise ValueError("items are required for synthesize_batch")
        return self


class BackendSynthesisItem(StrictModel):
    item_id: str = Field(min_length=1)
    text: str = Field(min_length=1)
    output_path: str = Field(min_length=1)
    seed: int = Field(ge=0)


class BackendAudioItem(StrictModel):
    item_id: str
    output_path: str
    sample_rate: int = Field(ge=8_000, le=192_000)
    channels: int = Field(ge=1, le=8)
    duration_seconds: float = Field(gt=0)
    audio_sha256: str


class BackendResponse(StrictModel):
    schema_version: Literal[1] = 1
    request_id: str = Field(min_length=1)
    status: BackendStatus
    sample_rate: int | None = Field(default=None, ge=8_000, le=192_000)
    channels: int | None = Field(default=None, ge=1, le=8)
    duration_seconds: float | None = Field(default=None, gt=0)
    audio_sha256: str | None = None
    worker_lock_sha256: str | None = None
    warnings: list[str] = Field(default_factory=list)
    error: str | None = None
    data: dict[str, SettingValue | list[str]] = Field(default_factory=dict)
    items: list[BackendAudioItem] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_status_fields(self) -> "BackendResponse":
        if self.status == "failure" and not self.error:
            raise ValueError("error is required for a failure response")
        if self.status == "success" and self.error:
            raise ValueError("successful response cannot contain an error")
        return self

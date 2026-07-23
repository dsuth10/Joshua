"""Application-specific exceptions and stable CLI exit codes."""

from enum import IntEnum


class ExitCode(IntEnum):
    SUCCESS = 0
    INVALID_INPUT = 2
    ENVIRONMENT_FAILURE = 3
    SOURCE_FIDELITY_FAILURE = 4
    GENERATION_FAILURE = 5
    QA_FAILURE = 6
    APPROVAL_REQUIRED = 7


class AudiobookError(Exception):
    """Base class for expected user-facing failures."""

    exit_code = ExitCode.INVALID_INPUT


class WorkspaceNotFoundError(AudiobookError):
    """Raised when the Joshua workspace root cannot be located."""

    exit_code = ExitCode.ENVIRONMENT_FAILURE


class ConfigurationError(AudiobookError):
    """Raised when persisted project configuration is invalid."""


class SourceSelectionError(AudiobookError):
    """Raised when a source selection is missing or ambiguous."""

    exit_code = ExitCode.SOURCE_FIDELITY_FAILURE


class ManifestValidationError(AudiobookError):
    """Raised when a project manifest is absent or invalid."""

    exit_code = ExitCode.SOURCE_FIDELITY_FAILURE

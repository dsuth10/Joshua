"""Extractor protocol."""

from pathlib import Path
from typing import Protocol

from audiobook_studio.contracts import (
    DocumentIndex,
    ExtractedSelection,
    HeadingRangeSelector,
)


class Extractor(Protocol):
    def inspect(self, source: Path) -> DocumentIndex: ...

    def extract(self, source: Path, selector: HeadingRangeSelector) -> ExtractedSelection: ...

"""Source extractors."""

from audiobook_studio.contracts import SourceConfig
from audiobook_studio.errors import ConfigurationError
from audiobook_studio.extractors.base import Extractor
from audiobook_studio.extractors.docx import DocxExtractor
from audiobook_studio.extractors.markdown import MarkdownExtractor
from audiobook_studio.extractors.pdf import PdfExtractor
from audiobook_studio.extractors.plaintext import PlainTextExtractor


def get_extractor(source: SourceConfig) -> Extractor:
    extractors: dict[str, Extractor] = {
        "markdown": MarkdownExtractor(),
        "text": PlainTextExtractor(),
        "docx": DocxExtractor(),
        "pdf": PdfExtractor(),
    }
    if source.format not in extractors:
        raise ConfigurationError(f"Unsupported source format: {source.format}")
    return extractors[source.format]


__all__ = [
    "DocxExtractor",
    "MarkdownExtractor",
    "PdfExtractor",
    "PlainTextExtractor",
    "get_extractor",
]

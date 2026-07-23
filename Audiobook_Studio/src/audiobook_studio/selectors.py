"""Heading normalisation and exact selector matching."""

import re
import unicodedata

DASH_TRANSLATION = str.maketrans(
    {
        "\u2010": "-",
        "\u2011": "-",
        "\u2012": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2212": "-",
    }
)


def normalise_heading(value: str) -> str:
    normalised = unicodedata.normalize("NFKC", value).translate(DASH_TRANSLATION)
    return re.sub(r"\s+", " ", normalised).strip().casefold()

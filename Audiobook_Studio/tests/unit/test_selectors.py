from audiobook_studio.selectors import normalise_heading


def test_heading_normalisation_handles_dash_variants_and_case() -> None:
    assert normalise_heading("Ginger Juice (Pages 65–69)") == normalise_heading(
        " ginger  juice (PAGES 65-69) "
    )

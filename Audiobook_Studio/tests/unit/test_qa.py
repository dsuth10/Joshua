from audiobook_studio.qa import normalize_asr, word_error_rate


def test_asr_normalization_ignores_case_and_punctuation() -> None:
    assert normalize_asr("Ibu, DON'T go!") == ["ibu", "don't", "go"]


def test_word_error_rate_counts_substitution() -> None:
    wer, differences = word_error_rate("one two three", "one too three")
    assert wer == 1 / 3
    assert differences

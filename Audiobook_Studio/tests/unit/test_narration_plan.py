from audiobook_studio.narration_plan import (
    LexiconEntry,
    PronunciationLexicon,
    apply_lexicon,
)


def test_lexicon_applies_only_enabled_human_approved_complete_words() -> None:
    lexicon = PronunciationLexicon(
        language="en-AU",
        application_policy="human_approved",
        entries={
            "Ibu": LexiconEntry(say_as="ee-boo", enabled=True, source="human_approved"),
            "ape": LexiconEntry(
                say_as="ayp", enabled=False, source="override_candidate_not_selected"
            ),
        },
    )
    spoken, replacements = apply_lexicon("Ibu sees an ibuprofen packet and an ape.", lexicon)
    assert spoken == "ee-boo sees an ibuprofen packet and an ape."
    assert [replacement.key for replacement in replacements] == ["Ibu"]


def test_source_spelling_policy_makes_no_changes() -> None:
    lexicon = PronunciationLexicon(
        language="en-AU",
        application_policy="source_spelling",
        entries={
            "Ibu": LexiconEntry(
                say_as="ee-boo",
                enabled=False,
                source="override_candidate_not_selected",
            )
        },
    )
    assert apply_lexicon("Ibu", lexicon) == ("Ibu", [])

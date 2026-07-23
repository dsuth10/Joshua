from audiobook_studio.hashing import sha256_text


def test_text_change_changes_hash() -> None:
    assert sha256_text("original") != sha256_text("changed")


def test_same_text_has_stable_hash() -> None:
    assert sha256_text("same") == sha256_text("same")

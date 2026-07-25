from audiobook_studio.chunking import build_chunks, parse_paragraphs, split_sentences, word_count


def test_paragraph_parser_retains_performance_spans() -> None:
    source = "# Chapter\n\n**Opening words**, then normal.\n\n*Remember this.* More text.\n\n***\n"
    paragraphs = parse_paragraphs(source)
    assert [paragraph.paragraph_id for paragraph in paragraphs] == ["p001", "p002"]
    assert paragraphs[0].kind == "bold_opening"
    assert paragraphs[0].source_text == "Opening words, then normal."
    assert paragraphs[1].spans[0].text == "Remember this."


def test_sentence_split_is_deterministic_and_protects_abbreviations() -> None:
    assert split_sentences("Dr. Lee waits. Then Ari runs!") == [
        "Dr. Lee waits.",
        "Then Ari runs!",
    ]


def test_chunks_are_paragraph_local_and_below_hard_limit() -> None:
    source = "# Chapter\n\n" + " ".join(["word"] * 180)
    chunks = build_chunks(parse_paragraphs(source))
    assert [chunk.chunk_id for chunk in chunks] == ["p001-c01", "p001-c02"]
    assert all(word_count(chunk.source_text) <= 90 for chunk in chunks)

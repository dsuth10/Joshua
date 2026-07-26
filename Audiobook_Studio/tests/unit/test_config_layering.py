from audiobook_studio.config_layering import deep_merge_layers


def test_configuration_precedence_and_nested_merge() -> None:
    resolved = deep_merge_layers(
        {"audio": {"rate": 48000, "lufs": -19}, "backend": "default"},
        {"audio": {"lufs": -18}, "backend": "qwen"},
        {"audio": {"pace": 145}},
        {"audio": {"lufs": -17}},
        {"audio": {"pace": 150}},
    )
    assert resolved == {
        "audio": {"rate": 48000, "lufs": -17, "pace": 150},
        "backend": "qwen",
    }

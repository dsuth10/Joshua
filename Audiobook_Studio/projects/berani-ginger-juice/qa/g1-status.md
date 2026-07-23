# Gate G1 Status — Berani / Ginger Juice

**Started:** 2026-07-23  
**Overall result:** IN PROGRESS — awaiting GPU generation and human listening approval

## Implemented

- Schema-validated backend request and response contracts
- Timeout-safe isolated worker runner with per-attempt logs
- Worker lockfile hashing
- WAV decoding, duration, channel, sample-rate, and SHA256 validation
- Kokoro 0.9.4 worker
- Qwen3-TTS 0.1.1 worker supporting CustomVoice, VoiceDesign, and Base cloning
- Chatterbox 0.1.7 Multilingual V3 worker
- Four frozen voice candidates
- Three exact source passages totalling 211 words:
  - reflective opening
  - memory and tenderness
  - rising danger
- Baseline and override trials covering all eight required pronunciation terms
- Human evaluation scorecard and consent restrictions
- WSL bootstrap and generation scripts

## Automated verification

- Ruff lint: PASS
- Ruff formatting: PASS
- Strict mypy: PASS
- Non-GPU tests: 15 PASS
- Bake-off source fidelity: PASS
- Backend schemas exported: PASS

## Remaining

- Generate and validate all candidate WAV files
- Record any environment-specific backend failure
- Complete human listening scorecard
- Approve pronunciations
- Select and freeze one production voice
- Approve progression to Slice 2

## Worker environment evidence

The isolated WSL environments were successfully bootstrapped on 2026-07-23.

| Worker | Primary package | PyTorch | Lockfile SHA256 |
|---|---|---|---|
| Kokoro | `kokoro==0.9.4` | `2.13.0` | `2f09ab03c865f14ffde7e28deef52506e7c43531de9cfd077d7a062946d95028` |
| Qwen | `qwen-tts==0.1.1` | `2.13.0` | `d777ef52b02975368cfb0036eb8f7a9d39e0a357038a985de14cd231f160434f` |
| Chatterbox | `chatterbox-tts==0.1.7` | `2.6.0` | `c048afb61fc041e44aee564970ec8d914bd671e1d797aa9d17124c3ee5221807` |

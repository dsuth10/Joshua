# Gate G1 Status — Berani / Ginger Juice

**Started:** 2026-07-23  
**Overall result:** PASS — Gate G1 closed

## Implemented

- Schema-validated backend request and response contracts
- Timeout-safe isolated worker runner with per-attempt logs
- Worker lockfile hashing
- WAV decoding, duration, channel, sample-rate, and SHA256 validation
- Kokoro 0.9.4 worker
- Qwen3-TTS 0.1.1 worker supporting CustomVoice, VoiceDesign, and Base cloning
- Chatterbox 0.1.7 Multilingual V2 compatibility worker
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

- None for Slice 1

## Worker environment evidence

The isolated WSL environments were successfully bootstrapped on 2026-07-23.

| Worker | Primary package | PyTorch | Lockfile SHA256 |
|---|---|---|---|
| Kokoro | `kokoro==0.9.4` | `2.13.0` | `d53c85132a4436b8b8cb0a0b407494ae90755acd182b39712ac7cb37f30dd5b3` |
| Qwen | `qwen-tts==0.1.1` | `2.13.0` | `bfcefe0c7398604f011e062c3c3f4e9375d49bdc7cb4533f1468f29066ba34f2` |
| Chatterbox | `chatterbox-tts==0.1.7` | `2.6.0` | `11aa331a0358c3f7abaeb01d2f004464a0c6c74f7c1718e018b855bd56983b58` |

## Generation progress

- Qwen CustomVoice Serena: 5 valid WAV files
- Qwen designed voice and Base clone: 6 valid WAV files
- Kokoro bf_emma: 5 valid WAV files
- Chatterbox Multilingual V2: 5 valid WAV files
- Total: 21/21 expected WAV files

## Automated pre-listening decision

PASS on 2026-07-24:

- All four candidate sets are complete.
- Every WAV is non-empty and decodable.
- All WAVs are mono, 24,000 Hz PCM audio.
- Every recorded audio SHA256 matches the generated file.
- Every sample records the current isolated worker lockfile hash.
- The same three source-text hashes are used across all candidates.
- Baseline and override pronunciation-text hashes are consistent across candidates.

The automated pass did not close Gate G1 by itself. The project owner's subsequent
listening decision below supplied the required human approval.

## Human approval decision

Gate G1 was closed by the project owner on 2026-07-25.

- Selected candidate: `qwen-designed-clone`
- Production backend: Qwen3-TTS Base using the synthetic VoiceDesign reference
- Runner-up observation: both Qwen candidates were good
- Decision rationale: `qwen-designed-clone` was the clear winner in all respects
- Numerical scorecard: explicitly waived by the project owner
- Pronunciation policy: baseline/source spelling; phonetic override candidates disabled
- Human voice consent: not required because the frozen reference is synthetic
- Progression to Slice 2: approved

The signed machine-readable decision is stored in
`projects/berani-ginger-juice/voice-bakeoff/approval.json`.

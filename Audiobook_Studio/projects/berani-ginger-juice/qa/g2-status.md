# Gate G2 Status — Berani / Ginger Juice

**Overall result:** PASS — GATE G2 CLOSED

## Implemented evidence

- Deterministic paragraph parsing and formatting-span metadata
- Stable paragraph-local chunk IDs
- Source/spoken-text hashes and explicit pronunciation replacements
- Schema-constrained optional Ollama annotations with deterministic fallback
- Content-addressed rendering and deterministic retry seeds
- Per-chunk raw and mastered WAV persistence
- FFmpeg silence trimming, fades, mono conversion, and 48 kHz resampling
- Pause-aware chapter assembly and global loudness mastering
- Batch faster-whisper transcription worker
- Overall and per-chunk WER checks
- PCM, sample-rate, channel, clipping, duration, loudness, and true-peak checks
- Rights-gated M4B and MP3 packaging
- Manual listening checklist

## Remaining

- None for Slice 2

## Production evidence — 2026-07-25

- Frozen voice: `qwen-designed-clone`
- Planned chunks: 31
- Accepted mastered chunks: 31/31
- Targeted second attempts: `p012-c01`, `p014-c01`
- Full cache proof: 31/31 hits
- WAV master duration: 389.77 seconds
- Pace: 145.62 words per minute
- Overall WER: 1.27% (maximum 3%)
- Per-chunk WER: all chunks at or below 8%
- Integrated loudness: -19.15 LUFS
- True peak: -3.0 dBTP
- Mono 48 kHz PCM: PASS
- Clipping: none
- Automated technical QA: PASS
- Automated disposition: `manual_review`
- Manual listening decision: PASS
- Manual approver: Project owner
- Manual approval date: 2026-07-25
- Rights confirmation: PASS
- Rights basis: school education licence
- Audience: enrolled students and staff
- Distribution: secure local or school systems only
- M4B delivery: verified
- MP3 delivery: verified
- Transcript delivery: verified
- Approved master destination:
  `output/master/Berani - Ginger Juice - Master.wav`
- Master SHA256:
  `612d2dad7ba841b2666ab3e08c3085e43bec0c18869dcd8888289d1dc0c83f4c`

Seven low-risk ASR differences remain listed in `qa/report.json`. All passed the
per-chunk threshold and were accepted during the required human listening pass.

Gate G2 is closed. Progression to Slice 3 awaits project-owner direction.

# Ginger Juice Voice Bake-off — Listening Guide

Gate G1 now has four complete candidate sets and 21 validated WAV files. Use headphones
if possible and keep the playback volume unchanged while comparing candidates.

## Candidate folders

1. `qwen-custom-serena`
2. `qwen-designed-clone`
3. `kokoro-bf-emma`
4. `chatterbox-v2-default`

Audio is stored in `../qa/audio/voice-bakeoff/`.

## Recommended comparison order

Compare one passage across all four voices before moving to the next passage:

1. `reflective-opening.wav`
2. `memory-and-tenderness.wav`
3. `rising-danger.wav`

This makes voice differences easier to hear than listening to one candidate's entire set
at once.

For each file, compare the narration against `passages.json`. Immediately disqualify a
candidate if it omits, repeats, or invents a clause, clips words, changes voice identity,
or creates an inappropriate comic animal voice.

## Pronunciation review

For each candidate, compare:

- `pronunciation-baseline.wav`
- `pronunciation-override.wav`

Judge the eight terms separately:

- Ibu
- macaques
- gibbons
- cicadas
- katydids
- durians
- papayas
- rambutans

An override should be selected only when it sounds more natural—not merely more
deliberate. Reject spellings that make the narrator sound as though she is reading
phonetics.

## Scoring

Enter 1–5 scores in `scorecard.md`:

| Criterion | Weight |
|---|---:|
| Naturalness | 25% |
| Intelligibility and source accuracy | 20% |
| Emotional suitability | 20% |
| Voice consistency across passages | 15% |
| Pronunciation of key terms | 10% |
| Compute speed and stability | 10% |

Do not approve a production voice until all mandatory integrity boxes are checked and
the pronunciation decisions are recorded.

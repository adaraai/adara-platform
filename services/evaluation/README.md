# evaluation service

**Owner:** ADARA Platform · **Status:** Planned (scripts exist, service wrapper does not).

## What this service does

The Evaluation service runs quality benchmarks against every capability ADARA exposes. It is not
customer-facing — it is how ADARA knows whether a new model weight or knowledge pack is better
than the one it replaces, before that replacement ships.

| Pipeline | Measures |
|---|---|
| **ASR accuracy** | Word Error Rate (WER) and Character Error Rate (CER) per language, on held-out audio. Broken down by accent, recording condition, and speaker demographic. |
| **LID accuracy** | Language identification precision and recall per language pair. Especially important for code-switched utterances. |
| **TTS naturalness** | Automatic and human MOS (Mean Opinion Score). Currently: UTMOS for automated scoring. |
| **Context resolution** | Precision@1 for local reference resolution — does the top-ranked concept match what a human annotator selected? |
| **End-to-end latency** | Wall-clock time from audio upload to final reply, measured at the voice-agent level. P50 / P95 / P99. |

## Running evaluations (today)

Evaluation scripts already exist in `adara-intelligence`:

```bash
# ASR benchmark
python adara-intelligence/scripts/speech/run_benchmark.py --language tw --split test

# Language detection
python adara-intelligence/scripts/language/run_benchmark.py --language pcm

# Context coverage report
python adara-intelligence/scripts/language/coverage_report.py
```

Results are written to `adara-intelligence/src/speech/evaluation/results.py` (structured) and
printed as a summary table.

## Corpora

| Corpus | Languages | Source |
|---|---|---|
| FLEURS | ~100 languages incl. Swahili, Hausa, Yoruba | Google, public |
| AfriSpeech | Nigerian English accents | Community, CC-BY |
| Internal | Twi, Pidgin — small | ADARA-collected, not public |

See `adara-intelligence/src/speech/evaluation/corpora/`.

## Future service wrapper

When this moves to a service, it will expose:

- `POST /internal/evaluation/runs` — trigger a benchmark run
- `GET /internal/evaluation/runs/{id}` — stream results as they complete
- `GET /internal/evaluation/leaderboard` — current best scores per language

Results feed the `asr_quality` and `tts_quality` fields on `GET /v1/languages`.

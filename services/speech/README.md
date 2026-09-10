# speech service

**Owner:** ADARA Platform · **Port (planned):** 8082 · **Status:** Planned — capability is currently served by `services/door`.

## What this service does

The Speech service owns the full lifecycle of audio in ADARA:

| Surface | Description |
|---|---|
| **Transcribe (short-form)** | Synchronous ASR for utterances up to 30 s. Responds in a single HTTP round-trip. |
| **Transcribe (long-form)** | Async job queue for recordings up to 4 hours. Uses `POST /v1/speech/jobs` + `GET /v1/speech/jobs/{id}`. |
| **Synthesize** | Text-to-speech. Returns a WAV buffer or a streaming audio response. Accent and language are caller-specified. |
| **Streaming STT** | WebSocket endpoint for real-time transcription as audio chunks arrive from the microphone. |
| **Language detection** | Spoken-language ID over audio — distinct from the text-based LID in `services/language`. |

## African language coverage

Coverage is sourced from `adara-intelligence`. Transcription quality is reported per language in
`GET /v1/languages` (`asr_quality`, `tts_quality` fields). Languages without a quality value are
interface-only: the route exists but returns `501`.

Supported today (MMS-based): Twi (`tw`), Yoruba (`yo`), Igbo (`ig`), Hausa (`ha`), Swahili (`sw`),
Nigerian Pidgin (`pcm`), Kinyarwanda (`rw`) and ~20 more. See `adara-intelligence/src/speech/languages/`.

## Backends

The speech service delegates model execution to `adara-intelligence`:

```
speech service
    └── adara-intelligence
            ├── mms_backend.py        ← Meta MMS  (ASR, primary)
            ├── mms_tts_backend.py    ← Meta MMS  (TTS, primary)
            ├── whisper_backend.py    ← Whisper   (ASR, fallback for languages MMS misses)
            └── pyannote_backend.py  ← Pyannote  (diarization)
```

Model weights are downloaded once and cached in the Hugging Face cache directory. Run
`adara-intelligence/scripts/speech/download_mms.py` to pre-fetch.

## Separation from Door

Today, `services/door` directly embeds the speech routes as a convenience so development does not
require running two Python processes. When this service is extracted, `door` will proxy to it:

```
door  ──proxy──►  speech service  ──calls──►  adara-intelligence
```

`door` retains the public URL contract; callers see no change.

## Running locally (future)

```bash
cd services/speech
pip install -e ".[dev]"
python -m speech
# POST http://localhost:8082/v1/speech/transcribe
```

## Not-yet-wired routes

| Route | Plan |
|---|---|
| `POST /v1/speech/jobs` | Long-form async transcription |
| `GET  /v1/speech/jobs/{id}` | Poll / stream partial results |
| `WS   /v1/speech/stream` | Real-time streaming STT |

These are defined in `adara-platform/docs/openapi/adara-v1.yaml` and return `501` today.

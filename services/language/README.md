# language service

**Owner:** ADARA Platform · **Port (planned):** 8083 · **Status:** Planned — capability is currently served by `services/door`.

## What this service does

The Language service owns written-language understanding in ADARA. Audio-based language detection
lives in `services/speech`.

| Surface | Description |
|---|---|
| **Language detection** | Identify which language (or mix of languages) a piece of text is written in. Returns a ranked list of ISO 639-3 codes with confidence scores. |
| **Named entity recognition** | Extract typed spans from text — people, places, organisations, monetary amounts, phone numbers, SIM card references and local proper nouns. |
| **Code-switching** | Detect segment boundaries when a speaker alternates between two or more languages within a single utterance. Frequent in West African speech: Twi–English, Pidgin–Yoruba, etc. |
| **Normalisation** | Expand contracted or abbreviated forms: *"GH₵"* → `GHS 1.00`, *"MTN momo"* → `mobile_money`. |

## African language coverage

Heuristic language detection packs are in `adara-intelligence/src/language/detection/packs/` — one
JSON file per language code. Languages with packs: Afrikaans, Amharic, Bambara, Ewe, English,
French, Hausa, Igbo, Luganda, Lingala, Chichewa, Oromo, Kinyarwanda, Shona, Somali, Swahili, Tigrinya, Twi, Wolof, Xhosa, Yoruba, Zulu, Nigerian Pidgin.

## Separation from Door

Today, `services/door` directly serves `/v1/language/*` for convenience. When extracted, `door`
proxies:

```
door  ──proxy──►  language service  ──calls──►  adara-intelligence
```

## Running locally (future)

```bash
cd services/language
pip install -e ".[dev]"
python -m language
# POST http://localhost:8083/v1/language/detect
```

## Routes

| Route | Status |
|---|---|
| `POST /v1/language/detect` | Live (via door) |
| `POST /v1/language/entities` | Live (via door) |
| `POST /v1/language/codeswitch` | Not implemented (`501`) |

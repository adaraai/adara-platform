# context service

**Owner:** ADARA Platform · **Port (planned):** 8084 · **Status:** Planned — capability is currently served by `services/door`.

## What this service does

The Context service owns *local knowledge grounding* — the part of ADARA that turns a raw utterance
into something a caller can act on. It knows what local references mean.

| Surface | Description |
|---|---|
| **Resolve** | What does a local reference point at? *"momo"* → `mobile_money`. *"NEPA"* → `electricity_utility`. *"trotro"* → `shared_minibus`. Returns a grounded concept with glosses, region, provenance, and confidence. |
| **Query** | Alias for Resolve. Accepts a freeform question: *"what is a keke?"* |
| **Coverage** | Which languages and regions have knowledge packs installed? Returns a machine-readable map used by the voice-agent to decide which languages it will actively suggest. |

## Knowledge packs

Packs live in `adara-intelligence/src/context/packs/`:

| Pack | Language | Region |
|---|---|---|
| `tw.json` | Twi | GH |
| `pcm.json` | Nigerian Pidgin | NG |
| `sw.json` | Swahili | KE / TZ |
| `yo.json` | Yoruba | NG |

Every entry carries a `provisional` flag. All current packs are `provisional=true` — assembled
from secondary sources, not yet reviewed by fluent speakers. Surface this to end-users.

## Separation from Door

Today, `services/door` directly serves `/v1/context/*`. When extracted:

```
door  ──proxy──►  context service  ──reads──►  adara-intelligence/context/packs/
```

## Running locally (future)

```bash
cd services/context
pip install -e ".[dev]"
python -m context_service
# POST http://localhost:8084/v1/context/resolve
```

## Routes

| Route | Status |
|---|---|
| `POST /v1/context/resolve` | Live (via door) |
| `POST /v1/context/query` | Live — alias for resolve (via door) |
| `GET  /v1/context/coverage` | Live (via door) |

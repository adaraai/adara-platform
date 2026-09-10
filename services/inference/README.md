# inference service

**Owner:** ADARA Platform · **Port (planned):** 8085 · **Status:** Planned.

## What this service does

The Inference service is the model-serving layer — it loads GPU-resident model weights once and
answers prediction requests from other services over a fast local transport.

Today, `adara-intelligence` is imported directly as a Python library inside `services/door`. That
works for a single-process development setup but does not scale: each worker process loads its own
copy of the model weights, cold-start time is measured in minutes, and GPU memory is wasted.

Inference solves this by:

| Responsibility | Notes |
|---|---|
| **Model loading** | Loads MMS, Whisper, and NER weights once at startup. |
| **Batch inference** | Queues requests and batches them for GPU efficiency. |
| **Hot reloads** | Swaps model weights without restarting the service. |
| **Hardware routing** | Routes to GPU when available; falls back to CPU automatically. |
| **Health & readiness** | Reports which models are loaded and what their cold-start latency was, so the Gateway can delay traffic until warm. |

## Internal protocol

Services call Inference over a local socket, not over the public API. The protocol is
`adara-intelligence`'s native Python objects — no HTTP overhead for the hot path.

When the Inference service is running, other services detect it and use it automatically. When it
is absent (development), they fall back to loading models in-process.

## Why this matters for speech

MMS cold-start on a CPU machine is 60–120 s. With Inference:
- The model is loaded once when the service starts, not on the first request.
- Every subsequent call responds in milliseconds (warm model).
- The voice-agent capability probe no longer needs a 180 s timeout.

## Running locally (future)

```bash
cd services/inference
pip install -e ".[dev]"
python -m inference
```

The service announces itself on a Unix domain socket or a loopback TCP port. Other services
discover it via environment variable `ADARA_INFERENCE_ADDR`.

# gateway service

**Owner:** ADARA Platform · **Port (planned):** 443 / 8000 · **Status:** Planned.

## What this service does

The Gateway is the single external-facing entry point for all ADARA API traffic. It sits in front
of every other service and enforces cross-cutting concerns that do not belong in individual
services.

| Responsibility | Notes |
|---|---|
| **TLS termination** | All external traffic is HTTPS. Internal service-to-service traffic can be plain HTTP inside the cluster. |
| **Authentication** | Validates `Authorization: Bearer <key>` against the key store. Forwards identity headers to services. |
| **Rate limiting** | Per-key, per-route, per-IP. Prevents quota abuse without each service implementing it separately. |
| **Request routing** | `/v1/speech/*` → speech service · `/v1/language/*` → language service · `/v1/context/*` → context service · `/v1/*` fallthrough → door. |
| **Request / response logging** | Every request gets a `request_id`. Logged centrally for support and billing. |
| **Usage metering** | Emits billing events: `audio_seconds_transcribed`, `characters_synthesized`, `understand_calls`. |

## Current state

There is no Gateway yet. `services/door` serves all `/v1/*` routes directly and handles its own
authentication. When the Gateway is introduced:

1. `door` drops its auth middleware (Gateway does it).
2. Each capability service gets its own network address.
3. External clients continue hitting the same URL — they see nothing change.

## Implementation plan

The Gateway will be a thin reverse proxy — Caddy, Nginx, or a small Go service — not a FastAPI
application. Business logic stays out of it.

## Developer mode (no Gateway)

In development, `ADARA_DOOR_DEV=1` disables key checking on `door` entirely. Do not set this in
any environment that accepts external traffic.

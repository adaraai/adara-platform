# voice-agent service

The backend between the mobile voice UI and ADARA.

```
apps/mobile  ──HTTP──▶  services/voice-agent  ──adara-sdk──▶  ADARA intelligence
                        (sessions, turns,                     (speech, language,
                         orchestration, policy)                context)
```

**Status:** runs today. `ADARA_MODE=local` executes `adara-intelligence` inside this process, so
the whole chain works with no deployed API and no model weights. What is missing is missing loudly:
transcription and synthesis report themselves unavailable with a reason, rather than returning
empty results that read as silence.

## Why this service exists

The mobile app could call ADARA directly. It should not:

- **One round trip per turn instead of four.** Transcribe, understand, resolve, decide — over a bar
  of 3G, that is the difference between a conversation and a wait.
- **The degradation rules live in one place.** What happens when there is no ASR, when the language
  detector abstains, when a capability half-fails — every client would otherwise reimplement it,
  and each would get it slightly differently.
- **A conversation has state.** The locale and the settled language belong to the session, not to
  every request. Voice turns are short and the detector abstains on short text; without a session,
  "yes" would drop the language established two turns ago.
- **API keys stay off the phone.** A key in a mobile binary is a published key.

## Run it

```bash
pip install -e ../../../adara-sdk/python          # the SDK
pip install -e ../../../adara-intelligence        # the engine, for ADARA_MODE=local
pip install -e .

python -m voice_agent            # http://127.0.0.1:8091
```

Point the app at it and everything else works unchanged:

```bash
EXPO_PUBLIC_ADARA_API_URL=http://127.0.0.1:8091 npm start --prefix ../../apps/mobile
```

| Variable | Default | |
|---|---|---|
| `ADARA_MODE` | `local` | `local` runs the engine in-process; `api` calls a deployed ADARA |
| `ADARA_BASE_URL` | `http://localhost:8080` | Used when `ADARA_MODE=api` |
| `ADARA_API_KEY` | — | Required when `ADARA_MODE=api` |
| `PORT` | `8091` | Not 8081 — Expo Metro / Expo Go use 8081 |
| `VOICE_AGENT_SESSION_TTL` | `3600` | Seconds before an idle session is swept |
| `VOICE_AGENT_MAX_AUDIO_BYTES` | `26214400` | Rejected before reaching a model |

Switching to a deployed ADARA is one environment variable. No code changes — that is the entire
reason this is built on `adara-sdk` rather than on raw HTTP.

## API

Routes `apps/mobile` already calls, served in the shapes it already parses:

| | |
|---|---|
| `GET /v1/health` | Adds `capabilities` — what actually works, so the UI can hide the microphone *before* someone records into it |
| `GET /v1/languages` | Status mapped **down, never up**: `claimed` is a vendor's listing, so it can never present above `experimental`. The true value rides along as `adara_status` |
| `GET /v1/models`, `GET /v1/context/coverage` | What is wired; what knowledge exists per language |
| `POST /v1/language/detect` | Returns `code`, plus `abstained` and `reason` — a null language with a reason is an answer, not a failure |
| `POST /v1/speech/transcribe` | `501`, explaining that a server cannot read a phone's file URI, and pointing at the turn endpoint |
| `POST /v1/context/generate` | `501`. There is no language model in this stack |

The conversation:

| | |
|---|---|
| `POST /v1/agent/sessions` | Start a call. Returns the session and the capability map |
| `POST /v1/agent/sessions/{id}/turns` | A turn — JSON `{text}`, or multipart with an audio file |
| `GET /v1/agent/sessions/{id}` | The transcript, as turn summaries |
| `GET /v1/agent/sessions/{id}/turns/{tid}` | One turn's full meaning object |
| `GET /v1/agent/sessions/{id}/events` | SSE: `turn.created`, `turn.transcribed`, `turn.understood`, `turn.replied`, `turn.failed` |
| `DELETE /v1/agent/sessions/{id}` | End it |

## What the agent says, and what it will never say

There is no language model here. `adara-intelligence` resolves references and reports what it could
not explain; it does not write prose. So every reply is a **template filled from what was actually
resolved**, and `reply.source` says `grounded_template` on every single one.

That is less limiting than it sounds, because a voice agent's most valuable turns are not answers:

| `reply.act` | |
|---|---|
| `acknowledge` | Reads back what was understood — and says plainly that nothing was acted on |
| `clarify_sense` | `chama` is a savings group *and* a political party. The engine knows it could not choose, so the agent asks instead of guessing |
| `ask_unknown_term` | The engine reported a gap. The speaker is the one person who can close it, so the agent asks — and every answer is a candidate contribution to a knowledge pack |
| `ask_repeat` | Nothing to work with |
| `report_unavailable` | Understood as language, but nothing in it is covered yet — which tells the speaker the problem is coverage, not audio |

It will never claim to have performed an action, answer a factual question, or paraphrase a term
flagged `sensitivity` — which is why that field is carried from a knowledge pack all the way into
`policy.py`.

**Replacing the policy is the supported path.** `AgentPolicy` is a one-method interface. A product
with its own domain logic and its own model implements it, passes it to `VoiceAgent`, and nothing
else changes — `reply.source` then names that model instead. Health triage and payment workflows
belong in `adara-voice`, not in a platform service.

## Honest limits

- **In-memory sessions.** A restart drops every in-flight conversation and two replicas share
  nothing. Fine for development and a single instance; replace with the Redis already in
  `docker-compose.yml` before scaling out.
- **`http.server`.** A thread per connection, no HTTP/2, and an SSE stream holds a thread for its
  lifetime. Matches `apps/api`, which does the same in Node. Put an ASGI server in front of it past
  a handful of concurrent calls — the routing table is a list of plain functions precisely so that
  is a small change.
- **No authentication.** This service trusts its caller. It is a development BFF; deployment needs
  auth in front of it.
- **Every knowledge pack behind it is unreviewed**, so `provisional` is true for every language, and
  it reaches the client in `reply.warnings`. Surface it.

## Tests

```bash
pytest -q          # 53 tests
ruff check .
```

Unit tests drive the service with a fake ADARA so degradation paths are easy to provoke. The last
suite runs the whole stack against the real engine, which is what stops the fake drifting from what
it stands in for.

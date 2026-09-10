# safety service

**Owner:** ADARA Platform · **Port (planned):** 8086 · **Status:** Planned.

## What this service does

The Safety service is a middleware layer that every other ADARA service calls before committing a
response. It ensures ADARA does not amplify harm in the communities it serves.

| Responsibility | Notes |
|---|---|
| **Sensitivity flagging** | Detects utterances that touch flagged topics — insults, slurs, politically sensitive terms — and attaches a `sensitive` warning to the response rather than suppressing it. Suppression is the caller's decision. |
| **PII detection** | Identifies phone numbers, national ID patterns, financial account numbers, and names in transcripts before they are stored or forwarded. |
| **Content policy** | Blocks synthesis of audio that violates the usage policy (hate speech, impersonation, etc.). Returns a structured `policy_violation` error, not a generic 400. |
| **Audit logging** | Records every flagged event with a `request_id` for later review. No utterance content is stored — only the flag type, timestamp, and key identifier. |

## Design principles

**No suppression by default.** The system flags and warns; the application decides what to do with
the flag. This respects the fact that a term flagged as an insult in one community may be a neutral
descriptor in another.

**Context-aware.** Sensitivity rules are per-language-pack, not global. A word that is harmless in
`sw` (Swahili) may be sensitive in `tw` (Twi). The language detected by the Language service is
passed to Safety before evaluation.

**Not a content moderator.** ADARA is speech infrastructure. Safety protects the *platform* from
misuse, not end-users from each other. User-facing moderation is the application's responsibility.

## Integration

Other services include Safety as a library call (not an HTTP round-trip) on the hot path:

```python
from adara_safety import check

result = check(text=transcript, language="tw", context=meaning)
if result.flagged:
    response.warnings.append(result.warning)
```

The sensitivity data lives in `adara-intelligence/src/language/detection/packs/` — the same packs
that power language detection. Each pack's `sensitive_terms` section feeds Safety.

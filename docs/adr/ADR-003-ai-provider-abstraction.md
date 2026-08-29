# ADR-003: Provider interfaces

## Status

Accepted (foundation)

## Context

ADARA must grow from a small team to an AI lab without rewriting the org every quarter.

## Decision

LLM, embeddings, speech, translation, rerank, and context are protocols. Mocks exist for local dev. No vendor SDK in the core domain layer.

## Consequences

Documented in ADARA-ARCHITECTURE.md. Revisit when a team actually hits the limitation.

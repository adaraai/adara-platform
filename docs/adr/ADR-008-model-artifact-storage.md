# ADR-008: Weights outside Git

## Status

Accepted (foundation)

## Context

ADARA must grow from a small team to an AI lab without rewriting the org every quarter.

## Decision

Register metadata in adara-ai; store blobs in object storage. CI never downloads full weights.

## Consequences

Documented in ADARA-ARCHITECTURE.md. Revisit when a team actually hits the limitation.

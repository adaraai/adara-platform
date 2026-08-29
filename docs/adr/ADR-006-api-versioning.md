# ADR-006: URL versioning

## Status

Accepted (foundation)

## Context

ADARA must grow from a small team to an AI lab without rewriting the org every quarter.

## Decision

Public HTTP under /v1. Breaking changes require /v2. Stubs today return 501.

## Consequences

Documented in ADARA-ARCHITECTURE.md. Revisit when a team actually hits the limitation.

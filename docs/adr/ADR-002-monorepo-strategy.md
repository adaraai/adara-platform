# ADR-002: Start with pnpm + Python packages

## Status

Accepted (foundation)

## Context

ADARA must grow from a small team to an AI lab without rewriting the org every quarter.

## Decision

Nx can be adopted when the graph needs enforced module boundaries. Until then, no cross-service imports; packages/* is the shared layer.

## Consequences

Documented in ADARA-ARCHITECTURE.md. Revisit when a team actually hits the limitation.

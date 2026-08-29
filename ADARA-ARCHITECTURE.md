# ADARA architecture

**ADARA AI LAB** — Teaching AI to understand Africa in its languages, its logic, and its lived reality.

Organization: [AI-Factory-AI](https://github.com/AI-Factory-AI)

## Company technical architecture

```
AFRICAN DATA → LANGUAGE → SPEECH → CONTEXT → MODELS → EVALUATION → SAFETY → API → SDK → PRODUCTS
```

## Repository strategy

Hybrid. `adara-platform` is the polyglot application monorepo. Intelligence, evals, SDK, research, datasets, docs, products, and infra are separate repositories when they need independent release, license, or permission boundaries.

Marketing site `adaraui` already exists and stays independent.

## Data flow

Ingest (consent-first) → `adara-datasets` metadata → object storage → `adara-ai` training/inference jobs → artifacts in a registry (not Git).

## AI flow (first vertical slice)

Voice in → speech → language detect → code-switch detect → context retrieve → LLM → safety → text (optional TTS).

The first slice may use **external/open models**. We are proving the pipeline, not claiming a foundation model.

## Service boundaries

`apps/api` is the developer-facing HTTP surface (OpenAPI). `services/*` will own speech/language/context/inference/evaluation/safety. Shared code only through `packages/*`.

## Security

Private repos, no secrets in Git, SECURITY.md everywhere, Dependabot + secret scanning. Least privilege for cloud roles (see `adara-infrastructure`).

## Research workflow

`research/<name>` branches and `adara-research` projects. Promotion to production is an explicit API/model-registry change, not a notebook import.

## Deployment

`adara-infrastructure` holds Terraform and environment folders. This repo's `docker-compose.yml` is local development only.

## Ownership

See `docs/teams.md`. Until teams exist, org admins own everything.

## Open-source strategy

Apache-2.0 for SDK, evals, docs, and public intelligence interfaces. Proprietary for platform, training ops, infra, and products. Datasets use per-card licenses.

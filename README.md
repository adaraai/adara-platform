# adara-platform

Central ADARA application and service platform (polyglot monorepo).

## Status

**Alpha (local API stubs only)**

Classification: `CORE` · Visibility: `private` · License: `Proprietary`

## Overview

Apps (`web`, `api`, `developer-portal`, `admin`) and services (`gateway`, `inference`, `context`, `language`, `speech`, `evaluation`, `safety`) share packages. The HTTP contract is `docs/openapi/adara-v1.yaml`. Intelligence implementations live in sibling repos and will be wired through providers — they are not copied here.

## Why this exists

One place for product engineering that must ship together, without turning the whole company into a single app.

## Architecture

See `docs/architecture/repository-map.md` and `ADARA-ARCHITECTURE.md`. Nx is not required on day one; package boundaries are documented in ADR-002.

```
            AFRICAN DATA
                 ↓
          LANGUAGE / SPEECH / CONTEXT
                 ↓
              MODELS
                 ↓
            EVALUATION + SAFETY
                 ↓
               API → SDK → PRODUCTS
```

See [repository map](https://github.com/AI-Factory-AI/adara-platform/blob/main/docs/architecture/repository-map.md) in `adara-platform`.

## Installation

```bash
make compose-up   # postgres + redis
make api          # development HTTP stubs on :8080
make test
```

Requires Docker for databases. The API runs with Node 20 and does not need Postgres for `/v1/health`.


## Usage

`GET /v1/health` returns ok. `POST /v1/*` intelligence routes return **501** until services exist. That is intentional.

## Development

Use Conventional Commits and pull requests against `main`. See CONTRIBUTING.md.

## Testing

Run the repository's documented test command. Do not run expensive training on every PR.

## Roadmap

Documented in this README's status and in `adara-platform/ADARA-ARCHITECTURE.md`. Do not treat planned work as shipped.

## Contributing

See CONTRIBUTING.md and the organization profile.

## Security

See SECURITY.md. Never commit secrets, model weights, or private datasets.

## License

Proprietary

Master architecture: [ADARA-ARCHITECTURE.md](./ADARA-ARCHITECTURE.md)

# developer-portal

**Owner:** ADARA Platform · **Status:** Planned. The public API developer experience.

## What this is

The Developer Portal is where external developers sign up for ADARA, manage their API keys, read
documentation, and monitor their usage.

It is the public-facing counterpart to `apps/admin`, which is for the ADARA team only.

## Sections

| Section | Description |
|---|---|
| **Getting started** | Language-specific quickstarts (Python, JavaScript, curl). Matches `adara-platform/docs/quickstart.md`. |
| **API reference** | Rendered from `adara-platform/docs/openapi/adara-v1.yaml`. Every route, every parameter, interactive *Try it* panel. |
| **Keys** | Create and revoke personal API keys. One key per project is the recommended pattern. |
| **Usage** | Requests per day, audio seconds transcribed, rate limit headroom. 30-day rolling window. |
| **Language coverage** | Which languages are live today and what their quality scores are. Updated automatically from the Evaluation service. |
| **Changelog** | Every API version bump, new language, and deprecated field. Machine-readable so SDK users can subscribe. |

## URL structure (planned)

```
https://developers.adara.ai/
    /docs/quickstart
    /docs/api-reference
    /docs/sdks/python
    /docs/sdks/javascript
    /keys
    /usage
    /languages
    /changelog
```

## Stack (planned)

Next.js App Router · Fumadocs or Mintlify for the docs rendering · Deployed on Vercel.

The API reference is rendered directly from the OpenAPI YAML — no manual copy. When the spec
changes, the portal picks it up automatically on the next deploy.

## SDK documentation

The portal links to the `adara-sdk` repository and embeds the quickstart examples from
`adara-sdk/examples/`. The README in `adara-sdk/README.md` is the canonical SDK doc; the portal
renders it rather than maintaining a separate copy.

## Relationship to `adara-sdk`

The Developer Portal does not ship an SDK — it documents one. The SDK itself lives in `adara-sdk/`
and is published to PyPI (`adara-sdk`) and npm (`@adara/sdk`). The portal links to those packages,
not to a private repository URL.

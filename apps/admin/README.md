# admin

**Owner:** ADARA Platform — Internal · **Status:** Planned. Not public.

## What this is

The Admin app is the internal operations dashboard for the ADARA team. It is never exposed to
customers or developers.

| Section | Purpose |
|---|---|
| **Keys** | Create, revoke, and rotate API keys. View per-key usage graphs. |
| **Evaluation runs** | Trigger benchmark runs, compare WER/CER before and after a model swap. |
| **Knowledge packs** | Upload new context pack JSON, preview resolved concepts, publish or roll back. |
| **Language coverage** | Map view of which languages are live, interface-only, or in evaluation. |
| **Audit log** | Every key creation, revocation, and policy-flag event, with request IDs. |
| **Service health** | Live status of door, speech, language, context, inference. Latency histograms. |

## Access

Admin runs on an internal network only. No public DNS record. Authentication is ADARA team SSO
(planned: Clerk or a self-hosted identity provider).

## Stack (planned)

Next.js App Router · shadcn/ui · Recharts for graphs · deployed on an internal host, not on Vercel.

## Not the developer portal

The developer portal (`apps/developer-portal`) is public-facing — for API customers to manage
their own keys and read docs. Admin is for the ADARA team only.

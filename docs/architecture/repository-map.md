# Repository map

```
                ADARA AI LAB
                     │
          ┌──────────┴──────────┐
          │                     │
      RESEARCH               PLATFORM
          │                     │
   ┌──────┼──────┐       ┌──────┼──────┐
   │      │      │       │      │      │
 EVALS  DATA   MODELS   SPEECH LANGUAGE CONTEXT
                          │       │       │
                          └───────┼───────┘
                                  │
                              ADARA API
                                  │
                               ADARA SDK
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
             VOICE             TRADER             AGRI / EDUCATION
```

## Dependency rule

```
DATA → AI → INTELLIGENCE → PLATFORM → SDK → PRODUCTS
```

`adara-voice` must not query `adara-ai` databases. It calls the ADARA API.

## Existing public site

[AI-Factory-AI/adaraui](https://github.com/AI-Factory-AI/adaraui) is the marketing site. Do not fold it into this monorepo until there is a reason.

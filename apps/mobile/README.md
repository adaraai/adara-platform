# @adara/mobile

Adara's React Native client. Voice-first assistant for African languages.

## Status

**Alpha (design system + screens; intelligence routes still return 501)**

Classification: `CORE` · Visibility: `private` · License: `Proprietary`

## Overview

Expo + expo-router + NativeWind. The app talks to `apps/api` over the contract
in `docs/openapi/adara-v1.yaml`. Intelligence lives in `services/*` and is not
implemented yet, so `POST /v1/*` answers 501 — the UI surfaces that honestly
rather than faking a reply.

## Why this exists

The first vertical slice needs a real surface: voice in → speech → language
detect → context → LLM → safety → text out. This is that surface.

## Architecture

```
app/                 expo-router routes (file = screen)
  (tabs)/            home · sessions · chats · settings
  chat/[id].tsx      smart chat thread
  voice.tsx          full-screen voice capture
src/theme/           JS mirror of the design tokens + elevation + fonts
src/components/      the component kit (Screen, Card, Button, Orb, …)
src/lib/             api client, seed content, haptics, cn()
global.css           design tokens as CSS variables (light + dark)
tailwind.config.js   semantic scale built on those variables
```

### Design system

`global.css` is the source of truth. Colors are `R G B` triplets behind
semantic names (`--primary`, `--surface`, `--text-secondary`), so Tailwind
opacity modifiers work (`bg-surface/60`) and dark mode is a variable swap
rather than a parallel set of classes.

`src/theme/tokens.ts` mirrors the same values in JS for the few things a
className cannot reach — gradient stops, SVG fills, blur tints, native
shadows. Keep the two in sync.

Type is Outfit for display and Inter for body, exposed as `variant` roles on
`<Text>` rather than raw sizes.

## Installation

```bash
npm install
npm start          # then press i / a, or scan with Expo Go
```

Point the app at a running API with `extra.adaraApiUrl` in `app.json`
(`http://localhost:8080` by default). On a physical device use your machine's
LAN address, not localhost.

## Usage

`make api` from the repository root serves the stubs the app reads.
`/v1/languages` and `/v1/health` return data; everything else returns 501.

## Development

Use Conventional Commits and pull requests against `main`. See CONTRIBUTING.md
at the repository root.

## Testing

```bash
npm run typecheck
```

## Roadmap

Wire voice capture to `/v1/speech/transcribe` and chat to
`/v1/context/generate` once `services/speech` and `services/context` exist.
Seed data in `src/lib/content.ts` is placeholder copy, not shipped capability.

## Security

Never commit API keys or recordings. See SECURITY.md at the repository root.

## License

Proprietary

Master architecture: [ADARA-ARCHITECTURE.md](../../../ADARA-ARCHITECTURE.md)

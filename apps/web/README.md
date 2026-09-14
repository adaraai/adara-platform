# @adara/web

**Owner:** ADARA Platform · **Package:** `@adara/web` · **Stack:** React 18 + Vite + Tailwind + shadcn/ui

The public web presence and authenticated browser client for ADARA. This is the marketing site,
developer landing page, and the web version of the voice product — all in one app.

**Live (marketing shell):** https://adaraui.vercel.app

---

## What this app covers

| Section | Path | Purpose |
|---|---|---|
| **Landing / Home** | `/` | Hero, product features, flag marquee, bento demos, testimonials, CTA |
| **Products** | `/products` | Speech STT, TTS, Understand, widget — the full ADARA menu |
| **API** | `/api` | Developer-facing API summary; links to `/v1/docs` on the Door |
| **Documentation** | `/docs` | SDK quickstart, language coverage, error reference |
| **Enterprise** | `/enterprise` | Healthcare, call centres, legal, biometrics use cases |
| **Government** | `/government` | Government and public-sector deployment |
| **Customers** | `/customers` | Case studies |
| **Learn** | `/learn` | Tutorials and integration guides |
| **News** | `/news` | Changelog and press |
| **Support** | `/support` | Contact and quota requests |
| **Sign in / Sign up** | `/login` `/signup` | Auth shell — connects to the key management backend |
| **Client dashboard** | `/dashboard` | API key management, usage graphs |
| **Admin dashboard** | `/admin` | Internal ops — ADARA team only |
| **Labeler dashboard** | `/labeler` | Data annotation interface for knowledge pack contributors |

---

## Running locally

```bash
cd adara-platform/apps/web
npm install
npm run dev
# → http://localhost:8080
```

> The Door runs separately on `:8080`. The web app calls it for live API data on the
> `/api` and `/docs` pages. Start the Door first if those pages need live data.

## Scripts

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production bundle → dist/
npm run preview   # Preview the production bundle locally
npm run lint      # ESLint
```

## Deploy (Vercel)

This app is a Vite SPA. Deploy **this folder** as the Vercel project root so the
framework, install, and output directory are detected correctly.

### New Vercel project (Git)

1. Import the `adara-platform` Git repository.
2. Set **Root Directory** to `apps/web`.
3. Leave the framework preset as **Vite** (`vercel.json` pins this).
4. Build command: `npm run build` · Output: `dist` · Install: `npm ci`.
5. Assign the production domain and deploy.

Pushing to `main` then deploys automatically. Unrelated monorepo changes are skipped
via `ignoreCommand` in `vercel.json`.

### CLI

From this folder (after `npx vercel link` with root `apps/web`):

```bash
cd adara-platform/apps/web
npx vercel --prod
```

`vercel.json` rewrites unknown paths to `index.html` so React Router deep links
(`/docs/...`, `/news/:slug`, etc.) work on refresh. Do not enable **Clean URLs** —
that setting breaks the `/index.html` rewrite.

---

## Structure

```
src/
├── components/
│   ├── client/          # Marketing and public pages
│   │   ├── showcase/    # Bento card demos (transcribe, chat, agent, code)
│   │   ├── Hero.tsx     # Landing hero with animated waveform
│   │   ├── FeaturesSection.tsx
│   │   ├── FlagMarquee.tsx   # African language flags scroll
│   │   └── ...
│   ├── admin/           # Admin dashboard components
│   ├── labelers/        # Labeler dashboard components
│   └── ui/              # shadcn/ui primitives (Button, Card, Input, Select…)
├── pages/               # React Router route components
├── hooks/               # use-is-visible, use-reduced-motion, use-offscreen-pause
├── data/                # Static data (news posts, etc.)
├── lib/                 # cn() utility
└── App.tsx              # Router config
```

---

## Relationship to other apps

| App | Relationship |
|---|---|
| `apps/mobile` | Same product, native form factor. Shares the session/turn model. |
| `apps/developer-portal` | The portal is planned as a separate Next.js app for the docs+key experience. Until it is built, `/api` and `/docs` here serve that role. |
| `apps/admin` | The admin dashboard UI here (`/admin`) is the scaffold; the real admin will move to `apps/admin` when it grows. |
| `services/door` | The web app calls Door endpoints directly for live API data (health, languages, docs). API key stays server-side — never in the bundle. |
| `services/voice-agent` | The web voice interface (planned) will call voice-agent on `:8081` via a server-side proxy, same as the mobile app. |

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build, HMR)
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **React Router v6** (client-side routing)
- **lucide-react** (icons)
- **next-themes** (dark/light mode)

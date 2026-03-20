# Niramoy Frontend

Frontend application for **Niramoy**, an OTC medicine marketplace with role-based experiences for customers, sellers, and admins.

## Project Purpose

This frontend provides:

- Public medicine browsing with filtering and details
- Customer journey: registration/login, cart, checkout, and order tracking
- Seller dashboard: profile, medicine management, and seller order management
- Admin dashboard: users, orders, medicines, categories, manufacturers, and reviews

## Live Links

- Frontend Live: `https://niramoy-two.vercel.app/`
- Backend Live: `https://niramoy-backend.onrender.com/`

## Key Features

- App Router architecture with route groups and fallback states
- Cookie-session auth integration with Better Auth backend
- Role-aware route protection via `src/proxy.ts`
- Server actions + server fetch layer for secure data flow
- Responsive UI for mobile, tablet, and desktop
- Shared loading, error, and not-found patterns

## Tech Stack

- Next.js `16`
- React `19`
- TypeScript
- Tailwind CSS `4`
- shadcn/ui + Radix UI
- Better Auth client
- Zod + `@t3-oss/env-nextjs` for env validation

## Project Structure

```text
niramoy-frontend/
├── src/
│   ├── app/
│   │   ├── (commonLayout)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── shop/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   ├── (dashboardLayout)/
│   │   │   ├── @seller/seller/
│   │   │   └── @admin/admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── actions/
│   ├── components/
│   │   ├── layout/
│   │   ├── modules/
│   │   ├── shared/
│   │   └── ui/
│   ├── services/
│   ├── lib/
│   ├── types/
│   ├── env.ts
│   └── proxy.ts
├── .env
├── .env.example
└── package.json
```

## Environment Setup

Create `.env` in the frontend root.

You can copy from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```env
NEXT_PUBLIC_API_URL=https://your-frontend-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
AUTH_URL=https://your-frontend-domain.com/api/auth
BACKEND_URL=https://your-backend-domain.com
```

Notes:

- `NEXT_PUBLIC_API_URL` should be the frontend origin for same-origin API/auth calls.
- `NEXT_PUBLIC_APP_URL` is the frontend URL used in auth callback flows.
- `AUTH_URL` should use frontend domain and `/api/auth` path.
- `BACKEND_URL` is used by Next.js rewrites to proxy `/api/*` to backend.

For Vercel production:

- Set all four variables in **Project Settings -> Environment Variables**.
- Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, and `AUTH_URL` to your Vercel domain.
- Set `BACKEND_URL` to `https://niramoy-backend.onrender.com`.

Google OAuth redirect URI:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-frontend-domain.com/api/auth/callback/google`

## Install, Run, Build

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build production bundle

```bash
npm run build
```

4. Start production server locally

```bash
npm run start
```

## npm Scripts

- `npm run dev` -> start development server
- `npm run build` -> production build
- `npm run start` -> run production build
- `npm run lint` -> run ESLint

## Deployment Readiness Checklist

- Production build passes (`npm run build`)
- No hardcoded backend localhost URLs in source
- Env variables configured in Vercel
- Backend CORS `FRONTEND_URL` includes deployed frontend domain
- Auth/session flow validated in deployed environment

## License

This frontend is part of the Niramoy project repository.

# Our Sunnah — Monorepo

Islamic lifestyle brand-showcasing e-commerce platform.

## Structure

```
apps/
  web/    -> Next.js 15 (App Router) - storefront + auth/BFF routes
  api/    -> Express - core business logic, REST API
packages/
  database/    -> Prisma schema + client (PostgreSQL)
  validation/  -> Shared Zod schemas (used by both web & api)
  config/      -> Shared tsconfig base
```

## Getting Started

```bash
pnpm install

# copy env files
cp apps/api/.env.example apps/api/.env

# generate prisma client & run migrations
pnpm db:generate
pnpm db:migrate

# run everything
pnpm dev

# or run individually
pnpm dev:web
pnpm dev:api
```

## Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, Prisma, PostgreSQL
- Validation: Zod (shared schemas)
- Auth: JWT (access + refresh), Google/Facebook/Apple social login
- Payments: SSLCommerz
- Media: Cloudinary
- Push Notifications: Firebase Cloud Messaging

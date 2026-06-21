# Our Sunnah — Monorepo

Islamic lifestyle brand-showcasing e-commerce platform.

Built as a **pnpm + turborepo monorepo** with 3 separated concerns:

```
apps/
  web/    -> Next.js 15 (App Router) - storefront UI, port 3000
  api/    -> Express - business logic, REST API, port 5000
packages/
  database/    -> Prisma schema + client (PostgreSQL)
  validation/  -> Shared Zod schemas (used by both web & api)
  config/      -> Shared tsconfig base
```

`web` never talks to the database directly — everything goes through `api`.
`database` and `validation` are shared so logic/types aren't duplicated.

---

## First-time setup

```bash
# 1. install all dependencies (run once at the root, NOT inside apps/packages)
pnpm install

# 2. create env files (each one is separate, see "Env files" section below)
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env

# 3. fill in real values in both .env files (DATABASE_URL, JWT secrets, etc.)

# 4. generate Prisma client + run migrations
pnpm db:generate
pnpm db:migrate

# 5. run everything
pnpm dev
```

---

## Env files (important — there are TWO)

Prisma CLI looks for `.env` inside the package that contains `schema.prisma`.
Express looks for `.env` inside its own app folder. So both need `DATABASE_URL`:

| File | Used by | Required vars |
|---|---|---|
| `apps/api/.env` | Express server | `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `CLIENT_URL` |
| `packages/database/.env` | Prisma CLI (migrate/studio/generate) | `DATABASE_URL` |

Keep `DATABASE_URL` identical in both files.

Generate strong JWT secrets:
```bash
openssl rand -hex 32
```

---

## Daily commands (run from project root)

```bash
pnpm dev          # runs web + api together
pnpm dev:web      # only Next.js frontend
pnpm dev:api      # only Express backend

pnpm build        # build everything
pnpm lint         # lint everything
pnpm typecheck    # typecheck everything

pnpm db:generate  # regenerate Prisma client (run after pulling schema changes)
pnpm db:migrate   # create + apply a new migration (run after pulling schema changes)
pnpm db:studio    # open Prisma Studio (visual DB browser) at localhost:5555
```

---

## Installing a new package

Always install from the **root**, targeting the right workspace with `--filter`.
Never `cd` into a folder and run plain `pnpm install <pkg>`.

```bash
# add a dependency to the frontend only
pnpm --filter web add <package-name>

# add a dependency to the backend only
pnpm --filter api add <package-name>

# add a dev dependency
pnpm --filter api add -D <package-name>

# add to a shared package (validation/database)
pnpm --filter @our-sunnah/database add <package-name>

# add something needed by EVERY workspace (rare — e.g. typescript)
pnpm add -w -D <package-name>
```

After adding any package, re-run `pnpm install` once at the root if needed.

---

## Adding shadcn/ui components (frontend)

Run from inside `apps/web`:

```bash
cd apps/web
pnpm dlx shadcn@latest add button
cd ../..
```

Components land in `apps/web/src/components/ui/`. Existing design tokens
(colors, fonts) in `globals.css` and `tailwind.config.js` should be reused —
don't introduce a separate color palette for new shadcn components.

---

## When you pull new changes

```bash
git pull origin development
pnpm install          # in case package.json changed
pnpm db:generate       # in case prisma schema changed
pnpm db:migrate        # in case new migrations were added
```

---

## Troubleshooting

**`Environment variable not found: DATABASE_URL`**
→ Missing `.env` in `packages/database/`. Prisma CLI only reads `.env` from
the folder containing `schema.prisma`, not from `apps/api/.env`.

**`P1010: User was denied access on the database`**
→ Wrong Postgres username/password, or the database doesn't exist yet, or
the role has no privileges on it. Check your local Postgres credentials.

**Port already in use (3000 or 5000)**
→ Something else is already running on that port. Stop it, or change
`PORT` in `apps/api/.env` (and update `CLIENT_URL` accordingly).

**Prisma Client out of sync after pulling**
→ Run `pnpm db:generate` again.

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Validation**: Zod (shared schemas between web & api)
- **Auth**: JWT (access + refresh tokens), Google/Facebook/Apple social login
- **Payments**: SSLCommerz
- **Media storage**: Cloudinary
- **Push Notifications**: Firebase Cloud Messaging

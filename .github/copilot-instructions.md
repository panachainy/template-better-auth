# Better Auth + Hono Template - AI Agent Instructions

## Architecture Overview

This is a **Bun-based authentication template** using Better Auth with Hono framework and PostgreSQL. The main server (`index.ts`) is a Hono app that mounts Better Auth handlers at `/api/v1/auth/*` and uses middleware for session/CORS management.

**Key integration pattern**: Better Auth is integrated with Hono by passing `c.req.raw` (the native Request object) directly to `auth.handler()`. Session context is injected via middleware using `auth.api.getSession()` and stored in Hono context variables.

## Runtime & Tooling

- **Runtime**: Bun v1.3.3+ (NOT Node.js). Use `bun` commands, not `npm`/`yarn`
- **Package manager**: `bun install`, `bun add`, `bun remove`
- **Code quality**: Biome (NOT ESLint/Prettier) - use `bun run check:fix` to format/lint
- **Dev workflow**: `bun run dev` for hot-reload, `bun start` for production-like run

## Configuration Pattern

All config is centralized in `lib/config.ts` using **Zod schemas** for validation and transformation:
- Environment variables are parsed and validated at startup (fails fast if misconfigured)
- CSV strings (e.g., `CORS_ORIGIN`, `TRUSTED_ORIGINS`) are auto-split into arrays
- Sensitive values are never logged (see safe logging pattern in `index.ts`)

**When adding new env vars**: Update both the schema in `config.ts` and `.env.example`

## Database Workflow

1. **Start PostgreSQL**: `docker compose up -d` (uses `compose.yml`, not `docker-compose.yml`)
2. **Run migrations**: `bunx @better-auth/cli@latest migrate --config ./lib/auth.ts`
   - This uses Better Auth's CLI to sync database schema from `lib/auth.ts` configuration
   - Run after any changes to auth plugins or configuration

## Logging Standards

Use structured logging via Pino with child loggers:
```typescript
import { createLogger } from './lib/logger'
const logger = createLogger('module-name')
logger.info({ context: data }, 'Message')
```

**Never log secrets**: See `index.ts` debug block for the safe config logging pattern (replace passwords/secrets with `'***'`)

## Auth Plugin Configuration

Better Auth plugins are configured in `lib/auth.ts`:
- `openAPI()` - Enables OpenAPI schema generation (viewable in debug mode)
- `anonymous()` - Guest users with auto-generated emails (`@my-app.local`)
- Account linking is enabled for LINE provider with `allowDifferentEmails: true`

**When adding auth features**: Modify `lib/auth.ts`, then run migrations. Social providers require `clientId`/`clientSecret` in config.

## Frontend Example

The `example/login/` directory contains a React + Vite app demonstrating:
- Better Auth client setup with `anonymousClient()` plugin
- OAuth flow (LINE) and anonymous login patterns
- Session management with `getSession()` and `signOut()`

**Note**: Frontend uses separate Vite dev server (different port than backend)

## Code Style (Biome)

- Single quotes, semicolons optional (ASI), trailing commas everywhere
- Arrow function parentheses always: `(x) => x` not `x => x`
- Excludes `example/` directory from linting (see `biome.json`)

## Common Tasks

- **Add API route**: Add to Hono app in `index.ts` after CORS middleware
- **Debug auth issues**: Set `IS_DEBUG_MODE=true` to see config and OpenAPI schema on startup
- **Check health**: `curl http://localhost:3000/healthz`
- **View logs**: All middleware logs request/response with duration

## Critical Files

- `lib/auth.ts` - Better Auth configuration (plugins, providers, database)
- `lib/config.ts` - Single source of truth for all configuration
- `index.ts` - Hono app with middleware chain and Better Auth mounting
- `compose.yml` - PostgreSQL container definition
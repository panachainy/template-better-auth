# template-better-auth

A template project for authentication using Better Auth with Hono framework.

## Features

- ✅ [Hono](https://hono.dev/) - Fast, lightweight web framework
- ✅ [Better Auth](https://www.better-auth.com/) - Type-safe authentication for TypeScript
- ✅ PostgreSQL database with Docker Compose
- ✅ LINE social authentication provider
- ✅ Biome for code quality and formatting
- ✅ Husky for Git hooks

## Getting Started

### Prerequisites

- Bun (v1.3.3+)
- Docker and Docker Compose

### Installation

1. Clone the repository
2. Install dependencies:

    ```bash
    bun install
    ```

3. Copy `.env.example` to `.env` and configure your environment variables

4. Start the PostgreSQL database:

    ```bash
    docker compose up -d
    ```

5. Run the server:

    ```bash
    bun start
    ```

The server will start on `http://localhost:3000`

### API Endpoints

- `GET /healthz` - Health check endpoint
- `/api/v1/auth/*` - Better Auth endpoints (sign-in, sign-up, etc.)

### Development

```bash
# Run in development mode with auto-reload
bun run dev

# Check code quality
bun run check

# Fix code quality issues
bun run check:fix

# Migrate sql
bunx @better-auth/cli@latest migrate --config ./lib/auth.ts
```

## Tasks

- [x] Initialize project with README, package.json, and configuration files
- [x] Set up [biome](https://biomejs.dev/linter/) for code quality and formatting
- [x] Find & Add API Framework (Hono)
- [x] Add Husky for Git hooks
- [x] Implement basic authentication functionality
- [x] Set up PostgreSQL database connection & compose.yml (docker compose)
- [x] Integrate [better-auth](https://github.com/your-org/better-auth) for authentication with Hono
- [ ] Try to use react tanstack for auth

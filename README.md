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

- Node.js (v20+) or Bun (v1.2.5+)
- Docker and Docker Compose

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Copy `.env.example` to `.env` and configure your environment variables

4. Start the PostgreSQL database:

```bash
docker compose up -d
```

5. Run the server:

```bash
npm start
# or
bun start
```

The server will start on `http://localhost:3000`

### API Endpoints

- `GET /` - Health check endpoint
- `/api/auth/*` - Better Auth endpoints (sign-in, sign-up, etc.)

### Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run linter
npm run lint

# Run formatter
npm run format

# Check code quality
npm run check
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

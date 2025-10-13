export interface ServerConfig {
  PORT: number
  CORS_ORIGIN: string
  LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
}

export interface BetterAuthConfig {
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  LINE_CLIENT_ID: string
  LINE_CLIENT_SECRET: string
}

export interface PostgresConfig {
  POSTGRES_USER: string
  POSTGRES_PASSWORD: string
  POSTGRES_DB: string
  POSTGRES_HOST: string
  POSTGRES_PORT: number
}

export interface AppConfig {
  server: ServerConfig
  betterAuth: BetterAuthConfig
  postgres: PostgresConfig
}

export const config: AppConfig = {
  server: {
    PORT: Number(process.env.PORT) || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    LOG_LEVEL: (process.env.LOG_LEVEL as ServerConfig['LOG_LEVEL']) || 'info',
  },
  betterAuth: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
    LINE_CLIENT_ID: process.env.LINE_CLIENT_ID || '',
    LINE_CLIENT_SECRET: process.env.LINE_CLIENT_SECRET || '',
  },
  postgres: {
    POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || 'postgres',
    POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT) || 5432,
  },
}

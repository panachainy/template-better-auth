import { z } from 'zod'

const serverConfigSchema = z.object({
  PORT: z.number().positive(),
  CORS_ORIGIN: z
    .string()
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  isDebugMode: z.boolean().default(false),
})

const betterAuthConfigSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  LINE_CLIENT_ID: z.string().min(1),
  LINE_CLIENT_SECRET: z.string().min(1),
  TRUSTED_ORIGINS: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((origin) => origin.trim()) : [],
    ),
})

const postgresConfigSchema = z.object({
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.number().positive(),
})

const appConfigSchema = z.object({
  server: serverConfigSchema,
  betterAuth: betterAuthConfigSchema,
  postgres: postgresConfigSchema,
})

type ServerConfig = z.infer<typeof serverConfigSchema>
type AppConfig = z.infer<typeof appConfigSchema>
type AppConfigInput = z.input<typeof appConfigSchema>

const rawConfig: AppConfigInput = {
  server: {
    PORT: Number(process.env.PORT) || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    LOG_LEVEL: (process.env.LOG_LEVEL as ServerConfig['LOG_LEVEL']) || 'info',
    isDebugMode: process.env.IS_DEBUG_MODE === 'true',
  },
  betterAuth: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
    LINE_CLIENT_ID: process.env.LINE_CLIENT_ID || '',
    LINE_CLIENT_SECRET: process.env.LINE_CLIENT_SECRET || '',
    TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
  },
  postgres: {
    POSTGRES_USER: process.env.POSTGRES_USER || '',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || '',
    POSTGRES_HOST: process.env.POSTGRES_HOST || '',
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  },
}

export const config = appConfigSchema.parse(rawConfig) as AppConfig

import { z } from 'zod'

const serverConfigSchema = z.object({
  port: z.number().positive(),
  corsOrigin: z
    .string()
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  logLevel: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  isDebugMode: z.boolean().default(false),
})

const betterAuthConfigSchema = z.object({
  secret: z.string().min(1),
  url: z.string().url(),
  lineClientId: z.string().min(1),
  lineClientSecret: z.string().min(1),
  trustedOrigins: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((origin) => origin.trim()) : [],
    ),
  lineCallbackUrl: z.string().optional(),
  lineScopes: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((scope) => scope.trim()) : undefined,
    ),
})

const postgresConfigSchema = z.object({
  user: z.string().min(1),
  password: z.string().min(1),
  db: z.string().min(1),
  host: z.string().min(1),
  port: z.number().positive(),
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
    port: Number(process.env.PORT) || 3000,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    logLevel: (process.env.LOG_LEVEL as ServerConfig['logLevel']) || 'info',
    isDebugMode: process.env.IS_DEBUG_MODE === 'true',
  },
  betterAuth: {
    secret: process.env.BETTER_AUTH_SECRET || '',
    url: process.env.BETTER_AUTH_URL || '',
    lineClientId: process.env.LINE_CLIENT_ID || '',
    lineClientSecret: process.env.LINE_CLIENT_SECRET || '',
    trustedOrigins: process.env.TRUSTED_ORIGINS,
    lineCallbackUrl: process.env.LINE_CALLBACK_URL,
    lineScopes: process.env.LINE_SCOPES,
  },
  postgres: {
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    db: process.env.POSTGRES_DB || '',
    host: process.env.POSTGRES_HOST || '',
    port: Number(process.env.POSTGRES_PORT),
  },
}

export const config = appConfigSchema.parse(rawConfig) as AppConfig

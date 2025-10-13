import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { config } from './config'
import { createLogger } from './logger'

const logger = createLogger('auth')

logger.info('Initializing authentication module')

export const auth = betterAuth({
  socialProviders: {
    line: {
      clientId: config.betterAuth.LINE_CLIENT_ID,
      clientSecret: config.betterAuth.LINE_CLIENT_SECRET,
      // Optional: override redirect if needed
      // redirectURI: "https://your.app/api/auth/callback/line",
      // scopes are prefilled: ["openid","profile","email"]. Append if needed
    },
  },
  database: new Pool({
    host: config.postgres.POSTGRES_HOST,
    port: config.postgres.POSTGRES_PORT,
    database: config.postgres.POSTGRES_DB,
    user: config.postgres.POSTGRES_USER,
    password: config.postgres.POSTGRES_PASSWORD,
  }),
})

logger.info('Authentication module initialized successfully')

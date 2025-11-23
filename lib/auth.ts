import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { config } from './config'
import { createLogger } from './logger'

const logger = createLogger('auth')

logger.info('Initializing authentication module')

export const auth = betterAuth({
  socialProviders: {
    line: {
      clientId: config.betterAuth.lineClientId,
      clientSecret: config.betterAuth.lineClientSecret,
      ...(config.betterAuth.lineCallbackUrl && {
        redirectURI: config.betterAuth.lineCallbackUrl,
      }),
      // scopes are prefilled: ["openid","profile","email"]. Append if needed
    },
  },
  trustedOrigins: config.betterAuth.trustedOrigins,
  database: new Pool({
    host: config.postgres.host,
    port: config.postgres.port,
    database: config.postgres.db,
    user: config.postgres.user,
    password: config.postgres.password,
  }),
})

logger.info('Authentication module initialized successfully')

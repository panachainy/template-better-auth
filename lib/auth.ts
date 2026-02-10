import { betterAuth } from 'better-auth'
import { anonymous, oidcProvider, openAPI } from 'better-auth/plugins'
import { Pool } from 'pg'
import { config } from './config'
import { createLogger } from './logger'

const logger = createLogger('auth')

logger.info('Initializing authentication module')

export const auth = betterAuth({
  plugins: [
    openAPI(),
    oidcProvider({
      loginPage: '/login', // Required for OIDC provider
    }),
    anonymous({
      // generate a dummy email for the anonymous user
      emailDomainName: 'my-app.local',
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // called when the anonymous user later links a social login (e.g. LINE)
        // you can merge accounts or update email here
        logger.info(
          `Anonymous user linked to social account: anonymousUserId=${anonymousUser.user.id}, newUserId=${newUser.user.id}`,
        )
      },
      // disableDeleteAnonymousUser: true,
    }),
  ],
  account: {
    accountLinking: {
      enabled: config.betterAuth.accountLinkingEnabled,
      allowDifferentEmails:
        config.betterAuth.accountLinkingAllowDifferentEmails,
      trustedProviders: config.betterAuth.accountLinkingTrustedProviders,
    },
  },
  baseURL: config.betterAuth.url,
  basePath: config.betterAuth.basePath,
  socialProviders: {
    line: {
      clientId: config.betterAuth.lineClientId,
      clientSecret: config.betterAuth.lineClientSecret,
      ...(config.betterAuth.lineCallbackUrl && {
        redirectURI: config.betterAuth.lineCallbackUrl,
      }),
      ...(config.betterAuth.lineScopes && {
        scope: config.betterAuth.lineScopes,
      }),
    },
    ...(config.betterAuth.githubClientId &&
      config.betterAuth.githubClientSecret && {
        github: {
          clientId: config.betterAuth.githubClientId,
          clientSecret: config.betterAuth.githubClientSecret,
        },
      }),
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

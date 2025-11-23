import { betterAuth } from "better-auth";
import { anonymous, openAPI } from "better-auth/plugins";
import { Pool } from "pg";
import { config } from "./config";
import { createLogger } from "./logger";

const logger = createLogger("auth");

logger.info("Initializing authentication module");

export const auth = betterAuth({
  plugins: [
    openAPI(),
    anonymous({
      // generate a dummy email for the anonymous user
      emailDomainName: "my-app.local",
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // called when the anonymous user later links a social login (e.g. LINE)
        // you can merge accounts or update email here
        logger.info(
          `Anonymous user linked to social account: anonymousUserId=${anonymousUser.user.id}, newUserId=${newUser.user.id}`
        );
      },
    }),
  ],
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true, // but this doesn’t bypass email requirement fully
      trustedProviders: ["line"],
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
});

logger.info("Authentication module initialized successfully");

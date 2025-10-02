import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
  socialProviders: {
    line: {
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
      // Optional: override redirect if needed
      // redirectURI: "https://your.app/api/auth/callback/line",
      // scopes are prefilled: ["openid","profile","email"]. Append if needed
    },
  },
  database: new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    database: process.env.POSTGRES_DB || "better_auth",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
  }),
})

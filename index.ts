import type { Session, User } from 'better-auth/types'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import { config } from './lib/config'
import { createLogger } from './lib/logger'

const logger = createLogger('server')

type Variables = {
  user: User | null
  session: Session | null
}

const app = new Hono<{ Variables: Variables }>()

logger.info('Initializing Hono application')

// Request logging middleware
app.use('*', async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path

  logger.info(`Incoming request: ${method} ${path}`)

  await next()

  const duration = Date.now() - start
  logger.info(
    `Request completed: ${method} ${path} - ${c.res.status} (${duration}ms)`,
  )
})

// Configure CORS for authentication routes
app.use(
  '/api/v1/auth/*',
  cors({
    origin: config.server.corsOrigin,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
)

// Middleware to add session and user context
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set('user', session ? session.user : null)
  c.set('session', session ? session.session : null)

  return next()
})

// Mount the Better Auth handler
app.on(['POST', 'GET'], '/api/v1/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// Health check route
app.get('/healthz', (c) => {
  logger.info('Health check requested')
  return c.json({ status: 'ok', message: 'Better Auth with Hono is running!' })
})

if (config.server.isDebugMode) {
  const safeConfig = {
    ...config,
    betterAuth: {
      ...config.betterAuth,
      secret: '***',
      lineClientSecret: '***',
    },
    postgres: {
      ...config.postgres,
      password: '***',
    },
  }
  logger.info({ config: safeConfig }, 'Config')

  const schema = await auth.api.generateOpenAPISchema()
  console.log(schema)
}

const port = config.server.port
logger.info(`Server is running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}

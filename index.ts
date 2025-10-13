import type { Session, User } from 'better-auth/types'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
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
  '/api/auth/*',
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
)

// Mount the Better Auth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// Middleware to add session and user context
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set('user', session ? session.user : null)
  c.set('session', session ? session.session : null)
  return next()
})

// Health check route
app.get('/healthz', (c) => {
  logger.info('Health check requested')
  return c.json({ status: 'ok', message: 'Better Auth with Hono is running!' })
})

const port = parseInt(process.env.PORT || '3000', 10)
logger.info(`Server is running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}

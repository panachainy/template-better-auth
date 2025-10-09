import pino from 'pino'

// Create a pino logger instance with basic configuration
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
})

// Export a function to create child loggers with additional context
export function createLogger(name: string) {
  return logger.child({ name })
}

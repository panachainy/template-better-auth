import { logger } from './lib/logger'

// Basic logging example
logger.info('Application started via Bun!')

// Example of logging with additional data
logger.info({ env: process.env.NODE_ENV || 'development' }, 'Environment info')

// Example of different log levels
logger.debug('This is a debug message')
logger.warn('This is a warning message')

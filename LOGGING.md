# Pino Logger Integration

This project now uses [Pino](https://github.com/pinojs/pino) for logging, replacing the basic `console.log` statements.

## Installation

After pulling the changes, run:

```bash
bun install
```

This will install the new dependencies:
- `pino` - Fast and low overhead Node.js logger
- `pino-pretty` - Pretty formatter for pino logs (for development)

## Usage

### Basic Logging

```typescript
import { logger } from './lib/logger'

logger.info('Application started!')
logger.debug('Debug information')
logger.warn('Warning message')
logger.error('Error message')
```

### Logging with Structured Data

```typescript
logger.info({ userId: 123, action: 'login' }, 'User logged in')
```

### Creating Child Loggers with Context

For module-specific logging with additional context:

```typescript
import { createLogger } from './lib/logger'

const logger = createLogger('auth')
logger.info('Authentication initialized') // Will include "name: auth" in the log
```

## Configuration

The logger can be configured via environment variables:

- `LOG_LEVEL` - Set the minimum log level (default: 'info')
  - Options: 'trace', 'debug', 'info', 'warn', 'error', 'fatal'

Example:
```bash
LOG_LEVEL=debug bun run index.ts
```

## Examples in the Code

- `index.ts` - Shows basic logging, structured data logging, and different log levels
- `lib/auth.ts` - Shows usage of child logger with context

## Benefits of Pino

1. **Fast**: Pino is one of the fastest Node.js loggers
2. **Low overhead**: Minimal performance impact
3. **Structured logging**: JSON output by default, easier to parse and analyze
4. **Pretty printing**: Human-readable output in development with `pino-pretty`
5. **Child loggers**: Easy to add context to logs for different modules

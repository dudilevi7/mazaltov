const LOG_LEVELS = {
  INFO: 'info',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
} as const

const Logger = {
  info: (message: string, userId?: string) => {
    const fullMessage = `[${LOG_LEVELS.INFO}] ${message} ${userId ? `(user: ${userId})` : ''}`
    console.log(fullMessage)
  },
  error: (message: string, userId?: string) => {
    const fullMessage = `[${LOG_LEVELS.ERROR}] ${message} ${userId ? `(user: ${userId})` : ''}`
    console.error(fullMessage)
  },
  warn: (message: string, userId?: string) => {
    const fullMessage = `[${LOG_LEVELS.WARN}] ${message} ${userId ? `(user: ${userId})` : ''}`
    console.warn(fullMessage)
  },
  debug: (message: string, userId?: string) => {
    const fullMessage = `[${LOG_LEVELS.DEBUG}] ${message} ${userId ? `(user: ${userId})` : ''}`
    console.debug(fullMessage)
  },
}

export default Logger

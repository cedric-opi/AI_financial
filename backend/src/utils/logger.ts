export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private level: LogLevel

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (level < this.level) return

    const timestamp = new Date().toISOString()
    const levelName = LogLevel[level]
    const logMessage = `[${timestamp}] ${levelName}: ${message}`

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, ...args)
        break
      case LogLevel.INFO:
        console.info(logMessage, ...args)
        break
      case LogLevel.WARN:
        console.warn(logMessage, ...args)
        break
      case LogLevel.ERROR:
        console.error(logMessage, ...args)
        break
    }
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args)
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args)
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args)
  }

  error(message: string, error?: Error, ...args: any[]) {
    if (error) {
      this.log(LogLevel.ERROR, `${message}: ${error.message}`, error.stack, ...args)
    } else {
      this.log(LogLevel.ERROR, message, ...args)
    }
  }
}

export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
)
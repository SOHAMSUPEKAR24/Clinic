type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  action: string
  userId?: string
  details?: any
  error?: any
  timestamp: string
}

class Logger {
  private formatLog(entry: LogEntry) {
    const timestamp = new Date().toISOString()
    const logStr = `[${timestamp}] [${entry.level.toUpperCase()}] Action: ${entry.action} | User: ${entry.userId || 'System'}`
    const detailsStr = entry.details ? `\nDetails: ${JSON.stringify(entry.details)}` : ''
    const errorStr = entry.error ? `\nError: ${entry.error instanceof Error ? entry.error.stack : JSON.stringify(entry.error)}` : ''
    return `${logStr}${detailsStr}${errorStr}`
  }

  info(action: string, details?: any, userId?: string) {
    console.log(this.formatLog({ level: 'info', action, details, userId, timestamp: new Date().toISOString() }))
  }

  warn(action: string, details?: any, userId?: string) {
    console.warn(this.formatLog({ level: 'warn', action, details, userId, timestamp: new Date().toISOString() }))
  }

  error(action: string, error: any, userId?: string, details?: any) {
    console.error(this.formatLog({ level: 'error', action, error, details, userId, timestamp: new Date().toISOString() }))
  }
}

export const logger = new Logger()

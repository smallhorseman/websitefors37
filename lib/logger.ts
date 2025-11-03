type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = Record<string, unknown>

function safeStringify(obj: any) {
  try {
    return JSON.stringify(obj)
  } catch {
    return '[unserializable]'
  }
}

export function createLogger(scope: string) {
  function log(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
    const entry = {
      ts: new Date().toISOString(),
      level,
      scope,
      message,
      context: context || {},
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
    }
    // Emit structured JSON for ingestion by log platforms
    const line = safeStringify(entry)
    switch (level) {
      case 'debug':
      case 'info':
        console.log(line)
        break
      case 'warn':
        console.warn(line)
        break
      case 'error':
        console.error(line)
        break
    }
  }

  return {
    debug: (message: string, context?: LogContext) => log('debug', message, context),
    info: (message: string, context?: LogContext) => log('info', message, context),
    warn: (message: string, context?: LogContext) => log('warn', message, context),
    error: (message: string, context?: LogContext, err?: unknown) => log('error', message, context, err),
  }
}

export const logger = createLogger('app')

/**
 * Centralized logging utility for the extension
 * Only logs in development mode to avoid cluttering production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;

  constructor() {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    
    this.config = {
      enabled: isDev,
      minLevel: isDev ? 'debug' : 'error',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.formatMessage('debug', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.formatMessage('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.formatMessage('warn', message, ...args);
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    this.formatMessage('error', message, error, ...args);
  }
}

export const logger = new Logger();

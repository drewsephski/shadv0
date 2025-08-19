import { env } from '@/lib/validations/env';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

class Logger {
  private static instance: Logger;
  private logLevels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };
  private currentLevel: number;

  private constructor() {
    this.currentLevel = this.logLevels[env.NODE_ENV === 'production' ? 'info' : 'debug'];
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] <= this.currentLevel;
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (meta && Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  }

  public error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;
    
    const errorInfo = error ? { 
      message: error.message,
      stack: error.stack,
      ...meta 
    } : meta;
    
    console.error(this.formatMessage('error', message, errorInfo));
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    console.warn(this.formatMessage('warn', message, meta));
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    console.info(this.formatMessage('info', message, meta));
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    console.debug(this.formatMessage('debug', message, meta));
  }
}

export const logger = Logger.getInstance();

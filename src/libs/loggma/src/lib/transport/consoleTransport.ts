import * as winston from 'winston';
import { LogData, LogLevel } from '@nestjs-logger/shared/lib/types/logs';

// Define an interface for the log object structure
interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  data: LogData & {
    label?: string;
    error?: string;
    durationMs?: number;
    stack?: string;
    props?: Record<string, any>;
  };
}

enum LogColors {
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  pink = '\x1b[38;5;206m',
}

export default class ConsoleTransport {
  public static createColorize() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((log: unknown) => {
          // Cast the log to our defined interface
          const typedLog = log as LogEntry;
          const color = this.mapLogLevelColor(typedLog.level as LogLevel);
          const prefix = `${typedLog.data.label ? `[${typedLog.data.label}]` : ''}`;
          return `${this.colorize(color, prefix + '  -')} ${typedLog.timestamp}    ${
            typedLog.data.correlationId
              ? `(${this.colorize(LogColors.cyan, typedLog.data.correlationId)})`
              : ''
          } ${this.colorize(color, typedLog.level.toUpperCase())} ${
            typedLog.data.sourceClass
              ? `${this.colorize(LogColors.cyan, `[${typedLog.data.sourceClass}]`)}`
              : ''
          } ${this.colorize(
            color,
            typedLog.message + ' - ' + (typedLog.data.error ? typedLog.data.error : ''),
          )}${
            typedLog.data.durationMs !== undefined
              ? this.colorize(color, ' +' + typedLog.data.durationMs + 'ms')
              : ''
          }${
            typedLog.data.stack ? this.colorize(color, `  - ${typedLog.data.stack}`) : ''
          }${
            typedLog.data.props
              ? `\n  - Props: ${JSON.stringify(typedLog.data.props, null, 4)}`
              : ''
          }`;
        }),
      ),
    });
  }

  private static colorize(color: LogColors, message: string): string {
    return `${color}${message}\x1b[0m`;
  }

  private static mapLogLevelColor(level: LogLevel): LogColors {
    switch (level) {
      case LogLevel.Debug:
        return LogColors.blue;
      case LogLevel.Info:
        return LogColors.green;
      case LogLevel.Warn:
        return LogColors.yellow;
      case LogLevel.Error:
        return LogColors.red;
      case LogLevel.Fatal:
        return LogColors.magenta;
      case LogLevel.Emergency:
        return LogColors.pink;
      default:
        return LogColors.cyan;
    }
  }
}

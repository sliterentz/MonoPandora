// import { format } from 'winston';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LogData, LogLevel } from '../lib/types/logs';
import Logger, { LoggerBaseKey } from '../lib/interfaces/logger.interface';
import ContextStorageInterface, { ContextStorageInterfaceKey } from './interfaces/context-storage.interface';
import * as fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import * as dotenv from 'dotenv'

dotenv.config();

// const { combine, timestamp, label, printf } = format;

// const myFormat = printf(({ level, message, label, timestamp }) => {
//     return `${timestamp} ${label} [${level}]: ${message}`;
// });

moment.tz.setDefault("Asia/Jakarta");
// const today = moment();
// const fileFormat = today.format('YYYY-MM-DD');
// const timeFormat = today.format('YYYY-MM-DD HH:MM:SS');

// create log file if not exist
const logDirPath = process.env.LOG_DIR_NAME || '/logs';
const logDirectory = path.join(__dirname, logDirPath);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// const myCustomLevels = {
//     levels: {
//         error: 0,
//         warning: 1,
//         info: 2,
//         verbose: 3,
//         debug: 4,
//         silly: 5,
//         http: 6
//     },
//     colors: {
//         error: 'red',
//         warning: 'yellow',
//         info: 'green',
//         verbose: 'purple',
//         debug: 'blue',
//         silly: 'grey',
//         http: 'orange'
//     }
// };

@Injectable({ scope: Scope.TRANSIENT })
export class LoggmaService implements Logger {
  private organization: string = 'NextLevelGeek';
  private context: string = 'MonoPandoApp';
  private app: string = 'services';
  private sourceClass: string = 'defaultSourceClass';

    constructor(
      @Inject(LoggerBaseKey) private logger: Logger,
      private configService: ConfigService,
      @Inject(INQUIRER) parentClass: object,
      @Inject(ContextStorageInterfaceKey)
      private contextStorageService: ContextStorageInterface
    ) {
      // Set the source class from the parent class
      this.sourceClass = parentClass?.constructor?.name;

      // Set the organization, context and app from the environment variables
      this.organization = this.configService.get<string>('ORGANIZATION') ?? 'NextLevelGeek';
      this.context = this.configService.get<string>('CONTEXT') ?? 'MonoPandoApp';
      this.app = this.configService.get<string>('APP') ?? 'services';
    }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId:
        data?.correlationId || this.contextStorageService.getContextId(),
    };
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
};


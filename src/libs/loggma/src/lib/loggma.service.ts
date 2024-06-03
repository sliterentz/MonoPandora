import { createLogger, format, transports } from 'winston';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LogData, LogLevel } from '../lib/types/logs';
import Logger, { LoggerBaseKey } from '../lib/interfaces/logger.interface';
import ContextStorageInterface, { ContextStorageInterfaceKey } from './interfaces/context-storage.interface';
import * as fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import 'dotenv/config'

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${label} [${level}]: ${message}`;
});

moment.tz.setDefault("Asia/Jakarta");
const today = moment();
const fileFormat = today.format('YYYY-MM-DD');
const timeFormat = today.format('YYYY-MM-DD HH:MM:SS');

// create log file if not exist
const logDirectory = path.join(__dirname, process.env.LOG_DIR_NAME);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const myCustomLevels = {
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5,
        http: 6
    },
    colors: {
        error: 'red',
        warning: 'yellow',
        info: 'green',
        verbose: 'purple',
        debug: 'blue',
        silly: 'grey',
        http: 'orange'
    }
};

@Injectable({ scope: Scope.TRANSIENT })
export class LoggmaService implements Logger {
  private sourceClass: string;
  private organization: string;
  private context: string;
  private app: string;

    constructor(
      @Inject(LoggerBaseKey) private logger: Logger,
      configService: ConfigService,
      @Inject(INQUIRER) parentClass: object,
      @Inject(ContextStorageInterfaceKey)
      private contextStorageService: ContextStorageInterface
    ) {
      // Set the source class from the parent class
      this.sourceClass = parentClass?.constructor?.name;

      // Set the organization, context and app from the environment variables
      this.organization = configService.get<string>('ORGANIZATION');
      this.context = configService.get<string>('CONTEXT');
      this.app = configService.get<string>('APP');
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


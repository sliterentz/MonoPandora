import DailyRotateFile = require('winston-daily-rotate-file');
import * as dotenv from 'dotenv';
dotenv.config();

export default class FileTransport {
  public static create() {
    return new DailyRotateFile({
      dirname: 'logs',
      filename: 'log-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE,
      maxFiles: process.env.LOG_MAX_FILE,
    });
  }
}

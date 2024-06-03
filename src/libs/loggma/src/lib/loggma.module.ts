import { Global, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggmaService } from './loggma.service';
import Logger, {
  LoggerBaseKey,
  LoggerKey,
} from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import ConsoleTransport from '@nestjs-logger/shared/lib/transport/consoleTransport';
import FileTransport from '@nestjs-logger/shared/lib/transport/fileTransport';
import SlackTransport from '@nestjs-logger/shared/lib/transport/slackTransport';
import LoggmaServiceAdapter from '@nestjs-logger/shared/lib/loggmaService-adapter';
import { ConfigLoggmaService } from '@nestjs-logger/shared/config/config-loggma.service';
import WinstonLogger, { WinstonLoggerTransportsKey } from '@nestjs-logger/shared/lib/transport/winstonLogger';
import * as morgan from 'morgan';
import { LoggmaMorganMiddleware } from '@nestjs-logger/shared/lib/middlewares/loggma-morgan.middleware';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggmaService,
    },
    {
      provide: LoggmaServiceAdapter,
      useFactory: (logger: Logger) => new LoggmaServiceAdapter(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: (configService: ConfigLoggmaService) => {
        const transports = [];

        transports.push(ConsoleTransport.createColorize());
        transports.push(FileTransport.create());

        if (configService.isProduction) {
          if (configService.slackWebhookUrl) {
            transports.push(
              SlackTransport.create(configService.slackWebhookUrl),
            );
          }
        }

        return transports;
      },
      inject: [ConfigLoggmaService],
    },
    ],
  exports: [LoggerKey, LoggmaServiceAdapter],
})

export class LoggmaModule implements NestModule {
  constructor(
    @Inject(LoggerKey)
    private readonly logger: Logger,
    private configService: ConfigLoggmaService,
  ) {}

  public configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggmaMorganMiddleware)
    .forRoutes('*');
  }
}

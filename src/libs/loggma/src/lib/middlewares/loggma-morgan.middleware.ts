import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
// import { FastifyRequest, FastifyReply } from 'fastify';
import morgan from 'morgan';
import Logger, {
    LoggerBaseKey,
    LoggerKey,
  } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import { ConfigLoggmaService } from '@nestjs-logger/shared/config/config-loggma.service';

@Injectable()
export class LoggmaMorganMiddleware implements NestMiddleware {
    constructor(
        @Inject(LoggerKey)
        private readonly logger: Logger,
        private configService: ConfigLoggmaService,
      ) {}

  private stream = {
    write: (message: string) => {
        this.logger.debug(message, {
            sourceClass: 'RequestLogger',
          });
    },
  };

  private morganMiddleware = morgan(this.configService.isProduction ? 'combined' : 'dev', { stream: this.stream });

  use(req: any, res: any, next: (err?: any) => void): void {
    this.morganMiddleware(req, res, (err) => {
        if (err) {
          console.error(err);
        }
        next();
      });
  }
}

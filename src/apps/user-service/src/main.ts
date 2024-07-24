/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';


async function bootstrap() {
const CORS_OPTIONS = {
    origin: '*', // or '*' or whatever is required
  //   allowedHeaders: [
  //   'Access-Control-Allow-Origin',
  //   'Origin',
  //   'X-Requested-With',
  //   'Accept',
  //   'Content-Type',
  //   'Authorization',
  // ],
  // exposedHeaders: 'Authorization',
  credentials: true,
  // methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
};

  const logger = new Logger();
  const adapter = new FastifyAdapter();
  adapter.enableCors(CORS_OPTIONS);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

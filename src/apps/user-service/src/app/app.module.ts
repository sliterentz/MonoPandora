import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity as RefreshToken, UserEntity as User } from "@auth-lib";
import { dbdatasource } from '../typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "@auth-lib";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@auth-lib';
import { LoggmaModule } from '@nestjs-logger/shared/lib/loggma.module';
import { ConfigLoggmaModule } from '@nestjs-logger/shared/config/config-loggma.module';
import { ContextLoggmaModule } from '@nestjs-logger/shared/lib/context/context-loggma.module'

import { LoggmaMorganMiddleware } from '@nestjs-logger/shared/lib/middlewares/loggma-morgan.middleware';
import { UserRepository } from '@auth-lib';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbdatasource),
    TypeOrmModule.forFeature([User, RefreshToken, UserRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    LoggmaModule,
    ConfigLoggmaModule,
    ContextLoggmaModule
    ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggmaMorganMiddleware).forRoutes('*');
  }
}

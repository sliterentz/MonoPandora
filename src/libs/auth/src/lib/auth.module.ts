import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { TokenService } from './token.service';
import { JwtStrategy } from "./strategy/jwt.strategy";
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { AuthController } from './auth.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { SuperUserGuard } from './guards/super-user.guard';
import { Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module'
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

dotenv.config();

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>('ACCESS_JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env['MAIL_USERNAME'],
          pass: process.env['MAIL_PASSWORD'],
        },
      },
      defaults: {
        from: '"No Reply" <justdevops99@gmail.com>',
      },
      template: {
        dir: join(__dirname, "../views/email-templates"),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    RoleModule,
    PermissionModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, RefreshTokenStrategy, AuthService, JwtAuthGuard, Reflector, TokenService],
  exports: [AuthService, TokenService, PassportModule, JwtAuthGuard ],
})
export class AuthModule {}

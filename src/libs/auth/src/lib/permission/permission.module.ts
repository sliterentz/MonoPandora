import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionRepository, UserRepository } from '../repositories';
import { PermissionService } from './permission.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from '../token.service';
import { JwtStrategy } from "../strategy/jwt.strategy";
import { RefreshTokenStrategy } from '../strategy/refresh-token.strategy';
import { AuthService } from "../auth.service";
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { PermissionEntity as Permission } from '../entities';

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
    TypeOrmModule.forFeature([PermissionRepository, Permission, UserRepository]),
    UserModule,
    PassportModule
],
  controllers: [PermissionController],
  providers: [PermissionService, JwtStrategy, RefreshTokenStrategy, AuthService, JwtAuthGuard, Reflector, TokenService, PermissionRepository, UserRepository],
  exports: [TypeOrmModule, PermissionService, AuthService, PassportModule, JwtAuthGuard, UserRepository ],
})
export class PermissionModule {}

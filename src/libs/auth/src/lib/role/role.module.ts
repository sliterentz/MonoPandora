import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleRepository, UserRepository } from '../repositories';
import { RoleService } from './role.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from "../strategy/jwt.strategy";
import { RefreshTokenStrategy } from '../strategy/refresh-token.strategy';
import { AuthService } from "../auth.service";
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from '../token.service';
import { RoleEntity as Role } from '../entities';

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
    TypeOrmModule.forFeature([RoleRepository, Role, UserRepository]),
    UserModule,
    PassportModule
  ],
  controllers: [RoleController],
  providers: [RoleService, JwtStrategy, RefreshTokenStrategy, AuthService, JwtAuthGuard, Reflector, TokenService, RoleRepository, UserRepository],
  exports: [AuthService, RoleService, PassportModule, JwtAuthGuard ],
})
export class RoleModule {}

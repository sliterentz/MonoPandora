import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { JwtService} from '@nestjs/jwt';
import { UserSchema } from '../schemas/user.schema'
import { RefreshTokenSchema } from '../schemas/refresh-token.schema';
import { UserRepository, RefreshTokenRepository } from '../repositories';
// import { UserEntity as User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema, RefreshTokenSchema, UserRepository, RefreshTokenRepository])],
  controllers: [],
  providers: [UserService, JwtService, UserRepository, RefreshTokenRepository],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}

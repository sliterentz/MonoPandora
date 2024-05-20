import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service'
import { UserSchema } from '../schemas/user.schema';
// import { UserEntity as User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [],
  providers: [UserService],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}

import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { UserEntity as User } from '../entities';
import * as bcrypt from "bcrypt";
import { validate } from 'class-validator';
import { AuthModel } from "../models";
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    private saltRounds: number;
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private jwtService: JwtService,
) { this.saltRounds = 10; }

  async createUser(payload: AuthModel): Promise<User> {
      const hashPass = await bcrypt.hash(payload.password, this.saltRounds)

  const newUserData = {
        ...payload,
        password: hashPass,
  };
      const result = await this.userRepository.create(newUserData);

    return result;
}

// async updateUser(accessToken: string, userUpdateData: Partial<User>): Promise<UpdateResult> {
//   try {
//     const hasValidAccess = await this.jwtService.verifyAsync(accessToken, {
//       secret: 'kopitubrukhitam',
//     });

//     if(!hasValidAccess) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const userId = userUpdateData['id'];

//     return this.userRepository.update(userId, userUpdateData);
//   } catch(e) {
//     throw new UnauthorizedException(e);
//   }
// }

async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
}

async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneOrFail({
      where: {
        id: id
      }
    });
}

async findAll(): Promise<User[]> {
    return await this.userRepository.find();
}

async findByEmailWithPassword(email: string | undefined): Promise<User | null> {
    return await this.userRepository.findOne({
        where: {
            email,
        },
    });
}

  async findByConfirmToken(authConfirmToken: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        authConfirmToken,
      },
    });
  }

}

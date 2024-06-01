import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { UserEntity as User } from '../entities';
import { AuthModel } from "../models";
// import { JwtService } from '@nestjs/jwt';
import { UserRepository as UserRepo, RefreshTokenRepository as TokenRepo } from '../repositories';
import { IVerrifyConfirmForm } from '../types';

@Injectable()
export class UserService {
    private saltRounds: number;
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersRepository: UserRepo,
    private refreshTokenRepository : TokenRepo,
    // private jwtService: JwtService,
) { this.saltRounds = 10; }

  async createUser(payload: AuthModel): Promise<any> {
    return await this.usersRepository.createUser(payload);
  }

  async verifyUser(code: IVerrifyConfirmForm): Promise<any> {
    // await this.refreshTokenRepository.createToken(code);
    return await this.usersRepository.verifyUser(code);
  }

  async signin(user: User): Promise<any> {
    return await this.usersRepository.userSignin(user);
  }

  async generateUserToken(code: IVerrifyConfirmForm): Promise<any> {
    return await this.refreshTokenRepository.createToken(code);
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
    return await this.usersRepository.findByEmail(email);
}

async findById(id: string): Promise<User | null> {
  return await this.usersRepository.findById(id);
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

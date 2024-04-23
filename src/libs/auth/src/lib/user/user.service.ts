import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { UserEntity as User, UserEntity } from '../entites';
import * as bcrypt from "bcrypt";
import { validate } from 'class-validator';
import { AuthModel } from "../models";

@Injectable()
export class UserService {
    private saltRounds: number;
    constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

async findByEmailWithPassword(email: string | undefined): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
        where: {
            email,
        },
    });
}

}

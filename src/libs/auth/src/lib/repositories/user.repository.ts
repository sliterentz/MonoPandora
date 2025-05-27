import { BaseRepository } from './base.repository';
import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { FastifyRequest } from 'fastify';
import { FastifyWithEntityManagerRequest } from '../interfaces/fastify-withentitymanager-request.interface';
import { DataSource } from 'typeorm';
import { UserEntity as User } from '../entities';
import { RegisterRequestDTO } from '../dtos/register-request.dto';
import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { VerifyConfirmDTO } from '../dtos/verify-confirm.dto';
// import { LoginRequestDTO } from '../dtos/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import * as bcrypt from "bcryptjs";
import * as dotenv from 'dotenv';

import { PaginationRequest  } from '../interfaces';

dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
    constructor(
      dataSource: DataSource,
      @Inject(REQUEST) req: FastifyWithEntityManagerRequest,
      // @Inject(REQUEST) req: FastifyRequest,
      private jwtService: JwtService,
      @Inject(LoggerKey)
      private logger: Logger
    ) {
        super(dataSource, req);
      }

    async getAllUsers() {
        return await this.getRepository(User).find();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.getRepository(User).findOne({
          where: {
            email,
          },
        });
    }

    async findByUserName(username: string): Promise<User | null> {
      return await this.getRepository(User).findOne({
        where: {
          username,
        },
      });
    }

    async findById(id: string): Promise<User | null> {
      return await this.getRepository(User).findOneOrFail({
        where: {
          id: id
        }
      });
    }

    // Create User
    async createUser(req: RegisterRequestDTO): Promise<User | null> {
        const existingUser = await this.findByEmail(req.email);

        if (existingUser) {
          // Info
          this.logger.info('Register failed', {
            props: {
              request: req.email,
            },
            error: new Error('Email allready taken'),
          });
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.password, salt);
        const confirmToken = Math.floor(100000 + Math.random() * 900000);

        const payload = {
            fullname: req.fullname,
            email: req.email,
            password: hash,
            isSuperUser: req.isSuperUser,
            authConfirmToken: confirmToken,
            isVerified: req.isVerified
        };

        const user = this.getRepository(User).create(payload);
        return await this.getRepository(User).save(user);
    }

    // Create Admin User
    async createUserAdmin(req: CreateUserRequestDTO): Promise<User | null> {
      const existingUser = await this.findByUserName(req.username);

      if (existingUser) {
            // Info
            this.logger.info('Register failed', {
              props: {
                request: req.username,
              },
              error: new Error('Username allready taken'),
            });
      }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.password, salt);
        const confirmToken = Math.floor(100000 + Math.random() * 900000);

        const payload = {
            fullname: req.fullname,
            email: req.email,
            phone: req.phone,
            password: hash,
            isSuperUser: req.isSuperUser,
            authConfirmToken: confirmToken,
            isVerified: req.isVerified,
            username: req.username,
            company: req.company,
            avatarUrl: req.avatarUrl,
        };

        const user = this.getRepository(User).create(payload);
        return await this.getRepository(User).save(user);
    }

    async findByConfirmToken(authConfirmToken: number): Promise<any> {
      try {
        const validUser = await this.getRepository(User).findOne({
          where: {
            authConfirmToken,
            isVerified: false
          },
        });

        if (!validUser) {
           // Info
           this.logger.info('User allready verified', {
            props: {
              request: authConfirmToken,
            },
            error: new Error('Allready verified'),
          });

          return false;
          // throw new NotFoundException('Failed verified',  { cause: new Error(), description: 'User allready verified' });
        }

        return validUser;
      } catch(error) {
        throw new BadRequestException('Verification code has expired or invalid');
      }
    }

    // Verify
    async verifyUser(code: VerifyConfirmDTO): Promise<any> {
      const existingUser = await this.findByConfirmToken(code.authConfirmToken);

      if(!existingUser) {
        return false;
      }

      return await this.getRepository(User).update({ email: existingUser.email }, { isVerified: true, authConfirmToken: code.authConfirmToken })
    }

    async isVerifiedUser(email: string): Promise<any> {
      const foundUser = await this.findByEmail(email);
      if (foundUser && foundUser.isVerified) {
        return foundUser;
      }

      throw new BadRequestException('Please verify your account');
    }

    async userSignin(user: User): Promise<any> {
      try {
        const foundUser = await this.isVerifiedUser(user.email);
        const isRightPassword = await bcrypt.compare(user.password, foundUser?.password);

        if (!isRightPassword) {
          throw new UnauthorizedException('Incorrect username or password');
        }

        const payload = { id: foundUser.id, email: user.email };
        const generatedAccessToken =  await this.jwtService.sign(payload, {
          secret: process.env['JWT_SECRET'], expiresIn: process.env['ACCESS_JWT_EXPIRES_IN'],
        });

        // const isExpired = await this.userService.checkRefreshToken(foundUser.id);

        // if (isExpired) {
        //   const generatedRefreshToken = await this.jwtService.sign(payload, {
        //     secret: process.env['JWT_SECRET'], expiresIn: process.env['REFRESH_JWT_EXPIRES_IN'],
        //   });

        //   await this.userService.refreshUserToken(foundUser.id);
        // }

        return {
          user: [{
            'displayName': foundUser.fullname,
            'email': foundUser.email,
            'role': foundUser.roles,
            'isVerified': foundUser.isVerified,
        }],
          accessToken: generatedAccessToken,
        };

      } catch(error) {
        throw new UnauthorizedException('Invalid credential');
      }

    }

  /**
   * Get users list
   * @param pagination {PaginationRequest}
   * @returns [userEntities: User[], totalUsers: number]
   */
  public async getUsersAndCount(
    pagination: PaginationRequest,
  ): Promise<[userEntities: User[], totalUsers: number]> {
    const {
      skip,
      limit: take,
      params: { search },
    } = pagination;
    const query = this.getRepository(User).createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .leftJoinAndSelect('u.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy('u.createdAt');

    if (search) {
      query.where(
        `
            u.username ILIKE :search
            OR u.first_name ILIKE :search
            OR u.last_name ILIKE :search
            `,
        { search: `%${search}%` },
      );
    }

    return query.getManyAndCount();
  }

    /**
     * find user by email
     * @param email {string}
     * @returns Promise<User>
     */
    async findUserByEmail(email: string): Promise<any> {
      try {
      const result = await this.getRepository(User).createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'r', 'r.status = 1')
      .leftJoinAndSelect('r.permissions', 'rp', 'rp.status = 1')
      .leftJoinAndSelect('u.permissions', 'p', 'p.status = 1')
      .where('u.email = :email', { email })
      .getOne();

      return result;
      } catch(error) {

        throw new BadRequestException('Please verify your account');
      }

    }

  /**
   * find user by username
   * @param username {string}
   * @returns Promise<User>
   */
  async findUserByUsername(username: string): Promise<any> {
    try {
      const result = await this.getRepository(User).createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'r', 'r.active = true')
      .leftJoinAndSelect('r.permissions', 'rp', 'rp.active = true')
      .leftJoinAndSelect('u.permissions', 'p', 'p.active = true')
      .where('u.username = :username', { username })
      .getOne();

      return result;
    } catch(error) {

      throw new BadRequestException('Please verify your account');
    }
  }
}

export default UserRepository;

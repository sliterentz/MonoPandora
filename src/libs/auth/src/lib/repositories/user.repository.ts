import { BaseRepository } from './base.repository';
import { BadRequestException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest, FastifyReply } from 'fastify';
import { DataSource } from 'typeorm';
import { UserEntity as User } from '../entities';
import { RegisterRequestDTO } from '../dtos/register-request.dto';
import { VerifyConfirmDTO } from '../dtos/verify-confirm.dto';
import { LoginRequestDTO } from '../dtos/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import * as bcrypt from "bcrypt";
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
    constructor(
      dataSource: DataSource,
      @Inject(REQUEST) req: FastifyRequest,
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
            grant: req.grant,
            authConfirmToken: confirmToken,
            isVerrified: req.isVerrified
        };

        const user = this.getRepository(User).create(payload);
        return await this.getRepository(User).save(user);
    }

    async findByConfirmToken(authConfirmToken: number): Promise<any> {
      try {
        const validUser = await this.getRepository(User).findOne({
          where: {
            authConfirmToken,
            isVerrified: false
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

      return await this.getRepository(User).update({ email: existingUser.email }, { isVerrified: true, authConfirmToken: code.authConfirmToken })
    }

    async isVerrifiedUser(email: string): Promise<any> {
      const foundUser = await this.findByEmail(email);
      if (foundUser && foundUser.isVerrified) {
        return foundUser;
      }
      
      throw new BadRequestException('Please verify your account');
    }

    async userSignin(user: User): Promise<any> {
      try {
        const foundUser = await this.isVerrifiedUser(user.email);
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
            'role': foundUser.grant,
            'isVerrified': foundUser.isVerrified,
        }],
          accessToken: generatedAccessToken,
        };

      } catch(error) {
        throw new UnauthorizedException('Invalid credential');
      }

    }
}

export default UserRepository;
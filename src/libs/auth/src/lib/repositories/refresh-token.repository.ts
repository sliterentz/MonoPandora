import { BaseRepository } from './base.repository';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { FastifyRequest } from 'fastify';
import { FastifyWithEntityManagerRequest } from '../interfaces/fastify-withentitymanager-request.interface';

import { DataSource, LessThanOrEqual } from 'typeorm';
import { RefreshTokenEntity as RefreshToken, UserEntity as User } from '../entities';
// import { RegisterRequestDTO } from '../dtos/register-request.dto';
import { VerifyConfirmDTO } from '../dtos/verify-confirm.dto';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment-timezone';
import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import * as dotenv from 'dotenv';

dotenv.config();
moment.tz.setDefault("Asia/Jakarta");
// const today = moment();

@Injectable({ scope: Scope.REQUEST })
export class RefreshTokenRepository extends BaseRepository {
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

    async userVerifyCheck(code: number): Promise<User | null> {
      return await this.getRepository(User).findOneOrFail({
        where: {
            authConfirmToken: code,
            isVerified: false
        }
      });
    }

    async userEmailById(userId: string): Promise<User | null> {
      return await this.getRepository(User).findOneOrFail({
        where: {
            id: userId,
            isVerified: false
        }
      });
    }

    async checkTokenExpiredbyUserId(userId: string): Promise<RefreshToken | null> {
      const date = new Date();
      return await this.getRepository(RefreshToken).findOneOrFail({
        where: {
          user_id: userId,
          expiredAt: LessThanOrEqual(date)
        },
        order: {
          createdAt: 'DESC'
        }
      });
    }

    // Create Refresh Token
    async createToken(code: VerifyConfirmDTO): Promise<RefreshToken | null> {
      try {
        moment.tz.setDefault("Asia/Jakarta");
      const existingUser = await this.userVerifyCheck(code.authConfirmToken);

      if (!existingUser) {
          // Info
          this.logger.info('Generate refresh token failed', {
            props: {
              request: code.authConfirmToken,
            },
            error: new Error('Refresh token exist'),
          });
      }

        const payload = { id: existingUser?.id, email: existingUser?.email };
        const generatedToken = await this.jwtService.sign(payload, {
          secret: process.env['JWT_SECRET'], expiresIn: process.env['REFRESH_JWT_EXPIRES_IN'],
        });

      // Decode the JWT to get the payload
        const decodedJWT = await this.jwtService.decode(generatedToken) as { exp: number };

      // Ensure the token has an expiration time
        if (!decodedJWT || !decodedJWT.exp) {
          throw new BadRequestException('Invalid token or no expiration time found');
        }

      // Convert the expiration time to a readable datetime format
      const expirationDateTime = moment.unix(decodedJWT.exp).format('YYYY-MM-DD HH:mm:ss');

        const tokenPayload = {
          token: generatedToken,
          expiredAt: expirationDateTime,
          user_id: existingUser?.id
        };

        const token = await this.getRepository(RefreshToken).create(tokenPayload);
        return await this.getRepository(RefreshToken).save(token);
    } catch (error) {
      throw new BadRequestException('Failed to verified', { cause: 'Failed to verified', description: 'User allready verified' });
    }
  }

  async reCreateToken(userId: string): Promise<RefreshToken | null> {
    try {
      moment.tz.setDefault("Asia/Jakarta");
      const existingUser = await this.userEmailById(userId);

      const payload = { id: existingUser?.id, email: existingUser?.email };
      const generatedToken = await this.jwtService.sign(payload, {
        secret: process.env['JWT_SECRET'], expiresIn: process.env['REFRESH_JWT_EXPIRES_IN'],
      });

    // Decode the JWT to get the payload
      const decodedJWT = await this.jwtService.decode(generatedToken) as { exp: number };

    // Ensure the token has an expiration time
      if (!decodedJWT || !decodedJWT.exp) {
        throw new BadRequestException('Invalid token or no expiration time found');
      }

    // Convert the expiration time to a readable datetime format
    const expirationDateTime = moment.unix(decodedJWT.exp).format('YYYY-MM-DD HH:mm:ss');

      const tokenPayload = {
        token: generatedToken,
        expiredAt: expirationDateTime,
        user_id: existingUser?.id
      };

      const token = await this.getRepository(RefreshToken).create(tokenPayload);
      return await this.getRepository(RefreshToken).save(token);
  } catch (error) {
    throw new BadRequestException('Failed to verified', { cause: 'Failed to verified', description: 'User allready verified' });
  }
}
}

export default RefreshTokenRepository;

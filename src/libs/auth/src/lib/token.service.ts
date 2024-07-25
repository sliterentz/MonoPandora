import { UserRepository } from './repositories/user.repository';
import { Injectable, Logger } from '@nestjs/common';
import { IStatus } from './types/users';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshTokenExpiredException,
  AccessTokenExpiredException,
  InvalidTokenException,
} from './helpers/http-exception.helper';
import { ValidateTokenResponseDto } from './dtos/validate-token-response.dto';
import { TokenDto } from './dtos/token.dto';
import { TokenError } from './types/errors';
import { TokenType } from './types/tokens';
import { JwtPayloadInterface } from './interfaces';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate Auth token(JWT) service for login user
   * @param JwtPayloadInterface {JwtPayloadInterface}
   * @returns TokenDto Returns access and refresh tokens with expiry
   */
  public generateAuthToken(payload: JwtPayloadInterface): TokenDto {
    const accessTokenExpires = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
    const refreshTokenExpires = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
    const tokenType = this.configService.get('TOKEN_TYPE');
    const accessToken = this.generateToken(payload, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenExpires);

    return {
      tokenType,
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  /**
   * Generate Refresh token(JWT) service for generating new refresh and access tokens
   * @param payload {JwtPayloadInterface}
   * @returns  Returns access and refresh tokens with expiry or error
   */
  public generateRefreshToken(refreshToken: string): TokenDto {
    const { id, email } = this.verifyToken(refreshToken, TokenType.RefreshToken);
    return this.generateAuthToken({ id, email });
  }

  /**
   * Verify JWT service
   * @param token JWT token
   * @param type {TokenType} "refresh" or "access"
   * @returns decrypted payload from JWT
   */
  public verifyToken(token: string, type: TokenType) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      if (error instanceof Error) {
        const { name } = error;
        
        if (name == TokenError.TokenExpiredError && type == TokenType.AccessToken) {
          throw new AccessTokenExpiredException();
        }
        
        if (name == TokenError.TokenExpiredError && type == TokenType.RefreshToken) {
          throw new RefreshTokenExpiredException();
        }
      }
      
      throw new InvalidTokenException();
    }
  }

  /**
   * Validate received JWT
   * @param token {string}
   * @returns valid: boolean
   */
  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { id } = this.jwtService.verify(token);
      const user = await this.userRepository.findById(id);
      if (!user || user.status == IStatus.Suspend || user.status == IStatus.Disable) {
        return { valid: false };
      }

      return { valid: !!id };
    } catch (error) {
      Logger.error('Validation token error', error);
      return { valid: false };
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayloadInterface}
   * @param expiresIn {string}
   * @returns JWT
   */
  private generateToken(payload: JwtPayloadInterface, expiresIn: string): string {
    const token = this.jwtService.sign(payload, { expiresIn });
    return token;
  }
}

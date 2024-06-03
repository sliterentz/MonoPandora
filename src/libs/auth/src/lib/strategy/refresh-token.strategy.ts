import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Payload, refreshTokenConfig } from 'src/config';
// import { UserRepository } from '../repository';
import { RefreshTokenEntity as RefreshToken } from '../entities';
// import { AuthDto } from '../dto';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { IAccessTokenPayload } from '../types';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshTokenDTO } from '../dtos/refresh-token.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // async validate(payload: IAccessTokenPayload): Promise<RefreshToken> {
  //     const tokenData =  this.authService.validateToken(payload);
  //
  //     if (!tokenData) {
  //       throw new UnauthorizedException();
  //     }
  //
  //   return tokenData;
  // }
}

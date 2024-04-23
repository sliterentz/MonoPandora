import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_OPTIONS, JWT_SECRET } from "../types/constants";
import { AuthModuleOption } from "../auth-apikey.strategy";
import { JwtPayloadInterface } from '../interfaces';
import { UserEntity } from '../entites';
import { AuthService } from '../auth.service';

export type JwtPayload = { sub: number; username: string };
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_OPTIONS) private readonly config: AuthModuleOption,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'],
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
      return user;
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { AUTH_OPTIONS } from "../types/constants";
// import { AuthModuleOption } from "./auth-apikey.strategy";
import { JwtPayloadInterface } from '../interfaces';
import { UserEntity as User } from '../entities';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { IAccessTokenPayload } from '../types';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// export type JwtPayload = { sub: number; username: string };
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    // @Inject(AUTH_OPTIONS) private readonly config: AuthModuleOption,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: IAccessTokenPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
      return user;
  }
}

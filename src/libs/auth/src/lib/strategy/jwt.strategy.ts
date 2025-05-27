import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { UserEntity as User } from '../entities';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { IAccessTokenPayload, IStatus, ErrorType } from '../types';
import { DisabledUserException, InvalidCredentialsException } from '../helpers';
import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import { request } from 'http';
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    @Inject(LoggerKey)
    private logger: Logger,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
    // @Inject(AUTH_OPTIONS) private readonly config: AuthModuleOption,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: IAccessTokenPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);
    
    if (!user) {
      // Info
      this.logger.info('Get Unathorize Access', {
        props: {
          request: request.toString(), 
          param: this.configService.get<string>('JWT_SECRET'),
        },
        error: new InvalidCredentialsException(),
      });
      throw new InvalidCredentialsException();
    }
    if (user.status == IStatus.Disable) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }
    if (user.status == IStatus.Suspend) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }
      return user;
  }
}

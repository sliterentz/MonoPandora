import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
// import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { UserService } from '../user/user.service';
import { SKIP_AUTH } from '../types/constants';
import { InvalidTokenException } from '../helpers/http-exception.helper';
import { TokenService } from '../token.service';
import { TokenType } from '../types/tokens';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    // private jwtService: JwtService,
    ) {
      super()
    // super({
    //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   ignoreExpiration: false,
    //   secretOrKey: process.env['JWT_SECRET']
    // });
  }

  // override canActivate(context: ExecutionContext) {
  //    const request = context.switchToHttp().getRequest();
  //    const token = this.extractTokenFromHeader(request);

  //   const isPublic = this.reflector.getAllAndOverride('isPublic', [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
  // //
  //   if (isPublic) return true;
  // //
  //   return super.canActivate(context);
  // }

  // private extractTokenFromHeader(request: FastifyRequest): string | undefined {

  //   let accessToken = '';
  //   const tokenSegmen = request.headers.authorization?.split(" ");
  //   if(tokenSegmen) {
  //     accessToken = tokenSegmen[1];
  //   }

  //   return accessToken;
  // }

  /**
   * Verify the token is valid
   * @param context {ExecutionContext}
   * @returns super.canActivate(context)
   */
  override canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [context.getHandler(), context.getClass()]);
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (skipAuth) {
      return true;
    }

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());
    if (!accessToken) {
      throw new InvalidTokenException();
    }

    const payload = this.tokenService.verifyToken(accessToken, TokenType.AccessToken);
    if (!payload) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }

  /**
   * Handle request and verify if exist an error or there's not user
   * @param error
   * @param user
   * @returns user || error
   */
   override handleRequest(error: Error, user: any) {
      if (error || !user) {
        throw new UnauthorizedException();
      }
      return user;
    }
}

// export default JwtAuthGuard;
export default JwtAuthGuard;

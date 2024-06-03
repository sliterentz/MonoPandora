import { ExecutionContext, Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET']
    });
  }

  override canActivate(context: ExecutionContext) {
     const request = context.switchToHttp().getRequest();
     const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
  //
    if (isPublic) return true;
  //
    return super.canActivate(context);
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {

    let accessToken = '';
    const tokenSegmen = request.headers.authorization?.split(" ");
    if(tokenSegmen) {
      accessToken = tokenSegmen[1];
    }
    
    return accessToken;
  }
}

// export default JwtAuthGuard;
export default JwtAuthGuard;

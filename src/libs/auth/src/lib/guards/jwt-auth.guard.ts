import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

   canActivate(context: ExecutionContext) {
     // const request = context.switchToHttp().getRequest();
     // const authHeader = request.headers['authorization'];
     //
     // if (!authHeader) {
     //   throw new UnauthorizedException('JWT token is missing');
     // }
     //
     // const parts = authHeader.split(' ');
     // if (parts.length !== 2 || parts[0] !== 'Bearer') {
     //   throw new UnauthorizedException('Authorization header format is Bearer <token>');
     // }
     //
     // const token = parts[1];
     // const token = this.extractTokenFromHeader(request);
     //
     // try {
     //   this.jwtService.verifyAsync(token);
     // } catch (error) {
     //   throw new UnauthorizedException('Invalid JWT token');
     // }

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
  //
    if (isPublic) return true;
  //
    return super.canActivate(context);
  }
}

// export default JwtAuthGuard;
export default JwtAuthGuard;

import { Body, Controller, Get, Post, Res, Request, UseGuards, Logger, UseInterceptors } from '@nestjs/common';

import { AuthService } from "./auth.service";
import { JwtService } from '@nestjs/jwt';
import { UserEntity as User } from "./entities";
import { IAccessToken, IAuthConfirmToken, IRegisterUserForm } from "./types";
import { Public } from './decorators/public.decorator';
import { JwtStrategy } from './strategy/jwt.strategy'
import { GetUser } from './decorators/user.decorator'
// import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
// import { RefreshTokenDTO } from './dtos/refresh-token.dto';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { FastifyReply, FastifyRequest } from 'fastify';

@Public()
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @UseInterceptors(ResponseInterceptor)
  @Post('/signup')
  async signup(@Body() dto: IRegisterUserForm, @Res() res: FastifyReply) {
    return await this.authService.signup(dto, res);
  }

  @UseInterceptors(ResponseInterceptor)
  @Post('/signin')
  async signin(@Body() user: User, @Res() res: FastifyReply) {
    return await this.authService.signin(user, res);
  }

  @UseInterceptors(ResponseInterceptor)
  @Post('/verify')
  async verify(@Body() dto: IAuthConfirmToken, @Res() res: FastifyReply) {
    return await this.authService.verifyAccount(dto, res);
  }

  @UseGuards(JwtStrategy)
  @Get('/profile')
  async getProfile(@Request() req: FastifyRequest, @GetUser() user: User) {
    return await this.authService.isValidToken(req, user);
  }

  // @UseGuards(RefreshTokenStrategy)
  // @Post('refresh')
  // refreshToken(@GetUser() user: User, @Body() dto: RefreshTokenDTO) {
  //   return this.authService.getRefreshToken(user, dto);
  // }
}

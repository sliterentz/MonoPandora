import { Body, Controller, Get, Post, Res, Request, UseGuards } from '@nestjs/common';

import { AuthService } from "./auth.service";
import { JwtService } from '@nestjs/jwt';
import { UserEntity as User } from "./entities";
import { IAccessToken, IAuthConfirmToken } from "./types";
import { Public } from './decorators/public.decorator';
import { JwtStrategy } from './strategy/jwt.strategy'
import { GetUser } from './decorators/user.decorator'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('/signup')
  async signup(@Body() user: User) {
    return await this.authService.signup(user);
  }

  @Post('/signin')
  async signin(@Body() user: User) {
    return await this.authService.signin(user, this.jwtService);
  }

  @Post('/verify')
  async verify(@Body() dto: IAuthConfirmToken) {
    return await this.authService.verifyAccount(dto)
  }

  @UseGuards(JwtStrategy)
  @Get('/profile')
  async getProfile(@Request() req: IAccessToken, @GetUser() user: User) {
    return await this.authService.isValidToken(req, user);
  }
}

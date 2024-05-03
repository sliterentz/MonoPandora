import { Controller, Get, Post, Render, Res, Body } from '@nestjs/common';

import { AppService } from './app.service';
import { RegisterService } from "../../register/register.service";
import { JwtService } from '@nestjs/jwt';
import { User } from "../entities";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly regService: RegisterService, private jwtService: JwtService) {}

  @Post('/signup')
  async signup(@Body() user: User) {
    return await this.regService.signup(user);
  }

  @Post('/signin')
  async signin(@Body() user: User) {
    return await this.appService.signin(user, this.jwtService);
  }

  @Post('/verify')
  async verify(@Body() body) {
    return await this.regService.verifyAccount(body.authConfirmToken)
  }
}

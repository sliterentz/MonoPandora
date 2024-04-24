import { Controller, Get, Post, Render, Res, Body } from '@nestjs/common';

import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { User } from "../entities";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private jwtService: JwtService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/verify')
  @Render('verify')
  VarifyEmail() { }

  @Post('/signup')
  async signup(@Body() user: User) {
    return await this.appService.signup(user);
  }

  @Post('/signin')
  async signin(@Body() user: User) {
    return await this.appService.signin(user, this.jwtService);
  }
}

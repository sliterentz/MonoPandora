import {Controller, Get, Post, Param, Render, Res, Body, HttpStatus } from '@nestjs/common';

import { RegisterService } from "./register.service";
import { JwtService } from '@nestjs/jwt';
import { User } from "../src/entities";

@Controller()
export class RegisterController {
  constructor(private readonly regService: RegisterService) {}

  @Get('/verify')
  @Render('verify')
  async VerifyEmail() { }

  @Post('/signup')
  async signup(@Body() user: User) {
    return await this.regService.signup(user);
  }

  @Post('/verify')
  async verify(@Body() body) {
    return await this.regService.verifyAccount(body.code)
  }

  @Get('/:id')
  async getOneUser(@Res() response, @Param() param) {
    const user = await this.regService.getOne(param.id)
    return response.status(HttpStatus.CREATED).json({
      user
    })
  }


}

import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from "../src/entities";
import * as bcrypt from "bcrypt";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RegisterService {

  private code;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async signup(user: User): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      const confirmToken =  Math.floor(10000 + Math.random() * 90000);

      const reqBody = {
        fullname: user.fullname,
        email: user.email,
        password: hash,
        grant: user.grant,
        authConfirmToken: confirmToken,
        isVerrified: user.isVerrified
      }
      await this.userRepo.insert(reqBody);
      return true
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async sendConfirmedEmail(user: User) {
    const { email, fullname } = user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to MyBox App! Email Confirmed',
      template: 'confirmed',
      context: {
        fullname,
        email
      },
    });
  }

  async verifyAccount(code: User): Promise<any> {
    try {
      const user = await this.userRepo.findOne({ where: {
        authConfirmToken: code.authConfirmToken
      }});
      if (!user) {
        return new HttpException('Verification code has expired or not found', HttpStatus.UNAUTHORIZED)
      }
      await this.userRepo.update({ email: user.email }, { isVerrified: true, authConfirmToken: code.authConfirmToken })
      await this.sendConfirmedEmail(user)
      return true
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOne(params: FindOneOptions<User> = {}) {
    return this.userRepo.findOne(params)
  }
}

import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { User } from "../entities";

@Injectable()
export class AppService {

  private code;
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    ) {
    this.code = Math.floor(10000 + Math.random() * 90000);
  }
  async signup(user: User): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      const reqBody = {
        fullname: user.fullname,
        email: user.email,
        password: hash,
        grant: user.grant,
        authConfirmToken: "$2b$10$0dmvsX54k9DxGXaFZjIXPOLc0m6Q8cjc3YdLbuseiyfuYyM/j55mi",
        isVerrified: user.isVerrified
      }
      await this.userRepo.insert(reqBody);
      return true
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async signin(user: User, jwtService: JwtService): Promise<any> {
    try {
      const foundUser = await this.userRepo.findOne({ where: { email: user.email }});
      if (foundUser) {
        if (foundUser.isVerrified) {
          const isRightPassword = await bcrypt.compare(user.password, foundUser?.password);

          if (!isRightPassword) {
            throw new BadRequestException('Invalid credentials');
          }
          const payload = { id: user.id, email: user.email };
          return {
            token: jwtService.sign(payload),
          };

        } else {
          return new HttpException('Please verify your account', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
      }
      return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(params: FindOneOptions<User> = {}) {
    return this.userRepo.findOne(params);
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}

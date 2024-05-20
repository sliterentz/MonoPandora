import { BadRequestException, Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from "bcrypt";
import { UserService } from './user/user.service';
import { UserEntity as User } from './entities';
import { JwtPayloadInterface } from './interfaces';
import { AuthModel } from './models';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyConfirmDTO } from './dtos/verify-confirm.dto';
import { ProfileRequestDTO } from './dtos/profile-request.dto';
import { BaseError } from './types/errors';

dotenv.config();

@Injectable()
export class AuthService {
  private code;
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    ) {
    this.code = Math.floor(10000 + Math.random() * 90000);
  }

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
    } catch (error) {
      throw new BaseError({ name: 'EXCEPTIONAL_ERROR', message: 'Internal error exception', cause: HttpStatus.INTERNAL_SERVER_ERROR });
      // return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
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

  async verifyAccount(code: VerifyConfirmDTO): Promise<any> {
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
    } catch (error) {
      throw new BaseError({ name: 'EXCEPTIONAL_ERROR', message: 'Internal error exception', cause: HttpStatus.INTERNAL_SERVER_ERROR });
      // return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
          const payload = { id: foundUser.id, email: user.email };
          const generatedToken = await this.jwtService.sign(payload, {
            secret: process.env['JWT_SECRET'], expiresIn: process.env['JWT_EXPIRES_IN'],
          });

          return {
            user: foundUser,
            accessToken: generatedToken,
          };

        } else {
          return new HttpException('Please verify your account', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
      }
      return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    } catch (error) {
      throw new BaseError({ name: 'EXCEPTIONAL_ERROR', message: 'Internal error exception', cause: HttpStatus.INTERNAL_SERVER_ERROR });
      // return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(payload: JwtPayloadInterface): Promise<User | null> {
    return await this.userService.findById(payload.id);
  }

  async authenticate(payload: AuthModel): Promise<any> {
    const user = await this.userService.findByEmailWithPassword(payload.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isRightPassword = await bcrypt.compare(payload.password, user?.password);

    if (!isRightPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      grant: user.grant,
      fullname: user.fullname,
      accessToken: await this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }

  async isValidToken(token: ProfileRequestDTO, user: User): Promise<any> {
    try {

      const tokenSegmen = token['rawHeaders'][3].split(" ");
      const accessToken = tokenSegmen[1];

      const hasValidAccess = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env['JWT_SECRET']
      });

      if(!hasValidAccess) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const userData = await this.userService.findById(hasValidAccess.id);

      if (!userData) {
        throw new BadRequestException('No user exist');
      }

      const userProfile = {
        'name' : userData.fullname,
        'email': userData.email,
      }

      //
      return userProfile;

    } catch(e) {
      // throw new BaseError({ name: 'UNAUTHORIZED_ERROR', message: 'Unauthorize access', cause: HttpStatus.UNAUTHORIZED });
      throw new UnauthorizedException('Unauthorize access');
    }
  }
}

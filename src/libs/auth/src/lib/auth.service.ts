import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserEntity } from './entities';
import { JwtPayloadInterface } from './interfaces';
import { AuthModel } from './models';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayloadInterface): Promise<UserEntity | null> {
    return await this.userService.findById(payload.id);
  }

  async authenticate(payload: AuthModel): Promise<any> {
    const user = await this.userService.findByEmailWithPassword(payload.email);

    if (!user) {
      throw new BadRequestException();
    }

    const isRightPassword = await bcrypt.compare(payload.password, user?.password);

    if (!isRightPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      grant: user.grant,
      fullname: user.fullname,
      accessToken: await this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
